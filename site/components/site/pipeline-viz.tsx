'use client';

import Link from 'next/link';
import { ArrowDown, ArrowRight, Check, ChevronDown, ChevronRight, FileText, LockKeyhole, MessageSquare, RotateCcw } from 'lucide-react';
import { useEffect, useLayoutEffect, useReducer, useRef, type CSSProperties, type KeyboardEvent, type MouseEvent } from 'react';
import { PIPELINE_STAGES } from '@/lib/site';
import { INITIAL_WORKFLOW_STATE, WORKFLOW_GUIDANCE, workflowReducer, type StageGuidance } from '@/lib/workflow';

export function PipelineViz() {
  const [state, dispatch] = useReducer(workflowReducer, INITIAL_WORKFLOW_STATE);
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLElement>(null);
  const outputRef = useRef<HTMLElement>(null);
  const previousStage = useRef(state.active);
  const previousOutput = useRef({ active: state.active, phase: state.phase });
  const stage = PIPELINE_STAGES[state.active]!;
  const guidance: StageGuidance = WORKFLOW_GUIDANCE[stage.id];
  const isClosing = state.active === PIPELINE_STAGES.length - 1;
  const outputShown = state.phase === 'output';

  useEffect(() => {
    const direction = state.active > previousStage.current ? 1 : -1;
    const changed = previousStage.current !== state.active;
    previousStage.current = state.active;
    if (!changed || state.input === 'keyboard' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const animation = panelRef.current?.animate(
      [{ opacity: 0.4, transform: `translateX(${direction * 28}px)` }, { opacity: 1, transform: 'translateX(0)' }],
      { duration: 220, easing: 'cubic-bezier(0.23, 1, 0.32, 1)' },
    );
    return () => animation?.cancel();
  }, [state.active, state.input]);

  useLayoutEffect(() => {
    const previous = previousOutput.current;
    previousOutput.current = { active: state.active, phase: state.phase };
    if (previous.active !== state.active || previous.phase !== 'ready' || state.phase !== 'output'
      || state.input === 'keyboard' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const source = inputRef.current?.getBoundingClientRect();
    const destination = outputRef.current?.getBoundingClientRect();
    if (!source || !destination) return;
    const animation = outputRef.current?.animate(
      [
        { transform: `translate(${source.x - destination.x}px, ${source.y - destination.y}px)`, opacity: 0.2 },
        { transform: 'translate(0, 0)', opacity: 1 },
      ],
      { duration: 280, easing: 'cubic-bezier(0.77, 0, 0.175, 1)' },
    );
    return () => animation?.cancel();
  }, [state.active, state.phase, state.input]);

  function selectStage(index: number, input: 'pointer' | 'keyboard') {
    dispatch({ type: 'select', index, input });
  }

  function onOptionKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    let next: number;
    switch (event.key) {
      case 'ArrowDown': next = (state.active + 1) % PIPELINE_STAGES.length; break;
      case 'ArrowUp': next = (state.active - 1 + PIPELINE_STAGES.length) % PIPELINE_STAGES.length; break;
      case 'Home': next = 0; break;
      case 'End': next = PIPELINE_STAGES.length - 1; break;
      default: return;
    }
    event.preventDefault();
    selectStage(next, 'keyboard');
    optionRefs.current[next]?.focus();
  }

  function advanceDemo(event: MouseEvent<HTMLButtonElement>) {
    dispatch({
      type: outputShown ? (isClosing ? 'replay' : 'next') : 'show-output',
      input: event.detail === 0 ? 'keyboard' : 'pointer',
    });
  }

  return (
    <div className="workflow-explorer" data-input={state.input}>
      <div className="workflow-layout">
        <div className="workflow-picker">
          <h3 id="workflow-question">What do you have?</h3>
          <p>Choose the closest match.</p>
          <div
            className="workflow-options"
            role="tablist"
            aria-labelledby="workflow-question"
            aria-orientation="vertical"
            onKeyDown={onOptionKeyDown}
          >
            <span className="workflow-selection" aria-hidden="true" style={{ '--selected-stage': state.active } as CSSProperties} />
            {PIPELINE_STAGES.map((item, index) => {
              const entry = WORKFLOW_GUIDANCE[item.id];
              const selected = state.active === index;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  id={`workflow-option-${item.id}`}
                  aria-selected={selected}
                  aria-controls="workflow-recommendation"
                  tabIndex={selected ? 0 : -1}
                  ref={(element) => { optionRefs.current[index] = element; }}
                  onClick={(event) => selectStage(index, event.detail === 0 ? 'keyboard' : 'pointer')}
                  className="workflow-option"
                >
                  <span className="workflow-option-number" aria-hidden="true">{item.index}</span>
                  <span>
                    <span className="workflow-option-title">{entry.situation}</span>
                    <span className="workflow-option-detail">{entry.condition}</span>
                  </span>
                  <ChevronRight size={16} className="workflow-option-arrow" aria-hidden="true" />
                </button>
              );
            })}
          </div>
          <a className="workflow-jump" href="#workflow-recommendation">
            Your next step: <strong>{stage.name}</strong><ArrowDown size={16} aria-hidden="true" />
          </a>
          <Link className="workflow-offramp" href="/docs/getting-started/choosing-workflow">
            Small change or a bug? Find a focused workflow.
            <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </div>

        <div ref={panelRef} role="tabpanel" id="workflow-recommendation" aria-labelledby={`workflow-option-${stage.id}`} tabIndex={0} className="workflow-panel">
          <div className="workflow-stage-heading">
            <h3 className="display">{stage.name}</h3>
            <span className="workflow-stage-position">Stage {stage.index} of 06</span>
          </div>
          <p className="workflow-purpose">{guidance.purpose}</p>
          <p className="workflow-input"><strong>Bring</strong> {stage.receives.charAt(0).toLowerCase() + stage.receives.slice(1)}.</p>
          <Link className="workflow-guide" href={`/docs/${stage.slug}`}>
            Read the {stage.name} guide <ArrowRight size={16} aria-hidden="true" />
          </Link>

          <section className="workflow-demo" aria-labelledby="workflow-demo-title">
            <div className="workflow-demo-heading">
              <h4 id="workflow-demo-title">Input to output</h4>
              <span>Illustrative drag-and-drop example</span>
            </div>
            <p className="workflow-transformation" aria-label={`Input through ${stage.name} becomes output`}>
              <span>Input</span><ArrowRight size={14} aria-hidden="true" /><strong>{stage.name}</strong><ArrowRight size={14} aria-hidden="true" /><span>Output</span>
            </p>
            <div className="workflow-scene" data-phase={state.phase}>
              <article ref={inputRef} className="workflow-example-input" aria-label={`Example input for ${stage.name}`}>
                <div className="workflow-example-label"><MessageSquare size={17} aria-hidden="true" /><h5>Input for {stage.name}</h5></div>
                <blockquote>{guidance.exampleInput.text}</blockquote>
                {guidance.exampleInput.artifact && (
                  <p className="workflow-input-artifact"><span>{guidance.exampleInput.artifact.label}</span><code>{guidance.exampleInput.artifact.path}</code></p>
                )}
              </article>
              <div className="workflow-connector" aria-hidden="true">
                <ArrowRight className="workflow-arrow-horizontal" size={18} /><ArrowDown className="workflow-arrow-vertical" size={18} />
              </div>
              <div className="workflow-output-slot">
                <p className="workflow-output-placeholder" aria-hidden={outputShown}>The {stage.name} output arrives here.</p>
                <article ref={outputRef} className="workflow-document" aria-label={`Example output from ${stage.name}`} aria-hidden={!outputShown}>
                  <p className="workflow-example-label">Output from {stage.name}</p>
                  <div className="workflow-document-title"><FileText size={20} aria-hidden="true" /><h5>{guidance.artifact}</h5></div>
                  <code>{guidance.artifactPath}</code>
                  <ul className="workflow-output-items">{guidance.outputItems.map((item) => <li key={item}>{item}</li>)}</ul>
                </article>
              </div>
            </div>
            <div className="workflow-demo-footer">
              <div className="workflow-demo-status" role="status" aria-live="polite" aria-atomic="true">
                <span className="workflow-status-icon" data-phase={state.phase}>{outputShown ? <Check size={18} aria-hidden="true" /> : <ArrowRight size={18} aria-hidden="true" />}</span>
                <p>{outputShown ? (isClosing ? 'Closing example complete. Replay the demo from Pitching.' : `${stage.name} output is ready. Continue the example in ${guidance.receiver}.`) : `See what ${stage.name} produces from this request.`}</p>
              </div>
              <button type="button" className={`btn ${outputShown ? 'btn-outline' : 'btn-primary'} workflow-demo-action`} onClick={advanceDemo}>
                {outputShown && (isClosing ? <RotateCcw size={15} aria-hidden="true" /> : <ArrowRight size={15} aria-hidden="true" />)}
                {outputShown ? (isClosing ? 'Replay demo' : `Next: ${guidance.receiver}`) : `Run ${stage.name} example`}
              </button>
            </div>
            <details className="workflow-approval" key={stage.id}>
              <summary><LockKeyhole size={15} aria-hidden="true" /><span>Where you decide</span><ChevronDown size={15} aria-hidden="true" /></summary>
              <div>
                <h5>{guidance.gateTitle}</h5><p>{guidance.gateDetail}</p>
                <p><strong>{isClosing ? 'Record' : 'Next stage'}: {guidance.receiver}.</strong> {guidance.nextUse}</p>
              </div>
            </details>
            <p className="workflow-disclaimer">Illustrative only. No skills run and no project approvals are recorded.</p>
          </section>
        </div>
      </div>
      <div className="workflow-map">
        <p>Enter where you are.<br /><strong>Keep the whole picture.</strong></p>
        <ol aria-label="Pipeline order; the highlighted stage is being viewed">
          {PIPELINE_STAGES.map((item, index) => (
            <li key={item.id} aria-current={index === state.active ? 'true' : undefined}>
              <span>{item.index}</span><span>{item.name}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
