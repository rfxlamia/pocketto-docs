'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

/**
 * Both icons always render; visibility is CSS-driven by the `dark` class the
 * theme provider sets on <html>. No mounted state, no hydration mismatch.
 */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label="Toggle theme"
      className="rounded-md p-2 text-fg-soft transition-colors duration-150 hover:bg-bg-sunk hover:text-fg"
    >
      <Sun className="hidden size-[18px] dark:block" />
      <Moon className="block size-[18px] dark:hidden" />
    </button>
  );
}
