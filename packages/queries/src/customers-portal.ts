import { callRpc } from "./call-rpc.js";
import type { DbFunctions, TypedSupabaseClient } from "./types.js";
import type { SupabaseRpcOptions } from "@lomi./shared";

/** Customer portal session RPCs — inject service/anon TypedSupabaseClient. */
export { rpc } from "./rpc.js";

// Re-export overlapping public download helpers for one-import call sites
export {
  recordDownloadAccess,
  validateDownloadAccessToken,
} from "./checkout-public.js";
export { createInvoiceCheckoutSession } from "./checkout-settings-ops.js";

export async function customerPortalSessionContext(
  client: TypedSupabaseClient,
  args: DbFunctions["customer_portal_session_context"]["Args"],
  options?: SupabaseRpcOptions<
    DbFunctions["customer_portal_session_context"]["Returns"]
  > | null,
): Promise<
  DbFunctions["customer_portal_session_context"]["Returns"] | null | boolean
> {
  if (options === null) {
    return callRpc(
      client,
      "customer_portal_session_context",
      args,
      "customer_portal_session_context",
      { fallbackValue: null },
    );
  }
  return callRpc(
    client,
    "customer_portal_session_context",
    args,
    "customer_portal_session_context",
    options,
  );
}

export async function customerPortalListTransactions(
  client: TypedSupabaseClient,
  args: DbFunctions["customer_portal_list_transactions"]["Args"],
  options?: SupabaseRpcOptions<
    DbFunctions["customer_portal_list_transactions"]["Returns"]
  > | null,
): Promise<
  DbFunctions["customer_portal_list_transactions"]["Returns"] | null | boolean
> {
  if (options === null) {
    return callRpc(
      client,
      "customer_portal_list_transactions",
      args,
      "customer_portal_list_transactions",
      { fallbackValue: null },
    );
  }
  return callRpc(
    client,
    "customer_portal_list_transactions",
    args,
    "customer_portal_list_transactions",
    options,
  );
}

export async function customerPortalGetTransactionReceipt(
  client: TypedSupabaseClient,
  args: DbFunctions["customer_portal_get_transaction_receipt"]["Args"],
  options?: SupabaseRpcOptions<
    DbFunctions["customer_portal_get_transaction_receipt"]["Returns"]
  > | null,
): Promise<
  | DbFunctions["customer_portal_get_transaction_receipt"]["Returns"]
  | null
  | boolean
> {
  if (options === null) {
    return callRpc(
      client,
      "customer_portal_get_transaction_receipt",
      args,
      "customer_portal_get_transaction_receipt",
      { fallbackValue: null },
    );
  }
  return callRpc(
    client,
    "customer_portal_get_transaction_receipt",
    args,
    "customer_portal_get_transaction_receipt",
    options,
  );
}

export async function customerPortalListSubscriptions(
  client: TypedSupabaseClient,
  args: DbFunctions["customer_portal_list_subscriptions"]["Args"],
  options?: SupabaseRpcOptions<
    DbFunctions["customer_portal_list_subscriptions"]["Returns"]
  > | null,
): Promise<
  DbFunctions["customer_portal_list_subscriptions"]["Returns"] | null | boolean
> {
  if (options === null) {
    return callRpc(
      client,
      "customer_portal_list_subscriptions",
      args,
      "customer_portal_list_subscriptions",
      { fallbackValue: null },
    );
  }
  return callRpc(
    client,
    "customer_portal_list_subscriptions",
    args,
    "customer_portal_list_subscriptions",
    options,
  );
}

export async function customerPortalGetSubscriptionDetail(
  client: TypedSupabaseClient,
  args: DbFunctions["customer_portal_get_subscription_detail"]["Args"],
  options?: SupabaseRpcOptions<
    DbFunctions["customer_portal_get_subscription_detail"]["Returns"]
  > | null,
): Promise<
  | DbFunctions["customer_portal_get_subscription_detail"]["Returns"]
  | null
  | boolean
> {
  if (options === null) {
    return callRpc(
      client,
      "customer_portal_get_subscription_detail",
      args,
      "customer_portal_get_subscription_detail",
      { fallbackValue: null },
    );
  }
  return callRpc(
    client,
    "customer_portal_get_subscription_detail",
    args,
    "customer_portal_get_subscription_detail",
    options,
  );
}

export async function customerPortalListSubscriptionTransactions(
  client: TypedSupabaseClient,
  args: DbFunctions["customer_portal_list_subscription_transactions"]["Args"],
  options?: SupabaseRpcOptions<
    DbFunctions["customer_portal_list_subscription_transactions"]["Returns"]
  > | null,
): Promise<
  | DbFunctions["customer_portal_list_subscription_transactions"]["Returns"]
  | null
  | boolean
> {
  if (options === null) {
    return callRpc(
      client,
      "customer_portal_list_subscription_transactions",
      args,
      "customer_portal_list_subscription_transactions",
      { fallbackValue: null },
    );
  }
  return callRpc(
    client,
    "customer_portal_list_subscription_transactions",
    args,
    "customer_portal_list_subscription_transactions",
    options,
  );
}

export async function listCustomerLibrary(
  client: TypedSupabaseClient,
  args: DbFunctions["list_customer_library"]["Args"],
  options?: SupabaseRpcOptions<
    DbFunctions["list_customer_library"]["Returns"]
  > | null,
): Promise<DbFunctions["list_customer_library"]["Returns"] | null | boolean> {
  if (options === null) {
    return callRpc(
      client,
      "list_customer_library",
      args,
      "list_customer_library",
      { fallbackValue: null },
    );
  }
  return callRpc(
    client,
    "list_customer_library",
    args,
    "list_customer_library",
    options,
  );
}

export async function customerPortalListPaymentMethods(
  client: TypedSupabaseClient,
  args: DbFunctions["customer_portal_list_payment_methods"]["Args"],
  options?: SupabaseRpcOptions<
    DbFunctions["customer_portal_list_payment_methods"]["Returns"]
  > | null,
): Promise<
  | DbFunctions["customer_portal_list_payment_methods"]["Returns"]
  | null
  | boolean
> {
  if (options === null) {
    return callRpc(
      client,
      "customer_portal_list_payment_methods",
      args,
      "customer_portal_list_payment_methods",
      { fallbackValue: null },
    );
  }
  return callRpc(
    client,
    "customer_portal_list_payment_methods",
    args,
    "customer_portal_list_payment_methods",
    options,
  );
}

export async function customerPortalValidateSession(
  client: TypedSupabaseClient,
  args: DbFunctions["customer_portal_validate_session"]["Args"],
  options?: SupabaseRpcOptions<
    DbFunctions["customer_portal_validate_session"]["Returns"]
  > | null,
): Promise<
  DbFunctions["customer_portal_validate_session"]["Returns"] | null | boolean
> {
  if (options === null) {
    return callRpc(
      client,
      "customer_portal_validate_session",
      args,
      "customer_portal_validate_session",
      { fallbackValue: null },
    );
  }
  return callRpc(
    client,
    "customer_portal_validate_session",
    args,
    "customer_portal_validate_session",
    options,
  );
}

export async function customerPortalEffectivePolicy(
  client: TypedSupabaseClient,
  args: DbFunctions["customer_portal_effective_policy"]["Args"],
  options?: SupabaseRpcOptions<
    DbFunctions["customer_portal_effective_policy"]["Returns"]
  > | null,
): Promise<
  DbFunctions["customer_portal_effective_policy"]["Returns"] | null | boolean
> {
  if (options === null) {
    return callRpc(
      client,
      "customer_portal_effective_policy",
      args,
      "customer_portal_effective_policy",
      { fallbackValue: null },
    );
  }
  return callRpc(
    client,
    "customer_portal_effective_policy",
    args,
    "customer_portal_effective_policy",
    options,
  );
}

export async function customerPortalVerifyAccessChallenge(
  client: TypedSupabaseClient,
  args: DbFunctions["customer_portal_verify_access_challenge"]["Args"],
  options?: SupabaseRpcOptions<
    DbFunctions["customer_portal_verify_access_challenge"]["Returns"]
  > | null,
): Promise<
  | DbFunctions["customer_portal_verify_access_challenge"]["Returns"]
  | null
  | boolean
> {
  if (options === null) {
    return callRpc(
      client,
      "customer_portal_verify_access_challenge",
      args,
      "customer_portal_verify_access_challenge",
      { fallbackValue: null },
    );
  }
  return callRpc(
    client,
    "customer_portal_verify_access_challenge",
    args,
    "customer_portal_verify_access_challenge",
    options,
  );
}

export async function customerPortalResolveContactStatus(
  client: TypedSupabaseClient,
  args: DbFunctions["customer_portal_resolve_contact_status"]["Args"],
  options?: SupabaseRpcOptions<
    DbFunctions["customer_portal_resolve_contact_status"]["Returns"]
  > | null,
): Promise<
  | DbFunctions["customer_portal_resolve_contact_status"]["Returns"]
  | null
  | boolean
> {
  if (options === null) {
    return callRpc(
      client,
      "customer_portal_resolve_contact_status",
      args,
      "customer_portal_resolve_contact_status",
      { fallbackValue: null },
    );
  }
  return callRpc(
    client,
    "customer_portal_resolve_contact_status",
    args,
    "customer_portal_resolve_contact_status",
    options,
  );
}

export async function customerPortalValidateCustomerAccess(
  client: TypedSupabaseClient,
  args: DbFunctions["customer_portal_validate_customer_access"]["Args"],
  options?: SupabaseRpcOptions<
    DbFunctions["customer_portal_validate_customer_access"]["Returns"]
  > | null,
): Promise<
  | DbFunctions["customer_portal_validate_customer_access"]["Returns"]
  | null
  | boolean
> {
  if (options === null) {
    return callRpc(
      client,
      "customer_portal_validate_customer_access",
      args,
      "customer_portal_validate_customer_access",
      { fallbackValue: null },
    );
  }
  return callRpc(
    client,
    "customer_portal_validate_customer_access",
    args,
    "customer_portal_validate_customer_access",
    options,
  );
}

export async function customerPortalCreateAccessChallenge(
  client: TypedSupabaseClient,
  args: DbFunctions["customer_portal_create_access_challenge"]["Args"],
  options?: SupabaseRpcOptions<
    DbFunctions["customer_portal_create_access_challenge"]["Returns"]
  > | null,
): Promise<
  | DbFunctions["customer_portal_create_access_challenge"]["Returns"]
  | null
  | boolean
> {
  if (options === null) {
    return callRpc(
      client,
      "customer_portal_create_access_challenge",
      args,
      "customer_portal_create_access_challenge",
      { fallbackValue: null },
    );
  }
  return callRpc(
    client,
    "customer_portal_create_access_challenge",
    args,
    "customer_portal_create_access_challenge",
    options,
  );
}

export async function customerPortalManageSubscription(
  client: TypedSupabaseClient,
  args: DbFunctions["customer_portal_manage_subscription"]["Args"],
  options?: SupabaseRpcOptions<
    DbFunctions["customer_portal_manage_subscription"]["Returns"]
  > | null,
): Promise<
  DbFunctions["customer_portal_manage_subscription"]["Returns"] | null | boolean
> {
  if (options === null) {
    return callRpc(
      client,
      "customer_portal_manage_subscription",
      args,
      "customer_portal_manage_subscription",
      { fallbackValue: null },
    );
  }
  return callRpc(
    client,
    "customer_portal_manage_subscription",
    args,
    "customer_portal_manage_subscription",
    options,
  );
}

export async function customerPortalSetDefaultPaymentMethod(
  client: TypedSupabaseClient,
  args: DbFunctions["customer_portal_set_default_payment_method"]["Args"],
  options?: SupabaseRpcOptions<
    DbFunctions["customer_portal_set_default_payment_method"]["Returns"]
  > | null,
): Promise<
  | DbFunctions["customer_portal_set_default_payment_method"]["Returns"]
  | null
  | boolean
> {
  if (options === null) {
    return callRpc(
      client,
      "customer_portal_set_default_payment_method",
      args,
      "customer_portal_set_default_payment_method",
      { fallbackValue: null },
    );
  }
  return callRpc(
    client,
    "customer_portal_set_default_payment_method",
    args,
    "customer_portal_set_default_payment_method",
    options,
  );
}

export async function getCustomerPortalOrganizationBySlug(
  client: TypedSupabaseClient,
  args: DbFunctions["get_customer_portal_organization_by_slug"]["Args"],
  options?: SupabaseRpcOptions<
    DbFunctions["get_customer_portal_organization_by_slug"]["Returns"]
  > | null,
): Promise<
  | DbFunctions["get_customer_portal_organization_by_slug"]["Returns"]
  | null
  | boolean
> {
  if (options === null) {
    return callRpc(
      client,
      "get_customer_portal_organization_by_slug",
      args,
      "get_customer_portal_organization_by_slug",
      { fallbackValue: null },
    );
  }
  return callRpc(
    client,
    "get_customer_portal_organization_by_slug",
    args,
    "get_customer_portal_organization_by_slug",
    options,
  );
}

export async function customerPortalRequestEmailChange(
  client: TypedSupabaseClient,
  args: DbFunctions["customer_portal_request_email_change"]["Args"],
  options?: SupabaseRpcOptions<
    DbFunctions["customer_portal_request_email_change"]["Returns"]
  > | null,
): Promise<
  | DbFunctions["customer_portal_request_email_change"]["Returns"]
  | null
  | boolean
> {
  if (options === null) {
    return callRpc(
      client,
      "customer_portal_request_email_change",
      args,
      "customer_portal_request_email_change",
      { fallbackValue: null },
    );
  }
  return callRpc(
    client,
    "customer_portal_request_email_change",
    args,
    "customer_portal_request_email_change",
    options,
  );
}

export async function customerPortalUpdateBillingProfile(
  client: TypedSupabaseClient,
  args: DbFunctions["customer_portal_update_billing_profile"]["Args"],
  options?: SupabaseRpcOptions<
    DbFunctions["customer_portal_update_billing_profile"]["Returns"]
  > | null,
): Promise<
  | DbFunctions["customer_portal_update_billing_profile"]["Returns"]
  | null
  | boolean
> {
  if (options === null) {
    return callRpc(
      client,
      "customer_portal_update_billing_profile",
      args,
      "customer_portal_update_billing_profile",
      { fallbackValue: null },
    );
  }
  return callRpc(
    client,
    "customer_portal_update_billing_profile",
    args,
    "customer_portal_update_billing_profile",
    options,
  );
}

export async function createDownloadUrl(
  client: TypedSupabaseClient,
  args: DbFunctions["create_download_url"]["Args"],
  options?: SupabaseRpcOptions<
    DbFunctions["create_download_url"]["Returns"]
  > | null,
): Promise<DbFunctions["create_download_url"]["Returns"] | null | boolean> {
  if (options === null) {
    return callRpc(client, "create_download_url", args, "create_download_url", {
      fallbackValue: null,
    });
  }
  return callRpc(
    client,
    "create_download_url",
    args,
    "create_download_url",
    options,
  );
}

export async function consumeCustomerPortalLaunchSession(
  client: TypedSupabaseClient,
  args: DbFunctions["consume_customer_portal_launch_session"]["Args"],
  options?: SupabaseRpcOptions<
    DbFunctions["consume_customer_portal_launch_session"]["Returns"]
  > | null,
): Promise<
  | DbFunctions["consume_customer_portal_launch_session"]["Returns"]
  | null
  | boolean
> {
  if (options === null) {
    return callRpc(
      client,
      "consume_customer_portal_launch_session",
      args,
      "consume_customer_portal_launch_session",
      { fallbackValue: null },
    );
  }
  return callRpc(
    client,
    "consume_customer_portal_launch_session",
    args,
    "consume_customer_portal_launch_session",
    options,
  );
}

export async function customerPortalCreateTrustedSession(
  client: TypedSupabaseClient,
  args: DbFunctions["customer_portal_create_trusted_session"]["Args"],
  options?: SupabaseRpcOptions<
    DbFunctions["customer_portal_create_trusted_session"]["Returns"]
  > | null,
): Promise<
  | DbFunctions["customer_portal_create_trusted_session"]["Returns"]
  | null
  | boolean
> {
  if (options === null) {
    return callRpc(
      client,
      "customer_portal_create_trusted_session",
      args,
      "customer_portal_create_trusted_session",
      { fallbackValue: null },
    );
  }
  return callRpc(
    client,
    "customer_portal_create_trusted_session",
    args,
    "customer_portal_create_trusted_session",
    options,
  );
}

export async function customerPortalLogout(
  client: TypedSupabaseClient,
  args: DbFunctions["customer_portal_logout"]["Args"],
  options?: SupabaseRpcOptions<
    DbFunctions["customer_portal_logout"]["Returns"]
  > | null,
): Promise<DbFunctions["customer_portal_logout"]["Returns"] | null | boolean> {
  if (options === null) {
    return callRpc(
      client,
      "customer_portal_logout",
      args,
      "customer_portal_logout",
      { fallbackValue: null },
    );
  }
  return callRpc(
    client,
    "customer_portal_logout",
    args,
    "customer_portal_logout",
    options,
  );
}

export async function customerPortalRateLimitAllow(
  client: TypedSupabaseClient,
  args: DbFunctions["customer_portal_rate_limit_allow"]["Args"],
  options?: SupabaseRpcOptions<
    DbFunctions["customer_portal_rate_limit_allow"]["Returns"]
  > | null,
): Promise<
  DbFunctions["customer_portal_rate_limit_allow"]["Returns"] | null | boolean
> {
  if (options === null) {
    return callRpc(
      client,
      "customer_portal_rate_limit_allow",
      args,
      "customer_portal_rate_limit_allow",
      { fallbackValue: null },
    );
  }
  return callRpc(
    client,
    "customer_portal_rate_limit_allow",
    args,
    "customer_portal_rate_limit_allow",
    options,
  );
}

export async function getBlockingCustomerObligations(
  client: TypedSupabaseClient,
  args: DbFunctions["get_blocking_customer_obligations"]["Args"],
  options?: SupabaseRpcOptions<
    DbFunctions["get_blocking_customer_obligations"]["Returns"]
  > | null,
): Promise<
  DbFunctions["get_blocking_customer_obligations"]["Returns"] | null | boolean
> {
  if (options === null) {
    return callRpc(
      client,
      "get_blocking_customer_obligations",
      args,
      "get_blocking_customer_obligations",
      { fallbackValue: null },
    );
  }
  return callRpc(
    client,
    "get_blocking_customer_obligations",
    args,
    "get_blocking_customer_obligations",
    options,
  );
}
