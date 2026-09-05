"use client";

import React from "react";
import { cn } from "@lomi./ui/cn";
import type { TranslateFn } from "./types";

export interface PayPriceOption {
  price_id: string;
  amount: number;
  currency_code?: string;
  billing_interval?: string | null;
  is_default?: boolean;
  is_active?: boolean;
}

interface PriceSelectorProps {
  t: TranslateFn;
  prices: PayPriceOption[];
  selectedPriceId: string | null;
  onPriceSelect: (priceId: string) => void;
  currencyCode: string;
  formatCurrency: (amount: number, currencyCode: string) => string;
  formatBillingIntervalLabel: (interval: string | null | undefined) => string;
  embedded?: boolean;
}

export function PriceSelector({
  t,
  prices,
  selectedPriceId,
  onPriceSelect,
  currencyCode,
  formatCurrency,
  formatBillingIntervalLabel,
  embedded = false,
}: PriceSelectorProps) {
  const activePrices = prices.filter((p) => p.is_active !== false);
  if (activePrices.length <= 1) {
    return null;
  }

  const defaultPrice = activePrices.find((p) => p.is_default);
  const monthlyPrice = activePrices.find(
    (p) => p.billing_interval === "month" || p.billing_interval === "monthly",
  );

  const calculateSavings = (price: PayPriceOption) => {
    if (defaultPrice && defaultPrice.price_id !== price.price_id) {
      const savingsPercent = Math.round(
        ((defaultPrice.amount - price.amount) / defaultPrice.amount) * 100,
      );
      const savingsAmount = defaultPrice.amount - price.amount;

      if (savingsPercent > 0) {
        return { percent: savingsPercent, amount: savingsAmount };
      }
    }

    const isAnnualLike =
      price.billing_interval === "year" || price.billing_interval === "yearly";
    if (
      monthlyPrice &&
      isAnnualLike &&
      monthlyPrice.price_id !== price.price_id
    ) {
      const annualizedMonthly = monthlyPrice.amount * 12;
      const savingsAmount = annualizedMonthly - price.amount;
      if (savingsAmount > 0) {
        return {
          percent: Math.round((savingsAmount / annualizedMonthly) * 100),
          amount: savingsAmount,
        };
      }
    }

    return null;
  };

  return (
    <div className={cn("price-selector", !embedded && "mb-4")}>
      <div className="price-selector-list" role="radiogroup">
        {activePrices.map((price) => {
          const isSelected = price.price_id === selectedPriceId;
          const savings = calculateSavings(price);

          return (
            <button
              key={price.price_id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              data-selected={isSelected ? "true" : "false"}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => onPriceSelect(price.price_id)}
              onKeyDown={(event) => {
                const index = activePrices.findIndex(
                  (item) => item.price_id === price.price_id,
                );
                let next = index;
                if (event.key === "ArrowDown" || event.key === "ArrowRight") {
                  next = (index + 1) % activePrices.length;
                } else if (
                  event.key === "ArrowUp" ||
                  event.key === "ArrowLeft"
                ) {
                  next =
                    (index - 1 + activePrices.length) % activePrices.length;
                } else if (event.key === "Home") {
                  next = 0;
                } else if (event.key === "End") {
                  next = activePrices.length - 1;
                } else {
                  return;
                }
                event.preventDefault();
                const nextPrice = activePrices[next];
                if (!nextPrice) return;
                onPriceSelect(nextPrice.price_id);
                const radios =
                  event.currentTarget.parentElement?.querySelectorAll<HTMLElement>(
                    '[role="radio"]',
                  );
                radios?.[next]?.focus();
              }}
              className={cn(
                "price-selector-option flex h-10 w-full items-center gap-2.5 px-3 text-left appearance-none select-none",
                isSelected && "price-selector-option-selected",
              )}
            >
              <span
                className={cn(
                  "price-selector-radio flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border",
                )}
                aria-hidden
              >
                {isSelected ? (
                  <span className="price-selector-radio-dot h-1.5 w-1.5 rounded-full" />
                ) : null}
              </span>

              <span className="flex min-w-0 flex-1 items-center gap-1.5 text-sm">
                <span className="price-selector-amount font-medium">
                  {formatCurrency(price.amount, currencyCode)}
                </span>
                <span className="price-selector-interval">
                  / {formatBillingIntervalLabel(price.billing_interval)}
                </span>
                {savings ? (
                  <span className="price-selector-save ml-auto shrink-0 text-xs">
                    {t("checkout.billing_cycle.save")} {savings.percent}%
                  </span>
                ) : null}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
