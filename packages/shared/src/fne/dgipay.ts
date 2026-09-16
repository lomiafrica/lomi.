import {
  isJsonObject,
  parseJson,
  parseJsonObject,
  readString,
  type JsonObject,
  type JsonValue,
} from "../json-value.js";
import type { DgiPayConfig } from "./config.js";

export const DGIPAY_PING_PATH = "/DGIPay/DGIPay.svc/1.0/Ping";
export const DGIPAY_CHECK_NCC_PATH = "/DGIPay/DGIPay.svc/1.0/CheckNCC";
export const DGIPAY_PRE_AUTH_PATH = "/DGIPay/DGIPay.svc/1.0/PreAuthSticker";
export const DGIPAY_GET_STICKER_PATH = "/DGIPay/DGIPay.svc/1.0/GetSticker";
export const DGIPAY_ADD_TERMINAL_PATH = "/DGIPay/DGIPay.svc/1.0/AddTerminal";

export type DgiPayHttpRequest = {
  method: "POST";
  url: string;
  headers: Record<string, string>;
  body: string;
};

export type DgiPayHttpResponse = {
  status: number;
  bodyText: string;
};

export type DgiPayTransport = (
  request: DgiPayHttpRequest,
) => Promise<DgiPayHttpResponse>;

export class DgiPayApiError extends Error {
  readonly errorCode: string;
  readonly path: string;

  constructor(args: { errorCode: string; message: string; path: string }) {
    super(args.message);
    this.name = "DgiPayApiError";
    this.errorCode = args.errorCode;
    this.path = args.path;
  }
}

/** SHA-1 hex as required by the Nov 2025 DGIPay guide (ApiKey + ApiSecret + fields). */
export async function sha1HexUtf8(value: string): Promise<string> {
  const cryptoObj = globalThis.crypto;
  if (!cryptoObj?.subtle) {
    throw new Error("Web Crypto is required to sign DGIPay requests.");
  }
  const digest = await cryptoObj.subtle.digest(
    "SHA-1",
    new TextEncoder().encode(value),
  );
  return Array.from(new Uint8Array(digest), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
}

/** Concatenate ApiKey + ApiSecret + extra fields, then SHA-1 hex. */
export async function signDgiPay(
  apiKey: string,
  apiSecret: string,
  extra: readonly string[],
): Promise<string> {
  return sha1HexUtf8(`${apiKey}${apiSecret}${extra.join("")}`);
}

function requireEnabled(config: DgiPayConfig): {
  apiKey: string;
  apiSecret: string;
  aggregator: string;
} {
  if (!config.enabled) {
    throw new Error("DGIPay client is disabled (DGIPAY_ENABLED is off).");
  }
  if (
    config.apiKey === null ||
    config.apiSecret === null ||
    config.aggregator === null
  ) {
    throw new Error(
      "DGIPay requires DGIPAY_API_KEY, DGIPAY_API_SECRET, and DGIPAY_AGGREGATOR.",
    );
  }
  return {
    apiKey: config.apiKey,
    apiSecret: config.apiSecret,
    aggregator: config.aggregator,
  };
}

function parseBodyObject(bodyText: string): JsonObject {
  if (bodyText.trim() === "") return {};
  const value: JsonValue = parseJson(bodyText);
  if (!isJsonObject(value)) {
    throw new TypeError("DGIPay response was not a JSON object.");
  }
  return value;
}

export function createDgiPayFetchTransport(
  fetchImpl: typeof fetch,
): DgiPayTransport {
  return async (request) => {
    const response = await fetchImpl(request.url, {
      method: request.method,
      headers: request.headers,
      body: request.body,
    });
    return { status: response.status, bodyText: await response.text() };
  };
}

export type DgiPayAddTerminalInput = {
  terminalId: string;
  terminalSn: string;
  merchantName: string;
  terminalName: string;
  terminalAddress: string;
  terminalType: string;
  terminalModel: string;
  ncc: string;
  codeEtablissement: string;
  latitude: string;
  longitude: string;
  dateTime: string;
};

export type DgiPayPreAuthInput = {
  paymentMode: string;
  ncc: string;
  amount: string;
  terminalType: string;
  merchantName: string;
  terminalName: string;
  serialNumber: string;
  batteryLevel: string;
  responsable: string;
  latitude: string;
  longitude: string;
  dateTime: string;
  fiscalStamp?: string;
  taxType?: string;
  taxAmount?: string;
  receiptDetails?: string;
  terminalId?: string;
  payerNcc?: string;
  payerName?: string;
  receiptNumber?: string;
};

export type DgiPayGetStickerInput = {
  preAuthNumber: string;
  paymentRef: string;
  paymentDate: string;
  ncc: string;
  terminalId: string;
  merchantName: string;
  paymentMode: string;
  moneyIssuer: string;
  customerNumber: string;
  transactionId: string;
};

export type DgiPayClient = {
  ping: () => Promise<JsonObject>;
  checkNcc: (ncc: string) => Promise<JsonObject>;
  addTerminal: (input: DgiPayAddTerminalInput) => Promise<JsonObject>;
  preAuthSticker: (input: DgiPayPreAuthInput) => Promise<JsonObject>;
  getSticker: (input: DgiPayGetStickerInput) => Promise<JsonObject>;
};

/** DGIPay RNE aggregator client (Nov 2025 guide). */
export function createDgiPayClient(
  config: DgiPayConfig,
  transport: DgiPayTransport = createDgiPayFetchTransport(fetch),
): DgiPayClient {
  async function post(args: {
    path: string;
    body: JsonObject;
    extraForSignature?: readonly string[];
  }): Promise<JsonObject> {
    const creds = requireEnabled(config);
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-ApiKey": creds.apiKey,
    };
    if (args.extraForSignature) {
      headers["X-Signature"] = await signDgiPay(
        creds.apiKey,
        creds.apiSecret,
        args.extraForSignature,
      );
    }
    const response = await transport({
      method: "POST",
      url: `${config.baseUrl}${args.path}`,
      headers,
      body: JSON.stringify(parseJsonObject(JSON.stringify(args.body))),
    });
    if (response.status < 200 || response.status >= 300) {
      throw new DgiPayApiError({
        errorCode: String(response.status),
        message: `DGIPay request failed (${response.status})`,
        path: args.path,
      });
    }
    const body = parseBodyObject(response.bodyText);
    const errorCode = readString(body, "ErrorCode") ?? "0";
    if (errorCode !== "0") {
      throw new DgiPayApiError({
        errorCode,
        message: readString(body, "ErrorMessage") ?? "DGIPay request failed",
        path: args.path,
      });
    }
    return body;
  }

  return {
    ping: () => {
      const creds = requireEnabled(config);
      return post({
        path: DGIPAY_PING_PATH,
        body: { Aggregator: creds.aggregator },
      });
    },
    checkNcc: (ncc) =>
      post({
        path: DGIPAY_CHECK_NCC_PATH,
        body: { NCC: ncc },
      }),
    addTerminal: (input) => {
      const creds = requireEnabled(config);
      return post({
        path: DGIPAY_ADD_TERMINAL_PATH,
        body: {
          Aggregator: creds.aggregator,
          TerminalID: input.terminalId,
          TerminalSN: input.terminalSn,
          MerchantName: input.merchantName,
          TerminalName: input.terminalName,
          TerminalAddress: input.terminalAddress,
          TerminalType: input.terminalType,
          TerminalModel: input.terminalModel,
          NCC: input.ncc,
          CodeEtablissement: input.codeEtablissement,
          Latitude: input.latitude,
          Longitude: input.longitude,
          DateTime: input.dateTime,
        },
        extraForSignature: [input.ncc, input.terminalId, input.dateTime],
      });
    },
    preAuthSticker: (input) => {
      const creds = requireEnabled(config);
      const body: JsonObject = {
        PaymentMode: input.paymentMode,
        Aggregator: creds.aggregator,
        NCC: input.ncc,
        Amount: input.amount,
        TerminalType: input.terminalType,
        MerchantName: input.merchantName,
        TerminalName: input.terminalName,
        SerialNumber: input.serialNumber,
        BatteryLevel: input.batteryLevel,
        Responsable: input.responsable,
        Latitude: input.latitude,
        Longitude: input.longitude,
        DateTime: input.dateTime,
      };
      if (input.fiscalStamp) body["FiscalStamp"] = input.fiscalStamp;
      if (input.taxType) body["TaxType"] = input.taxType;
      if (input.taxAmount) body["TaxAmount"] = input.taxAmount;
      if (input.receiptDetails) body["ReceiptDetails"] = input.receiptDetails;
      if (input.terminalId) body["TerminalID"] = input.terminalId;
      if (input.payerNcc) body["PayerNCC"] = input.payerNcc;
      if (input.payerName) body["PayerName"] = input.payerName;
      if (input.receiptNumber) body["ReceiptNumber"] = input.receiptNumber;
      return post({
        path: DGIPAY_PRE_AUTH_PATH,
        body,
        extraForSignature: [input.ncc, input.amount, input.dateTime],
      });
    },
    getSticker: (input) =>
      post({
        path: DGIPAY_GET_STICKER_PATH,
        body: {
          PreAuthNumber: input.preAuthNumber,
          PaymentRef: input.paymentRef,
          PaymentDate: input.paymentDate,
          NCC: input.ncc,
          TerminalID: input.terminalId,
          MerchantName: input.merchantName,
          PaymentMode: input.paymentMode,
          MoneyIssuer: input.moneyIssuer,
          CustomerNumber: input.customerNumber,
          TransactionId: input.transactionId,
        },
        extraForSignature: [input.ncc, input.paymentRef, input.paymentDate],
      }),
  };
}
