import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Mail, UserCog, Edit, Lock } from 'lucide-react';
import { updateUser } from '../../../lib/auth';
import { toast } from 'react-hot-toast';
import { User as UserType } from '../../../types';

interface EditUserModalProps {
  user: UserType;
  onClose: () => void;
  onUserUpdated: () => void;
}

export function EditUserModal({ user, onClose, onUserUpdated }: EditUserModalProps) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: user.name,
    email: user.email,
    role: user.role as 'receptionist' | 'superadmin',
    password: '' // New password field
  });

  // Get current user from localStorage to check if they're a superadmin
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}') as UserType;
  const isSuperAdmin = currentUser.role === 'superadmin';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await updateUser(user.id, form);

      if (error) throw new Error(error);

      toast.success('User updated successfully');
      onUserUpdated();
      onClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 pt-14 sm:pt-4 z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: "spring", duration: 0.3 }}
          className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-auto overflow-hidden max-h-[90vh]"
          onClick={e => e.stopPropagation()}
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[#2B5C4B] to-[#234539] opacity-90"></div>
            <div className="relative px-4 py-6 sm:px-6 sm:py-8">
              <div className="flex items-center gap-4">
                <div className="bg-white/10 rounded-xl p-3">
                  <Edit className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold text-white">Edit User</h2>
                  <p className="text-green-100 text-sm mt-1">Update user information</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-white/80 hover:text-white hover:bg-white/10 p-2 rounded-full transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
            <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      required
                      className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2B5C4B]/20 focus:border-[#2B5C4B]"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      required
                      className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2B5C4B]/20 focus:border-[#2B5C4B]"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <UserCog className="h-5 w-5 text-gray-400" />
                    </div>
                    <select
                      className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2B5C4B]/20 focus:border-[#2B5C4B] appearance-none bg-white"
                      value={form.role}
                      onChange={(e) => setForm({ ...form, role: e.target.value as 'receptionist' | 'superadmin' })}
                    >
                      <option value="receptionist">Receptionist</option>
                      <option value="superadmin">Super Admin</option>
                    </select>
                  </div>
                </div>

                {/* Password field - only shown for superadmins */}
                {isSuperAdmin && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      New Password (leave empty to keep current)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="password"
                        className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2B5C4B]/20 focus:border-[#2B5C4B]"
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        placeholder="Enter new password"
                        minLength={6}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20 transition-colors w-full sm:w-auto"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-4 py-2.5 text-sm font-medium text-white bg-[#2B5C4B] rounded-lg hover:bg-[#234539] focus:outline-none focus:ring-2 focus:ring-[#2B5C4B]/20 transition-colors w-full sm:w-auto ${
                    loading ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}