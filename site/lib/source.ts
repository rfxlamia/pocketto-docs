import { defineDocs } from 'fumadocs-mdx/macro';
import { loader } from 'fumadocs-core/source';
import { pageSchema } from 'fumadocs-core/source/schema';

const docs = defineDocs({
  dir: 'content/docs',
  docs: {
    schema: pageSchema.extend({
      // Search-result title when `title` (also the H1 and sidebar label) is too terse to rank.
      seoTitle: pageSchema.shape.title.optional(),
      // Emit FAQPage JSON-LD from every `##` heading that ends in "?".
      faq: pageSchema.shape.full,
    }),
  },
});

export const source = loader({
  baseUrl: '/docs',
  source: docs.toFumadocsSource(),
});
