/* @proprietary license */

import {
  isJsonObject,
  isString,
  readArray,
  readString,
  type JsonObject,
} from '@lomi./shared';
import type { SortedResult } from 'fumadocs-core/search';
import type { DocsSearchTag } from '@/lib/search/tags';

export type SearchResultRow = SortedResult & {
  snippet?: string;
  section?: DocsSearchTag;
};

type OramaHit = {
  id?: string | number;
  document?: unknown;
};

function excerptAroundMatch(content: string, searchLower: string): string {
  const maxLength = 120;
  const index = content.toLowerCase().indexOf(searchLower);
  if (index === -1) return content.slice(0, maxLength);
  if (content.length <= maxLength) return content;

  const start = Math.max(0, index - 40);
  const end = Math.min(content.length, start + maxLength);
  return (
    (start > 0 ? '...' : '') +
    content.slice(start, end) +
    (end < content.length ? '...' : '')
  );
}

export function docsSectionFromUrl(url: string): DocsSearchTag | undefined {
  try {
    const path = url.startsWith('http')
      ? new URL(url).pathname
      : url.startsWith('/')
        ? url
        : `/${url}`;
    const section = path.split('/').filter(Boolean)[0];
    if (
      section === 'start' ||
      section === 'build' ||
      section === 'api' ||
      section === 'resources'
    ) {
      return section;
    }
  } catch {
    return undefined;
  }
  return undefined;
}

export function matchesSearchSection(
  url: string,
  tag: DocsSearchTag | undefined,
): boolean {
  if (!tag) return true;
  return docsSectionFromUrl(url) === tag;
}

function buildSnippet(doc: JsonObject, searchLower: string): string | undefined {
  const description = readString(doc, 'description')?.trim();
  if (description) {
    return description.toLowerCase().includes(searchLower)
      ? excerptAroundMatch(description, searchLower)
      : description;
  }

  const structured = doc['structured'];
  if (!isJsonObject(structured)) return undefined;
  const contents = readArray(structured, 'contents');
  if (!contents) return undefined;

  const match = contents
    .filter(isString)
    .find(
      (content) =>
        content.toLowerCase().includes(searchLower) && content.length > 20,
    );
  return match ? excerptAroundMatch(match, searchLower) : undefined;
}

export function formatOramaHits(
  hits: OramaHit[],
  search: string,
  tag?: DocsSearchTag,
): SearchResultRow[] {
  const searchLower = search.toLowerCase();
  const seen = new Set<string>();
  const rows: SearchResultRow[] = [];

  for (const hit of hits) {
    const doc = isJsonObject(hit.document) ? hit.document : {};
    const id = readString(doc, 'id') ?? String(hit.id ?? '');
    const rawUrl = readString(doc, 'url') ?? readString(doc, 'id') ?? id;
    const url = rawUrl.startsWith('/') ? rawUrl : `/${rawUrl}`;
    if (!matchesSearchSection(url, tag) || seen.has(url)) continue;
    seen.add(url);

    rows.push({
      type: 'page',
      id: id || url,
      url,
      content: readString(doc, 'title') ?? 'Untitled',
      breadcrumbs: readArray(doc, 'breadcrumbs')?.filter(isString),
      snippet: buildSnippet(doc, searchLower),
      section: docsSectionFromUrl(url),
    });
  }

  return rows;
}

export function formatLocalResults(
  results: SortedResult[],
  tag?: DocsSearchTag,
): SearchResultRow[] {
  const seen = new Set<string>();
  const rows: SearchResultRow[] = [];

  for (const result of results) {
    if (result.type !== 'page') continue;
    if (!matchesSearchSection(result.url, tag) || seen.has(result.url)) continue;
    seen.add(result.url);
    rows.push({
      ...result,
      content: result.content.replace(/^.* › /, ''),
      section: docsSectionFromUrl(result.url),
    });
  }

  return rows;
}
