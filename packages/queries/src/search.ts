import { handleSupabaseRpc, type SupabaseRpcOptions } from "@lomi./shared";
import { rpc } from "./rpc.js";
import type { DbFunctions, TypedSupabaseClient } from "./types.js";
import { emptyRpcArgs } from "./call-rpc.js";

export async function searchGlobal(
  client: TypedSupabaseClient,
  args?: DbFunctions["search_global"]["Args"],
): Promise<DbFunctions["search_global"]["Returns"] | null>;
export async function searchGlobal(
  client: TypedSupabaseClient,
  args: DbFunctions["search_global"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function searchGlobal(
  client: TypedSupabaseClient,
  args: DbFunctions["search_global"]["Args"],
  options: SupabaseRpcOptions<DbFunctions["search_global"]["Returns"]> | null,
): Promise<DbFunctions["search_global"]["Returns"] | null>;
export async function searchGlobal(
  client: TypedSupabaseClient,
  args: DbFunctions["search_global"]["Args"] = emptyRpcArgs<"search_global">(),
  options?: SupabaseRpcOptions<DbFunctions["search_global"]["Returns"]> | null,
): Promise<DbFunctions["search_global"]["Returns"] | null | boolean> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "search_global", args),
      "search_global",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "search_global", args),
      "search_global",
      options,
    );
  }
  return handleSupabaseRpc(rpc(client, "search_global", args), "search_global");
}
