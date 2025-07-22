import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { toast } from 'react-hot-toast';
import { Calendar } from 'lucide-react';
import { WorkingHour } from '../../../types';
import { WorkingHourCard } from './WorkingHourCard';
import { format } from 'date-fns';

export function WorkingHours() {
  const [workingHours, setWorkingHours] = useState<WorkingHour[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedDay, setExpandedDay] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, Record<string, string>>>({});
  const [savingDay, setSavingDay] = useState<string | null>(null);

  useEffect(() => {
    loadWorkingHours();
  }, []);

  const loadWorkingHours = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('working_hours')
        .select('*');

      if (error) throw error;

      // Define the correct order of days
      const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      
      // Sort the working hours based on the day order
      const sortedWorkingHours = [...(data || [])].sort((a, b) => {
        return dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day);
      });

      setWorkingHours(sortedWorkingHours);
    } catch (error) {
      console.error('Error loading working hours:', error);
      toast.error('Failed to load working hours');
    } finally {
      setLoading(false);
    }
  };

  const validateWorkingHours = (day: WorkingHour): Record<string, string> => {
    const errors: Record<string, string> = {};

    if (day.is_working) {
      // Morning validation
      if (day.morning_start && day.morning_end) {
        const startTime = new Date(`1970/01/01 ${day.morning_start}`).getTime();
        const endTime = new Date(`1970/01/01 ${day.morning_end}`).getTime();
        if (endTime <= startTime) {
          errors.morning = 'Morning end time must be after start time';
        }
      }

      // Evening validation (except Saturday)
      if (day.day !== 'Saturday' && day.evening_start && day.evening_end) {
        const startTime = new Date(`1970/01/01 ${day.evening_start}`).getTime();
        const endTime = new Date(`1970/01/01 ${day.evening_end}`).getTime();
        if (endTime <= startTime) {
          errors.evening = 'Evening end time must be after start time';
        }
      }

      // Slots validation
      if (!day.slots || day.slots.length === 0) {
        errors.slots = 'At least one time slot is required';
      }
    }

    return errors;
  };

  const handleWorkingHoursUpdate = async (day: string) => {
    try {
      setSavingDay(day);
      const dayData = workingHours.find(wh => wh.day === day);
      if (!dayData) return;

      // Validate before saving
      const errors = validateWorkingHours(dayData);
      if (Object.keys(errors).length > 0) {
        setFormErrors({ ...formErrors, [day]: errors });
        toast.error('Please fix the validation errors before saving');
        return;
      }

      const { error } = await supabase
        .from('working_hours')
        .update(dayData)
        .eq('day', day);

      if (error) throw error;
      toast.success('Working hours updated successfully');
      setFormErrors({ ...formErrors, [day]: {} });
    } catch (error) {
      console.error('Error updating working hours:', error);
      toast.error('Failed to update working hours');
    } finally {
      setSavingDay(null);
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
          <div className="bg-[#2B5C4B]/10 p-3 rounded-lg">
            <Calendar className="h-6 w-6 text-[#2B5C4B]" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Working Hours</h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">Configure clinic working hours and time slots</p>
          </div>
        </div>

        <div className="space-y-2 sm:space-y-3">
          {workingHours.map((day) => (
            <WorkingHourCard
              key={day.day}
              day={day}
              isExpanded={expandedDay === day.day}
              onToggle={() => setExpandedDay(expandedDay === day.day ? null : day.day)}
              onUpdate={(updates) => {
                setWorkingHours(workingHours.map(wh =>
                  wh.day === day.day ? { ...wh, ...updates } : wh
                ));
              }}
              onSave={() => handleWorkingHoursUpdate(day.day)}
              formErrors={formErrors}
              isSaving={savingDay === day.day}
            />
          ))}
        </div>
      </div>
    </div>
  );
}