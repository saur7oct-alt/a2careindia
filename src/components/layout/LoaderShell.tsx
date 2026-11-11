'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { LogoMark, Wordmark } from '@/components/ui/Logo';
import { scrollToTop, setScrollLock } from '@/lib/lenis';
import { site } from '@/lib/site';

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/**
 * One playback per browser session. sessionStorage (not localStorage) so a return visit
 * days later gets the brand moment again, but clicking between routes never does.
 */
const STORAGE_KEY = 'a2care-loader-seen';

const seenInSession = () => {
  try {
    return window.sessionStorage.getItem(STORAGE_KEY) === 'true';
  } catch {
    // Private modes can throw on storage access — treat as "not seen" rather than crash.
    return false;
  }
};

const markSeen = () => {
  try {
    window.sessionStorage.setItem(STORAGE_KEY, 'true');
  } catch {
    /* storage unavailable; the loader simply replays next mount */
  }
};

/**
 * First-paint cover: the mark draws itself, the wordmark rises, a hairline fills.
 * Timed to finish inside ~1.4s whatever else is loading — the intro is a fixed
 * animation, not a progress bar that can stall.
 */
export function LoaderShell() {
  const reduced = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const timers = useRef<number[]>([]);

  // SSR renders nothing at all; the overlay only ever exists on the client, so there is
  // no markup to mismatch.
  useEffect(() => {
    if (seenInSession()) return;

    if (reduced) {
      // Reduced motion: no cover at all, straight to the page.
      markSeen();
      return;
    }

    setMounted(true);
    setScrollLock(true);

    const schedule = (fn: () => void, ms: number) => {
      timers.current.push(window.setTimeout(fn, ms));
    };

    schedule(() => setLeaving(true), 1080);
    schedule(() => {
      markSeen();
      setMounted(false);
      setScrollLock(false);
      // Only re-anchor when the visitor did not arrive asking for a section.
      if (!window.location.hash) scrollToTop();
    }, 1400);

    return () => {
      timers.current.forEach((id) => window.clearTimeout(id));
      timers.current = [];
      setScrollLock(false);
    };
  }, [reduced]);

  return (
    <AnimatePresence>
      {mounted ? (
        <motion.div
          key="loader"
          initial={false}
          animate={{ opacity: leaving ? 0 : 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: leaving ? 0.32 : 0, ease: EASE }}
          className="fixed inset-0 z-[99] grid place-items-center overflow-hidden bg-abyss"
          role="status"
          aria-label={`Loading ${site.name}`}
        >
          {/* Depth wash + engineering grid, so the cover reads as the brand world */}
          <div className="water-sheen pointer-events-none absolute inset-0" />
          <div className="grid-lines pointer-events-none absolute inset-0 opacity-40" />

          <div className="relative flex flex-col items-center gap-7 px-8">
            <LogoMark animate className="h-14 w-14 text-ice" />

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE, delay: 0.5 }}
            >
              <Wordmark tone="light" />
            </motion.div>

            <div className="relative h-px w-44 overflow-hidden bg-hairline-dark md:w-56">
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.95, ease: EASE, delay: 0.18 }}
                className="h-full w-full origin-left bg-aqua"
              />
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, ease: EASE, delay: 0.75 }}
              className="label text-steel"
            >
              Loading
            </motion.p>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
