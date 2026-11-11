import type { Metadata } from 'next';
import { site } from './site';

export function buildMetadata({
  title,
  description,
  path,
  keywords,
  type = 'website',
}: {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  type?: 'website' | 'article';
}): Metadata {
  const url = new URL(path, site.url).toString();

  return {
    title,
    description,
    alternates: { canonical: path },
    keywords,
    openGraph: {
      type,
      url,
      siteName: site.name,
      title,
      description,
      locale: 'en_IN',
      images: [{ url: '/og/default.png', width: 1200, height: 630, alt: `${site.name} — ${site.tagline}` }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/og/default.png'],
    },
  };
}

/**
 * JSON-LD builders. Only fields the company has published are emitted — schema that
 * asserts an unverified rating, award or client would be worse than no schema.
 */

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'LocalBusiness'],
    '@id': `${site.url}/#organization`,
    name: site.legalName,
    legalName: site.legalName,
    url: site.url,
    logo: `${site.url}/og/default.png`,
    image: `${site.url}/og/default.png`,
    description:
      'Industrial water treatment solutions provider and manufacturer of industrial RO plants, ETP and STP plants, and industrial chillers, serving clients across India from Rudrapur, Uttarakhand.',
    foundingDate: String(site.establishedYear),
    telephone: site.phones.join(', '),
    email: site.email,
    priceRange: '₹₹',
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.address.line1,
      addressLocality: site.address.line2,
      addressRegion: site.address.state,
      postalCode: site.address.postalCode,
      addressCountry: 'IN',
    },
    geo: { '@type': 'GeoCoordinates', latitude: site.address.lat, longitude: site.address.lng },
    areaServed: { '@type': 'Country', name: 'India' },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '09:00',
        closes: '18:00',
      },
    ],
    sameAs: Object.values(site.socials),
  };
}

export function serviceSchema(name: string, description: string, path: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    provider: { '@type': 'Organization', name: site.legalName, url: site.url },
    areaServed: { '@type': 'Country', name: 'India' },
    url: new URL(path, site.url).toString(),
  };
}

export function productSchema({
  name,
  description,
  path,
}: {
  name: string;
  description: string;
  path: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    brand: { '@type': 'Brand', name: site.name },
    manufacturer: { '@type': 'Organization', name: site.legalName, url: site.url },
    url: new URL(path, site.url).toString(),
    // No aggregateRating or review schema: unverified ratings in structured data invite
    // a manual action, and the company has not published any.
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: new URL(item.path, site.url).toString(),
    })),
  };
}

export function faqSchema(items: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };
}
