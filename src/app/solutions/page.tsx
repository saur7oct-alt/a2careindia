import type { Metadata } from 'next';
import { getProduct, products } from '@/data/products';
import { processStages } from '@/data/content';
import { site } from '@/lib/site';
import { buildMetadata, serviceSchema } from '@/lib/seo';
import { PageHeader } from '@/components/layout/PageHeader';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { JsonLd } from '@/components/layout/JsonLd';
import { Section, SectionHeading, Eyebrow } from '@/components/ui/Section';
import { ProductCard } from '@/components/sections/ProductCard';
import { TreatmentExplorer } from '@/components/sections/TreatmentExplorer';
import { Cta, ArrowRight } from '@/components/ui/Cta';
import { Reveal, Stagger, StaggerItem } from '@/components/motion/Reveal';

export const metadata: Metadata = {
  ...buildMetadata({
    title: 'Industrial Water Treatment Solutions in India',
    description:
      'Turnkey water treatment solutions by engineering duty: purification and process water, effluent treatment and reuse, and process cooling. Designed from raw water analysis, installed and commissioned across India.',
    path: '/solutions',
    keywords: [
      'Water Treatment Solutions in India',
      'Industrial Water Treatment Plant',
      'ETP STP solutions Uttarakhand',
      'Boiler feed water treatment',
    ],
  }),
};

/**
 * /solutions is organised by the problem to be solved; /products is organised by the
 * equipment that ships. Same seven families, two ways in — which is also how an engineer
 * and a procurement officer each look for them.
 */
const groups = [
  {
    id: 'water-treatment',
    index: '01',
    eyebrow: 'Duty one',
    lines: ['Get the water', 'to specification.'],
    lead: 'Feed water is analysed, then a train is arranged to hold the required quality continuously — not to hit a number on a datasheet once at commissioning.',
    slugs: ['industrial-ro-plants', 'commercial-ro-systems', 'chemical-dosing-systems', 'rainwater-harvesting-systems'],
  },
  {
    id: 'effluent-reuse',
    index: '02',
    eyebrow: 'Duty two',
    lines: ['Take the load', 'out of the water', 'you send back.'],
    lead: 'Effluent and sewage are the difficult streams: variable load, regulated output, and the best sites turn the treated volume back into use instead of discharging it.',
    slugs: ['etp-plants', 'stp-plants'],
  },
  {
    id: 'process-cooling',
    index: '03',
    eyebrow: 'Duty three',
    lines: ['Hold the', 'temperature.'],
    lead: 'Cooling duty follows the process, not the nameplate. Chillers are selected against measured heat load and the water they will actually run on.',
    slugs: ['industrial-water-chillers'],
  },
] as const;

export default function SolutionsPage() {
  const resolved = groups.map((group) => ({
    ...group,
    items: group.slugs.map((slug) => getProduct(slug)).filter((p): p is (typeof products)[number] => Boolean(p)),
  }));

  return (
    <>
      <JsonLd
        data={[
          ...resolved.flatMap((group) =>
            group.items.map((product) =>
              serviceSchema(product.name, product.description, `/products/${product.slug}`),
            ),
          ),
        ]}
      />

      <PageHeader
        eyebrow="Solutions"
        title={
          <>
            More than water treatment.
            <br />
            We engineer water solutions.
          </>
        }
        lead="At A2Care India, engineering expertise, advanced purification technology and practical industrial knowledge are combined into solutions that help businesses operate efficiently and sustainably — from the raw water report to the maintenance contract."
        aside={
          <div className="glass-dark rounded-panel px-6 py-5">
            <div className="label text-steel">Engagement model</div>
            <p className="mt-2 max-w-[30ch] text-[0.95rem] leading-[1.55] text-ice">
              Consult · Analyse · Design · Manufacture · Install · Maintain
            </p>
          </div>
        }
      />

      <Breadcrumbs items={[{ name: 'Solutions', path: '/solutions' }]} />

      {resolved.map((group) => (
        <Section
          key={group.id}
          id={group.id}
          tone={group.index === '02' ? 'light' : 'dark'}
          labelledBy={`${group.id}-heading`}
          className="scroll-mt-28"
        >
          <div className="shell flex flex-col gap-12">
            <SectionHeading
              id={`${group.id}-heading`}
              index={group.index}
              eyebrow={group.eyebrow}
              lines={group.lines}
              lead={group.lead}
              tone={group.index === '02' ? 'light' : 'dark'}
            />

            <Stagger
              className={
                group.items.length === 1
                  ? 'grid gap-8'
                  : 'grid gap-x-8 gap-y-14 md:grid-cols-2'
              }
              stagger={0.07}
            >
              {group.items.map((product, index) => (
                <StaggerItem key={product.slug}>
                  <ProductCard
                    product={product}
                    featured={group.items.length === 1}
                    index={index}
                  />
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </Section>
      ))}

      {/* ---------------------------------------- Inside a treatment train */}
      <TreatmentExplorer showDutyLink={false} />

      {/* ---------------------------------------- How it is delivered */}
      <Section tone="deeper" id="delivery" labelledBy="delivery-heading">
        <div className="shell grid gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <SectionHeading
              id="delivery-heading"
              index="04"
              eyebrow="Delivery"
              lines={['One responsibility,', 'start to service.']}
              lead="The same team that specifies the train fabricates it, commissions it and answers the phone afterwards. That continuity is where reliability is won."
            />
            <div className="mt-8">
              <Cta href="/contact" tone="aqua" icon={<ArrowRight />}>
                Start a consultation
              </Cta>
            </div>
          </div>

          <ol className="flex flex-col">
            {processStages.map((stage, index) => (
              <Reveal key={stage.number} delay={index * 0.04} amount={0.4}>
                <li className="grid grid-cols-[auto_minmax(0,1fr)] gap-6 border-b border-hairline-dark py-7 first:pt-0 md:gap-8">
                  <span className="label tabular-nums text-aqua">{stage.number}</span>
                  <div className="flex flex-col gap-2">
                    <h3 className="display-sm text-ice">{stage.title}</h3>
                    <p className="max-w-[56ch] text-[0.98rem] leading-[1.68] text-steel">{stage.body}</p>
                    <Eyebrow className="mt-1">{stage.deliverable}</Eyebrow>
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </Section>

      <div className="shell pb-16 pt-4 text-[0.92rem] text-steel md:pb-20">
        Solutions are engineered from {site.address.line2}, {site.address.state} and
        commissioned on site across India. Reach the team on {site.phones.join(' or ')}.
      </div>
    </>
  );
}
