import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { SITE } from '@/lib/site';
import { PocketMark } from '@/components/site/pocket-mark';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <span className="inline-flex items-center gap-2.5">
          <PocketMark className="size-[22px]" />
          <span className="font-display text-[17px] font-semibold tracking-tight">Pocketto</span>
        </span>
      ),
    },
    links: [
      { text: 'Docs', url: '/docs' },
      { text: 'Pipeline', url: '/docs/pipeline' },
      { text: 'Skills', url: '/docs/skills' },
      { text: 'GitHub', url: SITE.repo, external: true },
    ],
  };
}
