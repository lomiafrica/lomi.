import { handleSupabaseRpc } from "@lomi./shared";
import type { Database } from "@lomi./shared/database";
import { rpc } from "./rpc.js";
import type { TypedSupabaseClient } from "./types.js";

export type PayoutMethodByOrgRow =
  Database["public"]["Functions"]["fetch_payout_methods_by_org"]["Returns"][number] & {
    auto_withdrawal_cadence?: string | null;
  };

/**
 * Raw `fetch_payout_methods_by_org` rows. Apps map into dashboard PayoutMethod shapes.
 */
export async function fetchPayoutMethodsByOrg(
  client: TypedSupabaseClient,
  organizationId: string,
): Promise<PayoutMethodByOrgRow[]> {
  const data = await handleSupabaseRpc(
    rpc(client, "fetch_payout_methods_by_org", {
      p_organization_id: organizationId,
    }),
    "fetch_payout_methods_by_org",
  );
  return data ?? [];
}

export * from "./payout-methods-ops.js";
