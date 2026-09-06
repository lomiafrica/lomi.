/* @proprietary license */

import { execSync } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import { glob } from 'tinyglobby';
import { isPublicRestApiOperation } from '@/lib/scripts/manual-api/constants';
import { collectPublicOperations } from '@/lib/scripts/manual-api/render-operation-mdx';
import {
  flattenMcpTwins,
  loadMcpToolPolicyFile,
  mcpTwinAnchor,
  mcpTwinHref,
  parseMcpToolPolicy,
  restDocsHrefFromMdxFile,
} from '@/lib/mcp-twins';

const DOCS_ROOT = process.cwd();
const CONTENT_ROOT = path.join(DOCS_ROOT, 'content/docs');

/** English MDX without a locale suffix must have a `.fr.mdx` sibling. */
async function checkAllFrenchSiblings(errors: string[]): Promise<void> {
  const files = await glob('**/*.mdx', { cwd: CONTENT_ROOT });
  const frFiles = new Set(files.filter((f) => f.endsWith('.fr.mdx')));

  for (const file of files) {
    if (/\.(fr|es|zh)\.mdx$/.test(file)) continue;
    const frSibling = file.replace(/\.mdx$/, '.fr.mdx');
    if (!frFiles.has(frSibling)) {
      errors.push(`Missing French sibling: ${frSibling} (for ${file})`);
    }
  }
}

const LLMS_REQUIRED_SLUGS = [
  'start/integration-journey',
  'build/reliability/verify-payments',
  'build/reliability/payment-lifecycle',
  'build/payment-channels',
  'api/payment-state-machine',
  'build/mcp',
  'build/accept/checkout',
] as const;

/** Published fees must come from `@lomi./shared` via `<PricingTable />`, not MDX literals. */
const FEE_LITERAL_RE = /[0-9]+(?:[.,][0-9]+)?\s*%\s*\+\s*[0-9]/;

const INTERNAL_LINK_RE = /\]\(\/(start|build|api|resources)\/([^)\s#]+)/g;

function slugFromMdxFile(relativeToContent: string): string {
  const withoutExt = relativeToContent.replace(/\.mdx$/, '');
  return withoutExt.replace(/\.fr$/, '');
}

async function collectValidSlugs(): Promise<Set<string>> {
  const files = await glob('**/*.mdx', { cwd: CONTENT_ROOT });
  const slugs = new Set<string>();

  const addSlug = (slug: string) => {
    slugs.add(slug);
    if (slug.endsWith('/index')) {
      slugs.add(slug.slice(0, -'/index'.length));
    }
  };

  for (const file of files) {
    addSlug(slugFromMdxFile(file));
  }

  for (const segment of ['start', 'build', 'api', 'resources']) {
    const dirs = await glob(`${segment}/*`, {
      cwd: CONTENT_ROOT,
      onlyDirectories: true,
    });
    for (const dir of dirs) {
      addSlug(dir.replace(/\\/g, '/'));
    }
  }

  return slugs;
}

async function checkOpenApiParity(errors: string[]): Promise<void> {
  const openApiPath = path.join(DOCS_ROOT, 'openapi.json');
  const raw = await fs.readFile(openApiPath, 'utf-8');
  // SAFETY: Boundary value matches the asserted domain type at this call site.
  const spec = JSON.parse(raw) as Parameters<typeof collectPublicOperations>[0];

  const operations = collectPublicOperations(spec).filter((o) =>
    isPublicRestApiOperation(o.method, o.path),
  );

  const expected = new Set(
    operations.map((o) => `${o.method.toUpperCase()} ${o.path}`),
  );

  const documented = await collectDocumentedRestOperations();

  for (const op of expected) {
    if (!documented.has(op)) {
      errors.push(`OpenAPI operation missing MDX: ${op}`);
    }
  }

  for (const op of documented.keys()) {
    if (!expected.has(op)) {
      errors.push(
        `MDX documents unknown or non-public OpenAPI operation: ${op}`,
      );
    }
  }
}

async function checkInternalLinks(
  errors: string[],
  validSlugs: Set<string>,
): Promise<void> {
  const files = await glob(
    [
      'content/docs/start/integration-journey*.mdx',
      'content/docs/build/choose-integration*.mdx',
      'content/docs/build/reliability/**/*.mdx',
      'content/docs/build/payment-methods/**/*.mdx',
    ],
    { cwd: DOCS_ROOT },
  );

  for (const file of files) {
    const content = await fs.readFile(path.join(DOCS_ROOT, file), 'utf-8');
    const matches = content.matchAll(INTERNAL_LINK_RE);
    for (const match of matches) {
      const slug = `${match[1]}/${match[2]}`;
      if (!validSlugs.has(slug)) {
        errors.push(`Dead internal link in ${file}: /${slug}`);
      }
    }
  }
}

async function checkAgentContracts(errors: string[]): Promise<void> {
  const scriptPath = path.join(
    DOCS_ROOT,
    'lib/scripts/verify-agent-contracts.mjs',
  );
  try {
    execSync(`node "${scriptPath}"`, { stdio: 'pipe', cwd: DOCS_ROOT });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'verify-agent-contracts failed';
    errors.push(`Agent contract check failed: ${message}`);
  }
}

async function checkMcpManifestParity(errors: string[]): Promise<void> {
  const expectedPath = path.join(
    DOCS_ROOT,
    'lib/scripts/manual-api/_expected-public-operations.json',
  );
  const manifestPath = path.resolve(
    DOCS_ROOT,
    '..',
    'mcp',
    'src/generated/tools-manifest.json',
  );

  const expectedRaw = await fs.readFile(expectedPath, 'utf-8');
  // SAFETY: Boundary value matches the asserted domain type at this call site.
  const expected = JSON.parse(expectedRaw) as string[];

  // MCP intentionally drops some allowlisted operations (e.g. direct charges
  // that need client-side PCI collection). Those exclusions live in the
  // MCP-only policy file and never affect the shared SDK allowlist.
  const policyPath = path.resolve(
    DOCS_ROOT,
    '..',
    'mcp',
    'config/mcp-tool-policy.json',
  );
  const policyRaw = await fs.readFile(policyPath, 'utf-8');
  // SAFETY: Boundary value matches the asserted domain type at this call site.
  const policy = JSON.parse(policyRaw) as {
    mcpExcludedOperationKeys?: string[];
  };
  const excluded = new Set(policy.mcpExcludedOperationKeys ?? []);
  const expectedMcpOps = expected.filter((op) => !excluded.has(op));

  const manifestRaw = await fs.readFile(manifestPath, 'utf-8');
  // SAFETY: Boundary value matches the asserted domain type at this call site.
  const manifest = JSON.parse(manifestRaw) as {
    tools?: Array<{
      actions?: Record<string, { operationKey?: string }>;
    }>;
  };

  const covered = new Set<string>();
  for (const tool of manifest.tools ?? []) {
    for (const action of Object.values(tool.actions ?? {})) {
      if (action.operationKey) covered.add(action.operationKey);
    }
  }

  for (const op of expectedMcpOps) {
    if (!covered.has(op)) {
      errors.push(`MCP manifest missing operation: ${op}`);
    }
  }
  for (const op of covered) {
    if (!expectedMcpOps.includes(op) && !excluded.has(op)) {
      errors.push(`MCP manifest has unexpected operation: ${op}`);
    }
  }

  const mcpRoot = path.resolve(DOCS_ROOT, '..', 'mcp');
  try {
    execSync('pnpm run generate:check', {
      cwd: mcpRoot,
      stdio: 'pipe',
    });
  } catch {
    errors.push(
      'MCP tools manifest is out of date. Run `cd apps/mcp && pnpm run generate` and commit src/generated/tools-manifest.json',
    );
  }
}

async function collectDocumentedRestOperations(): Promise<Map<string, string>> {
  const docFiles = (
    await glob('content/docs/api/*/*.mdx', { cwd: DOCS_ROOT })
  ).filter((file) => !file.endsWith('.fr.mdx') && !/\/index\.mdx$/.test(file));

  const documented = new Map<string, string>();

  for (const file of docFiles) {
    const content = await fs.readFile(path.join(DOCS_ROOT, file), 'utf-8');
    const methodMatch = /^method:\s*(\S+)/m.exec(content);
    const pathMatch = /^path:\s*(.+)$/m.exec(content);
    if (!methodMatch || !pathMatch) continue;
    const routePath = pathMatch[1].trim().replace(/^['"]|['"]$/g, '');
    const key = `${methodMatch[1].toUpperCase()} ${routePath}`;
    const href = restDocsHrefFromMdxFile(file);
    if (href && !documented.has(key)) {
      documented.set(key, href);
    }
  }

  return documented;
}

async function checkMcpTwinDrift(errors: string[]): Promise<void> {
  const policy = parseMcpToolPolicy(
    loadMcpToolPolicyFile(
      path.resolve(DOCS_ROOT, '..', 'mcp', 'config/mcp-tool-policy.json'),
    ),
  );
  const documented = await collectDocumentedRestOperations();
  const excluded = new Set(policy.excludedOperationKeys);
  const twins = flattenMcpTwins(policy.groups);

  for (const [operationKey, twin] of twins) {
    const expectedAnchor = mcpTwinAnchor(twin.tool, twin.action);
    const expectedHref = mcpTwinHref(twin.tool, twin.action);
    if (expectedAnchor !== `${twin.tool}-${twin.action}`) {
      errors.push(`Unstable MCP twin anchor for ${operationKey}`);
    }
    if (expectedHref !== `/build/mcp#${expectedAnchor}`) {
      errors.push(
        `Unstable MCP twin href for ${operationKey}: ${expectedHref}`,
      );
    }

    if (twin.authMode !== 'merchant') continue;
    if (excluded.has(operationKey)) {
      errors.push(
        `MCP policy maps excluded operation ${operationKey} on ${twin.tool}.${twin.action}`,
      );
      continue;
    }
    const restHref = documented.get(operationKey);
    if (!restHref) {
      errors.push(
        `MCP twin missing REST MDX: ${twin.tool} action=${twin.action} -> ${operationKey}`,
      );
    }
  }

  for (const operationKey of excluded) {
    if (twins.has(operationKey)) {
      errors.push(`MCP excluded operation still has a twin: ${operationKey}`);
    }
  }

  const mcpIndexEn = await fs.readFile(
    path.join(CONTENT_ROOT, 'build/mcp/index.mdx'),
    'utf-8',
  );
  const mcpIndexFr = await fs.readFile(
    path.join(CONTENT_ROOT, 'build/mcp/index.fr.mdx'),
    'utf-8',
  );
  if (!mcpIndexEn.includes('<McpOperationIndex')) {
    errors.push('English MCP guide is missing <McpOperationIndex />');
  }
  if (!mcpIndexFr.includes('<McpOperationIndex')) {
    errors.push('French MCP guide is missing <McpOperationIndex />');
  }
}

async function checkLlmsTxtRoute(errors: string[]): Promise<void> {
  const routePath = path.join(DOCS_ROOT, 'app/llms.txt/route.ts');
  const source = await fs.readFile(routePath, 'utf-8');

  for (const slug of LLMS_REQUIRED_SLUGS) {
    if (!source.includes(slug)) {
      errors.push(`llms.txt route.ts does not reference slug: ${slug}`);
    }
  }
}

const NEXT_STEPS_MAX = 4;

const BANNED_NEXT_STEP_HEADING_RE =
  /^## (Next steps|Étapes suivantes|Suite|What should I read next\?|What should I build next\?|Que lire ensuite \?|Que construire ensuite \?|Related documentation|Documentation associée)\s*$/m;

const NEXT_STEP_CHILD_RE = /<DocsNextStep\b/g;

async function checkNextSteps(errors: string[]): Promise<void> {
  const files = await glob('**/*.mdx', { cwd: CONTENT_ROOT });
  for (const file of files) {
    const content = await fs.readFile(path.join(CONTENT_ROOT, file), 'utf-8');
    if (BANNED_NEXT_STEP_HEADING_RE.test(content)) {
      errors.push(
        `Legacy next-steps heading in ${file}: use <DocsNextSteps> (max ${NEXT_STEPS_MAX})`,
      );
    }

    const blocks = content.split(/<DocsNextSteps[\s>]/).slice(1);
    for (const [index, block] of blocks.entries()) {
      const close = block.indexOf('</DocsNextSteps>');
      const body = close === -1 ? block : block.slice(0, close);
      const count = body.match(NEXT_STEP_CHILD_RE)?.length ?? 0;
      if (count > NEXT_STEPS_MAX) {
        errors.push(
          `${file} DocsNextSteps #${index + 1} has ${count} items; max is ${NEXT_STEPS_MAX}`,
        );
      }
    }
  }
}

async function checkFeeLiterals(errors: string[]): Promise<void> {
  const files = await glob('**/*.mdx', { cwd: CONTENT_ROOT });
  for (const file of files) {
    const content = await fs.readFile(path.join(CONTENT_ROOT, file), 'utf-8');
    if (FEE_LITERAL_RE.test(content)) {
      errors.push(
        `Bare fee literal in ${file}: use <PricingTable /> / @lomi./shared instead of "% + N F CFA" in MDX`,
      );
    }
  }
}

async function main(): Promise<void> {
  const errors: string[] = [];
  const validSlugs = await collectValidSlugs();

  await checkOpenApiParity(errors);
  await checkAgentContracts(errors);
  await checkMcpManifestParity(errors);
  await checkMcpTwinDrift(errors);
  await checkAllFrenchSiblings(errors);
  await checkInternalLinks(errors, validSlugs);
  await checkLlmsTxtRoute(errors);
  await checkFeeLiterals(errors);
  await checkNextSteps(errors);

  if (errors.length > 0) {
    for (const e of errors) console.error(e);
    throw new Error(`Docs drift check failed (${errors.length} issue(s)).`);
  }

  console.log('Docs drift checks passed.');
}

void main().catch((err) => {
  console.error(err);
  process.exit(1);
});
