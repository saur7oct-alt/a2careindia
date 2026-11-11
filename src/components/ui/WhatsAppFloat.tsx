'use client';

import { useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from 'framer-motion';
import { cn } from '@/lib/cn';
import { site, whatsappHref } from '@/lib/site';

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/**
 * Brand mark drawn inline rather than pulled from an icon set: WhatsApp is a registered
 * brand and the glyph has to stay exact. Path data is the official Simple Icons outline.
 * Exported so the mobile menu and footer reuse one copy instead of re-drawing it.
 */
export function WhatsAppGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={cn('h-5 w-5', className)}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}

/**
 * Persistent enquiry route. Bottom-LEFT on purpose: the back-to-top ring already owns the
 * bottom-right slot, and the two must never stack or fight for the same pixel.
 */
export function WhatsAppFloat() {
  const reduced = useReducedMotion();
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(false);
  // `scrollY` changes on every scrolled frame; only the 40%-of-viewport crossing matters.
  const shown = useRef(false);

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const threshold = (typeof window !== 'undefined' ? window.innerHeight : 800) * 0.4;
    const next = latest > threshold;
    if (next === shown.current) return;
    shown.current = next;
    setVisible(next);
  });

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          key="whatsapp-float"
          initial={reduced ? false : { opacity: 0, y: 16, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.94 }}
          transition={{ duration: reduced ? 0 : 0.45, ease: EASE }}
          className="fixed bottom-5 left-5 z-40 md:bottom-8 md:left-8"
        >
          <a
            href={whatsappHref()}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Chat with ${site.name} on WhatsApp`}
            className="group relative flex items-center gap-0 rounded-pill bg-aqua text-navy outline-none transition-[gap,background-color] duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] hover:gap-2 focus-visible:gap-2"
          >
            {/* Idle pulse: a ring that breathes until the reader engages. Never under reduced motion. */}
            {!reduced ? (
              <span
                aria-hidden="true"
                className="absolute inset-0 rounded-pill border border-aqua/60 [animation:ripple-breathe_3.6s_ease-in-out_infinite]"
              />
            ) : null}

            <span className="relative grid h-12 w-12 shrink-0 place-items-center md:h-[52px] md:w-[52px]">
              <WhatsAppGlyph className="h-[22px] w-[22px]" />
            </span>

            {/* Label is collapsed to zero width, so it stays out of the layout until hover/focus. */}
            <span className="max-w-0 overflow-hidden whitespace-nowrap font-display text-[0.86rem] font-medium transition-[max-width] duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:max-w-[10.5rem] group-focus-visible:max-w-[10.5rem]">
              Chat on WhatsApp
            </span>
          </a>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
