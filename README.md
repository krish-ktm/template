# Dr. Jemish Skin & Hair Care Clinic

This is the official website for Dr. Jemish Skin & Hair Care Clinic, a dermatology practice located in Mehsana, Gujarat, India.

## Features

- **Multi-language Support**: Available in English and Gujarati
- **Appointment Booking System**: Online scheduling for patient convenience
- **Service Information**: Detailed descriptions of skin and hair treatments
- **Doctor Profile**: Information about Dr. Jemish and his qualifications
- **Contact Information**: Multiple ways to reach the clinic
- **Responsive Design**: Optimized for all devices (mobile, tablet, desktop)

## SEO Optimization

The website has been fully optimized for search engines with:

- **Meta Tags**: Customized for each page in both languages
- **Structured Data**: JSON-LD implementation for rich search results
- **Sitemap**: XML sitemap for search engine indexing
- **Robots.txt**: Configuration for search engine crawlers
- **Semantic HTML**: Proper heading hierarchy and semantic elements

For more information about the structured data implementation, see [STRUCTURED_DATA.md](./docs/STRUCTURED_DATA.md).

## Technology Stack

- **Frontend Framework**: React with Next.js
- **Styling**: Tailwind CSS
- **Internationalization**: Next-i18next
- **SEO**: Next SEO
- **Form Handling**: React Hook Form
- **Deployment**: [Deployment platform]

## Development

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd [project-directory]
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open your browser and navigate to `http://localhost:3000`

### Building for Production

```bash
npm run build
# or
yarn build
```

### Project Structure

- `public/` - Static assets
- `src/` - Source code
  - `components/` - React components
  - `config/` - Configuration files
    - `business.ts` - Clinic information
    - `structuredData.ts` - SEO structured data
    - `translations/` - Language files
  - `pages/` - Next.js pages
  - `styles/` - CSS files
  - `utils/` - Utility functions

## SEO Structure

- **DefaultSEO**: Base SEO configuration applied to all pages
- **Page-specific SEO**: Each page has customized meta tags
- **Structured Data**: JSON-LD schemas for various content types
- **Canonical URLs**: Properly set for all pages
- **hreflang Tags**: For language variants of each page

## Contributing

[Include contribution guidelines if applicable]

## License

[Include license information]

## Contact

For questions about the website, please contact:
- Email: [Contact email]
- Phone: +91 99095 87003

## Acknowledgements

- [List any libraries, resources, or contributors to acknowledge] 