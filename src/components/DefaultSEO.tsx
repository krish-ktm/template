import { StructuredData } from './StructuredData';
import { websiteSchema } from '../config/structuredData';
import { Helmet } from 'react-helmet-async';

/**
 * DefaultSEO provides only site-wide schema data without any meta tags
 * that would conflict with page-specific SEO components.
 */
export function DefaultSEO() {
  // No need to load translations here anymore
  
  return (
    <>
      {/* Only apply the WebSite schema */}
      <StructuredData type="WebSite" data={websiteSchema} />
      
      {/* Add any global head elements that won't conflict */}
      <Helmet>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="utf-8" />
      </Helmet>
    </>
  );
} 