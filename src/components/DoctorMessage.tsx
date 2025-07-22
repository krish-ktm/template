import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, MessageSquare } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { useDoctorMessage } from '../contexts/DoctorMessageContext';
import { useTranslation } from '../i18n/useTranslation';

export function DoctorMessage() {
  const { message, loading, isVisible, setIsVisible } = useDoctorMessage();
  const { language } = useLanguage();
  const { t } = useTranslation();

  const getMessageText = () => {
    if (!message) return '';
    
    if (language === 'gu' && message.message_gu) {
      return message.message_gu;
    }
    
    return message.message_en;
  };

  if (loading || !message) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="fixed bottom-4 md:bottom-6 left-3 md:left-4 right-3 md:right-4 z-40"
        >
          <div className="max-w-2xl mx-auto">
            {/* Light border with glowing effect */}
            <div className="relative rounded-xl md:rounded-2xl p-[2px] overflow-hidden">
              {/* Light border gradient */}
              <div 
                className="absolute inset-0 rounded-xl md:rounded-2xl bg-gradient-to-br from-[#FED7AA]/40 via-[#FDBA74]/40 to-[#F97316]/40 z-0"
              />
              
              {/* Enhanced glowing border effect */}
              <motion.div 
                className="absolute inset-0 rounded-xl md:rounded-2xl z-[1] overflow-hidden"
                animate={{
                  boxShadow: [
                    "inset 0 0 15px rgba(249, 115, 22, 0.4)", 
                    "inset 0 0 20px rgba(249, 115, 22, 0.6)",
                    "inset 0 0 15px rgba(249, 115, 22, 0.4)"
                  ]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              
              {/* Pulsing glow effect */}
              <motion.div
                className="absolute inset-0 rounded-xl md:rounded-2xl z-0"
                style={{ 
                  background: "radial-gradient(circle at 50% 50%, rgba(249, 115, 22, 0.3) 0%, rgba(223, 92, 18, 0.1) 40%, transparent 70%)",
                }}
                animate={{
                  opacity: [0.6, 0.8, 0.6]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              
              {/* Outer glow effect */}
              <div className="absolute inset-0 rounded-xl md:rounded-2xl" 
                style={{ 
                  boxShadow: "0 0 15px rgba(249, 115, 22, 0.3)",
                  zIndex: 0
                }} 
              />
              
              {/* Main content container */}
              <motion.div 
                className="relative bg-gradient-to-br from-[#F97316] to-[#C2410C] rounded-xl md:rounded-xl overflow-hidden backdrop-blur-sm z-10"
                animate={{
                  boxShadow: [
                    "0 8px 20px rgba(249,115,22,0.15)", 
                    "0 8px 20px rgba(249,115,22,0.25)",
                    "0 8px 20px rgba(249,115,22,0.15)"
                  ]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                {/* Inner content area */}
                <div className="relative overflow-hidden bg-gradient-to-br from-[#F97316] to-[#C2410C] h-full w-full">
                  {/* Decorative Elements */}
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
                    <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
                  </div>

                  {/* Animated background gradient */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-white/15 via-white/8 to-transparent"
                    animate={{
                      backgroundPosition: ["0% 0%", "100% 0%"],
                    }}
                    transition={{
                      duration: 6,
                      repeat: Infinity,
                      ease: "easeInOut",
                      repeatType: "reverse"
                    }}
                    style={{
                      backgroundSize: "200% 100%"
                    }}
                  />
                  
                  <div className="relative px-4 py-4 sm:px-5 sm:py-4 md:px-6 md:py-4">
                    <div className="flex items-center md:items-start gap-3 md:gap-4">
                      <motion.div
                        className="relative flex-shrink-0 bg-gradient-to-br from-[#FDBA74] to-[#F97316] p-3 md:p-3 rounded-lg md:rounded-xl overflow-hidden group"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <MessageSquare className="h-5 w-5 md:h-6 md:w-6 text-white relative z-10" />
                        <motion.div 
                          className="absolute inset-0 bg-white/20"
                          initial={{ scale: 0, opacity: 0 }}
                          whileHover={{ scale: 2, opacity: 0.5 }}
                          transition={{ duration: 0.5 }}
                          style={{ originX: 0.5, originY: 0.5 }}
                        />
                      </motion.div>
                      
                      <div className="flex-1 min-w-0">
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                        >
                          <h3 className="text-sm md:text-sm font-medium text-white mb-1 md:mb-1 flex items-center gap-2">
                            {t.doctorMessage.title}
                            <motion.div
                              animate={{
                                rotate: [0, 10, -10, 0],
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut"
                              }}
                            >
                              <Sparkles className="h-4 w-4 md:h-4 md:w-4 text-white/90" />
                            </motion.div>
                          </h3>
                          <div className="relative">
                            <p 
                              className="text-white text-sm sm:text-sm md:text-base leading-snug md:leading-relaxed line-clamp-5 md:line-clamp-none font-medium"
                              dir={language === 'gu' ? 'auto' : 'ltr'}
                            >
                              {getMessageText()}
                            </p>
                            <div className="absolute left-0 -bottom-1 w-16 h-0.5 bg-gradient-to-r from-[#F97316] to-transparent rounded" />
                          </div>
                        </motion.div>
                      </div>
                      
                      <motion.button
                        onClick={() => setIsVisible(false)}
                        className="flex-shrink-0 p-2 md:-mt-1 md:-mr-2 md:p-2 rounded-lg hover:bg-white/10 transition-colors group relative overflow-hidden"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        aria-label="Close message"
                      >
                        <X className="h-5 w-5 md:h-5 md:w-5 text-white/90 relative z-10" />
                        <motion.div 
                          className="absolute inset-0 bg-white/20"
                          initial={{ scale: 0, opacity: 0 }}
                          whileHover={{ scale: 2, opacity: 0.5 }}
                          transition={{ duration: 0.5 }}
                          style={{ originX: 0.5, originY: 0.5 }}
                        />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}