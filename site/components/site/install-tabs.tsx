'use client';

import { useCallback, useRef, useState } from 'react';
import { INSTALL } from '@/lib/site';
import { CopyButton } from './copy-button';

type Host = 'pi' | 'claude';

function CommandRow({ cmd, note }: { cmd: string; note?: string }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-line py-2 last:border-b-0">
      <div className="min-w-0">
        <code className="block truncate font-mono text-[13px] text-fg">{cmd}</code>
        {note && <p className="mt-0.5 text-xs text-fg-faint">{note}</p>}
      </div>
      <CopyButton text={cmd} />
    </div>
  );
}

export function InstallTabs({ compact = false }: { compact?: boolean }) {
  const [tab, setTab] = useState<Host>('pi');
  const tabRefs = useRef<Record<Host, HTMLButtonElement | null>>({ pi: null, claude: null });

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      let next: Host | null = null;
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        next = tab === 'pi' ? 'claude' : 'pi';
      }
      if (next) {
        e.preventDefault();
        setTab(next);
        tabRefs.current[next]?.focus();
      }
    },
    [tab],
  );

  const tabs: { id: Host; label: string }[] = [
    { id: 'pi', label: 'Pi' },
    { id: 'claude', label: 'Claude Code' },
  ];

  return (
    <div>
      <div role="tablist" aria-label="Choose your coding agent" className="flex items-center gap-1">
        {tabs.map((t) => (
          <button
            key={t.id}
            ref={(el) => {
              tabRefs.current[t.id] = el;
            }}
            role="tab"
            id={`install-tab-${t.id}`}
            aria-selected={tab === t.id}
            aria-controls={`install-panel-${t.id}`}
            tabIndex={tab === t.id ? 0 : -1}
            onKeyDown={onKeyDown}
            onClick={() => setTab(t.id)}
            className="rounded-md px-3.5 py-2 text-xs uppercase tracking-[0.08em] transition-colors duration-150"
            style={
              tab === t.id
                ? { background: 'var(--accent-soft)', color: 'var(--accent)', border: '1px solid color-mix(in oklab, var(--accent) 40%, transparent)' }
                : { color: 'var(--fg-soft)', border: '1px solid transparent' }
            }
          >
            {t.label}
          </button>
        ))}
      </div>

      <div
        role="tabpanel"
        id={`install-panel-${tab}`}
        aria-labelledby={`install-tab-${tab}`}
        tabIndex={0}
        className="install-window mt-3 focus-visible:outline-2 focus-visible:outline-[var(--accent)] focus-visible:outline-offset-2"
      >
        <div className="install-window-bar">
          <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-fg-faint">
            {tab === 'pi' ? 'shell' : 'claude code session'}
          </span>
          <span className="chip" style={{ fontSize: '0.625rem' }}>
            node ≥ 18
          </span>
        </div>
        <div className="px-4 py-2">
          {tab === 'pi' ? (
            <>
              <CommandRow cmd={INSTALL.pi[0]} note="install from the Git repository" />
              {!compact && <CommandRow cmd={INSTALL.pi[1]} note="or install from npm" />}
              <CommandRow cmd={INSTALL.piExtensions} note="required Pi extensions: advisor, context7, subagents" />
              {!compact && <CommandRow cmd={INSTALL.piDoctor} note="verify what is installed and what is missing" />}
            </>
          ) : (
            <>
              <CommandRow cmd={INSTALL.claude[0]} note="add the Pocketto plugin marketplace" />
              <CommandRow cmd={INSTALL.claude[1]} />
              {!compact && <CommandRow cmd={INSTALL.claude[2]} note="reload to register the /pocketto commands" />}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
