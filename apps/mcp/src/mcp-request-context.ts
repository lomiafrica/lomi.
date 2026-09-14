import { AsyncLocalStorage } from "node:async_hooks";

import type { JsonObject } from "@lomi./shared";

export type McpRequestStore = {
  requestId: string;
  sessionId?: string;
};

export const mcpRequestAls = new AsyncLocalStorage<McpRequestStore>();

export function getMcpRequestStore(): McpRequestStore | undefined {
  return mcpRequestAls.getStore();
}

export type McpLogLevel = "info" | "warn" | "error";

/** Structured JSON log line (secrets must never be passed in fields). */
export function mcpLog(
  event: string,
  fields: JsonObject = {},
  level: McpLogLevel = "info",
): void {
  const store = getMcpRequestStore();
  const line = JSON.stringify({
    ts: new Date().toISOString(),
    service: "lomi-mcp",
    level,
    event,
    requestId: store?.requestId,
    sessionId: store?.sessionId,
    ...fields,
  });

  switch (level) {
    case "error":
      console.error(line);
      break;
    case "warn":
      console.warn(line);
      break;
    default:
      console.log(line);
      break;
  }
}
