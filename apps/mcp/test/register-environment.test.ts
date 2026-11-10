import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { describe, expect, it } from "vitest";

import { buildServerInstructions } from "../src/server-instructions.js";
import {
  readMerchantConnectionKeys,
  registerLomiEnvironment,
  selectMerchantApiKey,
  type MerchantEnvironmentState,
} from "../src/register-environment.js";
import { wireMcpServer } from "../src/wire-mcp-server.js";
import type { ToolsManifest } from "../src/manifest.js";

type TextResult = {
  content: Array<{ type: "text"; text: string }>;
  isError?: boolean;
};

type EnvironmentInput = {
  environment?: "live" | "test";
};

type EnvironmentToolConfig = {
  title?: string;
  description?: string;
  inputSchema?: object;
};

const LIVE_KEY = "lomi_sk_live_environment_aaaaaaaa";
const TEST_KEY = "lomi_sk_test_environment_bbbbbbbb";
const PASTED_KEY = "lomi_sk_test_pasted_cccccccc";

function captureEnvironmentHandler(state: MerchantEnvironmentState) {
  let handler: ((input: EnvironmentInput) => Promise<TextResult>) | undefined;
  const server = {
    registerTool: (
      _name: string,
      _meta: EnvironmentToolConfig,
      fn: (input: EnvironmentInput) => Promise<TextResult>,
    ) => {
      handler = fn;
    },
  };
  // SAFETY: the test double only implements registerTool, which is all this helper calls.
  registerLomiEnvironment(server as McpServer, state);
  if (!handler) {
    throw new Error("lomi_environment handler was not registered");
  }
  return handler;
}

function environmentPayload(result: TextResult): {
  environment: string;
  live: boolean;
  test: boolean;
} {
  const raw = result.content[0]?.text;
  if (!raw) throw new Error("missing environment payload");
  return JSON.parse(raw) as {
    environment: string;
    live: boolean;
    test: boolean;
  };
}

function captureRegisteredToolNames(run: () => void): string[] {
  const names: string[] = [];
  const original = McpServer.prototype.registerTool;
  McpServer.prototype.registerTool = function (
    this: McpServer,
    name: string,
    ...rest: Parameters<typeof original> extends [string, ...infer R]
      ? R
      : never
  ) {
    names.push(name);
    return original.call(this, name, ...rest);
  } as typeof original;
  try {
    run();
    return names;
  } finally {
    McpServer.prototype.registerTool = original;
  }
}

const emptyManifest: ToolsManifest = {
  manifestVersion: 1,
  apiVersion: "test",
  apiTitle: "test",
  toolCount: 0,
  tools: [],
};

describe("readMerchantConnectionKeys", () => {
  it("drops missing and non-string keys", () => {
    expect(readMerchantConnectionKeys(undefined)).toBeNull();
    expect(readMerchantConnectionKeys({})).toBeNull();
    expect(
      readMerchantConnectionKeys({
        live: 1 as unknown as string,
        test: null as unknown as string,
      }),
    ).toBeNull();
    expect(readMerchantConnectionKeys({ live: LIVE_KEY })).toEqual({
      live: LIVE_KEY,
      test: undefined,
    });
    expect(
      readMerchantConnectionKeys({ live: LIVE_KEY, test: TEST_KEY }),
    ).toEqual({ live: LIVE_KEY, test: TEST_KEY });
  });
});

describe("selectMerchantApiKey", () => {
  it("returns the session key when no live or test key was granted", () => {
    expect(selectMerchantApiKey({ active: "live" }, PASTED_KEY)).toBe(
      PASTED_KEY,
    );
    expect(selectMerchantApiKey({ active: "test" }, null)).toBeNull();
  });

  it("defaults to live when both keys were granted", () => {
    expect(
      selectMerchantApiKey(
        { live: LIVE_KEY, test: TEST_KEY, active: "live" },
        LIVE_KEY,
      ),
    ).toBe(LIVE_KEY);
  });

  it("returns the test key after the connection switches", () => {
    expect(
      selectMerchantApiKey(
        { live: LIVE_KEY, test: TEST_KEY, active: "test" },
        LIVE_KEY,
      ),
    ).toBe(TEST_KEY);
  });

  it("keeps a pasted or discovered key that is not the granted live or test key", () => {
    expect(
      selectMerchantApiKey(
        { live: LIVE_KEY, test: TEST_KEY, active: "test" },
        PASTED_KEY,
      ),
    ).toBe(PASTED_KEY);
  });

  it("falls back to the remaining granted key", () => {
    expect(
      selectMerchantApiKey({ live: LIVE_KEY, active: "test" }, LIVE_KEY),
    ).toBe(LIVE_KEY);
    expect(
      selectMerchantApiKey({ test: TEST_KEY, active: "live" }, TEST_KEY),
    ).toBe(TEST_KEY);
  });
});

describe("lomi_environment", () => {
  it("reports the active environment without switching when omitted", async () => {
    const state: MerchantEnvironmentState = {
      live: LIVE_KEY,
      test: TEST_KEY,
      active: "live",
    };
    const handler = captureEnvironmentHandler(state);
    const result = await handler({});
    expect(result.isError).toBeUndefined();
    expect(environmentPayload(result)).toEqual({
      environment: "live",
      live: true,
      test: true,
    });
    expect(state.active).toBe("live");
  });

  it("switches to test and back to live when both were granted", async () => {
    const state: MerchantEnvironmentState = {
      live: LIVE_KEY,
      test: TEST_KEY,
      active: "live",
    };
    const handler = captureEnvironmentHandler(state);
    const toTest = await handler({ environment: "test" });
    expect(toTest.isError).toBeUndefined();
    expect(environmentPayload(toTest).environment).toBe("test");
    expect(state.active).toBe("test");
    expect(selectMerchantApiKey(state, LIVE_KEY)).toBe(TEST_KEY);

    const toLive = await handler({ environment: "live" });
    expect(environmentPayload(toLive).environment).toBe("live");
    expect(selectMerchantApiKey(state, LIVE_KEY)).toBe(LIVE_KEY);
  });

  it("rejects an environment that was not granted and leaves active unchanged", async () => {
    const state: MerchantEnvironmentState = {
      live: LIVE_KEY,
      active: "live",
    };
    const handler = captureEnvironmentHandler(state);
    const result = await handler({ environment: "test" });
    expect(result.isError).toBe(true);
    expect(result.content[0]?.text).toBe(
      "Test was not granted on this connection.",
    );
    expect(state.active).toBe("live");
  });
});

describe("wireMcpServer dual environment", () => {
  it("registers lomi_environment only when both live and test were granted", () => {
    const both = captureRegisteredToolNames(() => {
      wireMcpServer({
        manifest: emptyManifest,
        mode: "http",
        getApiKey: () => LIVE_KEY,
        merchantEnvironment: {
          live: LIVE_KEY,
          test: TEST_KEY,
          active: "live",
        },
      });
    });
    expect(both).toContain("lomi_environment");

    const liveOnly = captureRegisteredToolNames(() => {
      wireMcpServer({
        manifest: emptyManifest,
        mode: "http",
        getApiKey: () => LIVE_KEY,
        merchantEnvironment: { live: LIVE_KEY, active: "live" },
      });
    });
    expect(liveOnly).not.toContain("lomi_environment");
  });

  it("does not register lomi_environment on guest sessions", () => {
    const names = captureRegisteredToolNames(() => {
      wireMcpServer({
        manifest: emptyManifest,
        mode: "http",
        guest: true,
        getApiKey: () => LIVE_KEY,
        merchantEnvironment: {
          live: LIVE_KEY,
          test: TEST_KEY,
          active: "live",
        },
      });
    });
    expect(names).not.toContain("lomi_environment");
  });
});

describe("dual-environment instructions", () => {
  it("mentions lomi_environment only when both keys were granted", () => {
    const dual = buildServerInstructions("http", false, {
      dualEnvironment: true,
    });
    expect(dual).toContain("lomi_environment");
    expect(dual).toContain("Calls use live until");

    const single = buildServerInstructions("http", false);
    expect(single).not.toContain("lomi_environment");
  });
});
