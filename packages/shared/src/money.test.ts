import assert from "node:assert/strict";
import { test } from "node:test";
import {
  MONEY_MAX_MINOR,
  assertAmountMinor,
  currencyExponent,
  fromLedgerMajor,
  isAmountMinor,
  majorToMinorUnits,
  minorToMajorUnits,
  parseCheckoutCurrencyCode,
  toLedgerMajor,
} from "./index.js";

test("currency exponents treat XOF as zero-decimal and cards as cents", () => {
  assert.equal(currencyExponent("XOF"), 0);
  assert.equal(currencyExponent("USD"), 2);
  assert.equal(currencyExponent("EUR"), 2);
  assert.equal(currencyExponent("GBP"), 0);
  assert.equal(parseCheckoutCurrencyCode("USD"), "USD");
  assert.equal(parseCheckoutCurrencyCode("bogus"), "XOF");
});

test("assertAmountMinor accepts chargeable integers and rejects unsafe values", () => {
  assert.deepEqual(assertAmountMinor(10000, "XOF"), {
    ok: true,
    amountMinor: 10000,
  });
  assert.equal(assertAmountMinor(10.5, "XOF").ok, false);
  assert.equal(assertAmountMinor(0, "XOF").ok, false);
  assert.equal(assertAmountMinor(0, "XOF", { allowZero: true }).ok, true);
  assert.equal(assertAmountMinor(MONEY_MAX_MINOR + 1, "XOF").ok, false);
  assert.equal(isAmountMinor(100), true);
  assert.equal(isAmountMinor(1.25), false);
});

test("ledger conversion is identity for XOF and cents for USD", () => {
  assert.equal(toLedgerMajor(10000, "XOF"), 10000);
  assert.equal(fromLedgerMajor(10000, "XOF"), 10000);
  assert.equal(minorToMajorUnits(10000, "USD"), 100);
  assert.equal(majorToMinorUnits(100, "USD"), 10000);
  assert.equal(toLedgerMajor(2500, "USD"), 25);
});
