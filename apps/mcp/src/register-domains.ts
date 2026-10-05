import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { getLomiApiBaseUrl } from "./env-config.js";
import { callLomiRest, formatHttpResult } from "./lomi-http.js";
import { isString, type JsonObject } from "@lomi./shared";

export type RegisterDomainsContext = {
  getApiKey: () => string | null;
};

const DOMAIN_TYPES = [
  "checkout",
  "payment_link",
  "storefront",
  "invoice",
  "general",
  "sending",
] as const;

const textResult = (text: string, isError = false) => ({
  content: [{ type: "text" as const, text }],
  isError,
});

export function registerLomiDomains(
  server: McpServer,
  ctx: RegisterDomainsContext,
): void {
  server.registerTool(
    "lomi_domains",
    {
      title: "Custom domains",
      description:
        "Pay, shop, invoice, and sending domains. action=list, add, verify, or remove. checkout, payment_link, storefront, and invoice return a CNAME. sending returns mail DNS records. After verify succeeds, receipts and invoices send from that domain. Requires a merchant key.",
      inputSchema: {
        action: z.enum(["list", "add", "verify", "remove"]),
        domain: z.string().optional().describe("Hostname for add and verify"),
        type: z.enum(DOMAIN_TYPES).optional(),
        domain_id: z
          .string()
          .optional()
          .describe("From list. Required for remove"),
      },
    },
    async (input) => {
      const apiKey = ctx.getApiKey();
      if (!apiKey) {
        return textResult(
          "Connect with a merchant key before managing domains.",
          true,
        );
      }
      const baseUrl = getLomiApiBaseUrl();
      if (input.action === "list") {
        const result = await callLomiRest(
          {
            method: "get",
            pathTemplate: "/domains",
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
        if (!isString(input.domain) || !isString(input.type)) {
          return textResult("add requires domain and type.", true);
        }
        const result = await callLomiRest(
          {
            method: "post",
            pathTemplate: "/domains",
            pathParamNames: [],
            queryParamNames: [],
            wantsBody: true,
            inputSchema: {},
          },
          { body: { domain: input.domain, type: input.type } },
          { baseUrl, apiKey },
        );
        return textResult(formatHttpResult(result), result.status >= 400);
      }
      if (input.action === "verify") {
        if (!isString(input.domain)) {
          return textResult("verify requires domain.", true);
        }
        const body: JsonObject = { domain: input.domain };
        if (isString(input.type)) body.type = input.type;
        const result = await callLomiRest(
          {
            method: "post",
            pathTemplate: "/domains/verify",
            pathParamNames: [],
            queryParamNames: [],
            wantsBody: true,
            inputSchema: {},
          },
          { body },
          { baseUrl, apiKey },
        );
        return textResult(formatHttpResult(result), result.status >= 400);
      }
      if (!isString(input.domain_id)) {
        return textResult("remove requires domain_id.", true);
      }
      const result = await callLomiRest(
        {
          method: "delete",
          pathTemplate: "/domains/{domainId}",
          pathParamNames: ["domainId"],
          queryParamNames: [],
          wantsBody: false,
          inputSchema: {},
        },
        { domainId: input.domain_id },
        { baseUrl, apiKey },
      );
      return textResult(formatHttpResult(result), result.status >= 400);
    },
  );
}
