import {
  isJsonObject,
  parseJson,
  parseJsonObject,
  type JsonObject,
  type JsonValue,
} from "../json-value.js";
import type { KomptoConfig } from "./config.js";
import {
  KOMPTO_CONFIRM_PATH,
  KOMPTO_CREATE_CREDIT_NOTE_PATH,
  KOMPTO_CREATE_PATH,
  KOMPTO_DELETE_PATH,
  KOMPTO_GET_ELECTRONIC_INVOICE_PATH,
  KOMPTO_GET_VERIFY_PATH,
  KOMPTO_INVOICE_QUERY_PARAM,
  KOMPTO_VERIFY_PATH,
  parseKomptoInvoiceBody,
  type KomptoParsedInvoice,
  type KomptoVerifyPayload,
} from "./kompto.js";

export type KomptoHttpMethod = "GET" | "POST" | "DELETE";

export type KomptoHttpRequest = {
  method: KomptoHttpMethod;
  url: string;
  headers: Record<string, string>;
  body?: string;
};

export type KomptoHttpResponse = {
  status: number;
  bodyText: string;
};

export type KomptoTransport = (
  request: KomptoHttpRequest,
) => Promise<KomptoHttpResponse>;

export class KomptoApiError extends Error {
  readonly status: number;
  readonly code: string | null;
  readonly path: string;

  constructor(args: {
    status: number;
    message: string;
    code?: string | null;
    path: string;
  }) {
    super(args.message);
    this.name = "KomptoApiError";
    this.status = args.status;
    this.code = args.code ?? null;
    this.path = args.path;
  }
}

export type KomptoCallResult = {
  status: number;
  parsed: KomptoParsedInvoice;
};

function joinUrl(baseUrl: string, path: string, query?: string): string {
  const url = `${baseUrl}${path}`;
  return query ? `${url}?${query}` : url;
}

function authHeaders(apiKey: string): Record<string, string> {
  return {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json; charset=utf-8",
    Accept: "application/json",
  };
}

function requireApiKey(config: KomptoConfig): string {
  if (!config.enabled) {
    throw new Error("KOMPTO client is disabled (fne_kompto_enabled is off).");
  }
  if (config.apiKey === null || config.apiKey === "") {
    throw new Error("Missing required environment variable: KOMPTO_API_KEY");
  }
  return config.apiKey;
}

function parseBodyObject(bodyText: string): JsonObject {
  if (bodyText.trim() === "") return {};
  const value: JsonValue = parseJson(bodyText);
  if (!isJsonObject(value)) {
    throw new TypeError("KOMPTO response was not a JSON object.");
  }
  return value;
}

function errorFromResponse(
  path: string,
  status: number,
  bodyText: string,
): KomptoApiError {
  let message = `KOMPTO request failed (${status})`;
  let code: string | null = null;
  try {
    const body = parseBodyObject(bodyText);
    const bodyMessage = body["message"];
    const bodyError = body["error"];
    const bodyCode = body["code"];
    if (typeof bodyMessage === "string" && bodyMessage.trim() !== "") {
      message = bodyMessage;
    } else if (typeof bodyError === "string" && bodyError.trim() !== "") {
      message = bodyError;
    }
    if (typeof bodyCode === "string" && bodyCode.trim() !== "") {
      code = bodyCode;
    }
  } catch {
    if (bodyText.trim() !== "") message = `KOMPTO request failed (${status})`;
  }
  return new KomptoApiError({ status, message, code, path });
}

export function createFetchTransport(fetchImpl: typeof fetch): KomptoTransport {
  return async (request) => {
    const response = await fetchImpl(request.url, {
      method: request.method,
      headers: request.headers,
      body: request.body,
    });
    const bodyText = await response.text();
    return { status: response.status, bodyText };
  };
}

export type KomptoClient = {
  verify: (payload: KomptoVerifyPayload) => Promise<KomptoCallResult>;
  getVerify: (komptoInvoiceId: string) => Promise<KomptoCallResult>;
  confirm: (komptoInvoiceId: string) => Promise<KomptoCallResult>;
  getElectronicInvoice: (komptoInvoiceId: string) => Promise<KomptoCallResult>;
  deletePending: (komptoInvoiceId: string) => Promise<KomptoCallResult>;
  create: (payload: KomptoVerifyPayload) => Promise<KomptoCallResult>;
  createCreditNote: (body: JsonObject) => Promise<KomptoCallResult>;
};

export function createKomptoClient(
  config: KomptoConfig,
  transport: KomptoTransport = createFetchTransport(fetch),
): KomptoClient {
  async function send(
    method: KomptoHttpMethod,
    path: string,
    options?: { body?: JsonObject | KomptoVerifyPayload; invoiceId?: string },
  ): Promise<KomptoCallResult> {
    const apiKey = requireApiKey(config);
    const query =
      options?.invoiceId !== undefined
        ? `${KOMPTO_INVOICE_QUERY_PARAM}=${encodeURIComponent(options.invoiceId)}`
        : undefined;
    const jsonBody =
      options?.body === undefined
        ? undefined
        : parseJsonObject(JSON.stringify(options.body));
    const request: KomptoHttpRequest = {
      method,
      url: joinUrl(config.baseUrl, path, query),
      headers: authHeaders(apiKey),
      body: jsonBody === undefined ? undefined : JSON.stringify(jsonBody),
    };
    const response = await transport(request);
    if (response.status < 200 || response.status >= 300) {
      throw errorFromResponse(path, response.status, response.bodyText);
    }
    const raw = parseBodyObject(response.bodyText);
    return { status: response.status, parsed: parseKomptoInvoiceBody(raw) };
  }

  return {
    verify: (payload) => send("POST", KOMPTO_VERIFY_PATH, { body: payload }),
    getVerify: (komptoInvoiceId) =>
      send("GET", KOMPTO_GET_VERIFY_PATH, { invoiceId: komptoInvoiceId }),
    confirm: (komptoInvoiceId) =>
      send("POST", KOMPTO_CONFIRM_PATH, {
        body: { [KOMPTO_INVOICE_QUERY_PARAM]: komptoInvoiceId },
      }),
    getElectronicInvoice: (komptoInvoiceId) =>
      send("GET", KOMPTO_GET_ELECTRONIC_INVOICE_PATH, {
        invoiceId: komptoInvoiceId,
      }),
    deletePending: (komptoInvoiceId) =>
      send("DELETE", KOMPTO_DELETE_PATH, { invoiceId: komptoInvoiceId }),
    create: (payload) => send("POST", KOMPTO_CREATE_PATH, { body: payload }),
    createCreditNote: (body) =>
      send("POST", KOMPTO_CREATE_CREDIT_NOTE_PATH, { body }),
  };
}
