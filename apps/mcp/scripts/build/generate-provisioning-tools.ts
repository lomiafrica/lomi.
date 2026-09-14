/**
 * Generates src/generated/provisioning-tools-manifest.json from agent-openapi.json.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  type OpenAPISpec,
  buildInputJsonSchema,
  pathTemplateParamNames,
} from "../../src/generator/openapi-helpers.js";
import type { EnglishCopyOverride } from "../../src/generator/mcp-english-copy.js";
import {
  assertGroupsCoverOperations,
  buildGroupDescription,
  loadProvisioningGroups,
  mergeGroupInputSchema,
  requiredInputFromSchema,
} from "../../src/generator/group-manifest.js";
import {
  buildSearchHint,
  isDestructiveOperation,
  isReadOnlyMethod,
} from "../../src/tool-policy.js";
import { validateManifestToolEntry } from "./validate-manifest-entry.js";
import type { ManifestAction, ManifestTool } from "../../src/manifest.js";
import {
  isJsonObject,
  isString,
  parseJson,
  type JsonObject,
} from "@lomi./shared";

const __dirname = dirname(fileURLToPath(import.meta.url));
const mcpRoot = join(__dirname, "../..");
const openapiPath = join(mcpRoot, "../docs/agent-openapi.json");
const provisioningAllowlistPath = join(
  mcpRoot,
  "../docs/lib/scripts/manual-api/_expected-provisioning-operations.json",
);
const partnerAllowlistPath = join(
  mcpRoot,
  "../docs/lib/scripts/manual-api/_expected-partner-operations.json",
);
const policyPath = join(mcpRoot, "config/mcp-tool-policy.json");
const copyOverridesPath = join(mcpRoot, "config/mcp-provisioning-copy.en.json");
const outDir = join(mcpRoot, "src/generated");
const outFile = join(outDir, "provisioning-tools-manifest.json");

const WRITE_METHODS = new Set(["post", "patch", "put", "delete"]);
const HTTP_WITH_BODY = new Set(["post", "put", "patch"]);

type CopyOverrideMap = { [operationKey: string]: EnglishCopyOverride };

type AgentOperation = {
  operationKey: string;
  method: string;
  httpMethodLower: string;
  pathTemplate: string;
  pathItem: JsonObject;
  openApiOp: JsonObject;
};

function asJsonObject(value: JsonValue | undefined, label: string): JsonObject {
  if (!isJsonObject(value)) {
    throw new Error(label);
  }
  return value;
}

function loadAllowlist(path: string): string[] {
  const parsed = parseJson(readFileSync(path, "utf-8"));
  if (!Array.isArray(parsed)) {
    throw new Error(`${path} must be a JSON array`);
  }
  return parsed.map((entry) => String(entry));
}

function queryParamNamesFromOpenApi(
  pathItem: JsonObject,
  operation: JsonObject,
): string[] {
  const raw = [
    ...(Array.isArray(pathItem["parameters"]) ? pathItem["parameters"] : []),
    ...(Array.isArray(operation["parameters"]) ? operation["parameters"] : []),
  ];
  const names: string[] = [];
  for (const parameter of raw) {
    if (
      isJsonObject(parameter) &&
      parameter["in"] === "query" &&
      isString(parameter["name"])
    ) {
      names.push(parameter["name"]);
    }
  }
  return names;
}

function main(): void {
  const specParsed = parseJson(readFileSync(openapiPath, "utf-8"));
  if (!isJsonObject(specParsed)) {
    throw new Error("agent-openapi.json must be a JSON object");
  }
  // SAFETY: agent-openapi.json is the OpenAPI document shape OpenAPISpec expects.
  const apiSpec = specParsed as OpenAPISpec;
  const policyParsed = parseJson(readFileSync(policyPath, "utf-8"));
  if (!isJsonObject(policyParsed)) {
    throw new Error("mcp-tool-policy.json must be a JSON object");
  }
  const groups = loadProvisioningGroups(policyParsed);

  const parsedCopy = parseJson(readFileSync(copyOverridesPath, "utf-8"));
  if (!isJsonObject(parsedCopy)) {
    throw new Error("mcp-provisioning-copy.en.json must be a JSON object");
  }
  // SAFETY: Curated copy file maps operation keys to EnglishCopyOverride objects.
  const copyOverrides = parsedCopy as CopyOverrideMap;

  const allowlist = [
    ...loadAllowlist(provisioningAllowlistPath),
    ...loadAllowlist(partnerAllowlistPath),
  ];
  const allowedKeys = new Set(
    allowlist.map((entry) => {
      const [method, ...pathParts] = String(entry).split(/\s+/);
      return `${method.toUpperCase()} ${pathParts.join(" ")}`;
    }),
  );
  for (const key of Object.keys(copyOverrides)) {
    if (!allowedKeys.has(key)) {
      throw new Error(
        `mcp-provisioning-copy.en.json has copy for "${key}" which is not a provisioning/partner tool. Fix the key or remove the entry.`,
      );
    }
  }

  const operations: AgentOperation[] = allowlist.map((entry) => {
    const [method, ...pathParts] = String(entry).split(/\s+/);
    const pathTemplate = pathParts.join(" ");
    const httpMethodLower = method.toLowerCase();
    const operationKey = `${method.toUpperCase()} ${pathTemplate}`;
    const pathItemRoot = apiSpec.paths?.[pathTemplate];
    const pathItem = asJsonObject(
      pathItemRoot,
      `OpenAPI paths missing "${pathTemplate}"`,
    );
    const openApiOp = asJsonObject(
      pathItem[httpMethodLower],
      `OpenAPI missing ${method.toUpperCase()} ${pathTemplate}`,
    );
    return {
      operationKey,
      method: method.toUpperCase(),
      httpMethodLower,
      pathTemplate,
      pathItem,
      openApiOp,
    };
  });
  const includedByKey = new Map(operations.map((op) => [op.operationKey, op]));

  assertGroupsCoverOperations(groups, allowedKeys, "provisioning");

  const tools: ManifestTool[] = groups.map((group) => {
    const builtActions: Array<{
      name: string;
      action: ManifestAction;
      inputSchema: ReturnType<typeof buildInputJsonSchema>;
    }> = [];

    for (const [actionName, operationKey] of Object.entries(group.actions)) {
      const op = includedByKey.get(operationKey);
      if (!op) {
        throw new Error(
          `Group ${group.name}.${actionName} missing operation ${operationKey}`,
        );
      }
      const write = WRITE_METHODS.has(op.httpMethodLower);
      const wantsBody =
        HTTP_WITH_BODY.has(op.httpMethodLower) &&
        Boolean(op.openApiOp["requestBody"]);

      const inputSchema = buildInputJsonSchema({
        spec: apiSpec,
        operation: op.openApiOp,
        pathItem: op.pathItem,
        pathTemplate: op.pathTemplate,
        httpMethodLower: op.httpMethodLower,
        includeIdempotencyKey: write,
      });

      const override = copyOverrides[operationKey];
      const summaryText = op.openApiOp["summary"];
      const descriptionText = op.openApiOp["description"];
      const nameFallback = `${group.name} ${actionName}`;
      const title =
        override?.title ??
        (isString(summaryText) && summaryText.length > 0
          ? summaryText
          : nameFallback);
      const description =
        override?.description ??
        (isString(descriptionText) ? descriptionText : title);
      const tags = Array.isArray(op.openApiOp["tags"])
        ? op.openApiOp["tags"].filter(isString)
        : [group.authMode === "partner" ? "Partners" : "Provisioning"];

      builtActions.push({
        name: actionName,
        inputSchema,
        action: {
          operationKey,
          method: op.method,
          pathTemplate: op.pathTemplate,
          pathParamNames: pathTemplateParamNames(op.pathTemplate),
          queryParamNames: queryParamNamesFromOpenApi(
            op.pathItem,
            op.openApiOp,
          ),
          operationId: isString(op.openApiOp["operationId"])
            ? op.openApiOp["operationId"]
            : `${group.name}_${actionName}`,
          write,
          wantsBody,
          title,
          description,
          tags,
          requiredInput: requiredInputFromSchema(inputSchema),
        },
      });
    }

    const actions: { [action: string]: ManifestAction } = {};
    for (const built of builtActions) {
      actions[built.name] = built.action;
    }

    const title =
      group.title ?? group.name.replace(/^lomi_/, "").replace(/_/g, " ");
    const description = buildGroupDescription({
      title,
      actions: builtActions.map((built) => ({
        name: built.name,
        title: built.action.title,
        operationKey: built.action.operationKey,
        required: built.action.requiredInput.filter(
          (field) => field !== "idempotency_key",
        ),
      })),
    });

    const allTags = [
      ...new Set(builtActions.flatMap((built) => built.action.tags)),
    ];
    const write = builtActions.some((built) => built.action.write);
    const readOnly = builtActions.every((built) =>
      isReadOnlyMethod(built.action.method),
    );
    const destructive = builtActions.some((built) =>
      isDestructiveOperation(built.action.method, built.action.operationKey),
    );

    const hintTokens = new Set<string>([
      group.authMode === "partner" ? "partner" : "provisioning",
      "onboarding",
      "merchant",
      "account",
    ]);
    for (const built of builtActions) {
      hintTokens.add(built.name);
      const hint = buildSearchHint({
        name: group.name,
        method: built.action.method,
        operationKey: built.action.operationKey,
        pathTemplate: built.action.pathTemplate,
        tags: built.action.tags,
      });
      for (const token of hint.split(/\s+/)) {
        if (token.length > 1) hintTokens.add(token);
      }
    }

    const authMode = group.authMode === "partner" ? "partner" : "provisioning";

    return {
      name: group.name,
      title,
      description,
      tags: allTags,
      write,
      inputSchema: mergeGroupInputSchema(
        builtActions.map((built) => built.name),
        builtActions.map((built) => built.inputSchema),
      ),
      readOnly,
      destructive,
      alwaysLoad: group.name === "lomi_provision",
      searchHint: [...hintTokens].sort().join(" "),
      actions,
      authMode,
    };
  });

  for (const t of tools) {
    validateManifestToolEntry(t);
  }

  const manifest = {
    manifestVersion: 1 as const,
    apiVersion: apiSpec.info?.version ?? "1.1.0",
    apiTitle: "lomi. Provisioning API",
    toolCount: tools.length,
    tools,
  };

  mkdirSync(outDir, { recursive: true });
  writeFileSync(outFile, `${JSON.stringify(manifest, null, 2)}\n`, "utf-8");
  console.log(
    `Provisioning MCP manifest written (${tools.length} tools) to ${outFile}`,
  );
}

main();
