import { describe, expect, test } from 'bun:test';
import { PIPELINE_STAGES } from '../lib/site';
import { INITIAL_WORKFLOW_STATE, WORKFLOW_GUIDANCE, workflowReducer } from '../lib/workflow';

describe('workflow entry explorer', () => {
  test('each documented entry point has guidance and a real destination', () => {
    expect(Object.keys(WORKFLOW_GUIDANCE)).toEqual(PIPELINE_STAGES.map((stage) => stage.id));
    for (const [index, stage] of PIPELINE_STAGES.entries()) {
      const guidance = WORKFLOW_GUIDANCE[stage.id];
      expect(guidance.situation.length).toBeGreaterThan(0);
      expect(guidance.outputItems.length).toBeGreaterThan(0);
      expect(guidance.exampleInput).toBeDefined();
      expect(guidance.exampleInput.text.length).toBeGreaterThan(0);
      expect(guidance.receiver).toBe(PIPELINE_STAGES[index + 1]?.name ?? 'Phase record');
    }
  });

  test('choosing a project condition selects its corresponding stage', () => {
    const next = workflowReducer(INITIAL_WORKFLOW_STATE, { type: 'select', index: 3, input: 'pointer' });
    expect(PIPELINE_STAGES[next.active].name).toBe('Structuring');
    expect(next.phase).toBe('ready');
  });

  test('revealing an example shows the selected stage output without selecting its successor', () => {
    const result = workflowReducer(INITIAL_WORKFLOW_STATE, { type: 'show-output', input: 'pointer' });
    expect(result).toBeDefined();
    expect(result.phase).toBe('output');
    expect(result.active).toBe(0);
    expect(workflowReducer(result, { type: 'show-output', input: 'pointer' })).toEqual(result);
  });

  test('changing stages clears the previous example output', () => {
    const next = workflowReducer({ ...INITIAL_WORKFLOW_STATE, phase: 'output' }, { type: 'select', index: 4, input: 'keyboard' });
    expect(next.active).toBe(4);
    expect(next.phase).toBe('ready');
    expect(next.input).toBe('keyboard');
  });

  test('reselecting the current condition preserves the demonstration', () => {
    const state = { ...INITIAL_WORKFLOW_STATE, phase: 'output' };
    expect(workflowReducer(state, { type: 'select', index: 0, input: 'pointer' })).toEqual(state);
  });

  test('finishing an output moves to the next stage with a fresh input', () => {
    let state = { ...INITIAL_WORKFLOW_STATE, phase: 'output' };
    for (const active of [1, 2, 3, 4, 5]) {
      state = workflowReducer(state, { type: 'next', input: 'pointer' });
      expect(state).toEqual({ active, phase: 'ready', input: 'pointer' });
      state = workflowReducer(state, { type: 'show-output', input: 'pointer' });
    }
    expect(workflowReducer(state, { type: 'next', input: 'pointer' })).toEqual(state);
  });

  test('next cannot skip a stage before its output is shown', () => {
    expect(workflowReducer(INITIAL_WORKFLOW_STATE, { type: 'next', input: 'keyboard' })).toEqual(INITIAL_WORKFLOW_STATE);
  });

  test('replay at the end of Closing starts the full demo from Pitching', () => {
    const next = workflowReducer({ active: 5, phase: 'output', input: 'pointer' }, { type: 'replay', input: 'keyboard' });
    expect(next).toEqual({ active: 0, phase: 'ready', input: 'keyboard' });
  });

  test('replay cannot reset an unfinished demo or a stage before Closing', () => {
    for (const state of [INITIAL_WORKFLOW_STATE, { active: 0, phase: 'output', input: 'pointer' }, { active: 5, phase: 'ready', input: 'keyboard' }]) {
      expect(workflowReducer(state, { type: 'replay', input: 'pointer' })).toEqual(state);
    }
  });

  test('invalid selections do not corrupt the active stage', () => {
    for (const index of [-1, 6, 1.5, NaN]) {
      expect(workflowReducer(INITIAL_WORKFLOW_STATE, { type: 'select', index, input: 'pointer' })).toEqual(INITIAL_WORKFLOW_STATE);
    }
  });
});
