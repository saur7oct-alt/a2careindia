'use client';

import type Lenis from 'lenis';

/**
 * The Lenis instance created by <SmoothScroll> is published here so navigation, the
 * back-to-top ring and any "scroll to section" trigger can share one scroll authority.
 * When it is null — reduced motion, or no JS yet — every helper falls back to native
 * scrolling rather than dead-ending.
 */
let instance: Lenis | null = null;

export const setLenis = (lenis: Lenis | null) => {
  instance = lenis;
};

export const getLenis = () => instance;

const NAV_OFFSET = 92;

export function scrollToId(id: string, offset = -NAV_OFFSET) {
  const element = document.getElementById(id);
  if (!element) return false;

  if (instance) {
    instance.scrollTo(element, { offset, duration: 1.35 });
    return true;
  }

  element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  return true;
}

export function scrollToTop() {
  if (instance) {
    instance.scrollTo(0, { duration: 1.2 });
    return;
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * While a full-screen menu or modal is open, background scrolling must not leak through.
 * Reads the same body attribute <SmoothScroll> observes, so there is one lock mechanism.
 */
export function setScrollLock(locked: boolean) {
  if (locked) document.body.setAttribute('data-scroll-lock', '');
  else document.body.removeAttribute('data-scroll-lock');

  if (instance) locked ? instance.stop() : instance.start();
  else document.documentElement.style.overflow = locked ? 'hidden' : '';
}
