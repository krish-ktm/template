import { useState } from 'react';
import { Calendar, Mail, Phone, User as UserIcon, MoreVertical, Edit, Trash2, Eye, Map } from 'lucide-react';
import { Patient } from '../../../types';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { PatientDetailsModal } from './PatientDetailsModal';

interface PatientsTableProps {
  patients: Patient[];
  onUpdate: (id: string, updatedData: Partial<Patient>) => void;
  onDelete: (id: string) => void;
  actionLoading: string | null;
}

export function PatientsTable({ 
  patients, 
  onUpdate, 
  onDelete, 
  actionLoading 
}: PatientsTableProps) {
  const [openActionMenu, setOpenActionMenu] = useState<string | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [viewingPatient, setViewingPatient] = useState<Patient | null>(null);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);

  const formatDateTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return format(date, 'MMM d, yyyy h:mm a');
  };

  const toggleActionMenu = (patientId: string, event?: React.MouseEvent) => {
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
    
    setOpenActionMenu(openActionMenu === patientId ? null : patientId);
  };

  const getGenderBadgeColor = (gender: string | null) => {
    if (!gender) return 'bg-gray-100 text-gray-800';
    
    switch (gender.toLowerCase()) {
      case 'male':
        return 'bg-blue-100 text-blue-800';
      case 'female':
        return 'bg-pink-100 text-pink-800';
      default:
        return 'bg-purple-100 text-purple-800';
    }
  };

  if (patients.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <UserIcon className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">No Patients Found</h3>
        <p className="text-gray-500">No patients match your current filters.</p>
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
                Demographics
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Added On
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {patients.map((patient) => (
              <motion.tr
                key={patient.id}
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
                      <div className="text-sm font-medium text-gray-900">
                        {patient.first_name} {patient.last_name}
                      </div>
                      <div className="text-sm text-gray-500">ID: {patient.id.split('-')[0]}...</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 flex items-center gap-1.5 mb-1">
                    <Phone className="h-4 w-4 text-gray-400" />
                    {patient.phone_number}
                  </div>
                  {patient.email && (
                    <div className="text-sm text-gray-500 flex items-center gap-1.5">
                      <Mail className="h-4 w-4 text-gray-400" />
                      {patient.email}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 flex items-center gap-1.5 mb-1">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getGenderBadgeColor(patient.gender)}`}>
                      {patient.gender || 'Unknown'}
                    </span>
                    {patient.age && <span className="text-gray-500">Age: {patient.age}</span>}
                  </div>
                  {patient.address && (
                    <div className="text-sm text-gray-500 flex items-center gap-1.5">
                      <Map className="h-4 w-4 text-gray-400" />
                      {patient.address.substring(0, 30)}{patient.address.length > 30 ? '...' : ''}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDateTime(patient.created_at)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="relative">
                    <button
                      onClick={(e) => toggleActionMenu(patient.id, e)}
                      disabled={actionLoading === patient.id}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
                    >
                      {actionLoading === patient.id ? (
                        <div className="w-5 h-5 border-2 border-gray-300 border-t-[#2B5C4B] rounded-full animate-spin" />
                      ) : (
                        <MoreVertical className="h-5 w-5 text-gray-500" />
                      )}
                    </button>
                    
                    {openActionMenu === patient.id && (
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
                                setViewingPatient(patient);
                                setOpenActionMenu(null);
                              }}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                            >
                              <Eye className="h-4 w-4" />
                              View Details
                            </button>
                            <button
                              onClick={() => {
                                setEditingPatient(patient);
                                setOpenActionMenu(null);
                              }}
                              className="w-full text-left px-4 py-2 text-sm text-blue-700 hover:bg-blue-50 flex items-center gap-2"
                            >
                              <Edit className="h-4 w-4" />
                              Edit Patient
                            </button>
                            <button
                              onClick={() => {
                                onDelete(patient.id);
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
        {patients.map((patient) => (
          <motion.div
            key={patient.id}
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
                  <h3 className="font-medium text-gray-900">
                    {patient.first_name} {patient.last_name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getGenderBadgeColor(patient.gender)}`}>
                      {patient.gender || 'Unknown'}
                    </span>
                    {patient.age && <span className="ml-2">Age: {patient.age}</span>}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone className="h-4 w-4 text-gray-400" />
                {patient.phone_number}
              </div>
              {patient.email && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="h-4 w-4 text-gray-400" />
                  {patient.email}
                </div>
              )}
              {patient.address && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Map className="h-4 w-4 text-gray-400" />
                  {patient.address.substring(0, 40)}{patient.address.length > 40 ? '...' : ''}
                </div>
              )}
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4 text-gray-400" />
                Added on: {formatDateTime(patient.created_at)}
              </div>
            </div>

            <div className="flex justify-end items-center pt-3 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewingPatient(patient)}
                  className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                  title="View Details"
                >
                  <Eye className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setEditingPatient(patient)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Edit Patient"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onDelete(patient.id)}
                  disabled={actionLoading === patient.id}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                  title="Delete"
                >
                  {actionLoading === patient.id ? (
                    <div className="w-4 h-4 border-2 border-red-300 border-t-red-600 rounded-full animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Patient Details Modal */}
      <AnimatePresence>
        {viewingPatient && (
          <PatientDetailsModal
            patient={viewingPatient}
            onClose={() => setViewingPatient(null)}
            onEdit={() => {
              setEditingPatient(viewingPatient);
              setViewingPatient(null);
            }}
            onDelete={onDelete}
            actionLoading={actionLoading}
          />
        )}
      </AnimatePresence>

      {/* Patient Edit Modal - to be implemented */}
      <AnimatePresence>
        {editingPatient && (
          <PatientEditModal 
            patient={editingPatient}
            onClose={() => setEditingPatient(null)}
            onUpdate={onUpdate}
            actionLoading={actionLoading === editingPatient.id}
          />
        )}
      </AnimatePresence>
    </>
  );
} 