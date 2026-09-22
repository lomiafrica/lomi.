/**
 * Generates src/generated/tools-manifest.json from apps/docs/openapi.json
 * and the public merchant operation allowlist (same contract as SDKs).
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  type OpenAPISpec,
  buildInputJsonSchema,
} from "../../src/generator/openapi-helpers.js";
import {
  type EnglishCopyOverride,
  resolveEnglishCopy,
} from "../../src/generator/mcp-english-copy.js";
import {
  assertGroupsCoverOperations,
  buildGroupDescription,
  loadMerchantGroups,
  mergeGroupInputSchema,
  requiredInputFromSchema,
} from "../../src/generator/group-manifest.js";
import {
  buildSearchHint,
  isDestructiveOperation,
  isReadOnlyMethod,
  loadAlwaysLoadKeys,
  loadExcludedOperationKeys,
} from "../../src/tool-policy.js";
import { validateManifestToolEntry } from "./validate-manifest-entry.js";
import type { ManifestAction, ManifestTool } from "../../src/manifest.js";
import {
  readSpecAndAllowlist,
  getNormalizedOperations,
  HTTP_WITH_BODY,
  METHOD_NAME_BY_OP,
} from "@lomi./sdk-scripts/public-sdk-operations";
import { isJsonObject, isString, parseJson } from "@lomi./shared";

const CURRENCY_NOTES: { [name: string]: string } = {
  lomi_balance:
    "Each balance row is one currency. Do not add XOF and EUR balances into one total.",
  lomi_payouts:
    "Payout amounts stay in their own currency. Do not add them across currency_code.",
  lomi_refunds:
    "Refund amounts stay in their own currency. Do not add them across currency_code.",
  lomi_settlements:
    "Settlement totals stay in their own currency. Do not add settlements across currencies.",
  lomi_finance:
    "Totals other than cash_position are already in XOF. cash_position stays per currency. Do not add those rows together.",
};

const __dirname = dirname(fileURLToPath(import.meta.url));
const mcpRoot = join(__dirname, "../..");
const openapiPath = join(mcpRoot, "../docs/openapi.json");
const allowlistPath = join(
  mcpRoot,
  "../docs/lib/scripts/manual-api/_expected-public-operations.json",
);
const policyPath = join(mcpRoot, "config/mcp-tool-policy.json");
const copyOverridesPath = join(mcpRoot, "config/mcp-tool-copy.en.json");
const outDir = join(mcpRoot, "src/generated");
const outFile = join(outDir, "tools-manifest.json");

const WRITE_METHODS = new Set(["post", "patch", "put", "delete"]);

type CopyOverrideMap = { [operationKey: string]: EnglishCopyOverride };

function assertUniqueToolNames(names: string[]): void {
  const seen = new Set<string>();
  for (const n of names) {
    if (seen.has(n)) throw new Error(`Duplicate MCP tool name: ${n}`);
    seen.add(n);
  }
}

function loadCopyOverrides(): CopyOverrideMap {
  const parsed = parseJson(readFileSync(copyOverridesPath, "utf-8"));
  if (!isJsonObject(parsed)) {
    throw new Error("mcp-tool-copy.en.json must be a JSON object");
  }
  // SAFETY: Curated copy file maps operation keys to EnglishCopyOverride objects.
  return parsed as CopyOverrideMap;
}

function main(): void {
  const { spec, allowed } = readSpecAndAllowlist(openapiPath, allowlistPath);
  // SAFETY: openapi.json is the OpenAPI document shape OpenAPISpec expects.
  const apiSpec = spec as OpenAPISpec;
  const { operations } = getNormalizedOperations(spec, allowed);
  const policyParsed = parseJson(readFileSync(policyPath, "utf-8"));
  if (!isJsonObject(policyParsed)) {
    throw new Error("mcp-tool-policy.json must be a JSON object");
  }
  const alwaysLoadKeys = loadAlwaysLoadKeys({
    alwaysLoadOperationKeys: Array.isArray(
      policyParsed["alwaysLoadOperationKeys"],
    )
      ? policyParsed["alwaysLoadOperationKeys"].filter(isString)
      : [],
  });
  const excludedKeys = loadExcludedOperationKeys({
    mcpExcludedOperationKeys: Array.isArray(
      policyParsed["mcpExcludedOperationKeys"],
    )
      ? policyParsed["mcpExcludedOperationKeys"].filter(isString)
      : [],
  });
  const groups = loadMerchantGroups(policyParsed);
  const copyOverrides = loadCopyOverrides();

  const allowedKeys = new Set(
    operations.map((op: { operationKey: string }) => op.operationKey),
  );
  for (const key of excludedKeys) {
    if (!allowedKeys.has(key)) {
      throw new Error(
        `mcpExcludedOperationKeys references "${key}" which is not in the allowlist. Remove the stale exclusion from mcp-tool-policy.json.`,
      );
    }
  }

  const includedOperations = operations.filter(
    (op: { operationKey: string }) => !excludedKeys.has(op.operationKey),
  );
  const includedByKey = new Map(
    includedOperations.map((op: (typeof includedOperations)[number]) => [
      op.operationKey,
      op,
    ]),
  );

  const includedKeys = new Set(
    includedOperations.map((op: { operationKey: string }) => op.operationKey),
  );
  for (const key of Object.keys(copyOverrides)) {
    if (!includedKeys.has(key)) {
      throw new Error(
        `mcp-tool-copy.en.json has copy for "${key}" which is not a generated MCP tool (excluded or unknown). Fix the key or remove the entry.`,
      );
    }
  }

  assertGroupsCoverOperations(groups, includedKeys, "merchant");

  const tools: ManifestTool[] = groups.map((group) => {
    const actionEntries = Object.entries(group.actions);
    const builtActions: Array<{
      name: string;
      action: ManifestAction;
      inputSchema: ReturnType<typeof buildInputJsonSchema>;
    }> = [];

    for (const [actionName, operationKey] of actionEntries) {
      const op = includedByKey.get(operationKey);
      if (!op) {
        throw new Error(
          `Group ${group.name}.${actionName} missing operation ${operationKey}`,
        );
      }
      const tags = op.openApiOp.tags ?? [];
      const write = WRITE_METHODS.has(op.httpMethodLower);
      const wantsBody =
        HTTP_WITH_BODY.has(op.httpMethodLower) &&
        Boolean(op.openApiOp.requestBody);

      const inputSchema = buildInputJsonSchema({
        spec: apiSpec,
        operation: op.openApiOp,
        pathItem: op.pathItem,
        pathTemplate: op.pathTemplate,
        httpMethodLower: op.httpMethodLower,
        includeIdempotencyKey: write,
      });

      const { title, description } = resolveEnglishCopy({
        operationKey: op.operationKey,
        httpMethodLower: op.httpMethodLower,
        tags,
        methodNameByOp: METHOD_NAME_BY_OP,
        override: copyOverrides[op.operationKey],
        openApiSummary: op.summary,
        openApiDescription: isString(op.openApiOp.description)
          ? op.openApiOp.description
          : undefined,
      });

      builtActions.push({
        name: actionName,
        inputSchema,
        action: {
          operationKey: op.operationKey,
          method: op.httpMethodLower,
          pathTemplate: op.pathTemplate,
          pathParamNames: op.pathParamNames,
          queryParamNames: op.queryParams.map((q: { name: string }) => q.name),
          operationId: op.operationId,
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
    const description = [
      buildGroupDescription({
        title,
        actions: builtActions.map((built) => ({
          name: built.name,
          title: built.action.title,
          operationKey: built.action.operationKey,
          required: built.action.requiredInput.filter(
            (field) => field !== "idempotency_key",
          ),
        })),
      }),
      CURRENCY_NOTES[group.name],
    ]
      .filter(Boolean)
      .join("\n\n");

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
    const alwaysLoad = builtActions.some((built) =>
      alwaysLoadKeys.has(built.action.operationKey),
    );

    const hintTokens = new Set<string>();
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

    const inputSchema = mergeGroupInputSchema(
      builtActions.map((built) => built.name),
      builtActions.map((built) => built.inputSchema),
    );

    return {
      name: group.name,
      title,
      description,
      tags: allTags,
      write,
      inputSchema,
      readOnly,
      destructive,
      alwaysLoad,
      searchHint: [...hintTokens].sort().join(" "),
      actions,
    };
  });

  for (const t of tools) {
    validateManifestToolEntry(t);
  }

  tools.sort((a, b) => a.name.localeCompare(b.name));
  assertUniqueToolNames(tools.map((t) => t.name));

  const manifest = {
    manifestVersion: 1 as const,
    apiVersion: apiSpec.info?.version ?? "unknown",
    apiTitle: apiSpec.info?.title ?? "lomi. API",
    toolCount: tools.length,
    tools,
  };

  mkdirSync(outDir, { recursive: true });
  writeFileSync(outFile, `${JSON.stringify(manifest, null, 2)}\n`, "utf-8");
  console.log(`Wrote ${outFile} (${tools.length} tools)`);
}

main();
