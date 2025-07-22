import { commonTranslations } from './common';
import { navigationTranslations } from './navigation';
import { homeTranslations } from './home';
import { appointmentTranslations } from '../../components/appointment/i18n/translations/appointment';
import { servicesTranslations } from './services';
import { mrAppointmentTranslations } from './mr-appointment';
import { aboutTranslations } from './about';
import { footerTranslations } from './footer';
import { headerTranslations } from './header';
import { contactTranslations } from './contact';
import { whyChooseUsTranslations } from './whyChooseUs';
import { howWeWorkTranslations } from './howWeWork';
import { beforeAfterTranslations } from './beforeAfter';
import { benefitsTranslations } from './benefits';
import { noticeBoardTranslations } from './noticeBoard';
import { galleryTranslations } from './gallery';
import { doctorMessageTranslations } from './doctorMessage';
import { LanguageContent } from '../types';

export const translations: Record<string, LanguageContent> = {
  en: {
    common: commonTranslations.en,
    navigation: navigationTranslations.en,
    home: homeTranslations.en,
    appointment: appointmentTranslations.en,
    services: servicesTranslations.en,
    mrAppointment: mrAppointmentTranslations.en,
    about: aboutTranslations.en,
    footer: footerTranslations.en,
    header: headerTranslations.en,
    contact: contactTranslations.en,
    doctorMessage: doctorMessageTranslations.en,
    whyChooseUs: whyChooseUsTranslations.en,
    howWeWork: howWeWorkTranslations.en,
    BeforeAfter: beforeAfterTranslations.en,
    Benefits: benefitsTranslations.en,
    noticeBoard: noticeBoardTranslations.en,
    gallery: galleryTranslations.en
  },
  gu: {
    common: commonTranslations.gu,
    navigation: navigationTranslations.gu,
    home: homeTranslations.gu,
    appointment: appointmentTranslations.gu,
    services: servicesTranslations.gu,
    mrAppointment: mrAppointmentTranslations.gu,
    about: aboutTranslations.gu,
    footer: footerTranslations.gu,
    header: headerTranslations.gu,
    contact: contactTranslations.gu,
    doctorMessage: doctorMessageTranslations.gu,
    whyChooseUs: whyChooseUsTranslations.gu,
    howWeWork: howWeWorkTranslations.gu,
    BeforeAfter: beforeAfterTranslations.gu,
    Benefits: benefitsTranslations.gu,
    noticeBoard: noticeBoardTranslations.gu,
    gallery: galleryTranslations.gu
  }
};