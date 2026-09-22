"use client";

import React, { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { getBillingCountriesWithDetectedFirst } from "@lomi./shared";
import { CheckoutFloatField } from "./checkout-float-field";
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
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
  countrySelectRef: React.Ref<HTMLSelectElement>;
  cityInputRef: React.Ref<HTMLInputElement>;
  detectedCountry?: string;
  /** Called when IP/geo detection fills country and the form has none yet. */
  onDetectedCountry?: (country: string) => void;
}

/** Street lines stay one saved address. The second line is the text after the first break. */
const splitAddress = (address: string) => {
  const breakAt = address.indexOf("\n");
  if (breakAt === -1) return [address, ""] as const;
  return [address.slice(0, breakAt), address.slice(breakAt + 1)] as const;
};

const joinAddress = (line1: string, line2: string) =>
  line2.length > 0 ? `${line1}\n${line2}` : line1;

export function BillingAddressSection({
  t,
  customerDetails,
  handleCustomerInputChange,
  countrySelectRef,
  cityInputRef,
  detectedCountry,
  onDetectedCountry,
}: BillingAddressSectionProps) {
  const [countryListReady, setCountryListReady] = useState(false);

  useEffect(() => {
    setCountryListReady(true);
  }, []);

  // Country display names differ between Node and the browser. The option
  // list is filled after mount so the first paint matches the server and
  // checkout clicks stay attached.
  const effectiveDetectedCountry = countryListReady
    ? detectedCountry
    : undefined;
  const countries = countryListReady
    ? getBillingCountriesWithDetectedFirst(effectiveDetectedCountry)
    : [];
  const selectedCountry =
    customerDetails.country || effectiveDetectedCountry || "";
  const [addressLine1, addressLine2] = splitAddress(customerDetails.address);

  const writeAddress = (line1: string, line2: string) => {
    const value = joinAddress(line1, line2);
    // SAFETY: The address handler only reads name and value from this synthetic change.
    const event = {
      target: { name: "address", value },
      currentTarget: { name: "address", value },
    } as React.ChangeEvent<HTMLInputElement>;
    handleCustomerInputChange(event);
  };

  useEffect(() => {
    if (detectedCountry && !customerDetails.country) {
      onDetectedCountry?.(detectedCountry);
    }
  }, [detectedCountry, customerDetails.country, onDetectedCountry]);

  return (
    <div className="checkout-form-section billing-address-section space-y-2.5">
      <label className="checkout-form-title block text-sm font-normal text-gray-700 select-none">
        {t("checkout.billing_address.title")}
      </label>
      <div className="checkout-field-stack overflow-hidden rounded-sm shadow-sm shadow-black/[.04]">
        <div className="relative">
          <select
            name="country"
            value={selectedCountry}
            onChange={handleCustomerInputChange}
            className="h-10 w-full appearance-none rounded-tl rounded-tr rounded-b-none border border-gray-300 bg-white px-3 pr-8 text-[13px] text-gray-900 focus:border-gray-300 focus:outline-none"
            required
            ref={countrySelectRef}
            autoComplete="country"
          >
            {!selectedCountry ? (
              <option value="">{t("checkout.billing_address.country")}</option>
            ) : null}
            {selectedCountry &&
            !countries.some((country) => country.code === selectedCountry) ? (
              <option value={selectedCountry}>{selectedCountry}</option>
            ) : null}
            {countries.map((country) => (
              <option key={country.code} value={country.code}>
                {country.name}
              </option>
            ))}
          </select>
          <ChevronDown
            size={16}
            strokeWidth={2}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
            aria-hidden="true"
          />
        </div>
        <div className="-mt-px">
          <CheckoutFloatField
            name="address"
            label={t("checkout.billing_address.address")}
            value={addressLine1}
            onChange={(event) => writeAddress(event.target.value, addressLine2)}
            autoComplete="address-line1"
            roundingClass="rounded-none border-gray-300"
          />
        </div>
        <div className="-mt-px">
          <CheckoutFloatField
            name="addressLine2"
            label={t("checkout.billing_address.address_line_2")}
            value={addressLine2}
            onChange={(event) => writeAddress(addressLine1, event.target.value)}
            autoComplete="address-line2"
            roundingClass="rounded-none border-gray-300"
          />
        </div>
        <div className="-mt-px flex">
          <div className="min-w-0 flex-1">
            <CheckoutFloatField
              name="city"
              label={t("checkout.billing_address.city")}
              value={customerDetails.city}
              onChange={handleCustomerInputChange}
              inputRef={cityInputRef}
              autoComplete="address-level2"
              roundingClass="rounded-bl rounded-br-none rounded-t-none border-gray-300"
            />
          </div>
          <div className="w-[7.5rem] shrink-0">
            <CheckoutFloatField
              name="postalCode"
              label={t("checkout.billing_address.postal_code")}
              value={customerDetails.postalCode}
              onChange={handleCustomerInputChange}
              autoComplete="postal-code"
              roundingClass="rounded-br rounded-bl-none rounded-t-none border-l-0 border-gray-300"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default BillingAddressSection;
