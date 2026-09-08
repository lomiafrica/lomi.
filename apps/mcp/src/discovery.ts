import type { ToolsManifest } from './manifest.js';
import {
  getMcpGuestResourceUrl,
  getMcpResourceUrl,
  getOAuthIssuer,
  getProtectedResourceMetadataUrl,
} from './oauth-introspection.js';

export function buildMcpServerCard(manifest: ToolsManifest) {
  return {
    name: 'io.lomi/mcp',
    version: manifest.apiVersion,
    title: 'lomi.',
    description:
      'Payment infrastructure for francophone West Africa: hosted checkout, Mobile Money, cards, payouts, subscriptions, and developer APIs across UEMOA.',
    websiteUrl: 'https://lomi.africa',
    repository: {
      url: 'https://github.com/lomiafrica/lomi.',
      source: 'github',
    },
    remotes: [
      {
        type: 'streamable-http',
        url: getMcpResourceUrl(),
      },
      {
        type: 'streamable-http',
        url: getMcpGuestResourceUrl(),
        name: 'guest',
      },
    ],
    authentication: {
      oauth: {
        authorization_servers: [getOAuthIssuer()],
        protected_resource_metadata: getProtectedResourceMetadataUrl(),
      },
    },
  };
}

export function buildMcpToolsPreview(manifest: ToolsManifest) {
  return manifest.tools.map((tool) => ({
    name: tool.name,
    title: tool.title,
    description: tool.description.split('\n')[0] ?? tool.title,
  }));
}

export function buildMcpWellKnown(manifest: ToolsManifest) {
  const resource = getMcpResourceUrl();
  const origin = new URL(resource).origin;
  return {
    mcp: resource,
    mcp_guest: getMcpGuestResourceUrl(),
    server_card: `${origin}/server-card`,
    catalog: `${origin}/.well-known/mcp/catalog.json`,
    authorization_server: `${getOAuthIssuer()}/.well-known/oauth-authorization-server`,
    protected_resource: getProtectedResourceMetadataUrl(),
    tools_preview: buildMcpToolsPreview(manifest),
  };
}

export function buildMcpCatalog(manifest: ToolsManifest) {
  const resource = getMcpResourceUrl();
  const origin = new URL(resource).origin;
  return {
    servers: [
      {
        name: 'io.lomi/mcp',
        version: manifest.apiVersion,
        url: `${origin}/server-card`,
      },
    ],
  };
}

export function buildAuthorizationServerPointer() {
  const issuer = getOAuthIssuer();
  return {
    issuer,
    authorization_endpoint: `${issuer}/oauth/authorize`,
    token_endpoint: `${issuer}/oauth/token`,
    registration_endpoint: `${issuer}/oauth/register`,
    revocation_endpoint: `${issuer}/oauth/revoke`,
    introspection_endpoint: `${issuer}/oauth/introspect`,
    response_types_supported: ['code'],
    grant_types_supported: ['authorization_code', 'refresh_token'],
    code_challenge_methods_supported: ['S256'],
    token_endpoint_auth_methods_supported: ['none', 'client_secret_post'],
    scopes_supported: [
      'provisioning.onboard',
      'merchant.read',
      'merchant.write',
      'merchant.money',
    ],
  };
}

const MARKDOWN_BOTS =
  /ora-agent|GPTBot|ClaudeBot|ChatGPT-User|Claude-User|PerplexityBot|Perplexity-User|Google-Extended|Applebot-Extended|DeepSeekBot/i;

const DOCS_ORIGIN = 'https://docs.lomi.africa';
const MARKETING_ORIGIN = 'https://lomi.africa';

export function wantsMcpMarkdown(
  accept: string | undefined,
  userAgent: string | undefined,
): boolean {
  if (accept?.toLowerCase().includes('text/markdown')) {
    return true;
  }
  return Boolean(userAgent && MARKDOWN_BOTS.test(userAgent));
}

export function wantsMcpHtml(accept: string | undefined): boolean {
  return Boolean(accept?.toLowerCase().includes('text/html'));
}

export function wantsMcpJson(accept: string | undefined): boolean {
  const a = accept?.toLowerCase() ?? '';
  return (
    a.includes('application/json') ||
    a.includes('application/mcp-server-card+json')
  );
}

function mcpPublicOrigin(): string {
  try {
    return new URL(getMcpResourceUrl()).origin;
  } catch {
    return 'https://mcp.lomi.africa';
  }
}

export function buildMcpIndexMarkdown(manifest: ToolsManifest): string {
  const origin = mcpPublicOrigin();
  const wellKnown = buildMcpWellKnown(manifest);
  const tools = wellKnown.tools_preview
    .slice(0, 16)
    .map((tool) => `- ${tool.name}: ${tool.description}`)
    .join('\n');
  return [
    '# lomi. MCP',
    '',
    'Model Context Protocol server for lomi. payment infrastructure in francophone West Africa (hosted checkout, Mobile Money, cards, payouts, subscriptions, and developer APIs across UEMOA).',
    '',
    'This host is a protocol endpoint, not a marketing site. Use Streamable HTTP at `/mcp`. HTML GET `/` exists so agents can discover URLs without a 404.',
    '',
    '## Connect',
    '',
    `- MCP (merchant): ${wellKnown.mcp}`,
    `- MCP guest: ${wellKnown.mcp_guest}`,
    `- Server card: ${wellKnown.server_card}`,
    `- Well-known: ${origin}/.well-known/mcp`,
    `- Catalog: ${wellKnown.catalog}`,
    `- OAuth resource metadata: ${wellKnown.protected_resource}`,
    '',
    '## Docs and API',
    '',
    `- Docs: ${DOCS_ORIGIN}/start/overview`,
    `- MCP guide: ${DOCS_ORIGIN}/build/mcp`,
    `- OpenAPI: ${DOCS_ORIGIN}/openapi.json`,
    `- REST API: https://api.lomi.africa`,
    `- Website: ${MARKETING_ORIGIN}`,
    '',
    `## Tools (${manifest.toolCount})`,
    '',
    tools,
    '',
    '## Health',
    '',
    `- GET ${origin}/health`,
    `- GET ${origin}/ready`,
    '',
  ].join('\n');
}

export function buildMcpIndexHtml(manifest: ToolsManifest): string {
  const origin = mcpPublicOrigin();
  const wellKnown = buildMcpWellKnown(manifest);
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>lomi. MCP</title>
  <meta name="robots" content="index,follow">
</head>
<body>
  <h1>lomi. MCP</h1>
  <p>Model Context Protocol server for lomi. payment infrastructure in francophone West Africa: hosted checkout, Mobile Money, cards, payouts, subscriptions, and developer APIs across UEMOA.</p>
  <p>This host is a protocol endpoint. Agents should connect over Streamable HTTP, not scrape this page as a product site.</p>
  <h2>Connect</h2>
  <ul>
    <li><a href="${wellKnown.mcp}">MCP (merchant)</a></li>
    <li><a href="${wellKnown.mcp_guest}">MCP guest</a></li>
    <li><a href="${wellKnown.server_card}">Server card</a></li>
    <li><a href="${origin}/.well-known/mcp">Well-known MCP</a></li>
    <li><a href="${DOCS_ORIGIN}/build/mcp">MCP docs</a></li>
    <li><a href="${DOCS_ORIGIN}/openapi.json">OpenAPI</a></li>
    <li><a href="https://api.lomi.africa">REST API</a></li>
  </ul>
  <p>${manifest.toolCount} tools are advertised on the server card. Health: <a href="${origin}/health">/health</a>.</p>
</body>
</html>
`;
}

export function buildMcpNotFoundMarkdown(): string {
  const origin = mcpPublicOrigin();
  return [
    '# Not found',
    '',
    `No resource at this path on ${origin}.`,
    '',
    '## Where to look next',
    '',
    `- MCP landing: ${origin}/`,
    `- MCP endpoint: ${origin}/mcp`,
    `- Server card: ${origin}/server-card`,
    `- Well-known: ${origin}/.well-known/mcp`,
    `- Docs: ${DOCS_ORIGIN}/build/mcp`,
    `- OpenAPI: ${DOCS_ORIGIN}/openapi.json`,
    '',
  ].join('\n');
}

export const MCP_ROBOTS_TXT = `User-agent: *
Allow: /
Allow: /server-card
Allow: /health
Allow: /ready
Allow: /.well-known/
Disallow: /mcp
`;

