'use client';

import { useMemo, useState, type ChangeEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import {
  projects,
  projectCategories,
  projectIndustries,
  projectLocations,
  type ProjectCategory,
} from '@/data/projects';
import { Section, SectionHeading, WaterLine } from '@/components/ui/Section';
import { Cta, ArrowRight } from '@/components/ui/Cta';
import { Reveal } from '@/components/motion/Reveal';
import { ProjectCard } from './ProjectCard';
import { cn } from '@/lib/cn';

type CategoryFilter = 'All' | ProjectCategory;

const ALL_INDUSTRIES = 'All industries';
const ALL_LOCATIONS = 'All locations';

const chipBase =
  'rounded-pill border px-4 py-2 transition-colors duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]';

const selectClass =
  'w-full appearance-none rounded-pill border border-hairline-dark bg-navy px-4 py-2.5 pr-10 text-sm text-ice transition-colors duration-300 hover:border-aqua/40 focus-visible:border-aqua/60';

/**
 * Section 07 — the delivered portfolio.
 *
 * Client-side filtering only (no URL state): category chips plus industry/location
 * selects. Cards glide between layouts with framer-motion `layout`; the result count
 * is announced through a polite live region. Projects with a verified completion date
 * get the large cinematic treatment, the rest sit in the editorial grid.
 */
export function ProjectsShowcase() {
  const [category, setCategory] = useState<CategoryFilter>('All');
  const [industry, setIndustry] = useState<string>(ALL_INDUSTRIES);
  const [location, setLocation] = useState<string>(ALL_LOCATIONS);

  const filtered = useMemo(
    () =>
      projects.filter(
        (project) =>
          (category === 'All' || project.category === category) &&
          (industry === ALL_INDUSTRIES || project.industry === industry) &&
          (location === ALL_LOCATIONS || project.location === location),
      ),
    [category, industry, location],
  );

  // Verified completion dates mark the cinematic tier; null dates stay in the grid.
  const featured = filtered.filter((project) => project.completed !== null);
  const editorial = filtered.filter((project) => project.completed === null);
  const filtersActive = category !== 'All' || industry !== ALL_INDUSTRIES || location !== ALL_LOCATIONS;

  const resetFilters = () => {
    setCategory('All');
    setIndustry(ALL_INDUSTRIES);
    setLocation(ALL_LOCATIONS);
  };

  return (
    <Section id="projects" tone="dark" labelledBy="projects-heading">
      <div className="shell">
        <SectionHeading
          id="projects-heading"
          index="07"
          eyebrow="Projects"
          tone="dark"
          lines={['Real projects.', 'Real engineering.', 'Real impact.']}
          lead={
            <>
              Plants delivered for food processing, chemical, refinery, institutional and
              manufacturing duty — reverse osmosis, effluent and sewage treatment, and
              industrial chilling across Uttarakhand and Uttar Pradesh.
            </>
          }
        />

        {/* ---------------------------------------------------------- Controls */}
        <div className="mt-14 flex flex-col gap-6 border-t border-hairline-dark pt-8 lg:flex-row lg:items-end lg:justify-between">
          <div role="group" aria-label="Filter projects by plant category" className="flex flex-wrap gap-2.5">
            {(['All', ...projectCategories] as CategoryFilter[]).map((option) => {
              const active = category === option;
              return (
                <button
                  key={option}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setCategory(option)}
                  className={cn(
                    chipBase,
                    'label',
                    active
                      ? 'border-aqua bg-aqua text-navy'
                      : 'border-hairline-dark text-steel hover:border-aqua/50 hover:text-ice',
                  )}
                >
                  {option}
                </button>
              );
            })}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <label className="relative block w-full sm:w-56">
              <span className="sr-only">Filter projects by industry</span>
              <select
                value={industry}
                onChange={(event: ChangeEvent<HTMLSelectElement>) => setIndustry(event.target.value)}
                className={selectClass}
                style={{ colorScheme: 'dark' }}
              >
                <option value={ALL_INDUSTRIES}>{ALL_INDUSTRIES}</option>
                {projectIndustries.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={15}
                aria-hidden="true"
                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-steel"
              />
            </label>

            <label className="relative block w-full sm:w-64">
              <span className="sr-only">Filter projects by location</span>
              <select
                value={location}
                onChange={(event: ChangeEvent<HTMLSelectElement>) => setLocation(event.target.value)}
                className={selectClass}
                style={{ colorScheme: 'dark' }}
              >
                <option value={ALL_LOCATIONS}>{ALL_LOCATIONS}</option>
                {projectLocations.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={15}
                aria-hidden="true"
                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-steel"
              />
            </label>
          </div>
        </div>

        {/* Result count — announced to screen readers whenever the filter changes */}
        <p aria-live="polite" className="label mt-6 text-steel">
          {filtered.length === 0
            ? 'No projects match this filter combination'
            : `Showing ${filtered.length} of ${projects.length} projects${filtersActive ? ' for this filter' : ''}`}
        </p>

        {/* ------------------------------------------------------ Featured tier */}
        {featured.length > 0 ? (
          <motion.div layout className="mt-12 flex flex-col gap-12 md:gap-16">
            <AnimatePresence mode="popLayout">
              {featured.map((project) => (
                <ProjectCard key={project.slug} project={project} variant="featured" />
              ))}
            </AnimatePresence>
          </motion.div>
        ) : null}

        {/* ------------------------------------------------------ Editorial grid */}
        {editorial.length > 0 ? (
          <motion.div
            layout
            className={cn('grid gap-6 md:grid-cols-2 md:gap-8', featured.length > 0 ? 'mt-14' : 'mt-12')}
          >
            <AnimatePresence mode="popLayout">
              {editorial.map((project) => (
                <ProjectCard key={project.slug} project={project} variant="editorial" />
              ))}
            </AnimatePresence>
          </motion.div>
        ) : null}

        {filtered.length === 0 ? (
          <div className="mt-10 flex flex-col items-start gap-5 rounded-panel border border-hairline-dark bg-midnight/30 p-8">
            <p className="max-w-[58ch] text-[0.98rem] leading-relaxed text-steel">
              Nothing has been published in that combination yet. Every plant delivered
              since 2018 is listed as its case study is confirmed — widen the filter to
              see what is on record.
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="label rounded-pill border border-aqua/40 px-5 py-2.5 text-aqua transition-colors duration-300 hover:bg-aqua/10"
            >
              Clear filters
            </button>
          </div>
        ) : null}

        {/* ---------------------------------------------------------- Closer */}
        <Reveal className="mt-14" y={16} amount={0.4}>
          <div className="flex flex-col items-start gap-6 border-t border-hairline-dark pt-8 md:flex-row md:items-center md:justify-between">
            <WaterLine className="hidden md:block md:w-40" />
            <Cta href="/projects" tone="outlineDark" icon={<ArrowRight />} ariaLabel="View the full project portfolio">
              View all projects
            </Cta>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
