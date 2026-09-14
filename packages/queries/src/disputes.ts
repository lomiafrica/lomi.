import { handleSupabaseRpc, type SupabaseRpcOptions } from "@lomi./shared";
import { rpc } from "./rpc.js";
import type { DbFunctions, TypedSupabaseClient } from "./types.js";
import { emptyRpcArgs } from "./call-rpc.js";

export async function fetchOrganizationDisputes(
  client: TypedSupabaseClient,
  args?: DbFunctions["fetch_organization_disputes"]["Args"],
): Promise<DbFunctions["fetch_organization_disputes"]["Returns"] | null>;
export async function fetchOrganizationDisputes(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_organization_disputes"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function fetchOrganizationDisputes(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_organization_disputes"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["fetch_organization_disputes"]["Returns"]
  > | null,
): Promise<DbFunctions["fetch_organization_disputes"]["Returns"] | null>;
export async function fetchOrganizationDisputes(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_organization_disputes"]["Args"] = emptyRpcArgs<"fetch_organization_disputes">(),
  options?: SupabaseRpcOptions<
    DbFunctions["fetch_organization_disputes"]["Returns"]
  > | null,
): Promise<
  DbFunctions["fetch_organization_disputes"]["Returns"] | null | boolean
> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "fetch_organization_disputes", args),
      "fetch_organization_disputes",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "fetch_organization_disputes", args),
      "fetch_organization_disputes",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "fetch_organization_disputes", args),
    "fetch_organization_disputes",
  );
}
