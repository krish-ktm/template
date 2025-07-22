import { FooterTranslations } from '../types/footer';
import { businessInfo, getFormattedAddress, getFormattedPhone, getFormattedHours } from '../../config/business';

export const footerTranslations: Record<string, FooterTranslations> = {
  en: {
    clinicName: businessInfo.name,
    description: `Expert dermatological care with ${businessInfo.doctor.name}, providing comprehensive skin treatments using the latest technology and personalized care plans.`,
    quickLinks: {
      title: "Quick Links",
      home: "Home",
      about: "About Us",
      services: "Our Services",
      gallery: "Gallery",
      contact: "Contact Us",
      bookAppointment: "Book Appointment",
      mrAppointment: "MR Appointment"
    },
    contactInfo: {
      title: "Contact Info",
      phone: businessInfo.contact.phone,
      email: businessInfo.contact.email,
      address: businessInfo.contact.address,
      hours: {
        weekday: getFormattedHours('en').weekday,
        saturday: getFormattedHours('en').saturday,
        sunday: getFormattedHours('en').sunday
      }
    },
    social: {
      title: "Follow Us"
    },
    map: {
      title: "Our Location"
    },
    copyright: `© ${new Date().getFullYear()} ${businessInfo.name}. All rights reserved.`
  },
  gu: {
    clinicName: "શુભમ સ્કિન એન્ડ લેસર ક્લિનિક",
    description: `ડૉ. જેમિશ એ. પટેલ સાથે નિષ્ણાત ડર્મેટોલોજિકલ કેર, નવીનતમ ટેકનોલોજી અને વ્યક્તિગત કેર પ્લાન્સનો ઉપયોગ કરીને વ્યાપક ત્વચા સારવાર પ્રદાન કરે છે.`,
    quickLinks: {
      title: "ક્વિક લિંક્સ",
      home: "હોમ",
      about: "અમારા વિશે",
      services: "અમારી સેવાઓ",
      gallery: "ગેલેરી",
      contact: "સંપર્ક કરો",
      bookAppointment: "એપોઈન્ટમેન્ટ બુક કરો",
      mrAppointment: "MR એપોઈન્ટમેન્ટ"
    },
    contactInfo: {
      title: "સંપર્ક માહિતી",
      phone: getFormattedPhone('gu'),
      email: businessInfo.contact.email,
      address: getFormattedAddress('gu'),
      hours: {
        weekday: getFormattedHours('gu').weekday,
        saturday: getFormattedHours('gu').saturday,
        sunday: getFormattedHours('gu').sunday
      }
    },
    social: {
      title: "અમને ફોલો કરો"
    },
    map: {
      title: "અમારું સ્થાન"
    },
    copyright: `© ${new Date().getFullYear()} શુભમ સ્કિન એન્ડ લેસર ક્લિનિક. બધા અધિકારો સુરક્ષિત.`
  }
};