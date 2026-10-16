import { execFileSync } from 'node:child_process';
import path from 'node:path';
import type { Page } from 'fumadocs-core/source';

/**
 * Last commit date of a file, or undefined when git or history is unavailable
 * (e.g. a tarball deploy). An omitted date beats a fabricated one.
 */
export function lastCommitDate(file: string): Date | undefined {
  try {
    const iso = execFileSync('git', ['log', '-1', '--format=%cI', '--', file], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    return iso ? new Date(iso) : undefined;
  } catch {
    return undefined;
  }
}

export function pageLastCommitDate(page: Page): Date | undefined {
  return lastCommitDate(page.absolutePath ?? path.join(process.cwd(), 'content/docs', page.path));
}
