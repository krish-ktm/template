import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';

export interface AnalyticsData {
  appointmentsByDate: Record<string, number>;
  appointmentsByStatus: Record<string, number>;
  appointmentsByHour: Record<string, number>;
  servicePopularity: Record<string, number>;
  newVsReturning: { new: number; returning: number };
  patientDemographics: {
    ageGroups: Record<string, number>;
    genderDistribution: Record<string, number>;
  };
  seasonalTrends: Record<string, number>;
  cancellationRate: number;
}

interface LoadingStates {
  appointments: boolean;
  patients: boolean;
  trends: boolean;
  demographics: boolean;
}

export function useAnalyticsData() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loadingStates, setLoadingStates] = useState<LoadingStates>({
    appointments: false,
    patients: false,
    trends: false,
    demographics: false,
  });

  const updateLoadingState = (key: keyof LoadingStates, value: boolean) => {
    setLoadingStates(prev => ({ ...prev, [key]: value }));
  };

  const fetchAnalyticsData = useCallback(async (dateRange: { startDate: string; endDate: string }) => {
    try {
      // Set loading states
      Object.keys(loadingStates).forEach(key => {
        updateLoadingState(key as keyof LoadingStates, true);
      });

      // Fetch appointments within date range
      const { data: appointments, error: appointmentsError } = await supabase
        .from('appointments')
        .select('*')
        .gte('appointment_date', dateRange.startDate)
        .lte('appointment_date', dateRange.endDate);

      if (appointmentsError) throw new Error(appointmentsError.message);

      // Fetch patients data for demographics
      const { data: patients, error: patientsError } = await supabase
        .from('patients')
        .select('*');

      if (patientsError) throw new Error(patientsError.message);

      // Process appointments data
      const appointmentsByDate: Record<string, number> = {};
      const appointmentsByStatus: Record<string, number> = { pending: 0, completed: 0, cancelled: 0 };
      const appointmentsByHour: Record<string, number> = {};
      const servicePopularity: Record<string, number> = {};
      const seasonalTrends: Record<string, number> = {
        'Jan': 0, 'Feb': 0, 'Mar': 0, 'Apr': 0, 'May': 0, 'Jun': 0,
        'Jul': 0, 'Aug': 0, 'Sep': 0, 'Oct': 0, 'Nov': 0, 'Dec': 0
      };

      let totalCancellations = 0;

      // Process each appointment
      appointments?.forEach(appointment => {
        // Appointments by date
        const date = appointment.appointment_date;
        appointmentsByDate[date] = (appointmentsByDate[date] || 0) + 1;

        // Appointments by status
        if (appointmentsByStatus[appointment.status] !== undefined) {
          appointmentsByStatus[appointment.status] += 1;
        }

        // Count cancellations
        if (appointment.status === 'cancelled') {
          totalCancellations += 1;
        }

        // Appointments by hour
        const hour = appointment.appointment_time.split(':')[0];
        appointmentsByHour[hour] = (appointmentsByHour[hour] || 0) + 1;

        // Service popularity
        const service = appointment.city;
        servicePopularity[service] = (servicePopularity[service] || 0) + 1;

        // Seasonal trends
        const month = format(new Date(appointment.appointment_date), 'MMM');
        seasonalTrends[month] = (seasonalTrends[month] || 0) + 1;
      });

      updateLoadingState('appointments', false);
      updateLoadingState('trends', false);

      // Calculate new vs returning patients
      const patientAppointmentCounts: Record<string, number> = {};
      appointments?.forEach(appointment => {
        if (appointment.patient_id) {
          patientAppointmentCounts[appointment.patient_id] =
            (patientAppointmentCounts[appointment.patient_id] || 0) + 1;
        }
      });

      const newPatients = Object.values(patientAppointmentCounts).filter(count => count === 1).length;
      const returningPatients = Object.values(patientAppointmentCounts).filter(count => count > 1).length;

      // Process patient demographics
      const ageGroups: Record<string, number> = {
        'Child (0-17)': 0,
        'Adult (18-59)': 0,
        'Senior (60+)': 0
      };

      const genderDistribution: Record<string, number> = {
        'male': 0,
        'female': 0,
        'other': 0
      };

      patients?.forEach(patient => {
        // Age groups
        if (patient.age !== null) {
          if (patient.age < 18) {
            ageGroups['Child (0-17)'] += 1;
          } else if (patient.age < 60) {
            ageGroups['Adult (18-59)'] += 1;
          } else {
            ageGroups['Senior (60+)'] += 1;
          }
        }

        // Gender distribution
        if (patient.gender && genderDistribution[patient.gender] !== undefined) {
          genderDistribution[patient.gender] += 1;
        }
      });

      updateLoadingState('patients', false);
      updateLoadingState('demographics', false);

      // Calculate cancellation rate
      const cancellationRate = appointments?.length > 0
        ? (totalCancellations / appointments.length) * 100
        : 0;

      // Set analytics data
      setAnalyticsData({
        appointmentsByDate,
        appointmentsByStatus,
        appointmentsByHour,
        servicePopularity,
        newVsReturning: { new: newPatients, returning: returningPatients },
        patientDemographics: {
          ageGroups,
          genderDistribution
        },
        seasonalTrends,
        cancellationRate
      });

    } catch (error) {
      console.error('Error loading analytics data:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to load analytics data';
      toast.error(errorMessage);
      
      // Reset all loading states on error
      Object.keys(loadingStates).forEach(key => {
        updateLoadingState(key as keyof LoadingStates, false);
      });
    }
  }, []);

  return {
    analyticsData,
    loadingStates,
    fetchAnalyticsData
  };
} 