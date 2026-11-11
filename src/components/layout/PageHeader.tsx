import type { ReactNode } from 'react';

/**
 * Inner-page masthead. Deliberately quieter than the home hero: one h1, the section's
 * own framing, and the same water-sheen/grid language so inner pages read as part of
 * the same site rather than as bolted-on templates.
 */
export function PageHeader({
  eyebrow,
  title,
  lead,
  aside,
}: {
  eyebrow: ReactNode;
  title: ReactNode;
  lead?: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <header className="relative overflow-hidden bg-navy pt-36 pb-20 md:pt-44 md:pb-28">
      <div className="absolute inset-0 water-sheen" aria-hidden="true" />
      <div
        className="absolute inset-0 opacity-40 [mask-image:radial-gradient(75%_65%_at_25%_30%,#000,transparent_72%)] grid-lines"
        aria-hidden="true"
      />
      <div className="shell relative">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div className="flex flex-col gap-6">
            <div className="label flex items-center gap-3 text-aqua">
              <span className="h-px w-8 bg-aqua/45" />
              {eyebrow}
            </div>
            <h1 className="display-xl max-w-[20ch] text-ice">{title}</h1>
            {lead ? <p className="max-w-[60ch] text-[1.05rem] leading-[1.7] text-steel">{lead}</p> : null}
          </div>
          {aside ? <div className="lg:pb-2">{aside}</div> : null}
        </div>
      </div>
      <div className="hairline-water absolute inset-x-0 bottom-0" aria-hidden="true" />
    </header>
  );
}
