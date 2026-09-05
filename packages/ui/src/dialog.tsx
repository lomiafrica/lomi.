import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "./cn";
import { Button } from "./button";
import { createToastAwarePointerDownOutside } from "./overlay-interaction";

const Dialog = DialogPrimitive.Root;

const DialogTrigger = DialogPrimitive.Trigger;

const DialogPortal = DialogPrimitive.Portal;

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/40 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className,
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

type DialogContentVariant = "default" | "slide-up" | "fade";

function dialogMotionClassName(variant: DialogContentVariant): string {
  switch (variant) {
    case "slide-up":
      return "data-[state=closed]:slide-out-to-bottom-[48%] data-[state=open]:slide-in-from-bottom-[48%] data-[state=open]:duration-500 data-[state=closed]:duration-300";
    case "fade":
      return "data-[state=open]:slide-in-from-top-2 data-[state=closed]:slide-out-to-top-2";
    case "default":
      return "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[52%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]";
    default: {
      const _exhaustive: never = variant;
      return _exhaustive;
    }
  }
}

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
    showCloseButton?: boolean;
    onCloseClick?: () => void;
    variant?: DialogContentVariant;
    showOverlay?: boolean;
    overlayClassName?: string;
  }
>(
  (
    {
      className,
      children,
      showCloseButton = true,
      onCloseClick,
      variant = "default",
      showOverlay = true,
      overlayClassName,
      ...props
    },
    ref,
  ) => {
    const handleCloseClick = () => {
      onCloseClick?.();
    };

    const handlePointerDownOutside = createToastAwarePointerDownOutside();

    return (
      <DialogPortal>
        {showOverlay && <DialogOverlay className={overlayClassName} />}
        <DialogPrimitive.Content
          ref={ref}
          className={cn(
            "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-3 border border-stone-200 bg-white p-6 text-stone-700 shadow-[0_16px_40px_-24px_rgba(28,25,23,0.35)] duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 sm:rounded-sm dark:border-white/[0.16] dark:bg-[#252522] dark:text-stone-200 dark:shadow-[0_16px_40px_-24px_rgba(0,0,0,0.55)]",
            dialogMotionClassName(variant),
            className,
          )}
          onPointerDownOutside={handlePointerDownOutside}
          {...props}
        >
          {children}
          {showCloseButton &&
            (onCloseClick ? (
              <Button
                onClick={handleCloseClick}
                variant="ghost"
                size="header"
                className="absolute right-4 top-4 text-sm text-foreground hover:text-sidebar-accent-foreground px-1.5 py-1.5"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            ) : (
              <DialogPrimitive.Close className="absolute right-4 top-4 text-sm text-stone-500 hover:text-stone-800 hover:bg-stone-100 dark:text-stone-400 dark:hover:text-stone-100 dark:hover:bg-[#2A2A27] px-1.5 py-1.5 rounded-sm transition-colors focus:outline-none focus-visible:border-[#4568FF]">
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </DialogPrimitive.Close>
            ))}
        </DialogPrimitive.Content>
      </DialogPortal>
    );
  },
);
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className,
    )}
    {...props}
  />
);
DialogHeader.displayName = "DialogHeader";

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className,
    )}
    {...props}
  />
);
DialogFooter.displayName = "DialogFooter";

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className,
    )}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};
