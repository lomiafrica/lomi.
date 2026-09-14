import { handleSupabaseRpc, type SupabaseRpcOptions } from "@lomi./shared";
import { rpc } from "./rpc.js";
import type { DbFunctions, TypedSupabaseClient } from "./types.js";
import { emptyRpcArgs } from "./call-rpc.js";

export async function fetchPayouts(
  client: TypedSupabaseClient,
  args?: DbFunctions["fetch_payouts"]["Args"],
): Promise<DbFunctions["fetch_payouts"]["Returns"] | null>;
export async function fetchPayouts(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_payouts"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function fetchPayouts(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_payouts"]["Args"],
  options: SupabaseRpcOptions<DbFunctions["fetch_payouts"]["Returns"]> | null,
): Promise<DbFunctions["fetch_payouts"]["Returns"] | null>;
export async function fetchPayouts(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_payouts"]["Args"] = emptyRpcArgs<"fetch_payouts">(),
  options?: SupabaseRpcOptions<DbFunctions["fetch_payouts"]["Returns"]> | null,
): Promise<DbFunctions["fetch_payouts"]["Returns"] | null | boolean> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "fetch_payouts", args),
      "fetch_payouts",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "fetch_payouts", args),
      "fetch_payouts",
      options,
    );
  }
  return handleSupabaseRpc(rpc(client, "fetch_payouts", args), "fetch_payouts");
}

export async function getPayoutDetails(
  client: TypedSupabaseClient,
  args?: DbFunctions["get_payout_details"]["Args"],
): Promise<DbFunctions["get_payout_details"]["Returns"] | null>;
export async function getPayoutDetails(
  client: TypedSupabaseClient,
  args: DbFunctions["get_payout_details"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function getPayoutDetails(
  client: TypedSupabaseClient,
  args: DbFunctions["get_payout_details"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["get_payout_details"]["Returns"]
  > | null,
): Promise<DbFunctions["get_payout_details"]["Returns"] | null>;
export async function getPayoutDetails(
  client: TypedSupabaseClient,
  args: DbFunctions["get_payout_details"]["Args"] = emptyRpcArgs<"get_payout_details">(),
  options?: SupabaseRpcOptions<
    DbFunctions["get_payout_details"]["Returns"]
  > | null,
): Promise<DbFunctions["get_payout_details"]["Returns"] | null | boolean> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "get_payout_details", args),
      "get_payout_details",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "get_payout_details", args),
      "get_payout_details",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "get_payout_details", args),
    "get_payout_details",
  );
}

export async function getSpiAccountNumber(
  client: TypedSupabaseClient,
  args?: DbFunctions["get_spi_account_number"]["Args"],
): Promise<DbFunctions["get_spi_account_number"]["Returns"] | null>;
export async function getSpiAccountNumber(
  client: TypedSupabaseClient,
  args: DbFunctions["get_spi_account_number"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function getSpiAccountNumber(
  client: TypedSupabaseClient,
  args: DbFunctions["get_spi_account_number"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["get_spi_account_number"]["Returns"]
  > | null,
): Promise<DbFunctions["get_spi_account_number"]["Returns"] | null>;
export async function getSpiAccountNumber(
  client: TypedSupabaseClient,
  args: DbFunctions["get_spi_account_number"]["Args"] = emptyRpcArgs<"get_spi_account_number">(),
  options?: SupabaseRpcOptions<
    DbFunctions["get_spi_account_number"]["Returns"]
  > | null,
): Promise<DbFunctions["get_spi_account_number"]["Returns"] | null | boolean> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "get_spi_account_number", args),
      "get_spi_account_number",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "get_spi_account_number", args),
      "get_spi_account_number",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "get_spi_account_number", args),
    "get_spi_account_number",
  );
}

export async function initiateWithdrawal(
  client: TypedSupabaseClient,
  args?: DbFunctions["initiate_withdrawal"]["Args"],
): Promise<DbFunctions["initiate_withdrawal"]["Returns"] | null>;
export async function initiateWithdrawal(
  client: TypedSupabaseClient,
  args: DbFunctions["initiate_withdrawal"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function initiateWithdrawal(
  client: TypedSupabaseClient,
  args: DbFunctions["initiate_withdrawal"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["initiate_withdrawal"]["Returns"]
  > | null,
): Promise<DbFunctions["initiate_withdrawal"]["Returns"] | null>;
export async function initiateWithdrawal(
  client: TypedSupabaseClient,
  args: DbFunctions["initiate_withdrawal"]["Args"] = emptyRpcArgs<"initiate_withdrawal">(),
  options?: SupabaseRpcOptions<
    DbFunctions["initiate_withdrawal"]["Returns"]
  > | null,
): Promise<DbFunctions["initiate_withdrawal"]["Returns"] | null | boolean> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "initiate_withdrawal", args),
      "initiate_withdrawal",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "initiate_withdrawal", args),
      "initiate_withdrawal",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "initiate_withdrawal", args),
    "initiate_withdrawal",
  );
}

export async function verifyPayoutPin(
  client: TypedSupabaseClient,
  args?: DbFunctions["verify_payout_pin"]["Args"],
): Promise<DbFunctions["verify_payout_pin"]["Returns"] | null>;
export async function verifyPayoutPin(
  client: TypedSupabaseClient,
  args: DbFunctions["verify_payout_pin"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function verifyPayoutPin(
  client: TypedSupabaseClient,
  args: DbFunctions["verify_payout_pin"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["verify_payout_pin"]["Returns"]
  > | null,
): Promise<DbFunctions["verify_payout_pin"]["Returns"] | null>;
export async function verifyPayoutPin(
  client: TypedSupabaseClient,
  args: DbFunctions["verify_payout_pin"]["Args"] = emptyRpcArgs<"verify_payout_pin">(),
  options?: SupabaseRpcOptions<
    DbFunctions["verify_payout_pin"]["Returns"]
  > | null,
): Promise<DbFunctions["verify_payout_pin"]["Returns"] | null | boolean> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "verify_payout_pin", args),
      "verify_payout_pin",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "verify_payout_pin", args),
      "verify_payout_pin",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "verify_payout_pin", args),
    "verify_payout_pin",
  );
}
