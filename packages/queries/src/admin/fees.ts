import { callRpc } from "../call-rpc.js";
import type { DbFunctions, TypedSupabaseClient } from "../types.js";
import type { SupabaseRpcOptions } from "@lomi./shared";

/** Admin fees RPCs — inject platform-admin TypedSupabaseClient. */
export { rpc } from "../rpc.js";

export { convertCurrencyForDisplay } from "../conversion.js";
export {
  getOrganizationFeeStructure,
  getPlatformDefaultFees,
  getPricingTiers,
  organizationHasCustomFeeSchedule,
} from "../billing.js";
export { switchOrganizationPricingPlan } from "../organizations-ops.js";

export async function adminUpdatePlatformDefaultFee(
  client: TypedSupabaseClient,
  args: DbFunctions["admin_update_platform_default_fee"]["Args"],
  options?: SupabaseRpcOptions<
    DbFunctions["admin_update_platform_default_fee"]["Returns"]
  > | null,
): Promise<
  DbFunctions["admin_update_platform_default_fee"]["Returns"] | null | boolean
> {
  if (options === null) {
    return callRpc(
      client,
      "admin_update_platform_default_fee",
      args,
      "admin_update_platform_default_fee",
      { fallbackValue: null },
    );
  }
  return callRpc(
    client,
    "admin_update_platform_default_fee",
    args,
    "admin_update_platform_default_fee",
    options,
  );
}

export async function adminUpdatePricingTier(
  client: TypedSupabaseClient,
  args: DbFunctions["admin_update_pricing_tier"]["Args"],
  options?: SupabaseRpcOptions<
    DbFunctions["admin_update_pricing_tier"]["Returns"]
  > | null,
): Promise<
  DbFunctions["admin_update_pricing_tier"]["Returns"] | null | boolean
> {
  if (options === null) {
    return callRpc(
      client,
      "admin_update_pricing_tier",
      args,
      "admin_update_pricing_tier",
      { fallbackValue: null },
    );
  }
  return callRpc(
    client,
    "admin_update_pricing_tier",
    args,
    "admin_update_pricing_tier",
    options,
  );
}

export async function adminUpdateTierFee(
  client: TypedSupabaseClient,
  args: DbFunctions["admin_update_tier_fee"]["Args"],
  options?: SupabaseRpcOptions<
    DbFunctions["admin_update_tier_fee"]["Returns"]
  > | null,
): Promise<DbFunctions["admin_update_tier_fee"]["Returns"] | null | boolean> {
  if (options === null) {
    return callRpc(
      client,
      "admin_update_tier_fee",
      args,
      "admin_update_tier_fee",
      { fallbackValue: null },
    );
  }
  return callRpc(
    client,
    "admin_update_tier_fee",
    args,
    "admin_update_tier_fee",
    options,
  );
}

export async function comparePricingDefaultsVsStarter(
  client: TypedSupabaseClient,
  args: DbFunctions["compare_pricing_defaults_vs_starter"]["Args"],
  options?: SupabaseRpcOptions<
    DbFunctions["compare_pricing_defaults_vs_starter"]["Returns"]
  > | null,
): Promise<
  DbFunctions["compare_pricing_defaults_vs_starter"]["Returns"] | null | boolean
> {
  if (options === null) {
    return callRpc(
      client,
      "compare_pricing_defaults_vs_starter",
      args,
      "compare_pricing_defaults_vs_starter",
      { fallbackValue: null },
    );
  }
  return callRpc(
    client,
    "compare_pricing_defaults_vs_starter",
    args,
    "compare_pricing_defaults_vs_starter",
    options,
  );
}

export async function fetchOrganizationPaymentParameters(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_organization_payment_parameters"]["Args"],
  options?: SupabaseRpcOptions<
    DbFunctions["fetch_organization_payment_parameters"]["Returns"]
  > | null,
): Promise<
  | DbFunctions["fetch_organization_payment_parameters"]["Returns"]
  | null
  | boolean
> {
  if (options === null) {
    return callRpc(
      client,
      "fetch_organization_payment_parameters",
      args,
      "fetch_organization_payment_parameters",
      { fallbackValue: null },
    );
  }
  return callRpc(
    client,
    "fetch_organization_payment_parameters",
    args,
    "fetch_organization_payment_parameters",
    options,
  );
}

export async function getAdminFeedbackOverview(
  client: TypedSupabaseClient,
  args: DbFunctions["get_admin_feedback_overview"]["Args"],
  options?: SupabaseRpcOptions<
    DbFunctions["get_admin_feedback_overview"]["Returns"]
  > | null,
): Promise<
  DbFunctions["get_admin_feedback_overview"]["Returns"] | null | boolean
> {
  if (options === null) {
    return callRpc(
      client,
      "get_admin_feedback_overview",
      args,
      "get_admin_feedback_overview",
      { fallbackValue: null },
    );
  }
  return callRpc(
    client,
    "get_admin_feedback_overview",
    args,
    "get_admin_feedback_overview",
    options,
  );
}

export async function getFeeTakeRateByDate(
  client: TypedSupabaseClient,
  args: DbFunctions["get_fee_take_rate_by_date"]["Args"],
  options?: SupabaseRpcOptions<
    DbFunctions["get_fee_take_rate_by_date"]["Returns"]
  > | null,
): Promise<
  DbFunctions["get_fee_take_rate_by_date"]["Returns"] | null | boolean
> {
  if (options === null) {
    return callRpc(
      client,
      "get_fee_take_rate_by_date",
      args,
      "get_fee_take_rate_by_date",
      { fallbackValue: null },
    );
  }
  return callRpc(
    client,
    "get_fee_take_rate_by_date",
    args,
    "get_fee_take_rate_by_date",
    options,
  );
}

export async function getOrganizationPaymentAvailabilitySettings(
  client: TypedSupabaseClient,
  args: DbFunctions["get_organization_payment_availability_settings"]["Args"],
  options?: SupabaseRpcOptions<
    DbFunctions["get_organization_payment_availability_settings"]["Returns"]
  > | null,
): Promise<
  | DbFunctions["get_organization_payment_availability_settings"]["Returns"]
  | null
  | boolean
> {
  if (options === null) {
    return callRpc(
      client,
      "get_organization_payment_availability_settings",
      args,
      "get_organization_payment_availability_settings",
      { fallbackValue: null },
    );
  }
  return callRpc(
    client,
    "get_organization_payment_availability_settings",
    args,
    "get_organization_payment_availability_settings",
    options,
  );
}

export async function getPaymentProviderFees(
  client: TypedSupabaseClient,
  args: DbFunctions["get_payment_provider_fees"]["Args"],
  options?: SupabaseRpcOptions<
    DbFunctions["get_payment_provider_fees"]["Returns"]
  > | null,
): Promise<
  DbFunctions["get_payment_provider_fees"]["Returns"] | null | boolean
> {
  if (options === null) {
    return callRpc(
      client,
      "get_payment_provider_fees",
      args,
      "get_payment_provider_fees",
      { fallbackValue: null },
    );
  }
  return callRpc(
    client,
    "get_payment_provider_fees",
    args,
    "get_payment_provider_fees",
    options,
  );
}

export async function getSupportFeedbackVolumeByDate(
  client: TypedSupabaseClient,
  args: DbFunctions["get_support_feedback_volume_by_date"]["Args"],
  options?: SupabaseRpcOptions<
    DbFunctions["get_support_feedback_volume_by_date"]["Returns"]
  > | null,
): Promise<
  DbFunctions["get_support_feedback_volume_by_date"]["Returns"] | null | boolean
> {
  if (options === null) {
    return callRpc(
      client,
      "get_support_feedback_volume_by_date",
      args,
      "get_support_feedback_volume_by_date",
      { fallbackValue: null },
    );
  }
  return callRpc(
    client,
    "get_support_feedback_volume_by_date",
    args,
    "get_support_feedback_volume_by_date",
    options,
  );
}

export async function getTierFees(
  client: TypedSupabaseClient,
  args: DbFunctions["get_tier_fees"]["Args"],
  options?: SupabaseRpcOptions<DbFunctions["get_tier_fees"]["Returns"]> | null,
): Promise<DbFunctions["get_tier_fees"]["Returns"] | null | boolean> {
  if (options === null) {
    return callRpc(client, "get_tier_fees", args, "get_tier_fees", {
      fallbackValue: null,
    });
  }
  return callRpc(client, "get_tier_fees", args, "get_tier_fees", options);
}

export async function getTransactionFeeRevenueByDate(
  client: TypedSupabaseClient,
  args: DbFunctions["get_transaction_fee_revenue_by_date"]["Args"],
  options?: SupabaseRpcOptions<
    DbFunctions["get_transaction_fee_revenue_by_date"]["Returns"]
  > | null,
): Promise<
  DbFunctions["get_transaction_fee_revenue_by_date"]["Returns"] | null | boolean
> {
  if (options === null) {
    return callRpc(
      client,
      "get_transaction_fee_revenue_by_date",
      args,
      "get_transaction_fee_revenue_by_date",
      { fallbackValue: null },
    );
  }
  return callRpc(
    client,
    "get_transaction_fee_revenue_by_date",
    args,
    "get_transaction_fee_revenue_by_date",
    options,
  );
}

export async function reconcileOrganizationFeeRows(
  client: TypedSupabaseClient,
  args: DbFunctions["reconcile_organization_fee_rows"]["Args"],
  options?: SupabaseRpcOptions<
    DbFunctions["reconcile_organization_fee_rows"]["Returns"]
  > | null,
): Promise<
  DbFunctions["reconcile_organization_fee_rows"]["Returns"] | null | boolean
> {
  if (options === null) {
    return callRpc(
      client,
      "reconcile_organization_fee_rows",
      args,
      "reconcile_organization_fee_rows",
      { fallbackValue: null },
    );
  }
  return callRpc(
    client,
    "reconcile_organization_fee_rows",
    args,
    "reconcile_organization_fee_rows",
    options,
  );
}

export async function syncOrganizationFeesFromDefaults(
  client: TypedSupabaseClient,
  args: DbFunctions["sync_organization_fees_from_defaults"]["Args"],
  options?: SupabaseRpcOptions<
    DbFunctions["sync_organization_fees_from_defaults"]["Returns"]
  > | null,
): Promise<
  | DbFunctions["sync_organization_fees_from_defaults"]["Returns"]
  | null
  | boolean
> {
  if (options === null) {
    return callRpc(
      client,
      "sync_organization_fees_from_defaults",
      args,
      "sync_organization_fees_from_defaults",
      { fallbackValue: null },
    );
  }
  return callRpc(
    client,
    "sync_organization_fees_from_defaults",
    args,
    "sync_organization_fees_from_defaults",
    options,
  );
}

export async function updateFeedbackStatus(
  client: TypedSupabaseClient,
  args: DbFunctions["update_feedback_status"]["Args"],
  options?: SupabaseRpcOptions<
    DbFunctions["update_feedback_status"]["Returns"]
  > | null,
): Promise<DbFunctions["update_feedback_status"]["Returns"] | null | boolean> {
  if (options === null) {
    return callRpc(
      client,
      "update_feedback_status",
      args,
      "update_feedback_status",
      { fallbackValue: null },
    );
  }
  return callRpc(
    client,
    "update_feedback_status",
    args,
    "update_feedback_status",
    options,
  );
}

export async function updateOrganizationFee(
  client: TypedSupabaseClient,
  args: DbFunctions["update_organization_fee"]["Args"],
  options?: SupabaseRpcOptions<
    DbFunctions["update_organization_fee"]["Returns"]
  > | null,
): Promise<DbFunctions["update_organization_fee"]["Returns"] | null | boolean> {
  if (options === null) {
    return callRpc(
      client,
      "update_organization_fee",
      args,
      "update_organization_fee",
      { fallbackValue: null },
    );
  }
  return callRpc(
    client,
    "update_organization_fee",
    args,
    "update_organization_fee",
    options,
  );
}

export async function updateOrganizationPaymentParameters(
  client: TypedSupabaseClient,
  args: DbFunctions["update_organization_payment_parameters"]["Args"],
  options?: SupabaseRpcOptions<
    DbFunctions["update_organization_payment_parameters"]["Returns"]
  > | null,
): Promise<
  | DbFunctions["update_organization_payment_parameters"]["Returns"]
  | null
  | boolean
> {
  if (options === null) {
    return callRpc(
      client,
      "update_organization_payment_parameters",
      args,
      "update_organization_payment_parameters",
      { fallbackValue: null },
    );
  }
  return callRpc(
    client,
    "update_organization_payment_parameters",
    args,
    "update_organization_payment_parameters",
    options,
  );
}

export async function updatePaymentAvailabilityDelay(
  client: TypedSupabaseClient,
  args: DbFunctions["update_payment_availability_delay"]["Args"],
  options?: SupabaseRpcOptions<
    DbFunctions["update_payment_availability_delay"]["Returns"]
  > | null,
): Promise<
  DbFunctions["update_payment_availability_delay"]["Returns"] | null | boolean
> {
  if (options === null) {
    return callRpc(
      client,
      "update_payment_availability_delay",
      args,
      "update_payment_availability_delay",
      { fallbackValue: null },
    );
  }
  return callRpc(
    client,
    "update_payment_availability_delay",
    args,
    "update_payment_availability_delay",
    options,
  );
}

export async function updatePaymentProviderFee(
  client: TypedSupabaseClient,
  args: DbFunctions["update_payment_provider_fee"]["Args"],
  options?: SupabaseRpcOptions<
    DbFunctions["update_payment_provider_fee"]["Returns"]
  > | null,
): Promise<
  DbFunctions["update_payment_provider_fee"]["Returns"] | null | boolean
> {
  if (options === null) {
    return callRpc(
      client,
      "update_payment_provider_fee",
      args,
      "update_payment_provider_fee",
      { fallbackValue: null },
    );
  }
  return callRpc(
    client,
    "update_payment_provider_fee",
    args,
    "update_payment_provider_fee",
    options,
  );
}
