'use client';

import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { sustainabilityPoints } from '@/data/content';
import { Section, SectionHeading } from '@/components/ui/Section';
import { MediaFrame } from '@/components/ui/MediaFrame';
import { Reveal, Stagger, StaggerItem } from '@/components/motion/Reveal';

const MOVEMENTS: { slotId: string; label: string; caption: string }[] = [
  { slotId: 'story.raw', label: 'Intake', caption: 'Water drawn to a measured duty' },
  { slotId: 'story.membrane', label: 'Treatment', caption: 'Engineered to prove specification' },
  { slotId: 'sustainability.nature', label: 'Return', caption: 'Held to norms before it leaves site' },
];

/**
 * Section 11 — sustainability.
 *
 * Three movements — intake, treatment, return — carried by the technical motifs in
 * MediaFrame slots, over a background the scroll interpolates from navy, through
 * midnight, to an aqua-tinted edge. Opacity is layered on token-coloured planes rather
 * than interpolated hex, and everything is transform/opacity for the compositor.
 *
 * No environmental impact figures are claimed anywhere — none are verified.
 */
export function Sustainability() {
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const midnightOpacity = useTransform(scrollYProgress, [0, 0.55], [0, 1]);
  const aquaEdgeOpacity = useTransform(scrollYProgress, [0.45, 1], [0, 1]);
  const sheenOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.15, 0.55, 0.9]);

  return (
    <Section id="sustainability" tone="dark" labelledBy="sustainability-heading" className="overflow-hidden">
      {/* Scroll-interpolated tone: navy base, midnight rising through, aqua edge at the end */}
      <div ref={sectionRef} aria-hidden="true" className="pointer-events-none absolute inset-0">
        <motion.div className="absolute inset-0 bg-midnight" style={reduced ? { opacity: 1 } : { opacity: midnightOpacity }} />
        <motion.div
          className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-aqua/20 via-aqua/[0.06] to-transparent"
          style={reduced ? { opacity: 0.7 } : { opacity: aquaEdgeOpacity }}
        />
        <motion.div className="water-sheen absolute inset-0" style={reduced ? { opacity: 0.5 } : { opacity: sheenOpacity }} />
        <div className="grain-layer absolute inset-0" />
      </div>

      <div className="shell relative z-10">
        <SectionHeading
          id="sustainability-heading"
          index="11"
          eyebrow="Sustainability"
          tone="dark"
          lines={['Better water management.', 'A more sustainable future.']}
        />

        <Reveal className="mt-10 max-w-[64ch]" y={18}>
          <p className="text-[1.05rem] leading-[1.75] text-ice/85 md:text-[1.15rem]">
            Water is not a line — it is a loop. Intake, duty, treatment, return. Every
            plant A2Care engineers is planned around closing that loop: taking only what
            the process needs, holding what it uses to specification, and giving water
            back to the environment it came from on terms the site can answer for.
          </p>
        </Reveal>

        {/* ---------------------------------------------- Three-movement progression */}
        <div className="mt-16 grid items-center gap-6 md:mt-20 md:grid-cols-[1fr_auto_1fr_auto_1fr] md:gap-4">
          {MOVEMENTS.map((movement, index) => (
            <div key={movement.slotId} className="contents md:block">
              <Reveal y={22} delay={index * 0.12}>
                <figure className="rounded-panel border border-hairline-dark bg-abyss/30 p-3">
                  <MediaFrame slotId={movement.slotId} className="aspect-[4/3]" sizes="(min-width: 768px) 30vw, 90vw" showLabel />
                  <figcaption className="flex items-baseline gap-3 px-3 pb-2 pt-4">
                    <span className="label text-aqua">
                      0{index + 1} · {movement.label}
                    </span>
                    <span className="text-[0.85rem] leading-snug text-steel">{movement.caption}</span>
                  </figcaption>
                </figure>
              </Reveal>
              {index < MOVEMENTS.length - 1 ? (
                <div aria-hidden="true" className="hidden justify-center md:flex">
                  <ArrowRight size={18} className="text-aqua/60" />
                </div>
              ) : null}
            </div>
          ))}
        </div>

        {/* ------------------------------------------------------- The six commitments */}
        <Stagger stagger={0.07} className="mt-16 grid gap-px overflow-hidden rounded-panel border border-hairline-dark bg-hairline-dark sm:grid-cols-2 lg:grid-cols-3" amount={0.15}>
          {sustainabilityPoints.map((point) => (
            <StaggerItem key={point.title} className="bg-abyss/70 p-7 backdrop-blur-sm md:p-8">
              <h3 className="display-sm text-ice">{point.title}</h3>
              <p className="mt-4 text-[0.94rem] leading-[1.7] text-steel">{point.body}</p>
            </StaggerItem>
          ))}
        </Stagger>

        <Reveal className="mt-10" y={14} amount={0.5}>
          <p className="label text-steel/70">
            Measured environmental claims are published only once the company verifies
            them. What is stated here is how the work is engineered.
          </p>
        </Reveal>
      </div>
    </Section>
  );
}
