import { handleSupabaseRpc, type SupabaseRpcOptions } from "@lomi./shared";
import { rpc } from "./rpc.js";
import type { DbFunctions, TypedSupabaseClient } from "./types.js";
import { emptyRpcArgs } from "./call-rpc.js";

export async function archiveAllReadNotifications(
  client: TypedSupabaseClient,
  args?: DbFunctions["archive_all_read_notifications"]["Args"],
): Promise<DbFunctions["archive_all_read_notifications"]["Returns"] | null>;
export async function archiveAllReadNotifications(
  client: TypedSupabaseClient,
  args: DbFunctions["archive_all_read_notifications"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function archiveAllReadNotifications(
  client: TypedSupabaseClient,
  args: DbFunctions["archive_all_read_notifications"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["archive_all_read_notifications"]["Returns"]
  > | null,
): Promise<DbFunctions["archive_all_read_notifications"]["Returns"] | null>;
export async function archiveAllReadNotifications(
  client: TypedSupabaseClient,
  args: DbFunctions["archive_all_read_notifications"]["Args"] = emptyRpcArgs<"archive_all_read_notifications">(),
  options?: SupabaseRpcOptions<
    DbFunctions["archive_all_read_notifications"]["Returns"]
  > | null,
): Promise<
  DbFunctions["archive_all_read_notifications"]["Returns"] | null | boolean
> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "archive_all_read_notifications", args),
      "archive_all_read_notifications",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "archive_all_read_notifications", args),
      "archive_all_read_notifications",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "archive_all_read_notifications", args),
    "archive_all_read_notifications",
  );
}

export async function archiveNotification(
  client: TypedSupabaseClient,
  args?: DbFunctions["archive_notification"]["Args"],
): Promise<DbFunctions["archive_notification"]["Returns"] | null>;
export async function archiveNotification(
  client: TypedSupabaseClient,
  args: DbFunctions["archive_notification"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function archiveNotification(
  client: TypedSupabaseClient,
  args: DbFunctions["archive_notification"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["archive_notification"]["Returns"]
  > | null,
): Promise<DbFunctions["archive_notification"]["Returns"] | null>;
export async function archiveNotification(
  client: TypedSupabaseClient,
  args: DbFunctions["archive_notification"]["Args"] = emptyRpcArgs<"archive_notification">(),
  options?: SupabaseRpcOptions<
    DbFunctions["archive_notification"]["Returns"]
  > | null,
): Promise<DbFunctions["archive_notification"]["Returns"] | null | boolean> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "archive_notification", args),
      "archive_notification",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "archive_notification", args),
      "archive_notification",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "archive_notification", args),
    "archive_notification",
  );
}

export async function deleteAllArchivedNotifications(
  client: TypedSupabaseClient,
  args?: DbFunctions["delete_all_archived_notifications"]["Args"],
): Promise<DbFunctions["delete_all_archived_notifications"]["Returns"] | null>;
export async function deleteAllArchivedNotifications(
  client: TypedSupabaseClient,
  args: DbFunctions["delete_all_archived_notifications"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function deleteAllArchivedNotifications(
  client: TypedSupabaseClient,
  args: DbFunctions["delete_all_archived_notifications"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["delete_all_archived_notifications"]["Returns"]
  > | null,
): Promise<DbFunctions["delete_all_archived_notifications"]["Returns"] | null>;
export async function deleteAllArchivedNotifications(
  client: TypedSupabaseClient,
  args: DbFunctions["delete_all_archived_notifications"]["Args"] = emptyRpcArgs<"delete_all_archived_notifications">(),
  options?: SupabaseRpcOptions<
    DbFunctions["delete_all_archived_notifications"]["Returns"]
  > | null,
): Promise<
  DbFunctions["delete_all_archived_notifications"]["Returns"] | null | boolean
> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "delete_all_archived_notifications", args),
      "delete_all_archived_notifications",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "delete_all_archived_notifications", args),
      "delete_all_archived_notifications",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "delete_all_archived_notifications", args),
    "delete_all_archived_notifications",
  );
}

export async function deleteNotification(
  client: TypedSupabaseClient,
  args?: DbFunctions["delete_notification"]["Args"],
): Promise<DbFunctions["delete_notification"]["Returns"] | null>;
export async function deleteNotification(
  client: TypedSupabaseClient,
  args: DbFunctions["delete_notification"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function deleteNotification(
  client: TypedSupabaseClient,
  args: DbFunctions["delete_notification"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["delete_notification"]["Returns"]
  > | null,
): Promise<DbFunctions["delete_notification"]["Returns"] | null>;
export async function deleteNotification(
  client: TypedSupabaseClient,
  args: DbFunctions["delete_notification"]["Args"] = emptyRpcArgs<"delete_notification">(),
  options?: SupabaseRpcOptions<
    DbFunctions["delete_notification"]["Returns"]
  > | null,
): Promise<DbFunctions["delete_notification"]["Returns"] | null | boolean> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "delete_notification", args),
      "delete_notification",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "delete_notification", args),
      "delete_notification",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "delete_notification", args),
    "delete_notification",
  );
}

export async function fetchNotifications(
  client: TypedSupabaseClient,
  args?: DbFunctions["fetch_notifications"]["Args"],
): Promise<DbFunctions["fetch_notifications"]["Returns"] | null>;
export async function fetchNotifications(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_notifications"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function fetchNotifications(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_notifications"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["fetch_notifications"]["Returns"]
  > | null,
): Promise<DbFunctions["fetch_notifications"]["Returns"] | null>;
export async function fetchNotifications(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_notifications"]["Args"] = emptyRpcArgs<"fetch_notifications">(),
  options?: SupabaseRpcOptions<
    DbFunctions["fetch_notifications"]["Returns"]
  > | null,
): Promise<DbFunctions["fetch_notifications"]["Returns"] | null | boolean> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "fetch_notifications", args),
      "fetch_notifications",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "fetch_notifications", args),
      "fetch_notifications",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "fetch_notifications", args),
    "fetch_notifications",
  );
}

export async function markAllNotificationsRead(
  client: TypedSupabaseClient,
  args?: DbFunctions["mark_all_notifications_read"]["Args"],
): Promise<DbFunctions["mark_all_notifications_read"]["Returns"] | null>;
export async function markAllNotificationsRead(
  client: TypedSupabaseClient,
  args: DbFunctions["mark_all_notifications_read"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function markAllNotificationsRead(
  client: TypedSupabaseClient,
  args: DbFunctions["mark_all_notifications_read"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["mark_all_notifications_read"]["Returns"]
  > | null,
): Promise<DbFunctions["mark_all_notifications_read"]["Returns"] | null>;
export async function markAllNotificationsRead(
  client: TypedSupabaseClient,
  args: DbFunctions["mark_all_notifications_read"]["Args"] = emptyRpcArgs<"mark_all_notifications_read">(),
  options?: SupabaseRpcOptions<
    DbFunctions["mark_all_notifications_read"]["Returns"]
  > | null,
): Promise<
  DbFunctions["mark_all_notifications_read"]["Returns"] | null | boolean
> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "mark_all_notifications_read", args),
      "mark_all_notifications_read",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "mark_all_notifications_read", args),
      "mark_all_notifications_read",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "mark_all_notifications_read", args),
    "mark_all_notifications_read",
  );
}

export async function markNotificationRead(
  client: TypedSupabaseClient,
  args?: DbFunctions["mark_notification_read"]["Args"],
): Promise<DbFunctions["mark_notification_read"]["Returns"] | null>;
export async function markNotificationRead(
  client: TypedSupabaseClient,
  args: DbFunctions["mark_notification_read"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function markNotificationRead(
  client: TypedSupabaseClient,
  args: DbFunctions["mark_notification_read"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["mark_notification_read"]["Returns"]
  > | null,
): Promise<DbFunctions["mark_notification_read"]["Returns"] | null>;
export async function markNotificationRead(
  client: TypedSupabaseClient,
  args: DbFunctions["mark_notification_read"]["Args"] = emptyRpcArgs<"mark_notification_read">(),
  options?: SupabaseRpcOptions<
    DbFunctions["mark_notification_read"]["Returns"]
  > | null,
): Promise<DbFunctions["mark_notification_read"]["Returns"] | null | boolean> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "mark_notification_read", args),
      "mark_notification_read",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "mark_notification_read", args),
      "mark_notification_read",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "mark_notification_read", args),
    "mark_notification_read",
  );
}

export async function unarchiveNotification(
  client: TypedSupabaseClient,
  args?: DbFunctions["unarchive_notification"]["Args"],
): Promise<DbFunctions["unarchive_notification"]["Returns"] | null>;
export async function unarchiveNotification(
  client: TypedSupabaseClient,
  args: DbFunctions["unarchive_notification"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function unarchiveNotification(
  client: TypedSupabaseClient,
  args: DbFunctions["unarchive_notification"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["unarchive_notification"]["Returns"]
  > | null,
): Promise<DbFunctions["unarchive_notification"]["Returns"] | null>;
export async function unarchiveNotification(
  client: TypedSupabaseClient,
  args: DbFunctions["unarchive_notification"]["Args"] = emptyRpcArgs<"unarchive_notification">(),
  options?: SupabaseRpcOptions<
    DbFunctions["unarchive_notification"]["Returns"]
  > | null,
): Promise<DbFunctions["unarchive_notification"]["Returns"] | null | boolean> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "unarchive_notification", args),
      "unarchive_notification",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "unarchive_notification", args),
      "unarchive_notification",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "unarchive_notification", args),
    "unarchive_notification",
  );
}
