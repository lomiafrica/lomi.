import { callRpc } from "./call-rpc.js";
import type { DbFunctions, TypedSupabaseClient } from "./types.js";
import type { SupabaseRpcOptions } from "@lomi./shared";

/** Public anon checkout/storefront RPCs — inject anon TypedSupabaseClient. */
export { rpc } from "./rpc.js";

// Re-export overlapping merchant wrappers for one-import call sites
export { convertCurrencyForDisplay } from "./conversion.js";
export {
  createCheckoutSession,
  createCheckoutSessionFromPaymentLink,
} from "./checkout-settings-ops.js";
export { fetchOrganizationCheckoutSettings } from "./checkout-settings.js";
export { fetchProductFees, fetchProductPrices } from "./products-ops.js";
export { logWideEvent } from "./logs.js";

export async function applyCoupon(
  client: TypedSupabaseClient,
  args: DbFunctions["apply_coupon"]["Args"],
  options?: SupabaseRpcOptions<DbFunctions["apply_coupon"]["Returns"]> | null,
): Promise<DbFunctions["apply_coupon"]["Returns"] | null | boolean> {
  if (options === null) {
    return callRpc(client, "apply_coupon", args, "apply_coupon", { fallbackValue: null });
  }
  return callRpc(client, "apply_coupon", args, "apply_coupon", options);
}

export async function validateCouponForFrontend(
  client: TypedSupabaseClient,
  args: DbFunctions["validate_coupon_for_frontend"]["Args"],
  options?: SupabaseRpcOptions<DbFunctions["validate_coupon_for_frontend"]["Returns"]> | null,
): Promise<DbFunctions["validate_coupon_for_frontend"]["Returns"] | null | boolean> {
  if (options === null) {
    return callRpc(client, "validate_coupon_for_frontend", args, "validate_coupon_for_frontend", { fallbackValue: null });
  }
  return callRpc(client, "validate_coupon_for_frontend", args, "validate_coupon_for_frontend", options);
}

export async function createOrUpdateCustomer(
  client: TypedSupabaseClient,
  args: DbFunctions["create_or_update_customer"]["Args"],
  options?: SupabaseRpcOptions<DbFunctions["create_or_update_customer"]["Returns"]> | null,
): Promise<DbFunctions["create_or_update_customer"]["Returns"] | null | boolean> {
  if (options === null) {
    return callRpc(client, "create_or_update_customer", args, "create_or_update_customer", { fallbackValue: null });
  }
  return callRpc(client, "create_or_update_customer", args, "create_or_update_customer", options);
}

export async function fetchDataForCheckout(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_data_for_checkout"]["Args"],
  options?: SupabaseRpcOptions<DbFunctions["fetch_data_for_checkout"]["Returns"]> | null,
): Promise<DbFunctions["fetch_data_for_checkout"]["Returns"] | null | boolean> {
  if (options === null) {
    return callRpc(client, "fetch_data_for_checkout", args, "fetch_data_for_checkout", { fallbackValue: null });
  }
  return callRpc(client, "fetch_data_for_checkout", args, "fetch_data_for_checkout", options);
}

export async function fetchOrganizationDetailsCheckout(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_organization_details_checkout"]["Args"],
  options?: SupabaseRpcOptions<DbFunctions["fetch_organization_details_checkout"]["Returns"]> | null,
): Promise<DbFunctions["fetch_organization_details_checkout"]["Returns"] | null | boolean> {
  if (options === null) {
    return callRpc(client, "fetch_organization_details_checkout", args, "fetch_organization_details_checkout", { fallbackValue: null });
  }
  return callRpc(client, "fetch_organization_details_checkout", args, "fetch_organization_details_checkout", options);
}

export async function getMerchantFromOrganization(
  client: TypedSupabaseClient,
  args: DbFunctions["get_merchant_from_organization"]["Args"],
  options?: SupabaseRpcOptions<DbFunctions["get_merchant_from_organization"]["Returns"]> | null,
): Promise<DbFunctions["get_merchant_from_organization"]["Returns"] | null | boolean> {
  if (options === null) {
    return callRpc(client, "get_merchant_from_organization", args, "get_merchant_from_organization", { fallbackValue: null });
  }
  return callRpc(client, "get_merchant_from_organization", args, "get_merchant_from_organization", options);
}

export async function getCheckoutColors(
  client: TypedSupabaseClient,
  args: DbFunctions["get_checkout_colors"]["Args"],
  options?: SupabaseRpcOptions<DbFunctions["get_checkout_colors"]["Returns"]> | null,
): Promise<DbFunctions["get_checkout_colors"]["Returns"] | null | boolean> {
  if (options === null) {
    return callRpc(client, "get_checkout_colors", args, "get_checkout_colors", { fallbackValue: null });
  }
  return callRpc(client, "get_checkout_colors", args, "get_checkout_colors", options);
}

export async function getTransactionDigitalDeliverables(
  client: TypedSupabaseClient,
  args: { p_transaction_id: string },
  options?: SupabaseRpcOptions<
    DbFunctions["get_transaction_digital_deliverables"]["Returns"]
  > | null,
): Promise<
  DbFunctions["get_transaction_digital_deliverables"]["Returns"] | null | boolean
> {
  const rpcArgs = args as DbFunctions["get_transaction_digital_deliverables"]["Args"];
  if (options === null) {
    return callRpc(
      client,
      "get_transaction_digital_deliverables",
      rpcArgs,
      "get_transaction_digital_deliverables",
      { fallbackValue: null },
    );
  }
  return callRpc(
    client,
    "get_transaction_digital_deliverables",
    rpcArgs,
    "get_transaction_digital_deliverables",
    options,
  );
}

export async function getPostCheckoutDetails(
  client: TypedSupabaseClient,
  args: DbFunctions["get_post_checkout_details"]["Args"],
  options?: SupabaseRpcOptions<DbFunctions["get_post_checkout_details"]["Returns"]> | null,
): Promise<DbFunctions["get_post_checkout_details"]["Returns"] | null | boolean> {
  if (options === null) {
    return callRpc(client, "get_post_checkout_details", args, "get_post_checkout_details", { fallbackValue: null });
  }
  return callRpc(client, "get_post_checkout_details", args, "get_post_checkout_details", options);
}

export async function updateCheckoutSessionCustomer(
  client: TypedSupabaseClient,
  args: DbFunctions["update_checkout_session_customer"]["Args"],
  options?: SupabaseRpcOptions<DbFunctions["update_checkout_session_customer"]["Returns"]> | null,
): Promise<DbFunctions["update_checkout_session_customer"]["Returns"] | null | boolean> {
  if (options === null) {
    return callRpc(client, "update_checkout_session_customer", args, "update_checkout_session_customer", { fallbackValue: null });
  }
  return callRpc(client, "update_checkout_session_customer", args, "update_checkout_session_customer", options);
}

export async function recordPendingStripeTransaction(
  client: TypedSupabaseClient,
  args: DbFunctions["record_pending_stripe_transaction"]["Args"],
  options?: SupabaseRpcOptions<DbFunctions["record_pending_stripe_transaction"]["Returns"]> | null,
): Promise<DbFunctions["record_pending_stripe_transaction"]["Returns"] | null | boolean> {
  if (options === null) {
    return callRpc(client, "record_pending_stripe_transaction", args, "record_pending_stripe_transaction", { fallbackValue: null });
  }
  return callRpc(client, "record_pending_stripe_transaction", args, "record_pending_stripe_transaction", options);
}

export async function recordStripeCheckoutFailure(
  client: TypedSupabaseClient,
  args: DbFunctions["record_stripe_checkout_failure"]["Args"],
  options?: SupabaseRpcOptions<DbFunctions["record_stripe_checkout_failure"]["Returns"]> | null,
): Promise<DbFunctions["record_stripe_checkout_failure"]["Returns"] | null | boolean> {
  if (options === null) {
    return callRpc(client, "record_stripe_checkout_failure", args, "record_stripe_checkout_failure", { fallbackValue: null });
  }
  return callRpc(client, "record_stripe_checkout_failure", args, "record_stripe_checkout_failure", options);
}

export async function createMtnTransaction(
  client: TypedSupabaseClient,
  args: DbFunctions["create_mtn_transaction"]["Args"],
  options?: SupabaseRpcOptions<DbFunctions["create_mtn_transaction"]["Returns"]> | null,
): Promise<DbFunctions["create_mtn_transaction"]["Returns"] | null | boolean> {
  if (options === null) {
    return callRpc(client, "create_mtn_transaction", args, "create_mtn_transaction", { fallbackValue: null });
  }
  return callRpc(client, "create_mtn_transaction", args, "create_mtn_transaction", options);
}

export async function updateMtnProviderReference(
  client: TypedSupabaseClient,
  args: DbFunctions["update_mtn_provider_reference"]["Args"],
  options?: SupabaseRpcOptions<DbFunctions["update_mtn_provider_reference"]["Returns"]> | null,
): Promise<DbFunctions["update_mtn_provider_reference"]["Returns"] | null | boolean> {
  if (options === null) {
    return callRpc(client, "update_mtn_provider_reference", args, "update_mtn_provider_reference", { fallbackValue: null });
  }
  return callRpc(client, "update_mtn_provider_reference", args, "update_mtn_provider_reference", options);
}

export async function completeSubscriptionSignupWithoutPayment(
  client: TypedSupabaseClient,
  args: DbFunctions["complete_subscription_signup_without_payment"]["Args"],
  options?: SupabaseRpcOptions<DbFunctions["complete_subscription_signup_without_payment"]["Returns"]> | null,
): Promise<DbFunctions["complete_subscription_signup_without_payment"]["Returns"] | null | boolean> {
  if (options === null) {
    return callRpc(client, "complete_subscription_signup_without_payment", args, "complete_subscription_signup_without_payment", { fallbackValue: null });
  }
  return callRpc(client, "complete_subscription_signup_without_payment", args, "complete_subscription_signup_without_payment", options);
}

export async function fetchCheckoutProcessingFeeRates(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_checkout_processing_fee_rates"]["Args"],
  options?: SupabaseRpcOptions<DbFunctions["fetch_checkout_processing_fee_rates"]["Returns"]> | null,
): Promise<DbFunctions["fetch_checkout_processing_fee_rates"]["Returns"] | null | boolean> {
  if (options === null) {
    return callRpc(client, "fetch_checkout_processing_fee_rates", args, "fetch_checkout_processing_fee_rates", { fallbackValue: null });
  }
  return callRpc(client, "fetch_checkout_processing_fee_rates", args, "fetch_checkout_processing_fee_rates", options);
}

export async function resolveSubscriptionSignupTerms(
  client: TypedSupabaseClient,
  args: DbFunctions["resolve_subscription_signup_terms"]["Args"],
  options?: SupabaseRpcOptions<DbFunctions["resolve_subscription_signup_terms"]["Returns"]> | null,
): Promise<DbFunctions["resolve_subscription_signup_terms"]["Returns"] | null | boolean> {
  if (options === null) {
    return callRpc(client, "resolve_subscription_signup_terms", args, "resolve_subscription_signup_terms", { fallbackValue: null });
  }
  return callRpc(client, "resolve_subscription_signup_terms", args, "resolve_subscription_signup_terms", options);
}

export async function recordDownloadAccess(
  client: TypedSupabaseClient,
  args: DbFunctions["record_download_access"]["Args"],
  options?: SupabaseRpcOptions<DbFunctions["record_download_access"]["Returns"]> | null,
): Promise<DbFunctions["record_download_access"]["Returns"] | null | boolean> {
  if (options === null) {
    return callRpc(client, "record_download_access", args, "record_download_access", { fallbackValue: null });
  }
  return callRpc(client, "record_download_access", args, "record_download_access", options);
}

export async function validateDownloadAccessToken(
  client: TypedSupabaseClient,
  args: DbFunctions["validate_download_access_token"]["Args"],
  options?: SupabaseRpcOptions<DbFunctions["validate_download_access_token"]["Returns"]> | null,
): Promise<DbFunctions["validate_download_access_token"]["Returns"] | null | boolean> {
  if (options === null) {
    return callRpc(client, "validate_download_access_token", args, "validate_download_access_token", { fallbackValue: null });
  }
  return callRpc(client, "validate_download_access_token", args, "validate_download_access_token", options);
}
