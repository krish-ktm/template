import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-hot-toast';
import { Building2, Users, Briefcase, Calendar } from 'lucide-react';
import { format, isToday, isTomorrow, isAfter } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';

interface MRAppointment {
  id: string;
  mr_name: string;
  company_name: string;
  division_name: string;
  contact_no: string;
  appointment_date: string;
  created_at: string;
}

const TIMEZONE = 'Asia/Kolkata';

export function MRAppointmentManager() {
  const [appointments, setAppointments] = useState<MRAppointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      // Get today's date in IST
      const istNow = utcToZonedTime(new Date(), TIMEZONE);
      const todayStr = format(istNow, 'yyyy-MM-dd');

      const { data, error } = await supabase
        .from('mr_appointments')
        .select('*')
        .gte('appointment_date', todayStr)
        .order('appointment_date', { ascending: true });

      if (error) throw error;
      setAppointments(data || []);
    } catch (error) {
      console.error('Error loading MR appointments:', error);
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = utcToZonedTime(new Date(dateStr), TIMEZONE);
    return format(date, 'EEEE, MMMM d, yyyy');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2B5C4B]"></div>
      </div>
    );
  }

  // Group appointments by date category
  const groupedAppointments = appointments.reduce((acc, app) => {
    const appointmentDate = utcToZonedTime(new Date(app.appointment_date), TIMEZONE);
    const today = utcToZonedTime(new Date(), TIMEZONE);
    
    if (isToday(appointmentDate)) {
      if (!acc.today) acc.today = [];
      acc.today.push(app);
    } else if (isTomorrow(appointmentDate)) {
      if (!acc.tomorrow) acc.tomorrow = [];
      acc.tomorrow.push(app);
    } else if (isAfter(appointmentDate, today)) {
      if (!acc.future) acc.future = [];
      acc.future.push(app);
    }
    
    return acc;
  }, { today: [], tomorrow: [], future: [] } as Record<string, MRAppointment[]>);

  const renderAppointmentSection = (title: string, appointments: MRAppointment[]) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="px-6 py-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-[#2B5C4B]/10 p-3 rounded-lg">
              <Calendar className="h-6 w-6 text-[#2B5C4B]" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
              {appointments.length > 0 && (
                <p className="text-gray-500 text-sm mt-0.5">
                  {formatDate(appointments[0].appointment_date)}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 bg-[#2B5C4B]/10 px-4 py-2 rounded-lg">
            <Users className="h-5 w-5 text-[#2B5C4B]" />
            <div>
              <p className="text-sm text-gray-600">Total Appointments</p>
              <p className="text-2xl font-semibold text-[#2B5C4B]">{appointments.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 pb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {appointments.map((appointment) => (
            <div
              key={appointment.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 hover:border-[#2B5C4B]/20 hover:shadow transition-all duration-200"
            >
              <div className="p-5">
                {/* ID */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-400">#{appointment.id.slice(-4)}</span>
                </div>

                {/* MR Info */}
                <div className="flex items-start gap-3 mb-4">
                  <div className="bg-gray-50 p-2 rounded-lg flex-shrink-0">
                    <Users className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{appointment.mr_name}</h3>
                    <p className="text-sm text-gray-500">
                      {appointment.contact_no}
                    </p>
                  </div>
                </div>

                {/* Company Details */}
                <div className="space-y-3 pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-3">
                    <Building2 className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{appointment.company_name}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Briefcase className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{appointment.division_name}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {appointments.length === 0 && (
            <div className="col-span-full">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">No Appointments</h3>
                <p className="text-gray-500">There are no MR appointments scheduled.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 pt-12 sm:pt-0 mt-4 sm:mt-0 px-2 sm:px-0">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-900">MR Appointments</h2>
      </div>

      <div className="space-y-6">
        {/* Today's Appointments */}
        {renderAppointmentSection("Today's Schedule", groupedAppointments.today || [])}

        {/* Tomorrow's Appointments */}
        {renderAppointmentSection("Tomorrow's Schedule", groupedAppointments.tomorrow || [])}

        {/* Future Appointments */}
        {renderAppointmentSection("Future Appointments", groupedAppointments.future || [])}
      </div>
    </div>
  );
}

