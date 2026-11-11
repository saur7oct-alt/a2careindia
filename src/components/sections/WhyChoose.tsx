'use client';

import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { Cpu, Factory, MapPinned, Route, Ruler, Wrench, type LucideIcon } from 'lucide-react';
import { Section, SectionHeading, WaterLine } from '@/components/ui/Section';
import { Reveal, Stagger, StaggerItem } from '@/components/motion/Reveal';
import { ArrowRight, Cta } from '@/components/ui/Cta';
import { whyChoose, type Feature } from '@/data/content';
import { cn } from '@/lib/cn';

const EASE = 'ease-[cubic-bezier(0.16,1,0.3,1)]';

/** Data names the lucide icon as a string; resolved here so imports stay explicit. */
const ICONS: Record<Feature['icon'], LucideIcon> = {
  Ruler,
  Cpu,
  Factory,
  Route,
  MapPinned,
  Wrench,
};

/**
 * Section 09 — why choose us.
 *
 * Six capabilities on a bordered technical grid: hairline dividers come from a 1px gap over
 * a tinted container, so the block reads as an instrument panel rather than six floating
 * cards. ISO certification is not referenced — publication is unverified, so quality is
 * described only in manufacturing terms (which is what `whyChoose` itself says).
 */
export function WhyChoose() {
  const reduced = useReducedMotion();

  // Icon marks inherit the Stagger "show" label from their own cell, settling a beat
  // after the cell reveals. Under reduced motion they simply render at rest.
  const iconVariants: Variants = reduced
    ? { hidden: {}, show: {} }
    : {
        hidden: { opacity: 0, scale: 0.84, y: 6 },
        show: {
          opacity: 1,
          scale: 1,
          y: 0,
          transition: { duration: 0.6, delay: 0.12, ease: [0.16, 1, 0.3, 1] },
        },
      };

  return (
    <Section id="why" tone="dark" labelledBy="why-heading" className="overflow-hidden">
      <div className="shell relative">
        <div className="grid gap-x-12 gap-y-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <SectionHeading
              id="why-heading"
              eyebrow="Why A2Care"
              index="09"
              tone="dark"
              lines={[
                'The engineering partner',
                <>
                  behind <span className="text-aqua">better water.</span>
                </>,
              ]}
            />
          </div>

          <Reveal delay={0.14} y={16} className="lg:col-span-4 lg:col-start-9 lg:pt-12">
            <p className="text-[0.95rem] leading-[1.7] text-steel">
              Six things that should hold on every water project, described by how the work is
              actually done — from analysis and design through fabrication, installation and the
              support that follows handover.
            </p>
          </Reveal>
        </div>

        <Stagger
          stagger={0.07}
          amount={0.12}
          className="mt-14 grid gap-px overflow-hidden rounded-panel border border-hairline-dark bg-hairline-dark sm:grid-cols-2 lg:grid-cols-3"
        >
          {whyChoose.map((feature, index) => {
            const Icon = ICONS[feature.icon];
            return (
              <StaggerItem
                key={feature.id}
                y={18}
                className={cn(
                  'group/cell relative bg-navy p-7 md:p-9',
                  'motion-safe:transition-colors motion-safe:duration-500 hover:bg-midnight/60',
                )}
              >
                {/* Hairline sweeping the cell's top edge on hover. */}
                <span
                  aria-hidden="true"
                  className={cn(
                    'pointer-events-none absolute inset-x-0 top-0 h-px origin-left bg-aqua/55 motion-reduce:transition-none',
                    'transition-transform duration-700',
                    EASE,
                    reduced
                      ? 'scale-x-100 opacity-40'
                      : 'scale-x-0 group-hover/cell:scale-x-100',
                  )}
                />

                <div className="flex items-start justify-between gap-6">
                  <motion.span
                    variants={iconVariants}
                    className={cn(
                      'grid h-12 w-12 place-items-center rounded-panel border border-hairline-dark text-aqua',
                      'motion-safe:transition-colors motion-safe:duration-500 group-hover/cell:border-aqua/45',
                    )}
                  >
                    <Icon className="h-5 w-5" strokeWidth={1.4} aria-hidden="true" />
                  </motion.span>
                  <span className="label tabular-nums text-steel">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>

                <h3 className="display-sm mt-8 max-w-[22ch] text-ice">{feature.title}</h3>
                <p className="mt-3 max-w-[42ch] text-[0.93rem] leading-[1.68] text-steel">
                  {feature.body}
                </p>
              </StaggerItem>
            );
          })}
        </Stagger>

        <WaterLine className="mt-20" />

        <Reveal
          delay={0.1}
          y={14}
          className="mt-10 flex flex-col gap-7 md:flex-row md:items-end md:justify-between"
        >
          <p className="max-w-[56ch] text-[0.95rem] leading-[1.65] text-steel">
            The clearest read on any of this is commissioned plant — duties taken from raw water
            analysis through to handover and support.
          </p>
          <div className="flex shrink-0 flex-wrap items-center gap-3">
            <Cta
              href="/projects"
              tone="outlineDark"
              icon={<ArrowRight />}
              ariaLabel="See A2Care India water treatment projects"
            >
              See projects
            </Cta>
            <Cta href="/about" tone="ghost" ariaLabel="Read more about A2Care India">
              About the company
            </Cta>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
