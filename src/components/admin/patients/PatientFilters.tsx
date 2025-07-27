import { Search, Filter, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useMemo, useEffect } from 'react';

interface FilterState {
  search: string;
  gender: 'all' | 'male' | 'female' | 'other';
  ageRange: 'all' | 'child' | 'adult' | 'senior';
  sortBy: 'created' | 'name' | 'updated';
  sortOrder: 'asc' | 'desc';
  resetPage?: boolean;
}

interface PatientFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  totalCount: number;
  filteredCount: number;
}

export function PatientFilters({ 
  filters, 
  onFiltersChange, 
  totalCount, 
  filteredCount 
}: PatientFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Immediate update for non-search filters
  const handleFilterChange = (key: keyof FilterState, value: string) => {
    if (key === 'search') {
      // Search is handled with debouncing below
      setSearchInput(value);
    } else {
      onFiltersChange({
        ...filters,
        [key]: value
      });
    }
  };

  // ---- Search with debounce ----
  const [searchInput, setSearchInput] = useState(filters.search);

  // keep local input in sync when outer filter resets (e.g., clear filters)
  useEffect(() => {
    setSearchInput(filters.search);
  }, [filters.search]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchInput !== filters.search) {
        onFiltersChange({
          ...filters,
          search: searchInput
        });
      }
    }, 400); // 400-ms debounce
    return () => clearTimeout(handler);
  }, [searchInput]);

  const clearFilters = () => {
    onFiltersChange({
      search: '',
      gender: 'all',
      ageRange: 'all',
      sortBy: 'created',
      sortOrder: 'desc'
    });
    setShowAdvanced(false);
  };

  const hasActiveFilters = useMemo(() => {
    return filters.gender !== 'all' || 
           filters.search !== '' || 
           filters.ageRange !== 'all' ||
           filters.sortBy !== 'created' ||
           filters.sortOrder !== 'desc';
  }, [filters]);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
      <div className="flex flex-col gap-4">
        {/* Search and Quick Filters */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by name, phone, email..."
              value={searchInput}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B5C4B]/20 focus:border-[#2B5C4B] text-sm"
            />
          </div>

          {/* Advanced Filters Toggle */}
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
              showAdvanced
                ? 'bg-[#2B5C4B]/10 text-[#2B5C4B]'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Filter className="h-4 w-4" />
            <span className="hidden sm:inline">Filters</span>
            {hasActiveFilters && !showAdvanced && (
              <span className="bg-[#2B5C4B] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                !
              </span>
            )}
          </button>
        </div>

        {/* Advanced Filters */}
        <AnimatePresence>
          {showAdvanced && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-visible"
            >
              <div className="pt-4 border-t border-gray-200">
                <div className="space-y-4">
                  {/* First Row - Gender and Age Range */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Gender Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Gender
                      </label>
                      <select
                        value={filters.gender}
                        onChange={(e) => handleFilterChange('gender', e.target.value)}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B5C4B]/20 focus:border-[#2B5C4B] text-sm"
                      >
                        <option value="all">All Genders</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    {/* Age Range Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Age Group
                      </label>
                      <select
                        value={filters.ageRange}
                        onChange={(e) => handleFilterChange('ageRange', e.target.value)}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B5C4B]/20 focus:border-[#2B5C4B] text-sm"
                      >
                        <option value="all">All Ages</option>
                        <option value="child">Child (0-17)</option>
                        <option value="adult">Adult (18-59)</option>
                        <option value="senior">Senior (60+)</option>
                      </select>
                    </div>
                  </div>

                  {/* Second Row - Sorting */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Sort By */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Sort By
                      </label>
                      <select
                        value={filters.sortBy}
                        onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B5C4B]/20 focus:border-[#2B5C4B] text-sm"
                      >
                        <option value="created">Registration Date</option>
                        <option value="name">Patient Name</option>
                        <option value="updated">Last Updated</option>
                      </select>
                    </div>

                    {/* Sort Order */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Order
                      </label>
                      <select
                        value={filters.sortOrder}
                        onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B5C4B]/20 focus:border-[#2B5C4B] text-sm"
                      >
                        <option value="desc">Newest First</option>
                        <option value="asc">Oldest First</option>
                      </select>
                    </div>
                  </div>

                  {/* Third Row - Results and Clear */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2 border-t border-gray-100">
                    <div className="text-sm text-gray-600">
                      {filteredCount > 0 ? `Found ${filteredCount} of ${totalCount} patients` : 'No patients found'}
                    </div>
                    {hasActiveFilters && (
                      <button
                        onClick={clearFilters}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        <X className="h-4 w-4" />
                        Clear All Filters
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Active Filters Summary */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-100">
            <span className="text-sm text-gray-500">Active filters:</span>
            
            {filters.gender !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#2B5C4B]/10 text-[#2B5C4B] rounded-md text-xs">
                Gender: {filters.gender}
              </span>
            )}
            {filters.ageRange !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#2B5C4B]/10 text-[#2B5C4B] rounded-md text-xs">
                Age: {filters.ageRange}
              </span>
            )}
            {filters.search && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#2B5C4B]/10 text-[#2B5C4B] rounded-md text-xs">
                <Search className="h-3 w-3" />
                "{filters.search}"
              </span>
            )}
            {(filters.sortBy !== 'created' || filters.sortOrder !== 'desc') && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#2B5C4B]/10 text-[#2B5C4B] rounded-md text-xs">
                Sort: {filters.sortBy} ({filters.sortOrder === 'desc' ? 'newest first' : 'oldest first'})
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 