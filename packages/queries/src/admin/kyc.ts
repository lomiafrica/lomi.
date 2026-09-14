import { callRpc } from "../call-rpc.js";
import type { DbFunctions, TypedSupabaseClient } from "../types.js";
import type { SupabaseRpcOptions } from "@lomi./shared";

/** Admin kyc RPCs — inject platform-admin TypedSupabaseClient. */
export { rpc } from "../rpc.js";

export async function getAdminKycOverview(
  client: TypedSupabaseClient,
  args: DbFunctions["get_admin_kyc_overview"]["Args"],
  options?: SupabaseRpcOptions<
    DbFunctions["get_admin_kyc_overview"]["Returns"]
  > | null,
): Promise<DbFunctions["get_admin_kyc_overview"]["Returns"] | null | boolean> {
  if (options === null) {
    return callRpc(
      client,
      "get_admin_kyc_overview",
      args,
      "get_admin_kyc_overview",
      { fallbackValue: null },
    );
  }
  return callRpc(
    client,
    "get_admin_kyc_overview",
    args,
    "get_admin_kyc_overview",
    options,
  );
}

export async function updateOrganizationKycStatus(
  client: TypedSupabaseClient,
  args: DbFunctions["update_organization_kyc_status"]["Args"],
  options?: SupabaseRpcOptions<
    DbFunctions["update_organization_kyc_status"]["Returns"]
  > | null,
): Promise<
  DbFunctions["update_organization_kyc_status"]["Returns"] | null | boolean
> {
  if (options === null) {
    return callRpc(
      client,
      "update_organization_kyc_status",
      args,
      "update_organization_kyc_status",
      { fallbackValue: null },
    );
  }
  return callRpc(
    client,
    "update_organization_kyc_status",
    args,
    "update_organization_kyc_status",
    options,
  );
}
