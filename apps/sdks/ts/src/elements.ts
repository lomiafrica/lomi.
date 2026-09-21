/**
 * lomi. Payment Elements
 *
 * Client-side payment form components for lomi. payments.
 * Fully white-labeled - no third-party branding exposed.
 *
 * @example
 * ```ts
 * import { loadLomi } from '@lomi./sdk';
 * import type { Lomi, LomiElements } from '@lomi./sdk';
 *
 * const lomi: Lomi = await loadLomi('lomi_pk_...');
 * const elements: LomiElements = lomi.elements({ clientSecret });
 * const paymentElement = elements.create('payment');
 * paymentElement.mount('#payment-element');
 * ```
 */

import { loadStripe } from "@stripe/stripe-js";
import type {
  Stripe,
  StripeElements,
  StripeElementsOptions,
  StripePaymentElement,
  StripePaymentElementOptions,
  PaymentIntentResult,
  SetupIntentResult,
  ConfirmPaymentData,
} from "@stripe/stripe-js";

// White-labeled type aliases - developers see "Lomi" not "Stripe"
/** White-labeled Stripe instance for card / Payment Element flows. */
export type Lomi = Stripe;
export type LomiElements = StripeElements;
export type LomiElementsOptions = StripeElementsOptions;
export type LomiPaymentResult = PaymentIntentResult;
export type LomiSetupResult = SetupIntentResult;
export type LomiConfirmPaymentData = ConfirmPaymentData;
export type LomiPaymentElement = StripePaymentElement;
export type LomiPaymentElementCreateOptions = StripePaymentElementOptions;
export type LomiPaymentElementTheme =
  | "light"
  | "dark"
  | "flat"
  | "stripe"
  | "night";
export type LomiBillingAddressCollection = "auto" | "never";

export interface CreateLomiElementsOptions {
  clientSecret: string;
  theme?: LomiPaymentElementTheme;
  borderRadiusPx?: number;
}

export interface CreateLomiPaymentElementOptions {
  billingAddress?: LomiBillingAddressCollection;
}

function normalizeThemeForStripe(
  theme?: LomiPaymentElementTheme,
): "stripe" | "night" | "flat" {
  if (theme === "dark" || theme === "night") return "night";
  if (theme === "flat") return "flat";
  return "stripe";
}

/**
 * lomi. Platform Key
 *
 * Internal platform key used for payment processing infrastructure.
 * This is an immutable value - SDK updates required if changed.
 */
const LOMI_PLATFORM_KEY =
  "pk_live_51Ig94GGwgS0qnVOVpvSCeUiAf5RfjFFcv4alY8MpuB1M3X7gz3gMdcAoUA7OjG6e0Y2MAOtCsaYqkdqHT0zhTcC800gRyH9ssq";

// Singleton promise to avoid multiple loads
let lomiPromise: Promise<Lomi | null> | null = null;

/**
 * Load and initialize lomi. for payment processing.
 *
 * **Note:** Card Payment Elements run on lomi.'s PCI platform infrastructure.
 * Your `lomi_pk_…` publishable key is validated for format but initialization
 * uses the lomi. platform Stripe account — merchants never handle raw PAN data.
 *
 * @param publishableKey - Your lomi. publishable key (`lomi_pk_…`)
 * @returns Promise resolving to a Lomi (Stripe-backed) instance for Elements
 *
 * @example
 * ```ts
 * import { loadLomi } from '@lomi./sdk';
 * import type { Lomi, LomiElements } from '@lomi./sdk';
 *
 * const lomi: Lomi | null = await loadLomi('lomi_pk_your_key');
 *
 * if (lomi) {
 *   // Create elements with client secret from your server
 *   const elements: LomiElements = lomi.elements({
 *     clientSecret: 'pi_xxx_secret_xxx'
 *   });
 *
 *   // Create and mount payment element
 *   const paymentElement = elements.create('payment');
 *   paymentElement.mount('#payment-element');
 *
 *   // Handle form submission
 *   const { error } = await lomi.confirmPayment({
 *     elements,
 *     confirmParams: { return_url: 'https://yoursite.com/success' }
 *   });
 * }
 * ```
 */
export async function loadLomi(publishableKey: string): Promise<Lomi | null> {
  // Validate lomi. key format
  if (!publishableKey || !publishableKey.startsWith("lomi_pk_")) {
    console.warn(
      '[Lomi] Invalid key format. Keys should start with "lomi_pk_"',
    );
  }

  // Initialize only once (singleton pattern)
  if (!lomiPromise) {
    lomiPromise = loadStripe(LOMI_PLATFORM_KEY);
  }

  return lomiPromise;
}

/**
 * Creates a Lomi elements instance with normalized light/dark/flat theme naming.
 */
export function createLomiElements(
  lomi: Lomi,
  options: CreateLomiElementsOptions,
): LomiElements {
  const elementsOptions: LomiElementsOptions = {
    clientSecret: options.clientSecret,
    appearance: Object.assign(
      {},
      {
        theme: normalizeThemeForStripe(options.theme),
      },
      options.borderRadiusPx !== undefined
        ? {
            variables: {
              borderRadius: `${options.borderRadiusPx}px`,
            },
          }
        : {},
    ),
  };
  return lomi.elements(elementsOptions);
}

/**
 * Creates a Payment Element with optional billing-address collection override.
 * Use `billingAddress: 'never'` to hide country/address selector in UI.
 */
export function createLomiPaymentElement(
  elements: LomiElements,
  options?: CreateLomiPaymentElementOptions,
): LomiPaymentElement {
  const paymentOptions: LomiPaymentElementCreateOptions = {
    fields: {
      billingDetails: {
        address: options?.billingAddress ?? "auto",
      },
    },
  };
  return elements.create("payment", paymentOptions);
}

/**
 * Namespace export for alternative import style
 */
export const lomi = {
  load: loadLomi,
  createElements: createLomiElements,
  createPaymentElement: createLomiPaymentElement,
};

// Default export
export default loadLomi;
