"use client";

import { useState } from "react";
import type React from "react";
import { Input } from "@lomi./ui/input";
import { Label } from "@lomi./ui/label";
import type { TranslateFn } from "./types";

export type GimCardDetails = {
  pan: string;
  expiry: string;
  cvv: string;
};

type GimCardInformationSectionProps = {
  t: TranslateFn;
  onCardChange: (details: GimCardDetails, isComplete: boolean) => void;
  disabled?: boolean;
};

function digitsOnly(value: string, maxLen: number): string {
  return value.replace(/\D/g, "").slice(0, maxLen);
}

function formatPan(value: string): string {
  const digits = digitsOnly(value, 19);
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
}

function formatExpiry(value: string): string {
  const digits = digitsOnly(value, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

function isGimCardComplete(details: GimCardDetails): boolean {
  const pan = details.pan.replace(/\s/g, "");
  const expiry = details.expiry.replace(/\s/g, "");
  return (
    pan.length >= 14 &&
    pan.length <= 19 &&
    /^\d{2}\/\d{2}$/.test(expiry) &&
    details.cvv.length >= 3
  );
}

export function GimCardInformationSection({
  t,
  onCardChange,
  disabled = false,
}: GimCardInformationSectionProps) {
  const [details, setDetails] = useState<GimCardDetails>({
    pan: "",
    expiry: "",
    cvv: "",
  });

  const update = (patch: Partial<GimCardDetails>) => {
    const next = { ...details, ...patch };
    setDetails(next);
    onCardChange(next, isGimCardComplete(next));
  };

  return (
    <div className="space-y-4 pt-2">
      <div className="space-y-2">
        <Label htmlFor="gim-card-number">
          {t("checkout.payment_providers.gim.card_number")}
        </Label>
        <Input
          id="gim-card-number"
          inputMode="numeric"
          autoComplete="cc-number"
          enterKeyHint="next"
          placeholder="1234 5678 9012 3456"
          value={details.pan}
          disabled={disabled}
          className="text-base md:text-sm"
          onChange={(e) => update({ pan: formatPan(e.target.value) })}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="gim-card-expiry">
            {t("checkout.payment_providers.gim.card_expiry")}
          </Label>
          <Input
            id="gim-card-expiry"
            inputMode="numeric"
            autoComplete="cc-exp"
            enterKeyHint="next"
            placeholder="MM/YY"
            value={details.expiry}
            disabled={disabled}
            className="text-base md:text-sm"
            onChange={(e) => update({ expiry: formatExpiry(e.target.value) })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="gim-card-cvv">
            {t("checkout.payment_providers.gim.card_cvv")}
          </Label>
          <Input
            id="gim-card-cvv"
            inputMode="numeric"
            autoComplete="cc-csc"
            enterKeyHint="done"
            placeholder="123"
            type="password"
            value={details.cvv}
            disabled={disabled}
            maxLength={4}
            className="text-base md:text-sm"
            onChange={(e) => update({ cvv: digitsOnly(e.target.value, 4) })}
          />
        </div>
      </div>
    </div>
  );
}

export default GimCardInformationSection;
