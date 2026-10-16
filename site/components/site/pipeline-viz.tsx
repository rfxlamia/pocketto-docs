'use client';

import Link from 'next/link';
import { ArrowRight, ArrowDown } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { PIPELINE_STAGES } from '@/lib/site';

/**
 * Presentation copy for each stage — written from the stage SKILL.md files in
 * the Pocketto repository (inspected at the commit recorded in
 * SOURCE-INVENTORY.md). The structured facts come from PIPELINE_STAGES.
 */
const DESCRIPTIONS: Record<string, string> = {
  'pocket-pitching':
    'For ideas that have not become problems yet. Pocketto scans your project, runs structured brainstorming methods, curates the results through an independent advisor, resolves technical unknowns with spikes, and converges on a problem statement with two or three approach directions. It stops there on purpose — solutions come later.',
  'pocket-grinding':
    'Requirement discovery with BDD discipline: context scan, scope and boundaries, questioning from business, developer, and QA lenses, then concrete Given/When/Then scenarios. An independent edge-case-hunter subagent reviews the scenarios before any design is proposed, and architecture claims are validated against the actual codebase.',
  'pocket-planning':
    'Converts the approved spec into a TDD-structured execution plan: file mapping, dependency-annotated tasks, and a full Pocket Packet per task — objective, verification, stop conditions. A separate spec-reviewer subagent checks coverage, and the CLI dry-runs the plan to catch malformed dependencies before anything is approved.',
  'pocket-structuring':
    'The Pocket CLI decomposes the approved plan into execution-plan/index.md and one file per task — plus phase manifests when the plan spans multiple phases. The CLI owns parsing, decomposition, and log reconciliation; nothing is inferred from prose. Execution still requires its own approval.',
  'pocket-development':
    'The main agent coordinates; implementers write code; a read-only auditor reviews. Every delegation is a Pocket Packet contract — no packet, no spawn. Each task passes a mechanical gate and an independent audit; when every task is done, a phase-level pass reviews the whole phase before the phase may enter REVIEW.',
  'pocket-closing':
    'Closing never re-reviews code. It reconciles task verdicts against the execution log, refuses missing or stale verdicts, advances only a passing phase, and appends a readable section to closeout.md. When every phase is done, it closes the plan and records the final summary — because you asked, not because a verdict alone allowed it.',
};

const FACT_KEYS = [
  { key: 'receives', label: 'Receives' },
  { key: 'produces', label: 'Produces' },
  { key: 'gate', label: 'Approval gate' },
  { key: 'next', label: 'What happens next' },
] as const;

const count = PIPELINE_STAGES.length;

export function PipelineViz() {
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const stage = PIPELINE_STAGES[active] ?? PIPELINE_STAGES[0]!;

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      let next: number | null = null;
      if (e.key === 'ArrowRight') next = (active + 1) % count;
      else if (e.key === 'ArrowLeft') next = (active - 1 + count) % count;
      else if (e.key === 'Home') next = 0;
      else if (e.key === 'End') next = count - 1;
      if (next !== null) {
        e.preventDefault();
        setActive(next);
        tabRefs.current[next]?.focus();
      }
    },
    [active],
  );

  useEffect(() => {
    const el = tabRefs.current[active];
    if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', inline: 'center', block: 'nearest' });
  }, [active]);

  return (
    <div>
      {/* Stage rail */}
      <div className="relative">
        <div
          role="tablist"
          aria-label="Pocket pipeline stages"
          onKeyDown={onKeyDown}
          className="flex snap-x snap-mandatory gap-2 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {PIPELINE_STAGES.map((s, i) => {
            const selected = i === active;
            return (
              <button
                key={s.id}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                role="tab"
                id={`pipeline-tab-${s.id}`}
                aria-selected={selected}
                aria-controls="pipeline-panel"
                tabIndex={selected ? 0 : -1}
                onClick={() => setActive(i)}
                className="snap-start rounded-lg border px-4 py-3 text-left transition-[background-color,border-color,color,transform] duration-200 ease-out active:scale-[0.97]"
                style={
                  selected
                    ? {
                        background: 'var(--accent-soft)',
                        borderColor: 'color-mix(in oklab, var(--accent) 45%, transparent)',
                        color: 'var(--fg)',
                      }
                    : {
                        background: 'var(--bg-raised)',
                        borderColor: 'var(--line)',
                        color: 'var(--fg-soft)',
                      }
                }
              >
                <span
                  className="block font-mono text-[10px] tracking-[0.14em]"
                  style={{ color: selected ? 'var(--accent)' : 'var(--fg-faint)' }}
                >
                  {s.index}
                </span>
                <span className="mt-0.5 block whitespace-nowrap text-sm font-semibold">{s.name}</span>
              </button>
            );
          })}
        </div>
        {/* Progress line */}
        <div aria-hidden className="mt-1 h-px w-full bg-line">
          <div
            className="h-px transition-[width] duration-300 ease-out"
            style={{ width: `${(active / (count - 1)) * 100}%`, background: 'var(--accent)' }}
          />
        </div>
      </div>

      {/* Detail panel */}
      <div
        role="tabpanel"
        id="pipeline-panel"
        aria-labelledby={`pipeline-tab-${stage.id}`}
        key={stage.id}
        className="ledger-card mt-6 grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.2fr_1fr] animate-panel"
      >
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-mono text-xs tracking-[0.14em] text-fg-faint">STAGE {stage.index} / 06</span>
            <span className="chip chip-accent">{stage.id}</span>
          </div>
          <h3 className="display mt-3 text-2xl sm:text-[1.75rem]">{stage.name}</h3>
          <p className="mt-1 text-[15px] font-medium text-accent">{stage.tagline}</p>
          <p className="mt-4 max-w-prose text-[15px] leading-relaxed text-fg-soft">{DESCRIPTIONS[stage.id]}</p>
          <Link
            href={`/docs/${stage.slug}`}
            className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-accent transition-colors hover:text-accent-strong"
          >
            Read the {stage.name} stage docs
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>

        <dl className="grid gap-0 self-start rounded-lg border border-line">
          {FACT_KEYS.map((fact, i) => (
            <div
              key={fact.key}
              className={`grid gap-1 p-4 sm:grid-cols-[130px_1fr] sm:gap-4 ${i > 0 ? 'border-t border-line' : ''}`}
            >
              <dt className="font-mono text-[11px] uppercase tracking-[0.1em] text-fg-faint">{fact.label}</dt>
              <dd className="text-sm leading-relaxed text-fg">{stage[fact.key]}</dd>
            </div>
          ))}
          <div className="border-t border-line bg-bg-sunk p-4">
            <span className="inline-flex items-center gap-2 text-[13px] text-fg-soft">
              <ArrowDown className="size-3.5 text-fg-faint" aria-hidden />
              {active < count - 1 ? (
                <span>
                  Next stage: <strong className="font-semibold text-fg">{PIPELINE_STAGES[active + 1]?.name}</strong>
                </span>
              ) : (
                <span>
                  The plan is closed — <strong className="font-semibold text-fg">closeout.md</strong> holds the full
                  record.
                </span>
              )}
            </span>
          </div>
        </dl>
      </div>
    </div>
  );
}
