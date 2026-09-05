"use client";

import * as React from "react";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import * as RPNInput from "react-phone-number-input";
import flags from "react-phone-number-input/flags";
import { isValidPhoneNumber } from "react-phone-number-input";
import { CheckIcon, ChevronDown, PencilIcon, Phone } from "lucide-react";
import { cn } from "./cn";
import { Button } from "./button";

const PhoneInputCompactContext = createContext(false);
const PhoneInputForceLightContext = createContext(false);

type PhoneStackRole = "solo" | "first" | "middle" | "last";

const PhoneInputStackContext = createContext<PhoneStackRole>("solo");

function resolvePhoneStackRole(
  isFirstInStack: boolean,
  isMiddleInStack: boolean,
  isLastInStack: boolean,
): PhoneStackRole {
  if (isFirstInStack) return "first";
  if (isMiddleInStack) return "middle";
  if (isLastInStack) return "last";
  return "solo";
}

function phoneStackWrapperClass(stackRole: PhoneStackRole): string {
  switch (stackRole) {
    case "first":
      return "phone-input-first-in-stack box-border h-10 min-h-10 rounded-t-sm rounded-b-none border border-gray-300 dark:border-white/[0.16]";
    case "middle":
      return "phone-input-middle-in-stack box-border h-10 min-h-10 rounded-none border border-gray-300 dark:border-white/[0.16]";
    case "last":
      return "phone-input-last-in-stack box-border h-10 min-h-10 rounded-t-none rounded-b-sm border border-gray-300 dark:border-white/[0.16]";
    case "solo":
      return "box-border h-10 min-h-10 rounded-sm border border-stone-200 shadow-[inset_0_1.5px_0_rgba(255,255,255,0.95),inset_0_-1px_0_rgba(28,25,23,0.06)] dark:border-white/[0.16] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.07)]";
    default: {
      const _exhaustive: never = stackRole;
      return _exhaustive;
    }
  }
}

export type PhoneCountryCode = RPNInput.Country;

function isPhoneCountry(value: string): value is RPNInput.Country {
  for (const country of RPNInput.getCountries()) {
    if (country === value) return true;
  }
  return false;
}

export function parsePhoneCountry(value: string): RPNInput.Country | undefined {
  return isPhoneCountry(value) ? value : undefined;
}

export type PhoneNumberInputProps = {
  value: string;
  onChange: (value: string | undefined) => void;
  /** ISO alpha-2 country code. */
  onCountryChange?: (country: string | undefined) => void;
  onValidationChange?: (isValid: boolean | undefined) => void;
  onSave?: (value: string) => Promise<void> | void;
  defaultCountry?: PhoneCountryCode;
  placeholder?: string;
  className?: string;
  label?: string;
  isLoading?: boolean;
  /** When true, field is always editable (no pencil/save). */
  directEdit?: boolean;
  /** Compact height for inline table controls. */
  compact?: boolean;
  /** Restrict country list; first entry is used as default when set. */
  countries?: PhoneCountryCode[];
  /** Checkout stacked form: top border + top rounding. */
  isFirstInStack?: boolean;
  /** Checkout stacked form: square joins (email above, WhatsApp below). */
  isMiddleInStack?: boolean;
  /** Checkout stacked form: bottom rounding only. */
  isLastInStack?: boolean;
  disabled?: boolean;
  /** Show required asterisk (checkout). */
  requiredMark?: boolean;
  /** Keep dark text on a light surface even when the page is in dark mode. */
  forceLight?: boolean;
};

export function PhoneNumberInput({
  value,
  onChange,
  onCountryChange,
  onValidationChange,
  onSave,
  defaultCountry = "CI",
  placeholder = "Enter your phone number",
  className,
  isLoading = false,
  directEdit = false,
  compact = false,
  countries: countriesProp,
  isFirstInStack = false,
  isMiddleInStack = false,
  isLastInStack = false,
  disabled = false,
  requiredMark = false,
  forceLight = false,
}: PhoneNumberInputProps) {
  const stackRole = resolvePhoneStackRole(
    isFirstInStack,
    isMiddleInStack,
    isLastInStack,
  );
  const [isEditing, setIsEditing] = useState(directEdit);
  const hasTouchedRef = useRef(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resolvedDefault =
    countriesProp && countriesProp.length > 0
      ? countriesProp[0]
      : defaultCountry;

  const markTouched = useCallback(() => {
    hasTouchedRef.current = true;
  }, []);

  const validatePhoneNumber = useCallback(
    (phoneValue: string) => {
      if (!onValidationChange) return;
      if (phoneValue && phoneValue.trim().length >= 7) {
        onValidationChange(isValidPhoneNumber(phoneValue));
      } else if (phoneValue && phoneValue.trim().length > 0) {
        onValidationChange(undefined);
      } else {
        onValidationChange(undefined);
      }
    },
    [onValidationChange],
  );

  useEffect(() => {
    if (!onValidationChange) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const hasMeaningfulValue = Boolean(value && value.trim().length >= 7);
      if (hasTouchedRef.current || hasMeaningfulValue) {
        validatePhoneNumber(value);
      }
    }, 500);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [value, validatePhoneNumber, onValidationChange]);

  const handleEdit = () => {
    if (!directEdit) {
      setIsEditing(true);
      setTimeout(() => {
        const phoneInput = document.querySelector(".PhoneInputInput");
        if (phoneInput instanceof HTMLInputElement) {
          phoneInput.focus();
        }
      }, 0);
    }
  };

  const handleSave = async () => {
    if (onSave && !directEdit) {
      await onSave(value);
    }
    if (!directEdit) {
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (directEdit) return;
      e.preventDefault();
      void handleSave();
    } else if (e.key === "Escape") {
      setIsEditing(false);
    }
  };

  const showActionButton = Boolean(onSave) && !directEdit;
  const fieldDisabled =
    disabled || (!isEditing && !directEdit && Boolean(onSave));

  return (
    <PhoneInputCompactContext.Provider value={compact}>
      <PhoneInputForceLightContext.Provider value={forceLight}>
      <PhoneInputStackContext.Provider value={stackRole}>
        <div className={cn(compact || stackRole !== "solo" ? "space-y-0" : "space-y-2")}>
          <div className="relative">
          <div
            className={cn(
              "flex w-full overflow-hidden bg-transparent transition-colors",
              compact
                ? "phone-input-compact h-7 rounded-sm border border-stone-200 dark:border-white/[0.16]"
                : phoneStackWrapperClass(stackRole),
              showActionButton && !compact && "pr-9",
              className,
            )}
          >
            <RPNInput.default
              className={cn(
                "flex PhoneInput w-full",
                compact
                  ? "h-7 min-h-0 items-stretch"
                  : "h-full min-h-0 items-stretch",
              )}
              international
              defaultCountry={resolvedDefault}
              {...(countriesProp &&
                countriesProp.length > 0 && { countries: countriesProp })}
              flagComponent={FlagComponent}
              countrySelectComponent={CountrySelect}
              inputComponent={PhoneField}
              placeholder={placeholder}
              value={value}
              onChange={(next) => {
                markTouched();
                onChange(next);
              }}
              onCountryChange={(countryCode) => {
                markTouched();
                onCountryChange?.(countryCode);
              }}
              smartCaret={true}
              countryCallingCodeEditable={true}
              disabled={fieldDisabled}
              onKeyDown={handleKeyDown}
              onBlur={() => {
                markTouched();
                validatePhoneNumber(value);
              }}
            />
          </div>
          {requiredMark ? (
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-red-500">
              *
            </span>
          ) : null}
          {showActionButton && !isEditing ? (
            <Button
              onClick={handleEdit}
              variant="transparent"
              size="icon-sm"
              className="absolute right-1 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 focus-visible:ring-0 dark:hover:text-stone-200"
              type="button"
              aria-label="Edit phone number"
            >
              <PencilIcon className="h-3 w-3" />
            </Button>
          ) : null}
          {showActionButton && isEditing ? (
            <Button
              type="button"
              onClick={() => void handleSave()}
              variant="transparent"
              size="icon-sm"
              className="absolute right-1 top-1/2 -translate-y-1/2 text-green-500 hover:text-green-600 focus-visible:ring-0"
              disabled={isLoading}
              aria-label="Save phone number"
            >
              <CheckIcon className="h-4 w-4" />
            </Button>
          ) : null}
        </div>
        </div>
      </PhoneInputStackContext.Provider>
      </PhoneInputForceLightContext.Provider>
    </PhoneInputCompactContext.Provider>
  );
}

const PhoneField = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => {
  const compact = useContext(PhoneInputCompactContext);
  const forceLight = useContext(PhoneInputForceLightContext);
  const stackRole = useContext(PhoneInputStackContext);
  const squareJoins = !compact && stackRole !== "solo";

  return (
    <input
      ref={ref}
      className={cn(
        "PhoneInputInput file:text-foreground selection:bg-primary selection:text-primary-foreground bg-transparent text-stone-700 placeholder:text-stone-400",
        forceLight
          ? "dark:text-stone-700 dark:placeholder:text-stone-400"
          : "dark:text-stone-200 dark:placeholder:text-stone-500",
        compact
          ? "flex h-full w-full min-w-0 px-2 py-0 text-xs outline-none"
          : "flex h-full w-full min-w-0 px-3 py-1 text-[13px] outline-none",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-100",
        "border-0 shadow-none rounded-l-none",
        squareJoins ? "rounded-r-none" : "rounded-r-[9px]",
        className,
      )}
      {...props}
      autoComplete="tel"
      data-lpignore="true"
      data-form-type="other"
    />
  );
});
PhoneField.displayName = "PhoneField";

type CountrySelectProps = {
  disabled?: boolean;
  value: RPNInput.Country;
  onChange: (value: RPNInput.Country) => void;
  options: { label: string; value: RPNInput.Country }[];
};

function CountrySelect({
  disabled,
  value,
  onChange,
  options,
}: CountrySelectProps) {
  const compact = useContext(PhoneInputCompactContext);
  const forceLight = useContext(PhoneInputForceLightContext);
  const stackRole = useContext(PhoneInputStackContext);
  const squareJoins = !compact && stackRole !== "solo";

  return (
    <div
      className={cn(
        "PhoneInputCountry relative items-center bg-transparent text-stone-700 outline-none",
        forceLight ? "dark:text-stone-700" : "dark:text-stone-200",
        compact
          ? cn(
              "flex h-full min-h-0 min-w-0 shrink-0 rounded-l-[9px] rounded-r-none border-y-0 border-l-0 border-r px-2 py-0",
              forceLight
                ? "border-gray-300 dark:border-gray-300"
                : "border-stone-200 dark:border-white/[0.16]",
            )
          : cn(
              "flex h-full min-h-0 min-w-[65px] max-w-[70px] shrink-0 self-stretch rounded-r-none border-y-0 border-l-0 border-r px-3 py-0",
              forceLight
                ? "border-gray-300 dark:border-gray-300"
                : "border-stone-200 dark:border-white/[0.16]",
              squareJoins ? "rounded-l-none" : "rounded-l-[9px]",
            ),
        disabled && "pointer-events-none cursor-not-allowed",
      )}
    >
      <div
        className={cn(
          "inline-flex items-center",
          compact ? "gap-1" : "gap-1.5",
        )}
        aria-hidden="true"
      >
        <FlagComponent country={value} countryName={value} />
        <span className="text-stone-400">
          <ChevronDown
            size={compact ? 12 : 14}
            strokeWidth={2}
            aria-hidden="true"
          />
        </span>
      </div>
      <select
        disabled={disabled}
        value={value || ""}
        onChange={(event) => {
          const nextCountry = parsePhoneCountry(event.target.value);
          if (nextCountry !== undefined) {
            onChange(nextCountry);
          }
        }}
        className="absolute inset-0 cursor-pointer text-sm opacity-0 outline-none"
        aria-label="Select country"
        data-lpignore="true"
      >
        <option value="">Select country</option>
        {options
          .filter((x) => x.value)
          .map((option) => (
            <option key={option.value || "empty"} value={option.value}>
              {option.label}{" "}
              {option.value
                ? `+${RPNInput.getCountryCallingCode(option.value)}`
                : ""}
            </option>
          ))}
      </select>
    </div>
  );
}

function FlagComponent({ country, countryName }: RPNInput.FlagProps) {
  const compact = useContext(PhoneInputCompactContext);
  const Flag = flags[country];

  return (
    <span
      className={cn(
        "flex items-center justify-center overflow-hidden rounded-[3px]",
        compact ? "h-3 w-4" : "h-4 w-5",
      )}
    >
      {Flag ? (
        <Flag title={countryName} />
      ) : (
        <Phone
          size={compact ? 12 : 16}
          aria-hidden="true"
          role="presentation"
        />
      )}
    </span>
  );
}

export type WhatsAppNumberInputProps = {
  value: string;
  onChange: (value: string | undefined) => void;
  defaultCountry?: PhoneCountryCode;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  isLastInStack?: boolean;
};

export function WhatsAppNumberInput({
  value,
  onChange,
  defaultCountry = "CI",
  placeholder = "WhatsApp number",
  className,
  disabled = false,
  isLastInStack = false,
}: WhatsAppNumberInputProps) {
  return (
    <PhoneNumberInput
      value={value}
      onChange={onChange}
      defaultCountry={defaultCountry}
      placeholder={placeholder}
      className={cn("pr-10", className)}
      disabled={disabled}
      directEdit
      isLastInStack={isLastInStack}
    />
  );
}
