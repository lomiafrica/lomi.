import { describe, expect, it } from "vitest";

import { buildServerInstructions } from "../src/server-instructions.js";

const PRIVATE_IN_PUBLIC = [
  /notion\.so/i,
  /app\.notion\.com/i,
  /notion\.site/i,
  /agents\.md/i,
];

describe("public MCP instructions", () => {
  it("does not cite private operating canon", () => {
    for (const mode of ["stdio", "http"] as const) {
      for (const guest of [false, true]) {
        const text = buildServerInstructions(mode, guest);
        for (const pattern of PRIVATE_IN_PUBLIC) {
          expect(text, `${mode} guest=${guest} ${pattern}`).not.toMatch(pattern);
        }
      }
    }
  });
});
