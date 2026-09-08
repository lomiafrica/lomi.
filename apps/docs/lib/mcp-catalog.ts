/* @proprietary license */

export const MCP_CATALOG_CATEGORIES = [
  'accept',
  'commerce',
  'money',
  'platform',
  'operations',
  'agents',
] as const;

export type McpCatalogCategory = (typeof MCP_CATALOG_CATEGORIES)[number];
