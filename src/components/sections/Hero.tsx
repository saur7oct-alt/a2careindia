'use client';

import { ChevronDown, MapPin } from 'lucide-react';
import { useEffect, useState } from 'react';
import { motion, useReducedMotion, type MotionProps } from 'framer-motion';
import { LineReveal } from '@/components/motion/Reveal';
import { ArrowRight, Cta } from '@/components/ui/Cta';
import { Eyebrow, Section } from '@/components/ui/Section';
import { StatCounter } from '@/components/ui/StatCounter';
import { scrollToId } from '@/lib/lenis';
import { site } from '@/lib/site';
import { HeroBackdrop } from './HeroBackdrop';
import { HeroDrinker } from './HeroDrinker';

/** Named so `Section labelledBy` can point the landmark at the headline. */
const HERO_HEADLINE_ID = 'hero-headline';

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/** Copy is exactly the client's headline; the uppercase treatment is CSS, not a rewrite. */
const HEADLINE_LINES = ['Engineering pure water.', 'Powering a better tomorrow.'];

/**
 * Control-panel style readout. Every value traces back to `site.ts`
 * (established 2018 · RO 100–50,000 LPH · chillers 5–100 TR · pan-India coverage).
 */
const READOUT = [`EST. ${site.establishedYear}`, '100 – 50,000 LPH', '5 – 100 TR', 'PAN-INDIA'];

/** Two of the four published stats belong here; the capacity pair is already in the readout. */
const TRUST = [site.stats[0], site.stats[1]];

/**
 * `<LoaderShell>` covers first paint for roughly 1.4s and holds the shared scroll lock — the
 * same `data-scroll-lock` body attribute `<SmoothScroll>` reads. Playing this entrance
 * underneath that cover wastes it, so the block waits for the lock to release. The wait is
 * capped, so the copy can never end up stuck invisible if the lock is held for another
 * reason, and reduced motion skips it entirely.
 */
function useEntranceReady(capMs = 1600): boolean {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const unlocked = () => !document.body.hasAttribute('data-scroll-lock');
    if (unlocked()) {
      setReady(true);
      return;
    }

    let timer = 0;
    const observer = new MutationObserver(() => {
      if (!unlocked()) return;
      window.clearTimeout(timer);
      observer.disconnect();
      setReady(true);
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ['data-scroll-lock'] });
    timer = window.setTimeout(() => {
      observer.disconnect();
      setReady(true);
    }, capMs);

    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
    };
  }, [capMs]);

  return ready;
}

/**
 * Full-viewport opener. Above the fold, so the sequence is mount-driven (`animate` plus
 * delays) rather than scroll-triggered: plate, headline lines, support copy, CTAs, readout
 * row, trust markers, scroll cue.
 */
export function Hero() {
  const reduced = useReducedMotion();
  const entranceReady = useEntranceReady();
  const ready = Boolean(reduced) || entranceReady;

  /** One entrance curve for the block; only the delay changes. */
  const rise = (delay: number): MotionProps => ({
    initial: reduced ? false : { opacity: 0, y: 22 },
    animate: ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 },
    transition: reduced ? { duration: 0 } : { duration: 0.85, ease: EASE, delay },
  });

  return (
    <Section
      id="hero"
      bleed
      tone="dark"
      labelledBy={HERO_HEADLINE_ID}
      className="flex min-h-[100svh] flex-col overflow-hidden"
    >
      <HeroBackdrop />

      {/* Generated drinking loop, scrubbed by the hero's own scroll. */}
      <HeroDrinker />

      {/* --------------------------------------------------- Headline block */}
      <div className="shell relative z-10 flex flex-1 flex-col justify-center pt-28 pb-10 sm:pt-32 lg:pt-36">
        <div className="max-w-[62rem]">
          <motion.div {...rise(0.15)}>
            <Eyebrow>{site.tagline}</Eyebrow>
          </motion.div>

          {/* Masked reveal runs on its own clock: the two lines finish rising exactly as the
              loader hands over, so the headline is the thing the visitor watches land. */}
          <LineReveal
            as="h1"
            id={HERO_HEADLINE_ID}
            lines={[
              HEADLINE_LINES[0],
              <span key="line-2" className="text-gradient-water">
                {HEADLINE_LINES[1]}
              </span>,
            ]}
            delay={0.5}
            stagger={0.16}
            className="display-xl mt-7 uppercase"
          />

          <motion.p
            {...rise(0.7)}
            className="mt-8 max-w-[58ch] text-[1.02rem] leading-[1.68] text-ice/78 md:text-[1.12rem]"
          >
            {site.heroSupport}
          </motion.p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <motion.div {...rise(0.85)}>
              <Cta href="/solutions" tone="aqua" icon={<ArrowRight />}>
                Explore Our Solutions
              </Cta>
            </motion.div>
            <motion.div {...rise(0.97)}>
              <Cta href="/contact" tone="outlineDark" icon={<ArrowRight />}>
                Discuss Your Project
              </Cta>
            </motion.div>
          </div>
        </div>
      </div>

      {/* --------------------------------------------------- Instrument band */}
      <div className="relative z-10 border-t border-hairline-dark/70 bg-abyss/25 backdrop-blur-[2px]">
        <div className="shell flex flex-col gap-7 py-6 lg:flex-row lg:items-end lg:justify-between lg:gap-12 lg:py-7">
          {/* Technical readout, staggered in after the headline */}
          <ul className="flex flex-wrap items-center gap-x-7 gap-y-3">
            {READOUT.map((item, index) => (
              <motion.li
                key={item}
                {...rise(1.1 + index * 0.07)}
                className="label flex items-center gap-2.5 text-steel"
              >
                <span aria-hidden="true" className="h-1 w-1 rounded-full bg-aqua/60" />
                {item}
              </motion.li>
            ))}
          </ul>

          <div className="flex flex-wrap items-center gap-x-8 gap-y-5">
            {TRUST.map((stat, index) => (
              <motion.div
                key={stat.label}
                {...rise(1.32 + index * 0.11)}
                className="flex items-baseline gap-2.5"
              >
                <span className="display-sm text-gradient-water">
                  <StatCounter value={stat.value} suffix={stat.suffix} duration={1.2 + index * 0.3} />
                </span>
                <span className="label max-w-[16ch] text-steel">
                  {stat.label}
                  <span className="mt-1 block text-steel/65">{stat.note}</span>
                </span>
              </motion.div>
            ))}

            <motion.div {...rise(1.5)} className="flex items-center gap-2.5">
              <MapPin size={15} aria-hidden="true" className="shrink-0 text-aqua" />
              <span className="label text-ice/72">Nationwide installation &amp; commissioning</span>
            </motion.div>

            {/* Scroll cue: a real control that routes through the shared Lenis authority. */}
            <motion.div {...rise(1.62)}>
              <button
                type="button"
                onClick={() => scrollToId('story')}
                aria-label="Scroll to the treatment sequence"
                className="group inline-flex items-center gap-3 rounded-pill border border-hairline-dark bg-navy/40 px-4 py-2.5 text-aqua transition-colors duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-aqua/55 hover:bg-aqua/[0.07]"
              >
                <span className="label">Scroll</span>
                <span aria-hidden="true" className="relative block h-6 w-px overflow-hidden bg-steel/30">
                  <motion.span
                    className="absolute inset-x-0 top-0 h-2 bg-aqua"
                    initial={reduced ? false : { y: '-110%' }}
                    animate={reduced ? { y: 0 } : { y: ['-110%', '320%'] }}
                    transition={reduced ? { duration: 0 } : { duration: 1.9, repeat: Infinity, ease: 'easeInOut' }}
                  />
                </span>
                <ChevronDown
                  size={14}
                  aria-hidden="true"
                  className="transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0.5"
                />
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </Section>
  );
}
