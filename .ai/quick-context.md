# Quick Context — A2Care India Website

> **Start here.** 60-second orientation before touching any code.
> Deep dives: `architecture.md` (structure & flows) · `security.md` · `ui.md` (design system).

## What is this?

Marketing + lead-gen website for **A2Care India**, an industrial water treatment manufacturer (RO plants, ETP/STP, chemical dosing, industrial chillers) in Rudrapur, Uttarakhand, India. Live domain: `https://www.a2careindia.com`.

## Stack (30 seconds)

- **Next.js 15 App Router + React 19 + TypeScript** — every marketing page is statically rendered from typed data modules. No CMS, no database, no auth.
- **Tailwind CSS v4** — tokens live in `src/app/globals.css` `@theme` (no config file).
- **Framer Motion + Lenis** — reveals + smooth scroll, all reduced-motion aware.
- **One API route:** `POST /api/enquiry` (Node runtime) — the only write path.

## The 5 files that matter most

| File | Why |
|---|---|
| `src/lib/site.ts` | **All company facts** (phones, address, WhatsApp, hours, stats). Change here → whole site updates. |
| `src/data/products.ts` / `projects.ts` | Catalogue + portfolio. Drives nav menus, dynamic routes, sitemap, form dropdowns. |
| `src/lib/enquiry.ts` | Shared enquiry contract — validation & option lists used by BOTH the browser form and the server route. Never duplicate rules elsewhere. |
| `src/lib/media.ts` | Media manifest with a `real: true/false` honesty flag — placeholders are rendered deliberately, stock photos must never fake company work. |
| `src/app/api/enquiry/route.ts` | The only stateful endpoint. Read its header comment before deploying. |

## How an enquiry flows

`CapacityTool` (optional assistant) → CustomEvent hand-off → `EnquiryForm` (client validation) → `POST /api/enquiry` → rate limit → honeypot → coerce → server re-validation → append to `data/enquiries.jsonl` → best-effort forward to webhook or Resend email (env vars: `ENQUIRY_WEBHOOK_URL`, `RESEND_API_KEY`, `ENQUIRY_FROM_EMAIL`) → success screen with reference + prefilled WhatsApp.

## Page inventory

- `/` — 15 narrative sections (Hero → WaterStory → TreatmentExplorer → … → ContactSection)
- `/about` `/solutions` `/products` (+`/[slug]`) `/projects` (+`/[slug]`) `/industries` `/contact`
- `/privacy-policy` `/terms` + custom 404
- `robots.ts` + `sitemap.ts` (auto-derived from data)

## Rules an AI editor must follow

1. **Content lives in `src/data/*` and `lib/site.ts`** — never hard-code copy/facts in components.
2. **Enquiry rules live only in `lib/enquiry.ts`** — client and server both import them.
3. **Never publish unverified claims** — `Spec.verified`, `faqs.awaitingCompanyInput`, and the SEO builders exist to keep schema honest (no fake ratings/awards).
4. **No stock imagery posing as company work** — use `MediaFrame` with `real: false` placeholders.
5. **Design tokens only** — no hard-coded hex; one easing curve `[0.16, 1, 0.3, 1]` everywhere; honour `prefers-reduced-motion`.
6. **Server is authoritative** for validation; never trust client payloads.
7. **Don't move the enquiry route to edge runtime** (`node:fs` needed).
8. New top-level section → use `Section` + `SectionHeading`; new product/project → append to its data file (everything else updates automatically).

## Verify your work

```bash
npm run typecheck   # tsc --noEmit — must pass
npm run build       # full SSG build — must pass
```

(No test suite or linter exists; these two are the only gates.)

## Deployment gotcha (read once)

`data/enquiries.jsonl` writes **do not survive serverless/ephemeral filesystems**. For production: deploy on a persistent Node server, or set the env vars above to forward enquiries by email/webhook — zero code changes needed. See `security.md` §8 for the go-live checklist.
