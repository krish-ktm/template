import { ServicesTranslations } from '../types/services';
import { businessInfo, getFormattedExperience } from '../../config/business';

export const servicesTranslations: Record<string, ServicesTranslations> = {
  en: {
    title: `Services at ${businessInfo.name}`,
    subtitle: `Comprehensive dermatological care with ${getFormattedExperience('en')} years of expertise`,
    expertCare: "Expert Care",
    viewAll: "View All Services",
    categories: {
      medical: "Medical Therapy",
      hair: "Hair Treatment",
      diagnostic: "Mole Removal",
      skinGlow: "Skin Glow Therapy",
      scar: "Scar Therapy",
      tattoo: "Tattoo Removal",
      laser: "Laser Hair Removal Therapy",
      surgery: "Leucoderma (White Spot) Therapy",
      ear: "Ear Lobe Repair"
    },
    lists: {
      medical: [
        "All types of skin problems",
        "Nail problems",
        "Skin problems of children",
        "Drug reactions"
      ],
      hair: [
        "All type of hair loss",
        "Alopecia areata",
        "Androgenetic alopecia"
      ],
      diagnostic: [
        "Dermatoscopy",
        "Skin Biopsy",
        "Woods lamp"
      ],
      skinGlow: [
        "Medifacial",
        "Carbon peeling",
        "Chemical peels",
        "Hydra facial",
        "Laser toning",
        "Mesotherapy"
      ],
      scar: [
        "For acne scars",
        "Accidental scar",
        "Chicken pox scars"
      ],
      tattoo: [
        "Professional tattoo",
        "Accidental tattoo"
      ],
      laser: [
        "Freckles",
        "Moles",
        "Cysts",
        "Corn",
        "Skin tags"
      ],
      surgery: [
        "Surgery for leukoderma (white spots)"
      ],
      ear: [
        "Ear lobe repair"
      ]
    },
    cta: {
      title: "Ready to Get Started?",
      subtitle: "Experience our expert dermatological care today",
      button: "Book an Appointment"
    }
  },
  gu: {
    title: "શુભમ સ્કિન એન્ડ લેસર ક્લિનિકની સેવાઓ",
    subtitle: `${getFormattedExperience('gu')} વર્ષના અનુભવ સાથે વ્યાપક ડર્મેટોલોજિકલ સંભાળ`,
    expertCare: "નિષ્ણાત સંભાળ",
    viewAll: "બધી સેવાઓ જુઓ",
    categories: {
      medical: "મેડિકલ થેરાપી",
      hair: "હેર ટ્રીટમેન્ટ",
      diagnostic: "મોલ રિમૂવલ",
      skinGlow: "સ્કિન ગ્લો થેરાપી",
      scar: "સ્કાર થેરાપી",
      tattoo: "ટેટૂ રિમૂવલ",
      laser: "લેઝર હેર રિમૂવલ થેરાપી",
      surgery: "લ્યુકોડરમા ( વ્હાઇટ સ્પોટ) થેરાપી",
      ear: "ઇયર લોબ રિપેર"
    },
    lists: {
      medical: [
        "ઓલ ટાઇપ્સ ઓફ સ્કિન પ્રોબ્લેમ્સ",
        "નેઇલ પ્રોબ્લેમ્સ",
        "સ્કિન પ્રોબ્લેમ્સ ઓફ ચિલ્ડ્રન",
        "ડ્રગ રિએક્શન્સ"
      ],
      hair: [
        "ઓલ ટાઇપ ઓફ હેર લોસ",
        "એલોપેશિયા એરિયાટા",
        "એન્ડ્રોજેનેટિક એલોપેશિયા"
      ],
      diagnostic: [
        "ડર્મેટોસ્કોપી",
        "સ્કિન બાયોપ્સી",
        "વુડ્સ લેમ્પ"
      ],
      skinGlow: [
        "મેડિફેશિયલ",
        "કાર્બન પીલિંગ",
        "કેમિકલ પીલ્સ",
        "હાયડ્રા ફેશિયલ",
        "લેઝર ટોનિંગ",
        "મેસોથેરાપી"
      ],
      scar: [
        "ફોર એક્ને સ્કાર્સ",
        "એક્સિડેન્ટલ સ્કાર",
        "ચિકન પોક્સ સ્કાર્સ"
      ],
      tattoo: [
        "પ્રોફેશનલ ટેટૂ",
        "એક્સિડેન્ટલ ટેટૂ"
      ],
      laser: [
        "ફ્રેકલ્સ",
        "મોલ્સ",
        "સિસ્ટ્સ",
        "કોર્ન",
        "સ્કિન ટેગ્સ"
      ],
      surgery: [
        "સર્જરી ફોર લ્યુકોડર્મા (વ્હાઇટ સ્પોટ્સ)"
      ],
      ear: [
        "ઇયર લોબ રિપેર"
      ]
    },
    cta: {
      title: "શરૂ કરવા માટે તૈયાર છો?",
      subtitle: "આજે જ અમારી નિષ્ણાત ડર્મેટોલોજિકલ કેર અનુભવો",
      button: "એપોઈન્ટમેન્ટ બુક કરો"
    }
  }
};