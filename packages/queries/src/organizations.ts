import {
  displayPublicId,
  handleSupabaseRpc,
  isJsonArray,
  isJsonObject,
  readBoolean,
  readString,
  validateJsonValue,
  type JsonObject,
  type JsonValue,
} from "@lomi./shared";
import { rpc } from "./rpc.js";
import type {
  CurrencyCode,
  OrganizationVerificationStatus,
  TypedSupabaseClient,
} from "./types.js";

export type MerchantOrganization = {
  organization_id: string;
  organization_name: string;
  organization_logo_url: string | null;
  merchant_role: string;
  allow_staff_impersonation?: boolean;
  is_current?: boolean;
  public_id?: string | null;
};

export type OrganizationDetails = {
  organization_id: string;
  name: string;
  email: string;
  logo_url: string | null;
  website_url: string | null;
  phone_number?: string | null;
  is_starter_business?: boolean;
  verification_status: OrganizationVerificationStatus;
  default_currency: CurrencyCode;
  country: string | null;
  region: string | null;
  city: string | null;
  district: string | null;
  street: string | null;
  postal_code: string | null;
  storefront_enabled: boolean;
  slug?: string | null;
  has_payout_pin?: boolean;
  public_id?: string | null;
};

function parseMerchantOrganizationRow(
  object: JsonObject,
): MerchantOrganization | null {
  const organizationId = readString(object, "organization_id");
  const organizationName = readString(object, "organization_name");
  const merchantRole = readString(object, "merchant_role");
  if (!organizationId || !organizationName || !merchantRole) return null;

  const organization: MerchantOrganization = {
    organization_id: organizationId,
    organization_name: organizationName,
    organization_logo_url: readString(object, "organization_logo_url") ?? null,
    merchant_role: merchantRole,
    public_id: displayPublicId(readString(object, "public_id")),
  };

  const allowStaffImpersonation = readBoolean(
    object,
    "allow_staff_impersonation",
  );
  if (allowStaffImpersonation !== undefined) {
    organization.allow_staff_impersonation = allowStaffImpersonation;
  }

  const isCurrent = readBoolean(object, "is_current");
  if (isCurrent !== undefined) {
    organization.is_current = isCurrent;
  }

  return organization;
}

export function parseMerchantOrganizations(
  data: JsonValue,
): MerchantOrganization[] {
  if (!isJsonArray(data)) return [];
  return data
    .filter(isJsonObject)
    .map(parseMerchantOrganizationRow)
    .filter((row): row is MerchantOrganization => row !== null);
}

function isVerificationStatus(
  value: string,
): value is OrganizationVerificationStatus {
  return value === "unverified" || value === "starter" || value === "verified";
}

function isCurrencyCode(value: string): value is CurrencyCode {
  return (
    value === "XOF" ||
    value === "USD" ||
    value === "EUR" ||
    value === "GHS" ||
    value === "NGN" ||
    value === "KES" ||
    value === "MRO"
  );
}

function parseOrganizationDetailsRow(
  value: JsonValue,
): OrganizationDetails | null {
  if (!isJsonObject(value)) return null;

  const organizationId = readString(value, "organization_id");
  const name = readString(value, "name");
  const email = readString(value, "email");
  const verificationStatus = readString(value, "verification_status");
  const defaultCurrency = readString(value, "default_currency");
  const storefrontEnabled = readBoolean(value, "storefront_enabled");

  if (
    !organizationId ||
    !name ||
    !email ||
    !verificationStatus ||
    !isVerificationStatus(verificationStatus) ||
    !defaultCurrency ||
    !isCurrencyCode(defaultCurrency) ||
    storefrontEnabled === undefined
  ) {
    return null;
  }

  const details: OrganizationDetails = {
    organization_id: organizationId,
    name,
    email,
    logo_url: readString(value, "logo_url") ?? null,
    website_url: readString(value, "website_url") ?? null,
    phone_number: readString(value, "phone_number") ?? null,
    is_starter_business: readBoolean(value, "is_starter_business") === true,
    verification_status: verificationStatus,
    default_currency: defaultCurrency,
    country: readString(value, "country") ?? null,
    region: readString(value, "region") ?? null,
    city: readString(value, "city") ?? null,
    district: readString(value, "district") ?? null,
    street: readString(value, "street") ?? null,
    postal_code: readString(value, "postal_code") ?? null,
    storefront_enabled: storefrontEnabled,
    slug: readString(value, "slug") ?? null,
    public_id: displayPublicId(readString(value, "public_id")),
  };

  const hasPayoutPin = readBoolean(value, "has_payout_pin");
  if (hasPayoutPin !== undefined) {
    details.has_payout_pin = hasPayoutPin;
  }

  return details;
}

export function parseOrganizationDetails(
  data: JsonValue,
): OrganizationDetails | null {
  const rows = isJsonArray(data) ? data : [data];
  for (const row of rows) {
    const parsed = parseOrganizationDetailsRow(row);
    if (parsed) return parsed;
  }
  return null;
}

export async function fetchMerchantOrganizations(
  client: TypedSupabaseClient,
  merchantId: string,
): Promise<MerchantOrganization[]> {
  const data = await handleSupabaseRpc(
    rpc(client, "fetch_merchant_organizations", {
      p_merchant_id: merchantId,
    }),
    "fetch_merchant_organizations",
  );
  return parseMerchantOrganizations(validateJsonValue(data));
}

export async function fetchOrganizationDetails(
  client: TypedSupabaseClient,
  merchantId: string,
  organizationId?: string,
): Promise<OrganizationDetails | null> {
  const data = await handleSupabaseRpc(
    rpc(client, "fetch_organization_details", {
      p_merchant_id: merchantId,
      p_organization_id: organizationId,
    }),
    "fetch_organization_details",
  );
  return parseOrganizationDetails(validateJsonValue(data));
}

export * from "./organizations-ops.js";
