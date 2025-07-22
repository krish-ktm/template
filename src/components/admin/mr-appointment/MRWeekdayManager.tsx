import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../../lib/supabase';
import { toast } from 'react-hot-toast';
import { Calendar, ChevronDown, Plus, Minus, Trash2, Clock } from 'lucide-react';

interface MRWeekday {
  id: string;
  day: string;
  is_working: boolean;
  slots: Array<{
    time: string;
    maxBookings: number;
  }>;
  created_at: string;
  updated_at: string;
}

export function MRWeekdayManager() {
  const [weekdays, setWeekdays] = useState<MRWeekday[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedDay, setExpandedDay] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [newSlotTime, setNewSlotTime] = useState('');
  const [newSlotMaxBookings, setNewSlotMaxBookings] = useState(5);

  useEffect(() => {
    loadWeekdays();
  }, []);

  const loadWeekdays = async () => {
    try {
      const { data, error } = await supabase
        .from('mr_weekdays')
        .select('*')
        .order('id');

      if (error) throw error;

      // Sort weekdays in correct order
      const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      const sortedWeekdays = [...(data || [])].sort((a, b) => {
        return dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day);
      });

      setWeekdays(sortedWeekdays);
    } catch (error) {
      console.error('Error loading weekdays:', error);
      toast.error('Failed to load weekdays');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleWorking = async (e: React.ChangeEvent<HTMLInputElement>, day: MRWeekday) => {
    e.stopPropagation();
    try {
      const { error } = await supabase
        .from('mr_weekdays')
        .update({ is_working: !day.is_working })
        .eq('id', day.id);

      if (error) throw error;

      setWeekdays(weekdays.map(wd =>
        wd.id === day.id ? { ...wd, is_working: !day.is_working } : wd
      ));

      toast.success(`${day.day} ${!day.is_working ? 'enabled' : 'disabled'} successfully`);
    } catch (error) {
      console.error('Error toggling working day:', error);
      toast.error('Failed to update settings');
    }
  };

  const handleAddTimeSlot = async (day: MRWeekday) => {
    if (!newSlotTime) {
      toast.error('Please select a time');
      return;
    }

    // Format time for display (12-hour format)
    const timeForDisplay = new Date(`2000/01/01 ${newSlotTime}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });

    // Check if slot already exists
    if (day.slots.some(slot => slot.time === timeForDisplay)) {
      toast.error('This time slot already exists');
      return;
    }

    try {
      setIsSaving(true);
      const newSlots = [...day.slots, { time: timeForDisplay, maxBookings: newSlotMaxBookings }];
      
      // Sort slots by time
      newSlots.sort((a, b) => {
        const timeA = new Date(`2000/01/01 ${a.time}`).getTime();
        const timeB = new Date(`2000/01/01 ${b.time}`).getTime();
        return timeA - timeB;
      });

      const { error } = await supabase
        .from('mr_weekdays')
        .update({ slots: newSlots })
        .eq('id', day.id);

      if (error) throw error;

      setWeekdays(weekdays.map(wd =>
        wd.id === day.id ? { ...wd, slots: newSlots } : wd
      ));

      setNewSlotTime('');
      toast.success('Time slot added successfully');
    } catch (error) {
      console.error('Error adding time slot:', error);
      toast.error('Failed to add time slot');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteSlot = async (day: MRWeekday, index: number) => {
    try {
      setIsSaving(true);
      const newSlots = [...day.slots];
      newSlots.splice(index, 1);

      const { error } = await supabase
        .from('mr_weekdays')
        .update({ slots: newSlots })
        .eq('id', day.id);

      if (error) throw error;

      setWeekdays(weekdays.map(wd =>
        wd.id === day.id ? { ...wd, slots: newSlots } : wd
      ));

      toast.success('Time slot deleted successfully');
    } catch (error) {
      console.error('Error deleting time slot:', error);
      toast.error('Failed to delete time slot');
    } finally {
      setIsSaving(false);
    }
  };

  const handleMaxBookingsChange = async (day: MRWeekday, index: number, maxBookings: number) => {
    try {
      setIsSaving(true);
      const newSlots = [...day.slots];
      newSlots[index] = { ...newSlots[index], maxBookings };

      const { error } = await supabase
        .from('mr_weekdays')
        .update({ slots: newSlots })
        .eq('id', day.id);

      if (error) throw error;

      setWeekdays(weekdays.map(wd =>
        wd.id === day.id ? { ...wd, slots: newSlots } : wd
      ));
    } catch (error) {
      console.error('Error updating max bookings:', error);
      toast.error('Failed to update max bookings');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2B5C4B]"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200">
      <div className="p-4 sm:p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-[#2B5C4B]/10 p-2.5 sm:p-3 rounded-lg">
            <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-[#2B5C4B]" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">MR Working Days</h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">Configure which days MRs can book appointments</p>
          </div>
        </div>

        <div className="space-y-2 sm:space-y-3">
          {weekdays.map((day) => (
            <div key={day.id} className="bg-gray-50 rounded-xl overflow-hidden">
              <div
                onClick={() => setExpandedDay(expandedDay === day.day ? null : day.day)}
                className="w-full flex items-center justify-between p-3 sm:p-4 hover:bg-gray-100/50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                  <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500 flex-shrink-0" />
                  <div className="flex flex-col flex-1 min-w-0">
                    <h3 className="text-sm sm:text-base font-medium text-gray-900 truncate">{day.day}</h3>
                    {day.is_working && (
                      <div className="text-[10px] sm:text-xs text-gray-500 mt-0.5">
                        <span>
                          {day.slots.length} {day.slots.length === 1 ? 'slot' : 'slots'} configured
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                  <label 
                    className="relative inline-flex items-center cursor-pointer" 
                    onClick={e => e.stopPropagation()}
                  >
                    <input
                      type="checkbox"
                      checked={day.is_working}
                      onChange={(e) => handleToggleWorking(e, day)}
                      className="sr-only peer"
                    />
                    <div className="w-9 sm:w-11 h-5 sm:h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#2B5C4B]/30 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 sm:after:h-5 after:w-4 sm:after:w-5 after:transition-all peer-checked:bg-[#2B5C4B]"></div>
                    <span className="ms-2 sm:ms-3 text-xs sm:text-sm font-medium text-gray-700 hidden sm:inline">
                      {day.is_working ? 'Working' : 'Closed'}
                    </span>
                  </label>
                  <ChevronDown
                    className={`h-4 w-4 sm:h-5 sm:w-5 text-gray-400 transition-transform ${
                      expandedDay === day.day ? 'rotate-180' : ''
                    }`}
                  />
                </div>
              </div>

              <AnimatePresence>
                {expandedDay === day.day && day.is_working && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="p-3 sm:p-4 pt-0">
                      <div className="bg-white rounded-lg p-3 sm:p-4 border border-gray-100">
                        <div className="flex flex-col gap-3 sm:gap-4 mb-4">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
                            <h4 className="text-sm sm:text-base font-medium text-gray-900">Time Slots</h4>
                          </div>
                          {/* Mobile layout (sm:hidden) */}
                          <div className="flex flex-col gap-3 sm:hidden">
                            <div className="grid grid-cols-2 gap-2">
                              <div className="col-span-2">
                                <label className="text-xs text-gray-500 mb-1 block">Time</label>
                                <input
                                  type="time"
                                  value={newSlotTime}
                                  onChange={(e) => setNewSlotTime(e.target.value)}
                                  className="px-2 py-1.5 border border-gray-300 rounded-lg text-xs w-full"
                                />
                              </div>
                              <div className="col-span-1">
                                <label className="text-xs text-gray-500 mb-1 block">Max Bookings</label>
                                <input
                                  type="number"
                                  value={newSlotMaxBookings}
                                  onChange={(e) => setNewSlotMaxBookings(parseInt(e.target.value) || 1)}
                                  min="1"
                                  className="px-2 py-1.5 border border-gray-300 rounded-lg text-xs w-full"
                                />
                              </div>
                              <div className="col-span-2">
                                <button
                                  onClick={() => handleAddTimeSlot(day)}
                                  disabled={isSaving}
                                  className="w-full px-3 py-2 bg-[#2B5C4B] text-white rounded-lg text-xs hover:bg-[#234539] transition-colors disabled:bg-[#2B5C4B]/70 mt-2"
                                >
                                  {isSaving ? 'Adding...' : 'Add Slot'}
                                </button>
                              </div>
                            </div>
                          </div>
                          
                          {/* Desktop layout (hidden sm:flex) - Original design */}
                          <div className="hidden sm:flex sm:flex-row sm:items-center sm:justify-end w-full">
                            <div className="sm:flex sm:flex-row gap-4">
                              <input
                                type="time"
                                value={newSlotTime}
                                onChange={(e) => setNewSlotTime(e.target.value)}
                                className="px-2 py-1.5 border border-gray-300 rounded-lg text-sm w-full"
                              />
                              <input
                                type="number"
                                value={newSlotMaxBookings}
                                onChange={(e) => setNewSlotMaxBookings(parseInt(e.target.value) || 1)}
                                min="1"
                                className="px-2 py-1.5 border border-gray-300 rounded-lg text-sm w-20"
                                placeholder="Max"
                              />
                            </div>
                            <button
                              onClick={() => handleAddTimeSlot(day)}
                              disabled={isSaving}
                              className="ms-4 w-auto px-3 py-2 bg-[#2B5C4B] text-white rounded-lg text-sm hover:bg-[#234539] transition-colors disabled:bg-[#2B5C4B]/70"
                            >
                              {isSaving ? 'Adding...' : 'Add Slot'}
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
                          {day.slots.length === 0 ? (
                            <div className="col-span-full text-center py-4 text-gray-500 bg-gray-50 rounded-lg text-xs sm:text-sm">
                              No time slots configured. Add your first time slot above.
                            </div>
                          ) : (
                            day.slots.map((slot, index) => (
                              <div
                                key={index}
                                className="bg-gray-50 p-2 sm:p-3 rounded-lg border border-gray-200 relative group"
                              >
                                <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                                  <span className="text-xs sm:text-sm font-medium text-gray-900">{slot.time}</span>
                                  <div className="flex items-center">
                                    <button
                                      onClick={() => handleDeleteSlot(day, index)}
                                      disabled={isSaving}
                                      className="p-1 mr-1 rounded-lg text-red-600 opacity-100 hover:bg-red-100 disabled:opacity-50 disabled:hover:bg-transparent"
                                      aria-label="Delete slot"
                                    >
                                      <Trash2 className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                                    </button>
                                    <div className="flex items-center gap-1 bg-white rounded-lg border border-gray-200 px-1">
                                      <button
                                        onClick={() => handleMaxBookingsChange(day, index, Math.max(1, slot.maxBookings - 1))}
                                        disabled={isSaving}
                                        className="p-0.5 sm:p-1 hover:bg-gray-100 rounded disabled:opacity-50 disabled:hover:bg-transparent"
                                        aria-label="Decrease bookings"
                                      >
                                        <Minus className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-gray-500" />
                                      </button>
                                      <span className="text-xs sm:text-sm text-gray-600 min-w-[14px] sm:min-w-[20px] text-center">
                                        {slot.maxBookings}
                                      </span>
                                      <button
                                        onClick={() => handleMaxBookingsChange(day, index, slot.maxBookings + 1)}
                                        disabled={isSaving}
                                        className="p-0.5 sm:p-1 hover:bg-gray-100 rounded disabled:opacity-50 disabled:hover:bg-transparent"
                                        aria-label="Increase bookings"
                                      >
                                        <Plus className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-gray-500" />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                                <p className="text-[10px] sm:text-xs text-gray-500">Max Bookings</p>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}