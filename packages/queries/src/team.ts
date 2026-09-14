import { handleSupabaseRpc, type SupabaseRpcOptions } from "@lomi./shared";
import { rpc } from "./rpc.js";
import type { DbFunctions, TypedSupabaseClient } from "./types.js";
import { emptyRpcArgs } from "./call-rpc.js";

export async function acceptTeamInvitation(
  client: TypedSupabaseClient,
  args?: DbFunctions["accept_team_invitation"]["Args"],
): Promise<DbFunctions["accept_team_invitation"]["Returns"] | null>;
export async function acceptTeamInvitation(
  client: TypedSupabaseClient,
  args: DbFunctions["accept_team_invitation"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function acceptTeamInvitation(
  client: TypedSupabaseClient,
  args: DbFunctions["accept_team_invitation"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["accept_team_invitation"]["Returns"]
  > | null,
): Promise<DbFunctions["accept_team_invitation"]["Returns"] | null>;
export async function acceptTeamInvitation(
  client: TypedSupabaseClient,
  args: DbFunctions["accept_team_invitation"]["Args"] = emptyRpcArgs<"accept_team_invitation">(),
  options?: SupabaseRpcOptions<
    DbFunctions["accept_team_invitation"]["Returns"]
  > | null,
): Promise<DbFunctions["accept_team_invitation"]["Returns"] | null | boolean> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "accept_team_invitation", args),
      "accept_team_invitation",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "accept_team_invitation", args),
      "accept_team_invitation",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "accept_team_invitation", args),
    "accept_team_invitation",
  );
}

export async function assignMemberRole(
  client: TypedSupabaseClient,
  args?: DbFunctions["assign_member_role"]["Args"],
): Promise<DbFunctions["assign_member_role"]["Returns"] | null>;
export async function assignMemberRole(
  client: TypedSupabaseClient,
  args: DbFunctions["assign_member_role"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function assignMemberRole(
  client: TypedSupabaseClient,
  args: DbFunctions["assign_member_role"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["assign_member_role"]["Returns"]
  > | null,
): Promise<DbFunctions["assign_member_role"]["Returns"] | null>;
export async function assignMemberRole(
  client: TypedSupabaseClient,
  args: DbFunctions["assign_member_role"]["Args"] = emptyRpcArgs<"assign_member_role">(),
  options?: SupabaseRpcOptions<
    DbFunctions["assign_member_role"]["Returns"]
  > | null,
): Promise<DbFunctions["assign_member_role"]["Returns"] | null | boolean> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "assign_member_role", args),
      "assign_member_role",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "assign_member_role", args),
      "assign_member_role",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "assign_member_role", args),
    "assign_member_role",
  );
}

export async function fetchMemberConnectedOperators(
  client: TypedSupabaseClient,
  args?: DbFunctions["fetch_member_connected_operators"]["Args"],
): Promise<DbFunctions["fetch_member_connected_operators"]["Returns"] | null>;
export async function fetchMemberConnectedOperators(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_member_connected_operators"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function fetchMemberConnectedOperators(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_member_connected_operators"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["fetch_member_connected_operators"]["Returns"]
  > | null,
): Promise<DbFunctions["fetch_member_connected_operators"]["Returns"] | null>;
export async function fetchMemberConnectedOperators(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_member_connected_operators"]["Args"] = emptyRpcArgs<"fetch_member_connected_operators">(),
  options?: SupabaseRpcOptions<
    DbFunctions["fetch_member_connected_operators"]["Returns"]
  > | null,
): Promise<
  DbFunctions["fetch_member_connected_operators"]["Returns"] | null | boolean
> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "fetch_member_connected_operators", args),
      "fetch_member_connected_operators",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "fetch_member_connected_operators", args),
      "fetch_member_connected_operators",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "fetch_member_connected_operators", args),
    "fetch_member_connected_operators",
  );
}

export async function getInvitationDetails(
  client: TypedSupabaseClient,
  args?: DbFunctions["get_invitation_details"]["Args"],
): Promise<DbFunctions["get_invitation_details"]["Returns"] | null>;
export async function getInvitationDetails(
  client: TypedSupabaseClient,
  args: DbFunctions["get_invitation_details"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function getInvitationDetails(
  client: TypedSupabaseClient,
  args: DbFunctions["get_invitation_details"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["get_invitation_details"]["Returns"]
  > | null,
): Promise<DbFunctions["get_invitation_details"]["Returns"] | null>;
export async function getInvitationDetails(
  client: TypedSupabaseClient,
  args: DbFunctions["get_invitation_details"]["Args"] = emptyRpcArgs<"get_invitation_details">(),
  options?: SupabaseRpcOptions<
    DbFunctions["get_invitation_details"]["Returns"]
  > | null,
): Promise<DbFunctions["get_invitation_details"]["Returns"] | null | boolean> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "get_invitation_details", args),
      "get_invitation_details",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "get_invitation_details", args),
      "get_invitation_details",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "get_invitation_details", args),
    "get_invitation_details",
  );
}

export async function inviteTeamMember(
  client: TypedSupabaseClient,
  args?: DbFunctions["invite_team_member"]["Args"],
): Promise<DbFunctions["invite_team_member"]["Returns"] | null>;
export async function inviteTeamMember(
  client: TypedSupabaseClient,
  args: DbFunctions["invite_team_member"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function inviteTeamMember(
  client: TypedSupabaseClient,
  args: DbFunctions["invite_team_member"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["invite_team_member"]["Returns"]
  > | null,
): Promise<DbFunctions["invite_team_member"]["Returns"] | null>;
export async function inviteTeamMember(
  client: TypedSupabaseClient,
  args: DbFunctions["invite_team_member"]["Args"] = emptyRpcArgs<"invite_team_member">(),
  options?: SupabaseRpcOptions<
    DbFunctions["invite_team_member"]["Returns"]
  > | null,
): Promise<DbFunctions["invite_team_member"]["Returns"] | null | boolean> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "invite_team_member", args),
      "invite_team_member",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "invite_team_member", args),
      "invite_team_member",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "invite_team_member", args),
    "invite_team_member",
  );
}

export async function removeTeamMember(
  client: TypedSupabaseClient,
  args?: DbFunctions["remove_team_member"]["Args"],
): Promise<DbFunctions["remove_team_member"]["Returns"] | null>;
export async function removeTeamMember(
  client: TypedSupabaseClient,
  args: DbFunctions["remove_team_member"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function removeTeamMember(
  client: TypedSupabaseClient,
  args: DbFunctions["remove_team_member"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["remove_team_member"]["Returns"]
  > | null,
): Promise<DbFunctions["remove_team_member"]["Returns"] | null>;
export async function removeTeamMember(
  client: TypedSupabaseClient,
  args: DbFunctions["remove_team_member"]["Args"] = emptyRpcArgs<"remove_team_member">(),
  options?: SupabaseRpcOptions<
    DbFunctions["remove_team_member"]["Returns"]
  > | null,
): Promise<DbFunctions["remove_team_member"]["Returns"] | null | boolean> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "remove_team_member", args),
      "remove_team_member",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "remove_team_member", args),
      "remove_team_member",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "remove_team_member", args),
    "remove_team_member",
  );
}

export async function revokeTeamInvitation(
  client: TypedSupabaseClient,
  args?: DbFunctions["revoke_team_invitation"]["Args"],
): Promise<DbFunctions["revoke_team_invitation"]["Returns"] | null>;
export async function revokeTeamInvitation(
  client: TypedSupabaseClient,
  args: DbFunctions["revoke_team_invitation"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function revokeTeamInvitation(
  client: TypedSupabaseClient,
  args: DbFunctions["revoke_team_invitation"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["revoke_team_invitation"]["Returns"]
  > | null,
): Promise<DbFunctions["revoke_team_invitation"]["Returns"] | null>;
export async function revokeTeamInvitation(
  client: TypedSupabaseClient,
  args: DbFunctions["revoke_team_invitation"]["Args"] = emptyRpcArgs<"revoke_team_invitation">(),
  options?: SupabaseRpcOptions<
    DbFunctions["revoke_team_invitation"]["Returns"]
  > | null,
): Promise<DbFunctions["revoke_team_invitation"]["Returns"] | null | boolean> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "revoke_team_invitation", args),
      "revoke_team_invitation",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "revoke_team_invitation", args),
      "revoke_team_invitation",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "revoke_team_invitation", args),
    "revoke_team_invitation",
  );
}

export async function updateTeamMemberRole(
  client: TypedSupabaseClient,
  args?: DbFunctions["update_team_member_role"]["Args"],
): Promise<DbFunctions["update_team_member_role"]["Returns"] | null>;
export async function updateTeamMemberRole(
  client: TypedSupabaseClient,
  args: DbFunctions["update_team_member_role"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function updateTeamMemberRole(
  client: TypedSupabaseClient,
  args: DbFunctions["update_team_member_role"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["update_team_member_role"]["Returns"]
  > | null,
): Promise<DbFunctions["update_team_member_role"]["Returns"] | null>;
export async function updateTeamMemberRole(
  client: TypedSupabaseClient,
  args: DbFunctions["update_team_member_role"]["Args"] = emptyRpcArgs<"update_team_member_role">(),
  options?: SupabaseRpcOptions<
    DbFunctions["update_team_member_role"]["Returns"]
  > | null,
): Promise<DbFunctions["update_team_member_role"]["Returns"] | null | boolean> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "update_team_member_role", args),
      "update_team_member_role",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "update_team_member_role", args),
      "update_team_member_role",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "update_team_member_role", args),
    "update_team_member_role",
  );
}
