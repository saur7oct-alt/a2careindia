# Architecture — A2Care India Website

> This document is the deep structural reference. Start with `.ai/quick-context.md`.
> Companion docs: `security.md` (enquiry endpoint hardening), `ui.md` (design system).

## 1. What this project is

A production **marketing + lead-generation website** for **A2Care India** (industrial water treatment manufacturer, Rudrapur, Uttarakhand, India). It is a **content-driven static site with one write path** (the enquiry API). There is **no database, no CMS, no auth** — all content lives in typed TypeScript data modules under `src/data/`.

- **Framework:** Next.js 15 (App Router) + React 19, TypeScript strict
- **Styling:** Tailwind CSS v4 (CSS-first `@theme` tokens in `src/app/globals.css`), no `tailwind.config.*`
- **Animation:** Framer Motion 12 (+ Lenis 1.3 for smooth scroll)
- **Icons:** lucide-react
- **Runtime:** Node.js (required for the enquiry route's `node:fs` writes)

## 2. Directory map

```
E:\Web App\
├── next.config.ts            # strict mode, AVIF/WebP images, immutable cache for /media/*
├── scripts/build-og.mjs      # authoring-time OG image renderer (sharp) — not a runtime route
├── data/enquiries.jsonl      # enquiry journal (see security.md — dev-only persistence)
├── public/
│   ├── media/<slot>/         # real company assets (currently stand-ins, see media.ts)
│   └── og/                   # generated social share cards
└── src/
    ├── app/                  # App Router routes (see §3)
    ├── components/
    │   ├── forms/            # EnquiryForm (client)
    │   ├── layout/           # SiteNav, SiteFooter, MobileMenu, PageHeader, Breadcrumbs, JsonLd, LoaderShell
    │   ├── motion/           # Reveal, Stagger, LineReveal (shared Framer Motion primitives)
    │   ├── providers/        # SmoothScroll (Lenis provider)
    │   ├── sections/         # one component per homepage/marketing section
    │   └── ui/               # generic primitives: Section, Cta, Accordion, MediaFrame, Marquee, Cursor...
    ├── data/                 # ALL site content: content.ts, products.ts, projects.ts,
    │                         #   industries.ts, faqs.ts, testimonials.ts
    └── lib/                  # site.ts (company facts), enquiry.ts (contract), seo.ts,
                              #   media.ts (asset manifest), lenis.ts, cn.ts

## 3. Routes (src/app)

| Route | Type | Notes |
|---|---|---|
| `/` | Server page | Composes 15 `<Section>` components in order (Hero → … → ContactSection). Emits FAQ + Service JSON-LD. |
| `/about`, `/solutions`, `/products`, `/projects`, `/industries`, `/contact` | Server pages | Marketing pages; `/contact` embeds `EnquiryForm`. |
| `/products/[slug]`, `/projects/[slug]` | Dynamic SSG | `generateStaticParams()` from `productSlugs` / `projectSlugs`; `generateMetadata()` per item; `notFound()` on miss. |
| `/privacy-policy`, `/terms` | Static | Legal pages. |
| `not-found.tsx` | — | Custom 404. |
| `/api/enquiry` | **Route handler, POST only** | The single write path. `runtime = 'nodejs'`, `dynamic = 'force-dynamic'`. See §5 + security.md. |
| `robots.ts`, `sitemap.ts` | Metadata routes | robots disallows `/api/` and `/media/`; sitemap enumerates top pages + all product/project slugs + legal pages. |
| `layout.tsx` | Root | Fonts (Space Grotesk / Inter / JetBrains Mono via `next/font`), org JSON-LD, SiteNav/Footer, WhatsAppFloat, ScrollProgress, Cursor, LoaderShell, grain layer, skip link. |
| `globals.css` | — | Design tokens (`@theme`), display-type `@utility` helpers, keyframes, global reduced-motion kill switch. |

## 4. Data layer — the most important convention

**All copy and facts live in `src/data/*.ts` and `src/lib/site.ts`. Pages render from these; nothing is hard-coded in components.**

- `lib/site.ts` — single source of truth for company facts: name, address, phones, WhatsApp, email, hours, socials, stats, certification. Exports helpers `telHref`, `mailHref`, `whatsappHref`, `mapsHref`. **Change a phone number here and the whole site follows.**
- `data/products.ts` — `Product[]` (slug, lede, longDescription, capacityLabel, highlights, applications, specs with `verified` flag, FAQs, mediaId, meta). Also exports `productSlugs`, `getProduct`.
- `data/projects.ts` — real delivered projects (slug, location, state, capacity, plantType, category, industry). Also `projectSlugs`, `getProject`.
- `data/industries.ts`, `data/faqs.ts` (with `awaitingCompanyInput` flag), `data/testimonials.ts`, `data/content.ts` (narrative copy, `storyFrames` for the scroll story).
- `lib/media.ts` — **media manifest**. Every visual slot declares `real: true|false`. `false` slots render a designed technical placeholder via `<MediaFrame>`; the project deliberately refuses to present stock imagery as company work. To ship real assets: drop files in `public/media/<slot>/`, flip `real: true`, rebuild.

**Integrity rules baked into the data model (do not violate when editing):**
- `Spec.verified: false` = needs company confirmation before it can be published as fact.
- `capacityBands` in `lib/enquiry.ts` are derived strictly from published product ranges — never add a band the company hasn't published.
- SEO/JSON-LD builders omit unverified claims (no aggregateRating, no awards).

```

## 5. The enquiry pipeline (the only stateful flow)

```
CapacityTool (interactive assistant, optional)
   │  publishCapacitySelection()  → window CustomEvent 'a2care:capacity-enquiry'
   │                              + module-level pending queue in lib/enquiry.ts
   ▼
EnquiryForm ('use client', src/components/forms/EnquiryForm.tsx)
   │  subscribes, prefills whitelisted fields only (prefillFromCapacity)
   │  client-side validation via shared lib/enquiry.ts rules
   │  honeypot field + POST /api/enquiry (JSON)
   ▼
POST /api/enquiry (src/app/api/enquiry/route.ts)
   1. rate limit (in-memory Map, ~5 req / 10 min / IP)
   2. size cap 64 KB, JSON parse
   3. coerceEnquiry (trim, strip control chars, clamp) → honeypot check (silent 422)
   4. validateEnquiry — authoritative server re-run of the same shared rules
   5. persist → append JSON line to data/enquiries.jsonl (always written first)
   6. best-effort forward: ENQUIRY_WEBHOOK_URL → else RESEND_API_KEY email
      (webhook → email → file precedence; file always written; remote failure = 502, not success)
   ▼
Success screen: short reference (UUID prefix), WhatsApp prefilled with enquiry text
```

`lib/enquiry.ts` is the **shared contract**: field definitions, option lists, validation, coercion, response types — imported by both browser and server so rules can never drift. It imports nothing from React/Next/Node, so it is safe in both runtimes.

**Deployment honesty (documented in the route header):** the JSONL file does not survive serverless/ephemeral filesystems. For production either use a persistent Node server or set `RESEND_API_KEY` + `ENQUIRY_FROM_EMAIL` (email) and/or `ENQUIRY_WEBHOOK_URL` (+ optional `ENQUIRY_WEBHOOK_TOKEN`). No code changes are needed — env vars only.

## 6. Client-side interaction model

- **Scroll:** `providers/SmoothScroll.tsx` creates one Lenis instance and publishes it via `lib/lenis.ts` (`getLenis`, `scrollToId`, `scrollToTop`, `setScrollLock`). Disabled entirely under `prefers-reduced-motion`; native fallback everywhere else. Anchor clicks are intercepted globally and routed through Lenis with `-92px` nav offset, URL kept honest via `history.pushState`.
- **Reveals:** `components/motion/Reveal.tsx` exports `Reveal`, `Stagger`/`StaggerItem`, `LineReveal` (masked line-by-line headings). One shared easing constant `EASE = [0.16, 1, 0.3, 1]` (matches `--ease-out-expo`). All respect `useReducedMotion`.
- **Chrome:** `SiteNav` (transparent → `glass-dark` after 24px scroll, desktop mega-menus with delayed close, `MobileMenu`), `WhatsAppFloat`, `ScrollProgress`, custom `Cursor`, `LoaderShell`.
- **Scroll lock:** single mechanism — `data-scroll-lock` body attribute read by both SmoothScroll and `setScrollLock`.

## 7. SEO architecture

- `lib/seo.ts`: `buildMetadata()` (canonical, OG, Twitter, `en_IN` locale) + JSON-LD builders: `organizationSchema` (rendered server-side in root layout), `serviceSchema`, `productSchema`, `breadcrumbSchema`, `faqSchema`.
- Every page passes explicit `meta.title`/`meta.description` from its data module.
- `robots.ts` + `sitemap.ts` are derived from the data modules — adding a product/project automatically updates the sitemap.
- OG images are **pre-rendered** by `scripts/build-og.mjs` (sharp) into `public/og/` — no runtime ImageResponse route.

## 8. How to change things (AI cheat sheet)

| Task | Do this |
|---|---|
| Update company info (phone, address, hours) | Edit `src/lib/site.ts` only. |
| Add a product | Append to `src/data/products.ts` (all fields incl. `mediaId`, `meta`). Nav menu, sitemap, form options, enquiry capacity bands update automatically. Add its media slot in `lib/media.ts`. |
| Add a project | Append to `src/data/projects.ts`. |
| Change copy in a homepage section | Edit the relevant `src/components/sections/*.tsx` or `src/data/content.ts`. |
| Ship a real photo/video | Put file in `public/media/<slot>/`, set `real: true` in `lib/media.ts`. |
| Change enquiry fields/rules | Edit **only** `src/lib/enquiry.ts` — both client and server follow. |
| Add a page | New folder under `src/app`, use `PageHeader` + `Section` + `buildMetadata`, add to sitemap. |
| Rebuild OG image | `node scripts/build-og.mjs` (needs sharp). |

## 9. Commands

```bash
npm run dev        # next dev
npm run build      # next build (all pages SSG)
npm run start      # next start
npm run typecheck  # tsc --noEmit
node scripts/build-og.mjs   # regenerate social cards (optional, needs sharp)
```

No test suite, no linter config, no CI — `typecheck` is the only automated gate.

## 10. Invariants — do not break

1. Server is authoritative for enquiry validation; never trust the client copy.
2. Never move `/api/enquiry` to the edge runtime (`node:fs` writes).
3. Never present non-real media as company work (`media.ts` `real` flag + `MediaFrame`).
4. Never publish an unverified spec/claim (the `verified` flags and SEO builders exist for this).
5. All colour/typography through `@theme` tokens — no hard-coded hex in components (one documented exception: the form's error tone in `EnquiryForm.tsx`).
6. Every animation honours `prefers-reduced-motion`.

