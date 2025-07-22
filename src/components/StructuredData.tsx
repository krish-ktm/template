import React from 'react';
import { Helmet } from 'react-helmet-async';

interface StructuredDataProps {
  type: 'LocalBusiness' | 'Person' | 'MedicalProcedure' | 'FAQPage' | 'WebSite';
  data: Record<string, unknown>;
}

export function StructuredData({ type, data }: StructuredDataProps) {
  // Add context and type to the data object
  const jsonLD = {
    '@context': 'https://schema.org',
    '@type': type,
    ...data,
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(jsonLD)}
      </script>
    </Helmet>
  );
} 