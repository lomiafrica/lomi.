/* @proprietary license */

import fs from 'node:fs';
import path from 'node:path';
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

const SIDEBAR_SEPARATOR_TO_CATEGORY: Record<string, McpCatalogCategory> = {
  '---Accept payments---': 'accept',
  '---Manage commerce---': 'commerce',
  '---Move money---': 'money',
  '---Platform---': 'platform',
  '---Operations---': 'operations',
};

const FOLDER_TO_CATEGORY: ReadonlyMap<string, McpCatalogCategory> = (() => {
  const map = new Map<string, McpCatalogCategory>();
  for (const group of REST_API_SIDEBAR_GROUPS) {
    const category = SIDEBAR_SEPARATOR_TO_CATEGORY[group.separator];
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

export function parseMcpToolPolicy(value: JsonValue): {
  excludedOperationKeys: string[];
  groups: McpToolGroupTwins[];
} {
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

export function restDocsHrefFromMdxFile(relativePath: string): string | null {
  const normalized = relativePath.replace(/\\/g, '/');
  const match = /(?:^|\/)api\/([^/]+)\/([^/]+?)(?:\.fr)?\.mdx$/.exec(
    normalized,
  );
  if (!match || !match[1] || !match[2]) return null;
  if (match[2] === 'index') return null;
  return `/api/${match[1]}/${match[2]}`;
}

let cachedRestHrefs: Map<string, string> | null = null;

/**
 * operationKey → REST docs URL. Reads hand-authored MDX on disk so the MCP
 * page never imports the fumadocs `source` loader (that cycle remounts the
 * page in dev).
 */
export function listRestDocsHrefs(): Map<string, string> {
  if (cachedRestHrefs) return cachedRestHrefs;
  const map = new Map<string, string>();
  const apiRoot = path.join(process.cwd(), 'content/docs/api');
  if (!fs.existsSync(apiRoot)) {
    cachedRestHrefs = map;
    return map;
  }

  for (const folder of fs.readdirSync(apiRoot, { withFileTypes: true })) {
    if (!folder.isDirectory()) continue;
    const folderPath = path.join(apiRoot, folder.name);
    for (const file of fs.readdirSync(folderPath)) {
      if (
        !file.endsWith('.mdx') ||
        file.endsWith('.fr.mdx') ||
        file === 'index.mdx'
      ) {
        continue;
      }
      const content = fs.readFileSync(path.join(folderPath, file), 'utf8');
      const methodMatch = /^method:\s*(\S+)/m.exec(content);
      const pathMatch = /^path:\s*(.+)$/m.exec(content);
      if (!methodMatch?.[1] || !pathMatch?.[1]) continue;
      const routePath = pathMatch[1].trim().replace(/^['"]|['"]$/g, '');
      const key = `${methodMatch[1].toUpperCase()} ${routePath}`;
      const href = restDocsHrefFromMdxFile(
        `content/docs/api/${folder.name}/${file}`,
      );
      if (href && !map.has(key)) map.set(key, href);
    }
  }

  cachedRestHrefs = map;
  return map;
}
