import { useState } from 'react';
import { Settings, Plus, Minus, Trash2, ChevronDown } from 'lucide-react';
import { WorkingHour, TimeSlot } from '../../../types';

interface TimeSlotsManagerProps {
  day: WorkingHour;
  onGenerateSlots: (defaultMaxBookings: number) => void;
  onSlotIntervalChange: (interval: number) => void;
  onMaxBookingsChange: (index: number, maxBookings: number) => void;
  onDeleteSlot: (index: number) => void;
}

export function TimeSlotsManager({ 
  day, 
  onGenerateSlots, 
  onSlotIntervalChange,
  onMaxBookingsChange,
  onDeleteSlot
}: TimeSlotsManagerProps) {
  const [defaultMaxBookings, setDefaultMaxBookings] = useState(3);
  const [showSlots, setShowSlots] = useState(true);

  const handleMaxBookingsChange = (value: string) => {
    const num = parseInt(value);
    if (!isNaN(num) && num > 0) {
      setDefaultMaxBookings(num);
    }
  };

  return (
    <div className="bg-white rounded-lg p-3 sm:p-4 border border-gray-100 overflow-hidden">
      <div className="flex flex-col gap-3 sm:gap-4 mb-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Settings className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
            <h4 className="text-sm sm:text-base font-medium text-gray-900">Time Slots Settings</h4>
          </div>
          <button
            onClick={() => setShowSlots(!showSlots)}
            className="sm:hidden p-1 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label={showSlots ? "Hide time slots" : "Show time slots"}
          >
            <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${showSlots ? 'rotate-180' : ''}`} />
          </button>
        </div>
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-gray-600">Interval</label>
              <select
                value={day.slot_interval}
                onChange={(e) => onSlotIntervalChange(parseInt(e.target.value))}
                className="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-xs sm:text-sm"
              >
                <option value={15}>15 minutes</option>
                <option value={30}>30 minutes</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-gray-600">Max Bookings</label>
              <input
                type="number"
                min="1"
                value={defaultMaxBookings}
                onChange={(e) => handleMaxBookingsChange(e.target.value)}
                className="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-xs sm:text-sm"
              />
            </div>
          </div>

          <button
            onClick={() => onGenerateSlots(defaultMaxBookings)}
            className="w-full px-3 py-2 bg-[#2B5C4B] text-white rounded-lg text-xs sm:text-sm hover:bg-[#234539] transition-colors"
          >
            Generate Slots
          </button>
        </div>
      </div>

      <div className={`grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 transition-all duration-300 ${
        showSlots ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden sm:max-h-[2000px] sm:opacity-100'
      }`}>
        {day.slots.map((slot: TimeSlot, index: number) => (
          <div
            key={index}
            className="bg-gray-50 p-2 sm:p-3 rounded-lg border border-gray-200 relative group"
          >
            <div className="flex items-center justify-between gap-1 sm:gap-2 mb-1 sm:mb-2">
              <span className="text-xs sm:text-sm font-medium text-gray-900 truncate">{slot.time}</span>
              <div className="flex items-center">
                <button
                  onClick={() => onDeleteSlot(index)}
                  className="p-1 rounded-lg text-red-600 opacity-100 hover:bg-red-100 transition-opacity"
                  aria-label="Delete slot"
                >
                  <Trash2 className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                </button>
                <div className="flex items-center gap-0.5 sm:gap-1 bg-white rounded-lg border border-gray-200 p-0.5 sm:p-1">
                  <button
                    onClick={() => onMaxBookingsChange(index, Math.max(1, slot.maxBookings - 1))}
                    className="p-1 sm:p-1.5 hover:bg-gray-100 rounded-md"
                    aria-label="Decrease max bookings"
                  >
                    <Minus className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-gray-500" />
                  </button>
                  <span className="text-xs sm:text-sm text-gray-600 min-w-[14px] sm:min-w-[20px] text-center font-medium">
                    {slot.maxBookings}
                  </span>
                  <button
                    onClick={() => onMaxBookingsChange(index, slot.maxBookings + 1)}
                    className="p-1 sm:p-1.5 hover:bg-gray-100 rounded-md"
                    aria-label="Increase max bookings"
                  >
                    <Plus className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-gray-500" />
                  </button>
                </div>
              </div>
            </div>
            <p className="text-[10px] sm:text-xs text-gray-500">Max Bookings</p>
          </div>
        ))}
        {day.slots.length === 0 && (
          <div className="col-span-full text-center py-4 text-gray-500 bg-gray-50 rounded-lg text-xs sm:text-sm">
            No time slots configured. Add your first time slot above.
          </div>
        )}
      </div>
    </div>
  );
}