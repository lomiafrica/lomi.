/* @proprietary license */

/**
 * Compute SHA-256 fingerprints for OpenAPI specs and French regulatory book exports.
 *
 * Run from apps/docs:
 *   pnpm docs:fingerprint-openapi
 */

import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, join } from 'node:path';

const EXPORT_DIR = join(process.cwd(), '../../docs/compliance/exports');
const OPENAPI_PATH = join(process.cwd(), 'openapi.json');
const AGENT_OPENAPI_PATH = join(process.cwd(), 'agent-openapi.json');
const MANIFEST_PATH = join(EXPORT_DIR, 'MANIFEST-empreintes.md');

const TRACKED_FILES = [
  OPENAPI_PATH,
  AGENT_OPENAPI_PATH,
  join(EXPORT_DIR, 'lomi-reference-api-fr.md'),
  join(EXPORT_DIR, 'lomi-reference-api-fr.html'),
  join(EXPORT_DIR, 'lomi-reference-api-fr.pdf'),
  join(EXPORT_DIR, 'lomi-services-overview-fr.md'),
  join(EXPORT_DIR, 'lomi-services-overview-fr.html'),
  join(EXPORT_DIR, 'lomi-services-overview-fr.pdf'),
  join(EXPORT_DIR, 'lomi-agent-platform-fr.md'),
  join(EXPORT_DIR, 'lomi-agent-platform-fr.html'),
  join(EXPORT_DIR, 'lomi-agent-platform-fr.pdf'),
] as const;

function sha256File(path: string): string {
  return createHash('sha256').update(readFileSync(path)).digest('hex');
}

function byteSize(path: string): number {
  return readFileSync(path).byteLength;
}

function main(): void {
  mkdirSync(EXPORT_DIR, { recursive: true });

  const generatedAt = new Date().toISOString();
  const rows: Array<{
    path: string;
    label: string;
    hash: string;
    bytes: number;
  }> = [];

  for (const path of TRACKED_FILES) {
    if (!existsSync(path)) {
      console.warn(`skip missing: ${path}`);
      continue;
    }
    rows.push({
      path,
      label: basename(path),
      hash: sha256File(path),
      bytes: byteSize(path),
    });
  }

  if (rows.length === 0) {
    console.error(
      'No files to fingerprint. Run pnpm docs:export-fr-book -- --pdf first.',
    );
    process.exit(1);
  }

  const lines = [
    '# Empreintes des artefacts documentaires lomi.',
    '',
    `Généré le ${generatedAt}.`,
    '',
    'Paquet en 3 documents :',
    '',
    '1. `lomi-reference-api-fr` : référence API REST marchande',
    '2. `lomi-services-overview-fr` : Network, produits, canaux, plateforme, conformité',
    '3. `lomi-agent-platform-fr` : MCP, OAuth, provisioning, Partner API',
    '',
    'Ces empreintes SHA-256 relient le paquet transmis aux snapshots OpenAPI (`openapi.json`, `agent-openapi.json`) et aux livres exportés.',
    '',
    '| Artefact | Octets | SHA-256 |',
    '| --- | ---: | --- |',
    ...rows.map(
      (row) => `| \`${row.label}\` | ${row.bytes} | \`${row.hash}\` |`,
    ),
    '',
    '## Chemins',
    '',
    ...rows.map((row) => `- \`${row.path}\``),
    '',
    '## Usage',
    '',
    '1. Régénérer les 3 livres : `cd apps/docs && pnpm docs:export-fr-book -- --pdf`',
    '2. Régénérer ce manifeste : `pnpm docs:fingerprint-openapi`',
    '3. Joindre `MANIFEST-empreintes.md` et les artefacts listés au dossier confidentiel.',
    '',
  ];

  writeFileSync(MANIFEST_PATH, `${lines.join('\n')}\n`, 'utf-8');
  console.log(`Wrote ${MANIFEST_PATH}`);
  for (const row of rows) {
    console.log(`${row.label}  ${row.hash}`);
  }
}

main();
