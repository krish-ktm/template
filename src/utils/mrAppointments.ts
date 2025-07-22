import { supabase } from '../lib/supabase';
import { startOfToday, format, isBefore } from 'date-fns';

export async function validateMRAppointment(date: Date): Promise<{ isValid: boolean; error?: string }> {
  try {
    const dateStr = format(date, 'yyyy-MM-dd');
    const dayName = format(date, 'EEEE');
    const today = startOfToday();

    // Check if date is in the past
    if (isBefore(date, today)) {
      return { isValid: false, error: 'Cannot book appointments for past dates' };
    }

    // Batch our database queries
    const [workingDayResponse, mrClosureDateResponse, clinicClosureDateResponse] = await Promise.all([
      // Get working day settings
      supabase
        .from('mr_weekdays')
        .select('is_working, slots')
        .eq('day', dayName)
        .single(),
      
      // Check MR closure dates
      supabase
        .from('mr_closure_dates')
        .select('reason')
        .eq('date', dateStr)
        .maybeSingle(),

      // Check clinic closure dates
      supabase
        .from('clinic_closure_dates')
        .select('reason')
        .eq('date', dateStr)
        .maybeSingle(),
    ]);

    // Handle working day settings
    if (workingDayResponse.error || !workingDayResponse.data || !workingDayResponse.data.is_working) {
      return { isValid: false, error: 'Appointments are not available on this day' };
    }

    // Handle MR closure dates
    if (mrClosureDateResponse.error) {
      console.error('Error checking MR closure date:', mrClosureDateResponse.error);
      return { isValid: false, error: 'Error checking closure dates' };
    }

    if (mrClosureDateResponse.data) {
      return { 
        isValid: false, 
        error: `Appointments are not available on this date${mrClosureDateResponse.data.reason ? `: ${mrClosureDateResponse.data.reason}` : ''}`
      };
    }

    // Handle clinic closure dates
    if (clinicClosureDateResponse.error) {
      console.error('Error checking clinic closure date:', clinicClosureDateResponse.error);
      return { isValid: false, error: 'Error checking clinic closure dates' };
    }

    if (clinicClosureDateResponse.data) {
      return { 
        isValid: false, 
        error: `Clinic is closed on this date${clinicClosureDateResponse.data.reason ? `: ${clinicClosureDateResponse.data.reason}` : ''}`
      };
    }

    // If no slots are configured, the day is not available
    if (!workingDayResponse.data.slots || workingDayResponse.data.slots.length === 0) {
      return { isValid: false, error: 'No time slots available on this day' };
    }

    // Check if at least one slot is available
    const { data: bookings, error: bookingsError } = await supabase
      .from('mr_appointments')
      .select('appointment_time')
      .eq('appointment_date', dateStr)
      .eq('status', 'pending');

    if (bookingsError) {
      console.error('Error checking existing appointments:', bookingsError);
      return { isValid: false, error: 'Error checking existing appointments' };
    }

    // Count bookings per slot
    const bookingCounts = (bookings || []).reduce((acc, booking) => {
      if (booking.appointment_time) {
        acc[booking.appointment_time] = (acc[booking.appointment_time] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    // Check if any slot has available capacity
    const availableSlot = workingDayResponse.data.slots.some((slot: { time: string, maxBookings: number }) => {
      const currentBookings = bookingCounts[slot.time] || 0;
      return currentBookings < slot.maxBookings;
    });

    if (!availableSlot) {
      return { isValid: false, error: 'All time slots are fully booked for this date' };
    }

    // All checks passed
    return { isValid: true };
  } catch (error) {
    console.error('Error validating MR appointment:', error);
    return { isValid: false, error: 'An error occurred while validating the appointment' };
  }
}