import { SITE } from '@/lib/site';
import { POCKETTO } from '@/lib/site';
import { source } from '@/lib/source';

export const dynamic = 'force-static';

/**
 * llms.txt: a documentation index for AI-assisted discovery.
 * Lists every docs page with its title and one-line description.
 */
export function GET() {
  const pages = source
    .getPages()
    .sort((a, b) => a.url.localeCompare(b.url))
    .map((page) => `- [${page.data.title}](${SITE.url}${page.url}): ${page.data.description ?? ''}`);

  const body = `# ${SITE.name}

> ${SITE.name} ${POCKETTO.version} provides local-first structured AI coding workflows for Claude Code and Pi. Core works without GitHub; the optional Enterprise adapter consumes durable neutral lifecycle events and owns all remote reconciliation; opt-in Pocket Education keeps implementation human-owned. ${POCKETTO.skills.total} skills: a six-stage pipeline (${POCKETTO.skills.pipeline.join(', ')}) and standalone skills (${POCKETTO.skills.standalone.join(', ')}). MIT licensed, Node.js >= 18.

The site documents Pocketto ${POCKETTO.version} (repository: ${SITE.repo}, inspected commit ${POCKETTO.inspectedCommit}). Protocol boundaries are independently versioned: CONTRACT=${POCKETTO.protocol.contract}, PIPELINE=${POCKETTO.protocol.pipeline}, LIFECYCLE_SCHEMA=${POCKETTO.protocol.lifecycleSchema}, ADAPTER_CONTRACT=${POCKETTO.protocol.adapterContract}, SURFACE_MANIFEST=${POCKETTO.protocol.surfaceManifest}.

Core commits state and events locally. Core does not call gh, does not create or reconcile GitHub resources, does not merge pull requests, and does not close issues. Enterprise is explicit, optional, and fail-closed; create-pr is a user-triggered recorder. Merge and issue closure remain human-controlled.

## Documentation

${pages.join('\n')}
`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
    },
  });
}
