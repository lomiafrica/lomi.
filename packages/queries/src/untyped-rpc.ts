import {
  handleSupabaseRpc,
  type JsonObject,
  type JsonValue,
  type SupabaseRpcOptions,
} from "@lomi./shared";
import type { TypedSupabaseClient, UntypedRpcResult } from "./types.js";

/**
 * Part 8 nitro / insurance / member-limit RPCs are not in generated Database types.
 */
export function untypedRpc(
  client: TypedSupabaseClient,
  fn: string,
  args: JsonObject,
): UntypedRpcResult {
  // SAFETY: These RPCs are absent from Database; supabase-js client.rpc is untyped at this boundary.
  return client.rpc(fn as never, args as never);
}

export async function handleUntypedRpc(
  client: TypedSupabaseClient,
  fn: string,
  args: JsonObject,
  options?: SupabaseRpcOptions<JsonValue>,
): Promise<JsonValue | null | boolean> {
  if (options !== undefined) {
    return handleSupabaseRpc(untypedRpc(client, fn, args), fn, options);
  }
  return handleSupabaseRpc(untypedRpc(client, fn, args), fn);
}
