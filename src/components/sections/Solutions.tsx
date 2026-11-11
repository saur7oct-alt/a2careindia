'use client';

import { useReducedMotion } from 'framer-motion';
import { Section, SectionHeading } from '@/components/ui/Section';
import { Reveal, Stagger, StaggerItem } from '@/components/motion/Reveal';
import { ArrowRight, Cta } from '@/components/ui/Cta';
import { ProductCard } from './ProductCard';
import { products } from '@/data/products';
import { cn } from '@/lib/cn';

/**
 * Asymmetric column spans for the portfolio (12-column grid, lg and up).
 * One full-width feature card, then two-equal, then two deliberately uneven rows, so the
 * reading rhythm varies down the page instead of presenting seven identical boxes.
 * Below lg the grid collapses to a single column with the same typographic scale.
 */
const COLUMN_SPANS = [
  'md:col-span-2 lg:col-span-12',
  'lg:col-span-6',
  'lg:col-span-6',
  'lg:col-span-5',
  'lg:col-span-7',
  'lg:col-span-7',
  'lg:col-span-5',
];

/**
 * Section 05 — the solution portfolio.
 * Light ground, because this is the detailed product read; the cinematic dark blocks sit
 * either side of it.
 */
export function Solutions() {
  // Hover zoom/reveal intensity is handed to the cards via motion-safe CSS, but the
  // section still checks the preference so the reveal amounts can be calmed if needed.
  const reduced = useReducedMotion();

  return (
    <Section id="solutions" tone="light" labelledBy="solutions-heading">
      <div className="shell">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
          <SectionHeading
            id="solutions-heading"
            eyebrow="Solutions"
            index="05"
            tone="light"
            lines={[
              <>
                <span className="text-electric">{products.length} solution families.</span>
              </>,
              'Each one engineered to the site.',
            ]}
            lead="Reverse osmosis, effluent and sewage treatment, dosing, rainwater and process cooling — designed against feed water analysis and the duty the plant has to hold, then fabricated, installed and commissioned as one package."
            className="lg:max-w-[52ch]"
          />

          <Reveal
            delay={0.1}
            y={14}
            className="shrink-0 border-t border-hairline-light pt-6 lg:min-w-[16rem]"
          >
            <p className="label text-navy/45">Scope of supply</p>
            <p className="mt-3 max-w-[30ch] text-[0.92rem] leading-[1.6] text-navy/68">
              Engineer · Manufacture · Supply · Install · Maintain — across India.
            </p>
          </Reveal>
        </div>

        <Stagger
          stagger={reduced ? 0 : 0.07}
          amount={0.1}
          className="mt-16 grid grid-cols-1 gap-x-8 gap-y-16 md:grid-cols-2 lg:grid-cols-12 lg:gap-y-20"
        >
          {products.map((product, index) => (
            <StaggerItem
              key={product.slug}
              y={reduced ? 0 : 22}
              className={cn(COLUMN_SPANS[index] ?? 'lg:col-span-6', 'h-full')}
            >
              <ProductCard
                product={product}
                featured={index === 0}
                index={index}
                priority={index === 0}
              />
            </StaggerItem>
          ))}
        </Stagger>

        <div className="mt-16 flex flex-col gap-8 border-t border-hairline-light pt-8 md:mt-20 md:flex-row md:items-end md:justify-between">
          <p className="max-w-[62ch] text-[0.9rem] leading-[1.65] text-navy/55">
            Recovery ratios, housing materials, instrumentation and control arrangements are
            configuration choices confirmed per project — specification sheets are issued with the
            design, not published as fixed values.
          </p>
          <div className="flex shrink-0 flex-wrap items-center gap-3">
            <Cta href="/products" tone="solidLight" icon={<ArrowRight />} ariaLabel="See all A2Care India solutions">
              All solutions
            </Cta>
            <Cta href="/contact" tone="outlineLight" ariaLabel="Discuss a water treatment duty with A2Care India">
              Discuss a duty
            </Cta>
          </div>
        </div>
      </div>
    </Section>
  );
}
