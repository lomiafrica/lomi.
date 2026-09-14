import {
  DEFAULT_MAX_WIDTH,
  DEFAULT_MODAL_HEIGHT,
  DEFAULT_MODAL_HEIGHT_DESKTOP,
  OVERLAY_ID,
  type LomiEmbedOptions,
} from "./utils";

export interface OverlayShell {
  overlay: HTMLDivElement;
  container: HTMLDivElement;
}

export const getModalStyles = (options: LomiEmbedOptions) => ({
  overlay: `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.6);
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8px;
    box-sizing: border-box;
  `,
  container: `
    width: ${options.width || "100%"};
    max-width: ${options.maxWidth || DEFAULT_MAX_WIDTH};
    height: ${options.modalHeight || (window.innerWidth >= 640 ? DEFAULT_MODAL_HEIGHT_DESKTOP : DEFAULT_MODAL_HEIGHT)};
    background-color: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  `,
  iframe: `
    width: 100%;
    height: 100%;
    border: none;
  `,
});

export const createOverlayShell = (options: LomiEmbedOptions): OverlayShell => {
  const existing = document.getElementById(OVERLAY_ID);
  existing?.remove();

  const styles = getModalStyles(options);
  const overlay = document.createElement("div");
  overlay.id = OVERLAY_ID;
  overlay.style.cssText = styles.overlay;

  const container = document.createElement("div");
  container.style.cssText = styles.container;

  overlay.appendChild(container);
  document.body.appendChild(overlay);

  return { overlay, container };
};

export const attachOverlayDismiss = (
  overlay: HTMLDivElement,
  onDismiss: () => void,
): void => {
  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) {
      onDismiss();
    }
  });
};
