import {
  isJsonObject,
  isString,
  readObject,
  type JsonObject,
  type JsonValue,
} from "@lomi./shared";
import {
  canonicalizeInputSchema,
  type ResolvedJsonSchema,
} from "./openapi-helpers.js";

export type ToolGroupDef = {
  name: string;
  title?: string;
  authMode?: "merchant" | "provisioning" | "partner";
  actions: { [action: string]: string };
};

const GROUP_NAME = /^lomi_[a-z0-9]+(?:_[a-z0-9]+)*$/;
const ACTION_NAME = /^[a-z][a-z0-9_]*$/;

function stringArray(value: JsonValue | undefined): string[] {
  return Array.isArray(value) ? value.filter(isString) : [];
}

function parseGroups(
  raw: JsonValue | undefined,
  field: string,
): ToolGroupDef[] {
  if (!Array.isArray(raw) || raw.length === 0) {
    throw new Error(`mcp-tool-policy.json ${field} must be a non-empty array`);
  }
  const groups: ToolGroupDef[] = [];
  const names = new Set<string>();
  for (const entry of raw) {
    if (!isJsonObject(entry)) {
      throw new Error(`mcp-tool-policy.json ${field} entries must be objects`);
    }
    const name = entry["name"];
    if (!isString(name) || !GROUP_NAME.test(name)) {
      throw new Error(
        `mcp-tool-policy.json ${field} name "${String(name)}" must match ${GROUP_NAME}`,
      );
    }
    if (names.has(name)) {
      throw new Error(`Duplicate MCP group name: ${name}`);
    }
    names.add(name);
    const actionsRaw = entry["actions"];
    if (!isJsonObject(actionsRaw) || Object.keys(actionsRaw).length === 0) {
      throw new Error(`${name} actions must be a non-empty object`);
    }
    const actions: { [action: string]: string } = {};
    for (const [action, op] of Object.entries(actionsRaw)) {
      if (!ACTION_NAME.test(action)) {
        throw new Error(`${name} action "${action}" must match ${ACTION_NAME}`);
      }
      if (!isString(op)) {
        throw new Error(`${name}.${action} must be an operation key string`);
      }
      actions[action] = op;
    }
    const title = isString(entry["title"]) ? entry["title"] : undefined;
    const authModeRaw = entry["authMode"];
    const authMode =
      authModeRaw === "provisioning" ||
      authModeRaw === "partner" ||
      authModeRaw === "merchant"
        ? authModeRaw
        : undefined;
    groups.push({ name, title, authMode, actions });
  }
  return groups;
}

export function loadMerchantGroups(policyJson: JsonObject): ToolGroupDef[] {
  return parseGroups(policyJson["groups"], "groups");
}

export function loadProvisioningGroups(policyJson: JsonObject): ToolGroupDef[] {
  return parseGroups(policyJson["provisioningGroups"], "provisioningGroups");
}

export function assertGroupsCoverOperations(
  groups: ToolGroupDef[],
  includedKeys: Set<string>,
  label: string,
): void {
  const seen = new Map<string, string>();
  for (const group of groups) {
    for (const [action, op] of Object.entries(group.actions)) {
      if (!includedKeys.has(op)) {
        throw new Error(
          `${label} group ${group.name}.${action} references "${op}" which is not an included operation`,
        );
      }
      const prev = seen.get(op);
      if (prev) {
        throw new Error(
          `${label} operation "${op}" is mapped twice (${prev} and ${group.name}.${action})`,
        );
      }
      seen.set(op, `${group.name}.${action}`);
    }
  }
  const missing = [...includedKeys].filter((k) => !seen.has(k)).sort();
  if (missing.length > 0) {
    throw new Error(
      `${label} operations not assigned to a group: ${missing.join(", ")}`,
    );
  }
}

export function requiredInputFromSchema(schema: ResolvedJsonSchema): string[] {
  return stringArray(schema["required"]);
}

export function mergeGroupInputSchema(
  actionNames: string[],
  actionSchemas: ResolvedJsonSchema[],
): ResolvedJsonSchema {
  const properties: JsonObject = {
    action: {
      type: "string",
      enum: actionNames,
      description: `Which REST operation to run. One of: ${actionNames.join(", ")}.`,
    },
  };

  for (const schema of actionSchemas) {
    const props = readObject(schema, "properties") ?? {};
    for (const [key, value] of Object.entries(props)) {
      if (key === "action") continue;
      if (key === "body") {
        if (!properties["body"]) {
          properties["body"] = {
            type: "object",
            additionalProperties: true,
            description:
              "JSON request body. Required for write actions that send a body; shape depends on action.",
          };
        }
        continue;
      }
      if (!(key in properties) && value !== undefined) {
        properties[key] = value;
      }
    }
  }

  return canonicalizeInputSchema({
    type: "object",
    additionalProperties: true,
    required: ["action"],
    properties,
  });
}

export function buildGroupDescription(args: {
  title: string;
  actions: Array<{
    name: string;
    title: string;
    operationKey: string;
    required: string[];
  }>;
}): string {
  const actionLines = args.actions.map((action) => {
    const req =
      action.required.length > 0
        ? ` Required: ${action.required.join(", ")}.`
        : " No extra required fields.";
    return `- \`${action.name}\` — ${action.title} (${action.operationKey}).${req}`;
  });
  return [
    `${args.title}. Pass required \`action\` to choose the REST call.`,
    "",
    "Actions:",
    ...actionLines,
    "",
    "Pass idempotency_key on write actions. Omit fields that do not apply to the chosen action.",
  ].join("\n");
}
