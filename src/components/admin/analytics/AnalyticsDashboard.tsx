import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { LoadingSpinner } from '../../LoadingSpinner';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../../lib/supabase';
import { checkSuperAdminAccess } from '../../../lib/auth';
import { Calendar, Users, Clock, Percent } from 'lucide-react';
import { AppointmentStatusChart } from './AppointmentStatusChart';
import { AppointmentTrendsChart } from './AppointmentTrendsChart';
import { PeakHoursChart } from './PeakHoursChart';
import { ServicePopularityChart } from './ServicePopularityChart';
import { PatientRatioChart } from './PatientRatioChart';
import { PatientDemographicsChart } from './PatientDemographicsChart';
import { SeasonalTrendsChart } from './SeasonalTrendsChart';
import AnalyticsDateRangePicker from './AnalyticsDateRangePicker';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';

interface AnalyticsData {
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

export function AnalyticsDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [dateRange, setDateRange] = useState({
    startDate: format(subMonths(startOfMonth(new Date()), 5), 'yyyy-MM-dd'),
    endDate: format(endOfMonth(new Date()), 'yyyy-MM-dd')
  });

  useEffect(() => {
    // Check if user has superadmin access
    const { isAuthorized, error } = checkSuperAdminAccess();
    if (!isAuthorized) {
      toast.error(error || 'Unauthorized access');
      navigate('/admin/appointments');
      return;
    }
    
    loadAnalyticsData();
  }, [navigate, dateRange]);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        navigate('/login');
        throw new Error('Authentication required');
      }

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
        
        // Service popularity (using city as a proxy for service type since actual service field isn't available)
        const service = appointment.city; // Using city as a proxy
        servicePopularity[service] = (servicePopularity[service] || 0) + 1;
        
        // Seasonal trends (by month)
        const month = format(new Date(appointment.appointment_date), 'MMM');
        seasonalTrends[month] = (seasonalTrends[month] || 0) + 1;
      });

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
    } finally {
      setLoading(false);
    }
  };

  const handleDateRangeChange = (newRange: { startDate: string; endDate: string }) => {
    setDateRange(newRange);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6 pt-12 sm:pt-0 mt-4 sm:mt-0 px-2 sm:px-0">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-semibold text-gray-900">Analytics Dashboard</h2>
        <AnalyticsDateRangePicker 
          startDate={dateRange.startDate}
          endDate={dateRange.endDate}
          onSelect={handleDateRangeChange}
        />
      </div>

      {/* Analytics Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <AnalyticCard 
          icon={Calendar} 
          label="Total Appointments" 
          value={analyticsData ? Object.values(analyticsData.appointmentsByStatus).reduce((a, b) => a + b, 0).toString() : '0'}
        />
        <AnalyticCard 
          icon={Users} 
          label="Patient Ratio" 
          value={analyticsData ? `${analyticsData.newVsReturning.new}/${analyticsData.newVsReturning.returning}` : '0/0'}
          subtext="New/Returning"
        />
        <AnalyticCard 
          icon={Percent} 
          label="Cancellation Rate" 
          value={analyticsData ? `${analyticsData.cancellationRate.toFixed(1)}%` : '0%'}
        />
        <AnalyticCard 
          icon={Clock} 
          label="Peak Hour" 
          value={analyticsData ? findPeakHour(analyticsData.appointmentsByHour) : '-'}
        />
      </div>

      {/* Appointment Analytics Section */}
      <div className="space-y-6">
        <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">Appointment Analytics</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Appointment Trends Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h4 className="text-base font-medium text-gray-800 mb-4">Appointment Trends</h4>
            {analyticsData && <AppointmentTrendsChart data={analyticsData.appointmentsByDate} />}
          </div>
          
          {/* Appointment Status Distribution */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h4 className="text-base font-medium text-gray-800 mb-4">Status Distribution</h4>
            {analyticsData && <AppointmentStatusChart data={analyticsData.appointmentsByStatus} />}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Peak Hours Visualization */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h4 className="text-base font-medium text-gray-800 mb-4">Peak Hours</h4>
            {analyticsData && <PeakHoursChart data={analyticsData.appointmentsByHour} />}
          </div>
          
          {/* Service Type Popularity */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h4 className="text-base font-medium text-gray-800 mb-4">Popular Services</h4>
            {analyticsData && <ServicePopularityChart data={analyticsData.servicePopularity} />}
          </div>
        </div>
      </div>

      {/* Patient Insights Section */}
      <div className="space-y-6">
        <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">Patient Insights</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* New vs Returning Patients */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h4 className="text-base font-medium text-gray-800 mb-4">New vs Returning Patients</h4>
            {analyticsData && <PatientRatioChart data={analyticsData.newVsReturning} />}
          </div>
          
          {/* Patient Demographics */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h4 className="text-base font-medium text-gray-800 mb-4">Patient Demographics</h4>
            {analyticsData && <PatientDemographicsChart data={analyticsData.patientDemographics} />}
          </div>
        </div>
      </div>

      {/* Seasonal Trends Section */}
      <div className="space-y-6">
        <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">Seasonal Analysis</h3>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h4 className="text-base font-medium text-gray-800 mb-4">Seasonal Appointment Patterns</h4>
          {analyticsData && <SeasonalTrendsChart data={analyticsData.seasonalTrends} />}
        </div>
      </div>
    </div>
  );
}

interface AnalyticCardProps {
  icon: React.ElementType;
  label: string;
  value: string;
  subtext?: string;
}

function AnalyticCard({ icon: Icon, label, value, subtext }: AnalyticCardProps) {
  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200 hover:border-[#2B5C4B]/20 hover:shadow-lg transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className="bg-[#2B5C4B]/10 p-3 rounded-lg">
          <Icon className="h-6 w-6 text-[#2B5C4B]" />
        </div>
      </div>
      <p className="text-sm text-gray-600 mb-1">{label}</p>
      <p className="text-2xl font-semibold text-gray-900">{value}</p>
      {subtext && <p className="text-xs text-gray-500 mt-1">{subtext}</p>}
    </div>
  );
}

function findPeakHour(hourData: Record<string, number>): string {
  if (Object.keys(hourData).length === 0) return '-';
  
  const peakHour = Object.entries(hourData)
    .sort((a, b) => b[1] - a[1])[0][0];
  
  // Format hour to 12-hour format
  const hour = parseInt(peakHour);
  return hour > 12 ? `${hour - 12} PM` : hour === 12 ? '12 PM' : hour === 0 ? '12 AM' : `${hour} AM`;
} 