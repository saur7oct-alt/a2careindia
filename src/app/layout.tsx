import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono, Space_Grotesk } from 'next/font/google';
import './globals.css';
import { SmoothScroll } from '@/components/providers/SmoothScroll';
import { SiteNav } from '@/components/layout/SiteNav';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { LoaderShell } from '@/components/layout/LoaderShell';
import { Cursor } from '@/components/ui/Cursor';
import { ScrollProgress } from '@/components/ui/ScrollProgress';
import { WhatsAppFloat } from '@/components/ui/WhatsAppFloat';
import { organizationSchema } from '@/lib/seo';
import { site } from '@/lib/site';

const display = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

const body = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['400', '500', '600'],
  display: 'swap',
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  weight: ['400', '500'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Industrial Water Treatment Solutions in India`,
    template: `%s | ${site.name}`,
  },
  description:
    'A2Care India engineers, manufactures, installs and maintains industrial RO plants, commercial RO systems, ETP and STP plants, chemical dosing systems and industrial chillers for clients across India.',
  applicationName: site.name,
  authors: [{ name: site.legalName }],
  creator: site.legalName,
  publisher: site.legalName,
  keywords: [
    'Industrial RO Plant Manufacturer in India',
    'Industrial Water Treatment Plant',
    'ETP Plant Manufacturer',
    'STP Plant Manufacturer',
    'Industrial Water Chiller Manufacturer',
    'Commercial RO Plant',
    'Water Treatment Solutions in India',
    'Water Treatment Company Uttarakhand',
  ],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: site.url,
    siteName: site.name,
    title: `${site.name} — ${site.heroHeadline}`,
    description: site.heroSupport,
    locale: 'en_IN',
    images: [{ url: '/og/default.png', width: 1200, height: 630, alt: site.tagline }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${site.name} — Industrial Water Treatment Solutions`,
    description: site.heroSupport,
    images: ['/og/default.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  icons: {
    icon: [{ url: '/icon.svg', type: 'image/svg+xml' }],
    apple: [{ url: '/icon.svg' }],
  },
  formatDetection: { telephone: true, address: true, email: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#071B2B' },
    { media: '(prefers-color-scheme: light)', color: '#071B2B' },
  ],
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>
        <script
          type="application/ld+json"
          // Server-rendered so crawlers see it without executing anything else.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema()) }}
        />

        <SmoothScroll />
        <Cursor />
        <LoaderShell />

        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[120] focus:rounded-pill focus:bg-aqua focus:px-4 focus:py-2 focus:text-navy"
        >
          Skip to content
        </a>

        <SiteNav />

        <main id="main">{children}</main>

        <SiteFooter />

        <WhatsAppFloat />
        <ScrollProgress />

        {/* One grain pass over the whole document keeps flat panels from looking printed */}
        <div className="grain-layer pointer-events-none fixed inset-0 z-[90]" aria-hidden="true" />
      </body>
    </html>
  );
}
