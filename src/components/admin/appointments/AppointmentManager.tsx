import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { BookingDetails } from '../../../types';
import { toast } from 'react-hot-toast';
// LoadingSpinner no longer used as full-page loader; using small inline spinner instead.
import { useNavigate } from 'react-router-dom';
import { AppointmentsTable } from './AppointmentsTable';
import { AppointmentFilters } from './AppointmentFilters';
import { format, startOfToday, addDays, startOfWeek, endOfWeek } from 'date-fns';
import { Pagination } from './Pagination';

interface FilterState {
  dateRange: 'today' | 'tomorrow' | 'week' | 'all' | 'custom';
  startDate?: string; // YYYY-MM-DD when dateRange === 'custom'
  endDate?: string;   // YYYY-MM-DD when dateRange === 'custom'
  status: 'all' | 'pending' | 'completed' | 'cancelled';
  search: string;
  ageRange: 'all' | 'child' | 'adult' | 'senior';
  city: string;
  timeSlot: 'all' | 'morning' | 'evening';
  sortBy: 'date' | 'name' | 'created';
  sortOrder: 'asc' | 'desc';
  resetPage?: boolean;
}

export function AppointmentManager() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<BookingDetails[]>([]);
  const [totalCount, setTotalCount] = useState(0);
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
    sortOrder: 'asc',
    startDate: undefined,
    endDate: undefined
  });

  // Pagination state
  const PAGE_SIZE = 10;
  const [currentPage, setCurrentPage] = useState(1);

  // Handle filter changes, including resetting page when needed
  const handleFiltersChange = (newFilters: FilterState) => {
    // Always reset to page 1 when filters change
    setCurrentPage(1);
    
    // Remove the resetPage flag before setting filters if it exists
    if (newFilters.resetPage) {
      // Create a new object without the resetPage property
      const filtersWithoutReset = { ...newFilters };
      delete filtersWithoutReset.resetPage;
      setFilters(filtersWithoutReset);
    } else {
      setFilters(newFilters);
    }
  };

  // Fetch whenever filters or page change
  useEffect(() => {
    loadAppointments();
  }, [filters, currentPage]);

  // This effect is no longer needed since we handle page reset in handleFiltersChange
  // useEffect(() => {
  //   setCurrentPage(1);
  // }, [filters]);

  const loadAppointments = async () => {
    try {
      setLoading(true);

      const userStr = localStorage.getItem('user');
      if (!userStr) {
        navigate('/login');
        throw new Error('Authentication required');
      }

      const PAGE_FROM = (currentPage - 1) * PAGE_SIZE;
      const PAGE_TO = PAGE_FROM + PAGE_SIZE - 1;

      // Start building query
      let query = supabase
        .from('appointments')
        .select('*', { count: 'exact' });

      // Date range filter
      const today = startOfToday();
      if (filters.dateRange === 'today') {
        query = query.eq('appointment_date', format(today, 'yyyy-MM-dd'));
      } else if (filters.dateRange === 'tomorrow') {
        const tomorrow = addDays(today, 1);
        query = query.eq('appointment_date', format(tomorrow, 'yyyy-MM-dd'));
      } else if (filters.dateRange === 'week') {
        // "This Week" should include all days of the current calendar week (Mon-Sun).
        // Using ISO week definition with Monday as the first day of the week.
        const weekStart = startOfWeek(today, { weekStartsOn: 1 });
        const weekEnd = endOfWeek(today, { weekStartsOn: 1 });

        query = query
          .gte('appointment_date', format(weekStart, 'yyyy-MM-dd'))
                     .lte('appointment_date', format(weekEnd, 'yyyy-MM-dd'));
      } else if (filters.dateRange === 'custom') {
        if (filters.startDate) {
          query = query.gte('appointment_date', filters.startDate);
        }
        if (filters.endDate) {
          query = query.lte('appointment_date', filters.endDate);
        }
      }

      // Status filter
      if (filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }

      // Age range filter
      if (filters.ageRange === 'child') {
        query = query.lte('age', 17);
      } else if (filters.ageRange === 'adult') {
        query = query.gte('age', 18).lte('age', 59);
      } else if (filters.ageRange === 'senior') {
        query = query.gte('age', 60);
      }

      // City filter
      if (filters.city) {
        const encodedTerm = encodeURIComponent(`*${filters.city}*`);
        query = query.ilike('city', `%${encodedTerm}%`);
      }

      // Time slot filter (simple AM/PM approximation)
      if (filters.timeSlot === 'morning') {
        query = query.ilike('appointment_time', '%AM%');
      } else if (filters.timeSlot === 'evening') {
        query = query.ilike('appointment_time', '%PM%');
      }

      // Search filter across multiple fields
      if (filters.search) {
        const term = filters.search.trim();
        const isUuid = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(term);
        const encodedTerm = encodeURIComponent(`*${term}*`);
        const orFilters = [
          `name.ilike.${encodedTerm}`,
          `city.ilike.${encodedTerm}`,
          `phone.ilike.${encodedTerm}`
        ];
        if (isUuid) {
          orFilters.push(`id.eq.${term}`);
        }
        query = query.or(orFilters.join(','));
      }
      

      // Sorting
      switch (filters.sortBy) {
        case 'name':
          query = query.order('name', { ascending: filters.sortOrder === 'asc' });
          break;
        case 'created':
          query = query.order('created_at', { ascending: filters.sortOrder === 'asc' });
          break;
        case 'date':
        default:
          query = query
            .order('appointment_date', { ascending: filters.sortOrder === 'asc' })
            .order('appointment_time', { ascending: filters.sortOrder === 'asc' });
          break;
      }

      // Pagination
      query = query.range(PAGE_FROM, PAGE_TO);

      const { data, count, error } = await query;
      if (error) throw error;

      setAppointments(data as BookingDetails[]);
      setTotalCount(count || 0);
    } catch (error) {
      console.error('Error loading appointments:', error);
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };
  // Local applyFilters logic removed – filtering done server-side now.

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

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  
  // Calculate the range of appointments being shown
  const startRange = totalCount === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const endRange = Math.min(currentPage * PAGE_SIZE, totalCount);

  return (
    <div className="space-y-6 pt-12 sm:pt-0 mt-4 sm:mt-0 px-2 sm:px-0">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">Appointment Management</h2>
          <p className="text-sm text-gray-500 mt-1">
            {totalCount > 0 ? 
              `Showing ${startRange}-${endRange} of ${totalCount} appointments` : 
              'No appointments found'}
          </p>
        </div>
        <button
          onClick={loadAppointments}
          disabled={loading}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#2B5C4B] text-white rounded-lg transition-colors text-sm disabled:opacity-60"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            'Refresh'
          )}
        </button>
      </div>

      <AppointmentFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        totalCount={totalCount}
        filteredCount={totalCount}
      />

      <div className="bg-white shadow rounded-lg overflow-hidden relative">
        {loading && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-10">
            <div className="w-8 h-8 border-2 border-gray-300 border-t-[#2B5C4B] rounded-full animate-spin" />
          </div>
        )}
        <AppointmentsTable
          appointments={appointments}
          onStatusUpdate={handleStatusUpdate}
          onDelete={handleDelete}
          actionLoading={actionLoading}
        />
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}