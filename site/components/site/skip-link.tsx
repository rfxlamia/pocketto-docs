'use client';

import type { MouseEvent } from 'react';

export function SkipLink({ targetId }: { targetId: string }) {
  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    const target = document.getElementById(targetId);
    if (!target) return;
    e.preventDefault();
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
    target.focus();
  };

  return (
    <a
      href={`#${targetId}`}
      onClick={onClick}
      className="sr-only rounded-md border border-line-control bg-bg-raised px-4 py-2 text-sm font-medium text-fg focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      Skip to content
    </a>
  );
}
