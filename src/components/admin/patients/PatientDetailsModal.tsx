import { motion } from 'framer-motion';
import { X, Calendar, Mail, Phone, User, MapPin, Edit, Trash2, Clipboard, FileText } from 'lucide-react';
import { Patient } from '../../../types';
import { format } from 'date-fns';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

interface PatientDetailsModalProps {
  patient: Patient;
  onClose: () => void;
  onEdit: () => void;
  onDelete: (id: string) => void;
  actionLoading: string | null;
}

export function PatientDetailsModal({
  patient,
  onClose,
  onEdit,
  onDelete,
  actionLoading
}: PatientDetailsModalProps) {
  const [showCopiedMessage, setShowCopiedMessage] = useState(false);

  const formatDate = (dateStr: string) => {
    return format(new Date(dateStr), 'MMM d, yyyy h:mm a');
  };

  const handleCopyPatientId = () => {
    navigator.clipboard.writeText(patient.id);
    setShowCopiedMessage(true);
    setTimeout(() => setShowCopiedMessage(false), 2000);
    toast.success('Patient ID copied to clipboard');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-xl shadow-xl overflow-hidden w-full max-w-2xl max-h-[90vh] flex flex-col"
      >
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">Patient Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6">
          {/* Patient ID with copy button */}
          <div className="bg-gray-50 px-4 py-3 rounded-lg mb-6 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Patient ID: <span className="font-mono">{patient.id}</span>
            </div>
            <div className="relative">
              <button
                onClick={handleCopyPatientId}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                title="Copy ID"
              >
                <Clipboard className="h-4 w-4" />
              </button>
              {showCopiedMessage && (
                <div className="absolute right-0 -top-8 bg-gray-800 text-white text-xs px-2 py-1 rounded">
                  Copied!
                </div>
              )}
            </div>
          </div>

          {/* Basic Info */}
          <div className="mb-8">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
              Basic Information
            </h3>
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-gray-200">
                <div className="p-4 flex items-start gap-3">
                  <User className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <div className="text-sm font-medium text-gray-900 mb-1">Name</div>
                    <div className="text-sm text-gray-500">
                      {patient.first_name} {patient.last_name}
                    </div>
                  </div>
                </div>
                <div className="p-4 flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <div className="text-sm font-medium text-gray-900 mb-1">Demographics</div>
                    <div className="text-sm text-gray-500">
                      {patient.gender ? `${patient.gender}, ` : ''}
                      {patient.age ? `${patient.age} years old` : 'Age not specified'}
                    </div>
                  </div>
                </div>
              </div>
              <div className="border-t border-gray-200">
                <div className="p-4 flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <div className="text-sm font-medium text-gray-900 mb-1">Address</div>
                    <div className="text-sm text-gray-500">
                      {patient.address || 'No address provided'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Contact Info */}
          <div className="mb-8">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
              Contact Information
            </h3>
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-gray-200">
                <div className="p-4 flex items-start gap-3">
                  <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <div className="text-sm font-medium text-gray-900 mb-1">Phone Number</div>
                    <div className="text-sm text-gray-500">
                      {patient.phone_number}
                    </div>
                  </div>
                </div>
                <div className="p-4 flex items-start gap-3">
                  <Mail className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <div className="text-sm font-medium text-gray-900 mb-1">Email Address</div>
                    <div className="text-sm text-gray-500">
                      {patient.email || 'No email provided'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Medical History */}
          <div className="mb-8">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
              Medical History
            </h3>
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden p-4">
              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <div className="text-sm text-gray-500 whitespace-pre-wrap">
                    {patient.medical_history || 'No medical history recorded'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Registration Info */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
              Registration Information
            </h3>
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-gray-200">
                <div className="p-4">
                  <div className="text-sm font-medium text-gray-900 mb-1">Created On</div>
                  <div className="text-sm text-gray-500">{formatDate(patient.created_at)}</div>
                </div>
                <div className="p-4">
                  <div className="text-sm font-medium text-gray-900 mb-1">Last Updated</div>
                  <div className="text-sm text-gray-500">{formatDate(patient.updated_at)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 px-6 py-4 flex justify-between items-center border-t border-gray-200">
          <div>
            <button
              onClick={() => onDelete(patient.id)}
              disabled={actionLoading === patient.id}
              className="inline-flex items-center px-4 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 disabled:opacity-50"
            >
              {actionLoading === patient.id ? (
                <div className="w-4 h-4 mr-2 border-2 border-red-300 border-t-red-600 rounded-full animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4 mr-2" />
              )}
              Delete Patient
            </button>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Close
            </button>
            <button
              onClick={onEdit}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#2B5C4B] hover:bg-[#224839]"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Patient
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
} 