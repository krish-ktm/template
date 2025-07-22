import { motion } from 'framer-motion';
import { ResponsiveHeader } from './headers/ResponsiveHeader';
import { Footer } from './Footer';
import { Phone, MapPin, Clock, Send, Shield } from 'lucide-react';
import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';
import { useTranslation } from '../i18n/useTranslation';
import { businessInfo } from '../config/business';
import { SEO } from './SEO';
import { StructuredData } from './StructuredData';
import { clinicSchema } from '../config/structuredData';
import { translations } from '../translations';

export function ContactPage() {
  const { t, language } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const directTranslations = translations[language];
  
  const metaTitle = directTranslations?.meta?.contactTitle || 'Contact Us';
  const metaDescription = directTranslations?.meta?.contactDescription || 'Get in touch with us';
  const keywords = directTranslations?.meta?.keywords;
  const author = directTranslations?.meta?.author;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('contact_messages')
        .insert({
          name: form.name,
          email: form.email,
          phone: form.phone,
          message: form.message
        });

      if (error) throw error;

      toast.success(t.contact.form.success);
      setForm({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error(t.contact.form.error);
    } finally {
      setLoading(false);
    }
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
        ogUrl="https://drjemishskinclinic.com/contact"
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
      
      <main className="pt-24 sm:pt-32 pb-16 sm:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Section */}
          <div className="text-center mb-12 sm:mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#2B5C4B]/5 text-[#2B5C4B] text-xs font-medium mb-3 sm:mb-4 backdrop-blur-sm"
            >
              <Shield className="w-3.5 h-3.5" />
              {t.contact.tagline}
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1e3a5c] mb-4 sm:mb-6 font-heading"
            >
              {t.contact.title}
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto font-sans"
            >
              {t.contact.subtitle}
            </motion.p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="p-6 bg-gradient-to-r from-[#2B5C4B] to-[#234539]">
                  <h2 className="text-xl font-semibold text-white font-heading">{t.contact.contactInfo.title}</h2>
                  <p className="text-white/80 mt-1 font-sans">{t.contact.contactInfo.subtitle}</p>
                </div>
                
                <div className="p-6 space-y-6">
                  <a
                    href={`tel:${businessInfo.contact.phone}`}
                    className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors group"
                  >
                    <div className="bg-[#2B5C4B]/5 p-3 rounded-xl group-hover:bg-[#2B5C4B]/10 transition-colors">
                      <Phone className="h-6 w-6 text-[#2B5C4B]" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-sans">{t.contact.contactInfo.phone.label}</p>
                      <p className="font-medium text-gray-900 font-sans">{businessInfo.contact.phone}</p>
                    </div>
                  </a>

                  <div className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors group">
                    <div className="bg-[#2B5C4B]/5 p-3 rounded-xl group-hover:bg-[#2B5C4B]/10 transition-colors">
                      <MapPin className="h-6 w-6 text-[#2B5C4B]" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-sans">{t.contact.contactInfo.address.label}</p>
                      <p className="font-medium text-gray-900 font-sans">{businessInfo.contact.address}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors group">
                    <div className="bg-[#2B5C4B]/5 p-3 rounded-xl group-hover:bg-[#2B5C4B]/10 transition-colors">
                      <Clock className="h-6 w-6 text-[#2B5C4B]" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-sans">{t.contact.contactInfo.hours.label}</p>
                      <p className="font-medium text-gray-900 font-sans">
                        Mon-Fri: {businessInfo.hours.weekday.morning} | {businessInfo.hours.weekday.evening}
                      </p>
                      <p className="font-medium text-gray-900 font-sans">Sat: {businessInfo.hours.saturday}</p>
                      <p className="font-medium text-gray-900 font-sans">Sun: {businessInfo.hours.sunday}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="p-6 bg-gradient-to-r from-[#2B5C4B] to-[#234539]">
                  <h2 className="text-xl font-semibold text-white font-heading">{t.contact.form.title}</h2>
                  <p className="text-white/80 mt-1 font-sans">{t.contact.form.subtitle}</p>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 font-sans">
                      {t.contact.form.name.label}
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="block w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#2B5C4B]/20 focus:border-[#2B5C4B] transition-colors font-sans"
                      placeholder={t.contact.form.name.placeholder}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 font-sans">
                      {t.contact.form.email.label}
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="block w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#2B5C4B]/20 focus:border-[#2B5C4B] transition-colors font-sans"
                      placeholder={t.contact.form.email.placeholder}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 font-sans">
                      {t.contact.form.phone.label}
                    </label>
                    <input
                      type="tel"
                      required
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="block w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#2B5C4B]/20 focus:border-[#2B5C4B] transition-colors font-sans"
                      placeholder={t.contact.form.phone.placeholder}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 font-sans">
                      {t.contact.form.message.label}
                    </label>
                    <textarea
                      required
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      rows={4}
                      className="block w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#2B5C4B]/20 focus:border-[#2B5C4B] transition-colors resize-none font-sans"
                      placeholder={t.contact.form.message.placeholder}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-6 bg-[#2B5C4B] text-white rounded-xl hover:bg-[#234539] transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed font-sans"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>{t.contact.form.sending}</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        <span>{t.contact.form.submit}</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>

          {/* Map Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-16"
          >
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="p-6 bg-gradient-to-r from-[#2B5C4B] to-[#234539]">
                <h2 className="text-xl font-semibold text-white font-heading">{t.contact.map.title}</h2>
                <p className="text-white/80 mt-1 font-sans">{t.contact.map.subtitle}</p>
              </div>
              <div className="h-80 lg:h-96">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3653.569965172857!2d72.38219340185242!3d23.606717556567656!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDM2JzI0LjIiTiA3MsKwMjInNTUuOSJF!5e0!3m2!1sen!2sin!4v1712483240000!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}