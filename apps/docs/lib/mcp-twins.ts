/* @proprietary license */

import fs from 'node:fs';
import {
  asJsonValue,
  isJsonObject,
  isString,
  parseJson,
  type JsonValue,
} from '@lomi./shared';
import policyJson from '../../mcp/config/mcp-tool-policy.json';
import type { McpCatalogCategory } from '@/lib/mcp-catalog';
import {
  REST_API_SIDEBAR_GROUPS,
  pathToFolder,
} from '@/lib/scripts/manual-api/constants';

export type { McpCatalogCategory } from '@/lib/mcp-catalog';
export { MCP_CATALOG_CATEGORIES } from '@/lib/mcp-catalog';

export type McpAuthMode = 'merchant' | 'provisioning' | 'partner';

const SIDEBAR_SEPARATOR_TO_CATEGORY = {
  '---Accept payments---': 'accept',
  '---Manage commerce---': 'commerce',
  '---Move money---': 'money',
  '---Platform---': 'platform',
  '---Operations---': 'operations',
} as const;

type SidebarSeparator = keyof typeof SIDEBAR_SEPARATOR_TO_CATEGORY;

function isSidebarSeparator(value: string): value is SidebarSeparator {
  return Object.hasOwn(SIDEBAR_SEPARATOR_TO_CATEGORY, value);
}

const FOLDER_TO_CATEGORY: ReadonlyMap<string, McpCatalogCategory> = (() => {
  const map = new Map<string, McpCatalogCategory>();
  for (const group of REST_API_SIDEBAR_GROUPS) {
    const category = isSidebarSeparator(group.separator)
      ? SIDEBAR_SEPARATOR_TO_CATEGORY[group.separator]
      : undefined;
    if (!category) continue;
    for (const folder of group.folders) {
      map.set(folder, category);
    }
  }
  return map;
})();

export type McpTwin = {
  operationKey: string;
  method: string;
  path: string;
  tool: string;
  action: string;
  toolTitle: string;
  authMode: McpAuthMode;
};

export type McpToolGroupTwins = {
  tool: string;
  title: string;
  authMode: McpAuthMode;
  twins: McpTwin[];
};

const MCP_GUIDE_PATH = '/build/mcp';

function parseAuthMode(value: JsonValue | undefined): McpAuthMode {
  if (value === 'provisioning') return 'provisioning';
  if (value === 'partner') return 'partner';
  if (value === 'merchant' || value === undefined) return 'merchant';
  return 'merchant';
}

export function operationKey(method: string, route: string): string {
  const trimmed = route.trim();
  const withSlash = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  return `${method.trim().toUpperCase()} ${withSlash}`;
}

export function parseOperationKey(
  key: string,
): { method: string; path: string } | null {
  const match = /^([A-Z]+)\s+(\/.+)$/.exec(key.trim());
  if (!match || !match[1] || !match[2]) return null;
  return { method: match[1], path: match[2] };
}

export function mcpTwinAnchor(tool: string, action: string): string {
  return `${tool}-${action}`;
}

export function mcpTwinHref(tool: string, action: string): string {
  return `${MCP_GUIDE_PATH}#${mcpTwinAnchor(tool, action)}`;
}

export function mcpCategoryFromPath(route: string): McpCatalogCategory {
  const folder = pathToFolder(route);
  return FOLDER_TO_CATEGORY.get(folder) ?? 'operations';
}

export function mcpCategoryForGroup(
  group: McpToolGroupTwins,
): McpCatalogCategory {
  if (group.authMode === 'provisioning' || group.authMode === 'partner') {
    return 'agents';
  }
  const firstPath = group.twins[0]?.path;
  if (!firstPath) return 'operations';
  return mcpCategoryFromPath(firstPath);
}

function parseGroup(value: JsonValue): McpToolGroupTwins | null {
  if (!isJsonObject(value)) return null;
  const name = value.name;
  const title = value.title;
  const actionsValue = value.actions;
  if (!isString(name) || !isString(title) || !isJsonObject(actionsValue)) {
    return null;
  }

  const authMode = parseAuthMode(value.authMode);
  const twins: McpTwin[] = [];

  for (const [action, operation] of Object.entries(actionsValue)) {
    if (!isString(operation)) continue;
    const parsed = parseOperationKey(operation);
    if (!parsed) continue;
    twins.push({
      operationKey: operation,
      method: parsed.method,
      path: parsed.path,
      tool: name,
      action,
      toolTitle: title,
      authMode,
    });
  }

  return { tool: name, title, authMode, twins };
}

export type McpToolPolicyParsed = {
  excludedOperationKeys: string[];
  groups: McpToolGroupTwins[];
};

export function parseMcpToolPolicy(value: JsonValue): McpToolPolicyParsed {
  if (!isJsonObject(value)) {
    throw new Error('MCP tool policy must be a JSON object');
  }

  const excluded: string[] = [];
  const excludedValue = value.mcpExcludedOperationKeys;
  if (Array.isArray(excludedValue)) {
    for (const entry of excludedValue) {
      if (isString(entry)) excluded.push(entry);
    }
  }

  const groups: McpToolGroupTwins[] = [];
  const collect = (raw: JsonValue | undefined) => {
    if (!Array.isArray(raw)) return;
    for (const entry of raw) {
      const group = parseGroup(entry);
      if (group) groups.push(group);
    }
  };

  collect(value.groups);
  collect(value.provisioningGroups);

  return { excludedOperationKeys: excluded, groups };
}

export function flattenMcpTwins(
  groups: McpToolGroupTwins[],
): Map<string, McpTwin> {
  const byOperation = new Map<string, McpTwin>();
  for (const group of groups) {
    for (const twin of group.twins) {
      if (!byOperation.has(twin.operationKey)) {
        byOperation.set(twin.operationKey, twin);
      }
    }
  }
  return byOperation;
}

export function loadMcpToolPolicyFile(policyPath?: string): JsonValue {
  if (!policyPath) {
    return asJsonValue(policyJson);
  }
  return parseJson(fs.readFileSync(policyPath, 'utf8'));
}

let cachedGroups: McpToolGroupTwins[] | null = null;
let cachedByOperation: Map<string, McpTwin> | null = null;
let cachedExcluded: Set<string> | null = null;

function ensureCache(): void {
  if (cachedGroups && cachedByOperation && cachedExcluded) return;
  const parsed = parseMcpToolPolicy(loadMcpToolPolicyFile());
  cachedGroups = parsed.groups;
  cachedByOperation = flattenMcpTwins(parsed.groups);
  cachedExcluded = new Set(parsed.excludedOperationKeys);
}

export function listMcpToolGroups(): McpToolGroupTwins[] {
  ensureCache();
  return cachedGroups ?? [];
}

export function mcpExcludedOperationKeys(): Set<string> {
  ensureCache();
  return cachedExcluded ?? new Set();
}

export function findMcpTwin(
  method: string,
  route: string,
): McpTwin | undefined {
  ensureCache();
  return cachedByOperation?.get(operationKey(method, route));
}
