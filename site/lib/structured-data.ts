import type { StructuredData } from 'fumadocs-core/mdx-plugins/remark-structure';

/**
 * FAQPage JSON-LD from a page's `##` headings that end in "?", with the
 * paragraphs under each heading as the answer. Undefined when none qualify.
 */
export function faqJsonLd({ headings, contents }: StructuredData): object | undefined {
  const mainEntity = headings
    .filter((h) => h.content.trim().endsWith('?'))
    .map((h) => ({
      '@type': 'Question',
      name: h.content.trim(),
      acceptedAnswer: {
        '@type': 'Answer',
        text: contents
          .filter((c) => c.heading === h.id)
          // structuredData keeps inline markdown; schema.org answers are plain text.
          .map((c) => c.content.replace(/\*\*|`/g, '').trim())
          .join('\n\n'),
      },
    }))
    .filter((q) => q.acceptedAnswer.text.length > 0);
  return mainEntity.length > 0 ? { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity } : undefined;
}
