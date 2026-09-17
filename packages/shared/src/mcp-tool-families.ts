/** MCP merchant tool families for OAuth Custom consent. */

export const MCP_MONEY_TOOLS = [
  "lomi_payouts",
  "lomi_refunds",
  "lomi_settlements",
  "lomi_transfers",
] as const;

export type McpMoneyTool = (typeof MCP_MONEY_TOOLS)[number];

export const MCP_MONEY_TOOL_SET: ReadonlySet<string> = new Set(MCP_MONEY_TOOLS);

export const MCP_TOOL_FAMILY_IDS = [
  "payments",
  "customers",
  "catalog",
  "billing",
  "refunds_disputes",
  "payouts_finance",
  "risk",
  "developers",
  "organization",
  "network",
] as const;

export type McpToolFamilyId = (typeof MCP_TOOL_FAMILY_IDS)[number];

export type McpToolFamily = {
  id: McpToolFamilyId;
  tools: readonly string[];
};

export const MCP_TOOL_FAMILIES: readonly McpToolFamily[] = [
  {
    id: "payments",
    tools: [
      "lomi_checkout",
      "lomi_payment_links",
      "lomi_payment_requests",
      "lomi_transactions",
    ],
  },
  {
    id: "customers",
    tools: ["lomi_customers"],
  },
  {
    id: "catalog",
    tools: ["lomi_products", "lomi_coupons", "lomi_meters", "lomi_usage"],
  },
  {
    id: "billing",
    tools: ["lomi_subscriptions", "lomi_invoices"],
  },
  {
    id: "refunds_disputes",
    tools: ["lomi_refunds", "lomi_disputes"],
  },
  {
    id: "payouts_finance",
    tools: [
      "lomi_payouts",
      "lomi_payout_methods",
      "lomi_balance",
      "lomi_settlements",
      "lomi_transfers",
      "lomi_finance",
    ],
  },
  {
    id: "risk",
    tools: ["lomi_radar", "lomi_risk"],
  },
  {
    id: "developers",
    tools: ["lomi_webhooks", "lomi_api_keys", "lomi_logs", "lomi_exports"],
  },
  {
    id: "organization",
    tools: [
      "lomi_organization",
      "lomi_team",
      "lomi_settings",
      "lomi_merchant",
      "lomi_providers",
    ],
  },
  {
    id: "network",
    tools: ["lomi_network"],
  },
];

export const MCP_KNOWN_TOOLS: readonly string[] = MCP_TOOL_FAMILIES.flatMap(
  (family) => family.tools,
);

export const MCP_KNOWN_TOOL_SET: ReadonlySet<string> = new Set(MCP_KNOWN_TOOLS);

export function isMcpToolFamilyId(value: string): value is McpToolFamilyId {
  return (MCP_TOOL_FAMILY_IDS as readonly string[]).includes(value);
}

export function isKnownMcpTool(name: string): boolean {
  return MCP_KNOWN_TOOL_SET.has(name);
}

export function expandMcpToolFamilies(
  familyIds: readonly string[],
  options?: { includeMoney?: boolean },
): string[] {
  const includeMoney = options?.includeMoney ?? true;
  const tools = new Set<string>();
  for (const id of familyIds) {
    if (!isMcpToolFamilyId(id)) continue;
    const family = MCP_TOOL_FAMILIES.find((entry) => entry.id === id);
    if (!family) continue;
    for (const tool of family.tools) {
      if (!includeMoney && MCP_MONEY_TOOL_SET.has(tool)) continue;
      tools.add(tool);
    }
  }
  return [...tools].sort();
}

export function normalizeMcpAllowedTools(
  tools: readonly string[] | null | undefined,
): string[] | null {
  if (tools == null) return null;
  const unique = [
    ...new Set(
      tools.map((tool) => tool.trim()).filter((tool) => tool.length > 0),
    ),
  ].sort();
  return unique.length > 0 ? unique : null;
}

export function unknownMcpTools(tools: readonly string[]): string[] {
  return tools.filter((tool) => !MCP_KNOWN_TOOL_SET.has(tool));
}

export function mcpToolsMissingFamily(toolNames: readonly string[]): string[] {
  return toolNames.filter((name) => !MCP_KNOWN_TOOL_SET.has(name));
}

export function mcpFamilyDuplicateTools(): string[] {
  const seen = new Set<string>();
  const duplicates: string[] = [];
  for (const tool of MCP_KNOWN_TOOLS) {
    if (seen.has(tool)) duplicates.push(tool);
    seen.add(tool);
  }
  return duplicates;
}
