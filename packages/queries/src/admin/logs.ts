import { callRpc } from "../call-rpc.js";
import type { DbFunctions, TypedSupabaseClient } from "../types.js";
import type { SupabaseRpcOptions } from "@lomi./shared";

/** Admin logs RPCs — inject platform-admin TypedSupabaseClient. */
export { rpc } from "../rpc.js";

export async function getAdminEventStats(
  client: TypedSupabaseClient,
  args: DbFunctions["get_admin_event_stats"]["Args"],
  options?: SupabaseRpcOptions<
    DbFunctions["get_admin_event_stats"]["Returns"]
  > | null,
): Promise<DbFunctions["get_admin_event_stats"]["Returns"] | null | boolean> {
  if (options === null) {
    return callRpc(
      client,
      "get_admin_event_stats",
      args,
      "get_admin_event_stats",
      { fallbackValue: null },
    );
  }
  return callRpc(
    client,
    "get_admin_event_stats",
    args,
    "get_admin_event_stats",
    options,
  );
}

export async function getAdminWideCartFunnel(
  client: TypedSupabaseClient,
  args: DbFunctions["get_admin_wide_cart_funnel"]["Args"],
  options?: SupabaseRpcOptions<
    DbFunctions["get_admin_wide_cart_funnel"]["Returns"]
  > | null,
): Promise<
  DbFunctions["get_admin_wide_cart_funnel"]["Returns"] | null | boolean
> {
  if (options === null) {
    return callRpc(
      client,
      "get_admin_wide_cart_funnel",
      args,
      "get_admin_wide_cart_funnel",
      { fallbackValue: null },
    );
  }
  return callRpc(
    client,
    "get_admin_wide_cart_funnel",
    args,
    "get_admin_wide_cart_funnel",
    options,
  );
}

export async function getAdminWideCheckoutFunnel(
  client: TypedSupabaseClient,
  args: DbFunctions["get_admin_wide_checkout_funnel"]["Args"],
  options?: SupabaseRpcOptions<
    DbFunctions["get_admin_wide_checkout_funnel"]["Returns"]
  > | null,
): Promise<
  DbFunctions["get_admin_wide_checkout_funnel"]["Returns"] | null | boolean
> {
  if (options === null) {
    return callRpc(
      client,
      "get_admin_wide_checkout_funnel",
      args,
      "get_admin_wide_checkout_funnel",
      { fallbackValue: null },
    );
  }
  return callRpc(
    client,
    "get_admin_wide_checkout_funnel",
    args,
    "get_admin_wide_checkout_funnel",
    options,
  );
}

export async function getAdminWideCheckoutSurfaces(
  client: TypedSupabaseClient,
  args: DbFunctions["get_admin_wide_checkout_surfaces"]["Args"],
  options?: SupabaseRpcOptions<
    DbFunctions["get_admin_wide_checkout_surfaces"]["Returns"]
  > | null,
): Promise<
  DbFunctions["get_admin_wide_checkout_surfaces"]["Returns"] | null | boolean
> {
  if (options === null) {
    return callRpc(
      client,
      "get_admin_wide_checkout_surfaces",
      args,
      "get_admin_wide_checkout_surfaces",
      { fallbackValue: null },
    );
  }
  return callRpc(
    client,
    "get_admin_wide_checkout_surfaces",
    args,
    "get_admin_wide_checkout_surfaces",
    options,
  );
}

export async function getAdminWideErrorBreakdown(
  client: TypedSupabaseClient,
  args: DbFunctions["get_admin_wide_error_breakdown"]["Args"],
  options?: SupabaseRpcOptions<
    DbFunctions["get_admin_wide_error_breakdown"]["Returns"]
  > | null,
): Promise<
  DbFunctions["get_admin_wide_error_breakdown"]["Returns"] | null | boolean
> {
  if (options === null) {
    return callRpc(
      client,
      "get_admin_wide_error_breakdown",
      args,
      "get_admin_wide_error_breakdown",
      { fallbackValue: null },
    );
  }
  return callRpc(
    client,
    "get_admin_wide_error_breakdown",
    args,
    "get_admin_wide_error_breakdown",
    options,
  );
}

export async function getAdminWideEventCatalog(
  client: TypedSupabaseClient,
  args: DbFunctions["get_admin_wide_event_catalog"]["Args"],
  options?: SupabaseRpcOptions<
    DbFunctions["get_admin_wide_event_catalog"]["Returns"]
  > | null,
): Promise<
  DbFunctions["get_admin_wide_event_catalog"]["Returns"] | null | boolean
> {
  if (options === null) {
    return callRpc(
      client,
      "get_admin_wide_event_catalog",
      args,
      "get_admin_wide_event_catalog",
      { fallbackValue: null },
    );
  }
  return callRpc(
    client,
    "get_admin_wide_event_catalog",
    args,
    "get_admin_wide_event_catalog",
    options,
  );
}

export async function getAdminWideEventSources(
  client: TypedSupabaseClient,
  args: DbFunctions["get_admin_wide_event_sources"]["Args"],
  options?: SupabaseRpcOptions<
    DbFunctions["get_admin_wide_event_sources"]["Returns"]
  > | null,
): Promise<
  DbFunctions["get_admin_wide_event_sources"]["Returns"] | null | boolean
> {
  if (options === null) {
    return callRpc(
      client,
      "get_admin_wide_event_sources",
      args,
      "get_admin_wide_event_sources",
      { fallbackValue: null },
    );
  }
  return callRpc(
    client,
    "get_admin_wide_event_sources",
    args,
    "get_admin_wide_event_sources",
    options,
  );
}

export async function getAdminWideEventVolume(
  client: TypedSupabaseClient,
  args: DbFunctions["get_admin_wide_event_volume"]["Args"],
  options?: SupabaseRpcOptions<
    DbFunctions["get_admin_wide_event_volume"]["Returns"]
  > | null,
): Promise<
  DbFunctions["get_admin_wide_event_volume"]["Returns"] | null | boolean
> {
  if (options === null) {
    return callRpc(
      client,
      "get_admin_wide_event_volume",
      args,
      "get_admin_wide_event_volume",
      { fallbackValue: null },
    );
  }
  return callRpc(
    client,
    "get_admin_wide_event_volume",
    args,
    "get_admin_wide_event_volume",
    options,
  );
}

export async function getAdminWideEvents(
  client: TypedSupabaseClient,
  args: DbFunctions["get_admin_wide_events"]["Args"],
  options?: SupabaseRpcOptions<
    DbFunctions["get_admin_wide_events"]["Returns"]
  > | null,
): Promise<DbFunctions["get_admin_wide_events"]["Returns"] | null | boolean> {
  if (options === null) {
    return callRpc(
      client,
      "get_admin_wide_events",
      args,
      "get_admin_wide_events",
      { fallbackValue: null },
    );
  }
  return callRpc(
    client,
    "get_admin_wide_events",
    args,
    "get_admin_wide_events",
    options,
  );
}

export async function getAdminWideFailureReasons(
  client: TypedSupabaseClient,
  args: DbFunctions["get_admin_wide_failure_reasons"]["Args"],
  options?: SupabaseRpcOptions<
    DbFunctions["get_admin_wide_failure_reasons"]["Returns"]
  > | null,
): Promise<
  DbFunctions["get_admin_wide_failure_reasons"]["Returns"] | null | boolean
> {
  if (options === null) {
    return callRpc(
      client,
      "get_admin_wide_failure_reasons",
      args,
      "get_admin_wide_failure_reasons",
      { fallbackValue: null },
    );
  }
  return callRpc(
    client,
    "get_admin_wide_failure_reasons",
    args,
    "get_admin_wide_failure_reasons",
    options,
  );
}

export async function getAdminWideMerchantActivation(
  client: TypedSupabaseClient,
  args: DbFunctions["get_admin_wide_merchant_activation"]["Args"],
  options?: SupabaseRpcOptions<
    DbFunctions["get_admin_wide_merchant_activation"]["Returns"]
  > | null,
): Promise<
  DbFunctions["get_admin_wide_merchant_activation"]["Returns"] | null | boolean
> {
  if (options === null) {
    return callRpc(
      client,
      "get_admin_wide_merchant_activation",
      args,
      "get_admin_wide_merchant_activation",
      { fallbackValue: null },
    );
  }
  return callRpc(
    client,
    "get_admin_wide_merchant_activation",
    args,
    "get_admin_wide_merchant_activation",
    options,
  );
}

export async function getAdminWideOnboardingFunnel(
  client: TypedSupabaseClient,
  args: DbFunctions["get_admin_wide_onboarding_funnel"]["Args"],
  options?: SupabaseRpcOptions<
    DbFunctions["get_admin_wide_onboarding_funnel"]["Returns"]
  > | null,
): Promise<
  DbFunctions["get_admin_wide_onboarding_funnel"]["Returns"] | null | boolean
> {
  if (options === null) {
    return callRpc(
      client,
      "get_admin_wide_onboarding_funnel",
      args,
      "get_admin_wide_onboarding_funnel",
      { fallbackValue: null },
    );
  }
  return callRpc(
    client,
    "get_admin_wide_onboarding_funnel",
    args,
    "get_admin_wide_onboarding_funnel",
    options,
  );
}

export async function getAdminWidePaymentProviders(
  client: TypedSupabaseClient,
  args: DbFunctions["get_admin_wide_payment_providers"]["Args"],
  options?: SupabaseRpcOptions<
    DbFunctions["get_admin_wide_payment_providers"]["Returns"]
  > | null,
): Promise<
  DbFunctions["get_admin_wide_payment_providers"]["Returns"] | null | boolean
> {
  if (options === null) {
    return callRpc(
      client,
      "get_admin_wide_payment_providers",
      args,
      "get_admin_wide_payment_providers",
      { fallbackValue: null },
    );
  }
  return callRpc(
    client,
    "get_admin_wide_payment_providers",
    args,
    "get_admin_wide_payment_providers",
    options,
  );
}
