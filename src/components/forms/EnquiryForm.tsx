'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  ChevronDown,
  CircleAlert,
  CircleCheck,
  Info,
  LoaderCircle,
  Mail,
  MessageCircle,
  Phone,
  RotateCcw,
  Send,
} from 'lucide-react';
import { cn } from '@/lib/cn';
import { Cta } from '@/components/ui/Cta';
import { mailHref, site, telHref, whatsappHref } from '@/lib/site';
import {
  HONEYPOT_FIELD,
  clearCapacitySelection,
  emptyEnquiryValues,
  enquiryFieldNames,
  enquiryFields,
  enquiryLines,
  enquiryWhatsappMessage,
  hasErrors,
  parseEnquiryResponse,
  prefillFromCapacity,
  shortReference,
  subscribeToCapacitySelection,
  validateEnquiry,
  validateField,
  type EnquiryField,
  type EnquiryFieldErrors,
  type EnquiryFieldName,
  type EnquiryValues,
  type HoneypotName,
} from '@/lib/enquiry';

type Status = 'idle' | 'submitting' | 'success' | 'error';
type FieldElement = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * No danger colour exists in the @theme token set, so the error tone is a local arbitrary
 * value picked to hold AA contrast on this light card. If globals.css ever gains
 * `--color-danger`, every use below should switch to it.
 */
const errorTone = {
  text: 'text-[#8f2d18]',
  border: 'border-[#8f2d18]/55',
  soft: 'bg-[#8f2d18]/[0.05]',
} as const;

const fieldBase =
  'w-full rounded-[14px] border bg-white/70 px-4 py-3.5 text-[0.98rem] leading-[1.5] text-navy ' +
  'transition-colors duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] placeholder:text-navy/35 ' +
  'hover:border-navy/35 focus:border-electric disabled:opacity-60';

export function EnquiryForm({ className }: { className?: string }) {
  const reduced = useReducedMotion();
  const baseId = useId();

  const [values, setValues] = useState<EnquiryValues>(emptyEnquiryValues);
  const [errors, setErrors] = useState<EnquiryFieldErrors>({});
  const [touched, setTouched] = useState<Partial<Record<EnquiryFieldName, boolean>>>({});
  const [honeypot, setHoneypot] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [serverError, setServerError] = useState('');
  const [reference, setReference] = useState('');
  const [sentValues, setSentValues] = useState<EnquiryValues | null>(null);
  const [showSummary, setShowSummary] = useState(false);
  const [prefillNote, setPrefillNote] = useState('');

  const fieldRefs = useRef<Partial<Record<EnquiryFieldName, FieldElement | null>>>({});
  const headingRef = useRef<HTMLHeadingElement | null>(null);

  // Mirrors state so event handlers and timers can read the latest values without
  // re-binding listeners or nesting a setState inside another updater.
  const valuesRef = useRef(values);
  valuesRef.current = values;
  const touchedRef = useRef(touched);
  touchedRef.current = touched;

  const busy = status === 'submitting';

  /* ------------------------------------------------------------------ *
   * Capacity assistant hand-off (CapacityTool → this form)
   * ------------------------------------------------------------------ */
  useEffect(() => {
    const unsubscribe = subscribeToCapacitySelection((selection) => {
      const prefill = prefillFromCapacity(selection);

      setValues((previous) => {
        const next: EnquiryValues = { ...previous };
        for (const key of ['industry', 'solution', 'capacity', 'cityState'] as const) {
          const incoming = prefill[key];
          if (!incoming) continue;
          // A choice the visitor already made by hand outranks the assistant's answer.
          if (!next[key] || !touchedRef.current[key]) next[key] = incoming;
        }
        if (prefill.message) {
          next.message = previous.message.trim()
            ? `${previous.message.trim()}\n\n${prefill.message}`
            : prefill.message;
        }
        return next;
      });

      setErrors((previous) => {
        const next: EnquiryFieldErrors = { ...previous };
        for (const key of Object.keys(prefill) as EnquiryFieldName[]) delete next[key];
        return next;
      });

      setStatus((current) => (current === 'success' ? current : 'idle'));
      setServerError('');
      setPrefillNote(
        'Your answers from the capacity assistant are in the form below. Add your name, phone and email, then submit.',
      );
      clearCapacitySelection();

      // Hand focus to the first still-empty required field, after the scroll has settled,
      // without yanking the viewport (Lenis is mid-animation).
      window.setTimeout(() => {
        const current = valuesRef.current;
        const target = enquiryFields.find(
          (field) => field.required && !current[field.name].trim(),
        );
        if (target) fieldRefs.current[target.name]?.focus({ preventScroll: true });
      }, 900);
    });

    return unsubscribe;
  }, []);

  /* ------------------------------------------------------------------ *
   * Field events
   * ------------------------------------------------------------------ */

  const setValue = (name: EnquiryFieldName, value: string) => {
    setValues((previous) => ({ ...previous, [name]: value }));
  };

  /** Re-validate on blur, once the field has been touched (which blur itself establishes). */
  const blurField = (field: EnquiryField) => {
    setTouched((previous) => ({ ...previous, [field.name]: true }));
    const message = validateField(field.name, valuesRef.current);
    setErrors((previous) => {
      if (message === previous[field.name]) return previous;
      const next: EnquiryFieldErrors = { ...previous };
      if (message) next[field.name] = message;
      else delete next[field.name];
      return next;
    });
  };

  const focusField = (name: EnquiryFieldName) => {
    fieldRefs.current[name]?.focus({ preventScroll: false });
  };

  /* ------------------------------------------------------------------ *
   * Submit
   * ------------------------------------------------------------------ */

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;

    // Client-side pass first: instant, and it keeps a doomed request off the network.
    const found = validateEnquiry(valuesRef.current);
    setErrors(found);
    setTouched(Object.fromEntries(enquiryFieldNames.map((name) => [name, true])));

    if (hasErrors(found)) {
      setShowSummary(true);
      setServerError('');
      const first = enquiryFieldNames.find((name) => found[name]);
      if (first) focusField(first);
      return;
    }

    setShowSummary(false);
    setStatus('submitting');
    setServerError('');

    const snapshot = valuesRef.current;
    const payload: EnquiryValues & Record<HoneypotName, string> = {
      ...snapshot,
      [HONEYPOT_FIELD]: honeypot,
    };

    try {
      const response = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = parseEnquiryResponse(await response.json().catch(() => null));

      if (result.ok) {
        if (response.ok) {
          // Only a 2xx that reported ok:true reaches the confirmation screen.
          setSentValues(snapshot);
          setReference(result.reference);
          setStatus('success');
          window.setTimeout(() => headingRef.current?.focus({ preventScroll: true }), 80);
          return;
        }
        setStatus('error');
        setServerError(
          `The server answered ${response.status} without confirming the enquiry, so it has not been recorded. Please send it by phone or WhatsApp.`,
        );
        return;
      }

      setStatus('error');
      setServerError(result.error);
      if (result.fields && hasErrors(result.fields)) {
        // The server is authoritative — its field errors replace the local ones.
        setErrors((previous) => ({ ...previous, ...result.fields }));
        setShowSummary(true);
        const first = enquiryFieldNames.find((name) => result.fields?.[name]);
        if (first) fieldRefs.current[first]?.focus({ preventScroll: true });
      }
    } catch {
      // Network failure. Say what happened. A fake success is the worst possible outcome here.
      setStatus('error');
      setServerError(
        'The request never reached the server — check the connection and submit again, or send the enquiry by phone or WhatsApp.',
      );
    }
  }

  function resetForm() {
    setValues(emptyEnquiryValues);
    setErrors({});
    setTouched({});
    setHoneypot('');
    setSentValues(null);
    setReference('');
    setStatus('idle');
    setServerError('');
    setShowSummary(false);
    setPrefillNote('');
  }

  /* ------------------------------------------------------------------ *
   * Success replaces the form entirely, with a read-back of what was sent
   * ------------------------------------------------------------------ */
  if (status === 'success' && sentValues) {
    return (
      <SuccessPanel
        className={className}
        values={sentValues}
        reference={reference}
        headingRef={headingRef}
        reduced={Boolean(reduced)}
        onReset={resetForm}
      />
    );
  }

  const invalidList = enquiryFieldNames.filter((name) => errors[name]);

  /* ------------------------------------------------------------------ *
   * Control renderer — one switch so narrowing stays total
   * ------------------------------------------------------------------ */
  function renderControl(field: EnquiryField) {
    const common = {
      id: `${baseId}-${field.name}`,
      name: field.name,
      disabled: busy,
      autoComplete: field.autoComplete,
      'aria-required': field.required ? true : undefined,
      'aria-invalid': errors[field.name] ? true : undefined,
      'aria-describedby':
        [errors[field.name] ? `${baseId}-${field.name}-error` : null, field.hint ? `${baseId}-${field.name}-hint` : null]
          .filter(Boolean)
          .join(' ') || undefined,
      ref: (node: FieldElement | null) => {
        fieldRefs.current[field.name] = node;
      },
      onBlur: () => blurField(field),
    } as const;

    const tone = errors[field.name] ? errorTone.border : 'border-navy/15';

    if (field.control === 'select') {
      return (
        <div className="relative">
          <select
            {...common}
            value={values[field.name]}
            onChange={(event) => setValue(field.name, event.target.value)}
            className={cn(
              fieldBase,
              tone,
              'appearance-none pr-11',
              !values[field.name] && 'text-navy/45',
            )}
          >
            <option value="">Select {field.label.toLowerCase()}</option>
            {field.optionGroups
              ? field.optionGroups.map((group) => (
                  <optgroup key={group.label} label={group.label}>
                    {group.options.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </optgroup>
                ))
              : (field.options ?? []).map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
          </select>
          <ChevronDown
            className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-navy/45"
            aria-hidden="true"
          />
        </div>
      );
    }

    if (field.control === 'textarea') {
      return (
        <>
          <textarea
            {...common}
            rows={field.rows ?? 5}
            maxLength={field.maxLength}
            placeholder={field.placeholder}
            value={values[field.name]}
            onChange={(event) => setValue(field.name, event.target.value)}
            className={cn(fieldBase, tone, 'min-h-[9.5rem] resize-y leading-[1.6]')}
          />
          <p className="label text-right tabular-nums text-navy/40">
            {values[field.name].length} / {field.maxLength}
          </p>
        </>
      );
    }

    return (
      <input
        {...common}
        type={field.control}
        inputMode={field.control === 'tel' ? 'tel' : field.control === 'email' ? 'email' : undefined}
        maxLength={field.maxLength}
        placeholder={field.placeholder}
        value={values[field.name]}
        onChange={(event) => setValue(field.name, event.target.value)}
        className={cn(fieldBase, tone)}
      />
    );
  }

  return (
    <form
      noValidate
      onSubmit={handleSubmit}
      aria-busy={busy}
      className={cn('glass-light rounded-panel border-navy/10 p-6 sm:p-8', className)}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-hairline-light pb-5">
        <p className="display-sm text-navy">Project enquiry</p>
        <p className="label text-navy/45">Fields marked * are required</p>
      </div>

      {/*
        Honeypot. In the DOM so a scraper finds and fills it, invisible to people, out of
        the tab order and hidden from assistive tech. The route rejects any submission that
        carries a value here, and never explains why to the sender.
      */}
      <div className="sr-only" aria-hidden="true">
        <label htmlFor={`${baseId}-honeypot`}>Company website (leave this field empty)</label>
        <input
          id={`${baseId}-honeypot`}
          name={HONEYPOT_FIELD}
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(event) => setHoneypot(event.target.value)}
        />
      </div>

      {prefillNote ? (
        <p
          role="status"
          className="mt-5 flex items-start gap-2.5 rounded-[14px] border border-electric/30 bg-electric/[0.07] px-4 py-3 text-[0.88rem] leading-[1.5] text-navy/80"
        >
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-electric" aria-hidden="true" />
          {prefillNote}
        </p>
      ) : null}

      <div className="mt-6 grid gap-x-5 gap-y-6 sm:grid-cols-2">
        {enquiryFields.map((field) => (
          <div
            key={field.name}
            className={cn('flex flex-col gap-2', field.span && 'sm:col-span-2')}
          >
            <label htmlFor={`${baseId}-${field.name}`} className="label text-navy/70">
              {field.label}
              {field.required ? (
                <>
                  <span className={cn('ml-1', errorTone.text)} aria-hidden="true">
                    *
                  </span>
                  <span className="sr-only"> required</span>
                </>
              ) : null}
            </label>

            {renderControl(field)}

            {field.hint ? (
              <p
                id={`${baseId}-${field.name}-hint`}
                className="text-[0.8rem] leading-[1.45] text-navy/50"
              >
                {field.hint}
              </p>
            ) : null}

            <AnimatePresence initial={false}>
              {errors[field.name] ? (
                <motion.p
                  key={errors[field.name]}
                  id={`${baseId}-${field.name}-error`}
                  initial={reduced ? false : { opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={reduced ? { duration: 0 } : { duration: 0.24, ease: EASE }}
                  className={cn('flex items-start gap-2 text-[0.84rem] leading-[1.45]', errorTone.text)}
                >
                  <CircleAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  {errors[field.name]}
                </motion.p>
              ) : null}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Error summary: announced once, and every entry jumps to its field. */}
      <AnimatePresence initial={false}>
        {showSummary && invalidList.length > 0 ? (
          <motion.div
            key="summary"
            initial={reduced ? false : { opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={reduced ? { duration: 0 } : { duration: 0.35, ease: EASE }}
            className="overflow-hidden"
          >
            <div
              role="alert"
              className={cn('mt-6 rounded-[14px] border p-5', errorTone.border, errorTone.soft)}
            >
              <p className={cn('label', errorTone.text)}>
                {invalidList.length} field{invalidList.length > 1 ? 's' : ''} need attention
              </p>
              <ul className="mt-3 flex flex-col gap-1.5">
                {invalidList.map((name) => {
                  const field = enquiryFields.find((item) => item.name === name);
                  if (!field) return null;
                  return (
                    <li key={name}>
                      <button
                        type="button"
                        onClick={() => focusField(name)}
                        className="text-left text-[0.86rem] leading-[1.45] underline decoration-navy/25 underline-offset-2 transition-colors hover:decoration-navy"
                      >
                        <span className="font-medium">{field.label}:</span> {errors[name]}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Submission failure: the real reason, plus the channels that always work. */}
      <AnimatePresence initial={false}>
        {status === 'error' && serverError ? (
          <motion.div
            key="failure"
            initial={reduced ? false : { opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={reduced ? { duration: 0 } : { duration: 0.4, ease: EASE }}
            className="overflow-hidden"
          >
            <div
              role="alert"
              className={cn('mt-6 rounded-[14px] border p-5', errorTone.border, errorTone.soft)}
            >
              <p
                className={cn(
                  'flex items-center gap-2 font-display text-[1.05rem] font-medium',
                  errorTone.text,
                )}
              >
                <CircleAlert className="h-4 w-4 shrink-0" aria-hidden="true" />
                Your enquiry was not sent
              </p>
              <p className="mt-2 text-[0.9rem] leading-[1.6] text-navy/75">{serverError}</p>

              <p className="label mt-4 text-navy/45">Reach A2Care India directly</p>
              <div className="mt-3 flex flex-wrap gap-2.5">
                {site.phones.map((phone) => (
                  <Cta
                    key={phone}
                    href={telHref(phone)}
                    tone="outlineLight"
                    magnetic={false}
                    className="px-4 py-2.5 text-[0.85rem]"
                    icon={<Phone className="h-3.5 w-3.5" aria-hidden="true" />}
                  >
                    {phone}
                  </Cta>
                ))}
                <Cta
                  href={whatsappHref()}
                  tone="outlineLight"
                  magnetic={false}
                  className="px-4 py-2.5 text-[0.85rem]"
                  icon={<MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />}
                >
                  WhatsApp
                </Cta>
                <Cta
                  href={mailHref('Project enquiry — A2Care India')}
                  tone="outlineLight"
                  magnetic={false}
                  className="px-4 py-2.5 text-[0.85rem]"
                  icon={<Mail className="h-3.5 w-3.5" aria-hidden="true" />}
                >
                  Email
                </Cta>
              </div>

              <p className="mt-4 text-[0.82rem] leading-[1.5] text-navy/55">
                Everything you typed is still in the form. Correct what is flagged and submit
                again — or send it by phone or WhatsApp, which reaches the same team.
              </p>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
        {/*
          Deliberately not a <Cta>: the shared button primitive exposes no `disabled` or
          `aria-busy` surface, and a submit control has to report its own state. Same shape,
          tokens and easing as `Cta tone="electric"` so the two read as one family.
        */}
        <button
          type="submit"
          disabled={busy}
          aria-busy={busy}
          className={cn(
            'inline-flex items-center justify-center gap-2.5 rounded-pill bg-electric px-7 py-3.5',
            'font-display text-[0.95rem] font-medium tracking-[-0.01em] text-abyss',
            'transition-colors duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]',
            'hover:bg-[#3abef5] disabled:cursor-not-allowed disabled:opacity-55',
          )}
        >
          {busy ? (
            <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <Send className="h-4 w-4" aria-hidden="true" />
          )}
          {busy ? 'Sending enquiry…' : 'Submit project enquiry'}
        </button>

        <p aria-live="polite" className="text-[0.82rem] leading-[1.5] text-navy/55">
          {busy
            ? 'Posting your enquiry to the A2Care server.'
            : 'Sent directly to A2Care India — no third-party form service in between.'}
        </p>
      </div>
    </form>
  );
}

/* ------------------------------------------------------------------ *
 * Confirmation
 * ------------------------------------------------------------------ */

function SuccessPanel({
  values,
  reference,
  headingRef,
  reduced,
  onReset,
  className,
}: {
  values: EnquiryValues;
  reference: string;
  headingRef: React.RefObject<HTMLHeadingElement | null>;
  reduced: boolean;
  onReset: () => void;
  className?: string;
}) {
  const lines = enquiryLines(values);

  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={reduced ? { duration: 0 } : { duration: 0.6, ease: EASE }}
      className={cn('glass-light rounded-panel border-navy/10 p-6 sm:p-8', className)}
    >
      <div className="flex items-start gap-4">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-electric/[0.12] text-electric">
          <CircleCheck className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <h3
            ref={headingRef}
            tabIndex={-1}
            className="display-md text-navy outline-hidden [&:focus-visible]:outline [&:focus-visible]:outline-2 [&:focus-visible]:outline-offset-4 [&:focus-visible]:outline-aqua"
          >
            Enquiry received.
          </h3>
          <p className="mt-2 text-[0.95rem] leading-[1.6] text-navy/70">
            The server accepted and recorded this submission against the reference below.
          </p>
        </div>
      </div>

      <p className="label mt-6 inline-flex items-center gap-2 rounded-pill border border-navy/12 bg-white/60 px-3.5 py-2 text-navy/70">
        Reference
        <span className="font-mono tracking-[0.08em] text-electric">
          {shortReference(reference)}
        </span>
      </p>

      <div className="mt-7 border-t border-hairline-light pt-6">
        <p className="label text-navy/45">What you sent</p>
        <dl className="mt-4 grid gap-x-8 gap-y-4 sm:grid-cols-2">
          {lines.map((item) => (
            <div key={item.label} className="flex flex-col gap-1">
              <dt className="label text-navy/45">{item.label}</dt>
              <dd className="whitespace-pre-line break-words text-[0.95rem] leading-[1.6] text-navy/85">
                {item.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="mt-7 rounded-[14px] border border-navy/10 bg-white/55 p-5">
        <p className="label text-navy/45">What happens next</p>
        <p className="mt-2.5 text-[0.95rem] leading-[1.65] text-navy/75">
          A2Care India replies through the contact channels published on this page — phone, email
          or WhatsApp — during business hours, {site.hours.days} {site.hours.time}
          {' '}({site.hours.closed} closed). No response time is promised here, because the
          company has not published one. Quote the reference above if you call.
        </p>
      </div>

      <div className="mt-7 flex flex-wrap gap-3">
        <Cta
          href={whatsappHref(enquiryWhatsappMessage(values, reference))}
          tone="electric"
          icon={<MessageCircle className="h-4 w-4" aria-hidden="true" />}
        >
          Continue on WhatsApp
        </Cta>
        {site.phones.map((phone) => (
          <Cta
            key={phone}
            href={telHref(phone)}
            tone="outlineLight"
            magnetic={false}
            icon={<Phone className="h-3.5 w-3.5" aria-hidden="true" />}
          >
            {phone}
          </Cta>
        ))}
        <Cta
          href={mailHref(`Project enquiry — reference ${shortReference(reference)}`)}
          tone="outlineLight"
          magnetic={false}
          icon={<Mail className="h-3.5 w-3.5" aria-hidden="true" />}
        >
          Email
        </Cta>
      </div>

      <p className="mt-6 text-[0.82rem] leading-[1.5] text-navy/50">
        WhatsApp opens with your enquiry text already typed out, so nothing has to be retold.
      </p>

      <button
        type="button"
        onClick={onReset}
        className="label mt-6 inline-flex items-center gap-2 text-navy/55 transition-colors hover:text-electric"
      >
        <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
        Send another enquiry
      </button>
    </motion.div>
  );
}
