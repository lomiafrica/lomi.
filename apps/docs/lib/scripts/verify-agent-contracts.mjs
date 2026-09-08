/**
 * Verifies machine-readable agent assets for CI (Silicon-friendly / L5 runbook).
 * Run from repo root: node apps/docs/lib/scripts/verify-agent-contracts.mjs
 */
import { readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const docsRoot = join(__dirname, '..', '..');
const monorepoRoot = join(__dirname, '..', '..', '..', '..');

const paths = {
  agentCard: join(monorepoRoot, 'apps/website/public/.well-known/agent.json'),
  websiteOpenApi: join(monorepoRoot, 'apps/website/public/openapi.json'),
  websiteAgentOpenApi: join(
    monorepoRoot,
    'apps/website/public/agent-openapi.json',
  ),
  websiteLlmsMarketing: join(
    monorepoRoot,
    'apps/website/src/lib/seo/llms-marketing.ts',
  ),
  aiCatalog: join(
    monorepoRoot,
    'apps/website/public/.well-known/ai-catalog.json',
  ),
  docsLlmsRoute: join(docsRoot, 'app/llms.txt/route.ts'),
  merchantOpenApi: join(docsRoot, 'openapi.json'),
  agentOpenApi: join(docsRoot, 'agent-openapi.json'),
  expectedPartnerOps: join(
    docsRoot,
    'lib/scripts/manual-api/_expected-partner-operations.json',
  ),
  expectedProvisioningOps: join(
    docsRoot,
    'lib/scripts/manual-api/_expected-provisioning-operations.json',
  ),
};

function assertByteIdentical(sourcePath, destPath, label) {
  const source = readFileSync(sourcePath);
  const dest = readFileSync(destPath);
  if (!source.equals(dest)) {
    throw new Error(
      `${label}: ${destPath} is not byte-identical to ${sourcePath}`,
    );
  }
}

function mustParseJson(label, filePath) {
  if (!existsSync(filePath)) {
    throw new Error(`Missing file: ${filePath} (${label})`);
  }
  const raw = readFileSync(filePath, 'utf-8');
  return JSON.parse(raw);
}

function isStringValue(value) {
  return Object.prototype.toString.call(value) === '[object String]';
}

function isObjectValue(value) {
  return (
    value !== null &&
    Object.prototype.toString.call(value) === '[object Object]'
  );
}

// The agent card lives in the private `apps/website` submodule, which is not
// available on fork PRs (no PAT to clone a private repo). Validate it when the
// submodule is checked out; skip gracefully otherwise so docs CI still runs.
let agentCard = null;
if (existsSync(paths.agentCard)) {
  agentCard = mustParseJson('agent card', paths.agentCard);
  if (!isStringValue(agentCard.name) || !agentCard.endpoints?.openapi) {
    throw new Error('agent.json: expected name and endpoints.openapi');
  }
  if (!agentCard.endpoints.agent_openapi) {
    throw new Error(
      'agent.json: expected endpoints.agent_openapi (re-run agent OpenAPI export)',
    );
  }
  if (agentCard.$schema) {
    throw new Error(
      'agent.json: remove generic JSON Schema $schema unless a real agent-card schema is served',
    );
  }
  if (!agentCard.endpoints.llms_txt?.includes('docs.lomi.africa/llms.txt')) {
    throw new Error(
      'agent.json: endpoints.llms_txt must point to docs.lomi.africa/llms.txt',
    );
  }
  if (
    !agentCard.endpoints.llms_full_txt?.includes(
      'docs.lomi.africa/llms-full.txt',
    )
  ) {
    throw new Error(
      'agent.json: endpoints.llms_full_txt must point to docs.lomi.africa/llms-full.txt',
    );
  }
  if (agentCard.endpoints.openapi !== 'https://lomi.africa/openapi.json') {
    throw new Error(
      'agent.json: endpoints.openapi must be https://lomi.africa/openapi.json',
    );
  }
  if (agentCard.agent?.version && !agentCard.agent?.card_version) {
    throw new Error(
      'agent.json: use agent.card_version for card schema version, not agent.version',
    );
  }
} else {
  globalThis.console.warn(
    `verify-agent-contracts: skipping agent card checks (apps/website submodule not present at ${paths.agentCard})`,
  );
}

if (existsSync(paths.aiCatalog)) {
  const catalog = mustParseJson('ai-catalog', paths.aiCatalog);
  if (!catalog.specVersion || !Array.isArray(catalog.entries)) {
    throw new Error('ai-catalog.json: expected specVersion and entries');
  }
}

const merchantSpec = mustParseJson('merchant OpenAPI', paths.merchantOpenApi);
if (
  !merchantSpec.openapi ||
  !merchantSpec.paths ||
  !isObjectValue(merchantSpec.paths)
) {
  throw new Error('openapi.json: invalid OpenAPI document');
}
if (!merchantSpec.components?.schemas?.ErrorResponse) {
  throw new Error('openapi.json: missing ErrorResponse schema');
}
if (
  !merchantSpec.components?.parameters?.['Idempotency-Key'] &&
  !merchantSpec.components?.parameters?.IdempotencyKey
) {
  throw new Error('openapi.json: missing Idempotency-Key parameter');
}
if (!merchantSpec.components?.securitySchemes?.oauth2) {
  throw new Error('openapi.json: missing oauth2 security scheme');
}

const agentSpec = mustParseJson('agent OpenAPI', paths.agentOpenApi);
if (!agentSpec.openapi || !agentSpec.paths || !isObjectValue(agentSpec.paths)) {
  throw new Error(
    'agent-openapi.json: invalid OpenAPI document (run apps/api: pnpm run openapi:export:agent)',
  );
}

const requiredPaths = [
  '/agent/capabilities',
  '/agent/events',
  '/agent/subscriptions',
  '/agent/workflows',
  '/agent/handoff',
  '/.well-known/oauth-authorization-server',
];

const requiredPartnerPaths = ['/partners/provisioning-keys', '/partners/usage'];

for (const p of requiredPaths) {
  if (!agentSpec.paths[p]) {
    throw new Error(
      `agent-openapi.json must include path ${p} (re-run apps/api: pnpm run openapi:export:agent)`,
    );
  }
  if (merchantSpec.paths[p]) {
    throw new Error(
      `Merchant openapi.json must not include agent path ${p} (agent routes belong in agent-openapi.json)`,
    );
  }
}

for (const p of requiredPartnerPaths) {
  if (!agentSpec.paths[p]) {
    throw new Error(
      `agent-openapi.json must include path ${p} (re-run apps/api: pnpm run openapi:export:agent)`,
    );
  }
  if (merchantSpec.paths[p]) {
    throw new Error(
      `Merchant openapi.json must not include partner path ${p} (partner routes belong in agent-openapi.json)`,
    );
  }
}

const expectedPartnerOps = mustParseJson(
  'expected partner operations',
  paths.expectedPartnerOps,
);
if (!Array.isArray(expectedPartnerOps)) {
  throw new Error('_expected-partner-operations.json must be a JSON array');
}
for (const entry of expectedPartnerOps) {
  const [method, ...pathParts] = String(entry).split(/\s+/);
  const pathKey = pathParts.join(' ');
  const pathItem = agentSpec.paths[pathKey];
  const op = pathItem?.[method.toLowerCase()];
  if (!op) {
    throw new Error(
      `agent-openapi.json missing partner operation ${entry} (re-run openapi:export:agent)`,
    );
  }
}

const expectedProvisioningOps = mustParseJson(
  'expected provisioning operations',
  paths.expectedProvisioningOps,
);
if (!Array.isArray(expectedProvisioningOps)) {
  throw new Error(
    '_expected-provisioning-operations.json must be a JSON array',
  );
}
for (const entry of expectedProvisioningOps) {
  const [method, ...pathParts] = String(entry).split(/\s+/);
  const pathKey = pathParts.join(' ');
  const pathItem = agentSpec.paths[pathKey];
  const op = pathItem?.[method.toLowerCase()];
  if (!op) {
    throw new Error(
      `agent-openapi.json missing provisioning operation ${entry} (re-run openapi:export:agent)`,
    );
  }
}

if (agentCard) {
  for (const [key, url] of Object.entries(agentCard.agent ?? {})) {
    if (key === 'card_version' || !isStringValue(url)) continue;
    const pathKey = new URL(url).pathname;
    if (!agentSpec.paths[pathKey]) {
      throw new Error(
        `agent.json: agent.${key} points to missing agent-openapi path ${pathKey}`,
      );
    }
  }
}

if (existsSync(paths.websiteOpenApi) && existsSync(paths.merchantOpenApi)) {
  assertByteIdentical(
    paths.merchantOpenApi,
    paths.websiteOpenApi,
    'website merchant OpenAPI mirror',
  );
}

if (existsSync(paths.websiteAgentOpenApi) && existsSync(paths.agentOpenApi)) {
  assertByteIdentical(
    paths.agentOpenApi,
    paths.websiteAgentOpenApi,
    'website agent OpenAPI mirror',
  );
}

if (existsSync(paths.websiteLlmsMarketing)) {
  const llmsMarketing = readFileSync(paths.websiteLlmsMarketing, 'utf-8');
  const forbiddenLlmsPaths = [
    '/build/guides/payment-links',
    '/build/guides/subscriptions',
    'Orange Money',
  ];
  for (const fragment of forbiddenLlmsPaths) {
    if (llmsMarketing.includes(fragment)) {
      throw new Error(
        `llms-marketing.ts must not reference ${fragment} (stale link or unsupported claim)`,
      );
    }
  }
}

if (existsSync(paths.docsLlmsRoute)) {
  const docsLlms = readFileSync(paths.docsLlmsRoute, 'utf-8');
  const brandFactsPath = join(docsRoot, 'lib/seo/brand-facts.ts');
  if (existsSync(brandFactsPath)) {
    const brandFacts = readFileSync(brandFactsPath, 'utf-8');
    const defMatch = brandFacts.match(
      /export const BRAND_DEFINITION =\s*\n?\s*'([^']+)'/,
    );
    if (defMatch) {
      if (!docsLlms.includes('BRAND_DEFINITION')) {
        throw new Error(
          'docs llms.txt route must import and use BRAND_DEFINITION from lib/seo/brand-facts.ts',
        );
      }
      if (!docsLlms.includes('buildLlmsGeoSections')) {
        throw new Error(
          'docs llms.txt route must use buildLlmsGeoSections from agent-corpus builder',
        );
      }
    }
  }
  if (
    !docsLlms.includes(
      'https://mcp.lomi.africa/.well-known/oauth-protected-resource/mcp',
    )
  ) {
    throw new Error(
      'docs llms.txt route must document canonical MCP OAuth resource /oauth-protected-resource/mcp',
    );
  }
  const staleLlmsSlugs = [
    'build/guides/verify-payments',
    'build/guides/payment-lifecycle',
    'build/tasks',
  ];
  for (const slug of staleLlmsSlugs) {
    if (docsLlms.includes(slug)) {
      throw new Error(
        `docs llms.txt route must not reference moved slug ${slug}`,
      );
    }
  }
}

const docsDiscoveryPath = join(docsRoot, 'lib/seo/agent-discovery.ts');
const docsSkillRoute = join(
  docsRoot,
  'app/.well-known/agent-skills/lomi-payments/SKILL.md/route.ts',
);
const docsAgentCardRoute = join(
  docsRoot,
  'app/.well-known/agent.json/route.ts',
);
const docsAiCatalogRoute = join(
  docsRoot,
  'app/.well-known/ai-catalog.json/route.ts',
);
const docsMcpCardRoute = join(
  docsRoot,
  'app/.well-known/mcp/server-card.json/route.ts',
);
const docsAgentsMdRoute = join(docsRoot, 'app/agents.md/route.ts');

for (const [label, filePath] of [
  ['docs agent-discovery', docsDiscoveryPath],
  ['docs SKILL.md route', docsSkillRoute],
  ['docs agent.json route', docsAgentCardRoute],
  ['docs ai-catalog route', docsAiCatalogRoute],
  ['docs MCP server-card route', docsMcpCardRoute],
  ['docs agents.md route', docsAgentsMdRoute],
]) {
  if (!existsSync(filePath)) {
    throw new Error(`Missing ${label}: ${filePath}`);
  }
}

const docsDiscovery = readFileSync(docsDiscoveryPath, 'utf-8');
if (!docsDiscovery.includes("AGENT_SKILL_NAME = 'lomi-payments'")) {
  throw new Error('docs agent-discovery must publish skill name lomi-payments');
}
if (!docsDiscovery.includes('MCP_ORIGIN')) {
  throw new Error(
    'docs agent-discovery must import MCP_ORIGIN for the hosted MCP URL',
  );
}
if (!docsDiscovery.includes('BRAND_DEFINITION')) {
  throw new Error('docs agent-discovery must reuse BRAND_DEFINITION');
}
if (docsDiscovery.includes('/build/tasks')) {
  throw new Error(
    'docs agent-discovery must not link the removed /build/tasks hub',
  );
}

if (agentCard) {
  const brandFactsPath = join(docsRoot, 'lib/seo/brand-facts.ts');
  const brandFacts = existsSync(brandFactsPath)
    ? readFileSync(brandFactsPath, 'utf-8')
    : '';
  if (
    isStringValue(agentCard.description) &&
    !brandFacts.includes(agentCard.description)
  ) {
    throw new Error(
      'docs brand-facts BRAND_DEFINITION must match website agent.json description',
    );
  }
  for (const capability of agentCard.capabilities ?? []) {
    if (!docsDiscovery.includes(`'${capability}'`)) {
      throw new Error(
        `docs agent-discovery must include website capability ${capability}`,
      );
    }
  }
  if (agentCard.authentication?.headerName === 'X-API-KEY') {
    if (!docsDiscovery.includes("headerName: 'X-API-KEY'")) {
      throw new Error(
        'docs agent-discovery authentication header must match website agent.json',
      );
    }
  }
}

globalThis.console.log('verify-agent-contracts: ok');
