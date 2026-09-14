import { handleSupabaseRpc, type SupabaseRpcOptions } from "@lomi./shared";
import { rpc } from "./rpc.js";
import type { DbFunctions, TypedSupabaseClient } from "./types.js";
import { emptyRpcArgs } from "./call-rpc.js";

export async function createSupportRequest(
  client: TypedSupabaseClient,
  args?: DbFunctions["create_support_request"]["Args"],
): Promise<DbFunctions["create_support_request"]["Returns"] | null>;
export async function createSupportRequest(
  client: TypedSupabaseClient,
  args: DbFunctions["create_support_request"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function createSupportRequest(
  client: TypedSupabaseClient,
  args: DbFunctions["create_support_request"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["create_support_request"]["Returns"]
  > | null,
): Promise<DbFunctions["create_support_request"]["Returns"] | null>;
export async function createSupportRequest(
  client: TypedSupabaseClient,
  args: DbFunctions["create_support_request"]["Args"] = emptyRpcArgs<"create_support_request">(),
  options?: SupabaseRpcOptions<
    DbFunctions["create_support_request"]["Returns"]
  > | null,
): Promise<DbFunctions["create_support_request"]["Returns"] | null | boolean> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "create_support_request", args),
      "create_support_request",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "create_support_request", args),
      "create_support_request",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "create_support_request", args),
    "create_support_request",
  );
}

export async function fetchOrganizationSupportRequests(
  client: TypedSupabaseClient,
  args?: DbFunctions["fetch_organization_support_requests"]["Args"],
): Promise<
  DbFunctions["fetch_organization_support_requests"]["Returns"] | null
>;
export async function fetchOrganizationSupportRequests(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_organization_support_requests"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function fetchOrganizationSupportRequests(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_organization_support_requests"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["fetch_organization_support_requests"]["Returns"]
  > | null,
): Promise<
  DbFunctions["fetch_organization_support_requests"]["Returns"] | null
>;
export async function fetchOrganizationSupportRequests(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_organization_support_requests"]["Args"] = emptyRpcArgs<"fetch_organization_support_requests">(),
  options?: SupabaseRpcOptions<
    DbFunctions["fetch_organization_support_requests"]["Returns"]
  > | null,
): Promise<
  DbFunctions["fetch_organization_support_requests"]["Returns"] | null | boolean
> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "fetch_organization_support_requests", args),
      "fetch_organization_support_requests",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "fetch_organization_support_requests", args),
      "fetch_organization_support_requests",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "fetch_organization_support_requests", args),
    "fetch_organization_support_requests",
  );
}

export async function merchantCloseSupportRequest(
  client: TypedSupabaseClient,
  args?: DbFunctions["merchant_close_support_request"]["Args"],
): Promise<DbFunctions["merchant_close_support_request"]["Returns"] | null>;
export async function merchantCloseSupportRequest(
  client: TypedSupabaseClient,
  args: DbFunctions["merchant_close_support_request"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function merchantCloseSupportRequest(
  client: TypedSupabaseClient,
  args: DbFunctions["merchant_close_support_request"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["merchant_close_support_request"]["Returns"]
  > | null,
): Promise<DbFunctions["merchant_close_support_request"]["Returns"] | null>;
export async function merchantCloseSupportRequest(
  client: TypedSupabaseClient,
  args: DbFunctions["merchant_close_support_request"]["Args"] = emptyRpcArgs<"merchant_close_support_request">(),
  options?: SupabaseRpcOptions<
    DbFunctions["merchant_close_support_request"]["Returns"]
  > | null,
): Promise<
  DbFunctions["merchant_close_support_request"]["Returns"] | null | boolean
> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "merchant_close_support_request", args),
      "merchant_close_support_request",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "merchant_close_support_request", args),
      "merchant_close_support_request",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "merchant_close_support_request", args),
    "merchant_close_support_request",
  );
}
