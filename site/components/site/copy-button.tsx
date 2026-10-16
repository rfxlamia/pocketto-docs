'use client';

import { Check, Copy, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

type Status = 'idle' | 'copied' | 'failed';

const ANNOUNCE: Record<Status, string> = { idle: '', copied: 'Copied', failed: 'Copy failed' };

export function CopyButton({ text, label }: { text: string; label?: string }) {
  const [status, setStatus] = useState<Status>('idle');
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const copy = useCallback(async () => {
    let next: Status = 'copied';
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      next = 'failed';
    }
    setStatus(next);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setStatus('idle'), 1600);
  }, [text]);

  return (
    <>
      <button
        type="button"
        onClick={copy}
        aria-label={`Copy${label ? ` ${label}` : ' to clipboard'}`}
        className="inline-flex min-h-11 min-w-11 items-center justify-center gap-1.5 rounded-md border border-line-control px-2 py-1 text-[11px] text-fg-soft transition-colors duration-150 hover:border-fg-soft hover:text-fg"
      >
        {status === 'copied' && <Check className="size-3.5" style={{ color: 'var(--pass)' }} />}
        {status === 'failed' && <X className="size-3.5" style={{ color: 'var(--block)' }} />}
        {status === 'idle' && <Copy className="size-3.5" />}
        {status === 'idle' ? 'copy' : status}
      </button>
      <span role="status" className="sr-only">
        {ANNOUNCE[status]}
      </span>
    </>
  );
}
