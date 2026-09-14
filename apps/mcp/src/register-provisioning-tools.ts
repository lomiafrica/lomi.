import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { fromJSONSchema } from "zod";

import type { ManifestTool, ToolsManifest } from "./manifest.js";
import { callLomiRest, formatHttpResult } from "./lomi-http.js";
import {
  getLomiApiBaseUrl,
  getOptionalPartnerKey,
  getOptionalProvisioningKey,
} from "./env-config.js";
import { mcpLog } from "./mcp-request-context.js";
import { truncateToolResultText } from "./truncate-result.js";
import { extractMerchantSecretKey } from "./extract-secret-key.js";
import { resolveManifestAction, restCallSpecFor } from "./resolve-action.js";
import {
  isJsonObject,
  validateJsonValue,
  type JsonObject,
} from "@lomi./shared";

export type ProvisioningToolsManifest = ToolsManifest;

export type ProvisioningAuthMode = "provisioning" | "partner";

export type ProvisioningToolRegistrationContext = {
  baseUrl: string;
  getProvisioningKey: () => string | null;
  getPartnerKey: () => string | null;
  /**
   * Called when a provisioning response yields a usable merchant secret key,
   * so the session can adopt it and unlock the full merchant REST surface.
   */
  onMerchantKeyDiscovered?: (secretKey: string) => void;
  /** Skip partner-auth tools (used on the guest bootstrap transport). */
  skipPartner?: boolean;
};

function authModeFor(tool: ManifestTool): ProvisioningAuthMode {
  return tool.authMode === "partner" ? "partner" : "provisioning";
}

function registerOneProvisioningTool(
  server: McpServer,
  tool: ManifestTool,
  ctx: ProvisioningToolRegistrationContext,
): void {
  const inputSchema = fromJSONSchema(tool.inputSchema, {
    defaultTarget: "openapi-3.0",
  });
  const authMode = authModeFor(tool);

  server.registerTool(
    tool.name,
    {
      title: tool.title,
      description: tool.description,
      inputSchema,
      annotations: {
        readOnlyHint: tool.readOnly,
        destructiveHint: tool.destructive,
      },
      _meta: {
        "anthropic/searchHint": tool.searchHint,
        "anthropic/alwaysLoad": tool.alwaysLoad,
        "lomi/authMode": authMode,
      },
    },
    async (args) => {
      const parsed = inputSchema.safeParse(args);
      if (!parsed.success) {
        return {
          content: [
            {
              type: "text",
              text: `Invalid tool arguments: ${parsed.error.message}`,
            },
          ],
          isError: true,
        };
      }

      const credential =
        authMode === "partner" ? ctx.getPartnerKey() : ctx.getProvisioningKey();
      if (!credential) {
        const message =
          authMode === "partner"
            ? "Missing partner key: set LOMI_PARTNER_KEY or send x-lomi-partner-key when creating the MCP session. See https://docs.lomi.africa/build/mcp"
            : "Missing provisioning key: set LOMI_PROVISIONING_KEY or send x-lomi-provisioning-key when creating the MCP session. See https://docs.lomi.africa/build/mcp";
        return {
          content: [{ type: "text", text: message }],
          isError: true,
        };
      }

      try {
        const validated = validateJsonValue(parsed.data);
        if (!isJsonObject(validated)) {
          return {
            content: [
              {
                type: "text",
                text: "Invalid tool arguments: expected a JSON object",
              },
            ],
            isError: true,
          };
        }
        const input: JsonObject = validated;
        const action = resolveManifestAction(tool, input);
        const t0 = Date.now();
        const result = await callLomiRest(
          restCallSpecFor(tool, action),
          input,
          {
            baseUrl: ctx.baseUrl,
            apiKey: credential,
            authHeaderName:
              authMode === "partner"
                ? "X-Lomi-Partner-Key"
                : "X-Lomi-Provisioning-Key",
          },
        );
        const latencyMs = Date.now() - t0;
        mcpLog(
          "provisioning_tool_upstream_complete",
          {
            tool: tool.name,
            action: input["action"],
            method: action.method,
            authMode,
            upstreamStatus: result.status,
            latencyMs,
          },
          result.status >= 400 ? "warn" : "info",
        );
        const ok = result.status >= 200 && result.status < 300;
        if (ok && authMode === "provisioning" && ctx.onMerchantKeyDiscovered) {
          const secretKey = extractMerchantSecretKey(result.bodyText);
          if (secretKey) {
            ctx.onMerchantKeyDiscovered(secretKey);
            mcpLog(
              "provisioning_merchant_key_promoted",
              { tool: tool.name },
              "info",
            );
          }
        }
        const text = truncateToolResultText(formatHttpResult(result));
        const response = {
          content: [{ type: "text", text }],
        } satisfies { content: Array<{ type: "text"; text: string }> };
        if (!ok) return { ...response, isError: true };
        return response;
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        return {
          content: [{ type: "text", text: message }],
          isError: true,
        };
      }
    },
  );
}

export function registerProvisioningTools(
  server: McpServer,
  manifest: ProvisioningToolsManifest,
  ctx?: Partial<ProvisioningToolRegistrationContext>,
): void {
  const baseUrl = ctx?.baseUrl ?? getLomiApiBaseUrl();
  const getProvisioningKey =
    ctx?.getProvisioningKey ?? getOptionalProvisioningKey;
  const getPartnerKey = ctx?.getPartnerKey ?? getOptionalPartnerKey;
  const fullCtx: ProvisioningToolRegistrationContext = {
    baseUrl,
    getProvisioningKey,
    getPartnerKey,
    onMerchantKeyDiscovered: ctx?.onMerchantKeyDiscovered,
  };

  for (const tool of manifest.tools) {
    if (ctx?.skipPartner && authModeFor(tool) === "partner") continue;
    registerOneProvisioningTool(server, tool, fullCtx);
  }
}
