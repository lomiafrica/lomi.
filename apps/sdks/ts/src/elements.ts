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
  StripeCardNumberElement,
  StripeCardExpiryElement,
  StripeCardCvcElement,
  StripeElementStyle,
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
export type LomiCardNumberElement = StripeCardNumberElement;
export type LomiCardExpiryElement = StripeCardExpiryElement;
export type LomiCardCvcElement = StripeCardCvcElement;

const LOMI_CARD_FONT =
  "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";

const LOMI_CARD_LIGHT = {
  text: "#111827",
  placeholder: "#6b7280",
  background: "#ffffff",
  border: "#d1d5db",
  danger: "#ef4444",
  focus: "#4568ff",
};

const LOMI_CARD_DARK = {
  text: "#f4f4f5",
  placeholder: "#a1a1aa",
  background: "#18181b",
  border: "#3f3f46",
  danger: "#f87171",
  focus: "#4568ff",
};

/** Colors, type, radius, and height. Pass this from web or mirror it on mobile `cardStyle`. */
export interface LomiCardAppearance {
  theme?: "light" | "dark";
  colorText?: string;
  colorPlaceholder?: string;
  colorBackground?: string;
  colorBorder?: string;
  colorDanger?: string;
  colorFocus?: string;
  borderRadiusPx?: number;
  fontFamily?: string;
  fontSizePx?: number;
  fieldHeightPx?: number;
  pay?: LomiPayButtonAppearance;
}

export interface LomiPayButtonAppearance {
  background?: string;
  color?: string;
  borderRadiusPx?: number;
  heightPx?: number;
  fontSizePx?: number;
  fontFamily?: string;
  label?: string;
}

export function lomiCardStyle(
  appearance?: LomiCardAppearance,
): StripeElementStyle {
  const preset =
    appearance?.theme === "dark" ? LOMI_CARD_DARK : LOMI_CARD_LIGHT;
  const fontSize = appearance?.fontSizePx ?? 13;
  const text = appearance?.colorText ?? preset.text;
  const placeholder = appearance?.colorPlaceholder ?? preset.placeholder;
  const danger = appearance?.colorDanger ?? preset.danger;
  return {
    base: {
      fontSize: `${fontSize}px`,
      color: text,
      backgroundColor: appearance?.colorBackground ?? preset.background,
      fontWeight: "400",
      fontFamily: appearance?.fontFamily ?? LOMI_CARD_FONT,
      lineHeight: "20px",
      "::placeholder": {
        color: placeholder,
        fontSize: `${Math.max(fontSize, 14)}px`,
        fontWeight: "400",
      },
    },
    invalid: {
      color: danger,
      iconColor: danger,
    },
  };
}

/** Same type as hosted checkout: number, then expiry and CVC. */
export const lomiCardElementStyle: StripeElementStyle = lomiCardStyle();

export interface LomiCardFieldTargets {
  number: string | HTMLElement;
  expiry: string | HTMLElement;
  cvc: string | HTMLElement;
}

export interface LomiCardFields {
  number: LomiCardNumberElement;
  expiry: LomiCardExpiryElement;
  cvc: LomiCardCvcElement;
}
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
 * lomi. platform publishable keys for Stripe.js.
 * Merchants pass `lomi_pk_test_…` / `lomi_pk_live_…`; these stay internal.
 */
const LOMI_PLATFORM_KEY_LIVE =
  "pk_live_51Ig94GGwgS0qnVOVpvSCeUiAf5RfjFFcv4alY8MpuB1M3X7gz3gMdcAoUA7OjG6e0Y2MAOtCsaYqkdqHT0zhTcC800gRyH9ssq";
const LOMI_PLATFORM_KEY_TEST =
  "pk_test_51Ig94GGwgS0qnVOVCTLJtrdam3tbuKhsLk931ddn9oYaQ2gDn768IDGJ6cgV0EJ1zfNsJpVURjVIl40UNo1R4KDz00lXLCcGXV";

function resolveLomiPlatformPublishableKey(publishableKey: string): string {
  return publishableKey.startsWith("lomi_pk_test_")
    ? LOMI_PLATFORM_KEY_TEST
    : LOMI_PLATFORM_KEY_LIVE;
}

const lomiPromiseByPlatformKey = new Map<string, Promise<Lomi | null>>();

/**
 * Load and initialize lomi. for payment processing.
 *
 * **Note:** Card Payment Elements run on lomi.'s PCI platform infrastructure.
 * Your `lomi_pk_test_…` / `lomi_pk_live_…` key selects test or live Elements.
 * Merchants never handle raw PAN data.
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
  if (!publishableKey || !publishableKey.startsWith("lomi_pk_")) {
    console.warn(
      '[Lomi] Invalid key format. Keys should start with "lomi_pk_"',
    );
  }

  const platformKey = resolveLomiPlatformPublishableKey(publishableKey);
  let pending = lomiPromiseByPlatformKey.get(platformKey);
  if (!pending) {
    pending = loadStripe(platformKey);
    lomiPromiseByPlatformKey.set(platformKey, pending);
  }

  registerWalletDomain(publishableKey);
  return pending;
}

function hasWindow(
  host: typeof globalThis,
): host is typeof globalThis & { window: Window & typeof globalThis } {
  return "window" in host && host.window != null;
}

function hasDocument(
  host: typeof globalThis,
): host is typeof globalThis & { document: Document } {
  return "document" in host && host.document != null;
}

function registerWalletDomain(publishableKey: string): void {
  if (!hasWindow(globalThis)) return;
  const host = globalThis.window.location.hostname;
  if (
    !host ||
    host === "localhost" ||
    host === "127.0.0.1" ||
    !host.includes(".")
  ) {
    return;
  }
  const base = publishableKey.startsWith("lomi_pk_test_")
    ? "https://sandbox.api.lomi.africa"
    : "https://api.lomi.africa";
  void fetch(`${base}/elements/domains`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": publishableKey,
    },
    body: JSON.stringify({ domain: host }),
  }).catch(() => undefined);
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

/** Elements group for the split card fields. Do not pass a client secret here. */
export function createLomiCardElements(lomi: Lomi): LomiElements {
  return lomi.elements();
}

function isDomNode(target: string | HTMLElement): target is HTMLElement {
  return typeof target !== "string";
}

function cardNode(target: string | HTMLElement): HTMLElement | null {
  if (!hasDocument(globalThis)) return null;
  if (isDomNode(target)) return target;
  return globalThis.document.querySelector(target);
}

/** Paints the field chrome around the iframes. Stripe cannot style that border. */
export function applyLomiCardChrome(
  targets: LomiCardFieldTargets,
  appearance?: LomiCardAppearance,
): void {
  const preset =
    appearance?.theme === "dark" ? LOMI_CARD_DARK : LOMI_CARD_LIGHT;
  const background = appearance?.colorBackground ?? preset.background;
  const border = appearance?.colorBorder ?? preset.border;
  const focus = appearance?.colorFocus ?? preset.focus;
  const radius = appearance?.borderRadiusPx ?? 4;
  const height = appearance?.fieldHeightPx ?? 40;
  const boxes = [targets.number, targets.expiry, targets.cvc]
    .map(cardNode)
    .filter((node): node is HTMLElement => node !== null);

  boxes.forEach((node, index) => {
    node.style.background = background;
    node.style.borderColor = border;
    node.style.height = `${height}px`;
    node.style.setProperty("--lomi-card-focus", focus);
    if (index === 0) {
      node.style.borderRadius = `${radius}px ${radius}px 0 0`;
    } else if (index === 1) {
      node.style.borderRadius = `0 0 0 ${radius}px`;
    } else {
      node.style.borderRadius = `0 0 ${radius}px 0`;
    }
  });
}

/** Mounts the hosted-checkout card stack. Card data stays in the iframe. */
export function mountLomiCardFields(
  elements: LomiElements,
  targets: LomiCardFieldTargets,
  appearance?: LomiCardAppearance,
): LomiCardFields {
  const style = lomiCardStyle(appearance);
  const number = elements.create("cardNumber", {
    disableLink: true,
    showIcon: false,
    style,
    placeholder: "1234 1234 1234 1234",
  });
  const expiry = elements.create("cardExpiry", {
    style,
    placeholder: "MM / YY",
  });
  const cvc = elements.create("cardCvc", {
    style,
    placeholder: "CVC",
  });
  number.mount(targets.number);
  expiry.mount(targets.expiry);
  cvc.mount(targets.cvc);
  applyLomiCardChrome(targets, appearance);
  return { number, expiry, cvc };
}

/** Apple Pay and Google Pay buttons. They keep Apple and Google's own look. */
export function mountLomiExpressCheckout(
  lomi: Lomi,
  clientSecret: string,
  target: string | HTMLElement,
): LomiElements {
  const elements = lomi.elements({ clientSecret });
  const wallets = elements.create("expressCheckout", {
    paymentMethods: {
      applePay: "always",
      googlePay: "always",
      link: "never",
    },
    buttonTheme: {
      applePay: "black",
      googlePay: "black",
    },
    layout: {
      maxColumns: 1,
      overflow: "never",
    },
  });
  wallets.mount(target);
  return elements;
}

export interface LomiCardBrandIcon {
  brand: string;
  src: string;
  alt: string;
}

const LOMI_CARD_BRAND_SETS: LomiCardBrandIcon[][] = [
  [
    { brand: "visa", src: "/payment_channels/checkout_visa.webp", alt: "Visa" },
    {
      brand: "mastercard",
      src: "/payment_channels/checkout_mastercard.webp",
      alt: "Mastercard",
    },
  ],
  [
    { brand: "amex", src: "/payment_channels/checkout_amex.webp", alt: "Amex" },
    {
      brand: "discover",
      src: "/payment_channels/checkout_discovery.webp",
      alt: "Discovery",
    },
  ],
  [
    {
      brand: "unknown",
      src: "/payment_channels/checkout_gim.webp",
      alt: "GIM",
    },
    {
      brand: "unionpay",
      src: "/payment_channels/checkout_unionpay.webp",
      alt: "UnionPay",
    },
  ],
];

export interface LomiCardBrandController {
  setBrand: (brand: string | null) => void;
  stop: () => void;
}

function paintBrandIcons(
  container: HTMLElement,
  icons: LomiCardBrandIcon[],
): void {
  container.replaceChildren(
    ...icons.map((icon) => {
      const image = document.createElement("img");
      image.src = icon.src;
      image.alt = icon.alt;
      image.width = 24;
      image.height = 24;
      return image;
    }),
  );
}

/** Rotates Visa, Mastercard, and the other marks until a brand is recognized. */
export function mountLomiCardBrands(
  container: HTMLElement,
  icons?: LomiCardBrandIcon[][],
): LomiCardBrandController {
  const sets = icons && icons.length > 0 ? icons : LOMI_CARD_BRAND_SETS;
  let index = 0;
  let detected: string | null = null;
  const timer = window.setInterval(() => {
    if (detected) return;
    index = (index + 1) % sets.length;
    container.classList.add("is-fading");
    window.setTimeout(() => {
      paintBrandIcons(container, sets[index] ?? []);
      container.classList.remove("is-fading");
    }, 180);
  }, 8000);

  paintBrandIcons(container, sets[0] ?? []);

  return {
    setBrand(brand) {
      const normalized = brand && brand !== "unknown" ? brand : null;
      detected = normalized;
      if (!normalized) {
        paintBrandIcons(container, sets[index] ?? []);
        return;
      }
      const match = sets.flat().find((icon) => icon.brand === normalized);
      paintBrandIcons(container, match ? [match] : (sets[0] ?? []));
    },
    stop() {
      window.clearInterval(timer);
    },
  };
}

/** Paints the Pay button. Text flips white or black from the background, same as checkout. */
export function applyLomiPayButton(
  button: HTMLElement,
  appearance?: LomiCardAppearance,
): void {
  const pay = appearance?.pay;
  const background = pay?.background ?? "#121317";
  const foreground = pay?.color ?? payButtonForeground(background);
  const lightLabel = foreground === "#121317";
  const radius = pay?.borderRadiusPx ?? appearance?.borderRadiusPx ?? 4;
  button.style.background = background;
  button.style.color = foreground;
  button.style.borderRadius = `${radius}px`;
  button.style.height =
    pay?.heightPx !== undefined ? `${pay.heightPx}px` : "3.55rem";
  button.style.fontSize = `${pay?.fontSizePx ?? 20}px`;
  button.style.fontWeight = "500";
  button.style.letterSpacing = "-0.022em";
  button.style.fontFamily =
    pay?.fontFamily ??
    '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, "Segoe UI", sans-serif';
  button.style.boxShadow = lightLabel
    ? "inset 0 1px 0 rgba(255,255,255,0.55)"
    : "inset 0 1px 0 rgba(255,255,255,0.14)";
  button.style.border = lightLabel ? "1px solid #d6d3d1" : "0";
  if (pay?.label) button.textContent = pay.label;
}

function payButtonForeground(backgroundColor: string): "#121317" | "#ffffff" {
  const normalized = backgroundColor.trim().replace(/^#/, "");
  const hex =
    normalized.length === 3
      ? normalized
          .split("")
          .map((channel) => channel + channel)
          .join("")
      : normalized;
  if (hex.length !== 6) return "#ffffff";
  const channels = [0, 2, 4].map((start) =>
    Number.parseInt(hex.slice(start, start + 2), 16),
  );
  if (channels.some((channel) => Number.isNaN(channel))) return "#ffffff";
  const luminance = channels.reduce((sum, channel, index) => {
    const srgb = channel / 255;
    const linear =
      srgb <= 0.03928 ? srgb / 12.92 : ((srgb + 0.055) / 1.055) ** 2.4;
    return sum + linear * [0.2126, 0.7152, 0.0722][index]!;
  }, 0);
  return luminance > 0.55 ? "#121317" : "#ffffff";
}

/**
 * Namespace export for alternative import style
 */
export const lomi = {
  load: loadLomi,
  createElements: createLomiElements,
  createPaymentElement: createLomiPaymentElement,
  createCardElements: createLomiCardElements,
  mountCardFields: mountLomiCardFields,
  mountExpressCheckout: mountLomiExpressCheckout,
  cardStyle: lomiCardStyle,
  applyCardChrome: applyLomiCardChrome,
  mountCardBrands: mountLomiCardBrands,
  applyPayButton: applyLomiPayButton,
};

// Default export
export default loadLomi;
