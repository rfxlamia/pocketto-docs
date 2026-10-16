import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import type { ReactNode } from 'react';
import { SkipLink } from '@/components/site/skip-link';
import { baseOptions } from '@/lib/layout.shared';
import { caseStudySource } from '@/lib/source';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <SkipLink targetId="nd-page" />
      <DocsLayout tree={caseStudySource.getPageTree()} {...baseOptions()}>
        {children}
      </DocsLayout>
    </>
  );
}
