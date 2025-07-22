import { motion } from 'framer-motion';
import React, { useState } from 'react';
import { ResponsiveHeader } from './headers/ResponsiveHeader';
import { Footer } from './Footer';
import { useTranslation } from '../i18n/useTranslation';
import { Camera, Building2, Users, Layout, Shield } from 'lucide-react';
import { galleryImages, categories } from '../config/gallery';
import { SEO } from './SEO';
import { translations } from '../translations'; // Import translations directly

export function GalleryPage() {
  const { language, t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Get translations directly from the source to ensure we have the meta data
  const directTranslations = translations[language];
  
  // Create explicit variables for SEO values from direct translations
  const metaTitle = directTranslations?.meta?.galleryTitle || 'Gallery';
  const metaDescription = directTranslations?.meta?.galleryDescription || 'View our gallery of clinic images';
  const keywords = directTranslations?.meta?.keywords;
  const author = directTranslations?.meta?.author;

  const filteredImages = selectedCategory === 'all' 
    ? galleryImages 
    : galleryImages.filter(img => img.category === selectedCategory);

  const categoryList = categories[language];
  const getCategoryIcon = (id: string) => {
    switch(id) {
      case 'all': return Camera;
      case 'office': return Users;
      case 'interior': return Layout;
      case 'exterior': return Building2;
      default: return Camera;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#2B5C4B]/5 via-white to-[#2B5C4B]/5 relative overflow-hidden">
      <SEO 
        title={metaTitle} 
        description={metaDescription} 
        keywords={keywords}
        author={author}
        ogTitle={metaTitle}
        ogDescription={metaDescription}
        ogImage="https://drjemishskinclinic.com/og-image.jpg"
        ogUrl="https://drjemishskinclinic.com/gallery"
        twitterTitle={metaTitle}
        twitterDescription={metaDescription}
        twitterImage="https://drjemishskinclinic.com/twitter-image.jpg"
        canonicalUrl={window.location.href}
      />
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#2B5C4B]/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#2B5C4B]/5 rounded-full blur-3xl" />
      </div>

      <ResponsiveHeader />
      
      <main className="pt-24 sm:pt-32 pb-16 sm:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Section */}
          <div className="text-center mb-12 sm:mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#2B5C4B]/5 text-[#2B5C4B] text-xs font-medium mb-3 sm:mb-4 backdrop-blur-sm"
            >
              <Shield className="w-3.5 h-3.5" />
              {t.gallery?.badge || "Our Gallery"}
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1e3a5c] mb-4 sm:mb-6 font-heading"
            >
              {t.gallery?.title || "Take a Virtual Tour of Our Modern Clinic"}
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto px-4 sm:px-0 font-sans"
            >
              {t.gallery?.subtitle || "Experience our state-of-the-art facilities and comfortable environment designed for your care and comfort."}
            </motion.p>
            
            {/* Category Filter */}
            <div className="flex flex-wrap justify-center gap-3 mt-8">
              {categoryList.map((category, index) => {
                const Icon = getCategoryIcon(category.id);
                return (
                  <motion.button
                    key={category.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`
                      inline-flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 font-sans
                      ${selectedCategory === category.id
                        ? 'bg-[#2B5C4B] text-white shadow-lg shadow-[#2B5C4B]/10'
                        : 'bg-white text-gray-600 hover:bg-[#2B5C4B]/5 border border-gray-200'
                      }
                    `}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="font-medium">{category.label}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredImages.map((image, index) => (
              <motion.div
                key={image.url}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group relative bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl hover:border-[#2B5C4B]/20 transition-all duration-500"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={image.url}
                    alt={image.title[language]}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    loading="lazy"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}