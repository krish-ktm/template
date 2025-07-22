import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, addMonths, isToday, startOfToday } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import { Calendar, Trash2, Edit2, Plus, X, AlertCircle } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { toast } from 'react-hot-toast';
import { CustomDatePicker } from '../CustomDatePicker';

interface MRClosureDate {
  id: string;
  date: string;
  reason: string;
  created_at: string;
}

const TIMEZONE = 'Asia/Kolkata';
const DEFAULT_REASON = 'Not Available for MR Appointments';

export function MRDateManager() {
  const [closureDates, setClosureDates] = useState<MRClosureDate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingDate, setEditingDate] = useState<MRClosureDate | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [selectedDates, setSelectedDates] = useState<Date[]>([new Date()]);

  useEffect(() => {
    loadClosureDates();
  }, []);

  // Set up the editing date in form
  useEffect(() => {
    if (editingDate) {
      setSelectedDates([new Date(editingDate.date)]);
    }
  }, [editingDate]);

  const loadClosureDates = async () => {
    try {
      const today = startOfToday();
      const { data, error } = await supabase
        .from('mr_closure_dates')
        .select('*')
        .gte('date', format(today, 'yyyy-MM-dd'))
        .order('date', { ascending: true });

      if (error) throw error;
      setClosureDates(data || []);
    } catch (error) {
      console.error('Error loading closure dates:', error);
      toast.error('Failed to load closure dates');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (selectedDates.length === 0) {
        throw new Error('Please select at least one date');
      }

      const userStr = localStorage.getItem('user');
      if (!userStr) throw new Error('User not found');
      
      const user = JSON.parse(userStr);
      
      // If editing, just update that single date
      if (editingDate) {
        const dateStr = format(selectedDates[0], 'yyyy-MM-dd');
        
        // Check for duplicate date
        const isDuplicate = closureDates.some(date => 
          date.date === dateStr && date.id !== editingDate.id
        );

        if (isDuplicate) {
          throw new Error('A closure date already exists for this date');
        }

        const { error } = await supabase
          .from('mr_closure_dates')
          .update({
            date: dateStr,
            reason: DEFAULT_REASON,
            created_by: user.id
          })
          .eq('id', editingDate.id);

        if (error) throw error;
        toast.success('Closure date updated successfully');
      } else {
        // For new entries - handle single date or date range
        
        // Create an array of dates to insert
        const datesToInsert = selectedDates.map(date => ({
          date: format(date, 'yyyy-MM-dd'),
          reason: DEFAULT_REASON,
          created_by: user.id
        }));

        // Check for duplicates in the database for all dates to insert
        for (const dateObj of datesToInsert) {
          const isDuplicate = closureDates.some(existingDate => 
            existingDate.date === dateObj.date
          );

          if (isDuplicate) {
            throw new Error(`A closure date already exists for ${format(new Date(dateObj.date), 'MMMM d, yyyy')}`);
          }
        }

        // Insert all dates
        if (datesToInsert.length > 0) {
          const { error } = await supabase
            .from('mr_closure_dates')
            .insert(datesToInsert);
  
          if (error) throw error;
          
          toast.success(
            datesToInsert.length === 1 
              ? 'Closure date added successfully' 
              : `${datesToInsert.length} closure dates added successfully`
          );
        }
      }

      // Reset state
      setSelectedDates([new Date()]);
      setShowForm(false);
      setEditingDate(null);
      loadClosureDates();
    } catch (error) {
      console.error('Error saving closure date:', error);
      if (error instanceof Error) {
        toast.error(error.message || 'Failed to save closure date');
      } else {
        toast.error('Failed to save closure date');
      }
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('mr_closure_dates')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Closure date deleted successfully');
      setDeleteConfirm(null);
      loadClosureDates();
    } catch (error) {
      console.error('Error deleting closure date:', error);
      toast.error('Failed to delete closure date');
    }
  };

  const formatDate = (dateStr: string) => {
    const date = utcToZonedTime(new Date(dateStr), TIMEZONE);
    return format(date, 'EEEE, MMMM d, yyyy');
  };

  const groupDatesByMonth = (dates: MRClosureDate[]) => {
    return dates.reduce((acc, date) => {
      const monthYear = format(new Date(date.date), 'MMMM yyyy');
      if (!acc[monthYear]) {
        acc[monthYear] = [];
      }
      acc[monthYear].push(date);
      return acc;
    }, {} as Record<string, MRClosureDate[]>);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2B5C4B]"></div>
      </div>
    );
  }

  const groupedDates = groupDatesByMonth(closureDates);

  return (
    <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200">
      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0 mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-[#2B5C4B]/10 p-3 rounded-lg">
              <Calendar className="h-6 w-6 text-[#2B5C4B]" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">MR Closure Dates</h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">Manage dates when MR appointments are not available</p>
            </div>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-[#2B5C4B] text-white rounded-lg hover:bg-[#234539] transition-colors text-sm sm:text-base"
          >
            <Plus className="h-4 w-4" />
            Add Date
          </button>
        </div>

        {showForm && (
          <div 
            className="fixed inset-0 z-[9999]"
            style={{ 
              margin: 0, 
              padding: 0, 
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              backdropFilter: 'blur(4px)'
            }}
            onClick={() => {
              setShowForm(false);
              setEditingDate(null);
              setSelectedDates([new Date()]);
            }}
          >
            <div className="w-full h-full flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-auto relative flex flex-col max-h-[90vh]"
                onClick={e => e.stopPropagation()}
              >
                <div className="sticky top-0 z-10 bg-gradient-to-r from-[#2B5C4B] to-[#234539] rounded-t-xl">
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-semibold text-white">
                        {editingDate ? 'Edit Closure Date' : 'Add New Closure Date'}
                      </h3>
                      <button
                        onClick={() => {
                          setShowForm(false);
                          setEditingDate(null);
                          setSelectedDates([new Date()]);
                        }}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                      >
                        <X className="h-5 w-5 text-white" />
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="p-6 overflow-y-auto">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <CustomDatePicker 
                      className="w-full"
                      selectedDates={selectedDates}
                      onChange={setSelectedDates}
                      minDate={startOfToday()}
                      maxDate={addMonths(new Date(), 12)}
                      disableEditMode={editingDate !== null}
                    />

                    <div className="flex justify-end gap-3 pt-4">
                      <button
                        type="button"
                        className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-300 rounded-lg"
                        onClick={() => {
                          setShowForm(false);
                          setEditingDate(null);
                          setSelectedDates([new Date()]);
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-[#2B5C4B] rounded-lg hover:bg-[#234539]"
                      >
                        {editingDate ? 'Update' : 'Add'}
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </div>
          </div>
        )}

        <div className="space-y-6 sm:space-y-8">
          {closureDates.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-1">No Upcoming Closure Dates</h3>
              <p className="text-sm text-gray-500">No closure dates have been added for upcoming days.</p>
            </div>
          ) : (
            Object.entries(groupedDates).map(([monthYear, dates]) => (
              <div key={monthYear}>
                <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">{monthYear}</h3>
                <div className="space-y-2 sm:space-y-3">
                  {dates.map((date) => {
                    const closureDate = utcToZonedTime(new Date(date.date), TIMEZONE);
                    const isTodays = isToday(closureDate);

                    return (
                      <motion.div
                        key={date.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex items-center justify-between p-3 sm:p-4 rounded-lg border ${
                          isTodays
                            ? 'bg-green-50 border-green-100'
                            : 'bg-[#2B5C4B]/5 border-[#2B5C4B]/10'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${
                            isTodays
                              ? 'bg-green-100'
                              : 'bg-[#2B5C4B]/20'
                          }`}>
                            <Calendar className={`h-5 w-5 ${
                              isTodays
                                ? 'text-green-600'
                                : 'text-[#2B5C4B]'
                            }`} />
                          </div>
                          <div>
                            <p className={`text-sm sm:text-base font-medium ${
                              isTodays
                                ? 'text-green-700'
                                : 'text-[#2B5C4B]'
                            }`}>
                              {formatDate(date.date)}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setEditingDate(date);
                              setSelectedDates([new Date(date.date)]);
                              setShowForm(true);
                            }}
                            className="p-1 sm:p-1.5 rounded-lg hover:bg-white/50 transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(date.id)}
                            className="p-1 sm:p-1.5 rounded-lg hover:bg-white/50 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" />
                          </button>

                          {/* Delete Confirmation Popover */}
                          <AnimatePresence>
                            {deleteConfirm === date.id && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="absolute right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-10"
                              >
                                <div className="flex items-start gap-3 mb-4">
                                  <div className="bg-red-50 p-2 rounded-lg flex-shrink-0">
                                    <AlertCircle className="h-5 w-5 text-red-600" />
                                  </div>
                                  <div>
                                    <h4 className="text-sm font-medium text-gray-900">Confirm Delete</h4>
                                    <p className="text-sm text-gray-500 mt-1">Are you sure you want to delete this closure date?</p>
                                  </div>
                                </div>
                                <div className="flex justify-end gap-2">
                                  <button
                                    onClick={() => setDeleteConfirm(null)}
                                    className="w-full sm:w-auto px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    onClick={() => handleDelete(date.id)}
                                    className="w-full sm:w-auto px-3 py-1.5 text-sm text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-1.5"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                    Delete
                                  </button>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}