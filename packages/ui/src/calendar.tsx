import type * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "./cn";
import {
  buttonVariants,
  settingsButtonActionClassName,
} from "./button-variants";

/** Settings-row action surface — no extra rounding here (RDP joins class keys without twMerge). */
const calendarSelectedDaySurface = cn(
  settingsButtonActionClassName,
  "aria-selected:opacity-100",
);

const calendarRangeStartRounding =
  "day-range-start [&:not(.day-range-end)]:rounded-tl-sm [&:not(.day-range-end)]:rounded-bl-sm [&:not(.day-range-end)]:rounded-tr-none [&:not(.day-range-end)]:rounded-br-none [&.day-range-end]:rounded-md";

const calendarRangeEndRounding =
  "day-range-end [&:not(.day-range-start)]:rounded-tr-sm [&:not(.day-range-start)]:rounded-br-sm [&:not(.day-range-start)]:rounded-tl-none [&:not(.day-range-start)]:rounded-bl-none [&.day-range-start]:rounded-md";

const calendarRangeCellRounding =
  "[&:has(>.day-range-start)]:rounded-tl-sm [&:has(>.day-range-start)]:rounded-bl-sm [&:has(>.day-range-start)]:rounded-tr-none [&:has(>.day-range-start)]:rounded-br-none [&:has(>.day-range-end)]:rounded-tr-sm [&:has(>.day-range-end)]:rounded-br-sm [&:has(>.day-range-end)]:rounded-tl-none [&:has(>.day-range-end)]:rounded-bl-none first:[&:has([aria-selected])]:rounded-tl-sm first:[&:has([aria-selected])]:rounded-bl-sm first:[&:has([aria-selected])]:rounded-tr-none first:[&:has([aria-selected])]:rounded-br-none last:[&:has([aria-selected])]:rounded-tr-sm last:[&:has([aria-selected])]:rounded-br-sm last:[&:has([aria-selected])]:rounded-tl-none last:[&:has([aria-selected])]:rounded-bl-none";

type CalendarSize = "default" | "compact" | "comfortable";

interface CalendarSizeStyle {
  months: string;
  month: string;
  caption: string;
  caption_label: string;
  nav_button: string;
  head_cell: string;
  row: string;
  day: string;
}

const calendarSizeStyles = {
  default: {
    months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
    month: "space-y-4",
    caption: "flex justify-center pt-1 relative items-center",
    caption_label: "text-sm font-normal",
    nav_button: "h-7 w-7",
    head_cell:
      "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem] text-center",
    row: "grid grid-cols-7 w-full mt-2",
    day: "h-8 w-8 text-sm",
  },
  compact: {
    months: "flex flex-row space-x-6 space-y-0",
    month: "space-y-1",
    caption: "flex justify-center pt-0.5 relative items-center",
    caption_label: "text-xs font-medium",
    nav_button: "h-5 w-5",
    head_cell:
      "text-muted-foreground rounded-md w-7 h-6 font-medium text-[0.65rem] text-center flex items-center justify-center",
    row: "grid grid-cols-7 w-full mt-1 gap-1",
    day: "h-7 w-7 text-xs",
  },
  comfortable: {
    months: "flex w-full flex-col",
    month: "w-full space-y-2",
    caption: "relative mb-2 flex items-center justify-center pt-1",
    caption_label: "text-sm font-medium",
    nav_button: "h-9 w-9 rounded-md",
    head_cell:
      "flex h-8 w-10 items-center justify-center text-center text-xs font-medium text-muted-foreground",
    row: "grid grid-cols-7 w-full mt-1 gap-1",
    day: "h-10 w-10 text-sm",
  },
} satisfies Record<CalendarSize, CalendarSizeStyle>;

type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  size?: CalendarSize;
};

function Calendar({
  className,
  classNames,
  showOutsideDays = false,
  size = "default",
  ...props
}: CalendarProps) {
  const sizeStyle = calendarSizeStyles[size];
  const isRangeMode = props.mode === "range";

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: sizeStyle.months,
        month: sizeStyle.month,
        caption: sizeStyle.caption,
        caption_label: sizeStyle.caption_label,
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          sizeStyle.nav_button,
          "bg-transparent p-0 opacity-50 hover:opacity-100 hover:bg-accent dark:hover:bg-accent rounded-md",
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "grid grid-cols-7 w-full",
        head_cell: sizeStyle.head_cell,
        row: sizeStyle.row,
        cell: cn(
          "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent/60 dark:[&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-outside)]:bg-accent/40 dark:[&:has([aria-selected].day-outside)]:bg-accent/60",
          isRangeMode
            ? calendarRangeCellRounding
            : "[&:has([aria-selected])]:rounded-md",
        ),
        day: cn(
          buttonVariants({ variant: "ghost" }),
          sizeStyle.day,
          "p-0 font-normal aria-selected:opacity-100 mx-auto hover:bg-accent dark:hover:bg-accent flex items-center justify-center transition-colors duration-150",
          isRangeMode ? "rounded-none" : "rounded-md",
        ),
        day_range_start: cn(
          calendarSelectedDaySurface,
          calendarRangeStartRounding,
        ),
        day_range_end: cn(calendarSelectedDaySurface, calendarRangeEndRounding),
        day_selected: cn(
          calendarSelectedDaySurface,
          isRangeMode ? null : "rounded-md",
        ),
        day_today: "bg-accent text-foreground rounded-md font-medium",
        day_outside:
          "day-outside text-muted-foreground opacity-50 aria-selected:bg-muted aria-selected:text-foreground/90 dark:aria-selected:text-foreground/95 aria-selected:opacity-100",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "rounded-none aria-selected:bg-accent/60 aria-selected:text-foreground bg-accent/60 text-foreground dark:aria-selected:bg-accent dark:aria-selected:text-foreground dark:bg-accent/60",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: () => <ChevronLeft className="h-4 w-4" />,
        IconRight: () => <ChevronRight className="h-4 w-4" />,
      }}
      formatters={{
        formatWeekdayName: (day) => day.toString().substring(0, 2),
      }}
      weekStartsOn={0}
      numberOfMonths={1}
      fixedWeeks={true}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
export type { CalendarSize };
