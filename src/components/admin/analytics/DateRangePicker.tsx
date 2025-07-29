import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { Popover, PopoverTrigger, PopoverContent } from "../../ui/popover";
import { Calendar } from "../../ui/calendar";
import { Button } from "../../ui/button";
import { cn } from "../../../lib/utils";

interface Range {
  startDate: Date;
  endDate: Date;
}

interface DateRangePickerProps {
  dateRange: Range;
  onChange: (range: Range) => void;
  className?: string;
}

const QUICK_RANGES: { label: string; getRange: () => { from: Date; to: Date } }[] = [
  {
    label: "Last 7 days",
    getRange: () => {
      const to = new Date();
      const from = new Date();
      from.setDate(from.getDate() - 6);
      return { from, to };
    },
  },
  {
    label: "Last 30 days",
    getRange: () => {
      const to = new Date();
      const from = new Date();
      from.setDate(from.getDate() - 29);
      return { from, to };
    },
  },
  {
    label: "Last 90 days",
    getRange: () => {
      const to = new Date();
      const from = new Date();
      from.setDate(from.getDate() - 89);
      return { from, to };
    },
  },
  {
    label: "This Year",
    getRange: () => {
      const to = new Date();
      const from = new Date(to.getFullYear(), 0, 1);
      return { from, to };
    },
  },
];

export function DateRangePicker({ dateRange, onChange, className }: DateRangePickerProps) {
  const [range, setRange] = React.useState<DateRange | undefined>({
    from: dateRange.startDate,
    to: dateRange.endDate,
  });

  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    setRange({ from: dateRange.startDate, to: dateRange.endDate });
  }, [dateRange]);

  const applyRange = (from: Date, to: Date) => {
    setRange({ from, to });
    onChange({ startDate: from, endDate: to });
    setOpen(false);
  };

  const handleSelect = (r: DateRange | undefined) => {
    setRange(r);
    if (r && r.from && r.to) {
      onChange({ startDate: r.from, endDate: r.to });
      setOpen(false);
    }
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            className={cn(
              "w-[280px] justify-start text-left font-normal transition-all duration-200",
              "bg-white border-gray-200 hover:border-[#2B5C4B] hover:bg-gray-50/50",
              "focus:ring-2 focus:ring-[#2B5C4B] focus:ring-opacity-20",
              !(range && range.from && range.to) && "text-gray-500"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4 text-[#2B5C4B]" />
            {range?.from ? (
              range.to ? (
                <>
                  <span className="font-medium">{format(range.from, "MMM d, yyyy")}</span>
                  <span className="mx-2 text-gray-400">to</span>
                  <span className="font-medium">{format(range.to, "MMM d, yyyy")}</span>
                </>
              ) : (
                format(range.from, "MMM d, yyyy")
              )
            ) : (
              <span>Select date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-auto p-0 bg-white rounded-lg shadow-lg border border-gray-200" 
          align="start"
        >
          <div className="flex flex-col gap-4 p-4">
            <div className="space-y-2">
              <h4 className="font-medium text-sm text-gray-600">Quick select</h4>
              <div className="flex flex-wrap gap-2">
                {QUICK_RANGES.map((qr) => {
                  const { from, to } = qr.getRange();
                  const isActive =
                    range?.from?.toDateString() === from.toDateString() &&
                    range?.to?.toDateString() === to.toDateString();

                  return (
                    <Button
                      key={qr.label}
                      className={cn(
                        "px-3 py-1.5 text-xs font-medium rounded-full transition-all duration-200",
                        isActive
                          ? "bg-[#2B5C4B] text-white shadow-sm shadow-[#2B5C4B]/20"
                          : "bg-gray-50 text-gray-700 hover:bg-[#2B5C4B]/10 hover:text-[#2B5C4B]"
                      )}
                      onClick={() => applyRange(from, to)}
                    >
                      {qr.label}
                    </Button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-lg border border-gray-100 p-3 shadow-sm">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={range?.from}
                selected={range}
                onSelect={handleSelect}
                numberOfMonths={2}
                className="[&_.rdp-day]:rounded-full [&_.rdp-day_focus]:ring-[#2B5C4B]/20"
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
} 