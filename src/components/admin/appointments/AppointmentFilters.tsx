import { Search, Calendar, Filter, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useMemo } from 'react';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';

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

interface AppointmentFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  totalCount: number;
  filteredCount: number;
}

export function AppointmentFilters({ 
  filters, 
  onFiltersChange, 
  totalCount, 
  filteredCount 
}: AppointmentFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      dateRange: 'today',
      status: 'all',
      search: '',
      ageRange: 'all',
      city: '',
      timeSlot: 'all',
      sortBy: 'date',
      sortOrder: 'asc'
    });
    setShowAdvanced(false);
  };

  const hasActiveFilters = useMemo(() => {
    return filters.status !== 'all' || 
           filters.search !== '' || 
           filters.dateRange !== 'today' ||
           filters.ageRange !== 'all' ||
           filters.city !== '' ||
           filters.timeSlot !== 'all' ||
           filters.sortBy !== 'date' ||
           filters.sortOrder !== 'asc';
  }, [filters]);

  const getDateRangeLabel = (range: string) => {
    switch (range) {
      case 'today': return 'Today';
      case 'tomorrow': return 'Tomorrow';
      case 'week': return 'This Week';
      case 'all': return 'All Dates';
      default: return range;
    }
  };

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
              placeholder="Search by name, phone, city, or ID..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B5C4B]/20 focus:border-[#2B5C4B] text-sm"
            />
          </div>

          {/* Date Range Quick Filters */}
          <div className="flex gap-2">
            {[
              { key: 'today', label: 'Today' },
              { key: 'tomorrow', label: 'Tomorrow' },
              { key: 'week', label: 'This Week' },
              { key: 'all', label: 'All' }
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => handleFilterChange('dateRange', key)}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  filters.dateRange === key
                    ? 'bg-[#2B5C4B] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {label}
              </button>
            ))}
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
              className="overflow-hidden"
            >
              <div className="pt-4 border-t border-gray-200">
                <div className="space-y-4">
                  {/* First Row - Status and Age Range */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Status Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Status
                      </label>
                      <select
                        value={filters.status}
                        onChange={(e) => handleFilterChange('status', e.target.value)}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B5C4B]/20 focus:border-[#2B5C4B] text-sm"
                      >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
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

                    {/* Time Slot Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Time Period
                      </label>
                      <select
                        value={filters.timeSlot}
                        onChange={(e) => handleFilterChange('timeSlot', e.target.value)}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B5C4B]/20 focus:border-[#2B5C4B] text-sm"
                      >
                        <option value="all">All Times</option>
                        <option value="morning">Morning (9 AM - 1 PM)</option>
                        <option value="evening">Evening (4 PM - 7 PM)</option>
                      </select>
                    </div>
                  </div>

                  {/* Second Row - City and Sorting */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* City Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        placeholder="Filter by city..."
                        value={filters.city}
                        onChange={(e) => handleFilterChange('city', e.target.value)}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B5C4B]/20 focus:border-[#2B5C4B] text-sm"
                      />
                    </div>

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
                        <option value="date">Appointment Date</option>
                        <option value="name">Patient Name</option>
                        <option value="created">Booking Date</option>
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
                        <option value="asc">Ascending</option>
                        <option value="desc">Descending</option>
                      </select>
                    </div>
                  </div>

                  {/* Third Row - Results and Clear */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2 border-t border-gray-100">
                    <div className="text-sm text-gray-600">
                      Showing <span className="font-semibold text-[#2B5C4B]">{filteredCount}</span> of <span className="font-semibold">{totalCount}</span> appointments
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
            {filters.dateRange !== 'today' && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#2B5C4B]/10 text-[#2B5C4B] rounded-md text-xs">
                <Calendar className="h-3 w-3" />
                {getDateRangeLabel(filters.dateRange)}
              </span>
            )}
            {filters.status !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#2B5C4B]/10 text-[#2B5C4B] rounded-md text-xs">
                Status: {filters.status}
              </span>
            )}
            {filters.ageRange !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#2B5C4B]/10 text-[#2B5C4B] rounded-md text-xs">
                Age: {filters.ageRange}
              </span>
            )}
            {filters.city && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#2B5C4B]/10 text-[#2B5C4B] rounded-md text-xs">
                City: {filters.city}
              </span>
            )}
            {filters.timeSlot !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#2B5C4B]/10 text-[#2B5C4B] rounded-md text-xs">
                Time: {filters.timeSlot}
              </span>
            )}
            {filters.search && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#2B5C4B]/10 text-[#2B5C4B] rounded-md text-xs">
                <Search className="h-3 w-3" />
                "{filters.search}"
              </span>
            )}
            {(filters.sortBy !== 'date' || filters.sortOrder !== 'asc') && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#2B5C4B]/10 text-[#2B5C4B] rounded-md text-xs">
                Sort: {filters.sortBy} ({filters.sortOrder})
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}