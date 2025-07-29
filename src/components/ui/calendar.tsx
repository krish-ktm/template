import * as React from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { cn } from "../../lib/utils";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

export function Calendar({ className, ...props }: CalendarProps) {
  return (
    <DayPicker
      className={cn("p-3 [&_.rdp-day_selected]:bg-[#2B5C4B] [&_.rdp-day_today]:text-[#2B5C4B]", className)}
      {...props}
    />
  );
} 