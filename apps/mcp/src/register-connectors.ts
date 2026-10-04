import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { getLomiApiBaseUrl } from "./env-config.js";
import { callLomiRest, formatHttpResult } from "./lomi-http.js";
import { isJsonObject, isString, type JsonObject } from "@lomi./shared";

export type RegisterConnectorsContext = {
  getApiKey: () => string | null;
};

const textResult = (text: string, isError = false) => ({
  content: [{ type: "text" as const, text }],
  isError,
});

const rest = {
  method: "post" as const,
  pathParamNames: [] as string[],
  queryParamNames: [] as string[],
  wantsBody: true,
  inputSchema: {},
};

export function registerLomiConnectors(
  server: McpServer,
  ctx: RegisterConnectorsContext,
): void {
  server.registerTool(
    "lomi_connectors",
    {
      title: "Remote MCP servers",
      description:
        "Connect a named merchant app or any remote https MCP server. action=list, catalog, connect, add, remove, authenticate, or call. connect needs slug (resend, sanity, cloudflare, slack, hubspot). add needs name and url, plus headers for a static token. authenticate returns authorization_url. call needs name, tool, and arguments. Confirm before add or remove. Requires a merchant key.",
      inputSchema: {
        action: z.enum([
          "list",
          "catalog",
          "connect",
          "add",
          "remove",
          "authenticate",
          "call",
        ]),
        slug: z.string().optional(),
        name: z.string().optional(),
        url: z.string().optional(),
        headers: z.record(z.string(), z.string()).optional(),
        tool: z.string().optional(),
        arguments: z.record(z.string(), z.unknown()).optional(),
      },
    },
    async (input) => {
      const apiKey = ctx.getApiKey();
      if (!apiKey) {
        return textResult(
          "Connect with a merchant key before managing MCP servers.",
          true,
        );
      }
      const baseUrl = getLomiApiBaseUrl();
      if (input.action === "catalog") {
        const result = await callLomiRest(
          {
            method: "get",
            pathTemplate: "/connectors/catalog",
            pathParamNames: [],
            queryParamNames: [],
            wantsBody: false,
            inputSchema: {},
          },
          {},
          { baseUrl, apiKey },
        );
        return textResult(formatHttpResult(result), result.status >= 400);
      }
      if (input.action === "connect") {
        const slug = isString(input.slug)
          ? input.slug
          : isString(input.name)
            ? input.name
            : "";
        if (!slug) return textResult("connect requires slug.", true);
        const body: JsonObject = {};
        if (input.headers) body.headers = input.headers;
        const result = await callLomiRest(
          {
            method: "post",
            pathTemplate: "/connectors/catalog/{slug}",
            pathParamNames: ["slug"],
            queryParamNames: [],
            wantsBody: true,
            inputSchema: {},
          },
          { slug, body },
          { baseUrl, apiKey },
        );
        return textResult(formatHttpResult(result), result.status >= 400);
      }
      if (input.action === "list") {
        const result = await callLomiRest(
          {
            method: "get",
            pathTemplate: "/connectors",
            pathParamNames: [],
            queryParamNames: [],
            wantsBody: false,
            inputSchema: {},
          },
          {},
          { baseUrl, apiKey },
        );
        return textResult(formatHttpResult(result), result.status >= 400);
      }
      if (input.action === "add") {
        if (!isString(input.name) || !isString(input.url)) {
          return textResult("add requires name and url.", true);
        }
        const body: JsonObject = { name: input.name, url: input.url };
        if (input.headers) body.headers = input.headers;
        const result = await callLomiRest(
          { ...rest, pathTemplate: "/connectors" },
          { body },
          { baseUrl, apiKey },
        );
        return textResult(formatHttpResult(result), result.status >= 400);
      }
      if (input.action === "authenticate") {
        if (!isString(input.name)) {
          return textResult("authenticate requires name.", true);
        }
        const result = await callLomiRest(
          { ...rest, pathTemplate: "/connectors/authenticate" },
          { body: { name: input.name } },
          { baseUrl, apiKey },
        );
        return textResult(formatHttpResult(result), result.status >= 400);
      }
      if (input.action === "call") {
        if (!isString(input.name) || !isString(input.tool)) {
          return textResult("call requires name and tool.", true);
        }
        const args = input.arguments;
        const result = await callLomiRest(
          { ...rest, pathTemplate: "/connectors/call" },
          {
            body: {
              name: input.name,
              tool: input.tool,
              arguments: isJsonObject(args) ? args : {},
            },
          },
          { baseUrl, apiKey },
        );
        return textResult(formatHttpResult(result), result.status >= 400);
      }
      if (!isString(input.name)) {
        return textResult("remove requires name.", true);
      }
      const result = await callLomiRest(
        {
          method: "delete",
          pathTemplate: "/connectors/{name}",
          pathParamNames: ["name"],
          queryParamNames: [],
          wantsBody: false,
          inputSchema: {},
        },
        { name: input.name },
        { baseUrl, apiKey },
      );
      return textResult(formatHttpResult(result), result.status >= 400);
    },
  );
}
