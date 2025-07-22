import { MRAppointmentTranslations } from '../types/mr-appointment';
import { businessInfo, getFormattedDoctorInfo } from '../../config/business';

export const mrAppointmentTranslations: Record<string, MRAppointmentTranslations> = {
  en: {
    title: `MR Appointment at ${businessInfo.name}`,
    subtitle: `Schedule your meeting with ${businessInfo.doctor.name}`,
    badge: "Medical Representative",
    headerTitle: "Schedule Your Visit",
    headerSubtitle: "",
    success: "Appointment booked successfully",
    form: {
      mrName: "MR Name",
      companyName: "Company Name",
      divisionName: "Division Name",
      contactNo: "Contact Number",
      appointmentDate: "Appointment Date",
      timeSlot: "Appointment Time",
      slotAvailable: "left",
      slotsAvailable: "slots left",
      loadingSlots: "Loading time slots...",
      noTimeSlots: "No time slots available",
      selectAnotherDate: "Please select another date",
      timeSlotRequired: "Please select an appointment time",
      submit: "Book Appointment",
      submitting: "Booking...",
      dateRequired: "Please select an appointment date",
      invalidPhone: "Please enter a valid 10-digit contact number",
      maxAppointments: "Maximum appointments reached for this date",
      weekendsNotAvailable: "Appointments not available on weekends",
      selectDate: "Select appointment date",
      availableWeekdays: "Appointments available on weekdays only",
      availableDates: "Available dates",
      unavailableDates: "Weekends & past dates (not available)",
      calendarLegend: {
        available: "Available",
        full: "Full",
        notAvailable: "Not available",
        filling: "Filling"
      },
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
      title: "Appointment Confirmed",
      subtitle: "Your MR appointment has been scheduled successfully",
      appointmentDate: "Appointment Date",
      appointmentTime: "Appointment Time",
      mrDetails: "MR Details",
      mrName: "MR Name",
      companyName: "Company Name",
      divisionName: "Division Name",
      contactNo: "Contact Number",
      bookingId: "Booking ID",
      notes: {
        title: "Important Notes",
        arrival: "Please arrive 10 minutes before your appointment time",
        id: "Bring your company ID card and visiting card",
        mask: "Wear a mask during your visit"
      },
      scheduleAnother: "Schedule Another",
      done: "Done",
      download: "Download",
      downloading: "Downloading..."
    }
  },
  gu: {
    title: "શુભમ સ્કિન એન્ડ લેસર ક્લિનિક - MR એપોઈન્ટમેન્ટ",
    subtitle: `${getFormattedDoctorInfo('gu').name} સાથે તમારી મીટિંગ શેડ્યૂલ કરો`,
    badge: "મેડિકલ રિપ્રેઝન્ટેટિવ",
    headerTitle: "તમારી મુલાકાત શેડ્યૂલ કરો",
    headerSubtitle: "",
    success: "એપોઈન્ટમેન્ટ સફળતાપૂર્વક બુક થઈ ગઈ છે",
    form: {
      mrName: "MR નામ",
      companyName: "કંપનીનું નામ",
      divisionName: "ડિવિઝનનું નામ",
      contactNo: "સંપર્ક નંબર",
      appointmentDate: "એપોઈન્ટમેન્ટની તારીખ",
      timeSlot: "એપોઈન્ટમેન્ટનો સમય",
      slotAvailable: "બાકી",
      slotsAvailable: "સ્લોટ્સ બાકી",
      loadingSlots: "સમય સ્લોટ્સ લોડ થઈ રહ્યા છે...",
      noTimeSlots: "કોઈ સમય સ્લોટ ઉપલબ્ધ નથી",
      selectAnotherDate: "કૃપા કરીને બીજી તારીખ પસંદ કરો",
      timeSlotRequired: "કૃપા કરી એપોઈન્ટમેન્ટનો સમય પસંદ કરો",
      submit: "એપોઈન્ટમેન્ટ બુક કરો",
      submitting: "બુક થઈ રહ્યું છે...",
      dateRequired: "કૃપા કરી એપોઈન્ટમેન્ટની તારીખ પસંદ કરો",
      invalidPhone: "કૃપા કરી માન્ય 10-અંકનો સંપર્ક નંબર દાખલ કરો",
      maxAppointments: "આ તારીખ માટે મહત્તમ એપોઈન્ટમેન્ટ્સ પૂર્ણ થઈ ગઈ છે",
      weekendsNotAvailable: "સપ્તાહના અંતે એપોઈન્ટમેન્ટ ઉપલબ્ધ નથી",
      selectDate: "એપોઈન્ટમેન્ટની તારીખ પસંદ કરો",
      availableWeekdays: "એપોઈન્ટમેન્ટ માત્ર કામકાજના દિવસોમાં ઉપલબ્ધ",
      availableDates: "ઉપલબ્ધ તારીખો",
      unavailableDates: "સપ્તાહના અંત અને ભૂતકાળની તારીખો (ઉપલબ્ધ નથી)",
      calendarLegend: {
        available: "ઉપલબ્ધ",
        full: "ભરાઈ ગયું",
        notAvailable: "ઉપલબ્ધ નથી",
        filling: "ભરાઈ રહ્યું છે"
      },
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
      title: "એપોઈન્ટમેન્ટની પુષ્ટિ થઈ",
      subtitle: "તમારી MR એપોઈન્ટમેન્ટ સફળતાપૂર્વક શેડ્યૂલ થઈ ગઈ છે",
      appointmentDate: "એપોઈન્ટમેન્ટની તારીખ",
      appointmentTime: "એપોઈન્ટમેન્ટનો સમય",
      mrDetails: "MR વિગતો",
      mrName: "MR નામ",
      companyName: "કંપનીનું નામ",
      divisionName: "ડિવિઝનનું નામ",
      contactNo: "સંપર્ક નંબર",
      bookingId: "બુકિંગ ID",
      notes: {
        title: "મહત્વપૂર્ણ નોંધ",
        arrival: "કૃપા કરી તમારી એપોઈન્ટમેન્ટના સમયથી 10 મિનિટ પહેલા આવો",
        id: "તમારું કંપની ID કાર્ડ અને વિઝિટિંગ કાર્ડ લાવો",
        mask: "તમારી મુલાકાત દરમિયાન માસ્ક પહેરો"
      },
      scheduleAnother: "બીજી એપોઈન્ટમેન્ટ",
      done: "પૂર્ણ",
      download: "ડાઉનલોડ",
      downloading: "ડાઉનલોડ થઈ રહ્યું છે..."
    }
  }
};