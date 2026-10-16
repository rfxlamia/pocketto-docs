import Link from 'next/link';
import { PocketMark } from './pocket-mark';
import { POCKETTO, SITE } from '@/lib/site';

const columns = [
  {
    title: 'Documentation',
    links: [
      { text: 'Introduction', url: '/docs' },
      { text: 'Quickstart', url: '/docs/getting-started/quickstart' },
      { text: 'Pipeline overview', url: '/docs/pipeline' },
      { text: 'CLI reference', url: '/docs/reference/cli' },
    ],
  },
  {
    title: 'Product',
    links: [
      { text: 'Why Pocketto', url: '/#why' },
      { text: 'Standalone skills', url: '/docs/skills' },
      { text: 'Pocket Education', url: '/docs/skills/pocket-education' },
      { text: 'Pocket Enterprise', url: '/docs/core-enterprise' },
    ],
  },
  {
    title: 'Project',
    links: [
      { text: 'GitHub repository', url: SITE.repo },
      { text: 'Changelog', url: `${SITE.repo}/blob/main/CHANGELOG.md` },
      { text: 'npm: pocketto-pi', url: `https://www.npmjs.com/package/${SITE.npmPackage}` },
      { text: 'Contributing', url: '/docs/contributing' },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto max-w-6xl px-5 py-14">
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <div className="flex items-center gap-2.5">
              <PocketMark className="size-[22px]" />
              <span className="font-display text-[17px] font-semibold tracking-tight">Pocketto</span>
            </div>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-fg-soft">
              Structured AI coding workflows for Claude Code and Pi. AI writes the code — Pocketto makes the process
              accountable.
            </p>
            <p className="mt-4 font-mono text-xs text-fg-faint">
              MIT License ©{' '}
              <a href={SITE.repo} target="_blank" rel="noreferrer noopener" className="link-underline">
                {SITE.repoOwner}
              </a>
            </p>
          </div>
          {columns.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h3 className="font-mono text-xs uppercase tracking-[0.12em] text-fg-faint">{col.title}</h3>
              <ul className="mt-3 space-y-2">
                {col.links.map((link) => (
                  <li key={link.url}>
                    {link.url.startsWith('http') ? (
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="text-sm text-fg-soft transition-colors hover:text-fg"
                      >
                        {link.text}
                      </a>
                    ) : (
                      <Link href={link.url} className="text-sm text-fg-soft transition-colors hover:text-fg">
                        {link.text}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <div className="mt-12 flex flex-col gap-2 border-t border-line pt-6 font-mono text-xs text-fg-faint sm:flex-row sm:items-center sm:justify-between">
          <span>
            Documenting {SITE.name} v{POCKETTO.version} — inspected at commit{' '}
            <a
              href={`${SITE.repo}/commit/${POCKETTO.inspectedCommit}`}
              target="_blank"
              rel="noreferrer noopener"
              className="link-underline"
            >
              {POCKETTO.inspectedCommit.slice(0, 7)}
            </a>
          </span>
          <span>
            Local-first Core · optional Enterprise · opt-in Education · {POCKETTO.skills.total} skills
          </span>
        </div>
      </div>
    </footer>
  );
}
