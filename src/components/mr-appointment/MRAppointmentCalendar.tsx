import { useState, useEffect } from 'react';
import { addMonths, format } from 'date-fns';
import { supabase } from '../../lib/supabase';
import { MobileCalendar } from './calendar/MobileCalendar';
import { DesktopCalendar } from './calendar/DesktopCalendar';
import { useTranslation } from '../../i18n/useTranslation';

interface MRAppointmentCalendarProps {
  selectedDate: Date | null;
  onDateChange: (date: Date | null) => void;
}

export function MRAppointmentCalendar({ selectedDate, onDateChange }: MRAppointmentCalendarProps) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [workingDaysMap, setWorkingDaysMap] = useState<{ [key: string]: number }>({});
  const [dateBookings, setDateBookings] = useState<Record<string, { current: number; max: number }>>({});
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [mrClosureDates, setMRClosureDates] = useState<string[]>([]);
  const [clinicClosureDates, setClinicClosureDates] = useState<string[]>([]);
  
  const today = new Date();
  const twoMonthsLater = addMonths(today, 2);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    setLoading(true);
    Promise.all([loadClosureDates(), loadWorkingDays()])
      .finally(() => setLoading(false));

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const loadClosureDates = async () => {
    try {
      const [mrResponse, clinicResponse] = await Promise.all([
        supabase
          .from('mr_closure_dates')
          .select('date')
          .gte('date', format(new Date(), 'yyyy-MM-dd')),
        supabase
          .from('clinic_closure_dates')
          .select('date')
          .gte('date', format(new Date(), 'yyyy-MM-dd'))
      ]);

      if (mrResponse.error) throw mrResponse.error;
      if (clinicResponse.error) throw clinicResponse.error;

      setMRClosureDates((mrResponse.data || []).map(d => d.date));
      setClinicClosureDates((clinicResponse.data || []).map(d => d.date));
    } catch (error) {
      console.error('Error loading closure dates:', error);
    }
  };

  const loadWorkingDays = async () => {
    try {
      const { data, error } = await supabase
        .from('mr_weekdays')
        .select('day, is_working, slots');

      if (error) throw error;
      
      const workingDays = data?.reduce((acc, day) => {
        if (day.is_working && day.slots && day.slots.length > 0) {
          // Calculate the total capacity across all slots
          const totalCapacity = day.slots.reduce((sum: number, slot: { maxBookings: number }) => 
            sum + slot.maxBookings, 0);
          acc[day.day] = totalCapacity;
        }
        return acc;
      }, {} as { [key: string]: number });
      
      setWorkingDaysMap(workingDays || {});

      const { data: bookings, error: bookingsError } = await supabase
        .from('mr_appointments')
        .select('appointment_date')
        .gte('appointment_date', format(today, 'yyyy-MM-dd'))
        .lt('appointment_date', format(twoMonthsLater, 'yyyy-MM-dd'))
        .eq('status', 'pending');

      if (bookingsError) throw bookingsError;

      const bookingCounts = (bookings || []).reduce((acc, booking) => {
        acc[booking.appointment_date] = (acc[booking.appointment_date] || 0) + 1;
        return acc;
      }, {} as { [key: string]: number });

      const newDateBookings: Record<string, { current: number; max: number }> = {};
      let currentDate = today;
      
      while (currentDate < twoMonthsLater) {
        const dayName = format(currentDate, 'EEEE');
        const dateStr = format(currentDate, 'yyyy-MM-dd');
        const totalCapacity = workingDays?.[dayName] || 0;
        
        if (totalCapacity > 0) {
          newDateBookings[dateStr] = {
            current: bookingCounts[dateStr] || 0,
            max: totalCapacity
          };
        }
        
        currentDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);
      }

      setDateBookings(newDateBookings);
    } catch (error) {
      console.error('Error loading working days:', error);
    }
  };

  const isDateDisabled = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const dayName = format(date, 'EEEE');
    
    return (
      mrClosureDates.includes(dateStr) ||
      clinicClosureDates.includes(dateStr) ||
      !workingDaysMap[dayName]
    );
  };

  const maxDate = twoMonthsLater;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return isMobile ? (
    <MobileCalendar
      selectedDate={selectedDate}
      onDateChange={onDateChange}
      isDateDisabled={isDateDisabled}
      dateBookings={dateBookings}
      maxDate={maxDate}
      t={t.mrAppointment.form}
    />
  ) : (
    <DesktopCalendar
      selectedDate={selectedDate}
      onDateChange={onDateChange}
      isDateDisabled={isDateDisabled}
      dateBookings={dateBookings}
      maxDate={maxDate}
      t={t.mrAppointment.form}
    />
  );
}