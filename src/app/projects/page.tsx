import type { Metadata } from 'next';
import { projects } from '@/data/projects';
import { buildMetadata } from '@/lib/seo';
import { PageHeader } from '@/components/layout/PageHeader';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { ProjectsShowcase } from '@/components/sections/ProjectsShowcase';
import { CtaBand } from '@/components/sections/CtaBand';
import { Section, Eyebrow } from '@/components/ui/Section';
import { Reveal, Stagger, StaggerItem } from '@/components/motion/Reveal';
import { AnimatedStat } from '@/components/ui/StatCounter';

export const metadata: Metadata = {
  ...buildMetadata({
    title: 'Water Treatment Projects & Installations',
    description:
      'Case studies of commissioned A2Care India installations: 5000 LPH RO for food processing at Pantnagar, a 50 KLD ETP at Rudrapur, a 20 TR chiller at Haldwani, plus school, refinery and STP projects.',
    path: '/projects',
    keywords: [
      'RO plant project Pantnagar',
      'ETP plant Rudrapur project',
      'STP installation Jewar Airport',
      'Industrial chiller project Haldwani',
    ],
  }),
};

const dated = projects.filter((project) => project.completed !== null);
const byState = [...new Set(projects.map((project) => project.state))];

export default function ProjectsPage() {
  return (
    <>
      <PageHeader
        eyebrow={`${projects.length} documented installations`}
        title={
          <>
            Real projects.
            <br />
            Real engineering.
            <br />
            Real impact.
          </>
        }
        lead="Commissioned work across Uttarakhand and Uttar Pradesh — reverse osmosis for food processing and refining, effluent treatment for chemical manufacturing, sewage treatment near developing infrastructure, and process cooling for molding. Filter by system, industry or location."
        aside={
          <div className="glass-dark rounded-panel px-6 py-5">
            <div className="label text-steel">Completion dates on record</div>
            <div className="display-sm mt-2 text-aqua">{dated.length} dated</div>
            <p className="mt-1.5 max-w-[30ch] text-[0.9rem] leading-[1.5] text-steel">
              Remaining projects are recorded with the company; dates are published once
              confirmed rather than estimated.
            </p>
          </div>
        }
      />

      <Breadcrumbs items={[{ name: 'Projects', path: '/projects' }]} />

      {/* --------------------------------------------- Reach summary */}
      <Section tone="dark" className="py-14 md:py-16">
        <div className="shell grid gap-10 lg:grid-cols-[minmax(0,0.34fr)_minmax(0,0.66fr)] lg:items-center">
          <div className="flex flex-col gap-3">
            <Eyebrow>Where the work sits</Eyebrow>
            <p className="text-[1rem] leading-[1.7] text-steel">
              Documented projects span {byState.length} states, with the industrial belt
              around Rudrapur, Pantnagar and Haldwani forming the core and Gautam Buddha
              Nagar to the east.
            </p>
          </div>

          <Stagger className="grid gap-8 sm:grid-cols-3" stagger={0.07}>
            {[
              { value: new Set(projects.map((p) => p.location)).size, suffix: '', label: 'Sites documented', note: 'Linked to case pages' },
              { value: projects.length, suffix: '', label: 'Case studies', note: 'RO · ETP · STP · Chiller' },
              { value: 50, suffix: '+', label: 'Total installations', note: 'As published by the company' },
            ].map((stat) => (
              <StaggerItem key={stat.label}>
                <AnimatedStat
                  value={stat.value}
                  suffix={stat.suffix}
                  label={stat.label}
                  note={stat.note}
                  className="border-l border-hairline-dark pl-5"
                />
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </Section>

      {/* ---------------------------------- Full portfolio + filters */}
      <ProjectsShowcase />

      <CtaBand />
    </>
  );
}
