import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings, Save, RotateCcw, Calendar, Clock, Shield } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { toast } from 'react-hot-toast';
import { DateSelectionOptions, BookingRestrictions } from '../../../hooks/useBookingSettings';

export function BookingSettingsManager() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dateOptions, setDateOptions] = useState<DateSelectionOptions>({
    today: { enabled: true, label: { en: 'Today', gu: 'આજે' } },
    tomorrow: { enabled: true, label: { en: 'Tomorrow', gu: 'આવતીકાલે' } },
    week: { enabled: false, label: { en: 'This Week', gu: 'આ અઠવાડિયે' }, days: 7 },
    calendar: { enabled: false, label: { en: 'Choose Date', gu: 'તારીખ પસંદ કરો' }, maxDaysAhead: 30 }
  });
  
  const [restrictions, setRestrictions] = useState<BookingRestrictions>({
    minDaysAhead: 0,
    maxDaysAhead: 30,
    allowWeekends: false,
    allowPastDates: false
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('appointment_booking_settings')
        .select('setting_key, setting_value')
        .eq('is_active', true);

      if (error) throw error;

      const settingsMap = data?.reduce((acc, item) => {
        acc[item.setting_key] = item.setting_value;
        return acc;
      }, {} as Record<string, any>) || {};

      if (settingsMap.date_selection_options) {
        setDateOptions(settingsMap.date_selection_options);
      }
      
      if (settingsMap.booking_restrictions) {
        setRestrictions(settingsMap.booking_restrictions);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Failed to load booking settings');
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    try {
      setSaving(true);
      
      const updates = [
        {
          setting_key: 'date_selection_options',
          setting_value: dateOptions
        },
        {
          setting_key: 'booking_restrictions',
          setting_value: restrictions
        }
      ];

      for (const update of updates) {
        const { error } = await supabase
          .from('appointment_booking_settings')
          .upsert(update, { onConflict: 'setting_key' });
        
        if (error) throw error;
      }

      toast.success('Booking settings updated successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save booking settings');
    } finally {
      setSaving(false);
    }
  };

  const resetToDefaults = () => {
    setDateOptions({
      today: { enabled: true, label: { en: 'Today', gu: 'આજે' } },
      tomorrow: { enabled: true, label: { en: 'Tomorrow', gu: 'આવતીકાલે' } },
      week: { enabled: false, label: { en: 'This Week', gu: 'આ અઠવાડિયે' }, days: 7 },
      calendar: { enabled: false, label: { en: 'Choose Date', gu: 'તારીખ પસંદ કરો' }, maxDaysAhead: 30 }
    });
    
    setRestrictions({
      minDaysAhead: 0,
      maxDaysAhead: 30,
      allowWeekends: false,
      allowPastDates: false
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Settings className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Booking Settings</h2>
            <p className="text-sm text-gray-600">Configure how patients can select appointment dates</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={resetToDefaults}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </button>
          <button
            onClick={saveSettings}
            disabled={saving}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {saving ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Date Selection Options */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl border border-gray-200 p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-green-100 rounded-lg">
              <Calendar className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Date Selection Options</h3>
              <p className="text-sm text-gray-600">Choose which date selection methods to show</p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Today Option */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">Today</h4>
                <p className="text-sm text-gray-600">Allow booking for today</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={dateOptions.today.enabled}
                  onChange={(e) => setDateOptions({
                    ...dateOptions,
                    today: { ...dateOptions.today, enabled: e.target.checked }
                  })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {/* Tomorrow Option */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">Tomorrow</h4>
                <p className="text-sm text-gray-600">Allow booking for tomorrow</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={dateOptions.tomorrow.enabled}
                  onChange={(e) => setDateOptions({
                    ...dateOptions,
                    tomorrow: { ...dateOptions.tomorrow, enabled: e.target.checked }
                  })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {/* Week View Option */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">Week View</h4>
                <p className="text-sm text-gray-600">Show weekly calendar view</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={dateOptions.week.enabled}
                  onChange={(e) => setDateOptions({
                    ...dateOptions,
                    week: { ...dateOptions.week, enabled: e.target.checked }
                  })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {/* Calendar Option */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-medium text-gray-900">Full Calendar</h4>
                  <p className="text-sm text-gray-600">Show expandable calendar view</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={dateOptions.calendar.enabled}
                    onChange={(e) => setDateOptions({
                      ...dateOptions,
                      calendar: { ...dateOptions.calendar, enabled: e.target.checked }
                    })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              {dateOptions.calendar.enabled && (
                <div className="mt-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Days Ahead
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="365"
                    value={dateOptions.calendar.maxDaysAhead || 30}
                    onChange={(e) => setDateOptions({
                      ...dateOptions,
                      calendar: { 
                        ...dateOptions.calendar, 
                        maxDaysAhead: parseInt(e.target.value) || 30 
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Booking Restrictions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl border border-gray-200 p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Shield className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Booking Restrictions</h3>
              <p className="text-sm text-gray-600">Set limits and rules for appointments</p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Max Days Ahead */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maximum Days Ahead
              </label>
              <input
                type="number"
                min="1"
                max="365"
                value={restrictions.maxDaysAhead}
                onChange={(e) => setRestrictions({
                  ...restrictions,
                  maxDaysAhead: parseInt(e.target.value) || 30
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">How far in advance patients can book</p>
            </div>

            {/* Allow Weekends */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">Allow Weekends</h4>
                <p className="text-sm text-gray-600">Enable booking on Saturday and Sunday</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={restrictions.allowWeekends}
                  onChange={(e) => setRestrictions({
                    ...restrictions,
                    allowWeekends: e.target.checked
                  })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {/* Allow Past Dates */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">Allow Past Dates</h4>
                <p className="text-sm text-gray-600">Enable booking for past dates (admin only)</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={restrictions.allowPastDates}
                  onChange={(e) => setRestrictions({
                    ...restrictions,
                    allowPastDates: e.target.checked
                  })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Preview Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl border border-gray-200 p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Clock className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Preview</h3>
            <p className="text-sm text-gray-600">How the date selection will appear to patients</p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-sm text-gray-600 mb-2">Enabled options:</div>
          <div className="flex flex-wrap gap-2">
            {dateOptions.today.enabled && (
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">Today</span>
            )}
            {dateOptions.tomorrow.enabled && (
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">Tomorrow</span>
            )}
            {dateOptions.week.enabled && (
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">Week View</span>
            )}
            {dateOptions.calendar.enabled && (
              <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                Calendar ({dateOptions.calendar.maxDaysAhead} days)
              </span>
            )}
          </div>
          
          <div className="mt-3 text-sm text-gray-600">
            <div>Max booking ahead: {restrictions.maxDaysAhead} days</div>
            <div>Weekends: {restrictions.allowWeekends ? 'Allowed' : 'Not allowed'}</div>
            <div>Past dates: {restrictions.allowPastDates ? 'Allowed' : 'Not allowed'}</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}