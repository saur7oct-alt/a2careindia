'use client';

import { faqs } from '@/data/faqs';
import { Accordion } from '@/components/ui/Accordion';
import { Section, SectionHeading } from '@/components/ui/Section';
import { Cta, ArrowRight } from '@/components/ui/Cta';
import { Reveal } from '@/components/motion/Reveal';

// Public view shows the written questions and answers as published; the internal
// `awaitingCompanyInput` flag never reaches the page.
const accordionItems = faqs.map((faq) => ({ question: faq.question, answer: faq.answer }));

/**
 * Section 13 — pre-design FAQ.
 * Heading and a "talk to the team" prompt hold the left column (sticky on desktop),
 * the accordion takes the right.
 */
export function FaqSection() {
  return (
    <Section id="faq" tone="light" labelledBy="faq-heading">
      <div className="shell grid gap-14 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] md:gap-20">
        {/* ------------------------------------------------- Left column */}
        <div className="md:sticky md:top-32 md:self-start">
          <SectionHeading
            id="faq-heading"
            index="13"
            eyebrow="FAQ"
            tone="light"
            lines={['Questions we are asked', 'before a plant is designed.']}
            lead="Capacity ranges, installation coverage, maintenance and norms — the questions that shape a treatment train before anything is quoted."
          />

          <Reveal className="mt-10 rounded-panel border border-hairline-light bg-white/60 p-7" y={18} amount={0.3}>
            <p className="text-[0.98rem] leading-[1.7] text-navy/70">
              Your question depends on your feed water and your duty. The engineering
              team answers that directly — send the raw water report and the required
              capacity, and the response comes back with the design thinking behind it.
            </p>
            <Cta
              href="/contact"
              tone="solidLight"
              icon={<ArrowRight />}
              className="mt-6"
              ariaLabel="Talk to the A2Care engineering team"
            >
              Talk to the team
            </Cta>
          </Reveal>
        </div>

        {/* ------------------------------------------------- Right column */}
        <div>
          <Accordion items={accordionItems} tone="light" defaultOpen={0} />
        </div>
      </div>
    </Section>
  );
}
