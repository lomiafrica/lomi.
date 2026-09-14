import { handleSupabaseRpc, type SupabaseRpcOptions } from "@lomi./shared";
import { rpc } from "./rpc.js";
import type { DbFunctions, TypedSupabaseClient } from "./types.js";
import { emptyRpcArgs } from "./call-rpc.js";

export async function addOrganizationDomain(
  client: TypedSupabaseClient,
  args?: DbFunctions["add_organization_domain"]["Args"],
): Promise<DbFunctions["add_organization_domain"]["Returns"] | null>;
export async function addOrganizationDomain(
  client: TypedSupabaseClient,
  args: DbFunctions["add_organization_domain"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function addOrganizationDomain(
  client: TypedSupabaseClient,
  args: DbFunctions["add_organization_domain"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["add_organization_domain"]["Returns"]
  > | null,
): Promise<DbFunctions["add_organization_domain"]["Returns"] | null>;
export async function addOrganizationDomain(
  client: TypedSupabaseClient,
  args: DbFunctions["add_organization_domain"]["Args"] = emptyRpcArgs<"add_organization_domain">(),
  options?: SupabaseRpcOptions<
    DbFunctions["add_organization_domain"]["Returns"]
  > | null,
): Promise<DbFunctions["add_organization_domain"]["Returns"] | null | boolean> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "add_organization_domain", args),
      "add_organization_domain",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "add_organization_domain", args),
      "add_organization_domain",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "add_organization_domain", args),
    "add_organization_domain",
  );
}

export async function deleteOrganizationDomain(
  client: TypedSupabaseClient,
  args?: DbFunctions["delete_organization_domain"]["Args"],
): Promise<DbFunctions["delete_organization_domain"]["Returns"] | null>;
export async function deleteOrganizationDomain(
  client: TypedSupabaseClient,
  args: DbFunctions["delete_organization_domain"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function deleteOrganizationDomain(
  client: TypedSupabaseClient,
  args: DbFunctions["delete_organization_domain"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["delete_organization_domain"]["Returns"]
  > | null,
): Promise<DbFunctions["delete_organization_domain"]["Returns"] | null>;
export async function deleteOrganizationDomain(
  client: TypedSupabaseClient,
  args: DbFunctions["delete_organization_domain"]["Args"] = emptyRpcArgs<"delete_organization_domain">(),
  options?: SupabaseRpcOptions<
    DbFunctions["delete_organization_domain"]["Returns"]
  > | null,
): Promise<
  DbFunctions["delete_organization_domain"]["Returns"] | null | boolean
> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "delete_organization_domain", args),
      "delete_organization_domain",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "delete_organization_domain", args),
      "delete_organization_domain",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "delete_organization_domain", args),
    "delete_organization_domain",
  );
}

export async function getOrganizationDomains(
  client: TypedSupabaseClient,
  args?: DbFunctions["get_organization_domains"]["Args"],
): Promise<DbFunctions["get_organization_domains"]["Returns"] | null>;
export async function getOrganizationDomains(
  client: TypedSupabaseClient,
  args: DbFunctions["get_organization_domains"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function getOrganizationDomains(
  client: TypedSupabaseClient,
  args: DbFunctions["get_organization_domains"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["get_organization_domains"]["Returns"]
  > | null,
): Promise<DbFunctions["get_organization_domains"]["Returns"] | null>;
export async function getOrganizationDomains(
  client: TypedSupabaseClient,
  args: DbFunctions["get_organization_domains"]["Args"] = emptyRpcArgs<"get_organization_domains">(),
  options?: SupabaseRpcOptions<
    DbFunctions["get_organization_domains"]["Returns"]
  > | null,
): Promise<
  DbFunctions["get_organization_domains"]["Returns"] | null | boolean
> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "get_organization_domains", args),
      "get_organization_domains",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "get_organization_domains", args),
      "get_organization_domains",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "get_organization_domains", args),
    "get_organization_domains",
  );
}
