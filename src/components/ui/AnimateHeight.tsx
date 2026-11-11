'use client';

import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

/**
 * Collapses/expands by animating height from 0 to auto via measured pixel height, which
 * is what keeps the FAQ accordion smooth instead of snapping.
 */
export function AnimateHeight({
  open,
  children,
  className,
}: {
  open: boolean;
  children: ReactNode;
  className?: string;
}) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      initial={false}
      animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
      transition={
        reduced
          ? { duration: 0 }
          : { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
      }
      style={{ overflow: 'hidden' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
