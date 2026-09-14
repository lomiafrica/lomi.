import { handleSupabaseRpc, type SupabaseRpcOptions } from "@lomi./shared";
import { rpc } from "./rpc.js";
import type { DbFunctions, TypedSupabaseClient } from "./types.js";
import { emptyRpcArgs } from "./call-rpc.js";

export async function fetchOauthMerchantConnections(
  client: TypedSupabaseClient,
  args?: DbFunctions["fetch_oauth_merchant_connections"]["Args"],
): Promise<DbFunctions["fetch_oauth_merchant_connections"]["Returns"] | null>;
export async function fetchOauthMerchantConnections(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_oauth_merchant_connections"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function fetchOauthMerchantConnections(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_oauth_merchant_connections"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["fetch_oauth_merchant_connections"]["Returns"]
  > | null,
): Promise<DbFunctions["fetch_oauth_merchant_connections"]["Returns"] | null>;
export async function fetchOauthMerchantConnections(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_oauth_merchant_connections"]["Args"] = emptyRpcArgs<"fetch_oauth_merchant_connections">(),
  options?: SupabaseRpcOptions<
    DbFunctions["fetch_oauth_merchant_connections"]["Returns"]
  > | null,
): Promise<
  DbFunctions["fetch_oauth_merchant_connections"]["Returns"] | null | boolean
> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "fetch_oauth_merchant_connections", args),
      "fetch_oauth_merchant_connections",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "fetch_oauth_merchant_connections", args),
      "fetch_oauth_merchant_connections",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "fetch_oauth_merchant_connections", args),
    "fetch_oauth_merchant_connections",
  );
}

export async function oauthRevokeMerchantConnection(
  client: TypedSupabaseClient,
  args?: DbFunctions["oauth_revoke_merchant_connection"]["Args"],
): Promise<DbFunctions["oauth_revoke_merchant_connection"]["Returns"] | null>;
export async function oauthRevokeMerchantConnection(
  client: TypedSupabaseClient,
  args: DbFunctions["oauth_revoke_merchant_connection"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function oauthRevokeMerchantConnection(
  client: TypedSupabaseClient,
  args: DbFunctions["oauth_revoke_merchant_connection"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["oauth_revoke_merchant_connection"]["Returns"]
  > | null,
): Promise<DbFunctions["oauth_revoke_merchant_connection"]["Returns"] | null>;
export async function oauthRevokeMerchantConnection(
  client: TypedSupabaseClient,
  args: DbFunctions["oauth_revoke_merchant_connection"]["Args"] = emptyRpcArgs<"oauth_revoke_merchant_connection">(),
  options?: SupabaseRpcOptions<
    DbFunctions["oauth_revoke_merchant_connection"]["Returns"]
  > | null,
): Promise<
  DbFunctions["oauth_revoke_merchant_connection"]["Returns"] | null | boolean
> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "oauth_revoke_merchant_connection", args),
      "oauth_revoke_merchant_connection",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "oauth_revoke_merchant_connection", args),
      "oauth_revoke_merchant_connection",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "oauth_revoke_merchant_connection", args),
    "oauth_revoke_merchant_connection",
  );
}
