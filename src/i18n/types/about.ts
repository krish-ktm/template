export interface AboutTranslations {
  title: string;
  subtitle: string;
  experience: string;
  qualification: string;
  yearsExperience: string;
  specialization: string;
  
  doctorName: string;
  doctorQualification: string;
  doctorSpecialization: string;
  doctorRegistration: string;
  
  expertise: {
    title: string;
    items: string[];
  };
  
  education: {
    title: string;
    items: {
      degree: string;
      institution: string;
      year: string;
    }[];
  };

  professional: {
    title: string;
    subtitle: string;
    memberships: {
      title: string;
      items: string[];
    };
    achievements: {
      title: string;
      items: Array<{
        title: string;
        description: string;
        year?: string;
      }>;
    };
  };
  
  clinicName: string;
  clinicDescription: string;
  amenities: string;
  amenitiesList: string[];
  
  cta: {
    title: string;
    description: string;
    bookButton: string;
    contactButton: string;
  };
}