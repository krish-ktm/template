import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';

interface DoctorMessageData {
  id: string;
  message_en: string;
  message_gu: string;
  active: boolean;
  created_at: string;
}

interface DoctorMessageContextType {
  message: DoctorMessageData | null;
  loading: boolean;
  isVisible: boolean;
  setIsVisible: (visible: boolean) => void;
  refreshMessage: () => Promise<void>;
}

const DoctorMessageContext = createContext<DoctorMessageContextType | undefined>(undefined);

export const DoctorMessageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [message, setMessage] = useState<DoctorMessageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(true);

  const loadMessage = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('doctor_messages')
        .select('*')
        .eq('active', true)
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) throw error;
      
      setMessage(data && data.length > 0 ? data[0] : null);
    } catch (error) {
      console.error('Error loading doctor message:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessage();
  }, []);

  return (
    <DoctorMessageContext.Provider 
      value={{ 
        message, 
        loading, 
        isVisible, 
        setIsVisible,
        refreshMessage: loadMessage
      }}
    >
      {children}
    </DoctorMessageContext.Provider>
  );
};

export const useDoctorMessage = (): DoctorMessageContextType => {
  const context = useContext(DoctorMessageContext);
  if (context === undefined) {
    throw new Error('useDoctorMessage must be used within a DoctorMessageProvider');
  }
  return context;
}; 