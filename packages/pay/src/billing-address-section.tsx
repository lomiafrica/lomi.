"use client";

import React, { useEffect, useRef, useState } from "react";
import { Input } from "@lomi./ui/input";
import { ChevronDown } from "lucide-react";
import { getBillingCountriesWithDetectedFirst } from "@lomi./shared";
import type { TranslateFn } from "./types";

export interface PayBillingCustomerDetails {
  country: string;
  city: string;
  address: string;
  postalCode: string;
}

interface BillingAddressSectionProps {
  t: TranslateFn;
  customerDetails: PayBillingCustomerDetails;
  handleCustomerInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => void;
  countrySelectRef: React.Ref<HTMLSelectElement>;
  cityInputRef: React.Ref<HTMLInputElement>;
  detectedCountry?: string;
  /** Called when IP/geo detection fills country and the form has none yet. */
  onDetectedCountry?: (country: string) => void;
}

const MIN_TEXTAREA_HEIGHT = "40px";

export function BillingAddressSection({
  t,
  customerDetails,
  handleCustomerInputChange,
  countrySelectRef,
  cityInputRef,
  detectedCountry,
  onDetectedCountry,
}: BillingAddressSectionProps) {
  const addressTextareaRef = useRef<HTMLTextAreaElement>(null);
  const postalCodeInputRef = useRef<HTMLInputElement>(null);
  const [countryListReady, setCountryListReady] = useState(false);

  useEffect(() => {
    setCountryListReady(true);
  }, []);

  // Node and the browser disagree on some Intl country display names
  // (e.g. Falkland Islands). Rendering the list only after mount keeps
  // SSR HTML identical to the first client paint so checkout clicks work.
  const effectiveDetectedCountry = countryListReady
    ? detectedCountry
    : undefined;
  const COUNTRIES = countryListReady
    ? getBillingCountriesWithDetectedFirst(effectiveDetectedCountry)
    : [];

  useEffect(() => {
    const textarea = addressTextareaRef.current;
    const postalInput = postalCodeInputRef.current;

    if (textarea) {
      textarea.style.height = "auto";
      void textarea.offsetHeight;

      const currentScrollHeight = textarea.scrollHeight;
      const minHeightValue = parseInt(MIN_TEXTAREA_HEIGHT);
      const value = textarea.value;

      if (!value.trim() || currentScrollHeight <= minHeightValue) {
        textarea.style.height = MIN_TEXTAREA_HEIGHT;
      } else {
        textarea.style.height = `${currentScrollHeight}px`;
      }

      if (postalInput) {
        postalInput.style.height = textarea.style.height;
      }

      textarea.style.backgroundColor = "#ffffff";
      textarea.style.setProperty("background-color", "#ffffff", "important");
      textarea.style.setProperty(
        "-webkit-box-shadow",
        "0 0 0px 1000px #ffffff inset",
        "important",
      );
    }
  }, [customerDetails.address]);

  useEffect(() => {
    const textarea = addressTextareaRef.current;
    if (!textarea) return;

    const forceWhiteBackground = (): void => {
      textarea.style.backgroundColor = "#ffffff";
      textarea.style.setProperty("background-color", "#ffffff", "important");
      textarea.style.setProperty(
        "-webkit-box-shadow",
        "0 0 0px 1000px #ffffff inset",
        "important",
      );
    };

    textarea.addEventListener("input", forceWhiteBackground);
    textarea.addEventListener("focus", forceWhiteBackground);
    textarea.addEventListener("blur", forceWhiteBackground);
    textarea.addEventListener("change", forceWhiteBackground);
    forceWhiteBackground();

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "style"
        ) {
          setTimeout(forceWhiteBackground, 0);
        }
      });
    });

    observer.observe(textarea, {
      attributes: true,
      attributeFilter: ["style"],
    });

    return () => {
      textarea.removeEventListener("input", forceWhiteBackground);
      textarea.removeEventListener("focus", forceWhiteBackground);
      textarea.removeEventListener("blur", forceWhiteBackground);
      textarea.removeEventListener("change", forceWhiteBackground);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (detectedCountry && !customerDetails.country) {
      onDetectedCountry?.(detectedCountry);
    }
  }, [detectedCountry, customerDetails.country, onDetectedCountry]);

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    handleCustomerInputChange(e);

    const textarea = e.target;
    const postalInput = postalCodeInputRef.current;
    const value = e.target.value;

    textarea.style.backgroundColor = "#ffffff";
    textarea.style.setProperty("background-color", "#ffffff", "important");
    textarea.style.setProperty(
      "-webkit-box-shadow",
      "0 0 0px 1000px #ffffff inset",
      "important",
    );

    textarea.style.height = "auto";
    void textarea.offsetHeight;

    const currentScrollHeight = textarea.scrollHeight;
    const minHeightValue = parseInt(MIN_TEXTAREA_HEIGHT);

    if (!value.trim() || currentScrollHeight <= minHeightValue) {
      textarea.style.height = MIN_TEXTAREA_HEIGHT;
    } else {
      textarea.style.height = `${currentScrollHeight}px`;
    }

    if (postalInput) {
      postalInput.style.height = textarea.style.height;
    }
  };

  return (
    <div className="checkout-form-section space-y-2.5 billing-address-section">
      <label className="checkout-form-title block text-sm font-normal text-gray-700 select-none">
        {t("checkout.billing_address.title")}
      </label>
      <div className="checkout-field-stack overflow-hidden rounded-sm shadow-sm shadow-black/[.04]">
        <div className="relative">
          <select
            name="country"
            value={
              customerDetails.country ||
              (effectiveDetectedCountry ? effectiveDetectedCountry : "")
            }
            onChange={handleCustomerInputChange}
            className="flex h-10 w-full border border-gray-300 bg-white px-3 py-2 text-base md:text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 rounded-b-none appearance-none text-gray-900"
            required
            ref={countrySelectRef}
            autoComplete="country-name"
          >
            {!effectiveDetectedCountry && (
              <option value="" className="text-gray-400">
                {t("checkout.billing_address.country")}
              </option>
            )}
            {COUNTRIES.map((country) => (
              <option key={country.code} value={country.code}>
                {country.name}
              </option>
            ))}
          </select>
          <ChevronDown
            size={16}
            strokeWidth={2}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
            aria-hidden="true"
          />
        </div>
        <div className="flex -mt-px">
          <div className="relative w-full">
            <Input
              name="city"
              value={customerDetails.city}
              onChange={handleCustomerInputChange}
              placeholder={t("checkout.billing_address.city")}
              className="rounded-none w-full border-x bg-white text-gray-900 border-gray-300 placeholder:text-base md:placeholder:text-sm text-base md:text-sm h-10"
              ref={cityInputRef}
              autoComplete="address-level2"
            />
          </div>
        </div>
        <div className="flex -mt-px items-stretch">
          <textarea
            ref={addressTextareaRef}
            name="address"
            value={customerDetails.address}
            onChange={handleTextareaChange}
            placeholder={t("checkout.billing_address.address")}
            className="box-border h-10 min-h-10 rounded-none rounded-bl w-[70%] bg-white text-gray-900 border border-gray-300 border-r-0 placeholder:text-base md:placeholder:text-sm text-base md:text-sm px-3 py-2 resize-vertical overflow-y-auto focus:ring-0 focus:outline-none focus:border-gray-300"
            rows={1}
            style={{ minHeight: MIN_TEXTAREA_HEIGHT }}
            autoComplete="street-address"
          />
          <Input
            ref={postalCodeInputRef}
            name="postalCode"
            value={customerDetails.postalCode}
            onChange={handleCustomerInputChange}
            placeholder={t("checkout.billing_address.postal_code")}
            className="box-border min-h-10 self-stretch rounded-none rounded-br w-[30%] bg-white text-gray-900 border border-gray-300 border-l-0 placeholder:text-base md:placeholder:text-sm text-base md:text-sm px-3 py-2 focus:ring-0 focus:outline-none focus:border-gray-300"
            style={{ minHeight: MIN_TEXTAREA_HEIGHT }}
            autoComplete="postal-code"
          />
        </div>
      </div>
    </div>
  );
}

export default BillingAddressSection;
