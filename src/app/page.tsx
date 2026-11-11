import type { Metadata } from 'next';
import { site } from '@/lib/site';
import { faqs } from '@/data/faqs';
import { products } from '@/data/products';
import { buildMetadata, faqSchema, serviceSchema } from '@/lib/seo';
import { JsonLd } from '@/components/layout/JsonLd';
import { Hero } from '@/components/sections/Hero';
import { WaterStory } from '@/components/sections/WaterStory';
import { TreatmentExplorer } from '@/components/sections/TreatmentExplorer';
import { CompanyIntro } from '@/components/sections/CompanyIntro';
import { Solutions } from '@/components/sections/Solutions';
import { Industries } from '@/components/sections/Industries';
import { ProjectsShowcase } from '@/components/sections/ProjectsShowcase';
import { TrustBand } from '@/components/sections/TrustBand';
import { WhyChoose } from '@/components/sections/WhyChoose';
import { ProcessTimeline } from '@/components/sections/ProcessTimeline';
import { Sustainability } from '@/components/sections/Sustainability';
import { Testimonials } from '@/components/sections/Testimonials';
import { FaqSection } from '@/components/sections/FaqSection';
import { CtaBand } from '@/components/sections/CtaBand';
import { ContactSection } from '@/components/sections/ContactSection';

export const metadata: Metadata = {
  ...buildMetadata({
    title: `${site.name} — Industrial Water Treatment Solutions in India`,
    description:
      'A2Care India engineers, manufactures, installs and maintains industrial RO plants from 100 to 50,000 LPH, ETP and STP plants, chemical dosing systems and industrial chillers from 5 to 100 TR, for clients across India.',
    path: '/',
  }),
};

export default function HomePage() {
  return (
    <>
      <JsonLd
        data={[
          faqSchema(faqs.map(({ question, answer }) => ({ question, answer }))),
          ...products.map((product) =>
            serviceSchema(product.name, product.description, `/products/${product.slug}`),
          ),
        ]}
      />

      {/* 02 — Cinematic hero */}
      <Hero />

      {/* 03 — Scroll-driven raw water to pure water */}
      <WaterStory />

      {/* Optional A — interactive treatment explorer, immediately after the story */}
      <TreatmentExplorer />

      {/* 04 — Company introduction */}
      <CompanyIntro />

      {/* 05 — Solutions portfolio */}
      <Solutions />

      {/* 06 — Industries served */}
      <Industries />

      {/* 07 — Project portfolio with filtering */}
      <ProjectsShowcase />

      {/* 08 — Trusted by */}
      <TrustBand />

      {/* 09 — Why choose A2Care */}
      <WhyChoose />

      {/* 10 — Process timeline */}
      <ProcessTimeline />

      {/* 11 — Sustainability */}
      <Sustainability />

      {/* 12 — Testimonials */}
      <Testimonials />

      {/* 13 — FAQ */}
      <FaqSection />

      {/* 14 — Closing call to action */}
      <CtaBand />

      {/* 15 — Contact and project enquiry */}
      <ContactSection />
    </>
  );
}
