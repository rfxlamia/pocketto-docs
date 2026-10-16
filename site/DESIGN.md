# Pocketto site: design direction

Read this before any UI work in `site/`. Token values live in `app/global.css`; if this file and the CSS disagree, the CSS wins.

## Identity

Engineering field manual: warm paper, ink, and one signal color (the accent). Content is real product vocabulary (lifecycle states, artifact paths, verdicts), shown as ledgers and index tables, not as marketing cards.

## Dials (observed from the shipped site, scale 1-3)

- ENERGY 1: calm, text-led, one accent used at key moments (primary button, links, focus ring, selected controls).
- RHYTHM 2: landing sections vary in composition (hero split, hairline grids, workflow index/detail, chooser cards) inside one consistent spacing and hairline system.
- MOTION 1: press and hover transitions (150ms). No loops, no scroll reveal. `prefers-reduced-motion` is honored globally.

The landing workflow explorer has a local ENERGY 2 / RHYTHM 2 / MOTION 2 treatment, described under Components. These global dials remain authoritative elsewhere.

## Tokens and type

- Color roles: `--bg`, `--bg-raised`, `--bg-sunk`, `--fg`, `--fg-soft`, `--fg-faint`, `--accent`, four state colors (`--pass`, `--warn`, `--block`, `--info`), `--code-bg`.
- `--fg-faint` is for small labels and still passes 4.5:1 on every surface in both themes. Do not lighten it.
- `--line` and `--line-strong` are decorative hairlines. `--line-control` (about 3:1) bounds interactive controls only.
- Type: Fraunces (display), Inter (body), JetBrains Mono (labels, commands). Loaded in `app/layout.tsx`.

## Layout

The Hero and install section use explicit single-column grids before their desktop splits. The Hero headline phrase wraps within the available width. This prevents the content's minimum width from expanding the mobile page.

## Decisions

- **Icons: Lucide.** One stroke family keeps every glyph consistent. Glyphs are literal (FileText for planning, ShieldCheck for review, HardDrive for durable state, GraduationCap for education). No sparkle, robot, or orb glyphs.
- **Capability grid is uniform.** Eight equal-weight skills read as an index in a hairline table, matching the ledger idiom. No capability is a flagship, so none is sized up.
- **Arrows mark links to docs on cards and index rows.** Button CTAs carry no arrow.
- **Tap targets are 44px** for standalone controls. Inline text links are exempt.
- **No em dash** in shipped text (see `CONTENT-GUIDE.md`).

## Components

### Hero journey illustration

The right hero column uses `public/hero-agent-map.webp`, converted from the user-edited transparent `public/hero-concepts/2026-10-17/03-no-bg.png`. The selected oil-painted map depicts one walking agent and six checkpoints as an illustration of the guided workflow, not live project progress. Parchment terrain and the orange route carry the existing field-manual palette into the image.

The WebP retains the source's 1024 x 1536 dimensions and exact alpha channel. A single `next/image` serves both themes, with intrinsic dimensions, responsive sizes, and a preload for the hero. The image fills the desktop column and is centered at up to 320px wide below the desktop breakpoint. Its natural portrait ratio preserves the whole map without cropping. The image is static and adds no animation.

### Landing entry-point illustrations

The six chooser cards use the user-supplied transparent `public/*-land.png` paintings: Pitching (idea notebook), the full pipeline (building blocks), bug-hunting (magnifying glass), hotfix (small code change), Education (teaching board), and Enterprise (GitHub collaboration). These literal scenes distinguish the available routes and extend the hero's painted orange-agent motif.

Each illustration sits above its card's text in a shared 208px-high area, capped at 256px wide with `object-fit: contain`, preserving the complete artwork and its alpha channel in both themes. Existing paper surfaces, Fraunces headings, Inter body text, and the accent link color keep the section consistent with the field-manual identity. Equal card widths keep the six entry points at the same priority; a shared image area and bottom-aligned documentation links make the choices easy to compare. The existing one-, two-, and three-column breakpoints remain in use.

Static `next/image` imports provide intrinsic dimensions and responsive optimization; images below the fold load lazily. Empty alt text keeps the painted scenes decorative because each route is already fully described by its adjacent text. Images stay still; cards provide a 150ms press response, a visible keyboard focus outline, and no press movement with reduced motion. Arrows identify documentation links.

### Landing workflow explorer

One bordered, raised surface pairs a project-condition index with a stage recommendation. The index asks what the visitor already has, so choosing an entry point starts with their available artifact. The recommendation shows the stage's purpose, prerequisite, and documentation link above an illustrative input -> selected stage -> output comparison. A compact six-stage map preserves the workflow order; its highlight identifies the stage being viewed, not project progress.

All six examples use a concrete drag-and-drop request, with an optional prerequisite artifact, beside the selected stage's own output document and path. Pitching presents dnd-kit as a candidate; Grinding accepts an explicit dnd-kit request or `pitch-exploration.md`. Closing produces a phase closeout. The native Where you decide disclosure explains approval and next-stage context independently of the output reveal:

- Pitching leaves the choice to continue to Grinding, explore further, or stop with the user.
- Grinding requires specification approval after independent edge-case review.
- Planning validates the plan through independent spec review and a CLI dry-run. Plan approval allows Structuring; implementation needs separate authorization.
- Structuring leaves execution authorization with the user before Development starts.
- Development leaves a passing phase in REVIEW until the user authorizes closeout.
- Closing requires an explicit closeout request and fresh passing verdicts. The plan closes only after every phase is DONE.

The visible Illustrative drag-and-drop example and Illustrative only labels distinguish this demonstration from project work. Run [stage] example switches from ready to output: the output document travels from the input's location into its output slot while the original input stays visible. Afterward, Next: [stage] selects the successor stage with its input ready. Replay demo appears only after the Closing output and returns to Pitching. Selecting a condition directly resets that stage's demonstration. These controls navigate the illustration; they never run skills or record project approval.

The index and recommendation sit side by side on desktop and stack below 768px, with a mobile link to the recommendation. Input and output compare side by side when the panel is wider than 480px and stack vertically at 480px or less through a container query. Standalone controls retain targets of at least 44px. The condition index uses vertical tabs with roving focus, wrapping Up/Down navigation, and Home/End shortcuts; the status announces changes politely.

Pointer selection moves the selection indicator (220ms) and slides the new recommendation in from its position in the sequence (220ms). The output document travels between measured input/output positions (280ms, strong ease-in-out): horizontally on desktop and vertically when stacked. Motion uses transform and opacity through the Web Animations API, cancels on interruption, and adds no dependencies or timers. The empty output slot reserves the result's height. For keyboard input, selection and demo actions update immediately. Reduced motion disables positional animation while preserving all state changes. The local motion and energy treatment applies only to this section; palette, fonts, icons, and themes inherit the existing system.
