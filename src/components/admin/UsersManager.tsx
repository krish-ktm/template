import { useState, useEffect } from 'react';
import { User } from '../../types';
import { getUsers } from '../../lib/auth';
import { toast } from 'react-hot-toast';
import { UsersTable } from './UsersTable';
import { LoadingSpinner } from '../LoadingSpinner';
import { useNavigate } from 'react-router-dom';

export function UsersManager() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        navigate('/login');
        throw new Error('Authentication required');
      }

      const currentUser = JSON.parse(userStr) as User;
      if (currentUser.role !== 'superadmin') {
        navigate('/admin');
        throw new Error('Unauthorized access');
      }

      const { users, error } = await getUsers();
      
      if (error) {
        throw new Error(error);
      }

      setUsers(users);
    } catch (error) {
      console.error('Error loading users:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6 px-2 sm:px-0 mt-4 sm:mt-0 pt-12 sm:pt-0">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">User Management</h2>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-2 py-4 sm:px-6 sm:py-5">
          <UsersTable users={users} onUserUpdated={loadUsers} />
        </div>
      </div>
    </div>
  );
}
