import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/site';
import { source } from '@/lib/source';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = source.getPages().map((page) => ({
    url: `${SITE.url}${page.url}`,
    lastModified: new Date(POCKETTO_RELEASE_DATE),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [
    { url: SITE.url, changeFrequency: 'weekly' as const, priority: 1 },
    { url: `${SITE.url}/docs`, changeFrequency: 'monthly' as const, priority: 0.9 },
    ...pages,
  ];
}

const POCKETTO_RELEASE_DATE = '2026-10-16';
