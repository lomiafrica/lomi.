import * as React from "react";
import { useEffect, useRef, useCallback } from "react";
interface FuzzyTextProps {
  children: React.ReactNode;
  fontSize?: number | string;
  fontWeight?: string | number;
  fontFamily?: string;
  color?: string;
  enableHover?: boolean;
  baseIntensity?: number;
  hoverIntensity?: number;
  className?: string;
}

interface ExtendedCanvas extends HTMLCanvasElement {
  cleanupFuzzyText?: () => void;
}

function isFiniteNumber(value: number | string): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function isForwardedRefCallback<T>(
  ref: React.ForwardedRef<T>,
): ref is (instance: T | null) => void {
  return typeof ref === "function";
}

function isMutableRefObject<T>(
  ref: React.ForwardedRef<T>,
): ref is React.MutableRefObject<T | null> {
  return ref != null && typeof ref === "object" && "current" in ref;
}

function setForwardedRef<T>(
  ref: React.ForwardedRef<T>,
  value: T | null,
): void {
  if (!ref) return;
  if (isForwardedRefCallback(ref)) {
    ref(value);
    return;
  }
  if (isMutableRefObject(ref)) {
    ref.current = value;
  }
}

const FuzzyText = React.forwardRef<HTMLCanvasElement, FuzzyTextProps>(
  (
    {
      children,
      fontSize = "clamp(2rem, 8vw, 8rem)",
      fontWeight = 900,
      fontFamily = "inherit",
      color,
      enableHover = true,
      baseIntensity = 0.18,
      hoverIntensity = 0.5,
      className,
    },
    ref,
  ) => {
    const innerRef = useRef<ExtendedCanvas | null>(null);
    const setCanvasRef = useCallback(
      (node: ExtendedCanvas | null) => {
        innerRef.current = node;
        setForwardedRef(ref, node);
      },
      [ref],
    );
    const textColorRef = useRef<string>("");

    // Get the computed color from CSS variables
    const getComputedColor = useCallback(() => {
      if (color) return color;

      // Create temporary element to compute the actual color value
      const tempEl = document.createElement("div");
      tempEl.style.color = "var(--foreground)";
      document.body.appendChild(tempEl);
      const computedColor = window.getComputedStyle(tempEl).color;
      document.body.removeChild(tempEl);
      return computedColor;
    }, [color]);

    useEffect(() => {
      let animationFrameId: number;
      let isCancelled = false;
      const canvas = innerRef.current;
      if (!canvas) return;

      // Clean up previous animation if it exists
      if (canvas.cleanupFuzzyText) {
        canvas.cleanupFuzzyText();
      }

      const init = async () => {
        if (document.fonts?.ready) {
          await document.fonts.ready;
        }
        if (isCancelled) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const computedFontFamily =
          fontFamily === "inherit"
            ? window.getComputedStyle(canvas).fontFamily || "sans-serif"
            : fontFamily;

        const fontSizeIsNumber = isFiniteNumber(fontSize);
        const fontSizeStr = fontSizeIsNumber ? `${fontSize}px` : String(fontSize);
        let numericFontSize: number;
        if (fontSizeIsNumber) {
          numericFontSize = fontSize;
        } else {
          const temp = document.createElement("span");
          temp.style.fontSize = fontSizeStr;
          document.body.appendChild(temp);
          const computedSize = window.getComputedStyle(temp).fontSize;
          numericFontSize = parseFloat(computedSize);
          document.body.removeChild(temp);
        }

        const text = React.Children.toArray(children).join("");

        const offscreen = document.createElement("canvas");
        const offCtx = offscreen.getContext("2d");
        if (!offCtx) return;

        offCtx.font = `${fontWeight} ${fontSizeStr} ${computedFontFamily}`;
        offCtx.textBaseline = "alphabetic";
        const metrics = offCtx.measureText(text);

        const actualLeft = metrics.actualBoundingBoxLeft ?? 0;
        const actualAscent = metrics.actualBoundingBoxAscent ?? numericFontSize;
        const actualDescent =
          metrics.actualBoundingBoxDescent ?? numericFontSize * 0.2;

        const textBoundingWidth = Math.ceil(metrics.width);
        const tightHeight = Math.ceil(actualAscent + actualDescent);

        const extraWidthBuffer = 20;
        const offscreenWidth = textBoundingWidth + extraWidthBuffer;

        offscreen.width = offscreenWidth;
        offscreen.height = tightHeight;

        const xOffset = extraWidthBuffer / 2; // 10px
        offCtx.font = `${fontWeight} ${fontSizeStr} ${computedFontFamily}`;
        offCtx.textBaseline = "alphabetic";

        // Get the actual computed color
        textColorRef.current = getComputedColor();
        offCtx.fillStyle = textColorRef.current;
        offCtx.fillText(text, xOffset - actualLeft, actualAscent);

        const horizontalMargin = 50;
        const verticalMargin = 0;
        canvas.width = offscreenWidth + horizontalMargin * 2;
        canvas.height = tightHeight + verticalMargin * 2;
        ctx.translate(horizontalMargin, verticalMargin);

        const interactiveLeft = horizontalMargin + xOffset;
        const interactiveTop = verticalMargin;
        const interactiveRight = interactiveLeft + textBoundingWidth;
        const interactiveBottom = interactiveTop + tightHeight;

        let isHovering = false;
        const fuzzRange = 30;

        const run = () => {
          if (isCancelled) return;
          ctx.clearRect(
            -fuzzRange,
            -fuzzRange,
            offscreenWidth + 2 * fuzzRange,
            tightHeight + 2 * fuzzRange,
          );
          const intensity = isHovering ? hoverIntensity : baseIntensity;
          for (let j = 0; j < tightHeight; j++) {
            const dx = Math.floor(
              intensity * (Math.random() - 0.5) * fuzzRange,
            );
            ctx.drawImage(
              offscreen,
              0,
              j,
              offscreenWidth,
              1,
              dx,
              j,
              offscreenWidth,
              1,
            );
          }
          animationFrameId = window.requestAnimationFrame(run);
        };

        run();

        const isInsideTextArea = (x: number, y: number) =>
          x >= interactiveLeft &&
          x <= interactiveRight &&
          y >= interactiveTop &&
          y <= interactiveBottom;

        const handleMouseMove = (e: MouseEvent) => {
          if (!enableHover) return;
          const rect = canvas.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          isHovering = isInsideTextArea(x, y);
        };

        const handleMouseLeave = () => {
          isHovering = false;
        };

        const handleTouchMove = (e: TouchEvent) => {
          if (!enableHover) return;
          e.preventDefault();
          const rect = canvas.getBoundingClientRect();
          const touch = e.touches[0];
          if (touch) {
            const x = touch.clientX - rect.left;
            const y = touch.clientY - rect.top;
            isHovering = isInsideTextArea(x, y);
          }
        };

        const handleTouchEnd = () => {
          isHovering = false;
        };

        if (enableHover) {
          canvas.addEventListener("mousemove", handleMouseMove);
          canvas.addEventListener("mouseleave", handleMouseLeave);
          canvas.addEventListener("touchmove", handleTouchMove, {
            passive: false,
          });
          canvas.addEventListener("touchend", handleTouchEnd);
        }

        const cleanup = () => {
          window.cancelAnimationFrame(animationFrameId);
          if (enableHover) {
            canvas.removeEventListener("mousemove", handleMouseMove);
            canvas.removeEventListener("mouseleave", handleMouseLeave);
            canvas.removeEventListener("touchmove", handleTouchMove);
            canvas.removeEventListener("touchend", handleTouchEnd);
          }
        };

        canvas.cleanupFuzzyText = cleanup;
      };

      init();

      return () => {
        isCancelled = true;
        window.cancelAnimationFrame(animationFrameId);
        if (canvas && canvas.cleanupFuzzyText) {
          canvas.cleanupFuzzyText();
          canvas.cleanupFuzzyText = undefined;
        }
      };
    }, [
      children,
      fontSize,
      fontWeight,
      fontFamily,
      color,
      enableHover,
      baseIntensity,
      hoverIntensity,
      setCanvasRef,
      getComputedColor,
    ]);

    return <canvas ref={setCanvasRef} className={className} />;
  },
);

FuzzyText.displayName = "FuzzyText";

export { FuzzyText };
