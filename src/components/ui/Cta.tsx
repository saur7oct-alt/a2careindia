'use client';

import Link from 'next/link';
import { useRef, type ReactNode } from 'react';
import { motion, useReducedMotion, useMotionValue, useSpring } from 'framer-motion';
import { cn } from '@/lib/cn';

const base =
  'group relative inline-flex items-center justify-center gap-2.5 rounded-pill px-7 py-3.5 font-display text-[0.95rem] font-medium tracking-[-0.01em] transition-colors duration-300 disabled:cursor-not-allowed disabled:opacity-55';

const tones = {
  aqua: 'bg-aqua text-navy hover:bg-[#4ae3e0]',
  electric: 'bg-electric text-abyss hover:bg-[#3abef5]',
  outlineDark: 'border border-aqua/35 text-ice hover:border-aqua/70 hover:bg-aqua/[0.07]',
  outlineLight: 'border border-navy/20 text-navy hover:border-navy/45 hover:bg-navy/[0.04]',
  solidLight: 'bg-navy text-ice hover:bg-midnight',
  ghost: 'text-ice/80 hover:text-ice',
} as const;

export type ButtonTone = keyof typeof tones;

/**
 * `href` starting with "/" renders a Next Link (client-side nav); anything else
 * (tel:, mailto:, https:, wa.me) renders a plain anchor. Every CTA in the site takes
 * this, so there are no dead buttons and no <a> used for internal routes.
 */
export function Cta({
  href,
  children,
  tone = 'aqua',
  icon,
  className,
  magnetic = true,
  ariaLabel,
  onClick,
  type = 'button',
  as,
}: {
  href?: string;
  children: ReactNode;
  tone?: ButtonTone;
  icon?: ReactNode;
  className?: string;
  magnetic?: boolean;
  ariaLabel?: string;
  onClick?: () => void;
  type?: 'button' | 'submit';
  /** Render as a non-link element, e.g. "div" when wrapping a trigger */
  as?: 'button' | 'div';
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 22, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 22, mass: 0.4 });

  const useMagnetic = magnetic && !reduced;

  const handlers = useMagnetic
    ? {
        onMouseMove: (event: React.MouseEvent) => {
          const node = ref.current;
          if (!node) return;
          const rect = node.getBoundingClientRect();
          x.set((event.clientX - (rect.left + rect.width / 2)) * 0.22);
          y.set((event.clientY - (rect.top + rect.height / 2)) * 0.3);
        },
        onMouseLeave: () => {
          x.set(0);
          y.set(0);
        },
      }
    : {};

  const inner = (
    <>
      <span className="relative z-10 flex items-center gap-2.5">
        {children}
        {icon ? (
          <span className="transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0.5">
            {icon}
          </span>
        ) : null}
      </span>
    </>
  );

  const classes = cn(base, tones[tone], className);

  const motionProps = useMagnetic
    ? { style: { x: sx, y: sy }, ref: (node: HTMLElement | null) => (ref.current = node) }
    : { ref: (node: HTMLElement | null) => (ref.current = node) };

  if (href && href.startsWith('/')) {
    return (
      <motion.div {...(motionProps as { style?: Record<string, unknown> })} {...handlers}>
        <Link href={href} className={classes} aria-label={ariaLabel}>
          {inner}
        </Link>
      </motion.div>
    );
  }

  if (href) {
    return (
      <motion.a
        {...(motionProps as { style?: Record<string, unknown> })}
        {...handlers}
        href={href}
        className={classes}
        aria-label={ariaLabel}
        target={href.startsWith('http') ? '_blank' : undefined}
        rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
      >
        {inner}
      </motion.a>
    );
  }

  const Tag = as === 'div' ? motion.div : motion.button;

  return (
    <Tag
      {...(motionProps as { style?: Record<string, unknown> })}
      {...handlers}
      {...(as === 'div' ? {} : { type })}
      className={classes}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      {inner}
    </Tag>
  );
}

/** Arrow used on most primary CTAs; consistent direction signals "forward". */
export function ArrowRight({ className }: { className?: string }) {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M4 12h15M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
