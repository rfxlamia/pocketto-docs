import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  BookOpen,
  Boxes,
  CheckCircle2,
  CircleDashed,
  FileCheck2,
  FileText,
  GraduationCap,
  HardDrive,
  ListTree,
  ShieldCheck,
  Split,
  Wrench,
} from 'lucide-react';
import { CopyButton } from '@/components/site/copy-button';
import { GithubIcon } from '@/components/site/pocket-mark';
import { InstallTabs } from '@/components/site/install-tabs';
import { PipelineViz } from '@/components/site/pipeline-viz';
import { SiteFooter } from '@/components/site/site-footer';
import { SiteHeader } from '@/components/site/site-header';
import { INSTALL, PIPELINE_STAGES, POCKETTO, SITE } from '@/lib/site';

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <WhySection />
        <PipelineSection />
        <CapabilitiesSection />
        <ChooserSection />
        <InstallSection />
        <FinalCta />
      </main>
      <SiteFooter />
      <JsonLd />
    </div>
  );
}

/* ------------------------------------------------------------------ hero */

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto grid max-w-6xl gap-14 px-5 pb-20 pt-16 sm:pt-24 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10 lg:pb-28">
        <div>
          <h1 className="display text-[2.6rem] leading-[1.04] sm:text-6xl lg:text-[4.2rem]">
            AI writes the code.
            <br />
            Pocketto makes the{' '}
            <span className="relative whitespace-nowrap">
              <em className="not-italic" style={{ color: 'var(--accent)' }}>
                process
              </em>{' '}
              accountable.
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-fg-soft">
            Pocketto adds engineering discipline to Claude Code and Pi: plan before code, delegate with contracts,
            review independently, and close on your word. You go from a rough idea to reviewed, shipped code without the
            agent improvising.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link href="/docs/getting-started/quickstart" className="btn btn-primary">
              Run the quickstart
            </Link>
            <Link href="/docs" className="btn btn-outline">
              <BookOpen className="size-4" aria-hidden />
              Read the docs
            </Link>
            <a
              href={SITE.repo}
              target="_blank"
              rel="noreferrer noopener"
              className="btn btn-ghost"
              aria-label="View Pocketto on GitHub (opens in a new tab)"
            >
              <GithubIcon className="size-4" aria-hidden />
              GitHub
            </a>
          </div>

          <div className="mt-10 max-w-xl">
            <InstallTabs compact />
          </div>
        </div>

        <div className="lg:pt-2">
          <ExecutionLedger />
        </div>
      </div>
    </section>
  );
}

/**
 * Generated illustration of Pocket's durable artifacts (gpt-image-bridge), one per theme.
 * Both <img> render; the `.dark` class toggles which is displayed. Neither is `priority`,
 * so the hidden one is never fetched. Regenerate if the ledger vocabulary changes.
 */
function ExecutionLedger() {
  const img = 'h-auto w-full';
  return (
    <figure aria-label="Illustration of a Pocket execution log">
      <Image
        src="/execution-ledger-light.png"
        alt="Pocket execution log for plan auth refactor, status IN_PROGRESS. phase-1, tasks T1 to T4, REVIEW_PASS, DONE. phase-2, tasks T5 to T7, REVIEW_PASS, REVIEW. phase-3, tasks T8 to T9, no verdict, WAITING. Closing output: phase-2 DONE and closeout.md appended; phase-3 held until pocket-development runs next."
        width={1357}
        height={910}
        sizes="(min-width: 1024px) 520px, 100vw"
        className={`${img} dark:hidden`}
      />
      <Image
        src="/execution-ledger-dark.png"
        alt=""
        aria-hidden
        width={1513}
        height={1139}
        sizes="(min-width: 1024px) 520px, 100vw"
        className={`${img} hidden dark:block`}
      />
      <figcaption className="sr-only">
        Illustration of phases advancing only after review, not a real run.
      </figcaption>
    </figure>
  );
}

/* ------------------------------------------------------------------ why */

const FAILURE_MODES = [
  {
    problem: 'Implementation before requirements are clear',
    answer:
      'Grinding turns a vague ask into a BDD spec (scope, boundaries, and Given/When/Then acceptance criteria), and an independent edge-case-hunter reviews it before any design is proposed.',
    ref: '/docs/pipeline/grinding',
  },
  {
    problem: 'Ambiguous delegation',
    answer:
      'Every subagent dispatch is a Pocket Packet: objective, references, deliverables, quality bar, stop conditions. Six iron laws enforce it: no packet, no spawn.',
    ref: '/docs/reference/pocket-packets',
  },
  {
    problem: 'Missing or ineffective reviews',
    answer:
      'Review is independent by construction: the implementer reports DONE, a mechanical gate runs, and a read-only auditor subagent judges spec compliance and code quality. The coordinator never grades its own work.',
    ref: '/docs/pipeline/development',
  },
  {
    problem: 'Untraceable decisions',
    answer:
      'Specs, plans, task files, verdicts, and corrections live under docs/pocket/ and log.json, durable and inspectable files you can read months later, not chat scrollback.',
    ref: '/docs/reference/files',
  },
  {
    problem: 'Incomplete phase closeout',
    answer:
      'Closing refuses stale or missing verdicts, advances only passing phases, appends closeout.md, and runs log close only when every phase is DONE, because you explicitly asked for closeout.',
    ref: '/docs/pipeline/closing',
  },
];

function WhySection() {
  return (
    <section id="why" className="border-t border-line">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:py-24">
        <div className="grid gap-4 lg:grid-cols-[1fr_1.1fr] lg:gap-14">
          <h2 className="display text-3xl sm:text-4xl">
            Coding agents are great at writing code and bad at not skipping steps.
          </h2>
          <p className="max-w-prose self-end text-[15px] leading-relaxed text-fg-soft">
            Left unconstrained, an agent starts implementing before the problem is defined, delegates without
            contracts, reviews its own work, and drifts on. Pocketto does not make the model smarter. It puts the
            process in a harness: explicit stages, explicit artifacts, explicit gates, and a hard close that nothing
            slips past.
          </p>
        </div>

        <div className="mt-12 flex flex-col gap-px overflow-hidden rounded-xl border border-line bg-line">
          <p className="bg-bg-sunk px-5 py-2.5 text-[13px] font-semibold text-fg-soft">How Pocketto handles this</p>
          <div className="grid gap-px sm:grid-cols-2 lg:grid-cols-5">
            {FAILURE_MODES.map((f, i) => (
              <article
                key={f.problem}
                className="group relative flex flex-col bg-bg p-5 transition-colors hover:bg-bg-sunk has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-inset has-[:focus-visible]:ring-accent"
              >
                <span className="font-mono text-[10px] tracking-[0.14em] text-block">FAILURE 0{i + 1}</span>
                <h3 className="mt-2 text-[15px] font-semibold leading-snug">
                  <Link href={f.ref} className="outline-none after:absolute after:inset-0">
                    {f.problem}
                  </Link>
                </h3>
                <p className="mt-2.5 text-[13.5px] leading-relaxed text-fg-soft">{f.answer}</p>
                <div className="mt-auto flex justify-end pt-4">
                  <ArrowRight
                    className="size-4 text-accent motion-safe:transition-transform motion-safe:group-hover:translate-x-0.5"
                    aria-hidden
                  />
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ pipeline */

function PipelineSection() {
  return (
    <section id="pipeline" className="border-t border-line bg-bg-sunk/60">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:py-24">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <h2 className="display max-w-2xl text-3xl sm:text-4xl">
              Six stages. Every stage hands an artifact to the next.
            </h2>
            <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-fg-soft">
              This is the actual workflow, not a metaphor. Each stage consumes the previous stage&apos;s file, runs its
              own review gate, and stops for your approval where the design says it must. Select a stage to see what it
              receives, what it produces, and where it needs you.
            </p>
          </div>
          <div className="hidden gap-2 sm:flex">
            <span className="chip">WAITING</span>
            <span className="chip chip-warn">REVIEW</span>
            <span className="chip chip-pass">DONE</span>
            <span className="chip chip-block">BLOCKED</span>
            <span className="ml-1 self-center font-mono text-[10px] text-fg-faint">lifecycle states</span>
          </div>
        </div>

        <div className="mt-12">
          <PipelineViz />
        </div>

      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ capabilities */

const CAPABILITIES = [
  {
    icon: FileText,
    title: 'Structured planning and specifications',
    body: 'BDD specs with acceptance criteria, TDD execution plans, file-level task mapping. Test intent travels in the plan; implementation never starts from vibes.',
    href: '/docs/pipeline/planning',
  },
  {
    icon: Boxes,
    title: 'Delegation through Pocket Packets',
    body: 'Seven-field contracts with objective, verification criteria, and stop conditions. Parallel groups run in git worktrees, merged and audited one task at a time.',
    href: '/docs/reference/pocket-packets',
  },
  {
    icon: ShieldCheck,
    title: 'Independent review and quality gates',
    body: 'Edge-case hunters, spec reviewers, in-loop auditors, and a phase-level pass, all read-only, all separate from the agent that wrote the code.',
    href: '/docs/pipeline/approval-gates',
  },
  {
    icon: HardDrive,
    title: 'Durable lifecycle state',
    body: 'log.json tracks tasks and phases across sessions; lifecycle events record spec approval, phase completion, and closure. Recovery and repair are CLI commands, not hand edits.',
    href: '/docs/core-enterprise/lifecycle-events',
  },
  {
    icon: CheckCircle2,
    title: 'Local-first Core',
    body: 'The full pipeline works with zero GitHub credentials. Core commits state and events locally first and never calls gh. No remote required, ever.',
    href: '/docs/core-enterprise/core-architecture',
  },
  {
    icon: Split,
    title: 'Optional Enterprise adapter',
    body: 'Opt in, and an additive adapter consumes Core\u2019s events and reconciles GitHub: issues, phase PRs, tasklists. It never merges a PR or closes an issue; humans keep those gates.',
    href: '/docs/core-enterprise',
  },
  {
    icon: GraduationCap,
    title: 'Pocket Education',
    body: 'You write the code; the agent teaches. Per-skill depth (foundation / guided / independent), a hint ladder instead of answers, reviews phrased as traces. The learner owns progression.',
    href: '/docs/skills/pocket-education',
  },
  {
    icon: Wrench,
    title: 'Standalone workflows',
    body: 'Bug hunting with confirmed root causes, hotfixes with plan review, brand-aware design systems, research with graded verdicts, with no pipeline ceremony required.',
    href: '/docs/skills',
  },
];

function CapabilitiesSection() {
  return (
    <section id="capabilities" className="border-t border-line">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:py-24">
        <h2 className="display max-w-2xl text-3xl sm:text-4xl">
          {POCKETTO.skills.total} skills. One discipline.
        </h2>
        <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-fg-soft">
          Six pipeline stages for features that deserve the ceremony, nine standalone skills for everything else, all
          built on the same principle: verification over confidence.
        </p>

        <div className="mt-12 grid gap-px overflow-hidden rounded-xl border border-line-control bg-line sm:grid-cols-2 lg:grid-cols-4">
          {CAPABILITIES.map((cap) => (
            <Link
              key={cap.title}
              href={cap.href}
              className="group flex flex-col bg-bg p-5 transition-colors duration-150 hover:bg-bg-raised"
            >
              <cap.icon className="size-5" style={{ color: 'var(--accent)' }} aria-hidden />
              <h3 className="mt-3 text-[15px] font-semibold leading-snug">{cap.title}</h3>
              <p className="mt-2 text-[13.5px] leading-relaxed text-fg-soft">{cap.body}</p>
              <span className="mt-auto inline-flex items-center gap-1 pt-4 font-mono text-[11px] uppercase tracking-[0.08em] text-fg-faint transition-colors group-hover:text-accent">
                docs <ArrowRight className="size-3 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ chooser */

const ROUTES = [
  {
    saying: '\u201cI have a rough idea.\u201d',
    body: 'Explore it into a problem statement with approach directions before committing to a spec.',
    href: '/docs/pipeline/pitching',
    cta: 'pocket-pitching',
  },
  {
    saying: '\u201cI need to build a feature.\u201d',
    body: 'Run the full pipeline: spec → plan → structured tasks → delegated, reviewed execution → close.',
    href: '/docs/getting-started/first-project',
    cta: 'The full pipeline',
  },
  {
    saying: '\u201cI need to fix a bug.\u201d',
    body: 'Reactive and proactive debugging with confirmed root cause before any fix touches the code.',
    href: '/docs/skills/bug-hunting',
    cta: 'bug-hunting',
  },
  {
    saying: '\u201cIt\u2019s a small, clear change.\u201d',
    body: 'A brief plan, an independent subagent review, then implement: accuracy without the ceremony.',
    href: '/docs/skills/hotfix',
    cta: 'hotfix',
  },
  {
    saying: '\u201cI want to write the code myself.\u201d',
    body: 'Opt into Education: the agent explains, reviews your diff, and coaches one hint at a time.',
    href: '/docs/skills/pocket-education',
    cta: 'Pocket Education',
  },
  {
    saying: '\u201cMy team works through GitHub.\u201d',
    body: 'Add the optional Enterprise adapter: issue reconciliation, stacked phase PRs, final tasklists, with human gates preserved.',
    href: '/docs/core-enterprise',
    cta: 'Pocket Enterprise',
  },
];

function ChooserSection() {
  return (
    <section id="start" className="border-t border-line bg-bg-sunk/60">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:py-24">
        <h2 className="display max-w-2xl text-3xl sm:text-4xl">Start where you actually are.</h2>

        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {ROUTES.map((r) => (
            <Link
              key={r.saying}
              href={r.href}
              className="ledger-card group flex flex-col p-6 transition-colors duration-150 border-line-control hover:border-fg-soft"
            >
              <p className="display text-xl">{r.saying}</p>
              <p className="mt-3 text-sm leading-relaxed text-fg-soft">{r.body}</p>
              <span className="mt-5 inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.08em] text-accent">
                {r.cta}
                <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ install */

function InstallSection() {
  return (
    <section id="install" className="border-t border-line">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-20 sm:py-24 lg:grid-cols-[1fr_1fr] lg:gap-16">
        <div>
          <h2 className="display text-3xl sm:text-4xl">Two hosts. One install each.</h2>
          <p className="mt-4 max-w-prose text-[15px] leading-relaxed text-fg-soft">
            Pocketto ships as a Pi package and a Claude Code plugin, built from the same local-first Core. Pick your
            host. Everything else (pipeline, standalone skills, Education) behaves the same.
          </p>
          <ul className="mt-6 space-y-3 text-sm text-fg-soft">
            <li className="flex gap-3">
              <ListTree className="mt-0.5 size-4 shrink-0" style={{ color: 'var(--accent)' }} aria-hidden />
              <span>
                <strong className="font-semibold text-fg">Pi users:</strong> after installing, pull in the required
                extensions (advisor, context7, subagents) with{' '}
                <code className="font-mono text-[13px]">npx pocketto-pi setup-extensions</code>, then check with{' '}
                <code className="font-mono text-[13px]">npx pocketto-pi doctor</code>.
              </span>
            </li>
            <li className="flex gap-3">
              <FileCheck2 className="mt-0.5 size-4 shrink-0" style={{ color: 'var(--accent)' }} aria-hidden />
              <span>
                <strong className="font-semibold text-fg">Claude Code users:</strong> skills register as{' '}
                <code className="font-mono text-[13px]">/pocketto:*</code> commands after the marketplace install and a
                reload.
              </span>
            </li>
            <li className="flex gap-3">
              <CircleDashed className="mt-0.5 size-4 shrink-0" style={{ color: 'var(--accent)' }} aria-hidden />
              <span>
                Node.js ≥ 18. Enterprise is a separate, explicit install. Core never requires it. See{' '}
                <Link href="/docs/core-enterprise" className="link-underline text-fg">
                  Enterprise setup
                </Link>
                .
              </span>
            </li>
          </ul>
          <p className="mt-6 text-sm text-fg-soft">
            New here? Run{' '}
            <code className="font-mono text-[13px] text-fg">/pocketto:pocket-help</code>, a compact router that
            explains the system without loading every skill.
          </p>
        </div>
        <div className="self-start lg:pt-12">
          <InstallTabs />
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ final CTA */

function FinalCta() {
  return (
    <section className="border-t border-line bg-bg-sunk/60">
      <div className="mx-auto max-w-6xl px-5 py-24 text-center sm:py-28">
        <h2 className="display mx-auto max-w-3xl text-3xl sm:text-5xl">
          Your next feature deserves a paper trail.
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-fg-soft">
          Install Pocketto, run one command, and watch a rough ask become a spec, a plan, reviewed code, and a closed
          plan, with every step on the record.
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <Link href="/docs/getting-started/quickstart" className="btn btn-primary">
            Read the quickstart
          </Link>
          <a href={SITE.repo} target="_blank" rel="noreferrer noopener" className="btn btn-outline">
            <GithubIcon className="size-4" aria-hidden />
            Star on GitHub
          </a>
        </div>
        <div className="mx-auto mt-10 max-w-md">
          <div className="install-window">
            <div className="install-window-bar">
              <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-fg-faint">your first feature</span>
            </div>
            <div className="install-window-body">
              <span className="prompt">$</span>
              <span>/pocketto:pocket-grinding &quot;add dark mode toggle&quot;</span>
              <span className="ml-auto">
                <CopyButton text={'/pocketto:pocket-grinding "add dark mode toggle"'} />
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ JSON-LD */

function JsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: SITE.name,
    url: SITE.url,
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Node.js',
    description:
      'Structured AI coding workflows for Claude Code and Pi: BDD specs, TDD plans, contract-based delegation, independent review, and a hard close. Local-first, open source.',
    datePublished: POCKETTO.releaseDate,
    license: `https://spdx.org/licenses/${SITE.license}`,
    author: { '@type': 'Person', name: SITE.repoOwner, url: SITE.repo },
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  };
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}
