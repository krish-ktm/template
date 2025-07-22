import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { supabase } from '../../../lib/supabase';
import { motion } from 'framer-motion';

interface Rule {
  id: string;
  title: {
    en: string;
    gu: string;
  };
  content: {
    en: string;
    gu: string;
  };
  display_order: number;
  updated_at: string;
}

interface RuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  rule?: Rule;
  mode: 'add' | 'edit';
}

export default function AppointmentRuleModal({ isOpen, onClose, onSuccess, rule, mode }: RuleModalProps) {
  const [formData, setFormData] = useState({
    title: { en: '', gu: '' },
    content: { en: '', gu: '' },
    display_order: 0
  });

  useEffect(() => {
    if (mode === 'add') {
      setFormData({
        title: { en: '', gu: '' },
        content: { en: '', gu: '' },
        display_order: 0
      });
    } else if (rule) {
      setFormData({
        title: rule.title,
        content: rule.content,
        display_order: rule.display_order
      });
    }
  }, [rule, mode, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (mode === 'add') {
        const { error } = await supabase
          .from('appointment_rules')
          .insert([{
            ...formData,
            updated_at: new Date().toISOString()
          }]);

        if (error) throw error;
        toast.success('Rule added successfully');
      } else {
        const { error } = await supabase
          .from('appointment_rules')
          .update({
            ...formData,
            updated_at: new Date().toISOString()
          })
          .eq('id', rule?.id);

        if (error) throw error;
        toast.success('Rule updated successfully');
      }
      
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving rule:', error);
      toast.error(mode === 'add' ? 'Failed to add rule' : 'Failed to update rule');
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[9999]"
      style={{ 
        margin: 0, 
        padding: 0, 
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(4px)'
      }}
      onClick={onClose}
    >
      <div className="w-full h-full flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-auto relative flex flex-col max-h-[90vh]"
          onClick={e => e.stopPropagation()}
        >
          <div className="sticky top-0 z-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-t-xl">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-white">
                  {mode === 'add' ? 'Add New Rule' : 'Edit Rule'}
                </h3>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-white" />
                </button>
              </div>
            </div>
          </div>
          
          <div className="p-6 overflow-y-auto">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title (English)
                </label>
                <input
                  type="text"
                  value={formData.title.en}
                  onChange={(e) => setFormData({ ...formData, title: { ...formData.title, en: e.target.value } })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title (Gujarati)
                </label>
                <input
                  type="text"
                  value={formData.title.gu}
                  onChange={(e) => setFormData({ ...formData, title: { ...formData.title, gu: e.target.value } })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Content (English)
                </label>
                <textarea
                  value={formData.content.en}
                  onChange={(e) => setFormData({ ...formData, content: { ...formData.content, en: e.target.value } })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  rows={3}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Content (Gujarati)
                </label>
                <textarea
                  value={formData.content.gu}
                  onChange={(e) => setFormData({ ...formData, content: { ...formData.content, gu: e.target.value } })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  rows={3}
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-300 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  {mode === 'add' ? 'Add Rule' : 'Update Rule'}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}