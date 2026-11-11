/** Editorial content for narrative sections. Copy is engineering-descriptive, not promotional. */

export type StoryFrame = {
  id: string;
  index: string;
  stage: string;
  title: string;
  body: string;
  /** Technical readout shown as the animated label for the frame */
  readout: { label: string; value: string }[];
  mediaId: string;
  /** Background tint interpolated across the scroll sequence */
  tone: { from: string; to: string };
};

export const storyFrames: StoryFrame[] = [
  {
    id: 'raw',
    index: '01',
    stage: 'Intake',
    title: 'Raw water arrives with everything in it.',
    body: 'Borehole, municipal or surface supply reaches the plant carrying suspended solids, dissolved salts, hardness and whatever the catchment carries. Nothing is assumed — a raw water analysis sets the treatment train.',
    readout: [
      { label: 'Input', value: 'Feed water' },
      { label: 'Basis', value: 'Raw water analysis' },
      { label: 'Variable', value: 'TDS · turbidity · hardness' },
    ],
    mediaId: 'story.raw',
    tone: { from: '#0A263D', to: '#123246' },
  },
  {
    id: 'prefiltration',
    index: '02',
    stage: 'Pre-treatment',
    title: 'The load is taken off before the membranes see it.',
    body: 'Multi-media and sediment stages strip out the particulate that would otherwise foul downstream. This is where plant life is decided — membranes only stay inside their design window if what reaches them has been properly reduced.',
    readout: [
      { label: 'Stage', value: 'Multi-media · cartridge' },
      { label: 'Removes', value: 'Suspended solids' },
      { label: 'Protects', value: 'Membrane stage' },
    ],
    mediaId: 'story.sediment',
    tone: { from: '#123246', to: '#0E3B52' },
  },
  {
    id: 'membrane',
    index: '03',
    stage: 'Membrane',
    title: 'Thin-film composite membranes do the separation.',
    body: 'Pressurised across the membrane stack, water passes while dissolved salts are rejected and carried away to concentrate. Recovery ratio, flux and stage count are worked out from the feed water and the duty, not set to a default.',
    readout: [
      { label: 'Technology', value: 'Thin-film composite' },
      { label: 'Range', value: '100 – 50,000 LPH' },
      { label: 'Set by', value: 'Feed water quality' },
    ],
    mediaId: 'story.membrane',
    tone: { from: '#0E3B52', to: '#0B4C63' },
  },
  {
    id: 'monitoring',
    index: '04',
    stage: 'Control',
    title: 'The plant is watched, not just switched on.',
    body: 'Conductivity, pressure and flow are read at the points that matter, with dosing held to the rate the system actually needs. Instrumentation is what turns a treatment plant into something an operator can trust through a production shift.',
    readout: [
      { label: 'Measured', value: 'Conductivity · pressure · flow' },
      { label: 'Dosing', value: 'Antiscalant · pH · biocide' },
      { label: 'Panel', value: 'Manual to PLC' },
    ],
    mediaId: 'story.monitoring',
    tone: { from: '#0B4C63', to: '#0A5F6E' },
  },
  {
    id: 'treated',
    index: '05',
    stage: 'Output',
    title: 'Water that goes to work, on specification.',
    body: 'Treated water is delivered to process, boiler feed or drinking duties at a quality held consistently. Where the site allows, reuse and harvesting arrangements close part of the loop before the water is ever discharged.',
    readout: [
      { label: 'Output', value: 'To specification' },
      { label: 'Duty', value: 'Process · boiler · potable' },
      { label: 'Loop', value: 'Reuse where practical' },
    ],
    mediaId: 'story.treated',
    tone: { from: '#0A5F6E', to: '#20D5D2' },
  },
];

export type ProcessStage = {
  number: string;
  title: string;
  body: string;
  deliverable: string;
};

export const processStages: ProcessStage[] = [
  {
    number: '01',
    title: 'Consultation',
    body: 'The requirement is established in operational terms — what the water is for, how much, how continuously, and what constraint would make a system fail.',
    deliverable: 'Requirement and site brief',
  },
  {
    number: '02',
    title: 'Water Quality Analysis',
    body: 'Feed water is analysed so the treatment train is designed against measured quality instead of assumption.',
    deliverable: 'Raw water report',
  },
  {
    number: '03',
    title: 'Engineering & System Design',
    body: 'Process configuration, capacity, instrumentation and layout are worked out, then priced as a defined scope.',
    deliverable: 'Design and quotation',
  },
  {
    number: '04',
    title: 'Manufacturing',
    body: 'Systems are fabricated with attention to materials, assembly and the accuracy of the build — the stage where reliability is decided.',
    deliverable: 'Fabricated plant',
  },
  {
    number: '05',
    title: 'Installation & Commissioning',
    body: 'Plant is installed on site, connected, set to duty and proved against the specification it was engineered to.',
    deliverable: 'Commissioned system',
  },
  {
    number: '06',
    title: 'Maintenance & Support',
    body: 'After-sales support, maintenance and annual maintenance contracts keep performance where it was handed over.',
    deliverable: 'Ongoing support and AMC',
  },
];

export type Feature = {
  id: string;
  title: string;
  body: string;
  /** lucide icon name resolved by the feature block */
  icon: 'Ruler' | 'Cpu' | 'Factory' | 'Route' | 'MapPinned' | 'Wrench';
};

export const whyChoose: Feature[] = [
  {
    id: 'custom-engineering',
    title: 'Custom engineering',
    body: 'Solutions tailored to water quality, capacity and application requirements — designed from analysis rather than selected from a list.',
    icon: 'Ruler',
  },
  {
    id: 'advanced-technology',
    title: 'Advanced technology',
    body: 'Modern filtration and purification technologies, from thin-film composite membranes to instrumented control.',
    icon: 'Cpu',
  },
  {
    id: 'quality-manufacturing',
    title: 'Quality manufacturing',
    body: 'A focus on precision, reliability and system performance through fabrication and assembly.',
    icon: 'Factory',
  },
  {
    id: 'end-to-end-execution',
    title: 'End-to-end execution',
    body: 'Support across consultation, manufacturing, installation and commissioning under one engineering responsibility.',
    icon: 'Route',
  },
  {
    id: 'pan-india-service',
    title: 'Pan-India service',
    body: 'Project execution and technical support across India, from the Rudrapur base in Uttarakhand.',
    icon: 'MapPinned',
  },
  {
    id: 'after-sales-support',
    title: 'After-sales support',
    body: 'Maintenance, annual maintenance contracts and technical assistance after handover.',
    icon: 'Wrench',
  },
];

export type SustainabilityPoint = {
  title: string;
  body: string;
};

export const sustainabilityPoints: SustainabilityPoint[] = [
  {
    title: 'Water conservation',
    body: 'Treatment is sized to demand so capacity is not built, and run, beyond what the process needs.',
  },
  {
    title: 'Wastewater treatment',
    body: 'Effluent and sewage are treated to applicable norms before they leave the site.',
  },
  {
    title: 'Water reuse',
    body: 'Treated output is routed back into non-potable duty — landscaping, flushing, cooling — instead of being discarded.',
  },
  {
    title: 'Rainwater harvesting',
    body: 'Catchment, filtration, storage and recharge reduce dependence on groundwater and municipal supply.',
  },
  {
    title: 'Responsible management',
    body: 'Industrial water is managed as a loop: intake, duty, treatment and return, planned together.',
  },
  {
    title: 'Efficient system design',
    body: 'Recovery, dosing and control are configured to hold specification without wasting energy or chemistry.',
  },
];

/**
 * Interactive treatment explorer stages (optional feature A).
 * Generic unit-operation sequence — the on-page note states configurations vary by site.
 */
export type ExplorerStage = {
  id: string;
  order: number;
  title: string;
  function: string;
  detail: string;
  optional?: boolean;
};

export const treatmentStages: ExplorerStage[] = [
  {
    id: 'inlet',
    order: 1,
    title: 'Raw water inlet',
    function: 'Feed water enters the plant and is metered.',
    detail:
      'Incoming supply from borehole, municipal or surface source. Flow is measured here so everything downstream is sized against a known quantity, and the raw water analysis sets the train.',
  },
  {
    id: 'pretreatment',
    order: 2,
    title: 'Pre-treatment',
    function: 'Chemistry is corrected before it can damage equipment.',
    detail:
      'Dosing and softening address hardness, scaling tendency and biological growth — the mechanisms that shorten membrane and boiler life if left unmanaged.',
  },
  {
    id: 'sand',
    order: 3,
    title: 'Sand filtration',
    function: 'Multi-media media removes suspended load.',
    detail:
      'Graded media traps turbidity and larger particulate. It is the workhorse protecting everything after it, and it is where backwash duty belongs in the operating schedule.',
  },
  {
    id: 'carbon',
    order: 4,
    title: 'Activated carbon filtration',
    function: 'Organics, chlorine and taste/odour compounds are adsorbed.',
    detail:
      'Activated carbon pulls chlorine and organic content out of the stream. Removing oxidants here matters because several membrane types are damaged by them.',
  },
  {
    id: 'cartridge',
    order: 5,
    title: 'Cartridge filtration',
    function: 'Final particulate barrier ahead of the membrane.',
    detail:
      'Fine micronic cartridges catch what the media stages leave behind, so the membrane feed is clear of the particles that cause fouling and abrasion.',
  },
  {
    id: 'membrane',
    order: 6,
    title: 'RO membrane filtration',
    function: 'Dissolved salts are rejected under pressure.',
    detail:
      'Thin-film composite membranes separate dissolved content from the product stream, sending reject to concentrate. Recovery ratio and stage arrangement come from the feed water analysis.',
  },
  {
    id: 'uv',
    order: 7,
    title: 'UV treatment',
    function: 'Biological contamination is inactivated.',
    detail:
      'Ultraviolet exposure is added where the duty calls for it — drinking water, pharmaceutical and other applications where microbiological control is part of the specification.',
    optional: true,
  },
  {
    id: 'outlet',
    order: 8,
    title: 'Treated water outlet',
    function: 'Water is delivered to duty and monitored on the way.',
    detail:
      'Product water moves to storage, process, boiler feed or distribution with conductivity and flow read at the outlet, so specification is proved continuously rather than assumed.',
  },
];

export const capabilityFacts = [
  { label: 'Established', value: '2018' },
  { label: 'Base', value: 'Rudrapur, Uttarakhand' },
  { label: 'Scope', value: 'Engineer · Manufacture · Supply · Install · Maintain' },
  { label: 'Coverage', value: 'Pan-India installation and commissioning' },
] as const;
