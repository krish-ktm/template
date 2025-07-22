export const businessInfo = {
  name: "Shubham Skin & Laser Clinic",
  doctor: {
    name: "Dr. Jemish A. Patel",
    qualifications: "MBBS, MD",
    specialization: "Dermatologist, Cosmetic Surgeon & Trichologist",
    university: "Saurashtra University (2008)",
    experience: 14,
    startYear: 2008
  },
  contact: {
    phone: "+91 99095 87003",
    email: "contact@shubhamskinlaser.com",
    address: "2nd Floor, Avi Square, Opp. Swaminarayan Temple, Radhanpur Circle, Mehsana - 384002, Gujarat"
  },
  hours: {
    weekday: {
      morning: "9:30 AM - 12:30 PM",
      evening: "4:30 PM - 6:30 PM"
    },
    saturday: "9:30 AM - 12:30 PM",
    sunday: "Closed"
  },
  social: {
    facebook: "#",
    twitter: "#",
    instagram: "#",
    linkedin: "#"
  }
};

const translateToGujaratiDigits = (text: string) => {
  const gujaratiDigits = {
    '0': '૦',
    '1': '૧',
    '2': '૨',
    '3': '૩',
    '4': '૪',
    '5': '૫',
    '6': '૬',
    '7': '૭',
    '8': '૮',
    '9': '૯'
  };
  
  // Only translate the digits
  return text.replace(/[0-9]/g, digit => gujaratiDigits[digit as keyof typeof gujaratiDigits]);
};

export const getFormattedHours = (language: 'en' | 'gu') => {
  if (language === 'gu') {
    // For Gujarati, we remove AM/PM since we already use "સવારે" (morning) and "સાંજે" (evening)
    // Use a more comprehensive regex to remove AM/PM regardless of formatting
    const morningTime = businessInfo.hours.weekday.morning.replace(/\s*AM\s*/gi, '').replace(/\s*PM\s*/gi, '');
    const eveningTime = businessInfo.hours.weekday.evening.replace(/\s*AM\s*/gi, '').replace(/\s*PM\s*/gi, '');
    const saturdayTime = businessInfo.hours.saturday.replace(/\s*AM\s*/gi, '').replace(/\s*PM\s*/gi, '');
    
    // Then translate the digits
    const morning = translateToGujaratiDigits(morningTime);
    const evening = translateToGujaratiDigits(eveningTime);
    const saturday = translateToGujaratiDigits(saturdayTime);
    
    return {
      weekday: `સોમવાર - શુક્રવાર: સવારે ${morning} | સાંજે ${evening}`,
      saturday: `શનિવાર: સવારે ${saturday}`,
      sunday: `રવિવાર: ${businessInfo.hours.sunday}`
    };
  }

  return {
    weekday: `Monday - Friday: ${businessInfo.hours.weekday.morning} | ${businessInfo.hours.weekday.evening}`,
    saturday: `Saturday: ${businessInfo.hours.saturday}`,
    sunday: `Sunday: ${businessInfo.hours.sunday}`
  };
};

export const getFormattedAddress = (language: 'en' | 'gu') => {
  if (language === 'gu') {
    const address = 'બીજો માળ, અવી સ્ક્વેર, સ્વામિનારાયણ મંદિરની સામે, રાધનપુર સર્કલ, મહેસાણા - ૩૮૪૦૦૨, ગુજરાત';
    return translateToGujaratiDigits(address);
  }
  return businessInfo.contact.address;
};

export const getFormattedPhone = (language: 'en' | 'gu') => {
  if (language === 'gu') {
    const phone = businessInfo.contact.phone;
    // Replace each digit with its Gujarati equivalent
    const gujaratiDigits = {
      '0': '૦',
      '1': '૧',
      '2': '૨',
      '3': '૩',
      '4': '૪',
      '5': '૫',
      '6': '૬',
      '7': '૭',
      '8': '૮',
      '9': '૯'
    };
    return phone.replace(/[0-9]/g, digit => gujaratiDigits[digit as keyof typeof gujaratiDigits]);
  }
  return businessInfo.contact.phone;
};

export const getFormattedDoctorInfo = (language: 'en' | 'gu') => {
  if (language === 'gu') {
    return {
      name: 'ડૉ. જેમિશ એ. પટેલ',
      qualifications: 'એમબીબીએસ, એમડી',
      specialization: 'ડર્મેટોલોજિસ્ટ, કોસ્મેટિક સર્જન અને ટ્રાઇકોલોજિસ્ટ',
      university: 'સૌરાષ્ટ્ર યુનિવર્સિટી (૨૦૦૮)',
      experience: '૧૪'
    };
  }

  return {
    name: businessInfo.doctor.name,
    qualifications: businessInfo.doctor.qualifications,
    specialization: businessInfo.doctor.specialization,
    university: businessInfo.doctor.university,
    experience: businessInfo.doctor.experience.toString()
  };
};

// Calculate doctor's experience dynamically
export const calculateExperience = () => {
  const currentYear = new Date().getFullYear();
  const startYear = businessInfo.doctor.startYear;
  return currentYear - startYear;
};

// Get formatted experience with + sign
export const getFormattedExperience = (language: 'en' | 'gu') => {
  const experience = calculateExperience();
  if (language === 'gu') {
    return translateToGujaratiDigits(experience.toString()) + '+';
  }
  return experience + '+';
};