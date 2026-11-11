# Security — A2Care India Website

> Scope: everything that can be attacked, leaked, or abused in this codebase.
> Read `architecture.md` §5 for the enquiry pipeline context first.

## 1. Attack surface

This is a mostly-static marketing site. The **only writable endpoint** is `POST /api/enquiry`.
Everything else is server-rendered from trusted, code-reviewed TypeScript data modules — there is
no user-generated content, no auth, no sessions, no cookies, no file uploads.

## 2. POST /api/enquiry — defenses in place (src/app/api/enquiry/route.ts)

Order of operations matters; each step is cheap and runs before more expensive work:

| # | Defense | Detail |
|---|---|---|
| 1 | **Rate limiting** | In-memory Map, ~5 submissions / 10 min / IP, with refund-on-storage-failure so our own errors don't burn the visitor's budget. |
| 2 | **Payload size cap** | 64 KB — rejects padded POSTs with 413 before parsing. |
| 3 | **Strict JSON parse** | Malformed body → 400. |
| 4 | **Coercion, not trust** | `coerceEnquiry()` trims strings, strips control characters, clamps lengths to per-field limits. No raw client string is ever persisted as-is. |
| 5 | **Honeypot** | `HONEYPOT_FIELD` from `lib/enquiry.ts`. A filled field = bot → generic 422, never an explanation (no oracle for bot authors). |
| 6 | **Whitelist validation** | `validateEnquiry()` re-runs the *shared* rules server-side. Selects (industry, solution, capacity) are validated against whitelists derived from `data/*` — arbitrary strings cannot be injected as "known" values. |
| 7 | **Filesystem isolation** | Writes only to `data/enquiries.jsonl` via `appendFile` (append-only, one JSON object per line). Path comes from code, not input. Each line is `JSON.stringify`-ed — no newline injection from user fields. |
| 8 | **Log hygiene** | On failure, logs contain only a truncated UUID reference — never request contents, never filesystem paths. |
| 9 | **Runtime pinning** | `export const runtime = 'nodejs'` — deliberately not edge (fs unavailable there). |
| 10 | **No-cache** | `dynamic = 'force-dynamic'`; POST responses are never cached. |
| 11 | **Method discipline** | `GET` returns a helpful 405 with `Allow: POST` — only POST writes anything. |
| 12 | **No autoresponder fiction** | Nothing is ever emailed *to* the visitor; the UI never claims a copy was sent. |

**Forwarding precedence:** webhook (`ENQUIRY_WEBHOOK_URL`, optional bearer `ENQUIRY_WEBHOOK_TOKEN`) → email (`RESEND_API_KEY` + `ENQUIRY_FROM_EMAIL`) → file-only. The file journal is **always** written first, so a remote failure never loses the record — but a remote failure returns 502 so the visitor is never told the team was reached when it wasn't. The webhook URL comes from env (operator-controlled), never from request data.

## 3. Known, documented limitations (do not "fix" silently — escalate/decide)

1. **In-memory rate limiting is per-process.** Multi-instance/serverless deploys each keep their own counters and a restart clears them. It slows scripts; it does not stop them. Real hardening needs a shared store (e.g. Redis) or platform-level WAF/rate rules.
2. **File persistence does not survive serverless.** See the header block in `route.ts`. For Vercel/Netlify/containers-with-ephemeral-fs, configure email or webhook forwarding — the code already supports it via env vars.
3. **`data/enquiries.jsonl` contains personal data** (names, phones, emails, locations). It is already excluded from version control (`.gitignore` ignores `data/` — keep it that way), but still plan appropriate retention & deletion (India DPDP Act / GDPR-minded). It is currently the only record of leads, so it must also be excluded from anything that would publish the filesystem.
4. **No CAPTCHA.** Honeypot + rate limit only. Acceptable for current traffic; revisit if spam arrives via non-honeypot bots.
5. **No CSRF token.** A JSON-POST-only endpoint with no cookies/sessions and no side effects beyond creating a lead has minimal CSRF value; an attacker can only spam the lead file (mitigated by rate limiting). If auth/cookies are ever added, revisit.

## 4. Secrets & configuration

- **All configuration is environment-variable based** and read only via `process.env` at request time inside the route handler: `RESEND_API_KEY`, `ENQUIRY_TO_EMAIL`, `ENQUIRY_FROM_EMAIL`, `ENQUIRY_WEBHOOK_URL`, `ENQUIRY_WEBHOOK_TOKEN`.
- **No secrets exist in the repo.** Nothing is hard-coded except public contact info in `src/lib/site.ts` (phone numbers, email, WhatsApp number — intentionally public, they appear on the site).
- Data that looks sensitive but isn't: coordinates in `site.ts` (published business address), client names in `data/testimonials.ts`.

## 5. Browser-side surface

- **XSS:** React escapes all rendered content; JSON-LD is emitted via `JSON.stringify` of trusted builder output (no user input reaches `dangerouslySetInnerHTML`). Form values are only ever rendered as text nodes, never HTML.
- **Open redirects:** none — all links are internal `next/link` or hard-coded external helpers in `lib/site.ts` (`wa.me`, Google Maps, `tel:`, `mailto:`). `mailto:`/`tel:` hrefs embed only constants or site-authored text.
- **Dependency surface is small:** next, react, react-dom, framer-motion, lenis, lucide-react. No analytics, no third-party scripts, no trackers. A Google Maps iframe embed is the only third-party frame.
- **The enquiry form** client-validates but always defers to the server result; it renders server-provided error messages verbatim as text.

## 6. Transport & headers

- `next.config.ts` sets `Cache-Control: public, max-age=31536000, immutable` **only** on `/media/:path*` (static assets). No other custom headers are configured.
- **Gaps worth adding at the platform/edge level when deploying:** HSTS, `X-Content-Type-Options: nosniff`, a frame policy for the Maps embed, `Referrer-Policy`, and a CSP (needs `frame-src https://www.google.com`). Next's defaults cover basics but a hardened deployment should set these explicitly.

## 7. robots & indexing posture

- `robots.ts` disallows `/api/` and `/media/` for crawlers — the enquiry endpoint and asset folders have nothing to index. (Disallow is advisory, but the endpoint also 405s GETs and rate-limits POSTs.)

## 8. Checklist before going live

- [ ] Choose persistent hosting for `/api/enquiry` **or** set `RESEND_API_KEY` + `ENQUIRY_FROM_EMAIL` / `ENQUIRY_WEBHOOK_URL`.
- [ ] Confirm `data/` stays gitignored (it is today) and is excluded from any deploy that would expose the filesystem.
- [ ] Add platform-level rate limiting/WAF if deploying serverless.
- [ ] Add security headers (HSTS, nosniff, CSP) at the edge/host.
- [ ] Run `npm run typecheck` and `npm run build` — both must pass.
- [ ] Send one real test enquiry end-to-end and confirm it lands in the configured destination.

