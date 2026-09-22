/**
 * Monthly processed volume (XOF) required before a merchant can connect
 * their own WhatsApp Business number. About twelve 10 000 F payments, which
 * covers Kapso's extra-number seat at the Starter mobile-money rate.
 * Already-connected numbers stay manageable below this floor.
 */
export const WHATSAPP_CONNECT_MIN_MONTHLY_REVENUE_XOF = 150_000;

export const WHATSAPP_CONNECT_REVENUE_ERROR = "whatsapp_connect_revenue";

type WhatsAppConnectRevenueInput = {
  currentMonthRevenue: number;
  previousMonthRevenue: number;
  tierDeterminationRevenue: number;
};

/** True when this month or the last closed month clears the connect floor. */
export function monthlyRevenueQualifiesForWhatsAppConnect(
  input: WhatsAppConnectRevenueInput,
): boolean {
  const observed = Math.max(
    input.currentMonthRevenue,
    input.previousMonthRevenue,
    input.tierDeterminationRevenue,
  );
  return observed >= WHATSAPP_CONNECT_MIN_MONTHLY_REVENUE_XOF;
}
