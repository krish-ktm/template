import { AppointmentDetails } from './types';
import { formatMarkdown } from '../markdown';

export function createHeaderSection(title: string, subtitle: string) {
  return `
    <div style="
      background: linear-gradient(135deg, #2B5C4B 0%, #234539 100%);
      min-height: 200px;
      color: white;
      text-align: center;
      position: relative;
      overflow: hidden;
      border-radius: 12px 12px 0 0;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 32px;
    ">
      <div style="
        position: absolute;
        top: -40px;
        right: -40px;
        width: 200px;
        height: 200px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 50%;
        filter: blur(40px);
      "></div>
      <div style="
        position: absolute;
        bottom: -40px;
        left: -40px;
        width: 200px;
        height: 200px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 50%;
        filter: blur(40px);
      "></div>
      <div style="
        width: 64px;
        height: 64px;
        background-color: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(8px);
        border-radius: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 16px;
        position: relative;
        border: 1px solid rgba(255, 255, 255, 0.2);
      ">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
          <path d="M20 7L9 18l-5-5"></path>
        </svg>
      </div>
      <div style="position: relative;">
        <h1 style="
          font-size: 24px;
          margin: 0 0 8px 0;
          font-weight: 600;
        ">${title}</h1>
        <p style="
          font-size: 16px;
          margin: 0;
          opacity: 0.9;
        ">${subtitle}</p>
      </div>
    </div>
  `;
}

export function createBookingDetails(appointmentDetails: AppointmentDetails, formattedDate: string, translations: Record<string, Record<string, string | any>>) {
  return `
    <div style="
      background: white;
      padding: 24px;
      margin: 24px;
      border-radius: 16px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
      border: 1px solid rgba(43, 92, 75, 0.1);
    ">
      <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 20px;">
        <div style="
          background-color: rgba(43, 92, 75, 0.05);
          padding: 12px;
          border-radius: 12px;
        ">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2B5C4B" stroke-width="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
        </div>
        <div>
          <p style="color: #4B5563; font-size: 12px; margin: 0 0 4px 0;">${translations.confirmation.bookingId}</p>
          <p style="color: #2B5C4B; font-size: 18px; font-weight: 600; margin: 0;">#${appointmentDetails.id.slice(-8).toUpperCase()}</p>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
        <div style="
          background-color: rgba(43, 92, 75, 0.03);
          padding: 16px;
          border-radius: 12px;
          border: 1px solid rgba(43, 92, 75, 0.05);
        ">
          <p style="color: #4B5563; font-size: 12px; margin: 0 0 4px 0;">${translations.confirmation.date || translations.confirmation.appointmentDate}</p>
          <p style="color: #1F2937; font-size: 14px; font-weight: 500; margin: 0;">${formattedDate}</p>
        </div>
        <div style="
          background-color: rgba(43, 92, 75, 0.03);
          padding: 16px;
          border-radius: 12px;
          border: 1px solid rgba(43, 92, 75, 0.05);
        ">
          <p style="color: #4B5563; font-size: 12px; margin: 0 0 4px 0;">${translations.confirmation.time || translations.confirmation.appointmentTime}</p>
          <p style="color: #1F2937; font-size: 14px; font-weight: 500; margin: 0;">${appointmentDetails.appointment_time}</p>
        </div>
      </div>
    </div>
  `;
}

export function createImportantNotes(notes: { title: string; items: string[] }) {
  const markdownContent = notes.items.map(item => `- ${item}`).join('\n');
  const formattedContent = formatMarkdown(markdownContent);

  return `
    <div style="
      background: #F3F7F5;
      margin: 24px;
      padding: 24px;
      border-radius: 16px;
      border: 1px solid rgba(43, 92, 75, 0.1);
    ">
      <div style="
        margin-bottom: 6px;
      ">
        <span style="
          color: #2B5C4B;
          font-size: 14px;
          font-weight: 600;
        ">${notes.title}</span>
      </div>

      <div style="
        color: #1F2937;
        font-size: 14px;
        line-height: 1.7;
      ">
        ${formattedContent}
      </div>
    </div>
  `;
}

