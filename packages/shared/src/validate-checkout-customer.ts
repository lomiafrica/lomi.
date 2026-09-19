import { isValidPhoneNumber, toCountryCode } from "./phone.js";
import { resolveStripeCountry } from "./country.js";

export type CheckoutCustomFieldType =
  "text" | "email" | "url" | "checkbox" | "terms";

export interface CheckoutCustomFieldDefinition {
  id: string;
  type: CheckoutCustomFieldType;
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
}

export interface ResolvedCheckoutFormFlags {
  requireBillingAddress: boolean;
  requireEmail: boolean;
  requirePhone: boolean;
  requireName: boolean;
  showEmail: boolean;
  showPhone: boolean;
  showName: boolean;
  customFields: CheckoutCustomFieldDefinition[];
}

export interface MergedCustomerData {
  email: string;
  name: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  whatsappNumber: string;
  country: string;
  city: string;
  address: string;
  postalCode: string;
}

export interface ValidateCheckoutCustomerOptions {
  merged: MergedCustomerData;
  resolvedForm: ResolvedCheckoutFormFlags;
  customFieldValues: Record<string, string>;
  /** When true, phone is required even if the form marks it optional (mobile money). */
  forceRequirePhone?: boolean;
}

export type CheckoutValidationField =
  "name" | "email" | "phone" | "billing" | "custom";

export interface ValidateCheckoutCustomerResult {
  valid: boolean;
  errorCode?: string;
  errorMessage?: string;
  field?: CheckoutValidationField;
  customFieldId?: string;
}

export interface ValidateCheckoutContactFieldsOptions {
  merged: MergedCustomerData;
  resolvedForm: ResolvedCheckoutFormFlags;
  customFieldValues: Record<string, string>;
  paymentMethod?: string | null;
}

export interface CheckoutCustomerFormDetails {
  email?: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  whatsappNumber?: string;
  country?: string;
  city?: string;
  address?: string;
  postalCode?: string;
}

/** Structural Stripe Express Checkout confirm payload (avoids @stripe peer dep). */
export interface ExpressCheckoutConfirmLike {
  billingDetails?: {
    name?: string | null;
    email?: string | null;
    phone?: string | null;
    address?: {
      country?: string | null;
      city?: string | null;
      line1?: string | null;
      postal_code?: string | null;
    } | null;
  } | null;
  /** Stripe Express Checkout shipping address shape. */
  shippingAddress?: {
    name?: string | null;
    address?: {
      line1?: string | null;
      line2?: string | null;
      city?: string | null;
      state?: string | null;
      postal_code?: string | null;
      country?: string | null;
    } | null;
  } | null;
}

const MOBILE_MONEY_PAYMENT_METHODS = new Set(["wave", "mtn"]);

/** Whether phone must be present for the given payment method and form flags. */
export function isPhoneRequiredForPayment(
  resolvedForm: ResolvedCheckoutFormFlags,
  paymentMethod: string | null | undefined,
): boolean {
  if (!resolvedForm.showPhone) {
    return false;
  }
  if (resolvedForm.requirePhone) {
    return true;
  }
  const method = paymentMethod?.toLowerCase();
  return method != null && MOBILE_MONEY_PAYMENT_METHODS.has(method);
}

/** Validates contact/custom fields with payment-method-aware optional phone rules. */
export function validateCheckoutContactFields({
  merged,
  resolvedForm,
  customFieldValues,
  paymentMethod,
}: ValidateCheckoutContactFieldsOptions): ValidateCheckoutCustomerResult {
  return validateCheckoutCustomer({
    merged,
    resolvedForm,
    customFieldValues,
    forceRequirePhone: isPhoneRequiredForPayment(resolvedForm, paymentMethod),
  });
}

function pickNonEmpty(...values: (string | undefined | null)[]): string {
  for (const value of values) {
    if (value != null && value.trim() !== "") {
      return value.trim();
    }
  }
  return "";
}

export function mergeCustomerSources(
  event: ExpressCheckoutConfirmLike,
  form: CheckoutCustomerFormDetails,
  detectedCountry?: string,
): MergedCustomerData {
  const eventBillingDetails = event.billingDetails;
  const eventShippingAddress = event.shippingAddress?.address;

  const shippingLine1 = eventShippingAddress?.line1;
  const shippingCity = eventShippingAddress?.city;
  const shippingCountry = eventShippingAddress?.country;
  const shippingPostalCode = eventShippingAddress?.postal_code;

  const formName =
    form.name?.trim() ||
    `${form.firstName || ""} ${form.lastName || ""}`.trim();

  const customerName = pickNonEmpty(eventBillingDetails?.name, formName);
  const nameParts = customerName.split(/\s+/).filter(Boolean);
  const firstName = nameParts[0] || form.firstName || "";
  const lastName = nameParts.slice(1).join(" ") || form.lastName || "";

  const customerPhone = pickNonEmpty(
    eventBillingDetails?.phone,
    form.phoneNumber,
  );

  const whatsappNumber =
    form.whatsappNumber &&
    form.phoneNumber &&
    form.whatsappNumber !== form.phoneNumber
      ? form.whatsappNumber
      : customerPhone;

  const rawCountry = pickNonEmpty(
    eventBillingDetails?.address?.country,
    shippingCountry,
    form.country,
    detectedCountry,
  );

  return {
    email: pickNonEmpty(eventBillingDetails?.email, form.email),
    name: customerName,
    firstName,
    lastName,
    phoneNumber: customerPhone,
    whatsappNumber,
    country: resolveStripeCountry(rawCountry, detectedCountry),
    city: pickNonEmpty(
      eventBillingDetails?.address?.city,
      shippingCity,
      form.city,
    ),
    address: pickNonEmpty(
      eventBillingDetails?.address?.line1,
      shippingLine1,
      form.address,
    ),
    postalCode: pickNonEmpty(
      eventBillingDetails?.address?.postal_code,
      shippingPostalCode,
      form.postalCode,
    ),
  };
}

export function validateCheckoutCustomer({
  merged,
  resolvedForm,
  customFieldValues,
  forceRequirePhone = false,
}: ValidateCheckoutCustomerOptions): ValidateCheckoutCustomerResult {
  if (resolvedForm.requireName && !merged.name.trim()) {
    return {
      valid: false,
      errorCode: "missing_customer_data",
      errorMessage: "Missing customer information",
      field: "name",
    };
  }

  if (resolvedForm.requireEmail) {
    if (!merged.email || !merged.email.includes("@")) {
      return {
        valid: false,
        errorCode: "missing_customer_data",
        errorMessage: "Missing customer information",
        field: "email",
      };
    }
  }

  const phoneRequired = resolvedForm.requirePhone || forceRequirePhone;

  if (phoneRequired && !merged.phoneNumber.trim()) {
    return {
      valid: false,
      errorCode: "missing_customer_data",
      errorMessage: "Missing customer information",
      field: "phone",
    };
  }

  if (
    merged.phoneNumber.trim() &&
    !isValidPhoneNumber(
      merged.phoneNumber.trim(),
      toCountryCode(merged.country || "CI"),
    )
  ) {
    return {
      valid: false,
      errorCode: "phone_validation_error",
      errorMessage:
        "Please enter a valid phone number for the selected country.",
      field: "phone",
    };
  }

  if (resolvedForm.requireBillingAddress) {
    if (!merged.country || !merged.city || !merged.address) {
      return {
        valid: false,
        errorCode: "missing_billing_address",
        errorMessage: "Billing address is required",
        field: "billing",
      };
    }
  }

  for (const field of resolvedForm.customFields) {
    if (!field.required) continue;
    const value = customFieldValues[field.id];
    if (field.type === "checkbox" || field.type === "terms") {
      if (value !== "true") {
        return {
          valid: false,
          errorCode: "missing_custom_fields",
          errorMessage: "Please complete all required fields",
          field: "custom",
          customFieldId: field.id,
        };
      }
      continue;
    }
    if (!value || value.trim() === "") {
      return {
        valid: false,
        errorCode: "missing_custom_fields",
        errorMessage: "Please complete all required fields",
        field: "custom",
        customFieldId: field.id,
      };
    }
  }

  return { valid: true };
}

export function mergedToCustomerDetailsPatch(
  merged: MergedCustomerData,
): CheckoutCustomerFormDetails {
  return {
    email: merged.email,
    name: merged.name,
    firstName: merged.firstName,
    lastName: merged.lastName,
    phoneNumber: merged.phoneNumber,
    whatsappNumber: merged.whatsappNumber,
    country: merged.country,
    city: merged.city,
    address: merged.address,
    postalCode: merged.postalCode,
  };
}
