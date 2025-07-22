import { format } from 'date-fns';
import { supabase } from '../../lib/supabase';
import { TimeSlot } from './types';

// Define the structure of a slot from the database
interface DBTimeSlot {
  time: string;
  maxBookings: number;
}

export async function fetchTimeSlots(date: Date): Promise<TimeSlot[]> {
  try {
    const dayName = format(date, 'EEEE');
    const dateStr = format(date, 'yyyy-MM-dd');

    // Get working day settings and slots
    const { data: workingDay, error: workingDayError } = await supabase
      .from('mr_weekdays')
      .select('*')
      .eq('day', dayName)
      .single();

    if (workingDayError) throw workingDayError;
    if (!workingDay || !workingDay.is_working || !workingDay.slots) return [];

    // Get current bookings
    const { data: bookings, error: bookingsError } = await supabase
      .from('mr_appointments')
      .select('appointment_time')
      .eq('appointment_date', dateStr);

    if (bookingsError) throw bookingsError;

    // Count bookings for each time slot
    const bookingCounts = (bookings || []).reduce((acc, booking) => {
      if (booking.appointment_time) {
        acc[booking.appointment_time] = (acc[booking.appointment_time] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    // Map slots with current bookings
    return workingDay.slots.map((slot: DBTimeSlot) => ({
      time: slot.time,
      maxBookings: slot.maxBookings,
      currentBookings: bookingCounts[slot.time] || 0
    }));
  } catch (error) {
    console.error('Error fetching time slots:', error);
    return [];
  }
} 