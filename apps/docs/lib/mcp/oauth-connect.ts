/* @proprietary license */

/** Hosted MCP URL used for OAuth-capable client installs (no API key headers). */
export const MCP_OAUTH_ENDPOINT = 'https://mcp.lomi.africa/mcp';

/** CLI / plugin / protocol service id. No trailing punctuation. */
export const MCP_SERVICE_NAME = 'lomi';

/** Brand label. Cursor and Claude Desktop show the mcp.json / deeplink name. */
export const MCP_DISPLAY_NAME = 'lomi.';

export type McpOauthClientId = 'cursor' | 'claude' | 'vscode';

/** UTF-8 safe base64url used by Cursor deeplinks. */
export function base64UrlEncode(input: string): string {
  const bytes = new TextEncoder().encode(input);
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  const b64 = btoa(binary);
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/** One-click Cursor install (`cursor://…/mcp/install`) with URL-only OAuth config. */
export function buildCursorOauthDeeplink(
  mcpUrl: string = MCP_OAUTH_ENDPOINT,
): string {
  const config = { url: mcpUrl };
  const encoded = base64UrlEncode(JSON.stringify(config));
  return `cursor://anysphere.cursor-deeplink/mcp/install?name=${encodeURIComponent(MCP_DISPLAY_NAME)}&config=${encoded}`;
}

/** Claude Code CLI: remote HTTP; client runs OAuth on connect. */
export function buildClaudeOauthCommand(
  mcpUrl: string = MCP_OAUTH_ENDPOINT,
): string {
  return `claude mcp add --transport http ${MCP_SERVICE_NAME} ${mcpUrl}`;
}

/** OpenCode CLI: remote URL; run `opencode mcp auth lomi` if prompted. */
export function buildOpenCodeOauthCommand(
  mcpUrl: string = MCP_OAUTH_ENDPOINT,
): string {
  return `opencode mcp add ${MCP_SERVICE_NAME} --url ${mcpUrl}`;
}

/** OpenCode manual block: add + browser auth. */
export function buildOpenCodeManualCommands(
  mcpUrl: string = MCP_OAUTH_ENDPOINT,
): string {
  return `${buildOpenCodeOauthCommand(mcpUrl)}\nopencode mcp auth ${MCP_SERVICE_NAME}`;
}

/** Codex CLI: remote HTTP; OAuth login starts when discovery succeeds. */
export function buildCodexOauthCommand(
  mcpUrl: string = MCP_OAUTH_ENDPOINT,
): string {
  return `codex mcp add ${MCP_SERVICE_NAME} --url ${mcpUrl}`;
}

/** Codex manual block: add + login. */
export function buildCodexManualCommands(
  mcpUrl: string = MCP_OAUTH_ENDPOINT,
): string {
  return `${buildCodexOauthCommand(mcpUrl)}\ncodex mcp login ${MCP_SERVICE_NAME}`;
}

export const CLAUDE_CONNECTORS_URL = 'https://claude.ai/customize/connectors';

/** One-click Claude.ai custom connector with name and URL prefilled. */
export function buildClaudeOauthInstallUrl(
  mcpUrl: string = MCP_OAUTH_ENDPOINT,
): string {
  const params = new URLSearchParams({
    modal: 'add-custom-connector',
    connectorName: MCP_DISPLAY_NAME,
    connectorUrl: mcpUrl,
  });
  return `${CLAUDE_CONNECTORS_URL}?${params.toString()}`;
}

/** One-click VS Code install (`vscode:mcp/install`) with URL-only OAuth config. */
export function buildVscodeOauthInstallUrl(
  mcpUrl: string = MCP_OAUTH_ENDPOINT,
  insiders = false,
): string {
  const config = {
    name: MCP_DISPLAY_NAME,
    type: 'http',
    url: mcpUrl,
  };
  const scheme = insiders ? 'vscode-insiders' : 'vscode';
  return `${scheme}:mcp/install?${encodeURIComponent(JSON.stringify(config))}`;
}

/** Official Grok Bot install page (Add to Grok Bot). */
export const GROK_BOT_URL = 'https://x.ai/bot/AI8k2PosuIifICyNJcS1s';
