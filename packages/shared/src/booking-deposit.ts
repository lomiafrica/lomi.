import {
  isJsonObject,
  isNumber,
  isString,
  readNumber,
  readString,
  type JsonObject,
  type JsonValue,
} from "./json-value.js";

/**
 * Appointment attached to a deposit checkout.
 * Shape is produced by SQL `booking_checkout_snapshot` and surfaces on the
 * payment link metadata, `get_checkout_session_details` (`booking`) and the
 * completed transaction metadata (`metadata.booking`).
 */
export interface CheckoutBooking {
  bookingId: string;
  serviceId: string | null;
  serviceName: string;
  serviceImage: string | null;
  durationMinutes: number | null;
  startsAt: string;
  endsAt: string | null;
  totalPrice: number;
  depositAmount: number;
  currencyCode: string;
  paymentMode: "deposit" | "in_person";
  status: CheckoutBookingStatus;
  holdExpiresAt: string | null;
}

export type CheckoutBookingStatus =
  | "pending_payment"
  | "confirmed"
  | "cancelled"
  | "completed"
  | "no_show";

const BOOKING_STATUSES: readonly CheckoutBookingStatus[] = [
  "pending_payment",
  "confirmed",
  "cancelled",
  "completed",
  "no_show",
];

function readAmount(object: JsonObject, key: string): number | null {
  const value = object[key];
  if (isNumber(value)) return value;
  if (isString(value) && value.trim() !== "") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function parseBookingStatus(value: string | undefined): CheckoutBookingStatus {
  for (const status of BOOKING_STATUSES) {
    if (status === value) return status;
  }
  return "pending_payment";
}

/**
 * Parse a booking snapshot. Returns null when the value is not a booking
 * (missing id, service name, start time or amounts) so callers can fall back
 * to the generic payment link rendering.
 */
export function parseCheckoutBooking(
  raw: JsonValue | null | undefined,
): CheckoutBooking | null {
  if (!isJsonObject(raw)) return null;
  const bookingId = readString(raw, "booking_id");
  const serviceName = readString(raw, "service_name");
  const startsAt = readString(raw, "starts_at");
  const totalPrice = readAmount(raw, "total_price");
  const depositAmount = readAmount(raw, "deposit_amount");
  const currencyCode = readString(raw, "currency_code");
  if (
    !bookingId ||
    !serviceName ||
    !startsAt ||
    totalPrice == null ||
    !currencyCode
  ) {
    return null;
  }
  const paymentMode = readString(raw, "payment_mode");
  return {
    bookingId,
    serviceId: readString(raw, "service_id") ?? null,
    serviceName,
    serviceImage: readString(raw, "service_image") ?? null,
    durationMinutes: readNumber(raw, "duration_minutes") ?? null,
    startsAt,
    endsAt: readString(raw, "ends_at") ?? null,
    totalPrice,
    depositAmount: depositAmount ?? 0,
    currencyCode,
    paymentMode: paymentMode === "in_person" ? "in_person" : "deposit",
    status: parseBookingStatus(readString(raw, "status")),
    holdExpiresAt: readString(raw, "hold_expires_at") ?? null,
  };
}

/** Find a booking on a checkout payload: top-level `booking` first, then `metadata.booking`. */
export function findCheckoutBooking(
  ...sources: (JsonValue | null | undefined)[]
): CheckoutBooking | null {
  for (const source of sources) {
    if (!isJsonObject(source)) continue;
    const direct = parseCheckoutBooking(source["booking"]);
    if (direct) return direct;
    const metadata = source["metadata"];
    if (isJsonObject(metadata)) {
      const nested = parseCheckoutBooking(metadata["booking"]);
      if (nested) return nested;
    }
  }
  return null;
}

/** Amount still owed at the appointment after the deposit. Never negative. */
export function getBookingBalanceDue(booking: {
  totalPrice: number;
  depositAmount: number;
}): number {
  return Math.max(0, booking.totalPrice - booking.depositAmount);
}

/** True when the hold lapsed or the merchant cancelled: the deposit can no longer be taken. */
export function isCheckoutBookingClosed(booking: CheckoutBooking): boolean {
  return booking.status === "cancelled" || booking.status === "no_show";
}

const BOOKING_DATE_LOCALES = {
  en: "en-US",
  es: "es-ES",
  fr: "fr-FR",
  zh: "zh-CN",
} as const;

type BookingDateLanguage = keyof typeof BOOKING_DATE_LOCALES;

function isBookingDateLanguage(value: string): value is BookingDateLanguage {
  return value in BOOKING_DATE_LOCALES;
}

/** BCP 47 locale for a two-letter UI language; unknown languages fall back to English. */
export function bookingDateLocale(language: string | null | undefined): string {
  if (!language) return BOOKING_DATE_LOCALES.en;
  const base = language.toLowerCase().split(/[-_]/)[0] ?? "en";
  return isBookingDateLanguage(base)
    ? BOOKING_DATE_LOCALES[base]
    : BOOKING_DATE_LOCALES.en;
}

export function formatBookingDate(iso: string, locale: string): string {
  return new Date(iso).toLocaleDateString(locale, {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

export function formatBookingTime(iso: string, locale: string): string {
  return new Date(iso).toLocaleTimeString(locale, {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatBookingTimeRange(
  startIso: string,
  endIso: string,
  locale: string,
): string {
  return `${formatBookingTime(startIso, locale)} - ${formatBookingTime(endIso, locale)}`;
}

/** "Saturday 12 September · 10:00 - 11:00" (range when the end is known). */
export function formatBookingSlot(
  booking: Pick<CheckoutBooking, "startsAt" | "endsAt">,
  locale: string,
): string {
  const date = formatBookingDate(booking.startsAt, locale);
  const time = booking.endsAt
    ? formatBookingTimeRange(booking.startsAt, booking.endsAt, locale)
    : formatBookingTime(booking.startsAt, locale);
  return `${date} · ${time}`;
}
