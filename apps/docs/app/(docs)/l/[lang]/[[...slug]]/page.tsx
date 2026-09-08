/* @proprietary license */

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  type ComponentProps,
  type ComponentType,
  type FC,
  type ReactNode,
  type JSX,
} from 'react';
import * as Twoslash from 'fumadocs-twoslash/ui';
import { Callout } from '@/components/docs/docs-callout';
import { TypeTable } from 'fumadocs-ui/components/type-table';
import * as Preview from '@/components/preview';
import { createMetadata, getDocsSiteOrigin } from '@/lib/utils/metadata';
import { source, type Page as DocsPageModel } from '@/lib/utils/source';
import { parseDocsLang, setDocsLocale } from '@/lib/utils/docs-locale';
import {
  buildDocsAlternates,
  buildDocsMarkdownUrl,
} from '@/lib/utils/docs-routing';
import type { Language } from '@/lib/i18n/config';
import { Wrapper } from '@/components/preview/wrapper';
import type { MDXComponents } from 'mdx/types';
import { getMDXComponents } from '@/mdx-components';
import Link from 'fumadocs-core/link';
import { AutoTypeTable } from 'fumadocs-typescript/ui';
import { createGenerator } from 'fumadocs-typescript';
import { TOCItemType } from 'fumadocs-core/toc';
import { getPageTreePeers } from 'fumadocs-core/page-tree';
import { Card, Cards } from 'fumadocs-ui/components/card';
import { LLMCopyButton, ViewOptions } from '@/components/preview/page-actions';
import * as path from 'node:path';
import { Banner } from 'fumadocs-ui/components/banner';
import { Installation } from '@/components/preview/installation';
import { Customisation } from '@/components/preview/customisation';
import { FaqPageJsonLd } from '@/components/seo/faq-page-json-ld';
import { BRAND_FAQ } from '@/lib/seo/brand-facts';
import { DocsPage } from 'fumadocs-ui/page';
import { asJsonValue, isString, type JsonValue } from '@lomi./shared';
import { DocsTwinLink } from '@/components/docs/docs-twin-link';
import { DocsApiTryIt } from '@/components/docs/docs-api-tryit';
import { DocsPageFooter } from '@/components/docs/docs-page-footer';
import { findMcpTwin } from '@/lib/mcp-twins';

type CompiledDocsPageData = {
  body: ComponentType<{ components?: MDXComponents }>;
  toc: TOCItemType[];
  lastModified?: Date | string | number;
  index?: boolean;
};

function compiledDocsPageData(
  data: DocsPageModel['data'],
): CompiledDocsPageData {
  return data as DocsPageModel['data'] & CompiledDocsPageData;
}

/** `/` 301s here in `next.config.mjs`; there is no root index page. */
const DEFAULT_DOC_SLUG = ['start', 'overview'] as const;

function effectiveSlug(slug: string[] | undefined): string[] {
  if (slug && slug.length > 0) return slug;
  return [...DEFAULT_DOC_SLUG];
}

function getFallbackLanguage(locale: Language): Language {
  return locale === 'fr' ? 'en' : 'fr';
}

function resolvePageForLocale(slug: string[], locale: Language) {
  const primary = source.getPage(slug, locale);
  if (primary) return { page: primary, resolvedLocale: locale };

  const fallbackLocale = getFallbackLanguage(locale);
  const fallback = source.getPage(slug, fallbackLocale);
  if (fallback) return { page: fallback, resolvedLocale: fallbackLocale };

  return { page: null, resolvedLocale: locale };
}

function PreviewRenderer({ preview }: { preview: string }): ReactNode {
  if (preview && preview in Preview) {
    // SAFETY: Boundary value matches the asserted domain type at this call site.
    const Comp = Preview[preview as keyof typeof Preview];
    return <Comp />;
  }

  return null;
}

const generator = createGenerator();

export const revalidate = false;

function serializeStructuredData(value: JsonValue): string {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string; slug?: string[] }>;
}) {
  const resolvedParams = await params;
  const slug = effectiveSlug(resolvedParams.slug);
  const locale = parseDocsLang(resolvedParams.lang);
  setDocsLocale(locale);
  const { page, resolvedLocale } = resolvePageForLocale(slug, locale);

  if (!page) notFound();

  const pageData = compiledDocsPageData(page.data);
  const preview =
    'preview' in page.data && isString(page.data.preview)
      ? page.data.preview
      : undefined;
  const Mdx = pageData.body;
  const toc = pageData.toc;
  const lastModified = pageData.lastModified;
  const origin = getDocsSiteOrigin();
  const pagePath = page.url.startsWith('/') ? page.url : `/${page.url}`;
  const canonicalUrl = `${origin}${pagePath}`;
  const docsHomeUrl = `${origin}/${DEFAULT_DOC_SLUG.join('/')}`;
  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'TechArticle',
      headline: page.data.title ?? '',
      description: page.data.description ?? '',
      inLanguage: resolvedLocale,
      url: canonicalUrl,
      mainEntityOfPage: canonicalUrl,
      publisher: {
        '@type': 'Organization',
        name: 'lomi.',
        url: 'https://lomi.africa',
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'lomi. docs',
          item: docsHomeUrl,
        },
        ...(canonicalUrl === docsHomeUrl
          ? []
          : [
              {
                '@type': 'ListItem',
                position: 2,
                name: page.data.title,
                item: canonicalUrl,
              },
            ]),
      ],
    },
  ];
  const isOverview =
    slug.length === DEFAULT_DOC_SLUG.length &&
    slug.every((part, index) => part === DEFAULT_DOC_SLUG[index]);
  const method =
    'method' in page.data && isString(page.data.method)
      ? page.data.method
      : undefined;
  const operationPath =
    'path' in page.data && isString(page.data.path)
      ? page.data.path
      : undefined;
  const mcpTwin =
    method && operationPath ? findMcpTwin(method, operationPath) : undefined;
  return (
    <>
      {isOverview ? <FaqPageJsonLd items={BRAND_FAQ} /> : null}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeStructuredData(asJsonValue(structuredData)),
        }}
      />
      <DocsPage
        toc={toc.filter((item) => item.depth === 2)}
        lastUpdate={lastModified ? new Date(lastModified) : undefined}
        tableOfContent={{
          style: 'clerk',
        }}
        slots={{ footer: DocsPageFooter }}
      >
        <div className="docs-page-header">
          <div className="docs-page-header-main">
            <h1 className="docs-page-title font-semibold">{page.data.title}</h1>
            <p className="docs-page-description">{page.data.description}</p>
            {mcpTwin ? <DocsTwinLink twin={mcpTwin} locale={locale} /> : null}
          </div>
          <div className="docs-page-actions">
            <LLMCopyButton markdownUrl={buildDocsMarkdownUrl(page.url)} />
            <ViewOptions
              markdownUrl={buildDocsMarkdownUrl(page.url)}
              githubUrl={`https://github.com/lomiafrica/lomi./tree/main/apps/docs/content/docs/${page.path}`}
            />
          </div>
        </div>
        <div className="prose flex-1 text-fd-foreground/80">
          {method && operationPath ? (
            <DocsApiTryIt
              method={method}
              path={operationPath}
              locale={locale}
            />
          ) : null}
          {preview ? <PreviewRenderer preview={preview} /> : null}
          <Mdx
            components={getMDXComponents({
              ...Twoslash,
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              a: ({ href, children, ...props }: any): JSX.Element => {
                const resolvedHref = isString(href) ? href : '';
                const found = source.getPageByHref(resolvedHref, {
                  dir: path.dirname(page.path),
                  language: resolvedLocale,
                });

                if (!found) {
                  return (
                    <Link href={resolvedHref} {...props}>
                      {children}
                    </Link>
                  );
                }

                const targetHref = found.hash
                  ? `${found.page.url}#${found.hash}`
                  : found.page.url;
                return (
                  <Link href={targetHref} {...props}>
                    {children}
                  </Link>
                );
              },
              Banner,
              TypeTable,
              AutoTypeTable: (props) => (
                <AutoTypeTable generator={generator} {...props} />
              ),
              Wrapper,
              // SAFETY: Callout accepts blockquote props used by MDX blockquotes.
              blockquote: Callout as FC<ComponentProps<'blockquote'>>,
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              DocsCategory: ({ url }: any): JSX.Element => {
                return <DocsCategory url={url ?? page.url} locale={locale} />;
              },
              Installation,
              Customisation,
            })}
          />
          {pageData.index ? (
            <DocsCategory url={page.url} locale={resolvedLocale} />
          ) : null}
        </div>
      </DocsPage>
    </>
  );
}

function DocsCategory({ url, locale }: { url: string; locale: Language }) {
  const peers = getPageTreePeers(source.getPageTree(locale), url);
  const peersArray = Array.isArray(peers) ? peers : [];

  if (peersArray.length === 0) return null;

  return (
    <div className="not-prose my-5">
      <Cards className="gap-3">
        {peersArray.map((peer) => (
          <Card key={peer.url} title={peer.name} href={peer.url}>
            {peer.description}
          </Card>
        ))}
      </Cards>
    </div>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug?: string[] }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = effectiveSlug(resolvedParams.slug);
  const locale = parseDocsLang(resolvedParams.lang);
  setDocsLocale(locale);
  const { page } = resolvePageForLocale(slug, locale);
  if (!page) notFound();

  const description =
    page.data.description ?? 'The library for building documentation sites';

  const origin = getDocsSiteOrigin();
  const ogPath = [locale, ...page.slugs, 'image.png'].join('/');
  const image = {
    url: `${origin}/og/${ogPath}`,
    width: 1200,
    height: 630,
  };

  const canonicalPath = page.url.startsWith('/') ? page.url : `/${page.url}`;

  return createMetadata({
    title: page.data.title,
    description,
    alternates: buildDocsAlternates(canonicalPath),
    openGraph: {
      url: `${origin}${canonicalPath}`,
      locale: locale === 'fr' ? 'fr_FR' : 'en_US',
      alternateLocale: [locale === 'fr' ? 'en_US' : 'fr_FR'],
      type: 'article',
      images: [image],
    },
    twitter: {
      images: [image],
    },
  });
}

export const dynamicParams = false;
export const dynamic = 'error';

export function generateStaticParams() {
  const slugs = new Map<string, string[]>();
  for (const locale of ['en', 'fr'] as const) {
    for (const page of source.getPages(locale)) {
      if ((page.slugs?.length ?? 0) === 0) continue;
      slugs.set(page.slugs.join('/'), page.slugs);
    }
  }
  const params: { lang: Language; slug: string[] }[] = [];
  for (const lang of ['en', 'fr'] as const) {
    for (const slug of slugs.values()) {
      params.push({ lang, slug });
    }
  }
  return params;
}
