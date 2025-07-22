import { motion } from 'framer-motion';
import { Clock, AlertCircle, Loader2 } from 'lucide-react';
import { TimeSlot } from './types';

interface TimeSlotTranslations {
  timeSlot: string;
  slotAvailable: string;
  noTimeSlots: string;
  selectAnotherDate: string;
  loadingSlots: string;
}

interface MRTimeSlotSelectorProps {
  slots: TimeSlot[];
  selectedTime: string | undefined;
  onSelectTime: (time: string) => void;
  t: TimeSlotTranslations;
  error?: string;
  loading?: boolean;
}

export function MRTimeSlotSelector({ slots, selectedTime, onSelectTime, t, error, loading = false }: MRTimeSlotSelectorProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl p-4 border border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-[#2B5C4B]/10 rounded-lg">
            <Clock className="h-5 w-5 text-[#2B5C4B]" />
          </div>
          <h3 className="font-medium text-gray-900 font-heading">{t.timeSlot}</h3>
        </div>
        <div className="flex items-center justify-center py-4 bg-[#2B5C4B]/5 rounded-lg">
          <div className="flex items-center gap-3">
            <Loader2 className="h-5 w-5 text-[#2B5C4B] animate-spin" />
            <p className="text-[#2B5C4B] font-medium font-sans">{t.loadingSlots}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!slots.length) {
    return (
      <div className="bg-white rounded-xl p-4 border border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-[#2B5C4B]/10 rounded-lg">
            <Clock className="h-5 w-5 text-[#2B5C4B]" />
          </div>
          <h3 className="font-medium text-gray-900 font-heading">{t.timeSlot}</h3>
        </div>
        <div className="flex flex-col items-center justify-center py-4 bg-[#2B5C4B]/5 rounded-lg">
          <AlertCircle className="h-6 w-6 text-[#2B5C4B] mb-2" />
          <p className="text-[#2B5C4B] font-medium font-sans">{t.noTimeSlots}</p>
          <p className="text-sm text-[#2B5C4B]/80 mt-1 font-sans">{t.selectAnotherDate}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-4 border border-gray-200">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-[#2B5C4B]/10 rounded-lg">
          <Clock className="h-5 w-5 text-[#2B5C4B]" />
        </div>
        <h3 className="font-medium text-gray-900 font-heading">{t.timeSlot}</h3>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-600 flex items-center gap-2 font-sans">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {slots.map((slot, index) => {
          const isUnavailable = slot.currentBookings !== undefined && 
                               slot.currentBookings >= slot.maxBookings;
          
          return (
            <motion.button
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              type="button"
              disabled={isUnavailable}
              onClick={() => onSelectTime(slot.time)}
              className={`
                relative p-2 rounded-lg flex flex-col items-center justify-center border transition-all duration-300
                ${selectedTime === slot.time
                  ? 'bg-[#2B5C4B] border-[#2B5C4B] text-white shadow-lg shadow-[#2B5C4B]/10'
                  : isUnavailable
                    ? 'bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-white border-gray-200 hover:border-[#2B5C4B]/30 hover:bg-[#2B5C4B]/5 text-gray-700'
                }
              `}
            >
              <span className="text-sm font-medium font-sans">{slot.time}</span>
              {!isUnavailable && slot.currentBookings !== undefined && (
                <span className={`text-xs font-sans ${
                  selectedTime === slot.time 
                    ? 'text-white/90' 
                    : 'text-gray-500'
                }`}>
                  {slot.maxBookings - slot.currentBookings} {t.slotAvailable}
                </span>
              )}
              {isUnavailable && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500" />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}