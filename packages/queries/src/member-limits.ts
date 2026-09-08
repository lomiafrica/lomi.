import {
  isJsonArray,
  isJsonObject,
  readNumber,
  readString,
  type JsonObject,
  type JsonValue,
} from "@lomi./shared";
import type { TypedSupabaseClient } from "./types.js";
import { handleUntypedRpc } from "./untyped-rpc.js";

export type MemberLimitRow = {
  merchant_org_id: string;
  merchant_id: string;
  currency_code: string;
  max_charge_amount: number | null;
  daily_charge_total: number | null;
  max_refund_amount: number | null;
  daily_payout_total: number | null;
};

function parseMemberLimitRow(value: JsonValue): MemberLimitRow | null {
  if (!isJsonObject(value)) return null;
  const merchant_org_id = readString(value, "merchant_org_id");
  const merchant_id = readString(value, "merchant_id");
  const currency_code = readString(value, "currency_code");
  if (!merchant_org_id || !merchant_id || !currency_code) return null;
  return {
    merchant_org_id,
    merchant_id,
    currency_code,
    max_charge_amount: readNumber(value, "max_charge_amount") ?? null,
    daily_charge_total: readNumber(value, "daily_charge_total") ?? null,
    max_refund_amount: readNumber(value, "max_refund_amount") ?? null,
    daily_payout_total: readNumber(value, "daily_payout_total") ?? null,
  };
}

export async function fetchOrganizationMemberLimits(
  client: TypedSupabaseClient,
  args: { p_organization_id: string },
): Promise<MemberLimitRow[]> {
  const data = await handleUntypedRpc(
    client,
    "fetch_organization_member_limits",
    args,
    { fallbackValue: [] },
  );
  if (!isJsonArray(data)) return [];
  return data.flatMap((row) => {
    const parsed = parseMemberLimitRow(row);
    return parsed ? [parsed] : [];
  });
}

export type UpsertOrganizationMemberLimitsArgs = {
  p_organization_id: string;
  p_merchant_id: string;
  p_currency_code: string;
  p_max_charge_amount?: number | null;
  p_daily_charge_total?: number | null;
  p_max_refund_amount?: number | null;
  p_daily_payout_total?: number | null;
};

export async function upsertOrganizationMemberLimits(
  client: TypedSupabaseClient,
  args: UpsertOrganizationMemberLimitsArgs,
): Promise<void> {
  const payload: JsonObject = {
    p_organization_id: args.p_organization_id,
    p_merchant_id: args.p_merchant_id,
    p_currency_code: args.p_currency_code,
  };
  if (args.p_max_charge_amount !== undefined) {
    payload["p_max_charge_amount"] = args.p_max_charge_amount;
  }
  if (args.p_daily_charge_total !== undefined) {
    payload["p_daily_charge_total"] = args.p_daily_charge_total;
  }
  if (args.p_max_refund_amount !== undefined) {
    payload["p_max_refund_amount"] = args.p_max_refund_amount;
  }
  if (args.p_daily_payout_total !== undefined) {
    payload["p_daily_payout_total"] = args.p_daily_payout_total;
  }
  await handleUntypedRpc(client, "upsert_organization_member_limits", payload, {
    expectReturnValue: false,
  });
}
