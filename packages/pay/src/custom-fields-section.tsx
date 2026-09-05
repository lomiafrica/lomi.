"use client";

import React from "react";
import type { CheckoutCustomFieldDefinition } from "@lomi./shared";
import { CheckoutFloatField } from "./checkout-float-field";
import type { TranslateFn } from "./types";

interface CustomCheckoutFieldsSectionProps {
  t: TranslateFn;
  customFields: CheckoutCustomFieldDefinition[];
  customFieldValues: Record<string, string>;
  setCustomFieldValues: (
    value:
      | Record<string, string>
      | ((prev: Record<string, string>) => Record<string, string>),
  ) => void;
}

export function CustomCheckoutFieldsSection({
  t,
  customFields,
  customFieldValues,
  setCustomFieldValues,
}: CustomCheckoutFieldsSectionProps) {
  if (!customFields || customFields.length === 0) {
    return null;
  }

  const handleFieldChange = (fieldId: string, value: string) => {
    setCustomFieldValues((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
  };

  const stackRoundingClass = (index: number, total: number) => {
    if (total === 1) {
      return "rounded-sm";
    }
    if (index === 0) {
      return "rounded-tl rounded-tr rounded-b-none";
    }
    if (index === total - 1) {
      return "rounded-bl rounded-br rounded-t-none";
    }
    return "rounded-none";
  };

  const renderField = (
    field: CheckoutCustomFieldDefinition,
    index: number,
    total: number,
  ) => {
    const value = customFieldValues[field.id] || "";
    const roundingClass = stackRoundingClass(index, total);

    if (field.type === "checkbox" || field.type === "terms") {
      return (
        <label
          key={field.id}
          className={`flex items-start gap-3 border border-gray-300 bg-white px-3 py-3 text-sm text-gray-900 ${roundingClass}`}
        >
          <input
            type="checkbox"
            name={field.id}
            checked={value === "true"}
            onChange={(e) =>
              handleFieldChange(field.id, e.target.checked ? "true" : "")
            }
            required={field.required}
            className="mt-0.5 h-4 w-4 shrink-0 rounded border-gray-300"
          />
          <span className="leading-snug">
            {field.label}
            {field.required ? (
              <span className="ml-1 text-red-500">*</span>
            ) : null}
          </span>
        </label>
      );
    }

    const isLast = index === total - 1;
    const inputMode =
      field.type === "email"
        ? "email"
        : field.type === "url"
          ? "url"
          : undefined;
    const autoComplete =
      field.type === "email"
        ? "email"
        : field.type === "url"
          ? "url"
          : undefined;

    return (
      <CheckoutFloatField
        name={field.id}
        type={field.type}
        label={field.label}
        hint={field.placeholder}
        value={value}
        onChange={(e) => handleFieldChange(field.id, e.target.value)}
        required={field.required}
        pattern={field.validation?.pattern}
        inputMode={inputMode}
        autoComplete={autoComplete}
        enterKeyHint={isLast ? "done" : "next"}
        roundingClass={`${roundingClass} border-gray-300`}
        endAdornment={
          field.required ? (
            <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-red-500 pointer-events-none">
              *
            </span>
          ) : null
        }
      />
    );
  };

  return (
    <div className="checkout-form-section space-y-2.5">
      <label className="checkout-form-title block text-sm font-normal text-gray-700 select-none">
        {t("checkout.custom_fields.title")}
      </label>
      <div className="checkout-field-stack overflow-hidden rounded-sm shadow-sm shadow-black/[.04]">
        {customFields.map((field, index) => (
          <div key={field.id} className={index > 0 ? "flex -mt-px" : "flex"}>
            <div className="w-full">
              {renderField(field, index, customFields.length)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
