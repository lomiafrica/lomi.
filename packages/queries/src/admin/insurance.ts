import { isString, type JsonObject } from "@lomi./shared";
import type { TypedSupabaseClient } from "../types.js";
import { handleUntypedRpc } from "../untyped-rpc.js";

export {
  adminSetNitroSettings,
  reverseNitroAdvance,
  reconcileNitroAdvances,
} from "../nitro.js";

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

export async function adminUpsertInsuranceCarrier(
  client: TypedSupabaseClient,
  args: JsonObject,
): Promise<string> {
  return requireRpcId(client, "admin_upsert_insurance_carrier", args);
}

export async function adminUpsertInsuranceProduct(
  client: TypedSupabaseClient,
  args: JsonObject,
): Promise<string> {
  return requireRpcId(client, "admin_upsert_insurance_product", args);
}

export async function adminQuoteInsuranceRequest(
  client: TypedSupabaseClient,
  args: JsonObject,
): Promise<void> {
  await handleUntypedRpc(client, "admin_quote_insurance_request", args, {
    expectReturnValue: false,
  });
}

export async function adminIssueInsurancePolicy(
  client: TypedSupabaseClient,
  args: JsonObject,
): Promise<string> {
  return requireRpcId(client, "admin_issue_insurance_policy", args);
}
