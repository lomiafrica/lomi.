import assert from "node:assert/strict";
import { test } from "node:test";
import {
  applyKomptoConfirmResult,
  applyKomptoFailure,
  applyKomptoVerifyResult,
  emptyCertificationRecord,
  planMerchantInvoiceCertification,
} from "./certification.js";
import { readKomptoConfig } from "./config.js";
import { createKomptoClient, KomptoApiError } from "./client.js";
import type { KomptoHttpRequest } from "./client.js";
import type { MerchantInvoiceForFne } from "./types.js";

const invoice: MerchantInvoiceForFne = {
  customerInvoiceId: "inv-1",
  organizationId: "org-1",
  customerName: "KOUAME ET FRERES SARL",
  customerNcc: "8200001A",
  clientType: "B2B",
  paymentMethod: "transfer",
  lineItems: [
    {
      name: "Commission lomi.",
      quantity: 1,
      unitPrice: 1000,
      tvaName: "TVA",
    },
  ],
};

const enabledConfig = readKomptoConfig({
  FNE_KOMPTO_ENABLED: "true",
  KOMPTO_API_KEY: "test-kompto-key",
});

test("planner is blocked when the feature flag is off", () => {
  const plan = planMerchantInvoiceCertification({
    config: readKomptoConfig({}),
    invoice,
    record: null,
    dryRun: true,
  });
  assert.equal("error" in plan, false);
  if ("error" in plan) return;
  assert.equal(plan.action, "blocked");
});

test("planner verifies new invoices and never confirms during dry-run", () => {
  const first = planMerchantInvoiceCertification({
    config: enabledConfig,
    invoice,
    record: null,
    dryRun: true,
  });
  assert.equal("error" in first, false);
  if ("error" in first) return;
  assert.equal(first.action, "verify");

  const verified = applyKomptoVerifyResult({
    record: first.record,
    nowIso: "2026-09-16T00:00:00.000Z",
    result: {
      status: 200,
      parsed: {
        raw: { id: "k-1" },
        komptoInvoiceId: "k-1",
        dgiIdentifier: null,
        qrPayload: null,
        pdfUrl: null,
      },
    },
  });
  assert.equal(verified.status, "verified");
  assert.equal(verified.komptoInvoiceId, "k-1");

  const dry = planMerchantInvoiceCertification({
    config: enabledConfig,
    invoice,
    record: verified,
    dryRun: true,
  });
  assert.equal("error" in dry, false);
  if ("error" in dry) return;
  assert.equal(dry.action, "skip");
  assert.match(dry.reason, /Dry-run/);

  const live = planMerchantInvoiceCertification({
    config: enabledConfig,
    invoice,
    record: verified,
    dryRun: false,
  });
  assert.equal("error" in live, false);
  if ("error" in live) return;
  assert.equal(live.action, "confirm");
});

test("planner skips already certified invoices (idempotent)", () => {
  const record = emptyCertificationRecord(invoice);
  record.status = "certified";
  record.komptoInvoiceId = "k-1";
  record.dgiIdentifier = "FNE-1";
  const plan = planMerchantInvoiceCertification({
    config: enabledConfig,
    invoice,
    record,
    dryRun: false,
  });
  assert.equal("error" in plan, false);
  if ("error" in plan) return;
  assert.equal(plan.action, "skip");
});

test("confirm without a DGI id stays confirm_pending so retry can refresh", () => {
  const pending = applyKomptoConfirmResult({
    record: {
      ...emptyCertificationRecord(invoice),
      status: "verified",
      komptoInvoiceId: "k-1",
    },
    nowIso: "2026-09-16T00:00:00.000Z",
    result: {
      status: 200,
      parsed: {
        raw: { id: "k-1" },
        komptoInvoiceId: "k-1",
        dgiIdentifier: null,
        qrPayload: null,
        pdfUrl: null,
      },
    },
  });
  assert.equal(pending.status, "confirm_pending");
  const plan = planMerchantInvoiceCertification({
    config: enabledConfig,
    invoice,
    record: pending,
    dryRun: false,
  });
  assert.equal("error" in plan, false);
  if ("error" in plan) return;
  assert.equal(plan.action, "refresh");
});

test("applyKomptoFailure records the message without clearing kompto id", () => {
  const failed = applyKomptoFailure(
    {
      ...emptyCertificationRecord(invoice),
      komptoInvoiceId: "k-1",
      status: "verify_pending",
    },
    "KOMPTO request failed (400)",
  );
  assert.equal(failed.status, "failed");
  assert.equal(failed.komptoInvoiceId, "k-1");
  assert.equal(failed.lastError, "KOMPTO request failed (400)");
});

test("createKomptoClient posts verify and does not confirm on mock 4xx", async () => {
  const calls: KomptoHttpRequest[] = [];
  const client = createKomptoClient(enabledConfig, async (request) => {
    calls.push(request);
    if (request.url.endsWith("/api/invoice/verify")) {
      return { status: 400, bodyText: JSON.stringify({ message: "bad item" }) };
    }
    return { status: 500, bodyText: "{}" };
  });

  await assert.rejects(
    () =>
      client.verify({
        clientType: "B2B",
        clientName: "KOUAME ET FRERES SARL",
        clientNCC: "8200001A",
        paymentMethod: "transfer",
        items: [
          {
            itemName: "Prestation",
            itemQuantity: 1,
            itemUnitPrice: 1000,
            itemTVAName: "TVA",
          },
        ],
      }),
    (error: unknown) => {
      assert.equal(error instanceof KomptoApiError, true);
      if (!(error instanceof KomptoApiError)) return false;
      assert.equal(error.status, 400);
      assert.equal(error.message, "bad item");
      return true;
    },
  );
  assert.equal(calls.length, 1);
  assert.match(calls[0]?.url ?? "", /\/api\/invoice\/verify$/);
  assert.equal(calls[0]?.headers.Authorization, "Bearer test-kompto-key");
  assert.equal(JSON.stringify(calls).includes("confirm"), false);
});

test("createKomptoClient verify then confirm uses the stored id", async () => {
  const paths: string[] = [];
  const client = createKomptoClient(enabledConfig, async (request) => {
    paths.push(new URL(request.url).pathname);
    if (request.url.endsWith("/api/invoice/verify")) {
      return { status: 200, bodyText: JSON.stringify({ id: "k-99" }) };
    }
    if (request.url.endsWith("/api/invoice/confirm")) {
      assert.equal(request.body, JSON.stringify({ id: "k-99" }));
      return {
        status: 200,
        bodyText: JSON.stringify({
          id: "k-99",
          fiscalNumber: "FNE-99",
          qrCode: "qr",
        }),
      };
    }
    throw new Error(`unexpected ${request.url}`);
  });

  const verified = await client.verify({
    clientType: "B2C",
    clientName: "Client",
    paymentMethod: "transfer",
    items: [
      {
        itemName: "Service",
        itemQuantity: 1,
        itemUnitPrice: 500,
        itemTVAName: "TVAE",
      },
    ],
  });
  assert.equal(verified.parsed.komptoInvoiceId, "k-99");
  const confirmed = await client.confirm("k-99");
  assert.equal(confirmed.parsed.dgiIdentifier, "FNE-99");
  assert.deepEqual(paths, ["/api/invoice/verify", "/api/invoice/confirm"]);
});
