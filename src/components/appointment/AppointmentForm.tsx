import { motion } from 'framer-motion';
import { MapPin, Phone, User, Clock } from 'lucide-react';
import { AppointmentForm as AppointmentFormType, TimeSlot, Patient } from '../../types';
import { FormField } from './FormField';
import { TimeSlotSelector } from './TimeSlotSelector';
import { DateSelector } from './DateSelector';
import { useTranslation } from '../../i18n/useTranslation';
import { useBookingSettings } from '../../hooks/useBookingSettings';
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

interface Rule {
  id: string;
  title: Record<string, string>;
  content: Record<string, string>;
  is_active: boolean;
  display_order: number;
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
  const [searchCompleted, setSearchCompleted] = useState(false);
  const [rules, setRules] = useState<Rule[]>([]);
  tomorrow.setDate(today.getDate() + 1);
  const { settings: bookingSettings, loading: settingsLoading } = useBookingSettings();

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
    setSearchCompleted(false); // Reset search completed flag when phone number changes
    
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
      } else {
        // Clear current patient if no patient found with this phone number
        setCurrentPatient(null);
      }
      
      // Set search completed flag after the search operation finishes
      setSearchCompleted(true);
    } catch (error) {
      console.error('Error fetching patient data:', error);
      setSearchCompleted(true); // Mark search as completed even if there's an error
      setCurrentPatient(null);
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

  // Helper function to determine if we should show the patient status message
  const shouldShowPatientStatus = () => {
    return searchCompleted && form.phone.length === 10 && !loadingPatientData;
  };

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
          {displayedRules.map((rule: Rule, index) => (
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
            {!settingsLoading && bookingSettings && (
              <DateSelector
                selectedDate={form.date}
                onDateChange={handleDateChange}
                dateOptions={bookingSettings.dateSelectionOptions}
                restrictions={bookingSettings.bookingRestrictions}
              />
            )}
            
            {settingsLoading && (
              <div className="bg-white p-4 rounded-xl border border-gray-200">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="h-16 bg-gray-200 rounded-xl"></div>
                    <div className="h-16 bg-gray-200 rounded-xl"></div>
                  </div>
                </div>
              </div>
            )}

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
              
              {/* Phone input with explanation - moved to the top */}
              <div className="mb-4">
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
                <p className="mt-1 text-xs text-gray-500 ml-1">
                  {t.appointment.form.phoneInfo}
                </p>
              </div>
              
              {/* Patient status notification - Only shown after search is completed */}
              {shouldShowPatientStatus() && (
                <>
                  {currentPatient ? (
                    <div className="mb-4 p-3 bg-green-50 border border-green-100 rounded-lg text-sm text-green-800">
                      <div className="flex items-center gap-1.5 mb-1 font-medium">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                        <span>{t.appointment.form.returningPatient}</span>
                      </div>
                      <p className="text-xs text-green-700">
                        {t.appointment.form.returningPatientInfo}
                      </p>
                    </div>
                  ) : (
                    <div className="mb-4 p-3 bg-blue-50 border border-blue-100 rounded-lg text-sm text-blue-800">
                      <div className="flex items-center gap-1.5 mb-1 font-medium">
                        <div className="w-2 h-2 bg-blue-500 rounded-full" />
                        <span>{t.appointment.form.newPatient}</span>
                      </div>
                      <p className="text-xs text-blue-700">
                        {t.appointment.form.newPatientInfo}
                      </p>
                    </div>
                  )}
                </>
              )}
              
              {/* Other personal info fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  label={t.appointment.form.name}
                  type="text"
                  value={form.name}
                  onChange={(value) => setForm({ ...form, name: value })}
                  icon={User}
                  disabled={loadingPatientData}
                  required
                />
                <FormField
                  label={t.appointment.form.age}
                  type="number"
                  value={form.age}
                  onChange={(value) => setForm({ ...form, age: value })}
                  icon={User}
                  min="0"
                  max="120"
                  disabled={loadingPatientData}
                  required
                />
                <div className="sm:col-span-2">
                  <FormField
                    label={t.appointment.form.city}
                    type="text"
                    value={form.city}
                    onChange={(value) => setForm({ ...form, city: value })}
                    icon={MapPin}
                    disabled={loadingPatientData}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Booking button */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={loading || !form.timeSlot || loadingPatientData || !form.name || !form.age || !form.city || form.phone.length !== 10}
              className={`w-full py-4 px-6 bg-[#2B5C4B] text-white rounded-xl font-medium hover:bg-[#234539] transition-all duration-200 ${
                (loading || !form.timeSlot || loadingPatientData || !form.name || !form.age || !form.city || form.phone.length !== 10) ? 'opacity-70 cursor-not-allowed' : ''
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