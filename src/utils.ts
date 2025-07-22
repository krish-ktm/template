import { TimeSlot } from './types';
import { supabase } from './lib/supabase';
import { startOfToday, addDays, format, parse, isToday, isTomorrow, isAfter, isBefore } from 'date-fns';
import { zonedTimeToUtc, utcToZonedTime } from 'date-fns-tz';

const TIMEZONE = 'Asia/Kolkata';

// Helper function to convert 24h time to 12h format
const to12HourFormat = (time24: string): string => {
  const [hours, minutes] = time24.split(':');
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
};

// Helper function to convert 12h time to 24h format
const to24HourFormat = (time12: string): string => {
  const [time, period] = time12.split(' ');
  let [hours, minutes] = time.split(':');
  let hour = parseInt(hours, 10);
  
  if (period.toUpperCase() === 'PM' && hour !== 12) {
    hour += 12;
  } else if (period.toUpperCase() === 'AM' && hour === 12) {
    hour = 0;
  }
  
  return `${hour.toString().padStart(2, '0')}:${minutes}`;
};

// Check if a date is a closure date
const isClosureDate = async (date: string): Promise<{ isClosed: boolean; reason?: string }> => {
  try {
    const { data, error } = await supabase
      .from('clinic_closure_dates')
      .select('reason')
      .eq('date', date);

    if (error) {
      console.error('Error checking closure date:', error);
      return { isClosed: false };
    }

    // If we have data and at least one row, the date is a closure date
    if (data && data.length > 0) {
      return {
        isClosed: true,
        reason: data[0].reason
      };
    }

    return { isClosed: false };
  } catch (error) {
    console.error('Error checking closure date:', error);
    return { isClosed: false };
  }
};

// Cache invalidation for time slots
const invalidateTimeSlots = () => {
  // This function would be called when working hours are updated
  // For now it's a placeholder as we don't have client-side caching yet
  console.log('Time slots cache invalidated');
};

// Improved time slots generation with retries
export const generateTimeSlots = async (date: string, retries = 3): Promise<TimeSlot[]> => {
  try {
    // First check if it's a closure date
    const { isClosed } = await isClosureDate(date);
    if (isClosed) {
      return [];
    }

    // Get working hours for the selected date
    const selectedDate = utcToZonedTime(new Date(date), TIMEZONE);
    const dayName = format(selectedDate, 'EEEE');

    const { data: workingHours, error } = await supabase
      .from('working_hours')
      .select('*')
      .eq('day', dayName)
      .single();

    if (error) throw error;
    
    // If the day is not configured or not working, return empty slots
    if (!workingHours || !workingHours.is_working || !workingHours.slots) {
      return [];
    }

    // Get current time in IST
    const istNow = utcToZonedTime(new Date(), TIMEZONE);
    
    // Parse and convert selected date to IST
    const parsedDate = parse(date, 'yyyy-MM-dd', new Date());
    const selectedDateInIST = utcToZonedTime(parsedDate, TIMEZONE);
    
    // Check if selected date is today
    const isSelectedToday = isToday(selectedDateInIST);

    // Convert slots from database to TimeSlot array
    let slots: TimeSlot[] = workingHours.slots.map(slot => ({
      time: slot.time,
      maxBookings: slot.maxBookings,
      currentBookings: 0
    }));

    // Get current bookings for each time slot
    const { data: bookings, error: bookingsError } = await supabase
      .from('appointments')
      .select('appointment_time')
      .eq('appointment_date', date)
      .eq('status', 'pending');

    if (bookingsError) throw bookingsError;

    // Count bookings for each time slot
    const bookingCounts = (bookings || []).reduce((acc, booking) => {
      acc[booking.appointment_time] = (acc[booking.appointment_time] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Update slots with current bookings and apply time restrictions
    slots = slots.map(slot => ({
      time: slot.time,
      maxBookings: slot.maxBookings,
      currentBookings: bookingCounts[slot.time] || 0
    }));

    // Apply time restrictions for today's slots
    if (isSelectedToday) {
      slots = slots.filter(slot => {
        // Convert 12h time to 24h for comparison
        const time24h = to24HourFormat(slot.time);
        // Combine date and time for accurate comparison
        const slotDateTime = parse(`${date} ${time24h}`, 'yyyy-MM-dd HH:mm', new Date());
        const slotTimeInIST = utcToZonedTime(slotDateTime, TIMEZONE);
        
        // Block past time slots
        if (isBefore(slotTimeInIST, istNow)) {
          return false;
        }

        // Rule 1: At 9 AM IST, block all morning slots (9:30 AM to 12 PM)
        if (istNow.getHours() >= 9 && slotTimeInIST.getHours() <= 12) {
          return false;
        }

        // Rule 2: At 1 PM IST, block all evening slots (4 PM to 6:30 PM)
        if (istNow.getHours() >= 13) {
          return false;
        }

        return true;
      });
    }

    return slots;
  } catch (error) {
    console.error('Error generating time slots:', error);
    if (retries > 0) {
      // Wait for 1 second before retrying
      await new Promise(resolve => setTimeout(resolve, 1000));
      return generateTimeSlots(date, retries - 1);
    }
    return [];
  }
};

export const validateBookingRequest = async (
  name: string,
  phone: string,
  date: string,
  timeSlot: string
): Promise<{ isValid: boolean; error?: string }> => {
  try {
    // Basic validation
    if (!date) {
      return { isValid: false, error: 'Please select a date' };
    }

    if (!timeSlot) {
      return { isValid: false, error: 'Please select a time slot' };
    }

    // Validate phone number (10 digits)
    if (!/^\d{10}$/.test(phone)) {
      return { isValid: false, error: 'Please enter a valid 10-digit phone number' };
    }

    // Check if it's a closure date
    const { isClosed, reason } = await isClosureDate(date);
    if (isClosed) {
      return { isValid: false, error: `The clinic is closed on this date${reason ? `: ${reason}` : ''}` };
    }

    // Parse and convert to IST
    const parsedDate = parse(date, 'yyyy-MM-dd', new Date());
    const selectedDate = utcToZonedTime(parsedDate, TIMEZONE);
    const dayName = format(selectedDate, 'EEEE');

    // Check if the clinic is working on this day
    const { data: workingHours, error: workingHoursError } = await supabase
      .from('working_hours')
      .select('is_working, slots')
      .eq('day', dayName)
      .single();

    if (workingHoursError) throw workingHoursError;

    // Check working hours configuration
    if (!workingHours || !workingHours.is_working || !workingHours.slots) {
      return { isValid: false, error: 'The clinic is closed on this day' };
    }

    // Check if the selected time slot exists and has available bookings
    const selectedSlot = workingHours.slots.find(slot => slot.time === timeSlot);
    
    if (!selectedSlot) {
      return { isValid: false, error: 'Invalid time slot selected' };
    }

    // Get current bookings for this slot
    const { data: bookings, error: bookingsError } = await supabase
      .from('appointments')
      .select('id')
      .eq('appointment_date', date)
      .eq('appointment_time', timeSlot)
      .eq('status', 'pending');

    if (bookingsError) throw bookingsError;

    const currentBookings = bookings?.length || 0;
    if (currentBookings >= selectedSlot.maxBookings) {
      return { isValid: false, error: 'This time slot is fully booked' };
    }

    // -------------------------------------------------------
    // Duplicate appointment guard (Name + Phone combination)
    // -------------------------------------------------------
    // Users should only be able to hold ONE future / same-day appointment
    // at a time for a given (name, phone) pair. They may book again once
    // that appointment is in the past (relative to today in IST).

    const today = startOfToday();
    const todayIST = utcToZonedTime(today, TIMEZONE);
    const todayStr = format(todayIST, 'yyyy-MM-dd');

    const { data: duplicateRows, error: duplicateError } = await supabase
      .from('appointments')
      .select('id')
      .eq('name', name.trim())
      .eq('phone', phone)
      .gte('appointment_date', todayStr); // status is always confirmed by default

    if (duplicateError) throw duplicateError;

    if (duplicateRows && duplicateRows.length > 0) {
      return { isValid: false, error: 'You already have an upcoming appointment. You can book another once that appointment date has passed.' };
    }
 
    return { isValid: true };
  } catch (error) {
    console.error('Error in validateBookingRequest:', error);
    return { isValid: false, error: 'An unexpected error occurred. Please try again later' };
  }
};
