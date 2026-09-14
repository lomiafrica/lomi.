import { handleSupabaseRpc, type SupabaseRpcOptions } from "@lomi./shared";
import { rpc } from "./rpc.js";
import type { DbFunctions, TypedSupabaseClient } from "./types.js";
import { emptyRpcArgs } from "./call-rpc.js";

export async function getCustomerPortalOrgUrl(
  client: TypedSupabaseClient,
  args?: DbFunctions["get_customer_portal_org_url"]["Args"],
): Promise<DbFunctions["get_customer_portal_org_url"]["Returns"] | null>;
export async function getCustomerPortalOrgUrl(
  client: TypedSupabaseClient,
  args: DbFunctions["get_customer_portal_org_url"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function getCustomerPortalOrgUrl(
  client: TypedSupabaseClient,
  args: DbFunctions["get_customer_portal_org_url"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["get_customer_portal_org_url"]["Returns"]
  > | null,
): Promise<DbFunctions["get_customer_portal_org_url"]["Returns"] | null>;
export async function getCustomerPortalOrgUrl(
  client: TypedSupabaseClient,
  args: DbFunctions["get_customer_portal_org_url"]["Args"] = emptyRpcArgs<"get_customer_portal_org_url">(),
  options?: SupabaseRpcOptions<
    DbFunctions["get_customer_portal_org_url"]["Returns"]
  > | null,
): Promise<
  DbFunctions["get_customer_portal_org_url"]["Returns"] | null | boolean
> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "get_customer_portal_org_url", args),
      "get_customer_portal_org_url",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "get_customer_portal_org_url", args),
      "get_customer_portal_org_url",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "get_customer_portal_org_url", args),
    "get_customer_portal_org_url",
  );
}

export async function getOrganizationCustomerPortalPolicyResolved(
  client: TypedSupabaseClient,
  args?: DbFunctions["get_organization_customer_portal_policy_resolved"]["Args"],
): Promise<
  | DbFunctions["get_organization_customer_portal_policy_resolved"]["Returns"]
  | null
>;
export async function getOrganizationCustomerPortalPolicyResolved(
  client: TypedSupabaseClient,
  args: DbFunctions["get_organization_customer_portal_policy_resolved"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function getOrganizationCustomerPortalPolicyResolved(
  client: TypedSupabaseClient,
  args: DbFunctions["get_organization_customer_portal_policy_resolved"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["get_organization_customer_portal_policy_resolved"]["Returns"]
  > | null,
): Promise<
  | DbFunctions["get_organization_customer_portal_policy_resolved"]["Returns"]
  | null
>;
export async function getOrganizationCustomerPortalPolicyResolved(
  client: TypedSupabaseClient,
  args: DbFunctions["get_organization_customer_portal_policy_resolved"]["Args"] = emptyRpcArgs<"get_organization_customer_portal_policy_resolved">(),
  options?: SupabaseRpcOptions<
    DbFunctions["get_organization_customer_portal_policy_resolved"]["Returns"]
  > | null,
): Promise<
  | DbFunctions["get_organization_customer_portal_policy_resolved"]["Returns"]
  | null
  | boolean
> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "get_organization_customer_portal_policy_resolved", args),
      "get_organization_customer_portal_policy_resolved",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "get_organization_customer_portal_policy_resolved", args),
      "get_organization_customer_portal_policy_resolved",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "get_organization_customer_portal_policy_resolved", args),
    "get_organization_customer_portal_policy_resolved",
  );
}

export async function merchantListCustomerPortalAuditEvents(
  client: TypedSupabaseClient,
  args?: DbFunctions["merchant_list_customer_portal_audit_events"]["Args"],
): Promise<
  DbFunctions["merchant_list_customer_portal_audit_events"]["Returns"] | null
>;
export async function merchantListCustomerPortalAuditEvents(
  client: TypedSupabaseClient,
  args: DbFunctions["merchant_list_customer_portal_audit_events"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function merchantListCustomerPortalAuditEvents(
  client: TypedSupabaseClient,
  args: DbFunctions["merchant_list_customer_portal_audit_events"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["merchant_list_customer_portal_audit_events"]["Returns"]
  > | null,
): Promise<
  DbFunctions["merchant_list_customer_portal_audit_events"]["Returns"] | null
>;
export async function merchantListCustomerPortalAuditEvents(
  client: TypedSupabaseClient,
  args: DbFunctions["merchant_list_customer_portal_audit_events"]["Args"] = emptyRpcArgs<"merchant_list_customer_portal_audit_events">(),
  options?: SupabaseRpcOptions<
    DbFunctions["merchant_list_customer_portal_audit_events"]["Returns"]
  > | null,
): Promise<
  | DbFunctions["merchant_list_customer_portal_audit_events"]["Returns"]
  | null
  | boolean
> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "merchant_list_customer_portal_audit_events", args),
      "merchant_list_customer_portal_audit_events",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "merchant_list_customer_portal_audit_events", args),
      "merchant_list_customer_portal_audit_events",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "merchant_list_customer_portal_audit_events", args),
    "merchant_list_customer_portal_audit_events",
  );
}

export async function upsertOrganizationCustomerPortalPolicy(
  client: TypedSupabaseClient,
  args?: DbFunctions["upsert_organization_customer_portal_policy"]["Args"],
): Promise<
  DbFunctions["upsert_organization_customer_portal_policy"]["Returns"] | null
>;
export async function upsertOrganizationCustomerPortalPolicy(
  client: TypedSupabaseClient,
  args: DbFunctions["upsert_organization_customer_portal_policy"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function upsertOrganizationCustomerPortalPolicy(
  client: TypedSupabaseClient,
  args: DbFunctions["upsert_organization_customer_portal_policy"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["upsert_organization_customer_portal_policy"]["Returns"]
  > | null,
): Promise<
  DbFunctions["upsert_organization_customer_portal_policy"]["Returns"] | null
>;
export async function upsertOrganizationCustomerPortalPolicy(
  client: TypedSupabaseClient,
  args: DbFunctions["upsert_organization_customer_portal_policy"]["Args"] = emptyRpcArgs<"upsert_organization_customer_portal_policy">(),
  options?: SupabaseRpcOptions<
    DbFunctions["upsert_organization_customer_portal_policy"]["Returns"]
  > | null,
): Promise<
  | DbFunctions["upsert_organization_customer_portal_policy"]["Returns"]
  | null
  | boolean
> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "upsert_organization_customer_portal_policy", args),
      "upsert_organization_customer_portal_policy",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "upsert_organization_customer_portal_policy", args),
      "upsert_organization_customer_portal_policy",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "upsert_organization_customer_portal_policy", args),
    "upsert_organization_customer_portal_policy",
  );
}
