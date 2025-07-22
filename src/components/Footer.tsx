import { Link } from 'react-router-dom';
import { Phone, MapPin, Clock, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from '../i18n/useTranslation';

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="relative bg-[#2B5C4B] text-white overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-6 sm:pt-16 sm:pb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
          {/* About Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold mb-4 bg-clip-text text-white font-heading">
              {t.footer.clinicName}
            </h3>
            <p className="text-white/80 leading-relaxed text-sm font-sans">
              {t.footer.description}
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="text-lg font-semibold mb-6 text-white font-heading">{t.footer.quickLinks.title}</h3>
            <ul className="space-y-3">
              {[
                { label: t.footer.quickLinks.home, to: "/" },
                { label: t.footer.quickLinks.about, to: "/about" },
                { label: t.footer.quickLinks.services, to: "/services" },
                { label: t.footer.quickLinks.gallery, to: "/gallery" },
                { label: t.footer.quickLinks.contact, to: "/contact" },
                { label: t.footer.quickLinks.bookAppointment, to: "/appointment" },
                { label: t.footer.quickLinks.mrAppointment, to: "/mr-appointment" }
              ].map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.to}
                    className="text-white/80 hover:text-white transition-colors duration-200 flex items-center gap-2 group text-sm font-sans"
                  >
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-lg font-semibold mb-6 text-white font-heading">{t.footer.contactInfo.title}</h3>
            <ul className="space-y-4">
              <li>
                <a
                  href={`tel:${t.footer.contactInfo.phone}`}
                  className="flex items-center gap-3 text-white/80 hover:text-white transition-colors duration-200 group font-sans"
                >
                  <div className="bg-white/10 p-2 rounded-lg group-hover:bg-white/20 transition-colors">
                    <Phone className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-sans">{t.footer.contactInfo.phone}</span>
                </a>
              </li>
              <li className="flex items-center gap-3 text-white/80 group font-sans">
                <div className="bg-white/10 p-2 rounded-lg">
                  <MapPin className="h-4 w-4" />
                </div>
                <span className="text-sm font-sans">{t.footer.contactInfo.address}</span>
              </li>
              <li className="flex items-start gap-3 text-white/80 group font-sans">
                <div className="bg-white/10 p-2 rounded-lg mt-0.5">
                  <Clock className="h-4 w-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-sans">{t.footer.contactInfo.hours.weekday}</span>
                  <span className="text-sm font-sans text-white/70 mt-1">{t.footer.contactInfo.hours.saturday}</span>
                </div>
              </li>
            </ul>
          </motion.div>

          {/* Map Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-lg font-semibold mb-6 text-white font-heading">{t.footer.map.title}</h3>
            <div className="rounded-lg overflow-hidden h-[200px]">
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
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="border-t border-white/10 mt-8 pt-4 text-center"
        >
          <p className="text-white/60 text-sm font-sans">
            {t.footer.copyright} | Developed by <a href="https://ipratik.me" target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-white transition-colors">ipratik.me</a>
          </p>
        </motion.div>
      </div>
    </footer>
  );
}