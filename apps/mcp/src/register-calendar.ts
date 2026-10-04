import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { getLomiApiBaseUrl } from "./env-config.js";
import { callLomiRest, formatHttpResult } from "./lomi-http.js";
import { isString, type JsonObject } from "@lomi./shared";

export type RegisterCalendarContext = {
  getApiKey: () => string | null;
};

const textResult = (text: string, isError = false) => ({
  content: [{ type: "text" as const, text }],
  isError,
});

export function registerLomiCalendar(
  server: McpServer,
  ctx: RegisterCalendarContext,
): void {
  server.registerTool(
    "lomi_calendar",
    {
      title: "Google Calendar",
      description:
        "List or create events on the merchant Google Calendar. action=list, create, or authenticate. authenticate returns authorization_url. create needs summary, start, and end as ISO times. Confirm the title and time before create. Requires a merchant key.",
      inputSchema: {
        action: z.enum(["list", "create", "authenticate"]),
        summary: z.string().optional(),
        start: z.string().optional(),
        end: z.string().optional(),
      },
    },
    async (input) => {
      const apiKey = ctx.getApiKey();
      if (!apiKey) {
        return textResult(
          "Connect with a merchant key before using calendar.",
          true,
        );
      }
      const body: JsonObject = { action: input.action };
      if (isString(input.summary)) body.summary = input.summary;
      if (isString(input.start)) body.start = input.start;
      if (isString(input.end)) body.end = input.end;
      const result = await callLomiRest(
        {
          method: "post",
          pathTemplate: "/connectors/calendar",
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
