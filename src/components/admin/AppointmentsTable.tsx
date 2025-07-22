import { Calendar, Clock, MapPin, Phone, User as UserIcon } from 'lucide-react';
import { BookingDetails } from '../../types';
import { format, isToday } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';

interface AppointmentsTableProps {
  appointments: BookingDetails[];
}

const TIMEZONE = 'Asia/Kolkata';

export function AppointmentsTable({ appointments }: AppointmentsTableProps) {
  const formatTime = (timeStr: string) => {
    return timeStr.replace(/^(\d{1,2}):(\d{2})/, (_, hour, minute) => {
      return `${hour}:${minute}`;
    });
  };

  const formatDate = (dateStr: string) => {
    const date = utcToZonedTime(new Date(dateStr), TIMEZONE);
    return format(date, 'EEEE, MMMM d, yyyy');
  };

  // Get the date from the first appointment, or use current date if no appointments
  const getDisplayDate = () => {
    if (appointments.length === 0) return new Date();
    return utcToZonedTime(new Date(appointments[0].appointment_date), TIMEZONE);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-[#2B5C4B]/10 p-3 rounded-lg">
                <Calendar className="h-6 w-6 text-[#2B5C4B]" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {isToday(getDisplayDate()) ? "Today's Schedule" : "Tomorrow's Schedule"}
                </h2>
                <p className="text-gray-500 text-sm mt-0.5">
                  {formatDate(getDisplayDate().toISOString())}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-[#2B5C4B]/10 px-4 py-2 rounded-lg">
              <Clock className="h-5 w-5 text-[#2B5C4B]" />
              <div>
                <p className="text-sm text-gray-600">Total Appointments</p>
                <p className="text-2xl font-semibold text-[#2B5C4B]">{appointments.length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Appointments Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {appointments.map((appointment) => (
          <div
            key={appointment.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 hover:border-[#2B5C4B]/20 hover:shadow transition-all duration-200"
          >
            <div className="p-5">
              {/* Time and ID */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 bg-[#2B5C4B]/10 px-3 py-1.5 rounded-lg">
                  <Clock className="h-4 w-4 text-[#2B5C4B]" />
                  <span className="font-medium text-[#2B5C4B]">{formatTime(appointment.appointment_time)}</span>
                </div>
                <span className="text-sm text-gray-400">#{appointment.id.slice(-4)}</span>
              </div>

              {/* Patient Info */}
              <div className="flex items-start gap-3 mb-4">
                <div className="bg-gray-50 p-2 rounded-lg flex-shrink-0">
                  <UserIcon className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{appointment.name}</h3>
                  <p className="text-sm text-gray-500">
                    Age: {appointment.age} years
                  </p>
                </div>
              </div>

              {/* Contact Details */}
              <div className="space-y-3 pt-3 border-t border-gray-100">
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{appointment.phone}</span>
                </div>

                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{appointment.city}</span>
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
              <p className="text-gray-500">There are no appointments scheduled for {isToday(getDisplayDate()) ? 'today' : 'tomorrow'}.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}