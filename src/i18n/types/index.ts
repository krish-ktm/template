import { CommonTranslations } from './common';
import { NavigationTranslations } from './navigation';
import { HomeTranslations } from './home';
import { AppointmentTranslations } from '../../components/appointment/i18n/types/appointment';
import { ServicesTranslations } from './services';
import { MRAppointmentTranslations } from './mr-appointment';
import { AboutTranslations } from './about';
import { FooterTranslations } from './footer';
import { HeaderTranslations } from './header';
import { ContactTranslations } from './contact';
import { DoctorMessageTranslations } from './doctorMessage';
import { MetaTranslations } from './meta';

export interface LanguageContent {
  common: CommonTranslations;
  navigation: NavigationTranslations;
  home: HomeTranslations;
  appointment: AppointmentTranslations;
  services: ServicesTranslations;
  mrAppointment: MRAppointmentTranslations;
  about: AboutTranslations;
  footer: FooterTranslations;
  header: HeaderTranslations;
  contact: ContactTranslations;
  doctorMessage: DoctorMessageTranslations;
  meta?: MetaTranslations;
  BeforeAfter?: {
    badge?: string;
    title?: string;
    subtitle?: string;
  };
  noticeBoard?: {
    badge?: string;
    title?: string;
    subtitle?: string;
    noAnnouncements?: string;
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
  gallery?: {
    badge?: string;
    title?: string;
    subtitle?: string;
  };
}

export * from './common';
export * from './navigation';
export * from './home';
export * from '../../components/appointment/i18n/types/appointment';
export * from './services';
export * from './mr-appointment';
export * from './about';
export * from './footer';
export * from './header';
export * from './contact';
export * from './doctorMessage';