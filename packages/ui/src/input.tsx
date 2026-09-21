import * as React from "react";
import { cn } from "./cn";
import { interiorField } from "./tokens";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  variant?: "default" | "filled";
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, variant = "default", ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          interiorField,
          variant === "filled" &&
            "border-transparent bg-stone-100 hover:bg-stone-200/70 focus:bg-white dark:bg-[#1F1F1C] dark:hover:bg-[#252522]",
          error &&
            "border-red-400 focus:border-red-500 focus-visible:shadow-[0_1px_2px_rgba(28,25,23,0.08),0_10px_20px_-14px_rgba(239,68,68,0.5)]",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
