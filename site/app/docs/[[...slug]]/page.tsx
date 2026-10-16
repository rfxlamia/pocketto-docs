import { DocsBody, DocsDescription, DocsPage, DocsTitle } from 'fumadocs-ui/layouts/docs/page';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { createRelativeLink } from 'fumadocs-ui/mdx';
import { alt as ogAlt, size as ogSize } from '@/app/opengraph-image';
import { getMDXComponents } from '@/components/mdx';
import { pageLastCommitDate } from '@/lib/git-date';
import { POCKETTO, SITE } from '@/lib/site';
import { source } from '@/lib/source';

export default async function Page(props: PageProps<'/docs/[[...slug]]'>) {
  const params = await props.params;
  const page = source.getPage(params.slug);
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
            a: createRelativeLink(source, page),
          })}
        />
      </DocsBody>
    </DocsPage>
  );
}

type DocPage = NonNullable<ReturnType<typeof source.getPage>>;

/** TechArticle plus a BreadcrumbList built from the parent section index pages. */
function JsonLd({ page }: { page: DocPage }) {
  const author = { '@type': 'Person', name: SITE.repoOwner, url: SITE.repo };
  const crumbs = page.slugs.map((_, i) => source.getPage(page.slugs.slice(0, i + 1))).filter((p) => p !== undefined);
  const data: object[] = [
    {
      '@context': 'https://schema.org',
      '@type': 'TechArticle',
      headline: page.data.seoTitle ?? page.data.title,
      description: page.data.description,
      url: `${SITE.url}${page.url}`,
      dateModified: pageLastCommitDate(page)?.toISOString(),
      inLanguage: 'en',
      author,
      publisher: author,
      isPartOf: { '@type': 'WebSite', name: SITE.name, url: SITE.url },
      about: { '@type': 'SoftwareApplication', name: SITE.name, softwareVersion: POCKETTO.version },
    },
  ];
  // The docs root alone is a one-item trail, which is not a breadcrumb.
  if (crumbs.length > 0) {
    data.push({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [{ name: 'Docs', url: '/docs' }, ...crumbs.map((p) => ({ name: p.data.title, url: p.url }))].map(
        (item, i) => ({ '@type': 'ListItem', position: i + 1, name: item.name, item: `${SITE.url}${item.url}` }),
      ),
    });
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(props: PageProps<'/docs/[[...slug]]'>): Promise<Metadata> {
  const params = await props.params;
  const page = source.getPage(params.slug);
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
