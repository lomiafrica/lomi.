import assert from "node:assert/strict";
import { test } from "node:test";
import {
  DEFAULT_PAY_ORIGIN,
  PUBLIC_ID_PREFIXES,
  buildPaymentLinkCheckoutUrl,
  formatPublicId,
  hostedPaymentLinkUrl,
  isCanonicalPaymentLinkPath,
  isCheckoutLinkIdentifier,
  isLegacyPaymentLinkPath,
  isPaymentLinkPathSegment,
  isPublicId,
  isPublicIdPrefix,
  isUuid,
  normalizePublicId,
  paymentLinkPathSegment,
  publicIdPrefix,
  publicIdsMatch,
} from "./public-id.js";

const BODY = "23456789ABCDEF";
const ORG_ID = `${PUBLIC_ID_PREFIXES.organization}${BODY}`;
const TXN_ID = `${PUBLIC_ID_PREFIXES.transaction}${BODY}`;
const PLINK_ID = `${PUBLIC_ID_PREFIXES.paymentLink}${BODY}`;
const UUID = "550e8400-e29b-41d4-a716-446655440000";

test("normalizePublicId strips separators and uppercases", () => {
  assert.equal(normalizePublicId(" org_2345-6789 abcdef "), "ORG_23456789ABCDEF");
});

test("isUuid accepts RFC-4122 ids and rejects public ids", () => {
  assert.equal(isUuid(UUID), true);
  assert.equal(isUuid(` ${UUID.toUpperCase()} `), true);
  assert.equal(isUuid(ORG_ID), false);
  assert.equal(isUuid("not-a-uuid"), false);
});

test("isPublicId validates prefix, body length, and alphabet", () => {
  assert.equal(isPublicIdPrefix(PUBLIC_ID_PREFIXES.organization), true);
  assert.equal(isPublicIdPrefix("foo_"), false);
  assert.equal(isPublicId(ORG_ID), true);
  assert.equal(isPublicId(` ${ORG_ID.toLowerCase()} `), true);
  assert.equal(isPublicId(ORG_ID, PUBLIC_ID_PREFIXES.organization), true);
  assert.equal(isPublicId(ORG_ID, PUBLIC_ID_PREFIXES.customer), false);
  assert.equal(isPublicId(`${PUBLIC_ID_PREFIXES.organization}23456789ABCDE0`), false);
  assert.equal(isPublicId(`${PUBLIC_ID_PREFIXES.organization}${BODY}X`), false);
  assert.equal(isPublicId(BODY), false);
});

test("formatPublicId keeps canonical prefixes except TXN_", () => {
  assert.equal(formatPublicId(null), null);
  assert.equal(formatPublicId("   "), null);
  assert.equal(formatPublicId(UUID), UUID);
  assert.equal(formatPublicId(` ${ORG_ID.toLowerCase()} `), ORG_ID);
  assert.equal(formatPublicId(`Txn_${BODY.toLowerCase()}`), `TXN_${BODY}`);
  assert.equal(formatPublicId(TXN_ID), `TXN_${BODY}`);
  assert.equal(formatPublicId("orphan-id"), "ORPHANID");
});

test("publicIdsMatch compares UUIDs and public ids independently of case", () => {
  assert.equal(publicIdsMatch(UUID, UUID.toUpperCase()), true);
  assert.equal(publicIdsMatch(ORG_ID, ORG_ID.toLowerCase()), true);
  assert.equal(publicIdsMatch(ORG_ID, TXN_ID), false);
  assert.equal(publicIdsMatch(ORG_ID, null), false);
});

test("payment-link path helpers strip plink_ and reject reserved segments", () => {
  assert.equal(paymentLinkPathSegment(PLINK_ID), BODY);
  assert.equal(paymentLinkPathSegment(UUID), UUID);
  assert.equal(paymentLinkPathSegment("  "), "");
  assert.equal(isPaymentLinkPathSegment(BODY), true);
  assert.equal(isPaymentLinkPathSegment(PLINK_ID), true);
  assert.equal(isPaymentLinkPathSegment("instant"), false);
  assert.equal(isPaymentLinkPathSegment("checkout"), false);
  assert.equal(isPaymentLinkPathSegment("api"), false);
  assert.equal(isCheckoutLinkIdentifier(BODY), true);
  assert.equal(isCheckoutLinkIdentifier(UUID), true);
  assert.equal(isCheckoutLinkIdentifier("receipt"), false);
});

test("hostedPaymentLinkUrl keeps custom domains and rebuilds legacy paths", () => {
  assert.equal(publicIdPrefix(PLINK_ID), PUBLIC_ID_PREFIXES.paymentLink);
  assert.equal(isLegacyPaymentLinkPath("/instant/old"), true);
  assert.equal(isLegacyPaymentLinkPath("/product/old"), true);
  assert.equal(isLegacyPaymentLinkPath(`/${BODY}`), false);
  assert.equal(isCanonicalPaymentLinkPath(`/${BODY}`), true);
  assert.equal(isCanonicalPaymentLinkPath(`/${BODY}/extra`), false);
  assert.equal(isCanonicalPaymentLinkPath("/instant/old"), false);

  assert.equal(
    buildPaymentLinkCheckoutUrl(PLINK_ID, "https://pay.example.com/"),
    `https://pay.example.com/${BODY}`,
  );
  assert.equal(
    hostedPaymentLinkUrl(PLINK_ID, `https://shop.example.com/${BODY}`),
    `https://shop.example.com/${BODY}`,
  );
  assert.equal(
    hostedPaymentLinkUrl(PLINK_ID, `https://shop.example.com/instant/${PLINK_ID}`),
    `https://shop.example.com/${BODY}`,
  );
  assert.equal(hostedPaymentLinkUrl(PLINK_ID, "not a url"), `${DEFAULT_PAY_ORIGIN}/${BODY}`);
  assert.equal(hostedPaymentLinkUrl(PLINK_ID), `${DEFAULT_PAY_ORIGIN}/${BODY}`);
});

const REQ_ID = `${PUBLIC_ID_PREFIXES.paymentRequest}${BODY}`;
const REFUND_ID = `${PUBLIC_ID_PREFIXES.refund}${BODY}`;
const PROD_ID = `${PUBLIC_ID_PREFIXES.product}${BODY}`;
const PAYOUT_ID = `${PUBLIC_ID_PREFIXES.payout}${BODY}`;

test("payment-request ids are not classified as refunds (re_ vs req_)", () => {
  assert.equal(publicIdPrefix(REQ_ID), PUBLIC_ID_PREFIXES.paymentRequest);
  assert.equal(publicIdPrefix(REQ_ID.toUpperCase()), PUBLIC_ID_PREFIXES.paymentRequest);
  assert.equal(isPublicId(REQ_ID), true);
  assert.equal(isPublicId(REQ_ID, PUBLIC_ID_PREFIXES.paymentRequest), true);
  assert.equal(isPublicId(REQ_ID, PUBLIC_ID_PREFIXES.refund), false);
  assert.equal(formatPublicId(REQ_ID), REQ_ID);
  assert.equal(formatPublicId(`Req_${BODY.toLowerCase()}`), REQ_ID);
  assert.equal(publicIdsMatch(REQ_ID, formatPublicId(REQ_ID)), true);
});

test("refund ids still resolve to re_ and do not steal req_", () => {
  assert.equal(publicIdPrefix(REFUND_ID), PUBLIC_ID_PREFIXES.refund);
  assert.equal(isPublicId(REFUND_ID), true);
  assert.equal(isPublicId(REFUND_ID, PUBLIC_ID_PREFIXES.refund), true);
  assert.equal(isPublicId(REFUND_ID, PUBLIC_ID_PREFIXES.paymentRequest), false);
  assert.equal(formatPublicId(REFUND_ID), REFUND_ID);
});

test("product and payout prefixes do not collide (po_ vs prod_)", () => {
  assert.equal(publicIdPrefix(PROD_ID), PUBLIC_ID_PREFIXES.product);
  assert.equal(publicIdPrefix(PAYOUT_ID), PUBLIC_ID_PREFIXES.payout);
  assert.equal(isPublicId(PROD_ID, PUBLIC_ID_PREFIXES.product), true);
  assert.equal(isPublicId(PROD_ID, PUBLIC_ID_PREFIXES.payout), false);
  assert.equal(isPublicId(PAYOUT_ID, PUBLIC_ID_PREFIXES.payout), true);
  assert.equal(formatPublicId(PROD_ID), PROD_ID);
  assert.equal(formatPublicId(PAYOUT_ID), PAYOUT_ID);
});
