'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { MediaFrame } from '@/components/ui/MediaFrame';
import { WaterParticles } from '@/components/ui/WaterParticles';
import { cn } from '@/lib/cn';

/**
 * Hero backdrop — the layer stack behind the opener.
 *
 * No footage has been supplied, so `hero.reel` renders its designed stand-in plate:
 * `<MediaFrame>` never lets artwork read as an A2Care installation photograph. What the
 * loop would normally provide — depth and movement — is rebuilt here in layers: a very
 * slow scale/drift on the plate, caustic sheen, an engineering grid faded at the edges,
 * and a low-opacity bubble field held well under the text's contrast budget.
 */
export function HeroBackdrop({ className }: { className?: string }) {
  const reduced = useReducedMotion();

  return (
    <div className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}>
      {/* 1 — Plate. Starts already scaled past 1 so the drift can never expose an edge. */}
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.015 }}
        animate={
          reduced
            ? { scale: 1.015 }
            : { scale: [1.015, 1.06, 1.02], x: [0, -10, 0], y: [0, -12, 0] }
        }
        transition={
          reduced
            ? { duration: 0 }
            : { duration: 22, repeat: Infinity, ease: 'easeInOut', times: [0, 0.55, 1] }
        }
      >
        <MediaFrame slotId="hero.reel" className="absolute inset-0 h-full w-full" priority sizes="100vw" />
      </motion.div>

      {/* 2 — Fine engineering grid, masked out toward every edge. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 grid-lines opacity-60 [mask-image:radial-gradient(125%_100%_at_50%_28%,#000_8%,transparent_72%)]"
      />

      {/* 3 — Caustic sheen: slow colour, low contrast, never neon. */}
      <div aria-hidden="true" className="absolute inset-0 water-sheen" />

      {/* 4 — Scrims. Vertical one carries the seam into the next section; horizontal one
         seats the headline, so display type stays well above WCAG contrast on any plate. */}
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-b from-abyss/80 via-navy/55 to-navy" />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-navy/92 via-navy/62 to-transparent lg:from-navy/95 lg:via-navy/72"
      />

      {/* 5 — Rising bubbles, dimmed so they never compete with type. */}
      <WaterParticles className="opacity-40" density={22} maxRadius={2.4} speed={0.14} />

      {/* 6 — Vignette to keep the corners deep, plus the meniscus seam at the base. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(125%_100%_at_50%_0%,transparent_42%,var(--color-abyss)_118%)] opacity-60"
      />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-navy" />
      <div aria-hidden="true" className="hairline-water absolute inset-x-0 bottom-0" />
    </div>
  );
}
