'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import { Section, SectionHeading } from '@/components/ui/Section';
import { Reveal } from '@/components/motion/Reveal';
import { Cta } from '@/components/ui/Cta';
import { AssetMotif, motifFor } from '@/components/ui/AssetMotif';
import { getProduct, type Product } from '@/data/products';
import { industries } from '@/data/industries';
import { cn } from '@/lib/cn';

const EASE = [0.16, 1, 0.3, 1] as const;
/** Must stay in sync with `gap-5` (1.25rem = 20px) on the track. */
const CARD_GAP = 20;

const pad = (value: number) => String(value).padStart(2, '0');

/**
 * Section 06 — industries served.
 *
 * Deliberately user-controlled: a snap row with real arrow buttons, mouse drag and touch
 * swipe, plus a hairline progress bar. No auto-scroll — an engineer scanning for their own
 * sector should never have to catch a moving target.
 *
 * Dark `deeper` ground so it contrasts with the light portfolio block above it and sits
 * apart from the navy "why us" grid below.
 */
export function Industries() {
  const reduced = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const drag = useRef({ pointerId: -1, startX: 0, startScroll: 0, moved: false });
  const rafRef = useRef(0);
  const [state, setState] = useState({ active: 1, progress: 0, atStart: true, atEnd: false });

  const measure = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const card = el.firstElementChild as HTMLElement | null;
    const step = card ? card.offsetWidth + CARD_GAP : el.clientWidth;
    setState({
      active: max > 0 && step > 0 ? Math.min(industries.length, Math.round(el.scrollLeft / step) + 1) : 1,
      progress: max > 0 ? Math.min(1, Math.max(0, el.scrollLeft / max)) : 0,
      atStart: el.scrollLeft <= 2,
      atEnd: max <= 2 || max - el.scrollLeft <= 2,
    });
  }, []);

  /** Scroll fires far more often than the DOM needs repainting, so coalesce into frames. */
  const scheduleMeasure = useCallback(() => {
    if (rafRef.current) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = 0;
      measure();
    });
  }, [measure]);

  useEffect(() => {
    measure();
    window.addEventListener('resize', scheduleMeasure);
    return () => {
      window.removeEventListener('resize', scheduleMeasure);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [measure, scheduleMeasure]);

  const nudge = (direction: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.firstElementChild as HTMLElement | null;
    const step = card ? card.offsetWidth + CARD_GAP : Math.round(el.clientWidth * 0.8);
    el.scrollBy({ left: direction * step, behavior: reduced ? 'auto' : 'smooth' });
  };

  // Mouse drag only — touch keeps native momentum scrolling inside the snap container.
  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    const el = trackRef.current;
    if (!el || event.pointerType !== 'mouse' || event.button !== 0) return;
    drag.current = { pointerId: event.pointerId, startX: event.clientX, startScroll: el.scrollLeft, moved: false };
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const el = trackRef.current;
    if (!el || drag.current.pointerId !== event.pointerId) return;
    const delta = event.clientX - drag.current.startX;
    if (Math.abs(delta) < 6) return;
    drag.current.moved = true;
    el.scrollLeft = drag.current.startScroll - delta;
  };

  const endDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (drag.current.pointerId === event.pointerId) drag.current.pointerId = -1;
  };

  // A drag that ends on a link must not navigate.
  const onTrackClickCapture = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!drag.current.moved) return;
    event.preventDefault();
    event.stopPropagation();
    drag.current.moved = false;
  };

  const arrowClass =
    'grid h-11 w-11 shrink-0 place-items-center rounded-pill border border-hairline-dark text-ice transition-[background-color,border-color,color,opacity] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-aqua/60 hover:bg-aqua/10 disabled:pointer-events-none disabled:opacity-30';

  return (
    <Section id="industries" tone="deeper" labelledBy="industries-heading" className="overflow-hidden">
      <div
        aria-hidden="true"
        className="water-sheen pointer-events-none absolute inset-0 opacity-30"
      />

      <div className="shell relative">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
          <SectionHeading
            id="industries-heading"
            eyebrow="Industries"
            index="06"
            tone="dark"
            lines={[
              'Engineered for every',
              <>
                industry that <span className="text-aqua">depends on water.</span>
              </>,
            ]}
            lead="Every sector carries its own water pressures — what arrives, what the process demands and what leaves the site. These are the industries A2Care designs for, mapped to the treatment families each duty draws on."
            className="lg:max-w-[58ch]"
          />

          {/* Controls are real buttons; the counter is decoration, the row itself is focusable. */}
          <Reveal delay={0.1} y={12} className="flex shrink-0 items-center gap-5">
            <span className="label tabular-nums text-steel" aria-hidden="true">
              {pad(state.active)}
              <span className="px-1 text-steel/40">/</span>
              <span className="text-steel/60">{pad(industries.length)}</span>
            </span>
            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={() => nudge(-1)}
                disabled={state.atStart}
                aria-label="Scroll to the previous industry"
                className={arrowClass}
              >
                <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
              </button>
              <button
                type="button"
                onClick={() => nudge(1)}
                disabled={state.atEnd}
                aria-label="Scroll to the next industry"
                className={arrowClass}
              >
                <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
              </button>
            </div>
          </Reveal>
        </div>

        {/* Swipe affordance where the row overflows the viewport. */}
        <p className="label mt-8 text-aqua/80 lg:hidden">Swipe the row · {industries.length} industries</p>

        {/* ------------------------------------------ snap row */}
        <div
          ref={trackRef}
          data-lenis-prevent
          tabIndex={0}
          role="group"
          aria-label={`Industries served — scrollable list of ${industries.length} sectors`}
          onScroll={scheduleMeasure}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onPointerLeave={endDrag}
          onClickCapture={onTrackClickCapture}
          className={cn(
            'mt-8 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-3',
            '[scrollbar-width:none] cursor-grab select-none active:cursor-grabbing',
            reduced ? '' : 'motion-safe:scroll-smooth',
            'focus-visible:rounded-panel focus-visible:outline-offset-[-6px]',
          )}
        >
          {industries.map((industry, index) => (
            <IndustryCard key={industry.slug} index={index} reduced={reduced} />
          ))}
        </div>

        {/* ------------------------------------------ progress */}
        <div className="mt-8 flex items-center gap-6">
          <div aria-hidden="true" className="h-px flex-1 bg-hairline-dark">
            <span
              className="block h-px origin-left bg-aqua/70 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none"
              style={{ transform: `scaleX(${0.12 + state.progress * 0.88})` }}
            />
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <Cta href="/industries" tone="outlineDark" ariaLabel="See all industries A2Care India serves">
              All industries
            </Cta>
            <Cta
              href="/contact"
              tone="ghost"
              icon={<ArrowRight className="h-4 w-4" strokeWidth={1.6} />}
              ariaLabel="Send A2Care India your water requirement"
            >
              Send your duty
            </Cta>
          </div>
        </div>
      </div>
    </Section>
  );
}

/** One sector: its pressure points and the solution families it maps to. */
function IndustryCard({ index, reduced }: { index: number; reduced: boolean | null }) {
  const industry = industries[index];
  if (!industry) return null;

  const linked = industry.solutions
    .map((slug) => getProduct(slug))
    .filter((product): product is Product => product !== undefined);

  return (
    <motion.article
      initial={reduced ? false : { opacity: 0, y: 18 }}
      whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: EASE, delay: Math.min(index * 0.04, 0.2) }}
      className={cn(
        'group relative flex w-[calc(100%-2.5rem)] shrink-0 snap-start flex-col rounded-panel border border-hairline-dark bg-navy/70 p-6 md:p-7',
        // Always keep a sliver of the next card in view so the row reads as scrollable.
        'sm:w-[calc(50%-1.25rem)] lg:w-[calc(33.333%-1.4rem)]',
        reduced ? '' : 'motion-safe:transition-colors motion-safe:duration-500',
        'hover:border-aqua/35 focus-within:border-aqua/35',
      )}
    >
      {/* Hairline that draws across the card top on hover/focus. */}
      <span
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute inset-x-6 top-0 h-px origin-left bg-aqua/60 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none',
          reduced ? 'scale-x-100 opacity-40' : 'scale-x-0 group-hover:scale-x-100 group-focus-within:scale-x-100',
        )}
      />

      <div className="flex items-start justify-between gap-4">
        <span className="label tabular-nums text-steel">{pad(index + 1)}</span>
        <span className="label text-aqua/70">{pad(linked.length)} families</span>
      </div>

      <h3 className="display-sm mt-4 max-w-[22ch] text-ice">{industry.name}</h3>

      <p className="mt-3 text-[0.92rem] leading-[1.62] text-steel">{industry.description}</p>

      <ul className="mt-5 flex flex-wrap gap-2">
        {industry.drivers.map((driver) => (
          <li
            key={driver}
            className="rounded-pill border border-hairline-dark px-3 py-1.5 text-[0.72rem] leading-[1.3] text-ice/70 transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-safe:group-hover:border-aqua/30 motion-safe:group-hover:text-ice/90 motion-reduce:border-aqua/25"
          >
            {driver}
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-6">
        <p className="label text-steel">Related systems</p>
        <ul className="mt-3 flex flex-col">
          {linked.map((product) => (
            <li key={product.slug} className="border-t border-hairline-dark">
              <Link
                href={`/products/${product.slug}`}
                aria-label={`${product.name} for ${industry.name}`}
                className="group/row flex items-center gap-3 py-3"
              >
                <span
                  aria-hidden="true"
                  className="relative grid h-10 w-12 shrink-0 place-items-center overflow-hidden rounded-pill border border-hairline-dark bg-abyss"
                >
                  <AssetMotif
                    kind={motifFor(product.mediaId)}
                    className={cn(
                      'h-7 w-10 text-aqua/55 transition-[transform,color] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none',
                      reduced
                        ? ''
                        : 'motion-safe:group-hover/row:scale-[1.12] motion-safe:group-hover/row:text-electric',
                    )}
                  />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[0.92rem] text-ice/85 transition-colors duration-300 group-hover/row:text-aqua">
                    {product.name}
                  </span>
                  <span
                    aria-hidden="true"
                    className={cn(
                      'mt-1 block h-px w-full origin-left bg-aqua/50 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none',
                      reduced ? 'scale-x-100 opacity-40' : 'scale-x-0 group-hover/row:scale-x-100 group-focus-within/row:scale-x-100',
                    )}
                  />
                </span>
                <ArrowUpRight className="h-4 w-4 shrink-0 text-steel transition-colors duration-300 group-hover/row:text-aqua" strokeWidth={1.5} />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </motion.article>
  );
}
