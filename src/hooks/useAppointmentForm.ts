import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import { AppointmentForm, BookingDetails, TimeSlot, Patient } from '../types';
import { generateTimeSlots, validateBookingRequest } from '../utils';

const TIMEZONE = 'Asia/Kolkata';

export function useAppointmentForm() {
  const [loading, setLoading] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [success, setSuccess] = useState(false);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);
  const [currentPatient, setCurrentPatient] = useState<Patient | null>(null);
  
  // Get today's date in IST
  const today = new Date();
  const istToday = utcToZonedTime(today, TIMEZONE);
  const istTodayStr = format(istToday, 'yyyy-MM-dd');

  const initialForm = {
    name: '',
    phone: '',
    age: '',
    city: '',
    date: istTodayStr,
    timeSlot: ''
  };

  const [form, setForm] = useState<AppointmentForm>(initialForm);

  // Fetch patient data when phone number is entered
  useEffect(() => {
    const phoneNumber = form.phone.trim();
    if (phoneNumber.length === 10) {
      fetchPatientByPhone(phoneNumber);
    } else {
      setCurrentPatient(null);
    }
  }, [form.phone]);

  const fetchPatientByPhone = async (phoneNumber: string) => {
    try {
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .eq('phone_number', phoneNumber)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching patient:', error);
      }
      
      if (data) {
        setCurrentPatient(data);
        // Auto-fill form with patient data
        setForm({
          ...form,
          name: `${data.first_name} ${data.last_name || ''}`.trim(),
          age: data.age ? String(data.age) : '',
          city: data.address ? data.address.split(',').pop()?.trim() || '' : ''
        });
      } else {
        setCurrentPatient(null);
      }
    } catch (error) {
      console.error('Error fetching patient data:', error);
      setCurrentPatient(null);
    }
  };

  const loadTimeSlots = async (dateStr?: string) => {
    const dateToLoad = dateStr || form.date;
    if (!dateToLoad) return;
    
    setLoadingSlots(true);
    try {
      const slots = await generateTimeSlots(dateToLoad);
      setTimeSlots(slots);
    } catch (error) {
      console.error('Error loading time slots:', error);
      toast.error('Failed to load available time slots');
      setTimeSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  };

  // Load time slots when date changes
  useEffect(() => {
    if (form.date) {
      loadTimeSlots(form.date);
    }
  }, [form.date]);

  const resetForm = () => {
    // First update the form state
    setForm(initialForm);
    // Then load time slots for the initial date
    loadTimeSlots(initialForm.date);
    // Reset current patient
    setCurrentPatient(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { isValid, error } = await validateBookingRequest(
        form.name,
        form.phone,
        form.date,
        form.timeSlot
      );

      if (!isValid) {
        throw new Error(error);
      }

      let patientId: string | null = null;

      // Check if we need to create or update a patient record
      if (form.phone.trim().length === 10) {
        // If we have a current patient, use that ID
        if (currentPatient) {
          patientId = currentPatient.id;
          
          // Update patient info if needed (e.g., age or name might have changed)
          const nameParts = form.name.trim().split(' ');
          const firstName = nameParts[0];
          const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
          
          // Only update if there are changes
          if (
            firstName !== currentPatient.first_name || 
            lastName !== (currentPatient.last_name || '') ||
            parseInt(form.age) !== currentPatient.age ||
            form.city !== currentPatient.address?.split(',').pop()?.trim()
          ) {
            await supabase
              .from('patients')
              .update({
                first_name: firstName,
                last_name: lastName || null,
                age: form.age ? parseInt(form.age) : null,
                // Update address by appending city if no address exists, or replacing existing city
                address: currentPatient.address 
                  ? currentPatient.address.replace(/[^,]*$/, form.city) 
                  : form.city
              })
              .eq('id', patientId);
          }
        } else {
          // Create new patient
          const nameParts = form.name.trim().split(' ');
          const firstName = nameParts[0];
          const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
          
          const { data: newPatient, error: patientError } = await supabase
            .from('patients')
            .insert({
              first_name: firstName,
              last_name: lastName || null,
              phone_number: form.phone.trim(),
              age: form.age ? parseInt(form.age) : null,
              address: form.city || null
            })
            .select()
            .single();
            
          if (patientError) {
            console.error('Error creating patient:', patientError);
          } else {
            patientId = newPatient.id;
            setCurrentPatient(newPatient);
          }
        }
      }

      // Create appointment with patient link if we have a patient ID
      const appointmentData = {
        name: form.name,
        phone: form.phone,
        age: parseInt(form.age),
        city: form.city,
        appointment_date: form.date,
        appointment_time: form.timeSlot,
        status: 'pending',
        patient_id: patientId
      };

      const { data: appointment, error: appointmentError } = await supabase
        .from('appointments')
        .insert(appointmentData)
        .select()
        .single();

      if (appointmentError) throw new Error(appointmentError.message);

      setSuccess(true);
      setBookingDetails(appointment);
      resetForm();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const closeBookingDetails = () => {
    setBookingDetails(null);
  };

  return {
    form,
    setForm,
    loading,
    loadingSlots,
    success,
    timeSlots,
    bookingDetails,
    handleSubmit,
    closeBookingDetails,
    resetForm,
    currentPatient
  };
}