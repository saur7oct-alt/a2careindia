import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MapPin, ArrowUpRight, Phone } from 'lucide-react';
import { getProject, projectSlugs, projects } from '@/data/projects';
import { site, telHref, mapsHref } from '@/lib/site';
import { buildMetadata } from '@/lib/seo';
import { PageHeader } from '@/components/layout/PageHeader';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { Section, SectionHeading, Eyebrow } from '@/components/ui/Section';
import { MediaFrame } from '@/components/ui/MediaFrame';
import { Cta, ArrowRight } from '@/components/ui/Cta';
import { Reveal } from '@/components/motion/Reveal';

export function generateStaticParams() {
  return projectSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) {
    return { title: 'Project not found', robots: { index: false, follow: true } };
  }

  return buildMetadata({
    title: `${project.title} | ${project.location}`,
    description: `${project.summary} Plant type: ${project.plantType}, capacity ${project.capacity}, delivered in ${project.location}, ${project.state}.`,
    path: `/projects/${project.slug}`,
    type: 'article',
    keywords: [
      `${project.plantType} in ${project.location}`,
      `${project.category} project ${project.state}`,
      `${project.industry} water treatment India`,
    ],
  });
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) notFound();

  const path = `/projects/${project.slug}`;
  const others = projects.filter((other) => other.slug !== project.slug).slice(0, 3);

  return (
    <>
      <PageHeader
        eyebrow={
          <>
            Projects <span className="text-steel">/ {project.category}</span>
          </>
        }
        title={project.title}
        lead={project.summary}
        aside={
          <dl className="glass-dark grid grid-cols-2 gap-x-8 gap-y-5 rounded-panel px-6 py-5">
            {[
              { label: 'Location', value: `${project.location}, ${project.state}` },
              { label: 'Plant type', value: project.plantType },
              { label: 'Capacity', value: project.capacity },
              { label: 'Completed', value: project.completed ?? 'On record with the company' },
            ].map((row) => (
              <div key={row.label}>
                <dt className="label text-steel">{row.label}</dt>
                <dd className="mt-1 text-[0.95rem] leading-[1.45] text-ice">{row.value}</dd>
              </div>
            ))}
          </dl>
        }
      />

      <Breadcrumbs items={[{ name: 'Projects', path: '/projects' }, { name: project.title, path }]} />

      {/* ------------------------------------------------- Main frame */}
      <Section tone="dark" className="pt-10 pb-16 md:pt-14">
        <div className="shell flex flex-col gap-10">
          <MediaFrame
            slotId={project.mediaId}
            priority
            className="aspect-[21/9] w-full rounded-panel border border-hairline-dark"
            sizes="100vw"
          />

          <Reveal>
            <ul className="flex flex-wrap gap-x-10 gap-y-4 border-t border-hairline-dark pt-8">
              {project.highlights.map((highlight) => (
                <li key={highlight} className="flex items-center gap-3 text-[0.98rem] text-ice/85">
                  <span className="h-1.5 w-1.5 rounded-full bg-aqua" aria-hidden="true" />
                  {highlight}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </Section>

      {/* --------------------------------------- Challenge / solution */}
      <Section tone="deeper" className="py-16 md:py-24">
        <div className="shell grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col gap-6">
            <Eyebrow index="01">The challenge</Eyebrow>
            <h2 className="display-md text-ice">What the site had to solve</h2>
            <p className="text-[1.05rem] leading-[1.78] text-steel">{project.challenge}</p>
          </div>

          <div className="flex flex-col gap-6 border-hairline-dark lg:border-l lg:pl-16">
            <Eyebrow index="02">The solution</Eyebrow>
            <h2 className="display-md text-ice">What A2Care engineered</h2>
            <p className="text-[1.05rem] leading-[1.78] text-steel">{project.solution}</p>

            <div className="mt-4 flex flex-wrap gap-3">
              <Cta href="/contact" tone="aqua" icon={<ArrowRight />}>
                Discuss a similar project
              </Cta>
              <Cta href={telHref(site.phones[1])} tone="outlineDark" icon={<Phone className="h-4 w-4" />}>
                {site.phones[1]}
              </Cta>
            </div>
          </div>
        </div>
      </Section>

      {/* --------------------------------------------- Specifications */}
      <Section tone="dark" id="specifications" labelledBy="specs-heading">
        <div className="shell grid gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
          <SectionHeading
            id="specs-heading"
            index="03"
            eyebrow="Verified particulars"
            lines={['Recorded', 'specifications.']}
            lead="Only the details published for this installation appear here. Anything else comes from the company's own project file."
          />

          <div>
            <dl className="overflow-hidden rounded-panel border border-hairline-dark">
              {project.specifications.map((spec, index) => (
                <div
                  key={spec.label}
                  className={`grid grid-cols-[minmax(0,0.55fr)_minmax(0,1fr)] items-baseline gap-6 px-6 py-5 md:px-8 ${
                    index > 0 ? 'border-t border-hairline-dark' : ''
                  }`}
                >
                  <dt className="label text-steel">{spec.label}</dt>
                  <dd className="text-right text-[1.02rem] text-ice md:text-left">{spec.value}</dd>
                </div>
              ))}

              <div className="grid grid-cols-[minmax(0,0.55fr)_minmax(0,1fr)] items-baseline gap-6 border-t border-hairline-dark bg-midnight/40 px-6 py-5 md:px-8">
                <dt className="label text-steel">Industry</dt>
                <dd className="text-right text-[1.02rem] text-ice md:text-left">{project.industry}</dd>
              </div>
            </dl>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <a
                href={mapsHref(`${project.location}, ${project.state}`)}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2.5 text-[0.98rem] text-aqua transition-colors hover:text-ice"
              >
                <MapPin className="h-4 w-4" aria-hidden="true" />
                {project.location}, {project.state}
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            </div>
          </div>
        </div>
      </Section>

      {/* ---------------------------------------------------- Gallery */}
      <Section tone="light" id="gallery" labelledBy="gallery-heading">
        <div className="shell flex flex-col gap-10">
          <SectionHeading
            id="gallery-heading"
            tone="light"
            index="04"
            eyebrow="Site imagery"
            lines={['Photographs pending', 'from the company file.']}
            lead="This gallery currently shows designed technical artwork. Real site photography replaces it as soon as the files are supplied — see public/media/README.md for the folder this project maps to."
          />

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((index) => (
              <Reveal key={index} delay={index * 0.07}>
                <MediaFrame
                  slotId={index === 0 ? project.mediaId : `project.${project.slug}-view-${index + 1}`}
                  className="aspect-[4/3] w-full rounded-panel border border-hairline-light"
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 92vw"
                  showLabel
                />
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      {/* -------------------------------------------------- Next up */}
      <Section tone="dark" className="py-16 md:py-24">
        <div className="shell flex flex-col gap-10">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading
              index="05"
              eyebrow="Continue"
              lines={['More installations.']}
              headingClassName="display-md"
            />
            <Link
              href="/projects"
              className="group inline-flex items-center gap-2 text-[0.98rem] text-aqua transition-colors hover:text-ice"
            >
              All projects
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {others.map((other) => (
              <Reveal key={other.slug}>
                <Link
                  href={`/projects/${other.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-panel border border-hairline-dark transition-colors duration-300 hover:border-aqua/45"
                  aria-label={`${other.title} — ${other.client}, ${other.location}`}
                >
                  <MediaFrame
                    slotId={other.mediaId}
                    className="aspect-[16/10] w-full"
                    imageClassName="transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                    sizes="(min-width: 768px) 33vw, 92vw"
                  />
                  <div className="flex flex-1 flex-col gap-2.5 p-6">
                    <div className="label text-aqua">{other.capacity}</div>
                    <div className="display-sm text-ice">{other.title}</div>
                    <div className="text-[0.92rem] leading-[1.55] text-steel">
                      {other.client} · {other.location}
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>
    </>
  );
}
