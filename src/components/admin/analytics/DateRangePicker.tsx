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

export function DateRangePicker({ dateRange, onChange }: DateRangePickerProps) {
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
    <div className="grid gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            className={cn(
              "w-[280px] justify-start text-left font-medium border-gray-300 hover:border-[#2B5C4B]",
              !(range && range.from && range.to) && "text-gray-500"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {range?.from ? (
              range.to ? (
                <>
                  {format(range.from, "LLL dd, y")} - {format(range.to, "LLL dd, y")}
                </>
              ) : (
                format(range.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-4 w-auto" align="start">
          <div className="flex flex-col gap-4">
            {/* Quick ranges */}
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
                      "px-3 py-1 text-xs rounded-md border",
                      isActive
                        ? "bg-[#2B5C4B] text-white border-[#2B5C4B]"
                        : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                    )}
                    onClick={() => {
                      applyRange(from, to);
                    }}
                  >
                    {qr.label}
                  </Button>
                );
              })}
            </div>

            {/* Calendar */}
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={range?.from}
              selected={range}
              onSelect={handleSelect}
              numberOfMonths={2}
              className="border rounded-md"
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
} 