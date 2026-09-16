import assert from "node:assert/strict";
import { test } from "node:test";
import {
  FNE_DEFAULT_BASE_URL,
  FNE_SIGN_PATH,
  buildFneSignPayload,
  createDgiPayClient,
  createFneClient,
  isFnePayloadError,
  mapLomiPaymentMethodToDgiPay,
  mapLomiPaymentMethodToFne,
  openFneOrgApiKey,
  planFiscalCertification,
  parseFneSignBody,
  planFneSign,
  readDgiPayConfig,
  displayFiscalReference,
  fiscalQrPayload,
  readFiscalReceipt,
  readFneConfig,
  redactDgiPayConfig,
  redactFneConfig,
  sealFneOrgApiKey,
  sha1HexUtf8,
  signDgiPay,
  type FneHttpRequest,
  type FneSignPayload,
  type MerchantInvoiceForFne,
} from "./fne/index.js";

function sampleInvoice(
  overrides: Partial<MerchantInvoiceForFne> = {},
): MerchantInvoiceForFne {
  return {
    customerName: "KPMG COTE D'IVOIRE",
    customerNcc: "9502363N",
    customerPhone: "0709080765",
    customerEmail: "info@kpmg.ci",
    paymentMethod: "wave",
    template: "B2B",
    pointOfSale: "23",
    establishment: "Orange Riviera Mpouto",
    lineItems: [
      {
        name: "sac de riz Dinor 5 x 5",
        quantity: 30,
        unitPrice: 20000,
        taxes: ["TVA"],
        reference: "ref009",
        measurementUnit: "pcs",
        discount: 10,
      },
    ],
    ...overrides,
  };
}

test("FNE key is optional; merchant Bearers live on the org", () => {
  const off = readFneConfig({});
  assert.equal(off.enabled, false);
  assert.equal(off.apiKey, null);
  assert.equal(off.baseUrl, FNE_DEFAULT_BASE_URL);
  const on = readFneConfig({
    FNE_ENABLED: "true",
    FNE_BASE_URL: "http://54.247.95.108/ws/",
  });
  assert.equal(on.enabled, true);
  assert.equal(on.apiKey, null);
  assert.equal(on.baseUrl, "http://54.247.95.108/ws");
  const withKey = readFneConfig({
    FNE_ENABLED: "true",
    FNE_API_KEY: "test-fne-key",
  });
  assert.equal(redactFneConfig(withKey).apiKey, "[redacted]");
});

test("maps lomi rails onto DGI paymentMethod annex values", () => {
  assert.equal(mapLomiPaymentMethodToFne("wave"), "mobile-money");
  assert.equal(mapLomiPaymentMethodToFne("mtn"), "mobile-money");
  assert.equal(mapLomiPaymentMethodToFne("spi"), "transfer");
  assert.equal(mapLomiPaymentMethodToFne("card"), "card");
  assert.equal(mapLomiPaymentMethodToFne("cash"), "cash");
  assert.equal(mapLomiPaymentMethodToFne("bitcoin"), null);
});

test("B2B sign payload uses official DGI field names", () => {
  const payload = buildFneSignPayload(sampleInvoice());
  assert.equal(isFnePayloadError(payload), false);
  if (isFnePayloadError(payload)) return;
  assert.equal(payload.invoiceType, "sale");
  assert.equal(payload.paymentMethod, "mobile-money");
  assert.equal(payload.template, "B2B");
  assert.equal(payload.clientNcc, "9502363N");
  assert.equal(payload.clientCompanyName, "KPMG COTE D'IVOIRE");
  assert.equal(payload.clientPhone, "0709080765");
  assert.equal(payload.pointOfSale, "23");
  assert.equal(payload.establishment, "Orange Riviera Mpouto");
  assert.equal(payload.isRne, false);
  assert.deepEqual(payload.items[0]?.taxes, ["TVA"]);
  assert.equal(payload.items[0]?.description, "sac de riz Dinor 5 x 5");
  assert.equal(payload.items[0]?.amount, 20000);
});

test("rejects B2B without NCC, missing POS, and unmapped payment", () => {
  assert.equal(
    isFnePayloadError(buildFneSignPayload(sampleInvoice({ customerNcc: "" }))),
    true,
  );
  assert.equal(
    isFnePayloadError(buildFneSignPayload(sampleInvoice({ pointOfSale: " " }))),
    true,
  );
  assert.equal(
    isFnePayloadError(
      buildFneSignPayload(sampleInvoice({ paymentMethod: "bitcoin" })),
    ),
    true,
  );
});

test("dry-run never signs; already certified skips", () => {
  const payload = buildFneSignPayload(sampleInvoice());
  assert.equal(isFnePayloadError(payload), false);
  if (isFnePayloadError(payload)) return;
  assert.deepEqual(
    planFneSign({ alreadyCertified: true, dryRun: false, payload }),
    { action: "skip", reason: "already_certified" },
  );
  assert.equal(
    planFneSign({ alreadyCertified: false, dryRun: true, payload }).action,
    "dry_run",
  );
  assert.equal(
    planFneSign({ alreadyCertified: false, dryRun: false, payload }).action,
    "sign",
  );
});

test("parses DGI sign response reference, token, and invoice id", () => {
  const parsed = parseFneSignBody({
    ncc: "9606123E",
    reference: "9606123E25000000019",
    token: "http://54.247.95.108/fr/verification/019465c1-3f61-766c-9652-706e32dfb436",
    warning: false,
    balance_sticker: 179,
    invoice: { id: "e2b2d8da-a532-4c08-9182-f5b428ca468d" },
  });
  assert.equal(parsed.reference, "9606123E25000000019");
  assert.equal(parsed.invoiceId, "e2b2d8da-a532-4c08-9182-f5b428ca468d");
  assert.equal(parsed.balanceSticker, 179);
  assert.match(parsed.token ?? "", /verification/);
});

test("FNE client posts /external/invoices/sign with Bearer auth", async () => {
  const requests: FneHttpRequest[] = [];
  const client = createFneClient(
    { enabled: true, apiKey: "test-fne-key", baseUrl: FNE_DEFAULT_BASE_URL },
    async (request) => {
      requests.push(request);
      return {
        status: 200,
        bodyText: JSON.stringify({
          ncc: "9606123E",
          reference: "9606123E25000000019",
          token: "http://example.test/token",
          warning: false,
          balance_sticker: 10,
          invoice: { id: "inv-1" },
        }),
      };
    },
  );
  const payload = buildFneSignPayload(sampleInvoice()) as FneSignPayload;
  const result = await client.sign(payload);
  assert.equal(requests[0]?.url, `${FNE_DEFAULT_BASE_URL}${FNE_SIGN_PATH}`);
  assert.equal(requests[0]?.headers.Authorization, "Bearer test-fne-key");
  assert.equal(result.invoiceId, "inv-1");
});

test("FNE client refunds via /external/invoices/{id}/refund", async () => {
  let url = "";
  const client = createFneClient(
    { enabled: true, apiKey: "test-fne-key", baseUrl: FNE_DEFAULT_BASE_URL },
    async (request) => {
      url = request.url;
      return {
        status: 201,
        bodyText: JSON.stringify({
          reference: "A9606123E2500000006",
          token: "http://example.test/refund",
        }),
      };
    },
  );
  await client.refund("e2b2d8da-a532-4c08-9182-f5b428ca468d", [
    { id: "item-1", quantity: 1 },
  ]);
  assert.equal(
    url,
    `${FNE_DEFAULT_BASE_URL}/external/invoices/e2b2d8da-a532-4c08-9182-f5b428ca468d/refund`,
  );
});

test("disabled FNE client refuses to sign", async () => {
  const client = createFneClient({
    enabled: false,
    apiKey: null,
    baseUrl: FNE_DEFAULT_BASE_URL,
  });
  await assert.rejects(
    () =>
      client.sign(
        buildFneSignPayload(sampleInvoice()) as FneSignPayload,
      ),
    /disabled/,
  );
});

test("DGIPay config redacts secrets and signs SHA-1 as documented", async () => {
  assert.throws(() => readDgiPayConfig({ DGIPAY_ENABLED: "true" }), /DGIPAY/);
  const config = readDgiPayConfig({
    DGIPAY_ENABLED: "true",
    DGIPAY_API_KEY: "test-key",
    DGIPAY_API_SECRET: "test-secret",
    DGIPAY_AGGREGATOR: "LOMI",
  });
  assert.equal(redactDgiPayConfig(config).apiSecret, "[redacted]");
  const digest = await signDgiPay("k", "s", ["NCC", "1", "t"]);
  assert.equal(digest, await sha1HexUtf8("ksNCC1t"));
  assert.equal(digest.length, 40);
});

test("DGIPay ping and CheckNCC use official paths", async () => {
  const urls: string[] = [];
  const client = createDgiPayClient(
    {
      enabled: true,
      apiKey: "test-key",
      apiSecret: "test-secret",
      aggregator: "LOMI",
      baseUrl: "https://test-bj.imaniafrica.com",
    },
    async (request) => {
      urls.push(request.url);
      return {
        status: 200,
        bodyText: JSON.stringify({ ErrorCode: "0", ErrorMessage: "" }),
      };
    },
  );
  await client.ping();
  await client.checkNcc("1234567A");
  assert.equal(
    urls[0],
    "https://test-bj.imaniafrica.com/DGIPay/DGIPay.svc/1.0/Ping",
  );
  assert.equal(
    urls[1],
    "https://test-bj.imaniafrica.com/DGIPay/DGIPay.svc/1.0/CheckNCC",
  );
});

test("DGIPay PreAuthSticker sends X-Signature", async () => {
  let signature = "";
  const client = createDgiPayClient(
    {
      enabled: true,
      apiKey: "test-key",
      apiSecret: "test-secret",
      aggregator: "LOMI",
      baseUrl: "https://test-bj.imaniafrica.com",
    },
    async (request) => {
      signature = request.headers["X-Signature"] ?? "";
      return {
        status: 200,
        bodyText: JSON.stringify({
          ErrorCode: "0",
          PreAuthNumber: "554A4275-BE5A-417F-8087-22E473FF2C31",
        }),
      };
    },
  );
  await client.preAuthSticker({
    paymentMode: "MOBILE",
    ncc: "12345678A",
    amount: "8000",
    terminalType: "FNE",
    merchantName: "TEST MARCHAND",
    terminalName: "CAISSE 1",
    serialNumber: "0820679198",
    batteryLevel: "84.5",
    responsable: "RESP MARCHAND",
    latitude: "4.12556477",
    longitude: "-3.5445888",
    dateTime: "2024-09-03T20:25:35.547Z",
  });
  const expected = await signDgiPay("test-key", "test-secret", [
    "12345678A",
    "8000",
    "2024-09-03T20:25:35.547Z",
  ]);
  assert.equal(signature, expected);
});

test("FNE software orgs sign SaaS and Jumbo; RNE only stickers POS", () => {
  const base = {
    channel: "wave",
    currency: "XOF",
    country: "CI",
    fneEnabled: true,
    dgiPayEnabled: true,
    alreadyCertified: false,
    jobKind: "sign" as const,
  };
  assert.deepEqual(
    planFiscalCertification({ ...base, regime: "fne", isPos: false }),
    { action: "sign" },
  );
  assert.deepEqual(
    planFiscalCertification({ ...base, regime: "fne", isPos: true }),
    { action: "sign" },
  );
  assert.deepEqual(
    planFiscalCertification({
      ...base,
      regime: "rne",
      isPos: true,
      jobKind: "sticker",
    }),
    { action: "sticker" },
  );
  assert.deepEqual(
    planFiscalCertification({
      ...base,
      regime: "rne",
      isPos: false,
    }),
    { action: "skip", reason: "rne_online" },
  );
  assert.deepEqual(
    planFiscalCertification({
      ...base,
      regime: "fne",
      isPos: true,
      channel: "terminal",
    }),
    { action: "skip", reason: "tap_to_pay_hold" },
  );
  assert.deepEqual(
    planFiscalCertification({ ...base, regime: "fne", fneEnabled: false }),
    { action: "skip", reason: "flag_off" },
  );
  assert.equal(mapLomiPaymentMethodToDgiPay("wave"), "MOBILE");
  assert.equal(mapLomiPaymentMethodToDgiPay("spi"), "VIREMENT");
});

test("fiscal receipt metadata round-trips public DGI fields", () => {
  const packed = {
    fiscal: {
      status: "certified",
      rail: "fne",
      reference: "FNE-100",
      token: "https://example.test/qr",
      invoice_id: "inv-9",
    },
  };
  assert.deepEqual(readFiscalReceipt(packed), {
    reference: "FNE-100",
    token: "https://example.test/qr",
    invoiceId: "inv-9",
    status: "certified",
    rail: "fne",
  });
  assert.equal(displayFiscalReference(readFiscalReceipt(packed)), "FNE-100");
  assert.equal(
    fiscalQrPayload(readFiscalReceipt(packed)),
    "https://example.test/qr",
  );
  assert.equal(
    displayFiscalReference(
      readFiscalReceipt({
        fiscal: {
          status: "certified",
          rail: "fne",
          reference: "550e8400-e29b-41d4-a716-446655440000",
        },
      }),
    ),
    null,
  );
});

test("seals and opens a merchant FNE Bearer", async () => {
  const sealed = await sealFneOrgApiKey("portal-bearer", "org-secret-min-32-chars!!");
  assert.notEqual(sealed, "portal-bearer");
  assert.equal(
    await openFneOrgApiKey(sealed, "org-secret-min-32-chars!!"),
    "portal-bearer",
  );
  assert.equal(await openFneOrgApiKey(sealed, "wrong-secret"), null);
});
