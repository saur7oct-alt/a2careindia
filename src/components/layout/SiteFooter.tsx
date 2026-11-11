import Link from 'next/link';
import { ArrowUpRight, Clock, Mail, MapPin, Phone, Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';
import { cn } from '@/lib/cn';
import { products } from '@/data/products';
import { mailHref, mapsHref, site, telHref, whatsappHref } from '@/lib/site';
import { Logo } from '@/components/ui/Logo';
import { Reveal } from '@/components/motion/Reveal';
import { WhatsAppGlyph } from '@/components/ui/WhatsAppFloat';

const quickLinks = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about' },
  { label: 'Solutions', href: '/solutions' },
  { label: 'Products', href: '/products' },
  { label: 'Projects', href: '/projects' },
  { label: 'Industries', href: '/industries' },
  { label: 'Contact', href: '/contact' },
];

const socials = [
  { label: 'Facebook', href: site.socials.facebook, icon: Facebook },
  { label: 'Instagram', href: site.socials.instagram, icon: Instagram },
  { label: 'LinkedIn', href: site.socials.linkedin, icon: Linkedin },
  { label: 'X', href: site.socials.twitter, icon: Twitter },
];

const headingClass = 'label text-aqua/70';
const linkClass =
  'group inline-flex items-center gap-2 text-[0.92rem] text-steel transition-colors duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:text-aqua';

/**
 * Document closer: identity, sitemap, catalogue, contact facts and one last water pass.
 * A server component — the only motion here is CSS, so it costs no client JavaScript.
 */
export function SiteFooter() {
  // Computed at render so the year never needs a manual edit.
  const year = new Date().getFullYear();

  return (
    <footer role="contentinfo" className="relative isolate overflow-hidden bg-abyss text-ice">
      <div className="hairline-water w-full" aria-hidden="true" />

      <div className="shell relative py-20 md:py-24">
        <div className="grid gap-14 md:grid-cols-2 lg:grid-cols-12 lg:gap-10">
          {/* ------------------------------------------------------------- 01 identity */}
          <Reveal className="lg:col-span-4" amount={0.2}>
            <Logo tone="light" />

            <p className="display-sm mt-7 max-w-[24ch] text-gradient-water">
              {site.tagline}
            </p>

            <p className="mt-6 max-w-[46ch] text-[0.95rem] leading-[1.75] text-steel">
              A2Care India (INC) has been engineering water treatment for industry from its
              Rudrapur, Uttarakhand base since {site.establishedYear}, serving clients across
              India. Its work runs from industrial and commercial RO plants through ETP and STP
              systems, chemical dosing, rainwater harvesting and industrial water chillers.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-2.5">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${site.name} on ${social.label}`}
                  className="grid h-10 w-10 place-items-center rounded-pill border border-hairline-dark text-steel transition-colors duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-aqua/50 hover:text-aqua"
                >
                  <social.icon className="h-[17px] w-[17px]" aria-hidden="true" />
                </a>
              ))}

              <a
                href={whatsappHref()}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${site.name} on WhatsApp`}
                className="grid h-10 w-10 place-items-center rounded-pill border border-hairline-dark text-steel transition-colors duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-aqua/50 hover:text-aqua"
              >
                <WhatsAppGlyph className="h-[17px] w-[17px]" />
              </a>
            </div>
          </Reveal>

          {/* -------------------------------------------------------- 02 quick links */}
          <Reveal className="lg:col-span-2" delay={0.08} amount={0.2}>
            <h2 className={headingClass}>Quick Links</h2>
            <ul className="mt-6 flex flex-col gap-3.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={linkClass}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>

          {/* -------------------------------------------------------- 03 our solutions */}
          <Reveal className="lg:col-span-3" delay={0.14} amount={0.2}>
            <h2 className={headingClass}>Our Solutions</h2>
            <ul className="mt-6 flex flex-col gap-3.5">
              {products.map((product) => (
                <li key={product.slug}>
                  <Link
                    href={`/products/${product.slug}`}
                    className={cn(linkClass, 'max-w-[30ch]')}
                  >
                    {product.name}
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>

          {/* ----------------------------------------------------------- 04 contact */}
          <Reveal className="lg:col-span-3" delay={0.2} amount={0.2}>
            <h2 className={headingClass}>Contact Information</h2>

            <address className="mt-6 flex flex-col gap-5 text-[0.92rem] not-italic text-steel">
              <div className="flex gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-aqua" aria-hidden="true" />
                <div className="leading-[1.7]">
                  <p>{site.address.line1}</p>
                  <p>{site.address.line2}</p>
                  <p>
                    {site.address.state}, {site.address.country} - {site.address.postalCode}
                  </p>
                  <a
                    href={mapsHref()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-1.5 font-display text-[0.85rem] text-aqua transition-colors duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:text-electric"
                  >
                    Get directions
                    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                </div>
              </div>

              <div className="flex gap-3">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-aqua" aria-hidden="true" />
                <div className="flex flex-col gap-1.5 font-mono text-[0.88rem]">
                  {site.phones.map((phone) => (
                    <a key={phone} href={telHref(phone)} className={cn(linkClass, 'font-mono')}>
                      {phone}
                    </a>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-aqua" aria-hidden="true" />
                <a href={mailHref()} className={linkClass}>
                  {site.email}
                </a>
              </div>

              <div className="flex gap-3">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-aqua" aria-hidden="true" />
                <div className="leading-[1.7]">
                  <p>
                    {site.hours.days}: {site.hours.time}
                  </p>
                  <p className="text-steel/70">{site.hours.closed}: Closed</p>
                </div>
              </div>
            </address>
          </Reveal>
        </div>

        {/* -------------------------------------------------------- bottom bar */}
        <div className="hairline-water mt-16 w-full opacity-60" aria-hidden="true" />

        <div className="mt-8 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <p className="text-[0.85rem] text-steel/85">
            © {year} {site.legalName}. All rights reserved.
          </p>

          <nav aria-label="Legal" className="flex items-center gap-6">
            <Link
              href="/privacy-policy"
              className="text-[0.85rem] text-steel transition-colors duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:text-aqua"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-[0.85rem] text-steel transition-colors duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:text-aqua"
            >
              Terms &amp; Conditions
            </Link>
          </nav>

          <p className="label max-w-[34ch] text-steel/65">
            Manufactured in Rudrapur — installed across India
          </p>
        </div>
      </div>

      {/* ---------------------------------------------------- closing water transition */}
      <div className="relative h-20 w-full overflow-hidden md:h-24" aria-hidden="true">
        <div className="water-sheen absolute inset-0 opacity-70" />

        <svg
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
          className="absolute inset-x-0 bottom-0 h-full w-full [animation:drift_11s_ease-in-out_infinite]"
        >
          <path
            d="M0 66C180 30 360 96 540 78C720 60 900 12 1080 36C1260 60 1350 90 1440 74V120H0Z"
            fill="var(--color-midnight)"
            opacity="0.5"
          />
        </svg>

        <svg
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
          className="absolute inset-x-0 bottom-0 h-full w-full [animation:drift_8s_ease-in-out_infinite]"
        >
          <path
            d="M0 84C210 54 420 104 630 88C840 72 1050 34 1260 58C1350 68 1410 82 1440 78V120H0Z"
            fill="var(--color-navy)"
          />
        </svg>

        <div className="hairline-water absolute inset-x-0 bottom-6 opacity-70" />
      </div>
    </footer>
  );
}
