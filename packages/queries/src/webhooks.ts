import { handleSupabaseRpc, type SupabaseRpcOptions } from "@lomi./shared";
import { rpc } from "./rpc.js";
import type { DbFunctions, TypedSupabaseClient } from "./types.js";
import { emptyRpcArgs } from "./call-rpc.js";

export async function deleteOrganizationWebhook(
  client: TypedSupabaseClient,
  args?: DbFunctions["delete_organization_webhook"]["Args"],
): Promise<DbFunctions["delete_organization_webhook"]["Returns"] | null>;
export async function deleteOrganizationWebhook(
  client: TypedSupabaseClient,
  args: DbFunctions["delete_organization_webhook"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function deleteOrganizationWebhook(
  client: TypedSupabaseClient,
  args: DbFunctions["delete_organization_webhook"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["delete_organization_webhook"]["Returns"]
  > | null,
): Promise<DbFunctions["delete_organization_webhook"]["Returns"] | null>;
export async function deleteOrganizationWebhook(
  client: TypedSupabaseClient,
  args: DbFunctions["delete_organization_webhook"]["Args"] = emptyRpcArgs<"delete_organization_webhook">(),
  options?: SupabaseRpcOptions<
    DbFunctions["delete_organization_webhook"]["Returns"]
  > | null,
): Promise<
  DbFunctions["delete_organization_webhook"]["Returns"] | null | boolean
> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "delete_organization_webhook", args),
      "delete_organization_webhook",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "delete_organization_webhook", args),
      "delete_organization_webhook",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "delete_organization_webhook", args),
    "delete_organization_webhook",
  );
}

export async function fetchOrganizationWebhooks(
  client: TypedSupabaseClient,
  args?: DbFunctions["fetch_organization_webhooks"]["Args"],
): Promise<DbFunctions["fetch_organization_webhooks"]["Returns"] | null>;
export async function fetchOrganizationWebhooks(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_organization_webhooks"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function fetchOrganizationWebhooks(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_organization_webhooks"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["fetch_organization_webhooks"]["Returns"]
  > | null,
): Promise<DbFunctions["fetch_organization_webhooks"]["Returns"] | null>;
export async function fetchOrganizationWebhooks(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_organization_webhooks"]["Args"] = emptyRpcArgs<"fetch_organization_webhooks">(),
  options?: SupabaseRpcOptions<
    DbFunctions["fetch_organization_webhooks"]["Returns"]
  > | null,
): Promise<
  DbFunctions["fetch_organization_webhooks"]["Returns"] | null | boolean
> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "fetch_organization_webhooks", args),
      "fetch_organization_webhooks",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "fetch_organization_webhooks", args),
      "fetch_organization_webhooks",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "fetch_organization_webhooks", args),
    "fetch_organization_webhooks",
  );
}

export async function fetchWebhookDeliveryLogs(
  client: TypedSupabaseClient,
  args?: DbFunctions["fetch_webhook_delivery_logs"]["Args"],
): Promise<DbFunctions["fetch_webhook_delivery_logs"]["Returns"] | null>;
export async function fetchWebhookDeliveryLogs(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_webhook_delivery_logs"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function fetchWebhookDeliveryLogs(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_webhook_delivery_logs"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["fetch_webhook_delivery_logs"]["Returns"]
  > | null,
): Promise<DbFunctions["fetch_webhook_delivery_logs"]["Returns"] | null>;
export async function fetchWebhookDeliveryLogs(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_webhook_delivery_logs"]["Args"] = emptyRpcArgs<"fetch_webhook_delivery_logs">(),
  options?: SupabaseRpcOptions<
    DbFunctions["fetch_webhook_delivery_logs"]["Returns"]
  > | null,
): Promise<
  DbFunctions["fetch_webhook_delivery_logs"]["Returns"] | null | boolean
> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "fetch_webhook_delivery_logs", args),
      "fetch_webhook_delivery_logs",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "fetch_webhook_delivery_logs", args),
      "fetch_webhook_delivery_logs",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "fetch_webhook_delivery_logs", args),
    "fetch_webhook_delivery_logs",
  );
}

export async function getWebhookDeliveryLogs(
  client: TypedSupabaseClient,
  args?: DbFunctions["get_webhook_delivery_logs"]["Args"],
): Promise<DbFunctions["get_webhook_delivery_logs"]["Returns"] | null>;
export async function getWebhookDeliveryLogs(
  client: TypedSupabaseClient,
  args: DbFunctions["get_webhook_delivery_logs"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function getWebhookDeliveryLogs(
  client: TypedSupabaseClient,
  args: DbFunctions["get_webhook_delivery_logs"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["get_webhook_delivery_logs"]["Returns"]
  > | null,
): Promise<DbFunctions["get_webhook_delivery_logs"]["Returns"] | null>;
export async function getWebhookDeliveryLogs(
  client: TypedSupabaseClient,
  args: DbFunctions["get_webhook_delivery_logs"]["Args"] = emptyRpcArgs<"get_webhook_delivery_logs">(),
  options?: SupabaseRpcOptions<
    DbFunctions["get_webhook_delivery_logs"]["Returns"]
  > | null,
): Promise<
  DbFunctions["get_webhook_delivery_logs"]["Returns"] | null | boolean
> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "get_webhook_delivery_logs", args),
      "get_webhook_delivery_logs",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "get_webhook_delivery_logs", args),
      "get_webhook_delivery_logs",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "get_webhook_delivery_logs", args),
    "get_webhook_delivery_logs",
  );
}

export async function moveWebhookToLive(
  client: TypedSupabaseClient,
  args?: DbFunctions["move_webhook_to_live"]["Args"],
): Promise<DbFunctions["move_webhook_to_live"]["Returns"] | null>;
export async function moveWebhookToLive(
  client: TypedSupabaseClient,
  args: DbFunctions["move_webhook_to_live"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function moveWebhookToLive(
  client: TypedSupabaseClient,
  args: DbFunctions["move_webhook_to_live"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["move_webhook_to_live"]["Returns"]
  > | null,
): Promise<DbFunctions["move_webhook_to_live"]["Returns"] | null>;
export async function moveWebhookToLive(
  client: TypedSupabaseClient,
  args: DbFunctions["move_webhook_to_live"]["Args"] = emptyRpcArgs<"move_webhook_to_live">(),
  options?: SupabaseRpcOptions<
    DbFunctions["move_webhook_to_live"]["Returns"]
  > | null,
): Promise<DbFunctions["move_webhook_to_live"]["Returns"] | null | boolean> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "move_webhook_to_live", args),
      "move_webhook_to_live",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "move_webhook_to_live", args),
      "move_webhook_to_live",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "move_webhook_to_live", args),
    "move_webhook_to_live",
  );
}

export async function updateOrganizationWebhook(
  client: TypedSupabaseClient,
  args?: DbFunctions["update_organization_webhook"]["Args"],
): Promise<DbFunctions["update_organization_webhook"]["Returns"] | null>;
export async function updateOrganizationWebhook(
  client: TypedSupabaseClient,
  args: DbFunctions["update_organization_webhook"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function updateOrganizationWebhook(
  client: TypedSupabaseClient,
  args: DbFunctions["update_organization_webhook"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["update_organization_webhook"]["Returns"]
  > | null,
): Promise<DbFunctions["update_organization_webhook"]["Returns"] | null>;
export async function updateOrganizationWebhook(
  client: TypedSupabaseClient,
  args: DbFunctions["update_organization_webhook"]["Args"] = emptyRpcArgs<"update_organization_webhook">(),
  options?: SupabaseRpcOptions<
    DbFunctions["update_organization_webhook"]["Returns"]
  > | null,
): Promise<
  DbFunctions["update_organization_webhook"]["Returns"] | null | boolean
> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "update_organization_webhook", args),
      "update_organization_webhook",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "update_organization_webhook", args),
      "update_organization_webhook",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "update_organization_webhook", args),
    "update_organization_webhook",
  );
}

export async function updateWebhookDeliveryStatus(
  client: TypedSupabaseClient,
  args?: DbFunctions["update_webhook_delivery_status"]["Args"],
): Promise<DbFunctions["update_webhook_delivery_status"]["Returns"] | null>;
export async function updateWebhookDeliveryStatus(
  client: TypedSupabaseClient,
  args: DbFunctions["update_webhook_delivery_status"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function updateWebhookDeliveryStatus(
  client: TypedSupabaseClient,
  args: DbFunctions["update_webhook_delivery_status"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["update_webhook_delivery_status"]["Returns"]
  > | null,
): Promise<DbFunctions["update_webhook_delivery_status"]["Returns"] | null>;
export async function updateWebhookDeliveryStatus(
  client: TypedSupabaseClient,
  args: DbFunctions["update_webhook_delivery_status"]["Args"] = emptyRpcArgs<"update_webhook_delivery_status">(),
  options?: SupabaseRpcOptions<
    DbFunctions["update_webhook_delivery_status"]["Returns"]
  > | null,
): Promise<
  DbFunctions["update_webhook_delivery_status"]["Returns"] | null | boolean
> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "update_webhook_delivery_status", args),
      "update_webhook_delivery_status",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "update_webhook_delivery_status", args),
      "update_webhook_delivery_status",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "update_webhook_delivery_status", args),
    "update_webhook_delivery_status",
  );
}
