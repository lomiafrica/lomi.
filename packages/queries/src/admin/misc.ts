import { callRpc } from "../call-rpc.js";
import type { DbFunctions, TypedSupabaseClient } from "../types.js";
import type { SupabaseRpcOptions } from "@lomi./shared";

/** Admin misc RPCs — inject platform-admin TypedSupabaseClient. */
export { rpc } from "../rpc.js";

export async function broadcastNotification(
  client: TypedSupabaseClient,
  args: DbFunctions["broadcast_notification"]["Args"],
  options?: SupabaseRpcOptions<DbFunctions["broadcast_notification"]["Returns"]> | null,
): Promise<DbFunctions["broadcast_notification"]["Returns"] | null | boolean> {
  if (options === null) {
    return callRpc(client, "broadcast_notification", args, "broadcast_notification", { fallbackValue: null });
  }
  return callRpc(client, "broadcast_notification", args, "broadcast_notification", options);
}

export async function completeManualRefundRequest(
  client: TypedSupabaseClient,
  args: DbFunctions["complete_manual_refund_request"]["Args"],
  options?: SupabaseRpcOptions<DbFunctions["complete_manual_refund_request"]["Returns"]> | null,
): Promise<DbFunctions["complete_manual_refund_request"]["Returns"] | null | boolean> {
  if (options === null) {
    return callRpc(client, "complete_manual_refund_request", args, "complete_manual_refund_request", { fallbackValue: null });
  }
  return callRpc(client, "complete_manual_refund_request", args, "complete_manual_refund_request", options);
}

export async function getProfitabilityBaseline(
  client: TypedSupabaseClient,
  args: DbFunctions["get_profitability_baseline"]["Args"],
  options?: SupabaseRpcOptions<DbFunctions["get_profitability_baseline"]["Returns"]> | null,
): Promise<DbFunctions["get_profitability_baseline"]["Returns"] | null | boolean> {
  if (options === null) {
    return callRpc(client, "get_profitability_baseline", args, "get_profitability_baseline", { fallbackValue: null });
  }
  return callRpc(client, "get_profitability_baseline", args, "get_profitability_baseline", options);
}

export async function getProfitabilityBaselineForMonth(
  client: TypedSupabaseClient,
  args: DbFunctions["get_profitability_baseline_for_month"]["Args"],
  options?: SupabaseRpcOptions<DbFunctions["get_profitability_baseline_for_month"]["Returns"]> | null,
): Promise<DbFunctions["get_profitability_baseline_for_month"]["Returns"] | null | boolean> {
  if (options === null) {
    return callRpc(client, "get_profitability_baseline_for_month", args, "get_profitability_baseline_for_month", { fallbackValue: null });
  }
  return callRpc(client, "get_profitability_baseline_for_month", args, "get_profitability_baseline_for_month", options);
}

export async function managePlatformExpense(
  client: TypedSupabaseClient,
  args: DbFunctions["manage_platform_expense"]["Args"],
  options?: SupabaseRpcOptions<DbFunctions["manage_platform_expense"]["Returns"]> | null,
): Promise<DbFunctions["manage_platform_expense"]["Returns"] | null | boolean> {
  if (options === null) {
    return callRpc(client, "manage_platform_expense", args, "manage_platform_expense", { fallbackValue: null });
  }
  return callRpc(client, "manage_platform_expense", args, "manage_platform_expense", options);
}

export async function manualAdjustChannelBalance(
  client: TypedSupabaseClient,
  args: DbFunctions["manual_adjust_channel_balance"]["Args"],
  options?: SupabaseRpcOptions<DbFunctions["manual_adjust_channel_balance"]["Returns"]> | null,
): Promise<DbFunctions["manual_adjust_channel_balance"]["Returns"] | null | boolean> {
  if (options === null) {
    return callRpc(client, "manual_adjust_channel_balance", args, "manual_adjust_channel_balance", { fallbackValue: null });
  }
  return callRpc(client, "manual_adjust_channel_balance", args, "manual_adjust_channel_balance", options);
}

export async function restoreMerchant(
  client: TypedSupabaseClient,
  args: DbFunctions["restore_merchant"]["Args"],
  options?: SupabaseRpcOptions<DbFunctions["restore_merchant"]["Returns"]> | null,
): Promise<DbFunctions["restore_merchant"]["Returns"] | null | boolean> {
  if (options === null) {
    return callRpc(client, "restore_merchant", args, "restore_merchant", { fallbackValue: null });
  }
  return callRpc(client, "restore_merchant", args, "restore_merchant", options);
}

export async function rejectManualRefundRequest(
  client: TypedSupabaseClient,
  args: DbFunctions["reject_manual_refund_request"]["Args"],
  options?: SupabaseRpcOptions<DbFunctions["reject_manual_refund_request"]["Returns"]> | null,
): Promise<DbFunctions["reject_manual_refund_request"]["Returns"] | null | boolean> {
  if (options === null) {
    return callRpc(client, "reject_manual_refund_request", args, "reject_manual_refund_request", { fallbackValue: null });
  }
  return callRpc(client, "reject_manual_refund_request", args, "reject_manual_refund_request", options);
}

export async function updateAdminDashboardAccessConfig(
  client: TypedSupabaseClient,
  args: DbFunctions["update_admin_dashboard_access_config"]["Args"],
  options?: SupabaseRpcOptions<DbFunctions["update_admin_dashboard_access_config"]["Returns"]> | null,
): Promise<DbFunctions["update_admin_dashboard_access_config"]["Returns"] | null | boolean> {
  if (options === null) {
    return callRpc(client, "update_admin_dashboard_access_config", args, "update_admin_dashboard_access_config", { fallbackValue: null });
  }
  return callRpc(client, "update_admin_dashboard_access_config", args, "update_admin_dashboard_access_config", options);
}

export async function updateAdminOrganizationSettings(
  client: TypedSupabaseClient,
  args: DbFunctions["update_admin_organization_settings"]["Args"],
  options?: SupabaseRpcOptions<DbFunctions["update_admin_organization_settings"]["Returns"]> | null,
): Promise<DbFunctions["update_admin_organization_settings"]["Returns"] | null | boolean> {
  if (options === null) {
    return callRpc(client, "update_admin_organization_settings", args, "update_admin_organization_settings", { fallbackValue: null });
  }
  return callRpc(client, "update_admin_organization_settings", args, "update_admin_organization_settings", options);
}

export async function updatePlatformSettingJson(
  client: TypedSupabaseClient,
  args: DbFunctions["update_platform_setting_json"]["Args"],
  options?: SupabaseRpcOptions<DbFunctions["update_platform_setting_json"]["Returns"]> | null,
): Promise<DbFunctions["update_platform_setting_json"]["Returns"] | null | boolean> {
  if (options === null) {
    return callRpc(client, "update_platform_setting_json", args, "update_platform_setting_json", { fallbackValue: null });
  }
  return callRpc(client, "update_platform_setting_json", args, "update_platform_setting_json", options);
}
