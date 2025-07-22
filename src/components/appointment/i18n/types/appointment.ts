export interface AppointmentTranslations {
  title: string;
  badge?: string;
  headerTitle?: string;
  headerSubtitle?: string;
  form: {
    subtitle: string;
    name: string;
    phone: string;
    age: string;
    city: string;
    date: string;
    timeSlot: string;
    submit: string;
    booking: string;
    selectTime: string;
    bookingFull: string;
    noSlots: string;
    noSlotsAvailable: string;
    selectDate: string;
    success: string;
    successNote: string;
    personalInfo: string;
    showingSlots: string;
    slotsLeft: string;
    loadingSlots: string;
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
    bookingId: string;
    date: string;
    time: string;
    patientDetails: string;
    scheduleAnother: string;
    notes: {
      title: string;
      arrival: string;
      records: string;
      mask: string;
    };
  };
} 