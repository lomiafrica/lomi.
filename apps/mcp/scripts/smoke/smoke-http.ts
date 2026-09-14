/**
 * Smoke test: hosted MCP HTTP initializes and lists tools (no merchant API calls).
 */
import http from "node:http";

import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

import manifestJson from "../../src/generated/tools-manifest.json" with { type: "json" };
import { createHttpApplication } from "../../src/http.js";
import { parseManifest } from "../../src/manifest-parse.js";
import {
  isBoolean,
  isString,
  validateJsonValue,
  type JsonObject,
} from "@lomi./shared";

const bearer = process.env.LOMI_MCP_BEARER_TOKEN ?? "smoke-local-token";
process.env.LOMI_MCP_BEARER_TOKEN = bearer;
const demoMerchantKey =
  process.env.LOMI_TEST_MERCHANT_API_KEY ?? "mcp-smoke-placeholder-key";

type ToolAnnotationHints = {
  readOnlyHint?: boolean;
  destructiveHint?: boolean;
};

type ListedToolMeta = {
  annotations?: ToolAnnotationHints;
  _meta?: JsonObject;
};

type ListedTool = {
  name: string;
  annotations?: ToolAnnotationHints;
  _meta?: JsonObject;
};

function asListedToolMeta(tool: ListedTool): ListedToolMeta {
  // SAFETY: MCP listTools entries expose optional annotations/_meta for smoke assertions.
  return tool as ListedToolMeta;
}

async function main(): Promise<void> {
  const manifest = parseManifest(validateJsonValue(manifestJson));
  const app = createHttpApplication(manifest);
  const server = await new Promise<http.Server>((resolve, reject) => {
    const s = http.createServer(app);
    s.listen(0, "127.0.0.1", () => resolve(s));
    s.on("error", reject);
  });

  const addr = server.address();
  if (!addr || isString(addr)) {
    throw new Error(
      "smoke-http: expected TCP AddressInfo from server.address()",
    );
  }
  const origin = `http://127.0.0.1:${addr.port}`;

  const health = await fetch(`${origin}/health`);
  if (!health.ok) {
    throw new Error(
      `smoke-http: GET /health expected 200, got ${health.status}`,
    );
  }

  const ready = await fetch(`${origin}/ready`);
  if (!ready.ok) {
    const text = await ready.text();
    throw new Error(
      `smoke-http: GET /ready expected 200, got ${ready.status}: ${text}`,
    );
  }

  const baseUrl = `${origin}/mcp`;

  const transport = new StreamableHTTPClientTransport(new URL(baseUrl), {
    requestInit: {
      headers: {
        Authorization: `Bearer ${bearer}`,
        "x-lomi-api-key": demoMerchantKey,
      },
    },
  });

  const client = new Client({ name: "lomi-mcp-smoke", version: "0.0.1" });
  await client.connect(transport);

  const listed = await client.listTools();
  if (!listed.tools?.length) {
    throw new Error("Expected non-empty tools list from MCP server");
  }

  const searchTool = listed.tools.find((t) => t.name === "lomi_search_tools");
  if (!searchTool) {
    throw new Error("smoke-http: expected lomi_search_tools in tools/list");
  }

  const sample = listed.tools.find((t) => t.name !== "lomi_search_tools");
  if (sample) {
    const meta = asListedToolMeta(sample);
    if (!isBoolean(meta.annotations?.readOnlyHint)) {
      throw new Error(
        `smoke-http: tool ${sample.name} missing readOnlyHint annotation`,
      );
    }
    const searchHint = meta._meta?.["anthropic/searchHint"];
    if (!isString(searchHint)) {
      throw new Error(
        `smoke-http: tool ${sample.name} missing anthropic/searchHint _meta`,
      );
    }
  }

  const searchResult = await client.callTool({
    name: "lomi_search_tools",
    arguments: { query: "customers", limit: 3 },
  });
  const searchText = searchResult.content
    ?.map((c) => ("text" in c ? c.text : ""))
    .join("");
  if (!searchText?.includes("customers")) {
    throw new Error(
      "smoke-http: lomi_search_tools returned unexpected payload",
    );
  }

  const resources = await client.listResources();
  if (
    !resources.resources?.some((r) => r.uri === "lomi://docs/getting-started")
  ) {
    throw new Error(
      "smoke-http: expected lomi://docs/getting-started resource",
    );
  }

  await client.close();
  await new Promise<void>((resolve, reject) => {
    server.close((err) => (err ? reject(err) : resolve()));
  });

  console.log(`smoke-http: ok (${listed.tools.length} tools)`);
}

await main().catch((err) => {
  console.error(err);
  process.exit(1);
});
