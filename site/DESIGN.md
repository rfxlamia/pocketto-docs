# Pocketto site: design direction

Read this before any UI work in `site/`. Token values live in `app/global.css`; if this file and the CSS disagree, the CSS wins.

## Identity

Engineering field manual: warm paper, ink, and one signal color (the accent). Content is real product vocabulary (lifecycle states, artifact paths, verdicts), shown as ledgers and index tables, not as marketing cards.

## Dials (observed from the shipped site, scale 1-3)

- ENERGY 1: calm, text-led, one accent used at key moments (primary button, links, focus ring, selected tab).
- RHYTHM 2: landing sections vary in composition (hero split, hairline grids, tabbed pipeline, chooser cards) inside one consistent spacing and hairline system.
- MOTION 1: press and hover transitions (150ms) and one panel fade (240ms) in the pipeline viewer. No loops, no scroll reveal. `prefers-reduced-motion` is honored globally.

## Tokens and type

- Color roles: `--bg`, `--bg-raised`, `--bg-sunk`, `--fg`, `--fg-soft`, `--fg-faint`, `--accent`, four state colors (`--pass`, `--warn`, `--block`, `--info`), `--code-bg`.
- `--fg-faint` is for small labels and still passes 4.5:1 on every surface in both themes. Do not lighten it.
- `--line` and `--line-strong` are decorative hairlines. `--line-control` (about 3:1) bounds interactive controls only.
- Type: Fraunces (display), Inter (body), JetBrains Mono (labels, commands). Loaded in `app/layout.tsx`.

## Decisions

- **Icons: Lucide.** One stroke family keeps every glyph consistent. Glyphs are literal (FileText for planning, ShieldCheck for review, HardDrive for durable state, GraduationCap for education). No sparkle, robot, or orb glyphs.
- **Capability grid is uniform.** Eight equal-weight skills read as an index in a hairline table, matching the ledger idiom. No capability is a flagship, so none is sized up.
- **Arrows mark links to docs on cards and index rows.** Button CTAs carry no arrow.
- **Tap targets are 44px** for standalone controls. Inline text links are exempt.
- **No em dash** in shipped text (see `CONTENT-GUIDE.md`).
