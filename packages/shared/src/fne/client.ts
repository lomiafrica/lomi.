import {
  isJsonObject,
  parseJson,
  parseJsonObject,
  readNumber,
  readString,
  type JsonObject,
  type JsonValue,
} from "../json-value.js";
import type { FneConfig } from "./config.js";
import type { FneRefundItem, FneSignPayload, FneSignResult } from "./types.js";

export const FNE_SIGN_PATH = "/external/invoices/sign";

export type FneHttpRequest = {
  method: "POST";
  url: string;
  headers: Record<string, string>;
  body: string;
};

export type FneHttpResponse = {
  status: number;
  bodyText: string;
};

export type FneTransport = (
  request: FneHttpRequest,
) => Promise<FneHttpResponse>;

export class FneApiError extends Error {
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
    this.name = "FneApiError";
    this.status = args.status;
    this.code = args.code ?? null;
    this.path = args.path;
  }
}

function requireApiKey(config: FneConfig): string {
  if (!config.enabled) {
    throw new Error("FNE client is disabled (FNE_ENABLED is off).");
  }
  if (config.apiKey === null || config.apiKey === "") {
    throw new Error("Missing required environment variable: FNE_API_KEY");
  }
  return config.apiKey;
}

function parseBodyObject(bodyText: string): JsonObject {
  if (bodyText.trim() === "") return {};
  const value: JsonValue = parseJson(bodyText);
  if (!isJsonObject(value)) {
    throw new TypeError("FNE response was not a JSON object.");
  }
  return value;
}

function firstString(
  object: JsonObject,
  keys: readonly string[],
): string | null {
  for (const key of keys) {
    const value = readString(object, key);
    if (value !== undefined && value.trim() !== "") return value.trim();
  }
  return null;
}

/** Parse DGI sign/refund JSON (ncc, reference, token, invoice.id). */
export function parseFneSignBody(raw: JsonObject): FneSignResult {
  const invoiceValue = raw["invoice"];
  const invoice = isJsonObject(invoiceValue) ? invoiceValue : null;
  const warningValue = raw["warning"];
  return {
    ncc: firstString(raw, ["ncc"]),
    reference: firstString(raw, ["reference"]),
    token: firstString(raw, ["token"]),
    warning: typeof warningValue === "boolean" ? warningValue : null,
    balanceSticker: readNumber(raw, "balance_sticker") ?? null,
    invoiceId: invoice ? firstString(invoice, ["id"]) : null,
  };
}

function errorFromResponse(
  path: string,
  status: number,
  bodyText: string,
): FneApiError {
  let message = `FNE request failed (${status})`;
  let code: string | null = null;
  try {
    const body = parseBodyObject(bodyText);
    const bodyMessage = body["message"];
    const bodyError = body["error"];
    if (typeof bodyMessage === "string" && bodyMessage.trim() !== "") {
      message = bodyMessage;
    } else if (typeof bodyError === "string" && bodyError.trim() !== "") {
      message = bodyError;
    }
    if (typeof bodyError === "string" && bodyError.trim() !== "") {
      code = bodyError;
    }
  } catch {
    if (bodyText.trim() !== "") message = `FNE request failed (${status})`;
  }
  return new FneApiError({ status, message, code, path });
}

export function createFetchTransport(fetchImpl: typeof fetch): FneTransport {
  return async (request) => {
    const response = await fetchImpl(request.url, {
      method: request.method,
      headers: request.headers,
      body: request.body,
    });
    return { status: response.status, bodyText: await response.text() };
  };
}

export type FneClient = {
  sign: (payload: FneSignPayload) => Promise<FneSignResult>;
  refund: (invoiceId: string, items: FneRefundItem[]) => Promise<FneSignResult>;
};

/** DGI invoice API: POST /external/invoices/sign and /external/invoices/{id}/refund. */
export function createFneClient(
  config: FneConfig,
  transport: FneTransport = createFetchTransport(fetch),
): FneClient {
  async function post(path: string, body: JsonObject): Promise<FneSignResult> {
    const apiKey = requireApiKey(config);
    const request: FneHttpRequest = {
      method: "POST",
      url: `${config.baseUrl}${path}`,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(parseJsonObject(JSON.stringify(body))),
    };
    const response = await transport(request);
    if (response.status < 200 || response.status >= 300) {
      throw errorFromResponse(path, response.status, response.bodyText);
    }
    return parseFneSignBody(parseBodyObject(response.bodyText));
  }

  return {
    sign: (payload) => post(FNE_SIGN_PATH, payload),
    refund: (invoiceId, items) =>
      post(`/external/invoices/${encodeURIComponent(invoiceId)}/refund`, {
        items,
      }),
  };
}

export type FneSignPlan =
  | { action: "skip"; reason: "already_certified" }
  | { action: "dry_run"; payload: FneSignPayload }
  | { action: "sign"; payload: FneSignPayload };

/** Dry-run never calls sign. DGI has no verify step; sign spends a sticker. */
export function planFneSign(args: {
  alreadyCertified: boolean;
  dryRun: boolean;
  payload: FneSignPayload;
}): FneSignPlan {
  if (args.alreadyCertified) {
    return { action: "skip", reason: "already_certified" };
  }
  if (args.dryRun) {
    return { action: "dry_run", payload: args.payload };
  }
  return { action: "sign", payload: args.payload };
}
