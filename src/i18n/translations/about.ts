import { AboutTranslations } from '../types/about';
import { businessInfo, getFormattedDoctorInfo, getFormattedExperience } from '../../config/business';

export const aboutTranslations: Record<string, AboutTranslations> = {
  en: {
    title: "About Dr. Jemish A Patel",
    subtitle: "Pioneering Dermatologist & Laser Cosmetic Treatments with 17+ years of experience.",
    experience: `${getFormattedExperience('en')} Years Experience`,
    qualification: "MBBS, MD (Skin-VD)",
    yearsExperience: `${getFormattedExperience('en')} Years Experience`,
    specialization: "Dermatologist",
    
    doctorName: businessInfo.doctor.name,
    doctorQualification: "MBBS, MD (Skin-VD)",
    doctorSpecialization: "",
    doctorRegistration: "Reg. No. G-16930",
    
    expertise: {
      title: "Areas of Expertise",
      items: [
        "CO2 Laser Treatment",
        "Vitiligo Surgery",
        "Medifacial",
        "Diode Hair Removal Therapy",
        "Medical Dermatology",
        "Cosmetic Dermatology"
      ]
    },
    
    education: {
      title: "Education & Training",
      items: [
        {
          degree: "MBBS",
          institution: "PDU Medical College, Rajkot",
          year: "2004"
        },
        {
          degree: "MD in Dermatology",
          institution: "M P SHAH Medical College, Jamnagar",
          year: "2008"
        }
      ]
    },

    professional: {
      title: "Professional Memberships & Achievements",
      subtitle: "Recognition and affiliations in the field of dermatology",
      memberships: {
        title: "Professional Memberships & Achievements",
        items: [
          "Indian Medical Association (IMA)",
          "Indian Association of Dermatologists, Venereologists and Leprologists (IADVL)",
          "Association of Cutaneous Surgeons of India (ACSI)"
        ]
      },
      achievements: {
        title: "",
        items: [
          {
            title: "Started Private Practice",
            description: "",
            year: "2008"
          },
          {
            title: "First to Introduce CO2 Laser Treatment",
            description: "",
            year: "2008"
          },
          {
            title: "First to Introduce Diode Hair Removal Therapy",
            description: "",
            year: "2013"
          }
        ]
      }
    },

    clinicName: "Shubham Skin & Laser Clinic",
    clinicDescription: "A state-of-the-art dermatology clinic equipped with the latest technology and staffed by experienced professionals",
    amenities: "Clinic Amenities",
    amenitiesList: [
      "Advanced Laser Equipment",
      "Hygienic Environment",
      "Comfortable Waiting Area",
      "Modern Consultation Rooms",
      "Lift Available",
      "Dedicated Procedure Room"
    ],

    cta: {
      title: "Ready to Transform Your Skin?",
      description: "Schedule your consultation today and take the first step towards healthier, more beautiful skin.",
      bookButton: "Book Appointment",
      contactButton: "Contact Us"
    }
  },
  gu: {
    title: "ડૉ. જેમિશ એ. પટેલ વિશે",
    subtitle: `અદ્યતન ત્વચા સારવારમાં ${getFormattedExperience('gu')} વર્ષના અનુભવ સાથે પાયોનિયર ડર્મેટોલોજિસ્ટ`,
    experience: `${getFormattedExperience('gu')} વર્ષનો અનુભવ`,
    qualification: "એમબીબીએસ, એમડી (સ્કિન-વીડી)",
    yearsExperience: `${getFormattedExperience('gu')} વર્ષનો અનુભવ`,
    specialization: "ડર્મેટોલોજિસ્ટ",
    
    doctorName: getFormattedDoctorInfo('gu').name,
    doctorQualification: "એમબીબીએસ, એમડી (સ્કિન-વીડી)",
    doctorSpecialization: "",
    doctorRegistration: "રજી. નં. જી-૧૬૯૩૦",
    
    expertise: {
      title: "નિપુણતાના ક્ષેત્રો",
      items: [
        "CO2 લેસર ટ્રીટમેન્ટ",
        "વિટિલિગો સર્જરી",
        "મેડિફેશિયલ",
        "ડાયોડ હેર રિમુવલ થેરાપી",
        "મેડિકલ ડર્મેટોલોજી",
        "કોસ્મેટિક ડર્મેટોલોજી"
      ]
    },
    
    education: {
      title: "શિક્ષણ અને તાલીમ",
      items: [
        {
          degree: "એમબીબીએસ",
          institution: "પીડીયુ મેડિકલ કોલેજ, રાજકોટ",
          year: "૨૦૦૪"
        },
        {
          degree: "એમડી ઇન ડર્મેટોલોજી",
          institution: "એમ પી શાહ મેડિકલ કોલેજ, જામનગર",
          year: "૨૦૦૮"
        }
      ]
    },

    professional: {
      title: "પ્રોફેશનલ મેમ્બરશીપ્સ એન્ડ અચીવમેન્ટ્સ",
      subtitle: "ડર્મેટોલોજીના ક્ષેત્રમાં માન્યતા અને જોડાણો",
      memberships: {
        title: "પ્રોફેશનલ મેમ્બરશીપ્સ એન્ડ અચીવમેન્ટ્સ",
        items: [
          "ઈન્ડિયન મેડિકલ એસોસિએશન (IMA)",
          "ઈન્ડિયન એસોસિએશન ઓફ ડર્મેટોલોજિસ્ટ્સ, વેનેરોલોજિસ્ટ્સ એન્ડ લેપ્રોલોજિસ્ટ્સ (IADVL)",
          "એસોસિએશન ઓફ ક્યુટેનિયસ સર્જન્સ ઓફ ઈન્ડિયા (ACSI)"
        ]
      },
      achievements: {
        title: "",
        items: [
          {
            title: "ખાનગી પ્રેક્ટિસ શરૂ કરી",
            description: "",
            year: "૨૦૦૮"
          },
          {
            title: "CO2 લેસર ટ્રીટમેન્ટ શરૂ કર્યું",
            description: "",
            year: "૨૦૦૮"
          },
          {
            title: "ડાયોડ હેર રિમુવલ થેરાપી શરૂ કરી",
            description: "",
            year: "૨૦૧૩"
          }
        ]
      }
    },

    clinicName: "શુભમ સ્કિન એન્ડ લેસર ક્લિનિક",
    clinicDescription: "નવીનતમ ટેકનોલોજી અને અનુભવી વ્યાવસાયિકો સાથે સજ્જ અત્યાધુનિક ડર્મેટોલોજી ક્લિનિક",
    amenities: "ક્લિનિક સુવિધાઓ",
    amenitiesList: [
      "એડવાન્સ્ડ લેઝર ઇક્વિપમેન્ટ",
      "સ્વચ્છ વાતાવરણ",
      "કમ્ફર્ટેબલ વેઇટિંગ એરિયા",
      "મોડર્ન કન્સલ્ટેશન રૂમ્સ",
      "લિફ્ટ એવેલેબલ",
      "સમર્પિત પ્રોસીજર રૂમ"
    ],

    cta: {
      title: "તમારી ત્વચાનું પરિવર્તન કરવા તૈયાર છો?",
      description: "આજે જ તમારી કન્સલ્ટેશન શેડ્યૂલ કરો અને વધુ સ્વસ્થ, વધુ સુંદર ત્વચા તરફ પ્રથમ પગલું ભરો.",
      bookButton: "એપોઇન્ટમેન્ટ બુક કરો",
      contactButton: "અમારો સંપર્ક કરો"
    }
  }
};