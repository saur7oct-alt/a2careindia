import type { Metadata } from 'next';
import Link from 'next/link';
import { industries } from '@/data/industries';
import { products, getProduct } from '@/data/products';
import { projects } from '@/data/projects';
import { buildMetadata } from '@/lib/seo';
import { PageHeader } from '@/components/layout/PageHeader';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { Section, SectionHeading, Eyebrow } from '@/components/ui/Section';
import { MediaFrame } from '@/components/ui/MediaFrame';
import { AssetMotif, motifFor } from '@/components/ui/AssetMotif';
import { Cta, ArrowRight } from '@/components/ui/Cta';
import { Reveal, Stagger, StaggerItem } from '@/components/motion/Reveal';

export const metadata: Metadata = {
  ...buildMetadata({
    title: 'Industries We Serve | Water Treatment by Sector',
    description:
      'Water treatment engineered per industry duty: food and beverage, pharmaceutical, healthcare, education, chemical, textile, hospitality, commercial buildings, industrial manufacturing and infrastructure across India.',
    path: '/industries',
    keywords: [
      'Industrial Water Treatment Plant',
      'Water Treatment Solutions in India',
      'ETP for textile industry',
      'RO plant for pharmaceutical industry',
    ],
  }),
};

/**
 * One page, ten anchored blocks. Individual industry pages would each say the same three
 * sentences about a different factory, which is exactly the doorway-page pattern that
 * earns a manual action instead of rankings.
 */
export default function IndustriesPage() {
  const featuredProjects = projects.slice(0, 3);

  return (
    <>
      <PageHeader
        eyebrow="Industries"
        title={
          <>
            Engineered for every
            <br />
            industry that depends
            <br />
            on water.
          </>
        }
        lead="Water quality requirements are set by the process, not by the industry label. These are the duties A2Care engineers against, with the systems that carry them."
      />

      <Breadcrumbs items={[{ name: 'Industries', path: '/industries' }]} />

      {/* ------------------------------------------------- The list */}
      <Section tone="dark" className="pt-12">
        <div className="shell flex flex-col gap-14">
          {industries.map((industry, index) => {
            const related = industry.solutions
              .map((slug) => getProduct(slug))
              .filter((product): product is (typeof products)[number] => Boolean(product));

            return (
              <Reveal key={industry.slug} amount={0.2}>
                <article
                  id={industry.slug}
                  className="grid scroll-mt-32 gap-8 border-t border-hairline-dark pt-12 lg:grid-cols-[minmax(0,0.34fr)_minmax(0,0.66fr)] lg:gap-14"
                >
                  <div className="flex flex-col gap-5">
                    <div className="flex items-baseline gap-4">
                      <span className="label tabular-nums text-aqua">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <h2 className="display-md text-ice">{industry.name}</h2>
                    </div>

                    {/* Motif keyed off the first related system family, so each industry
                        carries a different technical drawing rather than one repeated icon. */}
                    <div className="relative h-28 w-full overflow-hidden rounded-panel border border-hairline-dark bg-midnight/30 lg:hidden">
                      <AssetMotif
                        kind={motifFor(related[0]?.mediaId ?? 'product.industrial-ro')}
                        className="absolute left-1/2 top-1/2 h-[150%] w-auto -translate-x-1/2 -translate-y-1/2 text-aqua/40"
                      />
                    </div>

                    <p className="max-w-[46ch] text-[1rem] leading-[1.72] text-steel">
                      {industry.description}
                    </p>
                  </div>

                  <div className="grid gap-8 md:grid-cols-2">
                    <div>
                      <Eyebrow>Water quality pressure points</Eyebrow>
                      <ul className="mt-5 flex flex-col gap-3">
                        {industry.drivers.map((driver) => (
                          <li
                            key={driver}
                            className="flex items-start gap-3 text-[0.97rem] leading-[1.55] text-ice/85"
                          >
                            <span aria-hidden="true" className="mt-[0.62rem] h-px w-4 shrink-0 bg-aqua/70" />
                            {driver}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <Eyebrow>Systems deployed</Eyebrow>
                      <ul className="mt-5 flex flex-col gap-2.5">
                        {related.map((product) => (
                          <li key={product.slug}>
                            <Link
                              href={`/products/${product.slug}`}
                              className="group inline-flex items-center gap-2.5 text-[0.97rem] text-steel transition-colors hover:text-aqua"
                            >
                              <span className="relative">
                                {product.name}
                                <span
                                  aria-hidden="true"
                                  className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-aqua/70 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100"
                                />
                              </span>
                              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </Section>

      {/* --------------------------------------------- Proof points */}
      <Section tone="light" id="proof" labelledBy="proof-heading">
        <div className="shell flex flex-col gap-12">
          <SectionHeading
            id="proof-heading"
            tone="light"
            index="—"
            eyebrow="Installed"
            lines={['Across sectors,', 'on the ground.']}
            lead="A sample of commissioned work. Every entry links to its full case page."
          />

          <Stagger className="grid gap-6 md:grid-cols-3" stagger={0.07}>
            {featuredProjects.map((project) => (
              <StaggerItem key={project.slug}>
                <Link
                  href={`/projects/${project.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-panel border border-hairline-light bg-white/70 transition-colors duration-300 hover:border-electric/40"
                  aria-label={`${project.title} — ${project.client}, ${project.location}`}
                >
                  <MediaFrame
                    slotId={project.mediaId}
                    className="aspect-[16/10] w-full"
                    imageClassName="transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                    sizes="(min-width: 768px) 33vw, 92vw"
                  />
                  <div className="flex flex-1 flex-col gap-2 p-6">
                    <span className="label text-electric">{project.industry}</span>
                    <span className="display-sm text-navy">{project.title}</span>
                    <span className="mt-auto pt-3 text-[0.92rem] text-navy/60">
                      {project.location} · {project.capacity}
                    </span>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>

          <div className="flex flex-wrap gap-3">
            <Cta href="/projects" tone="solidLight" icon={<ArrowRight />}>
              View the full portfolio
            </Cta>
            <Cta href="/contact" tone="outlineLight">
              Discuss your industry
            </Cta>
          </div>
        </div>
      </Section>
    </>
  );
}
