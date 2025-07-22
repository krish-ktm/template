import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { LoadingSpinner } from '../LoadingSpinner';
import { useNavigate } from 'react-router-dom';
import { Users, MessageCircle, Bell, ArrowUpRight } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { checkSuperAdminAccess } from '../../lib/auth';
import { LucideIcon } from 'lucide-react';

interface DashboardStats {
  totalMessages: number;
  totalNotices: number;
  totalUsers: number;
}

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: number;
  onClick?: () => void;
}

export function AdminDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalMessages: 0,
    totalNotices: 0,
    totalUsers: 0
  });

  useEffect(() => {
    // Check if user has superadmin access
    const { isAuthorized, error } = checkSuperAdminAccess();
    if (!isAuthorized) {
      toast.error(error || 'Unauthorized access');
      navigate('/admin/appointments');
      return;
    }
    
    loadData();
  }, [navigate]);

  const loadData = async () => {
    try {
      setLoading(true);
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        navigate('/login');
        throw new Error('Authentication required');
      }

      // Load dashboard stats
      const [
        { count: messagesCount },
        { count: noticesCount },
        { count: usersCount }
      ] = await Promise.all([
        supabase.from('doctor_messages').select('*', { count: 'exact', head: true }),
        supabase.from('notices').select('*', { count: 'exact', head: true }),
        supabase.from('users').select('*', { count: 'exact', head: true })
      ]);

      setStats({
        totalMessages: messagesCount || 0,
        totalNotices: noticesCount || 0,
        totalUsers: usersCount || 0
      });

    } catch (error) {
      console.error('Error loading data:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to load data';
      toast.error(errorMessage);
      if (error instanceof Error && error.message === 'Authentication required') {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  const StatCard = ({ icon: Icon, label, value, onClick }: StatCardProps) => (
    <div 
      onClick={onClick}
      className={`bg-white rounded-xl p-6 border border-gray-200 hover:border-[#2B5C4B]/20 hover:shadow-lg transition-all duration-300 ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="bg-[#2B5C4B]/10 p-3 rounded-lg">
          <Icon className="h-6 w-6 text-[#2B5C4B]" />
        </div>
        {onClick && <ArrowUpRight className="h-5 w-5 text-gray-400" />}
      </div>
      <p className="text-sm text-gray-600 mb-1">{label}</p>
      <p className="text-2xl font-semibold text-gray-900">{value}</p>
    </div>
  );

  return (
    <div className="space-y-6 pt-12 sm:pt-0 mt-4 sm:mt-0 px-2 sm:px-0">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard 
          icon={MessageCircle} 
          label="Flash Message" 
          value={stats.totalMessages}
          onClick={() => navigate('/admin/messages')}
        />
        <StatCard 
          icon={Bell} 
          label="Announcements" 
          value={stats.totalNotices}
          onClick={() => navigate('/admin/notices')}
        />
        <StatCard 
          icon={Users} 
          label="System Users" 
          value={stats.totalUsers}
          onClick={() => navigate('/admin/users')}
        />
      </div>
    </div>
  );
}