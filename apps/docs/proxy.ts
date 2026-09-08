/* @proprietary license */

import { type NextRequest, NextResponse } from 'next/server';
import {
  discoveryLinkHeaderValue,
  wantsDocsMarkdown,
} from '@/lib/seo/agent-discovery';
import {
  buildDocsInternalLocalePath,
  docsLocaleFromRequestCookies,
  docsMarkdownAcceptRewritePath,
  isDocsMachinePath,
  parseDocsLocalePath,
} from '@/lib/utils/docs-routing';

/**
 * Public URLs stay unprefixed. This proxy:
 * 1. 301s legacy `/en/...` and `/fr/...` links to the unprefixed path
 * 2. Rewrites the unprefixed path to `/l/{locale}/...` so each locale is
 *    statically generated. The matcher skips `/l/` so the rewritten request
 *    is not redirected in a loop.
 *
 * Do not call Supabase auth.getSession() here: docs has no /auth or /workspace routes,
 * and reading shared *.lomi.africa cookies can trigger refresh_token rate limits.
 */
function maybeRedirectLocalePrefix(request: NextRequest): NextResponse | null {
  const { pathname } = request.nextUrl;
  const { locale, pathname: strippedPath } = parseDocsLocalePath(pathname);

  if (!locale) {
    return null;
  }

  const url = request.nextUrl.clone();
  url.pathname = strippedPath;
  return NextResponse.redirect(url, 301);
}

function withDiscoveryHeaders(
  request: NextRequest,
  response: NextResponse,
): NextResponse {
  response.headers.set(
    'Link',
    discoveryLinkHeaderValue(request.nextUrl.origin),
  );
  const vary = response.headers.get('Vary');
  if (vary) {
    const hasAccept = vary
      .split(',')
      .some((part) => part.trim().toLowerCase() === 'accept');
    if (!hasAccept) {
      response.headers.set('Vary', `${vary}, Accept`);
    }
  } else {
    response.headers.set('Vary', 'Accept');
  }
  return response;
}

const DOCS_LEGACY_HOST = 'developers.lomi.africa';
const DOCS_CANONICAL_HOST = 'docs.lomi.africa';

function requestHost(request: NextRequest): string {
  return request.headers.get('host')?.split(':')[0]?.toLowerCase() ?? '';
}

function maybeRedirectDevelopersHost(
  request: NextRequest,
): NextResponse | null {
  if (requestHost(request) !== DOCS_LEGACY_HOST) {
    return null;
  }

  const url = request.nextUrl.clone();
  url.hostname = DOCS_CANONICAL_HOST;
  url.protocol = 'https:';
  url.port = '';
  return NextResponse.redirect(url, 301);
}

/**
 * HTML `/` 301s to `/start/overview` here (not in next.config) so
 * `Accept: text/markdown` can rewrite `/` to the overview markdown mirror.
 */
export default function proxy(request: NextRequest) {
  const developersRedirect = maybeRedirectDevelopersHost(request);
  if (developersRedirect) {
    return developersRedirect;
  }

  const { pathname } = request.nextUrl;

  if (isDocsMachinePath(pathname)) {
    return withDiscoveryHeaders(request, NextResponse.next());
  }

  const localePrefixRedirect = maybeRedirectLocalePrefix(request);
  if (localePrefixRedirect) {
    return withDiscoveryHeaders(request, localePrefixRedirect);
  }

  const wantsMarkdown = wantsDocsMarkdown(
    request.headers.get('accept'),
    request.headers.get('user-agent'),
  );

  if (pathname === '/' && !wantsMarkdown) {
    const url = request.nextUrl.clone();
    url.pathname = '/start/overview';
    return withDiscoveryHeaders(request, NextResponse.redirect(url, 301));
  }

  if (wantsMarkdown) {
    const markdownPath = docsMarkdownAcceptRewritePath(pathname);
    if (markdownPath) {
      const url = request.nextUrl.clone();
      url.pathname = markdownPath;
      return withDiscoveryHeaders(request, NextResponse.rewrite(url));
    }
  }

  const locale = docsLocaleFromRequestCookies(request.cookies);
  const url = request.nextUrl.clone();
  url.pathname = buildDocsInternalLocalePath(locale, pathname);
  const response = NextResponse.rewrite(url);
  response.headers.set('Vary', 'Cookie, Accept');
  return withDiscoveryHeaders(request, response);
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|l/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp3|ico|json|txt|xml)$).*)',
  ],
};
