import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '../i18n/useTranslation';
import { Globe2, Languages } from 'lucide-react';

interface LanguageSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LanguageSelectionModal({ isOpen, onClose }: LanguageSelectionModalProps) {
  const { setLanguage } = useTranslation();

  const handleLanguageSelect = (lang: 'en' | 'gu') => {
    setLanguage(lang);
    localStorage.setItem('hasSelectedLanguage', 'true');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-[100]">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
          >
            {/* Header */}
            <div className="relative bg-gradient-to-br from-[#2B5C4B] to-[#234539] p-6 text-white">
              <div className="flex items-center gap-4">
                <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
                  <Globe2 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Select Your Language</h2>
                  <p className="text-white/80 text-sm mt-0.5">Choose your preferred language</p>
                </div>
              </div>
            </div>

            {/* Language Options */}
            <div className="p-6 space-y-4">
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                onClick={() => handleLanguageSelect('en')}
                className="w-full p-4 text-left rounded-xl border border-gray-200 hover:border-[#2B5C4B]/30 hover:bg-[#2B5C4B]/5 transition-all duration-300 group"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-[#2B5C4B]/5 p-3 rounded-lg group-hover:bg-[#2B5C4B]/10 transition-colors">
                    <Languages className="h-5 w-5 text-[#2B5C4B]" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">English</h3>
                    <p className="text-sm text-gray-500">Continue in English</p>
                  </div>
                </div>
              </motion.button>

              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                onClick={() => handleLanguageSelect('gu')}
                className="w-full p-4 text-left rounded-xl border border-gray-200 hover:border-[#2B5C4B]/30 hover:bg-[#2B5C4B]/5 transition-all duration-300 group"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-[#2B5C4B]/5 p-3 rounded-lg group-hover:bg-[#2B5C4B]/10 transition-colors">
                    <Languages className="h-5 w-5 text-[#2B5C4B]" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">ગુજરાતી</h3>
                    <p className="text-sm text-gray-500">ગુજરાતીમાં ચાલુ રાખો</p>
                  </div>
                </div>
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}