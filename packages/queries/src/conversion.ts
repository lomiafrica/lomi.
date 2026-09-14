import { handleSupabaseRpc, type SupabaseRpcOptions } from "@lomi./shared";
import { rpc } from "./rpc.js";
import type { DbFunctions, TypedSupabaseClient } from "./types.js";
import { emptyRpcArgs } from "./call-rpc.js";

export async function convertAmountForStripe(
  client: TypedSupabaseClient,
  args?: DbFunctions["convert_amount_for_stripe"]["Args"],
): Promise<DbFunctions["convert_amount_for_stripe"]["Returns"] | null>;
export async function convertAmountForStripe(
  client: TypedSupabaseClient,
  args: DbFunctions["convert_amount_for_stripe"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function convertAmountForStripe(
  client: TypedSupabaseClient,
  args: DbFunctions["convert_amount_for_stripe"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["convert_amount_for_stripe"]["Returns"]
  > | null,
): Promise<DbFunctions["convert_amount_for_stripe"]["Returns"] | null>;
export async function convertAmountForStripe(
  client: TypedSupabaseClient,
  args: DbFunctions["convert_amount_for_stripe"]["Args"] = emptyRpcArgs<"convert_amount_for_stripe">(),
  options?: SupabaseRpcOptions<
    DbFunctions["convert_amount_for_stripe"]["Returns"]
  > | null,
): Promise<
  DbFunctions["convert_amount_for_stripe"]["Returns"] | null | boolean
> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "convert_amount_for_stripe", args),
      "convert_amount_for_stripe",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "convert_amount_for_stripe", args),
      "convert_amount_for_stripe",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "convert_amount_for_stripe", args),
    "convert_amount_for_stripe",
  );
}

export async function convertCurrency(
  client: TypedSupabaseClient,
  args?: DbFunctions["convert_currency"]["Args"],
): Promise<DbFunctions["convert_currency"]["Returns"] | null>;
export async function convertCurrency(
  client: TypedSupabaseClient,
  args: DbFunctions["convert_currency"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function convertCurrency(
  client: TypedSupabaseClient,
  args: DbFunctions["convert_currency"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["convert_currency"]["Returns"]
  > | null,
): Promise<DbFunctions["convert_currency"]["Returns"] | null>;
export async function convertCurrency(
  client: TypedSupabaseClient,
  args: DbFunctions["convert_currency"]["Args"] = emptyRpcArgs<"convert_currency">(),
  options?: SupabaseRpcOptions<
    DbFunctions["convert_currency"]["Returns"]
  > | null,
): Promise<DbFunctions["convert_currency"]["Returns"] | null | boolean> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "convert_currency", args),
      "convert_currency",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "convert_currency", args),
      "convert_currency",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "convert_currency", args),
    "convert_currency",
  );
}

export async function convertCurrencyForDisplay(
  client: TypedSupabaseClient,
  args?: DbFunctions["convert_currency_for_display"]["Args"],
): Promise<DbFunctions["convert_currency_for_display"]["Returns"] | null>;
export async function convertCurrencyForDisplay(
  client: TypedSupabaseClient,
  args: DbFunctions["convert_currency_for_display"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function convertCurrencyForDisplay(
  client: TypedSupabaseClient,
  args: DbFunctions["convert_currency_for_display"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["convert_currency_for_display"]["Returns"]
  > | null,
): Promise<DbFunctions["convert_currency_for_display"]["Returns"] | null>;
export async function convertCurrencyForDisplay(
  client: TypedSupabaseClient,
  args: DbFunctions["convert_currency_for_display"]["Args"] = emptyRpcArgs<"convert_currency_for_display">(),
  options?: SupabaseRpcOptions<
    DbFunctions["convert_currency_for_display"]["Returns"]
  > | null,
): Promise<
  DbFunctions["convert_currency_for_display"]["Returns"] | null | boolean
> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "convert_currency_for_display", args),
      "convert_currency_for_display",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "convert_currency_for_display", args),
      "convert_currency_for_display",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "convert_currency_for_display", args),
    "convert_currency_for_display",
  );
}

export async function fetchCurrencyConversionHistory(
  client: TypedSupabaseClient,
  args?: DbFunctions["fetch_currency_conversion_history"]["Args"],
): Promise<DbFunctions["fetch_currency_conversion_history"]["Returns"] | null>;
export async function fetchCurrencyConversionHistory(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_currency_conversion_history"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function fetchCurrencyConversionHistory(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_currency_conversion_history"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["fetch_currency_conversion_history"]["Returns"]
  > | null,
): Promise<DbFunctions["fetch_currency_conversion_history"]["Returns"] | null>;
export async function fetchCurrencyConversionHistory(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_currency_conversion_history"]["Args"] = emptyRpcArgs<"fetch_currency_conversion_history">(),
  options?: SupabaseRpcOptions<
    DbFunctions["fetch_currency_conversion_history"]["Returns"]
  > | null,
): Promise<
  DbFunctions["fetch_currency_conversion_history"]["Returns"] | null | boolean
> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "fetch_currency_conversion_history", args),
      "fetch_currency_conversion_history",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "fetch_currency_conversion_history", args),
      "fetch_currency_conversion_history",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "fetch_currency_conversion_history", args),
    "fetch_currency_conversion_history",
  );
}

export async function fetchLatestConversionRates(
  client: TypedSupabaseClient,
  args?: DbFunctions["fetch_latest_conversion_rates"]["Args"],
): Promise<DbFunctions["fetch_latest_conversion_rates"]["Returns"] | null>;
export async function fetchLatestConversionRates(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_latest_conversion_rates"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function fetchLatestConversionRates(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_latest_conversion_rates"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["fetch_latest_conversion_rates"]["Returns"]
  > | null,
): Promise<DbFunctions["fetch_latest_conversion_rates"]["Returns"] | null>;
export async function fetchLatestConversionRates(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_latest_conversion_rates"]["Args"] = emptyRpcArgs<"fetch_latest_conversion_rates">(),
  options?: SupabaseRpcOptions<
    DbFunctions["fetch_latest_conversion_rates"]["Returns"]
  > | null,
): Promise<
  DbFunctions["fetch_latest_conversion_rates"]["Returns"] | null | boolean
> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "fetch_latest_conversion_rates", args),
      "fetch_latest_conversion_rates",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "fetch_latest_conversion_rates", args),
      "fetch_latest_conversion_rates",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "fetch_latest_conversion_rates", args),
    "fetch_latest_conversion_rates",
  );
}

export async function saveConversionRates(
  client: TypedSupabaseClient,
  args?: DbFunctions["save_conversion_rates"]["Args"],
): Promise<DbFunctions["save_conversion_rates"]["Returns"] | null>;
export async function saveConversionRates(
  client: TypedSupabaseClient,
  args: DbFunctions["save_conversion_rates"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function saveConversionRates(
  client: TypedSupabaseClient,
  args: DbFunctions["save_conversion_rates"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["save_conversion_rates"]["Returns"]
  > | null,
): Promise<DbFunctions["save_conversion_rates"]["Returns"] | null>;
export async function saveConversionRates(
  client: TypedSupabaseClient,
  args: DbFunctions["save_conversion_rates"]["Args"] = emptyRpcArgs<"save_conversion_rates">(),
  options?: SupabaseRpcOptions<
    DbFunctions["save_conversion_rates"]["Returns"]
  > | null,
): Promise<DbFunctions["save_conversion_rates"]["Returns"] | null | boolean> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "save_conversion_rates", args),
      "save_conversion_rates",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "save_conversion_rates", args),
      "save_conversion_rates",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "save_conversion_rates", args),
    "save_conversion_rates",
  );
}
