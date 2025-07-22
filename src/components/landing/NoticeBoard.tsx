import { motion } from 'framer-motion';
import { Notice } from '../../types';
import { Bell } from 'lucide-react';
import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { useTranslation } from '../../i18n/useTranslation';
import { formatMarkdown } from '../../utils/markdown';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

interface NoticeBoardProps {
  notices: Notice[];
  loading: boolean;
  t?: {
    badge?: string;
    title?: string;
    subtitle?: string;
    noAnnouncements?: string;
  };
}

export function NoticeBoard({ notices, loading, t }: NoticeBoardProps) {
  const { language, t: globalT } = useTranslation();
  const translations = t || globalT.noticeBoard || {};
  const [, setActiveIndex] = useState(0);

  const getLocalizedContent = (content: string | { en: string; gu: string }) => {
    if (typeof content === 'string') return content;
    return content[language] || content.en;
  };

  return (
    <div className="py-20 bg-gradient-to-b from-[#2B5C4B]/5 to-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#2B5C4B]/5 text-[#2B5C4B] text-xs font-medium mb-3 sm:mb-4 backdrop-blur-sm"
          >
            <Bell className="w-3.5 h-3.5" />
            {translations.badge || "Latest Updates"}
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-2xl md:text-4xl font-heading text-[#1e3a5c] mb-3 md:mb-4"
          >
            {translations.title || "Important Announcements"}
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-600 text-sm md:text-base max-w-2xl mx-auto font-sans"
          >
            {translations.subtitle || "Stay informed about clinic updates, special services, and important notices"}
          </motion.p>
        </div>

        <div className="max-w-4xl mx-auto">
          {notices.length === 0 && !loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 bg-[#2B5C4B]/5 rounded-2xl backdrop-blur-sm"
            >
              <Bell className="h-8 w-8 text-[#2B5C4B] mx-auto mb-3" />
              <p className="text-gray-600 font-sans">{translations.noAnnouncements || "No announcements at the moment."}</p>
            </motion.div>
          ) : (
            <Swiper
              modules={[Autoplay, Pagination]}
              spaceBetween={32}
              slidesPerView={1}
              loop={true}
              autoplay={{
                delay: 5000,
                disableOnInteraction: false,
              }}
              pagination={{
                clickable: true,
                bulletActiveClass: 'bg-[#2B5C4B] w-4',
                bulletClass: 'w-2 h-2 rounded-full bg-gray-300 hover:bg-gray-400 transition-all duration-300 mx-1 cursor-pointer'
              }}
              onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
              className="pb-12"
            >
              {notices.map((notice, index) => (
                <SwiperSlide key={notice.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="px-4"
                  >
                    <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-[#2B5C4B]/10 hover:shadow-xl transition-all duration-300">
                      {notice.images && notice.images.length > 0 && (
                        <div className="relative w-full aspect-[2/1] overflow-hidden">
                          <img
                            src={notice.images[0]}
                            alt={getLocalizedContent(notice.title)}
                            className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                        </div>
                      )}
                      
                      <div className="p-4 md:p-8">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2 md:mb-3 group-hover:text-[#2B5C4B] transition-colors font-heading">
                          {getLocalizedContent(notice.title)}
                        </h3>

                        {notice.content && (
                          <div 
                            className="prose prose-sm md:prose-base prose-green prose-p:my-1 md:prose-p:my-2 max-w-none"
                            dangerouslySetInnerHTML={{ 
                              __html: formatMarkdown(getLocalizedContent(notice.content)) 
                            }}
                          />
                        )}
                      </div>
                    </div>
                  </motion.div>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
      </div>
    </div>
  );
}