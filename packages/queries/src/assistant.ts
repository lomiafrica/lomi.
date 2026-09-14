import { handleSupabaseRpc, type SupabaseRpcOptions } from "@lomi./shared";
import { rpc } from "./rpc.js";
import type { DbFunctions, TypedSupabaseClient } from "./types.js";
import { emptyRpcArgs } from "./call-rpc.js";

export async function checkAssistantUsageAllowance(
  client: TypedSupabaseClient,
  args?: DbFunctions["check_assistant_usage_allowance"]["Args"],
): Promise<DbFunctions["check_assistant_usage_allowance"]["Returns"] | null>;
export async function checkAssistantUsageAllowance(
  client: TypedSupabaseClient,
  args: DbFunctions["check_assistant_usage_allowance"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function checkAssistantUsageAllowance(
  client: TypedSupabaseClient,
  args: DbFunctions["check_assistant_usage_allowance"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["check_assistant_usage_allowance"]["Returns"]
  > | null,
): Promise<DbFunctions["check_assistant_usage_allowance"]["Returns"] | null>;
export async function checkAssistantUsageAllowance(
  client: TypedSupabaseClient,
  args: DbFunctions["check_assistant_usage_allowance"]["Args"] = emptyRpcArgs<"check_assistant_usage_allowance">(),
  options?: SupabaseRpcOptions<
    DbFunctions["check_assistant_usage_allowance"]["Returns"]
  > | null,
): Promise<
  DbFunctions["check_assistant_usage_allowance"]["Returns"] | null | boolean
> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "check_assistant_usage_allowance", args),
      "check_assistant_usage_allowance",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "check_assistant_usage_allowance", args),
      "check_assistant_usage_allowance",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "check_assistant_usage_allowance", args),
    "check_assistant_usage_allowance",
  );
}

export async function createAssistantConversation(
  client: TypedSupabaseClient,
  args?: DbFunctions["create_assistant_conversation"]["Args"],
): Promise<DbFunctions["create_assistant_conversation"]["Returns"] | null>;
export async function createAssistantConversation(
  client: TypedSupabaseClient,
  args: DbFunctions["create_assistant_conversation"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function createAssistantConversation(
  client: TypedSupabaseClient,
  args: DbFunctions["create_assistant_conversation"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["create_assistant_conversation"]["Returns"]
  > | null,
): Promise<DbFunctions["create_assistant_conversation"]["Returns"] | null>;
export async function createAssistantConversation(
  client: TypedSupabaseClient,
  args: DbFunctions["create_assistant_conversation"]["Args"] = emptyRpcArgs<"create_assistant_conversation">(),
  options?: SupabaseRpcOptions<
    DbFunctions["create_assistant_conversation"]["Returns"]
  > | null,
): Promise<
  DbFunctions["create_assistant_conversation"]["Returns"] | null | boolean
> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "create_assistant_conversation", args),
      "create_assistant_conversation",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "create_assistant_conversation", args),
      "create_assistant_conversation",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "create_assistant_conversation", args),
    "create_assistant_conversation",
  );
}

export async function deleteAssistantConversation(
  client: TypedSupabaseClient,
  args?: DbFunctions["delete_assistant_conversation"]["Args"],
): Promise<DbFunctions["delete_assistant_conversation"]["Returns"] | null>;
export async function deleteAssistantConversation(
  client: TypedSupabaseClient,
  args: DbFunctions["delete_assistant_conversation"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function deleteAssistantConversation(
  client: TypedSupabaseClient,
  args: DbFunctions["delete_assistant_conversation"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["delete_assistant_conversation"]["Returns"]
  > | null,
): Promise<DbFunctions["delete_assistant_conversation"]["Returns"] | null>;
export async function deleteAssistantConversation(
  client: TypedSupabaseClient,
  args: DbFunctions["delete_assistant_conversation"]["Args"] = emptyRpcArgs<"delete_assistant_conversation">(),
  options?: SupabaseRpcOptions<
    DbFunctions["delete_assistant_conversation"]["Returns"]
  > | null,
): Promise<
  DbFunctions["delete_assistant_conversation"]["Returns"] | null | boolean
> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "delete_assistant_conversation", args),
      "delete_assistant_conversation",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "delete_assistant_conversation", args),
      "delete_assistant_conversation",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "delete_assistant_conversation", args),
    "delete_assistant_conversation",
  );
}

export async function fetchAssistantToolAudit(
  client: TypedSupabaseClient,
  args?: DbFunctions["fetch_assistant_tool_audit"]["Args"],
): Promise<DbFunctions["fetch_assistant_tool_audit"]["Returns"] | null>;
export async function fetchAssistantToolAudit(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_assistant_tool_audit"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function fetchAssistantToolAudit(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_assistant_tool_audit"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["fetch_assistant_tool_audit"]["Returns"]
  > | null,
): Promise<DbFunctions["fetch_assistant_tool_audit"]["Returns"] | null>;
export async function fetchAssistantToolAudit(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_assistant_tool_audit"]["Args"] = emptyRpcArgs<"fetch_assistant_tool_audit">(),
  options?: SupabaseRpcOptions<
    DbFunctions["fetch_assistant_tool_audit"]["Returns"]
  > | null,
): Promise<
  DbFunctions["fetch_assistant_tool_audit"]["Returns"] | null | boolean
> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "fetch_assistant_tool_audit", args),
      "fetch_assistant_tool_audit",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "fetch_assistant_tool_audit", args),
      "fetch_assistant_tool_audit",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "fetch_assistant_tool_audit", args),
    "fetch_assistant_tool_audit",
  );
}

export async function getAssistantConversations(
  client: TypedSupabaseClient,
  args?: DbFunctions["get_assistant_conversations"]["Args"],
): Promise<DbFunctions["get_assistant_conversations"]["Returns"] | null>;
export async function getAssistantConversations(
  client: TypedSupabaseClient,
  args: DbFunctions["get_assistant_conversations"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function getAssistantConversations(
  client: TypedSupabaseClient,
  args: DbFunctions["get_assistant_conversations"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["get_assistant_conversations"]["Returns"]
  > | null,
): Promise<DbFunctions["get_assistant_conversations"]["Returns"] | null>;
export async function getAssistantConversations(
  client: TypedSupabaseClient,
  args: DbFunctions["get_assistant_conversations"]["Args"] = emptyRpcArgs<"get_assistant_conversations">(),
  options?: SupabaseRpcOptions<
    DbFunctions["get_assistant_conversations"]["Returns"]
  > | null,
): Promise<
  DbFunctions["get_assistant_conversations"]["Returns"] | null | boolean
> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "get_assistant_conversations", args),
      "get_assistant_conversations",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "get_assistant_conversations", args),
      "get_assistant_conversations",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "get_assistant_conversations", args),
    "get_assistant_conversations",
  );
}

export async function getAssistantMessages(
  client: TypedSupabaseClient,
  args?: DbFunctions["get_assistant_messages"]["Args"],
): Promise<DbFunctions["get_assistant_messages"]["Returns"] | null>;
export async function getAssistantMessages(
  client: TypedSupabaseClient,
  args: DbFunctions["get_assistant_messages"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function getAssistantMessages(
  client: TypedSupabaseClient,
  args: DbFunctions["get_assistant_messages"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["get_assistant_messages"]["Returns"]
  > | null,
): Promise<DbFunctions["get_assistant_messages"]["Returns"] | null>;
export async function getAssistantMessages(
  client: TypedSupabaseClient,
  args: DbFunctions["get_assistant_messages"]["Args"] = emptyRpcArgs<"get_assistant_messages">(),
  options?: SupabaseRpcOptions<
    DbFunctions["get_assistant_messages"]["Returns"]
  > | null,
): Promise<DbFunctions["get_assistant_messages"]["Returns"] | null | boolean> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "get_assistant_messages", args),
      "get_assistant_messages",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "get_assistant_messages", args),
      "get_assistant_messages",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "get_assistant_messages", args),
    "get_assistant_messages",
  );
}

export async function getAssistantPendingRun(
  client: TypedSupabaseClient,
  args?: DbFunctions["get_assistant_pending_run"]["Args"],
): Promise<DbFunctions["get_assistant_pending_run"]["Returns"] | null>;
export async function getAssistantPendingRun(
  client: TypedSupabaseClient,
  args: DbFunctions["get_assistant_pending_run"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function getAssistantPendingRun(
  client: TypedSupabaseClient,
  args: DbFunctions["get_assistant_pending_run"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["get_assistant_pending_run"]["Returns"]
  > | null,
): Promise<DbFunctions["get_assistant_pending_run"]["Returns"] | null>;
export async function getAssistantPendingRun(
  client: TypedSupabaseClient,
  args: DbFunctions["get_assistant_pending_run"]["Args"] = emptyRpcArgs<"get_assistant_pending_run">(),
  options?: SupabaseRpcOptions<
    DbFunctions["get_assistant_pending_run"]["Returns"]
  > | null,
): Promise<
  DbFunctions["get_assistant_pending_run"]["Returns"] | null | boolean
> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "get_assistant_pending_run", args),
      "get_assistant_pending_run",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "get_assistant_pending_run", args),
      "get_assistant_pending_run",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "get_assistant_pending_run", args),
    "get_assistant_pending_run",
  );
}

export async function getAssistantSettings(
  client: TypedSupabaseClient,
  args?: DbFunctions["get_assistant_settings"]["Args"],
): Promise<DbFunctions["get_assistant_settings"]["Returns"] | null>;
export async function getAssistantSettings(
  client: TypedSupabaseClient,
  args: DbFunctions["get_assistant_settings"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function getAssistantSettings(
  client: TypedSupabaseClient,
  args: DbFunctions["get_assistant_settings"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["get_assistant_settings"]["Returns"]
  > | null,
): Promise<DbFunctions["get_assistant_settings"]["Returns"] | null>;
export async function getAssistantSettings(
  client: TypedSupabaseClient,
  args: DbFunctions["get_assistant_settings"]["Args"] = emptyRpcArgs<"get_assistant_settings">(),
  options?: SupabaseRpcOptions<
    DbFunctions["get_assistant_settings"]["Returns"]
  > | null,
): Promise<DbFunctions["get_assistant_settings"]["Returns"] | null | boolean> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "get_assistant_settings", args),
      "get_assistant_settings",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "get_assistant_settings", args),
      "get_assistant_settings",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "get_assistant_settings", args),
    "get_assistant_settings",
  );
}

export async function saveAssistantOrgSettings(
  client: TypedSupabaseClient,
  args?: DbFunctions["save_assistant_org_settings"]["Args"],
): Promise<DbFunctions["save_assistant_org_settings"]["Returns"] | null>;
export async function saveAssistantOrgSettings(
  client: TypedSupabaseClient,
  args: DbFunctions["save_assistant_org_settings"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function saveAssistantOrgSettings(
  client: TypedSupabaseClient,
  args: DbFunctions["save_assistant_org_settings"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["save_assistant_org_settings"]["Returns"]
  > | null,
): Promise<DbFunctions["save_assistant_org_settings"]["Returns"] | null>;
export async function saveAssistantOrgSettings(
  client: TypedSupabaseClient,
  args: DbFunctions["save_assistant_org_settings"]["Args"] = emptyRpcArgs<"save_assistant_org_settings">(),
  options?: SupabaseRpcOptions<
    DbFunctions["save_assistant_org_settings"]["Returns"]
  > | null,
): Promise<
  DbFunctions["save_assistant_org_settings"]["Returns"] | null | boolean
> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "save_assistant_org_settings", args),
      "save_assistant_org_settings",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "save_assistant_org_settings", args),
      "save_assistant_org_settings",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "save_assistant_org_settings", args),
    "save_assistant_org_settings",
  );
}

export async function saveAssistantUserPreferences(
  client: TypedSupabaseClient,
  args?: DbFunctions["save_assistant_user_preferences"]["Args"],
): Promise<DbFunctions["save_assistant_user_preferences"]["Returns"] | null>;
export async function saveAssistantUserPreferences(
  client: TypedSupabaseClient,
  args: DbFunctions["save_assistant_user_preferences"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function saveAssistantUserPreferences(
  client: TypedSupabaseClient,
  args: DbFunctions["save_assistant_user_preferences"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["save_assistant_user_preferences"]["Returns"]
  > | null,
): Promise<DbFunctions["save_assistant_user_preferences"]["Returns"] | null>;
export async function saveAssistantUserPreferences(
  client: TypedSupabaseClient,
  args: DbFunctions["save_assistant_user_preferences"]["Args"] = emptyRpcArgs<"save_assistant_user_preferences">(),
  options?: SupabaseRpcOptions<
    DbFunctions["save_assistant_user_preferences"]["Returns"]
  > | null,
): Promise<
  DbFunctions["save_assistant_user_preferences"]["Returns"] | null | boolean
> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "save_assistant_user_preferences", args),
      "save_assistant_user_preferences",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "save_assistant_user_preferences", args),
      "save_assistant_user_preferences",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "save_assistant_user_preferences", args),
    "save_assistant_user_preferences",
  );
}

export async function updateAssistantConversationMetadata(
  client: TypedSupabaseClient,
  args?: DbFunctions["update_assistant_conversation_metadata"]["Args"],
): Promise<
  DbFunctions["update_assistant_conversation_metadata"]["Returns"] | null
>;
export async function updateAssistantConversationMetadata(
  client: TypedSupabaseClient,
  args: DbFunctions["update_assistant_conversation_metadata"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function updateAssistantConversationMetadata(
  client: TypedSupabaseClient,
  args: DbFunctions["update_assistant_conversation_metadata"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["update_assistant_conversation_metadata"]["Returns"]
  > | null,
): Promise<
  DbFunctions["update_assistant_conversation_metadata"]["Returns"] | null
>;
export async function updateAssistantConversationMetadata(
  client: TypedSupabaseClient,
  args: DbFunctions["update_assistant_conversation_metadata"]["Args"] = emptyRpcArgs<"update_assistant_conversation_metadata">(),
  options?: SupabaseRpcOptions<
    DbFunctions["update_assistant_conversation_metadata"]["Returns"]
  > | null,
): Promise<
  | DbFunctions["update_assistant_conversation_metadata"]["Returns"]
  | null
  | boolean
> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "update_assistant_conversation_metadata", args),
      "update_assistant_conversation_metadata",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "update_assistant_conversation_metadata", args),
      "update_assistant_conversation_metadata",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "update_assistant_conversation_metadata", args),
    "update_assistant_conversation_metadata",
  );
}

export async function updateAssistantConversationTitle(
  client: TypedSupabaseClient,
  args?: DbFunctions["update_assistant_conversation_title"]["Args"],
): Promise<
  DbFunctions["update_assistant_conversation_title"]["Returns"] | null
>;
export async function updateAssistantConversationTitle(
  client: TypedSupabaseClient,
  args: DbFunctions["update_assistant_conversation_title"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function updateAssistantConversationTitle(
  client: TypedSupabaseClient,
  args: DbFunctions["update_assistant_conversation_title"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["update_assistant_conversation_title"]["Returns"]
  > | null,
): Promise<
  DbFunctions["update_assistant_conversation_title"]["Returns"] | null
>;
export async function updateAssistantConversationTitle(
  client: TypedSupabaseClient,
  args: DbFunctions["update_assistant_conversation_title"]["Args"] = emptyRpcArgs<"update_assistant_conversation_title">(),
  options?: SupabaseRpcOptions<
    DbFunctions["update_assistant_conversation_title"]["Returns"]
  > | null,
): Promise<
  DbFunctions["update_assistant_conversation_title"]["Returns"] | null | boolean
> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "update_assistant_conversation_title", args),
      "update_assistant_conversation_title",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "update_assistant_conversation_title", args),
      "update_assistant_conversation_title",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "update_assistant_conversation_title", args),
    "update_assistant_conversation_title",
  );
}
