import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";

import { callLomiRest } from "../src/lomi-http.ts";
import type { RestCallSpec } from "../src/manifest.ts";

describe("callLomiRest", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response('{"ok":true}', { status: 200 })),
    );
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("substitutes path params and sets API key", async () => {
    const spec: RestCallSpec = {
      method: "get",
      pathTemplate: "/customers/{id}",
      pathParamNames: ["id"],
      queryParamNames: [],
      wantsBody: false,
      inputSchema: {
        type: "object",
        properties: {
          id: { type: "string" },
        },
        required: ["id"],
      },
    };

    await callLomiRest(
      spec,
      { id: "abc-123" },
      {
        baseUrl: "https://api.example.test",
        apiKey: "secret",
      },
    );

    expect(fetch).toHaveBeenCalledTimes(1);
    const call = vi.mocked(fetch).mock.calls[0]!;
    expect(call[0]).toBe("https://api.example.test/customers/abc-123");
    // SAFETY: fetch mock records RequestInit as the second call argument.
    const init = call[1] as RequestInit;
    expect(init.method).toBe("GET");
    // SAFETY: callLomiRest sets plain string header maps on RequestInit.
    const headers = init.headers as { [name: string]: string };
    expect(headers["X-API-KEY"]).toBe("secret");
  });

  it("only forwards header_* keys declared on inputSchema", async () => {
    const spec: RestCallSpec = {
      method: "get",
      pathTemplate: "/x",
      pathParamNames: [],
      queryParamNames: [],
      wantsBody: false,
      inputSchema: {
        type: "object",
        properties: {
          "header_X-Request-Id": { type: "string" },
        },
      },
    };

    await callLomiRest(
      spec,
      {
        "header_X-Request-Id": "rid",
        header_Evil: "no",
      },
      { baseUrl: "https://api.example.test", apiKey: "k" },
    );

    // SAFETY: fetch mock records RequestInit as the second call argument.
    const init = vi.mocked(fetch).mock.calls[0]![1] as RequestInit;
    // SAFETY: callLomiRest sets plain string header maps on RequestInit.
    const headers = init.headers as { [name: string]: string };
    expect(headers["X-Request-Id"]).toBe("rid");
    expect(headers.Evil).toBeUndefined();
  });
});
