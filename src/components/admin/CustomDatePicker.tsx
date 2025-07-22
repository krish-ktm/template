import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isToday, isSameDay, isBefore, isAfter, getDay } from 'date-fns';

interface CustomDatePickerProps {
  selectedDates: Date[];
  onChange: (dates: Date[]) => void;
  minDate?: Date;
  maxDate?: Date;
  disableEditMode?: boolean;
  className?: string;
}

const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export function CustomDatePicker({ 
  selectedDates, 
  onChange, 
  minDate = new Date(), 
  maxDate = addMonths(new Date(), 12),
  disableEditMode = false,
  className = ''
}: CustomDatePickerProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionStart, setSelectionStart] = useState<Date | null>(null);

  const handleMonthChange = (newMonth: Date) => {
    setCurrentMonth(newMonth);
    // Don't trigger onChange when changing months
  };

  const renderHeader = () => {
    return (
      <div className="flex items-center justify-between mb-2 sm:mb-4">
        <button
          type="button" // Prevent form submission
          onClick={() => handleMonthChange(subMonths(currentMonth, 1))}
          className="p-1.5 sm:p-2 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
          disabled={isBefore(subMonths(currentMonth, 1), subMonths(minDate, 1))}
          aria-label="Previous month"
        >
          <ChevronLeft className="h-4 sm:h-5 w-4 sm:w-5 text-gray-600" />
        </button>
        <h2 className="text-base sm:text-lg font-medium text-gray-700">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        <button
          type="button" // Prevent form submission
          onClick={() => handleMonthChange(addMonths(currentMonth, 1))}
          className="p-1.5 sm:p-2 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
          disabled={isAfter(addMonths(currentMonth, 1), addMonths(maxDate, 1))}
          aria-label="Next month"
        >
          <ChevronRight className="h-4 sm:h-5 w-4 sm:w-5 text-gray-600" />
        </button>
      </div>
    );
  };

  const renderDays = () => {
    return (
      <div className="grid grid-cols-7 gap-0.5 sm:gap-1 mb-1 sm:mb-2">
        {dayNames.map(day => (
          <div key={day} className="text-center text-xs sm:text-sm font-medium text-gray-500 py-1">
            {day}
          </div>
        ))}
      </div>
    );
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = monthStart;
    const endDate = monthEnd;

    const dateRange = eachDayOfInterval({
      start: startDate,
      end: endDate
    });

    const blanks = Array.from({ length: getDay(monthStart) }).map((_, index) => (
      <div key={`blank-${index}`} className="h-8 sm:h-10 w-8 sm:w-10"></div>
    ));

    const handleDateClick = (day: Date) => {
      if (disableEditMode) {
        // In edit mode, just select the single date
        onChange([day]);
        setIsSelecting(false);
        setSelectionStart(null);
        return;
      }
      
      // If we're selecting a range
      if (isSelecting && selectionStart) {
        setIsSelecting(false);
        
        // Figure out the proper order of start and end dates
        const startDate = isBefore(selectionStart, day) ? selectionStart : day;
        const endDate = isBefore(selectionStart, day) ? day : selectionStart;
        
        // Generate all dates in the range
        const selectedRange = eachDayOfInterval({
          start: startDate,
          end: endDate
        });
        
        onChange(selectedRange);
        setSelectionStart(null);
      } 
      // Start selecting a range
      else {
        setIsSelecting(true);
        setSelectionStart(day);
        onChange([day]); // Initially select just this day
      }
    };

    const isSelected = (day: Date) => {
      return selectedDates.some(selectedDate => isSameDay(selectedDate, day));
    };

    const isInRange = (day: Date) => {
      if (!isSelecting || !selectionStart) return false;
      
      return (
        (isBefore(selectionStart, day) && isAfter(day, selectionStart)) ||
        (isAfter(selectionStart, day) && isBefore(day, selectionStart))
      );
    };

    const isDisabled = (day: Date) => {
      return (
        isBefore(day, minDate) ||
        isAfter(day, maxDate)
      );
    };

    const daysInMonth = dateRange.map((day, index) => {
      const isCurrentDay = isToday(day);
      const daySelected = isSelected(day);
      const dayInRange = isInRange(day);
      const dayDisabled = isDisabled(day);
      
      return (
        <button
          key={`day-${index}`}
          type="button" // Prevent form submission
          className={`relative h-8 sm:h-10 w-8 sm:w-10 flex items-center justify-center text-xs sm:text-sm rounded-full 
            ${!dayDisabled && 'cursor-pointer hover:bg-[#2B5C4B]/10 transition-colors'} 
            ${daySelected ? 'bg-[#2B5C4B] text-white hover:bg-[#2B5C4B]' : ''} 
            ${dayInRange ? 'bg-[#2B5C4B]/20' : ''} 
            ${dayDisabled ? 'text-gray-300 cursor-not-allowed' : 'text-gray-800'} 
            ${isCurrentDay && !daySelected ? 'font-bold' : ''}`}
          onClick={() => !dayDisabled && handleDateClick(day)}
          disabled={dayDisabled}
        >
          {format(day, 'd')}
        </button>
      );
    });

    const totalSlots = [...blanks, ...daysInMonth];
    const rows: JSX.Element[][] = [];
    let cells: JSX.Element[] = [];

    totalSlots.forEach((cell, i) => {
      cells.push(cell);
      if ((i + 1) % 7 === 0) {
        rows.push(cells);
        cells = [];
      }
    });

    if (cells.length > 0) {
      rows.push(cells);
    }

    return (
      <div className="flex flex-col gap-0.5 sm:gap-1">
        {rows.map((row, i) => (
          <div key={`row-${i}`} className="grid grid-cols-7 gap-0.5 sm:gap-1 mb-0.5 sm:mb-1">
            {row}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={`bg-white rounded-lg p-3 sm:p-4 border border-gray-200 ${className}`}>
      {renderHeader()}
      {renderDays()}
      {renderCells()}
      <div className="mt-3 sm:mt-4 text-xs text-gray-500 italic">
        {disableEditMode ? (
          'Edit mode only allows selecting a different date.'
        ) : (
          'Click to select a date. Click and select another date to create a range.'
        )}
      </div>
    </div>
  );
}