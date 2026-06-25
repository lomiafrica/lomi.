#!/usr/bin/env node
/** One-off audit: spine pages vs sidebar. Run: node lib/scripts/audit-spine-links.mjs */

import fs from 'node:fs';
import path from 'node:path';

const DOCS_ROOT = process.cwd();
const CONTENT = path.join(DOCS_ROOT, 'content/docs');

const SPINE_FILES = [
  'start/overview.mdx',
  'start/integration-journey.mdx',
  'build/choose-integration.mdx',
];

const linkRe = /\]\(\/(start|build|resources)\/([^)\s#]+)/g;

function expandSidebar(pages, prefix) {
  const out = [];
  for (const p of pages) {
    if (p.startsWith('---')) continue;
    out.push(`${prefix}/${p}`);
    if (!p.includes('/')) {
      const sub = path.join(CONTENT, prefix, p, 'meta.json');
      if (fs.existsSync(sub)) {
        const subMeta = JSON.parse(fs.readFileSync(sub, 'utf8'));
        out.push(...expandSidebar(subMeta.pages ?? [], `${prefix}/${p}`));
      }
    }
  }
  return out;
}

function linked(slug, spineLinks) {
  if (spineLinks.has(slug)) return true;
  if (slug.endsWith('/index') && spineLinks.has(slug.slice(0, -'/index'.length))) {
    return true;
  }
  return false;
}

const spineLinks = new Set();
for (const rel of SPINE_FILES) {
  for (const v of [rel, rel.replace('.mdx', '.fr.mdx')]) {
    const filePath = path.join(CONTENT, v);
    if (!fs.existsSync(filePath)) continue;
    const content = fs.readFileSync(filePath, 'utf8');
    for (const match of content.matchAll(linkRe)) {
      spineLinks.add(`${match[1]}/${match[2]}`);
    }
  }
}

const buildMeta = JSON.parse(
  fs.readFileSync(path.join(CONTENT, 'build/meta.json'), 'utf8'),
);
const startMeta = JSON.parse(
  fs.readFileSync(path.join(CONTENT, 'start/meta.json'), 'utf8'),
);

const sidebar = new Set([
  ...expandSidebar(startMeta.pages, 'start'),
  ...expandSidebar(buildMeta.pages, 'build'),
]);

const inSidebarNotSpine = [...sidebar]
  .filter((s) => !linked(s, spineLinks))
  .sort();

console.log(`Spine links: ${spineLinks.size}`);
console.log(`Sidebar items not in spine: ${inSidebarNotSpine.length}\n`);
for (const s of inSidebarNotSpine) {
  console.log(`  ${s}`);
}
