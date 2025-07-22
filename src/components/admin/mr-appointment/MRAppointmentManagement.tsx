import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Clock, Image } from 'lucide-react';
import { MRWeekdayManager } from './MRWeekdayManager';
import { MRDateManager } from './MRDateManager';
import ImageDownloadRules from '../ImageDownloadRules';

export function MRAppointmentManagement() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      toast.error('Please login to access this page');
      return;
    }

    const user = JSON.parse(userStr);
    if (user.role !== 'superadmin') {
      toast.error('Unauthorized access');
      return;
    }

    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2B5C4B]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 mt-14 sm:mt-0">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-[#2B5C4B]/10 p-3 rounded-lg">
          <Clock className="h-6 w-6 text-[#2B5C4B]" />
        </div>
        <div>
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">MR Appointment Management</h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">Configure MR appointment settings</p>
        </div>
      </div>

      <MRWeekdayManager />
      <MRDateManager />

      <div className="flex items-center gap-3 mb-6">
        <div className="bg-[#2B5C4B]/10 p-3 rounded-lg">
          <Image className="h-6 w-6 text-[#2B5C4B]" />
        </div>
        <div>
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">MR Image Download Rules</h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">Manage text displayed in MR appointment confirmation and downloaded images</p>
        </div>
      </div>

      <ImageDownloadRules type="mr" />
    </div>
  );
}