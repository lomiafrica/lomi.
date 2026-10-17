import { describe, expect, it } from "vitest";

import { buildServerInstructions } from "../src/server-instructions.js";

const PRIVATE_IN_PUBLIC = [
  "notion.so",
  "app.notion.com",
  "notion.site",
  "agents.md",
];

describe("public MCP instructions", () => {
  it("does not cite private operating canon", () => {
    for (const mode of ["stdio", "http"] as const) {
      for (const guest of [false, true]) {
        const text = buildServerInstructions(mode, guest);
        for (const pattern of PRIVATE_IN_PUBLIC) {
          expect(
            text.toLowerCase(),
            `${mode} guest=${guest} ${pattern}`,
          ).not.toContain(pattern);
        }
      }
    }
  });
});
