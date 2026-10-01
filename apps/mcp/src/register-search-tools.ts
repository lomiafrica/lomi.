import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

import type { ManifestTool, ToolsManifest } from "./manifest.js";

const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 25;

/** Score a manifest tool against a keyword query (Composer tool_search weights). */
export function scoreManifestTool(tool: ManifestTool, query: string): number {
  if (!query) return 0;
  const q = query.toLowerCase();
  let score = 0;
  const nameLower = tool.name.toLowerCase();
  if (nameLower === q) score += 10;
  else if (nameLower.includes(q)) score += 5;

  for (const action of Object.keys(tool.actions)) {
    const actionLower = action.toLowerCase();
    if (actionLower === q) score += 6;
    else if (actionLower.includes(q) || q.includes(actionLower)) score += 3;
  }

  const hint = tool.searchHint.toLowerCase();
  if (hint) {
    for (const word of hint.split(/\s+/)) {
      if (word.includes(q)) {
        score += 4;
        break;
      }
    }
  }

  for (const tag of tool.tags) {
    if (tag.toLowerCase().includes(q)) score += 3;
  }

  if (tool.description.toLowerCase().includes(q)) score += 2;
  if (tool.title.toLowerCase().includes(q)) score += 2;

  return score;
}

export function searchManifestTools(
  manifest: ToolsManifest,
  query: string,
  limit: number = DEFAULT_LIMIT,
): Array<{
  name: string;
  title: string;
  write: boolean;
  description: string;
  destructive: boolean;
  readOnly: boolean;
}> {
  const q = query.trim();
  if (!q) return [];

  const cap = Math.min(Math.max(1, limit), MAX_LIMIT);
  const scored = manifest.tools
    .map((tool) => ({ tool, score: scoreManifestTool(tool, q) }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || a.tool.name.localeCompare(b.tool.name))
    .slice(0, cap);

  return scored.map(({ tool }) => ({
    name: tool.name,
    title: tool.title,
    write: tool.write,
    description: tool.description.split("\n\n")[0] ?? tool.description,
    destructive: tool.destructive,
    readOnly: tool.readOnly,
  }));
}

const searchInputSchema = {
  query: z
    .string()
    .min(1)
    .describe("Keywords describing the capability you need"),
  limit: z
    .number()
    .int()
    .min(1)
    .max(MAX_LIMIT)
    .optional()
    .describe("Max results (default 10)"),
};

export function registerSearchToolsMetaTool(
  server: McpServer,
  manifest: ToolsManifest,
): void {
  server.registerTool(
    "lomi_search_tools",
    {
      title: "Search lomi. MCP tools",
      description:
        "Search available lomi. merchant API tools by keyword when the full catalog is not loaded. Returns compact matches (name, title, write flag). Resource tools take a required `action` parameter.",
      inputSchema: searchInputSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        openWorldHint: false,
      },
      _meta: {
        "anthropic/alwaysLoad": true,
      },
    },
    async (args) => {
      // SAFETY: searchInputSchema constrains args to query + optional limit.
      const { query, limit } = args as { query: string; limit?: number };
      const matches = searchManifestTools(
        manifest,
        query,
        limit ?? DEFAULT_LIMIT,
      );
      const text = JSON.stringify(
        { query, count: matches.length, tools: matches },
        null,
        2,
      );
      const response = {
        content: [{ type: "text", text }],
      } satisfies { content: Array<{ type: "text"; text: string }> };
      if (matches.length === 0) return { ...response, isError: true };
      return response;
    },
  );
}
