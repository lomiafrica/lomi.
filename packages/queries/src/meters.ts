import { handleSupabaseRpc, type SupabaseRpcOptions } from "@lomi./shared";
import { rpc } from "./rpc.js";
import type { DbFunctions, TypedSupabaseClient } from "./types.js";
import { emptyRpcArgs } from "./call-rpc.js";

export async function fetchMetersDashboard(
  client: TypedSupabaseClient,
  args?: DbFunctions["fetch_meters_dashboard"]["Args"],
): Promise<DbFunctions["fetch_meters_dashboard"]["Returns"] | null>;
export async function fetchMetersDashboard(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_meters_dashboard"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function fetchMetersDashboard(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_meters_dashboard"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["fetch_meters_dashboard"]["Returns"]
  > | null,
): Promise<DbFunctions["fetch_meters_dashboard"]["Returns"] | null>;
export async function fetchMetersDashboard(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_meters_dashboard"]["Args"] = emptyRpcArgs<"fetch_meters_dashboard">(),
  options?: SupabaseRpcOptions<
    DbFunctions["fetch_meters_dashboard"]["Returns"]
  > | null,
): Promise<DbFunctions["fetch_meters_dashboard"]["Returns"] | null | boolean> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "fetch_meters_dashboard", args),
      "fetch_meters_dashboard",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "fetch_meters_dashboard", args),
      "fetch_meters_dashboard",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "fetch_meters_dashboard", args),
    "fetch_meters_dashboard",
  );
}

export async function updateMeterDashboard(
  client: TypedSupabaseClient,
  args?: DbFunctions["update_meter_dashboard"]["Args"],
): Promise<DbFunctions["update_meter_dashboard"]["Returns"] | null>;
export async function updateMeterDashboard(
  client: TypedSupabaseClient,
  args: DbFunctions["update_meter_dashboard"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function updateMeterDashboard(
  client: TypedSupabaseClient,
  args: DbFunctions["update_meter_dashboard"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["update_meter_dashboard"]["Returns"]
  > | null,
): Promise<DbFunctions["update_meter_dashboard"]["Returns"] | null>;
export async function updateMeterDashboard(
  client: TypedSupabaseClient,
  args: DbFunctions["update_meter_dashboard"]["Args"] = emptyRpcArgs<"update_meter_dashboard">(),
  options?: SupabaseRpcOptions<
    DbFunctions["update_meter_dashboard"]["Returns"]
  > | null,
): Promise<DbFunctions["update_meter_dashboard"]["Returns"] | null | boolean> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "update_meter_dashboard", args),
      "update_meter_dashboard",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "update_meter_dashboard", args),
      "update_meter_dashboard",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "update_meter_dashboard", args),
    "update_meter_dashboard",
  );
}
