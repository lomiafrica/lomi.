import { handleSupabaseRpc, type SupabaseRpcOptions } from "@lomi./shared";
import { rpc } from "./rpc.js";
import type { DbFunctions, TypedSupabaseClient } from "./types.js";
import { emptyRpcArgs } from "./call-rpc.js";

export async function cancelCustomerInvoice(
  client: TypedSupabaseClient,
  args?: DbFunctions["cancel_customer_invoice"]["Args"],
): Promise<DbFunctions["cancel_customer_invoice"]["Returns"] | null>;
export async function cancelCustomerInvoice(
  client: TypedSupabaseClient,
  args: DbFunctions["cancel_customer_invoice"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function cancelCustomerInvoice(
  client: TypedSupabaseClient,
  args: DbFunctions["cancel_customer_invoice"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["cancel_customer_invoice"]["Returns"]
  > | null,
): Promise<DbFunctions["cancel_customer_invoice"]["Returns"] | null>;
export async function cancelCustomerInvoice(
  client: TypedSupabaseClient,
  args: DbFunctions["cancel_customer_invoice"]["Args"] = emptyRpcArgs<"cancel_customer_invoice">(),
  options?: SupabaseRpcOptions<
    DbFunctions["cancel_customer_invoice"]["Returns"]
  > | null,
): Promise<DbFunctions["cancel_customer_invoice"]["Returns"] | null | boolean> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "cancel_customer_invoice", args),
      "cancel_customer_invoice",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "cancel_customer_invoice", args),
      "cancel_customer_invoice",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "cancel_customer_invoice", args),
    "cancel_customer_invoice",
  );
}

export async function createInvoiceReceivable(
  client: TypedSupabaseClient,
  args?: DbFunctions["create_invoice_receivable"]["Args"],
): Promise<DbFunctions["create_invoice_receivable"]["Returns"] | null>;
export async function createInvoiceReceivable(
  client: TypedSupabaseClient,
  args: DbFunctions["create_invoice_receivable"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function createInvoiceReceivable(
  client: TypedSupabaseClient,
  args: DbFunctions["create_invoice_receivable"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["create_invoice_receivable"]["Returns"]
  > | null,
): Promise<DbFunctions["create_invoice_receivable"]["Returns"] | null>;
export async function createInvoiceReceivable(
  client: TypedSupabaseClient,
  args: DbFunctions["create_invoice_receivable"]["Args"] = emptyRpcArgs<"create_invoice_receivable">(),
  options?: SupabaseRpcOptions<
    DbFunctions["create_invoice_receivable"]["Returns"]
  > | null,
): Promise<
  DbFunctions["create_invoice_receivable"]["Returns"] | null | boolean
> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "create_invoice_receivable", args),
      "create_invoice_receivable",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "create_invoice_receivable", args),
      "create_invoice_receivable",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "create_invoice_receivable", args),
    "create_invoice_receivable",
  );
}

export async function createInvoiceTemplate(
  client: TypedSupabaseClient,
  args?: DbFunctions["create_invoice_template"]["Args"],
): Promise<DbFunctions["create_invoice_template"]["Returns"] | null>;
export async function createInvoiceTemplate(
  client: TypedSupabaseClient,
  args: DbFunctions["create_invoice_template"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function createInvoiceTemplate(
  client: TypedSupabaseClient,
  args: DbFunctions["create_invoice_template"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["create_invoice_template"]["Returns"]
  > | null,
): Promise<DbFunctions["create_invoice_template"]["Returns"] | null>;
export async function createInvoiceTemplate(
  client: TypedSupabaseClient,
  args: DbFunctions["create_invoice_template"]["Args"] = emptyRpcArgs<"create_invoice_template">(),
  options?: SupabaseRpcOptions<
    DbFunctions["create_invoice_template"]["Returns"]
  > | null,
): Promise<DbFunctions["create_invoice_template"]["Returns"] | null | boolean> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "create_invoice_template", args),
      "create_invoice_template",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "create_invoice_template", args),
      "create_invoice_template",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "create_invoice_template", args),
    "create_invoice_template",
  );
}

export async function createRecurringInvoiceSeries(
  client: TypedSupabaseClient,
  args?: DbFunctions["create_recurring_invoice_series"]["Args"],
): Promise<DbFunctions["create_recurring_invoice_series"]["Returns"] | null>;
export async function createRecurringInvoiceSeries(
  client: TypedSupabaseClient,
  args: DbFunctions["create_recurring_invoice_series"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function createRecurringInvoiceSeries(
  client: TypedSupabaseClient,
  args: DbFunctions["create_recurring_invoice_series"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["create_recurring_invoice_series"]["Returns"]
  > | null,
): Promise<DbFunctions["create_recurring_invoice_series"]["Returns"] | null>;
export async function createRecurringInvoiceSeries(
  client: TypedSupabaseClient,
  args: DbFunctions["create_recurring_invoice_series"]["Args"] = emptyRpcArgs<"create_recurring_invoice_series">(),
  options?: SupabaseRpcOptions<
    DbFunctions["create_recurring_invoice_series"]["Returns"]
  > | null,
): Promise<
  DbFunctions["create_recurring_invoice_series"]["Returns"] | null | boolean
> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "create_recurring_invoice_series", args),
      "create_recurring_invoice_series",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "create_recurring_invoice_series", args),
      "create_recurring_invoice_series",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "create_recurring_invoice_series", args),
    "create_recurring_invoice_series",
  );
}

export async function duplicateCustomerInvoice(
  client: TypedSupabaseClient,
  args?: DbFunctions["duplicate_customer_invoice"]["Args"],
): Promise<DbFunctions["duplicate_customer_invoice"]["Returns"] | null>;
export async function duplicateCustomerInvoice(
  client: TypedSupabaseClient,
  args: DbFunctions["duplicate_customer_invoice"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function duplicateCustomerInvoice(
  client: TypedSupabaseClient,
  args: DbFunctions["duplicate_customer_invoice"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["duplicate_customer_invoice"]["Returns"]
  > | null,
): Promise<DbFunctions["duplicate_customer_invoice"]["Returns"] | null>;
export async function duplicateCustomerInvoice(
  client: TypedSupabaseClient,
  args: DbFunctions["duplicate_customer_invoice"]["Args"] = emptyRpcArgs<"duplicate_customer_invoice">(),
  options?: SupabaseRpcOptions<
    DbFunctions["duplicate_customer_invoice"]["Returns"]
  > | null,
): Promise<
  DbFunctions["duplicate_customer_invoice"]["Returns"] | null | boolean
> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "duplicate_customer_invoice", args),
      "duplicate_customer_invoice",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "duplicate_customer_invoice", args),
      "duplicate_customer_invoice",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "duplicate_customer_invoice", args),
    "duplicate_customer_invoice",
  );
}

export async function getCustomerInvoiceById(
  client: TypedSupabaseClient,
  args?: DbFunctions["get_customer_invoice_by_id"]["Args"],
): Promise<DbFunctions["get_customer_invoice_by_id"]["Returns"] | null>;
export async function getCustomerInvoiceById(
  client: TypedSupabaseClient,
  args: DbFunctions["get_customer_invoice_by_id"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function getCustomerInvoiceById(
  client: TypedSupabaseClient,
  args: DbFunctions["get_customer_invoice_by_id"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["get_customer_invoice_by_id"]["Returns"]
  > | null,
): Promise<DbFunctions["get_customer_invoice_by_id"]["Returns"] | null>;
export async function getCustomerInvoiceById(
  client: TypedSupabaseClient,
  args: DbFunctions["get_customer_invoice_by_id"]["Args"] = emptyRpcArgs<"get_customer_invoice_by_id">(),
  options?: SupabaseRpcOptions<
    DbFunctions["get_customer_invoice_by_id"]["Returns"]
  > | null,
): Promise<
  DbFunctions["get_customer_invoice_by_id"]["Returns"] | null | boolean
> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "get_customer_invoice_by_id", args),
      "get_customer_invoice_by_id",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "get_customer_invoice_by_id", args),
      "get_customer_invoice_by_id",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "get_customer_invoice_by_id", args),
    "get_customer_invoice_by_id",
  );
}

export async function getInvoiceSummary(
  client: TypedSupabaseClient,
  args?: DbFunctions["get_invoice_summary"]["Args"],
): Promise<DbFunctions["get_invoice_summary"]["Returns"] | null>;
export async function getInvoiceSummary(
  client: TypedSupabaseClient,
  args: DbFunctions["get_invoice_summary"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function getInvoiceSummary(
  client: TypedSupabaseClient,
  args: DbFunctions["get_invoice_summary"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["get_invoice_summary"]["Returns"]
  > | null,
): Promise<DbFunctions["get_invoice_summary"]["Returns"] | null>;
export async function getInvoiceSummary(
  client: TypedSupabaseClient,
  args: DbFunctions["get_invoice_summary"]["Args"] = emptyRpcArgs<"get_invoice_summary">(),
  options?: SupabaseRpcOptions<
    DbFunctions["get_invoice_summary"]["Returns"]
  > | null,
): Promise<DbFunctions["get_invoice_summary"]["Returns"] | null | boolean> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "get_invoice_summary", args),
      "get_invoice_summary",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "get_invoice_summary", args),
      "get_invoice_summary",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "get_invoice_summary", args),
    "get_invoice_summary",
  );
}

export async function getOrganizationInvoiceTemplates(
  client: TypedSupabaseClient,
  args?: DbFunctions["get_organization_invoice_templates"]["Args"],
): Promise<DbFunctions["get_organization_invoice_templates"]["Returns"] | null>;
export async function getOrganizationInvoiceTemplates(
  client: TypedSupabaseClient,
  args: DbFunctions["get_organization_invoice_templates"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function getOrganizationInvoiceTemplates(
  client: TypedSupabaseClient,
  args: DbFunctions["get_organization_invoice_templates"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["get_organization_invoice_templates"]["Returns"]
  > | null,
): Promise<DbFunctions["get_organization_invoice_templates"]["Returns"] | null>;
export async function getOrganizationInvoiceTemplates(
  client: TypedSupabaseClient,
  args: DbFunctions["get_organization_invoice_templates"]["Args"] = emptyRpcArgs<"get_organization_invoice_templates">(),
  options?: SupabaseRpcOptions<
    DbFunctions["get_organization_invoice_templates"]["Returns"]
  > | null,
): Promise<
  DbFunctions["get_organization_invoice_templates"]["Returns"] | null | boolean
> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "get_organization_invoice_templates", args),
      "get_organization_invoice_templates",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "get_organization_invoice_templates", args),
      "get_organization_invoice_templates",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "get_organization_invoice_templates", args),
    "get_organization_invoice_templates",
  );
}

export async function getOrganizationSpiAccount(
  client: TypedSupabaseClient,
  args?: DbFunctions["get_organization_spi_account"]["Args"],
): Promise<DbFunctions["get_organization_spi_account"]["Returns"] | null>;
export async function getOrganizationSpiAccount(
  client: TypedSupabaseClient,
  args: DbFunctions["get_organization_spi_account"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function getOrganizationSpiAccount(
  client: TypedSupabaseClient,
  args: DbFunctions["get_organization_spi_account"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["get_organization_spi_account"]["Returns"]
  > | null,
): Promise<DbFunctions["get_organization_spi_account"]["Returns"] | null>;
export async function getOrganizationSpiAccount(
  client: TypedSupabaseClient,
  args: DbFunctions["get_organization_spi_account"]["Args"] = emptyRpcArgs<"get_organization_spi_account">(),
  options?: SupabaseRpcOptions<
    DbFunctions["get_organization_spi_account"]["Returns"]
  > | null,
): Promise<
  DbFunctions["get_organization_spi_account"]["Returns"] | null | boolean
> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "get_organization_spi_account", args),
      "get_organization_spi_account",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "get_organization_spi_account", args),
      "get_organization_spi_account",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "get_organization_spi_account", args),
    "get_organization_spi_account",
  );
}

export async function listCustomerInvoicesApi(
  client: TypedSupabaseClient,
  args?: DbFunctions["list_customer_invoices_api"]["Args"],
): Promise<DbFunctions["list_customer_invoices_api"]["Returns"] | null>;
export async function listCustomerInvoicesApi(
  client: TypedSupabaseClient,
  args: DbFunctions["list_customer_invoices_api"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function listCustomerInvoicesApi(
  client: TypedSupabaseClient,
  args: DbFunctions["list_customer_invoices_api"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["list_customer_invoices_api"]["Returns"]
  > | null,
): Promise<DbFunctions["list_customer_invoices_api"]["Returns"] | null>;
export async function listCustomerInvoicesApi(
  client: TypedSupabaseClient,
  args: DbFunctions["list_customer_invoices_api"]["Args"] = emptyRpcArgs<"list_customer_invoices_api">(),
  options?: SupabaseRpcOptions<
    DbFunctions["list_customer_invoices_api"]["Returns"]
  > | null,
): Promise<
  DbFunctions["list_customer_invoices_api"]["Returns"] | null | boolean
> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "list_customer_invoices_api", args),
      "list_customer_invoices_api",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "list_customer_invoices_api", args),
      "list_customer_invoices_api",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "list_customer_invoices_api", args),
    "list_customer_invoices_api",
  );
}

export async function logInvoiceEvent(
  client: TypedSupabaseClient,
  args?: DbFunctions["log_invoice_event"]["Args"],
): Promise<DbFunctions["log_invoice_event"]["Returns"] | null>;
export async function logInvoiceEvent(
  client: TypedSupabaseClient,
  args: DbFunctions["log_invoice_event"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function logInvoiceEvent(
  client: TypedSupabaseClient,
  args: DbFunctions["log_invoice_event"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["log_invoice_event"]["Returns"]
  > | null,
): Promise<DbFunctions["log_invoice_event"]["Returns"] | null>;
export async function logInvoiceEvent(
  client: TypedSupabaseClient,
  args: DbFunctions["log_invoice_event"]["Args"] = emptyRpcArgs<"log_invoice_event">(),
  options?: SupabaseRpcOptions<
    DbFunctions["log_invoice_event"]["Returns"]
  > | null,
): Promise<DbFunctions["log_invoice_event"]["Returns"] | null | boolean> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "log_invoice_event", args),
      "log_invoice_event",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "log_invoice_event", args),
      "log_invoice_event",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "log_invoice_event", args),
    "log_invoice_event",
  );
}

export async function markCustomerInvoicePaid(
  client: TypedSupabaseClient,
  args?: DbFunctions["mark_customer_invoice_paid"]["Args"],
): Promise<DbFunctions["mark_customer_invoice_paid"]["Returns"] | null>;
export async function markCustomerInvoicePaid(
  client: TypedSupabaseClient,
  args: DbFunctions["mark_customer_invoice_paid"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function markCustomerInvoicePaid(
  client: TypedSupabaseClient,
  args: DbFunctions["mark_customer_invoice_paid"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["mark_customer_invoice_paid"]["Returns"]
  > | null,
): Promise<DbFunctions["mark_customer_invoice_paid"]["Returns"] | null>;
export async function markCustomerInvoicePaid(
  client: TypedSupabaseClient,
  args: DbFunctions["mark_customer_invoice_paid"]["Args"] = emptyRpcArgs<"mark_customer_invoice_paid">(),
  options?: SupabaseRpcOptions<
    DbFunctions["mark_customer_invoice_paid"]["Returns"]
  > | null,
): Promise<
  DbFunctions["mark_customer_invoice_paid"]["Returns"] | null | boolean
> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "mark_customer_invoice_paid", args),
      "mark_customer_invoice_paid",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "mark_customer_invoice_paid", args),
      "mark_customer_invoice_paid",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "mark_customer_invoice_paid", args),
    "mark_customer_invoice_paid",
  );
}

export async function sendInvoiceReminder(
  client: TypedSupabaseClient,
  args?: DbFunctions["send_invoice_reminder"]["Args"],
): Promise<DbFunctions["send_invoice_reminder"]["Returns"] | null>;
export async function sendInvoiceReminder(
  client: TypedSupabaseClient,
  args: DbFunctions["send_invoice_reminder"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function sendInvoiceReminder(
  client: TypedSupabaseClient,
  args: DbFunctions["send_invoice_reminder"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["send_invoice_reminder"]["Returns"]
  > | null,
): Promise<DbFunctions["send_invoice_reminder"]["Returns"] | null>;
export async function sendInvoiceReminder(
  client: TypedSupabaseClient,
  args: DbFunctions["send_invoice_reminder"]["Args"] = emptyRpcArgs<"send_invoice_reminder">(),
  options?: SupabaseRpcOptions<
    DbFunctions["send_invoice_reminder"]["Returns"]
  > | null,
): Promise<DbFunctions["send_invoice_reminder"]["Returns"] | null | boolean> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "send_invoice_reminder", args),
      "send_invoice_reminder",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "send_invoice_reminder", args),
      "send_invoice_reminder",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "send_invoice_reminder", args),
    "send_invoice_reminder",
  );
}

export async function setCustomerInvoicePdfUrl(
  client: TypedSupabaseClient,
  args?: DbFunctions["set_customer_invoice_pdf_url"]["Args"],
): Promise<DbFunctions["set_customer_invoice_pdf_url"]["Returns"] | null>;
export async function setCustomerInvoicePdfUrl(
  client: TypedSupabaseClient,
  args: DbFunctions["set_customer_invoice_pdf_url"]["Args"],
  options: { expectReturnValue: false },
): Promise<boolean>;
export async function setCustomerInvoicePdfUrl(
  client: TypedSupabaseClient,
  args: DbFunctions["set_customer_invoice_pdf_url"]["Args"],
  options: SupabaseRpcOptions<
    DbFunctions["set_customer_invoice_pdf_url"]["Returns"]
  > | null,
): Promise<DbFunctions["set_customer_invoice_pdf_url"]["Returns"] | null>;
export async function setCustomerInvoicePdfUrl(
  client: TypedSupabaseClient,
  args: DbFunctions["set_customer_invoice_pdf_url"]["Args"] = emptyRpcArgs<"set_customer_invoice_pdf_url">(),
  options?: SupabaseRpcOptions<
    DbFunctions["set_customer_invoice_pdf_url"]["Returns"]
  > | null,
): Promise<
  DbFunctions["set_customer_invoice_pdf_url"]["Returns"] | null | boolean
> {
  if (options === null) {
    return handleSupabaseRpc(
      rpc(client, "set_customer_invoice_pdf_url", args),
      "set_customer_invoice_pdf_url",
      {
        fallbackValue: null,
      },
    );
  }
  if (options !== undefined) {
    return handleSupabaseRpc(
      rpc(client, "set_customer_invoice_pdf_url", args),
      "set_customer_invoice_pdf_url",
      options,
    );
  }
  return handleSupabaseRpc(
    rpc(client, "set_customer_invoice_pdf_url", args),
    "set_customer_invoice_pdf_url",
  );
}
