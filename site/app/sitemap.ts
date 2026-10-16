import path from 'node:path';
import type { MetadataRoute } from 'next';
import { lastCommitDate, pageLastCommitDate } from '@/lib/git-date';
import { SITE } from '@/lib/site';
import { caseStudySource, source } from '@/lib/source';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [...source.getPages(), ...caseStudySource.getPages()].map((page) => ({
    url: `${SITE.url}${page.url}`,
    lastModified: pageLastCommitDate(page),
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
