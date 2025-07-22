import { Sun, Moon } from 'lucide-react';
import { WorkingHour } from '../../../types';
import { format, parse } from 'date-fns';

interface WorkingHoursFormProps {
  day: WorkingHour;
  onUpdate: (updates: Partial<WorkingHour>) => void;
  formErrors: Record<string, string>;
}

export function WorkingHoursForm({ day, onUpdate, formErrors }: WorkingHoursFormProps) {
  // Function to convert 12h time to 24h time for input
  const to24HourFormat = (time12: string | null): string => {
    if (!time12) return '';
    try {
      const date = parse(time12, 'hh:mm aa', new Date());
      return format(date, 'HH:mm');
    } catch (error) {
      console.error('Error converting time:', error);
      return '';
    }
  };

  // Function to convert 24h time back to 12h format for storage
  const to12HourFormat = (time24: string): string => {
    if (!time24) return '';
    try {
      const [hours, minutes] = time24.split(':');
      const date = new Date();
      date.setHours(parseInt(hours), parseInt(minutes));
      return format(date, 'hh:mm aa');
    } catch (error) {
      console.error('Error converting time:', error);
      return '';
    }
  };

  const handleTimeChange = (period: 'morning' | 'evening', type: 'start' | 'end', value: string) => {
    const updates: Partial<WorkingHour> = {};
    const time12 = value ? to12HourFormat(value) : null;
    updates[`${period}_${type}`] = time12;
    
    // If either start or end time is set, ensure both are set with default values
    if (value && period === 'morning') {
      if (type === 'start' && !day.morning_end) {
        updates.morning_end = '12:00 PM';
      } else if (type === 'end' && !day.morning_start) {
        updates.morning_start = '09:30 AM';
      }
    } else if (value && period === 'evening') {
      if (type === 'start' && !day.evening_end) {
        updates.evening_end = '06:30 PM';
      } else if (type === 'end' && !day.evening_start) {
        updates.evening_start = '04:00 PM';
      }
    }

    onUpdate(updates);
  };

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
      {/* Morning Hours Section */}
      <div className="bg-white rounded-lg p-3 sm:p-4 border border-gray-100">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Sun className="h-4 w-4 sm:h-5 sm:w-5 text-amber-500" />
            <h4 className="text-sm sm:text-base font-medium text-gray-900">Morning Hours</h4>
          </div>
          <div className="flex items-center">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={Boolean(day.morning_start && day.morning_end)}
                onChange={(e) => {
                  if (!e.target.checked) {
                    onUpdate({ morning_start: null, morning_end: null });
                  } else {
                    onUpdate({ morning_start: '09:30 AM', morning_end: '12:00 PM' });
                  }
                }}
                className="sr-only peer"
              />
              <div className="w-7 sm:w-11 h-4 sm:h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#2B5C4B]/30 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 sm:after:h-5 sm:after:w-5 after:transition-all peer-checked:bg-[#2B5C4B]"></div>
            </label>
          </div>
        </div>
        {day.morning_start && day.morning_end && (
          <>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <div className="w-full">
                <label className="block text-xs text-gray-500 mb-1 sm:hidden">Start</label>
                <input
                  type="time"
                  value={to24HourFormat(day.morning_start)}
                  onChange={(e) => handleTimeChange('morning', 'start', e.target.value)}
                  className="block w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B5C4B]/20 focus:border-[#2B5C4B] bg-white text-xs sm:text-sm"
                />
              </div>
              <span className="text-gray-500 text-center hidden sm:block">to</span>
              <div className="w-full">
                <label className="block text-xs text-gray-500 mb-1 sm:hidden">End</label>
                <input
                  type="time"
                  value={to24HourFormat(day.morning_end)}
                  onChange={(e) => handleTimeChange('morning', 'end', e.target.value)}
                  className="block w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B5C4B]/20 focus:border-[#2B5C4B] bg-white text-xs sm:text-sm"
                />
              </div>
            </div>
            <div className="mt-2 text-[10px] sm:text-xs text-gray-500">
              {day.morning_start} - {day.morning_end}
            </div>
            {formErrors?.morning && (
              <p className="mt-2 text-[10px] sm:text-xs text-red-600">{formErrors.morning}</p>
            )}
          </>
        )}
      </div>

      {/* Evening Hours Section */}
      <div className="bg-white rounded-lg p-3 sm:p-4 border border-gray-100">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Moon className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-500" />
            <h4 className="text-sm sm:text-base font-medium text-gray-900">Evening Hours</h4>
          </div>
          <div className="flex items-center">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={Boolean(day.evening_start && day.evening_end)}
                onChange={(e) => {
                  if (!e.target.checked) {
                    onUpdate({ evening_start: null, evening_end: null });
                  } else {
                    onUpdate({ evening_start: '04:00 PM', evening_end: '06:30 PM' });
                  }
                }}
                className="sr-only peer"
              />
              <div className="w-7 sm:w-11 h-4 sm:h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#2B5C4B]/30 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 sm:after:h-5 sm:after:w-5 after:transition-all peer-checked:bg-[#2B5C4B]"></div>
            </label>
          </div>
        </div>
        {day.evening_start && day.evening_end && (
          <>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <div className="w-full">
                <label className="block text-xs text-gray-500 mb-1 sm:hidden">Start</label>
                <input
                  type="time"
                  value={to24HourFormat(day.evening_start)}
                  onChange={(e) => handleTimeChange('evening', 'start', e.target.value)}
                  className="block w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B5C4B]/20 focus:border-[#2B5C4B] bg-white text-xs sm:text-sm"
                />
              </div>
              <span className="text-gray-500 text-center hidden sm:block">to</span>
              <div className="w-full">
                <label className="block text-xs text-gray-500 mb-1 sm:hidden">End</label>
                <input
                  type="time"
                  value={to24HourFormat(day.evening_end)}
                  onChange={(e) => handleTimeChange('evening', 'end', e.target.value)}
                  className="block w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B5C4B]/20 focus:border-[#2B5C4B] bg-white text-xs sm:text-sm"
                />
              </div>
            </div>
            <div className="mt-2 text-[10px] sm:text-xs text-gray-500">
              {day.evening_start} - {day.evening_end}
            </div>
            {formErrors?.evening && (
              <p className="mt-2 text-[10px] sm:text-xs text-red-600">{formErrors.evening}</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}