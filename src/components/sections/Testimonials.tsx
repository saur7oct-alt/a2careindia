'use client';

import { useEffect, useRef, useState, type KeyboardEvent, type TouchEvent } from 'react';
import { AnimatePresence, motion, useReducedMotion, type Variants } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { testimonials } from '@/data/testimonials';
import { Section, SectionHeading } from '@/components/ui/Section';
import { cn } from '@/lib/cn';

const EASE = [0.16, 1, 0.3, 1] as const;
const AUTO_ADVANCE_MS = 7000;

const slideVariants: Variants = {
  enter: (direction: number) => ({ opacity: 0, y: direction >= 0 ? 34 : -34 }),
  center: { opacity: 1, y: 0 },
  exit: (direction: number) => ({ opacity: 0, y: direction >= 0 ? -34 : 34 }),
};

/** True while the visitor is actually typing in a field anywhere on the page. */
function isTyping(): boolean {
  const element = document.activeElement as HTMLElement | null;
  if (!element) return false;
  const tag = element.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || element.isContentEditable === true;
}

/**
 * Section 12 — customer statements.
 *
 * Quotes are verbatim records; this component never edits or re-wraps the text, it only
 * paginates through them. Auto-advance pauses on hover and focus, is blocked while the
 * tab is hidden or a visitor is typing, and never runs under reduced motion. Swipe,
 * arrow keys and buttons all move the same index; the viewport is a polite live region.
 */
export function Testimonials() {
  const reduced = useReducedMotion();
  const count = testimonials.length;

  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const pausedRef = useRef(false);
  const touchStartX = useRef<number | null>(null);

  const paginate = (delta: number) => {
    setDirection(delta);
    setIndex((current) => (current + delta + count) % count);
  };

  const goTo = (target: number) => {
    if (target === index) return;
    setDirection(target > index ? 1 : -1);
    setIndex(target);
  };

  useEffect(() => {
    if (reduced) return;
    const timer = window.setInterval(() => {
      if (pausedRef.current) return;
      if (document.hidden) return;
      if (isTyping()) return;
      setDirection(1);
      setIndex((current) => (current + 1) % count);
    }, AUTO_ADVANCE_MS);
    return () => window.clearInterval(timer);
  }, [reduced, count]);

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    touchStartX.current = event.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current === null) return;
    const delta = (event.changedTouches[0]?.clientX ?? touchStartX.current) - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(delta) > 48) paginate(delta < 0 ? 1 : -1);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      paginate(1);
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      paginate(-1);
    }
  };

  const current = testimonials[index];
  const transition = reduced ? { duration: 0 } : { duration: 0.55, ease: EASE };

  return (
    <Section id="testimonials" tone="light" labelledBy="testimonials-heading">
      <div className="shell">
        <SectionHeading
          id="testimonials-heading"
          index="12"
          eyebrow="In their words"
          tone="light"
          lines={['Trusted by the people', 'who depend on us.']}
          lead="Every statement below is quoted exactly as the customer gave it. Nothing sharpened, nothing invented."
        />

        <div
          role="group"
          aria-roledescription="carousel"
          aria-labelledby="testimonials-heading"
          className="relative mt-14 md:mt-20"
          onMouseEnter={() => {
            pausedRef.current = true;
          }}
          onMouseLeave={() => {
            pausedRef.current = false;
          }}
          onFocusCapture={() => {
            pausedRef.current = true;
          }}
          onBlurCapture={() => {
            pausedRef.current = false;
          }}
          onKeyDown={handleKeyDown}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          tabIndex={0}
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -top-10 left-1/2 z-0 -translate-x-1/2 select-none font-display text-[8rem] leading-none text-electric/15 md:-top-16 md:text-[11rem]"
          >
            &ldquo;
          </span>

          {/* Viewport — polite so the replacement quote is announced */}
          <div aria-live="polite" className="touch-pan-y relative z-10 min-h-[24rem] sm:min-h-[20rem] md:min-h-[17rem]">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.figure
                key={index}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={transition}
                role="group"
                aria-roledescription="slide"
                aria-label={`Testimonial ${index + 1} of ${count} — ${current.name}`}
                className="mx-auto flex max-w-[46rem] flex-col items-center text-center"
              >
                <blockquote className="display-md max-w-[34ch] text-navy md:max-w-[30ch]">
                  {current.quote}
                </blockquote>

                <figcaption className="mt-9 flex flex-col items-center gap-3">
                  <span className="font-display text-[1.15rem] font-medium tracking-[-0.01em] text-navy">
                    {current.name}
                  </span>
                  <span className="flex flex-col items-center gap-2">
                    <span className="label text-steel">{current.organisation}</span>
                    <span className="label text-steel">
                      {current.project} · {current.location}
                    </span>
                  </span>
                </figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>

          {/* -------------------------------------------------- Controls */}
          <div className="mt-10 flex items-center justify-center gap-6">
            <button
              type="button"
              aria-label="Previous testimonial"
              onClick={() => paginate(-1)}
              className="rounded-full border border-hairline-light p-3 text-navy/65 transition-colors duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-electric/50 hover:text-electric"
            >
              <ChevronLeft size={18} aria-hidden="true" />
            </button>

            <div className="flex items-center gap-2.5" role="group" aria-label="Choose a testimonial">
              {testimonials.map((testimonial, dotIndex) => (
                <button
                  key={`${testimonial.name}-${testimonial.project}`}
                  type="button"
                  aria-label={`Show testimonial ${dotIndex + 1} of ${count} — ${testimonial.name}`}
                  aria-current={dotIndex === index ? 'true' : undefined}
                  onClick={() => goTo(dotIndex)}
                  className={cn(
                    'h-2 rounded-full transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]',
                    dotIndex === index ? 'w-7 bg-electric' : 'w-2 bg-navy/20 hover:bg-navy/40',
                  )}
                />
              ))}
            </div>

            <button
              type="button"
              aria-label="Next testimonial"
              onClick={() => paginate(1)}
              className="rounded-full border border-hairline-light p-3 text-navy/65 transition-colors duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-electric/50 hover:text-electric"
            >
              <ChevronRight size={18} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </Section>
  );
}
