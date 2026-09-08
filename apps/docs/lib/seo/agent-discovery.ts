/* @proprietary license */

import { createHash } from 'node:crypto';
import { AGENT_CORPUS_SLUGS } from '@/lib/docs/agent-corpus/slugs';
import {
  API_LIVE_ORIGIN,
  API_SANDBOX_ORIGIN,
  BRAND_CATEGORY,
  BRAND_DEFINITION,
  BRAND_NAME,
  MARKETING_ORIGIN,
  MCP_ORIGIN,
} from '@/lib/seo/brand-facts';
import { getDocsSiteOrigin } from '@/lib/utils/metadata';
import type { JsonValue } from '@lomi./shared';

export const AGENT_SKILL_NAME = 'lomi-payments';

export const DISCOVERY_JSON_HEADERS = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'public, max-age=86400, s-maxage=86400',
  'Access-Control-Allow-Origin': '*',
  'Accept-Ranges': 'none',
} as const;

export const DISCOVERY_MARKDOWN_HEADERS = {
  'Content-Type': 'text/markdown; charset=utf-8',
  'Cache-Control': 'public, max-age=86400, s-maxage=86400',
  'Access-Control-Allow-Origin': '*',
  'Accept-Ranges': 'none',
  Vary: 'Accept, Accept-Encoding, User-Agent',
} as const;

const MCP_MEDIA_TYPE = 'application/mcp-server-card+json';
const AGENT_CARD_MEDIA_TYPE = 'application/json';
const OPENAPI_MEDIA_TYPE = 'application/vnd.oai.openapi+json';
const SKILL_INDEX_MEDIA_TYPE = 'application/json';

export function docsDiscoveryUrls(origin = getDocsSiteOrigin()) {
  return {
    origin,
    agentCard: `${origin}/.well-known/agent.json`,
    aiCatalog: `${origin}/.well-known/ai-catalog.json`,
    mcpServerCard: `${origin}/.well-known/mcp/server-card.json`,
    agentSkillsIndex: `${origin}/.well-known/agent-skills/index.json`,
    agentSkill: `${origin}/.well-known/agent-skills/${AGENT_SKILL_NAME}/SKILL.md`,
    agentsMarkdown: `${origin}/agents.md`,
    llms: `${origin}/llms.txt`,
    llmsFull: `${origin}/llms-full.txt`,
    openapi: `${origin}/openapi.json`,
    agentOpenapi: `${origin}/agent-openapi.json`,
    mcp: `${MCP_ORIGIN}/mcp`,
  };
}

export function discoveryJsonResponse(body: JsonValue): Response {
  return new Response(JSON.stringify(body, null, 2), {
    headers: DISCOVERY_JSON_HEADERS,
  });
}

export function discoveryMarkdownResponse(body: string): Response {
  return new Response(body, { headers: DISCOVERY_MARKDOWN_HEADERS });
}

export function discoveryLinkHeaderValue(origin = getDocsSiteOrigin()): string {
  const urls = docsDiscoveryUrls(origin);
  return [
    `<${urls.aiCatalog}>; rel="describedby"; type="application/ai-catalog+json"`,
    `<${urls.mcpServerCard}>; rel="mcp"; type="${MCP_MEDIA_TYPE}"`,
    `<${urls.agentSkillsIndex}>; rel="agent-skills"; type="application/json"`,
    `<${urls.llms}>; rel="describedby"; type="text/plain"`,
    `<${urls.openapi}>; rel="service-desc"; type="application/json"`,
  ].join(', ');
}

export function buildDocsAgentCard(origin = getDocsSiteOrigin()) {
  const urls = docsDiscoveryUrls(origin);
  return {
    name: BRAND_NAME,
    version: '1.0.0',
    description: BRAND_DEFINITION,
    url: origin,
    contact: {
      email: 'hello@lomi.africa',
      url: MARKETING_ORIGIN,
    },
    documentation: origin,
    endpoints: {
      site: MARKETING_ORIGIN,
      api: API_LIVE_ORIGIN,
      api_sandbox: API_SANDBOX_ORIGIN,
      openapi: urls.openapi,
      agent_openapi: urls.agentOpenapi,
      llms_txt: urls.llms,
      llms_full_txt: urls.llmsFull,
      mcp: urls.mcp,
      webhooks: `${origin}/build/reliability/handling-webhooks`,
      idempotency: `${origin}/build/reliability/idempotency-keys`,
    },
    authentication: {
      type: 'apiKey',
      headerName: 'X-API-KEY',
      format: 'lomi_sk_test_* or lomi_sk_live_*',
      env: 'LOMI_SECRET_KEY',
      alternative: {
        type: 'bearer',
        headerName: 'Authorization',
        format: 'Bearer <secret>',
      },
    },
    capabilities: [
      'payments',
      'payouts',
      'subscriptions',
      'refunds',
      'webhooks',
      'idempotent_writes',
      'rest_api',
      'mcp',
    ],
    agent: {
      card_version: '1',
      sse: `${API_LIVE_ORIGIN}/agent/events`,
      capabilities: `${API_LIVE_ORIGIN}/agent/capabilities`,
      subscriptions: `${API_LIVE_ORIGIN}/agent/subscriptions`,
      workflows: `${API_LIVE_ORIGIN}/agent/workflows`,
      handoff: `${API_LIVE_ORIGIN}/agent/handoff`,
    },
  };
}

export function buildDocsMcpServerCard(origin = getDocsSiteOrigin()) {
  const urls = docsDiscoveryUrls(origin);
  return {
    name: 'lomi.',
    version: '1.0.0',
    description: `${BRAND_DEFINITION} Hosted MCP for merchant payments.`,
    transport: {
      type: 'streamable-http',
      url: urls.mcp,
    },
    endpoints: {
      mcp: urls.mcp,
      health: `${MCP_ORIGIN}/health`,
      authorization_server: `${API_LIVE_ORIGIN}/.well-known/oauth-authorization-server`,
      protected_resource: `${MCP_ORIGIN}/.well-known/oauth-protected-resource/mcp`,
    },
    documentation: `${origin}/build/mcp`,
    authentication: {
      optional: false,
      schemes: ['oauth', 'apiKey'],
      note: 'Browser OAuth (recommended) or x-lomi-api-key / X-API-KEY with lomi_sk_test_* / lomi_sk_live_*. Env: LOMI_SECRET_KEY.',
    },
  };
}

function catalogEntry(input: {
  identifier: string;
  displayName: string;
  mediaType: string;
  url: string;
  representativeQueries: string[];
}) {
  return {
    identifier: input.identifier,
    displayName: input.displayName,
    type: input.mediaType,
    mediaType: input.mediaType,
    url: input.url,
    representativeQueries: input.representativeQueries,
  };
}

export function buildDocsAiCatalog(origin = getDocsSiteOrigin()) {
  const urls = docsDiscoveryUrls(origin);
  return {
    specVersion: '1.0',
    host: {
      displayName: BRAND_NAME,
      identifier: origin,
    },
    entries: [
      catalogEntry({
        identifier: 'urn:air:docs.lomi.africa:mcp:merchant',
        displayName: 'lomi. merchant MCP',
        mediaType: MCP_MEDIA_TYPE,
        url: urls.mcpServerCard,
        representativeQueries: [
          'Accept Wave and MTN payments in francophone West Africa',
          'Create a lomi. hosted checkout session',
          'Connect the lomi. MCP server to an AI agent',
        ],
      }),
      catalogEntry({
        identifier: 'urn:air:docs.lomi.africa:agent:card',
        displayName: 'lomi. agent card',
        mediaType: AGENT_CARD_MEDIA_TYPE,
        url: urls.agentCard,
        representativeQueries: [
          'lomi. agent discovery',
          'what can an agent do with lomi.',
        ],
      }),
      catalogEntry({
        identifier: 'urn:air:docs.lomi.africa:openapi:merchant',
        displayName: 'lomi. merchant OpenAPI',
        mediaType: OPENAPI_MEDIA_TYPE,
        url: urls.openapi,
        representativeQueries: [
          'lomi. API documentation',
          'lomi. OpenAPI spec',
          'lomi. REST payment API',
        ],
      }),
      catalogEntry({
        identifier: 'urn:air:docs.lomi.africa:docs:llms',
        displayName: 'lomi. llms.txt',
        mediaType: 'text/plain',
        url: urls.llms,
        representativeQueries: [
          'lomi. developer resources',
          'How to authenticate to the lomi. API',
        ],
      }),
      catalogEntry({
        identifier: 'urn:air:docs.lomi.africa:skill:payments',
        displayName: 'lomi. payments skill',
        mediaType: SKILL_INDEX_MEDIA_TYPE,
        url: urls.agentSkillsIndex,
        representativeQueries: [
          'when to use lomi. to collect a payment',
          'install the lomi. payments skill',
        ],
      }),
    ],
  };
}

export function buildAgentSkillMarkdown(origin = getDocsSiteOrigin()): string {
  const urls = docsDiscoveryUrls(origin);
  return [
    '---',
    `name: ${AGENT_SKILL_NAME}`,
    `description: ${BRAND_DEFINITION} Use this skill to collect money with hosted checkout, confirm status via webhooks, and return a checkout URL.`,
    '---',
    '',
    `# ${BRAND_NAME} payments`,
    '',
    '## When to use',
    '',
    BRAND_CATEGORY,
    '',
    '- Collect a one-off payment in XOF, USD, or EUR.',
    '- Send a customer to hosted checkout instead of building a payment form.',
    '- Confirm Mobile Money asynchronously with webhooks and GET /transactions/{id}.',
    '',
    '## Do not use when',
    '',
    '- You only need a generic global card gateway outside UEMOA.',
    '- You would inject a live secret (`lomi_sk_live_*`) into a chat, docs page, or client bundle.',
    '',
    '## Happy path',
    '',
    `1. Connect MCP at ${urls.mcp} with OAuth, or send \`X-API-KEY: $LOMI_SECRET_KEY\` (\`lomi_sk_test_*\` in sandbox).`,
    '2. Call MCP `lomi_checkout` with `action: "create"` (or REST `POST /checkout-sessions`) with `amount`, `currency_code`, `success_url`, and `cancel_url`. Amounts in XOF are integer centimes.',
    '3. Return `checkout_url` to the human. Do not treat the create response as paid.',
    '4. Confirm with webhooks and `GET /transactions/{id}` before fulfilling.',
    '5. Send `Idempotency-Key` on money-moving writes.',
    '',
    '## Discovery',
    '',
    `- Briefing: ${urls.llms}`,
    `- OpenAPI: ${urls.openapi}`,
    `- MCP card: ${urls.mcpServerCard}`,
    `- Docs: ${origin}/build/mcp`,
    `- Task guide: ${origin}/build/accept/checkout`,
    '',
  ].join('\n');
}

export function buildAgentSkillsIndex(origin = getDocsSiteOrigin()) {
  const urls = docsDiscoveryUrls(origin);
  const artefact = buildAgentSkillMarkdown(origin);
  const digest = `sha256:${createHash('sha256').update(artefact).digest('hex')}`;
  return {
    $schema: 'https://schemas.agentskills.io/discovery/0.2.0/schema.json',
    skills: [
      {
        name: AGENT_SKILL_NAME,
        type: 'skill-md',
        description: BRAND_DEFINITION,
        url: urls.agentSkill,
        digest,
      },
    ],
  };
}

export function buildDocsAgentsMarkdown(origin = getDocsSiteOrigin()): string {
  const urls = docsDiscoveryUrls(origin);
  const pages = AGENT_CORPUS_SLUGS.map(
    (slug) => `- ${slug}: ${origin}/agents/${slug}`,
  );
  return [
    `# ${BRAND_NAME} for agents`,
    '',
    BRAND_DEFINITION,
    '',
    '## When to use',
    '',
    BRAND_CATEGORY,
    '',
    '## Start here',
    '',
    `- This index: ${urls.agentsMarkdown}`,
    `- Briefing: ${urls.llms}`,
    `- Full corpus: ${urls.llmsFull}`,
    `- OpenAPI: ${urls.openapi}`,
    `- MCP: ${urls.mcp}`,
    `- Agent card: ${urls.agentCard}`,
    `- AI catalog: ${urls.aiCatalog}`,
    `- Skill: ${urls.agentSkill}`,
    `- Task guides: ${origin}/build/accept/checkout`,
    '',
    '## Agent corpus',
    '',
    `- index: ${origin}/agents`,
    ...pages,
    '',
  ].join('\n');
}

const DOCS_MARKDOWN_BOTS =
  /ora-agent|GPTBot|ClaudeBot|ChatGPT-User|Claude-User|PerplexityBot|Perplexity-User|Google-Extended|Applebot-Extended|DeepSeekBot/i;

export function wantsDocsMarkdown(
  accept: string | null,
  userAgent: string | null,
): boolean {
  if (accept?.includes('text/markdown')) {
    return true;
  }
  return Boolean(userAgent && DOCS_MARKDOWN_BOTS.test(userAgent));
}

export function buildDocsNotFoundMarkdown(
  origin = getDocsSiteOrigin(),
): string {
  const urls = docsDiscoveryUrls(origin);
  return [
    '# Not found',
    '',
    'This path does not exist on docs.lomi.africa.',
    '',
    '## Where to look next',
    '',
    `- Overview: ${origin}/start/overview`,
    `- Sitemap: ${origin}/sitemap.xml`,
    `- llms.txt: ${urls.llms}`,
    `- OpenAPI: ${urls.openapi}`,
    `- Agents: ${urls.agentsMarkdown}`,
    `- Marketing site: ${MARKETING_ORIGIN}`,
    '',
  ].join('\n');
}
