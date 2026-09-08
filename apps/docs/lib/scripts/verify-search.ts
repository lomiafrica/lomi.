/* @proprietary license */

import { existsSync } from 'node:fs';
import path from 'node:path';
import {
  DOCS_SEARCH_ALIASES,
  DOCS_SEARCH_SUGGESTED,
  DOCS_SEARCH_SUGGESTED_HREFS,
} from '@/lib/search/aliases';

const CONTENT_ROOT = path.join(process.cwd(), 'content/docs');

function hrefToMdx(href: string): string {
  const slug = href.replace(/^\//, '');
  return path.join(CONTENT_ROOT, `${slug}.mdx`);
}

function hrefExists(href: string): boolean {
  const file = hrefToMdx(href);
  if (existsSync(file)) return true;
  const indexFile = path.join(
    CONTENT_ROOT,
    href.replace(/^\//, ''),
    'index.mdx',
  );
  return existsSync(indexFile);
}

const EXPECTED_QUERIES: { query: string; href: string }[] = [
  { query: 'momo', href: '/build/payment-methods/mtn-momo' },
  { query: '3ds', href: '/build/payment-methods/cards' },
  { query: 'webhook secret', href: '/build/reliability' },
  { query: 'sandbox key', href: '/start/api-keys' },
  { query: 'go live', href: '/start/go-live' },
  { query: 'chargeback', href: '/build/money/disputes' },
  { query: 'settlement', href: '/build/money/balance-and-settlement' },
  { query: 'centimes', href: '/api/index' },
];

function aliasesMatch(href: string, query: string): boolean {
  const aliases = DOCS_SEARCH_ALIASES[href] ?? [];
  const hay = aliases.join(' ').toLowerCase();
  return query
    .toLowerCase()
    .split(/\s+/)
    .every((term) => hay.includes(term));
}

function run(): void {
  if (DOCS_SEARCH_SUGGESTED.length !== 5) {
    throw new Error(
      `Expected 5 empty-state search suggestions, got ${DOCS_SEARCH_SUGGESTED.length}`,
    );
  }

  const pathLikeTitles = DOCS_SEARCH_SUGGESTED.filter(
    (item) => item.title.en.startsWith('/') || item.title.fr.startsWith('/'),
  );
  if (pathLikeTitles.length > 0) {
    throw new Error(
      `Search suggestions must use page titles, not routes: ${pathLikeTitles
        .map((item) => item.href)
        .join(', ')}`,
    );
  }

  const missingSuggested = DOCS_SEARCH_SUGGESTED_HREFS.filter(
    (href) => !hrefExists(href),
  );
  if (missingSuggested.length > 0) {
    throw new Error(
      `Suggested search hrefs missing MDX: ${missingSuggested.join(', ')}`,
    );
  }

  const missingAliasPages = Object.keys(DOCS_SEARCH_ALIASES).filter(
    (href) => !hrefExists(href),
  );
  if (missingAliasPages.length > 0) {
    throw new Error(
      `Search alias pages missing MDX: ${missingAliasPages.join(', ')}`,
    );
  }

  const failedQueries = EXPECTED_QUERIES.filter(
    ({ query, href }) => !aliasesMatch(href, query),
  );
  if (failedQueries.length > 0) {
    throw new Error(
      `Search aliases do not cover: ${failedQueries
        .map((item) => `${item.query} -> ${item.href}`)
        .join('; ')}`,
    );
  }

  console.log('docs search alias checks passed');
}

run();
