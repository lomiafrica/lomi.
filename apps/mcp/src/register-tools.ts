import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { fromJSONSchema } from "zod";

import type { ManifestTool, ToolsManifest } from "./manifest.js";
import { callLomiRest, formatHttpResult } from "./lomi-http.js";
import { getLomiApiBaseUrl, getOptionalMerchantApiKey } from "./env-config.js";
import { mcpLog } from "./mcp-request-context.js";
import { truncateToolResultText } from "./truncate-result.js";
import { maybeWriteLocalDownload } from "./save-local-download.js";
import { resolveManifestAction, restCallSpecFor } from "./resolve-action.js";
import { registerSearchToolsMetaTool } from "./register-search-tools.js";
import {
  isJsonObject,
  readString,
  validateJsonValue,
  type JsonObject,
} from "@lomi./shared";
import { extractMerchantSecretKey } from "./extract-secret-key.js";

const MONEY_TOOLS = new Set([
  "lomi_payouts",
  "lomi_refunds",
  "lomi_settlements",
  "lomi_transfers",
]);

export type ToolRegistrationContext = {
  baseUrl: string;
  getApiKey: () => string | null;
  readOnlyOnly?: boolean;
  /** Omit payouts, refunds, instant settlement, and Network transfers (merchant.write without merchant.money). */
  excludeMoney?: boolean;
  /** Skip lomi_search_tools when the server already registered it (guest upgrade). */
  skipSearchTool?: boolean;
  /** Adopt a secret returned by lomi_organization create/use. */
  onMerchantKeyDiscovered?: (secretKey: string) => void;
};

function resourceLinkFromResult(bodyText: string): {
  type: "resource_link";
  uri: string;
  name: string;
  mimeType: string;
} | null {
  try {
    const parsed = validateJsonValue(JSON.parse(bodyText));
    const envelope = isJsonObject(parsed) ? parsed : {};
    const inner = isJsonObject(envelope.body) ? envelope.body : envelope;
    const uri =
      readString(inner, "download_url") ??
      readString(inner, "hosted_url") ??
      readString(inner, "pdf_url");
    if (!uri || !uri.startsWith("https://")) return null;
    return {
      type: "resource_link",
      uri,
      name: readString(inner, "filename") ?? "invoice.pdf",
      mimeType: readString(inner, "mime_type") ?? "application/pdf",
    };
  } catch {
    return null;
  }
}

function registerOneTool(
  server: McpServer,
  tool: ManifestTool,
  ctx: ToolRegistrationContext,
): void {
  const inputSchema = fromJSONSchema(tool.inputSchema, {
    defaultTarget: "openapi-3.0",
  });

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
      const apiKey = ctx.getApiKey();
      if (!apiKey) {
        return {
          content: [
            {
              type: "text",
              text: "Missing merchant API key: provide x-lomi-api-key (or x-api-key) when creating MCP session, or set server-side LOMI_SECRET_KEY fallback. See https://docs.lomi.africa/build/mcp",
            },
          ],
          isError: true,
        };
      }
      try {
        const action = resolveManifestAction(tool, input);
        const t0 = Date.now();
        const result = await callLomiRest(restCallSpecFor(tool, action), input, {
          baseUrl: ctx.baseUrl,
          apiKey,
        });
        const latencyMs = Date.now() - t0;
        mcpLog(
          "tool_upstream_complete",
          {
            tool: tool.name,
            action: input["action"],
            method: action.method,
            upstreamStatus: result.status,
            latencyMs,
          },
          result.status >= 400 ? "warn" : "info",
        );
        const text = truncateToolResultText(formatHttpResult(result));
        const ok = result.status >= 200 && result.status < 300;
        if (
          ok &&
          tool.name === "lomi_organization" &&
          (input["action"] === "create" || input["action"] === "use") &&
          ctx.onMerchantKeyDiscovered
        ) {
          const secretKey = extractMerchantSecretKey(result.bodyText);
          if (secretKey) {
            ctx.onMerchantKeyDiscovered(secretKey);
            mcpLog(
              "organization_merchant_key_promoted",
              { tool: tool.name, action: input["action"] },
              "info",
            );
          }
        }
        const content: Array<
          | { type: "text"; text: string }
          | {
              type: "resource_link";
              uri: string;
              name: string;
              mimeType: string;
            }
        > = [{ type: "text", text }];
        if (ok) {
          const link = resourceLinkFromResult(result.bodyText);
          if (link) {
            content.push(link);
            const saved = await maybeWriteLocalDownload({
              uri: link.uri,
              name: link.name,
            });
            if (saved) {
              content.push({
                type: "text",
                text: `Saved locally: ${saved}`,
              });
            }
          }
        }
        const response = { content };
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

export function registerMerchantTools(
  server: McpServer,
  manifest: ToolsManifest,
  ctx?: Partial<ToolRegistrationContext>,
): void {
  const baseUrl = ctx?.baseUrl ?? getLomiApiBaseUrl();
  const getApiKey = ctx?.getApiKey ?? getOptionalMerchantApiKey;
  const readOnlyOnly = ctx?.readOnlyOnly ?? false;
  const excludeMoney = ctx?.excludeMoney ?? false;
  const fullCtx: ToolRegistrationContext = {
    baseUrl,
    getApiKey,
    readOnlyOnly,
    excludeMoney,
    onMerchantKeyDiscovered: ctx?.onMerchantKeyDiscovered,
  };

  if (!ctx?.skipSearchTool) {
    registerSearchToolsMetaTool(server, manifest);
  }

  for (const tool of manifest.tools) {
    if (readOnlyOnly && !tool.readOnly) continue;
    if (excludeMoney && MONEY_TOOLS.has(tool.name)) continue;
    registerOneTool(server, tool, fullCtx);
  }
}
