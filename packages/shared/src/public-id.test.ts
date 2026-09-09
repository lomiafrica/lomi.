import assert from "node:assert/strict";
import { test } from "node:test";
import {
  PUBLIC_ID_PREFIXES,
  formatPublicId,
  isPublicId,
  publicIdPrefix,
  publicIdsMatch,
} from "./public-id.ts";

const BODY = "23456789ABCDEF";
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
