import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { LoadingSpinner } from '../../LoadingSpinner';
import { useNavigate } from 'react-router-dom';
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
import { checkSuperAdminAccess } from '../../../lib/auth';
import { useAnalyticsData } from '../../../hooks/useAnalyticsData';

export function AnalyticsDashboard() {
  const navigate = useNavigate();
  const { analyticsData, loadingStates, fetchAnalyticsData } = useAnalyticsData();
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
    
    fetchAnalyticsData(dateRange);
  }, [navigate, dateRange, fetchAnalyticsData]);

  const handleDateRangeChange = (newRange: { startDate: string; endDate: string }) => {
    setDateRange(newRange);
  };

  // Loading states for individual sections
  const isAppointmentsLoading = loadingStates.appointments;
  const isPatientsLoading = loadingStates.patients;
  const isTrendsLoading = loadingStates.trends;
  const isDemographicsLoading = loadingStates.demographics;

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
          isLoading={isAppointmentsLoading}
        />
        <AnalyticCard 
          icon={Users} 
          label="Patient Ratio" 
          value={analyticsData ? `${analyticsData.newVsReturning.new}/${analyticsData.newVsReturning.returning}` : '0/0'}
          subtext="New/Returning"
          isLoading={isPatientsLoading}
        />
        <AnalyticCard 
          icon={Percent} 
          label="Cancellation Rate" 
          value={analyticsData ? `${analyticsData.cancellationRate.toFixed(1)}%` : '0%'}
          isLoading={isAppointmentsLoading}
        />
        <AnalyticCard 
          icon={Clock} 
          label="Peak Hour" 
          value={analyticsData ? findPeakHour(analyticsData.appointmentsByHour) : '-'}
          isLoading={isAppointmentsLoading}
        />
      </div>

      {/* Appointment Analytics Section */}
      <div className="space-y-6">
        <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">Appointment Analytics</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Appointment Trends Chart */}
          <ChartContainer
            title="Appointment Trends"
            isLoading={isTrendsLoading}
          >
            {analyticsData && <AppointmentTrendsChart data={analyticsData.appointmentsByDate} />}
          </ChartContainer>
          
          {/* Appointment Status Distribution */}
          <ChartContainer
            title="Status Distribution"
            isLoading={isAppointmentsLoading}
          >
            {analyticsData && <AppointmentStatusChart data={analyticsData.appointmentsByStatus} />}
          </ChartContainer>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Peak Hours Visualization */}
          <ChartContainer
            title="Peak Hours"
            isLoading={isAppointmentsLoading}
          >
            {analyticsData && <PeakHoursChart data={analyticsData.appointmentsByHour} />}
          </ChartContainer>
          
          {/* Service Type Popularity */}
          <ChartContainer
            title="Appointments by City"
            isLoading={isAppointmentsLoading}
          >
            {analyticsData && <ServicePopularityChart data={analyticsData.servicePopularity} />}
          </ChartContainer>
        </div>
      </div>

      {/* Patient Insights Section */}
      <div className="space-y-6">
        <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">Patient Insights</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* New vs Returning Patients */}
          <ChartContainer
            title="New vs Returning Patients"
            isLoading={isPatientsLoading}
          >
            {analyticsData && <PatientRatioChart data={analyticsData.newVsReturning} />}
          </ChartContainer>
          
          {/* Patient Demographics */}
          <ChartContainer
            title="Patient Demographics"
            isLoading={isDemographicsLoading}
          >
            {analyticsData && <PatientDemographicsChart data={analyticsData.patientDemographics} />}
          </ChartContainer>
        </div>
      </div>

      {/* Seasonal Trends Section */}
      <div className="space-y-6">
        <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">Seasonal Analysis</h3>
        
        <ChartContainer
          title="Seasonal Appointment Patterns"
          isLoading={isTrendsLoading}
        >
          {analyticsData && <SeasonalTrendsChart data={analyticsData.seasonalTrends} />}
        </ChartContainer>
      </div>
    </div>
  );
}

interface AnalyticCardProps {
  icon: React.ElementType;
  label: string;
  value: string;
  subtext?: string;
  isLoading?: boolean;
}

function AnalyticCard({ icon: Icon, label, value, subtext, isLoading }: AnalyticCardProps) {
  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200 hover:border-[#2B5C4B]/20 hover:shadow-lg transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className="bg-[#2B5C4B]/10 p-3 rounded-lg">
          <Icon className="h-6 w-6 text-[#2B5C4B]" />
        </div>
      </div>
      <p className="text-sm text-gray-600 mb-1">{label}</p>
      {isLoading ? (
        <div className="flex items-center justify-center h-8">
          <LoadingSpinner size="sm" />
        </div>
      ) : (
        <>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
          {subtext && <p className="text-xs text-gray-500 mt-1">{subtext}</p>}
        </>
      )}
    </div>
  );
}

interface ChartContainerProps {
  title: string;
  children: React.ReactNode;
  isLoading?: boolean;
}

function ChartContainer({ title, children, isLoading }: ChartContainerProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h4 className="text-base font-medium text-gray-800 mb-4">{title}</h4>
      {isLoading ? (
        <LoadingSpinner className="h-64" size="md" />
      ) : children}
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