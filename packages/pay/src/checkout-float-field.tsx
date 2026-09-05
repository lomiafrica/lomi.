"use client";

import {
  useId,
  useState,
  type ChangeEvent,
  type InputHTMLAttributes,
  type ReactNode,
  type Ref,
} from "react";
import { Input } from "@lomi./ui/input";

export function CheckoutFloatField({
  id,
  name,
  type = "text",
  label,
  hint,
  value,
  onChange,
  required = false,
  autoComplete,
  pattern,
  inputMode,
  enterKeyHint,
  inputRef,
  roundingClass,
  endAdornment,
}: {
  id?: string;
  name?: string;
  type?: string;
  label: string;
  hint?: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  autoComplete?: string;
  pattern?: string;
  inputMode?: InputHTMLAttributes<HTMLInputElement>["inputMode"];
  enterKeyHint?: InputHTMLAttributes<HTMLInputElement>["enterKeyHint"];
  inputRef?: Ref<HTMLInputElement>;
  roundingClass: string;
  endAdornment?: ReactNode;
}) {
  const autoId = useId();
  const fieldId = id ?? autoId;
  const [focused, setFocused] = useState(false);
  const filled = value.trim().length > 0;
  const raised = focused || filled;

  return (
    <div className="relative">
      <label
        htmlFor={fieldId}
        className={`pointer-events-none absolute left-3 z-10 origin-left select-none text-gray-500 transition-[top,transform,font-size] duration-150 ${
          raised
            ? "top-1.5 text-[11px] leading-none"
            : "top-1/2 -translate-y-1/2 text-[13px]"
        }`}
      >
        {label}
      </label>
      <Input
        ref={inputRef}
        id={fieldId}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={focused && !filled ? hint : undefined}
        required={required}
        autoComplete={autoComplete}
        pattern={pattern}
        inputMode={inputMode}
        enterKeyHint={enterKeyHint}
        className={`${roundingClass} h-11 w-full bg-white pt-3.5 text-base text-gray-900 placeholder:text-gray-400 md:text-sm ${
          raised ? "" : "caret-transparent"
        }`}
      />
      {endAdornment}
    </div>
  );
}
