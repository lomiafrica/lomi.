import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import {
  extractBootstrapProvisioningKey,
  registerBootstrapAgent,
} from './register-bootstrap.js';
import { isJsonObject, isString } from '@lomi./shared';

export type RegisterAgentContext = {
  onProvisioningKeyDiscovered?: (key: string) => void;
};

const inputSchema = {
  label: z
    .string()
    .min(1)
    .max(80)
    .optional()
    .describe('Optional label for this agent (shown on the minted sandbox key)'),
};

export function registerLomiRegisterAgent(
  server: McpServer,
  ctx: RegisterAgentContext,
): void {
  server.registerTool(
    'lomi_register_agent',
    {
      title: 'Register a sandbox agent',
      description:
        'Solve a short proof-of-work and mint a sandbox-only provisioning key (lomi_prov_*). This MCP session adopts the key. Live money still requires lomi_provision action=request_live and human approval at https://dashboard.lomi.africa/connect/go-live.',
      inputSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
      },
      _meta: {
        'anthropic/alwaysLoad': true,
      },
    },
    async (args) => {
      const label =
        isJsonObject(args) && isString(args.label) ? args.label : 'agent';
      const result = await registerBootstrapAgent(label);
      const key = extractBootstrapProvisioningKey(result.body);
      if (result.ok && key && ctx.onProvisioningKeyDiscovered) {
        ctx.onProvisioningKeyDiscovered(key);
      }
      const text = JSON.stringify(
        {
          ok: result.ok,
          status: result.status,
          body: result.body,
          next_steps: result.ok
            ? [
                'This session now holds a sandbox provisioning key.',
                'Call lomi_provision with action=create_account to open a test merchant.',
                'Do not fulfill live payments. Live keys require action=request_live and human approval at https://dashboard.lomi.africa/connect/go-live.',
              ]
            : [
                'Retry lomi_register_agent. If this keeps failing, connect https://mcp.lomi.africa/mcp with OAuth or an API key. See https://docs.lomi.africa/build/mcp',
              ],
        },
        null,
        2,
      );
      return {
        content: [{ type: 'text', text }],
        isError: !result.ok,
      };
    },
  );
}
