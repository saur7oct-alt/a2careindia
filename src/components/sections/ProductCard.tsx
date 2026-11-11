'use client';

import Link from 'next/link';
import { useReducedMotion } from 'framer-motion';
import type { Product } from '@/data/products';
import { MediaFrame } from '@/components/ui/MediaFrame';
import { ArrowRight } from '@/components/ui/Cta';
import { cn } from '@/lib/cn';

/**
 * One solution family in the portfolio grid.
 *
 * Used by the homepage Solutions section and reusable on /products, so it must stay
 * self-sufficient: it only needs a `Product`, an optional `featured` treatment for the
 * wider editorial slot, and an optional 0-based `index` for the technical number.
 *
 * Interaction contract: the product name carries a stretched pseudo-element link, so the
 * whole card is clickable but keyboard users get exactly one tab stop per card. Hover
 * states are also mirrored on `group-focus-within` so the card reads the same when the
 * link is focused by keyboard.
 */
export function ProductCard({
  product,
  featured = false,
  index,
  sizes,
  priority = false,
}: {
  product: Product;
  featured?: boolean;
  /** 0-based position in the portfolio; rendered as 01, 02, … */
  index?: number;
  /** Responsive hint for the artwork when real photography replaces the stand-in. */
  sizes?: string;
  priority?: boolean;
}) {
  const reduced = useReducedMotion();
  const number = typeof index === 'number' ? String(index + 1).padStart(2, '0') : null;
  const href = `/products/${product.slug}`;
  const highlights = product.highlights.slice(0, featured ? 3 : 2);

  // Under reduced motion the artwork does not scale; the accent line simply presents
  // itself at rest instead of drawing in, so the card never loses its hover cue entirely.
  const zoomClass = reduced
    ? ''
    : 'motion-safe:group-hover/card:scale-[1.04] motion-safe:group-focus-within/card:scale-[1.04]';
  const motifShiftClass = reduced
    ? ''
    : 'motion-safe:group-hover/card:-translate-y-[2%] motion-safe:group-focus-within/card:-translate-y-[2%]';

  return (
    <article
      className={cn(
        'group/card relative',
        featured
          ? 'flex flex-col gap-8 lg:grid lg:grid-cols-[1.15fr_1fr] lg:items-center lg:gap-14'
          : 'flex h-full flex-col',
      )}
    >
      {/* ---------------------------------------------- artwork */}
      <div className="relative overflow-hidden rounded-panel border border-hairline-light bg-navy">
        <MediaFrame
          slotId={product.mediaId}
          priority={priority}
          sizes={
            sizes ??
            (featured
              ? '(min-width: 1024px) 780px, (min-width: 640px) 90vw, 100vw'
              : '(min-width: 1024px) 460px, (min-width: 640px) 45vw, 100vw')
          }
          className={cn(
            'w-full transition-transform duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)]',
            featured ? 'aspect-[16/10]' : 'aspect-[4/3]',
            zoomClass,
          )}
          motifClassName={cn(
            'transition-transform duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)]',
            motifShiftClass,
          )}
        />

        {/* Hairline accent that draws across the artwork edge on hover/focus. */}
        <span
          aria-hidden="true"
          className={cn(
            'pointer-events-none absolute inset-x-0 bottom-0 z-10 h-px origin-left bg-electric/70 transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)]',
            reduced ? 'scale-x-100 opacity-40' : 'scale-x-0 group-hover/card:scale-x-100 group-focus-within/card:scale-x-100',
          )}
        />

        {product.capacityLabel ? (
          <span className="label absolute left-4 top-4 rounded-pill border border-hairline-dark bg-abyss/70 px-3 py-1.5 text-ice/85 backdrop-blur-sm">
            {product.capacityLabel}
          </span>
        ) : null}
      </div>

      {/* ---------------------------------------------- copy */}
      <div className={cn('flex flex-1 flex-col', featured ? 'lg:py-4' : 'pt-7')}>
        <div className="flex items-center gap-3">
          {number ? <span className="label tabular-nums text-electric">{number}</span> : null}
          <span aria-hidden="true" className="h-px w-6 bg-hairline-light" />
          <span className="label text-navy/45">
            {featured ? 'Featured family' : 'System family'}
          </span>
        </div>

        <h3
          className={cn(
            // Base element styles in globals.css already give the display face and weight,
            // so only size/leading are overridden here — no competing type utilities.
            'mt-5 max-w-[24ch] text-navy transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]',
            featured
              ? 'text-[1.65rem] leading-[1.08] tracking-[-0.026em] md:text-[2.05rem]'
              : 'display-sm',
            reduced ? '' : 'motion-safe:group-hover/card:translate-x-1',
          )}
        >
          <Link
            href={href}
            aria-label={`${product.name} — view details`}
            className="after:absolute after:inset-0 after:z-20 after:content-['']"
          >
            {product.name}
          </Link>
        </h3>

        <p
          className={cn(
            'mt-4 leading-[1.65] text-navy/68',
            featured ? 'max-w-[58ch] text-[1.05rem]' : 'max-w-[44ch] text-[0.98rem]',
          )}
        >
          {product.description}
        </p>

        <ul className="mt-6 flex flex-col gap-2.5 border-t border-hairline-light pt-5">
          {highlights.map((highlight) => (
            <li
              key={highlight}
              className="flex items-start gap-3 text-[0.92rem] leading-[1.5] text-navy/72"
            >
              <span aria-hidden="true" className="mt-[0.6rem] h-px w-4 shrink-0 bg-electric/60" />
              <span>{highlight}</span>
            </li>
          ))}
        </ul>

        {/* Stretched link above makes this a single affordance, not a second tab stop. */}
        <span className="mt-auto inline-flex items-center gap-2.5 pt-7 font-display text-[0.92rem] font-medium text-navy">
          <span className="relative">
            Learn more
            <span
              aria-hidden="true"
              className={cn(
                'absolute -bottom-1 left-0 h-px w-full origin-left bg-electric/70 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]',
                reduced ? 'scale-x-100 opacity-40' : 'scale-x-0 group-hover/card:scale-x-100 group-focus-within/card:scale-x-100',
              )}
            />
          </span>
          <ArrowRight
            className={cn(
              'h-4 w-4 text-electric transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]',
              reduced ? '' : 'motion-safe:group-hover/card:translate-x-1.5',
            )}
          />
        </span>
      </div>
    </article>
  );
}
