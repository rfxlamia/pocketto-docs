# Hero illustration integration

The user selected variant 3 and supplied a transparent PNG edit. This change converts that exact edit to WebP and replaces the report illustration in the landing hero. The PNG remains unchanged. No image generation or background removal was performed in this integration step.

## Asset provenance and conversion

- Source: `site/public/hero-concepts/2026-10-17/03-no-bg.png`, user-edited version of the previously generated painted interface map.
- Shipping asset: `site/public/hero-agent-map.webp`.
- Conversion: installed Sharp encoder, `webp({ quality: 82, alphaQuality: 100, effort: 6 })`, without resizing or flattening.
- Source: 2,471,612 bytes. WebP: 161,172 bytes. Reduction: 93.5%.
- PNG and WebP dimensions: 1024 x 1536.
- Decoded alpha buffers compared byte for byte: identical.
- Full original image-generation prompts: `../2026-10-17-hero-concepts/prompts.md`.

## Verification

- PASS: `bun run lint`, exit 0.
- PASS: `bun run typecheck`, exit 0.
- PASS: `bun run build`, exit 0; 66 static pages generated. The initial sandboxed build stalled and was stopped; the successful build ran with expanded execution access. Existing CSS optimizer warnings concern Fumadocs `::highlight` selectors; Next also reported an unrelated parent-directory package lock.
- PASS: `bun run check:links`, 56 internal links checked against 58 docs pages.
- PASS: `git diff --check`.
- PASS: Impeccable detector on `site/app/page.tsx` returned an empty findings array.
- PASS: Chromium inspection at 1440, 1024, 768, 390 and 320 CSS pixels in both themes. Full browser results are in `browser-checks.json`.
- PASS: all ten viewport/theme cases load exactly one hero image, preserve the 2:3 ratio, and have no horizontal page overflow.
- PASS: desktop image measures about 456 x 683 CSS pixels; below the desktop breakpoint it is at most 320 x 480, and 280 x 420 at a 320px viewport.
- PASS: desktop and mobile screenshots visually inspected in both themes; no opaque rectangle, visible background halo, or cropped map. This is Chromium coverage, not a claim of testing other browser engines or physical devices.
- PASS: no browser console errors or page exceptions during the recorded checks.

## Recorded control checks

- PASS: theme toggle changes the theme while the same hero remains loaded.
- PASS: Claude Code and Pi tabs select their respective installation commands.
- PASS: hero copy button writes the displayed command to the clipboard.
- PASS: Run the quickstart navigates to `/docs/getting-started/quickstart`.
- PASS: Read the docs navigates to `/docs`.
- PASS by inspection: GitHub link retains its existing GitHub destination and new-tab attributes; the external destination was not navigated.
- PASS: ArrowRight selects and focuses the Claude Code installation tab.
- PASS: mobile menu opens and Escape closes it.

## Antislop delivery gate

Scope: the changed hero illustration and its immediate layout. Unchanged sections and their controls were not exhaustively re-audited.

### Hard gate

- R-02 PASS: new alt text and caption contain no em dashes.
- R-03 PASS: no overflow at the five tested widths; image retains its natural ratio.
- R-17 PASS: no invented statistics; file-size reduction is measured above.
- R-18 PASS: no testimonials or person identities added.
- R-23 PASS: user explicitly selected the image, provided its edited source and requested WebP conversion and integration.
- R-24 PASS: hero navigation destinations checked; none added.
- R-25 PASS for changed content: image contains no text; accessible text uses the existing screen-reader-only caption pattern. Existing visible hero typography and color tokens remain unchanged.
- R-26 PASS: affected-area control checks recorded above; image adds no controls.
- R-27 N/A: image adds no asynchronous data UI.
- R-28 N/A: no FAQ changes.
- R-32 PASS: image adds descriptive alt text and no focus targets; existing install keyboard navigation and menu Escape behavior verified.
- R-33 PASS: JSX edited directly with apply_patch; encoder only creates a WebP asset.
- R-34 PASS: same transparent image visually checked on light and dark hero surfaces.
- R-35 PASS: production build and local Chromium checks completed; screenshots and control evidence saved.
- R-36 PASS: no security, customer or performance claims added to the product UI.
- R-37 PASS: user-selected oil painting and existing field-manual direction govern the change.
- R-38 PASS: caption describes an illustration, explicitly not live execution progress.

### Purpose gate

- R-01 PASS: existing warm cream, ink and orange palette remains authoritative.
- R-04 PASS: robot is the explicitly requested subject; no feature icons added.
- R-06 PASS: existing typography remains unchanged; alt text describes the subject.
- R-07 PASS: painted terrain forms the requested map, with no page background grid added.
- R-08 N/A: no button arrows added.
- R-09 N/A: no badges added.
- R-10 N/A: no glass surfaces added.
- R-12 PASS: only the source illustration's grounded painted shadows remain.
- R-13 PASS: no glow added.
- R-14 N/A: no feature cards added.
- R-19 PASS: image is static; no animation introduced.
- R-22 PASS: agent following six checkpoints depicts the requested guided workflow.

### Liveliness

- Dials PASS: ENERGY 1 / RHYTHM 2 / MOTION 1 retained from the selected concept and global direction.
- Consistency PASS: restrained colors, winding route and static rendering match those dials.
- Focal point PASS: orange agent and route are legible beside the headline.
- Whitespace PASS: desktop gap separates image from text; image centers below text on small screens.
- Accent PASS: orange route repeats the site's existing accent.
- Motif PASS: six checkpoints visually reference the six-stage workflow.
- Design Read PASS: direction was established before concept generation; user selected the final image before integration.

### Craftsmanship and quality locks

- C-1 PASS: image sizing, transparency, palette and layout reasons recorded in `site/DESIGN.md`.
- C-2 PASS: recorded hero controls function; no controls added by the illustration.
- C-3 PASS: illustration occupies the existing hero column without adding sections.
- C-4 PASS for tested scope: both themes and five widths render the image without clipping or overflow.
- C-5 PASS: no invented evidence; image is identified as illustrative.
- R-05 PASS: existing split hero retained; report image replaced with the user-selected map.
- R-11 N/A: no radii changed.
- R-15 PASS: existing specific hero CTAs retained and checked.
- R-16 PASS: new image descriptions are concrete and contain no marketing buzzwords.
- R-20 PASS: image uses the existing warm-paper field-manual identity.
- R-21 PASS: both existing themes remain available and were checked.
- R-29 PASS: no new UI colors; selected illustration retains its warm neutral and orange palette.
- R-30 PASS: no product UI cloned.
- R-31 PASS: major choices and asset provenance documented in DESIGN.md and this report.

### UI and copy supplements

- PASS: brand palette, purposeful orange route, static motion, direct product connection, descriptive alt text, and an honest illustrative caption.
- PASS: no new gradients, glass, badges, dashboard shapes, forms, metrics, decorative emoji, testimonials, or UI copy claims.
- PASS: no new controls or data states; affected hero controls, themes and widths checked as recorded above.
- PASS: alt text describes the actual walking agent, winding route and six visible checkpoints; caption distinguishes the illustration from real execution.

## Project tooling note

Impeccable context reported existing metadata drift: `buildPath` is unset, and its workflow surface brief was reported as orphaned. Neither configuration nor surface-brief routing was changed as part of this asset replacement.
