import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';
import { ResponsiveHeader } from '../headers/ResponsiveHeader';
import { Footer } from '../Footer';
import { MRForm, TimeSlot } from './types';
import { MRAppointmentForm } from './MRAppointmentForm';
import { MRAppointmentCalendar } from './MRAppointmentCalendar';
import { MRAppointmentConfirmation } from './MRAppointmentConfirmation';
import { useTranslation } from '../../i18n/useTranslation';
import { validateMRAppointment } from '../../utils/mrAppointments';
import { fetchTimeSlots } from './MRTimeSlotFetcher';
import { MRTimeSlotSelector } from './TimeSlotSelector';
import { Shield } from 'lucide-react';
import { SEO } from '../SEO';
import { translations } from '../../translations';

interface MRAppointmentDetails {
  id: string;
  mr_name: string;
  company_name: string;
  division_name: string;
  contact_no: string;
  appointment_date: string;
  appointment_time?: string;
  created_at: string;
}

export function MRAppointment() {
  const { t, language } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [appointmentDetails, setAppointmentDetails] = useState<MRAppointmentDetails | null>(null);
  const [calendarKey, setCalendarKey] = useState(0);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loadingTimeSlots, setLoadingTimeSlots] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [form, setForm] = useState<MRForm>({
    mr_name: '',
    company_name: '',
    division_name: '',
    contact_no: '',
    appointment_date: null,
    appointment_time: undefined
  });

  const directTranslations = translations[language];
  
  const metaTitle = directTranslations?.meta?.mrAppointmentTitle || 'Medical Representative Appointment';
  const metaDescription = directTranslations?.meta?.mrAppointmentDescription || 'Book your medical representative appointment';
  const keywords = directTranslations?.meta?.keywords;
  const author = directTranslations?.meta?.author;

  useEffect(() => {
    if (form.appointment_date) {
      loadTimeSlots();
    } else {
      setTimeSlots([]);
    }
  }, [form.appointment_date]);

  const loadTimeSlots = async () => {
    if (!form.appointment_date) return;
    
    setLoadingTimeSlots(true);
    try {
      const slots = await fetchTimeSlots(form.appointment_date);
      setTimeSlots(slots);
      
      if (form.appointment_time) {
        const currentSlot = slots.find(slot => slot.time === form.appointment_time);
        if (!currentSlot || (currentSlot.currentBookings !== undefined && 
            currentSlot.currentBookings >= currentSlot.maxBookings)) {
          setForm(prev => ({ ...prev, appointment_time: undefined }));
        }
      }
    } catch (error) {
      console.error('Error loading time slots:', error);
      toast.error('Failed to load available time slots');
    } finally {
      setLoadingTimeSlots(false);
    }
  };

  const resetForm = () => {
    setForm({
      mr_name: '',
      company_name: '',
      division_name: '',
      contact_no: '',
      appointment_date: null,
      appointment_time: undefined
    });
    setAppointmentDetails(null);
    setTimeSlots([]);
    setCalendarKey(prev => prev + 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const newErrors: FormErrors = {};
    
    if (!form.mr_name?.trim()) {
      newErrors.mr_name = "Medical Representative Name is required";
    }
    
    if (!form.company_name?.trim()) {
      newErrors.company_name = "Company Name is required";
    }
    
    if (!form.division_name?.trim()) {
      newErrors.division_name = "Division Name is required";
    }
    
    if (!form.contact_no) {
      newErrors.contact_no = "Contact Number is required";
    } else if (!/^\d{10}$/.test(form.contact_no)) {
      newErrors.contact_no = "Please enter a valid 10-digit phone number";
    }

    if (!form.appointment_date) {
      newErrors.appointment_date = "Please select an appointment date";
    }

    if (!form.appointment_time) {
      newErrors.appointment_time = "Please select a time slot";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      if (!form.appointment_date) {
        throw new Error("Please select an appointment date");
      }
      
      const { isValid, error: validationError } = await validateMRAppointment(form.appointment_date);
      if (!isValid) {
        throw new Error(validationError);
      }

      // Duplicate booking guard -> same MR name & contact cannot hold more than one future appointment
      const todayStr = format(new Date(), 'yyyy-MM-dd');
      const { data: duplicateRows, error: duplicateError } = await supabase
        .from('mr_appointments')
        .select('id')
        .eq('mr_name', form.mr_name.trim())
        .eq('contact_no', form.contact_no)
        .gte('appointment_date', todayStr);

      if (duplicateError) throw duplicateError;
      if (duplicateRows && duplicateRows.length > 0) {
        throw new Error('You already have an upcoming appointment. You can book another once that appointment date has passed.');
      }

      const currentSlot = timeSlots.find(slot => slot.time === form.appointment_time);
      if (!currentSlot) {
        throw new Error("Please select a time slot");
      }
      
      if (currentSlot.currentBookings !== undefined && 
          currentSlot.currentBookings >= currentSlot.maxBookings) {
        throw new Error(`This time slot is no longer available. Please select another time.`);
      }

      const { data: appointment, error } = await supabase
        .from('mr_appointments')
        .insert({
          mr_name: form.mr_name,
          company_name: form.company_name,
          division_name: form.division_name,
          contact_no: form.contact_no,
          appointment_date: form.appointment_date ? format(form.appointment_date, 'yyyy-MM-dd') : '',
          appointment_time: form.appointment_time
        })
        .select()
        .single();

      if (error) throw error;

      setAppointmentDetails(appointment);
      toast.success(t.mrAppointment.success);
      setCalendarKey(prev => prev + 1);
    } catch (error) {
      console.error('Error booking appointment:', error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Failed to book appointment');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    resetForm();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#2B5C4B]/5 via-white to-[#2B5C4B]/5 relative overflow-hidden">
      <SEO 
        title={metaTitle} 
        description={metaDescription} 
        keywords={keywords}
        author={author}
        ogTitle={metaTitle}
        ogDescription={metaDescription}
        ogImage="https://drjemishskinclinic.com/og-image.jpg"
        ogUrl="https://drjemishskinclinic.com/mr-appointment"
        twitterTitle={metaTitle}
        twitterDescription={metaDescription}
        twitterImage="https://drjemishskinclinic.com/twitter-image.jpg"
        canonicalUrl={window.location.href}
      />
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#2B5C4B]/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#2B5C4B]/5 rounded-full blur-3xl" />
      </div>

      <ResponsiveHeader />
      
      <main className="flex-grow pt-24 sm:pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Section */}
          <div className="text-center mb-12 sm:mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#2B5C4B]/5 text-[#2B5C4B] text-xs font-medium mb-3 sm:mb-4 backdrop-blur-sm"
            >
              <Shield className="w-3.5 h-3.5" />
              {t.mrAppointment.badge}
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1e3a5c] mb-4 sm:mb-6 font-heading"
            >
              {t.mrAppointment.headerTitle}
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto font-sans"
            >
              {t.mrAppointment.headerSubtitle}
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="p-4 sm:p-6 bg-gradient-to-r from-[#2B5C4B] to-[#234539]">
                <h2 className="text-xl sm:text-2xl font-semibold text-white font-heading">{t.mrAppointment.title}</h2>
                <p className="text-[#2B5C4B]-100 mt-1 text-sm sm:text-base text-white/80 font-sans">{t.mrAppointment.subtitle}</p>
              </div>

              <form onSubmit={handleSubmit} className="p-4 sm:p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left Column - Form Fields and Time Slots */}
                  <div className="space-y-6">
                    <MRAppointmentForm 
                      form={form}
                      onChange={setForm}
                      t={t.mrAppointment.form}
                      errors={errors as Record<string, string>}
                    />

                    {/* Time Selection - Desktop: Below form fields */}
                    <div className="hidden lg:block">
                      {form.appointment_date && (
                        <MRTimeSlotSelector
                          slots={timeSlots}
                          selectedTime={form.appointment_time}
                          onSelectTime={(time) => setForm({ ...form, appointment_time: time })}
                          t={t.mrAppointment.form}
                          error={errors?.appointment_time}
                          loading={loadingTimeSlots}
                        />
                      )}
                    </div>
                  </div>

                  {/* Right Column - Calendar */}
                  <div className="lg:border-l lg:border-gray-100 lg:pl-8">
                    <MRAppointmentCalendar
                      key={calendarKey}
                      selectedDate={form.appointment_date}
                      onDateChange={(date) => setForm({ ...form, appointment_date: date, appointment_time: undefined })}
                    />

                    {/* Time Selection - Mobile: Below calendar */}
                    <div className="lg:hidden mt-6">
                      {form.appointment_date && (
                        <MRTimeSlotSelector
                          slots={timeSlots}
                          selectedTime={form.appointment_time}
                          onSelectTime={(time) => setForm({ ...form, appointment_time: time })}
                          t={t.mrAppointment.form}
                          error={errors?.appointment_time}
                          loading={loadingTimeSlots}
                        />
                      )}
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="mt-8">
                  <button
                    type="submit"
                    disabled={loading || !form.appointment_date || !form.appointment_time}
                    className={`w-full py-4 px-6 bg-[#2B5C4B] text-white rounded-xl font-medium hover:bg-[#234539] transition-all duration-200 font-sans ${
                      loading || !form.appointment_date || !form.appointment_time 
                        ? 'opacity-70 cursor-not-allowed' 
                        : ''
                    }`}
                  >
                    {loading ? t.mrAppointment.form.submitting : t.mrAppointment.form.submit}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </main>

      {appointmentDetails && (
        <MRAppointmentConfirmation
          appointment={appointmentDetails}
          onClose={handleClose}
          t={t.mrAppointment}
        />
      )}

      <Footer />
    </div>
  );
}

interface FormErrors {
  mr_name?: string;
  company_name?: string;
  division_name?: string;
  contact_no?: string;
  appointment_date?: string;
  appointment_time?: string;
}