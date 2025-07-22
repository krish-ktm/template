import { motion } from 'framer-motion';
import { ResponsiveHeader } from './headers/ResponsiveHeader';
import { Footer } from './Footer';
import { Award, Star, Shield, Calendar, CheckCircle2, Phone, Trophy, Medal } from 'lucide-react';
import { useTranslation } from '../i18n/useTranslation';
import { Link } from 'react-router-dom';
import { SEO } from './SEO';
import { StructuredData } from './StructuredData';
import { doctorSchema } from '../config/structuredData';
import { translations } from '../translations'; // Import translations directly

export function AboutPage() {
  const { t, language } = useTranslation();
  
  // Get translations directly from the source to ensure we have the meta data
  const directTranslations = translations[language];
  
  // Create explicit variables for SEO values from direct translations
  const metaTitle = directTranslations?.meta?.aboutTitle || 'About Us';
  const metaDescription = directTranslations?.meta?.aboutDescription || 'Learn about our clinic and our expert doctors';
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
        ogUrl="https://drjemishskinclinic.com/about"
        twitterTitle={metaTitle}
        twitterDescription={metaDescription}
        twitterImage="https://drjemishskinclinic.com/twitter-image.jpg"
        canonicalUrl={window.location.href}
      />
      <StructuredData type="Person" data={doctorSchema} />
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
              {t.about.experience}
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1e3a5c] mb-4 sm:mb-6 font-heading"
            >
              {t.about.title}
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto px-4 sm:px-0 font-sans"
            >
              {t.about.subtitle}
            </motion.p>

            <div className="flex flex-wrap justify-center gap-3 mt-8">
              {[
                {
                  icon: Star,
                  text: t.about.qualification,
                  color: "from-emerald-400 to-emerald-500"
                },
                {
                  icon: Award,
                  text: t.about.yearsExperience,
                  color: "from-amber-400 to-amber-500"
                },
                {
                  icon: Shield,
                  text: t.about.specialization,
                  color: "from-rose-400 to-rose-500"
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="relative p-1"
                >
                  <div className="relative bg-white shadow-sm border border-gray-100 px-4 py-2 rounded-xl">
                    <div className="flex items-center gap-3">
                      <feature.icon className="h-4 w-4 text-[#2B5C4B]" />
                      <span className="text-sm font-medium text-gray-900 font-sans">
                        {feature.text}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Doctor Profile Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-16"
          >
            <div className="p-6 sm:p-8 bg-gradient-to-r from-[#2B5C4B] to-[#234539]">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-white/20 shadow-lg">
                  <img
                    src="/doctor-img.JPG"
                    alt="Dr. Jemish A. Patel"
                    className="w-full h-full object-cover object-center"
                  />
                </div>
                <div className="text-center md:text-left">
                  <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 font-heading">
                    {t.about.doctorName}
                  </h2>
                  <p className="text-white/90 text-lg mb-2 font-sans">
                    {t.about.doctorQualification}
                  </p>
                  <p className="text-white/80 font-sans mb-2">
                    {t.about.doctorRegistration}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-6 sm:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 font-heading">
                    {t.about.expertise.title}
                  </h3>
                  <ul className="space-y-3">
                    {t.about.expertise.items.map((item, index) => (
                      <li key={index} className="flex items-center gap-3">
                        <CheckCircle2 className="h-5 w-5 text-[#2B5C4B]" />
                        <span className="text-gray-700 font-sans">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 font-heading">
                    {t.about.education.title}
                  </h3>
                  <ul className="space-y-4">
                    {t.about.education.items.map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="bg-[#2B5C4B]/5 p-2 rounded-lg mt-1">
                          <Award className="h-4 w-4 text-[#2B5C4B]" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 font-heading">{item.degree}</p>
                          <p className="text-sm text-gray-600 font-sans">{item.institution}</p>
                          <p className="text-sm text-gray-500 font-sans">{item.year}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Professional Memberships & Achievements Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-16"
          >
            <div className="p-6 sm:p-8 bg-gradient-to-r from-[#2B5C4B] to-[#234539]">
              <h2 className="text-xl sm:text-2xl font-bold text-white font-heading">
                {t.about.professional.title}
              </h2>
              <p className="text-white/80 mt-1 font-sans">
                {t.about.professional.subtitle}
              </p>
            </div>
            
            <div className="p-6 sm:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Professional Memberships */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 font-heading flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-[#2B5C4B]" />
                    {t.about.professional.memberships.title}
                  </h3>
                  <ul className="space-y-3">
                    {t.about.professional.memberships.items.map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="bg-[#2B5C4B]/5 p-2 rounded-lg mt-1">
                          <CheckCircle2 className="h-4 w-4 text-[#2B5C4B]" />
                        </div>
                        <div>
                          <span className="text-gray-700 font-sans">{item}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Achievements */}
                <div>
                  {t.about.professional.achievements.title && (
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 font-heading flex items-center gap-2">
                      <Medal className="h-5 w-5 text-[#2B5C4B]" />
                      {t.about.professional.achievements.title}
                    </h3>
                  )}
                  <ul className="space-y-4">
                    {t.about.professional.achievements.items.map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="bg-[#2B5C4B]/5 p-2 rounded-lg mt-1">
                          <Award className="h-4 w-4 text-[#2B5C4B]" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 font-sans">{item.title}</p>
                          {item.description && item.description.length > 0 && (
                            <p className="text-sm text-gray-600 font-sans">{item.description}</p>
                          )}
                          {item.year && (
                            <p className="text-sm text-gray-500 font-sans">{item.year}</p>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Clinic Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-16"
          >
            <div className="p-6 sm:p-8 bg-gradient-to-r from-[#2B5C4B] to-[#234539]">
              <h2 className="text-xl sm:text-3xl font-bold text-white mb-1 sm:mb-2 font-heading">
                {t.about.clinicName}
              </h2>
              <p className="text-sm sm:text-base text-white/90 font-sans">
                {t.about.clinicDescription}
              </p>
            </div>
            
            <div className="p-6 sm:p-8">
              {/* Amenities */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6 font-heading">{t.about.amenities}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {t.about.amenitiesList.map((amenity, index) => (
                    <div key={index} className="flex items-center gap-3 p-4 bg-[#2B5C4B]/5 rounded-xl">
                      <CheckCircle2 className="h-5 w-5 text-[#2B5C4B] flex-shrink-0" />
                      <span className="text-gray-700 font-sans">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="bg-[#2B5C4B] rounded-2xl p-8 sm:p-12">
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4 font-heading">
                {t.about.cta.title}
              </h3>
              <p className="text-white/90 text-base sm:text-lg mb-8 max-w-2xl mx-auto font-sans">
                {t.about.cta.description}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/appointment"
                  className="inline-flex items-center justify-center px-6 py-3 bg-white text-[#2B5C4B] rounded-xl hover:bg-gray-50 transition-colors shadow-sm hover:shadow text-base sm:text-lg font-medium gap-2 group font-sans"
                >
                  {t.about.cta.bookButton}
                  <Calendar className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center px-6 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors text-base sm:text-lg font-medium gap-2 group border border-white/30 font-sans"
                >
                  {t.about.cta.contactButton}
                  <Phone className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}