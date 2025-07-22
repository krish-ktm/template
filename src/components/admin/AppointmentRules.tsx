import React from 'react';
import { useState, useEffect, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { Edit2, AlertCircle, MoveUp, MoveDown, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import clsx from 'clsx';

// Define the type for title and content
type MultilingualContent = {
  en: string;
  gu: string;
};

interface Rule {
  id: string;
  title: MultilingualContent;
  content: MultilingualContent;
  display_order: number;
  is_active: boolean;
  updated_at: string;
}

// Define prop types for form components
interface FormInputProps {
  label: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  className?: string;
  min?: number;
  placeholder?: string;
  required?: boolean;
  [key: string]: unknown;
}

interface FormTextareaProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  className?: string;
  rows?: number;
  placeholder?: string;
  required?: boolean;
  [key: string]: unknown;
}

// Memoized form components to prevent unnecessary re-renders
const FormInput = memo(({ label, value, onChange, type = 'text', className = '', ...props }: FormInputProps) => (
  <motion.div 
    className={className}
    initial={{ opacity: 0, y: 5 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.2 }}
  >
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2B5C4B]/30 focus:border-transparent transition-all duration-200"
      {...props}
    />
  </motion.div>
));

const FormTextarea = memo(({ label, value, onChange, rows = 4, className = '', ...props }: FormTextareaProps) => {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  
  // Auto-resize effect
  React.useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      // Reset height to auto to get the correct scrollHeight
      textarea.style.height = 'auto';
      // Set the height to match content
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [value]);

  return (
    <motion.div 
      className={className}
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={onChange}
        rows={rows}
        className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2B5C4B]/30 focus:border-transparent transition-all duration-200 resize-none overflow-hidden"
        {...props}
      />
    </motion.div>
  );
});

FormInput.displayName = 'FormInput';
FormTextarea.displayName = 'FormTextarea';

export default function AppointmentRules() {
  const [rules, setRules] = useState<Rule[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingRule, setEditingRule] = useState<Rule | null>(null);
  const [showAddNew, setShowAddNew] = useState(false);
  const [newRule, setNewRule] = useState<Omit<Rule, 'id' | 'updated_at' | 'display_order'>>({
    title: { en: '', gu: '' },
    content: { en: '', gu: '' },
    is_active: true
  });
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const fetchRules = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('appointment_rules')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setRules(data || []);
    } catch (error: unknown) {
      console.error('Error fetching rules:', error instanceof Error ? error.message : String(error));
      toast.error('Failed to load rules');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRules();
  }, [fetchRules]);

  const handleEdit = useCallback((rule: Rule) => {
    setEditingId(rule.id);
    setEditingRule({ ...rule });
  }, []);

  const handleCancelEdit = useCallback(() => {
    setEditingId(null);
    setEditingRule(null);
  }, []);

  const handleSaveEdit = useCallback(async () => {
    if (!editingRule) return;
    
    try {
      const { error } = await supabase
        .from('appointment_rules')
        .update({
          title: editingRule.title,
          content: editingRule.content,
          is_active: editingRule.is_active,
          display_order: editingRule.display_order
        })
        .eq('id', editingRule.id);

      if (error) throw error;
      
      toast.success('Rule updated successfully');
      setEditingId(null);
      setEditingRule(null);
      fetchRules();
    } catch (error: unknown) {
      console.error('Error updating rule:', error instanceof Error ? error.message : String(error));
      toast.error('Failed to update rule');
    }
  }, [editingRule, fetchRules]);

  const handleEditingRuleChange = useCallback((field: string, subField: string | null, value: string | number | boolean) => {
    setEditingRule(prev => {
      if (!prev) return prev;

      if (subField) {
        return {
          ...prev,
          [field]: {
            ...(prev[field as keyof Rule] as Record<string, unknown>),
            [subField]: value
          }
        };
      }

      return {
        ...prev,
        [field]: value
      };
    });
  }, []);

  const handleAddNewRule = useCallback(async () => {
    try {
      // Calculate the next display order (max + 1 or 0 if no rules exist)
      const nextDisplayOrder = rules.length > 0
        ? Math.max(...rules.map(rule => rule.display_order)) + 1
        : 0;

      const { error } = await supabase
        .from('appointment_rules')
        .insert({
          title: newRule.title,
          content: newRule.content,
          display_order: nextDisplayOrder,
          is_active: newRule.is_active
        });

      if (error) throw error;
      
      toast.success('Rule added successfully');
      setShowAddNew(false);
      setNewRule({
        title: { en: '', gu: '' },
        content: { en: '', gu: '' },
        is_active: true
      });
      fetchRules();
    } catch (error: unknown) {
      console.error('Error adding rule:', error instanceof Error ? error.message : String(error));
      toast.error('Failed to add rule');
    }
  }, [newRule, rules, fetchRules]);

  const handleNewRuleChange = useCallback((field: string, subField: string | null, value: string | number | boolean) => {
    setNewRule(prev => {
      if (subField) {
        return {
          ...prev,
          [field]: {
            ...(prev[field as keyof typeof prev] as Record<string, unknown>),
            [subField]: value
          }
        };
      }

      return {
        ...prev,
        [field]: value
      };
    });
  }, []);

  const handleMove = useCallback(async (id: string, direction: 'up' | 'down') => {
    const currentIndex = rules.findIndex(rule => rule.id === id);
    if (
      (direction === 'up' && currentIndex === 0) ||
      (direction === 'down' && currentIndex === rules.length - 1)
    ) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    const newRules = [...rules];
    
    // Swap positions
    const currentRule = newRules[currentIndex];
    const targetRule = newRules[newIndex];
    
    // Store original display orders
    const currentOrder = currentRule.display_order;
    const targetOrder = targetRule.display_order;
    
    // Update display orders in the array
    newRules[currentIndex] = {...targetRule, display_order: currentOrder};
    newRules[newIndex] = {...currentRule, display_order: targetOrder};

    try {
      // Create update objects with required fields
      const updates = [
        {
          id: targetRule.id,
          display_order: currentOrder,
          title: targetRule.title,
          content: targetRule.content,
          is_active: targetRule.is_active
        },
        {
          id: currentRule.id,
          display_order: targetOrder,
          title: currentRule.title,
          content: currentRule.content,
          is_active: currentRule.is_active
        }
      ];

      const { error } = await supabase
        .from('appointment_rules')
        .upsert(updates);

      if (error) throw error;
      
      setRules(newRules);
      toast.success('Rule order updated successfully');
    } catch (error: unknown) {
      console.error('Error reordering rules:', error instanceof Error ? error.message : String(error));
      toast.error('Failed to reorder rules');
      // Refresh the rules to ensure display is in sync with database
      fetchRules();
    }
  }, [rules, fetchRules]);

  const handleDelete = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from('appointment_rules')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Rule deleted successfully');
      setDeleteConfirmId(null);
      fetchRules();
    } catch (error: unknown) {
      console.error('Error deleting rule:', error instanceof Error ? error.message : String(error));
      toast.error('Failed to delete rule');
    }
  }, [fetchRules]);

  if (loading) {
    return (
      <motion.div 
        className="min-h-[400px] flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="flex flex-col items-center gap-3">
          <motion.div 
            className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2B5C4B]"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p className="text-sm text-gray-500">Loading rules...</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 shadow-sm overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="px-4 sm:px-6 py-4 border-b border-gray-200 bg-white">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0">
          <div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
              Appointment Rules
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Manage rules and instructions for appointments
            </p>
          </div>
          <motion.button
            onClick={() => setShowAddNew(prev => !prev)}
            className="w-full sm:w-auto px-4 py-2.5 sm:py-2 text-sm font-medium text-white bg-[#2B5C4B] rounded-lg hover:bg-[#2B5C4B]/90 transform active:scale-95 transition-all duration-200 flex items-center justify-center sm:justify-start gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="text-lg">+</span> Add Rule
          </motion.button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {showAddNew && (
          <motion.div 
            className="px-4 sm:px-6 py-5 sm:py-6 bg-[#2B5C4B]/10 border-b border-[#2B5C4B]/20"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="space-y-4 sm:space-y-6">
              <div className="flex justify-between items-start">
                <h4 className="text-base sm:text-lg font-medium text-gray-900">Create New Rule</h4>
                <motion.button
                  onClick={() => setShowAddNew(false)}
                  className="p-1.5 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-200 transition-all duration-200"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </motion.button>
              </div>
            
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <FormInput
                  label="Title (English)"
                  value={newRule.title.en}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                    handleNewRuleChange('title', 'en', e.target.value)
                  }
                />
                <FormInput
                  label="Title (Gujarati)"
                  value={newRule.title.gu}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                    handleNewRuleChange('title', 'gu', e.target.value)
                  }
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <FormTextarea
                  label="Content (English)"
                  value={newRule.content.en}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => 
                    handleNewRuleChange('content', 'en', e.target.value)
                  }
                  rows={4}
                  placeholder="Use markdown format with '-' for bullet points"
                />
                <FormTextarea
                  label="Content (Gujarati)"
                  value={newRule.content.gu}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => 
                    handleNewRuleChange('content', 'gu', e.target.value)
                  }
                  rows={4}
                  placeholder="Use markdown format with '-' for bullet points"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="new-rule-active"
                  checked={newRule.is_active}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                    handleNewRuleChange('is_active', null, e.target.checked)
                  }
                  className="h-5 w-5 text-[#2B5C4B] focus:ring-[#2B5C4B] border-gray-300 rounded transition-all duration-200"
                />
                <label htmlFor="new-rule-active" className="ml-2 text-sm text-gray-700">
                  Active
                </label>
              </div>

              <div className="flex justify-end">
                <motion.button
                  onClick={handleAddNewRule}
                  className="w-full sm:w-auto px-4 py-2.5 text-sm font-medium text-white bg-[#2B5C4B] rounded-lg hover:bg-[#2B5C4B]/90 active:bg-[#2B5C4B]/80 transform active:scale-95 transition-all duration-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Create Rule
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        <motion.div className="divide-y divide-gray-100">
          {rules.length === 0 && (
            <motion.div 
              className="px-4 sm:px-6 py-12 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="flex flex-col items-center gap-3">
                <AlertCircle size={24} className="text-gray-400" />
                <div>
                  <p className="text-gray-600 font-medium">No rules found</p>
                  <p className="text-sm text-gray-500 mt-1">Contact administrator to add new rules</p>
                </div>
              </div>
            </motion.div>
          )}

          {rules.map(rule => (
            <motion.div 
              key={rule.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={clsx(
                "px-4 sm:px-6 py-4 sm:py-6 transition-all duration-300 ease-in-out transform",
                editingId === rule.id ? "bg-[#2B5C4B]/10" : "hover:bg-gray-50"
              )}
            >
              {editingId === rule.id ? (
                <div className="space-y-4 sm:space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <FormInput
                      label="Title (English)"
                      value={editingRule?.title?.en || ''}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                        handleEditingRuleChange('title', 'en', e.target.value)
                      }
                    />
                    <FormInput
                      label="Title (Gujarati)"
                      value={editingRule?.title?.gu || ''}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                        handleEditingRuleChange('title', 'gu', e.target.value)
                      }
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <FormTextarea
                      label="Content (English)"
                      value={editingRule?.content?.en || ''}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => 
                        handleEditingRuleChange('content', 'en', e.target.value)
                      }
                      rows={8}
                      placeholder="Use markdown format with '-' for bullet points"
                    />
                    <FormTextarea
                      label="Content (Gujarati)"
                      value={editingRule?.content?.gu || ''}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => 
                        handleEditingRuleChange('content', 'gu', e.target.value)
                      }
                      rows={8}
                      placeholder="Use markdown format with '-' for bullet points"
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id={`active-${rule.id}`}
                      checked={editingRule?.is_active || false}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                        handleEditingRuleChange('is_active', null, e.target.checked)
                      }
                      className="h-5 w-5 text-[#2B5C4B] focus:ring-[#2B5C4B] border-gray-300 rounded transition-all duration-200"
                    />
                    <label htmlFor={`active-${rule.id}`} className="ml-2 text-sm text-gray-700">
                      Active
                    </label>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 justify-end pt-2">
                    <motion.button
                      onClick={handleCancelEdit}
                      className="w-full sm:w-auto px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 active:bg-gray-100 transform active:scale-95 transition-all duration-200"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      onClick={handleSaveEdit}
                      className="w-full sm:w-auto px-4 py-2.5 text-sm font-medium text-white bg-[#2B5C4B] rounded-lg hover:bg-[#2B5C4B]/90 active:bg-[#2B5C4B]/80 transform active:scale-95 transition-all duration-200"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Save Changes
                    </motion.button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-0 mb-4">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <h4 className="text-base sm:text-lg font-medium text-gray-900">
                          {rule.title?.en || 'Important Notes'}
                        </h4>
                        <div className="flex items-center gap-2">
                          <span className={clsx(
                            "text-xs px-2 py-1 rounded-full font-medium transition-all duration-200",
                            rule.is_active 
                              ? "bg-green-100 text-green-700" 
                              : "bg-gray-100 text-gray-600"
                          )}>
                            {rule.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        {rule.title?.gu || 'મહત્વપૂર્ણ નોંધ'}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 self-end sm:self-start sm:ml-4">
                      <motion.button
                        onClick={() => handleMove(rule.id, 'up')}
                        disabled={rules.indexOf(rule) === 0}
                        className={clsx(
                          "p-2.5 rounded-lg transform active:scale-90 transition-all duration-200",
                          rules.indexOf(rule) === 0 
                            ? "text-gray-300 cursor-not-allowed" 
                            : "text-gray-500 hover:text-[#2B5C4B] hover:bg-[#2B5C4B]/10"
                        )}
                        whileHover={rules.indexOf(rule) !== 0 ? { scale: 1.1 } : undefined}
                        whileTap={rules.indexOf(rule) !== 0 ? { scale: 0.9 } : undefined}
                        title="Move Up"
                      >
                        <MoveUp size={20} />
                      </motion.button>
                      <motion.button
                        onClick={() => handleMove(rule.id, 'down')}
                        disabled={rules.indexOf(rule) === rules.length - 1}
                        className={clsx(
                          "p-2.5 rounded-lg transform active:scale-90 transition-all duration-200",
                          rules.indexOf(rule) === rules.length - 1 
                            ? "text-gray-300 cursor-not-allowed" 
                            : "text-gray-500 hover:text-[#2B5C4B] hover:bg-[#2B5C4B]/10"
                        )}
                        whileHover={rules.indexOf(rule) !== rules.length - 1 ? { scale: 1.1 } : undefined}
                        whileTap={rules.indexOf(rule) !== rules.length - 1 ? { scale: 0.9 } : undefined}
                        title="Move Down"
                      >
                        <MoveDown size={20} />
                      </motion.button>
                      <motion.button
                        onClick={() => handleEdit(rule)}
                        className="p-2.5 text-gray-500 hover:text-[#2B5C4B] rounded-lg hover:bg-[#2B5C4B]/10 transform active:scale-90 transition-all duration-200"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        title="Edit"
                      >
                        <Edit2 size={20} />
                      </motion.button>
                      <motion.button
                        onClick={() => setDeleteConfirmId(rule.id)}
                        className="p-2.5 text-gray-500 hover:text-red-500 rounded-lg hover:bg-red-50 transform active:scale-90 transition-all duration-200"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        title="Delete"
                      >
                        <Trash2 size={20} />
                      </motion.button>
                    </div>
                  </div>

                  {deleteConfirmId === rule.id && (
                    <div className="mt-4 mb-4 p-3 sm:p-4 bg-red-50 border border-red-100 rounded-lg">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center gap-2 text-red-700">
                          <AlertCircle size={18} />
                          <span className="font-medium text-sm sm:text-base">Are you sure you want to delete this rule?</span>
                        </div>
                        <div className="flex flex-row sm:flex-row gap-2 w-full sm:w-auto">
                          <motion.button
                            onClick={() => setDeleteConfirmId(null)}
                            className="flex-1 sm:flex-initial px-3 py-2 text-sm text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            Cancel
                          </motion.button>
                          <motion.button
                            onClick={() => handleDelete(rule.id)}
                            className="flex-1 sm:flex-initial px-3 py-2 text-sm text-white bg-red-600 rounded-lg hover:bg-red-700"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            Delete
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-2">
                      <h5 className="text-sm font-medium text-gray-700">English Content</h5>
                      <div className="text-sm text-gray-600 whitespace-pre-line bg-gray-50 p-3 sm:p-4 rounded-lg border border-gray-100 transition-all duration-200 hover:border-gray-200">
                        {rule.content?.en || 'No content'}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h5 className="text-sm font-medium text-gray-700">Gujarati Content</h5>
                      <div className="text-sm text-gray-600 whitespace-pre-line bg-gray-50 p-3 sm:p-4 rounded-lg border border-gray-100 transition-all duration-200 hover:border-gray-200">
                        {rule.content?.gu || 'No content'}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}