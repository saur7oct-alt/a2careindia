'use client';

import { useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Phone } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { Cta, ArrowRight } from '@/components/ui/Cta';
import { MediaFrame } from '@/components/ui/MediaFrame';
import { LineReveal, Reveal } from '@/components/motion/Reveal';
import { site, telHref } from '@/lib/site';

/**
 * Section 14 — the closing band.
 *
 * The full-width backdrop is the `cta.band` media slot: real footage once A2Care
 * supplies it, the designed technical stand-in until then, under a dark scrim,
 * water sheen, grain and a slow scale drift (static under reduced motion).
 */
export function CtaBand() {
  const reduced = useReducedMotion();
  const frameRef = useRef<HTMLDivElement>(null);

  return (
    <Section id="cta" tone="deeper" bleed labelledBy="cta-heading" className="overflow-hidden">
      {/* Backdrop layers */}
      <div ref={frameRef} aria-hidden="true" className="absolute inset-0">
        <motion.div
          className="absolute inset-[-4%]"
          initial={false}
          animate={reduced ? undefined : { scale: [1, 1.055, 1], y: [0, -10, 0] }}
          transition={{ duration: 26, ease: 'easeInOut', repeat: Infinity }}
        >
          <MediaFrame slotId="cta.band" className="h-full w-full" motifClassName="w-[74%]" priority sizes="100vw" />
        </motion.div>
        <div className="absolute inset-0 bg-abyss/78" />
        <div className="water-sheen absolute inset-0" />
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-abyss to-transparent" />
        <div className="grain-layer absolute inset-0" />
      </div>

      <div className="shell relative z-10 flex min-h-[68vh] flex-col items-start justify-center py-28 md:py-36">
        <Reveal amount={0.2}>
          <span className="label flex items-center gap-3 text-aqua">
            <span aria-hidden="true" className="h-px w-8 bg-aqua/45" />
            Start the engineering conversation
          </span>
        </Reveal>

        <LineReveal
          as="h2"
          id="cta-heading"
          delay={0.08}
          className="display-xl mt-7 max-w-[15ch]"
          lines={['Let’s engineer your', 'next water solution.']}
        />

        <Reveal className="mt-8" delay={0.15} amount={0.2}>
          <p className="max-w-[56ch] text-[1.05rem] leading-[1.7] text-ice/80 md:text-[1.15rem]">
            Tell us about your water treatment requirements. Our team will help you find
            the right engineering solution.
          </p>
        </Reveal>

        <Reveal className="mt-11 flex flex-wrap items-center gap-4" delay={0.22} amount={0.2}>
          <Cta href="/contact" tone="aqua" icon={<ArrowRight />} ariaLabel="Request a free water treatment consultation">
            Request a Free Consultation
          </Cta>
          <Cta
            href={telHref(site.phones[0])}
            tone="outlineDark"
            icon={<Phone size={16} aria-hidden="true" />}
            ariaLabel={`Call A2Care India on ${site.phones[0]}`}
          >
            Talk to Our Experts
          </Cta>
        </Reveal>

        {/* Restrained secondary line — both published numbers, live tel: links */}
        <Reveal className="mt-12" delay={0.3} amount={0.2}>
          <p className="label flex flex-wrap items-center gap-x-4 gap-y-2 text-steel">
            <span>Direct lines</span>
            {site.phones.map((phone) => (
              <a
                key={phone}
                href={telHref(phone)}
                className="text-ice/75 underline decoration-hairline-dark underline-offset-4 transition-colors duration-300 hover:text-aqua"
              >
                {phone}
              </a>
            ))}
          </p>
        </Reveal>
      </div>
    </Section>
  );
}
