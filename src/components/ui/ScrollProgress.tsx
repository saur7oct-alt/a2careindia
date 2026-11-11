'use client';

import { useRef, useState } from 'react';
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring } from 'framer-motion';
import { scrollToTop } from '@/lib/lenis';

/**
 * Feature E: one control does both jobs. The ring fills as the reader travels the page,
 * and pressing it returns them to the top.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const reduced = useReducedMotion();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 26, mass: 0.3 });
  const [visible, setVisible] = useState(false);
  // The spring ticks on every frame while it settles. Only the threshold crossing is worth
  // a React render, so the setState is gated on a ref instead of firing once per frame.
  const shown = useRef(false);

  useMotionValueEvent(progress, 'change', (value) => {
    const next = value > 0.12;
    if (next === shown.current) return;
    shown.current = next;
    setVisible(next);
  });

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: visible ? 1 : 0, scale: visible ? 1 : 0.85 }}
      transition={{ duration: reduced ? 0 : 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="fixed bottom-5 right-5 z-40 md:bottom-8 md:right-8"
      style={{ pointerEvents: visible ? 'auto' : 'none' }}
    >
      <button
        type="button"
        onClick={scrollToTop}
        aria-label="Back to top"
        className="group relative grid h-12 w-12 place-items-center rounded-full bg-navy/70 backdrop-blur-md transition-colors duration-300 hover:bg-navy/90 md:h-[52px] md:w-[52px]"
      >
        <svg viewBox="0 0 44 44" className="absolute inset-0 h-full w-full -rotate-90" aria-hidden="true">
          <circle cx="22" cy="22" r="20" fill="none" stroke="rgba(129,147,160,0.28)" strokeWidth="1.5" />
          <motion.circle
            cx="22"
            cy="22"
            r="20"
            fill="none"
            stroke="var(--color-aqua)"
            strokeWidth="1.5"
            strokeLinecap="round"
            style={{ pathLength: progress }}
          />
        </svg>

        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          className="relative text-ice transition-transform duration-300 group-hover:-translate-y-0.5"
          aria-hidden="true"
        >
          <path d="M12 19V5M6 11l6-6 6 6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </motion.div>
  );
}
