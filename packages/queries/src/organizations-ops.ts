import { handleSupabaseRpc, type SupabaseRpcOptions } from "@lomi./shared";
import { rpc } from "./rpc.js";
import type { DbFunctions, TypedSupabaseClient } from "./types.js";
import { emptyRpcArgs } from "./call-rpc.js";

export async function checkOnboardingStatus(
  client: TypedSupabaseClient,
  args?: DbFunctions["check_onboarding_status"]["Args"],
): Promise<DbFunctions["check_onboarding_status"]["Returns"] | null>;
export async function checkOnboardingStatus(
  client: TypedSupabaseClient,
  args: DbFunctions["check_onboarding_status"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function checkOnboardingStatus(
  client: TypedSupabaseClient,
  args: DbFunctions["check_onboarding_status"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["check_onboarding_status"]["Returns"]
  > | null,
): Promise<DbFunctions["check_onboarding_status"]["Returns"] | null>;
export async function checkOnboardingStatus(
  client: TypedSupabaseClient,
  args: DbFunctions["check_onboarding_status"]["Args"] = emptyRpcArgs<"check_onboarding_status">(),
  options?: SupabaseRpcOptions<
    DbFunctions["check_onboarding_status"]["Returns"]
  > | null,
): Promise<DbFunctions["check_onboarding_status"]["Returns"] | null | boolean> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "check_onboarding_status", args),
      "check_onboarding_status",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "check_onboarding_status", args),
      "check_onboarding_status",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "check_onboarding_status", args),
    "check_onboarding_status",
  );
}

export async function completeOnboarding(
  client: TypedSupabaseClient,
  args?: DbFunctions["complete_onboarding"]["Args"],
): Promise<DbFunctions["complete_onboarding"]["Returns"] | null>;
export async function completeOnboarding(
  client: TypedSupabaseClient,
  args: DbFunctions["complete_onboarding"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function completeOnboarding(
  client: TypedSupabaseClient,
  args: DbFunctions["complete_onboarding"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["complete_onboarding"]["Returns"]
  > | null,
): Promise<DbFunctions["complete_onboarding"]["Returns"] | null>;
export async function completeOnboarding(
  client: TypedSupabaseClient,
  args: DbFunctions["complete_onboarding"]["Args"] = emptyRpcArgs<"complete_onboarding">(),
  options?: SupabaseRpcOptions<
    DbFunctions["complete_onboarding"]["Returns"]
  > | null,
): Promise<DbFunctions["complete_onboarding"]["Returns"] | null | boolean> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "complete_onboarding", args),
      "complete_onboarding",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "complete_onboarding", args),
      "complete_onboarding",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "complete_onboarding", args),
    "complete_onboarding",
  );
}

export async function createOrganization(
  client: TypedSupabaseClient,
  args?: DbFunctions["create_organization"]["Args"],
): Promise<DbFunctions["create_organization"]["Returns"] | null>;
export async function createOrganization(
  client: TypedSupabaseClient,
  args: DbFunctions["create_organization"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function createOrganization(
  client: TypedSupabaseClient,
  args: DbFunctions["create_organization"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["create_organization"]["Returns"]
  > | null,
): Promise<DbFunctions["create_organization"]["Returns"] | null>;
export async function createOrganization(
  client: TypedSupabaseClient,
  args: DbFunctions["create_organization"]["Args"] = emptyRpcArgs<"create_organization">(),
  options?: SupabaseRpcOptions<
    DbFunctions["create_organization"]["Returns"]
  > | null,
): Promise<DbFunctions["create_organization"]["Returns"] | null | boolean> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "create_organization", args),
      "create_organization",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "create_organization", args),
      "create_organization",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "create_organization", args),
    "create_organization",
  );
}

export async function createOrganizationWebhook(
  client: TypedSupabaseClient,
  args?: DbFunctions["create_organization_webhook"]["Args"],
): Promise<DbFunctions["create_organization_webhook"]["Returns"] | null>;
export async function createOrganizationWebhook(
  client: TypedSupabaseClient,
  args: DbFunctions["create_organization_webhook"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function createOrganizationWebhook(
  client: TypedSupabaseClient,
  args: DbFunctions["create_organization_webhook"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["create_organization_webhook"]["Returns"]
  > | null,
): Promise<DbFunctions["create_organization_webhook"]["Returns"] | null>;
export async function createOrganizationWebhook(
  client: TypedSupabaseClient,
  args: DbFunctions["create_organization_webhook"]["Args"] = emptyRpcArgs<"create_organization_webhook">(),
  options?: SupabaseRpcOptions<
    DbFunctions["create_organization_webhook"]["Returns"]
  > | null,
): Promise<
  DbFunctions["create_organization_webhook"]["Returns"] | null | boolean
> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "create_organization_webhook", args),
      "create_organization_webhook",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "create_organization_webhook", args),
      "create_organization_webhook",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "create_organization_webhook", args),
    "create_organization_webhook",
  );
}

export async function deactivateOrganizationRole(
  client: TypedSupabaseClient,
  args?: DbFunctions["deactivate_organization_role"]["Args"],
): Promise<DbFunctions["deactivate_organization_role"]["Returns"] | null>;
export async function deactivateOrganizationRole(
  client: TypedSupabaseClient,
  args: DbFunctions["deactivate_organization_role"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function deactivateOrganizationRole(
  client: TypedSupabaseClient,
  args: DbFunctions["deactivate_organization_role"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["deactivate_organization_role"]["Returns"]
  > | null,
): Promise<DbFunctions["deactivate_organization_role"]["Returns"] | null>;
export async function deactivateOrganizationRole(
  client: TypedSupabaseClient,
  args: DbFunctions["deactivate_organization_role"]["Args"] = emptyRpcArgs<"deactivate_organization_role">(),
  options?: SupabaseRpcOptions<
    DbFunctions["deactivate_organization_role"]["Returns"]
  > | null,
): Promise<
  DbFunctions["deactivate_organization_role"]["Returns"] | null | boolean
> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "deactivate_organization_role", args),
      "deactivate_organization_role",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "deactivate_organization_role", args),
      "deactivate_organization_role",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "deactivate_organization_role", args),
    "deactivate_organization_role",
  );
}

export async function fetchMerchantDetails(
  client: TypedSupabaseClient,
  args?: DbFunctions["fetch_merchant_details"]["Args"],
): Promise<DbFunctions["fetch_merchant_details"]["Returns"] | null>;
export async function fetchMerchantDetails(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_merchant_details"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function fetchMerchantDetails(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_merchant_details"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["fetch_merchant_details"]["Returns"]
  > | null,
): Promise<DbFunctions["fetch_merchant_details"]["Returns"] | null>;
export async function fetchMerchantDetails(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_merchant_details"]["Args"] = emptyRpcArgs<"fetch_merchant_details">(),
  options?: SupabaseRpcOptions<
    DbFunctions["fetch_merchant_details"]["Returns"]
  > | null,
): Promise<DbFunctions["fetch_merchant_details"]["Returns"] | null | boolean> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "fetch_merchant_details", args),
      "fetch_merchant_details",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "fetch_merchant_details", args),
      "fetch_merchant_details",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "fetch_merchant_details", args),
    "fetch_merchant_details",
  );
}

export async function fetchMerchantOrgPermissions(
  client: TypedSupabaseClient,
  args?: DbFunctions["fetch_merchant_org_permissions"]["Args"],
): Promise<DbFunctions["fetch_merchant_org_permissions"]["Returns"] | null>;
export async function fetchMerchantOrgPermissions(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_merchant_org_permissions"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function fetchMerchantOrgPermissions(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_merchant_org_permissions"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["fetch_merchant_org_permissions"]["Returns"]
  > | null,
): Promise<DbFunctions["fetch_merchant_org_permissions"]["Returns"] | null>;
export async function fetchMerchantOrgPermissions(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_merchant_org_permissions"]["Args"] = emptyRpcArgs<"fetch_merchant_org_permissions">(),
  options?: SupabaseRpcOptions<
    DbFunctions["fetch_merchant_org_permissions"]["Returns"]
  > | null,
): Promise<
  DbFunctions["fetch_merchant_org_permissions"]["Returns"] | null | boolean
> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "fetch_merchant_org_permissions", args),
      "fetch_merchant_org_permissions",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "fetch_merchant_org_permissions", args),
      "fetch_merchant_org_permissions",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "fetch_merchant_org_permissions", args),
    "fetch_merchant_org_permissions",
  );
}

export async function fetchMerchantPreferences(
  client: TypedSupabaseClient,
  args?: DbFunctions["fetch_merchant_preferences"]["Args"],
): Promise<DbFunctions["fetch_merchant_preferences"]["Returns"] | null>;
export async function fetchMerchantPreferences(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_merchant_preferences"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function fetchMerchantPreferences(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_merchant_preferences"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["fetch_merchant_preferences"]["Returns"]
  > | null,
): Promise<DbFunctions["fetch_merchant_preferences"]["Returns"] | null>;
export async function fetchMerchantPreferences(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_merchant_preferences"]["Args"] = emptyRpcArgs<"fetch_merchant_preferences">(),
  options?: SupabaseRpcOptions<
    DbFunctions["fetch_merchant_preferences"]["Returns"]
  > | null,
): Promise<
  DbFunctions["fetch_merchant_preferences"]["Returns"] | null | boolean
> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "fetch_merchant_preferences", args),
      "fetch_merchant_preferences",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "fetch_merchant_preferences", args),
      "fetch_merchant_preferences",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "fetch_merchant_preferences", args),
    "fetch_merchant_preferences",
  );
}

export async function fetchOrganizationDataAndMembers(
  client: TypedSupabaseClient,
  args?: DbFunctions["fetch_organization_data_and_members"]["Args"],
): Promise<
  DbFunctions["fetch_organization_data_and_members"]["Returns"] | null
>;
export async function fetchOrganizationDataAndMembers(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_organization_data_and_members"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function fetchOrganizationDataAndMembers(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_organization_data_and_members"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["fetch_organization_data_and_members"]["Returns"]
  > | null,
): Promise<
  DbFunctions["fetch_organization_data_and_members"]["Returns"] | null
>;
export async function fetchOrganizationDataAndMembers(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_organization_data_and_members"]["Args"] = emptyRpcArgs<"fetch_organization_data_and_members">(),
  options?: SupabaseRpcOptions<
    DbFunctions["fetch_organization_data_and_members"]["Returns"]
  > | null,
): Promise<
  DbFunctions["fetch_organization_data_and_members"]["Returns"] | null | boolean
> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "fetch_organization_data_and_members", args),
      "fetch_organization_data_and_members",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "fetch_organization_data_and_members", args),
      "fetch_organization_data_and_members",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "fetch_organization_data_and_members", args),
    "fetch_organization_data_and_members",
  );
}

export async function fetchOrganizationMemberRoleAssignments(
  client: TypedSupabaseClient,
  args?: DbFunctions["fetch_organization_member_role_assignments"]["Args"],
): Promise<
  DbFunctions["fetch_organization_member_role_assignments"]["Returns"] | null
>;
export async function fetchOrganizationMemberRoleAssignments(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_organization_member_role_assignments"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function fetchOrganizationMemberRoleAssignments(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_organization_member_role_assignments"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["fetch_organization_member_role_assignments"]["Returns"]
  > | null,
): Promise<
  DbFunctions["fetch_organization_member_role_assignments"]["Returns"] | null
>;
export async function fetchOrganizationMemberRoleAssignments(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_organization_member_role_assignments"]["Args"] = emptyRpcArgs<"fetch_organization_member_role_assignments">(),
  options?: SupabaseRpcOptions<
    DbFunctions["fetch_organization_member_role_assignments"]["Returns"]
  > | null,
): Promise<
  | DbFunctions["fetch_organization_member_role_assignments"]["Returns"]
  | null
  | boolean
> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "fetch_organization_member_role_assignments", args),
      "fetch_organization_member_role_assignments",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "fetch_organization_member_role_assignments", args),
      "fetch_organization_member_role_assignments",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "fetch_organization_member_role_assignments", args),
    "fetch_organization_member_role_assignments",
  );
}

export async function fetchOrganizationPermissions(
  client: TypedSupabaseClient,
  args?: DbFunctions["fetch_organization_permissions"]["Args"],
): Promise<DbFunctions["fetch_organization_permissions"]["Returns"] | null>;
export async function fetchOrganizationPermissions(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_organization_permissions"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function fetchOrganizationPermissions(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_organization_permissions"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["fetch_organization_permissions"]["Returns"]
  > | null,
): Promise<DbFunctions["fetch_organization_permissions"]["Returns"] | null>;
export async function fetchOrganizationPermissions(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_organization_permissions"]["Args"] = emptyRpcArgs<"fetch_organization_permissions">(),
  options?: SupabaseRpcOptions<
    DbFunctions["fetch_organization_permissions"]["Returns"]
  > | null,
): Promise<
  DbFunctions["fetch_organization_permissions"]["Returns"] | null | boolean
> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "fetch_organization_permissions", args),
      "fetch_organization_permissions",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "fetch_organization_permissions", args),
      "fetch_organization_permissions",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "fetch_organization_permissions", args),
    "fetch_organization_permissions",
  );
}

export async function fetchOrganizationRoleDetail(
  client: TypedSupabaseClient,
  args?: DbFunctions["fetch_organization_role_detail"]["Args"],
): Promise<DbFunctions["fetch_organization_role_detail"]["Returns"] | null>;
export async function fetchOrganizationRoleDetail(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_organization_role_detail"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function fetchOrganizationRoleDetail(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_organization_role_detail"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["fetch_organization_role_detail"]["Returns"]
  > | null,
): Promise<DbFunctions["fetch_organization_role_detail"]["Returns"] | null>;
export async function fetchOrganizationRoleDetail(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_organization_role_detail"]["Args"] = emptyRpcArgs<"fetch_organization_role_detail">(),
  options?: SupabaseRpcOptions<
    DbFunctions["fetch_organization_role_detail"]["Returns"]
  > | null,
): Promise<
  DbFunctions["fetch_organization_role_detail"]["Returns"] | null | boolean
> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "fetch_organization_role_detail", args),
      "fetch_organization_role_detail",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "fetch_organization_role_detail", args),
      "fetch_organization_role_detail",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "fetch_organization_role_detail", args),
    "fetch_organization_role_detail",
  );
}

export async function fetchOrganizationRoles(
  client: TypedSupabaseClient,
  args?: DbFunctions["fetch_organization_roles"]["Args"],
): Promise<DbFunctions["fetch_organization_roles"]["Returns"] | null>;
export async function fetchOrganizationRoles(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_organization_roles"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function fetchOrganizationRoles(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_organization_roles"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["fetch_organization_roles"]["Returns"]
  > | null,
): Promise<DbFunctions["fetch_organization_roles"]["Returns"] | null>;
export async function fetchOrganizationRoles(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_organization_roles"]["Args"] = emptyRpcArgs<"fetch_organization_roles">(),
  options?: SupabaseRpcOptions<
    DbFunctions["fetch_organization_roles"]["Returns"]
  > | null,
): Promise<
  DbFunctions["fetch_organization_roles"]["Returns"] | null | boolean
> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "fetch_organization_roles", args),
      "fetch_organization_roles",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "fetch_organization_roles", args),
      "fetch_organization_roles",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "fetch_organization_roles", args),
    "fetch_organization_roles",
  );
}

export async function fetchOrganizationTestBalances(
  client: TypedSupabaseClient,
  args?: DbFunctions["fetch_organization_test_balances"]["Args"],
): Promise<DbFunctions["fetch_organization_test_balances"]["Returns"] | null>;
export async function fetchOrganizationTestBalances(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_organization_test_balances"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function fetchOrganizationTestBalances(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_organization_test_balances"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["fetch_organization_test_balances"]["Returns"]
  > | null,
): Promise<DbFunctions["fetch_organization_test_balances"]["Returns"] | null>;
export async function fetchOrganizationTestBalances(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_organization_test_balances"]["Args"] = emptyRpcArgs<"fetch_organization_test_balances">(),
  options?: SupabaseRpcOptions<
    DbFunctions["fetch_organization_test_balances"]["Returns"]
  > | null,
): Promise<
  DbFunctions["fetch_organization_test_balances"]["Returns"] | null | boolean
> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "fetch_organization_test_balances", args),
      "fetch_organization_test_balances",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "fetch_organization_test_balances", args),
      "fetch_organization_test_balances",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "fetch_organization_test_balances", args),
    "fetch_organization_test_balances",
  );
}

export async function fetchSidebarData(
  client: TypedSupabaseClient,
  args?: DbFunctions["fetch_sidebar_data"]["Args"],
): Promise<DbFunctions["fetch_sidebar_data"]["Returns"] | null>;
export async function fetchSidebarData(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_sidebar_data"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function fetchSidebarData(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_sidebar_data"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["fetch_sidebar_data"]["Returns"]
  > | null,
): Promise<DbFunctions["fetch_sidebar_data"]["Returns"] | null>;
export async function fetchSidebarData(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_sidebar_data"]["Args"] = emptyRpcArgs<"fetch_sidebar_data">(),
  options?: SupabaseRpcOptions<
    DbFunctions["fetch_sidebar_data"]["Returns"]
  > | null,
): Promise<DbFunctions["fetch_sidebar_data"]["Returns"] | null | boolean> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "fetch_sidebar_data", args),
      "fetch_sidebar_data",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "fetch_sidebar_data", args),
      "fetch_sidebar_data",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "fetch_sidebar_data", args),
    "fetch_sidebar_data",
  );
}

export async function fetchUserAvatar(
  client: TypedSupabaseClient,
  args?: DbFunctions["fetch_user_avatar"]["Args"],
): Promise<DbFunctions["fetch_user_avatar"]["Returns"] | null>;
export async function fetchUserAvatar(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_user_avatar"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function fetchUserAvatar(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_user_avatar"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["fetch_user_avatar"]["Returns"]
  > | null,
): Promise<DbFunctions["fetch_user_avatar"]["Returns"] | null>;
export async function fetchUserAvatar(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_user_avatar"]["Args"] = emptyRpcArgs<"fetch_user_avatar">(),
  options?: SupabaseRpcOptions<
    DbFunctions["fetch_user_avatar"]["Returns"]
  > | null,
): Promise<DbFunctions["fetch_user_avatar"]["Returns"] | null | boolean> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "fetch_user_avatar", args),
      "fetch_user_avatar",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "fetch_user_avatar", args),
      "fetch_user_avatar",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "fetch_user_avatar", args),
    "fetch_user_avatar",
  );
}

export async function getOrganizationStarterKybActivation(
  client: TypedSupabaseClient,
  args?: DbFunctions["get_organization_starter_kyb_activation"]["Args"],
): Promise<
  DbFunctions["get_organization_starter_kyb_activation"]["Returns"] | null
>;
export async function getOrganizationStarterKybActivation(
  client: TypedSupabaseClient,
  args: DbFunctions["get_organization_starter_kyb_activation"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function getOrganizationStarterKybActivation(
  client: TypedSupabaseClient,
  args: DbFunctions["get_organization_starter_kyb_activation"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["get_organization_starter_kyb_activation"]["Returns"]
  > | null,
): Promise<
  DbFunctions["get_organization_starter_kyb_activation"]["Returns"] | null
>;
export async function getOrganizationStarterKybActivation(
  client: TypedSupabaseClient,
  args: DbFunctions["get_organization_starter_kyb_activation"]["Args"] = emptyRpcArgs<"get_organization_starter_kyb_activation">(),
  options?: SupabaseRpcOptions<
    DbFunctions["get_organization_starter_kyb_activation"]["Returns"]
  > | null,
): Promise<
  | DbFunctions["get_organization_starter_kyb_activation"]["Returns"]
  | null
  | boolean
> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "get_organization_starter_kyb_activation", args),
      "get_organization_starter_kyb_activation",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "get_organization_starter_kyb_activation", args),
      "get_organization_starter_kyb_activation",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "get_organization_starter_kyb_activation", args),
    "get_organization_starter_kyb_activation",
  );
}

export async function leaveOrganization(
  client: TypedSupabaseClient,
  args?: DbFunctions["leave_organization"]["Args"],
): Promise<DbFunctions["leave_organization"]["Returns"] | null>;
export async function leaveOrganization(
  client: TypedSupabaseClient,
  args: DbFunctions["leave_organization"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function leaveOrganization(
  client: TypedSupabaseClient,
  args: DbFunctions["leave_organization"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["leave_organization"]["Returns"]
  > | null,
): Promise<DbFunctions["leave_organization"]["Returns"] | null>;
export async function leaveOrganization(
  client: TypedSupabaseClient,
  args: DbFunctions["leave_organization"]["Args"] = emptyRpcArgs<"leave_organization">(),
  options?: SupabaseRpcOptions<
    DbFunctions["leave_organization"]["Returns"]
  > | null,
): Promise<DbFunctions["leave_organization"]["Returns"] | null | boolean> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "leave_organization", args),
      "leave_organization",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "leave_organization", args),
      "leave_organization",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "leave_organization", args),
    "leave_organization",
  );
}

export async function setLastVisitedOrganization(
  client: TypedSupabaseClient,
  args?: DbFunctions["set_last_visited_organization"]["Args"],
): Promise<DbFunctions["set_last_visited_organization"]["Returns"] | null>;
export async function setLastVisitedOrganization(
  client: TypedSupabaseClient,
  args: DbFunctions["set_last_visited_organization"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function setLastVisitedOrganization(
  client: TypedSupabaseClient,
  args: DbFunctions["set_last_visited_organization"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["set_last_visited_organization"]["Returns"]
  > | null,
): Promise<DbFunctions["set_last_visited_organization"]["Returns"] | null>;
export async function setLastVisitedOrganization(
  client: TypedSupabaseClient,
  args: DbFunctions["set_last_visited_organization"]["Args"] = emptyRpcArgs<"set_last_visited_organization">(),
  options?: SupabaseRpcOptions<
    DbFunctions["set_last_visited_organization"]["Returns"]
  > | null,
): Promise<
  DbFunctions["set_last_visited_organization"]["Returns"] | null | boolean
> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "set_last_visited_organization", args),
      "set_last_visited_organization",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "set_last_visited_organization", args),
      "set_last_visited_organization",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "set_last_visited_organization", args),
    "set_last_visited_organization",
  );
}

export async function skipOnboarding(
  client: TypedSupabaseClient,
  args?: DbFunctions["skip_onboarding"]["Args"],
): Promise<DbFunctions["skip_onboarding"]["Returns"] | null>;
export async function skipOnboarding(
  client: TypedSupabaseClient,
  args: DbFunctions["skip_onboarding"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function skipOnboarding(
  client: TypedSupabaseClient,
  args: DbFunctions["skip_onboarding"]["Args"],
  options: SupabaseRpcOptions<DbFunctions["skip_onboarding"]["Returns"]> | null,
): Promise<DbFunctions["skip_onboarding"]["Returns"] | null>;
export async function skipOnboarding(
  client: TypedSupabaseClient,
  args: DbFunctions["skip_onboarding"]["Args"] = emptyRpcArgs<"skip_onboarding">(),
  options?: SupabaseRpcOptions<
    DbFunctions["skip_onboarding"]["Returns"]
  > | null,
): Promise<DbFunctions["skip_onboarding"]["Returns"] | null | boolean> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "skip_onboarding", args),
      "skip_onboarding",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "skip_onboarding", args),
      "skip_onboarding",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "skip_onboarding", args),
    "skip_onboarding",
  );
}

export async function softDeleteMerchant(
  client: TypedSupabaseClient,
  args?: DbFunctions["soft_delete_merchant"]["Args"],
): Promise<DbFunctions["soft_delete_merchant"]["Returns"] | null>;
export async function softDeleteMerchant(
  client: TypedSupabaseClient,
  args: DbFunctions["soft_delete_merchant"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function softDeleteMerchant(
  client: TypedSupabaseClient,
  args: DbFunctions["soft_delete_merchant"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["soft_delete_merchant"]["Returns"]
  > | null,
): Promise<DbFunctions["soft_delete_merchant"]["Returns"] | null>;
export async function softDeleteMerchant(
  client: TypedSupabaseClient,
  args: DbFunctions["soft_delete_merchant"]["Args"] = emptyRpcArgs<"soft_delete_merchant">(),
  options?: SupabaseRpcOptions<
    DbFunctions["soft_delete_merchant"]["Returns"]
  > | null,
): Promise<DbFunctions["soft_delete_merchant"]["Returns"] | null | boolean> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "soft_delete_merchant", args),
      "soft_delete_merchant",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "soft_delete_merchant", args),
      "soft_delete_merchant",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "soft_delete_merchant", args),
    "soft_delete_merchant",
  );
}

export async function softDeleteOrganization(
  client: TypedSupabaseClient,
  args?: DbFunctions["soft_delete_organization"]["Args"],
): Promise<DbFunctions["soft_delete_organization"]["Returns"] | null>;
export async function softDeleteOrganization(
  client: TypedSupabaseClient,
  args: DbFunctions["soft_delete_organization"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function softDeleteOrganization(
  client: TypedSupabaseClient,
  args: DbFunctions["soft_delete_organization"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["soft_delete_organization"]["Returns"]
  > | null,
): Promise<DbFunctions["soft_delete_organization"]["Returns"] | null>;
export async function softDeleteOrganization(
  client: TypedSupabaseClient,
  args: DbFunctions["soft_delete_organization"]["Args"] = emptyRpcArgs<"soft_delete_organization">(),
  options?: SupabaseRpcOptions<
    DbFunctions["soft_delete_organization"]["Returns"]
  > | null,
): Promise<
  DbFunctions["soft_delete_organization"]["Returns"] | null | boolean
> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "soft_delete_organization", args),
      "soft_delete_organization",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "soft_delete_organization", args),
      "soft_delete_organization",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "soft_delete_organization", args),
    "soft_delete_organization",
  );
}

export async function switchOrganizationPricingPlan(
  client: TypedSupabaseClient,
  args?: DbFunctions["switch_organization_pricing_plan"]["Args"],
): Promise<DbFunctions["switch_organization_pricing_plan"]["Returns"] | null>;
export async function switchOrganizationPricingPlan(
  client: TypedSupabaseClient,
  args: DbFunctions["switch_organization_pricing_plan"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function switchOrganizationPricingPlan(
  client: TypedSupabaseClient,
  args: DbFunctions["switch_organization_pricing_plan"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["switch_organization_pricing_plan"]["Returns"]
  > | null,
): Promise<DbFunctions["switch_organization_pricing_plan"]["Returns"] | null>;
export async function switchOrganizationPricingPlan(
  client: TypedSupabaseClient,
  args: DbFunctions["switch_organization_pricing_plan"]["Args"] = emptyRpcArgs<"switch_organization_pricing_plan">(),
  options?: SupabaseRpcOptions<
    DbFunctions["switch_organization_pricing_plan"]["Returns"]
  > | null,
): Promise<
  DbFunctions["switch_organization_pricing_plan"]["Returns"] | null | boolean
> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "switch_organization_pricing_plan", args),
      "switch_organization_pricing_plan",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "switch_organization_pricing_plan", args),
      "switch_organization_pricing_plan",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "switch_organization_pricing_plan", args),
    "switch_organization_pricing_plan",
  );
}

export async function updateMerchantAvatar(
  client: TypedSupabaseClient,
  args?: DbFunctions["update_merchant_avatar"]["Args"],
): Promise<DbFunctions["update_merchant_avatar"]["Returns"] | null>;
export async function updateMerchantAvatar(
  client: TypedSupabaseClient,
  args: DbFunctions["update_merchant_avatar"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function updateMerchantAvatar(
  client: TypedSupabaseClient,
  args: DbFunctions["update_merchant_avatar"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["update_merchant_avatar"]["Returns"]
  > | null,
): Promise<DbFunctions["update_merchant_avatar"]["Returns"] | null>;
export async function updateMerchantAvatar(
  client: TypedSupabaseClient,
  args: DbFunctions["update_merchant_avatar"]["Args"] = emptyRpcArgs<"update_merchant_avatar">(),
  options?: SupabaseRpcOptions<
    DbFunctions["update_merchant_avatar"]["Returns"]
  > | null,
): Promise<DbFunctions["update_merchant_avatar"]["Returns"] | null | boolean> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "update_merchant_avatar", args),
      "update_merchant_avatar",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "update_merchant_avatar", args),
      "update_merchant_avatar",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "update_merchant_avatar", args),
    "update_merchant_avatar",
  );
}

export async function updateMerchantDetails(
  client: TypedSupabaseClient,
  args?: DbFunctions["update_merchant_details"]["Args"],
): Promise<DbFunctions["update_merchant_details"]["Returns"] | null>;
export async function updateMerchantDetails(
  client: TypedSupabaseClient,
  args: DbFunctions["update_merchant_details"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function updateMerchantDetails(
  client: TypedSupabaseClient,
  args: DbFunctions["update_merchant_details"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["update_merchant_details"]["Returns"]
  > | null,
): Promise<DbFunctions["update_merchant_details"]["Returns"] | null>;
export async function updateMerchantDetails(
  client: TypedSupabaseClient,
  args: DbFunctions["update_merchant_details"]["Args"] = emptyRpcArgs<"update_merchant_details">(),
  options?: SupabaseRpcOptions<
    DbFunctions["update_merchant_details"]["Returns"]
  > | null,
): Promise<DbFunctions["update_merchant_details"]["Returns"] | null | boolean> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "update_merchant_details", args),
      "update_merchant_details",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "update_merchant_details", args),
      "update_merchant_details",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "update_merchant_details", args),
    "update_merchant_details",
  );
}

export async function updateMerchantPreferencesCommunication(
  client: TypedSupabaseClient,
  args?: DbFunctions["update_merchant_preferences_communication"]["Args"],
): Promise<
  DbFunctions["update_merchant_preferences_communication"]["Returns"] | null
>;
export async function updateMerchantPreferencesCommunication(
  client: TypedSupabaseClient,
  args: DbFunctions["update_merchant_preferences_communication"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function updateMerchantPreferencesCommunication(
  client: TypedSupabaseClient,
  args: DbFunctions["update_merchant_preferences_communication"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["update_merchant_preferences_communication"]["Returns"]
  > | null,
): Promise<
  DbFunctions["update_merchant_preferences_communication"]["Returns"] | null
>;
export async function updateMerchantPreferencesCommunication(
  client: TypedSupabaseClient,
  args: DbFunctions["update_merchant_preferences_communication"]["Args"] = emptyRpcArgs<"update_merchant_preferences_communication">(),
  options?: SupabaseRpcOptions<
    DbFunctions["update_merchant_preferences_communication"]["Returns"]
  > | null,
): Promise<
  | DbFunctions["update_merchant_preferences_communication"]["Returns"]
  | null
  | boolean
> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "update_merchant_preferences_communication", args),
      "update_merchant_preferences_communication",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "update_merchant_preferences_communication", args),
      "update_merchant_preferences_communication",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "update_merchant_preferences_communication", args),
    "update_merchant_preferences_communication",
  );
}

export async function updateOrganizationDetails(
  client: TypedSupabaseClient,
  args?: DbFunctions["update_organization_details"]["Args"],
): Promise<DbFunctions["update_organization_details"]["Returns"] | null>;
export async function updateOrganizationDetails(
  client: TypedSupabaseClient,
  args: DbFunctions["update_organization_details"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function updateOrganizationDetails(
  client: TypedSupabaseClient,
  args: DbFunctions["update_organization_details"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["update_organization_details"]["Returns"]
  > | null,
): Promise<DbFunctions["update_organization_details"]["Returns"] | null>;
export async function updateOrganizationDetails(
  client: TypedSupabaseClient,
  args: DbFunctions["update_organization_details"]["Args"] = emptyRpcArgs<"update_organization_details">(),
  options?: SupabaseRpcOptions<
    DbFunctions["update_organization_details"]["Returns"]
  > | null,
): Promise<
  DbFunctions["update_organization_details"]["Returns"] | null | boolean
> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "update_organization_details", args),
      "update_organization_details",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "update_organization_details", args),
      "update_organization_details",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "update_organization_details", args),
    "update_organization_details",
  );
}

export async function updateOrganizationLogo(
  client: TypedSupabaseClient,
  args?: DbFunctions["update_organization_logo"]["Args"],
): Promise<DbFunctions["update_organization_logo"]["Returns"] | null>;
export async function updateOrganizationLogo(
  client: TypedSupabaseClient,
  args: DbFunctions["update_organization_logo"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function updateOrganizationLogo(
  client: TypedSupabaseClient,
  args: DbFunctions["update_organization_logo"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["update_organization_logo"]["Returns"]
  > | null,
): Promise<DbFunctions["update_organization_logo"]["Returns"] | null>;
export async function updateOrganizationLogo(
  client: TypedSupabaseClient,
  args: DbFunctions["update_organization_logo"]["Args"] = emptyRpcArgs<"update_organization_logo">(),
  options?: SupabaseRpcOptions<
    DbFunctions["update_organization_logo"]["Returns"]
  > | null,
): Promise<
  DbFunctions["update_organization_logo"]["Returns"] | null | boolean
> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "update_organization_logo", args),
      "update_organization_logo",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "update_organization_logo", args),
      "update_organization_logo",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "update_organization_logo", args),
    "update_organization_logo",
  );
}

export async function updateOrganizationOperatingCountries(
  client: TypedSupabaseClient,
  args?: DbFunctions["update_organization_operating_countries"]["Args"],
): Promise<
  DbFunctions["update_organization_operating_countries"]["Returns"] | null
>;
export async function updateOrganizationOperatingCountries(
  client: TypedSupabaseClient,
  args: DbFunctions["update_organization_operating_countries"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function updateOrganizationOperatingCountries(
  client: TypedSupabaseClient,
  args: DbFunctions["update_organization_operating_countries"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["update_organization_operating_countries"]["Returns"]
  > | null,
): Promise<
  DbFunctions["update_organization_operating_countries"]["Returns"] | null
>;
export async function updateOrganizationOperatingCountries(
  client: TypedSupabaseClient,
  args: DbFunctions["update_organization_operating_countries"]["Args"] = emptyRpcArgs<"update_organization_operating_countries">(),
  options?: SupabaseRpcOptions<
    DbFunctions["update_organization_operating_countries"]["Returns"]
  > | null,
): Promise<
  | DbFunctions["update_organization_operating_countries"]["Returns"]
  | null
  | boolean
> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "update_organization_operating_countries", args),
      "update_organization_operating_countries",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "update_organization_operating_countries", args),
      "update_organization_operating_countries",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "update_organization_operating_countries", args),
    "update_organization_operating_countries",
  );
}

export async function updateOrganizationPinCode(
  client: TypedSupabaseClient,
  args?: DbFunctions["update_organization_pin_code"]["Args"],
): Promise<DbFunctions["update_organization_pin_code"]["Returns"] | null>;
export async function updateOrganizationPinCode(
  client: TypedSupabaseClient,
  args: DbFunctions["update_organization_pin_code"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function updateOrganizationPinCode(
  client: TypedSupabaseClient,
  args: DbFunctions["update_organization_pin_code"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["update_organization_pin_code"]["Returns"]
  > | null,
): Promise<DbFunctions["update_organization_pin_code"]["Returns"] | null>;
export async function updateOrganizationPinCode(
  client: TypedSupabaseClient,
  args: DbFunctions["update_organization_pin_code"]["Args"] = emptyRpcArgs<"update_organization_pin_code">(),
  options?: SupabaseRpcOptions<
    DbFunctions["update_organization_pin_code"]["Returns"]
  > | null,
): Promise<
  DbFunctions["update_organization_pin_code"]["Returns"] | null | boolean
> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "update_organization_pin_code", args),
      "update_organization_pin_code",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "update_organization_pin_code", args),
      "update_organization_pin_code",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "update_organization_pin_code", args),
    "update_organization_pin_code",
  );
}

export async function updateOrganizationSlug(
  client: TypedSupabaseClient,
  args?: DbFunctions["update_organization_slug"]["Args"],
): Promise<DbFunctions["update_organization_slug"]["Returns"] | null>;
export async function updateOrganizationSlug(
  client: TypedSupabaseClient,
  args: DbFunctions["update_organization_slug"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function updateOrganizationSlug(
  client: TypedSupabaseClient,
  args: DbFunctions["update_organization_slug"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["update_organization_slug"]["Returns"]
  > | null,
): Promise<DbFunctions["update_organization_slug"]["Returns"] | null>;
export async function updateOrganizationSlug(
  client: TypedSupabaseClient,
  args: DbFunctions["update_organization_slug"]["Args"] = emptyRpcArgs<"update_organization_slug">(),
  options?: SupabaseRpcOptions<
    DbFunctions["update_organization_slug"]["Returns"]
  > | null,
): Promise<
  DbFunctions["update_organization_slug"]["Returns"] | null | boolean
> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "update_organization_slug", args),
      "update_organization_slug",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "update_organization_slug", args),
      "update_organization_slug",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "update_organization_slug", args),
    "update_organization_slug",
  );
}

export async function updateStaffImpersonationConsent(
  client: TypedSupabaseClient,
  args?: DbFunctions["update_staff_impersonation_consent"]["Args"],
): Promise<DbFunctions["update_staff_impersonation_consent"]["Returns"] | null>;
export async function updateStaffImpersonationConsent(
  client: TypedSupabaseClient,
  args: DbFunctions["update_staff_impersonation_consent"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function updateStaffImpersonationConsent(
  client: TypedSupabaseClient,
  args: DbFunctions["update_staff_impersonation_consent"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["update_staff_impersonation_consent"]["Returns"]
  > | null,
): Promise<DbFunctions["update_staff_impersonation_consent"]["Returns"] | null>;
export async function updateStaffImpersonationConsent(
  client: TypedSupabaseClient,
  args: DbFunctions["update_staff_impersonation_consent"]["Args"] = emptyRpcArgs<"update_staff_impersonation_consent">(),
  options?: SupabaseRpcOptions<
    DbFunctions["update_staff_impersonation_consent"]["Returns"]
  > | null,
): Promise<
  DbFunctions["update_staff_impersonation_consent"]["Returns"] | null | boolean
> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "update_staff_impersonation_consent", args),
      "update_staff_impersonation_consent",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "update_staff_impersonation_consent", args),
      "update_staff_impersonation_consent",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "update_staff_impersonation_consent", args),
    "update_staff_impersonation_consent",
  );
}

export async function updateStarterBusinessKyc(
  client: TypedSupabaseClient,
  args?: DbFunctions["update_starter_business_kyc"]["Args"],
): Promise<DbFunctions["update_starter_business_kyc"]["Returns"] | null>;
export async function updateStarterBusinessKyc(
  client: TypedSupabaseClient,
  args: DbFunctions["update_starter_business_kyc"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function updateStarterBusinessKyc(
  client: TypedSupabaseClient,
  args: DbFunctions["update_starter_business_kyc"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["update_starter_business_kyc"]["Returns"]
  > | null,
): Promise<DbFunctions["update_starter_business_kyc"]["Returns"] | null>;
export async function updateStarterBusinessKyc(
  client: TypedSupabaseClient,
  args: DbFunctions["update_starter_business_kyc"]["Args"] = emptyRpcArgs<"update_starter_business_kyc">(),
  options?: SupabaseRpcOptions<
    DbFunctions["update_starter_business_kyc"]["Returns"]
  > | null,
): Promise<
  DbFunctions["update_starter_business_kyc"]["Returns"] | null | boolean
> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "update_starter_business_kyc", args),
      "update_starter_business_kyc",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "update_starter_business_kyc", args),
      "update_starter_business_kyc",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "update_starter_business_kyc", args),
    "update_starter_business_kyc",
  );
}

export async function updateTeamMemberPosition(
  client: TypedSupabaseClient,
  args?: DbFunctions["update_team_member_position"]["Args"],
): Promise<DbFunctions["update_team_member_position"]["Returns"] | null>;
export async function updateTeamMemberPosition(
  client: TypedSupabaseClient,
  args: DbFunctions["update_team_member_position"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function updateTeamMemberPosition(
  client: TypedSupabaseClient,
  args: DbFunctions["update_team_member_position"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["update_team_member_position"]["Returns"]
  > | null,
): Promise<DbFunctions["update_team_member_position"]["Returns"] | null>;
export async function updateTeamMemberPosition(
  client: TypedSupabaseClient,
  args: DbFunctions["update_team_member_position"]["Args"] = emptyRpcArgs<"update_team_member_position">(),
  options?: SupabaseRpcOptions<
    DbFunctions["update_team_member_position"]["Returns"]
  > | null,
): Promise<
  DbFunctions["update_team_member_position"]["Returns"] | null | boolean
> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "update_team_member_position", args),
      "update_team_member_position",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "update_team_member_position", args),
      "update_team_member_position",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "update_team_member_position", args),
    "update_team_member_position",
  );
}

export async function upsertOrganizationRole(
  client: TypedSupabaseClient,
  args?: DbFunctions["upsert_organization_role"]["Args"],
): Promise<DbFunctions["upsert_organization_role"]["Returns"] | null>;
export async function upsertOrganizationRole(
  client: TypedSupabaseClient,
  args: DbFunctions["upsert_organization_role"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function upsertOrganizationRole(
  client: TypedSupabaseClient,
  args: DbFunctions["upsert_organization_role"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["upsert_organization_role"]["Returns"]
  > | null,
): Promise<DbFunctions["upsert_organization_role"]["Returns"] | null>;
export async function upsertOrganizationRole(
  client: TypedSupabaseClient,
  args: DbFunctions["upsert_organization_role"]["Args"] = emptyRpcArgs<"upsert_organization_role">(),
  options?: SupabaseRpcOptions<
    DbFunctions["upsert_organization_role"]["Returns"]
  > | null,
): Promise<
  DbFunctions["upsert_organization_role"]["Returns"] | null | boolean
> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "upsert_organization_role", args),
      "upsert_organization_role",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "upsert_organization_role", args),
      "upsert_organization_role",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "upsert_organization_role", args),
    "upsert_organization_role",
  );
}
