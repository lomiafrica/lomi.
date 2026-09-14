/**
 * MCP tool metadata policy (readOnly, destructive, search hints, alwaysLoad).
 * Used at generation time and for lomi_search_tools scoring.
 */

export type ToolPolicyInput = {
  name: string;
  method: string;
  operationKey: string;
  pathTemplate: string;
  tags: string[];
};

export type ToolPolicyFlags = {
  readOnly: boolean;
  destructive: boolean;
  alwaysLoad: boolean;
  searchHint: string;
};

/** GET/HEAD operations are read-only for MCP clients. */
export function isReadOnlyMethod(method: string): boolean {
  const m = method.toLowerCase();
  return m === "get" || m === "head";
}

/** DELETE and cancel/revoke mutations are destructive. */
export function isDestructiveOperation(
  method: string,
  operationKey: string,
): boolean {
  const m = method.toLowerCase();
  if (m === "delete") return true;
  const key = operationKey.toLowerCase();
  return key.includes("cancel") || key.includes("revoke");
}

/** Space-separated lowercase tokens for deferred tool discovery (Composer/Cursor). */
export function buildSearchHint(input: ToolPolicyInput): string {
  const tokens = new Set<string>();
  for (const tag of input.tags) {
    for (const word of tag.toLowerCase().split(/[\s/._-]+/)) {
      if (word.length > 1) tokens.add(word);
    }
  }
  tokens.add(input.method.toLowerCase());
  for (const segment of input.pathTemplate.replace(/^\//, "").split("/")) {
    if (segment.startsWith("{")) continue;
    for (const word of segment.split("-")) {
      if (word.length > 1) tokens.add(word.toLowerCase());
    }
  }
  const nameTail = input.name.replace(/^lomi_/, "");
  for (const word of nameTail.split("_")) {
    if (word.length > 1) tokens.add(word);
  }
  return [...tokens].sort().join(" ");
}

export function resolveToolPolicy(
  input: ToolPolicyInput,
  alwaysLoadOperationKeys: ReadonlySet<string>,
): ToolPolicyFlags {
  return {
    readOnly: isReadOnlyMethod(input.method),
    destructive: isDestructiveOperation(input.method, input.operationKey),
    alwaysLoad: alwaysLoadOperationKeys.has(input.operationKey),
    searchHint: buildSearchHint(input),
  };
}

export function loadAlwaysLoadKeys(policyJson: {
  alwaysLoadOperationKeys?: string[];
}): Set<string> {
  return new Set(policyJson.alwaysLoadOperationKeys ?? []);
}

/**
 * Operation keys deliberately kept out of the MCP surface even though they
 * remain in the shared SDK allowlist. Used to drop operations that make no
 * sense for an autonomous agent (e.g. direct charges that require client-side
 * PCI card collection or push an interactive payment prompt to an end user).
 * Agents should request money via checkout-sessions / payment-links instead.
 */
export function loadExcludedOperationKeys(policyJson: {
  mcpExcludedOperationKeys?: string[];
}): Set<string> {
  return new Set(policyJson.mcpExcludedOperationKeys ?? []);
}
