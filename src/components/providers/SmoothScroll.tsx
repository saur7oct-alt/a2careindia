'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import { useReducedMotion } from 'framer-motion';
import { setLenis } from '@/lib/lenis';

/** Matches --ease-out-expo. Only used by programmatic scrolls — see the note below. */
const EASE = (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t));

/**
 * Lenis smooth scroll.
 *
 * Guardrails, because the brief bans scroll hijacking and demands native behaviour work:
 *  - disabled entirely under prefers-reduced-motion, leaving native scrolling;
 *  - only wheel/touch is eased — the scroll position itself stays native, so
 *    framer-motion's useScroll, sticky elements and anchor links all keep working;
 *  - in-page anchors are routed through Lenis so they match the scroll feel;
 *  - modals and inner scrollers are handled by setScrollLock / data-lenis-prevent.
 *
 * Feel: smoothing is driven by `lerp`, not `duration`. Lenis damps a lerp
 * frame-rate-independently (`1 - e^(-lerp * 60 * dt)`), so a trackpad, a notched wheel and
 * a 120Hz display all track the same. A fixed `duration` restarts the easing curve from the
 * current value on *every* wheel event, which is exactly what reads as the page lagging
 * behind the input. `easing` is still declared because Lenis only prefers duration+easing
 * over lerp when both are set — that is what keeps `scrollToId`/`scrollToTop` animated.
 */
export function SmoothScroll() {
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;

    const lenis = new Lenis({
      // The whole feel of the scroll lives on this one number. ~0.1 is Lenis' own
      // default: close enough behind the input to feel direct, smooth enough to settle.
      lerp: 0.1,
      // Inherited by programmatic scrolls (see the class doc above).
      easing: EASE,
      smoothWheel: true,
      wheelMultiplier: 1,
      // Touch keeps native momentum; Lenis never takes the gesture over.
      syncTouch: false,
    });
    setLenis(lenis);

    let raf = 0;
    let active = true;
    // One loop, one clock: Lenis is advanced by our rAF rather than `autoRaf`, so the
    // instance and the page can never drift onto two different frame sources.
    const loop = (time: number) => {
      if (!active) return;
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const onAnchor = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const anchor = target?.closest<HTMLAnchorElement>('a[href^="#"]');
      if (!anchor) return;

      const raw = anchor.getAttribute('href');
      if (!raw || raw === '#') return;

      const decoded = decodeURIComponent(raw.slice(1));
      const element = document.getElementById(decoded);
      if (!element) return;

      event.preventDefault();
      lenis.scrollTo(element, { offset: -92, duration: 1.4 });

      // Keep the URL honest so the section remains linkable.
      window.history.pushState(null, '', `#${decoded}`);
    };

    document.addEventListener('click', onAnchor);

    return () => {
      // Cancel the pending frame *and* stop the loop, so a late tick cannot call
      // `raf` on a destroyed instance.
      active = false;
      cancelAnimationFrame(raf);
      document.removeEventListener('click', onAnchor);
      setLenis(null);
      lenis.destroy();
    };
  }, [reduced]);

  return null;
}
