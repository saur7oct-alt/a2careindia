import type { MediaSlot } from '@/lib/media';
import { getMedia } from '@/lib/media';

export type Spec = {
  label: string;
  value: string;
  /** false = needs confirmation from A2Care before it can be published as fact */
  verified: boolean;
};

export type Product = {
  slug: string;
  name: string;
  shortName: string;
  /** One-line editorial standfirst */
  lede: string;
  description: string;
  longDescription: string;
  capacityLabel?: string;
  highlights: string[];
  applications: string[];
  specs: Spec[];
  faqs: { question: string; answer: string }[];
  mediaId: string;
  meta: { title: string; description: string };
};

export const products: Product[] = [
  {
    slug: 'industrial-ro-plants',
    name: 'Industrial RO Plants',
    shortName: 'Industrial RO',
    lede: 'High-capacity reverse osmosis, built around your feed water.',
    description:
      'Customised industrial reverse osmosis systems engineered for high-capacity water purification.',
    longDescription:
      'Every A2Care industrial RO plant starts with the feed water, not a catalogue. Membrane count, recovery ratio, pre-treatment train and skid layout are worked out from a raw water analysis and the actual duty the plant has to hold. Systems are fabricated, tested and commissioned as a complete package.',
    capacityLabel: '100 LPH – 50,000 LPH',
    highlights: [
      'Capacity range from 100 LPH to 50,000 LPH',
      'Design driven by feed water analysis',
      'Skid-mounted for faster installation',
      'Manual, semi-automatic and fully automatic configurations',
    ],
    applications: [
      'Food and beverage processing',
      'Pharmaceutical and hospital water systems',
      'Boiler feed water',
      'Process water for manufacturing',
    ],
    specs: [
      { label: 'Capacity range', value: '100 – 50,000 LPH', verified: true },
      { label: 'Membrane type', value: 'Thin-film composite', verified: false },
      { label: 'Recovery ratio', value: 'Configured per feed water', verified: false },
      { label: 'Housing', value: 'FRP / stainless steel', verified: false },
      { label: 'Control', value: 'Panel or PLC based', verified: false },
    ],
    faqs: [
      {
        question: 'What capacity of industrial RO plant do I need?',
        answer:
          'It depends on your hourly process demand and the quality of your feed water. Share a raw water report and your requirement and A2Care sizes the plant for you — the published range runs from 100 LPH to 50,000 LPH.',
      },
      {
        question: 'Is the plant supplied complete?',
        answer:
          'A2Care handles engineering, manufacture, supply, installation and commissioning, so pre-treatment, membranes, dosing and instrumentation are delivered as one coordinated system.',
      },
    ],
    mediaId: 'product.industrial-ro',
    meta: {
      title: 'Industrial RO Plant Manufacturer in India | 100–50,000 LPH',
      description:
        'Customised industrial reverse osmosis plants from 100 LPH to 50,000 LPH. Engineered, manufactured, installed and commissioned across India by A2Care India, Rudrapur.',
    },
  },
  {
    slug: 'commercial-ro-systems',
    name: 'Commercial RO Systems',
    shortName: 'Commercial RO',
    lede: 'Dependable purification for institutions and businesses.',
    description:
      'Advanced purification solutions for commercial establishments, institutions and businesses.',
    longDescription:
      'Commercial duties — schools, hospitals, offices, residential blocks — need water quality that stays consistent without a specialist on site. These systems treat dissolved impurities through thin-film composite membranes, with pre-treatment sized for the incoming supply rather than a default configuration.',
    capacityLabel: 'Sized per outlet demand',
    highlights: [
      'Thin-film composite membrane technology',
      'Compact footprint for plant rooms',
      'Pre-treatment sized to the incoming supply',
      'Low-maintenance service schedule',
    ],
    applications: [
      'Educational institutions',
      'Hospitals and clinics',
      'Offices and commercial buildings',
      'Residential complexes',
    ],
    specs: [
      { label: 'Membrane type', value: 'Thin-film composite', verified: false },
      { label: 'Capacity', value: 'Sized to demand', verified: true },
      { label: 'Storage integration', value: 'Available', verified: false },
    ],
    faqs: [
      {
        question: 'How is a commercial RO system different from an industrial plant?',
        answer:
          'The purification principle is the same. Commercial systems are packaged for lower, more variable demand and for operation by non-specialist staff, while industrial plants are engineered around a continuous process duty.',
      },
    ],
    mediaId: 'product.commercial-ro',
    meta: {
      title: 'Commercial RO Plant Suppliers in India',
      description:
        'Commercial reverse osmosis systems for schools, hospitals, offices and institutions, built on thin-film composite membranes and engineered against the incoming supply.',
    },
  },
  {
    slug: 'etp-plants',
    name: 'ETP Plants',
    shortName: 'Effluent Treatment',
    lede: 'Treat effluent to norm, then recover what you can from it.',
    description:
      'Effluent Treatment Plants designed to treat industrial wastewater and support regulatory compliance.',
    longDescription:
      'Industrial effluent is the hardest water in the building. A2Care designs ETP trains around the actual contaminant load — equalisation, biological treatment, clarification, filtration and disposal or reuse — configured to meet the applicable pollution control board norms for the site.',
    capacityLabel: 'Sized to effluent load',
    highlights: [
      'Designed around measured contaminant load',
      'Configured to meet pollution control board norms',
      'Treated water routed to reuse where practical',
    ],
    applications: [
      'Chemical manufacturing',
      'Textile processing',
      'Food and beverage processing',
      'Plastics and metal finishing',
    ],
    specs: [
      { label: 'Norms', value: 'CPCB / SPCB applicable standards', verified: true },
      { label: 'Capacity', value: 'Sized to effluent load', verified: true },
      { label: 'Stages', value: 'Equalisation to disposal', verified: true },
    ],
    faqs: [
      {
        question: 'Are ETP systems designed around applicable pollution control norms?',
        answer:
          'Yes. Treatment trains are configured against the norms that apply to the site and industry, based on the effluent characteristics recorded during analysis.',
      },
    ],
    mediaId: 'product.etp',
    meta: {
      title: 'ETP Plant Manufacturer in India | Effluent Treatment',
      description:
        'Industrial effluent treatment plants designed to meet applicable pollution control board norms. Manufactured and commissioned across India.',
    },
  },
  {
    slug: 'stp-plants',
    name: 'STP Plants',
    shortName: 'Sewage Treatment',
    lede: 'Sewage treated for reuse, not just for discharge.',
    description:
      'Sewage Treatment Plants designed for effective wastewater treatment and reuse.',
    longDescription:
      'Sewage is a resource at the wrong point in the cycle. A2Care STPs treat domestic and institutional sewage so the output can be put back to work in landscaping, flushing and cooling — reducing fresh water intake rather than simply meeting a discharge permit.',
    capacityLabel: 'Sized to sewage load',
    highlights: [
      'Treated water available for non-potable reuse',
      'Compact arrangements for constrained sites',
      'Odour and noise conscious design',
      'Low operating attention once commissioned',
    ],
    applications: [
      'Residential townships',
      'Educational institutions',
      'Hospitals',
      'Commercial buildings and infrastructure projects',
    ],
    specs: [
      { label: 'Reuse', value: 'Treated water to non-potable duties', verified: true },
      { label: 'Capacity', value: 'Sized to sewage load', verified: true },
      { label: 'Treatment stages', value: 'Configured per site', verified: false },
    ],
    faqs: [
      {
        question: 'Can treated sewage water actually be reused on site?',
        answer:
          'Yes, when the treatment train is designed for the reuse duty. Landscaping, flushing and cooling are the common applications A2Care designs STP output around.',
      },
    ],
    mediaId: 'product.stp',
    meta: {
      title: 'STP Plant Manufacturer in India | Sewage Treatment',
      description:
        'Sewage treatment plants engineered for effective treatment and on-site reuse, installed and commissioned across India by A2Care India.',
    },
  },
  {
    slug: 'chemical-dosing-systems',
    name: 'Chemical Dosing Systems',
    shortName: 'Dosing',
    lede: 'Precision dosing keeps the rest of the system honest.',
    description:
      'Precision chemical dosing solutions for industrial water systems, boilers and cooling towers.',
    longDescription:
      'Membranes, boilers and cooling towers fail early when dosing drifts. These skids pair metering pumps with the right chemistry and control logic so antiscalant, biocide and pH correction are delivered at the rate the system actually needs.',
    capacityLabel: 'Sized to system duty',
    highlights: [
      'Metering pumps matched to duty',
      'Boiler and cooling tower applications',
      'Antiscalant, biocide and pH correction',
      'Integrated with RO and treatment controls',
    ],
    applications: ['Boiler water', 'Cooling towers', 'RO pre-treatment', 'Process water loops'],
    specs: [
      { label: 'Applications', value: 'Boilers, cooling towers, RO', verified: true },
      { label: 'Chemistry', value: 'Antiscalant, biocide, pH', verified: false },
      { label: 'Control', value: 'Manual to automated', verified: false },
    ],
    faqs: [
      {
        question: 'Is dosing supplied with the plant or separately?',
        answer:
          'Both. Dosing skids are built into complete treatment packages, and can also be supplied or upgraded on systems already in service.',
      },
    ],
    mediaId: 'product.dosing',
    meta: {
      title: 'Chemical Dosing System Suppliers in India',
      description:
        'Precision chemical dosing solutions for industrial water systems, boilers and cooling towers, engineered and supplied across India by A2Care India.',
    },
  },
  {
    slug: 'rainwater-harvesting-systems',
    name: 'Rainwater Harvesting Systems',
    shortName: 'Rainwater',
    lede: 'Capture the season, then use it deliberately.',
    description:
      'Sustainable rainwater collection, filtration and water conservation solutions.',
    longDescription:
      'A2Care rainwater systems cover the full path: catchment, conveyance, first-flush diversion, filtration and storage, with recharge arrangements where the ground can take the water back. The result reduces dependence on groundwater and municipal supply.',
    capacityLabel: 'Sized to catchment and rainfall',
    highlights: [
      'Collection, filtration and storage',
      'Groundwater recharge arrangements',
      'Reduces dependence on groundwater',
      'Integrated with existing treatment systems',
    ],
    applications: [
      'Industrial campuses',
      'Educational institutions',
      'Commercial buildings',
      'Residential complexes',
    ],
    specs: [
      { label: 'Scope', value: 'Catchment to storage and recharge', verified: true },
      { label: 'Sizing', value: 'By catchment area and rainfall', verified: true },
    ],
    faqs: [
      {
        question: 'How much difference does rainwater harvesting make?',
        answer:
          'It depends on catchment area, local rainfall and how the stored water is used. A2Care sizes the system from those inputs and can work through the expected reduction in groundwater draw with you.',
      },
    ],
    mediaId: 'product.rainwater',
    meta: {
      title: 'Rainwater Harvesting System Installers in India',
      description:
        'Sustainable rainwater collection, filtration, storage and recharge systems that reduce dependence on groundwater. Installed across India by A2Care India.',
    },
  },
  {
    slug: 'industrial-water-chillers',
    name: 'Industrial Water Chillers',
    shortName: 'Chillers',
    lede: 'Cooling that holds its setpoint under process load.',
    description: 'Industrial cooling systems with capacities from 5 TR to 100 TR.',
    longDescription:
      'Process cooling duty changes through the day and across seasons. A2Care chiller packages from 5 TR to 100 TR are selected against real heat load and water quality, so the chiller is not fighting the process it is meant to stabilise.',
    capacityLabel: '5 TR – 100 TR',
    highlights: [
      'Capacity range from 5 TR to 100 TR',
      'Selected against measured heat load',
      'Water-cooled and air-cooled arrangements',
      'Matched to plant water quality',
    ],
    applications: [
      'Plastic molding',
      'Food processing',
      'Pharmaceutical process cooling',
      'HVAC for large buildings',
    ],
    specs: [
      { label: 'Capacity range', value: '5 – 100 TR', verified: true },
      { label: 'Selection basis', value: 'Process heat load', verified: true },
      { label: 'Configurations', value: 'Per site requirement', verified: false },
    ],
    faqs: [
      {
        question: 'What chiller capacity does my process need?',
        answer:
          'Capacity follows heat load, not plant size. Share the process duty and A2Care selects within the published 5 TR to 100 TR range.',
      },
    ],
    mediaId: 'product.chillers',
    meta: {
      title: 'Industrial Water Chiller Manufacturer in India | 5–100 TR',
      description:
        'Industrial water chillers from 5 TR to 100 TR, selected against real process heat load and engineered for reliable duty across India.',
    },
  },
];

export const getProduct = (slug: string): Product | undefined =>
  products.find((product) => product.slug === slug);

export const productMedia = (product: Product): MediaSlot => getMedia(product.mediaId);

export const productSlugs = products.map((product) => product.slug);
