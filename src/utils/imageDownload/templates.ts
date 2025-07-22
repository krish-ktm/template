import { createHeaderSection, createBookingDetails, createImportantNotes } from './components';
import { AppointmentDetails, PatientDetails, MRDetails } from './types';
import { supabase } from '../../lib/supabase';

async function getDownloadRules(type: 'patient' | 'mr', language: string) {
  try {
    const { data, error } = await supabase
      .from('image_download_rules')
      .select('title, content')
      .eq('type', type)
      .eq('is_active', true)
      .order('order', { ascending: true })
      .limit(1)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw error;
    }

    if (data && data.content && data.content[language]) {
      const contentText = data.content[language] as string;
      const contentItems = contentText.split('\n')
        .map((line: string) => line.trim())
        .filter((line: string) => line.startsWith('-'))
        .map((line: string) => line.substring(1).trim());
      
      const titleText = (data.title && data.title[language] as string) || 'Important Notes';
      
      return {
        title: titleText,
        items: contentItems.length > 0 ? contentItems : [
          'Please arrive 10 minutes before your appointment time',
          type === 'patient' 
            ? 'Bring your previous medical records'
            : 'Bring your company ID card and visiting card',
          'Wear a mask during your visit'
        ]
      };
    }

    return {
      title: 'Important Notes',
      items: type === 'patient' 
        ? ['Please arrive 10 minutes before your appointment time', 'Bring your previous medical records', 'Wear a mask during your visit']
        : ['Please arrive 10 minutes before your appointment time', 'Bring your company ID card and visiting card', 'Wear a mask during your visit']
    };
  } catch (error) {
    console.error('Error fetching download rules:', error);
    return null;
  }
}

export async function createPatientTemplate(
  appointmentDetails: AppointmentDetails & PatientDetails,
  formattedDate: string,
  translations: Record<string, string | Record<string, string>>,
  language: string = 'en'
) {
  const rules = await getDownloadRules('patient', language);
  const confirmation = translations.confirmation as Record<string, string>;
  const form = translations.form as Record<string, string>;

  const container = document.createElement('div');
  container.style.width = '800px';
  container.style.backgroundColor = '#ffffff';
  container.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
  container.style.fontFamily = 'system-ui, -apple-system, sans-serif';
  container.style.position = 'fixed';
  container.style.left = '-9999px';
  container.style.borderRadius = '12px';
  container.style.overflow = 'hidden';

  container.innerHTML = `
    ${createHeaderSection(confirmation.title, confirmation.subtitle)}
    
    ${createBookingDetails(appointmentDetails, formattedDate, translations)}
    
    <div style="
      background-color: #f9fafb;
      margin: 24px;
      padding: 24px;
      border-radius: 16px;
    ">
      <h2 style="
        color: #111827;
        font-size: 18px;
        font-weight: 600;
        margin: 0 0 20px 0;
      ">${confirmation.patientDetails || 'Patient Details'}</h2>
      
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
        <div>
          <p style="color: #6b7280; font-size: 12px; margin: 0 0 4px 0;">${form.name}</p>
          <p style="color: #111827; font-size: 14px; font-weight: 500; margin: 0;">${appointmentDetails.name}</p>
        </div>
        <div>
          <p style="color: #6b7280; font-size: 12px; margin: 0 0 4px 0;">${form.phone}</p>
          <p style="color: #111827; font-size: 14px; font-weight: 500; margin: 0;">${appointmentDetails.phone}</p>
        </div>
        <div>
          <p style="color: #6b7280; font-size: 12px; margin: 0 0 4px 0;">${form.age}</p>
          <p style="color: #111827; font-size: 14px; font-weight: 500; margin: 0;">${appointmentDetails.age} ${form.years || 'years'}</p>
        </div>
        <div>
          <p style="color: #6b7280; font-size: 12px; margin: 0 0 4px 0;">${form.city}</p>
          <p style="color: #111827; font-size: 14px; font-weight: 500; margin: 0;">${appointmentDetails.city}</p>
        </div>
      </div>
    </div>
    
    ${rules ? createImportantNotes(rules) : ''}
  `;

  return container;
}

export async function createMRTemplate(
  appointmentDetails: AppointmentDetails & MRDetails,
  formattedDate: string,
  translations: Record<string, string | Record<string, string>>,
  language: string = 'en'
) {
  const rules = await getDownloadRules('mr', language);
  const confirmation = translations.confirmation as Record<string, string>;
  const form = translations.form as Record<string, string>;

  const container = document.createElement('div');
  container.style.width = '800px';
  container.style.backgroundColor = '#ffffff';
  container.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
  container.style.fontFamily = 'system-ui, -apple-system, sans-serif';
  container.style.position = 'fixed';
  container.style.left = '-9999px';
  container.style.borderRadius = '12px';
  container.style.overflow = 'hidden';

  container.innerHTML = `
    ${createHeaderSection(confirmation.title, confirmation.subtitle)}
    
    ${createBookingDetails(appointmentDetails, formattedDate, translations)}
    
    <div style="
      background-color: #f9fafb;
      margin: 24px;
      padding: 24px;
      border-radius: 16px;
    ">
      <h2 style="
        color: #111827;
        font-size: 18px;
        font-weight: 600;
        margin: 0 0 20px 0;
      ">${confirmation.mrDetails || 'MR Details'}</h2>
      
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
        <div>
          <p style="color: #6b7280; font-size: 12px; margin: 0 0 4px 0;">${form.mrName || 'MR Name'}</p>
          <p style="color: #111827; font-size: 14px; font-weight: 500; margin: 0;">${appointmentDetails.mr_name}</p>
        </div>
        <div>
          <p style="color: #6b7280; font-size: 12px; margin: 0 0 4px 0;">${form.companyName || 'Company Name'}</p>
          <p style="color: #111827; font-size: 14px; font-weight: 500; margin: 0;">${appointmentDetails.company_name}</p>
        </div>
        <div>
          <p style="color: #6b7280; font-size: 12px; margin: 0 0 4px 0;">${form.divisionName || 'Division Name'}</p>
          <p style="color: #111827; font-size: 14px; font-weight: 500; margin: 0;">${appointmentDetails.division_name}</p>
        </div>
        <div>
          <p style="color: #6b7280; font-size: 12px; margin: 0 0 4px 0;">${form.contactNo || 'Contact Number'}</p>
          <p style="color: #111827; font-size: 14px; font-weight: 500; margin: 0;">${appointmentDetails.contact_no}</p>
        </div>
      </div>
    </div>
    
    ${rules ? createImportantNotes(rules) : ''}
  `;

  return container;
}