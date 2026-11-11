/**
 * Shared enquiry contract — one source of truth for the contact form (browser) and
 * POST /api/enquiry (server).
 *
 * Both sides import the same field definitions, option lists and validation rules, so a
 * rule can never drift between what the browser asks for and what the server accepts.
 * The server is still authoritative: it re-runs every check in this file against its own
 * freshly coerced copy of the payload. Nothing here imports React, Next or Node APIs, so
 * the module is safe in both runtimes.
 *
 * Every capacity band below traces back to `src/data/products.ts`. Bands that the company
 * has not published are deliberately absent — see `capacityBands`.
 */

import { industries } from '@/data/industries';
import { products } from '@/data/products';

/* ------------------------------------------------------------------ *
 * Option lists (selects and the capacity assistant share these)
 * ------------------------------------------------------------------ */

export const industryOptions: readonly string[] = [
  ...industries.map((industry) => industry.name),
  'Other',
];

export const solutionOptions: readonly string[] = products.map((product) => product.name);

/**
 * Capacity bands. Strictly derived from `products.ts`:
 *  - `industrialRo` splits the published industrial RO range (100 LPH – 50,000 LPH).
 *  - `chillers` splits the published chiller range (5 TR – 100 TR).
 *  - `publishedSizing` quotes verbatim the sizing statements products give when they
 *    publish no numeric range ("Sized to effluent load", and friends).
 * Adding a band the company has not published would be an engineering claim, so don't.
 */
export const capacityBands = {
  industrialRo: [
    '100 – 1,000 LPH',
    '1,000 – 5,000 LPH',
    '5,000 – 20,000 LPH',
    '20,000 – 50,000 LPH',
    'Above 50,000 LPH / to discuss',
  ],
  chillers: ['5 – 10 TR', '10 – 25 TR', '25 – 50 TR', '50 – 100 TR', 'Above 100 TR / to discuss'],
} as const;

/** Sizing statements copied straight out of each product's published `capacityLabel`. */
export const publishedSizingOptions: readonly string[] = products
  .map((product) => product.capacityLabel)
  .filter((label): label is string => typeof label === 'string' && !/\d/.test(label));

export const capacityAdvisoryOptions: readonly string[] = [
  'Not sure — please advise',
  'Not applicable',
];

/** Grouped for the `<optgroup>` in the form, flattened for server-side whitelist checks. */
export const capacityGroups: readonly { label: string; options: readonly string[] }[] = [
  { label: 'Reverse osmosis & treatment (LPH)', options: capacityBands.industrialRo },
  { label: 'Cooling capacity (TR)', options: capacityBands.chillers },
  { label: 'Sized from site data', options: publishedSizingOptions },
  { label: 'Not decided yet', options: capacityAdvisoryOptions },
];

export const capacityOptions: readonly string[] = capacityGroups.flatMap((group) => [
  ...group.options,
]);

/**
 * Capacity choices that make sense for one plant type. Anything numeric stays inside the
 * published range for that product; everything else falls back to its own sizing statement.
 */
export function capacityOptionsForPlant(plantName: string): readonly string[] {
  const product = products.find((item) => item.name === plantName);
  if (!product) return capacityOptions;

  if (product.slug === 'industrial-ro-plants') {
    return [...capacityBands.industrialRo, ...capacityAdvisoryOptions];
  }
  if (product.slug === 'industrial-water-chillers') {
    return [...capacityBands.chillers, ...capacityAdvisoryOptions];
  }

  const statement = product.capacityLabel ? [product.capacityLabel] : [];
  return [...statement, ...capacityAdvisoryOptions];
}

/** The published range caption for a plant type, quoted from products.ts (no interpretation). */
export function publishedRangeForPlant(plantName: string): string | undefined {
  return products.find((item) => item.name === plantName)?.capacityLabel;
}

/* ------------------------------------------------------------------ *
 * Field definitions
 * ------------------------------------------------------------------ */

export type EnquiryFieldName =
  | 'fullName'
  | 'company'
  | 'phone'
  | 'email'
  | 'cityState'
  | 'industry'
  | 'solution'
  | 'capacity'
  | 'message';

export type EnquiryValues = Record<EnquiryFieldName, string>;

export type EnquiryFieldErrors = Partial<Record<EnquiryFieldName, string>>;

export type EnquiryField = {
  name: EnquiryFieldName;
  label: string;
  control: 'text' | 'email' | 'tel' | 'select' | 'textarea';
  autoComplete: string;
  required: boolean;
  maxLength: number;
  hint?: string;
  placeholder?: string;
  rows?: number;
  /** Full-width in the two-column grid; everything else sits in one column. */
  span?: boolean;
  /** Allowed values for a select. Empty means "choose one of the listed options". */
  options?: readonly string[];
  optionGroups?: readonly { label: string; options: readonly string[] }[];
  /** Selects validate against this list; `undefined` means free text. */
  allowed?: readonly string[];
};

/**
 * `autoComplete="address-level2"` on City / State only ever autofills the city, because
 * browsers have no token for a combined "city, state" field. That is intentional — the
 * label and hint ask for both, and the server only requires that it is filled in.
 */
export const enquiryFields: readonly EnquiryField[] = [
  {
    name: 'fullName',
    label: 'Full Name',
    control: 'text',
    autoComplete: 'name',
    required: true,
    maxLength: 120,
    placeholder: 'Your name',
  },
  {
    name: 'company',
    label: 'Company Name',
    control: 'text',
    autoComplete: 'organization',
    required: false,
    maxLength: 160,
    placeholder: 'Site or organisation',
    hint: 'Optional — useful if you are enquiring for a site.',
  },
  {
    name: 'phone',
    label: 'Phone Number',
    control: 'tel',
    autoComplete: 'tel',
    required: true,
    maxLength: 32,
    placeholder: '+91 93364 32885',
    hint: 'Mobile, or landline with its area code.',
  },
  {
    name: 'email',
    label: 'Email Address',
    control: 'email',
    autoComplete: 'email',
    required: true,
    maxLength: 254,
    placeholder: 'you@company.in',
  },
  {
    name: 'cityState',
    label: 'City / State',
    control: 'text',
    autoComplete: 'address-level2',
    required: true,
    maxLength: 160,
    placeholder: 'Rudrapur, Uttarakhand',
    hint: 'Where the plant or system will be installed.',
  },
  {
    name: 'industry',
    label: 'Industry',
    control: 'select',
    autoComplete: 'off',
    required: true,
    maxLength: 120,
    options: industryOptions,
    allowed: industryOptions,
  },
  {
    name: 'solution',
    label: 'Required Solution',
    control: 'select',
    autoComplete: 'off',
    required: true,
    maxLength: 120,
    options: solutionOptions,
    allowed: solutionOptions,
  },
  {
    name: 'capacity',
    label: 'Required Plant Capacity',
    control: 'select',
    autoComplete: 'off',
    required: true,
    maxLength: 120,
    optionGroups: capacityGroups,
    allowed: capacityOptions,
    hint: 'Ranges shown are the ones A2Care publishes; anything else is worked out from your water.',
  },
  {
    name: 'message',
    label: 'Message / Project Requirements',
    control: 'textarea',
    autoComplete: 'off',
    required: true,
    maxLength: 4000,
    rows: 6,
    span: true,
    placeholder:
      'What the water is for, how much you need, where it comes from today — and any constraint that would make a system fail.',
  },
];

export const enquiryFieldNames: readonly EnquiryFieldName[] = enquiryFields.map(
  (field) => field.name,
);

export const emptyEnquiryValues: EnquiryValues = {
  fullName: '',
  company: '',
  phone: '',
  email: '',
  cityState: '',
  industry: '',
  solution: '',
  capacity: '',
  message: '',
};

/**
 * Honeypot. Named the way a scraper looks for, rendered visually hidden in the form and
 * rejected by the route if a value arrives in it. Kept here so client and server agree.
 */
export const HONEYPOT_FIELD = 'company_website' as const;
export type HoneypotName = typeof HONEYPOT_FIELD;
export type EnquiryRequest = EnquiryValues & Record<HoneypotName, string>;

export const MIN_MESSAGE_LENGTH = 10;

/* ------------------------------------------------------------------ *
 * Validation (used by the browser for instant feedback and by the
 * route as the authoritative check)
 * ------------------------------------------------------------------ */

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/;

/** Only digits, spacing, dashes, dots, parentheses and a single leading `+`. */
const PHONE_CHARSET_PATTERN = /^\+?[\d\s\-().]+$/;

/**
 * Indian phone check, deliberately forgiving.
 *
 * Mobile: 10 digits starting 6–9, with optional `+91` / `0` country/STD prefix and optional
 * spaces or dashes. Landline formats (area code + subscriber number, with or without the
 * trunk `0`) are accepted rather than rejected — the brief says not to turn STD-line numbers
 * away, and a water project enquiry from a plant reception number is legitimate. So after the
 * charset and digit-count gates, anything plausible passes; a human reads it on the way in.
 */
export function isAcceptablePhone(raw: string): boolean {
  const value = raw.trim();
  if (!value) return false;
  if (!PHONE_CHARSET_PATTERN.test(value)) return false;

  const digits = value.replace(/\D/g, '');
  if (digits.length < 8 || digits.length > 13) return false;

  const mobile = /^(?:0?91)?[6-9]\d{9}$/.test(digits);
  if (mobile) return true;

  // Not a 10-digit mobile: treat as a landline/other validly shaped number.
  return digits.length >= 8;
}

export function fieldDefinition(name: EnquiryFieldName): EnquiryField {
  const field = enquiryFields.find((item) => item.name === name);
  // The type makes this unreachable; the throw keeps strict mode honest.
  if (!field) throw new Error(`Unknown enquiry field: ${name}`);
  return field;
}

/** Validate one field against the whole value set, so cross-field rules stay possible. */
export function validateField(
  name: EnquiryFieldName,
  values: EnquiryValues,
): string | undefined {
  const field = fieldDefinition(name);
  const raw = values[name] ?? '';
  const value = raw.trim();

  if (!value) {
    if (!field.required) return undefined;
    return name === 'message'
      ? 'Tell us what the water is for.'
      : `${field.label} is required.`;
  }

  if (value.length > field.maxLength) {
    return `Keep this to ${field.maxLength} characters or fewer.`;
  }

  if (field.control === 'email' && !EMAIL_PATTERN.test(value)) {
    return 'Enter an email address that looks complete, like name@company.in.';
  }

  if (field.control === 'tel' && !isAcceptablePhone(value)) {
    return 'Enter a reachable number — 10-digit mobile (with or without +91), or a landline with its area code.';
  }

  if (field.allowed && !field.allowed.includes(value)) {
    return `Choose one of the listed options for ${field.label.toLowerCase()}.`;
  }

  if (name === 'message' && value.length < MIN_MESSAGE_LENGTH) {
    return 'Add a sentence about the duty so the enquiry is actionable.';
  }

  return undefined;
}

export function validateEnquiry(values: EnquiryValues): EnquiryFieldErrors {
  const errors: EnquiryFieldErrors = {};
  for (const name of enquiryFieldNames) {
    const error = validateField(name, values);
    if (error) errors[name] = error;
  }
  return errors;
}

export const hasErrors = (errors: EnquiryFieldErrors): boolean =>
  Object.values(errors).some(Boolean);

/* ------------------------------------------------------------------ *
 * Coercion & sanitisation (server side)
 * ------------------------------------------------------------------ */

/**
 * Control characters, newline excepted. A CR or an ESC sequence reaching a JSONL file (or a
 * CRM payload, or a terminal someone tails with `less`) is how log injection and broken
 * records start, so everything in 0x00–0x1F plus 0x7F is stripped except `\n`. Line endings
 * fold to `\n` *before* the strip, so CRLF survives as a single newline, and blank-line runs
 * collapse so the stored message still reads the way the visitor typed it.
 */
const CONTROL_CHARS = /[\u0000-\u0009\u000B-\u001F\u007F]/g;

export function stripControlChars(value: string): string {
  return value
    .replace(/\r\n?/g, '\n')
    .replace(CONTROL_CHARS, '')
    .replace(/ {3,}/g, '  ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function readString(input: Record<string, unknown>, key: string): string {
  const value = input[key];
  if (typeof value === 'string') return value;
  // A phone number pasted into a JSON number is still a phone number to a real visitor.
  if (typeof value === 'number' && Number.isFinite(value)) return String(value);
  return '';
}

export type CoercedEnquiry = { values: EnquiryValues; honeypot: string };

/**
 * Turn untrusted JSON into the typed shape, trimming, stripping control characters and
 * clamping every field to its published maximum length. Never throws.
 */
export function coerceEnquiry(input: unknown): CoercedEnquiry {
  const source: Record<string, unknown> =
    input && typeof input === 'object' && !Array.isArray(input)
      ? (input as Record<string, unknown>)
      : {};

  const values = {} as EnquiryValues;
  for (const field of enquiryFields) {
    const cleaned = stripControlChars(readString(source, field.name));
    values[field.name] = cleaned.slice(0, field.maxLength);
  }

  return {
    values,
    honeypot: stripControlChars(readString(source, HONEYPOT_FIELD)).slice(0, 200),
  };
}

/* ------------------------------------------------------------------ *
 * Response contract
 * ------------------------------------------------------------------ */

export type EnquirySuccess = { ok: true; reference: string };
export type EnquiryFailure = { ok: false; error: string; fields?: EnquiryFieldErrors };
export type EnquiryResponse = EnquirySuccess | EnquiryFailure;

const GENERIC_FAILURE = 'The server did not accept the enquiry. Please try again or use phone.';

/** Narrow an unknown JSON body into the response contract without ever using `any`. */
export function parseEnquiryResponse(raw: unknown): EnquiryResponse {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return { ok: false, error: GENERIC_FAILURE };
  }
  const body = raw as Record<string, unknown>;

  if (body.ok === true && typeof body.reference === 'string') {
    return { ok: true, reference: body.reference.slice(0, 64) };
  }

  const error = typeof body.error === 'string' ? stripControlChars(body.error) : '';
  const fields: EnquiryFieldErrors = {};
  if (body.fields && typeof body.fields === 'object' && !Array.isArray(body.fields)) {
    for (const [key, value] of Object.entries(body.fields as Record<string, unknown>)) {
      if (enquiryFieldNames.includes(key as EnquiryFieldName) && typeof value === 'string') {
        fields[key as EnquiryFieldName] = stripControlChars(value);
      }
    }
  }

  return { ok: false, error: error || GENERIC_FAILURE, fields };
}

/** Short reference for display: the UUID is long, the tail is enough to quote on a call. */
export const shortReference = (reference: string): string =>
  reference.replace(/-/g, '').slice(-8).toUpperCase();

/* ------------------------------------------------------------------ *
 * Text builders (WhatsApp / message preview)
 * ------------------------------------------------------------------ */

/** WhatsApp text URLs carry badly beyond ~1000 characters, so the message is clipped. */
function clip(value: string, max = 600): string {
  const single = value.replace(/\n+/g, ' ');
  return single.length > max ? `${single.slice(0, max - 1)}…` : single;
}

const line = (label: string, value: string): string => `${label}: ${value}`;

/** Read-back of what the visitor actually sent, reused by the success panel and WhatsApp. */
export function enquiryLines(values: EnquiryValues): { label: string; value: string }[] {
  return enquiryFields
    .map((field) => ({ label: field.label, value: values[field.name].trim() }))
    .filter((item) => item.value.length > 0);
}

export function enquiryWhatsappMessage(values: EnquiryValues, reference?: string): string {
  const parts = [
    `Hello A2Care India, this is my project enquiry from your website${
      reference ? ` (reference ${shortReference(reference)})` : ''
    }.`,
    // 700 characters per field keeps the whole wa.me URL inside what WhatsApp will open.
    ...enquiryLines(values).map((item) => clip(line(item.label, item.value), 700)),
  ];
  return parts.join('\n');
}

/* ------------------------------------------------------------------ *
 * Capacity assistant → enquiry form bridge
 * ------------------------------------------------------------------ *
 * CapacityTool and EnquiryForm are separate client components with no shared parent, so
 * the hand-off lives here: a module-level slot plus a window custom event. The store is
 * browser-only (it is inert during SSR) and holds nothing but what the visitor selected.
 */

export const REGION_OPTIONS: readonly string[] = [
  'Uttarakhand',
  'Uttar Pradesh / NCR',
  'Other state in India',
  'Outside India — to discuss',
];

export type CapacitySelection = {
  plant: string;
  capacity: string;
  application: string;
  region: string;
  city: string;
};

export const emptyCapacitySelection: CapacitySelection = {
  plant: '',
  capacity: '',
  application: '',
  region: '',
  city: '',
};

export const CAPACITY_EVENT = 'a2care:capacity-enquiry' as const;

let pendingCapacity: CapacitySelection | null = null;

export function publishCapacitySelection(selection: CapacitySelection): void {
  pendingCapacity = selection;
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent<CapacitySelection>(CAPACITY_EVENT, { detail: selection }));
}

export function readCapacitySelection(): CapacitySelection | null {
  return pendingCapacity;
}

export function clearCapacitySelection(): void {
  pendingCapacity = null;
}

/**
 * Subscribe to capacity hand-offs. Fires immediately when a selection is already queued
 * (form mounted after the tool ran, or a hot reload), then on every later event.
 */
export function subscribeToCapacitySelection(
  handler: (selection: CapacitySelection) => void,
): () => void {
  const queued = pendingCapacity;
  if (queued) handler(queued);

  if (typeof window === 'undefined') return () => undefined;

  const listener = (event: Event) => {
    const detail = (event as CustomEvent<CapacitySelection>).detail;
    if (detail && typeof detail.plant === 'string') handler(detail);
  };

  window.addEventListener(CAPACITY_EVENT, listener);
  return () => window.removeEventListener(CAPACITY_EVENT, listener);
}

export function capacitySummaryLines(selection: CapacitySelection) {
  return [
    { label: 'Plant type', value: selection.plant },
    { label: 'Capacity', value: selection.capacity },
    { label: 'Application', value: selection.application },
    {
      label: 'Site location',
      value: [selection.city.trim(), selection.region].filter(Boolean).join(', '),
    },
  ].filter((item) => item.value.length > 0);
}

/** The enquiry text the assistant writes for the visitor — they can still edit it. */
export function capacityMessage(selection: CapacitySelection): string {
  return [
    'Requirement put together with the capacity assistant on your website:',
    ...capacitySummaryLines(selection).map((item) => line(item.label, item.value)),
    '',
    'Please treat the details above as my starting point and let me know what you need from me — including feed water analysis.',
  ].join('\n');
}

export function capacityWhatsappMessage(selection: CapacitySelection): string {
  return [
    'Hello A2Care India, I used the capacity assistant on your website. Here is what I selected:',
    ...capacitySummaryLines(selection).map((item) => clip(line(item.label, item.value), 300)),
  ].join('\n');
}

/**
 * Map the assistant's answers onto enquiry form fields. Only values that exist in the
 * form's own whitelists are written, so a prefill can never produce an invalid selection.
 */
export function prefillFromCapacity(selection: CapacitySelection): Partial<EnquiryValues> {
  const prefill: Partial<EnquiryValues> = { message: capacityMessage(selection) };

  if (solutionOptions.includes(selection.plant)) prefill.solution = selection.plant;
  if (capacityOptions.includes(selection.capacity)) prefill.capacity = selection.capacity;
  if (industryOptions.includes(selection.application)) prefill.industry = selection.application;

  const city = selection.city.trim();
  const location = city && city.toLowerCase() !== selection.region.toLowerCase()
    ? `${city}, ${selection.region}`
    : selection.region;
  if (location) prefill.cityState = location;

  return prefill;
}
