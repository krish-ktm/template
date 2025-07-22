import { motion } from 'framer-motion';
import { ResponsiveHeader } from '../headers/ResponsiveHeader';
import { Footer } from '../Footer';
import { AppointmentForm } from './AppointmentForm';
import { BookingConfirmation } from './BookingConfirmation';
import { useTranslation } from '../../i18n/useTranslation';
import { useAppointmentForm } from '../../hooks/useAppointmentForm';
import { Shield } from 'lucide-react';
import { SEO } from '../SEO';
import { StructuredData } from '../StructuredData';
import { clinicSchema } from '../../config/structuredData';
import { translations } from '../../translations';

export function AppointmentPage() {
  const { t, language } = useTranslation();
  const {
    form,
    setForm,
    loading,
    success,
    timeSlots,
    bookingDetails,
    handleSubmit,
    closeBookingDetails
  } = useAppointmentForm();

  const directTranslations = translations[language];
  
  const metaTitle = directTranslations?.meta?.appointmentTitle || 'Book Appointment';
  const metaDescription = directTranslations?.meta?.appointmentDescription || 'Book your appointment with our clinic';
  const keywords = directTranslations?.meta?.keywords;
  const author = directTranslations?.meta?.author;

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
        ogUrl="https://drjemishskinclinic.com/appointment"
        twitterTitle={metaTitle}
        twitterDescription={metaDescription}
        twitterImage="https://drjemishskinclinic.com/twitter-image.jpg"
        canonicalUrl={window.location.href}
      />
      <StructuredData type="LocalBusiness" data={clinicSchema} />
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
              {t.appointment.badge}
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1e3a5c] mb-4 sm:mb-6 font-heading"
            >
              {t.appointment.headerTitle}
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto font-sans"
            >
              {t.appointment.headerSubtitle}
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden"
          >
            <div className="p-4 sm:p-6 bg-gradient-to-r from-[#2B5C4B] to-[#234539]">
              <h2 className="text-xl sm:text-2xl font-semibold text-white font-heading">{t.appointment.title}</h2>
              <p className="text-[#2B5C4B]-100 mt-1 text-sm sm:text-base text-white/80 font-sans">{t.appointment.form.subtitle}</p>
            </div>

            <div className="p-4 sm:p-6">
              <AppointmentForm
                form={form}
                setForm={setForm}
                timeSlots={timeSlots}
                onSubmit={handleSubmit}
                success={success}
                loading={loading}
              />
            </div>
          </motion.div>
        </div>
      </main>

      {bookingDetails && (
        <BookingConfirmation
          booking={bookingDetails}
          onClose={closeBookingDetails}
          t={t.appointment}
        />
      )}

      <Footer />
    </div>
  );
}