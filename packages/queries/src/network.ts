import { handleSupabaseRpc, type SupabaseRpcOptions } from "@lomi./shared";
import { rpc } from "./rpc.js";
import type { DbFunctions, TypedSupabaseClient } from "./types.js";
import { emptyRpcArgs } from "./call-rpc.js";

export async function cancelNetworkEnrollmentSession(
  client: TypedSupabaseClient,
  args?: DbFunctions["cancel_network_enrollment_session"]["Args"],
): Promise<DbFunctions["cancel_network_enrollment_session"]["Returns"] | null>;
export async function cancelNetworkEnrollmentSession(
  client: TypedSupabaseClient,
  args: DbFunctions["cancel_network_enrollment_session"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function cancelNetworkEnrollmentSession(
  client: TypedSupabaseClient,
  args: DbFunctions["cancel_network_enrollment_session"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["cancel_network_enrollment_session"]["Returns"]
  > | null,
): Promise<DbFunctions["cancel_network_enrollment_session"]["Returns"] | null>;
export async function cancelNetworkEnrollmentSession(
  client: TypedSupabaseClient,
  args: DbFunctions["cancel_network_enrollment_session"]["Args"] = emptyRpcArgs<"cancel_network_enrollment_session">(),
  options?: SupabaseRpcOptions<
    DbFunctions["cancel_network_enrollment_session"]["Returns"]
  > | null,
): Promise<
  DbFunctions["cancel_network_enrollment_session"]["Returns"] | null | boolean
> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "cancel_network_enrollment_session", args),
      "cancel_network_enrollment_session",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "cancel_network_enrollment_session", args),
      "cancel_network_enrollment_session",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "cancel_network_enrollment_session", args),
    "cancel_network_enrollment_session",
  );
}

export async function completeNetworkEnrollmentWithProfile(
  client: TypedSupabaseClient,
  args?: DbFunctions["complete_network_enrollment_with_profile"]["Args"],
): Promise<
  DbFunctions["complete_network_enrollment_with_profile"]["Returns"] | null
>;
export async function completeNetworkEnrollmentWithProfile(
  client: TypedSupabaseClient,
  args: DbFunctions["complete_network_enrollment_with_profile"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function completeNetworkEnrollmentWithProfile(
  client: TypedSupabaseClient,
  args: DbFunctions["complete_network_enrollment_with_profile"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["complete_network_enrollment_with_profile"]["Returns"]
  > | null,
): Promise<
  DbFunctions["complete_network_enrollment_with_profile"]["Returns"] | null
>;
export async function completeNetworkEnrollmentWithProfile(
  client: TypedSupabaseClient,
  args: DbFunctions["complete_network_enrollment_with_profile"]["Args"] = emptyRpcArgs<"complete_network_enrollment_with_profile">(),
  options?: SupabaseRpcOptions<
    DbFunctions["complete_network_enrollment_with_profile"]["Returns"]
  > | null,
): Promise<
  | DbFunctions["complete_network_enrollment_with_profile"]["Returns"]
  | null
  | boolean
> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "complete_network_enrollment_with_profile", args),
      "complete_network_enrollment_with_profile",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "complete_network_enrollment_with_profile", args),
      "complete_network_enrollment_with_profile",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "complete_network_enrollment_with_profile", args),
    "complete_network_enrollment_with_profile",
  );
}

export async function createNetworkEnrollmentSession(
  client: TypedSupabaseClient,
  args?: DbFunctions["create_network_enrollment_session"]["Args"],
): Promise<DbFunctions["create_network_enrollment_session"]["Returns"] | null>;
export async function createNetworkEnrollmentSession(
  client: TypedSupabaseClient,
  args: DbFunctions["create_network_enrollment_session"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function createNetworkEnrollmentSession(
  client: TypedSupabaseClient,
  args: DbFunctions["create_network_enrollment_session"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["create_network_enrollment_session"]["Returns"]
  > | null,
): Promise<DbFunctions["create_network_enrollment_session"]["Returns"] | null>;
export async function createNetworkEnrollmentSession(
  client: TypedSupabaseClient,
  args: DbFunctions["create_network_enrollment_session"]["Args"] = emptyRpcArgs<"create_network_enrollment_session">(),
  options?: SupabaseRpcOptions<
    DbFunctions["create_network_enrollment_session"]["Returns"]
  > | null,
): Promise<
  DbFunctions["create_network_enrollment_session"]["Returns"] | null | boolean
> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "create_network_enrollment_session", args),
      "create_network_enrollment_session",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "create_network_enrollment_session", args),
      "create_network_enrollment_session",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "create_network_enrollment_session", args),
    "create_network_enrollment_session",
  );
}

export async function fetchNetworkEnrollmentSession(
  client: TypedSupabaseClient,
  args?: DbFunctions["fetch_network_enrollment_session"]["Args"],
): Promise<DbFunctions["fetch_network_enrollment_session"]["Returns"] | null>;
export async function fetchNetworkEnrollmentSession(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_network_enrollment_session"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function fetchNetworkEnrollmentSession(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_network_enrollment_session"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["fetch_network_enrollment_session"]["Returns"]
  > | null,
): Promise<DbFunctions["fetch_network_enrollment_session"]["Returns"] | null>;
export async function fetchNetworkEnrollmentSession(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_network_enrollment_session"]["Args"] = emptyRpcArgs<"fetch_network_enrollment_session">(),
  options?: SupabaseRpcOptions<
    DbFunctions["fetch_network_enrollment_session"]["Returns"]
  > | null,
): Promise<
  DbFunctions["fetch_network_enrollment_session"]["Returns"] | null | boolean
> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "fetch_network_enrollment_session", args),
      "fetch_network_enrollment_session",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "fetch_network_enrollment_session", args),
      "fetch_network_enrollment_session",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "fetch_network_enrollment_session", args),
    "fetch_network_enrollment_session",
  );
}

export async function fetchNetworkEnrollments(
  client: TypedSupabaseClient,
  args?: DbFunctions["fetch_network_enrollments"]["Args"],
): Promise<DbFunctions["fetch_network_enrollments"]["Returns"] | null>;
export async function fetchNetworkEnrollments(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_network_enrollments"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function fetchNetworkEnrollments(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_network_enrollments"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["fetch_network_enrollments"]["Returns"]
  > | null,
): Promise<DbFunctions["fetch_network_enrollments"]["Returns"] | null>;
export async function fetchNetworkEnrollments(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_network_enrollments"]["Args"] = emptyRpcArgs<"fetch_network_enrollments">(),
  options?: SupabaseRpcOptions<
    DbFunctions["fetch_network_enrollments"]["Returns"]
  > | null,
): Promise<
  DbFunctions["fetch_network_enrollments"]["Returns"] | null | boolean
> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "fetch_network_enrollments", args),
      "fetch_network_enrollments",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "fetch_network_enrollments", args),
      "fetch_network_enrollments",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "fetch_network_enrollments", args),
    "fetch_network_enrollments",
  );
}

export async function fetchNetworkMembers(
  client: TypedSupabaseClient,
  args?: DbFunctions["fetch_network_members"]["Args"],
): Promise<DbFunctions["fetch_network_members"]["Returns"] | null>;
export async function fetchNetworkMembers(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_network_members"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function fetchNetworkMembers(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_network_members"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["fetch_network_members"]["Returns"]
  > | null,
): Promise<DbFunctions["fetch_network_members"]["Returns"] | null>;
export async function fetchNetworkMembers(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_network_members"]["Args"] = emptyRpcArgs<"fetch_network_members">(),
  options?: SupabaseRpcOptions<
    DbFunctions["fetch_network_members"]["Returns"]
  > | null,
): Promise<DbFunctions["fetch_network_members"]["Returns"] | null | boolean> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "fetch_network_members", args),
      "fetch_network_members",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "fetch_network_members", args),
      "fetch_network_members",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "fetch_network_members", args),
    "fetch_network_members",
  );
}

export async function fetchNetworkOperatorFeeEntries(
  client: TypedSupabaseClient,
  args?: DbFunctions["fetch_network_operator_fee_entries"]["Args"],
): Promise<DbFunctions["fetch_network_operator_fee_entries"]["Returns"] | null>;
export async function fetchNetworkOperatorFeeEntries(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_network_operator_fee_entries"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function fetchNetworkOperatorFeeEntries(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_network_operator_fee_entries"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["fetch_network_operator_fee_entries"]["Returns"]
  > | null,
): Promise<DbFunctions["fetch_network_operator_fee_entries"]["Returns"] | null>;
export async function fetchNetworkOperatorFeeEntries(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_network_operator_fee_entries"]["Args"] = emptyRpcArgs<"fetch_network_operator_fee_entries">(),
  options?: SupabaseRpcOptions<
    DbFunctions["fetch_network_operator_fee_entries"]["Returns"]
  > | null,
): Promise<
  DbFunctions["fetch_network_operator_fee_entries"]["Returns"] | null | boolean
> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "fetch_network_operator_fee_entries", args),
      "fetch_network_operator_fee_entries",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "fetch_network_operator_fee_entries", args),
      "fetch_network_operator_fee_entries",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "fetch_network_operator_fee_entries", args),
    "fetch_network_operator_fee_entries",
  );
}

export async function fetchNetworkOperatorFeeRules(
  client: TypedSupabaseClient,
  args?: DbFunctions["fetch_network_operator_fee_rules"]["Args"],
): Promise<DbFunctions["fetch_network_operator_fee_rules"]["Returns"] | null>;
export async function fetchNetworkOperatorFeeRules(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_network_operator_fee_rules"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function fetchNetworkOperatorFeeRules(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_network_operator_fee_rules"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["fetch_network_operator_fee_rules"]["Returns"]
  > | null,
): Promise<DbFunctions["fetch_network_operator_fee_rules"]["Returns"] | null>;
export async function fetchNetworkOperatorFeeRules(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_network_operator_fee_rules"]["Args"] = emptyRpcArgs<"fetch_network_operator_fee_rules">(),
  options?: SupabaseRpcOptions<
    DbFunctions["fetch_network_operator_fee_rules"]["Returns"]
  > | null,
): Promise<
  DbFunctions["fetch_network_operator_fee_rules"]["Returns"] | null | boolean
> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "fetch_network_operator_fee_rules", args),
      "fetch_network_operator_fee_rules",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "fetch_network_operator_fee_rules", args),
      "fetch_network_operator_fee_rules",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "fetch_network_operator_fee_rules", args),
    "fetch_network_operator_fee_rules",
  );
}

export async function fetchNetworkOrganizationContext(
  client: TypedSupabaseClient,
  args?: DbFunctions["fetch_network_organization_context"]["Args"],
): Promise<DbFunctions["fetch_network_organization_context"]["Returns"] | null>;
export async function fetchNetworkOrganizationContext(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_network_organization_context"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function fetchNetworkOrganizationContext(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_network_organization_context"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["fetch_network_organization_context"]["Returns"]
  > | null,
): Promise<DbFunctions["fetch_network_organization_context"]["Returns"] | null>;
export async function fetchNetworkOrganizationContext(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_network_organization_context"]["Args"] = emptyRpcArgs<"fetch_network_organization_context">(),
  options?: SupabaseRpcOptions<
    DbFunctions["fetch_network_organization_context"]["Returns"]
  > | null,
): Promise<
  DbFunctions["fetch_network_organization_context"]["Returns"] | null | boolean
> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "fetch_network_organization_context", args),
      "fetch_network_organization_context",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "fetch_network_organization_context", args),
      "fetch_network_organization_context",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "fetch_network_organization_context", args),
    "fetch_network_organization_context",
  );
}

export async function fetchNetworkOverviewMetrics(
  client: TypedSupabaseClient,
  args?: DbFunctions["fetch_network_overview_metrics"]["Args"],
): Promise<DbFunctions["fetch_network_overview_metrics"]["Returns"] | null>;
export async function fetchNetworkOverviewMetrics(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_network_overview_metrics"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function fetchNetworkOverviewMetrics(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_network_overview_metrics"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["fetch_network_overview_metrics"]["Returns"]
  > | null,
): Promise<DbFunctions["fetch_network_overview_metrics"]["Returns"] | null>;
export async function fetchNetworkOverviewMetrics(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_network_overview_metrics"]["Args"] = emptyRpcArgs<"fetch_network_overview_metrics">(),
  options?: SupabaseRpcOptions<
    DbFunctions["fetch_network_overview_metrics"]["Returns"]
  > | null,
): Promise<
  DbFunctions["fetch_network_overview_metrics"]["Returns"] | null | boolean
> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "fetch_network_overview_metrics", args),
      "fetch_network_overview_metrics",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "fetch_network_overview_metrics", args),
      "fetch_network_overview_metrics",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "fetch_network_overview_metrics", args),
    "fetch_network_overview_metrics",
  );
}

export async function setNetworkCapabilityGrant(
  client: TypedSupabaseClient,
  args?: DbFunctions["set_network_capability_grant"]["Args"],
): Promise<DbFunctions["set_network_capability_grant"]["Returns"] | null>;
export async function setNetworkCapabilityGrant(
  client: TypedSupabaseClient,
  args: DbFunctions["set_network_capability_grant"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function setNetworkCapabilityGrant(
  client: TypedSupabaseClient,
  args: DbFunctions["set_network_capability_grant"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["set_network_capability_grant"]["Returns"]
  > | null,
): Promise<DbFunctions["set_network_capability_grant"]["Returns"] | null>;
export async function setNetworkCapabilityGrant(
  client: TypedSupabaseClient,
  args: DbFunctions["set_network_capability_grant"]["Args"] = emptyRpcArgs<"set_network_capability_grant">(),
  options?: SupabaseRpcOptions<
    DbFunctions["set_network_capability_grant"]["Returns"]
  > | null,
): Promise<
  DbFunctions["set_network_capability_grant"]["Returns"] | null | boolean
> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "set_network_capability_grant", args),
      "set_network_capability_grant",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "set_network_capability_grant", args),
      "set_network_capability_grant",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "set_network_capability_grant", args),
    "set_network_capability_grant",
  );
}

export async function setNetworkMembershipStatus(
  client: TypedSupabaseClient,
  args?: DbFunctions["set_network_membership_status"]["Args"],
): Promise<DbFunctions["set_network_membership_status"]["Returns"] | null>;
export async function setNetworkMembershipStatus(
  client: TypedSupabaseClient,
  args: DbFunctions["set_network_membership_status"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function setNetworkMembershipStatus(
  client: TypedSupabaseClient,
  args: DbFunctions["set_network_membership_status"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["set_network_membership_status"]["Returns"]
  > | null,
): Promise<DbFunctions["set_network_membership_status"]["Returns"] | null>;
export async function setNetworkMembershipStatus(
  client: TypedSupabaseClient,
  args: DbFunctions["set_network_membership_status"]["Args"] = emptyRpcArgs<"set_network_membership_status">(),
  options?: SupabaseRpcOptions<
    DbFunctions["set_network_membership_status"]["Returns"]
  > | null,
): Promise<
  DbFunctions["set_network_membership_status"]["Returns"] | null | boolean
> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "set_network_membership_status", args),
      "set_network_membership_status",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "set_network_membership_status", args),
      "set_network_membership_status",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "set_network_membership_status", args),
    "set_network_membership_status",
  );
}

export async function upsertNetworkOperatorFeeRule(
  client: TypedSupabaseClient,
  args?: DbFunctions["upsert_network_operator_fee_rule"]["Args"],
): Promise<DbFunctions["upsert_network_operator_fee_rule"]["Returns"] | null>;
export async function upsertNetworkOperatorFeeRule(
  client: TypedSupabaseClient,
  args: DbFunctions["upsert_network_operator_fee_rule"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function upsertNetworkOperatorFeeRule(
  client: TypedSupabaseClient,
  args: DbFunctions["upsert_network_operator_fee_rule"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["upsert_network_operator_fee_rule"]["Returns"]
  > | null,
): Promise<DbFunctions["upsert_network_operator_fee_rule"]["Returns"] | null>;
export async function upsertNetworkOperatorFeeRule(
  client: TypedSupabaseClient,
  args: DbFunctions["upsert_network_operator_fee_rule"]["Args"] = emptyRpcArgs<"upsert_network_operator_fee_rule">(),
  options?: SupabaseRpcOptions<
    DbFunctions["upsert_network_operator_fee_rule"]["Returns"]
  > | null,
): Promise<
  DbFunctions["upsert_network_operator_fee_rule"]["Returns"] | null | boolean
> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "upsert_network_operator_fee_rule", args),
      "upsert_network_operator_fee_rule",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "upsert_network_operator_fee_rule", args),
      "upsert_network_operator_fee_rule",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "upsert_network_operator_fee_rule", args),
    "upsert_network_operator_fee_rule",
  );
}
