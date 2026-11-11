import type { Metadata } from 'next';
import { site } from '@/lib/site';
import { faqs } from '@/data/faqs';
import { buildMetadata, faqSchema } from '@/lib/seo';
import { PageHeader } from '@/components/layout/PageHeader';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { JsonLd } from '@/components/layout/JsonLd';
import { ContactSection } from '@/components/sections/ContactSection';
import { CapacityTool } from '@/components/sections/CapacityTool';
import { FaqSection } from '@/components/sections/FaqSection';
import { Section, SectionHeading } from '@/components/ui/Section';
import { Cta, ArrowRight } from '@/components/ui/Cta';
import { whatsappHref } from '@/lib/site';
import { MessageCircle } from 'lucide-react';

export const metadata: Metadata = {
  ...buildMetadata({
    title: 'Contact A2Care India | Request a Water Treatment Quote',
    description:
      'Request a consultation or project quotation from A2Care India, Rudrapur. Call +91-9336432885 or +91-7017572336, message on WhatsApp, or send your water treatment requirement through the project enquiry form.',
    path: '/contact',
    keywords: [
      'water treatment company contact Rudrapur',
      'industrial RO plant quote India',
      'ETP STP enquiry Uttarakhand',
    ],
  }),
};

export default function ContactPage() {
  return (
    <>
      <JsonLd data={[faqSchema(faqs.map(({ question, answer }) => ({ question, answer })))]} />

      <PageHeader
        eyebrow="Contact & project enquiry"
        title={
          <>
            Let’s engineer your
            <br />
            next water solution.
          </>
        }
        lead="Tell us about your water treatment requirements. Our team will help you find the right engineering solution — a raw water report with the enquiry makes the response faster."
        aside={
          <div className="glass-dark flex flex-col gap-4 rounded-panel px-6 py-5">
            <div className="label text-steel">Direct lines</div>
            {site.phones.map((phone) => (
              <a
                key={phone}
                href={`tel:${phone.replace(/[^+\d]/g, '')}`}
                className="display-sm text-ice transition-colors hover:text-aqua"
              >
                {phone}
              </a>
            ))}
            <div className="label pt-1 text-steel">{site.hours.days} · {site.hours.time}</div>
          </div>
        }
      />

      <Breadcrumbs items={[{ name: 'Contact', path: '/contact' }]} />

      {/* ------------------------------------ Structured enquiry assistant */}
      <Section tone="deeper" className="pt-12 pb-4">
        <div className="shell flex flex-col gap-10">
          <SectionHeading
            index="01"
            eyebrow="Before you write"
            lines={['Four answers,', 'one structured enquiry.']}
            lead="Use the assistant to set out plant type, capacity, application and location. It assembles what you select into a clear brief and passes it straight into the enquiry form — it does not recommend a configuration, because that depends on a water analysis."
          />
          <CapacityTool />
        </div>
      </Section>

      {/* --------------------------------------------------- The form */}
      <ContactSection />

      {/* ------------------------------------------------------- FAQs */}
      <FaqSection />

      <Section tone="dark" className="py-14 md:py-18">
        <div className="shell flex flex-wrap items-center justify-between gap-6 border-t border-hairline-dark pt-10">
          <p className="max-w-[52ch] text-[0.98rem] leading-[1.65] text-steel">
            Prefer to talk it through? The Rudrapur team answers on both lines during
            business hours, and WhatsApp is the quickest way to share a water report.
          </p>
          <div className="flex flex-wrap gap-3">
            <Cta href={whatsappHref()} tone="aqua" icon={<MessageCircle className="h-4 w-4" />}>
              Message on WhatsApp
            </Cta>
            <Cta href="/projects" tone="outlineDark" icon={<ArrowRight />}>
              See installed work
            </Cta>
          </div>
        </div>
      </Section>
    </>
  );
}
