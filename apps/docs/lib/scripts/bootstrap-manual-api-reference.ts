/* @proprietary license */

/**
 * One-shot / maintenance: scaffolds manual REST API MDX pages from apps/docs/openapi.json
 * and refreshes per-section meta.json under content/docs/api.
 *
 * Safe mode (default): only creates missing operation pages.
 * Overwrite mode: set BOOTSTRAP_OVERWRITE=1 to also replace existing pages.
 *
 * Run from apps/docs:
 * `CONFIRM_BOOTSTRAP=1 pnpm run api:regenerate-rest-reference`
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import {
  REST_API_SECTION_ORDER,
  isPublicRestApiOperation,
  pathToFolder,
} from '@/lib/scripts/manual-api/constants';
import {
  collectPublicOperations,
  renderOperationPageMdx,
} from '@/lib/scripts/manual-api/render-operation-mdx';
import { type JsonObject, parseJson } from '@lomi./shared';

const DOCS_API_ROOT = join(process.cwd(), 'content/docs/api');

function toSectionTitle(value: string): string {
  return value
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

async function main(): Promise<void> {
  if (process.env.CONFIRM_BOOTSTRAP !== '1') {
    console.error(
      [
        'Refusing to regenerate REST API MDX (destructive).',
        'Set CONFIRM_BOOTSTRAP=1 to confirm you intend to scaffold content/docs/api/** and rewrite _expected-public-operations.json.',
        'Default behavior is safe (missing files only). To overwrite existing operation pages too, also set BOOTSTRAP_OVERWRITE=1.',
        'Example (safe): CONFIRM_BOOTSTRAP=1 pnpm run api:regenerate-rest-reference',
        'Example (overwrite): CONFIRM_BOOTSTRAP=1 BOOTSTRAP_OVERWRITE=1 pnpm run api:regenerate-rest-reference',
      ].join('\n'),
    );
    process.exit(1);
  }
  const overwriteExisting = process.env.BOOTSTRAP_OVERWRITE === '1';

  const specPath = join(process.cwd(), 'openapi.json');
  const raw = readFileSync(specPath, 'utf-8');
  // SAFETY: openapi.json is the OpenAPI document consumed by collectPublicOperations.
  const spec = parseJson(raw) as Parameters<typeof collectPublicOperations>[0];

  const all = collectPublicOperations(spec);
  const merchant = all.filter((o) =>
    isPublicRestApiOperation(o.method, o.path),
  );
  const schemaComponents =
    // SAFETY: Boundary value matches the asserted domain type at this call site.
    (spec as { components?: { schemas?: JsonObject } }).components?.schemas;

  const byFolder = new Map<string, typeof merchant>();
  for (const entry of merchant) {
    const folder = pathToFolder(entry.path);
    const list = byFolder.get(folder) ?? [];
    list.push(entry);
    byFolder.set(folder, list);
  }

  let wroteEn = 0;
  let wroteFr = 0;
  let skippedExisting = 0;
  for (const [folder, entries] of byFolder) {
    const dir = join(DOCS_API_ROOT, folder);
    mkdirSync(dir, { recursive: true });

    entries.sort((a, b) => a.operationId.localeCompare(b.operationId));

    for (const { method, path: routePath, operationId, operation } of entries) {
      // SAFETY: Boundary value matches the asserted domain type at this call site.
      const rawPathItem = spec.paths?.[routePath] as
        { parameters?: unknown[] } | undefined;

      const mdxEn = renderOperationPageMdx({
        method,
        path: routePath,
        operationId,
        operation,
        // SAFETY: Boundary value matches the asserted domain type at this call site.
        pathItem: rawPathItem as Parameters<
          typeof renderOperationPageMdx
        >[0]['pathItem'],
        components: {
          // SAFETY: Boundary value matches the asserted domain type at this call site.
          schemas: schemaComponents as Parameters<
            typeof renderOperationPageMdx
          >[0]['components'] extends { schemas?: infer TSchemas }
            ? TSchemas
            : never,
        },
        lang: 'en',
      });
      const mdxFr = renderOperationPageMdx({
        method,
        path: routePath,
        operationId,
        operation,
        // SAFETY: Boundary value matches the asserted domain type at this call site.
        pathItem: rawPathItem as Parameters<
          typeof renderOperationPageMdx
        >[0]['pathItem'],
        components: {
          // SAFETY: Boundary value matches the asserted domain type at this call site.
          schemas: schemaComponents as Parameters<
            typeof renderOperationPageMdx
          >[0]['components'] extends { schemas?: infer TSchemas }
            ? TSchemas
            : never,
        },
        lang: 'fr',
      });

      const filePath = join(dir, `${operationId}.mdx`);
      if (!overwriteExisting && existsSync(filePath)) {
        skippedExisting += 1;
      } else {
        writeFileSync(filePath, `${mdxEn.trim()}\n`, 'utf-8');
        wroteEn += 1;
      }
      const filePathFr = join(dir, `${operationId}.fr.mdx`);
      if (!overwriteExisting && existsSync(filePathFr)) {
        skippedExisting += 1;
      } else {
        writeFileSync(filePathFr, `${mdxFr.trim()}\n`, 'utf-8');
        wroteFr += 1;
      }
    }

    const pageNames = entries
      .map((e) => e.operationId)
      .sort((a, b) => a.localeCompare(b));

    const metaTitle = toSectionTitle(folder);

    const metaPath = join(dir, 'meta.json');
    writeFileSync(
      metaPath,
      `${JSON.stringify(
        {
          title: metaTitle,
          pages: pageNames,
        },
        null,
        2,
      )}\n`,
      'utf-8',
    );
  }

  const rootPages = [...REST_API_SECTION_ORDER].filter((name) =>
    byFolder.has(name),
  );

  const rootMeta = {
    title: 'API',
    description: 'Payment and commerce endpoints.',
    root: true,
    icon: 'BookOpen',
    pages: rootPages,
  };

  writeFileSync(
    join(DOCS_API_ROOT, 'meta.json'),
    `${JSON.stringify(rootMeta, null, 2)}\n`,
    'utf-8',
  );

  console.log(
    `Manual API docs: ${overwriteExisting ? 'overwrite' : 'safe'} mode, wrote EN=${wroteEn}, FR=${wroteFr}, skipped-existing=${skippedExisting}, operations=${merchant.length}, folders=${byFolder.size}.`,
  );

  const openapiOnly = merchant
    .map((o) => `${o.method.toUpperCase()} ${o.path}`)
    .sort();
  writeFileSync(
    join(
      process.cwd(),
      'lib/scripts/manual-api/_expected-public-operations.json',
    ),
    `${JSON.stringify(openapiOnly, null, 2)}\n`,
    'utf-8',
  );
}

void main();
