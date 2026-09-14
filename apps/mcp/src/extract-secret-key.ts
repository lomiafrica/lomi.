import { isJsonObject, isString, type JsonValue } from "@lomi./shared";

/**
 * Extracts a merchant secret key (`lomi_sk_*`) from a provisioning tool
 * response so it can be promoted into the current MCP session.
 *
 * Prefers test secret keys (`lomi_sk_test_*`) because agent-driven onboarding
 * targets TEST mode first. Live secret keys are masked by the API and never
 * returned in full, so they cannot be promoted automatically.
 */
function isTestSecretKey(value: string): boolean {
  return value.startsWith("lomi_sk_test_");
}

function isSecretKey(value: string): boolean {
  return value.startsWith("lomi_sk_") && !value.includes("••");
}

function collectSecretKeys(value: JsonValue, found: string[]): void {
  if (isString(value)) {
    if (isSecretKey(value)) found.push(value);
    return;
  }
  if (Array.isArray(value)) {
    for (const item of value) collectSecretKeys(item, found);
    return;
  }
  if (isJsonObject(value)) {
    for (const child of Object.values(value)) {
      collectSecretKeys(child, found);
    }
  }
}

/** Returns a usable (unmasked) merchant secret key from a JSON body, if present. */
export function extractMerchantSecretKey(bodyText: string): string | null {
  let parsed: JsonValue;
  try {
    parsed = JSON.parse(bodyText);
  } catch {
    return null;
  }

  const found: string[] = [];
  collectSecretKeys(parsed, found);
  if (found.length === 0) return null;

  const testKey = found.find(isTestSecretKey);
  return testKey ?? found[0];
}
