# Pocketto Website

The product website and documentation for [Pocketto](https://github.com/rfxlamia/pocketto) — structured AI coding workflows for Claude Code and Pi.

Built with Next.js (App Router) 16, TypeScript strict, Tailwind CSS 4, Fumadocs 16, MDX, and Lucide icons. Fonts: Fraunces, Inter, JetBrains Mono (all SIL OFL via `next/font`).

## Run

```bash
bun install
bun run dev        # development
bun run build      # production build
bun run start      # serve the production build
```

Node.js ≥ 22 recommended (bun 1.3+ as the package manager).

## Quality gates

```bash
bun run typecheck   # tsc --noEmit (strict)
bun run lint        # eslint (eslint-config-next)
bun run check:links # internal /docs/... link checker for content + components
```

## Deploy

Standard Next.js deployment — no extra config. For Vercel: import the repository, framework preset **Next.js**, build command `next build`. The only dynamic route is `/api/search` (a serverless function); every content page is statically generated.

Set the production domain in `lib/site.ts` (`SITE.url`) if it differs from `https://pocketto.rfxlamia.xyz`.

## Content architecture

- `content/docs/**` — MDX documentation (6 sections, 54 pages).
- `lib/site.ts` — single source of truth for the Pocketto version, inspected commit SHA, protocol versions, skill lists, and install commands. Update it (plus `SOURCE-INVENTORY.md`) when Pocketto releases; pages must not hardcode these values.
- `SOURCE-INVENTORY.md` — maps every docs area to the repository files that support it, with the update procedure for new releases.
- `CONTENT-GUIDE.md` — writing rules for documentation authors.
- `scripts/check-links.mjs` — validates every internal link against the page tree on disk.
