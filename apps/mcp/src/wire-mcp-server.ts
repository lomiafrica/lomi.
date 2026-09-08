import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

import type { ToolsManifest } from './manifest.js';
import { parseManifest } from './manifest-parse.js';
import { registerLomiPrompts } from './register-prompts.js';
import { registerLomiResources } from './register-resources.js';
import { registerMerchantTools } from './register-tools.js';
import provisioningManifestJson from './generated/provisioning-tools-manifest.json' with { type: 'json' };
import {
  registerProvisioningTools,
  type ProvisioningToolsManifest,
} from './register-provisioning-tools.js';
import { buildServerInstructions, type InstructionMode } from './server-instructions.js';
import {
  getOptionalPartnerKey,
  getOptionalProvisioningKey,
} from './env-config.js';
import { registerSearchToolsMetaTool } from './register-search-tools.js';
import { registerLomiRegisterAgent } from './register-agent.js';
import { registerLomiSupport } from './register-support.js';
import { mcpLog } from './mcp-request-context.js';
import { validateJsonValue } from "@lomi./shared";

export type WireMcpServerOptions = {
  manifest: ToolsManifest;
  provisioningManifest?: ProvisioningToolsManifest;
  mode: InstructionMode;
  getApiKey: () => string | null;
  getProvisioningKey?: () => string | null;
  getPartnerKey?: () => string | null;
  /** When read, only register merchant tools marked readOnly. */
  merchantAccessLevel?: 'read' | 'write' | 'full';
  /**
   * Invoked when a provisioning tool returns a usable merchant secret key.
   * Implementations should adopt it as the session's merchant credential so
   * the agent can drive the full merchant REST API without reconnecting.
   */
  onMerchantKeyDiscovered?: (secretKey: string) => void;
  /**
   * Invoked when lomi_register_agent mints a sandbox provisioning key.
   */
  onProvisioningKeyDiscovered?: (key: string) => void;
  /**
   * Guest bootstrap transport: register_agent, search, provisioning (no partner
   * tools), plus docs resources and prompts. Merchant REST tools are added to
   * the live session once provisioning yields a test secret key.
   */
  guest?: boolean;
};

/** Create and wire tools, resources, and prompts on an MCP server instance. */
export function wireMcpServer(options: WireMcpServerOptions): McpServer {
  const {
    manifest,
    provisioningManifest = parseManifest(validateJsonValue(provisioningManifestJson)),
    mode,
    getApiKey,
    getProvisioningKey = getOptionalProvisioningKey,
    getPartnerKey = getOptionalPartnerKey,
    merchantAccessLevel = 'full',
    onMerchantKeyDiscovered,
    onProvisioningKeyDiscovered,
    guest = false,
  } = options;
  const server = new McpServer(
    { name: 'lomi', title: 'lomi.', version: manifest.apiVersion },
    {
      instructions: buildServerInstructions(mode, guest),
    },
  );
  registerLomiRegisterAgent(server, { onProvisioningKeyDiscovered });
  registerLomiSupport(server, { getApiKey });
  registerProvisioningTools(server, provisioningManifest, {
    getProvisioningKey,
    getPartnerKey,
    onMerchantKeyDiscovered: guest
      ? guestUpgradeOnMerchantKey(server, manifest, getApiKey, onMerchantKeyDiscovered)
      : onMerchantKeyDiscovered,
    skipPartner: guest,
  });
  if (!guest) {
    registerMerchantTools(server, manifest, {
      getApiKey,
      readOnlyOnly: merchantAccessLevel === 'read',
      excludeMoney: merchantAccessLevel === 'write',
    });
  } else {
    registerSearchToolsOnGuest(server, manifest, provisioningManifest);
  }
  registerLomiResources(server, manifest);
  // Prompts are registered on guest too: the SDK locks capabilities at
  // connect, so they cannot be added during the guest upgrade.
  registerLomiPrompts(server, manifest, provisioningManifest);
  return server;
}

/**
 * Guest sessions start without merchant REST tools. When lomi_provision returns
 * a test secret key (api_keys / complete), adopt it and register the merchant
 * tools on the live server. The SDK emits notifications/tools/list_changed, so
 * the client picks up lomi_checkout, lomi_customers, etc. without reconnecting.
 */
function guestUpgradeOnMerchantKey(
  server: McpServer,
  manifest: ToolsManifest,
  getApiKey: () => string | null,
  onMerchantKeyDiscovered: ((secretKey: string) => void) | undefined,
): (secretKey: string) => void {
  let upgraded = false;
  return (secretKey) => {
    onMerchantKeyDiscovered?.(secretKey);
    if (upgraded) return;
    upgraded = true;
    registerMerchantTools(server, manifest, {
      getApiKey,
      readOnlyOnly: false,
      skipSearchTool: true,
    });
    mcpLog(
      'guest_session_upgraded',
      { toolCount: manifest.tools.length },
      'info',
    );
  };
}

function registerSearchToolsOnGuest(
  server: McpServer,
  merchantManifest: ToolsManifest,
  provisioningManifest: ProvisioningToolsManifest,
): void {
  const combined = {
    ...merchantManifest,
    tools: [...provisioningManifest.tools, ...merchantManifest.tools],
    toolCount: provisioningManifest.tools.length + merchantManifest.tools.length,
  };
  registerSearchToolsMetaTool(server, combined);
}
