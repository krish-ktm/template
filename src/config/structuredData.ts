// Configuration file for structured data/schema.org JSON-LD data
import { businessInfo } from './business';

// Helper function to extract hours in 24-hour format for schema
const getHoursForSchema = () => {
  // Extract hours from business info
  // This is a simplified example - you may need to parse AM/PM times properly
  const extractTimeValue = (timeString: string): string => {
    const timePart = timeString.split(' - ')[0]; // Take the opening time
    if (timePart.includes('AM')) {
      return timePart.replace(' AM', '').replace(':', '');
    } else if (timePart.includes('PM')) {
      const hourMinute = timePart.replace(' PM', '').split(':');
      const hour = parseInt(hourMinute[0]);
      return `${hour + 12}:${hourMinute[1]}`;
    }
    return timePart;
  };

  const morningOpens = extractTimeValue(businessInfo.hours.weekday.morning);
  const eveningCloses = extractTimeValue(businessInfo.hours.weekday.evening);
  
  return {
    weekday: {
      opens: morningOpens,
      closes: eveningCloses
    },
    saturday: {
      opens: extractTimeValue(businessInfo.hours.saturday),
      closes: '13:00' // Assumed closing time based on 12:30 PM
    }
  };
};

export const websiteSchema = {
  name: businessInfo.name,
  url: 'https://drjemishskinclinic.com',
  potentialAction: {
    '@type': 'SearchAction',
    'target': 'https://drjemishskinclinic.com/search?q={search_term_string}',
    'query-input': 'required name=search_term_string'
  }
};

export const clinicSchema = {
  '@type': 'MedicalOrganization',
  name: businessInfo.name,
  url: 'https://drjemishskinclinic.com',
  logo: 'https://drjemishskinclinic.com/logo.png',
  telephone: businessInfo.contact.phone,
  email: businessInfo.contact.email,
  description: `Professional skin and hair care treatments by ${businessInfo.doctor.name}. Expert dermatological care and advanced treatments for all skin and hair conditions.`,
  address: {
    '@type': 'PostalAddress',
    streetAddress: businessInfo.contact.address.split(',').slice(0, -2).join(','),
    addressLocality: 'Mehsana',
    addressRegion: 'Gujarat',
    postalCode: '384002',
    addressCountry: 'IN'
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: '23.606718',
    longitude: '72.382193'
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: getHoursForSchema().weekday.opens,
      closes: getHoursForSchema().weekday.closes
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: 'Saturday',
      opens: getHoursForSchema().saturday.opens,
      closes: getHoursForSchema().saturday.closes
    }
  ],
  sameAs: [
    businessInfo.social.facebook,
    businessInfo.social.instagram,
  ],
  medicalSpecialty: [
    {
      '@type': 'MedicalSpecialty',
      name: 'Dermatology',
    }
  ],
  priceRange: '₹₹'
};

export const doctorSchema = {
  '@type': 'Physician',
  name: businessInfo.doctor.name,
  image: 'https://drjemishskinclinic.com/doctor-img.JPG',
  url: 'https://drjemishskinclinic.com/about',
  medicalSpecialty: [
    {
      '@type': 'MedicalSpecialty',
      name: 'Dermatology',
    }
  ],
  worksFor: {
    '@type': 'MedicalOrganization',
    name: businessInfo.name,
    url: 'https://drjemishskinclinic.com',
  },
  description: `${businessInfo.doctor.name} is a ${businessInfo.doctor.specialization} with ${businessInfo.doctor.experience}+ years of experience.`,
  telephone: businessInfo.contact.phone,
  address: {
    '@type': 'PostalAddress',
    streetAddress: businessInfo.contact.address.split(',').slice(0, -2).join(','),
    addressLocality: 'Mehsana',
    addressRegion: 'Gujarat',
    postalCode: '384002',
    addressCountry: 'IN'
  }
};

export const servicesSchema = [
  {
    '@type': 'MedicalProcedure',
    name: 'Hair Treatments',
    procedureType: 'https://schema.org/MedicalTherapy',
    description: 'Advanced hair loss treatments, hair transplantation consultations, and scalp treatments.',
    followup: 'Regular checkups may be required based on the treatment plan.',
    howPerformed: 'Using advanced technology and medical-grade treatments specific to hair and scalp conditions.',
    preparation: 'Initial consultation to understand specific hair issues and conditions.',
    procedureCode: {
      '@type': 'MedicalCode',
      codeValue: 'HT100',
      codingSystem: 'Internal'
    }
  },
  {
    '@type': 'MedicalProcedure',
    name: 'Skin Treatments',
    procedureType: 'https://schema.org/MedicalTherapy',
    description: 'Comprehensive skin treatments for various conditions including acne, pigmentation, and anti-aging.',
    followup: 'Follow-up appointments to monitor progress and adjust treatments as needed.',
    howPerformed: 'Using a combination of medical procedures, topical treatments, and laser therapies.',
    preparation: 'Detailed skin analysis and consultation to identify specific skin concerns.',
    procedureCode: {
      '@type': 'MedicalCode',
      codeValue: 'ST200',
      codingSystem: 'Internal'
    }
  },
  {
    '@type': 'MedicalProcedure',
    name: 'Laser Treatments',
    procedureType: 'https://schema.org/MedicalTherapy',
    description: 'Advanced laser procedures for hair removal, skin rejuvenation, scar reduction, and more.',
    followup: 'Multiple sessions may be required based on the treatment plan.',
    howPerformed: 'Using state-of-the-art laser technology under medical supervision.',
    preparation: 'Pre-procedure consultation and skin preparation instructions.',
    procedureCode: {
      '@type': 'MedicalCode',
      codeValue: 'LT300',
      codingSystem: 'Internal'
    }
  }
];

export const faqSchema = {
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What skin conditions does Dr. Jemish treat?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: `${businessInfo.doctor.name} specializes in treating a wide range of skin conditions including acne, eczema, psoriasis, pigmentation issues, fungal infections, and more. We also offer cosmetic dermatology services such as anti-aging treatments and skin rejuvenation.`
      }
    },
    {
      '@type': 'Question',
      name: `How do I book an appointment at ${businessInfo.name}?`,
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'You can book an appointment through our website by visiting the appointments page, calling our clinic directly, or sending us a message through the contact form. We typically confirm appointments within 24 hours.'
      }
    },
    {
      '@type': 'Question',
      name: 'What hair treatments are available at the clinic?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'We offer comprehensive hair treatments including treatments for hair loss, dandruff, scalp infections, hair thinning, and alopecia. We also provide PRP therapy for hair growth and consultations for hair transplantation.'
      }
    },
    {
      '@type': 'Question',
      name: `Are the treatments at ${businessInfo.name} safe?`,
      acceptedAnswer: {
        '@type': 'Answer',
        text: `Yes, all treatments at our clinic are performed under medical supervision with advanced equipment and protocols. ${businessInfo.doctor.name} stays updated with the latest dermatological advances to ensure the highest safety standards for all procedures.`
      }
    }
  ]
}; 