import { useState } from 'react';
import { Calendar, Clock, MapPin, Phone, User as UserIcon, MoreVertical, Check, X, Trash2, Eye } from 'lucide-react';
import { BookingDetails } from '../../../types';
import { format } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import { motion, AnimatePresence } from 'framer-motion';
import { AppointmentDetailsModal } from './AppointmentDetailsModal';

interface AppointmentsTableProps {
  appointments: BookingDetails[];
  onStatusUpdate: (id: string, status: 'completed' | 'cancelled') => void;
  onDelete: (id: string) => void;
  actionLoading: string | null;
}

const TIMEZONE = 'Asia/Kolkata';

export function AppointmentsTable({ 
  appointments, 
  onStatusUpdate, 
  onDelete, 
  actionLoading 
}: AppointmentsTableProps) {
  const [openActionMenu, setOpenActionMenu] = useState<string | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [viewingAppointment, setViewingAppointment] = useState<BookingDetails | null>(null);

  const formatTime = (timeStr: string) => {
    return timeStr.replace(/^(\d{1,2}):(\d{2})/, (_, hour, minute) => {
      return `${hour}:${minute}`;
    });
  };

  const formatDate = (dateStr: string) => {
    const date = utcToZonedTime(new Date(dateStr), TIMEZONE);
    return format(date, 'MMM d, yyyy');
  };

  const formatDateTime = (dateStr: string) => {
    const date = utcToZonedTime(new Date(dateStr), TIMEZONE);
    return format(date, 'MMM d, yyyy h:mm a');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'pending':
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const toggleActionMenu = (appointmentId: string, event?: React.MouseEvent) => {
    if (event) {
      const buttonRect = event.currentTarget.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const spaceBelow = viewportHeight - buttonRect.bottom;
      
      if (spaceBelow < 200) {
        setDropdownPosition({
          top: buttonRect.top - 160,
          left: Math.max(buttonRect.right - 200, 10),
        });
      } else {
        setDropdownPosition({
          top: buttonRect.bottom + 5,
          left: Math.max(buttonRect.right - 200, 10),
        });
      }
    }
    
    setOpenActionMenu(openActionMenu === appointmentId ? null : appointmentId);
  };

  if (appointments.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <Calendar className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">No Appointments Found</h3>
        <p className="text-gray-500">No appointments match your current filters.</p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Patient
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Appointment
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Booked On
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {appointments.map((appointment) => (
              <motion.tr
                key={appointment.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="bg-[#2B5C4B]/10 p-2 rounded-lg mr-3">
                      <UserIcon className="h-5 w-5 text-[#2B5C4B]" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{appointment.name}</div>
                      <div className="text-sm text-gray-500">Age: {appointment.age}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 flex items-center gap-1.5 mb-1">
                    <Phone className="h-4 w-4 text-gray-400" />
                    {appointment.phone}
                  </div>
                  <div className="text-sm text-gray-500 flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    {appointment.city}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 flex items-center gap-1.5 mb-1">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    {formatDate(appointment.appointment_date)}
                  </div>
                  <div className="text-sm text-gray-500 flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-gray-400" />
                    {formatTime(appointment.appointment_time)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                    {appointment.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDateTime(appointment.created_at)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="relative">
                    <button
                      onClick={(e) => toggleActionMenu(appointment.id, e)}
                      disabled={actionLoading === appointment.id}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
                    >
                      {actionLoading === appointment.id ? (
                        <div className="w-5 h-5 border-2 border-gray-300 border-t-[#2B5C4B] rounded-full animate-spin" />
                      ) : (
                        <MoreVertical className="h-5 w-5 text-gray-500" />
                      )}
                    </button>
                    
                    {openActionMenu === appointment.id && (
                      <>
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => setOpenActionMenu(null)}
                        />
                        <div 
                          className="fixed w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50"
                          style={{
                            top: `${dropdownPosition.top}px`,
                            left: `${dropdownPosition.left}px`
                          }}
                        >
                          <div className="py-1" role="menu">
                            <button
                              onClick={() => {
                                setViewingAppointment(appointment);
                                setOpenActionMenu(null);
                              }}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                            >
                              <Eye className="h-4 w-4" />
                              View Details
                            </button>
                            {appointment.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => {
                                    onStatusUpdate(appointment.id, 'completed');
                                    setOpenActionMenu(null);
                                  }}
                                  className="w-full text-left px-4 py-2 text-sm text-green-700 hover:bg-green-50 flex items-center gap-2"
                                >
                                  <Check className="h-4 w-4" />
                                  Mark Complete
                                </button>
                                <button
                                  onClick={() => {
                                    onStatusUpdate(appointment.id, 'cancelled');
                                    setOpenActionMenu(null);
                                  }}
                                  className="w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50 flex items-center gap-2"
                                >
                                  <X className="h-4 w-4" />
                                  Cancel
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => {
                                onDelete(appointment.id);
                                setOpenActionMenu(null);
                              }}
                              className="w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50 flex items-center gap-2"
                            >
                              <Trash2 className="h-4 w-4" />
                              Delete
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden space-y-4 p-4">
        {appointments.map((appointment) => (
          <motion.div
            key={appointment.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-3">
                <div className="bg-[#2B5C4B]/10 p-2 rounded-lg">
                  <UserIcon className="h-5 w-5 text-[#2B5C4B]" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{appointment.name}</h3>
                  <p className="text-sm text-gray-500">Age: {appointment.age}</p>
                </div>
              </div>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                {appointment.status}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone className="h-4 w-4 text-gray-400" />
                {appointment.phone}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4 text-gray-400" />
                {appointment.city}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4 text-gray-400" />
                {formatDate(appointment.appointment_date)}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="h-4 w-4 text-gray-400" />
                {formatTime(appointment.appointment_time)}
              </div>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-gray-100">
              <span className="text-xs text-gray-500">
                Booked: {formatDateTime(appointment.created_at)}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewingAppointment(appointment)}
                  className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                  title="View Details"
                >
                  <Eye className="h-4 w-4" />
                </button>
                {appointment.status === 'pending' && (
                  <>
                    <button
                      onClick={() => onStatusUpdate(appointment.id, 'completed')}
                      disabled={actionLoading === appointment.id}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
                      title="Mark Complete"
                    >
                      {actionLoading === appointment.id ? (
                        <div className="w-4 h-4 border-2 border-green-300 border-t-green-600 rounded-full animate-spin" />
                      ) : (
                        <Check className="h-4 w-4" />
                      )}
                    </button>
                    <button
                      onClick={() => onStatusUpdate(appointment.id, 'cancelled')}
                      disabled={actionLoading === appointment.id}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                      title="Cancel"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </>
                )}
                <button
                  onClick={() => onDelete(appointment.id)}
                  disabled={actionLoading === appointment.id}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Appointment Details Modal */}
      <AnimatePresence>
        {viewingAppointment && (
          <AppointmentDetailsModal
            appointment={viewingAppointment}
            onClose={() => setViewingAppointment(null)}
            onStatusUpdate={onStatusUpdate}
            onDelete={onDelete}
            actionLoading={actionLoading}
          />
        )}
      </AnimatePresence>
    </>
  );
}