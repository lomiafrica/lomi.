export const DEFAULT_CHECKOUT_BASE_URL = "https://checkout.lomi.africa";
export const DEFAULT_MAX_WIDTH = "500px";
export const DEFAULT_MODAL_HEIGHT = "85vh";
export const DEFAULT_MODAL_HEIGHT_DESKTOP = "90vh";
export const OVERLAY_ID = "lomi-checkout-overlay";

export interface LomiEmbedOptions {
  /** Optional when `checkoutUrl` is provided */
  publicKey?: string;
  /** Optional when `checkoutUrl` is provided */
  sessionId?: string;
  /** Preferred: full URL from POST /checkout-sessions or a payment link */
  checkoutUrl?: string;
  checkoutBaseUrl?: string;
  elementId?: string;
  mode?: "modal" | "inline";
  width?: string;
  height?: string;
  maxWidth?: string;
  modalHeight?: string;
  onComplete?: (payload: LomiCheckoutCompletePayload) => void;
  onResize?: (height: number) => void;
  onError?: (error: { code: string; message?: string }) => void;
}

export interface LomiCheckoutCompletePayload {
  type: "LOMI_CHECKOUT_COMPLETE";
  sessionId?: string | null;
  transactionId?: string;
  amount?: number;
  currency?: string;
  hasDigitalDeliverables?: boolean;
}

export interface LomiEmbedResult {
  unmount: () => void;
}

export function validateEmbedOptions(options: LomiEmbedOptions): void {
  if (options.checkoutUrl) {
    return;
  }
  if (!options.sessionId) {
    throw new Error(
      "Lomi embed: provide checkoutUrl or sessionId (with optional checkoutBaseUrl).",
    );
  }
}

export const withEmbeddedParam = (url: string, embedOrigin?: string): string => {
  const defaultOrigin = globalThis.window?.location.origin;
  try {
    const parsed = new URL(url);
    parsed.searchParams.set("embedded", "true");
    const origin = embedOrigin ?? defaultOrigin;
    if (origin) {
      parsed.searchParams.set("embed_origin", origin);
    }
    return parsed.toString();
  } catch {
    const joiner = url.includes("?") ? "&" : "?";
    let result = `${url}${joiner}embedded=true`;
    const origin = embedOrigin ?? defaultOrigin;
    if (origin) {
      result += `&embed_origin=${encodeURIComponent(origin)}`;
    }
    return result;
  }
};

export const buildCheckoutUrl = (options: LomiEmbedOptions): string => {
  validateEmbedOptions(options);

  if (options.checkoutUrl) {
    return withEmbeddedParam(options.checkoutUrl);
  }

  const base = (options.checkoutBaseUrl || DEFAULT_CHECKOUT_BASE_URL).replace(
    /\/$/,
    "",
  );
  const sessionId = options.sessionId ?? "";
  const path = /^cs_[0-9A-Za-z]{14}$/i.test(sessionId)
    ? `/${sessionId}`
    : `/checkout/${sessionId}`;
  return withEmbeddedParam(`${base}${path}`);
};

export const formatBytes = (bytes?: number | null): string => {
  if (!bytes || bytes <= 0) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};
