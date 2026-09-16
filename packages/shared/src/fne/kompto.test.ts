import assert from "node:assert/strict";
import { test } from "node:test";
import {
  buildKomptoVerifyPayload,
  isKomptoPayloadError,
  mapLomiPaymentMethodToKompto,
  parseKomptoInvoiceBody,
} from "./kompto.js";
import type { MerchantInvoiceForFne } from "./types.js";

function sampleInvoice(
  overrides: Partial<MerchantInvoiceForFne> = {},
): MerchantInvoiceForFne {
  return {
    customerInvoiceId: "inv-1",
    organizationId: "org-1",
    customerName: "KOUAME ET FRERES SARL",
    customerNcc: "8200001A",
    customerEmail: "contact@example.com",
    customerPhone: "2721212121",
    clientType: "B2B",
    paymentMethod: "spi",
    lineItems: [
      {
        name: "Prestation de conseil",
        quantity: 2,
        unitPrice: 50000,
        tvaName: "TVA",
      },
    ],
    ...overrides,
  };
}

test("mapLomiPaymentMethodToKompto only maps confirmed transfer rails", () => {
  assert.equal(mapLomiPaymentMethodToKompto("spi"), "transfer");
  assert.equal(mapLomiPaymentMethodToKompto("bank_transfer"), "transfer");
  assert.equal(mapLomiPaymentMethodToKompto("virement"), "transfer");
  assert.equal(mapLomiPaymentMethodToKompto("wave"), null);
  assert.equal(mapLomiPaymentMethodToKompto("mtn"), null);
  assert.equal(mapLomiPaymentMethodToKompto(null), null);
});

test("buildKomptoVerifyPayload matches the public KOMPTO example shape", () => {
  const payload = buildKomptoVerifyPayload(sampleInvoice());
  assert.equal(isKomptoPayloadError(payload), false);
  if (isKomptoPayloadError(payload)) return;
  assert.deepEqual(payload, {
    clientType: "B2B",
    clientName: "KOUAME ET FRERES SARL",
    clientNCC: "8200001A",
    clientTelephone: "2721212121",
    clientEmail: "contact@example.com",
    paymentMethod: "transfer",
    items: [
      {
        itemName: "Prestation de conseil",
        itemQuantity: 2,
        itemUnitPrice: 50000,
        itemTVAName: "TVA",
      },
    ],
  });
});

test("buildKomptoVerifyPayload rejects B2B without NCC", () => {
  const payload = buildKomptoVerifyPayload(
    sampleInvoice({ customerNcc: "  " }),
  );
  assert.equal(isKomptoPayloadError(payload), true);
  if (!isKomptoPayloadError(payload)) return;
  assert.equal(payload.code, "b2b_ncc_required");
});

test("buildKomptoVerifyPayload rejects unmapped payment methods", () => {
  const payload = buildKomptoVerifyPayload(
    sampleInvoice({ paymentMethod: "wave" }),
  );
  assert.equal(isKomptoPayloadError(payload), true);
  if (!isKomptoPayloadError(payload)) return;
  assert.equal(payload.code, "unmapped_payment_method");
});

test("parseKomptoInvoiceBody reads nested or flat ids without inventing amounts", () => {
  const nested = parseKomptoInvoiceBody({
    invoice: {
      id: "k-1",
      fiscalNumber: "FNE-2026-1",
      qrCode: "qr-payload",
      pdfUrl: "https://example.com/fne.pdf",
    },
  });
  assert.equal(nested.komptoInvoiceId, "k-1");
  assert.equal(nested.dgiIdentifier, "FNE-2026-1");
  assert.equal(nested.qrPayload, "qr-payload");
  assert.equal(nested.pdfUrl, "https://example.com/fne.pdf");
});
