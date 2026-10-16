import { PIPELINE_STAGES } from './site';

export type StageId = (typeof PIPELINE_STAGES)[number]['id'];
export type WorkflowState = {
  active: number;
  phase: 'ready' | 'output';
  input: 'pointer' | 'keyboard';
};
export type WorkflowAction =
  | { type: 'select'; index: number; input: WorkflowState['input'] }
  | { type: 'show-output' | 'replay'; input: WorkflowState['input'] };

export type StageGuidance = {
  situation: string;
  condition: string;
  purpose: string;
  artifact: string;
  artifactPath: string;
  exampleInput: {
    text: string;
    artifact?: { label: string; path: string };
  };
  outputItems: readonly string[];
  receiver: string;
  gateTitle: string;
  gateDetail: string;
  nextUse: string;
};

export const WORKFLOW_GUIDANCE = {
  'pocket-pitching': {
    situation: 'A rough idea',
    condition: 'I am still figuring out the problem.',
    purpose: 'Turn a rough idea into a clear problem statement and a few directions worth exploring.',
    artifact: 'Pitch exploration',
    artifactPath: 'pitch-exploration.md',
    exampleInput: { text: 'I want drag and drop that works well for reordering a list.' },
    outputItems: ['Problem: reorder items reliably', 'Candidate A: dnd-kit', 'Candidate B: native drag events'],
    receiver: 'Grinding',
    gateTitle: 'You choose what happens next.',
    gateDetail: 'Continue to Grinding, explore the idea further, or stop here. Pitching never starts Grinding on its own.',
    nextUse: 'Grinding can read the pitch as context for discovering requirements. The pitch is not an approved spec.',
  },
  'pocket-grinding': {
    situation: 'A clear problem',
    condition: 'I know the problem. I need requirements.',
    purpose: 'Define scope, boundaries, and acceptance criteria before choosing how to build.',
    artifact: 'BDD specification',
    artifactPath: 'docs/pocket/spec/',
    exampleInput: {
      text: 'I want to build drag and drop with dnd-kit.',
      artifact: { label: 'Or bring the pitch document', path: 'pitch-exploration.md' },
    },
    outputItems: ['Given a list in its original order', 'When an item is dropped in a new position', 'Then the list reflects the new order'],
    receiver: 'Planning',
    gateTitle: 'You approve the specification.',
    gateDetail: 'An independent edge-case review checks the scenarios. Your approval is required before the spec moves to Planning.',
    nextUse: 'Planning uses the specification and acceptance criteria after you approve them.',
  },
  'pocket-planning': {
    situation: 'An approved spec',
    condition: 'The requirements are approved. I need a plan.',
    purpose: 'Map the approved spec to files, dependencies, and test-first tasks with clear contracts.',
    artifact: 'TDD execution plan',
    artifactPath: 'execution-plan.md',
    exampleInput: {
      text: 'Create a test-first implementation plan from the approved drag-and-drop spec.',
      artifact: { label: 'Approved specification', path: 'docs/pocket/spec/' },
    },
    outputItems: ['Map drag, drop, and cancel states', 'Define test-first tasks and dependencies', 'Include keyboard and pointer checks'],
    receiver: 'Structuring',
    gateTitle: 'Approve the plan. Execution is separate.',
    gateDetail: 'An independent spec review and CLI dry-run validate the plan. Your plan approval allows Structuring, not implementation.',
    nextUse: 'Structuring reads the validated execution plan and decomposes it into task files.',
  },
  'pocket-structuring': {
    situation: 'An execution plan',
    condition: 'The plan is ready. I need executable tasks.',
    purpose: 'Decompose the plan into an execution index, task files, and phase manifests when needed.',
    artifact: 'Structured task files',
    artifactPath: 'execution-plan/index.md',
    exampleInput: {
      text: 'Break the drag-and-drop execution plan into task files.',
      artifact: { label: 'Execution plan', path: 'execution-plan.md' },
    },
    outputItems: ['Task: test and implement reordering', 'Task: cover cancel and invalid drops', 'Task: audit keyboard interactions'],
    receiver: 'Development',
    gateTitle: 'You authorize execution.',
    gateDetail: 'The CLI owns decomposition. Development starts only when your instructions authorize execution.',
    nextUse: 'Development uses the structured tasks and execution log once execution is authorized.',
  },
  'pocket-development': {
    situation: 'Structured tasks',
    condition: 'The task files are ready. I want to build.',
    purpose: 'Implement each task under contract, with independent audits and a phase-level review.',
    artifact: 'Reviewed phase handoff',
    artifactPath: 'reviews/',
    exampleInput: {
      text: 'Implement the structured drag-and-drop tasks and run their reviews.',
      artifact: { label: 'Structured tasks and execution log', path: 'execution-plan/index.md + log.json' },
    },
    outputItems: ['Drag-and-drop implementation reviewed', 'Task verdicts and phase notes recorded', 'Passing phase status: REVIEW'],
    receiver: 'Closing',
    gateTitle: 'A pass does not close the phase.',
    gateDetail: 'Task audits and a phase-level pass leave the phase in REVIEW. Closing requires your authorization for closeout.',
    nextUse: 'Closing reconciles fresh verdicts against the execution log when you request closeout.',
  },
  'pocket-closing': {
    situation: 'A passing phase',
    condition: 'The phase passed review. I want to close it.',
    purpose: 'Reconcile verdicts, advance a passing phase, and leave a readable closeout record.',
    artifact: 'Closeout record',
    artifactPath: 'closeout.md',
    exampleInput: {
      text: 'Close out the passing drag-and-drop phase.',
      artifact: { label: 'Execution log and review artifacts', path: 'log.json + reviews/' },
    },
    outputItems: ['Passing phase verdicts reconciled', 'Drag-and-drop closeout appended', 'Phase status: DONE'],
    receiver: 'Phase record',
    gateTitle: 'You request closeout explicitly.',
    gateDetail: 'Closing refuses missing or stale verdicts. It advances only passing phases and closes the plan only after all phases are DONE.',
    nextUse: 'The phase closeout stays on disk. The plan closes only when every phase is DONE.',
  },
} as const satisfies Record<StageId, StageGuidance>;
export const INITIAL_WORKFLOW_STATE: WorkflowState = { active: 0, phase: 'ready', input: 'keyboard' };

export function workflowReducer(state: WorkflowState, action: WorkflowAction): WorkflowState {
  switch (action.type) {
    case 'select':
      if (!Number.isInteger(action.index) || action.index < 0 || action.index >= PIPELINE_STAGES.length || action.index === state.active) {
        return state;
      }
      return { active: action.index, phase: 'ready', input: action.input };
    case 'show-output':
      return state.phase === 'ready' ? { ...state, phase: 'output', input: action.input } : state;
    case 'replay':
      return { ...state, phase: 'ready', input: action.input };
  }
}
