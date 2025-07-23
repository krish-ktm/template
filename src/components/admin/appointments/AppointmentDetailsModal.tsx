import { motion } from 'framer-motion';
import { X, Calendar, Clock, User, Phone, MapPin, Check, Trash2, Hash } from 'lucide-react';
import { BookingDetails } from '../../../types';
import { format } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';

const TIMEZONE = 'Asia/Kolkata';

interface AppointmentDetailsModalProps {
  appointment: BookingDetails;
  onClose: () => void;
  onStatusUpdate: (id: string, status: 'completed' | 'cancelled') => void;
  onDelete: (id: string) => void;
  actionLoading: string | null;
}

export function AppointmentDetailsModal({
  appointment,
  onClose,
  onStatusUpdate,
  onDelete,
  actionLoading
}: AppointmentDetailsModalProps) {
  const formatDate = (dateStr: string) => {
    const date = utcToZonedTime(new Date(dateStr), TIMEZONE);
    return format(date, 'EEEE, MMMM d, yyyy');
  };

  const formatDateTime = (dateStr: string) => {
    const date = utcToZonedTime(new Date(dateStr), TIMEZONE);
    return format(date, 'MMM d, yyyy h:mm a');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'pending':
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-auto overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#2B5C4B] to-[#234539] px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/10 p-2 rounded-lg">
                <User className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">Appointment Details</h3>
                <p className="text-white/80 text-sm">#{appointment.id.slice(-8).toUpperCase()}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-white" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status */}
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-medium text-gray-900">Current Status</h4>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(appointment.status)}`}>
              {appointment.status}
            </span>
          </div>

          {/* Patient Information */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-base font-medium text-gray-900 mb-4">Patient Information</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="bg-[#2B5C4B]/10 p-2 rounded-lg">
                  <User className="h-5 w-5 text-[#2B5C4B]" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Name</p>
                  <p className="text-sm font-medium text-gray-900">{appointment.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-[#2B5C4B]/10 p-2 rounded-lg">
                  <Hash className="h-5 w-5 text-[#2B5C4B]" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Age</p>
                  <p className="text-sm font-medium text-gray-900">{appointment.age} years</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-[#2B5C4B]/10 p-2 rounded-lg">
                  <Phone className="h-5 w-5 text-[#2B5C4B]" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Phone</p>
                  <p className="text-sm font-medium text-gray-900">{appointment.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-[#2B5C4B]/10 p-2 rounded-lg">
                  <MapPin className="h-5 w-5 text-[#2B5C4B]" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">City</p>
                  <p className="text-sm font-medium text-gray-900">{appointment.city}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Appointment Information */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-base font-medium text-gray-900 mb-4">Appointment Information</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="bg-[#2B5C4B]/10 p-2 rounded-lg">
                  <Calendar className="h-5 w-5 text-[#2B5C4B]" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Date</p>
                  <p className="text-sm font-medium text-gray-900">{formatDate(appointment.appointment_date)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-[#2B5C4B]/10 p-2 rounded-lg">
                  <Clock className="h-5 w-5 text-[#2B5C4B]" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Time</p>
                  <p className="text-sm font-medium text-gray-900">{appointment.appointment_time}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Information */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-base font-medium text-gray-900 mb-2">Booking Information</h4>
            <p className="text-sm text-gray-600">
              Booked on: {formatDateTime(appointment.created_at)}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="border-t border-gray-200 px-6 py-4">
          <div className="flex flex-col sm:flex-row gap-3 justify-end">
            {appointment.status === 'pending' && (
              <>
                <button
                  onClick={() => onStatusUpdate(appointment.id, 'completed')}
                  disabled={actionLoading === appointment.id}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {actionLoading === appointment.id ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Check className="h-4 w-4" />
                  )}
                  Mark Complete
                </button>
                <button
                  onClick={() => onStatusUpdate(appointment.id, 'cancelled')}
                  disabled={actionLoading === appointment.id}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </button>
              </>
            )}
            <button
              onClick={() => onDelete(appointment.id)}
              disabled={actionLoading === appointment.id}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}