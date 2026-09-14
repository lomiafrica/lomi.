import { handleSupabaseRpc, type SupabaseRpcOptions } from "@lomi./shared";
import { rpc } from "./rpc.js";
import type { DbFunctions, TypedSupabaseClient } from "./types.js";
import { emptyRpcArgs } from "./call-rpc.js";

export async function addMobileMoneyPayoutMethod(
  client: TypedSupabaseClient,
  args?: DbFunctions["add_mobile_money_payout_method"]["Args"],
): Promise<DbFunctions["add_mobile_money_payout_method"]["Returns"] | null>;
export async function addMobileMoneyPayoutMethod(
  client: TypedSupabaseClient,
  args: DbFunctions["add_mobile_money_payout_method"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function addMobileMoneyPayoutMethod(
  client: TypedSupabaseClient,
  args: DbFunctions["add_mobile_money_payout_method"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["add_mobile_money_payout_method"]["Returns"]
  > | null,
): Promise<DbFunctions["add_mobile_money_payout_method"]["Returns"] | null>;
export async function addMobileMoneyPayoutMethod(
  client: TypedSupabaseClient,
  args: DbFunctions["add_mobile_money_payout_method"]["Args"] = emptyRpcArgs<"add_mobile_money_payout_method">(),
  options?: SupabaseRpcOptions<
    DbFunctions["add_mobile_money_payout_method"]["Returns"]
  > | null,
): Promise<
  DbFunctions["add_mobile_money_payout_method"]["Returns"] | null | boolean
> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "add_mobile_money_payout_method", args),
      "add_mobile_money_payout_method",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "add_mobile_money_payout_method", args),
      "add_mobile_money_payout_method",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "add_mobile_money_payout_method", args),
    "add_mobile_money_payout_method",
  );
}

export async function addWithdrawalNotificationEmail(
  client: TypedSupabaseClient,
  args?: DbFunctions["add_withdrawal_notification_email"]["Args"],
): Promise<DbFunctions["add_withdrawal_notification_email"]["Returns"] | null>;
export async function addWithdrawalNotificationEmail(
  client: TypedSupabaseClient,
  args: DbFunctions["add_withdrawal_notification_email"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function addWithdrawalNotificationEmail(
  client: TypedSupabaseClient,
  args: DbFunctions["add_withdrawal_notification_email"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["add_withdrawal_notification_email"]["Returns"]
  > | null,
): Promise<DbFunctions["add_withdrawal_notification_email"]["Returns"] | null>;
export async function addWithdrawalNotificationEmail(
  client: TypedSupabaseClient,
  args: DbFunctions["add_withdrawal_notification_email"]["Args"] = emptyRpcArgs<"add_withdrawal_notification_email">(),
  options?: SupabaseRpcOptions<
    DbFunctions["add_withdrawal_notification_email"]["Returns"]
  > | null,
): Promise<
  DbFunctions["add_withdrawal_notification_email"]["Returns"] | null | boolean
> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "add_withdrawal_notification_email", args),
      "add_withdrawal_notification_email",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "add_withdrawal_notification_email", args),
      "add_withdrawal_notification_email",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "add_withdrawal_notification_email", args),
    "add_withdrawal_notification_email",
  );
}

export async function createPayoutMethod(
  client: TypedSupabaseClient,
  args?: DbFunctions["create_payout_method"]["Args"],
): Promise<DbFunctions["create_payout_method"]["Returns"] | null>;
export async function createPayoutMethod(
  client: TypedSupabaseClient,
  args: DbFunctions["create_payout_method"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function createPayoutMethod(
  client: TypedSupabaseClient,
  args: DbFunctions["create_payout_method"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["create_payout_method"]["Returns"]
  > | null,
): Promise<DbFunctions["create_payout_method"]["Returns"] | null>;
export async function createPayoutMethod(
  client: TypedSupabaseClient,
  args: DbFunctions["create_payout_method"]["Args"] = emptyRpcArgs<"create_payout_method">(),
  options?: SupabaseRpcOptions<
    DbFunctions["create_payout_method"]["Returns"]
  > | null,
): Promise<DbFunctions["create_payout_method"]["Returns"] | null | boolean> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "create_payout_method", args),
      "create_payout_method",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "create_payout_method", args),
      "create_payout_method",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "create_payout_method", args),
    "create_payout_method",
  );
}

export async function deletePayoutMethod(
  client: TypedSupabaseClient,
  args?: DbFunctions["delete_payout_method"]["Args"],
): Promise<DbFunctions["delete_payout_method"]["Returns"] | null>;
export async function deletePayoutMethod(
  client: TypedSupabaseClient,
  args: DbFunctions["delete_payout_method"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function deletePayoutMethod(
  client: TypedSupabaseClient,
  args: DbFunctions["delete_payout_method"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["delete_payout_method"]["Returns"]
  > | null,
): Promise<DbFunctions["delete_payout_method"]["Returns"] | null>;
export async function deletePayoutMethod(
  client: TypedSupabaseClient,
  args: DbFunctions["delete_payout_method"]["Args"] = emptyRpcArgs<"delete_payout_method">(),
  options?: SupabaseRpcOptions<
    DbFunctions["delete_payout_method"]["Returns"]
  > | null,
): Promise<DbFunctions["delete_payout_method"]["Returns"] | null | boolean> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "delete_payout_method", args),
      "delete_payout_method",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "delete_payout_method", args),
      "delete_payout_method",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "delete_payout_method", args),
    "delete_payout_method",
  );
}

export async function fetchPayoutMethodDetails(
  client: TypedSupabaseClient,
  args?: DbFunctions["fetch_payout_method_details"]["Args"],
): Promise<DbFunctions["fetch_payout_method_details"]["Returns"] | null>;
export async function fetchPayoutMethodDetails(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_payout_method_details"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function fetchPayoutMethodDetails(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_payout_method_details"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["fetch_payout_method_details"]["Returns"]
  > | null,
): Promise<DbFunctions["fetch_payout_method_details"]["Returns"] | null>;
export async function fetchPayoutMethodDetails(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_payout_method_details"]["Args"] = emptyRpcArgs<"fetch_payout_method_details">(),
  options?: SupabaseRpcOptions<
    DbFunctions["fetch_payout_method_details"]["Returns"]
  > | null,
): Promise<
  DbFunctions["fetch_payout_method_details"]["Returns"] | null | boolean
> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "fetch_payout_method_details", args),
      "fetch_payout_method_details",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "fetch_payout_method_details", args),
      "fetch_payout_method_details",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "fetch_payout_method_details", args),
    "fetch_payout_method_details",
  );
}

export async function fetchPayoutMethods(
  client: TypedSupabaseClient,
  args?: DbFunctions["fetch_payout_methods"]["Args"],
): Promise<DbFunctions["fetch_payout_methods"]["Returns"] | null>;
export async function fetchPayoutMethods(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_payout_methods"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function fetchPayoutMethods(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_payout_methods"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["fetch_payout_methods"]["Returns"]
  > | null,
): Promise<DbFunctions["fetch_payout_methods"]["Returns"] | null>;
export async function fetchPayoutMethods(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_payout_methods"]["Args"] = emptyRpcArgs<"fetch_payout_methods">(),
  options?: SupabaseRpcOptions<
    DbFunctions["fetch_payout_methods"]["Returns"]
  > | null,
): Promise<DbFunctions["fetch_payout_methods"]["Returns"] | null | boolean> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "fetch_payout_methods", args),
      "fetch_payout_methods",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "fetch_payout_methods", args),
      "fetch_payout_methods",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "fetch_payout_methods", args),
    "fetch_payout_methods",
  );
}

export async function getWithdrawalNotificationEmails(
  client: TypedSupabaseClient,
  args?: DbFunctions["get_withdrawal_notification_emails"]["Args"],
): Promise<DbFunctions["get_withdrawal_notification_emails"]["Returns"] | null>;
export async function getWithdrawalNotificationEmails(
  client: TypedSupabaseClient,
  args: DbFunctions["get_withdrawal_notification_emails"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function getWithdrawalNotificationEmails(
  client: TypedSupabaseClient,
  args: DbFunctions["get_withdrawal_notification_emails"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["get_withdrawal_notification_emails"]["Returns"]
  > | null,
): Promise<DbFunctions["get_withdrawal_notification_emails"]["Returns"] | null>;
export async function getWithdrawalNotificationEmails(
  client: TypedSupabaseClient,
  args: DbFunctions["get_withdrawal_notification_emails"]["Args"] = emptyRpcArgs<"get_withdrawal_notification_emails">(),
  options?: SupabaseRpcOptions<
    DbFunctions["get_withdrawal_notification_emails"]["Returns"]
  > | null,
): Promise<
  DbFunctions["get_withdrawal_notification_emails"]["Returns"] | null | boolean
> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "get_withdrawal_notification_emails", args),
      "get_withdrawal_notification_emails",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "get_withdrawal_notification_emails", args),
      "get_withdrawal_notification_emails",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "get_withdrawal_notification_emails", args),
    "get_withdrawal_notification_emails",
  );
}

export async function removeWithdrawalNotificationEmail(
  client: TypedSupabaseClient,
  args?: DbFunctions["remove_withdrawal_notification_email"]["Args"],
): Promise<
  DbFunctions["remove_withdrawal_notification_email"]["Returns"] | null
>;
export async function removeWithdrawalNotificationEmail(
  client: TypedSupabaseClient,
  args: DbFunctions["remove_withdrawal_notification_email"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function removeWithdrawalNotificationEmail(
  client: TypedSupabaseClient,
  args: DbFunctions["remove_withdrawal_notification_email"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["remove_withdrawal_notification_email"]["Returns"]
  > | null,
): Promise<
  DbFunctions["remove_withdrawal_notification_email"]["Returns"] | null
>;
export async function removeWithdrawalNotificationEmail(
  client: TypedSupabaseClient,
  args: DbFunctions["remove_withdrawal_notification_email"]["Args"] = emptyRpcArgs<"remove_withdrawal_notification_email">(),
  options?: SupabaseRpcOptions<
    DbFunctions["remove_withdrawal_notification_email"]["Returns"]
  > | null,
): Promise<
  | DbFunctions["remove_withdrawal_notification_email"]["Returns"]
  | null
  | boolean
> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "remove_withdrawal_notification_email", args),
      "remove_withdrawal_notification_email",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "remove_withdrawal_notification_email", args),
      "remove_withdrawal_notification_email",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "remove_withdrawal_notification_email", args),
    "remove_withdrawal_notification_email",
  );
}

export async function setDefaultPayoutMethod(
  client: TypedSupabaseClient,
  args?: DbFunctions["set_default_payout_method"]["Args"],
): Promise<DbFunctions["set_default_payout_method"]["Returns"] | null>;
export async function setDefaultPayoutMethod(
  client: TypedSupabaseClient,
  args: DbFunctions["set_default_payout_method"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function setDefaultPayoutMethod(
  client: TypedSupabaseClient,
  args: DbFunctions["set_default_payout_method"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["set_default_payout_method"]["Returns"]
  > | null,
): Promise<DbFunctions["set_default_payout_method"]["Returns"] | null>;
export async function setDefaultPayoutMethod(
  client: TypedSupabaseClient,
  args: DbFunctions["set_default_payout_method"]["Args"] = emptyRpcArgs<"set_default_payout_method">(),
  options?: SupabaseRpcOptions<
    DbFunctions["set_default_payout_method"]["Returns"]
  > | null,
): Promise<
  DbFunctions["set_default_payout_method"]["Returns"] | null | boolean
> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "set_default_payout_method", args),
      "set_default_payout_method",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "set_default_payout_method", args),
      "set_default_payout_method",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "set_default_payout_method", args),
    "set_default_payout_method",
  );
}

export async function updateAutoWithdrawalSettings(
  client: TypedSupabaseClient,
  args?: DbFunctions["update_auto_withdrawal_settings"]["Args"],
): Promise<DbFunctions["update_auto_withdrawal_settings"]["Returns"] | null>;
export async function updateAutoWithdrawalSettings(
  client: TypedSupabaseClient,
  args: DbFunctions["update_auto_withdrawal_settings"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function updateAutoWithdrawalSettings(
  client: TypedSupabaseClient,
  args: DbFunctions["update_auto_withdrawal_settings"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["update_auto_withdrawal_settings"]["Returns"]
  > | null,
): Promise<DbFunctions["update_auto_withdrawal_settings"]["Returns"] | null>;
export async function updateAutoWithdrawalSettings(
  client: TypedSupabaseClient,
  args: DbFunctions["update_auto_withdrawal_settings"]["Args"] = emptyRpcArgs<"update_auto_withdrawal_settings">(),
  options?: SupabaseRpcOptions<
    DbFunctions["update_auto_withdrawal_settings"]["Returns"]
  > | null,
): Promise<
  DbFunctions["update_auto_withdrawal_settings"]["Returns"] | null | boolean
> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "update_auto_withdrawal_settings", args),
      "update_auto_withdrawal_settings",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "update_auto_withdrawal_settings", args),
      "update_auto_withdrawal_settings",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "update_auto_withdrawal_settings", args),
    "update_auto_withdrawal_settings",
  );
}
