import { sileo } from "sileo";
import type { ReactNode } from "react";

type ToastVariant =
  | "default"
  | "destructive"
  | "info"
  | "success"
  | "locked"
  | "notice";

type ToastAction = {
  label: string;
  onClick: () => void;
};

type ToastOptions = {
  title?: ReactNode;
  description?: ReactNode;
  variant?: ToastVariant;
  duration?: number;
  action?: ToastAction;
};

function isString<Value>(value: Value): value is Value & string {
  return typeof value === "string";
}

/**
 * Adapter that maps the product toast API to sileo.
 */
function toast(options: ToastOptions) {
  const { title, description, variant = "default", duration, action } = options;

  let titleStr: string | undefined;
  if (title !== undefined) {
    titleStr = isString(title) ? title : String(title);
  }

  const hasDescription =
    description !== undefined && description !== null && description !== "";
  const toastOptions = {
    title: titleStr,
    ...(hasDescription && {
      description: isString(description) ? description : description,
    }),
    duration: duration ?? undefined,
    button: action
      ? {
          title: action.label,
          onClick: action.onClick,
        }
      : undefined,
  };

  let toastId: string;

  switch (variant) {
    case "success":
      toastId = sileo.success(toastOptions);
      break;
    case "destructive":
      toastId = sileo.error(toastOptions);
      break;
    case "info":
    case "notice":
      toastId = sileo.info(toastOptions);
      break;
    case "locked":
      toastId = sileo.warning(toastOptions);
      break;
    case "default":
      toastId = sileo.show(toastOptions);
      break;
    default: {
      const _exhaustive: never = variant;
      void _exhaustive;
      toastId = sileo.show(toastOptions);
      break;
    }
  }

  return {
    id: toastId,
    dismiss: () => sileo.dismiss(toastId),
    update: (props: Partial<ToastOptions>) => {
      sileo.dismiss(toastId);
      return toast({ ...options, ...props });
    },
  };
}

function useToast() {
  return {
    toast,
    dismiss: (id?: string) => {
      if (id) {
        sileo.dismiss(id);
      } else {
        sileo.clear();
      }
    },
    toasts: [] as const,
  };
}

export { useToast, toast };
export type { ToastOptions, ToastVariant, ToastAction };
