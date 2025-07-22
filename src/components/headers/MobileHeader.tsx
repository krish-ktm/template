import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Calendar, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '../../i18n/useTranslation';
import { LanguageToggle } from './LanguageToggle';

export function MobileHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useTranslation();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="fixed w-full z-50">
      {/* Main Header */}
      <div className="bg-white shadow-sm">
        <div className="px-4">
          <div className="flex justify-between items-center h-14">
            <Link to="/" className="block">
              <img 
                src="/shubham-logo.png" 
                alt="Shubham Skin & Laser Clinic" 
                className="h-10 w-auto"
              />
            </Link>

            <div className="flex items-center gap-3">
              <LanguageToggle />

              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-lg text-gray-600 hover:text-[#2B5C4B] hover:bg-[#2B5C4B]/5 transition-colors"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-white border-t border-gray-100 overflow-hidden"
          >
            <div className="px-4 py-3 space-y-1">
              {[
                { path: '/', label: t.navigation.home },
                { path: '/about', label: t.navigation.about },
                { path: '/services', label: t.navigation.services },
                { path: '/gallery', label: t.navigation.gallery },
                { path: '/contact', label: t.navigation.contact },
                { path: '/mr-appointment', label: t.navigation.mrAppointment }
              ].map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`block px-3 py-2 text-base font-medium rounded-lg transition-colors font-sans ${
                    isActive(item.path) 
                      ? 'bg-[#2B5C4B]/5 text-[#2B5C4B]' 
                      : 'text-gray-600 hover:text-[#2B5C4B] hover:bg-[#2B5C4B]/5'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}

              <Link
                to="/appointment"
                className="flex items-center gap-2 px-3 py-2 mt-4 bg-[#2B5C4B] text-white rounded-lg hover:bg-[#234539] transition-colors text-base font-medium font-sans"
                onClick={() => setIsMenuOpen(false)}
              >
                <Calendar className="h-5 w-5" />
                {t.header.bookNow}
              </Link>
            </div>

            {/* Contact Info */}
            <div className="mt-4 px-4 py-3 bg-[#2B5C4B]/5">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-[#2B5C4B] font-sans">
                  <MapPin className="h-4 w-4 flex-shrink-0" />
                  <span>{t.header.contact.address}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}