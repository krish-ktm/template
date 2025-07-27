import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { Patient } from '../../../types';
import { FormEvent, useState } from 'react';
import { toast } from 'react-hot-toast';

interface PatientEditModalProps {
  patient: Patient;
  onClose: () => void;
  onUpdate: (id: string, updatedData: Partial<Patient>) => void;
  actionLoading: boolean;
}

export function PatientEditModal({
  patient,
  onClose,
  onUpdate,
  actionLoading
}: PatientEditModalProps) {
  const [formData, setFormData] = useState({
    first_name: patient.first_name,
    last_name: patient.last_name || '',
    phone_number: patient.phone_number,
    email: patient.email || '',
    age: patient.age !== null ? String(patient.age) : '',
    gender: patient.gender || '',
    address: patient.address || '',
    medical_history: patient.medical_history || ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (!formData.first_name.trim()) {
      toast.error('First name is required');
      return;
    }
    
    if (!formData.phone_number.trim() || !/^\d{10}$/.test(formData.phone_number)) {
      toast.error('Valid 10-digit phone number is required');
      return;
    }

    // Convert age from string to number if provided
    const updatedData: Partial<Patient> = {
      first_name: formData.first_name.trim(),
      last_name: formData.last_name.trim() || undefined,
      phone_number: formData.phone_number.trim(),
      email: formData.email.trim() || undefined,
      age: formData.age ? Number(formData.age) : undefined,
      gender: formData.gender || undefined,
      address: formData.address.trim() || undefined,
      medical_history: formData.medical_history.trim() || undefined
    };

    onUpdate(patient.id, updatedData);
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
          <h2 className="text-lg font-semibold text-gray-900">Edit Patient</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
                Personal Information
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* First Name */}
                <div>
                  <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="first_name"
                    id="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    required
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#2B5C4B] focus:ring-[#2B5C4B] sm:text-sm"
                  />
                </div>
                
                {/* Last Name */}
                <div>
                  <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="last_name"
                    id="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#2B5C4B] focus:ring-[#2B5C4B] sm:text-sm"
                  />
                </div>
                
                {/* Gender */}
                <div>
                  <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                    Gender
                  </label>
                  <select
                    name="gender"
                    id="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#2B5C4B] focus:ring-[#2B5C4B] sm:text-sm"
                  >
                    <option value="">Not Specified</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                {/* Age */}
                <div>
                  <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
                    Age
                  </label>
                  <input
                    type="number"
                    name="age"
                    id="age"
                    min="0"
                    max="120"
                    value={formData.age}
                    onChange={handleChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#2B5C4B] focus:ring-[#2B5C4B] sm:text-sm"
                  />
                </div>
              </div>
            </div>
            
            {/* Contact Information */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
                Contact Information
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Phone Number */}
                <div>
                  <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone_number"
                    id="phone_number"
                    value={formData.phone_number}
                    onChange={handleChange}
                    required
                    pattern="[0-9]{10}"
                    title="Phone number should be 10 digits"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#2B5C4B] focus:ring-[#2B5C4B] sm:text-sm"
                  />
                  <p className="mt-1 text-xs text-gray-500">10-digit phone number without spaces or dashes</p>
                </div>
                
                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#2B5C4B] focus:ring-[#2B5C4B] sm:text-sm"
                  />
                </div>
                
                {/* Address */}
                <div className="sm:col-span-2">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    id="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#2B5C4B] focus:ring-[#2B5C4B] sm:text-sm"
                  />
                </div>
              </div>
            </div>
            
            {/* Medical History */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
                Medical Information
              </h3>
              <div>
                <label htmlFor="medical_history" className="block text-sm font-medium text-gray-700 mb-1">
                  Medical History
                </label>
                <textarea
                  name="medical_history"
                  id="medical_history"
                  rows={4}
                  value={formData.medical_history}
                  onChange={handleChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#2B5C4B] focus:ring-[#2B5C4B] sm:text-sm"
                  placeholder="Enter any relevant medical history..."
                />
              </div>
            </div>
          </form>
        </div>
        
        <div className="bg-gray-50 px-6 py-4 flex justify-end items-center border-t border-gray-200 gap-3">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={actionLoading}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#2B5C4B] hover:bg-[#224839] disabled:opacity-50"
          >
            {actionLoading ? (
              <>
                <div className="w-4 h-4 mr-2 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
} 