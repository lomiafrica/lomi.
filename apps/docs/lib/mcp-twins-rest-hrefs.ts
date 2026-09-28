/* @proprietary license */

import fs from 'node:fs';
import path from 'node:path';

/** Built at runtime so webpack does not treat `.mdx` as a module glob. */
const MDX_EXT = `.${'mdx'}`;
const FR_MDX_EXT = `.fr${MDX_EXT}`;

export function restDocsHrefFromMdxFile(relativePath: string): string | null {
  const normalized = relativePath.replace(/\\/g, '/');
  const match = /(?:^|\/)api\/([^/]+)\/([^/]+?)(?:\.fr)?\.mdx$/.exec(
    normalized,
  );
  if (!match || !match[1] || !match[2]) return null;
  if (match[2] === 'index') return null;
  return `/api/${match[1]}/${match[2]}`;
}

let cachedRestHrefs: Map<string, string> | null = null;

/**
 * operationKey → REST docs URL. Reads hand-authored MDX on disk so the MCP
 * page never imports the fumadocs `source` loader (that cycle remounts the
 * page in dev). Keep this module off the catch-all docs page and global MDX
 * component map so webpack does not compile every API MDX file twice.
 */
export function listRestDocsHrefs(): Map<string, string> {
  if (cachedRestHrefs) return cachedRestHrefs;
  const map = new Map<string, string>();
  const apiRoot = path.join(process.cwd(), 'content/docs/api');
  if (!fs.existsSync(apiRoot)) {
    cachedRestHrefs = map;
    return map;
  }

  for (const folder of fs.readdirSync(apiRoot, { withFileTypes: true })) {
    if (!folder.isDirectory()) continue;
    const folderPath = path.join(apiRoot, folder.name);
    for (const file of fs.readdirSync(folderPath)) {
      if (
        !file.endsWith(MDX_EXT) ||
        file.endsWith(FR_MDX_EXT) ||
        file === `index${MDX_EXT}`
      ) {
        continue;
      }
      const content = fs.readFileSync(path.join(folderPath, file), 'utf8');
      const methodMatch = /^method:\s*(\S+)/m.exec(content);
      const pathMatch = /^path:\s*(.+)$/m.exec(content);
      if (!methodMatch?.[1] || !pathMatch?.[1]) continue;
      const routePath = pathMatch[1].trim().replace(/^['"]|['"]$/g, '');
      const key = `${methodMatch[1].toUpperCase()} ${routePath}`;
      const href = restDocsHrefFromMdxFile(
        `content/docs/api/${folder.name}/${file}`,
      );
      if (href && !map.has(key)) map.set(key, href);
    }
  }

  cachedRestHrefs = map;
  return map;
}
