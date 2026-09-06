import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const __dirname = dirname(fileURLToPath(import.meta.url));
const docsRoot = join(__dirname, '..', '..');
process.env.NEXT_PUBLIC_SITE_URL = 'https://docs.lomi.africa';
const { buildDocsAlternates } = await import('../utils/docs-routing.ts');

function read(relativePath) {
  return readFileSync(join(docsRoot, relativePath), 'utf8');
}

test('docs markdown copy URLs point at the llms.mdx route', async () => {
  const { buildDocsMarkdownUrl } = await import('../utils/docs-routing.ts');
  assert.equal(
    buildDocsMarkdownUrl('/start/overview'),
    '/llms.mdx/start/overview',
  );
  assert.equal(
    buildDocsMarkdownUrl('start/overview'),
    '/llms.mdx/start/overview',
  );
  assert.equal(buildDocsMarkdownUrl('/'), '/llms.mdx');

  const pageSource = read('app/(docs)/[[...slug]]/page.tsx');
  assert.match(pageSource, /buildDocsMarkdownUrl\(page\.url\)/);
  assert.doesNotMatch(pageSource, /\$\{page\.url\}\.mdx/);
});

test('docs pages use unprefixed self-canonical URLs for all languages', () => {
  const alternates = buildDocsAlternates('/start/overview');

  assert.equal(alternates.canonical, 'https://docs.lomi.africa/start/overview');
  assert.deepEqual(alternates.languages, {
    'x-default': 'https://docs.lomi.africa/start/overview',
  });
});

test('markdown Accept rewrites docs pages to the llms.mdx mirror', async () => {
  const { docsMarkdownAcceptRewritePath } =
    await import('../utils/docs-routing.ts');

  assert.equal(docsMarkdownAcceptRewritePath('/'), '/llms.mdx/start/overview');
  assert.equal(
    docsMarkdownAcceptRewritePath('/start/overview'),
    '/llms.mdx/start/overview',
  );
  assert.equal(
    docsMarkdownAcceptRewritePath('/this-path-does-not-exist'),
    '/llms.mdx/this-path-does-not-exist',
  );
  assert.equal(docsMarkdownAcceptRewritePath('/llms.txt'), null);
  assert.equal(docsMarkdownAcceptRewritePath('/not-found.md'), null);
  assert.equal(docsMarkdownAcceptRewritePath('/start/overview.mdx'), null);
  assert.equal(docsMarkdownAcceptRewritePath('/llms.mdx/start/overview'), null);
});

test('dynamic sitemap is the only docs sitemap source', () => {
  assert.equal(existsSync(join(docsRoot, 'public/sitemap.xml')), false);
  assert.doesNotMatch(read('lib/scripts/post-build.ts'), /generateSitemap/);
  assert.doesNotMatch(read('app/sitemap.ts'), /buildDocsAlternates/);
  assert.doesNotMatch(read('app/sitemap.ts'), /localizeDocsPath/);
  assert.doesNotMatch(read('app/sitemap.ts'), /alternates:/);
});

test('docs locale is resolved from the language cookie, not the URL', () => {
  const localeSource = read('lib/utils/docs-locale.ts');
  const proxySource = read('proxy.ts');
  const routingSource = read('lib/utils/docs-routing.ts');

  assert.match(localeSource, /\bcookies\b/);
  assert.match(localeSource, /lomi\.language|Cookies\.Language/);
  assert.match(proxySource, /301/);
  assert.match(proxySource, /developers\.lomi\.africa/);
  assert.match(proxySource, /docs\.lomi\.africa/);
  assert.match(routingSource, /Paths are never locale-prefixed/);
});

test('legacy content redirects stay unprefixed', () => {
  const configSource = read('next.config.mjs');
  const proxySource = read('proxy.ts');

  assert.match(configSource, /core\/introduction\/what-is-lomi/);
  assert.match(configSource, /source:\s*'\/build\/lomi-ui'/);
  assert.match(configSource, /destination:\s*'\/build\/choose-integration'/);
  assert.doesNotMatch(configSource, /source:\s*'\/en\//);
  assert.doesNotMatch(
    configSource,
    /source:\s*'\/'\s*,\s*\n\s*destination:\s*'\/start\/overview'/,
  );
  assert.match(proxySource, /pathname === '\/'/);
  assert.match(proxySource, /\/start\/overview/);
});

test('robots.txt does not block sitemap API reference pages', async () => {
  const { isRobotsDisallowedPath, ROBOTS_DISALLOW } =
    await import('./robots-policy.ts');

  assert.equal(isRobotsDisallowedPath('/api/checkout-sessions'), false);
  assert.equal(
    isRobotsDisallowedPath(
      '/api/checkout-sessions/CheckoutSessionsController_create',
    ),
    false,
  );
  assert.equal(isRobotsDisallowedPath('/api/authentication'), false);
  assert.equal(isRobotsDisallowedPath('/start/overview'), false);
  assert.equal(isRobotsDisallowedPath('/api/search'), true);
  assert.equal(isRobotsDisallowedPath('/api/proxy'), true);
  assert.equal(isRobotsDisallowedPath('/tryit/handoff'), true);

  const robotsSource = read('app/robots.ts');
  assert.doesNotMatch(robotsSource, /disallow:\s*\[[^\]]*['"]\/api\/['"]/);
  assert.match(robotsSource, /ROBOTS_DISALLOW/);
  assert.ok(ROBOTS_DISALLOW.includes('/api/search'));

  const sitemapSource = read('app/sitemap.ts');
  assert.match(sitemapSource, /path\.startsWith\('\/api\/'\)/);
});

test('page metadata emits locale-aware Open Graph and structured data', () => {
  const pageSource = read('app/(docs)/[[...slug]]/page.tsx');
  const docsLayoutSource = read('app/(docs)/layout.tsx');
  const ogSource = read('app/og/[...slug]/route.tsx');
  const layoutSource = read('app/layout.tsx');
  const notFoundSource = read('app/not-found.tsx');

  assert.match(pageSource, /locale:\s*locale === 'fr' \? 'fr_FR' : 'en_US'/);
  assert.match(pageSource, /application\/ld\+json/);
  assert.doesNotMatch(ogSource, /getPage\(slug\.slice\(0, -1\), 'en'\)/);
  assert.doesNotMatch(layoutSource, /buildDocsAlternates/);
  assert.match(notFoundSource, /index:\s*false/);
  assert.match(notFoundSource, /buildDocsNotFoundMarkdown/);
  assert.doesNotMatch(docsLayoutSource, /localizeDocsPath/);
  assert.doesNotMatch(pageSource, /localizeDocsPath/);
});

test('docs markdown 404s and Accept negotiation live in proxy and llms.mdx', () => {
  const proxySource = read('proxy.ts');
  const markdownRoute = read('app/llms.mdx/[...slug]/route.ts');

  assert.match(proxySource, /docsMarkdownAcceptRewritePath/);
  assert.match(proxySource, /wantsDocsMarkdown/);
  assert.match(proxySource, /Vary/);
  assert.match(markdownRoute, /status:\s*404/);
  assert.match(markdownRoute, /buildDocsNotFoundMarkdown/);
  assert.match(markdownRoute, /getLLMTextFallback/);
  assert.doesNotMatch(markdownRoute, /from 'next\/navigation'/);

  const notFoundMarkdown = read('app/not-found.md/route.ts');
  assert.match(notFoundMarkdown, /status:\s*404/);
  assert.match(notFoundMarkdown, /buildDocsNotFoundMarkdown/);
  assert.match(notFoundMarkdown, /DISCOVERY_MARKDOWN_HEADERS/);

  const routingSource = read('lib/utils/docs-routing.ts');
  assert.match(routingSource, /\/llms\.mdx/);
  assert.doesNotMatch(routingSource, /return `\$\{path\}\.mdx`/);

  const configSource = read('next.config.mjs');
  assert.match(configSource, /outputFileTracingIncludes/);
  assert.match(configSource, /content\/docs/);
  const markdownHeadersSource = read('lib/seo/agent-discovery.ts');
  assert.match(
    markdownHeadersSource,
    /Vary:\s*'Accept, Accept-Encoding, User-Agent'/,
  );
});
