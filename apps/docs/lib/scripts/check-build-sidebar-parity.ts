/**
 * Build sidebar: MDX pages under content/docs/build must appear in meta.json
 * (or meta.fr.json for FR-only stubs) unless listed in build-sidebar-exempt.json.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { glob } from 'tinyglobby';

const DOCS_ROOT = process.cwd();
const BUILD_ROOT = path.join(DOCS_ROOT, 'content/docs/build');
const EXEMPT_PATH = path.join(
  DOCS_ROOT,
  'lib/scripts/build-sidebar-exempt.json',
);

function slugFromRelative(relative: string): string {
  return relative.replace(/\.mdx$/, '').replace(/\.fr$/, '');
}

async function pagesFromMeta(metaPath: string): Promise<Set<string>> {
  const raw = await fs.readFile(metaPath, 'utf-8');
  // SAFETY: Boundary value matches the asserted domain type at this call site.
  const meta = JSON.parse(raw) as { pages?: string[] };
  const pages = new Set<string>();
  for (const entry of meta.pages ?? []) {
    if (entry.startsWith('---')) continue;
    pages.add(entry);
  }
  return pages;
}

export async function checkBuildSidebarParity(errors: string[]): Promise<void> {
  const enMeta = await pagesFromMeta(path.join(BUILD_ROOT, 'meta.json'));
  const frMeta = await pagesFromMeta(path.join(BUILD_ROOT, 'meta.fr.json'));

  const exempt = await fs
    .readFile(EXEMPT_PATH, 'utf-8')
    .then((exemptRaw) => new Set(JSON.parse(exemptRaw) as string[]))
    .catch(() => new Set<string>());

  const files = await glob('*.mdx', { cwd: BUILD_ROOT });
  for (const file of files) {
    if (/\.(fr|es|zh)\.mdx$/.test(file)) continue;
    if (file.endsWith('/index.mdx')) continue;

    const slug = slugFromRelative(file);
    if (exempt.has(slug)) continue;

    if (!enMeta.has(slug)) {
      errors.push(
        `Build MDX missing from build/meta.json pages: ${slug} (${file})`,
      );
    }
    if (!frMeta.has(slug)) {
      errors.push(
        `Build MDX missing from build/meta.fr.json pages: ${slug} (${file})`,
      );
    }
  }
}
