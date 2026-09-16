const FORMATTED_NAMES = {
  WAVE: "Wave",
  CYBERSOURCE: "Cybersource",
  STRIPE: "Cards",
  MTN: "MTN",
  ORANGE: "Orange",
  SPI: "SPI",
  GIM: "GIM",
  AIRWALLEX: "Bank",
} as const;

function isKnownProvider(
  provider: string,
): provider is keyof typeof FORMATTED_NAMES {
  return Object.prototype.hasOwnProperty.call(FORMATTED_NAMES, provider);
}

/** Customer-facing payment provider labels (not credentials). */
export function formatProvider(provider: string): string {
  if (isKnownProvider(provider)) return FORMATTED_NAMES[provider];
  return provider;
}
