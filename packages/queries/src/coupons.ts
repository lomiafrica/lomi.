import { handleSupabaseRpc, type SupabaseRpcOptions } from "@lomi./shared";
import { rpc } from "./rpc.js";
import type { DbFunctions, TypedSupabaseClient } from "./types.js";
import { emptyRpcArgs } from "./call-rpc.js";

export async function createDiscountCoupon(
  client: TypedSupabaseClient,
  args?: DbFunctions["create_discount_coupon"]["Args"],
): Promise<DbFunctions["create_discount_coupon"]["Returns"] | null>;
export async function createDiscountCoupon(
  client: TypedSupabaseClient,
  args: DbFunctions["create_discount_coupon"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function createDiscountCoupon(
  client: TypedSupabaseClient,
  args: DbFunctions["create_discount_coupon"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["create_discount_coupon"]["Returns"]
  > | null,
): Promise<DbFunctions["create_discount_coupon"]["Returns"] | null>;
export async function createDiscountCoupon(
  client: TypedSupabaseClient,
  args: DbFunctions["create_discount_coupon"]["Args"] = emptyRpcArgs<"create_discount_coupon">(),
  options?: SupabaseRpcOptions<
    DbFunctions["create_discount_coupon"]["Returns"]
  > | null,
): Promise<DbFunctions["create_discount_coupon"]["Returns"] | null | boolean> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "create_discount_coupon", args),
      "create_discount_coupon",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "create_discount_coupon", args),
      "create_discount_coupon",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "create_discount_coupon", args),
    "create_discount_coupon",
  );
}

export async function deleteDiscountCoupon(
  client: TypedSupabaseClient,
  args?: DbFunctions["delete_discount_coupon"]["Args"],
): Promise<DbFunctions["delete_discount_coupon"]["Returns"] | null>;
export async function deleteDiscountCoupon(
  client: TypedSupabaseClient,
  args: DbFunctions["delete_discount_coupon"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function deleteDiscountCoupon(
  client: TypedSupabaseClient,
  args: DbFunctions["delete_discount_coupon"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["delete_discount_coupon"]["Returns"]
  > | null,
): Promise<DbFunctions["delete_discount_coupon"]["Returns"] | null>;
export async function deleteDiscountCoupon(
  client: TypedSupabaseClient,
  args: DbFunctions["delete_discount_coupon"]["Args"] = emptyRpcArgs<"delete_discount_coupon">(),
  options?: SupabaseRpcOptions<
    DbFunctions["delete_discount_coupon"]["Returns"]
  > | null,
): Promise<DbFunctions["delete_discount_coupon"]["Returns"] | null | boolean> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "delete_discount_coupon", args),
      "delete_discount_coupon",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "delete_discount_coupon", args),
      "delete_discount_coupon",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "delete_discount_coupon", args),
    "delete_discount_coupon",
  );
}

export async function getOrganizationCoupons(
  client: TypedSupabaseClient,
  args?: DbFunctions["get_organization_coupons"]["Args"],
): Promise<DbFunctions["get_organization_coupons"]["Returns"] | null>;
export async function getOrganizationCoupons(
  client: TypedSupabaseClient,
  args: DbFunctions["get_organization_coupons"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function getOrganizationCoupons(
  client: TypedSupabaseClient,
  args: DbFunctions["get_organization_coupons"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["get_organization_coupons"]["Returns"]
  > | null,
): Promise<DbFunctions["get_organization_coupons"]["Returns"] | null>;
export async function getOrganizationCoupons(
  client: TypedSupabaseClient,
  args: DbFunctions["get_organization_coupons"]["Args"] = emptyRpcArgs<"get_organization_coupons">(),
  options?: SupabaseRpcOptions<
    DbFunctions["get_organization_coupons"]["Returns"]
  > | null,
): Promise<
  DbFunctions["get_organization_coupons"]["Returns"] | null | boolean
> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "get_organization_coupons", args),
      "get_organization_coupons",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "get_organization_coupons", args),
      "get_organization_coupons",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "get_organization_coupons", args),
    "get_organization_coupons",
  );
}
