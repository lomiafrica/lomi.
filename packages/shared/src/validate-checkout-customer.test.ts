import assert from "node:assert/strict";
import { test } from "node:test";
import type {
  MergedCustomerData,
  ResolvedCheckoutFormFlags,
} from "./validate-checkout-customer.js";
import {
  isPhoneRequiredForPayment,
  mergeCustomerSources,
  validateCheckoutContactFields,
  validateCheckoutCustomer,
} from "./validate-checkout-customer.js";

const VALID_CI_MOBILE = "+2250708091011";

function form(
  overrides: Partial<ResolvedCheckoutFormFlags> = {},
): ResolvedCheckoutFormFlags {
  return {
    requireBillingAddress: false,
    requireEmail: true,
    requirePhone: false,
    requireName: true,
    showEmail: true,
    showPhone: true,
    showName: true,
    customFields: [],
    ...overrides,
  };
}

function customer(
  overrides: Partial<MergedCustomerData> = {},
): MergedCustomerData {
  return {
    email: "ada@example.com",
    name: "Ada Lovelace",
    firstName: "Ada",
    lastName: "Lovelace",
    phoneNumber: "",
    whatsappNumber: "",
    country: "CI",
    city: "",
    address: "",
    postalCode: "",
    ...overrides,
  };
}

test("isPhoneRequiredForPayment forces Wave/MTN when the phone field is shown", () => {
  assert.equal(isPhoneRequiredForPayment(form(), "wave"), true);
  assert.equal(isPhoneRequiredForPayment(form(), "MTN"), true);
  assert.equal(isPhoneRequiredForPayment(form(), "cards"), false);
  assert.equal(
    isPhoneRequiredForPayment(form({ showPhone: false }), "wave"),
    false,
  );
  assert.equal(
    isPhoneRequiredForPayment(form({ requirePhone: true }), "cards"),
    true,
  );
});

test("validateCheckoutCustomer reports the first missing required field", () => {
  assert.deepEqual(
    validateCheckoutCustomer({
      merged: customer({ name: "  " }),
      resolvedForm: form(),
      customFieldValues: {},
    }),
    {
      valid: false,
      errorCode: "missing_customer_data",
      errorMessage: "Missing customer information",
      field: "name",
    },
  );

  assert.equal(
    validateCheckoutCustomer({
      merged: customer({ email: "not-an-email" }),
      resolvedForm: form(),
      customFieldValues: {},
    }).field,
    "email",
  );

  assert.equal(
    validateCheckoutCustomer({
      merged: customer(),
      resolvedForm: form(),
      customFieldValues: {},
      forceRequirePhone: true,
    }).field,
    "phone",
  );
});

test("validateCheckoutCustomer rejects invalid phones and incomplete billing", () => {
  assert.deepEqual(
    validateCheckoutCustomer({
      merged: customer({ phoneNumber: "123" }),
      resolvedForm: form(),
      customFieldValues: {},
    }),
    {
      valid: false,
      errorCode: "phone_validation_error",
      errorMessage:
        "Please enter a valid phone number for the selected country.",
      field: "phone",
    },
  );

  assert.equal(
    validateCheckoutCustomer({
      merged: customer({ country: "CI", city: "", address: "" }),
      resolvedForm: form({ requireBillingAddress: true }),
      customFieldValues: {},
    }).errorCode,
    "missing_billing_address",
  );
});

test("required custom fields distinguish checkboxes from text", () => {
  const resolvedForm = form({
    customFields: [
      { id: "terms", type: "terms", label: "Terms", required: true },
      { id: "note", type: "text", label: "Note", required: true },
    ],
  });

  const missingTerms = validateCheckoutCustomer({
    merged: customer(),
    resolvedForm,
    customFieldValues: { terms: "false", note: "hello" },
  });
  assert.equal(missingTerms.customFieldId, "terms");

  const missingNote = validateCheckoutCustomer({
    merged: customer(),
    resolvedForm,
    customFieldValues: { terms: "true", note: "  " },
  });
  assert.equal(missingNote.customFieldId, "note");

  assert.equal(
    validateCheckoutCustomer({
      merged: customer(),
      resolvedForm,
      customFieldValues: { terms: "true", note: "hello" },
    }).valid,
    true,
  );
});

test("validateCheckoutContactFields requires a phone for mobile money", () => {
  const result = validateCheckoutContactFields({
    merged: customer(),
    resolvedForm: form(),
    customFieldValues: {},
    paymentMethod: "wave",
  });
  assert.equal(result.field, "phone");

  assert.equal(
    validateCheckoutContactFields({
      merged: customer({ phoneNumber: VALID_CI_MOBILE }),
      resolvedForm: form(),
      customFieldValues: {},
      paymentMethod: "wave",
    }).valid,
    true,
  );
});

test("mergeCustomerSources prefers Stripe billing details over the form", () => {
  const merged = mergeCustomerSources(
    {
      billingDetails: {
        name: "Grace Hopper",
        email: "grace@example.com",
        phone: VALID_CI_MOBILE,
        address: {
          country: "CI",
          city: "Abidjan",
          line1: "Rue des Perles",
          postal_code: "01 BP 1",
        },
      },
    },
    {
      name: "Form Name",
      email: "form@example.com",
      phoneNumber: "+2250500000000",
      country: "SN",
      city: "Dakar",
      address: "Form street",
    },
  );

  assert.equal(merged.name, "Grace Hopper");
  assert.equal(merged.firstName, "Grace");
  assert.equal(merged.lastName, "Hopper");
  assert.equal(merged.email, "grace@example.com");
  assert.equal(merged.phoneNumber, VALID_CI_MOBILE);
  assert.equal(merged.city, "Abidjan");
  assert.equal(merged.address, "Rue des Perles");
  assert.equal(merged.country, "CI");
});
