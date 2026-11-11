'use client';

import { useEffect, useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';

/**
 * Counts to `value` the first time it scrolls into view. Formats with Indian digit
 * grouping so 50,000 LPH reads the way an Indian engineer expects.
 */
export function StatCounter({
  value,
  suffix = '',
  prefix = '',
  duration = 1.6,
  className,
}: {
  value: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -12% 0px' });
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!ref.current || !inView) return;
    const node = ref.current;

    if (reduced) {
      node.textContent = `${prefix}${format(value)}${suffix}`;
      return;
    }

    let frame = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / (duration * 1000), 1);
      // easeOutExpo — fast lead-in, long settle, never bouncy
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      node.textContent = `${prefix}${format(Math.round(value * eased))}${suffix}`;
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, value, prefix, suffix, duration, reduced]);

  return (
    <span ref={ref} className={className}>
      {reduced || !inView ? `${prefix}${format(inView ? value : 0)}${suffix}` : `${prefix}0${suffix}`}
    </span>
  );
}

/** Indian numbering: 50,000 → 50,000; 1,00,000 style grouping above 99,999. */
function format(value: number): string {
  return new Intl.NumberFormat('en-IN').format(value);
}

/**
 * Animated counter used inside stat grids. Kept separate so the reveal wrapper and the
 * number itself do not fight over the same ref.
 */
export function AnimatedStat({
  value,
  suffix,
  label,
  note,
  className,
}: {
  value: number;
  suffix: string;
  label: string;
  note?: string;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="display-lg text-gradient-water">
        <StatCounter value={value} suffix={suffix} />
      </div>
      <div className="mt-2 font-display text-[0.95rem] font-medium text-ice">{label}</div>
      {note ? <div className="label mt-1.5 text-steel">{note}</div> : null}
    </motion.div>
  );
}
