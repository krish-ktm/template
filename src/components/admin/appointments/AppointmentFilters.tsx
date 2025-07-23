import { Search, Calendar, Filter, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

interface FilterState {
  dateRange: 'today' | 'tomorrow' | 'week' | 'all';
  status: 'all' | 'pending' | 'completed' | 'cancelled';
  search: string;
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
      search: ''
    });
    setShowAdvanced(false);
  };

  const hasActiveFilters = filters.status !== 'all' || filters.search !== '' || filters.dateRange !== 'today';

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
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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

                  {/* Results Count */}
                  <div className="flex items-end">
                    <div className="bg-[#2B5C4B]/5 rounded-lg p-3 w-full">
                      <p className="text-sm text-gray-600">Results</p>
                      <p className="text-lg font-semibold text-[#2B5C4B]">
                        {filteredCount} / {totalCount}
                      </p>
                    </div>
                  </div>

                  {/* Clear Filters */}
                  <div className="flex items-end">
                    {hasActiveFilters && (
                      <button
                        onClick={clearFilters}
                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        <X className="h-4 w-4" />
                        Clear Filters
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
                {filters.dateRange}
              </span>
            )}
            {filters.status !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#2B5C4B]/10 text-[#2B5C4B] rounded-md text-xs">
                Status: {filters.status}
              </span>
            )}
            {filters.search && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#2B5C4B]/10 text-[#2B5C4B] rounded-md text-xs">
                <Search className="h-3 w-3" />
                "{filters.search}"
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}