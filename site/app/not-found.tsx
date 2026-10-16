import Link from 'next/link';
import { SiteFooter } from '@/components/site/site-footer';
import { SiteHeader } from '@/components/site/site-header';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex flex-1 items-center justify-center px-5 py-24">
        <div className="w-full max-w-xl text-center">
          <p className="section-label justify-center">404: not found</p>
          <h1 className="display mt-6 text-4xl sm:text-5xl">This page never made it past review.</h1>
          <p className="mx-auto mt-5 max-w-md text-[15px] leading-relaxed text-fg-soft">
            The page you asked for does not exist. In Pocketto terms: the request was rejected before implementation.
            No artifacts were written.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href="/" className="btn btn-primary">
              Back to the homepage
            </Link>
            <Link href="/docs" className="btn btn-outline">
              Documentation
            </Link>
          </div>
          <div className="mt-10 rounded-lg border border-line bg-bg-raised p-5 text-left">
            <p className="text-[11px] uppercase tracking-[0.1em] text-fg-faint">Looking for something specific?</p>
            <ul className="mt-3 grid gap-2 text-sm text-fg-soft sm:grid-cols-2">
              <li>
                <Link href="/docs/getting-started/quickstart" className="link-underline">
                  Quickstart
                </Link>
              </li>
              <li>
                <Link href="/docs/pipeline" className="link-underline">
                  Pipeline overview
                </Link>
              </li>
              <li>
                <Link href="/docs/skills" className="link-underline">
                  Standalone skills
                </Link>
              </li>
              <li>
                <Link href="/docs/reference/cli" className="link-underline">
                  CLI reference
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
