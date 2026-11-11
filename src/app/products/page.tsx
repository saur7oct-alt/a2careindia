import type { Metadata } from 'next';
import Link from 'next/link';
import { products } from '@/data/products';
import { site } from '@/lib/site';
import { buildMetadata } from '@/lib/seo';
import { PageHeader } from '@/components/layout/PageHeader';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { Section, SectionHeading, Eyebrow } from '@/components/ui/Section';
import { ProductCard } from '@/components/sections/ProductCard';
import { Cta, ArrowRight } from '@/components/ui/Cta';
import { Reveal, Stagger, StaggerItem } from '@/components/motion/Reveal';

export const metadata: Metadata = {
  ...buildMetadata({
    title: 'Water Treatment Products | RO, ETP, STP, Chillers',
    description:
      'The A2Care India manufactured range: industrial RO plants from 100 to 50,000 LPH, commercial RO systems, ETP and STP plants, chemical dosing systems, rainwater harvesting and industrial chillers from 5 to 100 TR.',
    path: '/products',
    keywords: [
      'Industrial RO Plant Manufacturer in India',
      'ETP Plant Manufacturer',
      'STP Plant Manufacturer',
      'Industrial Water Chiller Manufacturer',
      'Commercial RO Plant',
    ],
  }),
};

/**
 * The catalogue view of the range. /solutions is organised by engineering duty; this page
 * is organised by what gets built and shipped, with the published capacity bands side by
 * side — the comparison a procurement team actually wants.
 */
export default function ProductsPage() {
  const [lead, ...rest] = products;

  return (
    <>
      <PageHeader
        eyebrow="The manufactured range"
        title={
          <>
            Every system, built
            <br />
            to the same standard.
          </>
        }
        lead="Seven product families covering intake, purification, effluent treatment, dosing, cooling and conservation. Each is engineered against a raw water analysis and the duty it has to hold, then fabricated, installed and commissioned as one package."
        aside={
          <div className="glass-dark rounded-panel px-6 py-5">
            <div className="label text-steel">Published capacity bands</div>
            <div className="display-sm mt-2 text-aqua">100 – 50,000 LPH</div>
            <div className="mt-1 text-[0.92rem] text-steel">Chillers from 5 TR to 100 TR</div>
          </div>
        }
      />

      <Breadcrumbs items={[{ name: 'Products', path: '/products' }]} />

      {/* ------------------------------------------------- Featured */}
      <Section tone="light" className="pt-14 pb-10 md:pt-16">
        <div className="shell">
          <ProductCard product={lead} featured index={0} priority />
        </div>
      </Section>

      {/* ---------------------------------------------------- Grid */}
      <Section tone="light" className="pt-6 pb-20 md:pt-8 md:pb-28">
        <div className="shell flex flex-col gap-12">
          <SectionHeading
            index="01"
            tone="light"
            eyebrow="Rest of the range"
            lines={['Six more families,', 'one engineering discipline.']}
            lead="Capacity, arrangement and instrumentation change with the site. What does not change is how each system is specified and built."
          />

          <Stagger className="grid gap-x-8 gap-y-14 md:grid-cols-2 xl:grid-cols-3" stagger={0.07}>
            {rest.map((product, index) => (
              <StaggerItem key={product.slug}>
                <ProductCard product={product} index={index + 1} />
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </Section>

      {/* --------------------------------------- Capacity comparison */}
      <Section tone="dark" id="capacity" labelledBy="capacity-heading">
        <div className="shell flex flex-col gap-12">
          <SectionHeading
            id="capacity-heading"
            index="02"
            eyebrow="At a glance"
            lines={['What is published,', 'what is configured.']}
            lead="Rows marked “on request” are configuration choices settled during design against your feed water, not oversights. The company does not publish a number it has not confirmed."
          />

          <div className="overflow-x-auto rounded-panel border border-hairline-dark">
            <table className="w-full min-w-[680px] border-collapse text-left">
              <caption className="sr-only">
                A2Care India product families with published capacity and typical application
              </caption>
              <thead>
                <tr className="border-b border-hairline-dark bg-midnight/40">
                  {['Product family', 'Published capacity', 'Typical duty', 'Details'].map((heading) => (
                    <th key={heading} scope="col" className="label px-6 py-4 font-normal text-steel">
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.slug} className="border-b border-hairline-dark last:border-0">
                    <th scope="row" className="px-6 py-5 text-left font-display text-[1rem] font-medium text-ice">
                      {product.name}
                    </th>
                    <td className="px-6 py-5 text-[0.95rem] text-aqua">
                      {product.capacityLabel ?? 'Sized to site requirement'}
                    </td>
                    <td className="px-6 py-5 text-[0.95rem] leading-[1.55] text-steel">
                      {product.applications[0]}
                    </td>
                    <td className="px-6 py-5">
                      <Link
                        href={`/products/${product.slug}`}
                        className="group inline-flex items-center gap-2 text-[0.92rem] text-ice transition-colors hover:text-aqua"
                      >
                        View
                        <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Section>

      {/* -------------------------------------------------------- CTA */}
      <Section tone="light" className="py-16 md:py-20">
        <div className="shell grid gap-8 rounded-panel border border-hairline-light bg-white/70 p-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-center md:gap-16 md:p-12">
          <div className="flex flex-col gap-4">
            <Eyebrow index="03" tone="light">
              Specify it properly
            </Eyebrow>
            <h2 className="display-md max-w-[26ch] text-navy">
              Send a water report and the arrangement settles itself.
            </h2>
            <p className="max-w-[62ch] text-[1rem] leading-[1.7] text-navy/68">
              Recovery ratio, pre-treatment train and instrumentation follow from measured
              feed-water quality. Share yours — or arrange a sample collection — and the
              engineering response comes back with a defined scope.
            </p>
          </div>

          <Reveal className="flex flex-wrap gap-3 md:flex-col md:items-stretch">
            <Cta href="/contact" tone="solidLight" icon={<ArrowRight />}>
              Request a quotation
            </Cta>
            <Cta href="/solutions" tone="outlineLight">
              Browse by duty
            </Cta>
          </Reveal>
        </div>

        <p className="shell mt-10 text-[0.92rem] text-navy/55">
          Manufactured and commissioned from {site.address.line2}, {site.address.state} ·
          installation and support across India · {site.phones.join(' · ')}
        </p>
      </Section>
    </>
  );
}
