/* @proprietary license */

import { getBreadcrumbItems } from 'fumadocs-core/breadcrumb';
import { isJsonObject, isString, type JsonValue } from '@lomi./shared';
import { source } from '@/lib/utils/source';
import { aliasesForPath } from '@/lib/search/aliases';
import { searchTagFromSection } from '@/lib/search/tags';
import type { Language } from '@/lib/i18n/config';

export type DocsSearchDocument = {
  id: string;
  page_id: string;
  title: string;
  description?: string;
  url: string;
  tag?: string;
  locale: Language;
  aliases: string[];
  structured: {
    headings: string[];
    contents: string[];
  };
  breadcrumbs: string[];
};

type HeadingLike = {
  id?: string;
};

type ContentLike = {
  content?: string;
};

function headingId(heading: HeadingLike | JsonValue): string {
  if (isJsonObject(heading) && isString(heading.id)) return heading.id;
  if (isString(heading)) return heading;
  return '';
}

function contentText(content: ContentLike | JsonValue): string {
  if (isJsonObject(content)) {
    return isString(content.content) ? content.content.trim() : '';
  }
  if (isString(content)) return content.trim();
  return '';
}

function toHeadingStrings(
  headings: readonly HeadingLike[] | JsonValue | undefined,
): string[] {
  if (!Array.isArray(headings)) return [];
  return headings.map(headingId).filter((h) => h.length > 0);
}

function toContentStrings(
  contents: readonly ContentLike[] | JsonValue | undefined,
): string[] {
  if (!Array.isArray(contents)) return [];
  return contents.map(contentText).filter((c) => c.length > 0);
}

const LOCALES: readonly Language[] = ['en', 'fr'];

/** Orama Cloud + local-search documents for every English and French page. */
export function buildDocsSearchDocuments(): DocsSearchDocument[] {
  const results: DocsSearchDocument[] = [];

  for (const locale of LOCALES) {
    const pages = source.getPages(locale);
    const tree = source.getPageTree(locale);

    for (const page of pages) {
      if (page.slugs[0] === 'openapi') continue;

      const items = getBreadcrumbItems(page.url, tree, {
        includePage: false,
        includeRoot: true,
      });

      const structuredData =
        'structuredData' in page.data && isJsonObject(page.data.structuredData)
          ? page.data.structuredData
          : undefined;
      const structured: DocsSearchDocument['structured'] = structuredData
        ? {
            headings: toHeadingStrings(structuredData.headings),
            contents: toContentStrings(structuredData.contents),
          }
        : { headings: [], contents: [] };

      const url = page.url.startsWith('/') ? page.url : `/${page.url}`;
      const aliases = [...aliasesForPath(url)];
      if (aliases.length) {
        structured.contents = [...structured.contents, ...aliases];
      }

      results.push({
        id: `${locale}:${url}`,
        page_id: url,
        title: page.data.title ?? 'Untitled',
        description: page.data.description,
        url,
        tag: searchTagFromSection(page.slugs[0]),
        locale,
        aliases,
        structured,
        breadcrumbs: items.flatMap<string>((item, i) =>
          i > 0 && isString(item.name) ? item.name : [],
        ),
      });
    }
  }

  return results;
}
