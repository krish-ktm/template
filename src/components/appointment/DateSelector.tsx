import { motion } from 'framer-motion';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, isToday, isTomorrow, isWeekend, isBefore, startOfToday } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import { useState } from 'react';
import { DateSelectionOptions, BookingRestrictions } from '../../hooks/useBookingSettings';
import { useTranslation } from '../../i18n/useTranslation';

const TIMEZONE = 'Asia/Kolkata';

interface DateSelectorProps {
  selectedDate: string;
  onDateChange: (date: Date) => void;
  dateOptions: DateSelectionOptions;
  restrictions: BookingRestrictions;
}

export function DateSelector({ selectedDate, onDateChange, dateOptions, restrictions }: DateSelectorProps) {
  const { t, language } = useTranslation();
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date()));

  const today = new Date();
  const tomorrow = addDays(today, 1);
  const istToday = utcToZonedTime(today, TIMEZONE);
  const istTomorrow = utcToZonedTime(tomorrow, TIMEZONE);

  const formatDate = (date: Date, dateStr: string) => {
    const istDate = utcToZonedTime(date, TIMEZONE);
    const dayName = t.appointment.form.days[format(istDate, 'EEEE').toLowerCase() as keyof typeof t.appointment.form.days];
    const monthName = t.appointment.form.months[format(istDate, 'MMMM').toLowerCase() as keyof typeof t.appointment.form.months];
    const day = format(istDate, 'd');
    return { dayName, monthName, day, dateStr };
  };

  const isDateDisabled = (date: Date) => {
    const today = startOfToday();
    
    // Check if past date (and past dates not allowed)
    if (!restrictions.allowPastDates && isBefore(date, today)) {
      return true;
    }
    
    // Check if weekend (and weekends not allowed)
    if (!restrictions.allowWeekends && isWeekend(date)) {
      return true;
    }
    
    return false;
  };

  const getWeekDays = () => {
    const weekStart = currentWeekStart;
    const weekEnd = endOfWeek(weekStart);
    return eachDayOfInterval({ start: weekStart, end: weekEnd });
  };

  const getCalendarDays = () => {
    const today = new Date();
    const maxDate = addDays(today, dateOptions.calendar.maxDaysAhead || 30);
    const days = [];
    
    for (let i = 0; i <= (dateOptions.calendar.maxDaysAhead || 30); i++) {
      const date = addDays(today, i);
      if (date <= maxDate) {
        days.push(date);
      }
    }
    
    return days;
  };

  return (
    <div className="bg-white p-4 rounded-xl border border-gray-200">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-[#2B5C4B]/10 rounded-lg">
          <Calendar className="w-5 h-5 text-[#2B5C4B]" />
        </div>
        <h3 className="font-medium text-gray-900 font-heading">{t.appointment.form.date}</h3>
      </div>

      <div className="space-y-3">
        {/* Today and Tomorrow Options */}
        <div className="grid grid-cols-2 gap-3">
          {dateOptions.today.enabled && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={() => onDateChange(today)}
              disabled={isDateDisabled(today)}
              className={`p-4 rounded-xl text-center transition-all ${
                selectedDate === format(istToday, 'yyyy-MM-dd')
                  ? 'bg-[#2B5C4B] text-white shadow-lg shadow-[#2B5C4B]/10'
                  : isDateDisabled(today)
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white border border-gray-200 text-gray-700 hover:border-[#2B5C4B]/30 hover:bg-[#2B5C4B]/5'
              }`}
            >
              <div className="text-sm font-medium mb-1 font-sans">
                {dateOptions.today.label[language]}
              </div>
              <div className={`text-xs ${
                selectedDate === format(istToday, 'yyyy-MM-dd') 
                  ? 'text-white/90' 
                  : isDateDisabled(today)
                  ? 'text-gray-400'
                  : 'text-gray-500'
              } font-sans`}>
                {formatDate(today, format(istToday, 'yyyy-MM-dd')).monthName} {formatDate(today, format(istToday, 'yyyy-MM-dd')).day}
              </div>
            </motion.button>
          )}

          {dateOptions.tomorrow.enabled && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={() => onDateChange(tomorrow)}
              disabled={isDateDisabled(tomorrow)}
              className={`p-4 rounded-xl text-center transition-all ${
                selectedDate === format(istTomorrow, 'yyyy-MM-dd')
                  ? 'bg-[#2B5C4B] text-white shadow-lg shadow-[#2B5C4B]/10'
                  : isDateDisabled(tomorrow)
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white border border-gray-200 text-gray-700 hover:border-[#2B5C4B]/30 hover:bg-[#2B5C4B]/5'
              }`}
            >
              <div className="text-sm font-medium mb-1 font-sans">
                {dateOptions.tomorrow.label[language]}
              </div>
              <div className={`text-xs ${
                selectedDate === format(istTomorrow, 'yyyy-MM-dd') 
                  ? 'text-white/90' 
                  : isDateDisabled(tomorrow)
                  ? 'text-gray-400'
                  : 'text-gray-500'
              } font-sans`}>
                {formatDate(tomorrow, format(istTomorrow, 'yyyy-MM-dd')).monthName} {formatDate(tomorrow, format(istTomorrow, 'yyyy-MM-dd')).day}
              </div>
            </motion.button>
          )}
        </div>

        {/* Week View */}
        {dateOptions.week.enabled && (
          <div className="border-t pt-3">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-gray-700 font-sans">
                {dateOptions.week.label[language]}
              </h4>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => setCurrentWeekStart(addDays(currentWeekStart, -7))}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <ChevronLeft className="w-4 h-4 text-gray-500" />
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentWeekStart(addDays(currentWeekStart, 7))}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <ChevronRight className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-1">
              {getWeekDays().map((date) => {
                const dateStr = format(utcToZonedTime(date, TIMEZONE), 'yyyy-MM-dd');
                const isSelected = selectedDate === dateStr;
                const isDisabled = isDateDisabled(date);
                const dayInfo = formatDate(date, dateStr);
                
                return (
                  <motion.button
                    key={dateStr}
                    whileHover={!isDisabled ? { scale: 1.05 } : {}}
                    whileTap={!isDisabled ? { scale: 0.95 } : {}}
                    type="button"
                    onClick={() => !isDisabled && onDateChange(date)}
                    disabled={isDisabled}
                    className={`p-2 rounded-lg text-center transition-all text-xs ${
                      isSelected
                        ? 'bg-[#2B5C4B] text-white'
                        : isDisabled
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'hover:bg-[#2B5C4B]/10 text-gray-700'
                    }`}
                  >
                    <div className="font-medium">{dayInfo.day}</div>
                    <div className={`text-[10px] ${
                      isSelected ? 'text-white/80' : isDisabled ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      {dayInfo.dayName.slice(0, 3)}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        )}

        {/* Calendar Toggle */}
        {dateOptions.calendar.enabled && (
          <div className="border-t pt-3">
            <button
              type="button"
              onClick={() => setShowCalendar(!showCalendar)}
              className="w-full p-3 border border-gray-200 rounded-xl hover:border-[#2B5C4B]/30 hover:bg-[#2B5C4B]/5 transition-all text-left flex items-center justify-between"
            >
              <span className="text-sm font-medium text-gray-700 font-sans">
                {dateOptions.calendar.label[language]}
              </span>
              <Calendar className="w-4 h-4 text-gray-500" />
            </button>

            {showCalendar && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 border border-gray-200 rounded-xl p-3 bg-gray-50"
              >
                <div className="grid grid-cols-7 gap-1 max-h-48 overflow-y-auto">
                  {getCalendarDays().map((date) => {
                    const dateStr = format(utcToZonedTime(date, TIMEZONE), 'yyyy-MM-dd');
                    const isSelected = selectedDate === dateStr;
                    const isDisabled = isDateDisabled(date);
                    const dayInfo = formatDate(date, dateStr);
                    
                    return (
                      <motion.button
                        key={dateStr}
                        whileHover={!isDisabled ? { scale: 1.05 } : {}}
                        whileTap={!isDisabled ? { scale: 0.95 } : {}}
                        type="button"
                        onClick={() => {
                          if (!isDisabled) {
                            onDateChange(date);
                            setShowCalendar(false);
                          }
                        }}
                        disabled={isDisabled}
                        className={`p-2 rounded-lg text-center transition-all text-xs ${
                          isSelected
                            ? 'bg-[#2B5C4B] text-white'
                            : isDisabled
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            : 'hover:bg-white hover:shadow-sm text-gray-700'
                        }`}
                      >
                        <div className="font-medium">{dayInfo.day}</div>
                        <div className={`text-[10px] ${
                          isSelected ? 'text-white/80' : isDisabled ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          {dayInfo.monthName.slice(0, 3)}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}