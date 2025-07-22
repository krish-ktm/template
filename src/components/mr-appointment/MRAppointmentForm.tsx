import { Building2, Users, Phone, Briefcase, AlertCircle } from 'lucide-react';
import { MRForm } from './types';
import { useState } from 'react';

interface MRAppointmentFormTranslations {
  mrName: string;
  companyName: string;
  divisionName: string;
  contactNo: string;
  timeSlot: string;
  slotAvailable: string;
  noTimeSlots: string;
  selectAnotherDate: string;
  [key: string]: string | Record<string, string>;
}

interface MRAppointmentFormProps {
  form: MRForm;
  onChange: (form: MRForm) => void;
  t: MRAppointmentFormTranslations;
  errors?: Record<string, string>;
}

export function MRAppointmentForm({ form, onChange, t, errors }: MRAppointmentFormProps) {
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const showError = (field: string) => {
    return touched[field] && errors?.[field];
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5 font-sans">
          {t.mrName} *
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Users className="h-5 w-5 text-[#2B5C4B]" />
          </div>
          <input
            type="text"
            required
            value={form.mr_name}
            onChange={(e) => onChange({ ...form, mr_name: e.target.value })}
            onBlur={() => handleBlur('mr_name')}
            className={`block w-full pl-10 pr-3 py-2.5 border ${
              showError('mr_name') ? 'border-red-300' : 'border-gray-200'
            } rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#2B5C4B]/20 focus:border-[#2B5C4B] transition-all duration-200 bg-white/50 hover:bg-white hover:border-[#2B5C4B]/30`}
            placeholder={t.mrName}
          />
          {showError('mr_name') && (
            <div className="mt-1.5 text-sm text-red-600 flex items-center gap-1 font-sans">
              <AlertCircle className="h-4 w-4" />
              <span>{errors?.mr_name}</span>
            </div>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5 font-sans">
          {t.companyName} *
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Building2 className="h-5 w-5 text-[#2B5C4B]" />
          </div>
          <input
            type="text"
            required
            value={form.company_name}
            onChange={(e) => onChange({ ...form, company_name: e.target.value })}
            onBlur={() => handleBlur('company_name')}
            className={`block w-full pl-10 pr-3 py-2.5 border ${
              showError('company_name') ? 'border-red-300' : 'border-gray-200'
            } rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#2B5C4B]/20 focus:border-[#2B5C4B] transition-all duration-200 bg-white/50 hover:bg-white hover:border-[#2B5C4B]/30`}
            placeholder={t.companyName}
          />
          {showError('company_name') && (
            <div className="mt-1.5 text-sm text-red-600 flex items-center gap-1 font-sans">
              <AlertCircle className="h-4 w-4" />
              <span>{errors?.company_name}</span>
            </div>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5 font-sans">
          {t.divisionName} *
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Briefcase className="h-5 w-5 text-[#2B5C4B]" />
          </div>
          <input
            type="text"
            required
            value={form.division_name}
            onChange={(e) => onChange({ ...form, division_name: e.target.value })}
            onBlur={() => handleBlur('division_name')}
            className={`block w-full pl-10 pr-3 py-2.5 border ${
              showError('division_name') ? 'border-red-300' : 'border-gray-200'
            } rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#2B5C4B]/20 focus:border-[#2B5C4B] transition-all duration-200 bg-white/50 hover:bg-white hover:border-[#2B5C4B]/30`}
            placeholder={t.divisionName}
          />
          {showError('division_name') && (
            <div className="mt-1.5 text-sm text-red-600 flex items-center gap-1 font-sans">
              <AlertCircle className="h-4 w-4" />
              <span>{errors?.division_name}</span>
            </div>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5 font-sans">
          {t.contactNo} *
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Phone className="h-5 w-5 text-[#2B5C4B]" />
          </div>
          <input
            type="tel"
            required
            pattern="[0-9]{10}"
            value={form.contact_no}
            onChange={(e) => onChange({ ...form, contact_no: e.target.value })}
            onBlur={() => handleBlur('contact_no')}
            className={`block w-full pl-10 pr-3 py-2.5 border ${
              showError('contact_no') ? 'border-red-300' : 'border-gray-200'
            } rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#2B5C4B]/20 focus:border-[#2B5C4B] transition-all duration-200 bg-white/50 hover:bg-white hover:border-[#2B5C4B]/30`}
            placeholder={t.contactNo}
          />
          {showError('contact_no') && (
            <div className="mt-1.5 text-sm text-red-600 flex items-center gap-1 font-sans">
              <AlertCircle className="h-4 w-4" />
              <span>{errors?.contact_no}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}