/* @proprietary license */

import type { Metadata } from 'next';
import type { Language } from '@/lib/i18n/config';
import { Cookies } from '@lomi./shared';
import { getDocsSiteOrigin } from '@/lib/utils/metadata';

/** Legacy locale prefixes redirected away by `proxy.ts`. */
export const DOCS_LEGACY_PREFIX_LOCALES = ['en', 'fr'] as const;

export type DocsLegacyPrefixLocale =
  (typeof DOCS_LEGACY_PREFIX_LOCALES)[number];

export const DOCS_NOT_FOUND_MARKDOWN_PATH = '/not-found.md';
export const DOCS_OVERVIEW_MARKDOWN_PATH = '/llms.mdx/start/overview';

const MACHINE_EXACT_PATHS = new Set([
  '/llms.txt',
  '/llms-full.txt',
  '/llms.mdx',
  DOCS_NOT_FOUND_MARKDOWN_PATH,
  '/sitemap.xml',
  '/robots.txt',
  '/openapi.json',
  '/agent-openapi.json',
  '/agents',
  '/agents.md',
]);

const MACHINE_PATH_PREFIXES = [
  '/api/',
  '/_next/',
  '/og/',
  '/llms.mdx/',
  '/static.json',
  '/agents/',
  '/.well-known/',
] as const;

export function normalizeDocsPath(path: string): string {
  if (!path || path === '/') {
    return '/';
  }
  const withLeading = path.startsWith('/') ? path : `/${path}`;
  return withLeading.replace(/\/+$/, '') || '/';
}

/** Canonical markdown endpoint for page Copy / Open-in-LLM actions. */
export function buildDocsMarkdownUrl(pageUrl: string): string {
  const path = normalizeDocsPath(pageUrl);
  return path === '/' ? '/llms.mdx' : `/llms.mdx${path}`;
}

export function isDocsMachinePath(pathname: string): boolean {
  if (MACHINE_EXACT_PATHS.has(pathname)) {
    return true;
  }
  return MACHINE_PATH_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

/**
 * Rewrite Accept: text/markdown to the `/llms.mdx` route handler.
 * Do not rewrite to `/*.mdx` and hope `next.config` chains; proxy rewrites
 * skip config rewrites, so that path used to render HTML.
 */
export function docsMarkdownAcceptRewritePath(pathname: string): string | null {
  const path = normalizeDocsPath(pathname);
  if (path.startsWith('/llms.mdx') || path.endsWith('.mdx')) {
    return null;
  }
  if (isDocsMachinePath(path)) {
    return null;
  }
  if (path === '/') {
    return DOCS_OVERVIEW_MARKDOWN_PATH;
  }
  return buildDocsMarkdownUrl(path);
}

type ParsedDocsLocalePath = {
  locale: DocsLegacyPrefixLocale | null;
  pathname: string;
};

/**
 * Internal App Router prefix used so each locale can be statically generated
 * while public URLs stay unprefixed. Middleware rewrites `/start/overview` to
 * `/l/fr/start/overview` (or `/l/en/...`) from the language cookie. The
 * matcher skips `/l/` so the rewritten request is not redirected in a loop.
 */
export const DOCS_INTERNAL_LOCALE_PREFIX = '/l';

export function parseDocsLang(value: string | undefined | null): Language {
  return value === 'en' || value === 'fr' ? value : 'fr';
}

export function docsLocaleFromCookieValue(
  value: string | undefined | null,
): Language {
  return parseDocsLang(value);
}

export function isDocsInternalLocalePath(pathname: string): boolean {
  const normalized = normalizeDocsPath(pathname);
  return (
    normalized === DOCS_INTERNAL_LOCALE_PREFIX ||
    normalized.startsWith(`${DOCS_INTERNAL_LOCALE_PREFIX}/`)
  );
}

export function parseDocsInternalLocalePath(pathname: string): {
  locale: Language;
  pathname: string;
} | null {
  const segments = normalizeDocsPath(pathname).split('/').filter(Boolean);
  if (segments[0] !== 'l') return null;
  const lang = segments[1];
  if (lang !== 'en' && lang !== 'fr') return null;
  const rest = normalizeDocsPath(`/${segments.slice(2).join('/')}`);
  return { locale: lang, pathname: rest };
}

export function buildDocsInternalLocalePath(
  locale: Language,
  pathname: string,
): string {
  const path = normalizeDocsPath(pathname);
  if (path === '/') {
    return `${DOCS_INTERNAL_LOCALE_PREFIX}/${locale}/start/overview`;
  }
  return `${DOCS_INTERNAL_LOCALE_PREFIX}/${locale}${path}`;
}

export function docsLocaleFromRequestCookies(getCookie: {
  get: (name: string) => { value: string } | undefined;
}): Language {
  return docsLocaleFromCookieValue(getCookie.get(Cookies.Language)?.value);
}

export function parseDocsLocalePath(pathname: string): ParsedDocsLocalePath {
  const normalized = normalizeDocsPath(pathname);
  const segments = normalized.split('/').filter(Boolean);
  const first = segments[0];

  if (
    first &&
    // SAFETY: Boundary value matches the asserted domain type at this call site.
    (DOCS_LEGACY_PREFIX_LOCALES as readonly string[]).includes(first)
  ) {
    const stripped = normalizeDocsPath(`/${segments.slice(1).join('/')}`);
    // SAFETY: Boundary value matches the asserted domain type at this call site.
    return { locale: first as DocsLegacyPrefixLocale, pathname: stripped };
  }

  return { locale: null, pathname: normalized };
}

/** Paths are never locale-prefixed; language is cookie-only. */
export function localizeDocsPath(path: string): string {
  return normalizeDocsPath(path);
}

export function buildDocsAlternates(basePath: string): Metadata['alternates'] {
  const origin = getDocsSiteOrigin();
  const normalized = normalizeDocsPath(basePath);
  const url = `${origin}${normalized}`;

  return {
    canonical: url,
    languages: {
      'x-default': url,
    },
  };
}
