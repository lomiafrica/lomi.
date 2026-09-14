import { handleSupabaseRpc, type SupabaseRpcOptions } from "@lomi./shared";
import { rpc } from "./rpc.js";
import type { DbFunctions, TypedSupabaseClient } from "./types.js";
import { emptyRpcArgs } from "./call-rpc.js";

export async function getInstalledIntegrations(
  client: TypedSupabaseClient,
  args?: DbFunctions["get_installed_integrations"]["Args"],
): Promise<DbFunctions["get_installed_integrations"]["Returns"] | null>;
export async function getInstalledIntegrations(
  client: TypedSupabaseClient,
  args: DbFunctions["get_installed_integrations"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function getInstalledIntegrations(
  client: TypedSupabaseClient,
  args: DbFunctions["get_installed_integrations"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["get_installed_integrations"]["Returns"]
  > | null,
): Promise<DbFunctions["get_installed_integrations"]["Returns"] | null>;
export async function getInstalledIntegrations(
  client: TypedSupabaseClient,
  args: DbFunctions["get_installed_integrations"]["Args"] = emptyRpcArgs<"get_installed_integrations">(),
  options?: SupabaseRpcOptions<
    DbFunctions["get_installed_integrations"]["Returns"]
  > | null,
): Promise<
  DbFunctions["get_installed_integrations"]["Returns"] | null | boolean
> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "get_installed_integrations", args),
      "get_installed_integrations",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "get_installed_integrations", args),
      "get_installed_integrations",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "get_installed_integrations", args),
    "get_installed_integrations",
  );
}

export async function removeIntegration(
  client: TypedSupabaseClient,
  args?: DbFunctions["remove_integration"]["Args"],
): Promise<DbFunctions["remove_integration"]["Returns"] | null>;
export async function removeIntegration(
  client: TypedSupabaseClient,
  args: DbFunctions["remove_integration"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function removeIntegration(
  client: TypedSupabaseClient,
  args: DbFunctions["remove_integration"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["remove_integration"]["Returns"]
  > | null,
): Promise<DbFunctions["remove_integration"]["Returns"] | null>;
export async function removeIntegration(
  client: TypedSupabaseClient,
  args: DbFunctions["remove_integration"]["Args"] = emptyRpcArgs<"remove_integration">(),
  options?: SupabaseRpcOptions<
    DbFunctions["remove_integration"]["Returns"]
  > | null,
): Promise<DbFunctions["remove_integration"]["Returns"] | null | boolean> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "remove_integration", args),
      "remove_integration",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "remove_integration", args),
      "remove_integration",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "remove_integration", args),
    "remove_integration",
  );
}

export async function saveIntegrationClick(
  client: TypedSupabaseClient,
  args?: DbFunctions["save_integration_click"]["Args"],
): Promise<DbFunctions["save_integration_click"]["Returns"] | null>;
export async function saveIntegrationClick(
  client: TypedSupabaseClient,
  args: DbFunctions["save_integration_click"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function saveIntegrationClick(
  client: TypedSupabaseClient,
  args: DbFunctions["save_integration_click"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["save_integration_click"]["Returns"]
  > | null,
): Promise<DbFunctions["save_integration_click"]["Returns"] | null>;
export async function saveIntegrationClick(
  client: TypedSupabaseClient,
  args: DbFunctions["save_integration_click"]["Args"] = emptyRpcArgs<"save_integration_click">(),
  options?: SupabaseRpcOptions<
    DbFunctions["save_integration_click"]["Returns"]
  > | null,
): Promise<DbFunctions["save_integration_click"]["Returns"] | null | boolean> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "save_integration_click", args),
      "save_integration_click",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "save_integration_click", args),
      "save_integration_click",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "save_integration_click", args),
    "save_integration_click",
  );
}
