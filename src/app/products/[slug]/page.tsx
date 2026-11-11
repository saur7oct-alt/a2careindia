import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Check, Phone, MessageCircle } from 'lucide-react';
import { getProduct, productSlugs, products } from '@/data/products';
import { projects } from '@/data/projects';
import { faqs } from '@/data/faqs';
import { site, telHref, whatsappHref } from '@/lib/site';
import { buildMetadata, productSchema, serviceSchema, faqSchema } from '@/lib/seo';
import { PageHeader } from '@/components/layout/PageHeader';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { JsonLd } from '@/components/layout/JsonLd';
import { Section, SectionHeading, Eyebrow } from '@/components/ui/Section';
import { MediaFrame } from '@/components/ui/MediaFrame';
import { Cta, ArrowRight } from '@/components/ui/Cta';
import { Accordion } from '@/components/ui/Accordion';
import { Reveal, Stagger, StaggerItem } from '@/components/motion/Reveal';

export function generateStaticParams() {
  return productSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);

  if (!product) {
    return { title: 'Product not found', robots: { index: false, follow: true } };
  }

  return buildMetadata({
    title: product.meta.title,
    description: product.meta.description,
    path: `/products/${product.slug}`,
    type: 'article',
    keywords: [
      product.name,
      `${product.name} manufacturer India`,
      `${product.name} supplier Uttarakhand`,
      product.capacityLabel ?? `${product.name} supplier`,
    ],
  });
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProduct(slug);

  if (!product) notFound();

  const path = `/products/${product.slug}`;
  const relatedProjects = projects.filter((project) =>
    projectMatchesProduct(project.plantType + project.category, product),
  );

  const productFaqs = [...product.faqs, ...faqs.filter((faq) => !faq.awaitingCompanyInput).slice(0, 3)];

  return (
    <>
      <JsonLd
        data={[
          productSchema({
            name: product.name,
            description: product.description,
            path,
          }),
          serviceSchema(product.name, product.description, path),
          faqSchema(productFaqs.map(({ question, answer }) => ({ question, answer }))),
        ]}
      />

      <PageHeader
        eyebrow={
          <>
            Products <span className="text-steel">/ {product.shortName}</span>
          </>
        }
        title={product.name}
        lead={product.description}
        aside={
          product.capacityLabel ? (
            <div className="glass-dark rounded-panel px-6 py-5">
              <div className="label text-steel">Capacity</div>
              <div className="display-sm mt-1.5 text-aqua">{product.capacityLabel}</div>
            </div>
          ) : null
        }
      />

      <Breadcrumbs items={[{ name: 'Products', path: '/products' }, { name: product.name, path }]} />

      {/* ------------------------------------------------ Overview */}
      <Section tone="dark" className="pt-10 pb-20 md:pt-14 md:pb-28">
        <div className="shell grid gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-start lg:gap-16">
          <div className="flex flex-col gap-8">
            <Reveal>
              <p className="text-[1.18rem] leading-[1.62] text-ice/90">{product.lede}</p>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="text-[1.02rem] leading-[1.78] text-steel">{product.longDescription}</p>
            </Reveal>

            <ul className="flex flex-col gap-3.5 border-t border-hairline-dark pt-7">
              {product.highlights.map((highlight, index) => (
                <Reveal as="li" key={highlight} delay={index * 0.05} amount={0.5}>
                  <span className="flex items-start gap-3.5 text-[1rem] leading-[1.6] text-ice/85">
                    <Check className="mt-1 h-4 w-4 shrink-0 text-aqua" strokeWidth={1.8} aria-hidden="true" />
                    {highlight}
                  </span>
                </Reveal>
              ))}
            </ul>

            <div className="flex flex-wrap gap-3 pt-2">
              <Cta href="/contact" tone="aqua" icon={<ArrowRight />}>
                Request a quotation
              </Cta>
              <Cta href={telHref(site.phones[0])} tone="outlineDark" icon={<Phone className="h-4 w-4" />}>
                Call the engineers
              </Cta>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <MediaFrame
              slotId={product.mediaId}
              className="aspect-[4/3] w-full rounded-panel border border-hairline-dark"
              sizes="(min-width: 1024px) 46vw, 92vw"
            />

            {/* Specs: `verified: false` rows are labelled as configuration choices rather
                than presented as published fact. */}
            <div className="glass-dark rounded-panel p-6 md:p-7">
              <Eyebrow>Technical basis</Eyebrow>
              <dl className="mt-5 flex flex-col">
                {product.specs.map((spec, index) => (
                  <div
                    key={spec.label}
                    className={
                      index === 0
                        ? 'flex items-baseline justify-between gap-6 pb-4'
                        : 'flex items-baseline justify-between gap-6 border-t border-hairline-dark py-4'
                    }
                  >
                    <dt className="label shrink-0 text-steel">{spec.label}</dt>
                    <dd className="text-right text-[0.98rem] leading-[1.5] text-ice">
                      {spec.value}
                      {!spec.verified ? (
                        <span className="label ml-2 align-middle text-steel/70">on request</span>
                      ) : null}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </Section>

      {/* --------------------------------------------- Applications */}
      <Section tone="light" id="applications" labelledBy="applications-heading">
        <div className="shell flex flex-col gap-12">
          <SectionHeading
            id="applications-heading"
            tone="light"
            index="01"
            eyebrow="Where it works"
            lines={['Built for the duty,', 'not the brochure.']}
            lead="The same purification principle serves very different obligations. These are the duties this system is engineered for."
          />

          <Stagger className="grid gap-px overflow-hidden rounded-panel border border-hairline-light bg-hairline-light sm:grid-cols-2 lg:grid-cols-4" stagger={0.06}>
            {product.applications.map((application) => (
              <StaggerItem key={application} className="bg-ice">
                <div className="flex h-full flex-col justify-between gap-6 p-6 md:p-7">
                  <span className="label text-electric">{product.shortName}</span>
                  <span className="display-sm text-navy">{application}</span>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </Section>

      {/* ------------------------------------------ Related projects */}
      {relatedProjects.length > 0 ? (
        <Section tone="dark" id="related-projects" labelledBy="related-heading">
          <div className="shell flex flex-col gap-12">
            <SectionHeading
              id="related-heading"
              index="02"
              eyebrow="Delivered"
              lines={['The same engineering,', 'on real sites.']}
              lead="Installations from the project portfolio that run on this system type."
            />

            <Stagger className="grid gap-6 md:grid-cols-2 xl:grid-cols-3" stagger={0.07}>
              {relatedProjects.map((project) => (
                <StaggerItem key={project.slug}>
                  <Link
                    href={`/projects/${project.slug}`}
                    className="group flex h-full flex-col overflow-hidden rounded-panel border border-hairline-dark transition-colors duration-300 hover:border-aqua/45"
                    aria-label={`${project.title} — ${project.client}, ${project.location}`}
                  >
                    <MediaFrame
                      slotId={project.mediaId}
                      className="aspect-[16/10] w-full"
                      imageClassName="transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                      sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 92vw"
                    />
                    <div className="flex flex-1 flex-col gap-3 p-6">
                      <div className="label text-aqua">{project.capacity}</div>
                      <div className="display-sm text-ice">{project.title}</div>
                      <div className="text-[0.95rem] leading-[1.6] text-steel">
                        {project.client} · {project.location}
                      </div>
                    </div>
                  </Link>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </Section>
      ) : null}

      {/* ------------------------------------------------------ FAQs */}
      <Section tone="light" id="faq" labelledBy="product-faq-heading">
        <div className="shell grid gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <SectionHeading
              id="product-faq-heading"
              tone="light"
              index="03"
              eyebrow="Asked often"
              lines={['Questions before', 'a plant is specified.']}
              lead="Send a raw water report with your enquiry and most of these answer themselves during design."
            />
            <div className="mt-8 flex flex-wrap gap-3">
              <Cta href="/contact" tone="solidLight" icon={<ArrowRight />}>
                Ask this team
              </Cta>
              <Cta
                href={whatsappHref(`Enquiry about ${product.name}.`)}
                tone="outlineLight"
                icon={<MessageCircle className="h-4 w-4" />}
              >
                WhatsApp
              </Cta>
            </div>
          </div>

          <Accordion
            tone="light"
            items={productFaqs.map(({ question, answer }) => ({ question, answer }))}
          />
        </div>
      </Section>

      {/* --------------------------------------- Other product lines */}
      <Section tone="dark" className="py-16 md:py-20">
        <div className="shell flex flex-col gap-8">
          <Eyebrow index="—">More from A2Care</Eyebrow>
          <ul className="flex flex-wrap gap-x-8 gap-y-4 border-b border-hairline-dark pb-8">
            {products
              .filter((other) => other.slug !== product.slug)
              .map((other) => (
                <li key={other.slug}>
                  <Link
                    href={`/products/${other.slug}`}
                    className="group inline-flex items-baseline gap-2.5 text-steel transition-colors hover:text-ice"
                  >
                    <span className="display-sm">{other.name}</span>
                    <ArrowRight className="h-4 w-4 translate-y-0.5 opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
          </ul>
          <p className="text-[0.95rem] text-steel">
            Headquartered at {site.address.line1}, {site.address.line2}, {site.address.state} —{' '}
            installation and commissioning across India.
          </p>
        </div>
      </Section>
    </>
  );
}

/**
 * Loose match on purpose: the portfolio names plants in the words a client would use
 * ("Reverse Osmosis", "ETP", "Chiller"), so the link is made on shared vocabulary rather
 * than a foreign key that does not exist in the published data.
 */
function projectMatchesProduct(projectText: string, product: (typeof products)[number]): boolean {
  const haystack = projectText.toLowerCase();
  const needles: Record<string, string[]> = {
    'industrial-ro-plants': ['ro', 'reverse osmosis'],
    'commercial-ro-systems': ['ro', 'reverse osmosis'],
    'etp-plants': ['etp', 'effluent'],
    'stp-plants': ['stp', 'sewage'],
    'chemical-dosing-systems': ['dosing'],
    'rainwater-harvesting-systems': ['rainwater'],
    'industrial-water-chillers': ['chiller'],
  };

  return (needles[product.slug] ?? []).some((needle) => haystack.includes(needle));
}
