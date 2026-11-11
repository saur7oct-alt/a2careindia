import type { Metadata } from 'next';
import Link from 'next/link';
import { buildMetadata } from '@/lib/seo';
import { PageHeader } from '@/components/layout/PageHeader';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  ...buildMetadata({
    title: 'Terms & Conditions',
    description:
      'Terms governing use of the A2Care India website, the nature of quotations and engineering proposals, and the limits of information published online.',
    path: '/terms',
  }),
  robots: { index: true, follow: true },
};

const clauses: { heading: string; body: string[] }[] = [
  {
    heading: 'About this website',
    body: [
      'This website is published by ' + site.legalName + ', a water treatment solutions provider and plant manufacturer based at ' + site.address.full + '.',
      'Information here describes the company’s capability. It is not a contractual offer. Any binding commitment arises only from a written quotation or purchase order that the company issues and both parties accept.',
    ],
  },
  {
    heading: 'Quotations and engineering proposals',
    body: [
      'Capacity figures, ranges and configuration options shown on the site describe what the company builds — for example industrial RO from 100 LPH to 50,000 LPH and chillers from 5 TR to 100 TR. They are not a guarantee that a particular arrangement suits a particular site.',
      'A system is specified against a raw water analysis and the measured duty. Until that analysis exists, anything discussed online is indicative. Where the site states that a detail is confirmed with the quotation, that is deliberate rather than evasive.',
      'Proposals are valid for the period stated on the document itself.',
    ],
  },
  {
    heading: 'Project references and imagery',
    body: [
      'Project pages describe installations the company has carried out. Client names are shown where the company has published them, and site-specific narrative on case-study pages is provided for confirmation by the client before it is treated as final.',
      'Some visual slots on this site currently show designed technical artwork rather than site photography, because the company’s own images are still being assembled. Stand-in artwork is never presented as a photograph of an A2Care installation, and the media manifest records which slots hold genuine assets.',
      'Client and institution names appear with the context in which they were originally published. Logo use requires written authorisation from each organisation and is not implied by their mention here.',
    ],
  },
  {
    heading: 'Use of the site',
    body: [
      'You may read, print and share this material for the purpose of evaluating the company’s services. Republishing it commercially, scraping it, or presenting it as your own requires written permission.',
      'Do not use the enquiry form to submit unlawful content, another person’s personal data without their knowledge, or automated submissions. The form is monitored for abuse and rate-limited.',
    ],
  },
  {
    heading: 'Intellectual property',
    body: [
      'The A2Care name, the wordmark and original text and drawings on this site belong to the company. Third-party names, product designations and standards referenced here remain the property of their respective owners and are used descriptively.',
    ],
  },
  {
    heading: 'Limits of liability',
    body: [
      'The site is provided as it is. The company takes care to keep it accurate but does not warrant that every page is current, and technical particulars should always be confirmed against the issued quotation and drawings.',
      'To the extent permitted by law, the company is not liable for losses arising from reliance on website text in place of a written engineering proposal.',
    ],
  },
  {
    heading: 'Governing law',
    body: [
      'These terms and any enquiry or dispute arising from this website are governed by the laws of India, with courts at Rudrapur, Uttarakhand having jurisdiction, unless the applicable contract states otherwise.',
    ],
  },
  {
    heading: 'Changes',
    body: [
      'The company may revise these terms. The version published here is the one that applies to use of the site at the time you visit.',
    ],
  },
];

export default function TermsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Legal"
        title="Terms & Conditions"
        lead="The basis on which A2Care India publishes this website and responds to enquiries made through it."
      />

      <section className="shell max-w-[74ch] py-20 md:py-28">
        <div className="flex flex-col gap-14">
          {clauses.map((clause, index) => (
            <article key={clause.heading}>
              <h2 className="display-sm text-ice">
                <span className="label mr-3 align-middle text-steel">{String(index + 1).padStart(2, '0')}</span>
                {clause.heading}
              </h2>
              <div className="mt-4 flex flex-col gap-4 text-[1rem] leading-[1.75] text-steel">
                {clause.body.map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </article>
          ))}

          <div className="border-t border-hairline-dark pt-10 text-[1rem] leading-[1.75] text-steel">
            Questions on these terms:{' '}
            <Link href="/contact" className="text-aqua underline decoration-aqua/40 underline-offset-4 hover:decoration-aqua">
              contact the team
            </Link>{' '}
            or write to{' '}
            <a href={`mailto:${site.email}`} className="text-aqua underline decoration-aqua/40 underline-offset-4 hover:decoration-aqua">
              {site.email}
            </a>
            .
          </div>
        </div>
      </section>
    </>
  );
}
