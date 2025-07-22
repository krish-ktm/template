import { AppointmentTranslations } from '../types/appointment';
import { businessInfo, getFormattedDoctorInfo } from '../../../../config/business';

export const appointmentTranslations: Record<string, AppointmentTranslations> = {
  en: {
    title: "Book Your Appointment",
    badge: "Book Appointment",
    headerTitle: "Schedule Your Visit",
    headerSubtitle: "Choose your preferred date and time for a consultation with our expert dermatologist.",
    form: {
      subtitle: `Schedule your appointment with ${businessInfo.doctor.name}`,
      name: "Full Name",
      phone: "Phone Number",
      age: "Age",
      city: "City",
      date: "Appointment Date",
      timeSlot: "Time Slot",
      submit: "Book Appointment",
      booking: "Booking...",
      selectTime: "Select Time",
      bookingFull: "Booking Full",
      noSlots: "No Time Slots Available",
      noSlotsAvailable: "All time slots for this date are either full or no longer available. Please try selecting a different date.",
      selectDate: "Please select a valid date to view available time slots.",
      success: "Appointment booked successfully!",
      successNote: "We'll see you at your scheduled time!",
      personalInfo: "Personal Information",
      showingSlots: "Showing slots for",
      slotsLeft: "left",
      loadingSlots: "Loading available time slots...",
      days: {
        sunday: "Sunday",
        monday: "Monday",
        tuesday: "Tuesday",
        wednesday: "Wednesday",
        thursday: "Thursday",
        friday: "Friday",
        saturday: "Saturday"
      },
      months: {
        january: "January",
        february: "February",
        march: "March",
        april: "April",
        may: "May",
        june: "June",
        july: "July",
        august: "August",
        september: "September",
        october: "October",
        november: "November",
        december: "December"
      }
    },
    confirmation: {
      title: "Appointment Confirmation",
      subtitle: "Your appointment has been confirmed",
      bookingId: "Booking ID",
      date: "Date",
      time: "Time",
      patientDetails: "Patient Details",
      scheduleAnother: "Schedule Another",
      notes: {
        title: "Important Notes",
        arrival: "Please arrive 10 minutes before your appointment time",
        records: "Bring any relevant medical records or previous prescriptions",
        mask: "Wear a mask during your visit"
      }
    }
  },
  gu: {
    title: "તમારી એપોઈન્ટમેન્ટ બુક કરો",
    badge: "એપોઈન્ટમેન્ટ બુક કરો",
    headerTitle: "તમારી મુલાકાત શેડ્યૂલ કરો",
    headerSubtitle: "અમારા નિષ્ણાત ડર્મેટોલોજિસ્ટ સાથે પરામર્શ માટે તમારી પસંદગીની તારીખ અને સમય પસંદ કરો.",
    form: {
      subtitle: `${getFormattedDoctorInfo('gu').name} સાથે તમારી એપોઈન્ટમેન્ટ શેડ્યૂલ કરો`,
      name: "પૂરું નામ",
      phone: "ફોન નંબર",
      age: "ઉંમર",
      city: "શહેર",
      date: "એપોઈન્ટમેન્ટની તારીખ",
      timeSlot: "સમય",
      submit: "એપોઈન્ટમેન્ટ બુક કરો",
      booking: "બુક થઈ રહ્યું છે...",
      selectTime: "સમય પસંદ કરો",
      bookingFull: "બુકિંગ ભરાઈ ગયું છે",
      noSlots: "કોઈ સમય ઉપલબ્ધ નથી",
      noSlotsAvailable: "આ તારીખ માટે બધા સમય સ્લોટ્સ ભરાઈ ગયા છે અથવા હવે ઉપલબ્ધ નથી. કૃપા કરી અલગ તારીખ પસંદ કરો.",
      selectDate: "ઉપલબ્ધ સમય જોવા માટે કૃપા કરી માન્ય તારીખ પસંદ કરો.",
      success: "એપોઈન્ટમેન્ટ સફળતાપૂર્વક બુક થઈ ગઈ છે!",
      successNote: "અમે તમને નિર્ધારિત સમયે મળીશું!",
      personalInfo: "વ્યક્તિગત માહિતી",
      showingSlots: "આ તારીખ માટે ઉપલબ્ધ સમય",
      slotsLeft: "બાકી",
      loadingSlots: "ઉપલબ્ધ સમય સ્લોટ્સ લોડ થઈ રહ્યા છે...",
      days: {
        sunday: "રવિવાર",
        monday: "સોમવાર",
        tuesday: "મંગળવાર",
        wednesday: "બુધવાર",
        thursday: "ગુરુવાર",
        friday: "શુક્રવાર",
        saturday: "શનિવાર"
      },
      months: {
        january: "જાન્યુઆરી",
        february: "ફેબ્રુઆરી",
        march: "માર્ચ",
        april: "એપ્રિલ",
        may: "મે",
        june: "જૂન",
        july: "જુલાઈ",
        august: "ઓગસ્ટ",
        september: "સપ્ટેમ્બર",
        october: "ઓક્ટોબર",
        november: "નવેમ્બર",
        december: "ડિસેમ્બર"
      }
    },
    confirmation: {
      title: "એપોઈન્ટમેન્ટ પુષ્ટિ",
      subtitle: "તમારી એપોઈન્ટમેન્ટની પુષ્ટિ થઈ ગઈ છે",
      bookingId: "બુકિંગ ID",
      date: "તારીખ",
      time: "સમય",
      patientDetails: "દર્દીની વિગતો",
      scheduleAnother: "બીજી એપોઈન્ટમેન્ટ",
      notes: {
        title: "મહત્વપૂર્ણ નોંધ",
        arrival: "કૃપા કરી તમારી એપોઈન્ટમેન્ટના સમયથી 10 મિનિટ પહેલા આવો",
        records: "કોઈપણ સંબંધિત મેડિકલ રેકોર્ડ્સ અથવા અગાઉની પ્રિસ્ક્રિપ્શન લાવો",
        mask: "તમારી મુલાકાત દરમિયાન માસ્ક પહેરો"
      }
    }
  }
}; 