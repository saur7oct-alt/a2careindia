export type Industry = {
  slug: string;
  name: string;
  description: string;
  /** Product slugs that map to this industry */
  solutions: string[];
  /** Water-quality pressure points that make the industry's duty characteristic */
  drivers: string[];
};

export const industries: Industry[] = [
  {
    slug: 'food-beverage',
    name: 'Food & Beverage',
    description:
      'Water that goes into a product has to be consistent, because it carries into taste, shelf life and compliance.',
    solutions: ['industrial-ro-plants', 'chemical-dosing-systems', 'etp-plants'],
    drivers: ['Process and ingredient water', 'Cleaning-in-place duty', 'Organic effluent load'],
  },
  {
    slug: 'pharmaceutical',
    name: 'Pharmaceutical',
    description:
      'Pharma water duty runs from utility feed to high-purity process water, with documentation to match.',
    solutions: ['industrial-ro-plants', 'chemical-dosing-systems', 'etp-plants'],
    drivers: ['High-purity water', 'Boiler feed', 'Effluent treatment to norm'],
  },
  {
    slug: 'healthcare',
    name: 'Healthcare',
    description:
      'Hospitals need dependable water across clinical, laundry and HVAC duties, without a specialist on call.',
    solutions: ['commercial-ro-systems', 'stp-plants', 'industrial-water-chillers'],
    drivers: ['Drinking and clinical supply', 'Laundry and sterilisation', 'Sewage treatment'],
  },
  {
    slug: 'educational-institutions',
    name: 'Educational Institutions',
    description:
      'Campuses need safe drinking water at many outlets, run by staff whose focus is elsewhere.',
    solutions: ['commercial-ro-systems', 'rainwater-harvesting-systems', 'stp-plants'],
    drivers: ['Drinking water', 'Hostel and canteen load', 'Groundwater reduction'],
  },
  {
    slug: 'chemical-manufacturing',
    name: 'Chemical Manufacturing',
    description:
      'The hardest effluent in most industrial regions, with loads that shift across the production cycle.',
    solutions: ['etp-plants', 'industrial-ro-plants', 'chemical-dosing-systems'],
    drivers: ['Variable contaminant load', 'Process water quality', 'Disposal norm compliance'],
  },
  {
    slug: 'textile-manufacturing',
    name: 'Textile Manufacturing',
    description:
      'Dyeing and finishing consume volume and return it loaded with colour and chemistry.',
    solutions: ['etp-plants', 'industrial-ro-plants', 'chemical-dosing-systems'],
    drivers: ['Dye-house water', 'High effluent volume', 'Reuse of treated water'],
  },
  {
    slug: 'hospitality',
    name: 'Hospitality',
    description:
      'Hotels run guest-facing water quality and back-of-house load at the same time, every day.',
    solutions: ['commercial-ro-systems', 'stp-plants', 'industrial-water-chillers'],
    drivers: ['Guest supply and kitchen', 'Laundry load', 'Sewage and cooling duty'],
  },
  {
    slug: 'commercial-buildings',
    name: 'Commercial Buildings',
    description:
      'Offices and complexes need consistent supply, working cooling and treated waste discharge.',
    solutions: ['commercial-ro-systems', 'stp-plants', 'industrial-water-chillers'],
    drivers: ['Domestic supply', 'Central plant cooling', 'Rainwater and reuse'],
  },
  {
    slug: 'industrial-manufacturing',
    name: 'Industrial Manufacturing',
    description:
      'Molding, machining and fabrication plants cool, clean and process with water continuously.',
    solutions: ['industrial-water-chillers', 'industrial-ro-plants', 'chemical-dosing-systems'],
    drivers: ['Mould and process cooling', 'Boiler feed water', 'Machine coolant handling'],
  },
  {
    slug: 'infrastructure-construction',
    name: 'Infrastructure & Construction',
    description:
      'New developments carry utility load from day one and rarely have generous space for treatment.',
    solutions: ['stp-plants', 'rainwater-harvesting-systems', 'commercial-ro-systems'],
    drivers: ['Site sewage treatment', 'Water harvesting mandates', 'Compact footprints'],
  },
];

export const getIndustry = (slug: string): Industry | undefined =>
  industries.find((industry) => industry.slug === slug);

export const industrySlugs = industries.map((industry) => industry.slug);
