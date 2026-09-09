import { callRpc } from "../call-rpc.js";
import type { DbFunctions, TypedSupabaseClient } from "../types.js";
import type { SupabaseRpcOptions } from "@lomi./shared";

/** Admin metrics RPCs — inject platform-admin TypedSupabaseClient. */
export { rpc } from "../rpc.js";

export async function getAdminBalancesList(
  client: TypedSupabaseClient,
  args: DbFunctions["get_admin_balances_list"]["Args"],
  options?: SupabaseRpcOptions<DbFunctions["get_admin_balances_list"]["Returns"]> | null,
): Promise<DbFunctions["get_admin_balances_list"]["Returns"] | null | boolean> {
  if (options === null) {
    return callRpc(client, "get_admin_balances_list", args, "get_admin_balances_list", { fallbackValue: null });
  }
  return callRpc(client, "get_admin_balances_list", args, "get_admin_balances_list", options);
}

export async function getAdminBnplOverview(
  client: TypedSupabaseClient,
  args: DbFunctions["get_admin_bnpl_overview"]["Args"],
  options?: SupabaseRpcOptions<DbFunctions["get_admin_bnpl_overview"]["Returns"]> | null,
): Promise<DbFunctions["get_admin_bnpl_overview"]["Returns"] | null | boolean> {
  if (options === null) {
    return callRpc(client, "get_admin_bnpl_overview", args, "get_admin_bnpl_overview", { fallbackValue: null });
  }
  return callRpc(client, "get_admin_bnpl_overview", args, "get_admin_bnpl_overview", options);
}

export async function getAdminCustomers(
  client: TypedSupabaseClient,
  args: DbFunctions["get_admin_customers"]["Args"],
  options?: SupabaseRpcOptions<DbFunctions["get_admin_customers"]["Returns"]> | null,
): Promise<DbFunctions["get_admin_customers"]["Returns"] | null | boolean> {
  if (options === null) {
    return callRpc(client, "get_admin_customers", args, "get_admin_customers", { fallbackValue: null });
  }
  return callRpc(client, "get_admin_customers", args, "get_admin_customers", options);
}

export async function getAdminDashboardAccess(
  client: TypedSupabaseClient,
  args: DbFunctions["get_admin_dashboard_access"]["Args"],
  options?: SupabaseRpcOptions<DbFunctions["get_admin_dashboard_access"]["Returns"]> | null,
): Promise<DbFunctions["get_admin_dashboard_access"]["Returns"] | null | boolean> {
  if (options === null) {
    return callRpc(client, "get_admin_dashboard_access", args, "get_admin_dashboard_access", { fallbackValue: null });
  }
  return callRpc(client, "get_admin_dashboard_access", args, "get_admin_dashboard_access", options);
}

export async function getAdminDisputes(
  client: TypedSupabaseClient,
  args: DbFunctions["get_admin_disputes"]["Args"],
  options?: SupabaseRpcOptions<DbFunctions["get_admin_disputes"]["Returns"]> | null,
): Promise<DbFunctions["get_admin_disputes"]["Returns"] | null | boolean> {
  if (options === null) {
    return callRpc(client, "get_admin_disputes", args, "get_admin_disputes", { fallbackValue: null });
  }
  return callRpc(client, "get_admin_disputes", args, "get_admin_disputes", options);
}

export async function getAdminMerchantLtv(
  client: TypedSupabaseClient,
  args: DbFunctions["get_admin_merchant_ltv"]["Args"],
  options?: SupabaseRpcOptions<DbFunctions["get_admin_merchant_ltv"]["Returns"]> | null,
): Promise<DbFunctions["get_admin_merchant_ltv"]["Returns"] | null | boolean> {
  if (options === null) {
    return callRpc(client, "get_admin_merchant_ltv", args, "get_admin_merchant_ltv", { fallbackValue: null });
  }
  return callRpc(client, "get_admin_merchant_ltv", args, "get_admin_merchant_ltv", options);
}

export async function getAdminMerchantsList(
  client: TypedSupabaseClient,
  args: DbFunctions["get_admin_merchants_list"]["Args"],
  options?: SupabaseRpcOptions<DbFunctions["get_admin_merchants_list"]["Returns"]> | null,
): Promise<DbFunctions["get_admin_merchants_list"]["Returns"] | null | boolean> {
  if (options === null) {
    return callRpc(client, "get_admin_merchants_list", args, "get_admin_merchants_list", { fallbackValue: null });
  }
  return callRpc(client, "get_admin_merchants_list", args, "get_admin_merchants_list", options);
}

export async function getAdminOrganizationSettings(
  client: TypedSupabaseClient,
  args: DbFunctions["get_admin_organization_settings"]["Args"],
  options?: SupabaseRpcOptions<DbFunctions["get_admin_organization_settings"]["Returns"]> | null,
): Promise<DbFunctions["get_admin_organization_settings"]["Returns"] | null | boolean> {
  if (options === null) {
    return callRpc(client, "get_admin_organization_settings", args, "get_admin_organization_settings", { fallbackValue: null });
  }
  return callRpc(client, "get_admin_organization_settings", args, "get_admin_organization_settings", options);
}

export async function getAdminOrganizationsList(
  client: TypedSupabaseClient,
  args: DbFunctions["get_admin_organizations_list"]["Args"],
  options?: SupabaseRpcOptions<DbFunctions["get_admin_organizations_list"]["Returns"]> | null,
): Promise<DbFunctions["get_admin_organizations_list"]["Returns"] | null | boolean> {
  if (options === null) {
    return callRpc(client, "get_admin_organizations_list", args, "get_admin_organizations_list", { fallbackValue: null });
  }
  return callRpc(client, "get_admin_organizations_list", args, "get_admin_organizations_list", options);
}

export async function getAdminOrganizationsWithTiers(
  client: TypedSupabaseClient,
  args: DbFunctions["get_admin_organizations_with_tiers"]["Args"],
  options?: SupabaseRpcOptions<DbFunctions["get_admin_organizations_with_tiers"]["Returns"]> | null,
): Promise<DbFunctions["get_admin_organizations_with_tiers"]["Returns"] | null | boolean> {
  if (options === null) {
    return callRpc(client, "get_admin_organizations_with_tiers", args, "get_admin_organizations_with_tiers", { fallbackValue: null });
  }
  return callRpc(client, "get_admin_organizations_with_tiers", args, "get_admin_organizations_with_tiers", options);
}

export async function getAdminPartners(
  client: TypedSupabaseClient,
  args: DbFunctions["get_admin_partners"]["Args"],
  options?: SupabaseRpcOptions<DbFunctions["get_admin_partners"]["Returns"]> | null,
): Promise<DbFunctions["get_admin_partners"]["Returns"] | null | boolean> {
  if (options === null) {
    return callRpc(client, "get_admin_partners", args, "get_admin_partners", { fallbackValue: null });
  }
  return callRpc(client, "get_admin_partners", args, "get_admin_partners", options);
}

export async function getAdminRefundsList(
  client: TypedSupabaseClient,
  args: DbFunctions["get_admin_refunds_list"]["Args"],
  options?: SupabaseRpcOptions<DbFunctions["get_admin_refunds_list"]["Returns"]> | null,
): Promise<DbFunctions["get_admin_refunds_list"]["Returns"] | null | boolean> {
  if (options === null) {
    return callRpc(client, "get_admin_refunds_list", args, "get_admin_refunds_list", { fallbackValue: null });
  }
  return callRpc(client, "get_admin_refunds_list", args, "get_admin_refunds_list", options);
}

export async function getAdminTransactionsList(
  client: TypedSupabaseClient,
  args: DbFunctions["get_admin_transactions_list"]["Args"],
  options?: SupabaseRpcOptions<DbFunctions["get_admin_transactions_list"]["Returns"]> | null,
): Promise<DbFunctions["get_admin_transactions_list"]["Returns"] | null | boolean> {
  if (options === null) {
    return callRpc(client, "get_admin_transactions_list", args, "get_admin_transactions_list", { fallbackValue: null });
  }
  return callRpc(client, "get_admin_transactions_list", args, "get_admin_transactions_list", options);
}

export async function getAverageTransactionValueByDate(
  client: TypedSupabaseClient,
  args: DbFunctions["get_average_transaction_value_by_date"]["Args"],
  options?: SupabaseRpcOptions<DbFunctions["get_average_transaction_value_by_date"]["Returns"]> | null,
): Promise<DbFunctions["get_average_transaction_value_by_date"]["Returns"] | null | boolean> {
  if (options === null) {
    return callRpc(client, "get_average_transaction_value_by_date", args, "get_average_transaction_value_by_date", { fallbackValue: null });
  }
  return callRpc(client, "get_average_transaction_value_by_date", args, "get_average_transaction_value_by_date", options);
}

export async function getChannelBalanceAdjustments(
  client: TypedSupabaseClient,
  args: DbFunctions["get_channel_balance_adjustments"]["Args"],
  options?: SupabaseRpcOptions<DbFunctions["get_channel_balance_adjustments"]["Returns"]> | null,
): Promise<DbFunctions["get_channel_balance_adjustments"]["Returns"] | null | boolean> {
  if (options === null) {
    return callRpc(client, "get_channel_balance_adjustments", args, "get_channel_balance_adjustments", { fallbackValue: null });
  }
  return callRpc(client, "get_channel_balance_adjustments", args, "get_channel_balance_adjustments", options);
}

export async function getChannelMixByDate(
  client: TypedSupabaseClient,
  args: DbFunctions["get_channel_mix_by_date"]["Args"],
  options?: SupabaseRpcOptions<DbFunctions["get_channel_mix_by_date"]["Returns"]> | null,
): Promise<DbFunctions["get_channel_mix_by_date"]["Returns"] | null | boolean> {
  if (options === null) {
    return callRpc(client, "get_channel_mix_by_date", args, "get_channel_mix_by_date", { fallbackValue: null });
  }
  return callRpc(client, "get_channel_mix_by_date", args, "get_channel_mix_by_date", options);
}

export async function getCheckoutDurationDistribution(
  client: TypedSupabaseClient,
  args: DbFunctions["get_checkout_duration_distribution"]["Args"],
  options?: SupabaseRpcOptions<DbFunctions["get_checkout_duration_distribution"]["Returns"]> | null,
): Promise<DbFunctions["get_checkout_duration_distribution"]["Returns"] | null | boolean> {
  if (options === null) {
    return callRpc(client, "get_checkout_duration_distribution", args, "get_checkout_duration_distribution", { fallbackValue: null });
  }
  return callRpc(client, "get_checkout_duration_distribution", args, "get_checkout_duration_distribution", options);
}

export async function getCheckoutDurationStats(
  client: TypedSupabaseClient,
  args: DbFunctions["get_checkout_duration_stats"]["Args"],
  options?: SupabaseRpcOptions<DbFunctions["get_checkout_duration_stats"]["Returns"]> | null,
): Promise<DbFunctions["get_checkout_duration_stats"]["Returns"] | null | boolean> {
  if (options === null) {
    return callRpc(client, "get_checkout_duration_stats", args, "get_checkout_duration_stats", { fallbackValue: null });
  }
  return callRpc(client, "get_checkout_duration_stats", args, "get_checkout_duration_stats", options);
}

export async function getDetailedErrors(
  client: TypedSupabaseClient,
  args: DbFunctions["get_detailed_errors"]["Args"],
  options?: SupabaseRpcOptions<DbFunctions["get_detailed_errors"]["Returns"]> | null,
): Promise<DbFunctions["get_detailed_errors"]["Returns"] | null | boolean> {
  if (options === null) {
    return callRpc(client, "get_detailed_errors", args, "get_detailed_errors", { fallbackValue: null });
  }
  return callRpc(client, "get_detailed_errors", args, "get_detailed_errors", options);
}

export async function getGlobalRevenueByDate(
  client: TypedSupabaseClient,
  args: DbFunctions["get_global_revenue_by_date"]["Args"],
  options?: SupabaseRpcOptions<DbFunctions["get_global_revenue_by_date"]["Returns"]> | null,
): Promise<DbFunctions["get_global_revenue_by_date"]["Returns"] | null | boolean> {
  if (options === null) {
    return callRpc(client, "get_global_revenue_by_date", args, "get_global_revenue_by_date", { fallbackValue: null });
  }
  return callRpc(client, "get_global_revenue_by_date", args, "get_global_revenue_by_date", options);
}

export async function getGlobalTransactionStats(
  client: TypedSupabaseClient,
  args: DbFunctions["get_global_transaction_stats"]["Args"],
  options?: SupabaseRpcOptions<DbFunctions["get_global_transaction_stats"]["Returns"]> | null,
): Promise<DbFunctions["get_global_transaction_stats"]["Returns"] | null | boolean> {
  if (options === null) {
    return callRpc(client, "get_global_transaction_stats", args, "get_global_transaction_stats", { fallbackValue: null });
  }
  return callRpc(client, "get_global_transaction_stats", args, "get_global_transaction_stats", options);
}

export async function getGlobalTransactionVolumeByDate(
  client: TypedSupabaseClient,
  args: DbFunctions["get_global_transaction_volume_by_date"]["Args"],
  options?: SupabaseRpcOptions<DbFunctions["get_global_transaction_volume_by_date"]["Returns"]> | null,
): Promise<DbFunctions["get_global_transaction_volume_by_date"]["Returns"] | null | boolean> {
  if (options === null) {
    return callRpc(client, "get_global_transaction_volume_by_date", args, "get_global_transaction_volume_by_date", { fallbackValue: null });
  }
  return callRpc(client, "get_global_transaction_volume_by_date", args, "get_global_transaction_volume_by_date", options);
}

export async function getGrossRevenuePerTransactionByDate(
  client: TypedSupabaseClient,
  args: DbFunctions["get_gross_revenue_per_transaction_by_date"]["Args"],
  options?: SupabaseRpcOptions<DbFunctions["get_gross_revenue_per_transaction_by_date"]["Returns"]> | null,
): Promise<DbFunctions["get_gross_revenue_per_transaction_by_date"]["Returns"] | null | boolean> {
  if (options === null) {
    return callRpc(client, "get_gross_revenue_per_transaction_by_date", args, "get_gross_revenue_per_transaction_by_date", { fallbackValue: null });
  }
  return callRpc(client, "get_gross_revenue_per_transaction_by_date", args, "get_gross_revenue_per_transaction_by_date", options);
}

export async function getGtvConcentrationByDate(
  client: TypedSupabaseClient,
  args: DbFunctions["get_gtv_concentration_by_date"]["Args"],
  options?: SupabaseRpcOptions<DbFunctions["get_gtv_concentration_by_date"]["Returns"]> | null,
): Promise<DbFunctions["get_gtv_concentration_by_date"]["Returns"] | null | boolean> {
  if (options === null) {
    return callRpc(client, "get_gtv_concentration_by_date", args, "get_gtv_concentration_by_date", { fallbackValue: null });
  }
  return callRpc(client, "get_gtv_concentration_by_date", args, "get_gtv_concentration_by_date", options);
}

export async function getInvestorPerformanceByDate(
  client: TypedSupabaseClient,
  args: DbFunctions["get_investor_performance_by_date"]["Args"],
  options?: SupabaseRpcOptions<DbFunctions["get_investor_performance_by_date"]["Returns"]> | null,
): Promise<DbFunctions["get_investor_performance_by_date"]["Returns"] | null | boolean> {
  if (options === null) {
    return callRpc(client, "get_investor_performance_by_date", args, "get_investor_performance_by_date", { fallbackValue: null });
  }
  return callRpc(client, "get_investor_performance_by_date", args, "get_investor_performance_by_date", options);
}

export async function getMerchantHealthStats(
  client: TypedSupabaseClient,
  args: DbFunctions["get_merchant_health_stats"]["Args"],
  options?: SupabaseRpcOptions<DbFunctions["get_merchant_health_stats"]["Returns"]> | null,
): Promise<DbFunctions["get_merchant_health_stats"]["Returns"] | null | boolean> {
  if (options === null) {
    return callRpc(client, "get_merchant_health_stats", args, "get_merchant_health_stats", { fallbackValue: null });
  }
  return callRpc(client, "get_merchant_health_stats", args, "get_merchant_health_stats", options);
}

export async function getMerchantPipelineStats(
  client: TypedSupabaseClient,
  args: DbFunctions["get_merchant_pipeline_stats"]["Args"],
  options?: SupabaseRpcOptions<DbFunctions["get_merchant_pipeline_stats"]["Returns"]> | null,
): Promise<DbFunctions["get_merchant_pipeline_stats"]["Returns"] | null | boolean> {
  if (options === null) {
    return callRpc(client, "get_merchant_pipeline_stats", args, "get_merchant_pipeline_stats", { fallbackValue: null });
  }
  return callRpc(client, "get_merchant_pipeline_stats", args, "get_merchant_pipeline_stats", options);
}

export async function getMerchantRetentionByDate(
  client: TypedSupabaseClient,
  args: DbFunctions["get_merchant_retention_by_date"]["Args"],
  options?: SupabaseRpcOptions<DbFunctions["get_merchant_retention_by_date"]["Returns"]> | null,
): Promise<DbFunctions["get_merchant_retention_by_date"]["Returns"] | null | boolean> {
  if (options === null) {
    return callRpc(client, "get_merchant_retention_by_date", args, "get_merchant_retention_by_date", { fallbackValue: null });
  }
  return callRpc(client, "get_merchant_retention_by_date", args, "get_merchant_retention_by_date", options);
}

export async function getOrganizationStats(
  client: TypedSupabaseClient,
  args: DbFunctions["get_organization_stats"]["Args"],
  options?: SupabaseRpcOptions<DbFunctions["get_organization_stats"]["Returns"]> | null,
): Promise<DbFunctions["get_organization_stats"]["Returns"] | null | boolean> {
  if (options === null) {
    return callRpc(client, "get_organization_stats", args, "get_organization_stats", { fallbackValue: null });
  }
  return callRpc(client, "get_organization_stats", args, "get_organization_stats", options);
}

export async function getPaymentSuccessRatesByProvider(
  client: TypedSupabaseClient,
  args: DbFunctions["get_payment_success_rates_by_provider"]["Args"],
  options?: SupabaseRpcOptions<DbFunctions["get_payment_success_rates_by_provider"]["Returns"]> | null,
): Promise<DbFunctions["get_payment_success_rates_by_provider"]["Returns"] | null | boolean> {
  if (options === null) {
    return callRpc(client, "get_payment_success_rates_by_provider", args, "get_payment_success_rates_by_provider", { fallbackValue: null });
  }
  return callRpc(client, "get_payment_success_rates_by_provider", args, "get_payment_success_rates_by_provider", options);
}

export async function getPlatformChannelBalances(
  client: TypedSupabaseClient,
  args: DbFunctions["get_platform_channel_balances"]["Args"],
  options?: SupabaseRpcOptions<DbFunctions["get_platform_channel_balances"]["Returns"]> | null,
): Promise<DbFunctions["get_platform_channel_balances"]["Returns"] | null | boolean> {
  if (options === null) {
    return callRpc(client, "get_platform_channel_balances", args, "get_platform_channel_balances", { fallbackValue: null });
  }
  return callRpc(client, "get_platform_channel_balances", args, "get_platform_channel_balances", options);
}

export async function getPlatformErrorRates(
  client: TypedSupabaseClient,
  args: DbFunctions["get_platform_error_rates"]["Args"],
  options?: SupabaseRpcOptions<DbFunctions["get_platform_error_rates"]["Returns"]> | null,
): Promise<DbFunctions["get_platform_error_rates"]["Returns"] | null | boolean> {
  if (options === null) {
    return callRpc(client, "get_platform_error_rates", args, "get_platform_error_rates", { fallbackValue: null });
  }
  return callRpc(client, "get_platform_error_rates", args, "get_platform_error_rates", options);
}

export async function getPlatformExpenses(
  client: TypedSupabaseClient,
  args: DbFunctions["get_platform_expenses"]["Args"],
  options?: SupabaseRpcOptions<DbFunctions["get_platform_expenses"]["Returns"]> | null,
): Promise<DbFunctions["get_platform_expenses"]["Returns"] | null | boolean> {
  if (options === null) {
    return callRpc(client, "get_platform_expenses", args, "get_platform_expenses", { fallbackValue: null });
  }
  return callRpc(client, "get_platform_expenses", args, "get_platform_expenses", options);
}

export async function getPlatformFirstTransactionDate(
  client: TypedSupabaseClient,
  args: DbFunctions["get_platform_first_transaction_date"]["Args"],
  options?: SupabaseRpcOptions<DbFunctions["get_platform_first_transaction_date"]["Returns"]> | null,
): Promise<DbFunctions["get_platform_first_transaction_date"]["Returns"] | null | boolean> {
  if (options === null) {
    return callRpc(client, "get_platform_first_transaction_date", args, "get_platform_first_transaction_date", { fallbackValue: null });
  }
  return callRpc(client, "get_platform_first_transaction_date", args, "get_platform_first_transaction_date", options);
}

export async function getPlatformTreasurySummary(
  client: TypedSupabaseClient,
  args: DbFunctions["get_platform_treasury_summary"]["Args"],
  options?: SupabaseRpcOptions<DbFunctions["get_platform_treasury_summary"]["Returns"]> | null,
): Promise<DbFunctions["get_platform_treasury_summary"]["Returns"] | null | boolean> {
  if (options === null) {
    return callRpc(client, "get_platform_treasury_summary", args, "get_platform_treasury_summary", { fallbackValue: null });
  }
  return callRpc(client, "get_platform_treasury_summary", args, "get_platform_treasury_summary", options);
}

export async function getRevenuePerTransactionByChannel(
  client: TypedSupabaseClient,
  args: DbFunctions["get_revenue_per_transaction_by_channel"]["Args"],
  options?: SupabaseRpcOptions<DbFunctions["get_revenue_per_transaction_by_channel"]["Returns"]> | null,
): Promise<DbFunctions["get_revenue_per_transaction_by_channel"]["Returns"] | null | boolean> {
  if (options === null) {
    return callRpc(client, "get_revenue_per_transaction_by_channel", args, "get_revenue_per_transaction_by_channel", { fallbackValue: null });
  }
  return callRpc(client, "get_revenue_per_transaction_by_channel", args, "get_revenue_per_transaction_by_channel", options);
}

export async function getTransactionDistributionByHour(
  client: TypedSupabaseClient,
  args: DbFunctions["get_transaction_distribution_by_hour"]["Args"],
  options?: SupabaseRpcOptions<DbFunctions["get_transaction_distribution_by_hour"]["Returns"]> | null,
): Promise<DbFunctions["get_transaction_distribution_by_hour"]["Returns"] | null | boolean> {
  if (options === null) {
    return callRpc(client, "get_transaction_distribution_by_hour", args, "get_transaction_distribution_by_hour", { fallbackValue: null });
  }
  return callRpc(client, "get_transaction_distribution_by_hour", args, "get_transaction_distribution_by_hour", options);
}

export async function getTransactionsPerMerchantByDate(
  client: TypedSupabaseClient,
  args: DbFunctions["get_transactions_per_merchant_by_date"]["Args"],
  options?: SupabaseRpcOptions<DbFunctions["get_transactions_per_merchant_by_date"]["Returns"]> | null,
): Promise<DbFunctions["get_transactions_per_merchant_by_date"]["Returns"] | null | boolean> {
  if (options === null) {
    return callRpc(client, "get_transactions_per_merchant_by_date", args, "get_transactions_per_merchant_by_date", { fallbackValue: null });
  }
  return callRpc(client, "get_transactions_per_merchant_by_date", args, "get_transactions_per_merchant_by_date", options);
}

export async function getUncapturedRevenue(
  client: TypedSupabaseClient,
  args: DbFunctions["get_uncaptured_revenue"]["Args"],
  options?: SupabaseRpcOptions<DbFunctions["get_uncaptured_revenue"]["Returns"]> | null,
): Promise<DbFunctions["get_uncaptured_revenue"]["Returns"] | null | boolean> {
  if (options === null) {
    return callRpc(client, "get_uncaptured_revenue", args, "get_uncaptured_revenue", { fallbackValue: null });
  }
  return callRpc(client, "get_uncaptured_revenue", args, "get_uncaptured_revenue", options);
}

export async function getAverageMonthlyGrowthRate(
  client: TypedSupabaseClient,
  args: DbFunctions["get_average_monthly_growth_rate"]["Args"],
  options?: SupabaseRpcOptions<DbFunctions["get_average_monthly_growth_rate"]["Returns"]> | null,
): Promise<DbFunctions["get_average_monthly_growth_rate"]["Returns"] | null | boolean> {
  if (options === null) {
    return callRpc(client, "get_average_monthly_growth_rate", args, "get_average_monthly_growth_rate", { fallbackValue: null });
  }
  return callRpc(client, "get_average_monthly_growth_rate", args, "get_average_monthly_growth_rate", options);
}

export async function getPlatformGrowthStats(
  client: TypedSupabaseClient,
  args: DbFunctions["get_platform_growth_stats"]["Args"],
  options?: SupabaseRpcOptions<DbFunctions["get_platform_growth_stats"]["Returns"]> | null,
): Promise<DbFunctions["get_platform_growth_stats"]["Returns"] | null | boolean> {
  if (options === null) {
    return callRpc(client, "get_platform_growth_stats", args, "get_platform_growth_stats", { fallbackValue: null });
  }
  return callRpc(client, "get_platform_growth_stats", args, "get_platform_growth_stats", options);
}

export async function getRawAverageMonthlyGrowthRate(
  client: TypedSupabaseClient,
  args: DbFunctions["get_raw_average_monthly_growth_rate"]["Args"],
  options?: SupabaseRpcOptions<DbFunctions["get_raw_average_monthly_growth_rate"]["Returns"]> | null,
): Promise<DbFunctions["get_raw_average_monthly_growth_rate"]["Returns"] | null | boolean> {
  if (options === null) {
    return callRpc(client, "get_raw_average_monthly_growth_rate", args, "get_raw_average_monthly_growth_rate", { fallbackValue: null });
  }
  return callRpc(client, "get_raw_average_monthly_growth_rate", args, "get_raw_average_monthly_growth_rate", options);
}
