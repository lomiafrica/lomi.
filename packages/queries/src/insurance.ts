import {
  isJsonArray,
  isJsonObject,
  isString,
  readNumber,
  readString,
  type JsonObject,
  type JsonValue,
} from "@lomi./shared";
import type { TypedSupabaseClient } from "./types.js";
import { handleUntypedRpc } from "./untyped-rpc.js";

export type InsuranceProductRow = {
  product_id: string;
  kind: string;
  name: string;
  description: string | null;
  country_codes: string[];
  coverage_min: number;
  coverage_max: number;
  carrier_name: string | null;
};

export type InsuranceQuoteRequestRow = {
  quote_request_id: string;
  product_id: string;
  product_name: string;
  kind: string;
  requested_coverage: number;
  currency_code: string;
  status: string;
  quoted_premium: number | null;
  notes: string | null;
  created_at: string;
};

export type InsurancePolicyRow = {
  policy_id: string;
  product_name: string;
  kind: string;
  status: string;
  coverage_amount: number;
  currency_code: string;
  starts_at: string | null;
  ends_at: string | null;
};

function parseStringArray(value: JsonValue | undefined): string[] {
  if (!isJsonArray(value)) return [];
  return value.filter((item): item is string => isString(item));
}

function parseInsuranceProductRow(value: JsonValue): InsuranceProductRow | null {
  if (!isJsonObject(value)) return null;
  const product_id = readString(value, "product_id");
  const kind = readString(value, "kind");
  const name = readString(value, "name");
  const coverage_min = readNumber(value, "coverage_min");
  const coverage_max = readNumber(value, "coverage_max");
  if (
    !product_id ||
    !kind ||
    !name ||
    coverage_min === undefined ||
    coverage_max === undefined
  ) {
    return null;
  }
  return {
    product_id,
    kind,
    name,
    description: readString(value, "description") ?? null,
    country_codes: parseStringArray(value["country_codes"]),
    coverage_min,
    coverage_max,
    carrier_name: readString(value, "carrier_name") ?? null,
  };
}

function parseInsuranceQuoteRequestRow(
  value: JsonValue,
): InsuranceQuoteRequestRow | null {
  if (!isJsonObject(value)) return null;
  const quote_request_id = readString(value, "quote_request_id");
  const product_id = readString(value, "product_id");
  const product_name = readString(value, "product_name");
  const kind = readString(value, "kind");
  const requested_coverage = readNumber(value, "requested_coverage");
  const currency_code = readString(value, "currency_code");
  const status = readString(value, "status");
  const created_at = readString(value, "created_at");
  if (
    !quote_request_id ||
    !product_id ||
    !product_name ||
    !kind ||
    requested_coverage === undefined ||
    !currency_code ||
    !status ||
    !created_at
  ) {
    return null;
  }
  return {
    quote_request_id,
    product_id,
    product_name,
    kind,
    requested_coverage,
    currency_code,
    status,
    quoted_premium: readNumber(value, "quoted_premium") ?? null,
    notes: readString(value, "notes") ?? null,
    created_at,
  };
}

function parseInsurancePolicyRow(value: JsonValue): InsurancePolicyRow | null {
  if (!isJsonObject(value)) return null;
  const policy_id = readString(value, "policy_id");
  const product_name = readString(value, "product_name");
  const kind = readString(value, "kind");
  const status = readString(value, "status");
  const coverage_amount = readNumber(value, "coverage_amount");
  const currency_code = readString(value, "currency_code");
  if (
    !policy_id ||
    !product_name ||
    !kind ||
    !status ||
    coverage_amount === undefined ||
    !currency_code
  ) {
    return null;
  }
  return {
    policy_id,
    product_name,
    kind,
    status,
    coverage_amount,
    currency_code,
    starts_at: readString(value, "starts_at") ?? null,
    ends_at: readString(value, "ends_at") ?? null,
  };
}

function parseRowArray<T>(
  data: JsonValue | null | boolean,
  parse: (value: JsonValue) => T | null,
): T[] {
  if (!isJsonArray(data)) return [];
  return data.flatMap((row) => {
    const parsed = parse(row);
    return parsed ? [parsed] : [];
  });
}

export async function fetchInsuranceProducts(
  client: TypedSupabaseClient,
  args: { p_organization_id?: string | null },
): Promise<InsuranceProductRow[]> {
  const payload: JsonObject = {};
  if (args.p_organization_id !== undefined) {
    payload["p_organization_id"] = args.p_organization_id;
  }
  const data = await handleUntypedRpc(
    client,
    "fetch_insurance_products",
    payload,
    { fallbackValue: [] },
  );
  return parseRowArray(data, parseInsuranceProductRow);
}

export async function createInsuranceQuoteRequest(
  client: TypedSupabaseClient,
  args: {
    p_organization_id: string;
    p_product_id: string;
    p_requested_coverage: number;
    p_currency_code?: string;
    p_notes?: string | null;
    p_merchant_id?: string | null;
  },
): Promise<string> {
  const payload: JsonObject = {
    p_organization_id: args.p_organization_id,
    p_product_id: args.p_product_id,
    p_requested_coverage: args.p_requested_coverage,
  };
  if (args.p_currency_code !== undefined) {
    payload["p_currency_code"] = args.p_currency_code;
  }
  if (args.p_notes !== undefined) payload["p_notes"] = args.p_notes;
  if (args.p_merchant_id !== undefined) {
    payload["p_merchant_id"] = args.p_merchant_id;
  }
  const data = await handleUntypedRpc(
    client,
    "create_insurance_quote_request",
    payload,
  );
  if (!isString(data) || !data) {
    throw new Error("create_insurance_quote_request returned no id");
  }
  return data;
}

export async function fetchInsuranceQuoteRequests(
  client: TypedSupabaseClient,
  args: { p_organization_id: string },
): Promise<InsuranceQuoteRequestRow[]> {
  const data = await handleUntypedRpc(
    client,
    "fetch_insurance_quote_requests",
    args,
    { fallbackValue: [] },
  );
  return parseRowArray(data, parseInsuranceQuoteRequestRow);
}

export async function fetchInsurancePolicies(
  client: TypedSupabaseClient,
  args: { p_organization_id: string },
): Promise<InsurancePolicyRow[]> {
  const data = await handleUntypedRpc(
    client,
    "fetch_insurance_policies",
    args,
    { fallbackValue: [] },
  );
  return parseRowArray(data, parseInsurancePolicyRow);
}
