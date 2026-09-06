import { cva } from "class-variance-authority";

const toneBadge = {
  success:
    "border-green-200/90 bg-green-100 text-green-900 hover:bg-green-100/90 dark:border-transparent dark:bg-green-900/30 dark:text-green-300 dark:hover:bg-green-900/40",
  destructive:
    "border-red-200/90 bg-red-100 text-red-900 hover:bg-red-100/90 dark:border-transparent dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-900/40",
  warning:
    "border-orange-200/90 bg-orange-100 text-orange-900 hover:bg-orange-100/90 dark:border-transparent dark:bg-orange-900/30 dark:text-orange-300 dark:hover:bg-orange-900/40",
  notice:
    "border-brand-200/90 bg-brand-100 text-brand-900 hover:bg-brand-100/90 dark:border-transparent dark:bg-sky-900/30 dark:text-sky-300 dark:hover:bg-sky-900/40",
  info: "border-brand-200/90 bg-brand-100 text-brand-900 hover:bg-brand-100/90 dark:border-transparent dark:bg-sky-900/30 dark:text-sky-300 dark:hover:bg-sky-900/40",
  refunds:
    "border-purple-200/90 bg-purple-100 text-purple-900 hover:bg-purple-100/90 dark:border-transparent dark:bg-purple-900/30 dark:text-purple-300 dark:hover:bg-purple-900/40",
  amber:
    "border-amber-200/90 bg-amber-100 text-amber-900 hover:bg-amber-100/90 dark:border-transparent dark:bg-amber-900/30 dark:text-amber-300 dark:hover:bg-amber-900/40",
  cyan: "border-cyan-200/90 bg-cyan-100 text-cyan-900 hover:bg-cyan-100/90 dark:border-transparent dark:bg-cyan-900/30 dark:text-cyan-300 dark:hover:bg-cyan-900/40",
  pink: "border-pink-200/90 bg-pink-100 text-pink-900 hover:bg-pink-100/90 dark:border-transparent dark:bg-pink-900/30 dark:text-pink-300 dark:hover:bg-pink-900/40",
  slate:
    "border-stone-300/90 bg-stone-200 text-stone-900 hover:bg-stone-200/90 dark:border-transparent dark:bg-slate-900/30 dark:text-slate-300 dark:hover:bg-slate-900/40",
  live: "border-brand-600 bg-brand-600 text-white transition-[filter] hover:brightness-110 focus-visible:brightness-110 dark:border-transparent dark:bg-sky-900 dark:text-sky-300 dark:hover:brightness-100 dark:hover:bg-sky-800 dark:hover:text-sky-200 dark:focus-visible:brightness-100 dark:focus-visible:bg-sky-800",
  test: "border-pink-600 bg-pink-600 text-white hover:bg-pink-700 dark:border-transparent dark:bg-pink-900 dark:text-pink-300 dark:hover:bg-pink-900 dark:hover:text-pink-200",
} as const;

export const badgeVariants = cva(
  "inline-flex items-center rounded-sm border px-2.5 py-0.5 text-[13px] font-medium transition-colors focus:outline-none focus-visible:border-[#4568FF]",
  {
    variants: {
      variant: {
        default:
          "border-stone-300/90 bg-stone-200 text-stone-900 hover:bg-stone-300/70 dark:border-transparent dark:bg-primary/90 dark:text-primary-foreground dark:hover:bg-primary/80",
        secondary:
          "border-stone-300/90 bg-stone-100 text-stone-900 hover:bg-stone-200 dark:border-transparent dark:bg-secondary/50 dark:text-secondary-foreground dark:hover:bg-secondary/60",
        destructive: toneBadge.destructive,
        outline:
          "border-stone-300 bg-white text-stone-800 hover:bg-stone-50 dark:border-white/[0.16] dark:bg-[#1F1F1C] dark:text-stone-200 dark:hover:bg-[#2A2A27]",
        success: toneBadge.success,
        successSolid: toneBadge.success,
        active: toneBadge.success,
        warning: toneBadge.warning,
        notice: toneBadge.notice,
        info: toneBadge.info,
        refunds: toneBadge.refunds,
        amber: toneBadge.amber,
        subscriptions: toneBadge.cyan,
        checkout: toneBadge.warning,
        providers: toneBadge.pink,
        live: toneBadge.live,
        test: toneBadge.test,
        testwebhook: toneBadge.pink,
        admin: toneBadge.slate,
      },
      size: {
        default: "h-7",
        xxs: "h-[18px] px-1.5 py-0.5 text-[11px]",
        xs: "h-5",
        sm: "h-8",
        lg: "h-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export type BadgeSize = "default" | "xxs" | "xs" | "sm" | "lg";
