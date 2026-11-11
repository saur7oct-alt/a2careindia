'use client';

import { useRef, useState } from 'react';
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { processStages } from '@/data/content';
import { Section, SectionHeading } from '@/components/ui/Section';
import { Reveal } from '@/components/motion/Reveal';
import { cn } from '@/lib/cn';

/**
 * Section 10 — the six-stage engineering process.
 *
 * A single useScroll on the timeline container drives everything: a scaleY fill on the
 * rail (transform only, so it stays on the compositor) and one `active` index derived
 * from that same progress value. No per-stage observers. Desktop alternates rows around
 * a centre rail; mobile collapses to a single left rail. Under reduced motion the rail
 * is drawn complete and every stage is legible with no animation.
 */
export function ProcessTimeline() {
  const reduced = useReducedMotion();
  const railRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: railRef,
    offset: ['start 78%', 'end 45%'],
  });

  const fillScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  const stageCount = processStages.length;
  const [trackedActive, setTrackedActive] = useState(0);

  useMotionValueEvent(scrollYProgress, 'change', (progress) => {
    const next = Math.min(stageCount - 1, Math.max(0, Math.floor(progress * stageCount)));
    setTrackedActive((current) => (current === next ? current : next));
  });

  // Reduced motion: rail already full, so every dot reads as passed.
  const active = reduced ? stageCount : trackedActive;

  return (
    <Section id="process" tone="light" labelledBy="process-heading">
      <div className="shell">
        <SectionHeading
          id="process-heading"
          index="10"
          eyebrow="How we work"
          tone="light"
          lines={['From water challenge', 'to engineered solution.']}
          lead="Six stages between the first conversation and a plant that is still performing years after handover. Each one produces something concrete — not a milestone slide."
        />

        <div ref={railRef} className="relative mt-16 md:mt-24">
          {/* Rails — mobile sits left, desktop centres between the alternating rows */}
          <div aria-hidden="true" className="absolute bottom-0 left-[13px] top-0 w-px bg-hairline-light md:left-1/2 md:-translate-x-1/2">
            <motion.div
              className="h-full w-full origin-top bg-gradient-to-b from-electric to-aqua"
              style={reduced ? { scaleY: 1 } : { scaleY: fillScale }}
            />
          </div>

          <ol className="flex flex-col gap-14 md:gap-6">
            {processStages.map((stage, index) => {
              const left = index % 2 === 0;
              const isPassed = index <= active;
              const isActive = index === active;

              return (
                <li key={stage.number} className="relative pl-12 md:grid md:grid-cols-2 md:gap-x-24 md:pl-0">
                  {/* Stage dot on the rail */}
                  <span
                    aria-hidden="true"
                    className="absolute left-[6px] top-1.5 md:left-1/2 md:-translate-x-1/2"
                  >
                    <span
                      className={cn(
                        'relative block h-3.5 w-3.5 rounded-full border-2 transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]',
                        isPassed ? 'border-aqua bg-aqua' : 'border-navy/25 bg-ice',
                      )}
                    >
                      {isActive && !reduced ? (
                        <span className="absolute inset-[-6px] animate-[ripple-breathe_2.6s_ease-in-out_infinite] rounded-full bg-aqua/25" />
                      ) : null}
                    </span>
                  </span>

                  {/* Content — alternating sides on desktop, always right of the rail on mobile */}
                  <Reveal
                    y={20}
                    amount={0.5}
                    className={cn(
                      'md:pb-16',
                      left ? 'md:col-start-1 md:text-right' : 'md:col-start-2',
                    )}
                  >
                    <div className={cn('max-w-[52ch] md:pb-2', left ? 'md:ml-auto' : '')}>
                      <p
                        className={cn(
                          'label transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]',
                          isActive ? 'text-electric' : 'text-navy/45',
                        )}
                      >
                        Stage {stage.number}
                      </p>

                      <h3
                        className={cn(
                          'display-sm mt-4 transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]',
                          isActive ? 'text-navy' : 'text-navy/75',
                        )}
                      >
                        {stage.title}
                      </h3>

                      <p className="mt-3 text-[0.98rem] leading-[1.7] text-navy/65">{stage.body}</p>

                      <p
                        className={cn(
                          'label mt-5 inline-block rounded-pill border px-3.5 py-2 transition-colors duration-500',
                          left ? 'md:text-left' : '',
                          isActive
                            ? 'border-electric/45 text-electric'
                            : 'border-hairline-light text-navy/55',
                        )}
                      >
                        Deliverable — {stage.deliverable}
                      </p>
                    </div>
                  </Reveal>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </Section>
  );
}
