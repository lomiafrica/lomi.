/** Prefixed public ids (org_FJKND44523FJKN). UUID stays the primary key. */

export const PUBLIC_ID_ALPHABET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";

export const PUBLIC_ID_BODY_LENGTH = 14;

export const PUBLIC_ID_PREFIXES = {
  organization: "org_",
  merchant: "merch_",
  customer: "cus_",
  product: "prod_",
  price: "price_",
  paymentLink: "plink_",
  invoice: "inv_",
  checkoutSession: "cs_",
  transaction: "txn_",
  subscription: "sub_",
  refund: "re_",
  payout: "po_",
  paymentRequest: "req_",
  coupon: "coup_",
  webhook: "we_",
  dispute: "dp_",
  meter: "mtr_",
  bookableService: "svc_",
} as const;

export type PublicIdKind = keyof typeof PUBLIC_ID_PREFIXES;

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const PREFIX_VALUES = new Set<string>(Object.values(PUBLIC_ID_PREFIXES));

/**
 * Longest prefix wins. `re_` (refund) is a prefix of `req_` (payment
 * request); first-match on insertion order misclassifies `req_*` as a refund.
 */
function matchPublicIdPrefix(normalized: string): string | null {
  let matched: string | null = null;
  for (const prefix of PREFIX_VALUES) {
    if (!normalized.startsWith(prefix.toUpperCase())) continue;
    if (!matched || prefix.length > matched.length) {
      matched = prefix;
    }
  }
  return matched;
}

export function normalizePublicId(raw: string): string {
  return raw.trim().replace(/[\s-]/g, "").toUpperCase();
}

export function isUuid(value: string): boolean {
  return UUID_PATTERN.test(value.trim());
}

export function isPublicIdPrefix(prefix: string): boolean {
  return PREFIX_VALUES.has(prefix);
}

export function isPublicId(value: string, prefix?: string): boolean {
  const normalized = normalizePublicId(value);
  const matchedPrefix = matchPublicIdPrefix(normalized);
  if (!matchedPrefix) return false;
  if (prefix && matchedPrefix.toUpperCase() !== prefix.toUpperCase()) {
    return false;
  }

  const body = normalized.slice(matchedPrefix.toUpperCase().length);
  if (body.length !== PUBLIC_ID_BODY_LENGTH) return false;
  for (const ch of body) {
    if (!PUBLIC_ID_ALPHABET.includes(ch)) return false;
  }
  return true;
}

export function publicIdPrefix(value: string): string | null {
  return matchPublicIdPrefix(normalizePublicId(value));
}

export function formatPublicId(value: string | null | undefined): string | null {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (isUuid(trimmed)) return trimmed;

  const prefix = publicIdPrefix(trimmed);
  if (!prefix) return normalizePublicId(trimmed);

  const body = normalizePublicId(trimmed).slice(prefix.toUpperCase().length);
  if (prefix === PUBLIC_ID_PREFIXES.transaction) {
    return `${prefix.toUpperCase()}${body}`;
  }
  return `${prefix}${body}`;
}

export function publicIdsMatch(
  left: string | null | undefined,
  right: string | null | undefined,
): boolean {
  if (!left || !right) return false;
  if (isUuid(left) && isUuid(right)) {
    return left.trim().toLowerCase() === right.trim().toLowerCase();
  }
  return normalizePublicId(left) === normalizePublicId(right);
}

export const DEFAULT_PAY_ORIGIN = "https://pay.lomi.africa";

export const RESERVED_PAYMENT_LINK_PATH_SEGMENTS = new Set([
  "api",
  "checkout",
  "company",
  "dev",
  "i",
  "instant",
  "invoicing",
  "merchant-receipt",
  "og-preview",
  "preview",
  "product",
  "receipt",
  "_next",
]);

function firstPathSegment(pathname: string): string {
  const first = pathname.replace(/^\/+/, "").split("/")[0] ?? "";
  try {
    return decodeURIComponent(first);
  } catch {
    return first;
  }
}

/** Hosted path body: Crockford id without `plink_`. UUIDs pass through unchanged. */
export function paymentLinkPathSegment(id: string): string {
  const trimmed = id.trim();
  if (!trimmed) return "";
  if (isUuid(trimmed)) return trimmed;
  return normalizePublicId(trimmed).replace(/^PLINK_/, "");
}

export function isPaymentLinkPathSegment(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) return false;
  if (RESERVED_PAYMENT_LINK_PATH_SEGMENTS.has(trimmed.toLowerCase())) {
    return false;
  }
  const body = paymentLinkPathSegment(trimmed);
  if (RESERVED_PAYMENT_LINK_PATH_SEGMENTS.has(body.toLowerCase())) {
    return false;
  }
  if (body.length !== PUBLIC_ID_BODY_LENGTH) return false;
  for (const ch of body) {
    if (!PUBLIC_ID_ALPHABET.includes(ch)) return false;
  }
  return true;
}

export function isCheckoutLinkIdentifier(value: string): boolean {
  return isPaymentLinkPathSegment(value) || isUuid(value.trim());
}

export function isLegacyPaymentLinkPath(pathname: string): boolean {
  return (
    pathname.startsWith("/instant/") || pathname.startsWith("/product/")
  );
}

/** Share URL path is `/{body}` only. Old `/instant/` and `/product/` are not canonical. */
export function isCanonicalPaymentLinkPath(pathname: string): boolean {
  const rest = pathname.replace(/^\/+/, "").split("/").slice(1).filter(Boolean);
  if (rest.length > 0) return false;
  return isPaymentLinkPathSegment(firstPathSegment(pathname));
}

export function buildPaymentLinkCheckoutUrl(
  id: string,
  origin: string = DEFAULT_PAY_ORIGIN,
): string {
  const segment = paymentLinkPathSegment(id);
  return `${origin.replace(/\/$/, "")}/${encodeURIComponent(segment)}`;
}

/**
 * Prefer a stored canonical hosted URL (keeps custom domains). Rebuild
 * `/instant/` and `/product/` paths from the payment-link id.
 */
export function hostedPaymentLinkUrl(
  id: string,
  storedUrl?: string | null,
): string {
  if (storedUrl) {
    try {
      const parsed = new URL(storedUrl);
      if (isCanonicalPaymentLinkPath(parsed.pathname)) {
        return `${parsed.origin}${parsed.pathname}`;
      }
      if (isLegacyPaymentLinkPath(parsed.pathname)) {
        return buildPaymentLinkCheckoutUrl(id, parsed.origin);
      }
    } catch {
      /* rebuild below */
    }
  }
  return buildPaymentLinkCheckoutUrl(id);
}

const CHECKOUT_SESSION_RESERVED_SEGMENTS = new Set([
  "error",
  "mtn",
  "success",
]);

export function isCheckoutSessionIdentifier(value: string): boolean {
  return isPublicId(value, PUBLIC_ID_PREFIXES.checkoutSession);
}

/** Hosted path for a session: `cs_` + Crockford body. UUIDs pass through. */
export function checkoutSessionPathSegment(id: string): string {
  const trimmed = id.trim();
  if (!trimmed) return "";
  if (isUuid(trimmed)) return trimmed;
  return formatPublicId(trimmed) ?? trimmed;
}

export function buildHostedCheckoutSessionUrl(
  id: string,
  origin: string = DEFAULT_PAY_ORIGIN,
): string {
  const trimmed = id.trim();
  const base = origin.replace(/\/$/, "");
  if (isCheckoutSessionIdentifier(trimmed)) {
    return `${base}/${encodeURIComponent(checkoutSessionPathSegment(trimmed))}`;
  }
  return `${base}/checkout/${encodeURIComponent(trimmed)}`;
}

export function isLegacyCheckoutSessionPath(pathname: string): boolean {
  const parts = pathname.replace(/^\/+/, "").split("/").filter(Boolean);
  if (parts.length < 2 || parts[0]?.toLowerCase() !== "checkout") {
    return false;
  }
  const id = parts[1] ?? "";
  if (CHECKOUT_SESSION_RESERVED_SEGMENTS.has(id.toLowerCase())) {
    return false;
  }
  return isCheckoutSessionIdentifier(id) || isUuid(id);
}
