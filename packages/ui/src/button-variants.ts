import { cva } from "class-variance-authority";

/** Quiet hairline — auth Connect / OAuth chrome. */
const authSurface =
  "border border-border/40 bg-card text-foreground shadow-none hover:bg-accent hover:border-border/50 dark:border-white/[0.16] dark:bg-[#252522] dark:text-stone-200 dark:hover:bg-[#2A2A27]";

/** Settings-row card — slightly stronger rim than default. */
const settingsSurface =
  "relative bg-card border border-border/80 shadow-sm text-foreground hover:bg-accent/50 hover:border-border hover:text-foreground dark:bg-muted dark:border-transparent dark:shadow-none dark:text-foreground/90 dark:hover:bg-[color-mix(in_hsl,hsl(var(--accent)),white_5%)]";

/** Filter trigger — full border, no relief. */
const filterSurface =
  "border border-border bg-card text-card-foreground shadow-none hover:bg-accent dark:border-white/[0.16] dark:bg-[#252522] dark:text-stone-200 dark:hover:bg-[#2A2A27]";

const liveButton =
  "bg-brand-600 text-white border-transparent shadow-none hover:brightness-110 focus-visible:brightness-110 dark:bg-sky-900 dark:text-sky-300 dark:hover:brightness-100 dark:hover:bg-sky-800 dark:hover:text-sky-200";

export const buttonVariants = cva(
  "inline-flex cursor-pointer touch-manipulation items-center justify-center gap-2 whitespace-nowrap rounded-sm text-[13px] font-medium outline-none ring-offset-background transition-[border-color,box-shadow,background-color] duration-150 select-none focus-visible:outline-none focus-visible:border-[#4568FF] focus-visible:shadow-[0_0_0_2px_rgba(69,104,255,0.28)] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 dark:focus-visible:border-[#93B0FF] dark:focus-visible:shadow-[0_0_0_2px_rgba(147,176,255,0.35)]",
  {
    variants: {
      variant: {
        default: authSurface,
        destructive:
          "bg-red-600 text-white border-transparent shadow-none hover:bg-red-700 dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-900/40",
        outline: authSurface,
        secondary: settingsSurface,
        ghost:
          "text-foreground shadow-none hover:bg-stone-100 hover:text-foreground dark:hover:bg-[#2A2A27] dark:hover:text-stone-200",
        transparent: "bg-transparent border-0 shadow-none",
        link: "text-primary underline-offset-4 hover:underline",
        blue: liveButton,
        green:
          "bg-green-600 text-white border-transparent shadow-none hover:bg-green-700 dark:bg-green-900/30 dark:text-green-300 dark:hover:bg-green-900/40",
        orange:
          "bg-orange-600 text-white border-transparent shadow-none hover:bg-orange-700 dark:bg-orange-900/30 dark:text-orange-300 dark:hover:bg-orange-900/40",
        pink: "bg-pink-600 text-white border-transparent shadow-none hover:bg-pink-700 dark:bg-pink-900 dark:text-pink-300 dark:hover:bg-pink-900 dark:hover:text-pink-200",
        cancel: filterSurface,
        teal: "bg-teal-600 text-white border-transparent shadow-none hover:bg-teal-700 dark:bg-teal-900/30 dark:text-teal-300 dark:hover:bg-teal-900/40",
        pointille:
          "border border-dashed border-stone-300 bg-white text-stone-700 shadow-none hover:bg-stone-50 dark:border-white/25 dark:bg-[#252522] dark:text-stone-200",
        dashed:
          "hover:bg-stone-100 hover:text-accent-foreground dark:hover:bg-[#2A2A27]",
        promocode:
          "bg-sky-100/10 text-sky-600 hover:bg-sky-100/20 hover:text-sky-600 dark:bg-sky-900/30 dark:text-sky-300 dark:hover:bg-sky-900/40 dark:hover:text-sky-300",
      },
      size: {
        header: "h-8 px-3",
        icon: "h-8 w-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "header",
    },
  },
);

/** Calendar selected-day surface — same as Button secondary. */
export const settingsButtonActionClassName = settingsSurface;
