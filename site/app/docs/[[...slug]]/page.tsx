import { DocsBody, DocsDescription, DocsPage, DocsTitle } from 'fumadocs-ui/layouts/docs/page';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { createRelativeLink } from 'fumadocs-ui/mdx';
import { alt as ogAlt, size as ogSize } from '@/app/opengraph-image';
import { getMDXComponents } from '@/components/mdx';
import { SITE } from '@/lib/site';
import { source } from '@/lib/source';

export default async function Page(props: PageProps<'/docs/[[...slug]]'>) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const MDX = page.data.body;

  return (
    <DocsPage toc={page.data.toc} full={page.data.full}>
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
