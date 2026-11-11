import { getMedia } from '@/lib/media';

export type ProjectCategory = 'RO Plants' | 'ETP' | 'STP' | 'Industrial Chillers';

export type Project = {
  slug: string;
  title: string;
  client: string;
  industry: string;
  category: ProjectCategory;
  location: string;
  state: string;
  plantType: string;
  capacity: string;
  /** null = completion date not yet confirmed by the company */
  completed: string | null;
  summary: string;
  challenge: string;
  solution: string;
  specifications: { label: string; value: string }[];
  highlights: string[];
  mediaId: string;
  /**
   * true = narrative written from the published plant type, capacity and industry only.
   * A2Care must confirm the site-specific detail before this copy goes live.
   */
  needsConfirmation: boolean;
};

export const projects: Project[] = [
  {
    slug: '5000-lph-ro-plant-food-processing-pantnagar',
    title: '5000 LPH Industrial RO Plant',
    client: 'Food processing unit',
    industry: 'Food & Beverage',
    category: 'RO Plants',
    location: 'Pantnagar',
    state: 'Uttarakhand',
    plantType: 'Industrial Reverse Osmosis',
    capacity: '5,000 LPH',
    completed: 'January 2026',
    summary:
      'A 5,000 LPH industrial reverse osmosis plant serving a food processing unit at Pantnagar, delivered end to end by A2Care India.',
    challenge:
      'Food processing puts continuous demand on process water, and the quality of that water shows up directly in the product. The site needed a plant that would hold a consistent output across a full production day rather than a rated nameplate.',
    solution:
      'A 5,000 LPH reverse osmosis system was engineered around the unit’s feed water, with pre-treatment and dosing arranged so the membrane stage stays within its intended operating window. A2Care handled manufacture, supply, installation and commissioning.',
    specifications: [
      { label: 'Plant type', value: 'Industrial RO' },
      { label: 'Capacity', value: '5,000 LPH' },
      { label: 'Application', value: 'Food processing' },
      { label: 'Execution', value: 'Design, manufacture, install, commission' },
    ],
    highlights: [
      '5,000 LPH continuous process duty',
      'Pre-treatment arranged around site feed water',
      'Commissioned on site at Pantnagar',
    ],
    mediaId: 'project.pantnagar-ro-5000',
    needsConfirmation: true,
  },
  {
    slug: '50-kld-etp-plant-chemical-rudrapur',
    title: '50 KLD ETP Plant',
    client: 'Chemical manufacturer',
    industry: 'Chemical Manufacturing',
    category: 'ETP',
    location: 'Rudrapur',
    state: 'Uttarakhand',
    plantType: 'Effluent Treatment Plant',
    capacity: '50 KLD',
    completed: 'December 2025',
    summary:
      'A 50 KLD effluent treatment plant for a chemical manufacturing unit at Rudrapur.',
    challenge:
      'Chemical effluent varies in load through the production cycle, and disposal is governed by norms the unit has to satisfy continuously — not intermittently. Treating a variable stream to a stable standard is the core problem.',
    solution:
      'A 50 KLD treatment plant engineered around the measured contaminant load of the unit and commissioned against the applicable pollution control board norms for the site.',
    specifications: [
      { label: 'Plant type', value: 'Effluent treatment plant' },
      { label: 'Capacity', value: '50 KLD' },
      { label: 'Application', value: 'Chemical manufacturing' },
      { label: 'Execution', value: 'Design, manufacture, install, commission' },
    ],
    highlights: [
      '50 KLD treatment capacity',
      'Engineered against measured effluent load',
      'Commissioned to applicable pollution control norms',
    ],
    mediaId: 'project.rudrapur-etp-50kld',
    needsConfirmation: true,
  },
  {
    slug: '20-tr-industrial-water-chiller-haldwani',
    title: '20 TR Industrial Water Chiller',
    client: 'Plastic molding unit',
    industry: 'Industrial Manufacturing',
    category: 'Industrial Chillers',
    location: 'Haldwani',
    state: 'Uttarakhand',
    plantType: 'Industrial Water Chiller',
    capacity: '20 TR',
    completed: 'November 2025',
    summary:
      'A 20 TR industrial water chiller supporting a plastic molding operation at Haldwani.',
    challenge:
      'In molding, cycle time and part quality turn on how fast and how steadily the mould can be cooled. A chiller that drifts against setpoint costs output even when it is nominally the right size.',
    solution:
      'A 20 TR chiller package was selected against the unit’s actual heat load and matched to site water quality, so cooling capacity is delivered steadily through the production cycle.',
    specifications: [
      { label: 'Plant type', value: 'Industrial water chiller' },
      { label: 'Capacity', value: '20 TR' },
      { label: 'Application', value: 'Plastic molding' },
      { label: 'Execution', value: 'Supply, install, commission' },
    ],
    highlights: [
      '20 TR cooling capacity',
      'Selected against measured process heat load',
      'Matched to site water conditions',
    ],
    mediaId: 'project.haldwani-chiller-20tr',
    needsConfirmation: true,
  },
  {
    slug: '1500-lph-ro-plant-st-peter-school-kichha',
    title: '1500 LPH RO Plant',
    client: 'St. Peter Senior Secondary School',
    industry: 'Educational Institutions',
    category: 'RO Plants',
    location: 'Kichha',
    state: 'Uttarakhand',
    plantType: 'Commercial Reverse Osmosis',
    capacity: '1,500 LPH',
    completed: null,
    summary:
      'A 1,500 LPH reverse osmosis system installed at St. Peter Senior Secondary School, Kichha.',
    challenge:
      'A school needs safe drinking water across many outlets through the day, run by staff whose job is teaching rather than plant operation.',
    solution:
      'A packaged 1,500 LPH RO system sized for institutional demand, with pre-treatment arranged for the incoming supply and a service schedule the school can actually keep.',
    specifications: [
      { label: 'Plant type', value: 'Commercial RO' },
      { label: 'Capacity', value: '1,500 LPH' },
      { label: 'Application', value: 'Drinking water for an institution' },
    ],
    highlights: ['1,500 LPH output', 'Institutional drinking water duty', 'Serviceable design'],
    mediaId: 'project.kichha-school-ro-1500',
    needsConfirmation: true,
  },
  {
    slug: '250-lph-ro-plant-hare-krishna-gold-refinery-haridwar',
    title: '250 LPH Gold Refinery RO Plant',
    client: 'Hare Krishna Gold Refinery',
    industry: 'Chemical Manufacturing',
    category: 'RO Plants',
    location: 'Haridwar',
    state: 'Uttarakhand',
    plantType: 'Reverse Osmosis',
    capacity: '250 LPH',
    completed: null,
    summary:
      'A 250 LPH reverse osmosis plant supplying purified process water to Hare Krishna Gold Refinery, Haridwar.',
    challenge:
      'Refining process water has to stay well outside specification for the work itself — dissolved content that is harmless elsewhere is not acceptable here.',
    solution:
      'A compact 250 LPH RO system engineered for the refinery’s process duty, with pre-treatment arranged for the site supply.',
    specifications: [
      { label: 'Plant type', value: 'RO plant' },
      { label: 'Capacity', value: '250 LPH' },
      { label: 'Application', value: 'Refinery process water' },
    ],
    highlights: ['250 LPH capacity', 'Refinery process duty', 'Compact skid arrangement'],
    mediaId: 'project.haridwar-gold-ro-250',
    needsConfirmation: true,
  },
  {
    slug: '500-lph-ro-plant-hare-krishna-gold-refinery-haridwar',
    title: '500 LPH Gold Refinery RO Plant',
    client: 'Hare Krishna Gold Refinery',
    industry: 'Chemical Manufacturing',
    category: 'RO Plants',
    location: 'Haridwar',
    state: 'Uttarakhand',
    plantType: 'Reverse Osmosis',
    capacity: '500 LPH',
    completed: null,
    summary:
      'A second, higher-capacity 500 LPH RO plant delivered to Hare Krishna Gold Refinery at Haridwar.',
    challenge:
      'As process demand grows, the water plant has to grow with it without reworking the arrangement already in service.',
    solution:
      'A 500 LPH reverse osmosis plant added to the refinery’s treated water capability, engineered on the same understanding of the site’s feed water.',
    specifications: [
      { label: 'Plant type', value: 'RO plant' },
      { label: 'Capacity', value: '500 LPH' },
      { label: 'Application', value: 'Refinery process water' },
    ],
    highlights: ['500 LPH capacity', 'Capacity growth on an existing site', 'Repeat engagement'],
    mediaId: 'project.haridwar-gold-ro-500',
    needsConfirmation: true,
  },
  {
    slug: 'stp-installation-jewar-airport-gautam-buddha-nagar',
    title: 'Sewage Treatment Plant Installation',
    client: 'Site near Jewar Airport',
    industry: 'Infrastructure & Construction',
    category: 'STP',
    location: 'Near Jewar Airport, Gautam Buddha Nagar',
    state: 'Uttar Pradesh',
    plantType: 'Sewage Treatment Plant',
    capacity: '2,000 LPD',
    completed: null,
    summary:
      'A 2,000 LPD sewage treatment plant installed at a site near Jewar Airport in Gautam Buddha Nagar.',
    challenge:
      'Developments around new infrastructure carry real sewage loads from day one, and the land available for treatment is rarely generous.',
    solution:
      'An STP arranged for the site’s sewage load with treated water made available for non-potable reuse on site.',
    specifications: [
      { label: 'Plant type', value: 'STP' },
      { label: 'Capacity', value: '2,000 LPD' },
      { label: 'Application', value: 'Sewage treatment and reuse' },
    ],
    highlights: ['Sewage treatment for a developing site', 'Reuse-oriented output', 'Site-adapted layout'],
    mediaId: 'project.jewar-stp',
    needsConfirmation: true,
  },
  {
    slug: 'battery-water-plant-paras-minerals-haldwani',
    title: 'Battery Water Plant',
    client: 'Paras Minerals Water',
    industry: 'Industrial Manufacturing',
    category: 'RO Plants',
    location: 'Haldwani',
    state: 'Uttarakhand',
    plantType: 'Water Treatment Plant',
    capacity: '500 LPH',
    completed: null,
    summary:
      'A 500 LPH water treatment plant serving battery-grade water duty for Paras Minerals Water, Haldwani — the capacity is the client’s own published description of the installation.',
    challenge:
      'Battery manufacturing consumes water to a specification where small deviations in dissolved content show up in the finished product.',
    solution:
      'A treatment plant configured for the required water quality at the Paras Minerals site, delivered with installation and commissioning.',
    specifications: [
      { label: 'Plant type', value: 'Water treatment plant' },
      { label: 'Capacity', value: '500 LPH' },
      { label: 'Application', value: 'Battery manufacturing' },
    ],
    highlights: ['Specification-driven treatment duty', 'Manufacturing application', 'Full installation'],
    mediaId: 'project.haldwani-battery-plant',
    needsConfirmation: true,
  },
];

export const getProject = (slug: string): Project | undefined =>
  projects.find((project) => project.slug === slug);

export const projectSlugs = projects.map((project) => project.slug);

export const projectCategories: ProjectCategory[] = [
  'RO Plants',
  'ETP',
  'STP',
  'Industrial Chillers',
];

export const projectLocations = [...new Set(projects.map((p) => p.location))];
export const projectIndustries = [...new Set(projects.map((p) => p.industry))];

export const projectMedia = (project: Project) => getMedia(project.mediaId);
