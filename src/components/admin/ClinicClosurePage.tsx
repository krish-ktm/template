import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Clock } from 'lucide-react';
import { ClosureDatesManager } from './ClosureDatesManager';
import { checkSuperAdminAccess } from '../../lib/auth';
import { useNavigate } from 'react-router-dom';

export function ClinicClosurePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user has superadmin access
    const { isAuthorized, error } = checkSuperAdminAccess();
    if (!isAuthorized) {
      toast.error(error || 'Unauthorized access');
      navigate('/admin/appointments');
      return;
    }

    setLoading(false);
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2B5C4B]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 px-2 sm:px-0 mt-4 sm:mt-0 pt-12 sm:pt-0">
      <div className="flex items-center gap-3 mb-4 sm:mb-6">
        <div className="bg-[#2B5C4B]/10 p-2 sm:p-3 rounded-lg">
          <Clock className="h-5 sm:h-6 w-5 sm:w-6 text-[#2B5C4B]" />
        </div>
        <div>
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Clinic Closure Management</h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">Manage clinic closure dates and holidays</p>
        </div>
      </div>

      <ClosureDatesManager />
    </div>
  );
}