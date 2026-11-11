/**
 * Single source of truth for company facts.
 * Sourced from https://www.a2careindia.com — edit here, every page follows.
 */

export const site = {
  name: 'A2Care India',
  legalName: 'A2Care India (INC)',
  establishedYear: 2018,
  tagline: 'Engineering Water. Powering Industry. Protecting Tomorrow.',
  heroHeadline: 'Engineering pure water. Powering a better tomorrow.',
  heroSupport:
    'Advanced industrial water treatment solutions engineered for performance, reliability and sustainability.',
  brandLine: 'Mastering Water Purification Since 2018.',

  url: 'https://www.a2careindia.com',

  address: {
    line1: 'M84 Matkota Farm, Near PNB Bank',
    line2: 'Rudrapur',
    state: 'Uttarakhand',
    country: 'India',
    postalCode: '263153',
    full: 'M84 Matkota Farm, Near PNB Bank, Rudrapur, Uttarakhand, India - 263153',
    // Used for the map embed and directions links.
    mapsQuery: 'M84 Matkota Farm, Near PNB Bank, Rudrapur, Uttarakhand 263153',
    mapsEmbed:
      'https://www.google.com/maps?q=M84+Matkota+Farm,+Near+PNB+Bank,+Rudrapur,+Uttarakhand+263153&output=embed',
    lat: 28.9455,
    lng: 79.4084,
  },

  phones: ['+91-9336432885', '+91-7017572336'],
  whatsapp: {
    number: '919336432885',
    // Prefilled first message so the company instantly knows the enquiry is from the site.
    preamble: "Hello A2Care India, I'd like to discuss a water treatment project.",
  },
  email: 'a2careindia@gmail.com',

  hours: {
    days: 'Monday – Saturday',
    time: '9:00 AM – 6:00 PM',
    closed: 'Sunday',
  },

  socials: {
    facebook: 'https://www.facebook.com/p/A2-CARE-INDIA-INC-100063971388113/',
    instagram: 'https://www.instagram.com/a2careindia/',
    linkedin: 'https://www.linkedin.com/company/a2careindia',
    twitter: 'https://twitter.com/a2careindia',
  },

  stats: [
    { value: 7, suffix: '+', label: 'Years of excellence', note: 'Since 2018' },
    { value: 50, suffix: '+', label: 'Successful installations', note: 'Across India' },
    { value: 50000, suffix: ' LPH', label: 'Industrial RO capacity', note: 'From 100 LPH' },
    { value: 100, suffix: ' TR', label: 'Industrial chiller range', note: 'From 5 TR' },
  ],

  certification: {
    name: 'ISO 9001:2015',
    // Publish only after the company supplies the certificate number and issuing body.
    isVerifiedForPublish: false,
    placeholderNote: 'Certificate number and issuing body to be confirmed by A2Care India.',
  },
} as const;

export const telHref = (phone: string) => `tel:${phone.replace(/[^+\d]/g, '')}`;

export const mailHref = (subject?: string) =>
  `mailto:${site.email}${subject ? `?subject=${encodeURIComponent(subject)}` : ''}`;

export const whatsappHref = (message: string = site.whatsapp.preamble) =>
  `https://wa.me/${site.whatsapp.number}?text=${encodeURIComponent(message)}`;

/** Defaults to the company address; pass a place to open the map on that instead. */
export const mapsHref = (query: string = site.address.mapsQuery) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
