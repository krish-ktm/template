import { motion } from 'framer-motion';
import { Calendar, MapPin, Phone, User, Clock, AlertCircle } from 'lucide-react';
import { AppointmentForm as AppointmentFormType, TimeSlot, Patient } from '../../types';
import { FormField } from './FormField';
import { TimeSlotSelector } from './TimeSlotSelector';
import { useTranslation } from '../../i18n/useTranslation';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { format } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { formatMarkdown } from '../../utils/markdown';
import { toast } from 'react-hot-toast';

interface AppointmentFormProps {
  form: AppointmentFormType;
  setForm: (form: AppointmentFormType) => void;
  timeSlots: TimeSlot[];
  onSubmit: (e: React.FormEvent) => void;
  success: boolean;
  loading: boolean;
  loadingSlots?: boolean;
}

const TIMEZONE = 'Asia/Kolkata';

export function AppointmentForm({
  form,
  setForm,
  timeSlots,
  onSubmit,
  success,
  loading,
  loadingSlots = false
}: AppointmentFormProps) {
  const { t, language } = useTranslation();
  const today = new Date();
  const tomorrow = new Date();
  const [loadingTimeSlots, setLoadingTimeSlots] = useState(false);
  const [loadingPatientData, setLoadingPatientData] = useState(false);
  const [currentPatient, setCurrentPatient] = useState<Patient | null>(null);
  tomorrow.setDate(today.getDate() + 1);

  const [rules, setRules] = useState<any[]>([]);
  const [showAllRules, setShowAllRules] = useState(false);

  useEffect(() => {
    loadRules();
  }, []);

  const loadRules = async () => {
    try {
      const { data, error } = await supabase
        .from('appointment_rules')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) throw error;
      setRules(data || []);
    } catch (error) {
      console.error('Error loading rules:', error);
    }
  };

  // Fetch patient data when phone number is entered
  useEffect(() => {
    const phoneNumber = form.phone.trim();
    if (phoneNumber.length === 10) {
      fetchPatientByPhone(phoneNumber);
    } else {
      setCurrentPatient(null);
    }
  }, [form.phone]);

  const fetchPatientByPhone = async (phoneNumber: string) => {
    try {
      setLoadingPatientData(true);
      
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .eq('phone_number', phoneNumber)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        // PGRST116 is "no rows returned" error, which is expected if patient doesn't exist
        console.error('Error fetching patient:', error);
      }
      
      if (data) {
        setCurrentPatient(data);
        // Auto-fill form with patient data
        setForm({
          ...form,
          name: `${data.first_name} ${data.last_name || ''}`.trim(),
          age: data.age ? String(data.age) : '',
          city: data.address ? data.address.split(',').pop()?.trim() || '' : ''
        });
        
        toast.success('Patient information loaded');
      }
    } catch (error) {
      console.error('Error fetching patient data:', error);
    } finally {
      setLoadingPatientData(false);
    }
  };

  const handleDateChange = (date: Date | null) => {
    if (date) {
      const istDate = utcToZonedTime(date, TIMEZONE);
      const formattedDate = format(istDate, 'yyyy-MM-dd');
      setLoadingTimeSlots(true);
      setForm({ ...form, date: formattedDate, timeSlot: '' });
      // Set loading to false after a short delay to prevent flickering
      setTimeout(() => setLoadingTimeSlots(false), 500);
    }
  };

  const formatSelectedDate = (dateStr: string) => {
    const date = utcToZonedTime(new Date(dateStr), TIMEZONE);
    const dayName = t.appointment.form.days[format(date, 'EEEE').toLowerCase() as keyof typeof t.appointment.form.days];
    const monthName = t.appointment.form.months[format(date, 'MMMM').toLowerCase() as keyof typeof t.appointment.form.months];
    const day = format(date, 'd');
    const year = format(date, 'yyyy');
    return `${dayName}, ${monthName} ${day}, ${year}`;
  };

  const handlePhoneChange = (value: string) => {
    // Only allow digits
    const digitsOnly = value.replace(/\D/g, '');
    // Limit to 10 digits
    const limitedValue = digitsOnly.substring(0, 10);
    setForm({ ...form, phone: limitedValue });
  };

  const displayedRules = showAllRules ? rules : rules.slice(0, 2);

  return (
    <div>
      {/* Appointment Rules */}
      {rules.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          {rules.length > 2 && (
            <div className="flex justify-end mb-2">
              <button
                onClick={() => setShowAllRules(!showAllRules)}
                className="text-xs text-[#2B5C4B] hover:text-[#234539] font-medium transition-colors"
              >
                {showAllRules ? 'Show Less' : 'Show All'}
              </button>
            </div>
          )}
          {displayedRules.map((rule, index) => (
            <motion.div
              key={rule.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-[#2B5C4B]/5 rounded-lg p-2.5 border border-[#2B5C4B]/10 hover:shadow-sm hover:border-[#2B5C4B]/20 transition-all duration-300 mb-2 last:mb-0"
            >
              <div>
                <h4 className="text-sm font-medium text-gray-900 font-heading">
                  {rule.title[language]}
                </h4>
                <div 
                  className="prose prose-sm max-w-none text-xs text-gray-600 mt-0.5 leading-relaxed prose-a:text-[#2B5C4B] prose-a:no-underline hover:prose-a:underline prose-li:my-0 prose-p:my-0.5 font-sans"
                  dangerouslySetInnerHTML={{ 
                    __html: formatMarkdown(rule.content[language]) 
                  }}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {success && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl text-center"
        >
          <div className="flex items-center justify-center gap-2 mb-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <p className="font-medium font-sans">{t.appointment.form.success}</p>
          </div>
          <p className="text-sm text-green-600 font-sans">{t.appointment.form.successNote}</p>
        </motion.div>
      )}

      <form onSubmit={onSubmit} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Date and Time Selection */}
          <div className="space-y-6">
            <div className="bg-white p-4 rounded-xl border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-[#2B5C4B]/10 rounded-lg">
                  <Calendar className="w-5 h-5 text-[#2B5C4B]" />
                </div>
                <h3 className="font-medium text-gray-900 font-heading">{t.appointment.form.date}</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[today, tomorrow].map((date) => {
                  const istDate = utcToZonedTime(date, TIMEZONE);
                  const dateStr = format(istDate, 'yyyy-MM-dd');
                  const dayName = t.appointment.form.days[format(istDate, 'EEEE').toLowerCase() as keyof typeof t.appointment.form.days];
                  const monthName = t.appointment.form.months[format(istDate, 'MMMM').toLowerCase() as keyof typeof t.appointment.form.months];
                  const day = format(istDate, 'd');
                  return (
                    <motion.button
                      key={dateStr}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={() => handleDateChange(date)}
                      className={`p-4 rounded-xl text-center transition-all ${
                        form.date === dateStr
                          ? 'bg-[#2B5C4B] text-white shadow-lg shadow-[#2B5C4B]/10'
                          : 'bg-white border border-gray-200 text-gray-700 hover:border-[#2B5C4B]/30 hover:bg-[#2B5C4B]/5'
                      }`}
                    >
                      <div className="text-sm font-medium mb-1 font-sans">
                        {dayName}
                      </div>
                      <div className={`text-xs ${form.date === dateStr ? 'text-white/90' : 'text-gray-500'} font-sans`}>
                        {`${monthName} ${day}`}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-[#2B5C4B]/10 rounded-lg">
                  <Clock className="w-5 h-5 text-[#2B5C4B]" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 font-heading">{t.appointment.form.timeSlot}</h3>
                  <p className="text-xs text-gray-500 mt-0.5 font-sans">
                    {t.appointment.form.showingSlots}: {formatSelectedDate(form.date)}
                  </p>
                </div>
              </div>
              <TimeSlotSelector
                timeSlots={timeSlots}
                selectedTime={form.timeSlot}
                onSelectTime={(time) => setForm({ ...form, timeSlot: time })}
                label={t.appointment.form.timeSlot}
                t={t.appointment.form}
                loading={loadingTimeSlots || loadingSlots}
              />
            </div>
          </div>

          {/* Personal Information */}
          <div className="space-y-6">
            <div className="bg-white p-4 rounded-xl border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-[#2B5C4B]/10 rounded-lg">
                  <User className="w-5 h-5 text-[#2B5C4B]" />
                </div>
                <h3 className="font-medium text-gray-900 font-heading">{t.appointment.form.personalInfo}</h3>
              </div>
              {currentPatient && (
                <div className="mb-4 p-3 bg-green-50 border border-green-100 rounded-lg text-sm text-green-800">
                  <div className="flex items-center gap-1.5 mb-1 font-medium">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span>Returning Patient</span>
                  </div>
                  <p className="text-xs text-green-700">
                    Your information has been loaded from our records.
                  </p>
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  label={t.appointment.form.name}
                  type="text"
                  value={form.name}
                  onChange={(value) => setForm({ ...form, name: value })}
                  icon={User}
                  disabled={loadingPatientData}
                />
                <div className="relative">
                  <FormField
                    label={t.appointment.form.phone}
                    type="tel"
                    value={form.phone}
                    onChange={handlePhoneChange}
                    icon={Phone}
                    maxLength={10}
                    pattern="[0-9]{10}"
                    title="Please enter a 10-digit phone number"
                  />
                  {loadingPatientData && (
                    <div className="absolute right-3 top-9">
                      <div className="w-4 h-4 border-2 border-[#2B5C4B]/30 border-t-[#2B5C4B] rounded-full animate-spin" />
                    </div>
                  )}
                </div>
                <FormField
                  label={t.appointment.form.age}
                  type="number"
                  value={form.age}
                  onChange={(value) => setForm({ ...form, age: value })}
                  icon={User}
                  min="0"
                  max="120"
                  disabled={loadingPatientData}
                />
                <FormField
                  label={t.appointment.form.city}
                  type="text"
                  value={form.city}
                  onChange={(value) => setForm({ ...form, city: value })}
                  icon={MapPin}
                  disabled={loadingPatientData}
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={loading || !form.timeSlot || loadingPatientData}
              className={`w-full py-4 px-6 bg-[#2B5C4B] text-white rounded-xl font-medium hover:bg-[#234539] transition-all duration-200 ${
                (loading || !form.timeSlot || loadingPatientData) ? 'opacity-70 cursor-not-allowed' : ''
              } font-sans`}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>{t.appointment.form.booking}</span>
                </div>
              ) : (
                t.appointment.form.submit
              )}
            </motion.button>
          </div>
        </div>
      </form>
    </div>
  );
}