'use client';

import type { ReactNode } from 'react';
import { useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/cn';

/**
 * Seamless infinite row. Children are duplicated once and the track translates by -50%,
 * so the loop point is invisible. Pauses on hover and on keyboard focus.
 *
 * Deliberately CSS-driven: a constant-velocity loop is cheaper and steadier in CSS than
 * in a JS animation loop, and it stops itself under prefers-reduced-motion.
 */
export function Marquee({
  children,
  duration = 46,
  reverse = false,
  className,
  edgeColor = 'var(--color-navy)',
}: {
  children: ReactNode;
  /** Seconds for one full -50% traverse. Longer reads calmer. */
  duration?: number;
  reverse?: boolean;
  className?: string;
  /** Match the section background so the fade masks blend */
  edgeColor?: string;
}) {
  const reduced = useReducedMotion();

  const trackClass = cn(
    'marquee-track gap-5 hover:[animation-play-state:paused] group-focus-within:[animation-play-state:paused]',
    reverse ? 'animate-marquee-right' : 'animate-marquee-left',
  );

  if (reduced) {
    return (
      <div
        className={cn('flex w-full gap-5 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden', className)}
        tabIndex={0}
        aria-label="Scrollable list"
      >
        {children}
      </div>
    );
  }

  return (
    <div className={cn('group relative w-full overflow-hidden', className)} aria-hidden={false}>
      <div className={trackClass} style={{ animationDuration: `${duration}s` }}>
        <div className="flex shrink-0 items-stretch gap-5">{children}</div>
        {/* Duplicate carries no semantics — it exists to close the loop */}
        <div className="flex shrink-0 items-stretch gap-5" aria-hidden="true">
          {children}
        </div>
      </div>

      <div
        className="pointer-events-none absolute inset-y-0 left-0 w-[14%]"
        style={{ background: `linear-gradient(90deg, ${edgeColor}, transparent)` }}
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 w-[14%]"
        style={{ background: `linear-gradient(270deg, ${edgeColor}, transparent)` }}
      />
    </div>
  );
}
