import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-hot-toast';
import { MessageCircle, Edit2, Trash2, Plus, X } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { checkSuperAdminAccess } from '../../lib/auth';
import { useNavigate } from 'react-router-dom';

interface DoctorMessage {
  id: string;
  message_en: string;
  message_gu: string;
  active: boolean;
  created_at: string;
}

export function MessageManager() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<DoctorMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingMessage, setEditingMessage] = useState<DoctorMessage | null>(null);
  const [activeTab, setActiveTab] = useState<'en' | 'gu'>('en');
  const [form, setForm] = useState({
    message_en: '',
    message_gu: '',
    active: true
  });
  const { language } = useLanguage();

  useEffect(() => {
    // Check if user has superadmin access
    const { isAuthorized, error } = checkSuperAdminAccess();
    if (!isAuthorized) {
      toast.error(error || 'Unauthorized access');
      navigate('/admin/appointments');
      return;
    }
    
    loadMessages();
  }, [navigate]);

  const loadMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('doctor_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error loading messages:', error);
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) throw new Error('User not found');
      
      // Validate that at least English message is provided
      if (!form.message_en.trim()) {
        throw new Error('English message is required');
      }
      
      const user = JSON.parse(userStr);
      
      // Prepare data for submission
      const messageData = {
        message_en: form.message_en,
        message_gu: form.message_gu,
        active: form.active,
        created_by: user.id
      };

      if (editingMessage) {
        const { error } = await supabase
          .from('doctor_messages')
          .update(messageData)
          .eq('id', editingMessage.id);

        if (error) throw error;
        toast.success('Message updated successfully');
      } else {
        const { error } = await supabase
          .from('doctor_messages')
          .insert(messageData);

        if (error) throw error;
        toast.success('Message created successfully');
      }

      setForm({ message_en: '', message_gu: '', active: true });
      setShowForm(false);
      setEditingMessage(null);
      loadMessages();
    } catch (error) {
      console.error('Error saving message:', error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Failed to save message');
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;

    try {
      const { error } = await supabase
        .from('doctor_messages')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Message deleted successfully');
      loadMessages();
    } catch (error) {
      console.error('Error deleting message:', error);
      toast.error('Failed to delete message');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2B5C4B]"></div>
      </div>
    );
  }

  const getMessageDisplay = (message: DoctorMessage) => {
    // Get message in current language or fall back to English
    const messageText = language === 'gu' && message.message_gu 
      ? message.message_gu 
      : message.message_en;
    
    // Show indicator if message has content in both languages
    const hasBothLanguages = message.message_en && message.message_gu;
    
    return (
      <div>
        <p className="text-gray-900 break-words">{messageText}</p>
        {hasBothLanguages && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-2 bg-[#2B5C4B]/10 text-[#2B5C4B] mr-2">
            Bilingual
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6 px-2 sm:px-0 mt-4 sm:mt-0 pt-12 sm:pt-0">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">Flash Message</h2>
        <button
          onClick={() => setShowForm(true)}
          className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 bg-[#2B5C4B] text-white rounded-lg hover:bg-[#234539] transition-colors gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Message
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
            setEditingMessage(null);
            setForm({ message_en: '', message_gu: '', active: true });
            setActiveTab('en');
          }}
        >
          <div className="w-full h-full flex items-center justify-center p-2 sm:p-4 pt-14 sm:pt-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-auto relative flex flex-col max-h-[90vh] overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <div className="sticky top-0 z-10 bg-gradient-to-r from-[#2B5C4B] to-[#234539] rounded-t-xl">
                <div className="px-3 py-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg sm:text-xl font-semibold text-white">
                      {editingMessage ? 'Edit Message' : 'Add New Message'}
                    </h3>
                    <button
                      onClick={() => {
                        setShowForm(false);
                        setEditingMessage(null);
                        setForm({ message_en: '', message_gu: '', active: true });
                        setActiveTab('en');
                      }}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <X className="h-5 w-5 text-white" />
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="p-3 sm:p-6 overflow-y-auto">
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Language Tabs */}
                  <div className="border-b border-gray-200">
                    <nav className="-mb-px flex">
                      <button
                        type="button"
                        onClick={() => setActiveTab('en')}
                        className={`w-1/2 py-2 px-1 text-center border-b-2 text-sm font-medium ${
                          activeTab === 'en'
                            ? 'border-[#2B5C4B] text-[#2B5C4B]'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        English
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab('gu')}
                        className={`w-1/2 py-2 px-1 text-center border-b-2 text-sm font-medium ${
                          activeTab === 'gu'
                            ? 'border-[#2B5C4B] text-[#2B5C4B]'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        ગુજરાતી
                      </button>
                    </nav>
                  </div>

                  {/* English Message */}
                  {activeTab === 'en' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Message (English)
                      </label>
                      <textarea
                        value={form.message_en}
                        onChange={(e) => setForm({ ...form, message_en: e.target.value })}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B5C4B]/20 focus:border-[#2B5C4B]"
                        required
                      />
                    </div>
                  )}

                  {/* Gujarati Message */}
                  {activeTab === 'gu' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Message (ગુજરાતી)
                      </label>
                      <textarea
                        value={form.message_gu}
                        onChange={(e) => setForm({ ...form, message_gu: e.target.value })}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B5C4B]/20 focus:border-[#2B5C4B]"
                        dir="auto"
                      />
                    </div>
                  )}

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="active"
                      checked={form.active}
                      onChange={(e) => setForm({ ...form, active: e.target.checked })}
                      className="h-4 w-4 text-[#2B5C4B] focus:ring-[#2B5C4B] border-gray-300 rounded"
                    />
                    <label htmlFor="active" className="ml-2 text-sm text-gray-700">
                      Active
                    </label>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowForm(false);
                        setEditingMessage(null);
                        setForm({ message_en: '', message_gu: '', active: true });
                        setActiveTab('en');
                      }}
                      className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-300 rounded-lg w-full sm:w-auto"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm font-medium text-white bg-[#2B5C4B] rounded-lg hover:bg-[#234539] w-full sm:w-auto"
                    >
                      {editingMessage ? 'Update' : 'Create'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      )}

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <ul className="divide-y divide-gray-200">
          {messages.length === 0 ? (
            <li className="p-8 text-center text-gray-500">
              No messages found. Click "Add Message" to create one.
            </li>
          ) : (
            messages.map((message) => (
              <li key={message.id} className="px-3 py-3 sm:p-4 hover:bg-gray-50">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                  <div className="flex items-start gap-3 sm:gap-4 flex-1">
                    <div className="bg-[#2B5C4B]/10 p-2 rounded-lg flex-shrink-0">
                      <MessageCircle className="h-5 w-5 text-[#2B5C4B]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      {getMessageDisplay(message)}
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-2 ${
                        message.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {message.active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 self-end sm:self-center mt-2 sm:mt-0">
                    <button
                      onClick={() => {
                        setEditingMessage(message);
                        setForm({
                          message_en: message.message_en,
                          message_gu: message.message_gu || '',
                          active: message.active
                        });
                        setActiveTab('en');
                        setShowForm(true);
                      }}
                      className="p-1.5 rounded-lg hover:bg-gray-100"
                    >
                      <Edit2 className="h-4 w-4 text-gray-500" />
                    </button>
                    <button
                      onClick={() => handleDelete(message.id)}
                      className="p-1.5 rounded-lg hover:bg-gray-100"
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </button>
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}