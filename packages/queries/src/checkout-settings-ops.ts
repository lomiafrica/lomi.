import { handleSupabaseRpc, type SupabaseRpcOptions } from "@lomi./shared";
import { rpc } from "./rpc.js";
import type { DbFunctions, TypedSupabaseClient } from "./types.js";
import { emptyRpcArgs } from "./call-rpc.js";

export async function createCheckoutSession(
  client: TypedSupabaseClient,
  args?: DbFunctions["create_checkout_session"]["Args"],
): Promise<DbFunctions["create_checkout_session"]["Returns"] | null>;
export async function createCheckoutSession(
  client: TypedSupabaseClient,
  args: DbFunctions["create_checkout_session"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function createCheckoutSession(
  client: TypedSupabaseClient,
  args: DbFunctions["create_checkout_session"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["create_checkout_session"]["Returns"]
  > | null,
): Promise<DbFunctions["create_checkout_session"]["Returns"] | null>;
export async function createCheckoutSession(
  client: TypedSupabaseClient,
  args: DbFunctions["create_checkout_session"]["Args"] = emptyRpcArgs<"create_checkout_session">(),
  options?: SupabaseRpcOptions<
    DbFunctions["create_checkout_session"]["Returns"]
  > | null,
): Promise<DbFunctions["create_checkout_session"]["Returns"] | null | boolean> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "create_checkout_session", args),
      "create_checkout_session",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "create_checkout_session", args),
      "create_checkout_session",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "create_checkout_session", args),
    "create_checkout_session",
  );
}

export async function createCheckoutSessionFromPaymentLink(
  client: TypedSupabaseClient,
  args?: DbFunctions["create_checkout_session_from_payment_link"]["Args"],
): Promise<
  DbFunctions["create_checkout_session_from_payment_link"]["Returns"] | null
>;
export async function createCheckoutSessionFromPaymentLink(
  client: TypedSupabaseClient,
  args: DbFunctions["create_checkout_session_from_payment_link"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function createCheckoutSessionFromPaymentLink(
  client: TypedSupabaseClient,
  args: DbFunctions["create_checkout_session_from_payment_link"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["create_checkout_session_from_payment_link"]["Returns"]
  > | null,
): Promise<
  DbFunctions["create_checkout_session_from_payment_link"]["Returns"] | null
>;
export async function createCheckoutSessionFromPaymentLink(
  client: TypedSupabaseClient,
  args: DbFunctions["create_checkout_session_from_payment_link"]["Args"] = emptyRpcArgs<"create_checkout_session_from_payment_link">(),
  options?: SupabaseRpcOptions<
    DbFunctions["create_checkout_session_from_payment_link"]["Returns"]
  > | null,
): Promise<
  | DbFunctions["create_checkout_session_from_payment_link"]["Returns"]
  | null
  | boolean
> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "create_checkout_session_from_payment_link", args),
      "create_checkout_session_from_payment_link",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "create_checkout_session_from_payment_link", args),
      "create_checkout_session_from_payment_link",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "create_checkout_session_from_payment_link", args),
    "create_checkout_session_from_payment_link",
  );
}

export async function createInvoiceCheckoutSession(
  client: TypedSupabaseClient,
  args?: DbFunctions["create_invoice_checkout_session"]["Args"],
): Promise<DbFunctions["create_invoice_checkout_session"]["Returns"] | null>;
export async function createInvoiceCheckoutSession(
  client: TypedSupabaseClient,
  args: DbFunctions["create_invoice_checkout_session"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function createInvoiceCheckoutSession(
  client: TypedSupabaseClient,
  args: DbFunctions["create_invoice_checkout_session"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["create_invoice_checkout_session"]["Returns"]
  > | null,
): Promise<DbFunctions["create_invoice_checkout_session"]["Returns"] | null>;
export async function createInvoiceCheckoutSession(
  client: TypedSupabaseClient,
  args: DbFunctions["create_invoice_checkout_session"]["Args"] = emptyRpcArgs<"create_invoice_checkout_session">(),
  options?: SupabaseRpcOptions<
    DbFunctions["create_invoice_checkout_session"]["Returns"]
  > | null,
): Promise<
  DbFunctions["create_invoice_checkout_session"]["Returns"] | null | boolean
> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "create_invoice_checkout_session", args),
      "create_invoice_checkout_session",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "create_invoice_checkout_session", args),
      "create_invoice_checkout_session",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "create_invoice_checkout_session", args),
    "create_invoice_checkout_session",
  );
}

export async function getCheckoutSession(
  client: TypedSupabaseClient,
  args?: DbFunctions["get_checkout_session"]["Args"],
): Promise<DbFunctions["get_checkout_session"]["Returns"] | null>;
export async function getCheckoutSession(
  client: TypedSupabaseClient,
  args: DbFunctions["get_checkout_session"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function getCheckoutSession(
  client: TypedSupabaseClient,
  args: DbFunctions["get_checkout_session"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["get_checkout_session"]["Returns"]
  > | null,
): Promise<DbFunctions["get_checkout_session"]["Returns"] | null>;
export async function getCheckoutSession(
  client: TypedSupabaseClient,
  args: DbFunctions["get_checkout_session"]["Args"] = emptyRpcArgs<"get_checkout_session">(),
  options?: SupabaseRpcOptions<
    DbFunctions["get_checkout_session"]["Returns"]
  > | null,
): Promise<DbFunctions["get_checkout_session"]["Returns"] | null | boolean> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "get_checkout_session", args),
      "get_checkout_session",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "get_checkout_session", args),
      "get_checkout_session",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "get_checkout_session", args),
    "get_checkout_session",
  );
}
