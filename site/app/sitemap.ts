import { execFileSync } from 'node:child_process';
import path from 'node:path';
import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/site';
import { source } from '@/lib/source';

export const dynamic = 'force-static';

const CONTENT_DIR = path.join(process.cwd(), 'content/docs');

/**
 * Last commit date of a file, or undefined when git or history is unavailable
 * (e.g. a tarball deploy). An omitted lastmod beats a fabricated one.
 */
function lastCommitDate(file: string): Date | undefined {
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

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = source.getPages().map((page) => ({
    url: `${SITE.url}${page.url}`,
    lastModified: lastCommitDate(page.absolutePath ?? path.join(CONTENT_DIR, page.path)),
    changeFrequency: 'monthly' as const,
    priority: page.url === '/docs' ? 0.9 : 0.7,
  }));

  return [
    {
      url: SITE.url,
      lastModified: lastCommitDate(path.join(process.cwd(), 'app/page.tsx')),
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
    ...pages,
  ];
}
