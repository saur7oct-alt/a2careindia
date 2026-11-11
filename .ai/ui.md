# UI System — A2Care India Website

> How the visual language works, where its tokens live, and the rules every
> component must follow. Read alongside `architecture.md` §6 (interaction model).

## 1. Design tokens — `src/app/globals.css`

Tailwind **v4 CSS-first** configuration. All tokens are defined in one `@theme` block — there is no `tailwind.config.*`. Components must consume these; **no hard-coded hex in component files** (one documented exception: the form error tone in `EnquiryForm.tsx`, which notes it should switch if `--color-danger` is ever added).

### Palette

| Token | Hex | Role |
|---|---|---|
| `abyss` | `#040f19` | Deepest background (`tone="deeper"`) |
| `navy` | `#071b2b` | Primary page background, light-section text |
| `midnight` | `#0a263d` | Elevated dark surface |
| `electric` | `#00aeef` | Primary accent (links, highlights) |
| `aqua` | `#20d5d2` | Secondary accent (eyebrows, selection, focus outline) |
| `ice` | `#f2f8fa` | Dark-section text, light-section background |
| `steel` | `#8193a0` | Muted/secondary text |
| `charcoal` | `#111b24` | — |
| `hairline-dark` / `hairline-light` | rgba | 1px rules/borders |

Selection: aqua bg / navy text. Focus-visible: 2px aqua outline, offset 3. Global default border color = hairline-dark.

### Typography
- Fonts via `next/font` in `layout.tsx`, exposed as CSS variables:
  - **Space Grotesk** → `--font-space-grotesk` → `--font-display` (all headings)
  - **Inter** → `--font-inter` → `--font-body` (body)
  - **JetBrains Mono** → `--font-jetbrains` → `--font-mono` (references, labels)
- Fluid display sizes as Tailwind v4 `@utility` classes: `display-xl` (clamp 2.55→7rem), `display-lg` (2.1→4.5rem), `display-md` (1.6→2.7rem). Headings get `letter-spacing: -0.02em`, `text-wrap: balance`; paragraphs `text-wrap: pretty`.
- Small technical caption style: the `label` class (used for eyebrows, captions, meta).

### Space / radius / easing
- `--gutter: clamp(1.25rem, 4vw, 5rem)`, `--max-w: 92rem`
- `--radius-panel: 20px` (`rounded-panel`), `--radius-pill: 999px` (`rounded-pill`)
- `--ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1)` — **the one curve for everything** (CSS transitions, Lenis, Framer Motion). Also `--ease-in-out-quart`.

## 2. Structural primitives

### `Section` (`components/ui/Section.tsx`)
Every top-level block uses `<Section>` for rhythm: `tone` (`dark` navy / `deeper` abyss / `light` ice), `bleed` to remove vertical padding, `labelledBy` for a11y. Default padding `py-24 md:py-32 lg:py-40`.
- `Eyebrow` — small technical caption above headings ("05 / Solutions" style, aqua rule line).
- `SectionHeading` — Eyebrow + `LineReveal` h2 (`lines` array = explicit editorial line breaks, `max-w-[22ch]`) + optional `lead` paragraph (`max-w-[62ch]`).
- `WaterLine` — animated `hairline-water` rule between grouped blocks.

### `Cta` (`components/ui/Cta.tsx`)
Single button/link primitive with tones (e.g. `electric`, `outlineLight`), optional magnetic hover, `magnetic={false}` for phone/email rows. Arrow icon via exported `ArrowRight`.

### Other ui primitives
`Accordion` (+ `AnimateHeight`), `Marquee` (uses `marquee-track` + `animate-marquee-left/right`), `MediaFrame` (renders real assets or the designed placeholder for `real: false` slots), `StatCounter`, `Logo`, `Cursor`, `ScrollProgress`, `WhatsAppFloat`, `DecorBackdrop`, `AssetMotif`, `WaterParticles`.

## 3. Motion system (`components/motion/Reveal.tsx`)

Shared easing constant `EASE = [0.16, 1, 0.3, 1]` — mirrors `--ease-out-expo`. Everything respects `useReducedMotion()` (renders static/instant when reduced).

| Export | Use |
|---|---|
| `Reveal` | Scroll-triggered fade + rise (default y 24, once, amount 0.3). `as` prop for div/span/li/p. |
| `Stagger` + `StaggerItem` | Children mount in sequence (default stagger 0.08). |
| `LineReveal` | Display headings revealing one masked line at a time (`y: 108%` → 0). Pass explicit `lines` — break points are editorial decisions. |
| `fadeUp` / `fadeIn` / `maskUp` | Raw variants for bespoke motion. |

## 4. Layout & chrome

- **`SiteNav`** — fixed, 88px desktop / 72px mobile (pages lay heroes against this constant; the Lenis anchor offset is `-92`). Transparent over hero → `glass-dark` after 24px scroll (`useScroll` + `useMotionValueEvent`). Desktop hover menus (delayed 140ms close for pointer bridge, keyboard accessible, `role="menu"`) built from a nav model; the Products menu is generated from `products` data.
- **`MobileMenu`** — full-screen, uses `setScrollLock`.
- **`SiteFooter`**, **`PageHeader`** (inner-page hero), **`Breadcrumbs`**, **`LoaderShell`** (first-paint loader), `JsonLd` (script-tag renderer).
- Body carries a single `grain-layer` overlay (SVG turbulence noise, opacity 0.04, plain alpha — deliberately **no** `mix-blend-mode`, which would force the compositor to re-blend the whole viewport on every scrolled frame) so flat gradients don't look templated.

## 5. Scroll feel (Lenis)

`providers/SmoothScroll.tsx` owns one Lenis instance, published via `lib/lenis.ts`. Rules:
- Fully disabled under `prefers-reduced-motion` → native scrolling.
- Smoothing is tuned with **`lerp: 0.1`**, not `duration` + `easing`. A fixed duration restarts the easing curve from the current value on every wheel event, which reads as input lag; Lenis damps a lerp frame-rate-independently, so 60/90/120Hz all track the same. `easing` is still declared because Lenis only prefers duration+easing over lerp when **both** are set — that is what keeps `scrollToId` / `scrollToTop` animated. **Do not "restore" `duration` here** without re-testing the wheel feel.
- Only wheel/touch is eased; the scroll position itself stays native so `useScroll`, sticky elements and anchors all keep working.
- A global click handler routes `a[href^="#"]` through Lenis (offset `-92`, duration 1.4) and keeps the URL hash honest via `pushState`.
- `setScrollLock(true|false)` is the **single** scroll-lock mechanism (body attr + `lenis.stop/start` or overflow fallback). Inner scrollers use `data-lenis-prevent`.

## 6. Texture & effects utilities (`globals.css` `@utility`)

| Utility | Purpose |
|---|---|
| `glass-dark` | Frosted dark panel (nav menus, cards on dark) |
| `grid-lines` | Fine 64px engineering grid, sparing use |
| `water-sheen` | Low-contrast radial water-caustic gradient layer |
| `text-gradient-water` | electric→aqua gradient clipped text |
| `grain` / `grain-layer` | Film-grain treatment |
| `hairline-water` | Animated meniscus line for section transitions |
| `marquee-track`, `animate-marquee-left/right` | Marquee rows |

Keyframes available: `drift`, `ripple-breathe`, `sheen-slide`, `marquee-left/right`.

## 7. Light vs dark sections

- Dark sections: `bg-navy` or `bg-abyss` with `text-ice`; muted text `text-steel`; opacity syntax like `text-ice/72`, `bg-aqua/[0.08]`.
- Light sections (`tone="light"`): `bg-ice text-navy`; muted `text-navy/68`. The contact form card is light with `fieldBase` inputs (`bg-white/70`, navy text).
- Decorative artwork (`lib/media.ts` `decor`) is generated/abstract only and is never placed where it could be read as documentation of real work — real-work imagery always goes through `MediaFrame`.

## 8. Accessibility conventions

- Skip-to-content link first in body (`#main`).
- Landmarks: `<main id="main">`; sections `aria-labelledby` their headings.
- Focus-visible aqua outline everywhere; the form's success heading is focus-managed (`tabIndex={-1}` + focus on submit).
- Custom cursor and decorative layers are `aria-hidden` / `pointer-events-none`.
- All motion (CSS + Framer + Lenis + video autoplay per `autoplayPolicy`) honours `prefers-reduced-motion`; video never autoplays with sound or on metered connections.
- Menus: `role="menu"` / `menuitem`, `aria-expanded`, delayed-close only for pointer, instant for keyboard.

## 9. Adding a new section — recipe

1. Create `src/components/sections/MySection.tsx` (server component if no interactivity).
2. Wrap content in `<Section id="..." tone="dark|deeper|light" labelledBy={headingId}>`.
3. Use `SectionHeading` (with explicit `lines`) + `Eyebrow`; reveal with `Reveal`/`Stagger`; media via `MediaFrame` + a slot in `lib/media.ts`.
4. Pull all copy from `src/data/*` or `lib/site.ts` — no inline marketing claims, no unverified numbers.
5. Compose it in the page (`src/app/page.tsx` order matters — it reads as a narrative).
6. If it's a top-level nav destination, update `src/app/sitemap.ts` and the nav model in `SiteNav.tsx`.

