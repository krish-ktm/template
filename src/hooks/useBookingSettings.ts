import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface DateSelectionOption {
  enabled: boolean;
  label: {
    en: string;
    gu: string;
  };
  days?: number;
  maxDaysAhead?: number;
}

export interface DateSelectionOptions {
  today: DateSelectionOption;
  tomorrow: DateSelectionOption;
  week: DateSelectionOption;
  calendar: DateSelectionOption;
}

export interface BookingRestrictions {
  minDaysAhead: number;
  maxDaysAhead: number;
  allowWeekends: boolean;
  allowPastDates: boolean;
}

export interface BookingSettings {
  dateSelectionOptions: DateSelectionOptions;
  bookingRestrictions: BookingRestrictions;
}

export function useBookingSettings() {
  const [settings, setSettings] = useState<BookingSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

      setSettings({
        dateSelectionOptions: settingsMap.date_selection_options || {
          today: { enabled: true, label: { en: 'Today', gu: 'આજે' } },
          tomorrow: { enabled: true, label: { en: 'Tomorrow', gu: 'આવતીકાલે' } },
          week: { enabled: false, label: { en: 'This Week', gu: 'આ અઠવાડિયે' }, days: 7 },
          calendar: { enabled: false, label: { en: 'Choose Date', gu: 'તારીખ પસંદ કરો' }, maxDaysAhead: 30 }
        },
        bookingRestrictions: settingsMap.booking_restrictions || {
          minDaysAhead: 0,
          maxDaysAhead: 30,
          allowWeekends: false,
          allowPastDates: false
        }
      });
    } catch (err) {
      console.error('Error fetching booking settings:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch settings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return {
    settings,
    loading,
    error,
    refetch: fetchSettings
  };
}