import { handleSupabaseRpc } from "@lomi./shared";
import type { Database } from "@lomi./shared/database";
import { rpc } from "./rpc.js";
import type { TypedSupabaseClient } from "./types.js";

export type ApiKey = {
  name: string;
  api_key: string;
  key_type: string;
  is_active: boolean;
  created_at: string;
  environment?: string;
};

export type CliToken = {
  name: string;
  api_key: string;
  is_active: boolean;
  created_at: string;
};

type RawApiKeyRow =
  Database["public"]["Functions"]["fetch_api_keys"]["Returns"][number];

function mapApiKeyRow(key: RawApiKeyRow): ApiKey {
  return {
    ...key,
    environment: key.api_key.includes("_test_") ? "test" : "live",
  };
}

function mapCliTokenRow(key: RawApiKeyRow): CliToken {
  return {
    name: key.name,
    api_key: key.api_key,
    is_active: key.is_active,
    created_at: key.created_at,
  };
}

async function fetchApiKeyRows(
  client: TypedSupabaseClient,
  organizationId: string,
): Promise<RawApiKeyRow[]> {
  const data = await handleSupabaseRpc(
    rpc(client, "fetch_api_keys", {
      p_organization_id: organizationId,
    }),
    "fetch_api_keys",
  );

  if (data === null) {
    throw new Error("Failed to fetch API keys");
  }

  return data ?? [];
}

export async function fetchOrganizationApiKeys(
  client: TypedSupabaseClient,
  organizationId: string,
): Promise<ApiKey[]> {
  const rows = await fetchApiKeyRows(client, organizationId);
  return rows
    .filter(
      (key) =>
        !key.name.startsWith("Token [") &&
        !key.name.startsWith("MCP connect ["),
    )
    .map(mapApiKeyRow);
}

export async function fetchOrganizationCliTokens(
  client: TypedSupabaseClient,
  organizationId: string,
): Promise<CliToken[]> {
  const rows = await fetchApiKeyRows(client, organizationId);
  return rows
    .filter((key) => key.name.startsWith("Token ["))
    .map(mapCliTokenRow);
}

export async function fetchOrganizationMcpTokens(
  client: TypedSupabaseClient,
  organizationId: string,
): Promise<CliToken[]> {
  const rows = await fetchApiKeyRows(client, organizationId);
  return rows
    .filter((key) => key.name.startsWith("MCP connect ["))
    .map(mapCliTokenRow);
}

export * from "./api-keys-ops.js";
