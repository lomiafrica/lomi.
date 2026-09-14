import { afterEach, describe, expect, it, vi } from "vitest";
import { mcpLog } from "../src/mcp-request-context.js";

describe("mcpLog", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("writes info events to stdout", () => {
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    mcpLog("mcp_http_startup", { port: 8080 });

    expect(logSpy).toHaveBeenCalledOnce();
    expect(errorSpy).not.toHaveBeenCalled();
    const payload = JSON.parse(String(logSpy.mock.calls[0]?.[0]));
    expect(payload.event).toBe("mcp_http_startup");
    expect(payload.level).toBe("info");
    expect(payload.port).toBe(8080);
  });

  it("writes warn events to stderr warn", () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    mcpLog("mcp_session_rejected", { reason: "max_sessions" }, "warn");

    expect(warnSpy).toHaveBeenCalledOnce();
    const payload = JSON.parse(String(warnSpy.mock.calls[0]?.[0]));
    expect(payload.level).toBe("warn");
  });

  it("writes error events to stderr error", () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    mcpLog("mcp_post_error", { error: "boom" }, "error");

    expect(errorSpy).toHaveBeenCalledOnce();
    const payload = JSON.parse(String(errorSpy.mock.calls[0]?.[0]));
    expect(payload.level).toBe("error");
  });
});
