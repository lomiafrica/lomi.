import { handleSupabaseRpc, type SupabaseRpcOptions } from "@lomi./shared";
import { rpc } from "./rpc.js";
import type { DbFunctions, TypedSupabaseClient } from "./types.js";

/**
 * Empty args for Postgres RPCs whose generated Args record is all-optional.
 */
export function emptyRpcArgs<
  Fn extends keyof DbFunctions,
>(): DbFunctions[Fn]["Args"] {
  // SAFETY: PG RPCs with all-optional arg records accept {}; Database Args may mark fields required syntactically.
  return {} as DbFunctions[Fn]["Args"];
}

/**
 * Thin typed RPC helper for domain modules and call-site migration.
 * Prefer named domain wrappers when they exist.
 */
export async function callRpc<Fn extends keyof DbFunctions>(
  client: TypedSupabaseClient,
  fn: Fn,
  args: DbFunctions[Fn]["Args"],
  operationName?: string,
  options?: SupabaseRpcOptions<DbFunctions[Fn]["Returns"]>,
): Promise<DbFunctions[Fn]["Returns"] | null | boolean> {
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, fn, args),
      operationName ?? String(fn),
      options,
    );
  }
  return handleSupabaseRpc(rpc(client, fn, args), operationName ?? String(fn));
}

/** Void / side-effect RPCs — returns true on success. */
export async function callRpcVoid<Fn extends keyof DbFunctions>(
  client: TypedSupabaseClient,
  fn: Fn,
  args: DbFunctions[Fn]["Args"],
  operationName?: string,
): Promise<boolean> {
  const result = await handleSupabaseRpc(
    rpc(client, fn, args),
    operationName ?? String(fn),
    { expectReturnValue: false },
  );
  return result === true;
}
