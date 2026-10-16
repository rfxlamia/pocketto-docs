# Pocketto Site: Content Guide (for documentation authors)

Visual direction (tokens, dials, icon and layout decisions) lives in `DESIGN.md`.

You are writing MDX documentation pages for the Pocketto website (Next.js + Fumadocs).
Follow every rule below exactly.

## Absolute rules

1. **Accuracy over completeness.** Only state behavior you have verified in the Pocketto
   repository sources you were pointed at (`/Users/rfxlamia/project/pocketto-docs/reference/pocketto`).
   The repository is the canonical authority. If the implementation and any prose disagree,
   follow the implementation and mention the nuance in the page where it matters.
2. **Never invent** commands, flags, config keys, file paths, error codes, integrations,
   or guarantees. If a command is shown in a source file, copy it exactly.
3. **Label illustrative output.** Never present made-up command output as a real execution
   result. Introduce such blocks with "Illustrative output:" or "Example (illustrative):".
4. **Do not imply autonomous execution.** Where a workflow requires user approval, say so
   explicitly and concretely ("you must approve the spec before planning starts").
5. **Do not copy SKILL.md files verbatim.** Write for human developers: explain, then show.
6. **English only.** Second person ("you"), active voice, precise and direct. No marketing
   fluff, no exclamation marks, no "simply" or "just".
   No em dash (U+2014) anywhere: use a comma, colon, period, or parentheses. A few verbatim
   product samples (Iron Laws blocks, plan templates, JSON and CLI output) differ from the real
   product output by this punctuation only. One exception keeps the em dash on purpose: the
   `# EXECUTION PLAN — <name>` plan title in `reference/plan-structure.mdx`, because the CLI parser
   (`pocketto-pi structure`) matches that character literally.
7. **No placeholders.** No lorem ipsum, no "coming soon", no empty sections.
8. Do not run `bun install`, `bun run build`, or any dev server. Only write files.

## Frontmatter

Every page starts with exactly:

```yaml
---
title: Human Page Title
description: One sentence (max ~160 chars) that makes sense in search results and link previews.
---
```

One optional key is allowed: `seoTitle`, the search-result title. Use it when `title` (which is
also the H1 and the sidebar label) is too terse to rank on its own, such as a bare skill name.
Keep it at 49 characters or fewer so the rendered `<title>` (`seoTitle | Pocketto`) stays within
60.

A second optional key, `faq: true`, emits FAQPage structured data. Every heading that ends in
"?" becomes a question, and the paragraphs under it become the answer. Use it only on pages whose questions are real headings with direct answers.

No other frontmatter keys.

## MDX components available

Use the default MDX components plus these (import-free in MDX, they are provided):

- `<Callout type="info|warn|tip|error" title="Optional title">…</Callout>`
- `<Cards><Card title="…" href="…">description</Card></Cards>`
- `<Tabs items={["Pi", "Claude Code"]}><Tab value="Pi">…</Tab></Tabs>`
- `<Steps><Step>…</Step></Steps>`
- `<Files><Folder name="…" defaultOpen><File name="…" /></Folder></Files>`
- `<TypeTable type={[{ name: '…', type: '…', description: '…' }]} />`

Use them sparingly and purposefully: callouts for gotchas/requirements, Tabs only for
host-specific (Pi vs Claude Code) content, Steps only for genuinely sequential procedures.

## Links

- Internal links: absolute paths starting with `/docs/...` (e.g. `[Pocket Packets](/docs/reference/pocket-packets)`).
- Only link pages from the sitemap in this guide. External links to the GitHub repo are fine.

## Code blocks

- Always declare the language (`bash`, `text`, `json`, `markdown`, `mdx`).
- CLI commands are `npx -y pocketto-pi <command> …` exactly as the sources show.
- For Claude Code slash commands, use the `/pocketto:<skill-name>` form (e.g. `/pocketto:pocket-grinding "topic"`), which is the plugin invocation form from the repository README.
- For Pi, skills are invoked by asking for them or using their trigger phrases (the SKILL.md `description` frontmatter lists triggers); there is no verified Pi slash-command syntax, so do not invent one.

## Page template for a **skill** page

Every standalone-skill page must cover, in this order (use H2 `##` headings):

1. Lead paragraph: what it does in 1–2 sentences (no heading).
2. **When to use it** (and a "When not to use it" subsection or list, always present).
3. **Prerequisites** (e.g. required extensions, plan/spec inputs, host differences).
4. **How to invoke it** (exact invocation per host).
5. **How it works**: the actual phases/steps from the source, condensed but complete. Keep
   the stage/gate names and artifact paths verbatim.
6. **Outputs and artifacts**: exact paths and formats.
7. **Approval gates and constraints**: what stops for the user, what is non-negotiable.
8. **Example**: one realistic, clearly-labelled example scenario (may be illustrative).
9. **Related documentation**: bulleted links.

## Page template for a **pipeline stage** page

Same elements as the skill template, plus:

- A short "Where this sits in the pipeline" paragraph (what stage precedes it and what follows).
- State the handoff rules exactly (what auto-chains, what requires the user's decision).

## Sitemap (all valid internal link targets)

- `/docs` (Introduction)
- `/docs/getting-started` (+ `core-concepts`, `installation`, `quickstart`, `claude-code-setup`, `pi-setup`, `choosing-workflow`, `comparison`, `first-project`)
- `/docs/pipeline` (+ `pitching`, `grinding`, `planning`, `structuring`, `development`, `closing`, `approval-gates`, `artifacts`)
- `/docs/skills` (+ `pocket-help`, `pocket-init`, `pocket-education`, `bug-hunting`, `hotfix`, `brand-design`, `structured-research`, `validate-plan`, `create-pr`)
- `/docs/core-enterprise` (+ `core-architecture`, `local-first`, `enterprise-setup`, `integration-boundaries`, `github-sync`, `compatibility`, `lifecycle-events`, `recovery-rollback`, `human-authorization`)
- `/docs/reference` (+ `cli`, `configuration`, `files`, `pocket-packets`, `plan-structure`, `review-reports`, `lifecycle-state`, `release-surfaces`, `troubleshooting`, `faq`, `glossary`)
- `/docs/contributing` (+ `development-testing`, `guidance`)
- `/docs/built-with-pocketto` (+ `iot-tractor-tracking`, `agentpair-protocol`)

## Built with Pocketto

Project write-ups live in `content/docs/built-with-pocketto/` as the last docs section. They
describe real projects, so rule 1 extends to the project's own files:

- Every number comes from the project's Pocket artifacts (`log.json`, review reports,
  `closeout.md`, specs). Say which file a figure comes from when it is not obvious.
- Open plans are described as open. Do not present a rehearsal or a `WAITING` task as shipped.
- Remove client names, internal feature names, commit SHAs, and infrastructure identifiers
  unless the project owner has approved them.
- Include the overhead the record shows (review loops, open plans), not only the wins.

## meta.json for each section folder

Create `<section>/meta.json` exactly in this shape (object, not array):

```json
{
  "title": "Section Title",
  "description": "One sentence for the section.",
  "pages": ["index", "first-child-slug", "second-child-slug"]
}
```

## Established facts you may rely on (verified)

- Package: `pocketto-pi` v4.2.2, MIT, Node.js >= 18. Protocol versions are independent:
  `CONTRACT=3`, `PIPELINE=5`, `LIFECYCLE_SCHEMA=2`, `ADAPTER_CONTRACT=2`, `SURFACE_MANIFEST=1`.
- 15 skills: pipeline `pocket-pitching → pocket-grinding → pocket-planning → pocket-structuring → pocket-development → pocket-closing`;
  standalone `pocket-help`, `pocket-init`, `pocket-education`, `bug-hunting`, `hotfix`, `brand-design`,
  `structured-research`, `validate-plan`, `create-pr`. Plus the optional `pocket-enterprise` adapter skill.
- Install (Pi): `pi install git:github.com/rfxlamia/pocketto` or `pi install npm:pocketto-pi`.
  Install (Claude Code): `/plugin marketplace add rfxlamia/pocketto`, `/plugin install pocketto@pocketto`, `/reload-plugins`.
- Pi required extensions: `pi-mcp-adapter` (context7), `@gotgenes/pi-subagents`, `@juicesharp/rpiv-advisor`;
  recommended: `@juicesharp/rpiv-ask-user-question`, `@tintinweb/pi-tasks`, `@aliou/pi-processes`.
  Setup: `npx pocketto-pi setup-extensions [--recommended|--all]`; check: `npx pocketto-pi doctor [--strict]`.
- Task states: `WAITING → DONE | BLOCKED`; phase states: `WAITING → REVIEW → DONE | BLOCKED`.
- Core never calls `gh`, never creates/reconciles GitHub resources, never merges PRs, never closes issues.
- Lifecycle events (neutral, Core-emitted): `spec-approved`, `phase-complete`, `phase-closed` (stacked plans only,
  lifecycle schema 2), `plan-closed`.
- Release surfaces (`surfaces.json` schema 1): `pi/core`, `pi/enterprise`, `claude/core`, `claude/enterprise`.
  Enterprise is an additive delta requiring its matching Core role.
- Primary artifact paths: `docs/pocket/spec/<date>-<slug>/`, `docs/pocket/plans/<date>-<slug>/` (with
  `execution-plan/index.md`, `execution-plan/tasks/T*.md`, `execution-plan/phase-N.md`, `log.json`, `reviews/`,
  `closeout.md`), `docs/pocket/research/<date>-<slug>/research-report.md`, `docs/pocket/rule/creative-brief.md`,
  `docs/pocket/learning/`, `.pocket-meta.json`, `.pocket/lifecycle-adapter.json`, `lifecycle.json`.
- Pocket Education levels: `foundation | guided | independent` per skill; teaching modes `guided | socratic`;
  CLI: `edu`, `edu init`, `edu set`; profile stored in a `## Pocket Education` block in `CLAUDE.md`/`AGENTS.md`.
- v3 migration: `lifecycle migrate --from v3` only for pristine plans; progressed plans return `PIN_V3_REQUIRED`;
  pin `npx -y pocketto-pi@3.1.3` to finish them on v3.
