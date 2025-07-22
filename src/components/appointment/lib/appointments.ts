import { supabase } from '../../../lib/supabase';
import { BookingDetails } from '../../../types';
import { startOfToday, addDays, format, isToday, isTomorrow } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';

const TIMEZONE = 'Asia/Kolkata';

export async function getTodayAndTomorrowAppointments(): Promise<{ appointments: BookingDetails[]; error: string | null }> {
  try {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      throw new Error('Authentication required');
    }

    // Get today's and tomorrow's date in IST
    const istToday = startOfToday();
    const istTomorrow = addDays(istToday, 1);

    const todayStr = format(istToday, 'yyyy-MM-dd');
    const tomorrowStr = format(istTomorrow, 'yyyy-MM-dd');
    
    const { data: appointments, error } = await supabase
      .from('appointments')
      .select('*')
      .in('appointment_date', [todayStr, tomorrowStr])
      .order('appointment_date', { ascending: true })
      .order('appointment_time', { ascending: true });

    if (error) throw new Error(error.message);
    
    // Sort appointments by date and time
    const sortedAppointments = appointments?.sort((a, b) => {
      const dateCompare = a.appointment_date.localeCompare(b.appointment_date);
      if (dateCompare !== 0) return dateCompare;
      
      const timeA = new Date(`1970/01/01 ${a.appointment_time}`).getTime();
      const timeB = new Date(`1970/01/01 ${b.appointment_time}`).getTime();
      return timeA - timeB;
    }) || [];

    // Map appointments to correct "today" and "tomorrow" based on IST
    const mappedAppointments = sortedAppointments.map(appointment => {
      const appointmentDate = utcToZonedTime(new Date(appointment.appointment_date), TIMEZONE);
      const isAppointmentToday = isToday(appointmentDate);
      const isAppointmentTomorrow = isTomorrow(appointmentDate);

      return {
        ...appointment,
        is_today: isAppointmentToday,
        is_tomorrow: isAppointmentTomorrow
      };
    });

    return { appointments: mappedAppointments as BookingDetails[], error: null };
  } catch (error: unknown) {
    console.error('Error fetching appointments:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return { appointments: [], error: errorMessage };
  }
} 