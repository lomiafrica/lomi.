import { handleSupabaseRpc, type SupabaseRpcOptions } from "@lomi./shared";
import { rpc } from "./rpc.js";
import type { DbFunctions, TypedSupabaseClient } from "./types.js";
import { emptyRpcArgs } from "./call-rpc.js";

export async function calculateVolumeSavings(
  client: TypedSupabaseClient,
  args?: DbFunctions["calculate_volume_savings"]["Args"],
): Promise<DbFunctions["calculate_volume_savings"]["Returns"] | null>;
export async function calculateVolumeSavings(
  client: TypedSupabaseClient,
  args: DbFunctions["calculate_volume_savings"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function calculateVolumeSavings(
  client: TypedSupabaseClient,
  args: DbFunctions["calculate_volume_savings"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["calculate_volume_savings"]["Returns"]
  > | null,
): Promise<DbFunctions["calculate_volume_savings"]["Returns"] | null>;
export async function calculateVolumeSavings(
  client: TypedSupabaseClient,
  args: DbFunctions["calculate_volume_savings"]["Args"] = emptyRpcArgs<"calculate_volume_savings">(),
  options?: SupabaseRpcOptions<
    DbFunctions["calculate_volume_savings"]["Returns"]
  > | null,
): Promise<
  DbFunctions["calculate_volume_savings"]["Returns"] | null | boolean
> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "calculate_volume_savings", args),
      "calculate_volume_savings",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "calculate_volume_savings", args),
      "calculate_volume_savings",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "calculate_volume_savings", args),
    "calculate_volume_savings",
  );
}

export async function cancelAccountTopUp(
  client: TypedSupabaseClient,
  args?: DbFunctions["cancel_account_top_up"]["Args"],
): Promise<DbFunctions["cancel_account_top_up"]["Returns"] | null>;
export async function cancelAccountTopUp(
  client: TypedSupabaseClient,
  args: DbFunctions["cancel_account_top_up"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function cancelAccountTopUp(
  client: TypedSupabaseClient,
  args: DbFunctions["cancel_account_top_up"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["cancel_account_top_up"]["Returns"]
  > | null,
): Promise<DbFunctions["cancel_account_top_up"]["Returns"] | null>;
export async function cancelAccountTopUp(
  client: TypedSupabaseClient,
  args: DbFunctions["cancel_account_top_up"]["Args"] = emptyRpcArgs<"cancel_account_top_up">(),
  options?: SupabaseRpcOptions<
    DbFunctions["cancel_account_top_up"]["Returns"]
  > | null,
): Promise<DbFunctions["cancel_account_top_up"]["Returns"] | null | boolean> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "cancel_account_top_up", args),
      "cancel_account_top_up",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "cancel_account_top_up", args),
      "cancel_account_top_up",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "cancel_account_top_up", args),
    "cancel_account_top_up",
  );
}

export async function checkMerchantBalanceForBeneficiaryPayout(
  client: TypedSupabaseClient,
  args?: DbFunctions["check_merchant_balance_for_beneficiary_payout"]["Args"],
): Promise<
  DbFunctions["check_merchant_balance_for_beneficiary_payout"]["Returns"] | null
>;
export async function checkMerchantBalanceForBeneficiaryPayout(
  client: TypedSupabaseClient,
  args: DbFunctions["check_merchant_balance_for_beneficiary_payout"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function checkMerchantBalanceForBeneficiaryPayout(
  client: TypedSupabaseClient,
  args: DbFunctions["check_merchant_balance_for_beneficiary_payout"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["check_merchant_balance_for_beneficiary_payout"]["Returns"]
  > | null,
): Promise<
  DbFunctions["check_merchant_balance_for_beneficiary_payout"]["Returns"] | null
>;
export async function checkMerchantBalanceForBeneficiaryPayout(
  client: TypedSupabaseClient,
  args: DbFunctions["check_merchant_balance_for_beneficiary_payout"]["Args"] = emptyRpcArgs<"check_merchant_balance_for_beneficiary_payout">(),
  options?: SupabaseRpcOptions<
    DbFunctions["check_merchant_balance_for_beneficiary_payout"]["Returns"]
  > | null,
): Promise<
  | DbFunctions["check_merchant_balance_for_beneficiary_payout"]["Returns"]
  | null
  | boolean
> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "check_merchant_balance_for_beneficiary_payout", args),
      "check_merchant_balance_for_beneficiary_payout",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "check_merchant_balance_for_beneficiary_payout", args),
      "check_merchant_balance_for_beneficiary_payout",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "check_merchant_balance_for_beneficiary_payout", args),
    "check_merchant_balance_for_beneficiary_payout",
  );
}

export async function createAccountTopUp(
  client: TypedSupabaseClient,
  args?: DbFunctions["create_account_top_up"]["Args"],
): Promise<DbFunctions["create_account_top_up"]["Returns"] | null>;
export async function createAccountTopUp(
  client: TypedSupabaseClient,
  args: DbFunctions["create_account_top_up"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function createAccountTopUp(
  client: TypedSupabaseClient,
  args: DbFunctions["create_account_top_up"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["create_account_top_up"]["Returns"]
  > | null,
): Promise<DbFunctions["create_account_top_up"]["Returns"] | null>;
export async function createAccountTopUp(
  client: TypedSupabaseClient,
  args: DbFunctions["create_account_top_up"]["Args"] = emptyRpcArgs<"create_account_top_up">(),
  options?: SupabaseRpcOptions<
    DbFunctions["create_account_top_up"]["Returns"]
  > | null,
): Promise<DbFunctions["create_account_top_up"]["Returns"] | null | boolean> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "create_account_top_up", args),
      "create_account_top_up",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "create_account_top_up", args),
      "create_account_top_up",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "create_account_top_up", args),
    "create_account_top_up",
  );
}

export async function deleteOrganizationFeeType(
  client: TypedSupabaseClient,
  args?: DbFunctions["delete_organization_fee_type"]["Args"],
): Promise<DbFunctions["delete_organization_fee_type"]["Returns"] | null>;
export async function deleteOrganizationFeeType(
  client: TypedSupabaseClient,
  args: DbFunctions["delete_organization_fee_type"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function deleteOrganizationFeeType(
  client: TypedSupabaseClient,
  args: DbFunctions["delete_organization_fee_type"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["delete_organization_fee_type"]["Returns"]
  > | null,
): Promise<DbFunctions["delete_organization_fee_type"]["Returns"] | null>;
export async function deleteOrganizationFeeType(
  client: TypedSupabaseClient,
  args: DbFunctions["delete_organization_fee_type"]["Args"] = emptyRpcArgs<"delete_organization_fee_type">(),
  options?: SupabaseRpcOptions<
    DbFunctions["delete_organization_fee_type"]["Returns"]
  > | null,
): Promise<
  DbFunctions["delete_organization_fee_type"]["Returns"] | null | boolean
> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "delete_organization_fee_type", args),
      "delete_organization_fee_type",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "delete_organization_fee_type", args),
      "delete_organization_fee_type",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "delete_organization_fee_type", args),
    "delete_organization_fee_type",
  );
}

export async function fetchBalanceBreakdown(
  client: TypedSupabaseClient,
  args?: DbFunctions["fetch_balance_breakdown"]["Args"],
): Promise<DbFunctions["fetch_balance_breakdown"]["Returns"] | null>;
export async function fetchBalanceBreakdown(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_balance_breakdown"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function fetchBalanceBreakdown(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_balance_breakdown"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["fetch_balance_breakdown"]["Returns"]
  > | null,
): Promise<DbFunctions["fetch_balance_breakdown"]["Returns"] | null>;
export async function fetchBalanceBreakdown(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_balance_breakdown"]["Args"] = emptyRpcArgs<"fetch_balance_breakdown">(),
  options?: SupabaseRpcOptions<
    DbFunctions["fetch_balance_breakdown"]["Returns"]
  > | null,
): Promise<DbFunctions["fetch_balance_breakdown"]["Returns"] | null | boolean> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "fetch_balance_breakdown", args),
      "fetch_balance_breakdown",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "fetch_balance_breakdown", args),
      "fetch_balance_breakdown",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "fetch_balance_breakdown", args),
    "fetch_balance_breakdown",
  );
}

export async function fetchBeneficiaryPayouts(
  client: TypedSupabaseClient,
  args?: DbFunctions["fetch_beneficiary_payouts"]["Args"],
): Promise<DbFunctions["fetch_beneficiary_payouts"]["Returns"] | null>;
export async function fetchBeneficiaryPayouts(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_beneficiary_payouts"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function fetchBeneficiaryPayouts(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_beneficiary_payouts"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["fetch_beneficiary_payouts"]["Returns"]
  > | null,
): Promise<DbFunctions["fetch_beneficiary_payouts"]["Returns"] | null>;
export async function fetchBeneficiaryPayouts(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_beneficiary_payouts"]["Args"] = emptyRpcArgs<"fetch_beneficiary_payouts">(),
  options?: SupabaseRpcOptions<
    DbFunctions["fetch_beneficiary_payouts"]["Returns"]
  > | null,
): Promise<
  DbFunctions["fetch_beneficiary_payouts"]["Returns"] | null | boolean
> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "fetch_beneficiary_payouts", args),
      "fetch_beneficiary_payouts",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "fetch_beneficiary_payouts", args),
      "fetch_beneficiary_payouts",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "fetch_beneficiary_payouts", args),
    "fetch_beneficiary_payouts",
  );
}

export async function fetchBillingStatements(
  client: TypedSupabaseClient,
  args?: DbFunctions["fetch_billing_statements"]["Args"],
): Promise<DbFunctions["fetch_billing_statements"]["Returns"] | null>;
export async function fetchBillingStatements(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_billing_statements"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function fetchBillingStatements(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_billing_statements"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["fetch_billing_statements"]["Returns"]
  > | null,
): Promise<DbFunctions["fetch_billing_statements"]["Returns"] | null>;
export async function fetchBillingStatements(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_billing_statements"]["Args"] = emptyRpcArgs<"fetch_billing_statements">(),
  options?: SupabaseRpcOptions<
    DbFunctions["fetch_billing_statements"]["Returns"]
  > | null,
): Promise<
  DbFunctions["fetch_billing_statements"]["Returns"] | null | boolean
> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "fetch_billing_statements", args),
      "fetch_billing_statements",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "fetch_billing_statements", args),
      "fetch_billing_statements",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "fetch_billing_statements", args),
    "fetch_billing_statements",
  );
}

export async function fetchFeeAmount(
  client: TypedSupabaseClient,
  args?: DbFunctions["fetch_fee_amount"]["Args"],
): Promise<DbFunctions["fetch_fee_amount"]["Returns"] | null>;
export async function fetchFeeAmount(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_fee_amount"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function fetchFeeAmount(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_fee_amount"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["fetch_fee_amount"]["Returns"]
  > | null,
): Promise<DbFunctions["fetch_fee_amount"]["Returns"] | null>;
export async function fetchFeeAmount(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_fee_amount"]["Args"] = emptyRpcArgs<"fetch_fee_amount">(),
  options?: SupabaseRpcOptions<
    DbFunctions["fetch_fee_amount"]["Returns"]
  > | null,
): Promise<DbFunctions["fetch_fee_amount"]["Returns"] | null | boolean> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "fetch_fee_amount", args),
      "fetch_fee_amount",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "fetch_fee_amount", args),
      "fetch_fee_amount",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "fetch_fee_amount", args),
    "fetch_fee_amount",
  );
}

export async function fetchOrganizationFeeTypes(
  client: TypedSupabaseClient,
  args?: DbFunctions["fetch_organization_fee_types"]["Args"],
): Promise<DbFunctions["fetch_organization_fee_types"]["Returns"] | null>;
export async function fetchOrganizationFeeTypes(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_organization_fee_types"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function fetchOrganizationFeeTypes(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_organization_fee_types"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["fetch_organization_fee_types"]["Returns"]
  > | null,
): Promise<DbFunctions["fetch_organization_fee_types"]["Returns"] | null>;
export async function fetchOrganizationFeeTypes(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_organization_fee_types"]["Args"] = emptyRpcArgs<"fetch_organization_fee_types">(),
  options?: SupabaseRpcOptions<
    DbFunctions["fetch_organization_fee_types"]["Returns"]
  > | null,
): Promise<
  DbFunctions["fetch_organization_fee_types"]["Returns"] | null | boolean
> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "fetch_organization_fee_types", args),
      "fetch_organization_fee_types",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "fetch_organization_fee_types", args),
      "fetch_organization_fee_types",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "fetch_organization_fee_types", args),
    "fetch_organization_fee_types",
  );
}

export async function fetchOrganizationFees(
  client: TypedSupabaseClient,
  args?: DbFunctions["fetch_organization_fees"]["Args"],
): Promise<DbFunctions["fetch_organization_fees"]["Returns"] | null>;
export async function fetchOrganizationFees(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_organization_fees"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function fetchOrganizationFees(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_organization_fees"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["fetch_organization_fees"]["Returns"]
  > | null,
): Promise<DbFunctions["fetch_organization_fees"]["Returns"] | null>;
export async function fetchOrganizationFees(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_organization_fees"]["Args"] = emptyRpcArgs<"fetch_organization_fees">(),
  options?: SupabaseRpcOptions<
    DbFunctions["fetch_organization_fees"]["Returns"]
  > | null,
): Promise<DbFunctions["fetch_organization_fees"]["Returns"] | null | boolean> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "fetch_organization_fees", args),
      "fetch_organization_fees",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "fetch_organization_fees", args),
      "fetch_organization_fees",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "fetch_organization_fees", args),
    "fetch_organization_fees",
  );
}

export async function fetchOrganizationPaymentProcessingFees(
  client: TypedSupabaseClient,
  args?: DbFunctions["fetch_organization_payment_processing_fees"]["Args"],
): Promise<
  DbFunctions["fetch_organization_payment_processing_fees"]["Returns"] | null
>;
export async function fetchOrganizationPaymentProcessingFees(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_organization_payment_processing_fees"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function fetchOrganizationPaymentProcessingFees(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_organization_payment_processing_fees"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["fetch_organization_payment_processing_fees"]["Returns"]
  > | null,
): Promise<
  DbFunctions["fetch_organization_payment_processing_fees"]["Returns"] | null
>;
export async function fetchOrganizationPaymentProcessingFees(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_organization_payment_processing_fees"]["Args"] = emptyRpcArgs<"fetch_organization_payment_processing_fees">(),
  options?: SupabaseRpcOptions<
    DbFunctions["fetch_organization_payment_processing_fees"]["Returns"]
  > | null,
): Promise<
  | DbFunctions["fetch_organization_payment_processing_fees"]["Returns"]
  | null
  | boolean
> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "fetch_organization_payment_processing_fees", args),
      "fetch_organization_payment_processing_fees",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "fetch_organization_payment_processing_fees", args),
      "fetch_organization_payment_processing_fees",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "fetch_organization_payment_processing_fees", args),
    "fetch_organization_payment_processing_fees",
  );
}

export async function fetchSettlementPeriods(
  client: TypedSupabaseClient,
  args?: DbFunctions["fetch_settlement_periods"]["Args"],
): Promise<DbFunctions["fetch_settlement_periods"]["Returns"] | null>;
export async function fetchSettlementPeriods(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_settlement_periods"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function fetchSettlementPeriods(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_settlement_periods"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["fetch_settlement_periods"]["Returns"]
  > | null,
): Promise<DbFunctions["fetch_settlement_periods"]["Returns"] | null>;
export async function fetchSettlementPeriods(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_settlement_periods"]["Args"] = emptyRpcArgs<"fetch_settlement_periods">(),
  options?: SupabaseRpcOptions<
    DbFunctions["fetch_settlement_periods"]["Returns"]
  > | null,
): Promise<
  DbFunctions["fetch_settlement_periods"]["Returns"] | null | boolean
> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "fetch_settlement_periods", args),
      "fetch_settlement_periods",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "fetch_settlement_periods", args),
      "fetch_settlement_periods",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "fetch_settlement_periods", args),
    "fetch_settlement_periods",
  );
}

export async function getBeneficiaryPayoutFeeDetails(
  client: TypedSupabaseClient,
  args?: DbFunctions["get_beneficiary_payout_fee_details"]["Args"],
): Promise<DbFunctions["get_beneficiary_payout_fee_details"]["Returns"] | null>;
export async function getBeneficiaryPayoutFeeDetails(
  client: TypedSupabaseClient,
  args: DbFunctions["get_beneficiary_payout_fee_details"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function getBeneficiaryPayoutFeeDetails(
  client: TypedSupabaseClient,
  args: DbFunctions["get_beneficiary_payout_fee_details"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["get_beneficiary_payout_fee_details"]["Returns"]
  > | null,
): Promise<DbFunctions["get_beneficiary_payout_fee_details"]["Returns"] | null>;
export async function getBeneficiaryPayoutFeeDetails(
  client: TypedSupabaseClient,
  args: DbFunctions["get_beneficiary_payout_fee_details"]["Args"] = emptyRpcArgs<"get_beneficiary_payout_fee_details">(),
  options?: SupabaseRpcOptions<
    DbFunctions["get_beneficiary_payout_fee_details"]["Returns"]
  > | null,
): Promise<
  DbFunctions["get_beneficiary_payout_fee_details"]["Returns"] | null | boolean
> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "get_beneficiary_payout_fee_details", args),
      "get_beneficiary_payout_fee_details",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "get_beneficiary_payout_fee_details", args),
      "get_beneficiary_payout_fee_details",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "get_beneficiary_payout_fee_details", args),
    "get_beneficiary_payout_fee_details",
  );
}

export async function getMerchantPlatformFees(
  client: TypedSupabaseClient,
  args?: DbFunctions["get_merchant_platform_fees"]["Args"],
): Promise<DbFunctions["get_merchant_platform_fees"]["Returns"] | null>;
export async function getMerchantPlatformFees(
  client: TypedSupabaseClient,
  args: DbFunctions["get_merchant_platform_fees"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function getMerchantPlatformFees(
  client: TypedSupabaseClient,
  args: DbFunctions["get_merchant_platform_fees"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["get_merchant_platform_fees"]["Returns"]
  > | null,
): Promise<DbFunctions["get_merchant_platform_fees"]["Returns"] | null>;
export async function getMerchantPlatformFees(
  client: TypedSupabaseClient,
  args: DbFunctions["get_merchant_platform_fees"]["Args"] = emptyRpcArgs<"get_merchant_platform_fees">(),
  options?: SupabaseRpcOptions<
    DbFunctions["get_merchant_platform_fees"]["Returns"]
  > | null,
): Promise<
  DbFunctions["get_merchant_platform_fees"]["Returns"] | null | boolean
> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "get_merchant_platform_fees", args),
      "get_merchant_platform_fees",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "get_merchant_platform_fees", args),
      "get_merchant_platform_fees",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "get_merchant_platform_fees", args),
    "get_merchant_platform_fees",
  );
}

export async function getOrganizationFeeStructure(
  client: TypedSupabaseClient,
  args?: DbFunctions["get_organization_fee_structure"]["Args"],
): Promise<DbFunctions["get_organization_fee_structure"]["Returns"] | null>;
export async function getOrganizationFeeStructure(
  client: TypedSupabaseClient,
  args: DbFunctions["get_organization_fee_structure"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function getOrganizationFeeStructure(
  client: TypedSupabaseClient,
  args: DbFunctions["get_organization_fee_structure"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["get_organization_fee_structure"]["Returns"]
  > | null,
): Promise<DbFunctions["get_organization_fee_structure"]["Returns"] | null>;
export async function getOrganizationFeeStructure(
  client: TypedSupabaseClient,
  args: DbFunctions["get_organization_fee_structure"]["Args"] = emptyRpcArgs<"get_organization_fee_structure">(),
  options?: SupabaseRpcOptions<
    DbFunctions["get_organization_fee_structure"]["Returns"]
  > | null,
): Promise<
  DbFunctions["get_organization_fee_structure"]["Returns"] | null | boolean
> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "get_organization_fee_structure", args),
      "get_organization_fee_structure",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "get_organization_fee_structure", args),
      "get_organization_fee_structure",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "get_organization_fee_structure", args),
    "get_organization_fee_structure",
  );
}

export async function getPlatformDefaultFees(
  client: TypedSupabaseClient,
  args?: DbFunctions["get_platform_default_fees"]["Args"],
): Promise<DbFunctions["get_platform_default_fees"]["Returns"] | null>;
export async function getPlatformDefaultFees(
  client: TypedSupabaseClient,
  args: DbFunctions["get_platform_default_fees"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function getPlatformDefaultFees(
  client: TypedSupabaseClient,
  args: DbFunctions["get_platform_default_fees"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["get_platform_default_fees"]["Returns"]
  > | null,
): Promise<DbFunctions["get_platform_default_fees"]["Returns"] | null>;
export async function getPlatformDefaultFees(
  client: TypedSupabaseClient,
  args: DbFunctions["get_platform_default_fees"]["Args"] = emptyRpcArgs<"get_platform_default_fees">(),
  options?: SupabaseRpcOptions<
    DbFunctions["get_platform_default_fees"]["Returns"]
  > | null,
): Promise<
  DbFunctions["get_platform_default_fees"]["Returns"] | null | boolean
> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "get_platform_default_fees", args),
      "get_platform_default_fees",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "get_platform_default_fees", args),
      "get_platform_default_fees",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "get_platform_default_fees", args),
    "get_platform_default_fees",
  );
}

export async function getPricingTiers(
  client: TypedSupabaseClient,
  args?: DbFunctions["get_pricing_tiers"]["Args"],
): Promise<DbFunctions["get_pricing_tiers"]["Returns"] | null>;
export async function getPricingTiers(
  client: TypedSupabaseClient,
  args: DbFunctions["get_pricing_tiers"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function getPricingTiers(
  client: TypedSupabaseClient,
  args: DbFunctions["get_pricing_tiers"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["get_pricing_tiers"]["Returns"]
  > | null,
): Promise<DbFunctions["get_pricing_tiers"]["Returns"] | null>;
export async function getPricingTiers(
  client: TypedSupabaseClient,
  args: DbFunctions["get_pricing_tiers"]["Args"] = emptyRpcArgs<"get_pricing_tiers">(),
  options?: SupabaseRpcOptions<
    DbFunctions["get_pricing_tiers"]["Returns"]
  > | null,
): Promise<DbFunctions["get_pricing_tiers"]["Returns"] | null | boolean> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "get_pricing_tiers", args),
      "get_pricing_tiers",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "get_pricing_tiers", args),
      "get_pricing_tiers",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "get_pricing_tiers", args),
    "get_pricing_tiers",
  );
}

export async function getStatementDataForPdf(
  client: TypedSupabaseClient,
  args?: DbFunctions["get_statement_data_for_pdf"]["Args"],
): Promise<DbFunctions["get_statement_data_for_pdf"]["Returns"] | null>;
export async function getStatementDataForPdf(
  client: TypedSupabaseClient,
  args: DbFunctions["get_statement_data_for_pdf"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function getStatementDataForPdf(
  client: TypedSupabaseClient,
  args: DbFunctions["get_statement_data_for_pdf"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["get_statement_data_for_pdf"]["Returns"]
  > | null,
): Promise<DbFunctions["get_statement_data_for_pdf"]["Returns"] | null>;
export async function getStatementDataForPdf(
  client: TypedSupabaseClient,
  args: DbFunctions["get_statement_data_for_pdf"]["Args"] = emptyRpcArgs<"get_statement_data_for_pdf">(),
  options?: SupabaseRpcOptions<
    DbFunctions["get_statement_data_for_pdf"]["Returns"]
  > | null,
): Promise<
  DbFunctions["get_statement_data_for_pdf"]["Returns"] | null | boolean
> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "get_statement_data_for_pdf", args),
      "get_statement_data_for_pdf",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "get_statement_data_for_pdf", args),
      "get_statement_data_for_pdf",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "get_statement_data_for_pdf", args),
    "get_statement_data_for_pdf",
  );
}

export async function listAccountTopUps(
  client: TypedSupabaseClient,
  args?: DbFunctions["list_account_top_ups"]["Args"],
): Promise<DbFunctions["list_account_top_ups"]["Returns"] | null>;
export async function listAccountTopUps(
  client: TypedSupabaseClient,
  args: DbFunctions["list_account_top_ups"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function listAccountTopUps(
  client: TypedSupabaseClient,
  args: DbFunctions["list_account_top_ups"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["list_account_top_ups"]["Returns"]
  > | null,
): Promise<DbFunctions["list_account_top_ups"]["Returns"] | null>;
export async function listAccountTopUps(
  client: TypedSupabaseClient,
  args: DbFunctions["list_account_top_ups"]["Args"] = emptyRpcArgs<"list_account_top_ups">(),
  options?: SupabaseRpcOptions<
    DbFunctions["list_account_top_ups"]["Returns"]
  > | null,
): Promise<DbFunctions["list_account_top_ups"]["Returns"] | null | boolean> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "list_account_top_ups", args),
      "list_account_top_ups",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "list_account_top_ups", args),
      "list_account_top_ups",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "list_account_top_ups", args),
    "list_account_top_ups",
  );
}

export async function manageOrganizationFeeType(
  client: TypedSupabaseClient,
  args?: DbFunctions["manage_organization_fee_type"]["Args"],
): Promise<DbFunctions["manage_organization_fee_type"]["Returns"] | null>;
export async function manageOrganizationFeeType(
  client: TypedSupabaseClient,
  args: DbFunctions["manage_organization_fee_type"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function manageOrganizationFeeType(
  client: TypedSupabaseClient,
  args: DbFunctions["manage_organization_fee_type"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["manage_organization_fee_type"]["Returns"]
  > | null,
): Promise<DbFunctions["manage_organization_fee_type"]["Returns"] | null>;
export async function manageOrganizationFeeType(
  client: TypedSupabaseClient,
  args: DbFunctions["manage_organization_fee_type"]["Args"] = emptyRpcArgs<"manage_organization_fee_type">(),
  options?: SupabaseRpcOptions<
    DbFunctions["manage_organization_fee_type"]["Returns"]
  > | null,
): Promise<
  DbFunctions["manage_organization_fee_type"]["Returns"] | null | boolean
> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "manage_organization_fee_type", args),
      "manage_organization_fee_type",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "manage_organization_fee_type", args),
      "manage_organization_fee_type",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "manage_organization_fee_type", args),
    "manage_organization_fee_type",
  );
}

export async function organizationHasCustomFeeSchedule(
  client: TypedSupabaseClient,
  args?: DbFunctions["organization_has_custom_fee_schedule"]["Args"],
): Promise<
  DbFunctions["organization_has_custom_fee_schedule"]["Returns"] | null
>;
export async function organizationHasCustomFeeSchedule(
  client: TypedSupabaseClient,
  args: DbFunctions["organization_has_custom_fee_schedule"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function organizationHasCustomFeeSchedule(
  client: TypedSupabaseClient,
  args: DbFunctions["organization_has_custom_fee_schedule"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["organization_has_custom_fee_schedule"]["Returns"]
  > | null,
): Promise<
  DbFunctions["organization_has_custom_fee_schedule"]["Returns"] | null
>;
export async function organizationHasCustomFeeSchedule(
  client: TypedSupabaseClient,
  args: DbFunctions["organization_has_custom_fee_schedule"]["Args"] = emptyRpcArgs<"organization_has_custom_fee_schedule">(),
  options?: SupabaseRpcOptions<
    DbFunctions["organization_has_custom_fee_schedule"]["Returns"]
  > | null,
): Promise<
  | DbFunctions["organization_has_custom_fee_schedule"]["Returns"]
  | null
  | boolean
> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "organization_has_custom_fee_schedule", args),
      "organization_has_custom_fee_schedule",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "organization_has_custom_fee_schedule", args),
      "organization_has_custom_fee_schedule",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "organization_has_custom_fee_schedule", args),
    "organization_has_custom_fee_schedule",
  );
}
