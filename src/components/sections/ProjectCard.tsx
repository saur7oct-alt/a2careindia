'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { CalendarCheck, Gauge, Layers, MapPin } from 'lucide-react';
import type { Project } from '@/data/projects';
import { MediaFrame } from '@/components/ui/MediaFrame';
import { Stagger, StaggerItem } from '@/components/motion/Reveal';
import { cn } from '@/lib/cn';

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * One delivered plant, rendered either as a large cinematic frame (projects with a
 * verified completion date) or as a tile in the tighter editorial grid.
 *
 * Honesty rules baked in:
 * - MediaFrame stands in for real site photography until A2Care supplies it.
 * - Completion is rendered only when `project.completed` is not null — never implied.
 * - Card copy comes straight from projects.ts; no derived outcome claims.
 */
export function ProjectCard({
  project,
  variant = 'editorial',
  className,
}: {
  project: Project;
  variant?: 'featured' | 'editorial';
  className?: string;
}) {
  const reduced = useReducedMotion();
  const cardRef = useRef<HTMLElement>(null);
  const featured = variant === 'featured';

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start end', 'end start'],
  });

  // Scroll scaling stays deliberately small — 1.0 → 1.06, never a zoom effect.
  const scale = useTransform(scrollYProgress, [0, 1], featured && !reduced ? [1, 1.06] : [1, 1]);
  // Parallax rides the artwork layer only, a few pixels either way.
  const artworkY = useTransform(
    scrollYProgress,
    [0, 1],
    featured && !reduced ? [18, -18] : [0, 0],
  );

  return (
    <motion.article
      ref={cardRef}
      layout
      initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.97 }}
      animate={reduced ? { opacity: 1 } : { opacity: 1, scale: 1 }}
      exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.97 }}
      transition={{ duration: reduced ? 0.2 : 0.45, ease: EASE }}
      className={cn('group relative', className)}
    >
      <div
        className={cn(
          'relative flex flex-col overflow-hidden rounded-panel border border-hairline-dark bg-midnight/35 transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]',
          'group-hover:border-aqua/40',
          featured ? 'md:flex-row md:items-stretch' : '',
        )}
      >
        {/* Artwork zone: wipe mask on entry, scale + parallax on scroll (featured only) */}
        <div
          className={cn(
            'relative shrink-0 overflow-hidden',
            featured
              ? 'aspect-[16/10] md:aspect-auto md:w-[62%]'
              : 'aspect-[4/3]',
          )}
        >
          <motion.div style={{ scale, y: artworkY }} className="absolute inset-[-9%]">
            <MediaFrame
              slotId={project.mediaId}
              className="h-full w-full"
              motifClassName={featured ? 'w-[70%]' : undefined}
              sizes={featured ? '(min-width: 768px) 60vw, 100vw' : '(min-width: 768px) 45vw, 100vw'}
              showLabel
            />
          </motion.div>

          {/* Entry wipe — a midnight panel lifts off the artwork as the card scrolls in */}
          <motion.div
            aria-hidden="true"
            className="grid-lines pointer-events-none absolute inset-0 z-10 origin-top bg-navy"
            initial={reduced ? false : { scaleY: 1 }}
            whileInView={reduced ? undefined : { scaleY: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.95, ease: EASE }}
          />

          <span className="label absolute left-4 top-4 z-20 rounded-pill border border-hairline-dark bg-abyss/65 px-3 py-1.5 text-aqua backdrop-blur-sm">
            {project.category}
          </span>

          {/* Hover / focus reveals the project summary without moving the layout */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 translate-y-3 opacity-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:translate-y-0 group-hover:opacity-100">
            <div className="bg-gradient-to-t from-abyss/92 via-abyss/70 to-transparent px-5 pb-5 pt-14 md:px-6 md:pb-6">
              <p className="max-w-[62ch] text-[0.92rem] leading-relaxed text-ice/90">
                {project.summary}
              </p>
            </div>
          </div>
        </div>

        {/* Metadata */}
        <div className={cn('flex flex-1 flex-col', featured ? 'p-6 md:p-9' : 'p-5 md:p-6')}>
          <Stagger amount={0.2} className="flex flex-col gap-4">
            <StaggerItem>
              <h3 className={cn(featured ? 'display-md' : 'display-sm', 'text-ice')}>
                {project.title}
              </h3>
            </StaggerItem>

            <StaggerItem>
              <p className="text-[0.95rem] leading-relaxed text-steel">
                <span className="text-ice/85">{project.client}</span>
                <span aria-hidden="true"> · </span>
                {project.industry}
              </p>
            </StaggerItem>

            <StaggerItem className="mt-1 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-hairline-dark pt-4">
              <span className="label flex items-center gap-2 text-steel">
                <MapPin size={13} aria-hidden="true" className="text-aqua/80" />
                {project.location}, {project.state}
              </span>
              <span className="label flex items-center gap-2 text-steel">
                <Layers size={13} aria-hidden="true" className="text-aqua/80" />
                {project.plantType}
              </span>
              <span className="label flex items-center gap-2 text-steel">
                <Gauge size={13} aria-hidden="true" className="text-aqua/80" />
                {project.capacity}
              </span>
              {project.completed !== null ? (
                <span className="label flex items-center gap-2 text-aqua">
                  <CalendarCheck size={13} aria-hidden="true" />
                  Completed {project.completed}
                </span>
              ) : null}
            </StaggerItem>
          </Stagger>

          <div className="mt-auto pt-6">
            <span
              aria-hidden="true"
              className="label inline-flex items-center gap-2 text-aqua/85 transition-colors duration-300 group-hover:text-aqua"
            >
              View case study
              <span className="h-px w-8 bg-aqua/50 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:w-14" />
            </span>
          </div>
        </div>
      </div>

      {/* Stretched link — the one tab stop per card */}
      <Link
        href={`/projects/${project.slug}`}
        aria-label={`Open project case: ${project.title} — ${project.location}, ${project.state}`}
        className="absolute inset-0 z-30 rounded-panel"
      >
        <span className="absolute inset-0 rounded-panel" aria-hidden="true" />
      </Link>
    </motion.article>
  );
}
