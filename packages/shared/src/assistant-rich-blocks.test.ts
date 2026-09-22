import assert from "node:assert/strict";
import { test } from "node:test";
import { splitAssistantRichBlocks } from "./assistant-rich-blocks.js";

test("keeps prose and parses a markdown table", () => {
  const blocks = splitAssistantRichBlocks(
    "Top customers\n\n| Name | Spend |\n| --- | --- |\n| Baptiste | 655957 |",
  );
  assert.equal(blocks[0]?.type, "text");
  assert.equal(blocks[1]?.type, "table");
  if (blocks[1]?.type !== "table") return;
  assert.deepEqual(blocks[1].table.headers, ["Name", "Spend"]);
  assert.deepEqual(blocks[1].table.rows, [["Baptiste", "655957"]]);
});

test("parses a lomi-chart fence and hides an unfinished one", () => {
  const closed = splitAssistantRichBlocks(
    'Ranked.\n```lomi-chart\n{"title":"Top","unit":"XOF","points":[{"label":"Baptiste","value":655957}]}\n```',
  );
  assert.equal(closed[0]?.type, "text");
  assert.equal(closed[1]?.type, "chart");
  if (closed[1]?.type !== "chart") return;
  assert.equal(closed[1].chart.points[0]?.value, 655957);
  assert.equal(closed[1].chart.unit, "XOF");

  const open = splitAssistantRichBlocks(
    'Ranked.\n```lomi-chart\n{"title":"Top"',
  );
  assert.equal(open.length, 1);
  assert.equal(open[0]?.type, "text");
});
