import * as React from "react";
import { cn } from "./cn";

/**
 * Inline lomi. wordmark. Inherits font, size, weight, tracking, and color.
 * Cropped l stem; square i tittle and period. Does not change the typeface.
 *
 * Standalone brand token only (`lomi.` before space / end / CJK). Leaves
 * lomi.africa, @lomi./sdk, and similar identifiers alone.
 */
export const LOMI_BRAND_PATTERN = /(lomi\.(?![\w./]))/g;

const DOT_EM = 0.17;
const L_CROP = "inset(0.2em 0 0 0)";
const I_CROP = "inset(0.3em 0 0 0)";

function SquareDot({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <span
      aria-hidden
      className={cn("absolute bg-current", className)}
      style={{ width: `${DOT_EM}em`, height: `${DOT_EM}em`, ...style }}
    />
  );
}

export function LomiWordmark({ className }: { className?: string }) {
  return (
    <span className={cn("inline-block whitespace-nowrap", className)}>
      <span className="inline-block" style={{ clipPath: L_CROP }}>
        l
      </span>
      om
      <span className="relative inline-block">
        <span className="inline-block" style={{ clipPath: I_CROP }}>
          i
        </span>
        <SquareDot
          className="left-1/2 -translate-x-1/2"
          style={{ top: "0.07em" }}
        />
      </span>
      <span className="relative inline-block">
        <span className="text-transparent">.</span>
        <SquareDot
          className="bottom-[0.08em] left-1/2 -translate-x-1/2"
        />
      </span>
    </span>
  );
}

export function lomiWordmarkHtml(): string {
  return `<span style="display:inline-block;white-space:nowrap"><span style="display:inline-block;clip-path:inset(0.2em 0 0 0)">l</span>om<span style="position:relative;display:inline-block"><span style="display:inline-block;clip-path:inset(0.3em 0 0 0)">i</span><span aria-hidden="true" style="position:absolute;left:50%;top:0.07em;width:0.17em;height:0.17em;background:currentColor;transform:translateX(-50%)"></span></span><span style="position:relative;display:inline-block"><span style="color:transparent">.</span><span aria-hidden="true" style="position:absolute;left:50%;bottom:0.08em;width:0.17em;height:0.17em;background:currentColor;transform:translateX(-50%)"></span></span></span>`;
}

export function applyLomiWordmarkHtml(html: string): string {
  return html.replace(LOMI_BRAND_PATTERN, lomiWordmarkHtml());
}

export function LomiText({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const parts = text.split(LOMI_BRAND_PATTERN);
  return (
    <>
      {parts.map((part, index) =>
        part === "lomi." ? (
          <LomiWordmark key={index} className={className} />
        ) : (
          <React.Fragment key={index}>{part}</React.Fragment>
        ),
      )}
    </>
  );
}
