export interface AppointmentDetails {
  id: string;
  [key: string]: any;
}

export interface PatientDetails {
  name: string;
  phone: string;
  age: number;
  city: string;
}

export interface MRDetails {
  mr_name: string;
  company_name: string;
  division_name: string;
  contact_no: string;
}

interface AppointmentTranslations {
  confirmation: {
    title: string;
    subtitle: string;
    bookingId: string;
    date: string;
    patientDetails?: string;
    mrDetails?: string;
    notes: {
      title: string;
      arrival: string;
      records?: string;
      mask: string;
      id?: string;
    };
  };
  form: {
    name: string;
    phone: string;
    age: string;
    city: string;
    years: string;
    mrName?: string;
    companyName?: string;
    divisionName?: string;
    contactNo?: string;
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
}