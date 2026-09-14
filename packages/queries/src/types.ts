import type { Database } from "@lomi./shared/database";
import type { JsonValue } from "@lomi./shared";

/** Untyped rpc handle before `rpc()` re-applies the Database function map. */
export type UntypedRpcResult = PromiseLike<{
  data: JsonValue | null;
  error: Error | null;
}>;

/**
 * Injected Supabase client. Intentionally structural/loose so apps on
 * different `@supabase/supabase-js` versions typecheck. Domain helpers call
 * `.rpc`; `rpc()` re-applies the shared Database function map.
 */
export type TypedSupabaseClient = {
  rpc: (...args: never[]) => UntypedRpcResult;
};

export type DbFunctions = Database["public"]["Functions"];
export type ProviderCode = Database["public"]["Enums"]["provider_code"];
export type CurrencyCode = Database["public"]["Enums"]["currency_code"];
export type OrganizationVerificationStatus =
  Database["public"]["Enums"]["organization_verification_status"];
export type OnboardingStatus = Database["public"]["Enums"]["onboarding_status"];
