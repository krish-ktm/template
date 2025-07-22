import { HeaderTranslations } from '../types/header';
import { businessInfo, getFormattedHours, getFormattedAddress, getFormattedPhone } from '../../config/business';

export const headerTranslations: Record<string, HeaderTranslations> = {
  en: {
    clinicName: businessInfo.name,
    bookNow: "Book Appointment",
    contact: {
      phone: businessInfo.contact.phone,
      address: businessInfo.contact.address,
      hours: {
        weekday: getFormattedHours('en').weekday,
        saturday: getFormattedHours('en').saturday,
        sunday: getFormattedHours('en').sunday
      }
    },
    language: {
      select: 'Select Language',
      english: 'English',
      gujarati: 'ગુજરાતી'
    }
  },
  gu: {
    clinicName: 'શુભમ સ્કિન એન્ડ લેસર ક્લિનિક',
    bookNow: "એપોઈન્ટમેન્ટ બુક કરો",
    contact: {
      phone: getFormattedPhone('gu'),
      address: getFormattedAddress('gu'),
      hours: {
        weekday: getFormattedHours('gu').weekday,
        saturday: getFormattedHours('gu').saturday,
        sunday: getFormattedHours('gu').sunday
      }
    },
    language: {
      select: 'ભાષા પસંદ કરો',
      english: 'English',
      gujarati: 'ગુજરાતી'
    }
  }
};