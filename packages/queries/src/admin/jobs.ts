import { callRpc } from "../call-rpc.js";
import type { DbFunctions, TypedSupabaseClient } from "../types.js";
import type { SupabaseRpcOptions } from "@lomi./shared";

/** Admin jobs RPCs — inject platform-admin TypedSupabaseClient. */
export { rpc } from "../rpc.js";

export async function getAdminJobApplicationsOverview(
  client: TypedSupabaseClient,
  args: DbFunctions["get_admin_job_applications_overview"]["Args"],
  options?: SupabaseRpcOptions<
    DbFunctions["get_admin_job_applications_overview"]["Returns"]
  > | null,
): Promise<
  DbFunctions["get_admin_job_applications_overview"]["Returns"] | null | boolean
> {
  if (options === null) {
    return callRpc(
      client,
      "get_admin_job_applications_overview",
      args,
      "get_admin_job_applications_overview",
      { fallbackValue: null },
    );
  }
  return callRpc(
    client,
    "get_admin_job_applications_overview",
    args,
    "get_admin_job_applications_overview",
    options,
  );
}

export async function getAdminJobStatistics(
  client: TypedSupabaseClient,
  args: DbFunctions["get_admin_job_statistics"]["Args"],
  options?: SupabaseRpcOptions<
    DbFunctions["get_admin_job_statistics"]["Returns"]
  > | null,
): Promise<
  DbFunctions["get_admin_job_statistics"]["Returns"] | null | boolean
> {
  if (options === null) {
    return callRpc(
      client,
      "get_admin_job_statistics",
      args,
      "get_admin_job_statistics",
      { fallbackValue: null },
    );
  }
  return callRpc(
    client,
    "get_admin_job_statistics",
    args,
    "get_admin_job_statistics",
    options,
  );
}

export async function getJobApplicationsByDepartment(
  client: TypedSupabaseClient,
  args: DbFunctions["get_job_applications_by_department"]["Args"],
  options?: SupabaseRpcOptions<
    DbFunctions["get_job_applications_by_department"]["Returns"]
  > | null,
): Promise<
  DbFunctions["get_job_applications_by_department"]["Returns"] | null | boolean
> {
  if (options === null) {
    return callRpc(
      client,
      "get_job_applications_by_department",
      args,
      "get_job_applications_by_department",
      { fallbackValue: null },
    );
  }
  return callRpc(
    client,
    "get_job_applications_by_department",
    args,
    "get_job_applications_by_department",
    options,
  );
}

export async function getJobApplicationsByStatus(
  client: TypedSupabaseClient,
  args: DbFunctions["get_job_applications_by_status"]["Args"],
  options?: SupabaseRpcOptions<
    DbFunctions["get_job_applications_by_status"]["Returns"]
  > | null,
): Promise<
  DbFunctions["get_job_applications_by_status"]["Returns"] | null | boolean
> {
  if (options === null) {
    return callRpc(
      client,
      "get_job_applications_by_status",
      args,
      "get_job_applications_by_status",
      { fallbackValue: null },
    );
  }
  return callRpc(
    client,
    "get_job_applications_by_status",
    args,
    "get_job_applications_by_status",
    options,
  );
}

export async function getJobApplicationsOverTime(
  client: TypedSupabaseClient,
  args: DbFunctions["get_job_applications_over_time"]["Args"],
  options?: SupabaseRpcOptions<
    DbFunctions["get_job_applications_over_time"]["Returns"]
  > | null,
): Promise<
  DbFunctions["get_job_applications_over_time"]["Returns"] | null | boolean
> {
  if (options === null) {
    return callRpc(
      client,
      "get_job_applications_over_time",
      args,
      "get_job_applications_over_time",
      { fallbackValue: null },
    );
  }
  return callRpc(
    client,
    "get_job_applications_over_time",
    args,
    "get_job_applications_over_time",
    options,
  );
}

export async function updateJobApplicationStatus(
  client: TypedSupabaseClient,
  args: DbFunctions["update_job_application_status"]["Args"],
  options?: SupabaseRpcOptions<
    DbFunctions["update_job_application_status"]["Returns"]
  > | null,
): Promise<
  DbFunctions["update_job_application_status"]["Returns"] | null | boolean
> {
  if (options === null) {
    return callRpc(
      client,
      "update_job_application_status",
      args,
      "update_job_application_status",
      { fallbackValue: null },
    );
  }
  return callRpc(
    client,
    "update_job_application_status",
    args,
    "update_job_application_status",
    options,
  );
}
