"use client";

import type { TranslateFn } from "./types";

interface SubscriptionConfirmationTextProps {
  t: TranslateFn;
  merchantName?: string | null;
  hasSubscriptionPlan: boolean;
  trialEnabled?: boolean;
  nextBillingDateLabel?: string | null;
}

export function SubscriptionConfirmationText({
  t,
  merchantName,
  hasSubscriptionPlan,
  trialEnabled = false,
  nextBillingDateLabel = null,
}: SubscriptionConfirmationTextProps) {
  if (!hasSubscriptionPlan) {
    return null;
  }

  const merchant = merchantName || "the merchant";

  return (
    <div className="checkout-subscription-legal mt-4 mb-0 w-full select-none text-center text-gray-600">
      <p>
        {trialEnabled && nextBillingDateLabel
          ? t("checkout.trial.confirmation", {
              merchant,
              date: nextBillingDateLabel,
            })
          : t("checkout.subscription_confirmation.text", {
              merchant,
            })}
      </p>
    </div>
  );
}

export default SubscriptionConfirmationText;
