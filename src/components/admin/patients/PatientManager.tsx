import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { Patient } from '../../../types';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { PatientsTable } from './PatientsTable';
import { PatientFilters } from './PatientFilters';
import { Pagination } from '../appointments/Pagination';

interface FilterState {
  search: string;
  gender: 'all' | 'male' | 'female' | 'other';
  ageRange: 'all' | 'child' | 'adult' | 'senior';
  sortBy: 'created' | 'name' | 'updated';
  sortOrder: 'asc' | 'desc';
  resetPage?: boolean;
}

export function PatientManager() {
  const navigate = useNavigate();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    gender: 'all',
    ageRange: 'all',
    sortBy: 'created',
    sortOrder: 'desc'
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
    loadPatients();
  }, [filters, currentPage]);

  const loadPatients = async () => {
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
        .from('patients')
        .select('*', { count: 'exact' });

      // Apply search filter
      if (filters.search) {
        query = query.or(
          `first_name.ilike.%${filters.search}%,last_name.ilike.%${filters.search}%,phone_number.ilike.%${filters.search}%,email.ilike.%${filters.search}%`
        );
      }

      // Apply gender filter
      if (filters.gender !== 'all') {
        query = query.eq('gender', filters.gender);
      }

      // Apply age range filter
      if (filters.ageRange !== 'all') {
        if (filters.ageRange === 'child') {
          query = query.lt('age', 18);
        } else if (filters.ageRange === 'adult') {
          query = query.gte('age', 18).lt('age', 60);
        } else if (filters.ageRange === 'senior') {
          query = query.gte('age', 60);
        }
      }

      // Apply sorting
      const sortField = filters.sortBy === 'name' 
        ? 'first_name' 
        : filters.sortBy === 'updated' 
          ? 'updated_at' 
          : 'created_at';
      
      query = query.order(sortField, { ascending: filters.sortOrder === 'asc' });

      // Apply pagination
      query = query.range(PAGE_FROM, PAGE_TO);

      const { data, error, count } = await query;

      if (error) throw error;
      
      setPatients(data || []);
      setTotalCount(count || 0);
    } catch (error) {
      console.error('Error loading patients:', error);
      toast.error('Failed to load patients');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, updatedData: Partial<Patient>) => {
    try {
      setActionLoading(id);
      
      const { error } = await supabase
        .from('patients')
        .update(updatedData)
        .eq('id', id);
      
      if (error) throw error;
      
      // Refresh the patients list
      await loadPatients();
      
      toast.success('Patient updated successfully');
    } catch (error) {
      console.error('Error updating patient:', error);
      toast.error('Failed to update patient');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setActionLoading(id);
      
      // Check if patient has appointments
      const { data: appointments, error: checkError } = await supabase
        .from('appointments')
        .select('id')
        .eq('patient_id', id)
        .limit(1);
      
      if (checkError) throw checkError;
      
      if (appointments && appointments.length > 0) {
        toast.error('Cannot delete patient with existing appointments');
        return;
      }
      
      const { error } = await supabase
        .from('patients')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Refresh the patients list
      await loadPatients();
      
      toast.success('Patient deleted successfully');
    } catch (error) {
      console.error('Error deleting patient:', error);
      toast.error('Failed to delete patient');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-6 px-2 sm:px-0 mt-4 sm:mt-0 pt-12 sm:pt-0">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">Patient Management</h2>
      </div>

      {/* Filters */}
      <PatientFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        totalCount={totalCount}
        filteredCount={patients.length}
      />

      {/* Patients Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <PatientsTable
          patients={patients}
          onUpdate={handleStatusUpdate}
          onDelete={handleDelete}
          actionLoading={actionLoading}
        />
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(totalCount / PAGE_SIZE)}
        onPageChange={setCurrentPage}
      />
    </div>
  );
} 