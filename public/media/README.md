# Media drop folder

This is where A2Care's real photography and footage goes. Nothing here is decorative —
every folder maps to a slot on the site, and each slot is currently showing designed
stand-in artwork because the real asset has not been supplied yet.

## How to publish a real asset

1. Drop the file into the folder named after the slot, keeping the name in `src`.
2. Open `src/lib/media.ts`, find that slot id, set `real: true` and point `src` at the file.
3. Rebuild. The stand-in disappears automatically — no component changes needed.

```ts
'project.pantnagar-ro-5000': slot('project.pantnagar-ro-5000', {
  src: '/media/project.pantnagar-ro-5000/plant-01.jpg',
  real: true,          // ← the only flag that matters
  alt: '5000 LPH industrial RO plant, food processing unit, Pantnagar',
}),
```

## Folder ↔ section map

| Folder | Appears in |
| --- | --- |
| `hero.reel/` | Opening cinematic hero (video + `poster.jpg`) |
| `story.raw/` … `story.treated/` | Scroll-driven raw-water-to-pure-water sequence |
| `product.industrial-ro/` … `product.chillers/` | Solutions cards and the seven product pages |
| `project.*` | Project portfolio and each case-study page |
| `about.works/` | Company introduction editorial image |
| `sustainability.nature/` | Sustainability closing visual |
| `cta.band/` | Closing call-to-action background video |
| `decorative/` | Generated artwork, never presented as company work. `hero-drink.mp4` is the scroll-scrubbed figure beside the hero headline (mounted by `<HeroDrinker>`); the two water textures are available to `<DecorBackdrop>`, which no section mounts today. |

## Formats the site expects

- **Still**: 1600–2400px wide, JPEG or WebP, quality 80. The build emits AVIF/WebP
  automatically through `next/image`, so do not pre-convert.
- **Hero / CTA video**: 1920×1080, 30–60s loop, 2–4 Mbps, `muted`, no burned-in text.
  Provide `hero.mp4` plus a `poster.jpg`. Playback is always muted and `playsInline`,
  and is skipped for visitors who ask for reduced motion or data saving.
- **Project photos**: landscape 3:2 preferred. Include more than one per site — the
  case-study pages have a gallery.
- **Scrubbed video** (`decorative/hero-drink.mp4`): `<HeroDrinker>` seeks this frame by
  frame from scroll position, so it must be encoded for cheap seeking — no audio track,
  `+faststart`, and a keyframe every 15 frames:
  `ffmpeg -i in.mp4 -an -c:v libx264 -preset slow -crf 30 -g 15 -keyint_min 15 -sc_threshold 0 -movflags +faststart out.mp4`.
  Keep the beats in order (look away → turn → raise → drink → lower); scroll position maps
  linearly onto clip time, so moving a beat means re-cutting the clip, not the component.

## Two rules the build enforces in spirit

1. Never place a licensed or generated image in a `project.*` or `product.*` slot. Those
   slots are presented as A2Care's own work, and only genuine site photography belongs
   there. `decorative/` is the only place non-company artwork lives, and it is never
   captioned as an installation.
2. Client logos are not in this folder. Real logo files need written authorisation from
   each organisation first — until then the trusted-by band shows typographic wordmarks.

## Testimonial text

The customer quotes live in `src/data/testimonials.ts` and are reproduced verbatim from
the published site. They are records of what people said, not copy to be polished.
