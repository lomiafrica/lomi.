import { callRpc } from "../call-rpc.js";
import type { DbFunctions, TypedSupabaseClient } from "../types.js";
import type { SupabaseRpcOptions } from "@lomi./shared";

/** Admin overview RPCs — inject platform-admin TypedSupabaseClient. */
export { rpc } from "../rpc.js";

export async function adminCompleteAccountTopUp(
  client: TypedSupabaseClient,
  args: DbFunctions["admin_complete_account_top_up"]["Args"],
  options?: SupabaseRpcOptions<
    DbFunctions["admin_complete_account_top_up"]["Returns"]
  > | null,
): Promise<
  DbFunctions["admin_complete_account_top_up"]["Returns"] | null | boolean
> {
  if (options === null) {
    return callRpc(
      client,
      "admin_complete_account_top_up",
      args,
      "admin_complete_account_top_up",
      { fallbackValue: null },
    );
  }
  return callRpc(
    client,
    "admin_complete_account_top_up",
    args,
    "admin_complete_account_top_up",
    options,
  );
}

export async function adminCreatePartner(
  client: TypedSupabaseClient,
  args: DbFunctions["admin_create_partner"]["Args"],
  options?: SupabaseRpcOptions<
    DbFunctions["admin_create_partner"]["Returns"]
  > | null,
): Promise<DbFunctions["admin_create_partner"]["Returns"] | null | boolean> {
  if (options === null) {
    return callRpc(
      client,
      "admin_create_partner",
      args,
      "admin_create_partner",
      { fallbackValue: null },
    );
  }
  return callRpc(
    client,
    "admin_create_partner",
    args,
    "admin_create_partner",
    options,
  );
}

export async function adminDeleteBroadcastCampaign(
  client: TypedSupabaseClient,
  args: DbFunctions["admin_delete_broadcast_campaign"]["Args"],
  options?: SupabaseRpcOptions<
    DbFunctions["admin_delete_broadcast_campaign"]["Returns"]
  > | null,
): Promise<
  DbFunctions["admin_delete_broadcast_campaign"]["Returns"] | null | boolean
> {
  if (options === null) {
    return callRpc(
      client,
      "admin_delete_broadcast_campaign",
      args,
      "admin_delete_broadcast_campaign",
      { fallbackValue: null },
    );
  }
  return callRpc(
    client,
    "admin_delete_broadcast_campaign",
    args,
    "admin_delete_broadcast_campaign",
    options,
  );
}

export async function adminHoldTransaction(
  client: TypedSupabaseClient,
  args: DbFunctions["admin_hold_transaction"]["Args"],
  options?: SupabaseRpcOptions<
    DbFunctions["admin_hold_transaction"]["Returns"]
  > | null,
): Promise<DbFunctions["admin_hold_transaction"]["Returns"] | null | boolean> {
  if (options === null) {
    return callRpc(
      client,
      "admin_hold_transaction",
      args,
      "admin_hold_transaction",
      { fallbackValue: null },
    );
  }
  return callRpc(
    client,
    "admin_hold_transaction",
    args,
    "admin_hold_transaction",
    options,
  );
}

export async function adminReleaseHeldTransaction(
  client: TypedSupabaseClient,
  args: DbFunctions["admin_release_held_transaction"]["Args"],
  options?: SupabaseRpcOptions<
    DbFunctions["admin_release_held_transaction"]["Returns"]
  > | null,
): Promise<
  DbFunctions["admin_release_held_transaction"]["Returns"] | null | boolean
> {
  if (options === null) {
    return callRpc(
      client,
      "admin_release_held_transaction",
      args,
      "admin_release_held_transaction",
      { fallbackValue: null },
    );
  }
  return callRpc(
    client,
    "admin_release_held_transaction",
    args,
    "admin_release_held_transaction",
    options,
  );
}

export async function adminDeleteBroadcastCampaignForOrg(
  client: TypedSupabaseClient,
  args: DbFunctions["admin_delete_broadcast_campaign_for_org"]["Args"],
  options?: SupabaseRpcOptions<
    DbFunctions["admin_delete_broadcast_campaign_for_org"]["Returns"]
  > | null,
): Promise<
  | DbFunctions["admin_delete_broadcast_campaign_for_org"]["Returns"]
  | null
  | boolean
> {
  if (options === null) {
    return callRpc(
      client,
      "admin_delete_broadcast_campaign_for_org",
      args,
      "admin_delete_broadcast_campaign_for_org",
      { fallbackValue: null },
    );
  }
  return callRpc(
    client,
    "admin_delete_broadcast_campaign_for_org",
    args,
    "admin_delete_broadcast_campaign_for_org",
    options,
  );
}

export async function adminIssuePartnerManagementKey(
  client: TypedSupabaseClient,
  args: DbFunctions["admin_issue_partner_management_key"]["Args"],
  options?: SupabaseRpcOptions<
    DbFunctions["admin_issue_partner_management_key"]["Returns"]
  > | null,
): Promise<
  DbFunctions["admin_issue_partner_management_key"]["Returns"] | null | boolean
> {
  if (options === null) {
    return callRpc(
      client,
      "admin_issue_partner_management_key",
      args,
      "admin_issue_partner_management_key",
      { fallbackValue: null },
    );
  }
  return callRpc(
    client,
    "admin_issue_partner_management_key",
    args,
    "admin_issue_partner_management_key",
    options,
  );
}

export async function adminListBroadcastCampaignRecipients(
  client: TypedSupabaseClient,
  args: DbFunctions["admin_list_broadcast_campaign_recipients"]["Args"],
  options?: SupabaseRpcOptions<
    DbFunctions["admin_list_broadcast_campaign_recipients"]["Returns"]
  > | null,
): Promise<
  | DbFunctions["admin_list_broadcast_campaign_recipients"]["Returns"]
  | null
  | boolean
> {
  if (options === null) {
    return callRpc(
      client,
      "admin_list_broadcast_campaign_recipients",
      args,
      "admin_list_broadcast_campaign_recipients",
      { fallbackValue: null },
    );
  }
  return callRpc(
    client,
    "admin_list_broadcast_campaign_recipients",
    args,
    "admin_list_broadcast_campaign_recipients",
    options,
  );
}

export async function adminListBroadcastCampaigns(
  client: TypedSupabaseClient,
  args: DbFunctions["admin_list_broadcast_campaigns"]["Args"],
  options?: SupabaseRpcOptions<
    DbFunctions["admin_list_broadcast_campaigns"]["Returns"]
  > | null,
): Promise<
  DbFunctions["admin_list_broadcast_campaigns"]["Returns"] | null | boolean
> {
  if (options === null) {
    return callRpc(
      client,
      "admin_list_broadcast_campaigns",
      args,
      "admin_list_broadcast_campaigns",
      { fallbackValue: null },
    );
  }
  return callRpc(
    client,
    "admin_list_broadcast_campaigns",
    args,
    "admin_list_broadcast_campaigns",
    options,
  );
}

export async function adminListCheckoutSessionsForDisruption(
  client: TypedSupabaseClient,
  args: DbFunctions["admin_list_checkout_sessions_for_disruption"]["Args"],
  options?: SupabaseRpcOptions<
    DbFunctions["admin_list_checkout_sessions_for_disruption"]["Returns"]
  > | null,
): Promise<
  | DbFunctions["admin_list_checkout_sessions_for_disruption"]["Returns"]
  | null
  | boolean
> {
  if (options === null) {
    return callRpc(
      client,
      "admin_list_checkout_sessions_for_disruption",
      args,
      "admin_list_checkout_sessions_for_disruption",
      { fallbackValue: null },
    );
  }
  return callRpc(
    client,
    "admin_list_checkout_sessions_for_disruption",
    args,
    "admin_list_checkout_sessions_for_disruption",
    options,
  );
}

export async function adminRejectAccountTopUp(
  client: TypedSupabaseClient,
  args: DbFunctions["admin_reject_account_top_up"]["Args"],
  options?: SupabaseRpcOptions<
    DbFunctions["admin_reject_account_top_up"]["Returns"]
  > | null,
): Promise<
  DbFunctions["admin_reject_account_top_up"]["Returns"] | null | boolean
> {
  if (options === null) {
    return callRpc(
      client,
      "admin_reject_account_top_up",
      args,
      "admin_reject_account_top_up",
      { fallbackValue: null },
    );
  }
  return callRpc(
    client,
    "admin_reject_account_top_up",
    args,
    "admin_reject_account_top_up",
    options,
  );
}

export async function adminSendCustomerPaymentDisruption(
  client: TypedSupabaseClient,
  args: DbFunctions["admin_send_customer_payment_disruption"]["Args"],
  options?: SupabaseRpcOptions<
    DbFunctions["admin_send_customer_payment_disruption"]["Returns"]
  > | null,
): Promise<
  | DbFunctions["admin_send_customer_payment_disruption"]["Returns"]
  | null
  | boolean
> {
  if (options === null) {
    return callRpc(
      client,
      "admin_send_customer_payment_disruption",
      args,
      "admin_send_customer_payment_disruption",
      { fallbackValue: null },
    );
  }
  return callRpc(
    client,
    "admin_send_customer_payment_disruption",
    args,
    "admin_send_customer_payment_disruption",
    options,
  );
}

export async function adminSetAssistantOrgMessageLimit(
  client: TypedSupabaseClient,
  args: DbFunctions["admin_set_assistant_org_message_limit"]["Args"],
  options?: SupabaseRpcOptions<
    DbFunctions["admin_set_assistant_org_message_limit"]["Returns"]
  > | null,
): Promise<
  | DbFunctions["admin_set_assistant_org_message_limit"]["Returns"]
  | null
  | boolean
> {
  if (options === null) {
    return callRpc(
      client,
      "admin_set_assistant_org_message_limit",
      args,
      "admin_set_assistant_org_message_limit",
      { fallbackValue: null },
    );
  }
  return callRpc(
    client,
    "admin_set_assistant_org_message_limit",
    args,
    "admin_set_assistant_org_message_limit",
    options,
  );
}

export async function adminSetPartnerStatus(
  client: TypedSupabaseClient,
  args: DbFunctions["admin_set_partner_status"]["Args"],
  options?: SupabaseRpcOptions<
    DbFunctions["admin_set_partner_status"]["Returns"]
  > | null,
): Promise<
  DbFunctions["admin_set_partner_status"]["Returns"] | null | boolean
> {
  if (options === null) {
    return callRpc(
      client,
      "admin_set_partner_status",
      args,
      "admin_set_partner_status",
      { fallbackValue: null },
    );
  }
  return callRpc(
    client,
    "admin_set_partner_status",
    args,
    "admin_set_partner_status",
    options,
  );
}

export async function adminSyncStarterTierFromDefaults(
  client: TypedSupabaseClient,
  args: DbFunctions["admin_sync_starter_tier_from_defaults"]["Args"],
  options?: SupabaseRpcOptions<
    DbFunctions["admin_sync_starter_tier_from_defaults"]["Returns"]
  > | null,
): Promise<
  | DbFunctions["admin_sync_starter_tier_from_defaults"]["Returns"]
  | null
  | boolean
> {
  if (options === null) {
    return callRpc(
      client,
      "admin_sync_starter_tier_from_defaults",
      args,
      "admin_sync_starter_tier_from_defaults",
      { fallbackValue: null },
    );
  }
  return callRpc(
    client,
    "admin_sync_starter_tier_from_defaults",
    args,
    "admin_sync_starter_tier_from_defaults",
    options,
  );
}

export async function adminUpdateBankPayoutStatus(
  client: TypedSupabaseClient,
  args: DbFunctions["admin_update_bank_payout_status"]["Args"],
  options?: SupabaseRpcOptions<
    DbFunctions["admin_update_bank_payout_status"]["Returns"]
  > | null,
): Promise<
  DbFunctions["admin_update_bank_payout_status"]["Returns"] | null | boolean
> {
  if (options === null) {
    return callRpc(
      client,
      "admin_update_bank_payout_status",
      args,
      "admin_update_bank_payout_status",
      { fallbackValue: null },
    );
  }
  return callRpc(
    client,
    "admin_update_bank_payout_status",
    args,
    "admin_update_bank_payout_status",
    options,
  );
}

export async function adminUpdateBroadcastCampaign(
  client: TypedSupabaseClient,
  args: DbFunctions["admin_update_broadcast_campaign"]["Args"],
  options?: SupabaseRpcOptions<
    DbFunctions["admin_update_broadcast_campaign"]["Returns"]
  > | null,
): Promise<
  DbFunctions["admin_update_broadcast_campaign"]["Returns"] | null | boolean
> {
  if (options === null) {
    return callRpc(
      client,
      "admin_update_broadcast_campaign",
      args,
      "admin_update_broadcast_campaign",
      { fallbackValue: null },
    );
  }
  return callRpc(
    client,
    "admin_update_broadcast_campaign",
    args,
    "admin_update_broadcast_campaign",
    options,
  );
}

export async function adminUpdatePayoutMethodValidity(
  client: TypedSupabaseClient,
  args: DbFunctions["admin_update_payout_method_validity"]["Args"],
  options?: SupabaseRpcOptions<
    DbFunctions["admin_update_payout_method_validity"]["Returns"]
  > | null,
): Promise<
  DbFunctions["admin_update_payout_method_validity"]["Returns"] | null | boolean
> {
  if (options === null) {
    return callRpc(
      client,
      "admin_update_payout_method_validity",
      args,
      "admin_update_payout_method_validity",
      { fallbackValue: null },
    );
  }
  return callRpc(
    client,
    "admin_update_payout_method_validity",
    args,
    "admin_update_payout_method_validity",
    options,
  );
}

export async function getAdminAccountTopUpsList(
  client: TypedSupabaseClient,
  args: DbFunctions["get_admin_account_top_ups_list"]["Args"],
  options?: SupabaseRpcOptions<
    DbFunctions["get_admin_account_top_ups_list"]["Returns"]
  > | null,
): Promise<
  DbFunctions["get_admin_account_top_ups_list"]["Returns"] | null | boolean
> {
  if (options === null) {
    return callRpc(
      client,
      "get_admin_account_top_ups_list",
      args,
      "get_admin_account_top_ups_list",
      { fallbackValue: null },
    );
  }
  return callRpc(
    client,
    "get_admin_account_top_ups_list",
    args,
    "get_admin_account_top_ups_list",
    options,
  );
}

export async function getAdminBankPayoutsList(
  client: TypedSupabaseClient,
  args: DbFunctions["get_admin_bank_payouts_list"]["Args"],
  options?: SupabaseRpcOptions<
    DbFunctions["get_admin_bank_payouts_list"]["Returns"]
  > | null,
): Promise<
  DbFunctions["get_admin_bank_payouts_list"]["Returns"] | null | boolean
> {
  if (options === null) {
    return callRpc(
      client,
      "get_admin_bank_payouts_list",
      args,
      "get_admin_bank_payouts_list",
      { fallbackValue: null },
    );
  }
  return callRpc(
    client,
    "get_admin_bank_payouts_list",
    args,
    "get_admin_bank_payouts_list",
    options,
  );
}

export async function getAdminPayoutMethodsList(
  client: TypedSupabaseClient,
  args: DbFunctions["get_admin_payout_methods_list"]["Args"],
  options?: SupabaseRpcOptions<
    DbFunctions["get_admin_payout_methods_list"]["Returns"]
  > | null,
): Promise<
  DbFunctions["get_admin_payout_methods_list"]["Returns"] | null | boolean
> {
  if (options === null) {
    return callRpc(
      client,
      "get_admin_payout_methods_list",
      args,
      "get_admin_payout_methods_list",
      { fallbackValue: null },
    );
  }
  return callRpc(
    client,
    "get_admin_payout_methods_list",
    args,
    "get_admin_payout_methods_list",
    options,
  );
}

export async function getAdminPayoutsList(
  client: TypedSupabaseClient,
  args: DbFunctions["get_admin_payouts_list"]["Args"],
  options?: SupabaseRpcOptions<
    DbFunctions["get_admin_payouts_list"]["Returns"]
  > | null,
): Promise<DbFunctions["get_admin_payouts_list"]["Returns"] | null | boolean> {
  if (options === null) {
    return callRpc(
      client,
      "get_admin_payouts_list",
      args,
      "get_admin_payouts_list",
      { fallbackValue: null },
    );
  }
  return callRpc(
    client,
    "get_admin_payouts_list",
    args,
    "get_admin_payouts_list",
    options,
  );
}

export async function getPayoutProcessingDashboard(
  client: TypedSupabaseClient,
  args: DbFunctions["get_payout_processing_dashboard"]["Args"],
  options?: SupabaseRpcOptions<
    DbFunctions["get_payout_processing_dashboard"]["Returns"]
  > | null,
): Promise<
  DbFunctions["get_payout_processing_dashboard"]["Returns"] | null | boolean
> {
  if (options === null) {
    return callRpc(
      client,
      "get_payout_processing_dashboard",
      args,
      "get_payout_processing_dashboard",
      { fallbackValue: null },
    );
  }
  return callRpc(
    client,
    "get_payout_processing_dashboard",
    args,
    "get_payout_processing_dashboard",
    options,
  );
}
