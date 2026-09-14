import { callRpc } from "../call-rpc.js";
import type { DbFunctions, TypedSupabaseClient } from "../types.js";
import type { SupabaseRpcOptions } from "@lomi./shared";

/** Admin support RPCs — inject platform-admin TypedSupabaseClient. */
export { rpc } from "../rpc.js";

export async function getAdminSupportRequests(
  client: TypedSupabaseClient,
  args: DbFunctions["get_admin_support_requests"]["Args"],
  options?: SupabaseRpcOptions<
    DbFunctions["get_admin_support_requests"]["Returns"]
  > | null,
): Promise<
  DbFunctions["get_admin_support_requests"]["Returns"] | null | boolean
> {
  if (options === null) {
    return callRpc(
      client,
      "get_admin_support_requests",
      args,
      "get_admin_support_requests",
      { fallbackValue: null },
    );
  }
  return callRpc(
    client,
    "get_admin_support_requests",
    args,
    "get_admin_support_requests",
    options,
  );
}

export async function getSupportRequestsByStatusDate(
  client: TypedSupabaseClient,
  args: DbFunctions["get_support_requests_by_status_date"]["Args"],
  options?: SupabaseRpcOptions<
    DbFunctions["get_support_requests_by_status_date"]["Returns"]
  > | null,
): Promise<
  DbFunctions["get_support_requests_by_status_date"]["Returns"] | null | boolean
> {
  if (options === null) {
    return callRpc(
      client,
      "get_support_requests_by_status_date",
      args,
      "get_support_requests_by_status_date",
      { fallbackValue: null },
    );
  }
  return callRpc(
    client,
    "get_support_requests_by_status_date",
    args,
    "get_support_requests_by_status_date",
    options,
  );
}

export async function updateSupportRequestPriority(
  client: TypedSupabaseClient,
  args: DbFunctions["update_support_request_priority"]["Args"],
  options?: SupabaseRpcOptions<
    DbFunctions["update_support_request_priority"]["Returns"]
  > | null,
): Promise<
  DbFunctions["update_support_request_priority"]["Returns"] | null | boolean
> {
  if (options === null) {
    return callRpc(
      client,
      "update_support_request_priority",
      args,
      "update_support_request_priority",
      { fallbackValue: null },
    );
  }
  return callRpc(
    client,
    "update_support_request_priority",
    args,
    "update_support_request_priority",
    options,
  );
}

export async function updateSupportRequestStatus(
  client: TypedSupabaseClient,
  args: DbFunctions["update_support_request_status"]["Args"],
  options?: SupabaseRpcOptions<
    DbFunctions["update_support_request_status"]["Returns"]
  > | null,
): Promise<
  DbFunctions["update_support_request_status"]["Returns"] | null | boolean
> {
  if (options === null) {
    return callRpc(
      client,
      "update_support_request_status",
      args,
      "update_support_request_status",
      { fallbackValue: null },
    );
  }
  return callRpc(
    client,
    "update_support_request_status",
    args,
    "update_support_request_status",
    options,
  );
}
