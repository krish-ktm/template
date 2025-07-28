import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { format, startOfToday, addDays, startOfWeek, endOfWeek } from 'date-fns';
import { MRAppointmentsTable } from './MRAppointmentsTable';
import { MRAppointmentFilters } from './MRAppointmentFilters';
import { Pagination } from '../appointments/Pagination';

interface MRAppointment {
  id: string;
  mr_name: string;
  company_name: string;
  division_name: string;
  contact_no: string;
  appointment_date: string;
  appointment_time?: string;
  created_at: string;
}

interface FilterState {
  dateRange: 'today' | 'tomorrow' | 'week' | 'all' | 'custom';
  startDate?: string;
  endDate?: string;
  search: string;
  company: string;
  division: string;
  sortBy: 'date' | 'name' | 'created' | 'company';
  sortOrder: 'asc' | 'desc';
  resetPage?: boolean;
}

export function MRAppointmentManager() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<MRAppointment[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    dateRange: 'today',
    search: '',
    company: '',
    division: '',
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
        .from('mr_appointments')
        .select('*', { count: 'exact' });

      // Date range filter
      const today = startOfToday();
      if (filters.dateRange === 'today') {
        query = query.eq('appointment_date', format(today, 'yyyy-MM-dd'));
      } else if (filters.dateRange === 'tomorrow') {
        query = query.eq('appointment_date', format(addDays(today, 1), 'yyyy-MM-dd'));
      } else if (filters.dateRange === 'week') {
        const weekStart = startOfWeek(today, { weekStartsOn: 1 }); // Monday
        const weekEnd = endOfWeek(today, { weekStartsOn: 1 }); // Sunday
        query = query
          .gte('appointment_date', format(weekStart, 'yyyy-MM-dd'))
          .lte('appointment_date', format(weekEnd, 'yyyy-MM-dd'));
      } else if (filters.dateRange === 'custom' && filters.startDate && filters.endDate) {
        query = query
          .gte('appointment_date', filters.startDate)
          .lte('appointment_date', filters.endDate);
      }

      // Search filter
      if (filters.search) {
        const searchTerm = filters.search.trim();
        // Check if the search term looks like a UUID
        const isUuid = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(searchTerm);
        
        if (isUuid) {
          // If it's a UUID, use exact match
          query = query.eq('id', searchTerm);
        } else {
          // For other fields, use ilike with escaped term
          const encodedTerm = encodeURIComponent(`*${searchTerm}*`);
          query = query.or(`mr_name.ilike.${encodedTerm},contact_no.ilike.${encodedTerm},company_name.ilike.${encodedTerm},division_name.ilike.${encodedTerm}`);
        }
      }

      // Company filter
      if (filters.company) {
          const encodedTerm = encodeURIComponent(`*${filters.company}*`);

        query = query.ilike('company_name', `%${encodedTerm}%`);
      }

      // Division filter
      if (filters.division) {
        const encodedTerm = encodeURIComponent(`*${filters.division}*`);

        query = query.ilike('division_name', `%${encodedTerm}%`);
      }

      // Sorting
      if (filters.sortBy === 'date') {
        query = query.order('appointment_date', { ascending: filters.sortOrder === 'asc' });
      } else if (filters.sortBy === 'name') {
        query = query.order('mr_name', { ascending: filters.sortOrder === 'asc' });
      } else if (filters.sortBy === 'company') {
        query = query.order('company_name', { ascending: filters.sortOrder === 'asc' });
      } else if (filters.sortBy === 'created') {
        query = query.order('created_at', { ascending: filters.sortOrder === 'asc' });
      }

      // Add pagination
      const { data, error, count } = await query
        .range(PAGE_FROM, PAGE_TO);

      if (error) throw error;
      setAppointments(data || []);
      setTotalCount(count || 0);
    } catch (error) {
      console.error('Error loading MR appointments:', error);
      toast.error('Failed to load MR appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this MR appointment? This action cannot be undone.')) {
      return;
    }

    try {
      setActionLoading(id);
      const { error } = await supabase.from('mr_appointments').delete().eq('id', id);
      if (error) throw error;
      
      // Remove the appointment from local state
      setAppointments(appointments.filter(app => app.id !== id));
      
      // Update total count
      setTotalCount(prev => prev - 1);
      
      toast.success('MR appointment deleted successfully');
    } catch (error) {
      console.error('Error deleting MR appointment:', error);
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
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">MR Appointment Management</h2>
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

      <MRAppointmentFilters 
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
        <MRAppointmentsTable
          appointments={appointments}
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