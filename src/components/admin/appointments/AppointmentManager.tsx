import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { BookingDetails } from '../../../types';
import { toast } from 'react-hot-toast';
import { LoadingSpinner } from '../../LoadingSpinner';
import { useNavigate } from 'react-router-dom';
import { AppointmentsTable } from './AppointmentsTable';
import { AppointmentFilters } from './AppointmentFilters';
import { format, startOfToday, addDays, subDays } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';

const TIMEZONE = 'Asia/Kolkata';

interface FilterState {
  dateRange: 'today' | 'tomorrow' | 'week' | 'all';
  status: 'all' | 'pending' | 'completed' | 'cancelled';
  search: string;
  ageRange: 'all' | 'child' | 'adult' | 'senior';
  city: string;
  timeSlot: 'all' | 'morning' | 'evening';
  sortBy: 'date' | 'name' | 'created';
  sortOrder: 'asc' | 'desc';
}

export function AppointmentManager() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<BookingDetails[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<BookingDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    dateRange: 'today',
    status: 'all',
    search: '',
    ageRange: 'all',
    city: '',
    timeSlot: 'all',
    sortBy: 'date',
    sortOrder: 'asc'
  });

  useEffect(() => {
    loadAppointments();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [appointments, filters]);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        navigate('/login');
        throw new Error('Authentication required');
      }

      // Get date range for fetching
      const today = startOfToday();
      const startDate = subDays(today, 7); // Get past week for context
      const endDate = addDays(today, 30); // Get next month

      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .gte('appointment_date', format(startDate, 'yyyy-MM-dd'))
        .lte('appointment_date', format(endDate, 'yyyy-MM-dd'))
        .order('appointment_date', { ascending: false })
        .order('appointment_time', { ascending: true });

      if (error) throw error;
      setAppointments(data || []);
    } catch (error: unknown) {
      console.error('Error loading appointments:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to load appointments';
      toast.error(errorMessage);
      if (error instanceof Error && error.message === 'Authentication required') {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...appointments];
    const today = startOfToday();
    const tomorrow = addDays(today, 1);
    const weekStart = today;
    const weekEnd = addDays(today, 7);

    // Apply date range filter
    if (filters.dateRange !== 'all') {
      filtered = filtered.filter(appointment => {
        const appointmentDate = new Date(appointment.appointment_date);
        
        switch (filters.dateRange) {
          case 'today':
            return format(appointmentDate, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');
          case 'tomorrow':
            return format(appointmentDate, 'yyyy-MM-dd') === format(tomorrow, 'yyyy-MM-dd');
          case 'week':
            return appointmentDate >= weekStart && appointmentDate <= weekEnd;
          default:
            return true;
        }
      });
    }

    // Apply status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(appointment => appointment.status === filters.status);
    }

    // Apply age range filter
    if (filters.ageRange !== 'all') {
      filtered = filtered.filter(appointment => {
        const age = appointment.age;
        switch (filters.ageRange) {
          case 'child':
            return age >= 0 && age <= 17;
          case 'adult':
            return age >= 18 && age <= 59;
          case 'senior':
            return age >= 60;
          default:
            return true;
        }
      });
    }

    // Apply city filter
    if (filters.city) {
      const cityLower = filters.city.toLowerCase();
      filtered = filtered.filter(appointment =>
        appointment.city.toLowerCase().includes(cityLower)
      );
    }

    // Apply time slot filter
    if (filters.timeSlot !== 'all') {
      filtered = filtered.filter(appointment => {
        const time = appointment.appointment_time;
        const hour = parseInt(time.split(':')[0]);
        const isPM = time.includes('PM');
        const hour24 = isPM && hour !== 12 ? hour + 12 : (!isPM && hour === 12 ? 0 : hour);
        
        switch (filters.timeSlot) {
          case 'morning':
            return hour24 >= 9 && hour24 < 13; // 9 AM to 1 PM
          case 'evening':
            return hour24 >= 16 && hour24 < 19; // 4 PM to 7 PM
          default:
            return true;
        }
      });
    }

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(appointment =>
        appointment.name.toLowerCase().includes(searchLower) ||
        appointment.phone.includes(filters.search) ||
        appointment.city.toLowerCase().includes(searchLower) ||
        appointment.id.toLowerCase().includes(searchLower)
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (filters.sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'created':
          comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          break;
        case 'date':
        default:
          const dateComparison = a.appointment_date.localeCompare(b.appointment_date);
          if (dateComparison === 0) {
            // If dates are the same, sort by time
            const timeA = new Date(`1970/01/01 ${a.appointment_time}`).getTime();
            const timeB = new Date(`1970/01/01 ${b.appointment_time}`).getTime();
            comparison = timeA - timeB;
          } else {
            comparison = dateComparison;
          }
          break;
      }
      
      return filters.sortOrder === 'desc' ? -comparison : comparison;
    });

    setFilteredAppointments(filtered);
  };

  const handleStatusUpdate = async (appointmentId: string, newStatus: 'completed' | 'cancelled') => {
    try {
      setActionLoading(appointmentId);
      
      const { error } = await supabase
        .from('appointments')
        .update({ status: newStatus })
        .eq('id', appointmentId);

      if (error) throw error;

      // Update local state without refetching
      setAppointments(prev => 
        prev.map(appointment => 
          appointment.id === appointmentId 
            ? { ...appointment, status: newStatus }
            : appointment
        )
      );

      toast.success(`Appointment ${newStatus} successfully`);
    } catch (error) {
      console.error('Error updating appointment status:', error);
      toast.error('Failed to update appointment status');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (appointmentId: string) => {
    if (!confirm('Are you sure you want to delete this appointment? This action cannot be undone.')) {
      return;
    }

    try {
      setActionLoading(appointmentId);
      
      const { error } = await supabase
        .from('appointments')
        .delete()
        .eq('id', appointmentId);

      if (error) throw error;

      // Update local state without refetching
      setAppointments(prev => prev.filter(appointment => appointment.id !== appointmentId));
      toast.success('Appointment deleted successfully');
    } catch (error) {
      console.error('Error deleting appointment:', error);
      toast.error('Failed to delete appointment');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6 pt-12 sm:pt-0 mt-4 sm:mt-0 px-2 sm:px-0">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">Appointment Management</h2>
          <p className="text-sm text-gray-500 mt-1">
            Showing {filteredAppointments.length} of {appointments.length} appointments
          </p>
        </div>
        <button
          onClick={loadAppointments}
          className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 bg-[#2B5C4B] text-white rounded-lg hover:bg-[#234539] transition-colors text-sm"
        >
          Refresh
        </button>
      </div>

      <AppointmentFilters
        filters={filters}
        onFiltersChange={setFilters}
        totalCount={appointments.length}
        filteredCount={filteredAppointments.length}
      />

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <AppointmentsTable
          appointments={filteredAppointments}
          onStatusUpdate={handleStatusUpdate}
          onDelete={handleDelete}
          actionLoading={actionLoading}
        />
      </div>
    </div>
  );
}