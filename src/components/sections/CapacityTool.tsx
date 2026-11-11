'use client';

import { useId, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  ListChecks,
  MessageCircle,
  RotateCcw,
  Send,
} from 'lucide-react';
import { cn } from '@/lib/cn';
import { Section, SectionHeading } from '@/components/ui/Section';
import { Cta, ArrowRight } from '@/components/ui/Cta';
import { Reveal } from '@/components/motion/Reveal';
import { scrollToId } from '@/lib/lenis';
import { whatsappHref } from '@/lib/site';
import {
  REGION_OPTIONS,
  capacityOptionsForPlant,
  capacitySummaryLines,
  capacityWhatsappMessage,
  emptyCapacitySelection,
  industryOptions,
  prefillFromCapacity,
  publishCapacitySelection,
  publishedRangeForPlant,
  solutionOptions,
  type CapacitySelection,
} from '@/lib/enquiry';

const EASE = [0.16, 1, 0.3, 1] as const;

type StepField = keyof CapacitySelection;

type Step = {
  id: string;
  label: string;
  field: StepField;
  question: string;
  helper: string;
};

/**
 * Optional feature B — capacity enquiry assistant.
 *
 * Four steps, and every option is lifted from published data (`products.ts` names, the
 * capacity bands traced in `src/lib/enquiry.ts`, `industries.ts` sectors). The tool
 * structures what the visitor selects and hands it to the contact form. It never recommends
 * a capacity, a technology or a recovery ratio — the company has not published that advice,
 * and a website widget inventing it would be the worst possible way to open an engineering
 * conversation.
 *
 * Placement: put this ABOVE `ContactSection` in the page. Its primary action scrolls to
 * `#contact` and prefills `EnquiryForm` through the small hand-off store in `lib/enquiry`.
 */
const steps: readonly Step[] = [
  {
    id: 'plant',
    label: 'Plant type',
    field: 'plant',
    question: 'Which system are you looking at?',
    helper: 'Pick the closest published category. More than one may apply — say so in the message.',
  },
  {
    id: 'capacity',
    label: 'Capacity',
    field: 'capacity',
    question: 'What capacity band are you working to?',
    helper: 'Only the bands A2Care publishes for that system. Nothing here is a recommendation.',
  },
  {
    id: 'application',
    label: 'Application',
    field: 'application',
    question: 'Where does the water go?',
    helper: 'The sector the system serves, so the requirement arrives with its context.',
  },
  {
    id: 'location',
    label: 'Location',
    field: 'region',
    question: 'Where would the plant be installed?',
    helper: 'Region first. Add the city or district if you have it — it decides logistics and water source.',
  },
];

const TOTAL = steps.length;

export function CapacityTool({ className }: { className?: string }) {
  const reduced = useReducedMotion();
  const baseId = useId();
  const [stepIndex, setStepIndex] = useState(0);
  const [selection, setSelection] = useState<CapacitySelection>(emptyCapacitySelection);
  const [handoffNote, setHandoffNote] = useState('');
  const [visited, setVisited] = useState(0);
  const summaryRef = useRef<HTMLDivElement | null>(null);

  const onSummary = stepIndex >= TOTAL;
  // Narrowing anchor: everything that reads a field off the step goes through this.
  const currentStep: Step | undefined = stepIndex < TOTAL ? steps[stepIndex] : undefined;
  const chosen = currentStep ? selection[currentStep.field].trim().length > 0 : true;
  const complete = steps.every((item) => selection[item.field].trim().length > 0);

  const announce = currentStep
    ? `Step ${stepIndex + 1} of ${TOTAL}: ${currentStep.label}. ${
        selection[currentStep.field]
          ? `Selected: ${selection[currentStep.field]}`
          : 'Nothing selected yet.'
      }`
    : `Reviewing your selection. ${countChosen(selection)} of ${TOTAL} steps answered.`;

  function goTo(index: number) {
    setStepIndex(index);
    setVisited((current) => Math.max(current, index));
    setHandoffNote('');
  }

  function choose(field: StepField, value: string) {
    setSelection((previous) => {
      // Changing the plant invalidates a capacity picked under the previous one.
      const next: CapacitySelection = { ...previous, [field]: value };
      if (field === 'plant' && previous.plant !== value) next.capacity = '';
      return next;
    });
  }

  function sendToForm() {
    publishCapacitySelection(selection);
    setHandoffNote(
      'Your answers are in the enquiry form below — add your name, phone and email, then submit.',
    );
    scrollToId('contact');
  }

  function startAgain() {
    setSelection(emptyCapacitySelection);
    setVisited(0);
    setHandoffNote('');
    setStepIndex(0);
  }

  function focusSummary() {
    summaryRef.current?.focus({ preventScroll: true });
  }

  function advance() {
    if (stepIndex < TOTAL) {
      const next = stepIndex + 1;
      goTo(next);
      if (next === TOTAL) window.setTimeout(focusSummary, 60);
    }
  }

  return (
    <Section
      id="capacity-tool"
      tone="dark"
      labelledBy="capacity-heading"
      className={cn('overflow-hidden', className)}
    >
      <div
        aria-hidden="true"
        className="grid-lines pointer-events-none absolute inset-0 opacity-60 [mask-image:radial-gradient(70%_60%_at_75%_0%,#000_10%,transparent_78%)]"
      />

      <div className="shell relative">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:items-start lg:gap-16">
          <SectionHeading
            id="capacity-heading"
            tone="dark"
            index="B"
            eyebrow="Enquiry assistant"
            lines={['Frame the ask', 'in four steps.']}
            lead="A short structured pass at what you need, so the enquiry arrives with its context already attached. It writes your answers into the project enquiry form — it does not size, select or price anything."
          />

          <Reveal delay={0.08}>
            <p className="flex items-start gap-3 rounded-panel border border-hairline-dark bg-midnight/40 p-5 text-[0.9rem] leading-[1.6] text-steel">
              <ListChecks className="mt-0.5 h-4 w-4 shrink-0 text-aqua" aria-hidden="true" />
              <span>
                <span className="text-ice">What this tool will not do:</span> recommend a capacity,
                a technology or a recovery ratio. Sizing follows a feed water analysis and your
                actual process demand, and A2Care does that work from your numbers — not from a
                wizard.
              </span>
            </p>
          </Reveal>
        </div>

        {/* ---------------------------------------------------------------- Console */}
        <Reveal delay={0.1} className="mt-12">
          <div className="overflow-hidden rounded-panel border border-hairline-dark bg-navy/60">
            {/* Progress rail */}
            <nav aria-label="Enquiry assistant progress" className="border-b border-hairline-dark px-5 py-4 sm:px-7">
              <ol className="flex flex-wrap items-stretch gap-2 sm:gap-3">
                {steps.map((item, index) => {
                  const isCurrent = index === stepIndex;
                  const reached = index <= visited;
                  const answered = selection[item.field].trim().length > 0;

                  return (
                    <li key={item.id} className="min-w-[8.5rem] flex-1">
                      <button
                        type="button"
                        onClick={() => goTo(index)}
                        disabled={!reached}
                        aria-current={isCurrent ? 'step' : undefined}
                        className={cn(
                          'group flex w-full flex-col gap-2 rounded-[12px] px-3 py-2.5 text-left transition-colors duration-300',
                          isCurrent ? 'bg-aqua/[0.1]' : 'hover:bg-aqua/[0.05]',
                          !reached && 'cursor-not-allowed opacity-40 hover:bg-transparent',
                        )}
                      >
                        <span className="label flex items-center gap-2">
                          <span className={cn('tabular-nums', isCurrent ? 'text-aqua' : 'text-steel/70')}>
                            {String(index + 1).padStart(2, '0')}
                          </span>
                          <span className={cn(isCurrent ? 'text-ice' : 'text-steel/80')}>{item.label}</span>
                          {answered ? (
                            <span className={cn('h-1.5 w-1.5 rounded-full', isCurrent ? 'bg-aqua' : 'bg-electric/70')} aria-hidden="true" />
                          ) : null}
                        </span>
                        <span
                          aria-hidden="true"
                          className={cn(
                            'h-0.5 w-full rounded-pill transition-colors duration-500',
                            answered ? 'bg-aqua/70' : isCurrent ? 'bg-electric/40' : 'bg-hairline-dark',
                          )}
                        />
                        {answered ? (
                          <span className="sr-only">answered</span>
                        ) : null}
                      </button>
                    </li>
                  );
                })}
                <li className="min-w-[8.5rem] flex-1">
                  <button
                    type="button"
                    onClick={() => goTo(TOTAL)}
                    disabled={!complete}
                    aria-current={onSummary ? 'step' : undefined}
                    className={cn(
                      'flex w-full flex-col gap-2 rounded-[12px] px-3 py-2.5 text-left transition-colors duration-300',
                      onSummary ? 'bg-aqua/[0.1]' : 'hover:bg-aqua/[0.05]',
                      !complete && 'cursor-not-allowed opacity-40 hover:bg-transparent',
                    )}
                  >
                    <span className="label flex items-center gap-2">
                      <span className={cn('tabular-nums', onSummary ? 'text-aqua' : 'text-steel/70')}>
                        0{TOTAL + 1}
                      </span>
                      <span className={cn(onSummary ? 'text-ice' : 'text-steel/80')}>Summary</span>
                    </span>
                    <span
                      aria-hidden="true"
                      className={cn(
                        'h-0.5 w-full rounded-pill',
                        onSummary ? 'bg-aqua/70' : 'bg-hairline-dark',
                      )}
                    />
                  </button>
                </li>
              </ol>
            </nav>

            {/* Live region: step changes are announced without moving focus. */}
            <p aria-live="polite" role="status" className="sr-only">
              {announce}
            </p>

            <div className="relative px-5 py-8 sm:px-7 sm:py-9">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={currentStep ? currentStep.id : 'summary'}
                  initial={reduced ? false : { opacity: 0, x: 18 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={reduced ? undefined : { opacity: 0, x: -14 }}
                  transition={reduced ? { duration: 0 } : { duration: 0.36, ease: EASE }}
                >
                  {currentStep ? (
                    <StepPanel
                      step={currentStep}
                      stepIndex={stepIndex}
                      selection={selection}
                      baseId={baseId}
                      onChoose={choose}
                    />
                  ) : (
                    <SummaryPanel
                      selection={selection}
                      summaryRef={summaryRef}
                      note={handoffNote}
                      onSend={sendToForm}
                      onReset={startAgain}
                    />
                  )}
                </motion.div>
              </AnimatePresence>

              {/* ------------------------------------------------------ Step controls */}
              <div className="mt-9 flex flex-wrap items-center justify-between gap-4 border-t border-hairline-dark pt-6">
                <button
                  type="button"
                  onClick={() => goTo(Math.max(0, stepIndex - 1))}
                  disabled={stepIndex === 0}
                  className={cn(
                    'label inline-flex items-center gap-2 rounded-pill border border-hairline-dark px-4 py-2.5 text-steel',
                    'transition-colors duration-300 hover:border-aqua/50 hover:text-ice',
                    'disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:border-hairline-dark disabled:hover:text-steel',
                  )}
                >
                  <ChevronLeft className="h-3.5 w-3.5" aria-hidden="true" />
                  back
                </button>

                <div className="flex items-center gap-4">
                  {!chosen && currentStep ? (
                    <p className="max-w-[24ch] text-right text-[0.82rem] leading-[1.45] text-steel/80">
                      Choose one option to continue.
                    </p>
                  ) : null}

                  {onSummary ? (
                    <p className="label text-steel/70">
                      {countChosen(selection)} / {TOTAL} answered
                    </p>
                  ) : (
                    <button
                      type="button"
                      onClick={advance}
                      disabled={!chosen}
                      className={cn(
                        'inline-flex items-center gap-2.5 rounded-pill bg-aqua px-6 py-3 font-display text-[0.92rem] font-medium text-navy',
                        'transition-colors duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-[#4ae3e0]',
                        'disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-aqua',
                      )}
                    >
                      {stepIndex === TOTAL - 1 ? 'Review selection' : 'next'}
                      <ChevronRight className="h-4 w-4" aria-hidden="true" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.06} className="mt-8 flex flex-wrap items-center gap-4">
          <Cta href="/contact" tone="outlineDark" magnetic={false} icon={<ArrowRight className="h-4 w-4" aria-hidden="true" />}>
            Skip straight to the enquiry form
          </Cta>
          <p className="max-w-[46ch] text-[0.84rem] leading-[1.55] text-steel">
            The form is also fine on its own. This assistant is just a way to hand over the same
            four answers in one go.
          </p>
        </Reveal>
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------ *
 * One step of the wizard
 * ------------------------------------------------------------------ */

function StepPanel({
  step,
  stepIndex,
  selection,
  baseId,
  onChoose,
}: {
  step: Step;
  stepIndex: number;
  selection: CapacitySelection;
  baseId: string;
  onChoose: (field: StepField, value: string) => void;
}) {
  const options = optionsForStep(step, selection);
  const headingId = `${baseId}-${step.id}-question`;

  return (
    <div>
      <p className="label text-aqua/85">
        <span className="tabular-nums">
          Step {String(stepIndex + 1).padStart(2, '0')} / {String(TOTAL).padStart(2, '0')}
        </span>
        {' — '}
        {step.label}
      </p>
      <h3 id={headingId} className="display-md mt-3 text-ice">
        {step.question}
      </h3>
      <p className="mt-3 max-w-[58ch] text-[0.95rem] leading-[1.6] text-steel">{step.helper}</p>

      {step.id === 'plant' && selection.plant ? (
        <p className="label mt-4 text-steel/70">
          Published range for {selection.plant}: {publishedRangeForPlant(selection.plant)}
        </p>
      ) : null}

      <div
        role="group"
        aria-labelledby={headingId}
        className={cn(
          'mt-6 grid gap-3',
          step.id === 'application' ? 'sm:grid-cols-2 xl:grid-cols-3' : 'sm:grid-cols-2',
        )}
      >
        {options.map((option) => {
          const selected = selection[step.field] === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChoose(step.field, option.value)}
              aria-pressed={selected}
              className={cn(
                'group flex items-start gap-3 rounded-[14px] border p-4 text-left transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]',
                selected
                  ? 'border-aqua/70 bg-aqua/[0.1] text-ice'
                  : 'border-hairline-dark bg-midnight/35 text-steel hover:border-aqua/40 hover:bg-midnight/60 hover:text-ice',
              )}
            >
              <span
                aria-hidden="true"
                className={cn(
                  'mt-0.5 grid h-4.5 w-4.5 shrink-0 place-items-center rounded-[5px] border transition-colors duration-300',
                  selected ? 'border-aqua bg-aqua text-navy' : 'border-steel/40 group-hover:border-aqua/60',
                )}
              >
                {selected ? (
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                      d="M4 12.5l5 5L20 6.5"
                      stroke="currentColor"
                      strokeWidth="2.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : null}
              </span>
              <span className="flex min-w-0 flex-col gap-1">
                <span className="font-display text-[0.98rem] font-medium leading-[1.3]">
                  {option.value}
                </span>
                {option.caption ? (
                  <span className="font-mono text-[0.72rem] leading-[1.4] text-steel/75">
                    {option.caption}
                  </span>
                ) : null}
              </span>
            </button>
          );
        })}
      </div>

      {/* Location keeps a free-text city, because "Uttarakhand" alone cannot size a train. */}
      {step.field === 'region' ? (
        <div className="mt-6 max-w-md">
          <label htmlFor={`${baseId}-city`} className="label text-steel">
            City or district <span className="text-steel/60">(optional)</span>
          </label>
          <input
            id={`${baseId}-city`}
            name="city"
            type="text"
            autoComplete="address-level2"
            maxLength={120}
            value={selection.city}
            onChange={(event) => onChoose('city', event.target.value)}
            placeholder="Rudrapur"
            className={cn(
              'mt-2 w-full rounded-[14px] border border-hairline-dark bg-midnight/40 px-4 py-3.5',
              'text-[0.98rem] text-ice placeholder:text-steel/45 transition-colors duration-200',
              'hover:border-steel/40 focus:border-electric',
            )}
          />
          <p className="mt-2 text-[0.82rem] leading-[1.5] text-steel/75">
            Used only to write the City / State line of the enquiry form.
          </p>
        </div>
      ) : null}
    </div>
  );
}

function optionsForStep(
  step: Step,
  selection: CapacitySelection,
): { value: string; caption?: string }[] {
  switch (step.field) {
    case 'plant':
      return solutionOptions.map((name) => ({
        value: name,
        caption: publishedRangeForPlant(name),
      }));
    case 'capacity':
      return capacityOptionsForPlant(selection.plant).map((band) => ({ value: band }));
    case 'application':
      return industryOptions.map((name) => ({ value: name }));
    case 'region':
      return REGION_OPTIONS.map((name) => ({ value: name }));
    default:
      return [];
  }
}

function countChosen(selection: CapacitySelection): number {
  return steps.filter((step) => selection[step.field].trim().length > 0).length;
}

/* ------------------------------------------------------------------ *
 * Summary + hand-off
 * ------------------------------------------------------------------ */

function SummaryPanel({
  selection,
  summaryRef,
  note,
  onSend,
  onReset,
}: {
  selection: CapacitySelection;
  summaryRef: React.RefObject<HTMLDivElement | null>;
  note: string;
  onSend: () => void;
  onReset: () => void;
}) {
  const lines = capacitySummaryLines(selection);
  const prefill = prefillFromCapacity(selection);

  return (
    <div ref={summaryRef} tabIndex={-1} className="outline-none [&:focus-visible]:outline [&:focus-visible]:outline-2 [&:focus-visible]:outline-offset-8 [&:focus-visible]:outline-aqua">
      <p className="label text-aqua/85">Summary of your selection</p>
      <h3 className="display-md mt-3 text-ice">
        {lines.length === TOTAL ? 'Everything is captured.' : 'Almost there.'}
      </h3>

      {lines.length > 0 ? (
        <dl className="mt-6 grid gap-x-8 gap-y-5 sm:grid-cols-2">
          {lines.map((item) => (
            <div key={item.label} className="flex flex-col gap-1.5 border-l border-aqua/30 pl-4">
              <dt className="label text-steel/70">{item.label}</dt>
              <dd className="font-display text-[1.05rem] leading-[1.35] text-ice">{item.value}</dd>
            </div>
          ))}
        </dl>
      ) : (
        <p className="mt-6 text-[0.95rem] text-steel">
          Nothing selected yet — step back and choose an option in each step.
        </p>
      )}

      {lines.length < TOTAL ? (
        <p className="mt-6 rounded-[12px] border border-hairline-dark bg-midnight/40 px-4 py-3 text-[0.88rem] leading-[1.55] text-steel">
          {TOTAL - lines.length} step{TOTAL - lines.length > 1 ? 's' : ''} still empty. Use the
          progress rail above or the Back button to finish them.
        </p>
      ) : null}

      <div className="mt-7 rounded-panel border border-hairline-dark bg-midnight/35 p-5">
        <p className="label text-steel/70">Message this writes into the enquiry form</p>
        <p className="mt-3 whitespace-pre-line text-[0.9rem] leading-[1.65] text-ice/85">
          {prefill.message}
        </p>
      </div>

      <div className="mt-7 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={onSend}
          className={cn(
            'inline-flex items-center gap-2.5 rounded-pill bg-aqua px-6 py-3.5 font-display text-[0.95rem] font-medium text-navy',
            'transition-colors duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-[#4ae3e0]',
          )}
        >
          <Send className="h-4 w-4" aria-hidden="true" />
          Send this as an enquiry
        </button>
        <Cta
          href={whatsappHref(capacityWhatsappMessage(selection))}
          tone="outlineDark"
          magnetic={false}
          icon={<MessageCircle className="h-4 w-4" aria-hidden="true" />}
        >
          Chat on WhatsApp
        </Cta>
        <button
          type="button"
          onClick={onReset}
          className="label inline-flex items-center gap-2 rounded-pill border border-hairline-dark px-4 py-2.5 text-steel transition-colors duration-300 hover:border-aqua/50 hover:text-ice"
        >
          <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
          start again
        </button>
      </div>

      {/* role="status" so the hand-off is announced, and visible so nobody doubts it happened. */}
      {note ? (
        <p
          role="status"
          className="mt-5 max-w-[62ch] rounded-[12px] border border-aqua/35 bg-aqua/[0.08] px-4 py-3 text-[0.9rem] leading-[1.55] text-ice/90"
        >
          {note}
        </p>
      ) : null}

      <p className="mt-5 max-w-[62ch] text-[0.82rem] leading-[1.55] text-steel/75">
        Nothing has been sent yet. The enquiry goes when you submit the form, or open WhatsApp with
        the button above.
      </p>
    </div>
  );
}
