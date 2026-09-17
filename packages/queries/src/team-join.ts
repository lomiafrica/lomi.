import {
  isJsonArray,
  isJsonObject,
  readBoolean,
  readNumber,
  readString,
  type JsonObject,
  type JsonValue,
} from "@lomi./shared";
import type { TypedSupabaseClient } from "./types.js";
import { handleUntypedRpc } from "./untyped-rpc.js";

export type TeamJoinCodeRow = {
  join_code_id: string;
  code: string;
  role_id: string;
  role_key: string;
  role_title: string | null;
  expires_at: string;
  max_uses: number;
  use_count: number;
  revoked_at: string | null;
  created_at: string;
};

export type CreatedTeamJoinCode = {
  join_code_id: string;
  code: string;
  role_id: string;
  role_key: string;
  expires_at: string;
  max_uses: number;
};

function parseJoinCodeRow(value: JsonValue): TeamJoinCodeRow | null {
  if (!isJsonObject(value)) return null;
  const join_code_id = readString(value, "join_code_id");
  const code = readString(value, "code");
  const role_id = readString(value, "role_id");
  const role_key = readString(value, "role_key");
  const expires_at = readString(value, "expires_at");
  const created_at = readString(value, "created_at");
  if (
    !join_code_id ||
    !code ||
    !role_id ||
    !role_key ||
    !expires_at ||
    !created_at
  ) {
    return null;
  }
  return {
    join_code_id,
    code,
    role_id,
    role_key,
    role_title: readString(value, "role_title") ?? null,
    expires_at,
    max_uses: readNumber(value, "max_uses") ?? 0,
    use_count: readNumber(value, "use_count") ?? 0,
    revoked_at: readString(value, "revoked_at") ?? null,
    created_at,
  };
}

function parseCreatedJoinCode(value: JsonValue): CreatedTeamJoinCode | null {
  const row = Array.isArray(value) ? value[0] : value;
  if (!isJsonObject(row)) return null;
  const join_code_id = readString(row, "join_code_id");
  const code = readString(row, "code");
  const role_id = readString(row, "role_id");
  const role_key = readString(row, "role_key");
  const expires_at = readString(row, "expires_at");
  if (!join_code_id || !code || !role_id || !role_key || !expires_at) {
    return null;
  }
  return {
    join_code_id,
    code,
    role_id,
    role_key,
    expires_at,
    max_uses: readNumber(row, "max_uses") ?? 0,
  };
}

export async function inviteTeamMemberWithContact(
  client: TypedSupabaseClient,
  args: {
    p_organization_id: string;
    p_email?: string | null;
    p_phone?: string | null;
    p_role: "Admin" | "Member";
    p_position?: string;
    p_role_id?: string | null;
    p_acting_merchant_id?: string | null;
  },
): Promise<void> {
  const payload: JsonObject = {
    p_organization_id: args.p_organization_id,
    p_email: args.p_email ?? "",
    p_role: args.p_role,
    p_position: args.p_position ?? "",
    p_role_id: args.p_role_id ?? null,
    p_acting_merchant_id: args.p_acting_merchant_id ?? null,
    p_phone: args.p_phone ?? null,
  };
  await handleUntypedRpc(client, "invite_team_member", payload, {
    expectReturnValue: false,
  });
}

export async function createTeamJoinCode(
  client: TypedSupabaseClient,
  args: {
    p_organization_id: string;
    p_role_id: string;
    p_expires_in_hours?: number;
    p_max_uses?: number;
  },
): Promise<CreatedTeamJoinCode | null> {
  const data = await handleUntypedRpc(client, "create_team_join_code", {
    p_organization_id: args.p_organization_id,
    p_role_id: args.p_role_id,
    p_expires_in_hours: args.p_expires_in_hours ?? 24,
    p_max_uses: args.p_max_uses ?? 50,
  });
  return parseCreatedJoinCode(data);
}

export async function listTeamJoinCodes(
  client: TypedSupabaseClient,
  args: { p_organization_id: string },
): Promise<TeamJoinCodeRow[]> {
  const data = await handleUntypedRpc(client, "list_team_join_codes", args, {
    fallbackValue: [],
  });
  if (!isJsonArray(data)) return [];
  return data.flatMap((row) => {
    const parsed = parseJoinCodeRow(row);
    return parsed ? [parsed] : [];
  });
}

export async function revokeTeamJoinCode(
  client: TypedSupabaseClient,
  args: { p_organization_id: string; p_join_code_id: string },
): Promise<boolean> {
  const data = await handleUntypedRpc(client, "revoke_team_join_code", args, {
    fallbackValue: false,
  });
  return data === true;
}

export async function redeemTeamJoinCode(
  client: TypedSupabaseClient,
  args: { p_code: string },
): Promise<{
  success: boolean;
  organization_id: string | null;
  already_member: boolean;
}> {
  const data = await handleUntypedRpc(client, "redeem_team_join_code", args);
  if (!isJsonObject(data)) {
    return { success: false, organization_id: null, already_member: false };
  }
  return {
    success: readBoolean(data, "success") === true,
    organization_id: readString(data, "organization_id") ?? null,
    already_member: readBoolean(data, "already_member") === true,
  };
}

export async function claimPendingTeamInvitations(
  client: TypedSupabaseClient,
): Promise<number> {
  const data = await handleUntypedRpc(
    client,
    "claim_pending_team_invitations",
    {},
    { fallbackValue: { claimed: 0 } },
  );
  if (!isJsonObject(data)) return 0;
  return readNumber(data, "claimed") ?? 0;
}
