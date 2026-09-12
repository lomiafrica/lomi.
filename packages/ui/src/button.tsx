"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import type { VariantProps } from "class-variance-authority";
import { motion, useReducedMotion } from "motion/react";
import Spinner from "./spinner";
import { cn } from "./cn";
import { buttonVariants } from "./button-variants";

const CELL = { type: "spring", stiffness: 520, damping: 34, mass: 0.45 } as const;

// motion/react ships React 18 button types. Docs typechecks this file with React 19.
const MotionButton = motion.button as React.ForwardRefExoticComponent<
  React.ButtonHTMLAttributes<HTMLButtonElement> &
    React.RefAttributes<HTMLButtonElement> & {
      whileTap?: { y: number };
      transition?: typeof CELL;
    }
>;

interface ButtonProps
  extends Omit<
      React.ButtonHTMLAttributes<HTMLButtonElement>,
      | "Icon"
      | "iconPlacement"
      | "onAnimationStart"
      | "onDrag"
      | "onDragStart"
      | "onDragEnd"
    >,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  leftSection?: React.ReactElement;
  rightSection?: React.ReactElement;
  Icon?: () => React.ReactElement | null;
  iconPlacement?: "left" | "right";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      children,
      disabled,
      loading = false,
      leftSection,
      rightSection,
      Icon,
      iconPlacement = "right",
      style,
      ...props
    },
    ref,
  ) => {
    const reduced = useReducedMotion();
    const isDisabled = loading || disabled;

    if (asChild) {
      return (
        <Slot
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref}
          style={{ touchAction: "manipulation", ...style }}
          aria-disabled={isDisabled || undefined}
          {...props}
        >
          {children as React.ComponentPropsWithoutRef<typeof Slot>["children"]}
        </Slot>
      );
    }

    const content: React.ReactNode[] = [];

    if (loading && !leftSection && !rightSection) {
      content.push(<Spinner key="loading-left" className="mr-2 h-3.5 w-3.5" />);
    } else if (loading && leftSection) {
      content.push(<Spinner key="loading-left" className="mr-2 h-3.5 w-3.5" />);
    } else if (!loading && leftSection) {
      content.push(
        <div key="left-section" className="mr-1">
          {leftSection}
        </div>,
      );
    } else if (!loading && Icon && iconPlacement === "left") {
      const iconElement = Icon();
      if (iconElement) {
        content.push(
          <div key="icon-left" className="mr-1">
            {iconElement}
          </div>,
        );
      }
    }

    if (children) {
      content.push(children);
    }

    if (!loading && rightSection) {
      content.push(
        <div key="right-section" className="ml-1">
          {rightSection}
        </div>,
      );
    } else if (!loading && Icon && iconPlacement === "right") {
      const iconElement = Icon();
      if (iconElement) {
        content.push(
          <div key="icon-right" className="ml-1">
            {iconElement}
          </div>,
        );
      }
    } else if (loading && rightSection) {
      content.push(
        <Spinner key="loading-right" className="ml-2 h-3.5 w-3.5" />,
      );
    }

    return (
      <MotionButton
        className={cn(buttonVariants({ variant, size, className }))}
        disabled={isDisabled}
        ref={ref}
        whileTap={isDisabled || reduced ? undefined : { y: 1 }}
        transition={CELL}
        style={{ touchAction: "manipulation", ...style }}
        {...props}
      >
        {content}
      </MotionButton>
    );
  },
);
Button.displayName = "Button";

export { Button };
export type { ButtonProps };
