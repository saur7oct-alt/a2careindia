import type { ReactNode } from 'react';
import Link from 'next/link';
import {
  ArrowUpRight,
  Clock,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/cn';
import { Section, SectionHeading, WaterLine } from '@/components/ui/Section';
import { Cta } from '@/components/ui/Cta';
import { Reveal, Stagger, StaggerItem } from '@/components/motion/Reveal';
import { EnquiryForm } from '@/components/forms/EnquiryForm';
import { mailHref, mapsHref, site, telHref, whatsappHref } from '@/lib/site';

/**
 * SECTION 15 — Contact.
 *
 * Light section, dark inset panel holding the human details, glass-light enquiry card on the
 * right. The split reads like a datasheet — published facts on one side, a form that actually
 * posts on the other — instead of a default contact block.
 *
 * Server component: the only interactivity is `EnquiryForm`, which owns its own client
 * boundary and posts to `/api/enquiry`.
 */
export function ContactSection({ className }: { className?: string }) {
  return (
    <Section
      id="contact"
      tone="light"
      labelledBy="contact-heading"
      className={cn('overflow-hidden', className)}
    >
      {/* Faded engineering grid behind the left column, never under the form fields. */}
      <div
        aria-hidden="true"
        className="grid-lines pointer-events-none absolute inset-0 opacity-70 [mask-image:radial-gradient(70%_55%_at_18%_12%,#000_10%,transparent_78%)]"
      />

      <div className="shell relative">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:items-start lg:gap-16">
          {/* ------------------------------------------------------------- Left: details */}
          <div className="flex flex-col gap-10">
            <SectionHeading
              id="contact-heading"
              tone="light"
              index="15"
              eyebrow="Contact"
              lines={['Send the requirement.', 'Get an engineering answer.']}
              lead="Every project starts from the same two facts: what the water has to do, and what is coming out of the ground today. Put both in the form — it posts to this site's own enquiry endpoint — or use the published channels below."
            />

            {/* Dark inset panel: the company's real-world coordinates. */}
            <Reveal className="relative overflow-hidden rounded-panel bg-navy text-ice">
              <div aria-hidden="true" className="grid-lines absolute inset-0 opacity-60" />
              <div aria-hidden="true" className="water-sheen absolute inset-0" />

              <div className="relative p-7 sm:p-9">
                <Stagger className="flex flex-col gap-7" stagger={0.07}>
                  <DetailRow
                    icon={MapPin}
                    label="Office & works"
                    body={
                      <address className="not-italic leading-[1.6]">
                        {site.address.line1}
                        <br />
                        {site.address.line2}, {site.address.state}, {site.address.country}
                        <br />
                        <span className="font-mono text-[0.88rem] text-aqua/85">
                          {site.address.postalCode}
                        </span>
                      </address>
                    }
                  />

                  <DetailRow
                    icon={Phone}
                    label="Phone"
                    body={
                      <>
                        {site.phones.map((phone) => (
                          <a
                            key={phone}
                            href={telHref(phone)}
                            className="w-fit font-mono text-[1.02rem] tracking-[0.02em] text-ice transition-colors duration-300 hover:text-aqua"
                          >
                            {phone}
                          </a>
                        ))}
                      </>
                    }
                  />

                  <DetailRow
                    icon={Mail}
                    label="Email"
                    body={
                      <a
                        href={mailHref('Project enquiry — A2Care India')}
                        className="w-fit break-words font-mono text-[1.02rem] text-ice transition-colors duration-300 hover:text-aqua"
                      >
                        {site.email}
                      </a>
                    }
                  />

                  <DetailRow
                    icon={MessageCircle}
                    label="WhatsApp"
                    body={
                      <>
                        <a
                          href={whatsappHref()}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-fit text-[1.02rem] text-ice transition-colors duration-300 hover:text-aqua"
                        >
                          Message A2Care India
                        </a>
                        <span className="mt-1 block max-w-[42ch] text-[0.84rem] leading-[1.5] text-ice/60">
                          Opens with a first line already typed in, so the team knows it came from
                          this page.
                        </span>
                      </>
                    }
                  />

                  <DetailRow
                    icon={Clock}
                    label="Business hours"
                    body={
                      <>
                        <span className="text-[1.02rem]">
                          {site.hours.days}, {site.hours.time}
                        </span>
                        <span className="mt-1 block max-w-[46ch] text-[0.86rem] leading-[1.5] text-ice/60">
                          {site.hours.closed} closed. The form accepts submissions any time; replies
                          happen during the hours above.
                        </span>
                      </>
                    }
                  />
                </Stagger>

                <WaterLine className="my-7" />

                <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
                  <Cta
                    href={mapsHref()}
                    tone="outlineDark"
                    magnetic={false}
                    className="px-5 py-2.5 text-[0.85rem]"
                    icon={<ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />}
                  >
                    Open in Google Maps
                  </Cta>
                  <p className="max-w-[34ch] text-[0.82rem] leading-[1.5] text-ice/55">
                    {site.address.full}
                  </p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.08} className="relative overflow-hidden rounded-panel border border-hairline-light">
              <MapPanel />
            </Reveal>
          </div>

          {/* ------------------------------------------------------------ Right: the form */}
          <div className="flex flex-col gap-6">
            <Reveal delay={0.12} y={18}>
              <EnquiryForm />
            </Reveal>

            <Reveal delay={0.2} y={14}>
              <p className="max-w-[64ch] text-[0.86rem] leading-[1.6] text-navy/60">
                Prefer to talk it through first?{' '}
                <a
                  href={telHref(site.phones[0])}
                  className="text-electric underline decoration-electric/35 underline-offset-2 transition-colors hover:decoration-electric"
                >
                  {site.phones[0]}
                </a>{' '}
                reaches the Rudrapur office during business hours. Published ranges are on the{' '}
                <Link
                  href="/products"
                  className="text-navy/75 underline decoration-navy/25 underline-offset-2 transition-colors hover:text-navy"
                >
                  products page
                </Link>
                , and the{' '}
                <Link
                  href="/solutions"
                  className="text-navy/75 underline decoration-navy/25 underline-offset-2 transition-colors hover:text-navy"
                >
                  solutions overview
                </Link>{' '}
                explains how each duty is approached.
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------ *
 * Blocks
 * ------------------------------------------------------------------ */

function DetailRow({
  icon: Icon,
  label,
  body,
}: {
  icon: LucideIcon;
  label: string;
  body: ReactNode;
}) {
  return (
    <StaggerItem>
      <div className="flex gap-4 sm:gap-5">
        <span
          aria-hidden="true"
          className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full border border-aqua/25 bg-aqua/[0.08] text-aqua"
        >
          <Icon className="h-4 w-4" strokeWidth={1.6} />
        </span>
        <div className="flex min-w-0 flex-col gap-1.5">
          <div className="label text-steel">{label}</div>
          <div className="flex flex-col gap-0.5 text-ice">{body}</div>
        </div>
      </div>
    </StaggerItem>
  );
}

/**
 * Weight note, and it is a real one: a Google Maps embed pulls in tiles, scripts and fonts
 * this page does not control — on a marketing page that is a genuine cost. So the iframe is
 * `loading="lazy"` (the browser holds the request back until the frame is near the viewport),
 * it sits at the bottom of the details column instead of above the fold, and the panel works
 * without it: the full postal address, both phone numbers and the "Open in Google Maps" link
 * are all rendered as plain HTML above. Keep it lazy, and do not add priority loading here.
 */
function MapPanel() {
  return (
    <figure className="bg-navy">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-hairline-dark px-5 py-4">
        <figcaption className="label text-aqua">
          {site.name} — {site.address.line2}, {site.address.state}
        </figcaption>
        <a
          href={mapsHref()}
          target="_blank"
          rel="noopener noreferrer"
          className="label inline-flex items-center gap-1.5 text-ice/70 transition-colors duration-300 hover:text-aqua"
        >
          Open in Google Maps
          <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
        </a>
      </div>

      <div className="aspect-[4/3] w-full sm:aspect-[16/10]">
        <iframe
          src={site.address.mapsEmbed}
          title={`Map showing ${site.name} at ${site.address.full}`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="h-full w-full border-0"
        />
      </div>
    </figure>
  );
}
