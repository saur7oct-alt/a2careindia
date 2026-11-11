'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

/**
 * Subtle desktop cursor ring (SECTION: advanced motion). Opt-in by environment: coarse
 * pointers and reduced motion never mount it, and the native cursor stays visible so
 * text selection and form fields keep their expected affordances.
 */
export function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [active, setActive] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 400, damping: 34, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 400, damping: 34, mass: 0.4 });

  // Pointer moves arrive far faster than React needs to re-render; the position already
  // bypasses React via motion values, so the grow/shrink state is gated the same way.
  const grown = useRef(false);

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || reduced) return;

    setEnabled(true);

    const onMove = (event: MouseEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);

      const target = event.target as HTMLElement | null;
      // Growing over anything actionable reads as "this is a target", nothing more.
      const next = Boolean(
        target?.closest('a, button, input, select, textarea, [data-cursor="grow"]'),
      );
      if (next === grown.current) return;
      grown.current = next;
      setActive(next);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, [x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[100] hidden lg:block"
      style={{ x: sx, y: sy }}
    >
      <motion.div
        className="-ml-[13px] -mt-[13px] h-[26px] w-[26px] rounded-full border border-aqua/55"
        animate={{ scale: active ? 1.5 : 1, borderColor: active ? 'rgba(32,213,210,0.9)' : 'rgba(32,213,210,0.55)' }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      />
    </motion.div>
  );
}
