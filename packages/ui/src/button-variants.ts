import { cva } from "class-variance-authority";
import {
  interiorPrimaryRelief,
  interiorSurface as interiorSurfaceBase,
} from "./tokens";

const interiorSurface = `${interiorSurfaceBase} hover:bg-stone-50 dark:hover:bg-[#2A2A27]`;

const settingsButtonAction = `relative rounded-sm font-medium transition-[border-color,box-shadow,background-color] duration-150 ${interiorSurface}`;

const liveButton =
  "bg-brand-600 text-white border-transparent shadow-none hover:brightness-110 focus-visible:brightness-110 dark:bg-sky-900 dark:text-sky-300 dark:hover:brightness-100 dark:hover:bg-sky-800 dark:hover:text-sky-200";

export const buttonVariants = cva(
  "inline-flex cursor-pointer touch-manipulation items-center justify-center gap-2 whitespace-nowrap rounded-sm text-[13px] font-medium outline-none ring-offset-background transition-[border-color,box-shadow,background-color] duration-150 select-none focus-visible:outline-none focus-visible:border-[#4568FF] focus-visible:shadow-[0_0_0_2px_rgba(69,104,255,0.28)] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 dark:focus-visible:border-[#93B0FF] dark:focus-visible:shadow-[0_0_0_2px_rgba(147,176,255,0.35)]",
  {
    variants: {
      variant: {
        default:
          `bg-stone-800 text-stone-50 border-stone-800 ${interiorPrimaryRelief} hover:bg-stone-700 dark:border-white/10 dark:bg-[#2A2A27] dark:text-stone-100 dark:hover:bg-[#32322E]`,
        destructive:
          "bg-red-600 text-white border-transparent shadow-none hover:bg-red-700 dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-900/40",
        outline: interiorSurface,
        secondary: interiorSurface,
        ghost:
          "text-foreground shadow-none hover:bg-stone-100 hover:text-foreground dark:hover:bg-[#2A2A27] dark:hover:text-stone-200",
        filter: interiorSurface,
        transparent: "bg-transparent border-0 shadow-none",
        link: "text-primary underline-offset-4 hover:underline",
        blue: liveButton,
        green:
          "bg-green-600 text-white border-transparent shadow-none hover:bg-green-700 dark:bg-green-900/30 dark:text-green-300 dark:hover:bg-green-900/40",
        orange:
          "bg-orange-600 text-white border-transparent shadow-none hover:bg-orange-700 dark:bg-orange-900/30 dark:text-orange-300 dark:hover:bg-orange-900/40",
        pink:
          "bg-pink-600 text-white border-transparent shadow-none hover:bg-pink-700 dark:bg-pink-900 dark:text-pink-300 dark:hover:bg-pink-900 dark:hover:text-pink-200",
        cancel: interiorSurface,
        settings: settingsButtonAction,
        teal:
          "bg-teal-600 text-white border-transparent shadow-none hover:bg-teal-700 dark:bg-teal-900/30 dark:text-teal-300 dark:hover:bg-teal-900/40",
        connect: interiorSurface,
        pointille:
          "border border-dashed border-stone-300 bg-white text-stone-700 shadow-none hover:bg-stone-50 dark:border-white/25 dark:bg-[#252522] dark:text-stone-200",
        dashed:
          "hover:bg-stone-100 hover:text-accent-foreground dark:hover:bg-[#2A2A27]",
        workspace: `text-[#4568FF] ${interiorSurface}`,
        auth: interiorSurface,
        promocode:
          "bg-sky-100/10 text-sky-600 hover:bg-sky-100/20 hover:text-sky-600 dark:bg-sky-900/30 dark:text-sky-300 dark:hover:bg-sky-900/40 dark:hover:text-sky-300",
      },
      size: {
        default: "h-9 px-3",
        xs: "h-7 px-2 text-xs",
        sm: "h-8 px-3",
        md: "h-9 px-3",
        lg: "h-11 px-5 text-[15px]",
        icon: "h-8 w-8",
        "icon-xs": "h-7 w-7",
        "icon-sm": "h-8 w-8",
        "icon-md": "h-9 w-9",
        header: "h-8 px-3",
        sidebarActions: "h-9 px-3 justify-start",
        small: "h-7 w-7 p-0",
        sidebar: "h-7 py-2 w-56",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

/** Exported for calendar and other consumers that need the settings action surface. */
export const settingsButtonActionClassName = settingsButtonAction;
