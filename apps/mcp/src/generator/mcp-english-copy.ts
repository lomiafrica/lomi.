/**
 * English MCP tool titles/descriptions when OpenAPI copy is missing or non-English.
 */

/** @param {Record<string, string>} methodNameByOp */
export function humanizePathSegment(segment: string): string {
  return segment
    .split("-")
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" ");
}

/** Primary resource label from path template (first non-param segment). */
export function resourceLabelFromPath(pathTemplate: string): string {
  for (const part of pathTemplate.split("/").filter(Boolean)) {
    if (!part.startsWith("{")) {
      return humanizePathSegment(part);
    }
  }
  return "Resource";
}

interface MethodVerbMap {
  [method: string]: string;
}

const METHOD_VERB = {
  get: "Get",
  post: "Create",
  patch: "Update",
  put: "Update",
  delete: "Delete",
} as const satisfies MethodVerbMap;

function isMethodVerb(method: string): method is keyof typeof METHOD_VERB {
  return Object.hasOwn(METHOD_VERB, method);
}

export interface MethodNameByOperation {
  [operationKey: string]: string;
}

export interface EnglishCopy {
  title: string;
  description: string;
}

/**
 * Build English title from operationKey + SDK method name + tags.
 */
export function buildEnglishTitle(
  operationKey: string,
  httpMethodLower: string,
  methodNameByOp: MethodNameByOperation,
  tags: string[],
): string {
  const sdkMethod = methodNameByOp[operationKey];
  const resource =
    tags[0]?.trim() || resourceLabelFromPath(operationKey.split(" ")[1] ?? "");

  if (sdkMethod === "list") return `List ${resource}`;
  if (sdkMethod === "get" || sdkMethod?.startsWith("get"))
    return `Get ${resource}`;
  if (sdkMethod === "create" || httpMethodLower === "post")
    return `Create ${resource}`;
  if (sdkMethod === "update" || httpMethodLower === "patch")
    return `Update ${resource}`;
  if (sdkMethod === "delete" || httpMethodLower === "delete")
    return `Delete ${resource}`;
  if (sdkMethod?.includes("cancel")) return `Cancel ${resource}`;
  if (sdkMethod?.includes("test")) return `Test ${resource}`;

  const verb = isMethodVerb(httpMethodLower)
    ? METHOD_VERB[httpMethodLower]
    : httpMethodLower.toUpperCase();
  return `${verb} ${resource}`;
}

export function buildEnglishDescription(
  operationKey: string,
  title: string,
): string {
  return `${title} via the lomi. merchant REST API.\n\nREST: ${operationKey}`;
}

export type EnglishCopyOverride = {
  title?: string;
  description?: string;
};

/** English description for OpenAPI parameter / schema fields shown to LLM clients. */
export function resolveEnglishSchemaDescription(
  fieldName: string,
  openApiDescription?: string,
): string {
  const trimmed = openApiDescription?.trim();
  if (trimmed && !/[àâäéèêëïîôùûüçœæ]/i.test(trimmed)) {
    return trimmed;
  }
  const label = humanizePathSegment(fieldName.replace(/_/g, "-"));
  return trimmed ? `${label} (see lomi. API docs)` : label;
}

export function resolveEnglishCopy(args: {
  operationKey: string;
  httpMethodLower: string;
  tags: string[];
  methodNameByOp: MethodNameByOperation;
  override?: EnglishCopyOverride;
  openApiSummary?: string;
  openApiDescription?: string;
}): EnglishCopy {
  const {
    operationKey,
    httpMethodLower,
    tags,
    methodNameByOp,
    override,
    openApiSummary,
    openApiDescription,
  } = args;

  if (override?.title && override?.description) {
    return { title: override.title, description: override.description };
  }

  const generatedTitle = buildEnglishTitle(
    operationKey,
    httpMethodLower,
    methodNameByOp,
    tags,
  );
  const title = override?.title ?? generatedTitle;

  if (override?.description) {
    return { title, description: override.description };
  }

  const openApiParts = [
    openApiSummary?.trim(),
    openApiDescription?.trim(),
  ].filter(Boolean);
  const openApiText = openApiParts.join(" ");
  const looksEnglish =
    openApiParts.length > 0 &&
    !/[àâäéèêëïîôùûüçœæ]/i.test(openApiText) &&
    /\b(get|list|create|delete|update|retrieve|remove|fetch|search|cancel|test|send|add|patch)\b/i.test(
      openApiText,
    );

  if (looksEnglish) {
    const descriptionParts = [...openApiParts, `REST: ${operationKey}`].filter(
      Boolean,
    );
    return { title, description: descriptionParts.join("\n\n") };
  }

  return {
    title,
    description: buildEnglishDescription(operationKey, title),
  };
}
