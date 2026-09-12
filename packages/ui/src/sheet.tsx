import * as React from "react";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";
import { cn } from "./cn";
import { createToastAwarePointerDownOutside } from "./overlay-interaction";

const mobileNavInsetClassName =
  "top-[calc(4rem+env(safe-area-inset-top,0px))] bottom-[calc(4rem+env(safe-area-inset-bottom,0px))] md:top-0 md:bottom-0";

const SHEET_CLOSE_DURATION_MS = 300;

type SheetProps = React.ComponentPropsWithoutRef<typeof SheetPrimitive.Root>;

function Sheet({ open, onOpenChange, ...props }: SheetProps) {
  const [isClosing, setIsClosing] = React.useState(false);

  const handleOpenChange = React.useCallback(
    (next: boolean) => {
      if (!next) {
        setIsClosing(true);
        window.setTimeout(() => {
          onOpenChange?.(false);
          setIsClosing(false);
        }, SHEET_CLOSE_DURATION_MS);
      } else {
        setIsClosing(false);
        onOpenChange?.(next);
      }
    },
    [onOpenChange],
  );

  const isControlled = open !== undefined;
  const derivedOpen = isControlled ? (isClosing ? false : open) : open;

  return (
    <SheetPrimitive.Root
      open={derivedOpen}
      onOpenChange={handleOpenChange}
      {...props}
    />
  );
}
Sheet.displayName = "Sheet";

const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Overlay
    className={cn(
      "fixed inset-0 z-40 bg-background/20 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:duration-300 data-[state=open]:duration-200",
      className,
    )}
    {...props}
    ref={ref}
  />
));
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName;

const sheetVariants = cva(
  "fixed z-40 gap-3 rounded-sm border-stone-200 bg-white p-6 text-stone-700 shadow-[0_8px_32px_-12px_rgba(28,25,23,0.28)] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500 dark:border-white/[0.16] dark:bg-[#252522] dark:text-stone-200 dark:shadow-[0_8px_32px_-12px_rgba(0,0,0,0.55)]",
  {
    variants: {
      side: {
        top: cn(
          "inset-x-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
          "top-[calc(4rem+env(safe-area-inset-top,0px))] md:top-0",
        ),
        bottom: cn(
          "inset-x-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
          "bottom-[calc(4rem+env(safe-area-inset-bottom,0px))] md:bottom-0",
        ),
        left: cn(
          "left-0 w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
          mobileNavInsetClassName,
          "h-auto md:inset-y-0 md:h-full",
        ),
        right: cn(
          "right-0 w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=closed]:duration-300 data-[state=open]:slide-in-from-right sm:max-w-sm",
          mobileNavInsetClassName,
          "h-auto md:inset-y-0 md:h-full",
        ),
      },
    },
    defaultVariants: {
      side: "right",
    },
  },
);

interface SheetContentProps
  extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content>,
    VariantProps<typeof sheetVariants> {
  overlayClassName?: string;
}

const SheetContent = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Content>,
  SheetContentProps
>(({ side = "right", className, overlayClassName, children, ...props }, ref) => {
  const handlePointerDownOutside = createToastAwarePointerDownOutside();

  return (
    <SheetPrimitive.Portal>
      <SheetOverlay className={overlayClassName} />
      <SheetPrimitive.Content
        ref={ref}
        className={cn(sheetVariants({ side }), className)}
        onPointerDownOutside={handlePointerDownOutside}
        {...props}
      >
        {children}
        <SheetPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus-visible:border-[#4568FF] disabled:pointer-events-none data-[state=open]:bg-secondary">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </SheetPrimitive.Close>
      </SheetPrimitive.Content>
    </SheetPrimitive.Portal>
  );
});
SheetContent.displayName = SheetPrimitive.Content.displayName;

const SheetHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-2 text-center sm:text-left",
      className,
    )}
    {...props}
  />
);
SheetHeader.displayName = "SheetHeader";

const SheetFooter = ({
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
SheetFooter.displayName = "SheetFooter";

const SheetTitle = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold text-foreground", className)}
    {...props}
  />
));
SheetTitle.displayName = SheetPrimitive.Title.displayName;

const SheetDescription = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Description>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
SheetDescription.displayName = SheetPrimitive.Description.displayName;
const SheetTrigger = SheetPrimitive.Trigger;

export {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
};
