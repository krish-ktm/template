import { useState } from 'react';
import { User } from '../../types';
import { updateUser, deleteUser } from '../../lib/auth';
import { toast } from 'react-hot-toast';
import { CreateUserModal } from './modals/CreateUserModal';
import { DeleteUserModal } from './modals/DeleteUserModal';
import { EditUserModal } from './modals/EditUserModal';
import { MoreVertical, Edit2, Trash2, Power, UserPlus } from 'lucide-react';
import { format } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';

const TIMEZONE = 'Asia/Kolkata';

interface UsersTableProps {
  users: User[];
  onUserUpdated: () => void;
}

export function UsersTable({ users, onUserUpdated }: UsersTableProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [openActionMenu, setOpenActionMenu] = useState<string | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

  const formatDateTime = (dateStr: string | null) => {
    if (!dateStr) return 'Never';
    const date = utcToZonedTime(new Date(dateStr), TIMEZONE);
    return format(date, 'MMM d, yyyy h:mm a');
  };

  const handleStatusToggle = async (user: User) => {
    try {
      const newStatus = user.status === 'active' ? 'inactive' : 'active';
      const { error } = await updateUser(user.id, { status: newStatus });
      
      if (error) throw new Error(error);
      
      toast.success(`User ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`);
      onUserUpdated();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update user status');
    } finally {
      setOpenActionMenu(null);
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    setLoading(true);
    try {
      const { error } = await deleteUser(userToDelete.id);
      
      if (error) throw new Error(error);
      
      toast.success('User deleted successfully');
      setUserToDelete(null);
      onUserUpdated();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete user');
    } finally {
      setLoading(false);
      setOpenActionMenu(null);
    }
  };

  const toggleActionMenu = (userId: string, event?: React.MouseEvent) => {
    if (event) {
      const buttonRect = event.currentTarget.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const spaceBelow = viewportHeight - buttonRect.bottom;
      
      // For users at the bottom of the table or near the viewport bottom
      if (spaceBelow < 200) {
        setDropdownPosition({
          // Position menu above the button
          top: buttonRect.top - 120,
          left: Math.max(buttonRect.right - 200, 10), // Ensure it doesn't go off-screen
        });
      } else {
        setDropdownPosition({
          // Position menu below the button
          top: buttonRect.bottom + 5,
          left: Math.max(buttonRect.right - 200, 10),
        });
      }
    }
    
    setOpenActionMenu(openActionMenu === userId ? null : userId);
  };

  return (
    <>
      <div className="mb-6">
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center px-4 py-2 bg-[#2B5C4B] text-white rounded-lg hover:bg-[#234539] transition-colors gap-2 shadow-sm"
        >
          <UserPlus className="h-4 w-4" />
          <span>Add New User</span>
        </button>
      </div>

      {/* Desktop view - table */}
      <div className="hidden sm:block overflow-x-auto -mx-4 sm:mx-0">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th scope="col" className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Login
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {user.name}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.email}
                    </td>
                    <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.role === 'superadmin' 
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-[#2B5C4B]/10 text-[#2B5C4B]'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDateTime(user.last_login)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="relative">
                        <button
                          onClick={(e) => toggleActionMenu(user.id, e)}
                          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                          <MoreVertical className="h-5 w-5 text-gray-500" />
                        </button>
                        
                        {openActionMenu === user.id && (
                          <>
                            <div
                              className="fixed inset-0 z-10"
                              onClick={() => setOpenActionMenu(null)}
                            />
                            <div 
                              className="fixed w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50"
                              style={{
                                top: `${dropdownPosition.top}px`,
                                left: `${dropdownPosition.left}px`
                              }}
                            >
                              <div className="py-1" role="menu">
                                <button
                                  onClick={() => {
                                    setUserToEdit(user);
                                    setOpenActionMenu(null);
                                  }}
                                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                >
                                  <Edit2 className="h-4 w-4" />
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleStatusToggle(user)}
                                  className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 ${
                                    user.status === 'active'
                                      ? 'text-red-700 hover:bg-red-50'
                                      : 'text-green-700 hover:bg-green-50'
                                  }`}
                                >
                                  <Power className="h-4 w-4" />
                                  {user.status === 'active' ? 'Deactivate' : 'Activate'}
                                </button>
                                <button
                                  onClick={() => {
                                    setUserToDelete(user);
                                    setOpenActionMenu(null);
                                  }}
                                  className="w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50 flex items-center gap-2"
                                >
                                  <Trash2 className="h-4 w-4" />
                                  Delete
                                </button>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Mobile view - cards */}
      <div className="sm:hidden space-y-4">
        {users.map((user) => (
          <div key={user.id} className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
            <div className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-base font-medium text-gray-900">{user.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{user.email}</p>
                </div>
                <div className="flex flex-col items-end">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mb-2 ${
                    user.role === 'superadmin' 
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-[#2B5C4B]/10 text-[#2B5C4B]'
                  }`}>
                    {user.role}
                  </span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    user.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {user.status}
                  </span>
                </div>
              </div>

              <div className="flex items-center text-xs text-gray-500 mt-3">
                <span className="mr-1">Last login:</span>
                {formatDateTime(user.last_login)}
              </div>

              <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-gray-100">
                <button
                  onClick={() => setUserToEdit(user)}
                  className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                  title="Edit"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleStatusToggle(user)}
                  className={`p-2 rounded-lg transition-colors ${
                    user.status === 'active'
                      ? 'text-red-600 hover:bg-red-50'
                      : 'text-green-600 hover:bg-green-50'
                  }`}
                  title={user.status === 'active' ? 'Deactivate' : 'Activate'}
                >
                  <Power className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setUserToDelete(user)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showCreateModal && (
        <CreateUserModal
          onClose={() => setShowCreateModal(false)}
          onUserCreated={onUserUpdated}
        />
      )}

      {userToDelete && (
        <DeleteUserModal
          user={userToDelete}
          onClose={() => setUserToDelete(null)}
          onConfirm={handleDeleteUser}
          loading={loading}
        />
      )}

      {userToEdit && (
        <EditUserModal
          user={userToEdit}
          onClose={() => setUserToEdit(null)}
          onUserUpdated={onUserUpdated}
        />
      )}
    </>
  );
}