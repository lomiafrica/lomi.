import { callRpc } from "../call-rpc.js";
import type { DbFunctions, TypedSupabaseClient } from "../types.js";
import type { SupabaseRpcOptions } from "@lomi./shared";

/** Admin network RPCs — inject platform-admin TypedSupabaseClient. */
export { rpc } from "../rpc.js";

export async function approveNetworkOperator(
  client: TypedSupabaseClient,
  args: DbFunctions["approve_network_operator"]["Args"],
  options?: SupabaseRpcOptions<
    DbFunctions["approve_network_operator"]["Returns"]
  > | null,
): Promise<
  DbFunctions["approve_network_operator"]["Returns"] | null | boolean
> {
  if (options === null) {
    return callRpc(
      client,
      "approve_network_operator",
      args,
      "approve_network_operator",
      { fallbackValue: null },
    );
  }
  return callRpc(
    client,
    "approve_network_operator",
    args,
    "approve_network_operator",
    options,
  );
}

export async function fetchAdminNetworkOperators(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_admin_network_operators"]["Args"],
  options?: SupabaseRpcOptions<
    DbFunctions["fetch_admin_network_operators"]["Returns"]
  > | null,
): Promise<
  DbFunctions["fetch_admin_network_operators"]["Returns"] | null | boolean
> {
  if (options === null) {
    return callRpc(
      client,
      "fetch_admin_network_operators",
      args,
      "fetch_admin_network_operators",
      { fallbackValue: null },
    );
  }
  return callRpc(
    client,
    "fetch_admin_network_operators",
    args,
    "fetch_admin_network_operators",
    options,
  );
}

export async function fetchAdminNetworkOverview(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_admin_network_overview"]["Args"],
  options?: SupabaseRpcOptions<
    DbFunctions["fetch_admin_network_overview"]["Returns"]
  > | null,
): Promise<
  DbFunctions["fetch_admin_network_overview"]["Returns"] | null | boolean
> {
  if (options === null) {
    return callRpc(
      client,
      "fetch_admin_network_overview",
      args,
      "fetch_admin_network_overview",
      { fallbackValue: null },
    );
  }
  return callRpc(
    client,
    "fetch_admin_network_overview",
    args,
    "fetch_admin_network_overview",
    options,
  );
}

export async function fetchAdminNetworkTimeseries(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_admin_network_timeseries"]["Args"],
  options?: SupabaseRpcOptions<
    DbFunctions["fetch_admin_network_timeseries"]["Returns"]
  > | null,
): Promise<
  DbFunctions["fetch_admin_network_timeseries"]["Returns"] | null | boolean
> {
  if (options === null) {
    return callRpc(
      client,
      "fetch_admin_network_timeseries",
      args,
      "fetch_admin_network_timeseries",
      { fallbackValue: null },
    );
  }
  return callRpc(
    client,
    "fetch_admin_network_timeseries",
    args,
    "fetch_admin_network_timeseries",
    options,
  );
}
