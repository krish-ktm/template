import { useTranslation } from '../../i18n/useTranslation';
import { useRef } from 'react';

/**
 * Language toggle component that switches between English and Gujarati.
 * This implementation uses CSS only for transitions and avoids unnecessary
 * animations during page navigation.
 */
export function LanguageToggle() {
  const { language, setLanguage } = useTranslation();
  const toggleRef = useRef<HTMLDivElement>(null);
  
  const toggleLanguage = () => {
    // Only add the transition class when the user clicks to toggle
    if (toggleRef.current) {
      toggleRef.current.classList.add('toggle-with-transition');
      
      // Remove the transition class after the animation completes
      setTimeout(() => {
        if (toggleRef.current) {
          toggleRef.current.classList.remove('toggle-with-transition');
        }
      }, 300); // match the transition duration
    }
    
    setLanguage(language === 'en' ? 'gu' : 'en');
  };

  return (
    <div className="relative">
      <button
        onClick={toggleLanguage}
        className="relative w-16 h-8 rounded-full bg-gray-100 p-1 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#2B5C4B]/20 hover:bg-gray-200 active:scale-95"
      >
        {/* Background Labels */}
        <div className="absolute inset-0 flex justify-between items-center px-2 pointer-events-none">
          <span className={`text-[10px] font-medium transition-colors duration-300 ${
            language === 'gu' ? 'text-[#2B5C4B] font-semibold' : 'text-gray-400'
          }`}>
            ગુ
          </span>
          <span className={`text-[10px] font-medium transition-colors duration-300 ${
            language === 'en' ? 'text-[#2B5C4B] font-semibold' : 'text-gray-400'
          }`}>
            En
          </span>
        </div>

        {/* Sliding Circle - using a reference to control when transitions happen */}
        <div 
          ref={toggleRef}
          className={`relative w-6 h-6 rounded-full bg-gradient-to-br from-[#2B5C4B] to-[#234539] shadow-md flex items-center justify-center ${language === 'en' ? 'translate-x-8' : 'translate-x-0'}`}
        >
          <span className="text-[10px] font-semibold text-white">
            {language === 'en' ? 'En' : 'ગુ'}
          </span>
        </div>
      </button>
    </div>
  );
}