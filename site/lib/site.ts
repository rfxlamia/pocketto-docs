/**
 * Central product facts. Everything here is verified against the Pocketto
 * repository at the commit recorded in SOURCE-INVENTORY.md. Update this file
 * (and that inventory) together when Pocketto releases a new version — pages
 * must not hardcode these values individually.
 */
export const SITE = {
  name: 'Pocketto',
  url: 'https://pocketto.rfxlamia.xyz',
  repo: 'https://github.com/rfxlamia/pocketto',
  repoOwner: 'rfxlamia',
  repoName: 'pocketto',
  npmPackage: 'pocketto-pi',
  license: 'MIT',
  nodeRequirement: '>= 18',
} as const;

export const POCKETTO = {
  version: '4.2.2',
  releaseDate: '2026-10-16',
  inspectedCommit: '70b5bbe73b1fe6071b37e795ffd8505d05c0840c',
  protocol: {
    contract: 3,
    pipeline: 5,
    lifecycleSchema: 2,
    adapterContract: 2,
    surfaceManifest: 1,
  },
  skills: {
    pipeline: ['pocket-pitching', 'pocket-grinding', 'pocket-planning', 'pocket-structuring', 'pocket-development', 'pocket-closing'],
    standalone: [
      'pocket-help',
      'pocket-init',
      'pocket-education',
      'bug-hunting',
      'hotfix',
      'brand-design',
      'structured-research',
      'validate-plan',
      'create-pr',
    ],
    total: 15,
  },
  lifecycleStates: ['WAITING', 'REVIEW', 'DONE', 'BLOCKED'],
  lifecycleEvents: ['spec-approved', 'phase-complete', 'phase-closed', 'plan-closed'],
} as const;

export const INSTALL = {
  pi: ['pi install git:github.com/rfxlamia/pocketto', 'pi install npm:pocketto-pi'],
  claude: ['/plugin marketplace add rfxlamia/pocketto', '/plugin install pocketto@pocketto', '/reload-plugins'],
  piExtensions: 'npx pocketto-pi setup-extensions',
  piDoctor: 'npx pocketto-pi doctor',
} as const;

export const PIPELINE_STAGES = [
  {
    id: 'pocket-pitching',
    index: '01',
    name: 'Pitching',
    slug: 'pipeline/pitching',
    tagline: 'Explore the problem before it exists',
    receives: 'A rough idea — no clear problem statement yet',
    produces: 'A pitch exploration doc with a problem statement and 2–3 approach directions',
    gate: 'No auto-chain — you choose whether to continue to Grinding',
    next: 'The user decides: start Grinding, iterate, or stop here',
  },
  {
    id: 'pocket-grinding',
    index: '02',
    name: 'Grinding',
    slug: 'pipeline/grinding',
    tagline: 'Turn the problem into an approved spec',
    receives: 'A clear problem (optionally a pitch doc from Pitching)',
    produces: 'A BDD spec with Given/When/Then acceptance criteria in docs/pocket/spec/',
    gate: 'Edge-case-hunter review of the scenarios; user approval before handoff',
    next: 'Hands the approved spec to Planning',
  },
  {
    id: 'pocket-planning',
    index: '03',
    name: 'Planning',
    slug: 'pipeline/planning',
    tagline: 'Turn the spec into a TDD execution plan',
    receives: 'The approved spec and its acceptance criteria',
    produces: 'An execution plan of full Pocket Packets, dry-run validated by the CLI',
    gate: 'Independent spec-reviewer subagent; plan approval never authorizes implementation',
    next: 'Routes every plan to Structuring',
  },
  {
    id: 'pocket-structuring',
    index: '04',
    name: 'Structuring',
    slug: 'pipeline/structuring',
    tagline: 'Decompose the plan into task files',
    receives: 'The execution plan path',
    produces: 'execution-plan/index.md, one file per task, phase manifests when phased',
    gate: 'The CLI owns decomposition; execution needs separate approval',
    next: 'Hands phases to Development one at a time',
  },
  {
    id: 'pocket-development',
    index: '05',
    name: 'Development',
    slug: 'pipeline/development',
    tagline: 'Execute tasks under contract and audit',
    receives: 'Structured task files and the execution log',
    produces: 'Reviewed commits, per-task verdicts, a phase-level pass, a durable phase handoff',
    gate: 'No packet, no spawn. In-loop audit per task; the phase leaves only as REVIEW',
    next: 'Closing reconciles the phase when you authorize closeout',
  },
  {
    id: 'pocket-closing',
    index: '06',
    name: 'Closing',
    slug: 'pipeline/closing',
    tagline: 'Reconcile verdicts and close, on your word',
    receives: 'log.json, task verdict artifacts, phase notes',
    produces: 'closeout.md entries, advanced phases, a closed plan and plan-closed event',
    gate: 'A passing verdict alone is not authorization — you must request closeout',
    next: 'All phases DONE → log close and the final summary',
  },
] as const;
