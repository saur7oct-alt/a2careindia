'use client';

import { motion, useReducedMotion, type Variants } from 'framer-motion';
import type { ReactNode } from 'react';

const EASE = [0.16, 1, 0.3, 1] as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.9, ease: EASE } },
};

export const maskUp: Variants = {
  hidden: { y: '110%' },
  show: { y: '0%', transition: { duration: 0.9, ease: EASE } },
};

/**
 * Scroll-triggered fade + rise. One component so every section reveals on the same curve.
 */
export function Reveal({
  children,
  delay = 0,
  y = 24,
  className,
  as = 'div',
  amount = 0.3,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: 'div' | 'span' | 'li' | 'p';
  amount?: number;
}) {
  const reduced = useReducedMotion();
  const MotionTag = motion[as];

  return (
    <MotionTag
      className={className}
      initial={reduced ? false : { opacity: 0, y }}
      whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={reduced ? undefined : { duration: 0.75, ease: EASE, delay }}
    >
      {children}
    </MotionTag>
  );
}

/**
 * Children mount in sequence. Give each direct child a delay of index * stagger.
 */
export function Stagger({
  children,
  stagger = 0.08,
  className,
  amount = 0.25,
}: {
  children: ReactNode;
  stagger?: number;
  className?: string;
  amount?: number;
}) {
  const reduced = useReducedMotion();

  const container: Variants = {
    hidden: {},
    show: {
      transition: reduced ? { staggerChildren: 0 } : { staggerChildren: stagger },
    },
  };

  return (
    <motion.div
      className={className}
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
  y = 20,
}: {
  children: ReactNode;
  className?: string;
  y?: number;
}) {
  const reduced = useReducedMotion();

  const item: Variants = reduced
    ? { hidden: {}, show: {} }
    : {
        hidden: { opacity: 0, y },
        show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
      };

  return (
    <motion.div className={className} variants={item}>
      {children}
    </motion.div>
  );
}

/**
 * Display heading that reveals one line at a time behind an overflow mask.
 * Pass explicit lines so the break points are an editorial decision, not a wrap accident.
 */
export function LineReveal({
  lines,
  className,
  lineClassName,
  as = 'h2',
  delay = 0,
  stagger = 0.11,
  id,
}: {
  lines: readonly ReactNode[];
  className?: string;
  lineClassName?: string;
  as?: 'h1' | 'h2' | 'h3';
  delay?: number;
  stagger?: number;
  id?: string;
}) {
  const reduced = useReducedMotion();
  const MotionTag = motion[as];

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: reduced ? 0 : stagger, delayChildren: delay } },
  };

  const line: Variants = reduced
    ? { hidden: {}, show: {} }
    : {
        hidden: { y: '108%' },
        show: { y: '0%', transition: { duration: 0.95, ease: EASE } },
      };

  return (
    <MotionTag
      id={id}
      className={className}
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.4 }}
    >
      {lines.map((text, index) => (
        <span key={index} className="block overflow-hidden pb-[0.08em]">
          <motion.span variants={line} className={`block ${lineClassName ?? ''}`}>
            {text}
          </motion.span>
        </span>
      ))}
    </MotionTag>
  );
}
