import { callRpc } from "../call-rpc.js";
import type { DbFunctions, TypedSupabaseClient } from "../types.js";
import type { SupabaseRpcOptions } from "@lomi./shared";

/** Admin provisioning RPCs — inject platform-admin TypedSupabaseClient. */
export { rpc } from "../rpc.js";

export async function adminResolveLiveActivationRequest(
  client: TypedSupabaseClient,
  args: DbFunctions["admin_resolve_live_activation_request"]["Args"],
  options?: SupabaseRpcOptions<
    DbFunctions["admin_resolve_live_activation_request"]["Returns"]
  > | null,
): Promise<
  | DbFunctions["admin_resolve_live_activation_request"]["Returns"]
  | null
  | boolean
> {
  if (options === null) {
    return callRpc(
      client,
      "admin_resolve_live_activation_request",
      args,
      "admin_resolve_live_activation_request",
      { fallbackValue: null },
    );
  }
  return callRpc(
    client,
    "admin_resolve_live_activation_request",
    args,
    "admin_resolve_live_activation_request",
    options,
  );
}

export async function getAdminLiveActivationRequests(
  client: TypedSupabaseClient,
  args: DbFunctions["get_admin_live_activation_requests"]["Args"],
  options?: SupabaseRpcOptions<
    DbFunctions["get_admin_live_activation_requests"]["Returns"]
  > | null,
): Promise<
  DbFunctions["get_admin_live_activation_requests"]["Returns"] | null | boolean
> {
  if (options === null) {
    return callRpc(
      client,
      "get_admin_live_activation_requests",
      args,
      "get_admin_live_activation_requests",
      { fallbackValue: null },
    );
  }
  return callRpc(
    client,
    "get_admin_live_activation_requests",
    args,
    "get_admin_live_activation_requests",
    options,
  );
}

export async function getAdminProvisioningAudit(
  client: TypedSupabaseClient,
  args: DbFunctions["get_admin_provisioning_audit"]["Args"],
  options?: SupabaseRpcOptions<
    DbFunctions["get_admin_provisioning_audit"]["Returns"]
  > | null,
): Promise<
  DbFunctions["get_admin_provisioning_audit"]["Returns"] | null | boolean
> {
  if (options === null) {
    return callRpc(
      client,
      "get_admin_provisioning_audit",
      args,
      "get_admin_provisioning_audit",
      { fallbackValue: null },
    );
  }
  return callRpc(
    client,
    "get_admin_provisioning_audit",
    args,
    "get_admin_provisioning_audit",
    options,
  );
}

export async function getAdminProvisioningKeys(
  client: TypedSupabaseClient,
  args: DbFunctions["get_admin_provisioning_keys"]["Args"],
  options?: SupabaseRpcOptions<
    DbFunctions["get_admin_provisioning_keys"]["Returns"]
  > | null,
): Promise<
  DbFunctions["get_admin_provisioning_keys"]["Returns"] | null | boolean
> {
  if (options === null) {
    return callRpc(
      client,
      "get_admin_provisioning_keys",
      args,
      "get_admin_provisioning_keys",
      { fallbackValue: null },
    );
  }
  return callRpc(
    client,
    "get_admin_provisioning_keys",
    args,
    "get_admin_provisioning_keys",
    options,
  );
}

export async function getAdminProvisioningOverview(
  client: TypedSupabaseClient,
  args: DbFunctions["get_admin_provisioning_overview"]["Args"],
  options?: SupabaseRpcOptions<
    DbFunctions["get_admin_provisioning_overview"]["Returns"]
  > | null,
): Promise<
  DbFunctions["get_admin_provisioning_overview"]["Returns"] | null | boolean
> {
  if (options === null) {
    return callRpc(
      client,
      "get_admin_provisioning_overview",
      args,
      "get_admin_provisioning_overview",
      { fallbackValue: null },
    );
  }
  return callRpc(
    client,
    "get_admin_provisioning_overview",
    args,
    "get_admin_provisioning_overview",
    options,
  );
}

export async function revokeProvisioningKey(
  client: TypedSupabaseClient,
  args: DbFunctions["revoke_provisioning_key"]["Args"],
  options?: SupabaseRpcOptions<
    DbFunctions["revoke_provisioning_key"]["Returns"]
  > | null,
): Promise<DbFunctions["revoke_provisioning_key"]["Returns"] | null | boolean> {
  if (options === null) {
    return callRpc(
      client,
      "revoke_provisioning_key",
      args,
      "revoke_provisioning_key",
      { fallbackValue: null },
    );
  }
  return callRpc(
    client,
    "revoke_provisioning_key",
    args,
    "revoke_provisioning_key",
    options,
  );
}
