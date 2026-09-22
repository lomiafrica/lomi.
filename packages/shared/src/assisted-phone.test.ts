import assert from "node:assert/strict";
import { test } from "node:test";
import {
  applyAssistedPhone,
  classifyAssistedPhoneField,
  type AssistedDialCountry,
} from "./phone.js";

const CI: AssistedDialCountry = { id: "CI", dial: "225" };
const SN: AssistedDialCountry = { id: "SN", dial: "221" };
const FR: AssistedDialCountry = { id: "FR", dial: "33" };
const RU: AssistedDialCountry = { id: "RU", dial: "7" };
const COUNTRIES = [CI, SN, FR, RU];

test("national assisted fill stays on the selected country", () => {
  assert.deepEqual(applyAssistedPhone("07 12 34 56 78", CI, COUNTRIES), {
    country: CI,
    national: "0712345678",
  });
});

test("a prefill that already uses the selected calling code is not doubled", () => {
  assert.deepEqual(applyAssistedPhone("2250712345678", CI, COUNTRIES), {
    country: CI,
    national: "0712345678",
  });
  assert.deepEqual(applyAssistedPhone("+225 01 60 22 34 01", CI, COUNTRIES), {
    country: CI,
    national: "0160223401",
  });
});

test("a prefill with another calling code replaces the selected country", () => {
  assert.deepEqual(applyAssistedPhone("+221 77 123 45 67", CI, COUNTRIES), {
    country: SN,
    national: "771234567",
  });
  assert.deepEqual(applyAssistedPhone("00221771234567", CI, COUNTRIES), {
    country: SN,
    national: "771234567",
  });
  assert.deepEqual(applyAssistedPhone("221771234567", CI, COUNTRIES), {
    country: SN,
    national: "771234567",
  });
});

test("deleting the national number keeps the selected country", () => {
  assert.deepEqual(applyAssistedPhone("", CI, COUNTRIES), {
    country: CI,
    national: "",
  });
  assert.deepEqual(applyAssistedPhone("07", CI, COUNTRIES), {
    country: CI,
    national: "07",
  });
  assert.deepEqual(applyAssistedPhone("225", CI, COUNTRIES), {
    country: CI,
    national: "225",
  });
});

test("a local number starting with 0 is not read as another country", () => {
  assert.deepEqual(
    applyAssistedPhone("07 12 34 56 78", CI, COUNTRIES).country,
    CI,
  );
});

test("the international field locks the indicator and still accepts another country", () => {
  assert.deepEqual(classifyAssistedPhoneField("+225 07", CI, COUNTRIES), {
    kind: "library",
    value: "+225 07",
  });
  assert.deepEqual(classifyAssistedPhoneField("+22", CI, COUNTRIES), {
    kind: "library",
    value: "+22",
  });
  assert.deepEqual(classifyAssistedPhoneField("2250712345678", CI, COUNTRIES), {
    kind: "library",
    value: "0712345678",
  });
  assert.deepEqual(
    classifyAssistedPhoneField("+221 77 123 45 67", CI, COUNTRIES),
    { kind: "replace", value: "+221771234567" },
  );
});
