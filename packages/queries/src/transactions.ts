import { handleSupabaseRpc, type SupabaseRpcOptions } from "@lomi./shared";
import { rpc } from "./rpc.js";
import type { DbFunctions, TypedSupabaseClient } from "./types.js";
import { emptyRpcArgs } from "./call-rpc.js";

export async function applyMtnPartialRefundCharges(
  client: TypedSupabaseClient,
  args?: DbFunctions["apply_mtn_partial_refund_charges"]["Args"],
): Promise<DbFunctions["apply_mtn_partial_refund_charges"]["Returns"] | null>;
export async function applyMtnPartialRefundCharges(
  client: TypedSupabaseClient,
  args: DbFunctions["apply_mtn_partial_refund_charges"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function applyMtnPartialRefundCharges(
  client: TypedSupabaseClient,
  args: DbFunctions["apply_mtn_partial_refund_charges"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["apply_mtn_partial_refund_charges"]["Returns"]
  > | null,
): Promise<DbFunctions["apply_mtn_partial_refund_charges"]["Returns"] | null>;
export async function applyMtnPartialRefundCharges(
  client: TypedSupabaseClient,
  args: DbFunctions["apply_mtn_partial_refund_charges"]["Args"] = emptyRpcArgs<"apply_mtn_partial_refund_charges">(),
  options?: SupabaseRpcOptions<
    DbFunctions["apply_mtn_partial_refund_charges"]["Returns"]
  > | null,
): Promise<
  DbFunctions["apply_mtn_partial_refund_charges"]["Returns"] | null | boolean
> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "apply_mtn_partial_refund_charges", args),
      "apply_mtn_partial_refund_charges",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "apply_mtn_partial_refund_charges", args),
      "apply_mtn_partial_refund_charges",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "apply_mtn_partial_refund_charges", args),
    "apply_mtn_partial_refund_charges",
  );
}

export async function applyWavePartialRefundCharges(
  client: TypedSupabaseClient,
  args?: DbFunctions["apply_wave_partial_refund_charges"]["Args"],
): Promise<DbFunctions["apply_wave_partial_refund_charges"]["Returns"] | null>;
export async function applyWavePartialRefundCharges(
  client: TypedSupabaseClient,
  args: DbFunctions["apply_wave_partial_refund_charges"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function applyWavePartialRefundCharges(
  client: TypedSupabaseClient,
  args: DbFunctions["apply_wave_partial_refund_charges"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["apply_wave_partial_refund_charges"]["Returns"]
  > | null,
): Promise<DbFunctions["apply_wave_partial_refund_charges"]["Returns"] | null>;
export async function applyWavePartialRefundCharges(
  client: TypedSupabaseClient,
  args: DbFunctions["apply_wave_partial_refund_charges"]["Args"] = emptyRpcArgs<"apply_wave_partial_refund_charges">(),
  options?: SupabaseRpcOptions<
    DbFunctions["apply_wave_partial_refund_charges"]["Returns"]
  > | null,
): Promise<
  DbFunctions["apply_wave_partial_refund_charges"]["Returns"] | null | boolean
> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "apply_wave_partial_refund_charges", args),
      "apply_wave_partial_refund_charges",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "apply_wave_partial_refund_charges", args),
      "apply_wave_partial_refund_charges",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "apply_wave_partial_refund_charges", args),
    "apply_wave_partial_refund_charges",
  );
}

export async function createMtnRefundRequest(
  client: TypedSupabaseClient,
  args?: DbFunctions["create_mtn_refund_request"]["Args"],
): Promise<DbFunctions["create_mtn_refund_request"]["Returns"] | null>;
export async function createMtnRefundRequest(
  client: TypedSupabaseClient,
  args: DbFunctions["create_mtn_refund_request"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function createMtnRefundRequest(
  client: TypedSupabaseClient,
  args: DbFunctions["create_mtn_refund_request"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["create_mtn_refund_request"]["Returns"]
  > | null,
): Promise<DbFunctions["create_mtn_refund_request"]["Returns"] | null>;
export async function createMtnRefundRequest(
  client: TypedSupabaseClient,
  args: DbFunctions["create_mtn_refund_request"]["Args"] = emptyRpcArgs<"create_mtn_refund_request">(),
  options?: SupabaseRpcOptions<
    DbFunctions["create_mtn_refund_request"]["Returns"]
  > | null,
): Promise<
  DbFunctions["create_mtn_refund_request"]["Returns"] | null | boolean
> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "create_mtn_refund_request", args),
      "create_mtn_refund_request",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "create_mtn_refund_request", args),
      "create_mtn_refund_request",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "create_mtn_refund_request", args),
    "create_mtn_refund_request",
  );
}

export async function createRefund(
  client: TypedSupabaseClient,
  args?: DbFunctions["create_refund"]["Args"],
): Promise<DbFunctions["create_refund"]["Returns"] | null>;
export async function createRefund(
  client: TypedSupabaseClient,
  args: DbFunctions["create_refund"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function createRefund(
  client: TypedSupabaseClient,
  args: DbFunctions["create_refund"]["Args"],
  options: SupabaseRpcOptions<DbFunctions["create_refund"]["Returns"]> | null,
): Promise<DbFunctions["create_refund"]["Returns"] | null>;
export async function createRefund(
  client: TypedSupabaseClient,
  args: DbFunctions["create_refund"]["Args"] = emptyRpcArgs<"create_refund">(),
  options?: SupabaseRpcOptions<DbFunctions["create_refund"]["Returns"]> | null,
): Promise<DbFunctions["create_refund"]["Returns"] | null | boolean> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "create_refund", args),
      "create_refund",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "create_refund", args),
      "create_refund",
      options,
    );
  }
  return handleSupabaseRpc(rpc(client, "create_refund", args), "create_refund");
}

export async function createWaveRefundRequest(
  client: TypedSupabaseClient,
  args?: DbFunctions["create_wave_refund_request"]["Args"],
): Promise<DbFunctions["create_wave_refund_request"]["Returns"] | null>;
export async function createWaveRefundRequest(
  client: TypedSupabaseClient,
  args: DbFunctions["create_wave_refund_request"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function createWaveRefundRequest(
  client: TypedSupabaseClient,
  args: DbFunctions["create_wave_refund_request"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["create_wave_refund_request"]["Returns"]
  > | null,
): Promise<DbFunctions["create_wave_refund_request"]["Returns"] | null>;
export async function createWaveRefundRequest(
  client: TypedSupabaseClient,
  args: DbFunctions["create_wave_refund_request"]["Args"] = emptyRpcArgs<"create_wave_refund_request">(),
  options?: SupabaseRpcOptions<
    DbFunctions["create_wave_refund_request"]["Returns"]
  > | null,
): Promise<
  DbFunctions["create_wave_refund_request"]["Returns"] | null | boolean
> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "create_wave_refund_request", args),
      "create_wave_refund_request",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "create_wave_refund_request", args),
      "create_wave_refund_request",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "create_wave_refund_request", args),
    "create_wave_refund_request",
  );
}

export async function fetchAverageTransactionValue(
  client: TypedSupabaseClient,
  args?: DbFunctions["fetch_average_transaction_value"]["Args"],
): Promise<DbFunctions["fetch_average_transaction_value"]["Returns"] | null>;
export async function fetchAverageTransactionValue(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_average_transaction_value"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function fetchAverageTransactionValue(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_average_transaction_value"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["fetch_average_transaction_value"]["Returns"]
  > | null,
): Promise<DbFunctions["fetch_average_transaction_value"]["Returns"] | null>;
export async function fetchAverageTransactionValue(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_average_transaction_value"]["Args"] = emptyRpcArgs<"fetch_average_transaction_value">(),
  options?: SupabaseRpcOptions<
    DbFunctions["fetch_average_transaction_value"]["Returns"]
  > | null,
): Promise<
  DbFunctions["fetch_average_transaction_value"]["Returns"] | null | boolean
> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "fetch_average_transaction_value", args),
      "fetch_average_transaction_value",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "fetch_average_transaction_value", args),
      "fetch_average_transaction_value",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "fetch_average_transaction_value", args),
    "fetch_average_transaction_value",
  );
}

export async function fetchCompletionRate(
  client: TypedSupabaseClient,
  args?: DbFunctions["fetch_completion_rate"]["Args"],
): Promise<DbFunctions["fetch_completion_rate"]["Returns"] | null>;
export async function fetchCompletionRate(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_completion_rate"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function fetchCompletionRate(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_completion_rate"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["fetch_completion_rate"]["Returns"]
  > | null,
): Promise<DbFunctions["fetch_completion_rate"]["Returns"] | null>;
export async function fetchCompletionRate(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_completion_rate"]["Args"] = emptyRpcArgs<"fetch_completion_rate">(),
  options?: SupabaseRpcOptions<
    DbFunctions["fetch_completion_rate"]["Returns"]
  > | null,
): Promise<DbFunctions["fetch_completion_rate"]["Returns"] | null | boolean> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "fetch_completion_rate", args),
      "fetch_completion_rate",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "fetch_completion_rate", args),
      "fetch_completion_rate",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "fetch_completion_rate", args),
    "fetch_completion_rate",
  );
}

export async function fetchGrossAmount(
  client: TypedSupabaseClient,
  args?: DbFunctions["fetch_gross_amount"]["Args"],
): Promise<DbFunctions["fetch_gross_amount"]["Returns"] | null>;
export async function fetchGrossAmount(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_gross_amount"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function fetchGrossAmount(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_gross_amount"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["fetch_gross_amount"]["Returns"]
  > | null,
): Promise<DbFunctions["fetch_gross_amount"]["Returns"] | null>;
export async function fetchGrossAmount(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_gross_amount"]["Args"] = emptyRpcArgs<"fetch_gross_amount">(),
  options?: SupabaseRpcOptions<
    DbFunctions["fetch_gross_amount"]["Returns"]
  > | null,
): Promise<DbFunctions["fetch_gross_amount"]["Returns"] | null | boolean> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "fetch_gross_amount", args),
      "fetch_gross_amount",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "fetch_gross_amount", args),
      "fetch_gross_amount",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "fetch_gross_amount", args),
    "fetch_gross_amount",
  );
}

export async function fetchNetworkTransactions(
  client: TypedSupabaseClient,
  args?: DbFunctions["fetch_network_transactions"]["Args"],
): Promise<DbFunctions["fetch_network_transactions"]["Returns"] | null>;
export async function fetchNetworkTransactions(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_network_transactions"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function fetchNetworkTransactions(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_network_transactions"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["fetch_network_transactions"]["Returns"]
  > | null,
): Promise<DbFunctions["fetch_network_transactions"]["Returns"] | null>;
export async function fetchNetworkTransactions(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_network_transactions"]["Args"] = emptyRpcArgs<"fetch_network_transactions">(),
  options?: SupabaseRpcOptions<
    DbFunctions["fetch_network_transactions"]["Returns"]
  > | null,
): Promise<
  DbFunctions["fetch_network_transactions"]["Returns"] | null | boolean
> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "fetch_network_transactions", args),
      "fetch_network_transactions",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "fetch_network_transactions", args),
      "fetch_network_transactions",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "fetch_network_transactions", args),
    "fetch_network_transactions",
  );
}

export async function fetchPayoutCount(
  client: TypedSupabaseClient,
  args?: DbFunctions["fetch_payout_count"]["Args"],
): Promise<DbFunctions["fetch_payout_count"]["Returns"] | null>;
export async function fetchPayoutCount(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_payout_count"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function fetchPayoutCount(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_payout_count"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["fetch_payout_count"]["Returns"]
  > | null,
): Promise<DbFunctions["fetch_payout_count"]["Returns"] | null>;
export async function fetchPayoutCount(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_payout_count"]["Args"] = emptyRpcArgs<"fetch_payout_count">(),
  options?: SupabaseRpcOptions<
    DbFunctions["fetch_payout_count"]["Returns"]
  > | null,
): Promise<DbFunctions["fetch_payout_count"]["Returns"] | null | boolean> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "fetch_payout_count", args),
      "fetch_payout_count",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "fetch_payout_count", args),
      "fetch_payout_count",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "fetch_payout_count", args),
    "fetch_payout_count",
  );
}

export async function fetchRecentOrders(
  client: TypedSupabaseClient,
  args?: DbFunctions["fetch_recent_orders"]["Args"],
): Promise<DbFunctions["fetch_recent_orders"]["Returns"] | null>;
export async function fetchRecentOrders(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_recent_orders"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function fetchRecentOrders(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_recent_orders"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["fetch_recent_orders"]["Returns"]
  > | null,
): Promise<DbFunctions["fetch_recent_orders"]["Returns"] | null>;
export async function fetchRecentOrders(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_recent_orders"]["Args"] = emptyRpcArgs<"fetch_recent_orders">(),
  options?: SupabaseRpcOptions<
    DbFunctions["fetch_recent_orders"]["Returns"]
  > | null,
): Promise<DbFunctions["fetch_recent_orders"]["Returns"] | null | boolean> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "fetch_recent_orders", args),
      "fetch_recent_orders",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "fetch_recent_orders", args),
      "fetch_recent_orders",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "fetch_recent_orders", args),
    "fetch_recent_orders",
  );
}

export async function fetchRefundImpactSummary(
  client: TypedSupabaseClient,
  args?: DbFunctions["fetch_refund_impact_summary"]["Args"],
): Promise<DbFunctions["fetch_refund_impact_summary"]["Returns"] | null>;
export async function fetchRefundImpactSummary(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_refund_impact_summary"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function fetchRefundImpactSummary(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_refund_impact_summary"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["fetch_refund_impact_summary"]["Returns"]
  > | null,
): Promise<DbFunctions["fetch_refund_impact_summary"]["Returns"] | null>;
export async function fetchRefundImpactSummary(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_refund_impact_summary"]["Args"] = emptyRpcArgs<"fetch_refund_impact_summary">(),
  options?: SupabaseRpcOptions<
    DbFunctions["fetch_refund_impact_summary"]["Returns"]
  > | null,
): Promise<
  DbFunctions["fetch_refund_impact_summary"]["Returns"] | null | boolean
> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "fetch_refund_impact_summary", args),
      "fetch_refund_impact_summary",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "fetch_refund_impact_summary", args),
      "fetch_refund_impact_summary",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "fetch_refund_impact_summary", args),
    "fetch_refund_impact_summary",
  );
}

export async function fetchSettlementTransactions(
  client: TypedSupabaseClient,
  args?: DbFunctions["fetch_settlement_transactions"]["Args"],
): Promise<DbFunctions["fetch_settlement_transactions"]["Returns"] | null>;
export async function fetchSettlementTransactions(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_settlement_transactions"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function fetchSettlementTransactions(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_settlement_transactions"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["fetch_settlement_transactions"]["Returns"]
  > | null,
): Promise<DbFunctions["fetch_settlement_transactions"]["Returns"] | null>;
export async function fetchSettlementTransactions(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_settlement_transactions"]["Args"] = emptyRpcArgs<"fetch_settlement_transactions">(),
  options?: SupabaseRpcOptions<
    DbFunctions["fetch_settlement_transactions"]["Returns"]
  > | null,
): Promise<
  DbFunctions["fetch_settlement_transactions"]["Returns"] | null | boolean
> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "fetch_settlement_transactions", args),
      "fetch_settlement_transactions",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "fetch_settlement_transactions", args),
      "fetch_settlement_transactions",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "fetch_settlement_transactions", args),
    "fetch_settlement_transactions",
  );
}

export async function fetchTotalIncomingAmount(
  client: TypedSupabaseClient,
  args?: DbFunctions["fetch_total_incoming_amount"]["Args"],
): Promise<DbFunctions["fetch_total_incoming_amount"]["Returns"] | null>;
export async function fetchTotalIncomingAmount(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_total_incoming_amount"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function fetchTotalIncomingAmount(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_total_incoming_amount"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["fetch_total_incoming_amount"]["Returns"]
  > | null,
): Promise<DbFunctions["fetch_total_incoming_amount"]["Returns"] | null>;
export async function fetchTotalIncomingAmount(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_total_incoming_amount"]["Args"] = emptyRpcArgs<"fetch_total_incoming_amount">(),
  options?: SupabaseRpcOptions<
    DbFunctions["fetch_total_incoming_amount"]["Returns"]
  > | null,
): Promise<
  DbFunctions["fetch_total_incoming_amount"]["Returns"] | null | boolean
> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "fetch_total_incoming_amount", args),
      "fetch_total_incoming_amount",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "fetch_total_incoming_amount", args),
      "fetch_total_incoming_amount",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "fetch_total_incoming_amount", args),
    "fetch_total_incoming_amount",
  );
}

export async function fetchTransactionActivity(
  client: TypedSupabaseClient,
  args?: DbFunctions["fetch_transaction_activity"]["Args"],
): Promise<DbFunctions["fetch_transaction_activity"]["Returns"] | null>;
export async function fetchTransactionActivity(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_transaction_activity"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function fetchTransactionActivity(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_transaction_activity"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["fetch_transaction_activity"]["Returns"]
  > | null,
): Promise<DbFunctions["fetch_transaction_activity"]["Returns"] | null>;
export async function fetchTransactionActivity(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_transaction_activity"]["Args"] = emptyRpcArgs<"fetch_transaction_activity">(),
  options?: SupabaseRpcOptions<
    DbFunctions["fetch_transaction_activity"]["Returns"]
  > | null,
): Promise<
  DbFunctions["fetch_transaction_activity"]["Returns"] | null | boolean
> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "fetch_transaction_activity", args),
      "fetch_transaction_activity",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "fetch_transaction_activity", args),
      "fetch_transaction_activity",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "fetch_transaction_activity", args),
    "fetch_transaction_activity",
  );
}

export async function fetchTransactionCount(
  client: TypedSupabaseClient,
  args?: DbFunctions["fetch_transaction_count"]["Args"],
): Promise<DbFunctions["fetch_transaction_count"]["Returns"] | null>;
export async function fetchTransactionCount(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_transaction_count"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function fetchTransactionCount(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_transaction_count"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["fetch_transaction_count"]["Returns"]
  > | null,
): Promise<DbFunctions["fetch_transaction_count"]["Returns"] | null>;
export async function fetchTransactionCount(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_transaction_count"]["Args"] = emptyRpcArgs<"fetch_transaction_count">(),
  options?: SupabaseRpcOptions<
    DbFunctions["fetch_transaction_count"]["Returns"]
  > | null,
): Promise<DbFunctions["fetch_transaction_count"]["Returns"] | null | boolean> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "fetch_transaction_count", args),
      "fetch_transaction_count",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "fetch_transaction_count", args),
      "fetch_transaction_count",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "fetch_transaction_count", args),
    "fetch_transaction_count",
  );
}

export async function fetchTransactionRadarHints(
  client: TypedSupabaseClient,
  args?: DbFunctions["fetch_transaction_radar_hints"]["Args"],
): Promise<DbFunctions["fetch_transaction_radar_hints"]["Returns"] | null>;
export async function fetchTransactionRadarHints(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_transaction_radar_hints"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function fetchTransactionRadarHints(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_transaction_radar_hints"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["fetch_transaction_radar_hints"]["Returns"]
  > | null,
): Promise<DbFunctions["fetch_transaction_radar_hints"]["Returns"] | null>;
export async function fetchTransactionRadarHints(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_transaction_radar_hints"]["Args"] = emptyRpcArgs<"fetch_transaction_radar_hints">(),
  options?: SupabaseRpcOptions<
    DbFunctions["fetch_transaction_radar_hints"]["Returns"]
  > | null,
): Promise<
  DbFunctions["fetch_transaction_radar_hints"]["Returns"] | null | boolean
> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "fetch_transaction_radar_hints", args),
      "fetch_transaction_radar_hints",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "fetch_transaction_radar_hints", args),
      "fetch_transaction_radar_hints",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "fetch_transaction_radar_hints", args),
    "fetch_transaction_radar_hints",
  );
}

export async function fetchTransactionVolumeCustomRange(
  client: TypedSupabaseClient,
  args?: DbFunctions["fetch_transaction_volume_custom_range"]["Args"],
): Promise<
  DbFunctions["fetch_transaction_volume_custom_range"]["Returns"] | null
>;
export async function fetchTransactionVolumeCustomRange(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_transaction_volume_custom_range"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function fetchTransactionVolumeCustomRange(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_transaction_volume_custom_range"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["fetch_transaction_volume_custom_range"]["Returns"]
  > | null,
): Promise<
  DbFunctions["fetch_transaction_volume_custom_range"]["Returns"] | null
>;
export async function fetchTransactionVolumeCustomRange(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_transaction_volume_custom_range"]["Args"] = emptyRpcArgs<"fetch_transaction_volume_custom_range">(),
  options?: SupabaseRpcOptions<
    DbFunctions["fetch_transaction_volume_custom_range"]["Returns"]
  > | null,
): Promise<
  | DbFunctions["fetch_transaction_volume_custom_range"]["Returns"]
  | null
  | boolean
> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "fetch_transaction_volume_custom_range", args),
      "fetch_transaction_volume_custom_range",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "fetch_transaction_volume_custom_range", args),
      "fetch_transaction_volume_custom_range",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "fetch_transaction_volume_custom_range", args),
    "fetch_transaction_volume_custom_range",
  );
}

export async function fetchTransactions(
  client: TypedSupabaseClient,
  args?: DbFunctions["fetch_transactions"]["Args"],
): Promise<DbFunctions["fetch_transactions"]["Returns"] | null>;
export async function fetchTransactions(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_transactions"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function fetchTransactions(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_transactions"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["fetch_transactions"]["Returns"]
  > | null,
): Promise<DbFunctions["fetch_transactions"]["Returns"] | null>;
export async function fetchTransactions(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_transactions"]["Args"] = emptyRpcArgs<"fetch_transactions">(),
  options?: SupabaseRpcOptions<
    DbFunctions["fetch_transactions"]["Returns"]
  > | null,
): Promise<DbFunctions["fetch_transactions"]["Returns"] | null | boolean> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "fetch_transactions", args),
      "fetch_transactions",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "fetch_transactions", args),
      "fetch_transactions",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "fetch_transactions", args),
    "fetch_transactions",
  );
}

export async function getQrCodeTransactions(
  client: TypedSupabaseClient,
  args?: DbFunctions["get_qr_code_transactions"]["Args"],
): Promise<DbFunctions["get_qr_code_transactions"]["Returns"] | null>;
export async function getQrCodeTransactions(
  client: TypedSupabaseClient,
  args: DbFunctions["get_qr_code_transactions"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function getQrCodeTransactions(
  client: TypedSupabaseClient,
  args: DbFunctions["get_qr_code_transactions"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["get_qr_code_transactions"]["Returns"]
  > | null,
): Promise<DbFunctions["get_qr_code_transactions"]["Returns"] | null>;
export async function getQrCodeTransactions(
  client: TypedSupabaseClient,
  args: DbFunctions["get_qr_code_transactions"]["Args"] = emptyRpcArgs<"get_qr_code_transactions">(),
  options?: SupabaseRpcOptions<
    DbFunctions["get_qr_code_transactions"]["Returns"]
  > | null,
): Promise<
  DbFunctions["get_qr_code_transactions"]["Returns"] | null | boolean
> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "get_qr_code_transactions", args),
      "get_qr_code_transactions",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "get_qr_code_transactions", args),
      "get_qr_code_transactions",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "get_qr_code_transactions", args),
    "get_qr_code_transactions",
  );
}

export async function getRiskAssessmentForTransaction(
  client: TypedSupabaseClient,
  args?: DbFunctions["get_risk_assessment_for_transaction"]["Args"],
): Promise<
  DbFunctions["get_risk_assessment_for_transaction"]["Returns"] | null
>;
export async function getRiskAssessmentForTransaction(
  client: TypedSupabaseClient,
  args: DbFunctions["get_risk_assessment_for_transaction"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function getRiskAssessmentForTransaction(
  client: TypedSupabaseClient,
  args: DbFunctions["get_risk_assessment_for_transaction"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["get_risk_assessment_for_transaction"]["Returns"]
  > | null,
): Promise<
  DbFunctions["get_risk_assessment_for_transaction"]["Returns"] | null
>;
export async function getRiskAssessmentForTransaction(
  client: TypedSupabaseClient,
  args: DbFunctions["get_risk_assessment_for_transaction"]["Args"] = emptyRpcArgs<"get_risk_assessment_for_transaction">(),
  options?: SupabaseRpcOptions<
    DbFunctions["get_risk_assessment_for_transaction"]["Returns"]
  > | null,
): Promise<
  DbFunctions["get_risk_assessment_for_transaction"]["Returns"] | null | boolean
> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "get_risk_assessment_for_transaction", args),
      "get_risk_assessment_for_transaction",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "get_risk_assessment_for_transaction", args),
      "get_risk_assessment_for_transaction",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "get_risk_assessment_for_transaction", args),
    "get_risk_assessment_for_transaction",
  );
}

export async function listRefundsForTransaction(
  client: TypedSupabaseClient,
  args?: DbFunctions["list_refunds_for_transaction"]["Args"],
): Promise<DbFunctions["list_refunds_for_transaction"]["Returns"] | null>;
export async function listRefundsForTransaction(
  client: TypedSupabaseClient,
  args: DbFunctions["list_refunds_for_transaction"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function listRefundsForTransaction(
  client: TypedSupabaseClient,
  args: DbFunctions["list_refunds_for_transaction"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["list_refunds_for_transaction"]["Returns"]
  > | null,
): Promise<DbFunctions["list_refunds_for_transaction"]["Returns"] | null>;
export async function listRefundsForTransaction(
  client: TypedSupabaseClient,
  args: DbFunctions["list_refunds_for_transaction"]["Args"] = emptyRpcArgs<"list_refunds_for_transaction">(),
  options?: SupabaseRpcOptions<
    DbFunctions["list_refunds_for_transaction"]["Returns"]
  > | null,
): Promise<
  DbFunctions["list_refunds_for_transaction"]["Returns"] | null | boolean
> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "list_refunds_for_transaction", args),
      "list_refunds_for_transaction",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "list_refunds_for_transaction", args),
      "list_refunds_for_transaction",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "list_refunds_for_transaction", args),
    "list_refunds_for_transaction",
  );
}

export async function resolveSubscriptionRefundAction(
  client: TypedSupabaseClient,
  args?: DbFunctions["resolve_subscription_refund_action"]["Args"],
): Promise<DbFunctions["resolve_subscription_refund_action"]["Returns"] | null>;
export async function resolveSubscriptionRefundAction(
  client: TypedSupabaseClient,
  args: DbFunctions["resolve_subscription_refund_action"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function resolveSubscriptionRefundAction(
  client: TypedSupabaseClient,
  args: DbFunctions["resolve_subscription_refund_action"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["resolve_subscription_refund_action"]["Returns"]
  > | null,
): Promise<DbFunctions["resolve_subscription_refund_action"]["Returns"] | null>;
export async function resolveSubscriptionRefundAction(
  client: TypedSupabaseClient,
  args: DbFunctions["resolve_subscription_refund_action"]["Args"] = emptyRpcArgs<"resolve_subscription_refund_action">(),
  options?: SupabaseRpcOptions<
    DbFunctions["resolve_subscription_refund_action"]["Returns"]
  > | null,
): Promise<
  DbFunctions["resolve_subscription_refund_action"]["Returns"] | null | boolean
> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "resolve_subscription_refund_action", args),
      "resolve_subscription_refund_action",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "resolve_subscription_refund_action", args),
      "resolve_subscription_refund_action",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "resolve_subscription_refund_action", args),
    "resolve_subscription_refund_action",
  );
}

export async function rollbackMtnRefund(
  client: TypedSupabaseClient,
  args?: DbFunctions["rollback_mtn_refund"]["Args"],
): Promise<DbFunctions["rollback_mtn_refund"]["Returns"] | null>;
export async function rollbackMtnRefund(
  client: TypedSupabaseClient,
  args: DbFunctions["rollback_mtn_refund"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function rollbackMtnRefund(
  client: TypedSupabaseClient,
  args: DbFunctions["rollback_mtn_refund"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["rollback_mtn_refund"]["Returns"]
  > | null,
): Promise<DbFunctions["rollback_mtn_refund"]["Returns"] | null>;
export async function rollbackMtnRefund(
  client: TypedSupabaseClient,
  args: DbFunctions["rollback_mtn_refund"]["Args"] = emptyRpcArgs<"rollback_mtn_refund">(),
  options?: SupabaseRpcOptions<
    DbFunctions["rollback_mtn_refund"]["Returns"]
  > | null,
): Promise<DbFunctions["rollback_mtn_refund"]["Returns"] | null | boolean> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "rollback_mtn_refund", args),
      "rollback_mtn_refund",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "rollback_mtn_refund", args),
      "rollback_mtn_refund",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "rollback_mtn_refund", args),
    "rollback_mtn_refund",
  );
}

export async function rollbackWaveRefund(
  client: TypedSupabaseClient,
  args?: DbFunctions["rollback_wave_refund"]["Args"],
): Promise<DbFunctions["rollback_wave_refund"]["Returns"] | null>;
export async function rollbackWaveRefund(
  client: TypedSupabaseClient,
  args: DbFunctions["rollback_wave_refund"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function rollbackWaveRefund(
  client: TypedSupabaseClient,
  args: DbFunctions["rollback_wave_refund"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["rollback_wave_refund"]["Returns"]
  > | null,
): Promise<DbFunctions["rollback_wave_refund"]["Returns"] | null>;
export async function rollbackWaveRefund(
  client: TypedSupabaseClient,
  args: DbFunctions["rollback_wave_refund"]["Args"] = emptyRpcArgs<"rollback_wave_refund">(),
  options?: SupabaseRpcOptions<
    DbFunctions["rollback_wave_refund"]["Returns"]
  > | null,
): Promise<DbFunctions["rollback_wave_refund"]["Returns"] | null | boolean> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "rollback_wave_refund", args),
      "rollback_wave_refund",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "rollback_wave_refund", args),
      "rollback_wave_refund",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "rollback_wave_refund", args),
    "rollback_wave_refund",
  );
}

export async function sendTransactionReceiptEmail(
  client: TypedSupabaseClient,
  args?: DbFunctions["send_transaction_receipt_email"]["Args"],
): Promise<DbFunctions["send_transaction_receipt_email"]["Returns"] | null>;
export async function sendTransactionReceiptEmail(
  client: TypedSupabaseClient,
  args: DbFunctions["send_transaction_receipt_email"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function sendTransactionReceiptEmail(
  client: TypedSupabaseClient,
  args: DbFunctions["send_transaction_receipt_email"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["send_transaction_receipt_email"]["Returns"]
  > | null,
): Promise<DbFunctions["send_transaction_receipt_email"]["Returns"] | null>;
export async function sendTransactionReceiptEmail(
  client: TypedSupabaseClient,
  args: DbFunctions["send_transaction_receipt_email"]["Args"] = emptyRpcArgs<"send_transaction_receipt_email">(),
  options?: SupabaseRpcOptions<
    DbFunctions["send_transaction_receipt_email"]["Returns"]
  > | null,
): Promise<
  DbFunctions["send_transaction_receipt_email"]["Returns"] | null | boolean
> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "send_transaction_receipt_email", args),
      "send_transaction_receipt_email",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "send_transaction_receipt_email", args),
      "send_transaction_receipt_email",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "send_transaction_receipt_email", args),
    "send_transaction_receipt_email",
  );
}
