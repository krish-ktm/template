import { useState } from 'react';
import { Calendar, ChevronDown, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { WorkingHour } from '../../../types';
import { WorkingHoursForm } from './WorkingHoursForm';
import { TimeSlotsManager } from './TimeSlotsManager';
import { format, parse, addMinutes } from 'date-fns';
import { supabase } from '../../../lib/supabase';
import { toast } from 'react-hot-toast';

interface WorkingHourCardProps {
  day: WorkingHour;
  isExpanded: boolean;
  onToggle: () => void;
  onUpdate: (updates: Partial<WorkingHour>) => void;
  onSave: () => void;
  formErrors: Record<string, any>;
  isSaving: boolean;
}

export function WorkingHourCard({
  day,
  isExpanded,
  onToggle,
  onUpdate,
  onSave,
  formErrors,
  isSaving
}: WorkingHourCardProps) {
  const [isToggling, setIsToggling] = useState(false);

  const handleGenerateSlots = (defaultMaxBookings: number) => {
    // Generate time slots based on working hours
    const newSlots = [];
    const interval = day.slot_interval || 30;

    if (day.morning_start && day.morning_end) {
      let currentTime = parse(day.morning_start, 'hh:mm aa', new Date());
      const endTime = parse(day.morning_end, 'hh:mm aa', new Date());

      while (currentTime <= endTime) {
        newSlots.push({
          time: format(currentTime, 'hh:mm aa'),
          maxBookings: defaultMaxBookings
        });
        currentTime = addMinutes(currentTime, interval);
      }
    }

    if (day.evening_start && day.evening_end) {
      let currentTime = parse(day.evening_start, 'hh:mm aa', new Date());
      const endTime = parse(day.evening_end, 'hh:mm aa', new Date());

      while (currentTime <= endTime) {
        newSlots.push({
          time: format(currentTime, 'hh:mm aa'),
          maxBookings: defaultMaxBookings
        });
        currentTime = addMinutes(currentTime, interval);
      }
    }

    onUpdate({ slots: newSlots });
  };

  const handleToggleWorking = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    if (isToggling) return;
    
    setIsToggling(true);
    const newIsWorking = e.target.checked;

    try {
      const { error } = await supabase
        .from('working_hours')
        .update({ is_working: newIsWorking })
        .eq('day', day.day);

      if (error) throw error;

      onUpdate({ is_working: newIsWorking });
      toast.success(`${day.day} ${newIsWorking ? 'enabled' : 'disabled'} successfully`);
    } catch (error) {
      console.error('Error toggling working day:', error);
      toast.error('Failed to update working hours');
      onUpdate({ is_working: !newIsWorking });
    } finally {
      setIsToggling(false);
    }
  };

  const handleCardClick = (e: React.MouseEvent) => {
    if (!(e.target as HTMLElement).closest('label')) {
      onToggle();
    }
  };

  const handleDeleteSlot = (index: number) => {
    const newSlots = [...day.slots];
    newSlots.splice(index, 1);
    onUpdate({ slots: newSlots });
  };

  return (
    <div className="bg-gray-50 rounded-lg sm:rounded-xl overflow-hidden">
      <div
        onClick={handleCardClick}
        className="w-full flex items-center justify-between p-3 sm:p-4 hover:bg-gray-100/50 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
          <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500 flex-shrink-0" />
          <div className="flex flex-col flex-1 min-w-0">
            <h3 className="text-sm sm:text-base font-medium text-gray-900 truncate">{day.day}</h3>
            {day.is_working && (
              <div className="text-[10px] sm:text-xs text-gray-500 mt-0.5 hidden sm:block">
                <span>
                  {day.morning_start && day.morning_end
                    ? `${day.morning_start} - ${day.morning_end}`
                    : 'No morning hours'
                  }
                  {day.evening_start && day.evening_end
                    ? ` | ${day.evening_start} - ${day.evening_end}`
                    : ' | No evening hours'
                  }
                </span>
              </div>
            )}
            {day.is_working && (
              <div className="text-[10px] text-gray-500 mt-0.5 sm:hidden">
                <span>
                  {day.slots?.length || 0} {day.slots?.length === 1 ? 'slot' : 'slots'} configured
                </span>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <label className="relative inline-flex items-center cursor-pointer" onClick={e => e.stopPropagation()}>
            <input
              type="checkbox"
              checked={day.is_working}
              onChange={handleToggleWorking}
              disabled={isToggling}
              className="sr-only peer"
            />
            <div className="w-9 sm:w-11 h-5 sm:h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#2B5C4B]/30 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 sm:after:h-5 after:w-4 sm:after:w-5 after:transition-all peer-checked:bg-[#2B5C4B]"></div>
            <span className="ms-2 sm:ms-3 text-xs sm:text-sm font-medium text-gray-700 hidden sm:inline">
              {isToggling ? '...' : (day.is_working ? 'Working' : 'Closed')}
            </span>
          </label>
          <ChevronDown
            className={`h-4 w-4 sm:h-5 sm:w-5 text-gray-400 transition-transform ${
              isExpanded ? 'rotate-180' : ''
            }`}
          />
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && day.is_working && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-3 sm:p-4 pt-0">
              <WorkingHoursForm
                day={day}
                onUpdate={onUpdate}
                formErrors={formErrors[day.day] || {}}
              />

              <div className="mt-6">
                <TimeSlotsManager
                  day={day}
                  onGenerateSlots={handleGenerateSlots}
                  onSlotIntervalChange={(interval) => onUpdate({ slot_interval: interval })}
                  onMaxBookingsChange={(index, maxBookings) => {
                    const newSlots = [...day.slots];
                    newSlots[index] = { ...newSlots[index], maxBookings };
                    onUpdate({ slots: newSlots });
                  }}
                  onDeleteSlot={handleDeleteSlot}
                />
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={onSave}
                  disabled={isSaving}
                  className={`inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-[#2B5C4B] text-white rounded-lg hover:bg-[#234539] transition-colors text-xs sm:text-sm ${
                    isSaving ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {isSaving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}