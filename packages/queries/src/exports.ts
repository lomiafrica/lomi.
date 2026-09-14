import { handleSupabaseRpc, type SupabaseRpcOptions } from "@lomi./shared";
import { rpc } from "./rpc.js";
import type { DbFunctions, TypedSupabaseClient } from "./types.js";
import { emptyRpcArgs } from "./call-rpc.js";

export async function createExportJob(
  client: TypedSupabaseClient,
  args?: DbFunctions["create_export_job"]["Args"],
): Promise<DbFunctions["create_export_job"]["Returns"] | null>;
export async function createExportJob(
  client: TypedSupabaseClient,
  args: DbFunctions["create_export_job"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function createExportJob(
  client: TypedSupabaseClient,
  args: DbFunctions["create_export_job"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["create_export_job"]["Returns"]
  > | null,
): Promise<DbFunctions["create_export_job"]["Returns"] | null>;
export async function createExportJob(
  client: TypedSupabaseClient,
  args: DbFunctions["create_export_job"]["Args"] = emptyRpcArgs<"create_export_job">(),
  options?: SupabaseRpcOptions<
    DbFunctions["create_export_job"]["Returns"]
  > | null,
): Promise<DbFunctions["create_export_job"]["Returns"] | null | boolean> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "create_export_job", args),
      "create_export_job",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "create_export_job", args),
      "create_export_job",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "create_export_job", args),
    "create_export_job",
  );
}

export async function getExportJobStatus(
  client: TypedSupabaseClient,
  args?: DbFunctions["get_export_job_status"]["Args"],
): Promise<DbFunctions["get_export_job_status"]["Returns"] | null>;
export async function getExportJobStatus(
  client: TypedSupabaseClient,
  args: DbFunctions["get_export_job_status"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function getExportJobStatus(
  client: TypedSupabaseClient,
  args: DbFunctions["get_export_job_status"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["get_export_job_status"]["Returns"]
  > | null,
): Promise<DbFunctions["get_export_job_status"]["Returns"] | null>;
export async function getExportJobStatus(
  client: TypedSupabaseClient,
  args: DbFunctions["get_export_job_status"]["Args"] = emptyRpcArgs<"get_export_job_status">(),
  options?: SupabaseRpcOptions<
    DbFunctions["get_export_job_status"]["Returns"]
  > | null,
): Promise<DbFunctions["get_export_job_status"]["Returns"] | null | boolean> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "get_export_job_status", args),
      "get_export_job_status",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "get_export_job_status", args),
      "get_export_job_status",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "get_export_job_status", args),
    "get_export_job_status",
  );
}
