import assert from "node:assert/strict";
import { test } from "node:test";
import {
  CARD_RAIL_MIN_EUR_USD,
  CARD_RAIL_MIN_XOF,
  meetsCardRailMinimum,
} from "./pricing.js";

test("card and Tap to Pay rails start at 1000 F CFA", () => {
  assert.equal(CARD_RAIL_MIN_XOF, 1000);
  assert.equal(CARD_RAIL_MIN_EUR_USD, 0.5);
  assert.equal(meetsCardRailMinimum(999, "XOF"), false);
  assert.equal(meetsCardRailMinimum(1000, "XOF"), true);
  assert.equal(meetsCardRailMinimum(1500, "xof"), true);
  assert.equal(meetsCardRailMinimum(0, "XOF"), false);
  assert.equal(meetsCardRailMinimum(0.49, "EUR"), false);
  assert.equal(meetsCardRailMinimum(0.5, "EUR"), true);
  assert.equal(meetsCardRailMinimum(0.5, "USD"), true);
});
