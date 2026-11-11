'use client';

import { useEffect, useRef, useState } from 'react';
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
  type Variants,
} from 'framer-motion';
import { Section, SectionHeading } from '@/components/ui/Section';
import { MediaFrame } from '@/components/ui/MediaFrame';
import { storyFrames, type StoryFrame } from '@/data/content';
import { cn } from '@/lib/cn';

const STORY_HEADING_ID = 'story-heading';

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const FRAMES = storyFrames;
const TOTAL = FRAMES.length;
/** Scroll distance between two frame centres, in normalised track progress. */
const SEGMENT = 1 / (TOTAL - 1);
const TOTAL_LABEL = String(TOTAL).padStart(2, '0');

/**
 * Stage colour ramps through each frame's own `tone.from → tone.to`.
 * Two points per frame leave a hold in the middle of a frame and a short bridge into the
 * next, which is possible because the data is contiguous (frame n's `to` is n+1's `from`).
 */
const TONE_STOPS = FRAMES.flatMap((frame, index) => [
  { at: index * SEGMENT - SEGMENT * 0.4, color: frame.tone.from },
  { at: index * SEGMENT + SEGMENT * 0.4, color: frame.tone.to },
]);
const TONE_RANGE = TONE_STOPS.map((stop) => stop.at);
const TONE_COLORS = TONE_STOPS.map((stop) => stop.color);

/**
 * SECTION 03 — raw water to pure water, advanced by scroll.
 *
 * Mechanism: a tall track holds a `position: sticky` stage, and every visual is derived
 * from one `useScroll({ offset: ['start start', 'end end'] })` value, softened by
 * `useSpring`. Scrolling stays native — nothing is captured, translated or prevented —
 * so Lenis, anchor links and keyboard scrolling all keep working.
 *
 * Two renderings share the DOM: the pinned sequence (motion allowed) and the same five
 * frames as an ordinary vertical list (`motion-reduce`, and for visitors with no JS).
 * Copy is identical in both, so the section reads sequentially either way.
 */
export function WaterStory() {
  return (
    <Section id="story" bleed tone="dark" labelledBy={STORY_HEADING_ID}>
      {/* Two renderings, one copy. Motion allowed: the stage is what sighted visitors see
          and the list drops to `sr-only`, so screen readers still get all five frames in
          order and the scroll-driven stage never announces mid-sentence. Reduced motion or
          no JavaScript: the stage is display:none and the list is ordinary visible content.
          The noscript rule is what makes that last case work — the browser parses it as
          markup only when scripting is off, and React leaves the inert subtree alone. */}
      <noscript>
        <style>{'.story-stage{display:none !important}.story-seq{position:static !important;width:auto !important;height:auto !important;margin:0 !important;overflow:visible !important;clip:auto !important;white-space:normal !important}'}</style>
      </noscript>

      <div className="shell pt-24 pb-12 md:pt-32 md:pb-16">
        <SectionHeading
          id={STORY_HEADING_ID}
          eyebrow="Treatment sequence"
          index="03"
          lines={['From raw intake', 'to pure output.']}
          lead="The same water, in the order it actually travels the plant: intake, pre-treatment, membrane, control, output. Each stage is sized against the raw water analysis rather than a default configuration, so the train shown here is the sequence, not a promise about your site."
          className="max-w-[54rem]"
        />

        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2">
          <span className="label flex items-center gap-2 text-steel/70">
            <span aria-hidden="true" className="h-1 w-1 rounded-full bg-aqua/60" />
            Stand-in artwork — awaiting A2Care site media
          </span>
          <span className="label text-steel/55">05 stages · intake to output</span>
        </div>
      </div>

      <div className="story-stage hidden motion-safe:block" aria-hidden="true">
        <PinnedStory />
      </div>

      {/* Sequential rendering: no pinning, no colour interpolation, no transforms. */}
      <ol className="story-seq shell flex flex-col gap-12 pb-24 motion-safe:sr-only md:gap-16 md:pb-32">
        {FRAMES.map((frame) => (
          <li
            key={frame.id}
            className="overflow-hidden rounded-panel border border-hairline-dark bg-abyss/45"
          >
            <MediaFrame slotId={frame.mediaId} className="aspect-[16/10] w-full" showLabel />
            <div className="flex flex-col gap-5 p-6 md:p-8">
              <div className="label flex items-center gap-3 text-aqua">
                <span className="tabular-nums">{frame.index}</span>
                <span aria-hidden="true" className="h-px w-7 bg-aqua/40" />
                <span>{frame.stage}</span>
              </div>

              <h3 className="display-sm text-ice">{frame.title}</h3>
              <p className="max-w-[62ch] text-[1rem] leading-[1.7] text-ice/72">{frame.body}</p>

              <dl className="grid gap-2 border-l border-hairline-dark pl-4">
                {frame.readout.map((item) => (
                  <div key={item.label} className="flex items-baseline justify-between gap-6">
                    <dt className="label text-steel/75">{item.label}</dt>
                    <dd className="label text-right tabular-nums text-ice/90">{item.value}</dd>
                  </div>
                ))}
              </dl>

              {/* Static swatch of the tone this frame would have interpolated through. */}
              <div
                className="mt-1 h-1 rounded-pill opacity-70"
                style={{ backgroundColor: frame.tone.to }}
                aria-hidden="true"
              />
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}

/* ==========================================================================
   Pinned stage
   ========================================================================== */

function PinnedStory() {
  const reduced = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start start', 'end end'],
  });
  // While `.story-stage` is display:none (reduced motion) the target measures zero and
  // the offsets collapse, so progress can arrive as NaN. Pin it to a finite number before
  // anything downstream interpolates from it.
  const trackProgress = useTransform(scrollYProgress, (value) => (Number.isFinite(value) ? value : 0));
  // A light spring so scrubbing reads as momentum instead of stepping frame to frame.
  const progress = useSpring(trackProgress, { stiffness: 110, damping: 28, mass: 0.4 });
  const tone = useTransform(progress, TONE_RANGE, TONE_COLORS);

  const [active, setActive] = useState(0);
  // Only the two frames either side of the current position are ever mounted.
  const [mounted, setMounted] = useState<number[]>(() => [0, 1]);
  const [narrow, setNarrow] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(max-width: 1023px)');
    const sync = () => setNarrow(query.matches);
    sync();
    query.addEventListener('change', sync);
    return () => query.removeEventListener('change', sync);
  }, []);

  useMotionValueEvent(progress, 'change', (value) => {
    const position = value / SEGMENT; // 0 … TOTAL-1 in frame units
    const nearest = Math.min(Math.max(Math.round(position), 0), TOTAL - 1);
    const lower = Math.min(Math.max(Math.floor(position), 0), TOTAL - 2);

    setActive((previous) => (previous === nearest ? previous : nearest));
    setMounted((previous) => (previous[0] === lower ? previous : [lower, lower + 1]));
  });

  const frame = FRAMES[active];

  return (
    <div ref={trackRef} className="relative h-[420vh] md:h-[540vh]">
      <div className="sticky top-0 flex h-[100svh] flex-col overflow-hidden">
        {/* Interpolated stage colour: a deep wash across the whole pinned viewport… */}
        <motion.div aria-hidden="true" className="absolute inset-0 opacity-[0.14]" style={{ backgroundColor: tone }} />
        {/* …pushed back to the section colour at the top and bottom seams. */}
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-b from-navy via-transparent to-navy" />

        <div className="shell relative z-10 flex min-h-0 flex-1 flex-col gap-5 pt-20 pb-6 md:pt-28 lg:grid lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:gap-14 lg:pt-32 lg:pb-16">
          {/* ------------------------------------------------ Visual stage */}
          <div className="order-1 min-h-0 lg:order-2 lg:h-full">
            <motion.div
              className="relative h-[26svh] min-h-[180px] w-full overflow-hidden rounded-panel border border-hairline-dark p-[3px] sm:h-[34svh] sm:min-h-[220px] lg:h-full"
              style={{ backgroundColor: tone }}
            >
              {/* Hairline sheen on the mat, so the colour ramp reads as a lit surface. */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-br from-ice/10 via-transparent to-transparent"
              />

              <div className="relative h-full w-full overflow-hidden rounded-[17px] bg-abyss">
                {mounted.map((index) => (
                  <StageFrame
                    key={FRAMES[index].id}
                    frame={FRAMES[index]}
                    index={index}
                    progress={progress}
                    narrow={narrow}
                  />
                ))}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 rounded-[17px] bg-gradient-to-t from-abyss/45 via-transparent to-transparent border border-ice/[0.06]"
                />
              </div>
            </motion.div>
          </div>

          {/* ---------------------------------------------------- Copy rail */}
          <div className="order-2 flex min-h-0 flex-1 flex-col justify-center lg:order-1">
            {/* Progress: numeral pair changes with state, the fill scrubs on a motion value. */}
            <div className="flex items-center gap-4">
              <span className="label tabular-nums text-aqua">{frame.index}</span>
              <span className="label tabular-nums text-steel/50">/ {TOTAL_LABEL}</span>
              <div className="relative h-px w-full max-w-[220px] overflow-hidden bg-steel/25">
                <motion.div
                  aria-hidden="true"
                  className="absolute inset-0 origin-left bg-gradient-to-r from-electric to-aqua"
                  style={{ scaleX: progress }}
                />
              </div>
            </div>

            <AnimatePresence mode="wait">
              <FrameCopy key={frame.id} frame={frame} reduced={Boolean(reduced)} />
            </AnimatePresence>

            {/* Stage ticks — decorative mirror of the numeral indicator. */}
            <div className="mt-8 flex items-center gap-2" aria-hidden="true">
              {FRAMES.map((item, index) => (
                <span
                  key={item.id}
                  className={cn(
                    'h-px flex-1 max-w-[46px] transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]',
                    index <= active ? 'bg-aqua/55' : 'bg-steel/20',
                  )}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   Frame layers
   ========================================================================== */

/**
 * One mounted frame of artwork. Opacity holds flat through the middle of its scroll
 * window and cross-fades with its neighbour; the scale drift is disabled on small
 * screens, where a full-viewport transform would cost paint time.
 */
function StageFrame({
  frame,
  index,
  progress,
  narrow,
}: {
  frame: StoryFrame;
  index: number;
  progress: MotionValue<number>;
  narrow: boolean;
}) {
  const center = index * SEGMENT;
  const fade = SEGMENT * 0.38;
  const hold = SEGMENT * 0.14;

  const opacity = useTransform(progress, [center - fade, center - hold, center + hold, center + fade], [0, 1, 1, 0]);
  const scale = useTransform(progress, [center - fade, center + fade], narrow ? [1, 1] : [0.985, 1.045]);

  return (
    <motion.div aria-hidden="true" className="absolute inset-0" style={{ opacity, scale }}>
      <MediaFrame slotId={frame.mediaId} className="h-full w-full" sizes="(min-width: 1024px) 46vw, 92vw" />
      <span
        aria-hidden="true"
        className="display-xl pointer-events-none absolute -bottom-8 right-2 select-none leading-none text-ice/[0.07]"
      >
        {frame.index}
      </span>
    </motion.div>
  );
}

/**
 * Title, body and readout for the active frame. The title travels behind an overflow
 * mask (`maskUp` style) and the readout rows stagger in behind it, then the whole block
 * leaves upward so the next frame arrives from below.
 */
function FrameCopy({ frame, reduced }: { frame: StoryFrame; reduced: boolean }) {
  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: reduced ? 0 : 0.07 },
    },
    // Short exit: `mode="wait"` pages the rail, so a long exit would read as a stall.
    exit: { opacity: 0, transition: { duration: reduced ? 0 : 0.16, ease: EASE } },
  };

  const mask: Variants = {
    hidden: { y: reduced ? 0 : '110%' },
    show: { y: 0, transition: { duration: reduced ? 0 : 0.8, ease: EASE } },
    exit: { y: reduced ? 0 : '-110%', transition: { duration: reduced ? 0 : 0.22, ease: EASE } },
  };

  const soft: Variants = {
    hidden: { opacity: 0, y: reduced ? 0 : 14 },
    show: { opacity: 1, y: 0, transition: { duration: reduced ? 0 : 0.6, ease: EASE } },
    exit: { opacity: 0, transition: { duration: reduced ? 0 : 0.18, ease: EASE } },
  };

  return (
    <motion.div
      variants={container}
      initial={reduced ? false : 'hidden'}
      animate="show"
      exit="exit"
      className="mt-7 flex flex-col"
    >
      <motion.div variants={soft} className="label flex items-center gap-3 text-aqua">
        <span>{frame.stage}</span>
        <span aria-hidden="true" className="h-px w-7 bg-aqua/40" />
        <span className="tabular-nums text-steel/70">{frame.index}</span>
      </motion.div>

      <div className="mt-4 overflow-hidden pb-[0.08em]">
        <motion.h3 variants={mask} className="display-md max-w-[24ch] text-ice">
          {frame.title}
        </motion.h3>
      </div>

      <motion.p
        variants={soft}
        className="mt-4 max-w-[58ch] text-[0.95rem] leading-[1.62] text-ice/74 md:text-[1.02rem] md:leading-[1.7]"
      >
        {frame.body}
      </motion.p>

      {/* Readout rows inherit the container's stagger, so they arrive line by line. */}
      <dl className="mt-7 grid gap-2.5 border-l border-hairline-dark pl-4">
        {frame.readout.map((item) => (
          <motion.div key={item.label} variants={soft} className="flex items-baseline justify-between gap-6">
            <dt className="label shrink-0 text-steel/75">{item.label}</dt>
            <dd className="label text-right tabular-nums text-ice/90">{item.value}</dd>
          </motion.div>
        ))}
      </dl>
    </motion.div>
  );
}
