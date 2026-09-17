import assert from "node:assert/strict";
import { test } from "node:test";
import {
  MCP_KNOWN_TOOLS,
  MCP_MONEY_TOOLS,
  MCP_TOOL_FAMILIES,
  expandMcpToolFamilies,
  mcpFamilyDuplicateTools,
  mcpToolsMissingFamily,
  normalizeMcpAllowedTools,
  unknownMcpTools,
} from "./mcp-tool-families.js";

test("each family tool is unique", () => {
  assert.deepEqual(mcpFamilyDuplicateTools(), []);
});

test("known tools cover every family entry", () => {
  assert.equal(MCP_KNOWN_TOOLS.length, 31);
  assert.equal(
    MCP_TOOL_FAMILIES.reduce((sum, family) => sum + family.tools.length, 0),
    31,
  );
});

test("expandMcpToolFamilies drops money tools when includeMoney is false", () => {
  const withMoney = expandMcpToolFamilies([
    "payouts_finance",
    "refunds_disputes",
  ]);
  const withoutMoney = expandMcpToolFamilies(
    ["payouts_finance", "refunds_disputes"],
    { includeMoney: false },
  );
  for (const tool of MCP_MONEY_TOOLS) {
    assert.equal(withMoney.includes(tool), true);
    assert.equal(withoutMoney.includes(tool), false);
  }
  assert.equal(withoutMoney.includes("lomi_disputes"), true);
  assert.equal(withoutMoney.includes("lomi_balance"), true);
});

test("normalizeMcpAllowedTools trims, dedupes, and sorts", () => {
  assert.equal(normalizeMcpAllowedTools(null), null);
  assert.equal(normalizeMcpAllowedTools([]), null);
  assert.deepEqual(
    normalizeMcpAllowedTools([
      " lomi_customers ",
      "lomi_checkout",
      "lomi_customers",
    ]),
    ["lomi_checkout", "lomi_customers"],
  );
});

test("unknownMcpTools reports names outside the catalog", () => {
  assert.deepEqual(unknownMcpTools(["lomi_customers", "lomi_not_a_tool"]), [
    "lomi_not_a_tool",
  ]);
  assert.deepEqual(mcpToolsMissingFamily(["lomi_checkout"]), []);
});
