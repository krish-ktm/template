# Structured Data Implementation

This document outlines the structured data (JSON-LD) implementation for Dr. Jemish Skin & Hair Care Clinic's website to improve SEO and enable rich search results.

## Overview

Structured data uses the [Schema.org](https://schema.org/) vocabulary to mark up content in a way that search engines can understand. We've implemented the following schema types:

1. **WebSite** - Applied globally through the DefaultSEO component
2. **LocalBusiness / MedicalOrganization** - For clinic information on homepage, contact, and appointment pages
3. **Person / Physician** - For doctor information on homepage and about page
4. **MedicalProcedure** - For services/treatments on the services page
5. **FAQPage** - For frequently asked questions on the homepage

## Implementation Details

### Components

1. **StructuredData.tsx** - A reusable component that renders structured data as JSON-LD scripts
2. **DefaultSEO.tsx** - Applies global SEO settings and the WebSite schema
3. **Page Components** - Each page component includes relevant structured data schemas

### Configuration

All structured data is configured in `src/config/structuredData.ts`, which pulls business information from `src/config/business.ts` to ensure consistency.

## Schema Types Used

### WebSite Schema

Applied globally to define the website and its search functionality:

```javascript
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Dr. Jemish Skin & Hair Care Clinic",
  "url": "https://drjemishskinclinic.com",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://drjemishskinclinic.com/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}
```

### MedicalOrganization Schema

Defines the clinic as a medical business entity:

```javascript
{
  "@context": "https://schema.org",
  "@type": "MedicalOrganization",
  "name": "Dr. Jemish Skin & Hair Care Clinic",
  "url": "https://drjemishskinclinic.com",
  "logo": "https://drjemishskinclinic.com/logo.png",
  "telephone": "+91 99095 87003",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "2nd Floor, Avi Square, Opp. Swaminarayan Temple, Radhanpur Circle",
    "addressLocality": "Mehsana",
    "addressRegion": "Gujarat",
    "postalCode": "384002",
    "addressCountry": "IN"
  },
  // ... additional information
}
```

### Physician Schema

Defines the doctor's information:

```javascript
{
  "@context": "https://schema.org",
  "@type": "Physician",
  "name": "Dr. Jemish A. Patel",
  "medicalSpecialty": [
    {
      "@type": "MedicalSpecialty",
      "name": "Dermatology"
    }
  ],
  // ... additional information
}
```

### MedicalProcedure Schema

Defines the services/treatments offered:

```javascript
{
  "@context": "https://schema.org",
  "@type": "MedicalProcedure",
  "name": "Hair Treatments",
  "procedureType": "https://schema.org/MedicalTherapy",
  "description": "Advanced hair loss treatments...",
  // ... additional information
}
```

### FAQPage Schema

Defines frequently asked questions:

```javascript
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What skin conditions does Dr. Jemish treat?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Dr. Jemish specializes in..."
      }
    },
    // ... additional questions
  ]
}
```

## Testing

You can test the structured data implementation using Google's [Rich Results Test](https://search.google.com/test/rich-results) or [Schema Markup Validator](https://validator.schema.org/).

## Maintenance

When updating business information, modify the `src/config/business.ts` file, which will automatically update the structured data. For schema structure changes, modify the `src/config/structuredData.ts` file.

## Resources

- [Schema.org](https://schema.org/) - Main schema vocabulary
- [Google's Search Gallery](https://developers.google.com/search/docs/appearance/structured-data/search-gallery) - Rich result types
- [Medical Schema Types](https://schema.org/docs/meddocs.html) - Medical-specific schemas 