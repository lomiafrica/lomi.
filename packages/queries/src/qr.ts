import { handleSupabaseRpc, type SupabaseRpcOptions } from "@lomi./shared";
import { rpc } from "./rpc.js";
import type { DbFunctions, TypedSupabaseClient } from "./types.js";
import { emptyRpcArgs } from "./call-rpc.js";

export async function createSpiQrCode(
  client: TypedSupabaseClient,
  args?: DbFunctions["create_spi_qr_code"]["Args"],
): Promise<DbFunctions["create_spi_qr_code"]["Returns"] | null>;
export async function createSpiQrCode(
  client: TypedSupabaseClient,
  args: DbFunctions["create_spi_qr_code"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function createSpiQrCode(
  client: TypedSupabaseClient,
  args: DbFunctions["create_spi_qr_code"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["create_spi_qr_code"]["Returns"]
  > | null,
): Promise<DbFunctions["create_spi_qr_code"]["Returns"] | null>;
export async function createSpiQrCode(
  client: TypedSupabaseClient,
  args: DbFunctions["create_spi_qr_code"]["Args"] = emptyRpcArgs<"create_spi_qr_code">(),
  options?: SupabaseRpcOptions<
    DbFunctions["create_spi_qr_code"]["Returns"]
  > | null,
): Promise<DbFunctions["create_spi_qr_code"]["Returns"] | null | boolean> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "create_spi_qr_code", args),
      "create_spi_qr_code",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "create_spi_qr_code", args),
      "create_spi_qr_code",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "create_spi_qr_code", args),
    "create_spi_qr_code",
  );
}

export async function deleteSpiQrCode(
  client: TypedSupabaseClient,
  args?: DbFunctions["delete_spi_qr_code"]["Args"],
): Promise<DbFunctions["delete_spi_qr_code"]["Returns"] | null>;
export async function deleteSpiQrCode(
  client: TypedSupabaseClient,
  args: DbFunctions["delete_spi_qr_code"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function deleteSpiQrCode(
  client: TypedSupabaseClient,
  args: DbFunctions["delete_spi_qr_code"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["delete_spi_qr_code"]["Returns"]
  > | null,
): Promise<DbFunctions["delete_spi_qr_code"]["Returns"] | null>;
export async function deleteSpiQrCode(
  client: TypedSupabaseClient,
  args: DbFunctions["delete_spi_qr_code"]["Args"] = emptyRpcArgs<"delete_spi_qr_code">(),
  options?: SupabaseRpcOptions<
    DbFunctions["delete_spi_qr_code"]["Returns"]
  > | null,
): Promise<DbFunctions["delete_spi_qr_code"]["Returns"] | null | boolean> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "delete_spi_qr_code", args),
      "delete_spi_qr_code",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "delete_spi_qr_code", args),
      "delete_spi_qr_code",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "delete_spi_qr_code", args),
    "delete_spi_qr_code",
  );
}

export async function fetchSpiQrCodes(
  client: TypedSupabaseClient,
  args?: DbFunctions["fetch_spi_qr_codes"]["Args"],
): Promise<DbFunctions["fetch_spi_qr_codes"]["Returns"] | null>;
export async function fetchSpiQrCodes(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_spi_qr_codes"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function fetchSpiQrCodes(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_spi_qr_codes"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["fetch_spi_qr_codes"]["Returns"]
  > | null,
): Promise<DbFunctions["fetch_spi_qr_codes"]["Returns"] | null>;
export async function fetchSpiQrCodes(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_spi_qr_codes"]["Args"] = emptyRpcArgs<"fetch_spi_qr_codes">(),
  options?: SupabaseRpcOptions<
    DbFunctions["fetch_spi_qr_codes"]["Returns"]
  > | null,
): Promise<DbFunctions["fetch_spi_qr_codes"]["Returns"] | null | boolean> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "fetch_spi_qr_codes", args),
      "fetch_spi_qr_codes",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "fetch_spi_qr_codes", args),
      "fetch_spi_qr_codes",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "fetch_spi_qr_codes", args),
    "fetch_spi_qr_codes",
  );
}

export async function getActiveQrCodesCount(
  client: TypedSupabaseClient,
  args?: DbFunctions["get_active_qr_codes_count"]["Args"],
): Promise<DbFunctions["get_active_qr_codes_count"]["Returns"] | null>;
export async function getActiveQrCodesCount(
  client: TypedSupabaseClient,
  args: DbFunctions["get_active_qr_codes_count"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function getActiveQrCodesCount(
  client: TypedSupabaseClient,
  args: DbFunctions["get_active_qr_codes_count"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["get_active_qr_codes_count"]["Returns"]
  > | null,
): Promise<DbFunctions["get_active_qr_codes_count"]["Returns"] | null>;
export async function getActiveQrCodesCount(
  client: TypedSupabaseClient,
  args: DbFunctions["get_active_qr_codes_count"]["Args"] = emptyRpcArgs<"get_active_qr_codes_count">(),
  options?: SupabaseRpcOptions<
    DbFunctions["get_active_qr_codes_count"]["Returns"]
  > | null,
): Promise<
  DbFunctions["get_active_qr_codes_count"]["Returns"] | null | boolean
> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "get_active_qr_codes_count", args),
      "get_active_qr_codes_count",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "get_active_qr_codes_count", args),
      "get_active_qr_codes_count",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "get_active_qr_codes_count", args),
    "get_active_qr_codes_count",
  );
}

export async function getMostPopularQrCode(
  client: TypedSupabaseClient,
  args?: DbFunctions["get_most_popular_qr_code"]["Args"],
): Promise<DbFunctions["get_most_popular_qr_code"]["Returns"] | null>;
export async function getMostPopularQrCode(
  client: TypedSupabaseClient,
  args: DbFunctions["get_most_popular_qr_code"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function getMostPopularQrCode(
  client: TypedSupabaseClient,
  args: DbFunctions["get_most_popular_qr_code"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["get_most_popular_qr_code"]["Returns"]
  > | null,
): Promise<DbFunctions["get_most_popular_qr_code"]["Returns"] | null>;
export async function getMostPopularQrCode(
  client: TypedSupabaseClient,
  args: DbFunctions["get_most_popular_qr_code"]["Args"] = emptyRpcArgs<"get_most_popular_qr_code">(),
  options?: SupabaseRpcOptions<
    DbFunctions["get_most_popular_qr_code"]["Returns"]
  > | null,
): Promise<
  DbFunctions["get_most_popular_qr_code"]["Returns"] | null | boolean
> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "get_most_popular_qr_code", args),
      "get_most_popular_qr_code",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "get_most_popular_qr_code", args),
      "get_most_popular_qr_code",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "get_most_popular_qr_code", args),
    "get_most_popular_qr_code",
  );
}

export async function getQrCodeStatistics(
  client: TypedSupabaseClient,
  args?: DbFunctions["get_qr_code_statistics"]["Args"],
): Promise<DbFunctions["get_qr_code_statistics"]["Returns"] | null>;
export async function getQrCodeStatistics(
  client: TypedSupabaseClient,
  args: DbFunctions["get_qr_code_statistics"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function getQrCodeStatistics(
  client: TypedSupabaseClient,
  args: DbFunctions["get_qr_code_statistics"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["get_qr_code_statistics"]["Returns"]
  > | null,
): Promise<DbFunctions["get_qr_code_statistics"]["Returns"] | null>;
export async function getQrCodeStatistics(
  client: TypedSupabaseClient,
  args: DbFunctions["get_qr_code_statistics"]["Args"] = emptyRpcArgs<"get_qr_code_statistics">(),
  options?: SupabaseRpcOptions<
    DbFunctions["get_qr_code_statistics"]["Returns"]
  > | null,
): Promise<DbFunctions["get_qr_code_statistics"]["Returns"] | null | boolean> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "get_qr_code_statistics", args),
      "get_qr_code_statistics",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "get_qr_code_statistics", args),
      "get_qr_code_statistics",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "get_qr_code_statistics", args),
    "get_qr_code_statistics",
  );
}

export async function updateSpiQrCode(
  client: TypedSupabaseClient,
  args?: DbFunctions["update_spi_qr_code"]["Args"],
): Promise<DbFunctions["update_spi_qr_code"]["Returns"] | null>;
export async function updateSpiQrCode(
  client: TypedSupabaseClient,
  args: DbFunctions["update_spi_qr_code"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function updateSpiQrCode(
  client: TypedSupabaseClient,
  args: DbFunctions["update_spi_qr_code"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["update_spi_qr_code"]["Returns"]
  > | null,
): Promise<DbFunctions["update_spi_qr_code"]["Returns"] | null>;
export async function updateSpiQrCode(
  client: TypedSupabaseClient,
  args: DbFunctions["update_spi_qr_code"]["Args"] = emptyRpcArgs<"update_spi_qr_code">(),
  options?: SupabaseRpcOptions<
    DbFunctions["update_spi_qr_code"]["Returns"]
  > | null,
): Promise<DbFunctions["update_spi_qr_code"]["Returns"] | null | boolean> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "update_spi_qr_code", args),
      "update_spi_qr_code",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "update_spi_qr_code", args),
      "update_spi_qr_code",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "update_spi_qr_code", args),
    "update_spi_qr_code",
  );
}
