import { attachOverlayDismiss, createOverlayShell } from "./overlay";
import {
  buildCheckoutUrl,
  validateEmbedOptions,
  type LomiCheckoutCompletePayload,
  type LomiEmbedOptions,
  type LomiEmbedResult,
} from "./utils";
import { isAllowedCheckoutOrigin, parseCheckoutMessage } from "./messages";

const CHECKOUT_HOST_PATTERN = /checkout\.lomi\.africa/i;

export const createCheckoutIframe = (
  options: LomiEmbedOptions,
): HTMLIFrameElement => {
  const iframe = document.createElement("iframe");
  iframe.src = buildCheckoutUrl(options);
  iframe.style.cssText = "width: 100%; height: 100%; border: none;";
  iframe.setAttribute("loading", "lazy");
  iframe.allow = "payment";
  return iframe;
};

export const createMessageHandler = (
  options: LomiEmbedOptions,
  checkoutUrl: string,
  iframe: HTMLIFrameElement,
  state: { closable: boolean },
  onClose?: () => void,
) => {
  return (event: MessageEvent) => {
    if (!isAllowedCheckoutOrigin(event.origin, checkoutUrl)) {
      return;
    }

    const parsed = parseCheckoutMessage(event.data);
    if (!parsed) {
      return;
    }

    if (parsed.event === "resize") {
      const height = parsed.height ?? 0;
      if (!height) {
        return;
      }
      options.onResize?.(height);
      if (options.mode === "inline") {
        iframe.style.height = `${Math.max(240, height)}px`;
      }
      return;
    }

    if (parsed.event === "confirmed") {
      state.closable = false;
      return;
    }

    if (parsed.event === "close") {
      if (state.closable) {
        onClose?.();
      }
      return;
    }

    if (parsed.event === "success" && parsed.payload) {
      options.onComplete?.(parsed.payload);
      onClose?.();
      return;
    }

    if (parsed.event === "error") {
      options.onError?.({
        code: parsed.code ?? "embed_error",
        message: parsed.message,
      });
    }
  };
};

export const loadLomiCheckout = (
  options: LomiEmbedOptions,
): LomiEmbedResult | undefined => {
  try {
    validateEmbedOptions(options);
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    return undefined;
  }

  const mode = options.mode || "modal";
  const iframe = createCheckoutIframe(options);
  const checkoutUrl = iframe.src;
  let overlay: HTMLDivElement | null = null;
  const state = { closable: true };

  const cleanup = () => {
    overlay?.remove();
    window.removeEventListener("message", messageHandler);
  };

  const messageHandler = createMessageHandler(
    options,
    checkoutUrl,
    iframe,
    state,
    cleanup,
  );
  window.addEventListener("message", messageHandler);

  if (mode === "inline") {
    const container = document.getElementById(options.elementId || "");
    if (!container) {
      console.error(`Lomi: Element with ID "${options.elementId}" not found.`);
      window.removeEventListener("message", messageHandler);
      return undefined;
    }

    container.innerHTML = "";
    container.appendChild(iframe);

    return {
      unmount: () => {
        container.innerHTML = "";
        window.removeEventListener("message", messageHandler);
      },
    };
  }

  const { overlay: modalOverlay, container } = createOverlayShell(options);
  overlay = modalOverlay;
  container.appendChild(iframe);

  const dismiss = () => {
    if (!state.closable) {
      return;
    }
    cleanup();
  };

  attachOverlayDismiss(overlay, dismiss);

  return {
    unmount: dismiss,
  };
};

export const mountInlineProductEmbeds = (): void => {
  const nodes = document.querySelectorAll<HTMLElement>(
    "[data-lomi-session-id]",
  );
  nodes.forEach((node) => {
    const sessionId = node.dataset.lomiSessionId;
    const checkoutUrl = node.dataset.lomiCheckoutUrl;
    const publicKey = node.dataset.lomiPublicKey || "";

    if (node.dataset.lomiMounted === "true") {
      return;
    }

    if (!checkoutUrl && (!sessionId || !publicKey)) {
      return;
    }

    if (!node.id) {
      node.id = `lomi-embed-${sessionId || "inline"}`;
    }

    node.dataset.lomiMounted = "true";
    loadLomiCheckout({
      publicKey: publicKey || undefined,
      sessionId,
      checkoutUrl,
      checkoutBaseUrl: node.dataset.lomiCheckoutBaseUrl,
      mode: "inline",
      elementId: node.id,
    });
  });
};

export const interceptCheckoutLinks = (): void => {
  document.querySelectorAll<HTMLAnchorElement>("a[href]").forEach((anchor) => {
    const href = anchor.getAttribute("href") || "";
    if (
      !CHECKOUT_HOST_PATTERN.test(href) ||
      anchor.dataset.lomiBound === "true"
    ) {
      return;
    }

    anchor.dataset.lomiBound = "true";
    anchor.addEventListener("click", (event) => {
      event.preventDefault();
      loadLomiCheckout({
        checkoutUrl: href,
        mode: "modal",
      });
    });
  });
};

export const observeDynamicEmbeds = (): MutationObserver => {
  const observer = new MutationObserver(() => {
    mountInlineProductEmbeds();
    interceptCheckoutLinks();
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });

  return observer;
};
