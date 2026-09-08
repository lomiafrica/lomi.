import { getLomiApiBaseUrl } from './env-config.js';

export type InstructionMode = 'stdio' | 'http';

/**
 * Shared MCP server instructions for stdio and HTTP transports.
 */
export function buildServerInstructions(
  mode: InstructionMode,
  guest = false,
): string {
  const baseUrl = getLomiApiBaseUrl();
  const lines = [
    'lomi. merchant REST API exposed as MCP tools.',
    `Default API base URL: ${baseUrl}. Override with LOMI_API_URL (sandbox: https://sandbox.api.lomi.africa).`,
    '',
    guest
      ? 'Guest bootstrap: this session has no merchant key yet. Call lomi_register_agent (solves a short proof-of-work) to mint a sandbox-only lomi_prov_* key on this session. Then lomi_provision action=create_account, upload_document, complete, api_keys. As soon as a test secret key comes back, this same session gains the merchant tools (lomi_checkout, lomi_customers, ...) in TEST mode; refresh the tool list, no reconnect needed. Live money still needs lomi_provision action=request_live and human approval at https://dashboard.lomi.africa/connect/go-live; live keys are only shown in the dashboard. Guest URL: https://mcp.lomi.africa/mcp/guest.'
      : '',
    '',
    'Authentication:',
    mode === 'http'
      ? '- Browser OAuth (recommended): add the hosted MCP URL with no headers; OAuth-capable clients open Connect with lomi. automatically.'
      : '',
    mode === 'http'
      ? '- Merchant key: x-lomi-api-key or x-api-key on MCP session initialize (alternative to OAuth).'
      : '- Merchant key: LOMI_SECRET_KEY or X_API_KEY in server environment.',
    mode === 'http'
      ? '- OAuth access tokens (lomi_oat_*) are accepted as Authorization: Bearer after browser consent.'
      : '',
    mode === 'http'
      ? '- Your API key alone unlocks the hosted endpoint; a shared transport secret (Authorization Bearer LOMI_MCP_BEARER_TOKEN) is optional/legacy.'
      : '',
    mode === 'http'
      ? '- No credentials: connect https://mcp.lomi.africa/mcp/guest and call lomi_register_agent for a sandbox provisioning key.'
      : '- No credentials: call lomi_register_agent to mint a sandbox provisioning key in this process.',
    '',
    'Collecting money (hosted checkout):',
    '1. lomi_checkout action=create. Persist id and checkout_url.',
    '2. Send the customer checkout_url. Do not fulfill yet.',
    '3. Create a webhook (lomi_webhooks action=create) and persist the signing secret.',
    '4. After the webhook, confirm with lomi_transactions action=get before fulfilling.',
    '',
    'Best practices:',
    '- Pass idempotency_key on all write operations for safe retries.',
    '- Prefer list/filter actions before destructive operations.',
    '- Use lomi_search_tools to discover tools by keyword. Resource tools take a required `action` (for example lomi_customers with action=list).',
    '- To collect money, prefer checkout-sessions / payment-links; direct charge tools are intentionally not exposed.',
    '- Resources: lomi://docs/recipes (workflows), lomi://docs/authentication, lomi://docs/idempotency, lomi://docs/pagination, lomi://docs/webhooks, lomi://docs/money, lomi://docs/errors, lomi://tools/index.',
    '- Tool results use { ok, status, body } JSON; errors include an error object when ok is false, plus next_steps when a recovery action is known.',
  ].filter(Boolean);

  return lines.join('\n');
}
