/* @proprietary license */

import { execSync } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import { checkAllowlistParity } from '@/lib/scripts/check-allowlist-parity';
import { checkBuildSidebarParity } from '@/lib/scripts/check-build-sidebar-parity';
import { type JsonObject } from '@lomi./shared';

const DOCS_ROOT = process.cwd();
const MONOREPO_ROOT = path.resolve(DOCS_ROOT, '..', '..');

async function checkDirectChargesDocsMute(errors: string[]): Promise<void> {
  const mdxPath = path.join(
    DOCS_ROOT,
    'content/docs/build/accept/direct-charges.mdx',
  );
  const content = await fs.readFile(mdxPath, 'utf-8');
  const lower = content.toLowerCase();
  if (!lower.includes('503') && !lower.includes('not available')) {
    errors.push(
      'direct-charges.mdx must document card/switch 503 / not available',
    );
  }
}

async function checkWebsiteOpenApiMirror(errors: string[]): Promise<void> {
  const websiteMerchant = path.join(
    MONOREPO_ROOT,
    'apps/website/public/openapi.json',
  );
  const websiteAgent = path.join(
    MONOREPO_ROOT,
    'apps/website/public/agent-openapi.json',
  );
  const docsMerchant = path.join(DOCS_ROOT, 'openapi.json');
  const docsAgent = path.join(DOCS_ROOT, 'agent-openapi.json');

  for (const [file, label] of [
    [websiteMerchant, 'website merchant OpenAPI'],
    [websiteAgent, 'website agent OpenAPI'],
  ]) {
    try {
      const raw = await fs.readFile(file, 'utf-8');
      // SAFETY: Boundary value matches the asserted domain type at this call site.
      const spec = JSON.parse(raw) as {
        info?: { version?: string };
        paths?: object;
      };
      if (spec.info?.version === '0.0.0-stub') {
        errors.push(`${label} is stub 0.0.0-stub`);
      }
      if (Object.keys(spec.paths ?? {}).length === 0) {
        errors.push(`${label} has empty paths`);
      }
    } catch {
      errors.push(`${label} missing at ${file}`);
    }
  }

  try {
    execSync('node lib/scripts/verify-agent-contracts.mjs', {
      cwd: DOCS_ROOT,
      stdio: 'pipe',
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'verify-agent-contracts failed';
    errors.push(`Website OpenAPI mirror: ${message}`);
  }

  const merchantWebsite = await fs.readFile(websiteMerchant);
  const merchantDocs = await fs.readFile(docsMerchant);
  if (!merchantWebsite.equals(merchantDocs)) {
    errors.push(
      'apps/website/public/openapi.json is not byte-identical to apps/docs/openapi.json',
    );
  }
  const agentWebsite = await fs.readFile(websiteAgent);
  const agentDocs = await fs.readFile(docsAgent);
  if (!agentWebsite.equals(agentDocs)) {
    errors.push(
      'apps/website/public/agent-openapi.json is not byte-identical to apps/docs/agent-openapi.json',
    );
  }
}

async function runDocsDrift(): Promise<void> {
  execSync('pnpm docs:drift', { cwd: DOCS_ROOT, stdio: 'inherit' });
}

async function runProductSurfaceParity(): Promise<void> {
  execSync('node lib/scripts/product-surface-parity.mjs', {
    cwd: DOCS_ROOT,
    stdio: 'inherit',
  });
}

async function checkLiveProbe(errors: string[]): Promise<void> {
  if (process.env.PARITY_LIVE_PROBE !== '1') {
    return;
  }

  const checks: Array<{
    url: string;
    assert: (body: string, status: number) => void;
  }> = [
    {
      url: 'https://lomi.africa/openapi.json',
      assert: (body, status) => {
        if (status !== 200) {
          throw new Error(`openapi.json HTTP ${status}`);
        }
        // SAFETY: Boundary value matches the asserted domain type at this call site.
        const spec = JSON.parse(body) as {
          info?: { version?: string };
          paths?: JsonObject;
        };
        if (spec.info?.version === '0.0.0-stub') {
          throw new Error('live openapi.json is stub');
        }
        if (Object.keys(spec.paths ?? {}).length === 0) {
          throw new Error('live openapi.json has no paths');
        }
      },
    },
    {
      url: 'https://lomi.africa/agent-openapi.json',
      assert: (body, status) => {
        if (status !== 200) {
          throw new Error(`agent-openapi.json HTTP ${status}`);
        }
        JSON.parse(body);
      },
    },
    {
      url: 'https://docs.lomi.africa/llms.txt',
      assert: (body, status) => {
        if (status !== 200) {
          throw new Error(`docs llms.txt HTTP ${status}`);
        }
        if (!body.includes('francophone West Africa')) {
          throw new Error('docs llms.txt missing brand definition');
        }
        if (!body.includes('build/mcp')) {
          throw new Error('docs llms.txt missing MCP pointers');
        }
      },
    },
  ];

  for (const check of checks) {
    const response = await fetch(check.url, {
      headers: { Accept: 'application/json, text/plain;q=0.9,*/*;q=0.8' },
    });
    const body = await response.text();
    try {
      check.assert(body, response.status);
    } catch (error) {
      errors.push(
        `Live probe ${check.url}: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }
}

async function main(): Promise<void> {
  const errors: string[] = [];

  await checkAllowlistParity(errors);
  await checkBuildSidebarParity(errors);
  await checkDirectChargesDocsMute(errors);
  await checkWebsiteOpenApiMirror(errors);
  await checkLiveProbe(errors);

  if (errors.length > 0) {
    for (const e of errors) {
      console.error(e);
    }
    throw new Error(`Parity worker failed (${errors.length} issue(s)).`);
  }

  await runDocsDrift();
  await runProductSurfaceParity();

  console.log('Parity worker passed.');
}

void main().catch((err) => {
  console.error(err);
  process.exit(1);
});
