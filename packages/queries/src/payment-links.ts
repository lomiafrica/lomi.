import { handleSupabaseRpc, type SupabaseRpcOptions } from "@lomi./shared";
import { rpc } from "./rpc.js";
import type { DbFunctions, TypedSupabaseClient } from "./types.js";
import { emptyRpcArgs } from "./call-rpc.js";

export async function createPaymentLink(
  client: TypedSupabaseClient,
  args?: DbFunctions["create_payment_link"]["Args"],
): Promise<DbFunctions["create_payment_link"]["Returns"] | null>;
export async function createPaymentLink(
  client: TypedSupabaseClient,
  args: DbFunctions["create_payment_link"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function createPaymentLink(
  client: TypedSupabaseClient,
  args: DbFunctions["create_payment_link"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["create_payment_link"]["Returns"]
  > | null,
): Promise<DbFunctions["create_payment_link"]["Returns"] | null>;
export async function createPaymentLink(
  client: TypedSupabaseClient,
  args: DbFunctions["create_payment_link"]["Args"] = emptyRpcArgs<"create_payment_link">(),
  options?: SupabaseRpcOptions<
    DbFunctions["create_payment_link"]["Returns"]
  > | null,
): Promise<DbFunctions["create_payment_link"]["Returns"] | null | boolean> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "create_payment_link", args),
      "create_payment_link",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "create_payment_link", args),
      "create_payment_link",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "create_payment_link", args),
    "create_payment_link",
  );
}

export async function getPaymentLink(
  client: TypedSupabaseClient,
  args?: DbFunctions["get_payment_link"]["Args"],
): Promise<DbFunctions["get_payment_link"]["Returns"] | null>;
export async function getPaymentLink(
  client: TypedSupabaseClient,
  args: DbFunctions["get_payment_link"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function getPaymentLink(
  client: TypedSupabaseClient,
  args: DbFunctions["get_payment_link"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["get_payment_link"]["Returns"]
  > | null,
): Promise<DbFunctions["get_payment_link"]["Returns"] | null>;
export async function getPaymentLink(
  client: TypedSupabaseClient,
  args: DbFunctions["get_payment_link"]["Args"] = emptyRpcArgs<"get_payment_link">(),
  options?: SupabaseRpcOptions<
    DbFunctions["get_payment_link"]["Returns"]
  > | null,
): Promise<DbFunctions["get_payment_link"]["Returns"] | null | boolean> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "get_payment_link", args),
      "get_payment_link",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "get_payment_link", args),
      "get_payment_link",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "get_payment_link", args),
    "get_payment_link",
  );
}

export async function fetchPaymentLinks(
  client: TypedSupabaseClient,
  args?: DbFunctions["fetch_payment_links"]["Args"],
): Promise<DbFunctions["fetch_payment_links"]["Returns"] | null>;
export async function fetchPaymentLinks(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_payment_links"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function fetchPaymentLinks(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_payment_links"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["fetch_payment_links"]["Returns"]
  > | null,
): Promise<DbFunctions["fetch_payment_links"]["Returns"] | null>;
export async function fetchPaymentLinks(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_payment_links"]["Args"] = emptyRpcArgs<"fetch_payment_links">(),
  options?: SupabaseRpcOptions<
    DbFunctions["fetch_payment_links"]["Returns"]
  > | null,
): Promise<DbFunctions["fetch_payment_links"]["Returns"] | null | boolean> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "fetch_payment_links", args),
      "fetch_payment_links",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "fetch_payment_links", args),
      "fetch_payment_links",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "fetch_payment_links", args),
    "fetch_payment_links",
  );
}

export async function safeDeletePaymentLink(
  client: TypedSupabaseClient,
  args?: DbFunctions["safe_delete_payment_link"]["Args"],
): Promise<DbFunctions["safe_delete_payment_link"]["Returns"] | null>;
export async function safeDeletePaymentLink(
  client: TypedSupabaseClient,
  args: DbFunctions["safe_delete_payment_link"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function safeDeletePaymentLink(
  client: TypedSupabaseClient,
  args: DbFunctions["safe_delete_payment_link"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["safe_delete_payment_link"]["Returns"]
  > | null,
): Promise<DbFunctions["safe_delete_payment_link"]["Returns"] | null>;
export async function safeDeletePaymentLink(
  client: TypedSupabaseClient,
  args: DbFunctions["safe_delete_payment_link"]["Args"] = emptyRpcArgs<"safe_delete_payment_link">(),
  options?: SupabaseRpcOptions<
    DbFunctions["safe_delete_payment_link"]["Returns"]
  > | null,
): Promise<
  DbFunctions["safe_delete_payment_link"]["Returns"] | null | boolean
> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "safe_delete_payment_link", args),
      "safe_delete_payment_link",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "safe_delete_payment_link", args),
      "safe_delete_payment_link",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "safe_delete_payment_link", args),
    "safe_delete_payment_link",
  );
}

export async function unarchivePaymentLink(
  client: TypedSupabaseClient,
  args?: DbFunctions["unarchive_payment_link"]["Args"],
): Promise<DbFunctions["unarchive_payment_link"]["Returns"] | null>;
export async function unarchivePaymentLink(
  client: TypedSupabaseClient,
  args: DbFunctions["unarchive_payment_link"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function unarchivePaymentLink(
  client: TypedSupabaseClient,
  args: DbFunctions["unarchive_payment_link"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["unarchive_payment_link"]["Returns"]
  > | null,
): Promise<DbFunctions["unarchive_payment_link"]["Returns"] | null>;
export async function unarchivePaymentLink(
  client: TypedSupabaseClient,
  args: DbFunctions["unarchive_payment_link"]["Args"] = emptyRpcArgs<"unarchive_payment_link">(),
  options?: SupabaseRpcOptions<
    DbFunctions["unarchive_payment_link"]["Returns"]
  > | null,
): Promise<DbFunctions["unarchive_payment_link"]["Returns"] | null | boolean> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "unarchive_payment_link", args),
      "unarchive_payment_link",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "unarchive_payment_link", args),
      "unarchive_payment_link",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "unarchive_payment_link", args),
    "unarchive_payment_link",
  );
}

export async function updatePaymentLink(
  client: TypedSupabaseClient,
  args?: DbFunctions["update_payment_link"]["Args"],
): Promise<DbFunctions["update_payment_link"]["Returns"] | null>;
export async function updatePaymentLink(
  client: TypedSupabaseClient,
  args: DbFunctions["update_payment_link"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function updatePaymentLink(
  client: TypedSupabaseClient,
  args: DbFunctions["update_payment_link"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["update_payment_link"]["Returns"]
  > | null,
): Promise<DbFunctions["update_payment_link"]["Returns"] | null>;
export async function updatePaymentLink(
  client: TypedSupabaseClient,
  args: DbFunctions["update_payment_link"]["Args"] = emptyRpcArgs<"update_payment_link">(),
  options?: SupabaseRpcOptions<
    DbFunctions["update_payment_link"]["Returns"]
  > | null,
): Promise<DbFunctions["update_payment_link"]["Returns"] | null | boolean> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "update_payment_link", args),
      "update_payment_link",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "update_payment_link", args),
      "update_payment_link",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "update_payment_link", args),
    "update_payment_link",
  );
}
