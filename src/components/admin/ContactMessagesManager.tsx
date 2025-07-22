import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-hot-toast';
import { Mail, Trash2, Phone, Calendar, Eye, X, ExternalLink } from 'lucide-react';
import { checkSuperAdminAccess } from '../../lib/auth';
import { useNavigate } from 'react-router-dom';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  created_at: string;
  is_read: boolean;
}

export function ContactMessagesManager() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewingMessage, setViewingMessage] = useState<ContactMessage | null>(null);
  const [filter, setFilter] = useState<'all' | 'read' | 'unread'>('all');

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
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error loading contact messages:', error);
      toast.error('Failed to load contact messages');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;

    try {
      const { error } = await supabase
        .from('contact_messages')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Message deleted successfully');
      
      // Close modal if the deleted message is being viewed
      if (viewingMessage?.id === id) {
        setViewingMessage(null);
      }
      
      loadMessages();
    } catch (error) {
      console.error('Error deleting message:', error);
      toast.error('Failed to delete message');
    }
  };

  const markAsRead = async (id: string, isRead: boolean) => {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .update({ is_read: isRead })
        .eq('id', id);

      if (error) throw error;
      
      // Update local state to avoid refetching
      setMessages(prev => 
        prev.map(msg => 
          msg.id === id ? { ...msg, is_read: isRead } : msg
        )
      );
      
      // Update viewing message if it's the one being marked
      if (viewingMessage?.id === id) {
        setViewingMessage({ ...viewingMessage, is_read: isRead });
      }
      
      toast.success(`Message marked as ${isRead ? 'read' : 'unread'}`);
    } catch (error) {
      console.error('Error updating message:', error);
      toast.error('Failed to update message status');
    }
  };

  const filteredMessages = messages.filter(message => {
    if (filter === 'all') return true;
    if (filter === 'read') return message.is_read;
    if (filter === 'unread') return !message.is_read;
    return true;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2B5C4B]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 px-2 sm:px-0 mt-4 sm:mt-0 pt-12 sm:pt-0">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">Contact Form Messages</h2>
        
        <div className="flex gap-2 w-full sm:w-auto justify-between sm:justify-end">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md flex-1 sm:flex-initial ${
              filter === 'all' 
                ? 'bg-[#2B5C4B]/10 text-[#2B5C4B]' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md flex-1 sm:flex-initial ${
              filter === 'unread' 
                ? 'bg-[#2B5C4B]/10 text-[#2B5C4B]' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Unread
          </button>
          <button
            onClick={() => setFilter('read')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md flex-1 sm:flex-initial ${
              filter === 'read' 
                ? 'bg-[#2B5C4B]/10 text-[#2B5C4B]' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Read
          </button>
        </div>
      </div>

      {filteredMessages.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <Mail className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No messages found</h3>
          <p className="text-gray-500">
            {filter === 'all' 
              ? 'There are no contact form submissions yet.' 
              : filter === 'unread' 
                ? 'There are no unread messages.' 
                : 'There are no read messages.'}
          </p>
        </div>
      ) : (
        <>
          {/* Desktop view - table */}
          <div className="hidden sm:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredMessages.map((message) => (
                    <tr 
                      key={message.id} 
                      className={`hover:bg-gray-50 ${!message.is_read ? 'bg-[#2B5C4B]/5' : ''}`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="text-sm font-medium text-gray-900">
                            {message.name}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          <div className="flex items-center gap-1.5">
                            <Mail className="h-3.5 w-3.5" />
                            <span>{message.email}</span>
                          </div>
                          <div className="flex items-center gap-1.5 mt-1">
                            <Phone className="h-3.5 w-3.5" />
                            <span>{message.phone}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500 flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5" />
                          {formatDate(message.created_at)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          message.is_read 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {message.is_read ? 'Read' : 'Unread'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setViewingMessage(message)}
                            className="p-1.5 text-[#2B5C4B] hover:bg-[#2B5C4B]/10 rounded-lg transition-colors"
                            title="View message"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(message.id)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete message"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile view - cards */}
          <div className="sm:hidden space-y-3">
            {filteredMessages.map((message) => (
              <div 
                key={message.id} 
                className={`bg-white rounded-xl p-3 shadow-sm border border-gray-200 ${!message.is_read ? 'bg-[#2B5C4B]/5' : ''}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="text-sm font-medium text-gray-900 truncate max-w-[75%]">
                    {message.name}
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    message.is_read 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {message.is_read ? 'Read' : 'Unread'}
                  </span>
                </div>

                <div className="space-y-1.5 mb-3">
                  <div className="text-xs text-gray-500 flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5 flex-shrink-0" />
                    <span className="truncate">{message.email}</span>
                  </div>
                  <div className="text-xs text-gray-500 flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5 flex-shrink-0" />
                    <span>{message.phone}</span>
                  </div>
                  <div className="text-xs text-gray-500 flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 flex-shrink-0" />
                    <span>{formatDate(message.created_at)}</span>
                  </div>
                </div>

                <div className="flex justify-end gap-2 mt-1">
                  <button
                    onClick={() => setViewingMessage(message)}
                    className="p-2 text-[#2B5C4B] hover:bg-[#2B5C4B]/10 rounded-lg transition-colors"
                    title="View message"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(message.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete message"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Message Viewer Modal */}
      {viewingMessage && (
        <div
          className="fixed inset-0 z-[9999]"
          style={{ 
            margin: 0, 
            padding: 0, 
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(4px)'
          }}
          onClick={() => setViewingMessage(null)}
        >
          <div className="w-full h-full flex items-center justify-center p-2 sm:p-4 pt-14 sm:pt-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-auto overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <div className="bg-gradient-to-r from-[#2B5C4B] to-[#234539] px-3 py-4 sm:p-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg sm:text-xl font-semibold text-white">Message Details</h3>
                  <button
                    onClick={() => setViewingMessage(null)}
                    className="p-1.5 text-white hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
              
              <div className="p-3 sm:p-6">
                <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 mb-4 sm:mb-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Sender Name</h4>
                    <p className="text-gray-900">{viewingMessage.name}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Date Received</h4>
                    <p className="text-gray-900">{formatDate(viewingMessage.created_at)}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Email</h4>
                    <a 
                      href={`mailto:${viewingMessage.email}`}
                      className="text-[#2B5C4B] hover:text-[#234539] hover:underline flex items-center gap-1.5 break-all"
                    >
                      {viewingMessage.email}
                      <ExternalLink className="h-3.5 w-3.5 flex-shrink-0" />
                    </a>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Phone</h4>
                    <a 
                      href={`tel:${viewingMessage.phone}`}
                      className="text-[#2B5C4B] hover:text-[#234539] hover:underline flex items-center gap-1.5"
                    >
                      {viewingMessage.phone}
                      <ExternalLink className="h-3.5 w-3.5 flex-shrink-0" />
                    </a>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Message</h4>
                  <div className="bg-gray-50 p-3 sm:p-4 rounded-lg border border-gray-100">
                    <p className="text-gray-800 whitespace-pre-wrap">{viewingMessage.message}</p>
                  </div>
                </div>
                
                <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row justify-between gap-3">
                  <button
                    onClick={() => markAsRead(viewingMessage.id, !viewingMessage.is_read)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium w-full sm:w-auto ${
                      viewingMessage.is_read
                        ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                        : 'bg-green-100 text-green-800 hover:bg-green-200'
                    }`}
                  >
                    Mark as {viewingMessage.is_read ? 'Unread' : 'Read'}
                  </button>
                  
                  <button
                    onClick={() => handleDelete(viewingMessage.id)}
                    className="px-4 py-2 bg-red-100 text-red-800 rounded-lg text-sm font-medium hover:bg-red-200 w-full sm:w-auto"
                  >
                    Delete Message
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
} 