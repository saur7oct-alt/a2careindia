'use client';

import Link from 'next/link';
import { useEffect, useRef, type MouseEvent, type ReactNode } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Facebook, Instagram, Linkedin, Mail, Phone, Twitter } from 'lucide-react';
import { cn } from '@/lib/cn';
import { setScrollLock } from '@/lib/lenis';
import { mailHref, site, telHref, whatsappHref } from '@/lib/site';
import { Logo } from '@/components/ui/Logo';
import { ArrowRight, Cta } from '@/components/ui/Cta';
import { LineReveal, Stagger, StaggerItem } from '@/components/motion/Reveal';
import { WhatsAppGlyph } from '@/components/ui/WhatsAppFloat';
import type { NavItem } from '@/components/layout/SiteNav';

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const socialLinks: { label: string; href: string; icon: ReactNode }[] = [
  { label: 'Facebook', href: site.socials.facebook, icon: <Facebook className="h-4 w-4" /> },
  { label: 'Instagram', href: site.socials.instagram, icon: <Instagram className="h-4 w-4" /> },
  { label: 'LinkedIn', href: site.socials.linkedin, icon: <Linkedin className="h-4 w-4" /> },
  { label: 'X', href: site.socials.twitter, icon: <Twitter className="h-4 w-4" /> },
];

export type MobileMenuProps = {
  open: boolean;
  onClose: () => void;
  /** The same model the desktop header renders, passed down so neither file owns it twice. */
  items: NavItem[];
  /** Closes the overlay and lets <SiteNav> decide whether a hash link should scroll in place. */
  onNavigate: (href: string, event: MouseEvent<HTMLAnchorElement>) => void;
};

/**
 * Full-screen overlay for touch and narrow viewports. Mounts only while open, locks the
 * background through the shared Lenis lock, and always hands scrolling back — on close,
 * on unmount, and on Escape.
 */
export function MobileMenu({ open, onClose, items, onNavigate }: MobileMenuProps) {
  const reduced = useReducedMotion();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  // Held in a ref so the lock effect keys on `open` alone: a re-render of the header
  // must not re-run the effect and yank focus back to the close button.
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!open) return;

    setScrollLock(true);
    returnFocusRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;

    const focusTimer = window.setTimeout(() => closeButtonRef.current?.focus(), 80);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onCloseRef.current();
    };
    document.addEventListener('keydown', onKeyDown);

    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener('keydown', onKeyDown);
      // Runs on close AND on unmount, so the page can never be left scroll-locked.
      setScrollLock(false);
      returnFocusRef.current?.focus();
      returnFocusRef.current = null;
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          key="mobile-menu"
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-labelledby="mobile-menu-title"
          data-lenis-prevent
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduced ? 0 : 0.35, ease: EASE }}
          className="fixed inset-0 z-[95] flex flex-col bg-abyss lg:hidden"
        >
          <div className="water-sheen pointer-events-none absolute inset-0 opacity-70" aria-hidden="true" />

          <div className="relative flex h-[72px] shrink-0 items-center justify-between lg:h-[88px]">
            <div className="shell flex items-center justify-between">
              <Logo tone="light" compact />
              <button
                ref={closeButtonRef}
                type="button"
                onClick={onClose}
                aria-label="Close menu"
                className="grid h-11 w-11 place-items-center rounded-pill border border-hairline-dark text-ice transition-colors duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-aqua/60 hover:text-aqua"
              >
                <span className="relative flex h-[18px] w-[22px] items-center justify-center">
                  <motion.span
                    className="absolute h-px w-full origin-center bg-current"
                    initial={false}
                    animate={{ rotate: 45 }}
                    transition={{ duration: reduced ? 0 : 0.3, ease: EASE }}
                  />
                  <motion.span
                    className="absolute h-px w-full origin-center bg-current"
                    initial={false}
                    animate={{ rotate: -45 }}
                    transition={{ duration: reduced ? 0 : 0.3, ease: EASE }}
                  />
                </span>
              </button>
            </div>
          </div>

          <div className="relative h-px w-full bg-hairline-dark" aria-hidden="true" />

          <div data-lenis-prevent className="shell relative flex-1 overflow-y-auto py-8">
            <LineReveal
              as="h2"
              id="mobile-menu-title"
              lines={['Site menu']}
              className="display-md text-ice"
              lineClassName="text-ice"
              delay={0.05}
            />

            <Stagger stagger={0.055} className="mt-8 flex flex-col" amount={0.15}>
              {items.map((item, index) => (
                <StaggerItem key={item.href} className="border-b border-hairline-dark/70 py-1">
                  <Link
                    href={item.href}
                    onClick={(event) => onNavigate(item.href, event)}
                    className="group flex items-baseline gap-4 py-3"
                  >
                    <span className="label w-6 shrink-0 text-aqua/50">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="display-sm text-ice transition-colors duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:text-aqua">
                      {item.label}
                    </span>
                  </Link>

                  {item.menu ? (
                    <ul className="mb-3 ml-10 flex flex-col gap-0.5 border-l border-hairline-dark pl-5">
                      {item.menu.links.map((leaf) => (
                        <li key={leaf.href}>
                          <Link
                            href={leaf.href}
                            onClick={(event) => onNavigate(leaf.href, event)}
                            className="flex items-center gap-2 py-1.5 text-[0.9rem] text-steel transition-colors duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:text-aqua"
                          >
                            <span className="h-px w-3 bg-aqua/40" aria-hidden="true" />
                            {leaf.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </StaggerItem>
              ))}

              <StaggerItem className="pt-8">
                <Cta href="/contact" icon={<ArrowRight />} magnetic={false} className="w-full">
                  Get a Quote
                </Cta>
              </StaggerItem>

              <StaggerItem className="pt-10">
                <p className="label text-aqua/60">Talk to us now</p>
                <div className="mt-4 flex flex-col gap-2.5">
                  {site.phones.map((phone) => (
                    <a
                      key={phone}
                      href={telHref(phone)}
                      className="flex items-center gap-3 font-mono text-[0.9rem] text-ice/85 transition-colors duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:text-aqua"
                    >
                      <Phone className="h-4 w-4 text-aqua" aria-hidden="true" />
                      {phone}
                    </a>
                  ))}

                  <a
                    href={whatsappHref()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 font-mono text-[0.9rem] text-ice/85 transition-colors duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:text-aqua"
                  >
                    <WhatsAppGlyph className="h-4 w-4 text-aqua" />
                    WhatsApp
                  </a>

                  <a
                    href={mailHref()}
                    className="flex items-center gap-3 text-[0.9rem] text-ice/85 transition-colors duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:text-aqua"
                  >
                    <Mail className="h-4 w-4 text-aqua" aria-hidden="true" />
                    {site.email}
                  </a>
                </div>
              </StaggerItem>

              <StaggerItem className="pt-8">
                <div className="flex flex-wrap items-center gap-2.5">
                  {socialLinks.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${social.label} — opens in a new tab`}
                      className={cn(
                        'grid h-10 w-10 place-items-center rounded-pill border border-hairline-dark text-steel',
                        'transition-colors duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-aqua/60 hover:text-aqua',
                      )}
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>
              </StaggerItem>
            </Stagger>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
