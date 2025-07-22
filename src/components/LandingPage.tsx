import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Notice } from '../types';
import { ResponsiveHeader } from './headers/ResponsiveHeader';
import { Footer } from './Footer';
import { HeroSection } from './landing/HeroSection';
import { ServicesSection } from './landing/ServicesSection';
import { NoticeBoard } from './landing/NoticeBoard';
import { WhyChooseUs } from './landing/WhyChooseUs';
import { Benefits } from './landing/Benefits';
import { useTranslation } from '../i18n/useTranslation';
import { SEO } from './SEO';
import { StructuredData } from './StructuredData';
import { clinicSchema, doctorSchema, faqSchema } from '../config/structuredData';
import { translations } from '../translations'; // Import translations directly

// Components temporarily removed from the landing page but kept for future use
// These imports can be uncommented when needed again
// import { HowWeWork } from './landing/HowWeWork';
// import { BeforeAfter } from './landing/BeforeAfter';
// import { StatsSection } from './landing/StatsSection'; // Our Impact section

export function LandingPage() {
  const { t, language } = useTranslation();
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);

  // Get translations directly from the source to ensure we have the meta data
  const directTranslations = translations[language];
  
  // Create explicit variables for SEO values from direct translations
  const metaTitle = directTranslations?.meta?.homeTitle || 'Home';
  const metaDescription = directTranslations?.meta?.homeDescription || 'Welcome to our clinic';
  const keywords = directTranslations?.meta?.keywords;
  const author = directTranslations?.meta?.author;

  useEffect(() => {
    loadNotices();
  }, []);

  const loadNotices = async () => {
    try {
      const { data, error } = await supabase
        .from('notices')
        .select('*')
        .eq('active', true)
        .order('order', { ascending: true });

      if (error) throw error;
      setNotices(data || []);
    } catch (error) {
      console.error('Error loading notices:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <SEO 
        title={metaTitle} 
        description={metaDescription} 
        keywords={keywords}
        author={author}
        ogTitle={metaTitle} 
        ogDescription={metaDescription}
        ogImage="https://drjemishskinclinic.com/og-image.jpg"
        ogUrl="https://drjemishskinclinic.com"
        twitterTitle={metaTitle}
        twitterDescription={metaDescription}
        twitterImage="https://drjemishskinclinic.com/twitter-image.jpg"
        canonicalUrl={window.location.href}
      />
      <StructuredData type="LocalBusiness" data={clinicSchema} />
      <StructuredData type="Person" data={doctorSchema} />
      <StructuredData type="FAQPage" data={faqSchema} />
      
      <ResponsiveHeader />
      
      <HeroSection t={t.home?.hero} />
      
      <WhyChooseUs t={t.whyChooseUs} />
      <ServicesSection t={t.services} />
      <Benefits t={t.Benefits} />
      <NoticeBoard notices={notices} loading={loading} t={t.noticeBoard} />

      <Footer />
    </div>
  );
}