import { handleSupabaseRpc, type SupabaseRpcOptions } from "@lomi./shared";
import { rpc } from "./rpc.js";
import type { DbFunctions, TypedSupabaseClient } from "./types.js";
import { emptyRpcArgs } from "./call-rpc.js";

export async function getEffectiveOtherFeeConfig(
  client: TypedSupabaseClient,
  args?: DbFunctions["get_effective_other_fee_config"]["Args"],
): Promise<DbFunctions["get_effective_other_fee_config"]["Returns"] | null>;
export async function getEffectiveOtherFeeConfig(
  client: TypedSupabaseClient,
  args: DbFunctions["get_effective_other_fee_config"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function getEffectiveOtherFeeConfig(
  client: TypedSupabaseClient,
  args: DbFunctions["get_effective_other_fee_config"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["get_effective_other_fee_config"]["Returns"]
  > | null,
): Promise<DbFunctions["get_effective_other_fee_config"]["Returns"] | null>;
export async function getEffectiveOtherFeeConfig(
  client: TypedSupabaseClient,
  args: DbFunctions["get_effective_other_fee_config"]["Args"] = emptyRpcArgs<"get_effective_other_fee_config">(),
  options?: SupabaseRpcOptions<
    DbFunctions["get_effective_other_fee_config"]["Returns"]
  > | null,
): Promise<
  DbFunctions["get_effective_other_fee_config"]["Returns"] | null | boolean
> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "get_effective_other_fee_config", args),
      "get_effective_other_fee_config",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "get_effective_other_fee_config", args),
      "get_effective_other_fee_config",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "get_effective_other_fee_config", args),
    "get_effective_other_fee_config",
  );
}
