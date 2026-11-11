import type { Metadata } from 'next';
import Link from 'next/link';
import { Cta, ArrowRight } from '@/components/ui/Cta';
import { Eyebrow } from '@/components/ui/Section';
import { AssetMotif } from '@/components/ui/AssetMotif';

export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <section className="relative flex min-h-[80svh] items-center overflow-hidden bg-navy py-32">
      <div className="absolute inset-0 water-sheen" aria-hidden="true" />
      <div
        className="absolute inset-0 opacity-30 grid-lines [mask-image:radial-gradient(70%_60%_at_30%_40%,#000,transparent_70%)]"
        aria-hidden="true"
      />

      <div className="shell relative grid gap-14 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-center">
        <div className="flex flex-col gap-7">
          <Eyebrow index="404">Off the treatment line</Eyebrow>

          <h1 className="display-lg text-ice">
            <span className="block">This page is not</span>
            <span className="block text-gradient-water">in the system.</span>
          </h1>

          <p className="max-w-[54ch] text-[1.05rem] leading-[1.7] text-steel">
            The address you followed does not resolve to anything on this site. It may have
            been renamed, or the link may have been cut short. The routes below cover
            everything A2Care publishes.
          </p>

          <div className="flex flex-wrap gap-3 pt-1">
            <Cta href="/solutions" tone="aqua" icon={<ArrowRight />}>
              Explore our solutions
            </Cta>
            <Cta href="/contact" tone="outlineDark">
              Discuss your project
            </Cta>
          </div>

          <nav aria-label="Site sections" className="pt-4">
            <ul className="flex flex-wrap gap-x-7 gap-y-3">
              {[
                { label: 'About', href: '/about' },
                { label: 'Products', href: '/products' },
                { label: 'Projects', href: '/projects' },
                { label: 'Industries', href: '/industries' },
                { label: 'FAQ', href: '/#faq' },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="label text-steel transition-colors hover:text-aqua"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="relative hidden aspect-[4/3] w-full overflow-hidden rounded-panel border border-hairline-dark lg:block">
          <div className="absolute inset-0 bg-[linear-gradient(158deg,#071b2b_0%,#0a263d_50%,#040f19_100%)]" />
          <AssetMotif kind="flow" className="absolute left-1/2 top-1/2 w-[58%] -translate-x-1/2 -translate-y-1/2 text-aqua/40" />
          <span className="label absolute bottom-4 left-4 text-steel">
            Flow path interrupted
          </span>
        </div>
      </div>
    </section>
  );
}
