import { CommonTranslations } from '../types/common';
import { businessInfo } from '../../config/business';

export const commonTranslations: Record<string, CommonTranslations> = {
  en: {
    bookAppointment: "Book Appointment",
    close: "Close",
    loading: "Loading...",
    success: "Success",
    error: "Error",
    required: "Required",
    submit: "Submit",
    cancel: "Cancel",
    save: "Save",
    delete: "Delete",
    edit: "Edit",
    view: "View",
    yes: "Yes",
    no: "No",
    confirm: "Confirm",
    back: "Back",
    next: "Next",
    done: "Done",
    clinicName: businessInfo.name,
    doctorName: businessInfo.doctor.name,
    doctorQualification: businessInfo.doctor.qualifications,
    doctorSpecialization: businessInfo.doctor.specialization
  },
  gu: {
    bookAppointment: "એપોઈન્ટમેન્ટ બુક કરો",
    close: "બંધ કરો",
    loading: "લોડ થઈ રહ્યું છે...",
    success: "સફળ",
    error: "ભૂલ",
    required: "જરૂરી",
    submit: "સબમિટ",
    cancel: "રદ કરો",
    save: "સાચવો",
    delete: "કાઢી નાખો",
    edit: "સંપાદિત કરો",
    view: "જુઓ",
    yes: "હા",
    no: "ના",
    confirm: "પુષ્ટિ કરો",
    back: "પાછા",
    next: "આગળ",
    done: "પૂર્ણ",
    clinicName: "શુભમ સ્કિન એન્ડ લેસર ક્લિનિક",
    doctorName: "ડૉ. જેમિશ એ. પટેલ",
    doctorQualification: "એમબીબીએસ, એમડી",
    doctorSpecialization: "ડર્મેટોલોજિસ્ટ, કોસ્મેટિક સર્જન અને ટ્રાઇકોલોજિસ્ટ"
  }
};