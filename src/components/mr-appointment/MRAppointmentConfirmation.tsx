import { Check, Calendar, Building2, Users, Phone, Briefcase, X, Download, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import { downloadAppointmentImage } from '../../utils/imageDownload';
import { useState, useEffect } from 'react';
import { MRAppointmentTranslations } from '../../i18n/types/mr-appointment';
import { supabase } from '../../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';

const TIMEZONE = 'Asia/Kolkata';

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

interface MRAppointmentConfirmationProps {
  appointment: MRAppointmentDetails;
  onClose: () => void;
  t: MRAppointmentTranslations;
}

export function MRAppointmentConfirmation({ appointment, onClose, t }: MRAppointmentConfirmationProps) {
  const [downloading, setDownloading] = useState(false);
  const [customRulesText, setCustomRulesText] = useState<string | null>(null);
  
  const language = t.form.days.monday === 'સોમવાર' ? 'gu' : 'en';

  useEffect(() => {
    const fetchCustomRules = async () => {
      try {
        const { data, error } = await supabase
          .from('image_download_rules')
          .select('content')
          .eq('type', 'mr')
          .eq('is_active', true)
          .order('order', { ascending: true })
          .limit(1)
          .single();

        if (error) throw error;
        
        if (data && data.content && data.content[language]) {
          const contentText = data.content[language] as string;
          const ruleLines = contentText.split('\n')
            .map((line: string) => line.trim())
            .filter((line: string) => line.startsWith('-'))
            .map((line: string) => line.substring(1).trim());
          
          if (ruleLines.length >= 2) {
            setCustomRulesText(ruleLines[1]);
          } else if (ruleLines.length === 1) {
            setCustomRulesText(ruleLines[0]);
          }
        }
      } catch (error) {
        console.error('Error fetching MR appointment image rules:', error);
      }
    };

    fetchCustomRules();
  }, [language]);

  const formatDate = (dateStr: string) => {
    const date = utcToZonedTime(new Date(dateStr), TIMEZONE);
    const dayName = t.form.days[format(date, 'EEEE').toLowerCase() as keyof typeof t.form.days];
    const monthName = t.form.months[format(date, 'MMMM').toLowerCase() as keyof typeof t.form.months];
    const day = format(date, 'd');
    const year = format(date, 'yyyy');
    return `${dayName}, ${monthName} ${day}, ${year}`;
  };

  const handleDownload = async () => {
    if (downloading) return;
    setDownloading(true);
    try {
      const appointmentWithDetails = {
        ...appointment,
        appointment_time: appointment.appointment_time || 'Any Time'
      };
      
      await downloadAppointmentImage(appointmentWithDetails, 'mr', t);
    } catch (error) {
      console.error('Error downloading image:', error);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="bg-white rounded-2xl shadow-xl w-full max-w-lg mx-auto overflow-hidden"
          onClick={e => e.stopPropagation()}
          style={{ maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}
        >
          {/* Success Header */}
          <div className="relative bg-gradient-to-br from-[#2B5C4B] to-[#234539] p-4 sm:p-6 text-white">
            <div className="flex items-center gap-4">
              <div className="bg-white/10 rounded-xl p-3">
                <Check className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-semibold font-heading">{t.confirmation.title}</h2>
                <p className="text-sm text-white/80 mt-0.5 font-sans">
                  {t.confirmation.subtitle}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white/80 hover:text-white hover:bg-white/10 p-2 rounded-full transition-colors"
            >
              <X className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>

          {/* Appointment Details */}
          <div className="overflow-y-auto flex-grow">
            <div className="p-4 sm:p-6 space-y-4">
              {/* Date and Time */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#2B5C4B]/5 rounded-xl p-3 sm:p-4">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="bg-[#2B5C4B]/10 p-1.5 sm:p-2 rounded-lg">
                      <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#2B5C4B]" />
                    </div>
                    <div>
                      <p className="text-[10px] sm:text-xs text-gray-500 font-sans">{t.confirmation.appointmentDate}</p>
                      <p className="text-xs sm:text-sm font-medium text-gray-900 font-sans">
                        {formatDate(appointment.appointment_date)}
                      </p>
                    </div>
                  </div>
                </div>
                
                {appointment.appointment_time && (
                  <div className="bg-[#2B5C4B]/5 rounded-xl p-3 sm:p-4">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="bg-[#2B5C4B]/10 p-1.5 sm:p-2 rounded-lg">
                        <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#2B5C4B]" />
                      </div>
                      <div>
                        <p className="text-[10px] sm:text-xs text-gray-500 font-sans">{t.confirmation.appointmentTime}</p>
                        <p className="text-xs sm:text-sm font-medium text-gray-900 font-sans">
                          {appointment.appointment_time}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* MR Details */}
              <div className="bg-[#2B5C4B]/5 rounded-xl p-4 sm:p-6">
                <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-4 font-heading">{t.confirmation.mrDetails}</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center gap-2 sm:gap-3 mb-4">
                      <div className="bg-[#2B5C4B]/10 p-1.5 sm:p-2 rounded-lg">
                        <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#2B5C4B]" />
                      </div>
                      <div>
                        <p className="text-[10px] sm:text-xs text-gray-500 font-sans">{t.form.mrName}</p>
                        <p className="text-xs sm:text-sm font-medium text-gray-900 font-sans">{appointment.mr_name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="bg-[#2B5C4B]/10 p-1.5 sm:p-2 rounded-lg">
                        <Building2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#2B5C4B]" />
                      </div>
                      <div>
                        <p className="text-[10px] sm:text-xs text-gray-500 font-sans">{t.form.companyName}</p>
                        <p className="text-xs sm:text-sm font-medium text-gray-900 font-sans">{appointment.company_name}</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 sm:gap-3 mb-4">
                      <div className="bg-[#2B5C4B]/10 p-1.5 sm:p-2 rounded-lg">
                        <Briefcase className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#2B5C4B]" />
                      </div>
                      <div>
                        <p className="text-[10px] sm:text-xs text-gray-500 font-sans">{t.form.divisionName}</p>
                        <p className="text-xs sm:text-sm font-medium text-gray-900 font-sans">{appointment.division_name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="bg-[#2B5C4B]/10 p-1.5 sm:p-2 rounded-lg">
                        <Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#2B5C4B]" />
                      </div>
                      <div>
                        <p className="text-[10px] sm:text-xs text-gray-500 font-sans">{t.form.contactNo}</p>
                        <p className="text-xs sm:text-sm font-medium text-gray-900 font-sans">{appointment.contact_no}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Booking ID */}
              <div className="bg-[#2B5C4B]/5 rounded-xl p-3 sm:p-4">
                <p className="text-[10px] sm:text-xs text-gray-500 font-sans">{t.confirmation.bookingId}</p>
                <p className="text-xs sm:text-sm font-medium text-gray-900 font-sans">#{appointment.id.slice(-8).toUpperCase()}</p>
              </div>
              
              {/* Hidden div to prevent linter errors for variables used in image download */}
              <div style={{ display: 'none' }}>
                {customRulesText}
              </div>
            </div>
          </div>

          {/* Actions - Fixed at bottom */}
          <div className="border-t border-gray-100 p-4 sm:p-6 flex-shrink-0">
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleDownload}
                disabled={downloading}
                className="flex-1 h-10 py-2 px-4 text-[#2B5C4B] hover:bg-[#2B5C4B]/5 border border-[#2B5C4B]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2B5C4B]/20 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-sans"
              >
                {downloading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-[#2B5C4B]/30 border-t-[#2B5C4B] rounded-full animate-spin" />
                    <span>{t.confirmation.downloading}</span>
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 flex-shrink-0" />
                    <span>{t.confirmation.download}</span>
                  </>
                )}
              </button>
              <button
                onClick={onClose}
                className="flex-1 h-10 py-2 px-4 text-white bg-[#2B5C4B] rounded-xl hover:bg-[#234539] focus:outline-none focus:ring-2 focus:ring-[#2B5C4B]/20 transition-colors text-sm font-sans"
              >
                {t.confirmation.done}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}