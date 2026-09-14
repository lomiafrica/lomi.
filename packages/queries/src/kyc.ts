import { handleSupabaseRpc, type SupabaseRpcOptions } from "@lomi./shared";
import { rpc } from "./rpc.js";
import type { DbFunctions, TypedSupabaseClient } from "./types.js";
import { emptyRpcArgs } from "./call-rpc.js";

export async function getOrganizationKycStatus(
  client: TypedSupabaseClient,
  args?: DbFunctions["get_organization_kyc_status"]["Args"],
): Promise<DbFunctions["get_organization_kyc_status"]["Returns"] | null>;
export async function getOrganizationKycStatus(
  client: TypedSupabaseClient,
  args: DbFunctions["get_organization_kyc_status"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function getOrganizationKycStatus(
  client: TypedSupabaseClient,
  args: DbFunctions["get_organization_kyc_status"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["get_organization_kyc_status"]["Returns"]
  > | null,
): Promise<DbFunctions["get_organization_kyc_status"]["Returns"] | null>;
export async function getOrganizationKycStatus(
  client: TypedSupabaseClient,
  args: DbFunctions["get_organization_kyc_status"]["Args"] = emptyRpcArgs<"get_organization_kyc_status">(),
  options?: SupabaseRpcOptions<
    DbFunctions["get_organization_kyc_status"]["Returns"]
  > | null,
): Promise<
  DbFunctions["get_organization_kyc_status"]["Returns"] | null | boolean
> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "get_organization_kyc_status", args),
      "get_organization_kyc_status",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "get_organization_kyc_status", args),
      "get_organization_kyc_status",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "get_organization_kyc_status", args),
    "get_organization_kyc_status",
  );
}
