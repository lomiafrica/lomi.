import { handleSupabaseRpc, type SupabaseRpcOptions } from "@lomi./shared";
import { rpc } from "./rpc.js";
import type { DbFunctions, TypedSupabaseClient } from "./types.js";
import { emptyRpcArgs } from "./call-rpc.js";

export async function getStorefront(
  client: TypedSupabaseClient,
  args?: DbFunctions["get_storefront"]["Args"],
): Promise<DbFunctions["get_storefront"]["Returns"] | null>;
export async function getStorefront(
  client: TypedSupabaseClient,
  args: DbFunctions["get_storefront"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function getStorefront(
  client: TypedSupabaseClient,
  args: DbFunctions["get_storefront"]["Args"],
  options: SupabaseRpcOptions<DbFunctions["get_storefront"]["Returns"]> | null,
): Promise<DbFunctions["get_storefront"]["Returns"] | null>;
export async function getStorefront(
  client: TypedSupabaseClient,
  args: DbFunctions["get_storefront"]["Args"] = emptyRpcArgs<"get_storefront">(),
  options?: SupabaseRpcOptions<DbFunctions["get_storefront"]["Returns"]> | null,
): Promise<DbFunctions["get_storefront"]["Returns"] | null | boolean> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "get_storefront", args),
      "get_storefront",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "get_storefront", args),
      "get_storefront",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "get_storefront", args),
    "get_storefront",
  );
}

export async function updateOrganizationStorefront(
  client: TypedSupabaseClient,
  args?: DbFunctions["update_organization_storefront"]["Args"],
): Promise<DbFunctions["update_organization_storefront"]["Returns"] | null>;
export async function updateOrganizationStorefront(
  client: TypedSupabaseClient,
  args: DbFunctions["update_organization_storefront"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function updateOrganizationStorefront(
  client: TypedSupabaseClient,
  args: DbFunctions["update_organization_storefront"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["update_organization_storefront"]["Returns"]
  > | null,
): Promise<DbFunctions["update_organization_storefront"]["Returns"] | null>;
export async function updateOrganizationStorefront(
  client: TypedSupabaseClient,
  args: DbFunctions["update_organization_storefront"]["Args"] = emptyRpcArgs<"update_organization_storefront">(),
  options?: SupabaseRpcOptions<
    DbFunctions["update_organization_storefront"]["Returns"]
  > | null,
): Promise<
  DbFunctions["update_organization_storefront"]["Returns"] | null | boolean
> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "update_organization_storefront", args),
      "update_organization_storefront",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "update_organization_storefront", args),
      "update_organization_storefront",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "update_organization_storefront", args),
    "update_organization_storefront",
  );
}

export async function updateStorefrontSettings(
  client: TypedSupabaseClient,
  args?: DbFunctions["update_storefront_settings"]["Args"],
): Promise<DbFunctions["update_storefront_settings"]["Returns"] | null>;
export async function updateStorefrontSettings(
  client: TypedSupabaseClient,
  args: DbFunctions["update_storefront_settings"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function updateStorefrontSettings(
  client: TypedSupabaseClient,
  args: DbFunctions["update_storefront_settings"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["update_storefront_settings"]["Returns"]
  > | null,
): Promise<DbFunctions["update_storefront_settings"]["Returns"] | null>;
export async function updateStorefrontSettings(
  client: TypedSupabaseClient,
  args: DbFunctions["update_storefront_settings"]["Args"] = emptyRpcArgs<"update_storefront_settings">(),
  options?: SupabaseRpcOptions<
    DbFunctions["update_storefront_settings"]["Returns"]
  > | null,
): Promise<
  DbFunctions["update_storefront_settings"]["Returns"] | null | boolean
> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "update_storefront_settings", args),
      "update_storefront_settings",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "update_storefront_settings", args),
      "update_storefront_settings",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "update_storefront_settings", args),
    "update_storefront_settings",
  );
}

export async function upsertStorefront(
  client: TypedSupabaseClient,
  args?: DbFunctions["upsert_storefront"]["Args"],
): Promise<DbFunctions["upsert_storefront"]["Returns"] | null>;
export async function upsertStorefront(
  client: TypedSupabaseClient,
  args: DbFunctions["upsert_storefront"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function upsertStorefront(
  client: TypedSupabaseClient,
  args: DbFunctions["upsert_storefront"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["upsert_storefront"]["Returns"]
  > | null,
): Promise<DbFunctions["upsert_storefront"]["Returns"] | null>;
export async function upsertStorefront(
  client: TypedSupabaseClient,
  args: DbFunctions["upsert_storefront"]["Args"] = emptyRpcArgs<"upsert_storefront">(),
  options?: SupabaseRpcOptions<
    DbFunctions["upsert_storefront"]["Returns"]
  > | null,
): Promise<DbFunctions["upsert_storefront"]["Returns"] | null | boolean> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "upsert_storefront", args),
      "upsert_storefront",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "upsert_storefront", args),
      "upsert_storefront",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "upsert_storefront", args),
    "upsert_storefront",
  );
}
