/** Matches Tailwind `rounded-sm` (`calc(var(--radius) - 4px)`). */
export const interiorRadiusPx = 4;
export const interiorRadiusClass = "rounded-sm";

/** Soft rim so a control sits on the page (Beecargo `--shadow-button`). */
export const interiorButtonRelief =
  "shadow-[inset_0_1.5px_0_rgba(255,255,255,0.95),inset_0_0_0_1px_rgba(28,25,23,0.05),0_1px_2px_rgba(28,25,23,0.05)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.08),inset_0_0_0_1px_rgba(255,255,255,0.06),0_1px_2px_rgba(0,0,0,0.3)]";

/** Top lip + edge ring for a filled dark primary. */
export const interiorPrimaryRelief =
  "shadow-[inset_0_1px_0_rgba(255,255,255,0.22),inset_0_0_0_1px_rgba(255,255,255,0.08),0_1px_2px_rgba(28,25,23,0.2)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.14),inset_0_0_0_1px_rgba(255,255,255,0.1),0_1px_2px_rgba(0,0,0,0.4)]";

/** Shared surface language — stone, field-matched radius, raised rim. */
export const interiorSurface =
  `rounded-sm border border-stone-200 bg-white text-stone-700 ${interiorButtonRelief} dark:border-white/[0.16] dark:bg-[#252522] dark:text-stone-200`;

export const interiorControl =
  "inline-flex h-9 touch-manipulation select-none items-center justify-center px-3 text-[13px] font-medium outline-none transition-[border-color,box-shadow,background-color] duration-150 hover:bg-stone-50 focus-visible:border-[#4568FF] focus-visible:shadow-[0_1px_2px_rgba(28,25,23,0.08),0_10px_20px_-14px_rgba(69,104,255,0.6)] disabled:opacity-50 dark:hover:bg-[#2A2A27] dark:focus-visible:border-[#93B0FF] dark:focus-visible:shadow-[0_10px_20px_-14px_rgba(147,176,255,0.5)]";

export const interiorField =
  "flex h-10 w-full rounded-sm border border-stone-200 bg-white px-3 text-[13px] text-stone-700 shadow-[inset_0_1.5px_0_rgba(255,255,255,0.95),inset_0_-1px_0_rgba(28,25,23,0.06)] outline-none transition-[border-color,box-shadow,background-color] duration-150 placeholder:text-stone-400 hover:border-stone-300 focus:border-[#4568FF] focus-visible:shadow-[0_1px_2px_rgba(28,25,23,0.08),0_10px_20px_-14px_rgba(69,104,255,0.6)] disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/[0.16] dark:bg-[#252522] dark:text-stone-200 dark:placeholder:text-stone-500 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.07)] dark:hover:border-white/25 dark:focus:border-[#93B0FF] dark:focus-visible:shadow-[0_10px_20px_-14px_rgba(147,176,255,0.5)]";
