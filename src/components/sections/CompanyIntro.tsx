'use client';

import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { Section, SectionHeading, WaterLine } from '@/components/ui/Section';
import { Reveal, Stagger, StaggerItem } from '@/components/motion/Reveal';
import { MediaFrame } from '@/components/ui/MediaFrame';
import { AnimatedStat } from '@/components/ui/StatCounter';
import { ArrowRight, Cta } from '@/components/ui/Cta';
import { capabilityFacts } from '@/data/content';
import { site } from '@/lib/site';

/**
 * Section 04 — company introduction.
 *
 * Editorial split: an offset text column against a taller artwork column, with a caption
 * panel that overlaps the frame so the split reads asymmetric rather than a dead 50/50.
 * The artwork carries a small scroll-linked drift (36px of total travel) — enough to feel
 * alive, small enough that it never reads as a bug on a phone.
 *
 * Deliberately silent on certification: `site.certification.isVerifiedForPublish` is false,
 * so quality is described in manufacturing terms only, never as an issued certificate.
 */
export function CompanyIntro() {
  const reduced = useReducedMotion();
  const frameRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: frameRef,
    offset: ['start end', 'end start'],
  });
  const parallaxY = useTransform(scrollYProgress, [0, 1], [18, -18]);

  return (
    <Section id="about" tone="dark" labelledBy="about-heading" className="overflow-hidden">
      {/* Structural grid behind the split, masked so it dies out toward the edges. */}
      <div
        aria-hidden="true"
        className="grid-lines pointer-events-none absolute inset-0 opacity-70 [mask-image:radial-gradient(75%_65%_at_60%_35%,#000_10%,transparent_78%)]"
      />

      <div className="shell relative">
        <div className="grid gap-14 pt-4 lg:grid-cols-12 lg:gap-x-12 lg:gap-y-0">
          {/* ------------------------------------------------ copy column */}
          <div className="lg:col-span-5 lg:col-start-2 lg:pt-10">
            <SectionHeading
              id="about-heading"
              eyebrow="The company"
              index="04"
              tone="dark"
              lines={[
                'More than water treatment.',
                <>
                  We engineer <span className="text-aqua">water solutions.</span>
                </>,
              ]}
              lead="A2Care India combines engineering expertise, advanced purification technology and practical industrial knowledge to help businesses operate efficiently and sustainably."
              headingClassName="max-w-[17ch]"
            />

            <Reveal delay={0.12} y={18} className="mt-7 max-w-[54ch]">
              <p className="text-[0.98rem] leading-[1.72] text-steel">
                Established in {site.establishedYear} and based in {site.address.line2},{' '}
                {site.address.state}, the company stays with a project across its whole life —
                consultation, water quality analysis, engineering and design, manufacturing,
                installation, commissioning and maintenance. One engineering responsibility from
                the first raw water sample to the annual maintenance contract.
              </p>
            </Reveal>

            <Reveal delay={0.2} y={16} className="mt-9 flex flex-wrap items-center gap-3">
              <Cta
                href="/solutions"
                tone="aqua"
                icon={<ArrowRight />}
                ariaLabel="Explore A2Care India water treatment solutions"
              >
                Explore solutions
              </Cta>
              <Cta
                href="/contact"
                tone="outlineDark"
                ariaLabel="Talk to an A2Care India engineer about a water duty"
              >
                Talk to an engineer
              </Cta>
            </Reveal>
          </div>

          {/* ------------------------------------------------ artwork column */}
          <div ref={frameRef} className="relative lg:col-span-6 lg:col-start-7">
            <motion.div
              // Reduced motion: the frame stays put and the copy below simply sits in flow.
              style={reduced ? undefined : { y: parallaxY }}
              className="relative rounded-panel border border-hairline-dark"
            >
              <MediaFrame
                slotId="about.works"
                sizes="(min-width: 1024px) 700px, (min-width: 640px) 80vw, 100vw"
                className="aspect-[4/5] w-full rounded-panel sm:aspect-[16/11]"
              />

              {/* Offset hairline — breaks the rectangle without adding visual weight. */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-4 -right-4 hidden h-full w-full rounded-panel border border-aqua/20 lg:block"
              />
            </motion.div>

            {/* Overlapping caption panel: the joint between the two columns. */}
            <Reveal
              delay={0.16}
              y={20}
              className="glass-dark mt-5 max-w-[24rem] rounded-panel p-5 md:p-6 lg:absolute lg:-bottom-4 lg:-left-12 lg:mt-0 lg:max-w-[21rem]"
            >
              <p className="label text-aqua">Design basis</p>
              <p className="mt-2.5 text-[0.92rem] leading-[1.6] text-ice/85">
                Capacity, recovery and pre-treatment are worked out from a raw water analysis and
                the actual duty the plant has to hold — not picked from a catalogue.
              </p>
              <p className="mt-3 border-t border-hairline-dark pt-3 text-[0.8rem] leading-[1.55] text-steel">
                Precision, reliability and system performance carry through fabrication and
                assembly — the stage where plant life is decided.
              </p>
            </Reveal>
          </div>
        </div>

        {/* ------------------------------------------------ stat band */}
        <WaterLine className="mt-20 md:mt-28" />

        <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {site.stats.map((stat) => (
            <AnimatedStat
              key={stat.label}
              value={stat.value}
              suffix={stat.suffix}
              label={stat.label}
              note={stat.note}
              className="lg:border-l lg:border-hairline-dark lg:pl-8 lg:first:border-l-0 lg:first:pl-0"
            />
          ))}
        </div>

        {/* ------------------------------------------------ capability facts */}
        <Stagger
          stagger={0.08}
          amount={0.2}
          className="mt-16 grid gap-px overflow-hidden rounded-panel border border-hairline-dark bg-hairline-dark sm:grid-cols-2 lg:grid-cols-4"
        >
          {capabilityFacts.map((fact) => (
            <StaggerItem key={fact.label} y={14} className="bg-navy p-5 md:p-6">
              <dl className="flex flex-col gap-2.5">
                <dt className="label text-steel">{fact.label}</dt>
                <dd className="text-[0.95rem] leading-[1.5] text-ice/90">{fact.value}</dd>
              </dl>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </Section>
  );
}
