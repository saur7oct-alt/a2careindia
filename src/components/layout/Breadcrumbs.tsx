import Link from 'next/link';
import { Fragment } from 'react';
import { breadcrumbSchema } from '@/lib/seo';
import { JsonLd } from './JsonLd';

export type Crumb = { name: string; path: string };

/**
 * Breadcrumb trail plus its BreadcrumbList schema, kept together so the visible trail and
 * the structured data can never drift apart.
 */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const withHome: Crumb[] = [{ name: 'Home', path: '/' }, ...items];

  return (
    <>
      <JsonLd data={breadcrumbSchema(withHome)} />
      <nav aria-label="Breadcrumb" className="shell pt-6">
        <ol className="label flex flex-wrap items-center gap-2 text-steel">
          {withHome.map((crumb, index) => {
            const last = index === withHome.length - 1;
            return (
              <Fragment key={crumb.path}>
                <li>
                  {last ? (
                    <span aria-current="page" className="text-aqua">
                      {crumb.name}
                    </span>
                  ) : (
                    <Link href={crumb.path} className="transition-colors hover:text-ice">
                      {crumb.name}
                    </Link>
                  )}
                </li>
                {!last ? <li aria-hidden="true">/</li> : null}
              </Fragment>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
