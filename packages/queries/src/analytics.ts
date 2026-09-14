import { handleSupabaseRpc, type SupabaseRpcOptions } from "@lomi./shared";
import { rpc } from "./rpc.js";
import type { DbFunctions, TypedSupabaseClient } from "./types.js";
import { emptyRpcArgs } from "./call-rpc.js";

export async function fetchActiveSubscriptionsCustomRange(
  client: TypedSupabaseClient,
  args?: DbFunctions["fetch_active_subscriptions_custom_range"]["Args"],
): Promise<
  DbFunctions["fetch_active_subscriptions_custom_range"]["Returns"] | null
>;
export async function fetchActiveSubscriptionsCustomRange(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_active_subscriptions_custom_range"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function fetchActiveSubscriptionsCustomRange(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_active_subscriptions_custom_range"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["fetch_active_subscriptions_custom_range"]["Returns"]
  > | null,
): Promise<
  DbFunctions["fetch_active_subscriptions_custom_range"]["Returns"] | null
>;
export async function fetchActiveSubscriptionsCustomRange(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_active_subscriptions_custom_range"]["Args"] = emptyRpcArgs<"fetch_active_subscriptions_custom_range">(),
  options?: SupabaseRpcOptions<
    DbFunctions["fetch_active_subscriptions_custom_range"]["Returns"]
  > | null,
): Promise<
  | DbFunctions["fetch_active_subscriptions_custom_range"]["Returns"]
  | null
  | boolean
> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "fetch_active_subscriptions_custom_range", args),
      "fetch_active_subscriptions_custom_range",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "fetch_active_subscriptions_custom_range", args),
      "fetch_active_subscriptions_custom_range",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "fetch_active_subscriptions_custom_range", args),
    "fetch_active_subscriptions_custom_range",
  );
}

export async function fetchAovMetricsCustomRange(
  client: TypedSupabaseClient,
  args?: DbFunctions["fetch_aov_metrics_custom_range"]["Args"],
): Promise<DbFunctions["fetch_aov_metrics_custom_range"]["Returns"] | null>;
export async function fetchAovMetricsCustomRange(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_aov_metrics_custom_range"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function fetchAovMetricsCustomRange(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_aov_metrics_custom_range"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["fetch_aov_metrics_custom_range"]["Returns"]
  > | null,
): Promise<DbFunctions["fetch_aov_metrics_custom_range"]["Returns"] | null>;
export async function fetchAovMetricsCustomRange(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_aov_metrics_custom_range"]["Args"] = emptyRpcArgs<"fetch_aov_metrics_custom_range">(),
  options?: SupabaseRpcOptions<
    DbFunctions["fetch_aov_metrics_custom_range"]["Returns"]
  > | null,
): Promise<
  DbFunctions["fetch_aov_metrics_custom_range"]["Returns"] | null | boolean
> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "fetch_aov_metrics_custom_range", args),
      "fetch_aov_metrics_custom_range",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "fetch_aov_metrics_custom_range", args),
      "fetch_aov_metrics_custom_range",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "fetch_aov_metrics_custom_range", args),
    "fetch_aov_metrics_custom_range",
  );
}

export async function fetchAverageRetentionRate(
  client: TypedSupabaseClient,
  args?: DbFunctions["fetch_average_retention_rate"]["Args"],
): Promise<DbFunctions["fetch_average_retention_rate"]["Returns"] | null>;
export async function fetchAverageRetentionRate(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_average_retention_rate"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function fetchAverageRetentionRate(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_average_retention_rate"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["fetch_average_retention_rate"]["Returns"]
  > | null,
): Promise<DbFunctions["fetch_average_retention_rate"]["Returns"] | null>;
export async function fetchAverageRetentionRate(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_average_retention_rate"]["Args"] = emptyRpcArgs<"fetch_average_retention_rate">(),
  options?: SupabaseRpcOptions<
    DbFunctions["fetch_average_retention_rate"]["Returns"]
  > | null,
): Promise<
  DbFunctions["fetch_average_retention_rate"]["Returns"] | null | boolean
> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "fetch_average_retention_rate", args),
      "fetch_average_retention_rate",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "fetch_average_retention_rate", args),
      "fetch_average_retention_rate",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "fetch_average_retention_rate", args),
    "fetch_average_retention_rate",
  );
}

export async function fetchDailySalesGridData(
  client: TypedSupabaseClient,
  args?: DbFunctions["fetch_daily_sales_grid_data"]["Args"],
): Promise<DbFunctions["fetch_daily_sales_grid_data"]["Returns"] | null>;
export async function fetchDailySalesGridData(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_daily_sales_grid_data"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function fetchDailySalesGridData(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_daily_sales_grid_data"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["fetch_daily_sales_grid_data"]["Returns"]
  > | null,
): Promise<DbFunctions["fetch_daily_sales_grid_data"]["Returns"] | null>;
export async function fetchDailySalesGridData(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_daily_sales_grid_data"]["Args"] = emptyRpcArgs<"fetch_daily_sales_grid_data">(),
  options?: SupabaseRpcOptions<
    DbFunctions["fetch_daily_sales_grid_data"]["Returns"]
  > | null,
): Promise<
  DbFunctions["fetch_daily_sales_grid_data"]["Returns"] | null | boolean
> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "fetch_daily_sales_grid_data", args),
      "fetch_daily_sales_grid_data",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "fetch_daily_sales_grid_data", args),
      "fetch_daily_sales_grid_data",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "fetch_daily_sales_grid_data", args),
    "fetch_daily_sales_grid_data",
  );
}

export async function fetchMrrMetricsCustomRange(
  client: TypedSupabaseClient,
  args?: DbFunctions["fetch_mrr_metrics_custom_range"]["Args"],
): Promise<DbFunctions["fetch_mrr_metrics_custom_range"]["Returns"] | null>;
export async function fetchMrrMetricsCustomRange(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_mrr_metrics_custom_range"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function fetchMrrMetricsCustomRange(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_mrr_metrics_custom_range"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["fetch_mrr_metrics_custom_range"]["Returns"]
  > | null,
): Promise<DbFunctions["fetch_mrr_metrics_custom_range"]["Returns"] | null>;
export async function fetchMrrMetricsCustomRange(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_mrr_metrics_custom_range"]["Args"] = emptyRpcArgs<"fetch_mrr_metrics_custom_range">(),
  options?: SupabaseRpcOptions<
    DbFunctions["fetch_mrr_metrics_custom_range"]["Returns"]
  > | null,
): Promise<
  DbFunctions["fetch_mrr_metrics_custom_range"]["Returns"] | null | boolean
> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "fetch_mrr_metrics_custom_range", args),
      "fetch_mrr_metrics_custom_range",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "fetch_mrr_metrics_custom_range", args),
      "fetch_mrr_metrics_custom_range",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "fetch_mrr_metrics_custom_range", args),
    "fetch_mrr_metrics_custom_range",
  );
}

export async function fetchRenewedSubscriptionsCustomRange(
  client: TypedSupabaseClient,
  args?: DbFunctions["fetch_renewed_subscriptions_custom_range"]["Args"],
): Promise<
  DbFunctions["fetch_renewed_subscriptions_custom_range"]["Returns"] | null
>;
export async function fetchRenewedSubscriptionsCustomRange(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_renewed_subscriptions_custom_range"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function fetchRenewedSubscriptionsCustomRange(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_renewed_subscriptions_custom_range"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["fetch_renewed_subscriptions_custom_range"]["Returns"]
  > | null,
): Promise<
  DbFunctions["fetch_renewed_subscriptions_custom_range"]["Returns"] | null
>;
export async function fetchRenewedSubscriptionsCustomRange(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_renewed_subscriptions_custom_range"]["Args"] = emptyRpcArgs<"fetch_renewed_subscriptions_custom_range">(),
  options?: SupabaseRpcOptions<
    DbFunctions["fetch_renewed_subscriptions_custom_range"]["Returns"]
  > | null,
): Promise<
  | DbFunctions["fetch_renewed_subscriptions_custom_range"]["Returns"]
  | null
  | boolean
> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "fetch_renewed_subscriptions_custom_range", args),
      "fetch_renewed_subscriptions_custom_range",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "fetch_renewed_subscriptions_custom_range", args),
      "fetch_renewed_subscriptions_custom_range",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "fetch_renewed_subscriptions_custom_range", args),
    "fetch_renewed_subscriptions_custom_range",
  );
}

export async function fetchRenewedSubscriptionsRevenueCustomRange(
  client: TypedSupabaseClient,
  args?: DbFunctions["fetch_renewed_subscriptions_revenue_custom_range"]["Args"],
): Promise<
  | DbFunctions["fetch_renewed_subscriptions_revenue_custom_range"]["Returns"]
  | null
>;
export async function fetchRenewedSubscriptionsRevenueCustomRange(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_renewed_subscriptions_revenue_custom_range"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function fetchRenewedSubscriptionsRevenueCustomRange(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_renewed_subscriptions_revenue_custom_range"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["fetch_renewed_subscriptions_revenue_custom_range"]["Returns"]
  > | null,
): Promise<
  | DbFunctions["fetch_renewed_subscriptions_revenue_custom_range"]["Returns"]
  | null
>;
export async function fetchRenewedSubscriptionsRevenueCustomRange(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_renewed_subscriptions_revenue_custom_range"]["Args"] = emptyRpcArgs<"fetch_renewed_subscriptions_revenue_custom_range">(),
  options?: SupabaseRpcOptions<
    DbFunctions["fetch_renewed_subscriptions_revenue_custom_range"]["Returns"]
  > | null,
): Promise<
  | DbFunctions["fetch_renewed_subscriptions_revenue_custom_range"]["Returns"]
  | null
  | boolean
> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "fetch_renewed_subscriptions_revenue_custom_range", args),
      "fetch_renewed_subscriptions_revenue_custom_range",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "fetch_renewed_subscriptions_revenue_custom_range", args),
      "fetch_renewed_subscriptions_revenue_custom_range",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "fetch_renewed_subscriptions_revenue_custom_range", args),
    "fetch_renewed_subscriptions_revenue_custom_range",
  );
}

export async function fetchRevenueCustomRange(
  client: TypedSupabaseClient,
  args?: DbFunctions["fetch_revenue_custom_range"]["Args"],
): Promise<DbFunctions["fetch_revenue_custom_range"]["Returns"] | null>;
export async function fetchRevenueCustomRange(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_revenue_custom_range"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function fetchRevenueCustomRange(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_revenue_custom_range"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["fetch_revenue_custom_range"]["Returns"]
  > | null,
): Promise<DbFunctions["fetch_revenue_custom_range"]["Returns"] | null>;
export async function fetchRevenueCustomRange(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_revenue_custom_range"]["Args"] = emptyRpcArgs<"fetch_revenue_custom_range">(),
  options?: SupabaseRpcOptions<
    DbFunctions["fetch_revenue_custom_range"]["Returns"]
  > | null,
): Promise<
  DbFunctions["fetch_revenue_custom_range"]["Returns"] | null | boolean
> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "fetch_revenue_custom_range", args),
      "fetch_revenue_custom_range",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "fetch_revenue_custom_range", args),
      "fetch_revenue_custom_range",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "fetch_revenue_custom_range", args),
    "fetch_revenue_custom_range",
  );
}

export async function fetchSubscriptionData(
  client: TypedSupabaseClient,
  args?: DbFunctions["fetch_subscription_data"]["Args"],
): Promise<DbFunctions["fetch_subscription_data"]["Returns"] | null>;
export async function fetchSubscriptionData(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_subscription_data"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function fetchSubscriptionData(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_subscription_data"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["fetch_subscription_data"]["Returns"]
  > | null,
): Promise<DbFunctions["fetch_subscription_data"]["Returns"] | null>;
export async function fetchSubscriptionData(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_subscription_data"]["Args"] = emptyRpcArgs<"fetch_subscription_data">(),
  options?: SupabaseRpcOptions<
    DbFunctions["fetch_subscription_data"]["Returns"]
  > | null,
): Promise<DbFunctions["fetch_subscription_data"]["Returns"] | null | boolean> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "fetch_subscription_data", args),
      "fetch_subscription_data",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "fetch_subscription_data", args),
      "fetch_subscription_data",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "fetch_subscription_data", args),
    "fetch_subscription_data",
  );
}

export async function fetchSubscriptionMetrics(
  client: TypedSupabaseClient,
  args?: DbFunctions["fetch_subscription_metrics"]["Args"],
): Promise<DbFunctions["fetch_subscription_metrics"]["Returns"] | null>;
export async function fetchSubscriptionMetrics(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_subscription_metrics"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function fetchSubscriptionMetrics(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_subscription_metrics"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["fetch_subscription_metrics"]["Returns"]
  > | null,
): Promise<DbFunctions["fetch_subscription_metrics"]["Returns"] | null>;
export async function fetchSubscriptionMetrics(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_subscription_metrics"]["Args"] = emptyRpcArgs<"fetch_subscription_metrics">(),
  options?: SupabaseRpcOptions<
    DbFunctions["fetch_subscription_metrics"]["Returns"]
  > | null,
): Promise<
  DbFunctions["fetch_subscription_metrics"]["Returns"] | null | boolean
> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "fetch_subscription_metrics", args),
      "fetch_subscription_metrics",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "fetch_subscription_metrics", args),
      "fetch_subscription_metrics",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "fetch_subscription_metrics", args),
    "fetch_subscription_metrics",
  );
}

export async function fetchSubscriptionRevenueCustomRange(
  client: TypedSupabaseClient,
  args?: DbFunctions["fetch_subscription_revenue_custom_range"]["Args"],
): Promise<
  DbFunctions["fetch_subscription_revenue_custom_range"]["Returns"] | null
>;
export async function fetchSubscriptionRevenueCustomRange(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_subscription_revenue_custom_range"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function fetchSubscriptionRevenueCustomRange(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_subscription_revenue_custom_range"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["fetch_subscription_revenue_custom_range"]["Returns"]
  > | null,
): Promise<
  DbFunctions["fetch_subscription_revenue_custom_range"]["Returns"] | null
>;
export async function fetchSubscriptionRevenueCustomRange(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_subscription_revenue_custom_range"]["Args"] = emptyRpcArgs<"fetch_subscription_revenue_custom_range">(),
  options?: SupabaseRpcOptions<
    DbFunctions["fetch_subscription_revenue_custom_range"]["Returns"]
  > | null,
): Promise<
  | DbFunctions["fetch_subscription_revenue_custom_range"]["Returns"]
  | null
  | boolean
> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "fetch_subscription_revenue_custom_range", args),
      "fetch_subscription_revenue_custom_range",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "fetch_subscription_revenue_custom_range", args),
      "fetch_subscription_revenue_custom_range",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "fetch_subscription_revenue_custom_range", args),
    "fetch_subscription_revenue_custom_range",
  );
}
