'use client';

import { useMemo } from 'react';
import { Marquee } from '@/components/ui/Marquee';
import { Section, SectionHeading } from '@/components/ui/Section';
import { referencedClients, testimonials, type Testimonial } from '@/data/testimonials';

type WordmarkEntry = {
  name: string;
  context: string;
};

/**
 * Testimonials name organisations as they were stated. Dedupe by organisation so the
 * second marquee track shows each one once, with its project and location as context.
 */
function uniqueOrganisationMarks(items: Testimonial[]): WordmarkEntry[] {
  const seen = new Set<string>();
  const entries: WordmarkEntry[] = [];
  for (const item of items) {
    if (seen.has(item.organisation)) continue;
    seen.add(item.organisation);
    entries.push({ name: item.organisation, context: `${item.project} · ${item.location}` });
  }
  return entries;
}

function WordmarkPanel({ entry }: { entry: WordmarkEntry }) {
  return (
    <div className="group/panel min-w-[15rem] max-w-[24rem] shrink-0 rounded-panel border border-hairline-dark bg-abyss/25 px-7 py-6 transition-colors duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-aqua/45">
      <p className="display-sm text-steel transition-colors duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/panel:text-aqua">
        {entry.name}
      </p>
      <p className="label mt-3 leading-[1.6] text-steel/75 transition-colors duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/panel:text-ice">
        {entry.context}
      </p>
    </div>
  );
}

/**
 * Section 08 — trusted-by band.
 *
 * No client logo files have been supplied or authorised, so nothing here pretends to be
 * a logo: two counter-moving tracks of typographic wordmarks built from the published
 * record (referenced clients and the organisations named in testimonials), with an
 * explicit note that real marks require written authorisation before publication.
 *
 * The band paints its own navy → midnight → ice gradient so it hands off to the light
 * Process section; content sits above the painted layer at z-10.
 */
export function TrustBand() {
  const testimonialMarks = useMemo(() => uniqueOrganisationMarks(testimonials), []);
  const referencedMarks = useMemo<WordmarkEntry[]>(
    () => referencedClients.map((client) => ({ name: client.name, context: client.context })),
    [],
  );

  return (
    <Section id="clients" tone="dark" labelledBy="clients-heading" className="overflow-hidden">
      {/* Dark-to-light transition painted over the tone background (tokens only) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, var(--color-navy) 0%, var(--color-midnight) 34%, var(--color-midnight) 64%, var(--color-ice) 100%)',
        }}
      />

      <div className="shell relative z-10">
        <SectionHeading
          id="clients-heading"
          index="08"
          eyebrow="Clients"
          tone="dark"
          align="center"
          lines={['Trust built through', 'every installation.']}
          lead="Supporting businesses, institutions, and industrial operations with dependable water treatment solutions."
        />

        <div className="mt-16 flex flex-col gap-5">
          <Marquee duration={58} edgeColor="var(--color-midnight)">
            {referencedMarks.map((mark) => (
              <WordmarkPanel key={mark.name} entry={mark} />
            ))}
          </Marquee>

          <Marquee duration={66} reverse edgeColor="var(--color-midnight)">
            {testimonialMarks.map((mark) => (
              <WordmarkPanel key={mark.name} entry={mark} />
            ))}
          </Marquee>
        </div>

        {/* The honest note the brief asks for — editable once authorisations arrive */}
        <div className="mt-16 flex justify-center">
          <p className="max-w-[70ch] rounded-panel border border-hairline-light bg-ice/60 px-7 py-5 text-center text-[0.92rem] leading-relaxed text-navy/70 backdrop-blur-sm">
            These are typographic wordmarks, not logos. Client marks and brand assets are
            published only when supplied with written authorisation from each
            organisation — until then, the names behind these installations stand on
            their own.
          </p>
        </div>
      </div>
    </Section>
  );
}
