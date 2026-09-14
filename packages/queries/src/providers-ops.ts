import { handleSupabaseRpc, type SupabaseRpcOptions } from "@lomi./shared";
import { rpc } from "./rpc.js";
import type { DbFunctions, TypedSupabaseClient } from "./types.js";
import { emptyRpcArgs } from "./call-rpc.js";

export async function fetchProviderDistributionCustomRange(
  client: TypedSupabaseClient,
  args?: DbFunctions["fetch_provider_distribution_custom_range"]["Args"],
): Promise<
  DbFunctions["fetch_provider_distribution_custom_range"]["Returns"] | null
>;
export async function fetchProviderDistributionCustomRange(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_provider_distribution_custom_range"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function fetchProviderDistributionCustomRange(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_provider_distribution_custom_range"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["fetch_provider_distribution_custom_range"]["Returns"]
  > | null,
): Promise<
  DbFunctions["fetch_provider_distribution_custom_range"]["Returns"] | null
>;
export async function fetchProviderDistributionCustomRange(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_provider_distribution_custom_range"]["Args"] = emptyRpcArgs<"fetch_provider_distribution_custom_range">(),
  options?: SupabaseRpcOptions<
    DbFunctions["fetch_provider_distribution_custom_range"]["Returns"]
  > | null,
): Promise<
  | DbFunctions["fetch_provider_distribution_custom_range"]["Returns"]
  | null
  | boolean
> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "fetch_provider_distribution_custom_range", args),
      "fetch_provider_distribution_custom_range",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "fetch_provider_distribution_custom_range", args),
      "fetch_provider_distribution_custom_range",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "fetch_provider_distribution_custom_range", args),
    "fetch_provider_distribution_custom_range",
  );
}

export async function updateOrganizationProviderConnection(
  client: TypedSupabaseClient,
  args?: DbFunctions["update_organization_provider_connection"]["Args"],
): Promise<
  DbFunctions["update_organization_provider_connection"]["Returns"] | null
>;
export async function updateOrganizationProviderConnection(
  client: TypedSupabaseClient,
  args: DbFunctions["update_organization_provider_connection"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function updateOrganizationProviderConnection(
  client: TypedSupabaseClient,
  args: DbFunctions["update_organization_provider_connection"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["update_organization_provider_connection"]["Returns"]
  > | null,
): Promise<
  DbFunctions["update_organization_provider_connection"]["Returns"] | null
>;
export async function updateOrganizationProviderConnection(
  client: TypedSupabaseClient,
  args: DbFunctions["update_organization_provider_connection"]["Args"] = emptyRpcArgs<"update_organization_provider_connection">(),
  options?: SupabaseRpcOptions<
    DbFunctions["update_organization_provider_connection"]["Returns"]
  > | null,
): Promise<
  | DbFunctions["update_organization_provider_connection"]["Returns"]
  | null
  | boolean
> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "update_organization_provider_connection", args),
      "update_organization_provider_connection",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "update_organization_provider_connection", args),
      "update_organization_provider_connection",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "update_organization_provider_connection", args),
    "update_organization_provider_connection",
  );
}

export async function updateOrganizationProviderPhone(
  client: TypedSupabaseClient,
  args?: DbFunctions["update_organization_provider_phone"]["Args"],
): Promise<DbFunctions["update_organization_provider_phone"]["Returns"] | null>;
export async function updateOrganizationProviderPhone(
  client: TypedSupabaseClient,
  args: DbFunctions["update_organization_provider_phone"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function updateOrganizationProviderPhone(
  client: TypedSupabaseClient,
  args: DbFunctions["update_organization_provider_phone"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["update_organization_provider_phone"]["Returns"]
  > | null,
): Promise<DbFunctions["update_organization_provider_phone"]["Returns"] | null>;
export async function updateOrganizationProviderPhone(
  client: TypedSupabaseClient,
  args: DbFunctions["update_organization_provider_phone"]["Args"] = emptyRpcArgs<"update_organization_provider_phone">(),
  options?: SupabaseRpcOptions<
    DbFunctions["update_organization_provider_phone"]["Returns"]
  > | null,
): Promise<
  DbFunctions["update_organization_provider_phone"]["Returns"] | null | boolean
> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "update_organization_provider_phone", args),
      "update_organization_provider_phone",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "update_organization_provider_phone", args),
      "update_organization_provider_phone",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "update_organization_provider_phone", args),
    "update_organization_provider_phone",
  );
}
