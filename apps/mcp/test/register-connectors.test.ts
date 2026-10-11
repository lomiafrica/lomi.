import { describe, expect, it } from "vitest";
import { CONNECTORS_TOOL_DESCRIPTION } from "@lomi./shared";
import { LOMI_CONNECTORS_MCP_DESCRIPTION } from "../src/register-connectors.ts";

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
