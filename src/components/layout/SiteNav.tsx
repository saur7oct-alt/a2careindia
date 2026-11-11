'use client';

import Link from 'next/link';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent,
} from 'react';
import { usePathname } from 'next/navigation';
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/cn';
import { scrollToId } from '@/lib/lenis';
import { products } from '@/data/products';
import { site } from '@/lib/site';
import { Logo } from '@/components/ui/Logo';
import { ArrowRight, Cta } from '@/components/ui/Cta';
import { MobileMenu } from '@/components/layout/MobileMenu';

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* ---------------------------------- nav model ---------------------------------- */

export type NavLeaf = { label: string; href: string };
export type NavMenu = { caption: string; links: NavLeaf[] };
export type NavItem = { label: string; href: string; menu?: NavMenu };

const solutionsMenu: NavMenu = {
  caption: 'Capability groups',
  links: [
    { label: 'Water Treatment', href: '/solutions#water-treatment' },
    { label: 'Effluent & Reuse', href: '/solutions#effluent-reuse' },
    { label: 'Process Cooling', href: '/solutions#process-cooling' },
  ],
};

const productsMenu: NavMenu = {
  caption: 'Everything we engineer',
  links: products.map((product) => ({
    label: product.name,
    href: `/products/${product.slug}`,
  })),
};

const navItems: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about' },
  { label: 'Solutions', href: '/solutions', menu: solutionsMenu },
  { label: 'Products', href: '/products', menu: productsMenu },
  { label: 'Projects', href: '/projects' },
  { label: 'Industries', href: '/industries' },
  { label: 'Contact', href: '/contact' },
];

const isActivePath = (pathname: string, href: string) =>
  href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`);

/* ------------------------------------ header ------------------------------------- */

/**
 * Fixed chrome. 88px on desktop / 72px on mobile, and it never grows a second row, so
 * page heroes can be laid out against a known constant. Transparent over the hero,
 * `glass-dark` once the reader has travelled past it.
 */
export function SiteNav() {
  const reduced = useReducedMotion();
  const pathname = usePathname();
  const { scrollY } = useScroll();

  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeTimer = useRef<number | null>(null);
  // `scrollY` reports every scrolled frame. The header only has two states, so the
  // setState is gated: without the ref this re-renders the whole nav 60 times a second.
  const wasScrolled = useRef(false);

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const next = latest > 24;
    if (next === wasScrolled.current) return;
    wasScrolled.current = next;
    setScrolled(next);
  });

  const clearClose = useCallback(() => {
    if (closeTimer.current !== null) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }, []);

  const openItem = useCallback(
    (label: string) => {
      clearClose();
      setOpenMenu(label);
    },
    [clearClose],
  );

  // Delayed close gives the pointer a bridge to travel from trigger to panel.
  const closeSoon = useCallback(() => {
    clearClose();
    closeTimer.current = window.setTimeout(() => setOpenMenu(null), 140);
  }, [clearClose]);

  const closeNow = useCallback(() => {
    clearClose();
    setOpenMenu(null);
  }, [clearClose]);

  const closeMobileMenu = useCallback(() => setMobileOpen(false), []);

  useEffect(() => () => clearClose(), [clearClose]);

  // Route change always drops both surfaces; nothing stays open behind a new page.
  useEffect(() => {
    setMobileOpen(false);
    setOpenMenu(null);
  }, [pathname]);

  const handleNavigate = useCallback(
    (href: string, event: MouseEvent<HTMLAnchorElement>) => {
      const [path, hash] = href.split('#');
      // A hash link aimed at the page we are already on scrolls in place; navigating
      // elsewhere is left to the router.
      if (hash && (!path || path === pathname)) {
        event.preventDefault();
        scrollToId(hash);
      }
      closeNow();
      setMobileOpen(false);
    },
    [closeNow, pathname],
  );

  return (
    <>
      <motion.header
        initial={reduced ? false : { y: -28, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: EASE, delay: 0.1 }}
        className="fixed inset-x-0 top-0 z-50"
      >
        <div className="relative">
          {/* Crossfade layer: glass-dark cannot be reached by a background transition
              (it paints a gradient), so opacity carries the change. */}
          <motion.div
            aria-hidden="true"
            initial={false}
            animate={{ opacity: scrolled ? 1 : 0 }}
            transition={{ duration: reduced ? 0 : 0.4, ease: EASE }}
            className="glass-dark pointer-events-none absolute inset-0"
          />

          <div className="shell relative flex h-[72px] items-center justify-between gap-6 lg:h-[88px]">
            <Link
              href="/"
              aria-label={`${site.name} — home`}
              className="shrink-0"
              onClick={(event) => handleNavigate('/', event)}
            >
              {/* Two marks, one per breakpoint: the display toggle lives on the wrappers so
                  it never competes with the tokens inside Logo itself. */}
              <span className="lg:hidden">
                <Logo tone="light" compact />
              </span>
              <span className="hidden lg:inline-block">
                <Logo tone="light" />
              </span>
            </Link>

            <nav aria-label="Primary" className="hidden items-center gap-0.5 lg:flex">
              {navItems.map((item) =>
                item.menu ? (
                  <NavDropdown
                    key={item.href}
                    item={item}
                    reduced={reduced}
                    active={isActivePath(pathname, item.href)}
                    open={openMenu === item.label}
                    onOpen={() => openItem(item.label)}
                    onClose={closeSoon}
                    onNavigate={handleNavigate}
                  />
                ) : (
                  <TopLink
                    key={item.href}
                    item={item}
                    reduced={reduced}
                    active={isActivePath(pathname, item.href)}
                    onNavigate={handleNavigate}
                  />
                ),
              )}
            </nav>

            <div className="flex items-center gap-2 lg:gap-4">
              <span className="hidden lg:inline-flex">
                <Cta href="/contact" tone="aqua" icon={<ArrowRight />} magnetic={false}>
                  Get a Quote
                </Cta>
              </span>

              <button
                type="button"
                onClick={() => setMobileOpen((value) => !value)}
                aria-expanded={mobileOpen}
                aria-controls="mobile-menu"
                aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                className="grid h-11 w-11 place-items-center rounded-pill border border-hairline-dark text-ice transition-colors duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-aqua/60 hover:text-aqua lg:hidden"
              >
                <span className="relative flex h-[18px] w-[22px] flex-col justify-between" aria-hidden="true">
                  <motion.span
                    className="block h-px w-full bg-current"
                    initial={false}
                    animate={
                      mobileOpen
                        ? { y: 8.5, rotate: 45 }
                        : { y: 0, rotate: 0 }
                    }
                    transition={{ duration: reduced ? 0 : 0.3, ease: EASE }}
                  />
                  <motion.span
                    className="block h-px w-full bg-current"
                    initial={false}
                    animate={{ opacity: mobileOpen ? 0 : 1, scaleX: mobileOpen ? 0.5 : 1 }}
                    transition={{ duration: reduced ? 0 : 0.2, ease: EASE }}
                  />
                  <motion.span
                    className="block h-px w-full bg-current"
                    initial={false}
                    animate={
                      mobileOpen
                        ? { y: -8.5, rotate: -45 }
                        : { y: 0, rotate: 0 }
                    }
                    transition={{ duration: reduced ? 0 : 0.3, ease: EASE }}
                  />
                </span>
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      <MobileMenu
        open={mobileOpen}
        onClose={closeMobileMenu}
        items={navItems}
        onNavigate={handleNavigate}
      />
    </>
  );
}

/* ---------------------------------- link pieces ---------------------------------- */

type TopLinkProps = {
  item: NavItem;
  active: boolean;
  reduced: boolean | null;
  onNavigate: (href: string, event: MouseEvent<HTMLAnchorElement>) => void;
};

function TopLink({ item, active, reduced, onNavigate }: TopLinkProps) {
  return (
    <Link
      href={item.href}
      onClick={(event) => onNavigate(item.href, event)}
      aria-current={active ? 'page' : undefined}
      className="group relative px-3.5 py-2 font-display text-[0.92rem] font-medium tracking-[-0.01em] text-ice/72 transition-colors duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:text-ice focus-visible:text-ice"
    >
      {item.label}
      <Underline active={active} reduced={reduced} />
    </Link>
  );
}

/** scaleX from the left edge — reads as a line being drawn, not a block appearing. */
function Underline({ active, reduced }: { active: boolean; reduced: boolean | null }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute bottom-0 left-3.5 right-3.5 h-px origin-left bg-aqua',
        active ? 'scale-x-100' : 'scale-x-0',
        !active && 'group-hover:scale-x-100 group-focus-visible:scale-x-100',
        reduced ? undefined : 'transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]',
      )}
    />
  );
}

type NavDropdownProps = {
  item: NavItem;
  active: boolean;
  open: boolean;
  reduced: boolean | null;
  onOpen: () => void;
  onClose: () => void;
  onNavigate: (href: string, event: MouseEvent<HTMLAnchorElement>) => void;
};

function NavDropdown({ item, active, open, reduced, onOpen, onClose, onNavigate }: NavDropdownProps) {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const menu = item.menu;
  const panelId = `nav-menu-${item.label.toLowerCase().replace(/\s+/g, '-')}`;

  if (!menu) return null;

  const focusFirstItem = () => {
    panelRef.current?.querySelector<HTMLAnchorElement>('[role="menuitem"]')?.focus();
  };

  return (
    <div
      className="relative"
      onMouseEnter={onOpen}
      onMouseLeave={onClose}
      onFocus={onOpen}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) onClose();
      }}
      onKeyDown={(event) => {
        if (event.key === 'Escape') {
          event.preventDefault();
          onClose();
          triggerRef.current?.focus();
        }
      }}
    >
      <button
        ref={triggerRef}
        type="button"
        onClick={() => (open ? onClose() : onOpen())}
        onKeyDown={(event) => {
          if (event.key === 'ArrowDown') {
            event.preventDefault();
            onOpen();
            // The panel mounts on this frame, so focus lands after paint.
            window.setTimeout(focusFirstItem, 0);
          }
        }}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={panelId}
        className="group relative flex items-center gap-1.5 px-3.5 py-2 font-display text-[0.92rem] font-medium tracking-[-0.01em] text-ice/72 transition-colors duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:text-ice focus-visible:text-ice"
      >
        {item.label}
        <ChevronDown
          className={cn(
            'h-3.5 w-3.5 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]',
            open ? 'rotate-180 text-aqua' : 'text-aqua/60',
          )}
          aria-hidden="true"
        />
        <Underline active={active} reduced={reduced} />
      </button>

      {/* Static positioning shell: framer-motion owns the panel's transform, so the
          centring translate lives on the wrapper instead of being overwritten. */}
      <div
        className={cn(
          'pointer-events-none absolute left-1/2 top-full z-10 -translate-x-1/2 pt-3',
          menu.links.length > 4 ? 'w-[min(36rem,88vw)]' : 'w-[min(21rem,88vw)]',
        )}
      >
        <AnimatePresence>
          {open ? (
            <motion.div
              key={panelId}
              ref={panelRef}
              id={panelId}
              role="menu"
              aria-label={`${item.label} menu`}
              initial={reduced ? false : { opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: reduced ? 0 : 0.3, ease: EASE }}
              className="glass-dark pointer-events-auto rounded-panel p-2"
            >
              <div className="flex items-baseline justify-between gap-4 px-3 pb-2 pt-1.5">
                <span className="label text-aqua/70">{menu.caption}</span>
                <Link
                  href={item.href}
                  role="menuitem"
                  onClick={(event) => onNavigate(item.href, event)}
                  className="label text-steel transition-colors duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:text-ice"
                >
                  View all
                </Link>
              </div>

              <div className={cn('flex flex-col gap-0.5', menu.links.length > 4 && 'grid grid-cols-2')}>
                {menu.links.map((leaf, index) => (
                  <MenuRow key={leaf.href} leaf={leaf} index={index} onNavigate={onNavigate} />
                ))}
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}

function MenuRow({
  leaf,
  index,
  onNavigate,
}: {
  leaf: { label: string; href: string };
  index: number;
  onNavigate: (href: string, event: MouseEvent<HTMLAnchorElement>) => void;
}) {
  return (
    <Link
      href={leaf.href}
      role="menuitem"
      onClick={(event) => onNavigate(leaf.href, event)}
      className="group/row flex items-center gap-3 rounded-panel px-3 py-2.5 text-[0.88rem] text-ice/72 outline-none transition-colors duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-aqua/[0.08] hover:text-ice focus-visible:bg-aqua/[0.08] focus-visible:text-ice"
    >
      <span className="label w-5 shrink-0 text-aqua/40">
        {String(index + 1).padStart(2, '0')}
      </span>
      <span className="flex-1 leading-snug">{leaf.label}</span>
      <ArrowRight
        className={cn(
          'h-3.5 w-3.5 shrink-0 text-aqua opacity-0',
          'transition-opacity duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/row:opacity-100 group-focus-visible/row:opacity-100',
        )}
      />
    </Link>
  );
}
