import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, User, Mail, UserCog, Activity, Trash2 } from 'lucide-react';
import { User as UserType } from '../../../types';

interface DeleteUserModalProps {
  user: UserType;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
}

export function DeleteUserModal({ user, onClose, onConfirm, loading }: DeleteUserModalProps) {
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
            <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-700 opacity-90"></div>
            <div className="relative px-4 py-6 sm:px-6 sm:py-8">
              <div className="flex items-center gap-4">
                <div className="bg-white/10 rounded-xl p-3">
                  <Trash2 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold text-white">Delete User</h2>
                  <p className="text-red-100 text-sm mt-1">This action cannot be undone</p>
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
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              <div className="flex items-center gap-4 p-3 sm:p-4 bg-red-50 rounded-lg border border-red-100">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-5 sm:h-6 w-5 sm:w-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-red-800">
                    Are you sure you want to delete this user?
                  </h3>
                  <p className="mt-1 text-sm text-red-700">
                    This action cannot be undone. All data associated with this user will be permanently removed.
                  </p>
                </div>
              </div>

              <div className="space-y-3 sm:space-y-4 bg-gray-50 rounded-lg p-3 sm:p-4">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Name</p>
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-sm font-medium text-gray-900">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <UserCog className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Role</p>
                    <p className="text-sm font-medium text-gray-900">{user.role}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Activity className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Status</p>
                    <p className="text-sm font-medium text-gray-900">{user.status}</p>
                  </div>
                </div>
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
                  onClick={onConfirm}
                  disabled={loading}
                  className={`px-4 py-2.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-colors w-full sm:w-auto ${
                    loading ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {loading ? 'Deleting...' : 'Delete User'}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}