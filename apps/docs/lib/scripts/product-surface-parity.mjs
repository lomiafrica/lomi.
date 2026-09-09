/**
 * Website product marketing surface consistency (footer, paths, sitemap, routes).
 * Run from repo root: node apps/docs/lib/scripts/product-surface-parity.mjs
 */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const monorepoRoot = join(__dirname, '..', '..', '..', '..');
const websiteRoot = join(monorepoRoot, 'apps/website');

if (!existsSync(websiteRoot)) {
  console.warn(
    'product-surface-parity: apps/website not present; skipping website checks',
  );
  process.exit(0);
}

const errors = [];

/** Expected product pages: path -> docs path segment on docs.lomi.africa */
const PRODUCT_PAGES = {
  '/relay': '/build/ecommerce-extensions',
  '/subscriptions': '/build/billing/subscriptions',
  '/usage-billing': '/build/billing/usage-billing',
  '/whatsapp-commerce': '/build/accept/whatsapp-commerce',
  '/customer-portal': '/build/billing/customer-portal',
  '/direct-charges': '/build/accept/direct-charges',
  '/invoicing': '/build/accept/payment-requests',
  '/network': '/build/platform/network',
  '/radar': '/build/money/radar',
  '/connect': '/build/mcp',
  '/payment-links': '/build/accept/payment-links',
};

function readFile(rel) {
  return readFileSync(join(websiteRoot, rel), 'utf-8');
}

const metadataSrc = readFile('src/lib/product-pages.ts');
const footerSrc = readFile('src/components/site/footer.tsx');
const sitemapSrc = readFile('src/app/sitemap.ts');
const enLocale = JSON.parse(readFile('src/lib/i18n/locales/en.json'));

const pathToNamespace = {};
for (const match of metadataSrc.matchAll(/(\w+):\s*'(\/[^']+)'/g)) {
  pathToNamespace[match[2]] = match[1];
}

const footerLinks = [...footerSrc.matchAll(/link:\s*'(\/[^']+)'/g)].map(
  (m) => m[1],
);
const productFooterLinks = footerLinks.filter((link) =>
  Object.keys(PRODUCT_PAGES).includes(link),
);

for (const link of Object.keys(PRODUCT_PAGES)) {
  if (!productFooterLinks.includes(link)) {
    errors.push(`Footer missing product link: ${link}`);
  }
}

for (const link of productFooterLinks) {
  if (!pathToNamespace[link]) {
    errors.push(`PRODUCT_PATHS missing namespace for footer link: ${link}`);
  }
  if (
    !sitemapSrc.includes(`path: '${link}'`) &&
    !sitemapSrc.includes(`path: "${link}"`)
  ) {
    errors.push(`sitemap.ts missing route: ${link}`);
  }
  const routeDir = link === '/relay' ? 'relay' : link.slice(1);
  // Marketing pages live under the localized segment `(home)/l/[lang]/<route>`
  // (root-level `(home)/<route>` is kept for older layouts).
  const pageCandidates = [
    join(websiteRoot, 'src/app/(home)/l/[lang]', routeDir, 'page.tsx'),
    join(websiteRoot, 'src/app/(home)', routeDir, 'page.tsx'),
  ];
  if (!pageCandidates.some((pagePath) => existsSync(pagePath))) {
    errors.push(`Missing marketing page.tsx for ${link}`);
  }
}

const directCharges = enLocale.directCharges ?? {};
const directBlob = JSON.stringify(directCharges).toLowerCase();
if (
  !directBlob.includes('503') &&
  !directBlob.includes('not available') &&
  !directBlob.includes('unavailable')
) {
  errors.push(
    'Website en directCharges copy must mention card/switch unavailability (503 or not available)',
  );
}

const pciTitle = enLocale.footer?.cert?.pci_title ?? '';
if (/level 4 certified/i.test(pciTitle)) {
  errors.push(
    'Website footer PCI title should not claim level 4 certified; use PCI DSS-aligned wording',
  );
}

const docsRoot = join(monorepoRoot, 'apps/docs/content/docs');

function docsGuideExists(docsPath) {
  const slug = docsPath.replace(/^\//, '');
  const candidates = [
    join(docsRoot, `${slug}.mdx`),
    join(docsRoot, slug, 'index.mdx'),
  ];
  return candidates.some((p) => existsSync(p));
}

for (const [link, docsPath] of Object.entries(PRODUCT_PAGES)) {
  if (!docsGuideExists(docsPath)) {
    errors.push(`Docs guide missing for product ${link}: ${docsPath}`);
  }
}

if (errors.length > 0) {
  for (const e of errors) console.error(e);
  process.exit(1);
}

console.log('product-surface-parity: ok');
