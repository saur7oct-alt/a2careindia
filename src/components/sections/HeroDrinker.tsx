'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/cn';
import { decor } from '@/lib/media';

const SLOT = decor['decor.hero-drink'];

/** Where a reduced-motion visitor is parked: glass at the lips, not the empty opening beat. */
const STILL_FRAME = 0.62;

/** The clip is scrubbed, never played, so the seek has to stay cheap. */
const SEEK_TOLERANCE = 0.06;

/**
 * Seeks are the expensive half of the scrub — each one re-decodes a frame — so they are
 * capped to 20Hz. Nothing else is slowed down: at 50ms the steps are below the eye's
 * threshold on a scrubbed beat, while one seek per animation frame is enough to stall a
 * laptop for the whole length of the hero.
 */
const SEEK_INTERVAL_MS = 50;

/**
 * How long the hero is left alone before the loop is requested. `preload="auto"` pulls the
 * whole file, so it waits out the loader and the headline entrance rather than competing
 * with them for the first paint.
 */
const LOAD_AFTER_MS = 1400;

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

type Connection = Navigator & { connection?: { saveData?: boolean } };

/**
 * Scroll-scrubbed drinking loop on the right of the hero.
 *
 * The figure starts turned away and only completes the drink as the visitor scrolls the
 * hero out, so the payoff is tied to the gesture rather than a timer. Three gates keep it
 * off the critical path: it needs a wide viewport, it never loads on a metered connection,
 * and reduced motion gets a single held frame instead of the scrub.
 */
export function HeroDrinker({ heroId = 'hero', className }: { heroId?: string; className?: string }) {
  const reduced = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [duration, setDuration] = useState(0);
  const [ready, setReady] = useState(false);
  const [allowed, setAllowed] = useState(false);
  const [requested, setRequested] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setRequested(true), LOAD_AFTER_MS);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return;
    if ((navigator as Connection).connection?.saveData) return;

    const wide = window.matchMedia('(min-width: 1024px)');
    setAllowed(wide.matches);

    const onChange = (event: MediaQueryListEvent) => setAllowed(event.matches);
    wide.addEventListener('change', onChange);
    return () => wide.removeEventListener('change', onChange);
  }, []);

  const seek = useCallback((seconds: number) => {
    const video = videoRef.current;
    if (!video || !duration) return;

    const target = Math.min(Math.max(seconds, 0), Math.max(duration - 0.05, 0));
    if (Math.abs(video.currentTime - target) > SEEK_TOLERANCE) video.currentTime = target;
  }, [duration]);

  useEffect(() => {
    if (!allowed || !requested || !duration) return;

    if (reduced) {
      seek(STILL_FRAME * duration);
      return;
    }

    const hero = document.getElementById(heroId);
    if (!hero) return;

    let frame = 0;
    let lastSeek = 0;

    const update = (now: number) => {
      frame = 0;
      const rect = hero.getBoundingClientRect();
      // Fully scrolled past: progress is pinned at 1, so nothing is left to scrub.
      if (rect.bottom <= 0) return;
      // Throttled. The frame is already released, so the next scroll event re-schedules.
      if (now - lastSeek < SEEK_INTERVAL_MS) return;
      lastSeek = now;

      // 0 while the hero fills the screen, 1 once it has scrolled fully past.
      const progress = Math.min(Math.max(-rect.top / Math.max(rect.height, 1), 0), 1);
      seek(progress * duration);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update(performance.now());
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });

    // The hero is the top of the page, so once it has scrolled away there is nothing left
    // to scrub. Detaching the listener stops the rest of the document from paying for a
    // measurement it cannot use.
    const viewport = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) window.addEventListener('scroll', schedule, { passive: true });
        else window.removeEventListener('scroll', schedule);
      },
      { threshold: 0 },
    );
    viewport.observe(hero);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      viewport.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [allowed, requested, duration, reduced, seek, heroId]);

  if (!allowed || !requested) return null;

  return (
    <motion.div
      aria-hidden="true"
      data-decor-credit={SLOT.credit}
      initial={{ opacity: 0 }}
      animate={{ opacity: ready ? 1 : 0 }}
      transition={{ duration: reduced ? 0 : 1.1, ease: EASE }}
      className={cn(
        'pointer-events-none absolute inset-y-0 right-0 z-[5] hidden w-[40%] max-w-[620px] overflow-hidden lg:block',
        className,
      )}
    >
      <video
        ref={videoRef}
        src={SLOT.src}
        muted
        playsInline
        preload="auto"
        tabIndex={-1}
        onLoadedMetadata={(event) => {
          const video = event.currentTarget;
          video.pause();
          setDuration(Number.isFinite(video.duration) ? video.duration : 0);
        }}
        onCanPlay={() => setReady(true)}
        className="h-full w-full scale-105 object-cover object-[50%_10%]"
      />

      {/* Left edge dissolves into the headline column, base into the instrument band, and
          the whole plate stays under the text's contrast budget. */}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,var(--color-navy)_0%,rgba(7,27,43,0.72)_22%,rgba(7,27,43,0.18)_52%,transparent_76%)]" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-[linear-gradient(0deg,var(--color-abyss)_4%,transparent_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_62%_38%,transparent_38%,rgba(4,15,25,0.55)_100%)]" />
      <div className="absolute inset-0 bg-navy/25" />
    </motion.div>
  );
}
