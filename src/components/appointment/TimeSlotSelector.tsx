import { motion } from 'framer-motion';
import { AlertCircle, Loader2 } from 'lucide-react';
import { TimeSlot } from '../../types';

interface TimeSlotSelectorProps {
  timeSlots: TimeSlot[];
  selectedTime: string;
  onSelectTime: (time: string) => void;
  label: string;
  t: {
    loadingSlots: string;
    noSlots: string;
    selectDate: string;
    noSlotsAvailable: string;
    slotsLeft: string;
  };
  loading?: boolean;
}

export function TimeSlotSelector({ timeSlots, selectedTime, onSelectTime, t, loading = false }: TimeSlotSelectorProps) {
  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#2B5C4B]/5 border border-[#2B5C4B]/10 rounded-xl p-6 text-center"
      >
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-6 w-6 text-[#2B5C4B] animate-spin" />
          <p className="text-[#2B5C4B] font-medium font-sans">{t.loadingSlots}</p>
        </div>
      </motion.div>
    );
  }

  const availableSlots = timeSlots.filter(slot => slot.currentBookings < slot.maxBookings);
  
  if (timeSlots.length === 0 || availableSlots.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#2B5C4B]/5 border border-[#2B5C4B]/10 rounded-xl p-4 text-center"
      >
        <AlertCircle className="h-6 w-6 text-[#2B5C4B] mx-auto mb-2" />
        <h3 className="text-base font-medium text-[#2B5C4B] mb-1 font-heading">
          {t.noSlots}
        </h3>
        <p className="text-sm text-[#2B5C4B]/80 font-sans">
          {timeSlots.length === 0 
            ? t.selectDate
            : t.noSlotsAvailable}
        </p>
      </motion.div>
    );
  }

  // Sort time slots by time
  const sortedSlots = [...timeSlots].sort((a, b) => {
    const timeA = new Date(`1970/01/01 ${a.time}`).getTime();
    const timeB = new Date(`1970/01/01 ${b.time}`).getTime();
    return timeA - timeB;
  });

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-1.5 sm:gap-2">
      {sortedSlots.map((slot, index) => {
        const isUnavailable = slot.currentBookings >= slot.maxBookings;
        
        return (
          <motion.button
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.03 }}
            type="button"
            disabled={isUnavailable}
            onClick={() => onSelectTime(slot.time)}
            className={`
              relative p-2 sm:p-2.5 rounded-xl flex flex-col items-center justify-center border transition-all duration-300
              ${
                selectedTime === slot.time
                  ? 'bg-[#2B5C4B] border-[#2B5C4B] text-white shadow-lg shadow-[#2B5C4B]/10'
                  : isUnavailable
                  ? 'bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-white border-gray-200 hover:border-[#2B5C4B]/30 hover:bg-[#2B5C4B]/5 text-gray-700'
              }
            `}
          >
            <span className="text-[11px] sm:text-sm font-medium font-sans">{slot.time}</span>
            {!isUnavailable && (
              <span className={`text-[9px] sm:text-[10px] font-sans ${
                selectedTime === slot.time 
                  ? 'text-white/90' 
                  : 'text-gray-500'
              }`}>
                {slot.maxBookings - slot.currentBookings} {t.slotsLeft}
              </span>
            )}
            {isUnavailable && (
              <span className="absolute top-0 right-0 -mt-0.5 -mr-0.5 sm:-mt-1 sm:-mr-1">
                <span className="flex h-1.5 w-1.5 sm:h-2 sm:w-2">
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 sm:h-2 sm:w-2 bg-red-400"></span>
                </span>
              </span>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}