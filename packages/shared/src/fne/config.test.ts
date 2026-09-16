import assert from "node:assert/strict";
import { test } from "node:test";
import {
  FNE_KOMPTO_FEATURE_FLAG,
  KOMPTO_DEFAULT_BASE_URL,
  readKomptoConfig,
  redactKomptoConfig,
} from "./config.js";

test("readKomptoConfig defaults to disabled without requiring a key", () => {
  const config = readKomptoConfig({});
  assert.equal(config.enabled, false);
  assert.equal(config.apiKey, null);
  assert.equal(config.baseUrl, KOMPTO_DEFAULT_BASE_URL);
});

test("readKomptoConfig requires KOMPTO_API_KEY when the flag is on", () => {
  assert.throws(
    () => readKomptoConfig({ FNE_KOMPTO_ENABLED: "true" }),
    /KOMPTO_API_KEY/,
  );
});

test("readKomptoConfig accepts vite flag alias and trims base URL", () => {
  const config = readKomptoConfig({
    VITE_FNE_KOMPTO_ENABLED: "true",
    KOMPTO_API_KEY: " test-kompto-key ",
    KOMPTO_BASE_URL: "https://app.kompto.com/",
  });
  assert.equal(config.enabled, true);
  assert.equal(config.apiKey, "test-kompto-key");
  assert.equal(config.baseUrl, "https://app.kompto.com");
});

test("redactKomptoConfig never includes the raw API key", () => {
  const redacted = redactKomptoConfig(
    readKomptoConfig({
      FNE_KOMPTO_ENABLED: "1",
      KOMPTO_API_KEY: "test-kompto-key",
    }),
  );
  assert.equal(redacted.apiKey, "redacted");
  assert.equal(redacted.featureFlag, FNE_KOMPTO_FEATURE_FLAG);
  assert.equal(JSON.stringify(redacted).includes("test-kompto-key"), false);
});
