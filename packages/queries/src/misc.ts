import { handleSupabaseRpc, type SupabaseRpcOptions } from "@lomi./shared";
import { rpc } from "./rpc.js";
import type { DbFunctions, TypedSupabaseClient } from "./types.js";
import { emptyRpcArgs } from "./call-rpc.js";

export async function fetchSubscriptionDeepLinkSnapshot(
  client: TypedSupabaseClient,
  args?: DbFunctions["fetch_subscription_deep_link_snapshot"]["Args"],
): Promise<
  DbFunctions["fetch_subscription_deep_link_snapshot"]["Returns"] | null
>;
export async function fetchSubscriptionDeepLinkSnapshot(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_subscription_deep_link_snapshot"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function fetchSubscriptionDeepLinkSnapshot(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_subscription_deep_link_snapshot"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["fetch_subscription_deep_link_snapshot"]["Returns"]
  > | null,
): Promise<
  DbFunctions["fetch_subscription_deep_link_snapshot"]["Returns"] | null
>;
export async function fetchSubscriptionDeepLinkSnapshot(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_subscription_deep_link_snapshot"]["Args"] = emptyRpcArgs<"fetch_subscription_deep_link_snapshot">(),
  options?: SupabaseRpcOptions<
    DbFunctions["fetch_subscription_deep_link_snapshot"]["Returns"]
  > | null,
): Promise<
  | DbFunctions["fetch_subscription_deep_link_snapshot"]["Returns"]
  | null
  | boolean
> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "fetch_subscription_deep_link_snapshot", args),
      "fetch_subscription_deep_link_snapshot",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "fetch_subscription_deep_link_snapshot", args),
      "fetch_subscription_deep_link_snapshot",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "fetch_subscription_deep_link_snapshot", args),
    "fetch_subscription_deep_link_snapshot",
  );
}

export async function getMerchantEmail(
  client: TypedSupabaseClient,
  args?: DbFunctions["get_merchant_email"]["Args"],
): Promise<DbFunctions["get_merchant_email"]["Returns"] | null>;
export async function getMerchantEmail(
  client: TypedSupabaseClient,
  args: DbFunctions["get_merchant_email"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function getMerchantEmail(
  client: TypedSupabaseClient,
  args: DbFunctions["get_merchant_email"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["get_merchant_email"]["Returns"]
  > | null,
): Promise<DbFunctions["get_merchant_email"]["Returns"] | null>;
export async function getMerchantEmail(
  client: TypedSupabaseClient,
  args: DbFunctions["get_merchant_email"]["Args"] = emptyRpcArgs<"get_merchant_email">(),
  options?: SupabaseRpcOptions<
    DbFunctions["get_merchant_email"]["Returns"]
  > | null,
): Promise<DbFunctions["get_merchant_email"]["Returns"] | null | boolean> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "get_merchant_email", args),
      "get_merchant_email",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "get_merchant_email", args),
      "get_merchant_email",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "get_merchant_email", args),
    "get_merchant_email",
  );
}

export async function getSubscriptionUsageDashboard(
  client: TypedSupabaseClient,
  args?: DbFunctions["get_subscription_usage_dashboard"]["Args"],
): Promise<DbFunctions["get_subscription_usage_dashboard"]["Returns"] | null>;
export async function getSubscriptionUsageDashboard(
  client: TypedSupabaseClient,
  args: DbFunctions["get_subscription_usage_dashboard"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function getSubscriptionUsageDashboard(
  client: TypedSupabaseClient,
  args: DbFunctions["get_subscription_usage_dashboard"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["get_subscription_usage_dashboard"]["Returns"]
  > | null,
): Promise<DbFunctions["get_subscription_usage_dashboard"]["Returns"] | null>;
export async function getSubscriptionUsageDashboard(
  client: TypedSupabaseClient,
  args: DbFunctions["get_subscription_usage_dashboard"]["Args"] = emptyRpcArgs<"get_subscription_usage_dashboard">(),
  options?: SupabaseRpcOptions<
    DbFunctions["get_subscription_usage_dashboard"]["Returns"]
  > | null,
): Promise<
  DbFunctions["get_subscription_usage_dashboard"]["Returns"] | null | boolean
> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "get_subscription_usage_dashboard", args),
      "get_subscription_usage_dashboard",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "get_subscription_usage_dashboard", args),
      "get_subscription_usage_dashboard",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "get_subscription_usage_dashboard", args),
    "get_subscription_usage_dashboard",
  );
}

export async function isPlatformAdmin(
  client: TypedSupabaseClient,
  args?: DbFunctions["is_platform_admin"]["Args"],
): Promise<DbFunctions["is_platform_admin"]["Returns"] | null>;
export async function isPlatformAdmin(
  client: TypedSupabaseClient,
  args: DbFunctions["is_platform_admin"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function isPlatformAdmin(
  client: TypedSupabaseClient,
  args: DbFunctions["is_platform_admin"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["is_platform_admin"]["Returns"]
  > | null,
): Promise<DbFunctions["is_platform_admin"]["Returns"] | null>;
export async function isPlatformAdmin(
  client: TypedSupabaseClient,
  args: DbFunctions["is_platform_admin"]["Args"] = emptyRpcArgs<"is_platform_admin">(),
  options?: SupabaseRpcOptions<
    DbFunctions["is_platform_admin"]["Returns"]
  > | null,
): Promise<DbFunctions["is_platform_admin"]["Returns"] | null | boolean> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "is_platform_admin", args),
      "is_platform_admin",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "is_platform_admin", args),
      "is_platform_admin",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "is_platform_admin", args),
    "is_platform_admin",
  );
}

export async function updateSubscriptionStatus(
  client: TypedSupabaseClient,
  args?: DbFunctions["update_subscription_status"]["Args"],
): Promise<DbFunctions["update_subscription_status"]["Returns"] | null>;
export async function updateSubscriptionStatus(
  client: TypedSupabaseClient,
  args: DbFunctions["update_subscription_status"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function updateSubscriptionStatus(
  client: TypedSupabaseClient,
  args: DbFunctions["update_subscription_status"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["update_subscription_status"]["Returns"]
  > | null,
): Promise<DbFunctions["update_subscription_status"]["Returns"] | null>;
export async function updateSubscriptionStatus(
  client: TypedSupabaseClient,
  args: DbFunctions["update_subscription_status"]["Args"] = emptyRpcArgs<"update_subscription_status">(),
  options?: SupabaseRpcOptions<
    DbFunctions["update_subscription_status"]["Returns"]
  > | null,
): Promise<
  DbFunctions["update_subscription_status"]["Returns"] | null | boolean
> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "update_subscription_status", args),
      "update_subscription_status",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "update_subscription_status", args),
      "update_subscription_status",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "update_subscription_status", args),
    "update_subscription_status",
  );
}
