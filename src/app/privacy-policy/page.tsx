import type { Metadata } from 'next';
import Link from 'next/link';
import { buildMetadata } from '@/lib/seo';
import { PageHeader } from '@/components/layout/PageHeader';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  ...buildMetadata({
    title: 'Privacy Policy',
    description:
      'How A2Care India collects, stores and uses the information submitted through the project enquiry form on its website, and how to request its removal.',
    path: '/privacy-policy',
  }),
  robots: { index: true, follow: true },
};

/** Authored, not `new Date()` — the page is prerendered, so a build-time clock would restamp the policy on every deploy. */
const POLICY_UPDATED = '5 November 2026';

const sections: { heading: string; body: string[] }[] = [
  {
    heading: 'What we collect',
    body: [
      'When you submit the project enquiry form we collect exactly what you type into it: your name, company name, phone number, email address, city or state, industry, the solution and plant capacity you indicated, and your message describing the requirement.',
      'We do not ask for, and you should not send, information we do not need for an engineering discussion — no financial details, no identity documents.',
    ],
  },
  {
    heading: 'Why we collect it',
    body: [
      'Enquiries are used for one purpose: to respond to your request and prepare an engineering quotation. The details you give determine the capacity, pre-treatment and site constraints we need to price.',
      'We do not sell enquiry data, share it with advertisers, or use it for marketing lists.',
    ],
  },
  {
    heading: 'How it is stored',
    body: [
      'Submissions are recorded on the web server that hosts this site so the team can act on them, and are handled as confidential business correspondence.',
      'The form is protected against automated abuse by a hidden field that human visitors never fill in and a per-IP rate limit. We do not run a visible captcha.',
      'If you contact us by phone, WhatsApp or email instead, that conversation is held in the account or device you used to reach us, under that provider’s own terms.',
    ],
  },
  {
    heading: 'Third-party embeds',
    body: [
      'The contact section embeds Google Maps to show the Rudrapur address. Loading that map sets cookies under Google’s own privacy policy, which we do not control. If you prefer, the same location is available through the “Open in Google Maps” link, which only loads once you choose to use it.',
    ],
  },
  {
    heading: 'Retention',
    body: [
      'Enquiry records are kept while the discussion is open and afterwards as business correspondence for as long as they remain relevant — for example while a warranty or maintenance contract runs. Records with no ongoing relationship are deleted on request.',
    ],
  },
  {
    heading: 'Your rights',
    body: [
      'You can ask us what we hold about you, correct it, or have it deleted. Write to ' +
        site.email +
        ' or call ' +
        site.phones[0] +
        ' and quote the approximate date of your enquiry.',
      'For applicable law in India, including the Digital Personal Data Protection Act, 2023, the same contact routes apply. We respond as a data fiduciary to any lawful request.',
    ],
  },
  {
    heading: 'Security',
    body: [
      'The site is served over HTTPS. Enquiry contents are never printed to application logs, and the submission endpoint does not email a copy to any address other than the company inbox used to answer it.',
      'No transmission over the internet is completely secure, so please avoid including sensitive information you would not want repeated back to you.',
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <>
      <PageHeader
        eyebrow="Legal"
        title="Privacy Policy"
        lead={`How A2Care India handles the information you send through this website. Last updated ${POLICY_UPDATED}.`}
      />

      <section className="shell max-w-[74ch] py-20 md:py-28">
        <div className="flex flex-col gap-14">
          {sections.map((section) => (
            <article key={section.heading}>
              <h2 className="display-sm text-ice">{section.heading}</h2>
              <div className="mt-4 flex flex-col gap-4 text-[1rem] leading-[1.75] text-steel">
                {section.body.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </article>
          ))}

          <div className="border-t border-hairline-dark pt-10">
            <p className="text-[1rem] leading-[1.75] text-steel">
              Questions about this policy, or a request about your data:{' '}
              <Link href={`/contact`} className="text-aqua underline decoration-aqua/40 underline-offset-4 hover:decoration-aqua">
                contact the team
              </Link>
              {' or write to '}
              <a href={`mailto:${site.email}`} className="text-aqua underline decoration-aqua/40 underline-offset-4 hover:decoration-aqua">
                {site.email}
              </a>
              .
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
