/**
 * POST /api/enquiry — the only write path for project enquiries.
 *
 * ═══════════════════════════════════════════════════════════════════════════════════
 * WHERE AN ENQUIRY ACTUALLY GOES  (read this before going live)
 * ═══════════════════════════════════════════════════════════════════════════════════
 * Right now it is appended as one JSON line to `data/enquiries.jsonl` under the project
 * root. That is the honest state of this environment: there is no database, no SMTP
 * password and no CRM token here, and the brief forbids pretending otherwise.
 *
 * ⚠  FILE STORAGE DOES NOT SURVIVE A SERVERLESS / EDGE DEPLOYMENT. Anything running the
 *    handler on ephemeral filesystems (Vercel serverless functions, Netlify functions,
 *    Cloudflare, a container that restarts) can accept a submission and then lose the
 *    file. Either deploy this to a persistent Node server with a mounted volume, or point
 *    the handler at a real destination below. `export const runtime = 'nodejs'` is set on
 *    purpose — do not move this route to the edge runtime; `node:fs` is not available there.
 *
 * TO A REAL INBOX — set these three env vars and nothing else changes:
 *    RESEND_API_KEY=re_...              # enables the Resend path (uses fetch, no SDK)
 *    ENQUIRY_TO_EMAIL=projects@a2careindia.com   # defaults to site.email if unset
 *    ENQUIRY_FROM_EMAIL=A2Care Website <on your verified domain>
 *    Resend needs a verified domain before `ENQUIRY_FROM_EMAIL` will send. Until
 *    `RESEND_API_KEY` exists the handler silently keeps using the file journal.
 *    (Plain SMTP instead: swap `deliverByEmail` for an SMTP client of your choice — the
 *    call site, the payload shape and the failure semantics stay the same.)
 *
 * TO A CRM / SHEET / WEBHOOK:
 *    ENQUIRY_WEBHOOK_URL=https://...    # POSTs the JSON record, takes priority over email
 *    ENQUIRY_WEBHOOK_TOKEN=...          # optional, sent as `Authorization: Bearer ...`
 *
 * Precedence: webhook → email → file. The file journal is always written regardless, so a
 * remote failure never loses the record — but a remote failure does return `ok: false`,
 * because the visitor must not be told their enquiry reached the team when it did not.
 *
 * No secrets are read from anywhere except `process.env`. Nothing is ever emailed back to
 * the visitor: there is no autoresponder, and an unverified "we've sent you a copy" would
 * be exactly the kind of fiction this project rules out.
 * ═══════════════════════════════════════════════════════════════════════════════════
 */

import { appendFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import {
  HONEYPOT_FIELD,
  coerceEnquiry,
  enquiryLines,
  validateEnquiry,
  hasErrors,
  type EnquirySuccess,
  type EnquiryValues,
} from '@/lib/enquiry';
import { site } from '@/lib/site';

/** File writes need Node. Never set this route to the edge runtime. */
export const runtime = 'nodejs';
/** Every request is a mutation; caching a POST endpoint is meaningless and unsafe. */
export const dynamic = 'force-dynamic';

/* ------------------------------------------------------------------ *
 * Rate limiting
 * ------------------------------------------------------------------ *
 * Small in-memory bucket: ~5 submissions per 10 minutes per IP.
 *
 * HONEST LIMITATION: this Map lives inside ONE Node process. On a multi-instance or
 * serverless deployment every instance keeps its own counters, and a restart clears them,
 * so it slows a script down but does not stop a distributed one. Before real traffic,
 * replace it with the hosting platform's edge rate limiting (Vercel WAF / Netlify
 * /rate-limit / Cloudflare rules) or a shared store such as Upstash Redis
 * (`@upstash/ratelimit` sliding window) and keep this only as a second line of defence.
 */
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX_HITS = 5;
const hitsByIp = new Map<string, number[]>();

function clientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const firstHop = forwarded?.split(',')[0]?.trim();
  // An absent header (direct Node server, or a proxy that strips it) shares one bucket.
  return firstHop || request.headers.get('x-real-ip')?.trim() || 'unknown-client';
}

function rateLimited(ip: string, now: number): boolean {
  const cutoff = now - RATE_WINDOW_MS;
  const recent = (hitsByIp.get(ip) ?? []).filter((at) => at > cutoff);

  if (recent.length >= RATE_MAX_HITS) {
    hitsByIp.set(ip, recent);
    return true;
  }

  recent.push(now);
  hitsByIp.set(ip, recent);

  // Opportunistic sweep so a long-lived process cannot grow the map without bound.
  if (hitsByIp.size > 500) {
    for (const [key, times] of hitsByIp) {
      const alive = times.filter((at) => at > cutoff);
      if (alive.length === 0) hitsByIp.delete(key);
      else hitsByIp.set(key, alive);
    }
  }

  return false;
}

/** Undo the counter's hit when the failure was ours (storage), not the visitor's. */
function refundHit(ip: string, now: number): void {
  const times = hitsByIp.get(ip);
  if (!times) return;
  const index = times.lastIndexOf(now);
  if (index !== -1) times.splice(index, 1);
  if (times.length === 0) hitsByIp.delete(ip);
}

/* ------------------------------------------------------------------ *
 * Responses
 * ------------------------------------------------------------------ */

const NO_STORE = { 'Cache-Control': 'no-store' } as const;

function json(status: number, body: unknown, extraHeaders: HeadersInit = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Cache-Control': 'no-store', 'Content-Type': 'application/json', ...extraHeaders },
  });
}

const failure = (status: number, error: string, fields?: Record<string, string>) =>
  json(status, { ok: false, error, ...(fields ? { fields } : {}) });

/* ------------------------------------------------------------------ *
 * Storage
 * ------------------------------------------------------------------ */

/** Overridable so a container image can point at a mounted volume instead of the repo. */
const STORE_DIR = process.env.ENQUIRY_STORE_DIR ?? path.join(process.cwd(), 'data');
const STORE_FILE = path.join(STORE_DIR, 'enquiries.jsonl');

export type StoredEnquiry = {
  id: string;
  submittedAt: string;
  source: 'website';
} & EnquiryValues;

async function appendToJournal(record: StoredEnquiry): Promise<void> {
  await mkdir(STORE_DIR, { recursive: true });
  // JSON Lines: one record per line, so the file tails cleanly and appends never rewrite it.
  await appendFile(STORE_FILE, `${JSON.stringify(record)}\n`, 'utf8');
}

async function deliverToWebhook(record: StoredEnquiry): Promise<boolean> {
  const url = process.env.ENQUIRY_WEBHOOK_URL;
  if (!url) return false;

  const token = process.env.ENQUIRY_WEBHOOK_TOKEN;
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(record),
      signal: AbortSignal.timeout(8000),
    });
    return response.ok;
  } catch {
    // Timeout / DNS / non-2xx all land here. Never log the record: it is the visitor's PII.
    return false;
  }
}

async function deliverByEmail(record: StoredEnquiry): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.ENQUIRY_FROM_EMAIL;
  if (!apiKey || !from) return false;

  const to = process.env.ENQUIRY_TO_EMAIL ?? site.email;
  const rows = enquiryLines(record)
    .map(({ label, value }) => `<p><strong>${label}:</strong> ${escapeHtml(value)}</p>`)
    .join('');

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from,
        to: [to],
        // Reply-To the enquirer, so "Reply" in the inbox goes straight back to them.
        // (`reply_to` is the field Resend's REST reference lists; rename to `replyTo` if a
        // newer SDK build rejects it — the rest of the payload is unchanged.)
        reply_to: record.email,
        subject: `Project enquiry — ${record.solution} (${record.id.slice(0, 8)})`,
        html: `<h2>Website enquiry ${escapeHtml(record.id)}</h2>${rows}`,
      }),
      signal: AbortSignal.timeout(10000),
    });
    return response.ok;
  } catch {
    return false;
  }
}

/** The only escaping helper the email body needs; the file journal stores raw text by design. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/\n/g, '<br />');
}

/* ------------------------------------------------------------------ *
 * Handlers
 * ------------------------------------------------------------------ */

const FALLBACK_HINT = 'Please call or WhatsApp A2Care India using the numbers on this page.';

export async function POST(request: Request) {
  const now = Date.now();
  const ip = clientIp(request);

  // 1 — Parse defensively. A malformed body is a 400 with a structured message, not a stack.
  let bodyText: string;
  try {
    bodyText = await request.text();
  } catch {
    return failure(400, 'The request body could not be read.');
  }

  if (bodyText.length === 0) return failure(400, 'No enquiry data was received.');
  // 64 KB is far beyond anything this form can produce; it stops a padded POST.
  if (bodyText.length > 65_536) return failure(413, 'The submission is larger than this form accepts.');

  let parsed: unknown;
  try {
    parsed = JSON.parse(bodyText);
  } catch {
    return failure(400, 'The submission could not be read. Expected a JSON body.');
  }

  // 2 — Coerce to the typed shape (trim, strip control characters, clamp lengths), then
  // reject the honeypot. A filled honey token means a bot: answer generically, never explain.
  const { values, honeypot } = coerceEnquiry(parsed);
  if (honeypot.length > 0) {
    return failure(422, 'The submission could not be accepted.');
  }

  // 3 — Rate limit before spending any work on validation or IO.
  if (rateLimited(ip, now)) {
    return failure(
      429,
      'Too many enquiries from this connection in the last 10 minutes. Please wait a little, or use phone or WhatsApp.',
    );
  }

  // 4 — Authoritative validation. The client runs the same rules for speed; this run decides.
  const errors = validateEnquiry(values);
  if (hasErrors(errors)) {
    return json(422, { ok: false, error: 'Some fields need attention before this can be sent.', fields: errors });
  }

  // 5 — Persist. File journal first, so a remote forwarding failure never loses the enquiry.
  const record: StoredEnquiry = {
    id: randomUUID(),
    submittedAt: new Date().toISOString(),
    source: 'website',
    ...values,
  };

  try {
    await appendToJournal(record);
  } catch {
    // Do not burn the visitor's rate-limit budget for our own storage failure.
    refundHit(ip, now);
    // The filesystem error may contain paths and permissions detail — keep it out of the body,
    // and keep the enquiry contents out of the log.
    console.error('[enquiry] journal write failed', { reference: record.id.slice(0, 8) });
    return failure(500, `The enquiry could not be recorded on the server. ${FALLBACK_HINT}`);
  }

  // 6 — Best-effort forwarding when a real destination is configured.
  const webhookConfigured = Boolean(process.env.ENQUIRY_WEBHOOK_URL);
  const emailConfigured = Boolean(process.env.RESEND_API_KEY && process.env.ENQUIRY_FROM_EMAIL);

  if (webhookConfigured && !(await deliverToWebhook(record))) {
    console.error('[enquiry] webhook delivery failed', { reference: record.id.slice(0, 8) });
    return failure(
      502,
      `Your enquiry was recorded but could not be forwarded to the team. ${FALLBACK_HINT}`,
    );
  }

  if (!webhookConfigured && emailConfigured && !(await deliverByEmail(record))) {
    console.error('[enquiry] email delivery failed', { reference: record.id.slice(0, 8) });
    return failure(
      502,
      `Your enquiry was recorded but could not be emailed to the team. ${FALLBACK_HINT}`,
    );
  }

  return json(201, { ok: true, reference: record.id } satisfies EnquirySuccess);
}

/**
 * A curious visitor (or a crawler) hitting the URL directly gets a plain answer instead of
 * a router error. Only POST writes anything.
 */
export function GET() {
  return json(
    405,
    {
      ok: false,
      error:
        'This endpoint accepts POST requests only. It records project enquiries sent from the contact form at /contact — send one there, or call / WhatsApp / email A2Care India using the details on that page.',
    },
    { Allow: 'POST' },
  );
}
