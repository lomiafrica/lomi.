"use client";

import type React from "react";
import { useEffect } from "react";
import {
  PhoneNumberInput,
  parsePhoneCountry,
} from "@lomi./ui/phone-number-input";
import { CheckoutFloatField } from "./checkout-float-field";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@lomi./ui/tooltip";
import { Info, ArrowRightLeft } from "lucide-react";
import type { TranslateFn } from "./types";

export interface PayCustomerDetailsState {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  whatsappNumber: string;
  country: string;
  city: string;
  postalCode: string;
  address: string;
  customerId: string | null;
}

interface PersonalInformationSectionProps {
  t: TranslateFn;
  customerDetails: PayCustomerDetailsState;
  setCustomerDetails: (
    value:
      | PayCustomerDetailsState
      | ((prev: PayCustomerDetailsState) => PayCustomerDetailsState),
  ) => void;
  rawNameInput: string;
  setRawNameInput: (value: string | ((prev: string) => string)) => void;
  isDifferentWhatsApp: boolean;
  setIsDifferentWhatsApp: (
    value: boolean | ((prev: boolean) => boolean),
  ) => void;
  nameInputRef: { current: HTMLInputElement | null };
  emailInputRef: { current: HTMLInputElement | null };
  phoneNumberInputContainerRef: { current: HTMLDivElement | null };
  detectedCountry?: string;
  onPhoneValidationChange?: (isValid: boolean | undefined) => void;
  isPhoneValid?: boolean | undefined;
  showEmail?: boolean;
  showPhone?: boolean;
  showName?: boolean;
  requireEmail?: boolean;
  requirePhone?: boolean;
  requireName?: boolean;
}

export function PersonalInformationSection({
  t,
  customerDetails,
  setCustomerDetails,
  rawNameInput,
  setRawNameInput,
  isDifferentWhatsApp,
  setIsDifferentWhatsApp,
  nameInputRef,
  emailInputRef,
  phoneNumberInputContainerRef,
  detectedCountry,
  onPhoneValidationChange,
  isPhoneValid = true,
  showEmail = true,
  showPhone = true,
  showName = true,
  requireEmail = true,
  requirePhone = false,
  requireName = true,
}: PersonalInformationSectionProps) {
  useEffect(() => {
    if (detectedCountry && !customerDetails.country) {
      setCustomerDetails((prev) => ({ ...prev, country: detectedCountry }));
    }
  }, [detectedCountry, customerDetails.country, setCustomerDetails]);

  const handleFullNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRawNameInput(e.target.value);
  };

  const handleGenericCustomerInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setCustomerDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhoneNumberChange = (value: string | undefined) => {
    setCustomerDetails((prev) => ({
      ...prev,
      phoneNumber: value || "",
      whatsappNumber: isDifferentWhatsApp ? prev.whatsappNumber : value || "",
    }));
  };

  const handleWhatsAppNumberChange = (value: string | undefined) => {
    setCustomerDetails((prev) => ({
      ...prev,
      whatsappNumber: value || "",
    }));
  };

  const handlePhoneCountryChange = (country: string | undefined) => {
    if (country) {
      setCustomerDetails((prev) => ({
        ...prev,
        country,
      }));
    }
  };

  const showPersonalInfoSection = showName || showEmail || showPhone;
  const hasFieldAbovePhone = showName || showEmail;

  if (!showPersonalInfoSection) {
    return null;
  }

  return (
    <div className="customer-information-section checkout-form-section space-y-2.5">
      <label className="checkout-form-title block text-sm font-normal text-gray-700 select-none">
        {t("checkout.personal_info.title")}
      </label>
      <div className="checkout-field-stack overflow-hidden rounded-sm shadow-sm shadow-black/4">
        {showName && (
          <CheckoutFloatField
            inputRef={nameInputRef}
            name="fullName"
            label={t("checkout.personal_info.full_name")}
            value={rawNameInput}
            onChange={handleFullNameChange}
            required={requireName}
            autoComplete="name"
            roundingClass={`${showEmail || showPhone ? "rounded-tl rounded-tr rounded-b-none" : "rounded-sm"} border-gray-300 input-checkout`}
            endAdornment={
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <div className="hidden md:block">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-3.5 w-3.5 text-gray-400 cursor-pointer hover:text-gray-600 transition-colors" />
                      </TooltipTrigger>
                      <TooltipContent
                        side="right"
                        className="max-w-xs text-xs p-2 bg-white text-gray-700 border border-gray-200 shadow-sm"
                      >
                        <p>{t("checkout.personal_info.name_tooltip")}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <span className="md:hidden text-red-500 pointer-events-none">
                  *
                </span>
              </div>
            }
          />
        )}
        {showEmail && (
          <div className={`flex ${showName ? "-mt-px" : ""}`}>
            <div className="w-full">
              <CheckoutFloatField
                id="email"
                inputRef={emailInputRef}
                type="email"
                name="email"
                label={t("checkout.personal_info.email")}
                value={customerDetails.email}
                onChange={handleGenericCustomerInputChange}
                required={requireEmail}
                autoComplete="email"
                roundingClass={`${showName ? "rounded-none" : showPhone ? "rounded-tl rounded-tr rounded-b-none" : "rounded-sm"} border-gray-300`}
                endAdornment={
                  requireEmail ? (
                    <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-red-500 pointer-events-none">
                      *
                    </span>
                  ) : null
                }
              />
            </div>
          </div>
        )}
        {showPhone && (
          <div className={`flex ${hasFieldAbovePhone ? "-mt-px" : ""}`}>
            <div
              className="relative w-full rounded-none box-border"
              ref={phoneNumberInputContainerRef}
            >
              <PhoneNumberInput
                value={customerDetails.phoneNumber}
                onChange={handlePhoneNumberChange}
                onCountryChange={handlePhoneCountryChange}
                onValidationChange={onPhoneValidationChange}
                defaultCountry={
                  detectedCountry
                    ? parsePhoneCountry(detectedCountry)
                    : undefined
                }
                isFirstInStack={!hasFieldAbovePhone}
                isMiddleInStack={hasFieldAbovePhone}
                directEdit
                requiredMark
                forceLight
              />
              {requirePhone && (
                <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-red-500 pointer-events-none z-10">
                  *
                </span>
              )}
            </div>
          </div>
        )}

        {showPhone && !isDifferentWhatsApp ? (
          <div className="flex -mt-px">
            <div
              role="button"
              tabIndex={0}
              className="phone-input-last-in-stack box-border flex h-10 min-h-10 w-full cursor-pointer items-center justify-between rounded-t-none rounded-b-sm border border-gray-300 bg-white px-3 dark:border-white/[0.16]"
              onClick={() => setIsDifferentWhatsApp(true)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  setIsDifferentWhatsApp(true);
                }
              }}
            >
              <span className="text-xs text-gray-500">
                {t("checkout.personal_info.whatsapp_different")}
              </span>
              <span className="flex items-center text-sm text-gray-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="ml-1 h-3.5 w-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </span>
            </div>
          </div>
        ) : showPhone ? (
          <div className="flex -mt-px">
            <div className="relative w-full rounded-none box-border">
              <PhoneNumberInput
                value={customerDetails.whatsappNumber}
                onChange={handleWhatsAppNumberChange}
                defaultCountry={
                  detectedCountry
                    ? parsePhoneCountry(detectedCountry)
                    : undefined
                }
                placeholder="WhatsApp number"
                className="pr-10"
                directEdit
                isLastInStack
                forceLight
              />
              <div
                role="button"
                tabIndex={0}
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer rounded-[1px] bg-blue-100 hover:bg-blue-200 transition-colors p-1.5"
                onClick={() => setIsDifferentWhatsApp(false)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setIsDifferentWhatsApp(false);
                  }
                }}
                title={t("checkout.personal_info.switch_to_phone")}
                aria-label={t("checkout.personal_info.switch_to_phone")}
              >
                <ArrowRightLeft className="h-3.5 w-3.5 text-blue-600" />
              </div>
            </div>
          </div>
        ) : null}

        {showPhone &&
          isPhoneValid === false &&
          customerDetails.phoneNumber &&
          customerDetails.phoneNumber.trim().length >= 7 && (
            <p className="text-xs text-red-600 mt-2">
              {t("checkout.personal_info.phone_validation_error")}
            </p>
          )}
      </div>
    </div>
  );
}
