'use client';

import { Check, Copy } from 'lucide-react';
import { useCallback, useRef, useState } from 'react';

export function CopyButton({ text, label }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable — nothing to report */
    }
  }, [text]);

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={copied ? 'Copied' : `Copy${label ? ` ${label}` : ' to clipboard'}`}
      className="inline-flex items-center gap-1.5 rounded-md border border-line px-2 py-1 font-mono text-[11px] text-fg-soft transition-colors duration-150 hover:border-line-strong hover:text-fg"
    >
      {copied ? <Check className="size-3.5" style={{ color: 'var(--pass)' }} /> : <Copy className="size-3.5" />}
      {copied ? 'copied' : 'copy'}
    </button>
  );
}
