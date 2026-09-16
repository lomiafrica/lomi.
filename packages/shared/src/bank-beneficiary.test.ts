import assert from "node:assert/strict";
import { test } from "node:test";
import {
  BANK_BENEFICIARY_ERROR_MESSAGES,
  bankBeneficiaryFieldLayout,
  transferCurrencyForBankCountry,
  validateBankBeneficiary,
} from "./bank-beneficiary.js";

test("CI layout asks for a 24-character account and SWIFT", () => {
  const layout = bankBeneficiaryFieldLayout("ci");
  assert.equal(layout.accountNumberKind, "uemoa_account");
  assert.equal(layout.bankCodeKind, "swift");
  assert.equal(
    validateBankBeneficiary({
      country: "CI",
      bankName: "Ecobank",
      accountName: "KONE Aminata",
      accountNumber: "CI0080100101001234567890",
      bankCode: "ECOCCIAB",
    }),
    null,
  );
  assert.equal(
    validateBankBeneficiary({
      country: "CI",
      bankName: "Ecobank",
      accountName: "KONE Aminata",
      accountNumber: "123",
      bankCode: "ECOCCIAB",
    }),
    BANK_BENEFICIARY_ERROR_MESSAGES.uemoa_account_invalid,
  );
});

test("SN uses the same UEMOA 24-character account and SWIFT layout", () => {
  const layout = bankBeneficiaryFieldLayout("SN");
  assert.equal(layout.accountNumberKind, "uemoa_account");
  assert.equal(layout.bankCodeKind, "swift");
  assert.equal(
    validateBankBeneficiary({
      country: "SN",
      bankName: "Ecobank Senegal",
      accountName: "Ada Lovelace",
      accountNumber: "SN0080100101001234567890",
      bankCode: "ECOCSNDA",
    }),
    null,
  );
  assert.equal(transferCurrencyForBankCountry("SN", "USD"), "XOF");
});

test("US layout asks for a 9-digit routing number", () => {
  const layout = bankBeneficiaryFieldLayout("US");
  assert.equal(layout.branchCodeKind, "routing");
  assert.equal(layout.bankCodeKind, "hidden");
  assert.equal(
    validateBankBeneficiary({
      country: "US",
      bankName: "Chase",
      accountName: "Ada Lovelace",
      accountNumber: "123456789",
      branchCode: "021000021",
    }),
    null,
  );
  assert.equal(
    validateBankBeneficiary({
      country: "US",
      bankName: "Chase",
      accountName: "Ada Lovelace",
      accountNumber: "123456789",
      branchCode: "21",
    }),
    BANK_BENEFICIARY_ERROR_MESSAGES.us_routing_invalid,
  );
});

test("French IBAN is accepted and maps to EUR", () => {
  assert.equal(
    validateBankBeneficiary({
      country: "FR",
      bankName: "BNP",
      accountName: "Ada Lovelace",
      accountNumber: "FR1420041010050500013M02606",
      bankCode: "BNPAFRPP",
    }),
    null,
  );
  assert.equal(transferCurrencyForBankCountry("FR", "XOF"), "EUR");
  assert.equal(transferCurrencyForBankCountry("CI", "USD"), "XOF");
  assert.equal(transferCurrencyForBankCountry("US", "XOF"), "USD");
});
