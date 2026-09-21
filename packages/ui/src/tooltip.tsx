import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { cn } from "./cn";

/**
 * Tooltip vs native HTML `title`:
 * - Do not stack the same hover hint twice (e.g. Radix Tooltip on a parent and
 *   `title` on a child inside the trigger, or `<Tooltip><ActionIconButton label="…"/></Tooltip>`:
 *   `ActionIconButton` already wraps `label` in Tooltip — use `aria-label` on the inner
 *   control and keep a single outer Tooltip, or drop the outer wrapper).
 * - App chrome / plain controls: prefer `<Tooltip content={…} delayDuration={900}>`
 *   (see `ActionIconButton` for icon-only actions).
 *
 * Intentionally keep native DOM `title` (no Radix migration):
 * - Truncation / full-value peek (paths, tab ids, emails, stats, color hex, formula preview).
 * - `<iframe title>` for accessibility (e.g. web preview).
 * - `ActionIconButton`'s `label` prop (implemented as this Tooltip, not as a native attribute).
 *
 * Regression check: `rg "title=" src` — new plain `button`/`Button` triggers should not
 * combine native `title` with a Radix tooltip on the same node.
 */

const TooltipProvider = TooltipPrimitive.Provider;

const TooltipRoot = TooltipPrimitive.Root;

const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "z-[10000] overflow-hidden rounded bg-foreground/80 backdrop-blur-sm text-background px-1.5 py-0.5 mx-1 text-[11px] leading-snug shadow-md dark:bg-zinc-950 dark:text-zinc-50 dark:border dark:border-zinc-800",
        "animate-in fade-in-0 zoom-in-95",
        "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
        "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className,
      )}
      {...props}
    />
  </TooltipPrimitive.Portal>
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

interface TooltipProps
  extends React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Root> {
  children: React.ReactNode;
  content?: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
}

export function Tooltip({
  children,
  content,
  side = "bottom",
  delayDuration = 200,
  ...props
}: TooltipProps) {
  if (content !== undefined) {
    return (
      <TooltipRoot delayDuration={delayDuration} {...props}>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent side={side}>{content}</TooltipContent>
      </TooltipRoot>
    );
  }
  return (
    <TooltipRoot delayDuration={delayDuration} {...props}>
      {children}
    </TooltipRoot>
  );
}

export { TooltipProvider, TooltipRoot, TooltipTrigger, TooltipContent };
