import { handleSupabaseRpc, type SupabaseRpcOptions } from "@lomi./shared";
import { rpc } from "./rpc.js";
import type { DbFunctions, TypedSupabaseClient } from "./types.js";
import { emptyRpcArgs } from "./call-rpc.js";

export async function deleteApiKey(
  client: TypedSupabaseClient,
  args?: DbFunctions["delete_api_key"]["Args"],
): Promise<DbFunctions["delete_api_key"]["Returns"] | null>;
export async function deleteApiKey(
  client: TypedSupabaseClient,
  args: DbFunctions["delete_api_key"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function deleteApiKey(
  client: TypedSupabaseClient,
  args: DbFunctions["delete_api_key"]["Args"],
  options: SupabaseRpcOptions<DbFunctions["delete_api_key"]["Returns"]> | null,
): Promise<DbFunctions["delete_api_key"]["Returns"] | null>;
export async function deleteApiKey(
  client: TypedSupabaseClient,
  args: DbFunctions["delete_api_key"]["Args"] = emptyRpcArgs<"delete_api_key">(),
  options?: SupabaseRpcOptions<DbFunctions["delete_api_key"]["Returns"]> | null,
): Promise<DbFunctions["delete_api_key"]["Returns"] | null | boolean> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "delete_api_key", args),
      "delete_api_key",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "delete_api_key", args),
      "delete_api_key",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "delete_api_key", args),
    "delete_api_key",
  );
}

export async function fetchApiKeys(
  client: TypedSupabaseClient,
  args?: DbFunctions["fetch_api_keys"]["Args"],
): Promise<DbFunctions["fetch_api_keys"]["Returns"] | null>;
export async function fetchApiKeys(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_api_keys"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function fetchApiKeys(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_api_keys"]["Args"],
  options: SupabaseRpcOptions<DbFunctions["fetch_api_keys"]["Returns"]> | null,
): Promise<DbFunctions["fetch_api_keys"]["Returns"] | null>;
export async function fetchApiKeys(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_api_keys"]["Args"] = emptyRpcArgs<"fetch_api_keys">(),
  options?: SupabaseRpcOptions<DbFunctions["fetch_api_keys"]["Returns"]> | null,
): Promise<DbFunctions["fetch_api_keys"]["Returns"] | null | boolean> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "fetch_api_keys", args),
      "fetch_api_keys",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "fetch_api_keys", args),
      "fetch_api_keys",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "fetch_api_keys", args),
    "fetch_api_keys",
  );
}

export async function generateApiKey(
  client: TypedSupabaseClient,
  args?: DbFunctions["generate_api_key"]["Args"],
): Promise<DbFunctions["generate_api_key"]["Returns"] | null>;
export async function generateApiKey(
  client: TypedSupabaseClient,
  args: DbFunctions["generate_api_key"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function generateApiKey(
  client: TypedSupabaseClient,
  args: DbFunctions["generate_api_key"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["generate_api_key"]["Returns"]
  > | null,
): Promise<DbFunctions["generate_api_key"]["Returns"] | null>;
export async function generateApiKey(
  client: TypedSupabaseClient,
  args: DbFunctions["generate_api_key"]["Args"] = emptyRpcArgs<"generate_api_key">(),
  options?: SupabaseRpcOptions<
    DbFunctions["generate_api_key"]["Returns"]
  > | null,
): Promise<DbFunctions["generate_api_key"]["Returns"] | null | boolean> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "generate_api_key", args),
      "generate_api_key",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "generate_api_key", args),
      "generate_api_key",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "generate_api_key", args),
    "generate_api_key",
  );
}

export async function updateApiKeyStatus(
  client: TypedSupabaseClient,
  args?: DbFunctions["update_api_key_status"]["Args"],
): Promise<DbFunctions["update_api_key_status"]["Returns"] | null>;
export async function updateApiKeyStatus(
  client: TypedSupabaseClient,
  args: DbFunctions["update_api_key_status"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function updateApiKeyStatus(
  client: TypedSupabaseClient,
  args: DbFunctions["update_api_key_status"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["update_api_key_status"]["Returns"]
  > | null,
): Promise<DbFunctions["update_api_key_status"]["Returns"] | null>;
export async function updateApiKeyStatus(
  client: TypedSupabaseClient,
  args: DbFunctions["update_api_key_status"]["Args"] = emptyRpcArgs<"update_api_key_status">(),
  options?: SupabaseRpcOptions<
    DbFunctions["update_api_key_status"]["Returns"]
  > | null,
): Promise<DbFunctions["update_api_key_status"]["Returns"] | null | boolean> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "update_api_key_status", args),
      "update_api_key_status",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "update_api_key_status", args),
      "update_api_key_status",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "update_api_key_status", args),
    "update_api_key_status",
  );
}
