import type { Metadata } from 'next';
import Link from 'next/link';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { site, telHref, mailHref, mapsHref } from '@/lib/site';
import { capabilityFacts, processStages, whyChoose } from '@/data/content';
import { products } from '@/data/products';
import { projects } from '@/data/projects';
import { referencedClients } from '@/data/testimonials';
import { buildMetadata } from '@/lib/seo';
import { PageHeader } from '@/components/layout/PageHeader';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { Section, SectionHeading, Eyebrow, WaterLine } from '@/components/ui/Section';
import { MediaFrame } from '@/components/ui/MediaFrame';
import { AssetMotif, motifFor } from '@/components/ui/AssetMotif';
import { Cta, ArrowRight } from '@/components/ui/Cta';
import { AnimatedStat } from '@/components/ui/StatCounter';
import { Reveal, Stagger, StaggerItem, LineReveal } from '@/components/motion/Reveal';

export const metadata: Metadata = {
  ...buildMetadata({
    title: 'About A2Care India | Water Treatment Manufacturer, Rudrapur',
    description:
      'A2Care India (INC) has engineered, manufactured, installed and maintained industrial water treatment systems since 2018, from Rudrapur, Uttarakhand, with 50+ installations across India.',
    path: '/about',
    keywords: [
      'Water treatment company Uttarakhand',
      'Industrial RO plant manufacturer Rudrapur',
      'A2Care India about',
    ],
  }),
};

const principles = whyChoose;

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow={`Established ${site.establishedYear}`}
        title={
          <>
            Mastering water
            <br />
            purification since {site.establishedYear}.
          </>
        }
        lead="A2Care India (INC) is an industrial water treatment solutions provider and plant manufacturer working from Rudrapur, Uttarakhand — engineering, manufacturing, supplying, installing and maintaining treatment systems for industrial, commercial and institutional clients across India."
        aside={
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-panel border border-hairline-dark bg-hairline-dark">
            {capabilityFacts.map((fact) => (
              <div key={fact.label} className="bg-navy px-5 py-4">
                <div className="label text-steel">{fact.label}</div>
                <div className="mt-1.5 text-[0.95rem] leading-[1.4] text-ice">{fact.value}</div>
              </div>
            ))}
          </div>
        }
      />

      <Breadcrumbs items={[{ name: 'About', path: '/about' }]} />

      {/* ---------------------------------------------------- Numbers */}
      <Section tone="dark" className="py-16 md:py-20">
        <div className="shell">
          <Stagger className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4" stagger={0.08}>
            {site.stats.map((stat) => (
              <StaggerItem key={stat.label}>
                <AnimatedStat
                  value={stat.value}
                  suffix={stat.suffix}
                  label={stat.label}
                  note={stat.note}
                  className="border-l border-hairline-dark pl-6"
                />
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </Section>

      {/* --------------------------------------------------- The work */}
      <Section tone="deeper" id="approach" labelledBy="approach-heading">
        <div className="shell grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] lg:gap-20">
          <div className="flex flex-col gap-8">
            <SectionHeading
              id="approach-heading"
              index="01"
              eyebrow="How we work"
              lines={['The analysis comes', 'before the equipment.']}
              lead="A plant specified from a catalogue is a plant that will be argued with later. A2Care starts from a raw water report and the measured duty, and works outward from there — pre-treatment, membrane arrangement, dosing, instrumentation, then the skid that carries them."
            />

            <div className="flex flex-col gap-5 border-t border-hairline-dark pt-8">
              {[
                {
                  title: 'Engineering, not supply',
                  body: 'The company takes responsibility for the outcome — consultation through commissioning — rather than delivering a box and leaving the interface to the client.',
                },
                {
                  title: 'Manufacturing discipline',
                  body: 'Materials, assembly and test are treated as part of the specification. Reliability is decided on the fabrication floor, long before a site accepts the plant.',
                },
                {
                  title: 'Service after handover',
                  body: 'Maintenance, annual maintenance contracts and technical support keep performance where it was commissioned, which is the part most suppliers underwrite and overpromise.',
                },
              ].map((item, index) => (
                <Reveal key={item.title} delay={index * 0.06} amount={0.5}>
                  <div className="grid gap-2.5 md:grid-cols-[minmax(0,0.32fr)_minmax(0,0.68fr)] md:gap-8">
                    <h3 className="display-sm text-aqua">{item.title}</h3>
                    <p className="text-[1rem] leading-[1.7] text-steel">{item.body}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <MediaFrame
              slotId="about.works"
              className="aspect-[4/5] w-full rounded-panel border border-hairline-dark"
              sizes="(min-width: 1024px) 42vw, 92vw"
            />
            <p className="text-[0.9rem] leading-[1.6] text-steel">
              This slot shows designed technical artwork until the company supplies
              fabrication-floor and site photography. Replacement takes one flag in{' '}
              <code className="font-mono text-aqua/80">src/lib/media.ts</code>.
            </p>
          </div>
        </div>
      </Section>

      {/* ------------------------------------------------- Principles */}
      <Section tone="light" id="principles" labelledBy="principles-heading">
        <div className="shell flex flex-col gap-12">
          <SectionHeading
            id="principles-heading"
            tone="light"
            index="02"
            eyebrow="Brand attributes"
            lines={['Six things the', 'work is judged on.']}
            lead="The attributes the company states for itself, and the reason each one matters on a live industrial site."
          />

          <Stagger className="grid gap-px overflow-hidden rounded-panel border border-hairline-light bg-hairline-light sm:grid-cols-2 lg:grid-cols-3" stagger={0.06}>
            {principles.map((principle, index) => (
              <StaggerItem key={principle.id} className="bg-ice">
                <div className="flex h-full flex-col gap-4 p-7">
                  <div className="flex items-start justify-between gap-4">
                    <span className="label tabular-nums text-electric">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <AssetMotif
                      kind={motifFor(products[index % products.length].mediaId)}
                      className="h-14 w-16 text-navy/25"
                    />
                  </div>
                  <h3 className="display-sm text-navy">{principle.title}</h3>
                  <p className="text-[0.97rem] leading-[1.68] text-navy/68">{principle.body}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>

          {/* Certification status is stated honestly rather than asserted. */}
          <Reveal className="rounded-panel border border-hairline-light bg-white/60 p-7 md:p-8">
            <Eyebrow index="—" tone="light">
              Certification
            </Eyebrow>
            <div className="mt-4 grid gap-6 md:grid-cols-[minmax(0,0.4fr)_minmax(0,0.6fr)] md:gap-10">
              <h3 className="display-sm text-navy">{site.certification.name}</h3>
              <p className="text-[0.97rem] leading-[1.7] text-navy/68">
                {site.certification.placeholderNote} The certificate number and issuing body
                are published on this page once confirmed, rather than stated in advance.
              </p>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* ---------------------------------------------------- Process */}
      <Section tone="dark" id="process-summary" labelledBy="process-summary-heading">
        <div className="shell flex flex-col gap-12">
          <SectionHeading
            id="process-summary-heading"
            index="03"
            eyebrow="Engagement"
            lines={['From water challenge', 'to engineered solution.']}
            lead="Six stages, the same order on every site, whether the scope is one RO skid or a complete effluent treatment arrangement."
          />

          <ol className="grid gap-px overflow-hidden rounded-panel border border-hairline-dark bg-hairline-dark md:grid-cols-3">
            {processStages.map((stage, index) => (
              <Reveal as="li" key={stage.number} delay={index * 0.05} amount={0.4} className="bg-navy">
                <div className="flex h-full flex-col gap-3 p-7">
                  <span className="label text-aqua">{stage.number}</span>
                  <h3 className="display-sm text-ice">{stage.title}</h3>
                  <p className="text-[0.95rem] leading-[1.62] text-steel">{stage.body}</p>
                  <span className="label mt-auto pt-4 text-steel/70">{stage.deliverable}</span>
                </div>
              </Reveal>
            ))}
          </ol>

          <div className="flex flex-wrap gap-3">
            <Cta href="/solutions" tone="outlineDark" icon={<ArrowRight />}>
              See the solutions
            </Cta>
            <Cta href="/projects" tone="outlineDark">
              See the installations
            </Cta>
          </div>
        </div>
      </Section>

      {/* -------------------------------------------------- Coverage */}
      <Section tone="deeper" id="coverage" labelledBy="coverage-heading">
        <div className="shell grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:gap-20">
          <div className="flex flex-col gap-8">
            <SectionHeading
              id="coverage-heading"
              index="04"
              eyebrow="Coverage"
              lines={['Based in Uttarakhand.',
                'Commissioning',
                'anywhere in India.']}
              lead="Most installations sit within the Udham Singh Nagar and wider Uttarakhand industrial belt, with projects recorded in Uttar Pradesh as well — including sites around Gautam Buddha Nagar."
            />

            <div>
              <Eyebrow>Named in published testimonials</Eyebrow>
              <ul className="mt-5 flex flex-col gap-3">
                {referencedClients.map((client) => (
                  <li key={client.name} className="flex flex-wrap items-baseline gap-x-4 gap-y-1 border-b border-hairline-dark pb-3">
                    <span className="text-[1rem] text-ice">{client.name}</span>
                    <span className="label text-steel">{client.context}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-[0.9rem] leading-[1.6] text-steel">
                Mentioned with the context in which each organisation was originally
                published. Formal logo use requires written authorisation and is not implied.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="grid gap-px overflow-hidden rounded-panel border border-hairline-dark bg-hairline-dark sm:grid-cols-2">
              {projects.slice(0, 6).map((project) => (
                <Link
                  key={project.slug}
                  href={`/projects/${project.slug}`}
                  className="group flex flex-col gap-1.5 bg-navy p-5 transition-colors duration-300 hover:bg-midnight"
                >
                  <span className="label text-aqua">{project.capacity}</span>
                  <span className="text-[0.97rem] leading-[1.4] text-ice">{project.location}</span>
                  <span className="text-[0.88rem] text-steel">{project.category}</span>
                </Link>
              ))}
            </div>

            <address className="glass-dark flex flex-col gap-4 rounded-panel p-6 not-italic">
              <div className="flex items-start gap-3.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-aqua" aria-hidden="true" />
                <span className="text-[0.95rem] leading-[1.6] text-ice">{site.address.full}</span>
              </div>
              <div className="flex flex-wrap gap-x-6 gap-y-2">
                {site.phones.map((phone) => (
                  <a key={phone} href={telHref(phone)} className="flex items-center gap-2.5 text-[0.95rem] text-steel transition-colors hover:text-aqua">
                    <Phone className="h-3.5 w-3.5" aria-hidden="true" />
                    {phone}
                  </a>
                ))}
                <a href={mailHref('Project enquiry — A2Care India')} className="flex items-center gap-2.5 text-[0.95rem] text-steel transition-colors hover:text-aqua">
                  <Mail className="h-3.5 w-3.5" aria-hidden="true" />
                  {site.email}
                </a>
                <span className="flex items-center gap-2.5 text-[0.95rem] text-steel">
                  <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                  {site.hours.days}, {site.hours.time}
                </span>
              </div>
              <a href={mapsHref()} target="_blank" rel="noopener noreferrer" className="label text-aqua transition-colors hover:text-ice">
                Open in Google Maps →
              </a>
            </address>
          </div>
        </div>
      </Section>

      {/* -------------------------------------------------------- CTA */}
      <Section tone="light" className="py-16 md:py-24">
        <div className="shell">
          <WaterLine className="mb-12" />
          <LineReveal
            as="h2"
            lines={['Let’s engineer your', 'next water solution.']}
            className="display-lg max-w-[24ch] text-navy"
          />
          <p className="mt-6 max-w-[58ch] text-[1.05rem] leading-[1.7] text-navy/68">
            Tell us about your water treatment requirements. Our team will help you find the
            right engineering solution.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Cta href="/contact" tone="solidLight" icon={<ArrowRight />}>
              Request a free consultation
            </Cta>
            <Cta href={telHref(site.phones[0])} tone="outlineLight">
              Talk to our experts
            </Cta>
          </div>
        </div>
      </Section>
    </>
  );
}
