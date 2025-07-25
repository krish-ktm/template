import { useState, useRef, useEffect } from 'react';
import { Calendar, X } from 'lucide-react';
import { CustomDatePicker } from '../CustomDatePicker';
import { parseISO, format, subYears } from 'date-fns';

interface DateRangePickerPopoverProps {
  startDate?: string; // YYYY-MM-DD
  endDate?: string;   // YYYY-MM-DD
  onSelect: (range: { startDate: string; endDate: string }) => void;
  buttonClassName?: string;
}

export default function DateRangePickerPopover({
  startDate,
  endDate,
  onSelect,
  buttonClassName = 'w-full sm:w-60 px-3 py-2 border border-gray-300 rounded-lg text-left flex items-center justify-between focus:ring-2 focus:ring-[#2B5C4B]/20 focus:border-[#2B5C4B] text-sm'
}: DateRangePickerPopoverProps) {
  const [open, setOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  // local selection state to show range before applying
  const [tempDates, setTempDates] = useState<Date[]>([]);

  // initialize when popup opens
  useEffect(() => {
    if (open) {
      const initial = [
        ...(startDate ? [parseISO(startDate)] : []),
        ...(endDate && endDate !== startDate ? [parseISO(endDate)] : [])
      ];
      setTempDates(initial);
    }
  }, [open, startDate, endDate]);

  // Close on outside click
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

  return (
    <div className="relative" ref={popoverRef}>
      <button
        type="button"
        className={buttonClassName}
        onClick={() => setOpen(!open)}
      >
        {startDate && endDate ? `${startDate} to ${endDate}` : 'Select range'}
        <Calendar className="h-4 w-4 ml-2 text-gray-500" />
      </button>
      {open && (
        <div className="absolute z-[9999] mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg p-3" ref={popoverRef}>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Select Range</span>
            <button onClick={() => setOpen(false)} className="text-gray-500 hover:text-gray-700">
              <X className="h-4 w-4" />
            </button>
          </div>
          <CustomDatePicker
            selectedDates={tempDates}
            onChange={handleDatesChange}
            minDate={subYears(new Date(), 10)}
          />
          <div className="flex justify-end gap-2 mt-3">
            <button
              type="button"
              className="px-3 py-1.5 text-sm rounded-lg bg-gray-100 hover:bg-gray-200"
              onClick={() => setOpen(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="px-3 py-1.5 text-sm rounded-lg bg-[#2B5C4B] text-white disabled:opacity-40"
              onClick={handleApply}
              disabled={tempDates.length === 0}
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 