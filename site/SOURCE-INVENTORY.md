# Source inventory

This site documents **Pocketto `4.2.2`**.

- Repository: https://github.com/rfxlamia/pocketto
- Inspected commit: `70b5bbe73b1fe6071b37e795ffd8505d05c0840c` (2026-10-16 — "Merge pull request #82 from rfxlamia/chore/release-4.2.2")
- The reference checkout lives read-only at `../reference/pocketto` (outside the app).

Central product facts live in `lib/site.ts` (version, commit SHA, protocol versions,
skill lists, install commands). Update that file — and this map — together when
Pocketto releases; pages must not hardcode these values individually.

## Page → source mapping

| Docs area | Page(s) | Primary sources in the Pocketto repo |
|---|---|---|
| Getting started | all | `README.md`, `skills/pocket-help/SKILL.md`, `skills/pocket-help/references/{end-to-end-flow,skill-map}.md`, `cli/index.js` (help text), `cli/commands/setup-extensions.js` |
| Pipeline overview / approval gates / artifacts | `pipeline/index`, `pipeline/approval-gates`, `pipeline/artifacts` | the six pipeline `skills/pocket-*/SKILL.md`, `skills/pocket-help/references/end-to-end-flow.md`, real artifacts under `docs/pocket/plans/…` |
| Pitching | `pipeline/pitching` | `skills/pocket-pitching/SKILL.md` (+ its references) |
| Grinding | `pipeline/grinding` | `skills/pocket-grinding/SKILL.md` (+ `references/spec-template.md`, `architecture-validation.md`) |
| Planning | `pipeline/planning` | `skills/pocket-planning/SKILL.md` (+ `references/plan-template.md`, `task-decomposition.md`) |
| Structuring | `pipeline/structuring` | `skills/pocket-structuring/SKILL.md`, `cli/commands/structure.js` |
| Development | `pipeline/development` | `skills/pocket-development/SKILL.md` + `references/{iron-laws,entry-gate,pocket-packet,two-stage-review,phase-level-pass,phase-completion-notes,status-handling,parallel-group}.md` |
| Closing | `pipeline/closing` | `skills/pocket-closing/SKILL.md` + `references/{verdict-reconciliation,closeout-summary-template}.md` |
| Standalone skills | `skills/*` | the matching `skills/<name>/SKILL.md` (+ `pocket-education/references/{teaching-depth,hint-ladder}.md`) |
| Core & Enterprise | all | `skills/pocket-enterprise/SKILL.md` + `references/{onboarding,lifecycle-contract,issue-reconciliation,phase-reconciliation}.md`, `skills/create-pr/SKILL.md`, `surfaces.json`, `CHANGELOG.md` (4.0.0–4.2.2), `cli/index.js` |
| CLI reference | `reference/cli` | `cli/index.js` (HELP text = authoritative command surface) |
| Configuration | `reference/configuration` | `skills/pocket-init/SKILL.md`, `cli/commands/edu.js`, `cli/commands/mode.js`, `README.md` |
| Generated files | `reference/files` | stage SKILL.md save-path sections, `cli/commands/{structure,log}.js`, real `docs/pocket/**` tree |
| Pocket Packets | `reference/pocket-packets` | `skills/pocket-development/references/pocket-packet.md` |
| Plan structure | `reference/plan-structure` | `skills/pocket-planning/references/plan-template.md`, `cli/commands/structure.js` |
| Review reports | `reference/review-reports` | `skills/pocket-development/references/{two-stage-review,review-report-template,phase-level-pass}.md`, `skills/pocket-closing/references/verdict-reconciliation.md` |
| Lifecycle state | `reference/lifecycle-state` | `cli/commands/log.js`, `cli/lib/logjson.js`, `cli/lib/lifecycle-store.js`, real `docs/pocket/plans/…/log.json` |
| Release surfaces | `reference/release-surfaces` | `surfaces.json`, `scripts/build-surfaces.js` |
| Troubleshooting | `reference/troubleshooting` | `README.md` (troubleshooting + recovery), `CHANGELOG.md`, error codes in `cli/**` and `enterprise/**`, `skills/pocket-enterprise/references/*` |
| FAQ / Glossary | `reference/faq`, `reference/glossary` | cross-reference of the above |
| Contributing | all | `package.json`, `test/` listing, `rebuild-skills.sh`, `surfaces.json`, `.claude-plugin/*`, `LICENSE` |

## Update procedure when Pocketto releases

1. Update the reference checkout to the new release; record the new commit SHA.
2. Diff the sources above against their pages — especially `cli/index.js` help text,
   `surfaces.json`, lifecycle contract references, and the compatibility matrix.
3. Update `lib/site.ts` (version, SHA, protocol versions).
4. Grep the content for the old version string: `content/`, `app/`, `components/`, `README`.
5. Re-run the quality gates (build, typecheck, lint, link check).
