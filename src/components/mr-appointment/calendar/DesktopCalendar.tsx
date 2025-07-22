import { useCallback } from 'react';
import DatePicker from 'react-datepicker';
import { format } from 'date-fns';
import { Calendar } from 'lucide-react';

interface DesktopCalendarProps {
  selectedDate: Date | null;
  onDateChange: (date: Date | null) => void;
  isDateDisabled: (date: Date) => boolean;
  dateBookings: Record<string, { current: number; max: number }>;
  maxDate: Date;
  t: {
    days: Record<string, string>;
    months: Record<string, string>;
    appointmentDate: string;
    selectDate: string;
    availableWeekdays: string;
    slotAvailable: string;
    calendarLegend: {
      available: string;
      full: string;
      notAvailable: string;
    };
  };
}

export function DesktopCalendar({
  selectedDate,
  onDateChange,
  isDateDisabled,
  dateBookings,
  maxDate,
  t
}: DesktopCalendarProps) {
  const formatSelectedDate = useCallback((date: Date) => {
    const dayName = t.days[format(date, 'EEEE').toLowerCase()];
    const monthName = t.months[format(date, 'MMMM').toLowerCase()];
    const day = format(date, 'd');
    const year = format(date, 'yyyy');
    return `${dayName}, ${monthName} ${day}, ${year}`;
  }, [t]);

  const renderDayContents = (day: number, date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const isDisabled = isDateDisabled(date);
    const bookingInfo = dateBookings[dateStr];
    const hasSlots = bookingInfo !== undefined;
    const isFull = bookingInfo && bookingInfo.current >= bookingInfo.max;

    return (
      <div className="mr-calendar-day">
        <span className="mr-calendar-day__number">{day}</span>
        {hasSlots && !isDisabled && (
          <>
            {isFull ? (
              <>
                <span className="mr-calendar-day__slots text-red-500">{t.calendarLegend.full}</span>
                <span className="mr-calendar-day__indicator mr-calendar-day__indicator--full" />
              </>
            ) : (
              <>
                <span className="mr-calendar-day__slots">
                  {bookingInfo.max - bookingInfo.current} {t.slotAvailable}
                </span>
                <span className="mr-calendar-day__indicator mr-calendar-day__indicator--available" />
              </>
            )}
          </>
        )}
      </div>
    );
  };

  const dayClassName = useCallback((date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const isDisabled = isDateDisabled(date);
    const bookingInfo = dateBookings[dateStr];
    const isFull = bookingInfo && bookingInfo.current >= bookingInfo.max;
    
    if (isDisabled || isFull) return "react-datepicker__day--disabled";
    if (selectedDate && format(date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')) {
      return "react-datepicker__day--selected";
    }
    if (format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')) {
      return "react-datepicker__day--today";
    }
    return "";
  }, [selectedDate, isDateDisabled, dateBookings]);

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {t.appointmentDate} *
      </label>
      <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-100">
          <div className={`p-2 rounded-lg transition-colors ${
            selectedDate 
              ? 'bg-[#2B5C4B] text-white' 
              : 'bg-[#2B5C4B]/10 text-[#2B5C4B]'
          }`}>
            <Calendar className="h-5 w-5" />
          </div>
          <div>
            <p className={`text-sm font-medium ${
              selectedDate
                ? 'text-[#2B5C4B]'
                : 'text-gray-900'
            }`}>
              {selectedDate
                ? formatSelectedDate(selectedDate)
                : t.selectDate}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              {t.availableWeekdays}
            </p>
          </div>
        </div>
        
        <div className="w-full relative">
          <DatePicker
            selected={selectedDate}
            onChange={onDateChange}
            minDate={new Date()}
            maxDate={maxDate}
            filterDate={(date) => !isDateDisabled(date)}
            dateFormat="MMMM d, yyyy"
            placeholderText={t.selectDate}
            required
            inline
            calendarClassName="mr-calendar"
            dayClassName={dayClassName}
            renderDayContents={renderDayContents}
          />
        </div>
        
        <div className="mr-calendar__legend">
          <div className="mr-calendar__legend-item">
            <span className="mr-calendar__legend-dot mr-calendar__legend-dot--available"></span>
            <span>{t.calendarLegend.available}</span>
          </div>
          <div className="mr-calendar__legend-item">
            <span className="mr-calendar__legend-dot mr-calendar__legend-dot--full"></span>
            <span>{t.calendarLegend.full}</span>
          </div>
          <div className="mr-calendar__legend-item">
            <span className="mr-calendar__legend-dot mr-calendar__legend-dot--disabled"></span>
            <span>{t.calendarLegend.notAvailable}</span>
          </div>
        </div>
      </div>
    </div>
  );
}