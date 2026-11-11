/**
 * Central media manifest.
 *
 * WHY THIS EXISTS: A2Care has not yet supplied final photography or footage, and the
 * brief forbids passing stock imagery off as their installations. So every visual slot
 * declares whether it holds a real company asset or a stand-in. `<MediaFrame>` renders a
 * designed technical placeholder for stand-ins — no fake photos reach production.
 *
 * TO SHIP REAL ASSETS: drop files in `public/media/<slot>/`, flip `real: true` on the
 * slot, and rebuild. Nothing else changes.
 */

export type MediaKind = 'image' | 'video';

export type MediaSlot = {
  /** Slot id doubles as the folder under /media */
  id: string;
  kind: MediaKind;
  /** Resolved path under public/, e.g. /media/hero/reel.mp4 */
  src: string;
  poster?: string;
  alt: string;
  /** true = genuine A2Care asset, safe to present as their work */
  real: boolean;
  /** What the placeholder should invite the company to supply */
  expected?: string;
  credit?: string;
};

const slot = (
  id: string,
  opts: {
    kind?: MediaKind;
    src?: string;
    poster?: string;
    alt: string;
    real?: boolean;
    expected?: string;
    credit?: string;
  },
): MediaSlot => ({
  id,
  kind: opts.kind ?? 'image',
  src: opts.src ?? `/media/${id}/primary`,
  poster: opts.poster,
  alt: opts.alt,
  real: opts.real ?? false,
  expected: opts.expected,
  credit: opts.credit,
});

export const media: Record<string, MediaSlot> = {
  /* ---------------------------------------------------------- Hero */
  'hero.reel': slot('hero.reel', {
    kind: 'video',
    src: '/media/hero.reel/hero.mp4',
    poster: '/media/hero.reel/poster.jpg',
    alt: 'Industrial water treatment systems in operation',
    real: false,
    expected: '30–60s looping footage of an A2Care plant, 1920x1080, muted MP4 + WebM.',
  }),

  /* ------------------------------------------------- Scroll story */
  'story.raw': slot('story.raw', {
    alt: 'Raw feed water drawn before treatment',
    real: false,
    expected: 'Macro shot of untreated feed water at a site.',
  }),
  'story.sediment': slot('story.sediment', {
    alt: 'Sediment and pre-filtration stage',
    real: false,
    expected: 'Photograph of multi-media / sediment filter vessels.',
  }),
  'story.membrane': slot('story.membrane', {
    alt: 'Reverse osmosis membrane assemblies',
    real: false,
    expected: 'RO membrane stack or vessel array on an A2Care skid.',
  }),
  'story.monitoring': slot('story.monitoring', {
    alt: 'Instrumentation and control panel monitoring treated water',
    real: false,
    expected: 'Control panel, flow meters and analyser readings.',
  }),
  'story.treated': slot('story.treated', {
    alt: 'Clarity of treated water leaving the plant',
    real: false,
    expected: 'Clear treated water sample or outlet stream.',
  }),

  /* ---------------------------------------------------- Solutions */
  'product.industrial-ro': slot('product.industrial-ro', {
    alt: 'Industrial reverse osmosis plant built by A2Care India',
    real: false,
  }),
  'product.commercial-ro': slot('product.commercial-ro', {
    alt: 'Commercial reverse osmosis system',
    real: false,
  }),
  'product.etp': slot('product.etp', {
    alt: 'Effluent treatment plant',
    real: false,
  }),
  'product.stp': slot('product.stp', {
    alt: 'Sewage treatment plant',
    real: false,
  }),
  'product.dosing': slot('product.dosing', {
    alt: 'Chemical dosing skid with metering pumps',
    real: false,
  }),
  'product.rainwater': slot('product.rainwater', {
    alt: 'Rainwater harvesting and filtration system',
    real: false,
  }),
  'product.chillers': slot('product.chillers', {
    alt: 'Industrial water chiller package',
    real: false,
  }),

  /* ----------------------------------------------------- Projects */
  'project.pantnagar-ro-5000': slot('project.pantnagar-ro-5000', {
    alt: '5000 LPH industrial RO plant, food processing unit, Pantnagar',
    real: false,
    expected: 'Site photographs of the commissioned Pantnagar RO plant.',
  }),
  'project.rudrapur-etp-50kld': slot('project.rudrapur-etp-50kld', {
    alt: '50 KLD effluent treatment plant, chemical manufacturing, Rudrapur',
    real: false,
    expected: 'Site photographs of the Rudrapur 50 KLD ETP installation.',
  }),
  'project.haldwani-chiller-20tr': slot('project.haldwani-chiller-20tr', {
    alt: '20 TR industrial water chiller, plastic molding unit, Haldwani',
    real: false,
    expected: 'Site photographs of the Haldwani chiller installation.',
  }),
  'project.kichha-school-ro-1500': slot('project.kichha-school-ro-1500', {
    alt: '1500 LPH RO plant, St. Peter Senior Secondary School, Kichha',
    real: false,
    expected: 'Photograph of the school RO installation.',
  }),
  'project.haridwar-gold-ro-250': slot('project.haridwar-gold-ro-250', {
    alt: '250 LPH RO plant, Hare Krishna Gold Refinery, Haridwar',
    real: false,
    expected: 'Photograph of the refinery RO skid.',
  }),
  'project.haridwar-gold-ro-500': slot('project.haridwar-gold-ro-500', {
    alt: '500 LPH RO plant, Hare Krishna Gold Refinery, Haridwar',
    real: false,
    expected: 'Photograph of the refinery RO skid.',
  }),
  'project.jewar-stp': slot('project.jewar-stp', {
    alt: 'Sewage treatment plant near Jewar Airport, Gautam Buddha Nagar',
    real: false,
    expected: 'Photograph of the Jewar STP site.',
  }),
  'project.haldwani-battery-plant': slot('project.haldwani-battery-plant', {
    alt: 'Battery water plant, Paras Minerals Water, Haldwani',
    real: false,
    expected: 'Photograph of the Paras Minerals water plant.',
  }),

  /* ------------------------------------------------------- Editorial */
  'about.works': slot('about.works', {
    alt: 'A2Care India engineering and fabrication work',
    real: false,
    expected: 'Fabrication-floor or on-site engineering photograph.',
  }),
  'sustainability.nature': slot('sustainability.nature', {
    alt: 'Natural water environment benefiting from responsible water management',
    real: false,
    expected: 'Environmental photography of a river or catchment.',
  }),
  'cta.band': slot('cta.band', {
    kind: 'video',
    src: '/media/cta.band/cta.mp4',
    poster: '/media/cta.band/poster.jpg',
    alt: 'Water treatment plant at dusk',
    real: false,
    expected: 'Looping footage for the closing call to action.',
  }),
};

export const getMedia = (id: string): MediaSlot =>
  media[id] ??
  slot(id, { alt: `Visual for ${id}`, real: false, expected: 'Asset not yet supplied.' });

/**
 * Decorative artwork only.
 *
 * Generated abstract water art and the hero drinking loop. None of it is photography of
 * anything A2Care built, and it is never placed where a visitor could read it as a site
 * record — `<MediaFrame>` owns anything that claims to document real work. Delete a file
 * and drop its entry to remove it.
 */
export type DecorSlot = {
  id: string;
  src: string;
  alt: string;
  credit: string;
};

export const decor: Record<string, DecorSlot> = {
  'decor.hero-water': {
    id: 'decor.hero-water',
    src: '/media/decorative/hero-water.webp',
    alt: 'Abstract dark water surface with faint light',
    credit: 'Generated decorative artwork — not an A2Care installation.',
  },
  'decor.treated-water': {
    id: 'decor.treated-water',
    src: '/media/decorative/treated-water.webp',
    alt: 'Abstract clear water with a single ripple',
    credit: 'Generated decorative artwork — not an A2Care installation.',
  },
  /**
   * Scroll-scrubbed hero loop, rendered by `<HeroDrinker>`. Synthetic: a generated figure,
   * not a filmed person and not A2Care footage. Scrubbing is deliberate — the beat where he
   * turns and drinks is tied to scroll position rather than played through.
   */
  'decor.hero-drink': {
    id: 'decor.hero-drink',
    src: '/media/decorative/hero-drink.mp4',
    alt: 'Generated figure turning to drink a glass of clear water',
    credit: 'Generated animation — not filmed, and not an A2Care site.',
  },
};

/**
 * Hero / CTA autoplay policy. Video only autoplays when the visitor has not asked for
 * reduced motion and is not on a metered connection — and never with sound.
 */
export const autoplayPolicy = {
  muted: true,
  playsInline: true,
  loop: true,
  disableOnDataSaver: true,
} as const;
