export interface MRAppointmentTranslations {
  title: string;
  subtitle: string;
  badge?: string;
  headerTitle?: string;
  headerSubtitle?: string;
  success: string;
  form: {
    mrName: string;
    companyName: string;
    divisionName: string;
    contactNo: string;
    appointmentDate: string;
    timeSlot: string;
    slotAvailable: string;
    slotsAvailable: string;
    loadingSlots: string;
    noTimeSlots: string;
    selectAnotherDate: string;
    timeSlotRequired: string;
    submit: string;
    submitting: string;
    dateRequired: string;
    invalidPhone: string;
    maxAppointments: string;
    weekendsNotAvailable: string;
    selectDate: string;
    availableWeekdays: string;
    availableDates: string;
    unavailableDates: string;
    calendarLegend: {
      available: string;
      full: string;
      notAvailable: string;
      filling: string;
    };
    days: {
      sunday: string;
      monday: string;
      tuesday: string;
      wednesday: string;
      thursday: string;
      friday: string;
      saturday: string;
    };
    months: {
      january: string;
      february: string;
      march: string;
      april: string;
      may: string;
      june: string;
      july: string;
      august: string;
      september: string;
      october: string;
      november: string;
      december: string;
    };
  };
  confirmation: {
    title: string;
    subtitle: string;
    appointmentDate: string;
    appointmentTime: string;
    mrDetails: string;
    mrName: string;
    companyName: string;
    divisionName: string;
    contactNo: string;
    bookingId: string;
    notes: {
      title: string;
      arrival: string;
      id: string;
      mask: string;
    };
    scheduleAnother: string;
    done: string;
    download: string;
    downloading: string;
  };
}