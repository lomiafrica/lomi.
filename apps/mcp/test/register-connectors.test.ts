import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { describe, expect, it } from "vitest";
import { CONNECTORS_TOOL_DESCRIPTION } from "@lomi./shared";
import {
  LOMI_CONNECTORS_MCP_DESCRIPTION,
  registerLomiConnectors,
} from "../src/register-connectors.ts";

type TextResult = {
  content: Array<{ type: "text"; text: string }>;
  isError?: boolean;
};

type ConnectorInput = {
  action: string;
  query?: string;
  name?: string;
  slug?: string;
};

type ConnectorToolConfig = {
  title?: string;
  description?: string;
  inputSchema?: object;
};

function captureConnectorHandler(getApiKey: () => string | null) {
  let handler: ((input: ConnectorInput) => Promise<TextResult>) | undefined;
  const server = {
    registerTool: (
      _name: string,
      _meta: ConnectorToolConfig,
      fn: (input: ConnectorInput) => Promise<TextResult>,
    ) => {
      handler = fn;
    },
  };
  // SAFETY: the test double only implements registerTool, which is all this helper calls.
  registerLomiConnectors(server as McpServer, { getApiKey });
  if (!handler) {
    throw new Error("lomi_connectors handler was not registered");
  }
  return handler;
}

describe("lomi_connectors description", () => {
  it("uses the shared contract and only adds the merchant-key line", () => {
    expect(
      LOMI_CONNECTORS_MCP_DESCRIPTION.startsWith(CONNECTORS_TOOL_DESCRIPTION),
    ).toBe(true);
    expect(LOMI_CONNECTORS_MCP_DESCRIPTION).toContain(
      "Requires a merchant key.",
    );
    expect(CONNECTORS_TOOL_DESCRIPTION).toContain("godaddy");
    expect(CONNECTORS_TOOL_DESCRIPTION).toContain("not Gmail");
  });
});

describe("lomi_connectors search and tools validation", () => {
  it("rejects short search queries before calling the API", async () => {
    const handler = captureConnectorHandler(
      () => "lomi_sk_test_1234567890abcd",
    );
    for (const query of ["", " ", "a", " x "]) {
      const result = await handler({ action: "search", query });
      expect(result.isError).toBe(true);
      expect(result.content[0]?.text).toBe(
        "search needs a query of at least two characters.",
      );
    }
  });

  it("rejects tools without name or slug before calling the API", async () => {
    const handler = captureConnectorHandler(
      () => "lomi_sk_test_1234567890abcd",
    );
    const result = await handler({ action: "tools" });
    expect(result.isError).toBe(true);
    expect(result.content[0]?.text).toBe("tools requires name.");
  });

  it("asks for a merchant key before validating search", async () => {
    const handler = captureConnectorHandler(() => null);
    const result = await handler({ action: "search", query: "wa" });
    expect(result.isError).toBe(true);
    expect(result.content[0]?.text).toContain("merchant key");
  });
});
