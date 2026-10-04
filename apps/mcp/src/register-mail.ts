import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { getLomiApiBaseUrl } from "./env-config.js";
import { callLomiRest, formatHttpResult } from "./lomi-http.js";
import { isString, type JsonObject } from "@lomi./shared";

export type RegisterMailContext = {
  getApiKey: () => string | null;
};

const textResult = (text: string, isError = false) => ({
  content: [{ type: "text" as const, text }],
  isError,
});

export function registerLomiMail(
  server: McpServer,
  ctx: RegisterMailContext,
): void {
  server.registerTool(
    "lomi_mail",
    {
      title: "Merchant inbox",
      description:
        "Read or send from the merchant Gmail or Outlook inbox. action=list, send, or authenticate. authenticate returns authorization_url. send needs to, subject, and body. Confirm the recipient before send. Requires a merchant key.",
      inputSchema: {
        action: z.enum(["list", "send", "authenticate"]),
        provider: z.enum(["gmail", "outlook"]),
        to: z.string().optional(),
        subject: z.string().optional(),
        body: z.string().optional(),
      },
    },
    async (input) => {
      const apiKey = ctx.getApiKey();
      if (!apiKey) {
        return textResult("Connect with a merchant key before using mail.", true);
      }
      const body: JsonObject = {
        action: input.action,
        provider: input.provider,
      };
      if (isString(input.to)) body.to = input.to;
      if (isString(input.subject)) body.subject = input.subject;
      if (isString(input.body)) body.body = input.body;
      const result = await callLomiRest(
        {
          method: "post",
          pathTemplate: "/connectors/mail",
          pathParamNames: [],
          queryParamNames: [],
          wantsBody: true,
          inputSchema: {},
        },
        { body },
        { baseUrl: getLomiApiBaseUrl(), apiKey },
      );
      return textResult(formatHttpResult(result), result.status >= 400);
    },
  );
}
