import {
  isJsonArray,
  isJsonObject,
  isNumber,
  isString,
  readBoolean,
  readNumber,
  readString,
  type JsonObject,
  type JsonValue,
} from "@lomi./shared";
import type { TypedSupabaseClient } from "./types.js";
import { handleUntypedRpc } from "./untyped-rpc.js";

export type NitroSettingsRow = {
  currency_code: string;
  is_enabled: boolean;
  advance_enabled: boolean;
  advance_limit_amount: number;
  max_advance_hours: number;
  fee_bps: number | null;
  min_fee_amount: number;
  risk_tier: string;
  outstanding_exposure: number;
  held_balance: number;
};

export type NitroQuoteRow = {
  eligible_amount: number;
  fee_amount: number;
  net_amount: number;
  available_after: number;
  reason_ineligible: string | null;
};

export type NitroRequestRow = {
  nitro_request_id: string;
  mode: "rail" | "advance";
  status: string;
  currency_code: string;
  requested_amount: number;
  fee_amount: number;
  net_amount: number;
  payout_id: string | null;
  created_at: string;
};

function parseNitroSettingsRow(value: JsonValue): NitroSettingsRow | null {
  if (!isJsonObject(value)) return null;
  const currency_code = readString(value, "currency_code");
  const risk_tier = readString(value, "risk_tier");
  const is_enabled = readBoolean(value, "is_enabled");
  const advance_enabled = readBoolean(value, "advance_enabled");
  const advance_limit_amount = readNumber(value, "advance_limit_amount");
  const max_advance_hours = readNumber(value, "max_advance_hours");
  const min_fee_amount = readNumber(value, "min_fee_amount");
  const outstanding_exposure = readNumber(value, "outstanding_exposure");
  const held_balance = readNumber(value, "held_balance");
  if (
    !currency_code ||
    !risk_tier ||
    is_enabled === undefined ||
    advance_enabled === undefined ||
    advance_limit_amount === undefined ||
    max_advance_hours === undefined ||
    min_fee_amount === undefined ||
    outstanding_exposure === undefined ||
    held_balance === undefined
  ) {
    return null;
  }
  return {
    currency_code,
    is_enabled,
    advance_enabled,
    advance_limit_amount,
    max_advance_hours,
    fee_bps: readNumber(value, "fee_bps") ?? null,
    min_fee_amount,
    risk_tier,
    outstanding_exposure,
    held_balance,
  };
}

function parseNitroQuoteRow(value: JsonValue): NitroQuoteRow | null {
  if (!isJsonObject(value)) return null;
  const eligible_amount = readNumber(value, "eligible_amount");
  const fee_amount = readNumber(value, "fee_amount");
  const net_amount = readNumber(value, "net_amount");
  const available_after = readNumber(value, "available_after");
  if (
    eligible_amount === undefined ||
    fee_amount === undefined ||
    net_amount === undefined ||
    available_after === undefined
  ) {
    return null;
  }
  return {
    eligible_amount,
    fee_amount,
    net_amount,
    available_after,
    reason_ineligible: readString(value, "reason_ineligible") ?? null,
  };
}

function isNitroMode(value: string): value is "rail" | "advance" {
  return value === "rail" || value === "advance";
}

function parseNitroRequestRow(value: JsonValue): NitroRequestRow | null {
  if (!isJsonObject(value)) return null;
  const nitro_request_id = readString(value, "nitro_request_id");
  const mode = readString(value, "mode");
  const status = readString(value, "status");
  const currency_code = readString(value, "currency_code");
  const requested_amount = readNumber(value, "requested_amount");
  const fee_amount = readNumber(value, "fee_amount");
  const net_amount = readNumber(value, "net_amount");
  const created_at = readString(value, "created_at");
  if (
    !nitro_request_id ||
    !mode ||
    !isNitroMode(mode) ||
    !status ||
    !currency_code ||
    requested_amount === undefined ||
    fee_amount === undefined ||
    net_amount === undefined ||
    !created_at
  ) {
    return null;
  }
  return {
    nitro_request_id,
    mode,
    status,
    currency_code,
    requested_amount,
    fee_amount,
    net_amount,
    payout_id: readString(value, "payout_id") ?? null,
    created_at,
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

async function requireRpcId(
  client: TypedSupabaseClient,
  fn: string,
  args: JsonObject,
): Promise<string> {
  const data = await handleUntypedRpc(client, fn, args);
  if (!isString(data) || !data) {
    throw new Error(`${fn} returned no id`);
  }
  return data;
}

export async function fetchNitroSettings(
  client: TypedSupabaseClient,
  args: { p_organization_id: string },
): Promise<NitroSettingsRow[]> {
  const data = await handleUntypedRpc(
    client,
    "fetch_nitro_settings",
    args,
    { fallbackValue: [] },
  );
  return parseRowArray(data, parseNitroSettingsRow);
}

export async function quoteNitroSettlement(
  client: TypedSupabaseClient,
  args: {
    p_organization_id: string;
    p_currency_code: string;
    p_mode: "rail" | "advance";
    p_amount: number;
  },
): Promise<NitroQuoteRow[]> {
  const data = await handleUntypedRpc(
    client,
    "quote_nitro_settlement",
    args,
    { fallbackValue: [] },
  );
  return parseRowArray(data, parseNitroQuoteRow);
}

export async function createNitroAdvance(
  client: TypedSupabaseClient,
  args: {
    p_organization_id: string;
    p_currency_code: string;
    p_amount: number;
    p_idempotency_key?: string | null;
    p_merchant_id?: string | null;
  },
): Promise<string> {
  const payload: JsonObject = {
    p_organization_id: args.p_organization_id,
    p_currency_code: args.p_currency_code,
    p_amount: args.p_amount,
  };
  if (args.p_idempotency_key !== undefined) {
    payload["p_idempotency_key"] = args.p_idempotency_key;
  }
  if (args.p_merchant_id !== undefined) {
    payload["p_merchant_id"] = args.p_merchant_id;
  }
  return requireRpcId(client, "create_nitro_advance", payload);
}

export async function recordNitroRail(
  client: TypedSupabaseClient,
  args: {
    p_organization_id: string;
    p_currency_code: string;
    p_amount: number;
    p_payout_id?: string | null;
    p_idempotency_key?: string | null;
    p_merchant_id?: string | null;
  },
): Promise<string> {
  const payload: JsonObject = {
    p_organization_id: args.p_organization_id,
    p_currency_code: args.p_currency_code,
    p_amount: args.p_amount,
  };
  if (args.p_payout_id !== undefined) {
    payload["p_payout_id"] = args.p_payout_id;
  }
  if (args.p_idempotency_key !== undefined) {
    payload["p_idempotency_key"] = args.p_idempotency_key;
  }
  if (args.p_merchant_id !== undefined) {
    payload["p_merchant_id"] = args.p_merchant_id;
  }
  return requireRpcId(client, "record_nitro_rail", payload);
}

export async function fetchNitroRequests(
  client: TypedSupabaseClient,
  args: {
    p_organization_id: string;
    p_page?: number;
    p_page_size?: number;
  },
): Promise<NitroRequestRow[]> {
  const payload: JsonObject = {
    p_organization_id: args.p_organization_id,
  };
  if (args.p_page !== undefined) payload["p_page"] = args.p_page;
  if (args.p_page_size !== undefined) payload["p_page_size"] = args.p_page_size;
  const data = await handleUntypedRpc(
    client,
    "fetch_nitro_requests",
    payload,
    { fallbackValue: [] },
  );
  return parseRowArray(data, parseNitroRequestRow);
}

export async function getNitroRequest(
  client: TypedSupabaseClient,
  args: { p_organization_id: string; p_nitro_request_id: string },
): Promise<JsonValue | null> {
  const data = await handleUntypedRpc(
    client,
    "get_nitro_request",
    args,
    { fallbackValue: null },
  );
  return data === false ? null : data;
}

export async function adminSetNitroSettings(
  client: TypedSupabaseClient,
  args: JsonObject,
): Promise<void> {
  await handleUntypedRpc(client, "admin_set_nitro_settings", args, {
    expectReturnValue: false,
  });
}

export async function reverseNitroAdvance(
  client: TypedSupabaseClient,
  args: { p_nitro_request_id: string; p_reason?: string | null },
): Promise<void> {
  const payload: JsonObject = {
    p_nitro_request_id: args.p_nitro_request_id,
  };
  if (args.p_reason !== undefined) payload["p_reason"] = args.p_reason;
  await handleUntypedRpc(client, "reverse_nitro_advance", payload, {
    expectReturnValue: false,
  });
}

export async function reconcileNitroAdvances(
  client: TypedSupabaseClient,
): Promise<number> {
  const data = await handleUntypedRpc(
    client,
    "reconcile_nitro_advances",
    {},
    { fallbackValue: 0 },
  );
  return isNumber(data) ? data : 0;
}
