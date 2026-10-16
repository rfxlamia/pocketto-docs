import { RootProvider } from 'fumadocs-ui/provider/next';
import { Fraunces, Inter, JetBrains_Mono } from 'next/font/google';
import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { SITE } from '@/lib/site';
import './global.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
});

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  axes: ['opsz'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: 'Pocketto: accountable AI coding workflows',
    template: '%s | Pocketto',
  },
  description:
    'Structured AI coding workflows for Claude Code and Pi. Plan before code, delegate with contracts, gate before done, from a rough idea to reviewed, shipped code.',
  applicationName: SITE.name,
  keywords: [
    'Pocketto',
    'AI coding workflow',
    'Claude Code plugin',
    'Pi skills',
    'subagent delegation',
    'TDD planning',
    'developer tools',
  ],
  authors: [{ name: 'rfxlamia', url: SITE.repo }],
  openGraph: {
    type: 'website',
    siteName: SITE.name,
    url: SITE.url,
    title: 'Pocketto: accountable AI coding workflows',
    description:
      'Structured AI coding workflows for Claude Code and Pi. Plan before code, delegate with contracts, gate before done.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pocketto: accountable AI coding workflows',
    description:
      'Structured AI coding workflows for Claude Code and Pi. Plan before code, delegate with contracts, gate before done.',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#faf8f3' },
    { media: '(prefers-color-scheme: dark)', color: '#17130e' },
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${jetbrains.variable} ${fraunces.variable}`}>
      <body className="flex min-h-screen flex-col font-sans">
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
