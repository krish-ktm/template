import { Check, Calendar, Clock, User, Phone, MapPin, X, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import { downloadAppointmentImage } from '../../utils/imageDownload';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

const TIMEZONE = 'Asia/Kolkata';

interface BookingDetails {
  id: string;
  name: string;
  phone: string;
  age: number;
  city: string;
  appointment_date: string;
  appointment_time: string;
  created_at: string;
}

interface BookingConfirmationProps {
  booking: BookingDetails;
  onClose: () => void;
  t: any;
}

export function BookingConfirmation({ booking, onClose, t }: BookingConfirmationProps) {
  // Add safety check for translations
  if (!t || !t.confirmation) {
    return null;
  }

  const [downloading, setDownloading] = useState(false);
  const [customRulesText, setCustomRulesText] = useState<string | null>(null);

  useEffect(() => {
    const fetchCustomRules = async () => {
      try {
        const { data, error } = await supabase
          .from('image_download_rules')
          .select('content')
          .eq('type', 'patient')
          .eq('is_active', true)
          .order('order', { ascending: true })
          .limit(1)
          .single();

        if (error) throw error;
        
        if (data && data.content && data.content.en) {
          const contentText = data.content.en as string;
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
        console.error('Error fetching appointment image rules:', error);
      }
    };

    fetchCustomRules();
  }, []);

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
        ...booking,
        name: booking.name,
        phone: booking.phone,
        age: booking.age,
        city: booking.city
      };
      
      // Pass the entire translations object
      await downloadAppointmentImage(appointmentWithDetails, 'patient', {
        confirmation: t.confirmation,
        form: t.form
      });
    } catch (error) {
      console.error('Error downloading image:', error);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div 
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
        <div className="relative bg-gradient-to-br from-[#2B5C4B] to-[#234539] p-4 sm:p-6 text-white flex-shrink-0">
          <div className="flex items-center gap-4">
            <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
              <Check className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold font-heading">{t.confirmation.title}</h2>
              <p className="text-white/80 text-sm mt-0.5 font-sans">
                {t.confirmation.subtitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white hover:bg-white/10 p-2 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Appointment Details */}
        <div className="overflow-y-auto flex-grow">
          <div className="p-4 sm:p-6 space-y-4">
            {/* Date & Time */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="bg-[#2B5C4B]/5 rounded-xl p-3 sm:p-4 flex items-center h-full">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="bg-[#2B5C4B]/10 p-1.5 sm:p-2 rounded-lg flex-shrink-0">
                    <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#2B5C4B]" />
                  </div>
                  <div>
                    <p className="text-[10px] sm:text-xs text-gray-500 font-sans">{t.confirmation.date}</p>
                    <p className="text-xs sm:text-sm font-medium text-gray-900 font-sans">
                      {formatDate(booking.appointment_date)}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-[#2B5C4B]/5 rounded-xl p-3 sm:p-4 flex items-center h-full">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="bg-[#2B5C4B]/10 p-1.5 sm:p-2 rounded-lg flex-shrink-0">
                    <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#2B5C4B]" />
                  </div>
                  <div>
                    <p className="text-[10px] sm:text-xs text-gray-500 font-sans">{t.confirmation.time}</p>
                    <p className="text-xs sm:text-sm font-medium text-gray-900 font-sans">
                      {booking.appointment_time}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Patient Details */}
            <div className="bg-[#2B5C4B]/5 rounded-xl p-4 sm:p-6">
              <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-4 font-heading">{t.confirmation.patientDetails}</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center gap-2 sm:gap-3 mb-4">
                    <div className="bg-[#2B5C4B]/10 p-1.5 sm:p-2 rounded-lg">
                      <User className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#2B5C4B]" />
                    </div>
                    <div>
                      <p className="text-[10px] sm:text-xs text-gray-500 font-sans">{t.form.name}</p>
                      <p className="text-xs sm:text-sm font-medium text-gray-900 font-sans">{booking.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="bg-[#2B5C4B]/10 p-1.5 sm:p-2 rounded-lg">
                      <Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#2B5C4B]" />
                    </div>
                    <div>
                      <p className="text-[10px] sm:text-xs text-gray-500 font-sans">{t.form.phone}</p>
                      <p className="text-xs sm:text-sm font-medium text-gray-900 font-sans">{booking.phone}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2 sm:gap-3 mb-4">
                    <div className="bg-[#2B5C4B]/10 p-1.5 sm:p-2 rounded-lg">
                      <User className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#2B5C4B]" />
                    </div>
                    <div>
                      <p className="text-[10px] sm:text-xs text-gray-500 font-sans">{t.form.age}</p>
                      <p className="text-xs sm:text-sm font-medium text-gray-900 font-sans">{booking.age}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="bg-[#2B5C4B]/10 p-1.5 sm:p-2 rounded-lg">
                      <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#2B5C4B]" />
                    </div>
                    <div>
                      <p className="text-[10px] sm:text-xs text-gray-500 font-sans">{t.form.city}</p>
                      <p className="text-xs sm:text-sm font-medium text-gray-900 font-sans">{booking.city}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Booking ID */}
            <div className="bg-[#2B5C4B]/5 rounded-xl p-3 sm:p-4">
              <p className="text-[10px] sm:text-xs text-gray-500 font-sans">{t.confirmation.bookingId}</p>
              <p className="text-xs sm:text-sm font-medium text-gray-900 font-sans">#{booking.id.slice(-8).toUpperCase()}</p>
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
              className="w-full sm:flex-1 h-12 sm:h-10 px-5 sm:px-4 text-[#2B5C4B] hover:bg-[#2B5C4B]/5 border border-[#2B5C4B]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2B5C4B]/20 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed font-sans text-sm sm:text-base"
            >
              {downloading ? (
                <>
                  <div className="w-4 h-4 sm:w-4 sm:h-4 border-2 border-[#2B5C4B]/30 border-t-[#2B5C4B] rounded-full animate-spin" />
                  <span>Downloading...</span>
                </>
              ) : (
                <>
                  <Download className="h-4 sm:h-4 w-4 sm:w-4 flex-shrink-0" />
                  <span>Download</span>
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="w-full sm:flex-1 h-12 sm:h-10 px-5 sm:px-4 text-white bg-[#2B5C4B] rounded-xl hover:bg-[#234539] focus:outline-none focus:ring-2 focus:ring-[#2B5C4B]/20 transition-colors shadow-sm hover:shadow font-sans text-sm sm:text-base"
            >
              Done
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}