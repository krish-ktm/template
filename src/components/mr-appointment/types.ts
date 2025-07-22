export interface MRForm {
  mr_name: string;
  company_name: string;
  division_name: string;
  contact_no: string;
  appointment_date: Date | null;
  appointment_time?: string;
}

export interface TimeSlot {
  time: string;
  maxBookings: number;
  currentBookings?: number;
}