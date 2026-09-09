import assert from "node:assert/strict";
import { test } from "node:test";
import {
  calculateProcessingFeeSurcharge,
  findProcessingFeeRate,
  getCheckoutHeadlineAmount,
  mapCheckoutMethodToFeeKey,
  type ProcessingFeeRate,
} from "./processing-fee.js";

const WAVE_RATE: ProcessingFeeRate = {
  provider_code: "WAVE",
  payment_method_code: "MOBILE_MONEY",
  percentage: 2.9,
  fixed_amount: 200,
  micro_threshold: 1000,
};

test("mapCheckoutMethodToFeeKey normalizes hosted method ids", () => {
  assert.deepEqual(mapCheckoutMethodToFeeKey("wave"), {
    provider: "WAVE",
    paymentMethod: "MOBILE_MONEY",
  });
  assert.deepEqual(mapCheckoutMethodToFeeKey("STRIPE"), {
    provider: "STRIPE",
    paymentMethod: "CARDS",
  });
  assert.deepEqual(mapCheckoutMethodToFeeKey("cards"), {
    provider: "STRIPE",
    paymentMethod: "CARDS",
  });
  assert.deepEqual(mapCheckoutMethodToFeeKey("spi"), {
    provider: "SPI",
    paymentMethod: "BANK_TRANSFER",
  });
  assert.equal(mapCheckoutMethodToFeeKey("bitcoin"), null);
  assert.equal(mapCheckoutMethodToFeeKey(null), null);
});

test("findProcessingFeeRate matches provider and rail", () => {
  assert.deepEqual(findProcessingFeeRate([WAVE_RATE], "wave"), WAVE_RATE);
  assert.equal(findProcessingFeeRate([WAVE_RATE], "cards"), null);
  assert.equal(findProcessingFeeRate(undefined, "wave"), null);
});

test("calculateProcessingFeeSurcharge grosses up so the merchant nets the base", () => {
  assert.equal(calculateProcessingFeeSurcharge(10000, WAVE_RATE, "XOF"), 505);
  assert.equal(
    calculateProcessingFeeSurcharge(100, WAVE_RATE, "XOF"),
    3,
  );
  assert.equal(
    Number(
      calculateProcessingFeeSurcharge(
        100,
        { ...WAVE_RATE, percentage: 2, fixed_amount: 0.4, micro_threshold: 1 },
        "USD",
      ).toFixed(2),
    ),
    2.45,
  );
  assert.equal(
    calculateProcessingFeeSurcharge(10000, { ...WAVE_RATE, percentage: 100 }, "XOF"),
    0,
  );
  assert.equal(calculateProcessingFeeSurcharge(0, WAVE_RATE, "XOF"), 0);
});

test("getCheckoutHeadlineAmount switches to total once a surcharge exists", () => {
  assert.equal(
    getCheckoutHeadlineAmount({ total: 10505, processingFee: 505 }, 10000),
    10505,
  );
  assert.equal(
    getCheckoutHeadlineAmount({ total: 10000, processingFee: 0 }, 10000),
    10000,
  );
});
