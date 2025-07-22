import React from 'react';
import { useState, useEffect, useCallback, memo } from 'react';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-hot-toast';
import { Edit2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

interface ImageDownloadRule {
  id: string;
  type: 'patient' | 'mr';
  title: Record<string, string>;
  content: Record<string, string>;
  order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface ImageDownloadRulesProps {
  type: 'patient' | 'mr';
}

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
      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2B5C4B]/30 focus:border-transparent transition-all duration-200"
      {...props}
    />
  </motion.div>
));

FormInput.displayName = 'FormInput';

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
        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2B5C4B]/30 focus:border-transparent transition-all duration-200 resize-none overflow-hidden"
        {...props}
      />
    </motion.div>
  );
});

FormTextarea.displayName = 'FormTextarea';

export default function ImageDownloadRules({ type }: ImageDownloadRulesProps) {
  const [rules, setRules] = useState<ImageDownloadRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingRule, setEditingRule] = useState<ImageDownloadRule | null>(null);

  const fetchRules = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('image_download_rules')
        .select('*')
        .eq('type', type)
        .order('order', { ascending: true });

      if (error) throw error;
      
      setRules(data || []);
    } catch (error: unknown) {
      console.error('Error fetching rules:', error instanceof Error ? error.message : String(error));
      toast.error('Failed to load rules');
    } finally {
      setLoading(false);
    }
  }, [type]);

  useEffect(() => {
    fetchRules();
  }, [fetchRules]);

  const handleEdit = useCallback((rule: ImageDownloadRule) => {
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
        .from('image_download_rules')
        .update({
          title: editingRule.title,
          content: editingRule.content,
          is_active: editingRule.is_active,
          order: editingRule.order // Keep order in the update but don't show UI for it
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
            ...prev[field as keyof ImageDownloadRule] as Record<string, unknown>,
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
      <div className="px-6 py-4 border-b border-gray-200 bg-white">
        <div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
            Image Download Rules
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            {type === 'patient' ? 'Regular Appointments' : 'MR Appointments'}
          </p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div className="divide-y divide-gray-100">
          {rules.length === 0 && (
            <motion.div 
              className="px-6 py-12 text-center"
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
                "px-6 py-6 transition-all duration-300 ease-in-out transform",
                editingId === rule.id ? "bg-[#2B5C4B]/10" : "hover:bg-gray-50"
              )}
            >
              {editingId === rule.id ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormTextarea
                      label="Content (English)"
                      value={editingRule?.content?.en || ''}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => 
                        handleEditingRuleChange('content', 'en', e.target.value)
                      }
                      rows={4}
                      placeholder="Use markdown format with '-' for bullet points"
                    />
                    <FormTextarea
                      label="Content (Gujarati)"
                      value={editingRule?.content?.gu || ''}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => 
                        handleEditingRuleChange('content', 'gu', e.target.value)
                      }
                      rows={4}
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
                      className="h-4 w-4 text-[#2B5C4B] focus:ring-[#2B5C4B] border-gray-300 rounded transition-all duration-200"
                    />
                    <label htmlFor={`active-${rule.id}`} className="ml-2 text-sm text-gray-700">
                      Active
                    </label>
                  </div>

                  <div className="flex gap-3 justify-end pt-2">
                    <motion.button
                      onClick={handleCancelEdit}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 active:bg-gray-100 transform active:scale-95 transition-all duration-200"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      onClick={handleSaveEdit}
                      className="px-4 py-2 text-sm font-medium text-white bg-[#2B5C4B] rounded-lg hover:bg-[#2B5C4B]/90 active:bg-[#2B5C4B]/80 transform active:scale-95 transition-all duration-200"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Save Changes
                    </motion.button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h4 className="text-lg font-medium text-gray-900">
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
                    <div className="flex items-center ml-4">
                      <motion.button
                        onClick={() => handleEdit(rule)}
                        className="p-2 text-gray-500 hover:text-[#2B5C4B] rounded-lg hover:bg-[#2B5C4B]/10 transform active:scale-90 transition-all duration-200"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        title="Edit"
                      >
                        <Edit2 size={18} />
                      </motion.button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <h5 className="text-sm font-medium text-gray-700">English Content</h5>
                      <div className="text-sm text-gray-600 whitespace-pre-line bg-gray-50 p-4 rounded-lg border border-gray-100 transition-all duration-200 hover:border-gray-200">
                        {rule.content?.en || 'No content'}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h5 className="text-sm font-medium text-gray-700">Gujarati Content</h5>
                      <div className="text-sm text-gray-600 whitespace-pre-line bg-gray-50 p-4 rounded-lg border border-gray-100 transition-all duration-200 hover:border-gray-200">
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