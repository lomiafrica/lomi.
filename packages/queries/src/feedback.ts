import { handleSupabaseRpc, type SupabaseRpcOptions } from "@lomi./shared";
import { rpc } from "./rpc.js";
import type { DbFunctions, TypedSupabaseClient } from "./types.js";
import { emptyRpcArgs } from "./call-rpc.js";

export async function createFeedback(
  client: TypedSupabaseClient,
  args?: DbFunctions["create_feedback"]["Args"],
): Promise<DbFunctions["create_feedback"]["Returns"] | null>;
export async function createFeedback(
  client: TypedSupabaseClient,
  args: DbFunctions["create_feedback"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function createFeedback(
  client: TypedSupabaseClient,
  args: DbFunctions["create_feedback"]["Args"],
  options: SupabaseRpcOptions<DbFunctions["create_feedback"]["Returns"]> | null,
): Promise<DbFunctions["create_feedback"]["Returns"] | null>;
export async function createFeedback(
  client: TypedSupabaseClient,
  args: DbFunctions["create_feedback"]["Args"] = emptyRpcArgs<"create_feedback">(),
  options?: SupabaseRpcOptions<
    DbFunctions["create_feedback"]["Returns"]
  > | null,
): Promise<DbFunctions["create_feedback"]["Returns"] | null | boolean> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "create_feedback", args),
      "create_feedback",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "create_feedback", args),
      "create_feedback",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "create_feedback", args),
    "create_feedback",
  );
}
