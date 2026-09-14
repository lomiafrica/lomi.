import { callRpc } from "../call-rpc.js";
import type { DbFunctions, TypedSupabaseClient } from "../types.js";
import type { SupabaseRpcOptions } from "@lomi./shared";

/** Admin finance RPCs — inject platform-admin TypedSupabaseClient. */
export { rpc } from "../rpc.js";

export async function getNpvByDate(
  client: TypedSupabaseClient,
  args: DbFunctions["get_npv_by_date"]["Args"],
  options?: SupabaseRpcOptions<
    DbFunctions["get_npv_by_date"]["Returns"]
  > | null,
): Promise<DbFunctions["get_npv_by_date"]["Returns"] | null | boolean> {
  if (options === null) {
    return callRpc(client, "get_npv_by_date", args, "get_npv_by_date", {
      fallbackValue: null,
    });
  }
  return callRpc(client, "get_npv_by_date", args, "get_npv_by_date", options);
}

export async function getPlatformInvestments(
  client: TypedSupabaseClient,
  args: DbFunctions["get_platform_investments"]["Args"],
  options?: SupabaseRpcOptions<
    DbFunctions["get_platform_investments"]["Returns"]
  > | null,
): Promise<
  DbFunctions["get_platform_investments"]["Returns"] | null | boolean
> {
  if (options === null) {
    return callRpc(
      client,
      "get_platform_investments",
      args,
      "get_platform_investments",
      { fallbackValue: null },
    );
  }
  return callRpc(
    client,
    "get_platform_investments",
    args,
    "get_platform_investments",
    options,
  );
}

export async function managePlatformInvestment(
  client: TypedSupabaseClient,
  args: DbFunctions["manage_platform_investment"]["Args"],
  options?: SupabaseRpcOptions<
    DbFunctions["manage_platform_investment"]["Returns"]
  > | null,
): Promise<
  DbFunctions["manage_platform_investment"]["Returns"] | null | boolean
> {
  if (options === null) {
    return callRpc(
      client,
      "manage_platform_investment",
      args,
      "manage_platform_investment",
      { fallbackValue: null },
    );
  }
  return callRpc(
    client,
    "manage_platform_investment",
    args,
    "manage_platform_investment",
    options,
  );
}
