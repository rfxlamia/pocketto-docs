import { DocsBody, DocsDescription, DocsPage, DocsTitle } from 'fumadocs-ui/layouts/docs/page';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { createRelativeLink } from 'fumadocs-ui/mdx';
import { alt as ogAlt, size as ogSize } from '@/app/opengraph-image';
import { getMDXComponents } from '@/components/mdx';
import { pageLastCommitDate } from '@/lib/git-date';
import { SITE } from '@/lib/site';
import { caseStudySource } from '@/lib/source';
import { faqJsonLd } from '@/lib/structured-data';

export default async function Page(props: PageProps<'/case-studies/[[...slug]]'>) {
  const params = await props.params;
  const page = caseStudySource.getPage(params.slug);
  if (!page) notFound();

  const MDX = page.data.body;

  return (
    <DocsPage toc={page.data.toc} full={page.data.full}>
      <JsonLd page={page} />
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <DocsBody>
        <MDX
          components={getMDXComponents({
            a: createRelativeLink(caseStudySource, page),
          })}
        />
      </DocsBody>
    </DocsPage>
  );
}

type CaseStudyPage = NonNullable<ReturnType<typeof caseStudySource.getPage>>;

/** Article plus a two-level BreadcrumbList; the index page gets neither breadcrumb nor FAQ unless flagged. */
function JsonLd({ page }: { page: CaseStudyPage }) {
  const author = { '@type': 'Person', name: SITE.repoOwner, url: SITE.repo };
  const data: object[] = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: page.data.seoTitle ?? page.data.title,
      description: page.data.description,
      url: `${SITE.url}${page.url}`,
      dateModified: pageLastCommitDate(page)?.toISOString(),
      inLanguage: 'en',
      author,
      publisher: author,
      isPartOf: { '@type': 'WebSite', name: SITE.name, url: SITE.url },
      about: { '@type': 'SoftwareApplication', name: SITE.name },
    },
  ];
  if (page.slugs.length > 0) {
    data.push({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { name: 'Case studies', url: '/case-studies' },
        { name: page.data.title, url: page.url },
      ].map((item, i) => ({ '@type': 'ListItem', position: i + 1, name: item.name, item: `${SITE.url}${item.url}` })),
    });
  }
  const faq = page.data.faq ? faqJsonLd(page.data.structuredData) : undefined;
  if (faq) data.push(faq);
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

export async function generateStaticParams() {
  return caseStudySource.generateParams();
}

export async function generateMetadata(props: PageProps<'/case-studies/[[...slug]]'>): Promise<Metadata> {
  const params = await props.params;
  const page = caseStudySource.getPage(params.slug);
  if (!page) notFound();

  const image = { url: '/opengraph-image', width: ogSize.width, height: ogSize.height, alt: ogAlt };
  const title = page.data.seoTitle ?? page.data.title;

  return {
    // Skip the "| Pocketto" template suffix when the title already names the brand.
    title: title.includes(SITE.name) ? { absolute: title } : title,
    description: page.data.description,
    alternates: {
      canonical: page.url,
    },
    openGraph: {
      url: `${SITE.url}${page.url}`,
      siteName: SITE.name,
      title,
      description: page.data.description,
      type: 'article',
      images: [image],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: page.data.description,
      images: [image],
    },
  };
}
