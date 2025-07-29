import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Login } from './components/Login';
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { NoticeManager } from './components/admin/NoticeManager';
import { MessageManager } from './components/admin/MessageManager';
import { ContactMessagesManager } from './components/admin/ContactMessagesManager';
import { AppointmentManager } from './components/admin/appointments/AppointmentManager';
import { AppointmentSettings } from './components/admin/appointments/AppointmentSettings';
import { PatientManager } from './components/admin/patients/PatientManager';
import { MRAppointmentManager } from './components/admin/mr-appointments/MRAppointmentManager';
import { MRAppointmentManagement } from './components/admin/mr-appointment/MRAppointmentManagement';
import { UsersManager } from './components/admin/UsersManager';
import { ClinicClosurePage } from './components/admin/ClinicClosurePage';
import { AnalyticsDashboard } from './components/admin/analytics/AnalyticsDashboard';
import { LandingPage } from './components/LandingPage';
import { AboutPage } from './components/AboutPage';
import { GalleryPage } from './components/GalleryPage';
import { MRAppointment } from './components/mr-appointment/MRAppointment';
import { ServicesPage } from './components/ServicesPage';
import { ContactPage } from './components/ContactPage';
import { LanguageProvider } from './i18n/LanguageContext';
import { AppointmentPage } from './components/appointment/AppointmentPage';
import { LanguageSelectionModal } from './components/LanguageSelectionModal';
import { DoctorMessageProvider } from './contexts/DoctorMessageContext';
import { DoctorMessage } from './components/DoctorMessage';
import { DefaultSEO } from './components/DefaultSEO';

// Scroll to top component
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

// Component to conditionally render DoctorMessage only on front-end pages
function ConditionalDoctorMessage() {
  const { pathname } = useLocation();
  const isAdminPage = pathname.startsWith('/admin') || pathname === '/login';
  
  if (isAdminPage) {
    return null;
  }
  
  return <DoctorMessage />;
}

function App() {
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  useEffect(() => {
    const hasSelectedLanguage = localStorage.getItem('hasSelectedLanguage');
    if (!hasSelectedLanguage) {
      setShowLanguageModal(true);
    }
  }, []);

  return (
    <Router>
      <LanguageProvider>
        <DoctorMessageProvider>
          <DefaultSEO />
          <ScrollToTop />
          <LanguageSelectionModal 
            isOpen={showLanguageModal} 
            onClose={() => setShowLanguageModal(false)} 
          />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/mr-appointment" element={<MRAppointment />} />
            <Route path="/appointment" element={<AppointmentPage />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="analytics" element={<AnalyticsDashboard />} />
              <Route path="appointments" element={<AppointmentManager />} />
              <Route path="patients" element={<PatientManager />} />
              <Route path="appointment-settings" element={<AppointmentSettings />} />
              <Route path="mr-appointments" element={<MRAppointmentManager />} />
              <Route path="mr-settings" element={<MRAppointmentManagement />} />
              <Route path="notices" element={<NoticeManager />} />
              <Route path="messages" element={<MessageManager />} />
              <Route path="contact-messages" element={<ContactMessagesManager />} />
              <Route path="users" element={<UsersManager />} />
              <Route path="clinic-closure" element={<ClinicClosurePage />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <ConditionalDoctorMessage />
          <Toaster position="top-right" />
        </DoctorMessageProvider>
      </LanguageProvider>
    </Router>
  );
}

export default App;