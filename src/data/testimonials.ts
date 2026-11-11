/**
 * Quotes are reproduced as published on a2careindia.com. Editing a quote changes what a
 * real customer said, so treat these strings as factual records, not copy.
 */

export type Testimonial = {
  quote: string;
  name: string;
  role?: string;
  organisation: string;
  project: string;
  location: string;
};

export const testimonials: Testimonial[] = [
  {
    quote: 'The water quality is excellent, and their after-sales support is outstanding.',
    name: 'Fr. Alexander Monteiro',
    organisation: 'St. Peter Senior Secondary School',
    project: '1500 LPH RO Plant',
    location: 'Kichha, Uttarakhand',
  },
  {
    quote: 'Professional team, timely delivery, and great value for money.',
    name: 'Suresh Gupta',
    organisation: 'Hare Krishna Gold Refinery',
    project: '250 LPH RO Plant',
    location: 'Haridwar, Uttarakhand',
  },
  {
    quote: 'Energy efficiency has reduced our operational costs by 25%.',
    name: 'Anil Sharma',
    organisation: 'Hare Krishna Gold Refinery',
    project: '500 LPH RO Plant',
    location: 'Haridwar, Uttarakhand',
  },
  {
    quote: 'The system has been running flawlessly for 2 years now.',
    name: 'Priya Singh',
    organisation: 'Sewage treatment installation',
    project: 'STP Plant',
    location: 'Near Jewar Airport, Gautam Buddha Nagar',
  },
  {
    quote: 'The system has been running smoothly for 4 years now.',
    name: 'Shashank Kumar',
    organisation: 'Paras Minerals Water',
    project: 'Battery Water Plant',
    location: 'Haldwani, Uttarakhand',
  },
];

/**
 * Organisations named by testimonials above. Rendered as wordmarks, not logos — no real
 * logo files have been supplied or authorised, and inventing them is out of the question.
 */
export const referencedClients = [
  { name: 'St. Peter Senior Secondary School', context: 'RO plant · Kichha' },
  { name: 'Hare Krishna Gold Refinery', context: 'RO plants · Haridwar' },
  { name: 'Paras Minerals Water', context: 'Water plant · Haldwani' },
];
