'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/cn';

/**
 * A2Care identity mark: a treated-water meniscus inside a process vessel outline.
 * The stroke draws itself on first load (SECTION 01 requirement) and then holds still.
 */
export function LogoMark({
  className,
  animate = false,
}: {
  className?: string;
  animate?: boolean;
}) {
  const reduced = useReducedMotion();
  const draw = animate && !reduced;

  return (
    <svg viewBox="0 0 40 40" className={cn('h-9 w-9', className)} aria-hidden="true" fill="none">
      <motion.path
        d="M20 3.2c7.6 4.3 12 9.4 12 16.1 0 8-5.4 13.8-12 17.4-6.6-3.6-12-9.4-12-17.4 0-6.7 4.4-11.8 12-16.1z"
        stroke="currentColor"
        strokeWidth="1.4"
        initial={draw ? { pathLength: 0, opacity: 0 } : false}
        animate={draw ? { pathLength: 1, opacity: 1 } : undefined}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
      />
      <motion.path
        d="M11.4 21.6c2.3-2.1 4.6-2.1 6.9 0s4.6 2.1 6.9 0"
        stroke="var(--color-aqua)"
        strokeWidth="1.5"
        strokeLinecap="round"
        initial={draw ? { pathLength: 0, opacity: 0 } : false}
        animate={draw ? { pathLength: 1, opacity: 1 } : undefined}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
      />
      <motion.circle
        cx="20"
        cy="14"
        r="2.1"
        fill="var(--color-electric)"
        initial={draw ? { scale: 0, opacity: 0 } : false}
        animate={draw ? { scale: 1, opacity: 1 } : undefined}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.85 }}
      />
    </svg>
  );
}

export function Wordmark({
  className,
  tone = 'light',
  compact = false,
}: {
  className?: string;
  tone?: 'light' | 'dark';
  compact?: boolean;
}) {
  return (
    <span className={cn('flex items-baseline gap-[0.32em]', className)}>
      <span
        className={cn(
          'font-display text-[1.16rem] font-semibold tracking-[-0.02em] leading-none',
          tone === 'light' ? 'text-ice' : 'text-navy',
        )}
      >
        A2Care
      </span>
      {!compact ? (
        <span className={cn('label leading-none', tone === 'light' ? 'text-aqua' : 'text-electric')}>
          India
        </span>
      ) : null}
    </span>
  );
}

export function Logo({
  tone = 'light',
  className,
  animate = false,
  compact = false,
}: {
  tone?: 'light' | 'dark';
  className?: string;
  animate?: boolean;
  compact?: boolean;
}) {
  return (
    <span className={cn('flex items-center gap-3', className)}>
      <LogoMark animate={animate} className={tone === 'light' ? 'text-ice' : 'text-navy'} />
      <Wordmark tone={tone} compact={compact} />
    </span>
  );
}
