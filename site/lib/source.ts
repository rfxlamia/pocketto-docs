import { defineDocs } from 'fumadocs-mdx/macro';
import { loader } from 'fumadocs-core/source';
import { pageSchema } from 'fumadocs-core/source/schema';

const schema = pageSchema.extend({
  // Search-result title when `title` (also the H1 and sidebar label) is too terse to rank.
  seoTitle: pageSchema.shape.title.optional(),
  // Emit FAQPage JSON-LD from every `##` heading that ends in "?".
  faq: pageSchema.shape.full,
});

const docs = defineDocs({
  dir: 'content/docs',
  docs: { schema },
});

const caseStudies = defineDocs({
  dir: 'content/case-studies',
  docs: { schema },
});

export const source = loader({
  baseUrl: '/docs',
  source: docs.toFumadocsSource(),
});

/** Real projects built with Pocketto. Kept out of the docs tree and its search index. */
export const caseStudySource = loader({
  baseUrl: '/case-studies',
  source: caseStudies.toFumadocsSource(),
});
