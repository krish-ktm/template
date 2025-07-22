// Add these interfaces to your existing types.ts file

export interface TimeSlot {
  time: string;
  maxBookings: number;
  currentBookings?: number;
}

export interface WorkingHour {
  id: string;
  day: string;
  is_working: boolean;
  morning_start: string | null;
  morning_end: string | null;
  evening_start: string | null;
  evening_end: string | null;
  slot_interval: number;
  slots: TimeSlot[];
  created_at: string;
  updated_at: string;
}

export interface AppointmentForm {
  name: string;
  phone: string;
  age: string;
  city: string;
  date: string;
  timeSlot: string;
}

export interface BookingDetails {
  id: string;
  name: string;
  phone: string;
  age: number;
  city: string;
  appointment_date: string;
  appointment_time: string;
  status: string;
  created_at: string;
}

export interface User {
  id: string;
  email: string;
  role: string;
  name: string;
  created_at: string;
  last_login: string | null;
  status: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface Notice {
  id: string;
  title: string | { en: string; gu: string; };
  content: string | { en: string; gu: string; };
  formatted_content?: { en: string; gu: string; };
  images?: string[];
  active: boolean;
  order: number;
  created_at: string;
  created_by: string;
}

export interface Translations {
  title: string;
  name: string;
  phone: string;
  age: string;
  city: string;
  date: string;
  timeSlot: string;
  submit: string;
  required: string;
  selectTime: string;
  bookingFull: string;
  success: string;
  languageSelect: string;
  english: string;
  gujarati: string;
  bookingDetails: string;
  bookingId: string;
  bookingDate: string;
  bookingTime: string;
  close: string;
  meta?: {
    homeTitle: string;
    homeDescription: string;
    aboutTitle: string;
    aboutDescription: string;
    servicesTitle: string;
    servicesDescription: string;
    galleryTitle: string;
    galleryDescription: string;
    contactTitle: string;
    contactDescription: string;
    appointmentTitle: string;
    appointmentDescription: string;
    mrAppointmentTitle: string;
    mrAppointmentDescription: string;
    keywords: string;
    author: string;
    siteName: string;
  };
  landing?: {
    hero: {
      title: string;
      subtitle: string;
      doctorTitle: string;
      experience: string;
      advancedTreatments: string;
      expertCare: string;
      mrAppointmentCta: string;
      mrAppointmentNote: string;
    };
    stats: {
      yearsExperience: string;
      experienceDesc: string;
      happyPatients: string;
      patientsDesc: string;
      treatments: string;
      treatmentsDesc: string;
      successRate: string;
      successDesc: string;
    };
    services: {
      title: string;
      subtitle: string;
      categories: {
        treatments: string;
        facial: string;
        aesthetic: string;
        surgical: string;
        hair: string;
        diagnostic: string;
      };
      cta: {
        title: string;
        subtitle: string;
        button: string;
      };
    };
  };
  BeforeAfter?: {
    badge: string;
    title: string;
    subtitle: string;
  };
  noticeBoard?: {
    badge: string;
    title: string;
    subtitle: string;
    noAnnouncements: string;
  };
  whyChooseUs?: {
    badge?: string;
    title?: string;
    subtitle?: string;
    features?: {
      title: string;
      description: string;
    }[];
    cta?: string;
  };
  howWeWork?: {
    badge?: string;
    title?: string;
    subtitle?: string;
    steps?: {
      number: string;
      title: string;
      description: string;
    }[];
    contactTitle?: string;
    contactSubtitle?: string;
    contactPhone?: string;
  };
  Benefits?: {
    badge?: string;
    title?: string;
    subtitle?: string;
    benefits?: {
      title: string;
      description: string;
    }[];
  };
}