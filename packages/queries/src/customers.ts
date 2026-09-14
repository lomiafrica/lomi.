import { handleSupabaseRpc, type SupabaseRpcOptions } from "@lomi./shared";
import { rpc } from "./rpc.js";
import type { DbFunctions, TypedSupabaseClient } from "./types.js";
import { emptyRpcArgs } from "./call-rpc.js";

export async function createCustomer(
  client: TypedSupabaseClient,
  args?: DbFunctions["create_customer"]["Args"],
): Promise<DbFunctions["create_customer"]["Returns"] | null>;
export async function createCustomer(
  client: TypedSupabaseClient,
  args: DbFunctions["create_customer"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function createCustomer(
  client: TypedSupabaseClient,
  args: DbFunctions["create_customer"]["Args"],
  options: SupabaseRpcOptions<DbFunctions["create_customer"]["Returns"]> | null,
): Promise<DbFunctions["create_customer"]["Returns"] | null>;
export async function createCustomer(
  client: TypedSupabaseClient,
  args: DbFunctions["create_customer"]["Args"] = emptyRpcArgs<"create_customer">(),
  options?: SupabaseRpcOptions<
    DbFunctions["create_customer"]["Returns"]
  > | null,
): Promise<DbFunctions["create_customer"]["Returns"] | null | boolean> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "create_customer", args),
      "create_customer",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "create_customer", args),
      "create_customer",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "create_customer", args),
    "create_customer",
  );
}

export async function createCustomerPortalLaunchSession(
  client: TypedSupabaseClient,
  args?: DbFunctions["create_customer_portal_launch_session"]["Args"],
): Promise<
  DbFunctions["create_customer_portal_launch_session"]["Returns"] | null
>;
export async function createCustomerPortalLaunchSession(
  client: TypedSupabaseClient,
  args: DbFunctions["create_customer_portal_launch_session"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function createCustomerPortalLaunchSession(
  client: TypedSupabaseClient,
  args: DbFunctions["create_customer_portal_launch_session"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["create_customer_portal_launch_session"]["Returns"]
  > | null,
): Promise<
  DbFunctions["create_customer_portal_launch_session"]["Returns"] | null
>;
export async function createCustomerPortalLaunchSession(
  client: TypedSupabaseClient,
  args: DbFunctions["create_customer_portal_launch_session"]["Args"] = emptyRpcArgs<"create_customer_portal_launch_session">(),
  options?: SupabaseRpcOptions<
    DbFunctions["create_customer_portal_launch_session"]["Returns"]
  > | null,
): Promise<
  | DbFunctions["create_customer_portal_launch_session"]["Returns"]
  | null
  | boolean
> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "create_customer_portal_launch_session", args),
      "create_customer_portal_launch_session",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "create_customer_portal_launch_session", args),
      "create_customer_portal_launch_session",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "create_customer_portal_launch_session", args),
    "create_customer_portal_launch_session",
  );
}

export async function deleteCustomer(
  client: TypedSupabaseClient,
  args?: DbFunctions["delete_customer"]["Args"],
): Promise<DbFunctions["delete_customer"]["Returns"] | null>;
export async function deleteCustomer(
  client: TypedSupabaseClient,
  args: DbFunctions["delete_customer"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function deleteCustomer(
  client: TypedSupabaseClient,
  args: DbFunctions["delete_customer"]["Args"],
  options: SupabaseRpcOptions<DbFunctions["delete_customer"]["Returns"]> | null,
): Promise<DbFunctions["delete_customer"]["Returns"] | null>;
export async function deleteCustomer(
  client: TypedSupabaseClient,
  args: DbFunctions["delete_customer"]["Args"] = emptyRpcArgs<"delete_customer">(),
  options?: SupabaseRpcOptions<
    DbFunctions["delete_customer"]["Returns"]
  > | null,
): Promise<DbFunctions["delete_customer"]["Returns"] | null | boolean> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "delete_customer", args),
      "delete_customer",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "delete_customer", args),
      "delete_customer",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "delete_customer", args),
    "delete_customer",
  );
}

export async function exportCustomersByCriteria(
  client: TypedSupabaseClient,
  args?: DbFunctions["export_customers_by_criteria"]["Args"],
): Promise<DbFunctions["export_customers_by_criteria"]["Returns"] | null>;
export async function exportCustomersByCriteria(
  client: TypedSupabaseClient,
  args: DbFunctions["export_customers_by_criteria"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function exportCustomersByCriteria(
  client: TypedSupabaseClient,
  args: DbFunctions["export_customers_by_criteria"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["export_customers_by_criteria"]["Returns"]
  > | null,
): Promise<DbFunctions["export_customers_by_criteria"]["Returns"] | null>;
export async function exportCustomersByCriteria(
  client: TypedSupabaseClient,
  args: DbFunctions["export_customers_by_criteria"]["Args"] = emptyRpcArgs<"export_customers_by_criteria">(),
  options?: SupabaseRpcOptions<
    DbFunctions["export_customers_by_criteria"]["Returns"]
  > | null,
): Promise<
  DbFunctions["export_customers_by_criteria"]["Returns"] | null | boolean
> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "export_customers_by_criteria", args),
      "export_customers_by_criteria",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "export_customers_by_criteria", args),
      "export_customers_by_criteria",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "export_customers_by_criteria", args),
    "export_customers_by_criteria",
  );
}

export async function fetchAverageCustomerLifetimeValue(
  client: TypedSupabaseClient,
  args?: DbFunctions["fetch_average_customer_lifetime_value"]["Args"],
): Promise<
  DbFunctions["fetch_average_customer_lifetime_value"]["Returns"] | null
>;
export async function fetchAverageCustomerLifetimeValue(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_average_customer_lifetime_value"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function fetchAverageCustomerLifetimeValue(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_average_customer_lifetime_value"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["fetch_average_customer_lifetime_value"]["Returns"]
  > | null,
): Promise<
  DbFunctions["fetch_average_customer_lifetime_value"]["Returns"] | null
>;
export async function fetchAverageCustomerLifetimeValue(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_average_customer_lifetime_value"]["Args"] = emptyRpcArgs<"fetch_average_customer_lifetime_value">(),
  options?: SupabaseRpcOptions<
    DbFunctions["fetch_average_customer_lifetime_value"]["Returns"]
  > | null,
): Promise<
  | DbFunctions["fetch_average_customer_lifetime_value"]["Returns"]
  | null
  | boolean
> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "fetch_average_customer_lifetime_value", args),
      "fetch_average_customer_lifetime_value",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "fetch_average_customer_lifetime_value", args),
      "fetch_average_customer_lifetime_value",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "fetch_average_customer_lifetime_value", args),
    "fetch_average_customer_lifetime_value",
  );
}

export async function fetchCustomer(
  client: TypedSupabaseClient,
  args?: DbFunctions["fetch_customer"]["Args"],
): Promise<DbFunctions["fetch_customer"]["Returns"] | null>;
export async function fetchCustomer(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_customer"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function fetchCustomer(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_customer"]["Args"],
  options: SupabaseRpcOptions<DbFunctions["fetch_customer"]["Returns"]> | null,
): Promise<DbFunctions["fetch_customer"]["Returns"] | null>;
export async function fetchCustomer(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_customer"]["Args"] = emptyRpcArgs<"fetch_customer">(),
  options?: SupabaseRpcOptions<DbFunctions["fetch_customer"]["Returns"]> | null,
): Promise<DbFunctions["fetch_customer"]["Returns"] | null | boolean> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "fetch_customer", args),
      "fetch_customer",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "fetch_customer", args),
      "fetch_customer",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "fetch_customer", args),
    "fetch_customer",
  );
}

export async function fetchCustomerActivity(
  client: TypedSupabaseClient,
  args?: DbFunctions["fetch_customer_activity"]["Args"],
): Promise<DbFunctions["fetch_customer_activity"]["Returns"] | null>;
export async function fetchCustomerActivity(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_customer_activity"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function fetchCustomerActivity(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_customer_activity"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["fetch_customer_activity"]["Returns"]
  > | null,
): Promise<DbFunctions["fetch_customer_activity"]["Returns"] | null>;
export async function fetchCustomerActivity(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_customer_activity"]["Args"] = emptyRpcArgs<"fetch_customer_activity">(),
  options?: SupabaseRpcOptions<
    DbFunctions["fetch_customer_activity"]["Returns"]
  > | null,
): Promise<DbFunctions["fetch_customer_activity"]["Returns"] | null | boolean> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "fetch_customer_activity", args),
      "fetch_customer_activity",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "fetch_customer_activity", args),
      "fetch_customer_activity",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "fetch_customer_activity", args),
    "fetch_customer_activity",
  );
}

export async function fetchCustomerSubscriptions(
  client: TypedSupabaseClient,
  args?: DbFunctions["fetch_customer_subscriptions"]["Args"],
): Promise<DbFunctions["fetch_customer_subscriptions"]["Returns"] | null>;
export async function fetchCustomerSubscriptions(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_customer_subscriptions"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function fetchCustomerSubscriptions(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_customer_subscriptions"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["fetch_customer_subscriptions"]["Returns"]
  > | null,
): Promise<DbFunctions["fetch_customer_subscriptions"]["Returns"] | null>;
export async function fetchCustomerSubscriptions(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_customer_subscriptions"]["Args"] = emptyRpcArgs<"fetch_customer_subscriptions">(),
  options?: SupabaseRpcOptions<
    DbFunctions["fetch_customer_subscriptions"]["Returns"]
  > | null,
): Promise<
  DbFunctions["fetch_customer_subscriptions"]["Returns"] | null | boolean
> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "fetch_customer_subscriptions", args),
      "fetch_customer_subscriptions",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "fetch_customer_subscriptions", args),
      "fetch_customer_subscriptions",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "fetch_customer_subscriptions", args),
    "fetch_customer_subscriptions",
  );
}

export async function fetchCustomerTransactions(
  client: TypedSupabaseClient,
  args?: DbFunctions["fetch_customer_transactions"]["Args"],
): Promise<DbFunctions["fetch_customer_transactions"]["Returns"] | null>;
export async function fetchCustomerTransactions(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_customer_transactions"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function fetchCustomerTransactions(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_customer_transactions"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["fetch_customer_transactions"]["Returns"]
  > | null,
): Promise<DbFunctions["fetch_customer_transactions"]["Returns"] | null>;
export async function fetchCustomerTransactions(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_customer_transactions"]["Args"] = emptyRpcArgs<"fetch_customer_transactions">(),
  options?: SupabaseRpcOptions<
    DbFunctions["fetch_customer_transactions"]["Returns"]
  > | null,
): Promise<
  DbFunctions["fetch_customer_transactions"]["Returns"] | null | boolean
> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "fetch_customer_transactions", args),
      "fetch_customer_transactions",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "fetch_customer_transactions", args),
      "fetch_customer_transactions",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "fetch_customer_transactions", args),
    "fetch_customer_transactions",
  );
}

export async function fetchCustomers(
  client: TypedSupabaseClient,
  args?: DbFunctions["fetch_customers"]["Args"],
): Promise<DbFunctions["fetch_customers"]["Returns"] | null>;
export async function fetchCustomers(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_customers"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function fetchCustomers(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_customers"]["Args"],
  options: SupabaseRpcOptions<DbFunctions["fetch_customers"]["Returns"]> | null,
): Promise<DbFunctions["fetch_customers"]["Returns"] | null>;
export async function fetchCustomers(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_customers"]["Args"] = emptyRpcArgs<"fetch_customers">(),
  options?: SupabaseRpcOptions<
    DbFunctions["fetch_customers"]["Returns"]
  > | null,
): Promise<DbFunctions["fetch_customers"]["Returns"] | null | boolean> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "fetch_customers", args),
      "fetch_customers",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "fetch_customers", args),
      "fetch_customers",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "fetch_customers", args),
    "fetch_customers",
  );
}

export async function fetchCustomersWithStatus(
  client: TypedSupabaseClient,
  args?: DbFunctions["fetch_customers_with_status"]["Args"],
): Promise<DbFunctions["fetch_customers_with_status"]["Returns"] | null>;
export async function fetchCustomersWithStatus(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_customers_with_status"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function fetchCustomersWithStatus(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_customers_with_status"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["fetch_customers_with_status"]["Returns"]
  > | null,
): Promise<DbFunctions["fetch_customers_with_status"]["Returns"] | null>;
export async function fetchCustomersWithStatus(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_customers_with_status"]["Args"] = emptyRpcArgs<"fetch_customers_with_status">(),
  options?: SupabaseRpcOptions<
    DbFunctions["fetch_customers_with_status"]["Returns"]
  > | null,
): Promise<
  DbFunctions["fetch_customers_with_status"]["Returns"] | null | boolean
> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "fetch_customers_with_status", args),
      "fetch_customers_with_status",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "fetch_customers_with_status", args),
      "fetch_customers_with_status",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "fetch_customers_with_status", args),
    "fetch_customers_with_status",
  );
}

export async function fetchNetworkCustomers(
  client: TypedSupabaseClient,
  args?: DbFunctions["fetch_network_customers"]["Args"],
): Promise<DbFunctions["fetch_network_customers"]["Returns"] | null>;
export async function fetchNetworkCustomers(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_network_customers"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function fetchNetworkCustomers(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_network_customers"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["fetch_network_customers"]["Returns"]
  > | null,
): Promise<DbFunctions["fetch_network_customers"]["Returns"] | null>;
export async function fetchNetworkCustomers(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_network_customers"]["Args"] = emptyRpcArgs<"fetch_network_customers">(),
  options?: SupabaseRpcOptions<
    DbFunctions["fetch_network_customers"]["Returns"]
  > | null,
): Promise<DbFunctions["fetch_network_customers"]["Returns"] | null | boolean> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "fetch_network_customers", args),
      "fetch_network_customers",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "fetch_network_customers", args),
      "fetch_network_customers",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "fetch_network_customers", args),
    "fetch_network_customers",
  );
}

export async function fetchNewCustomerTrend(
  client: TypedSupabaseClient,
  args?: DbFunctions["fetch_new_customer_trend"]["Args"],
): Promise<DbFunctions["fetch_new_customer_trend"]["Returns"] | null>;
export async function fetchNewCustomerTrend(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_new_customer_trend"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function fetchNewCustomerTrend(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_new_customer_trend"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["fetch_new_customer_trend"]["Returns"]
  > | null,
): Promise<DbFunctions["fetch_new_customer_trend"]["Returns"] | null>;
export async function fetchNewCustomerTrend(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_new_customer_trend"]["Args"] = emptyRpcArgs<"fetch_new_customer_trend">(),
  options?: SupabaseRpcOptions<
    DbFunctions["fetch_new_customer_trend"]["Returns"]
  > | null,
): Promise<
  DbFunctions["fetch_new_customer_trend"]["Returns"] | null | boolean
> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "fetch_new_customer_trend", args),
      "fetch_new_customer_trend",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "fetch_new_customer_trend", args),
      "fetch_new_customer_trend",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "fetch_new_customer_trend", args),
    "fetch_new_customer_trend",
  );
}

export async function fetchRecurringCustomersRate(
  client: TypedSupabaseClient,
  args?: DbFunctions["fetch_recurring_customers_rate"]["Args"],
): Promise<DbFunctions["fetch_recurring_customers_rate"]["Returns"] | null>;
export async function fetchRecurringCustomersRate(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_recurring_customers_rate"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function fetchRecurringCustomersRate(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_recurring_customers_rate"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["fetch_recurring_customers_rate"]["Returns"]
  > | null,
): Promise<DbFunctions["fetch_recurring_customers_rate"]["Returns"] | null>;
export async function fetchRecurringCustomersRate(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_recurring_customers_rate"]["Args"] = emptyRpcArgs<"fetch_recurring_customers_rate">(),
  options?: SupabaseRpcOptions<
    DbFunctions["fetch_recurring_customers_rate"]["Returns"]
  > | null,
): Promise<
  DbFunctions["fetch_recurring_customers_rate"]["Returns"] | null | boolean
> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "fetch_recurring_customers_rate", args),
      "fetch_recurring_customers_rate",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "fetch_recurring_customers_rate", args),
      "fetch_recurring_customers_rate",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "fetch_recurring_customers_rate", args),
    "fetch_recurring_customers_rate",
  );
}

export async function fetchTopCustomersBySpend(
  client: TypedSupabaseClient,
  args?: DbFunctions["fetch_top_customers_by_spend"]["Args"],
): Promise<DbFunctions["fetch_top_customers_by_spend"]["Returns"] | null>;
export async function fetchTopCustomersBySpend(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_top_customers_by_spend"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function fetchTopCustomersBySpend(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_top_customers_by_spend"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["fetch_top_customers_by_spend"]["Returns"]
  > | null,
): Promise<DbFunctions["fetch_top_customers_by_spend"]["Returns"] | null>;
export async function fetchTopCustomersBySpend(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_top_customers_by_spend"]["Args"] = emptyRpcArgs<"fetch_top_customers_by_spend">(),
  options?: SupabaseRpcOptions<
    DbFunctions["fetch_top_customers_by_spend"]["Returns"]
  > | null,
): Promise<
  DbFunctions["fetch_top_customers_by_spend"]["Returns"] | null | boolean
> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "fetch_top_customers_by_spend", args),
      "fetch_top_customers_by_spend",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "fetch_top_customers_by_spend", args),
      "fetch_top_customers_by_spend",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "fetch_top_customers_by_spend", args),
    "fetch_top_customers_by_spend",
  );
}

export async function getCustomerSpiAlias(
  client: TypedSupabaseClient,
  args?: DbFunctions["get_customer_spi_alias"]["Args"],
): Promise<DbFunctions["get_customer_spi_alias"]["Returns"] | null>;
export async function getCustomerSpiAlias(
  client: TypedSupabaseClient,
  args: DbFunctions["get_customer_spi_alias"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function getCustomerSpiAlias(
  client: TypedSupabaseClient,
  args: DbFunctions["get_customer_spi_alias"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["get_customer_spi_alias"]["Returns"]
  > | null,
): Promise<DbFunctions["get_customer_spi_alias"]["Returns"] | null>;
export async function getCustomerSpiAlias(
  client: TypedSupabaseClient,
  args: DbFunctions["get_customer_spi_alias"]["Args"] = emptyRpcArgs<"get_customer_spi_alias">(),
  options?: SupabaseRpcOptions<
    DbFunctions["get_customer_spi_alias"]["Returns"]
  > | null,
): Promise<DbFunctions["get_customer_spi_alias"]["Returns"] | null | boolean> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "get_customer_spi_alias", args),
      "get_customer_spi_alias",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "get_customer_spi_alias", args),
      "get_customer_spi_alias",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "get_customer_spi_alias", args),
    "get_customer_spi_alias",
  );
}

export async function updateCustomer(
  client: TypedSupabaseClient,
  args?: DbFunctions["update_customer"]["Args"],
): Promise<DbFunctions["update_customer"]["Returns"] | null>;
export async function updateCustomer(
  client: TypedSupabaseClient,
  args: DbFunctions["update_customer"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function updateCustomer(
  client: TypedSupabaseClient,
  args: DbFunctions["update_customer"]["Args"],
  options: SupabaseRpcOptions<DbFunctions["update_customer"]["Returns"]> | null,
): Promise<DbFunctions["update_customer"]["Returns"] | null>;
export async function updateCustomer(
  client: TypedSupabaseClient,
  args: DbFunctions["update_customer"]["Args"] = emptyRpcArgs<"update_customer">(),
  options?: SupabaseRpcOptions<
    DbFunctions["update_customer"]["Returns"]
  > | null,
): Promise<DbFunctions["update_customer"]["Returns"] | null | boolean> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "update_customer", args),
      "update_customer",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "update_customer", args),
      "update_customer",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "update_customer", args),
    "update_customer",
  );
}

export async function updateCustomerInvoiceApi(
  client: TypedSupabaseClient,
  args?: DbFunctions["update_customer_invoice_api"]["Args"],
): Promise<DbFunctions["update_customer_invoice_api"]["Returns"] | null>;
export async function updateCustomerInvoiceApi(
  client: TypedSupabaseClient,
  args: DbFunctions["update_customer_invoice_api"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function updateCustomerInvoiceApi(
  client: TypedSupabaseClient,
  args: DbFunctions["update_customer_invoice_api"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["update_customer_invoice_api"]["Returns"]
  > | null,
): Promise<DbFunctions["update_customer_invoice_api"]["Returns"] | null>;
export async function updateCustomerInvoiceApi(
  client: TypedSupabaseClient,
  args: DbFunctions["update_customer_invoice_api"]["Args"] = emptyRpcArgs<"update_customer_invoice_api">(),
  options?: SupabaseRpcOptions<
    DbFunctions["update_customer_invoice_api"]["Returns"]
  > | null,
): Promise<
  DbFunctions["update_customer_invoice_api"]["Returns"] | null | boolean
> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "update_customer_invoice_api", args),
      "update_customer_invoice_api",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "update_customer_invoice_api", args),
      "update_customer_invoice_api",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "update_customer_invoice_api", args),
    "update_customer_invoice_api",
  );
}
