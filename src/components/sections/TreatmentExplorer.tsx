'use client';

import { useId, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Info, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/cn';
import { Section, SectionHeading, WaterLine } from '@/components/ui/Section';
import { Cta, ArrowRight } from '@/components/ui/Cta';
import { Reveal } from '@/components/motion/Reveal';
import { AssetMotif } from '@/components/ui/AssetMotif';
import { treatmentStages } from '@/data/content';

const EASE = [0.16, 1, 0.3, 1] as const;

type SegmentState = 'idle' | 'flow' | 'done';

/**
 * Optional feature A — interactive treatment train.
 *
 * Stages come straight from `treatmentStages` in `src/data/content.ts`; nothing here is
 * invented. Follows the WAI-ARIA tabs pattern: real `<button>`s as `role="tab"`, roving
 * `tabIndex`, Arrow/Home/End navigation, one `role="tabpanel"`. Selection state is carried by
 * `aria-selected` rather than `aria-pressed`, because the tab pattern already owns "which one
 * is current" — exposing both would give assistive tech two authorities for one fact.
 *
 * Each tab draws its own connector as absolutely positioned `<span>`s inside the button (spans
 * are legal button content), which keeps the tablist's element children down to the tabs and
 * lines the rail up exactly on both the mobile vertical and desktop horizontal layouts.
 * `aria-orientation` is left at its default (`horizontal`); the vertical layout accepts both
 * arrow pairs too, so no direction ever dead-ends.
 */
export function TreatmentExplorer({
  className,
  showDutyLink = true,
}: {
  className?: string;
  /** Suppressed on /solutions, where this section would otherwise link to its own page. */
  showDutyLink?: boolean;
}) {
  const reduced = useReducedMotion();
  const baseId = useId();
  const [active, setActive] = useState(0);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const panelId = `${baseId}-panel`;

  const stages = treatmentStages;
  const total = stages.length;
  const current = stages[active];

  function select(index: number, focus = false) {
    const next = (index + total) % total;
    setActive(next);
    if (focus) tabRefs.current[next]?.focus();
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        event.preventDefault();
        select(active + 1, true);
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        event.preventDefault();
        select(active - 1, true);
        break;
      case 'Home':
        event.preventDefault();
        select(0, true);
        break;
      case 'End':
        event.preventDefault();
        select(total - 1, true);
        break;
      default:
        break;
    }
  }

  return (
    <Section
      id="explorer"
      tone="deeper"
      labelledBy="explorer-heading"
      className={cn('overflow-hidden', className)}
    >
      <div
        aria-hidden="true"
        className="grid-lines pointer-events-none absolute inset-0 opacity-80 [mask-image:radial-gradient(80%_70%_at_50%_0%,#000_15%,transparent_80%)]"
      />

      <div className="shell relative">
        <SectionHeading
          id="explorer-heading"
          tone="dark"
          index="A"
          eyebrow="Treatment train"
          lines={['Water does not', 'arrive treated.']}
          lead="Eight unit operations, in the order they usually appear. Select any stage to read what it does and why it sits where it does — the sequence is a map of what a plant has to accomplish, not a specification."
          className="max-w-[54ch]"
        />

        {/* ------------------------------------------------------------------- Rail */}
        <Reveal delay={0.1} className="mt-14">
          <div className="rounded-panel border border-hairline-dark bg-navy/45 p-6 sm:p-8">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <p className="label text-steel">Process line — {total} stages</p>
              <p className="label text-aqua/80">
                <span className="tabular-nums">
                  {String(active + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
                </span>
              </p>
            </div>

            <div
              role="tablist"
              aria-labelledby="explorer-heading"
              onKeyDown={onKeyDown}
              className="mt-9 flex flex-col gap-6 lg:grid lg:grid-cols-8 lg:gap-0"
            >
              {stages.map((stage, index) => {
                const isActive = index === active;
                const state: SegmentState = index < active ? 'done' : isActive ? 'flow' : 'idle';

                return (
                  <button
                    key={stage.id}
                    ref={(node) => {
                      tabRefs.current[index] = node;
                    }}
                    type="button"
                    role="tab"
                    id={`${baseId}-tab-${index}`}
                    aria-controls={panelId}
                    aria-selected={isActive}
                    tabIndex={isActive ? 0 : -1}
                    onClick={() => select(index)}
                    className={cn(
                      'group relative flex items-start gap-4 rounded-[14px] text-left transition-colors duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] lg:flex-col lg:items-center lg:gap-3 lg:text-center',
                      !isActive && 'hover:bg-aqua/[0.05]',
                    )}
                  >
                    {index < total - 1 ? <Connector state={state} reduced={Boolean(reduced)} /> : null}

                    <span
                      className={cn(
                        'relative z-10 grid h-11 w-11 shrink-0 place-items-center rounded-full border font-mono text-[0.8rem] tabular-nums transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]',
                        isActive
                          ? 'border-aqua bg-aqua text-navy shadow-[0_0_0_6px_rgba(32,213,210,0.13)]'
                          : index < active
                            ? 'border-aqua/45 bg-aqua/[0.08] text-aqua'
                            : 'border-hairline-dark bg-midnight/50 text-steel group-hover:border-aqua/40 group-hover:text-ice',
                      )}
                    >
                      {String(stage.order).padStart(2, '0')}
                      {isActive && !reduced ? (
                        <motion.span
                          aria-hidden="true"
                          className="absolute inset-0 rounded-full border border-aqua/60"
                          initial={{ scale: 1, opacity: 0.55 }}
                          animate={{ scale: 1.45, opacity: 0 }}
                          transition={{ duration: 2.1, repeat: Infinity, ease: 'easeOut' }}
                        />
                      ) : null}
                    </span>

                    <span className="flex flex-col gap-1.5 pb-1 lg:items-center">
                      <span
                        className={cn(
                          'font-display text-[0.92rem] font-medium leading-[1.25] transition-colors duration-300',
                          isActive ? 'text-ice' : 'text-steel group-hover:text-ice',
                        )}
                      >
                        {stage.title}
                      </span>
                      {stage.optional ? (
                        <span className="label w-fit rounded-pill border border-dashed border-electric/45 px-2 py-1 text-electric/90">
                          where applicable
                        </span>
                      ) : null}
                    </span>
                  </button>
                );
              })}
            </div>

            <p className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-hairline-dark pt-5 text-[0.82rem] text-steel/85">
              <span>
                Select a node, or use the arrow keys — Home and End jump to the ends of the line.
              </span>
              <span className="label inline-flex items-center gap-2 text-electric/85">
                <span className="h-px w-6 border-t border-dashed border-electric/60" aria-hidden="true" />
                where applicable
              </span>
            </p>
          </div>
        </Reveal>

        {/* ------------------------------------------------------------ Detail panel */}
        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:items-start">
          <div
            role="tabpanel"
            id={panelId}
            aria-labelledby={`${baseId}-tab-${active}`}
            tabIndex={0}
            className="relative min-h-[20rem] overflow-hidden rounded-panel border border-hairline-dark bg-navy/60 p-7 sm:p-9"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={current.id}
                initial={reduced ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduced ? undefined : { opacity: 0, y: -8 }}
                transition={reduced ? { duration: 0 } : { duration: 0.4, ease: EASE }}
              >
                <div className="flex flex-wrap items-center gap-3">
                  <p className="label text-aqua">
                    <span className="tabular-nums">
                      Stage {String(current.order).padStart(2, '0')} of{' '}
                      {String(total).padStart(2, '0')}
                    </span>
                  </p>
                  {current.optional ? (
                    <p className="label rounded-pill border border-dashed border-electric/45 px-2.5 py-1 text-electric">
                      where applicable
                    </p>
                  ) : null}
                </div>

                <h3 className="display-md mt-4 text-ice">{current.title}</h3>

                <p className="mt-4 border-l-2 border-aqua/45 pl-4 font-display text-[1.12rem] leading-[1.45] text-ice/90 sm:text-[1.22rem]">
                  {current.function}
                </p>

                <p className="mt-5 max-w-[58ch] text-[1rem] leading-[1.72] text-steel">
                  {current.detail}
                </p>

                <WaterLine className="mt-7" />

                <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
                  <p className="label max-w-[46ch] text-steel/75">
                    {current.order === 1
                      ? 'Entry point — everything downstream is sized from here'
                      : current.order === total
                        ? 'Delivery point — output held to specification'
                        : 'Position in the train is set by feed water and duty'}
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => select(active - 1, true)}
                      disabled={active === 0}
                      className="label rounded-pill border border-hairline-dark px-3.5 py-2 text-steel transition-colors duration-300 hover:border-aqua/50 hover:text-ice disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      previous stage
                    </button>
                    <button
                      type="button"
                      onClick={() => select(active + 1, true)}
                      disabled={active === total - 1}
                      className="label rounded-pill border border-hairline-dark px-3.5 py-2 text-steel transition-colors duration-300 hover:border-aqua/50 hover:text-ice disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      next stage
                    </button>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Quiet technical column — the same eight stages as an index. */}
          <Reveal delay={0.08} className="relative overflow-hidden rounded-panel border border-hairline-dark bg-midnight/45 p-7">
            <AssetMotif
              kind={current.optional ? 'panel' : 'flow'}
              className="pointer-events-none absolute -right-6 -top-4 w-[62%] max-w-[280px] text-aqua/15"
            />
            <p className="label relative text-steel">Where this sits</p>
            <ul className="relative mt-5 flex flex-col gap-2.5">
              {stages.map((stage, index) => (
                <li key={stage.id} className="flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className={cn(
                      'h-px shrink-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]',
                      index === active ? 'w-8 bg-aqua' : 'w-4 bg-hairline-dark',
                    )}
                  />
                  <span
                    className={cn(
                      'font-mono text-[0.78rem] leading-[1.4] transition-colors duration-300',
                      index === active ? 'text-aqua' : 'text-steel/75',
                    )}
                  >
                    {String(stage.order).padStart(2, '0')} {stage.title}
                    {stage.optional ? ' ·' : ''}
                  </span>
                  {index === active ? <span className="sr-only">— selected</span> : null}
                </li>
              ))}
            </ul>
            <p className="relative mt-6 max-w-[40ch] text-[0.82rem] leading-[1.55] text-steel/80">
              A middle dot marks a stage that appears only where the duty calls for it.
            </p>
          </Reveal>
        </div>

        {/* ---------------------------------------------------------------- Caveat */}
        <Reveal delay={0.05} className="mt-8">
          <div
            role="note"
            className="flex flex-col gap-4 rounded-panel border border-electric/30 bg-electric/[0.07] p-7 sm:p-8 md:flex-row md:items-start md:gap-7"
          >
            <span
              aria-hidden="true"
              className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-electric/35 text-electric"
            >
              <Lightbulb className="h-5 w-5" strokeWidth={1.6} />
            </span>
            <div>
              <p className="label text-electric">Read this before mapping your site onto it</p>
              <p className="mt-3 max-w-[68ch] text-[1.02rem] leading-[1.68] text-ice/90 sm:text-[1.1rem]">
                The treatment configuration your plant needs varies with the quality of its feed
                water and the requirements of the project. Stages get skipped, added, repeated or
                reordered — a borehole carrying heavy hardness is not a municipal line with
                chlorine, and drinking water is not boiler feed. This diagram shows what a
                treatment train is made of. It does not size or specify yours.
              </p>
              <p className="mt-4 flex items-start gap-2 text-[0.86rem] leading-[1.55] text-steel">
                <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-electric/70" aria-hidden="true" />
                A raw water analysis is what turns this into a design. A2Care works from that
                report, not from a diagram.
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.08} className="mt-8 flex flex-wrap items-center gap-4">
          <Cta href="/contact" icon={<ArrowRight className="h-4 w-4" aria-hidden="true" />}>
            Discuss a specific site
          </Cta>
          <Cta href="/products" tone="outlineDark" magnetic={false}>
            Browse published ranges
          </Cta>
          {showDutyLink ? (
            <Cta href="/solutions" tone="ghost" magnetic={false}>
              See how duties are approached
            </Cta>
          ) : null}
        </Reveal>
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------ *
 * Connector — one horizontal segment (desktop) and one vertical
 * segment (mobile) per gap between stages, drawn inside the tab.
 * ------------------------------------------------------------------ */

function Connector({ state, reduced }: { state: SegmentState; reduced: boolean }) {
  const filled = state !== 'idle';

  return (
    <>
      {/* Mobile: vertical rail from this node down to the next one. */}
      <span
        aria-hidden="true"
        className="absolute left-[calc(1.375rem_-_1px)] top-[2.75rem] -bottom-6 w-0.5 overflow-hidden lg:hidden"
      >
        <span className="absolute inset-0 bg-hairline-dark" />
        <motion.span
          className={cn(
            'absolute inset-0 origin-top block',
            state === 'done' ? 'bg-aqua/55' : 'bg-gradient-to-b from-aqua/80 to-electric/60',
          )}
          initial={false}
          animate={{ scaleY: filled ? 1 : 0 }}
          transition={reduced ? { duration: 0 } : { duration: 0.5, ease: EASE }}
        />
        {state === 'flow' && !reduced ? (
          <motion.span
            className="absolute left-1/2 block h-2 w-2 -translate-x-1/2 rounded-full bg-electric/90"
            initial={{ top: '0%' }}
            animate={{ top: ['0%', '100%'] }}
            transition={{ duration: 1.7, repeat: Infinity, ease: 'linear' }}
          />
        ) : null}
      </span>

      {/* Desktop: horizontal rail from this node's edge to the next node's edge. */}
      <span
        aria-hidden="true"
        className="absolute top-[calc(1.375rem_-_1px)] left-[calc(50%_+_1.375rem)] hidden h-0.5 w-[calc(100%_-_2.75rem)] overflow-hidden lg:block"
      >
        <span className="absolute inset-0 bg-hairline-dark" />
        <motion.span
          className={cn(
            'absolute inset-0 block origin-left',
            state === 'done' ? 'bg-aqua/55' : 'bg-gradient-to-r from-aqua/80 to-electric/60',
          )}
          initial={false}
          animate={{ scaleX: filled ? 1 : 0 }}
          transition={reduced ? { duration: 0 } : { duration: 0.5, ease: EASE }}
        />
        {state === 'flow' && !reduced ? (
          <motion.span
            className="absolute top-1/2 left-0 block h-2 w-2 -translate-y-1/2 rounded-full bg-electric/90"
            initial={{ left: '0%' }}
            animate={{ left: ['0%', '100%'] }}
            transition={{ duration: 1.7, repeat: Infinity, ease: 'linear' }}
          />
        ) : null}
      </span>
    </>
  );
}
