'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useSyncExternalStore, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { GithubIcon, PocketMark } from './pocket-mark';
import { ThemeToggle } from './theme-toggle';
import { SITE } from '@/lib/site';

const links = [
  { text: 'Docs', url: '/docs' },
  { text: 'Pipeline', url: '/docs/pipeline' },
  { text: 'Skills', url: '/docs/skills' },
  { text: 'Case studies', url: '/case-studies' },
  { text: 'Why Pocketto', url: '/#why' },
  { text: 'Install', url: '/#install' },
];

function subscribeScroll(callback: () => void) {
  window.addEventListener('scroll', callback, { passive: true });
  return () => window.removeEventListener('scroll', callback);
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Scroll state lives in an external store, no setState-in-effect.
  const scrolled = useSyncExternalStore(
    subscribeScroll,
    () => window.scrollY > 8,
    () => false,
  );

  const closeMenu = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      closeMenu();
      toggleRef.current?.focus();
    };
    const onPointerDown = (e: PointerEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) closeMenu();
    };
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('pointerdown', onPointerDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('pointerdown', onPointerDown);
    };
  }, [open, closeMenu]);

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-40 border-b transition-colors duration-200"
      style={{
        borderColor: scrolled ? 'var(--line)' : 'transparent',
        backgroundColor: scrolled ? 'color-mix(in oklab, var(--bg) 78%, transparent)' : 'transparent',
        backdropFilter: scrolled ? 'blur(14px) saturate(160%)' : 'none',
      }}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5">
        <Link href="/" className="flex items-center gap-2.5 text-fg" aria-label="Pocketto home" onClick={closeMenu}>
          <PocketMark className="size-[22px]" />
          <span className="font-display text-[17px] font-semibold tracking-tight">Pocketto</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {links.map((link) => (
            <Link
              key={link.url}
              href={link.url}
              className="inline-flex min-h-11 items-center rounded-md px-3 text-sm font-medium text-fg-soft transition-colors duration-150 hover:bg-bg-sunk hover:text-fg"
            >
              {link.text}
            </Link>
          ))}
          <span aria-hidden className="mx-2 h-4 w-px bg-line" />
          <ThemeToggle />
          <a
            href={SITE.repo}
            target="_blank"
            rel="noreferrer noopener"
            aria-label="View Pocketto on GitHub (opens in a new tab)"
            className="inline-flex size-11 items-center justify-center rounded-md text-fg-soft transition-colors duration-150 hover:bg-bg-sunk hover:text-fg"
          >
            <GithubIcon className="size-[18px]" />
          </a>
        </nav>

        <div className="flex items-center gap-1 md:hidden">
          <ThemeToggle />
          <button
            ref={toggleRef}
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="inline-flex size-11 items-center justify-center rounded-md text-fg-soft transition-colors hover:bg-bg-sunk hover:text-fg"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav
          id="mobile-nav"
          aria-label="Main mobile"
          className="border-t border-line px-5 pb-4 pt-2 md:hidden"
          style={{ backgroundColor: 'color-mix(in oklab, var(--bg) 92%, transparent)', backdropFilter: 'blur(14px)' }}
        >
          {links.map((link) => (
            <Link
              key={link.url}
              href={link.url}
              onClick={closeMenu}
              className="flex min-h-11 items-center rounded-md px-2 text-[15px] font-medium text-fg-soft hover:bg-bg-sunk hover:text-fg"
            >
              {link.text}
            </Link>
          ))}
          <a
            href={SITE.repo}
            target="_blank"
            rel="noreferrer noopener"
            className="mt-2 flex min-h-11 items-center justify-center rounded-md border border-line-control px-3 text-center text-sm font-medium"
          >
            View on GitHub
          </a>
        </nav>
      )}
    </header>
  );
}
