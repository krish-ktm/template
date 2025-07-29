import { useState, useRef, useEffect } from 'react';
import { Calendar, X } from 'lucide-react';
import { parseISO, format, subDays, startOfMonth, endOfMonth, startOfYear, endOfYear, subMonths, subYears } from 'date-fns';
import { CustomDatePicker } from '../CustomDatePicker';

interface AnalyticsDateRangePickerProps {
  startDate?: string; // YYYY-MM-DD
  endDate?: string;   // YYYY-MM-DD
  onSelect: (range: { startDate: string; endDate: string }) => void;
  buttonClassName?: string;
}

interface QuickRange {
  label: string;
  getRange: () => { startDate: string; endDate: string };
}

const QUICK_RANGES: QuickRange[] = [
  {
    label: "Today",
    getRange: () => {
      const today = new Date();
      const formatted = format(today, 'yyyy-MM-dd');
      return { startDate: formatted, endDate: formatted };
    }
  },
  {
    label: "Last 7 days",
    getRange: () => ({
      startDate: format(subDays(new Date(), 6), 'yyyy-MM-dd'),
      endDate: format(new Date(), 'yyyy-MM-dd')
    })
  },
  {
    label: "Last 30 days",
    getRange: () => ({
      startDate: format(subDays(new Date(), 29), 'yyyy-MM-dd'),
      endDate: format(new Date(), 'yyyy-MM-dd')
    })
  },
  {
    label: "This month",
    getRange: () => ({
      startDate: format(startOfMonth(new Date()), 'yyyy-MM-dd'),
      endDate: format(endOfMonth(new Date()), 'yyyy-MM-dd')
    })
  },
  {
    label: "Last month",
    getRange: () => {
      const lastMonth = subMonths(new Date(), 1);
      return {
        startDate: format(startOfMonth(lastMonth), 'yyyy-MM-dd'),
        endDate: format(endOfMonth(lastMonth), 'yyyy-MM-dd')
      };
    }
  },
  {
    label: "Last 90 days",
    getRange: () => ({
      startDate: format(subDays(new Date(), 89), 'yyyy-MM-dd'),
      endDate: format(new Date(), 'yyyy-MM-dd')
    })
  },
  {
    label: "This year",
    getRange: () => ({
      startDate: format(startOfYear(new Date()), 'yyyy-MM-dd'),
      endDate: format(endOfYear(new Date()), 'yyyy-MM-dd')
    })
  },
  {
    label: "Last year",
    getRange: () => {
      const lastYear = subYears(new Date(), 1);
      return {
        startDate: format(startOfYear(lastYear), 'yyyy-MM-dd'),
        endDate: format(endOfYear(lastYear), 'yyyy-MM-dd')
      };
    }
  }
];

export default function AnalyticsDateRangePicker({
  startDate,
  endDate,
  onSelect,
  buttonClassName = 'w-full sm:w-72 px-3 py-2 border border-gray-300 rounded-lg text-left flex items-center justify-between focus:ring-2 focus:ring-[#2B5C4B]/20 focus:border-[#2B5C4B] text-sm'
}: AnalyticsDateRangePickerProps) {
  const [open, setOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const [tempDates, setTempDates] = useState<Date[]>([]);

  useEffect(() => {
    if (open) {
      const initial = [
        ...(startDate ? [parseISO(startDate)] : []),
        ...(endDate && endDate !== startDate ? [parseISO(endDate)] : [])
      ];
      setTempDates(initial);
    }
  }, [open, startDate, endDate]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const handleDatesChange = (dates: Date[]) => {
    setTempDates(dates);
  };

  const handleApply = () => {
    if (tempDates.length === 0) return;
    const sorted = [...tempDates].sort((a, b) => a.getTime() - b.getTime());
    const start = sorted[0];
    const end = sorted[sorted.length - 1];
    onSelect({
      startDate: format(start, 'yyyy-MM-dd'),
      endDate: format(end, 'yyyy-MM-dd')
    });
    setOpen(false);
  };

  const formatDisplayDate = (date: string) => {
    return format(parseISO(date), 'MMM d, yyyy');
  };

  return (
    <div className="relative" ref={popoverRef}>
      <button
        type="button"
        className={buttonClassName}
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center">
          <Calendar className="h-4 w-4 mr-2 text-[#2B5C4B]" />
          <span className="truncate">
            {startDate && endDate 
              ? `${formatDisplayDate(startDate)} - ${formatDisplayDate(endDate)}`
              : 'Select date range'
            }
          </span>
        </div>
      </button>

      {open && (
        <div 
          className="absolute z-[9999] mt-2 bg-white border border-gray-200 rounded-lg shadow-lg" 
          style={{
            width: 'min(90vw, 340px)',
            right: 0,
            maxHeight: 'calc(100vh - 80px)',
            overflowY: 'auto'
          }}
          ref={popoverRef}
        >
          <div className="p-3 border-b border-gray-100">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Select Range</span>
              <button 
                onClick={() => setOpen(false)} 
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2">
              {QUICK_RANGES.map((qr) => {
                const range = qr.getRange();
                const isActive = startDate === range.startDate && endDate === range.endDate;

                return (
                  <button
                    key={qr.label}
                    className={`
                      px-3 py-1.5 text-xs font-medium rounded-lg transition-all
                      ${isActive 
                        ? 'bg-[#2B5C4B] text-white shadow-sm' 
                        : 'bg-gray-50 text-gray-700 hover:bg-[#2B5C4B]/10 hover:text-[#2B5C4B]'
                      }
                    `}
                    onClick={() => {
                      onSelect(range);
                      setOpen(false);
                    }}
                  >
                    {qr.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-3">
            <CustomDatePicker
              selectedDates={tempDates}
              onChange={handleDatesChange}
              minDate={subYears(new Date(), 10)}
              className="[&_.rdp-day_selected:not([disabled])]:bg-[#2B5C4B] [&_.rdp-day_selected:not([disabled])]:text-white [&_.rdp-day_selected:not([disabled])]:hover:bg-[#2B5C4B] [&_.rdp-day]:rounded-full [&_.rdp-day_focus]:ring-[#2B5C4B]/20 [&_.rdp-day_inrange:not([disabled])]:bg-[#2B5C4B]/10 [&_.rdp-day_inrange:not([disabled])]:rounded-none [&_.rdp-day_selected:not([disabled]):first-of-type]:rounded-l-full [&_.rdp-day_selected:not([disabled]):last-of-type]:rounded-r-full"
            />
            <div className="flex justify-end gap-2 mt-3">
              <button
                type="button"
                className="px-3 py-1.5 text-sm rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                onClick={() => setOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-3 py-1.5 text-sm rounded-lg bg-[#2B5C4B] text-white disabled:opacity-40 transition-colors"
                onClick={handleApply}
                disabled={tempDates.length === 0}
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 