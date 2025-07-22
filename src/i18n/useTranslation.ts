import { useContext } from 'react';
import { LanguageContext } from './LanguageContext';
import { translations } from './translations';
import { LanguageContent } from './types';

export function useTranslation() {
  const { language, setLanguage } = useContext(LanguageContext);
  return {
    t: translations[language] as LanguageContent,
    language,
    setLanguage
  };
}