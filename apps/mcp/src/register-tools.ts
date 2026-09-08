import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { fromJSONSchema } from "zod";

import type { ManifestTool, ToolsManifest } from "./manifest.js";
import { callLomiRest, formatHttpResult } from "./lomi-http.js";
import { getLomiApiBaseUrl, getOptionalMerchantApiKey } from "./env-config.js";
import { mcpLog } from "./mcp-request-context.js";
import { truncateToolResultText } from "./truncate-result.js";
import { registerSearchToolsMetaTool } from "./register-search-tools.js";
import { resolveManifestAction, restCallSpecFor } from "./resolve-action.js";
import {
  isJsonObject,
  validateJsonValue,
  type JsonObject,
} from "@lomi./shared";

export type ToolRegistrationContext = {
  baseUrl: string;
  getApiKey: () => string | null;
  readOnlyOnly?: boolean;
  /** Skip lomi_search_tools when the server already registered it (guest upgrade). */
  skipSearchTool?: boolean;
};

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

export function registerMerchantTools(
  server: McpServer,
  manifest: ToolsManifest,
  ctx?: Partial<ToolRegistrationContext>,
): void {
  const baseUrl = ctx?.baseUrl ?? getLomiApiBaseUrl();
  const getApiKey = ctx?.getApiKey ?? getOptionalMerchantApiKey;
  const readOnlyOnly = ctx?.readOnlyOnly ?? false;
  const fullCtx: ToolRegistrationContext = { baseUrl, getApiKey, readOnlyOnly };

  if (!ctx?.skipSearchTool) {
    registerSearchToolsMetaTool(server, manifest);
  }

  for (const tool of manifest.tools) {
    if (readOnlyOnly && !tool.readOnly) continue;
    registerOneTool(server, tool, fullCtx);
  }
}
