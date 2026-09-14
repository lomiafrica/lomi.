import { handleSupabaseRpc, type SupabaseRpcOptions } from "@lomi./shared";
import { rpc } from "./rpc.js";
import type { DbFunctions, TypedSupabaseClient } from "./types.js";
import { emptyRpcArgs } from "./call-rpc.js";

export async function archivePrice(
  client: TypedSupabaseClient,
  args?: DbFunctions["archive_price"]["Args"],
): Promise<DbFunctions["archive_price"]["Returns"] | null>;
export async function archivePrice(
  client: TypedSupabaseClient,
  args: DbFunctions["archive_price"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function archivePrice(
  client: TypedSupabaseClient,
  args: DbFunctions["archive_price"]["Args"],
  options: SupabaseRpcOptions<DbFunctions["archive_price"]["Returns"]> | null,
): Promise<DbFunctions["archive_price"]["Returns"] | null>;
export async function archivePrice(
  client: TypedSupabaseClient,
  args: DbFunctions["archive_price"]["Args"] = emptyRpcArgs<"archive_price">(),
  options?: SupabaseRpcOptions<DbFunctions["archive_price"]["Returns"]> | null,
): Promise<DbFunctions["archive_price"]["Returns"] | null | boolean> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "archive_price", args),
      "archive_price",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "archive_price", args),
      "archive_price",
      options,
    );
  }
  return handleSupabaseRpc(rpc(client, "archive_price", args), "archive_price");
}

export async function createPrice(
  client: TypedSupabaseClient,
  args?: DbFunctions["create_price"]["Args"],
): Promise<DbFunctions["create_price"]["Returns"] | null>;
export async function createPrice(
  client: TypedSupabaseClient,
  args: DbFunctions["create_price"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function createPrice(
  client: TypedSupabaseClient,
  args: DbFunctions["create_price"]["Args"],
  options: SupabaseRpcOptions<DbFunctions["create_price"]["Returns"]> | null,
): Promise<DbFunctions["create_price"]["Returns"] | null>;
export async function createPrice(
  client: TypedSupabaseClient,
  args: DbFunctions["create_price"]["Args"] = emptyRpcArgs<"create_price">(),
  options?: SupabaseRpcOptions<DbFunctions["create_price"]["Returns"]> | null,
): Promise<DbFunctions["create_price"]["Returns"] | null | boolean> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "create_price", args),
      "create_price",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "create_price", args),
      "create_price",
      options,
    );
  }
  return handleSupabaseRpc(rpc(client, "create_price", args), "create_price");
}

export async function createProduct(
  client: TypedSupabaseClient,
  args?: DbFunctions["create_product"]["Args"],
): Promise<DbFunctions["create_product"]["Returns"] | null>;
export async function createProduct(
  client: TypedSupabaseClient,
  args: DbFunctions["create_product"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function createProduct(
  client: TypedSupabaseClient,
  args: DbFunctions["create_product"]["Args"],
  options: SupabaseRpcOptions<DbFunctions["create_product"]["Returns"]> | null,
): Promise<DbFunctions["create_product"]["Returns"] | null>;
export async function createProduct(
  client: TypedSupabaseClient,
  args: DbFunctions["create_product"]["Args"] = emptyRpcArgs<"create_product">(),
  options?: SupabaseRpcOptions<DbFunctions["create_product"]["Returns"]> | null,
): Promise<DbFunctions["create_product"]["Returns"] | null | boolean> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "create_product", args),
      "create_product",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "create_product", args),
      "create_product",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "create_product", args),
    "create_product",
  );
}

export async function deleteProduct(
  client: TypedSupabaseClient,
  args?: DbFunctions["delete_product"]["Args"],
): Promise<DbFunctions["delete_product"]["Returns"] | null>;
export async function deleteProduct(
  client: TypedSupabaseClient,
  args: DbFunctions["delete_product"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function deleteProduct(
  client: TypedSupabaseClient,
  args: DbFunctions["delete_product"]["Args"],
  options: SupabaseRpcOptions<DbFunctions["delete_product"]["Returns"]> | null,
): Promise<DbFunctions["delete_product"]["Returns"] | null>;
export async function deleteProduct(
  client: TypedSupabaseClient,
  args: DbFunctions["delete_product"]["Args"] = emptyRpcArgs<"delete_product">(),
  options?: SupabaseRpcOptions<DbFunctions["delete_product"]["Returns"]> | null,
): Promise<DbFunctions["delete_product"]["Returns"] | null | boolean> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "delete_product", args),
      "delete_product",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "delete_product", args),
      "delete_product",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "delete_product", args),
    "delete_product",
  );
}

export async function deleteProductFile(
  client: TypedSupabaseClient,
  args?: DbFunctions["delete_product_file"]["Args"],
): Promise<DbFunctions["delete_product_file"]["Returns"] | null>;
export async function deleteProductFile(
  client: TypedSupabaseClient,
  args: DbFunctions["delete_product_file"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function deleteProductFile(
  client: TypedSupabaseClient,
  args: DbFunctions["delete_product_file"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["delete_product_file"]["Returns"]
  > | null,
): Promise<DbFunctions["delete_product_file"]["Returns"] | null>;
export async function deleteProductFile(
  client: TypedSupabaseClient,
  args: DbFunctions["delete_product_file"]["Args"] = emptyRpcArgs<"delete_product_file">(),
  options?: SupabaseRpcOptions<
    DbFunctions["delete_product_file"]["Returns"]
  > | null,
): Promise<DbFunctions["delete_product_file"]["Returns"] | null | boolean> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "delete_product_file", args),
      "delete_product_file",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "delete_product_file", args),
      "delete_product_file",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "delete_product_file", args),
    "delete_product_file",
  );
}

export async function fetchOrganizationProducts(
  client: TypedSupabaseClient,
  args?: DbFunctions["fetch_organization_products"]["Args"],
): Promise<DbFunctions["fetch_organization_products"]["Returns"] | null>;
export async function fetchOrganizationProducts(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_organization_products"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function fetchOrganizationProducts(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_organization_products"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["fetch_organization_products"]["Returns"]
  > | null,
): Promise<DbFunctions["fetch_organization_products"]["Returns"] | null>;
export async function fetchOrganizationProducts(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_organization_products"]["Args"] = emptyRpcArgs<"fetch_organization_products">(),
  options?: SupabaseRpcOptions<
    DbFunctions["fetch_organization_products"]["Returns"]
  > | null,
): Promise<
  DbFunctions["fetch_organization_products"]["Returns"] | null | boolean
> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "fetch_organization_products", args),
      "fetch_organization_products",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "fetch_organization_products", args),
      "fetch_organization_products",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "fetch_organization_products", args),
    "fetch_organization_products",
  );
}

export async function fetchProductFees(
  client: TypedSupabaseClient,
  args?: DbFunctions["fetch_product_fees"]["Args"],
): Promise<DbFunctions["fetch_product_fees"]["Returns"] | null>;
export async function fetchProductFees(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_product_fees"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function fetchProductFees(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_product_fees"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["fetch_product_fees"]["Returns"]
  > | null,
): Promise<DbFunctions["fetch_product_fees"]["Returns"] | null>;
export async function fetchProductFees(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_product_fees"]["Args"] = emptyRpcArgs<"fetch_product_fees">(),
  options?: SupabaseRpcOptions<
    DbFunctions["fetch_product_fees"]["Returns"]
  > | null,
): Promise<DbFunctions["fetch_product_fees"]["Returns"] | null | boolean> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "fetch_product_fees", args),
      "fetch_product_fees",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "fetch_product_fees", args),
      "fetch_product_fees",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "fetch_product_fees", args),
    "fetch_product_fees",
  );
}

export async function fetchProductPrices(
  client: TypedSupabaseClient,
  args?: DbFunctions["fetch_product_prices"]["Args"],
): Promise<DbFunctions["fetch_product_prices"]["Returns"] | null>;
export async function fetchProductPrices(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_product_prices"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function fetchProductPrices(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_product_prices"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["fetch_product_prices"]["Returns"]
  > | null,
): Promise<DbFunctions["fetch_product_prices"]["Returns"] | null>;
export async function fetchProductPrices(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_product_prices"]["Args"] = emptyRpcArgs<"fetch_product_prices">(),
  options?: SupabaseRpcOptions<
    DbFunctions["fetch_product_prices"]["Returns"]
  > | null,
): Promise<DbFunctions["fetch_product_prices"]["Returns"] | null | boolean> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "fetch_product_prices", args),
      "fetch_product_prices",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "fetch_product_prices", args),
      "fetch_product_prices",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "fetch_product_prices", args),
    "fetch_product_prices",
  );
}

export async function fetchProductTransactions(
  client: TypedSupabaseClient,
  args?: DbFunctions["fetch_product_transactions"]["Args"],
): Promise<DbFunctions["fetch_product_transactions"]["Returns"] | null>;
export async function fetchProductTransactions(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_product_transactions"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function fetchProductTransactions(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_product_transactions"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["fetch_product_transactions"]["Returns"]
  > | null,
): Promise<DbFunctions["fetch_product_transactions"]["Returns"] | null>;
export async function fetchProductTransactions(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_product_transactions"]["Args"] = emptyRpcArgs<"fetch_product_transactions">(),
  options?: SupabaseRpcOptions<
    DbFunctions["fetch_product_transactions"]["Returns"]
  > | null,
): Promise<
  DbFunctions["fetch_product_transactions"]["Returns"] | null | boolean
> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "fetch_product_transactions", args),
      "fetch_product_transactions",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "fetch_product_transactions", args),
      "fetch_product_transactions",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "fetch_product_transactions", args),
    "fetch_product_transactions",
  );
}

export async function fetchTopPerformingProducts(
  client: TypedSupabaseClient,
  args?: DbFunctions["fetch_top_performing_products"]["Args"],
): Promise<DbFunctions["fetch_top_performing_products"]["Returns"] | null>;
export async function fetchTopPerformingProducts(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_top_performing_products"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function fetchTopPerformingProducts(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_top_performing_products"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["fetch_top_performing_products"]["Returns"]
  > | null,
): Promise<DbFunctions["fetch_top_performing_products"]["Returns"] | null>;
export async function fetchTopPerformingProducts(
  client: TypedSupabaseClient,
  args: DbFunctions["fetch_top_performing_products"]["Args"] = emptyRpcArgs<"fetch_top_performing_products">(),
  options?: SupabaseRpcOptions<
    DbFunctions["fetch_top_performing_products"]["Returns"]
  > | null,
): Promise<
  DbFunctions["fetch_top_performing_products"]["Returns"] | null | boolean
> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "fetch_top_performing_products", args),
      "fetch_top_performing_products",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "fetch_top_performing_products", args),
      "fetch_top_performing_products",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "fetch_top_performing_products", args),
    "fetch_top_performing_products",
  );
}

export async function listProductFiles(
  client: TypedSupabaseClient,
  args?: DbFunctions["list_product_files"]["Args"],
): Promise<DbFunctions["list_product_files"]["Returns"] | null>;
export async function listProductFiles(
  client: TypedSupabaseClient,
  args: DbFunctions["list_product_files"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function listProductFiles(
  client: TypedSupabaseClient,
  args: DbFunctions["list_product_files"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["list_product_files"]["Returns"]
  > | null,
): Promise<DbFunctions["list_product_files"]["Returns"] | null>;
export async function listProductFiles(
  client: TypedSupabaseClient,
  args: DbFunctions["list_product_files"]["Args"] = emptyRpcArgs<"list_product_files">(),
  options?: SupabaseRpcOptions<
    DbFunctions["list_product_files"]["Returns"]
  > | null,
): Promise<DbFunctions["list_product_files"]["Returns"] | null | boolean> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "list_product_files", args),
      "list_product_files",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "list_product_files", args),
      "list_product_files",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "list_product_files", args),
    "list_product_files",
  );
}

export async function moveProductToLive(
  client: TypedSupabaseClient,
  args?: DbFunctions["move_product_to_live"]["Args"],
): Promise<DbFunctions["move_product_to_live"]["Returns"] | null>;
export async function moveProductToLive(
  client: TypedSupabaseClient,
  args: DbFunctions["move_product_to_live"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function moveProductToLive(
  client: TypedSupabaseClient,
  args: DbFunctions["move_product_to_live"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["move_product_to_live"]["Returns"]
  > | null,
): Promise<DbFunctions["move_product_to_live"]["Returns"] | null>;
export async function moveProductToLive(
  client: TypedSupabaseClient,
  args: DbFunctions["move_product_to_live"]["Args"] = emptyRpcArgs<"move_product_to_live">(),
  options?: SupabaseRpcOptions<
    DbFunctions["move_product_to_live"]["Returns"]
  > | null,
): Promise<DbFunctions["move_product_to_live"]["Returns"] | null | boolean> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "move_product_to_live", args),
      "move_product_to_live",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "move_product_to_live", args),
      "move_product_to_live",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "move_product_to_live", args),
    "move_product_to_live",
  );
}

export async function registerProductFile(
  client: TypedSupabaseClient,
  args?: DbFunctions["register_product_file"]["Args"],
): Promise<DbFunctions["register_product_file"]["Returns"] | null>;
export async function registerProductFile(
  client: TypedSupabaseClient,
  args: DbFunctions["register_product_file"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function registerProductFile(
  client: TypedSupabaseClient,
  args: DbFunctions["register_product_file"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["register_product_file"]["Returns"]
  > | null,
): Promise<DbFunctions["register_product_file"]["Returns"] | null>;
export async function registerProductFile(
  client: TypedSupabaseClient,
  args: DbFunctions["register_product_file"]["Args"] = emptyRpcArgs<"register_product_file">(),
  options?: SupabaseRpcOptions<
    DbFunctions["register_product_file"]["Returns"]
  > | null,
): Promise<DbFunctions["register_product_file"]["Returns"] | null | boolean> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "register_product_file", args),
      "register_product_file",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "register_product_file", args),
      "register_product_file",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "register_product_file", args),
    "register_product_file",
  );
}

export async function reorderProductFiles(
  client: TypedSupabaseClient,
  args?: DbFunctions["reorder_product_files"]["Args"],
): Promise<DbFunctions["reorder_product_files"]["Returns"] | null>;
export async function reorderProductFiles(
  client: TypedSupabaseClient,
  args: DbFunctions["reorder_product_files"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function reorderProductFiles(
  client: TypedSupabaseClient,
  args: DbFunctions["reorder_product_files"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["reorder_product_files"]["Returns"]
  > | null,
): Promise<DbFunctions["reorder_product_files"]["Returns"] | null>;
export async function reorderProductFiles(
  client: TypedSupabaseClient,
  args: DbFunctions["reorder_product_files"]["Args"] = emptyRpcArgs<"reorder_product_files">(),
  options?: SupabaseRpcOptions<
    DbFunctions["reorder_product_files"]["Returns"]
  > | null,
): Promise<DbFunctions["reorder_product_files"]["Returns"] | null | boolean> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "reorder_product_files", args),
      "reorder_product_files",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "reorder_product_files", args),
      "reorder_product_files",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "reorder_product_files", args),
    "reorder_product_files",
  );
}

export async function setDefaultPrice(
  client: TypedSupabaseClient,
  args?: DbFunctions["set_default_price"]["Args"],
): Promise<DbFunctions["set_default_price"]["Returns"] | null>;
export async function setDefaultPrice(
  client: TypedSupabaseClient,
  args: DbFunctions["set_default_price"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function setDefaultPrice(
  client: TypedSupabaseClient,
  args: DbFunctions["set_default_price"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["set_default_price"]["Returns"]
  > | null,
): Promise<DbFunctions["set_default_price"]["Returns"] | null>;
export async function setDefaultPrice(
  client: TypedSupabaseClient,
  args: DbFunctions["set_default_price"]["Args"] = emptyRpcArgs<"set_default_price">(),
  options?: SupabaseRpcOptions<
    DbFunctions["set_default_price"]["Returns"]
  > | null,
): Promise<DbFunctions["set_default_price"]["Returns"] | null | boolean> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "set_default_price", args),
      "set_default_price",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "set_default_price", args),
      "set_default_price",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "set_default_price", args),
    "set_default_price",
  );
}

export async function syncProductWhatsappCatalog(
  client: TypedSupabaseClient,
  args?: DbFunctions["sync_product_whatsapp_catalog"]["Args"],
): Promise<DbFunctions["sync_product_whatsapp_catalog"]["Returns"] | null>;
export async function syncProductWhatsappCatalog(
  client: TypedSupabaseClient,
  args: DbFunctions["sync_product_whatsapp_catalog"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function syncProductWhatsappCatalog(
  client: TypedSupabaseClient,
  args: DbFunctions["sync_product_whatsapp_catalog"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["sync_product_whatsapp_catalog"]["Returns"]
  > | null,
): Promise<DbFunctions["sync_product_whatsapp_catalog"]["Returns"] | null>;
export async function syncProductWhatsappCatalog(
  client: TypedSupabaseClient,
  args: DbFunctions["sync_product_whatsapp_catalog"]["Args"] = emptyRpcArgs<"sync_product_whatsapp_catalog">(),
  options?: SupabaseRpcOptions<
    DbFunctions["sync_product_whatsapp_catalog"]["Returns"]
  > | null,
): Promise<
  DbFunctions["sync_product_whatsapp_catalog"]["Returns"] | null | boolean
> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "sync_product_whatsapp_catalog", args),
      "sync_product_whatsapp_catalog",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "sync_product_whatsapp_catalog", args),
      "sync_product_whatsapp_catalog",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "sync_product_whatsapp_catalog", args),
    "sync_product_whatsapp_catalog",
  );
}

export async function updatePrice(
  client: TypedSupabaseClient,
  args?: DbFunctions["update_price"]["Args"],
): Promise<DbFunctions["update_price"]["Returns"] | null>;
export async function updatePrice(
  client: TypedSupabaseClient,
  args: DbFunctions["update_price"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function updatePrice(
  client: TypedSupabaseClient,
  args: DbFunctions["update_price"]["Args"],
  options: SupabaseRpcOptions<DbFunctions["update_price"]["Returns"]> | null,
): Promise<DbFunctions["update_price"]["Returns"] | null>;
export async function updatePrice(
  client: TypedSupabaseClient,
  args: DbFunctions["update_price"]["Args"] = emptyRpcArgs<"update_price">(),
  options?: SupabaseRpcOptions<DbFunctions["update_price"]["Returns"]> | null,
): Promise<DbFunctions["update_price"]["Returns"] | null | boolean> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "update_price", args),
      "update_price",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "update_price", args),
      "update_price",
      options,
    );
  }
  return handleSupabaseRpc(rpc(client, "update_price", args), "update_price");
}

export async function updateProduct(
  client: TypedSupabaseClient,
  args?: DbFunctions["update_product"]["Args"],
): Promise<DbFunctions["update_product"]["Returns"] | null>;
export async function updateProduct(
  client: TypedSupabaseClient,
  args: DbFunctions["update_product"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function updateProduct(
  client: TypedSupabaseClient,
  args: DbFunctions["update_product"]["Args"],
  options: SupabaseRpcOptions<DbFunctions["update_product"]["Returns"]> | null,
): Promise<DbFunctions["update_product"]["Returns"] | null>;
export async function updateProduct(
  client: TypedSupabaseClient,
  args: DbFunctions["update_product"]["Args"] = emptyRpcArgs<"update_product">(),
  options?: SupabaseRpcOptions<DbFunctions["update_product"]["Returns"]> | null,
): Promise<DbFunctions["update_product"]["Returns"] | null | boolean> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "update_product", args),
      "update_product",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "update_product", args),
      "update_product",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "update_product", args),
    "update_product",
  );
}
