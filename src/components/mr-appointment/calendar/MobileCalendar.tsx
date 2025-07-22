import { useState, useCallback } from 'react';
import { format, addDays, startOfWeek, isSameDay, isToday, isBefore, startOfToday, isAfter } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface MobileCalendarProps {
  selectedDate: Date | null;
  onDateChange: (date: Date) => void;
  isDateDisabled: (date: Date) => boolean;
  dateBookings: Record<string, { current: number; max: number }>;
  maxDate?: Date;
  t: {
    days: Record<string, string>;
    slotAvailable: string;
    calendarLegend?: {
      available: string;
      filling: string;
      full: string;
    };
  };
}

const TIMEZONE = 'Asia/Kolkata';

export function MobileCalendar({ selectedDate, onDateChange, isDateDisabled, dateBookings, maxDate, t }: MobileCalendarProps) {
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const today = utcToZonedTime(new Date(), TIMEZONE);
    return startOfWeek(today, { weekStartsOn: 1 }); // Start week on Monday
  });

  // Generate dates for the current week
  const weekDates = Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i));

  const handlePrevWeek = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent form submission
    const newWeekStart = addDays(currentWeekStart, -7);
    // Only allow going back if the new week includes today or future dates
    if (!isBefore(addDays(newWeekStart, 6), startOfToday())) {
      setCurrentWeekStart(newWeekStart);
    }
  };

  const handleNextWeek = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent form submission
    // Only allow going forward if the next week doesn't exceed maxDate
    const nextWeekStart = addDays(currentWeekStart, 7);
    if (!maxDate || !isAfter(nextWeekStart, maxDate)) {
      setCurrentWeekStart(nextWeekStart);
    }
  };

  const handleDateClick = (e: React.MouseEvent, date: Date) => {
    e.preventDefault(); // Prevent form submission
    if (
      !isDateDisabled(date) && 
      !isBefore(date, startOfToday()) && 
      (!maxDate || !isAfter(date, maxDate))
    ) {
      onDateChange(date);
    }
  };

  const formatDayName = useCallback((date: Date) => {
    const dayKey = format(date, 'EEEE').toLowerCase() as keyof typeof t.days;
    return t.days[dayKey];
  }, [t]);

  // Check if previous week button should be disabled
  const isPrevWeekDisabled = isBefore(addDays(currentWeekStart, 6), startOfToday());
  
  // Check if next week button should be disabled
  const isNextWeekDisabled = maxDate && isAfter(addDays(currentWeekStart, 7), maxDate);

  return (
    <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
      {/* Week Navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={handlePrevWeek}
          type="button"
          disabled={isPrevWeekDisabled}
          className={`p-2 rounded-lg transition-colors ${
            isPrevWeekDisabled
              ? 'text-gray-300 cursor-not-allowed'
              : 'hover:bg-[#2B5C4B]/5 text-gray-500'
          }`}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="text-sm font-medium text-gray-900">
          {format(currentWeekStart, 'MMMM yyyy')}
        </div>
        <button
          onClick={handleNextWeek}
          type="button"
          disabled={isNextWeekDisabled}
          className={`p-2 rounded-lg transition-colors ${
            isNextWeekDisabled
              ? 'text-gray-300 cursor-not-allowed'
              : 'hover:bg-[#2B5C4B]/5 text-gray-500'
          }`}
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1">
        {weekDates.map((date) => {
          const dateStr = format(date, 'yyyy-MM-dd');
          const isPastDate = isBefore(date, startOfToday());
          const isFutureDate = maxDate && isAfter(date, maxDate);
          const isDisabled = isDateDisabled(date) || isPastDate || isFutureDate;
          const isSelected = selectedDate && isSameDay(date, selectedDate);
          const bookingInfo = dateBookings[dateStr];
          const isFull = bookingInfo && bookingInfo.current >= bookingInfo.max;
          const isAvailable = !isDisabled && !isFull;
          const hasSlots = bookingInfo !== undefined;

          return (
            <button
              key={dateStr}
              onClick={(e) => handleDateClick(e, date)}
              type="button"
              disabled={!isAvailable}
              className={`
                relative flex flex-col items-center justify-center p-2 rounded-lg transition-all min-h-[80px]
                ${isSelected
                  ? 'bg-[#2B5C4B] text-white shadow-lg shadow-[#2B5C4B]/10'
                  : isAvailable
                    ? 'bg-white hover:bg-[#2B5C4B]/5 text-gray-900'
                    : 'bg-gray-50 text-gray-400 cursor-not-allowed opacity-50'
                }
              `}
            >
              {/* Day Name */}
              <span className="text-[10px] font-medium mb-1">
                {formatDayName(date).slice(0, 3)}
              </span>
              
              {/* Date */}
              <span className={`text-sm font-semibold mb-1 ${isToday(date) ? 'ring-2 ring-[#2B5C4B] rounded-full w-6 h-6 flex items-center justify-center' : ''}`}>
                {format(date, 'd')}
              </span>

              {/* Slots Available */}
              {isAvailable && hasSlots && (
                <span className={`text-[10px] ${isSelected ? 'text-white/90' : 'text-gray-500'}`}>
                  {bookingInfo.max - bookingInfo.current} {t.slotAvailable}
                </span>
              )}

              {/* Availability Indicator */}
              {hasSlots && !isDisabled && (
                <span className={`absolute top-1 right-1 w-2 h-2 rounded-full ${
                  isFull
                    ? 'bg-red-500'
                    : bookingInfo.current === 0
                      ? 'bg-[#2B5C4B]'
                      : 'bg-yellow-500'
                }`} />
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-[#2B5C4B]" />
          <span className="text-xs text-gray-600">{t.calendarLegend?.available || 'Available'}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-yellow-500" />
          <span className="text-xs text-gray-600">{t.calendarLegend?.filling || 'Filling'}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-red-500" />
          <span className="text-xs text-gray-600">{t.calendarLegend?.full || 'Full'}</span>
        </div>
      </div>
    </div>
  );
}