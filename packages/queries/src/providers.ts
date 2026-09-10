import {
  handleSupabaseRpc,
  isJsonArray,
  isJsonObject,
  readBoolean,
  readString,
  validateJsonValue,
  type JsonObject,
  type JsonValue,
} from "@lomi./shared";
import type { Database } from "@lomi./shared/database";
import { rpc } from "./rpc.js";
import type { OnboardingStatus, ProviderCode, TypedSupabaseClient } from "./types.js";

export type OrganizationProviderRow = {
  provider_code: ProviderCode;
  is_connected: boolean;
  provider_merchant_id: string | null;
  onboarding_status: OnboardingStatus;
  phone_number: string | null;
  is_phone_verified: boolean;
};

const PROVIDER_CODE_SET = new Set<string>([
  "WAVE",
  "JUMBO",
  "MTN",
  "STRIPE",
  "SPI",
  "CYBERSOURCE",
  "FREE",
  "GIM",
]);

function isProviderCode(value: string): value is ProviderCode {
  return PROVIDER_CODE_SET.has(value);
}

function isOnboardingStatus(value: string): value is OnboardingStatus {
  return (
    value === "pending" ||
    value === "completed" ||
    value === "skipped" ||
    value === "failed" ||
    value === "in_progress"
  );
}

function parseOnboardingStatus(
  value: string | undefined,
  isConnected: boolean,
): OnboardingStatus {
  if (value && isOnboardingStatus(value)) return value;
  return isConnected ? "completed" : "pending";
}

function parseOrganizationProviderRow(
  object: JsonObject,
): OrganizationProviderRow | null {
  const providerCode = readString(object, "provider_code");
  const isConnected = readBoolean(object, "is_connected");
  if (
    !providerCode ||
    !isProviderCode(providerCode) ||
    isConnected === undefined
  ) {
    return null;
  }

  return {
    provider_code: providerCode,
    is_connected: isConnected,
    provider_merchant_id: readString(object, "provider_merchant_id") ?? null,
    onboarding_status: parseOnboardingStatus(
      readString(object, "onboarding_status"),
      isConnected,
    ),
    phone_number: readString(object, "phone_number") ?? null,
    is_phone_verified: readBoolean(object, "is_phone_verified") ?? false,
  };
}

export function parseOrganizationProviderRows(
  data: JsonValue,
): OrganizationProviderRow[] {
  if (!isJsonArray(data)) return [];
  return data
    .filter(isJsonObject)
    .map(parseOrganizationProviderRow)
    .filter((row): row is OrganizationProviderRow => row !== null);
}

export async function fetchOrganizationProvidersSettings(
  client: TypedSupabaseClient,
  organizationId: string,
  providerCode?: ProviderCode,
): Promise<OrganizationProviderRow[]> {
  const args: Database["public"]["Functions"]["fetch_organization_providers_settings"]["Args"] =
    {
      p_organization_id: organizationId,
    };
  if (providerCode !== undefined) {
    args.p_provider_code = providerCode;
  }

  const data = await handleSupabaseRpc(
    rpc(client, "fetch_organization_providers_settings", args),
    "fetch_organization_providers_settings",
  );
  return parseOrganizationProviderRows(validateJsonValue(data));
}

export * from "./providers-ops.js";
