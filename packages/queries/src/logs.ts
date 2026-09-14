import { handleSupabaseRpc, type SupabaseRpcOptions } from "@lomi./shared";
import { rpc } from "./rpc.js";
import type { DbFunctions, TypedSupabaseClient } from "./types.js";
import { emptyRpcArgs } from "./call-rpc.js";

export async function fetchApiInteractions(
  client: TypedSupabaseClient,
  args?: DbFunctions["fetch_api_interactions"]["Args"],
): Promise<DbFunctions["fetch_api_interactions"]["Returns"] | null>;
export async function fetchApiInteractions(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_api_interactions"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function fetchApiInteractions(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_api_interactions"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["fetch_api_interactions"]["Returns"]
  > | null,
): Promise<DbFunctions["fetch_api_interactions"]["Returns"] | null>;
export async function fetchApiInteractions(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_api_interactions"]["Args"] = emptyRpcArgs<"fetch_api_interactions">(),
  options?: SupabaseRpcOptions<
    DbFunctions["fetch_api_interactions"]["Returns"]
  > | null,
): Promise<DbFunctions["fetch_api_interactions"]["Returns"] | null | boolean> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "fetch_api_interactions", args),
      "fetch_api_interactions",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "fetch_api_interactions", args),
      "fetch_api_interactions",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "fetch_api_interactions", args),
    "fetch_api_interactions",
  );
}

export async function fetchLogs(
  client: TypedSupabaseClient,
  args?: DbFunctions["fetch_logs"]["Args"],
): Promise<DbFunctions["fetch_logs"]["Returns"] | null>;
export async function fetchLogs(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_logs"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function fetchLogs(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_logs"]["Args"],
  options: SupabaseRpcOptions<DbFunctions["fetch_logs"]["Returns"]> | null,
): Promise<DbFunctions["fetch_logs"]["Returns"] | null>;
export async function fetchLogs(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_logs"]["Args"] = emptyRpcArgs<"fetch_logs">(),
  options?: SupabaseRpcOptions<DbFunctions["fetch_logs"]["Returns"]> | null,
): Promise<DbFunctions["fetch_logs"]["Returns"] | null | boolean> {
  if (options === null) {
    return handleSupabaseRpc(rpc(client, "fetch_logs", args), "fetch_logs", {
      fallbackValue: null,
    });
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "fetch_logs", args),
      "fetch_logs",
      options,
    );
  }
  return handleSupabaseRpc(rpc(client, "fetch_logs", args), "fetch_logs");
}

export async function logWideEvent(
  client: TypedSupabaseClient,
  args?: DbFunctions["log_wide_event"]["Args"],
): Promise<DbFunctions["log_wide_event"]["Returns"] | null>;
export async function logWideEvent(
  client: TypedSupabaseClient,
  args: DbFunctions["log_wide_event"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function logWideEvent(
  client: TypedSupabaseClient,
  args: DbFunctions["log_wide_event"]["Args"],
  options: SupabaseRpcOptions<DbFunctions["log_wide_event"]["Returns"]> | null,
): Promise<DbFunctions["log_wide_event"]["Returns"] | null>;
export async function logWideEvent(
  client: TypedSupabaseClient,
  args: DbFunctions["log_wide_event"]["Args"] = emptyRpcArgs<"log_wide_event">(),
  options?: SupabaseRpcOptions<DbFunctions["log_wide_event"]["Returns"]> | null,
): Promise<DbFunctions["log_wide_event"]["Returns"] | null | boolean> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "log_wide_event", args),
      "log_wide_event",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "log_wide_event", args),
      "log_wide_event",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "log_wide_event", args),
    "log_wide_event",
  );
}
