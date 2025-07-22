import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { background, text, gradients } from '../../theme/colors';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import { useEffect } from 'react';

interface ServicesSectionProps {
  t: {
    title: string;
    subtitle: string;
    viewAll: string;
    categories: {
      medical: string;
      hair: string;
      diagnostic: string;
      skinGlow: string;
      scar: string;
      tattoo: string;
      laser: string;
      surgery: string;
      ear: string;
      [key: string]: string;
    };
    lists: {
      medical: string[];
      hair: string[];
      diagnostic: string[];
      skinGlow: string[];
      scar: string[];
      tattoo: string[];
      laser: string[];
      surgery: string[];
      ear: string[];
      [key: string]: string[];
    };
  };
}

interface Service {
  title: string;
  description: string;
  features: string[];
  image: string;
}

export function ServicesSection({ t }: ServicesSectionProps) {
  const services: Service[] = [
    {
      title: t.categories.medical,
      description: t.lists.medical[0],
      features: t.lists.medical.slice(1),
      image: "/images/Medical Therapy.png"
    },
    {
      title: t.categories.hair,
      description: t.lists.hair[0],
      features: t.lists.hair.slice(1),
      image: "/images/Hair Problems.png"
    },
    {
      title: t.categories.diagnostic,
      description: t.lists.diagnostic[0],
      features: t.lists.diagnostic.slice(1),
      image: "/images/Removal moles.png"
    },
    {
      title: t.categories.skinGlow,
      description: t.lists.skinGlow[0],
      features: t.lists.skinGlow.slice(1),
      image: "/images/Skin Treatment.png"
    },
    {
      title: t.categories.scar,
      description: t.lists.scar[0],
      features: t.lists.scar.slice(1),
      image: "/images/scar theropy.png"
    },
    {
      title: t.categories.tattoo,
      description: t.lists.tattoo[0],
      features: t.lists.tattoo.slice(1),
      image: "/images/Tatoo Removal.png"
    },
    {
      title: t.categories.laser,
      description: t.lists.laser[0],
      features: t.lists.laser.slice(1),
      image: "/images/Laser Hair Removal.png"
    },
    {
      title: t.categories.surgery,
      description: t.lists.surgery[0],
      features: t.lists.surgery.slice(1),
      image: "/images/vitiligo surgery.png"
    },
    {
      title: t.categories.ear,
      description: t.lists.ear[0],
      features: t.lists.ear.slice(1),
      image: "/images/ear-treatment.png"
    }
  ];

  // Override Swiper's default styles
  useEffect(() => {
    // Add custom style to override Swiper's default overflow constraints
    const style = document.createElement('style');
    style.innerHTML = `
      .services-swiper-override.swiper {
        overflow: visible !important;
      }
      .services-swiper-override .swiper-wrapper {
        overflow: visible !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className={`py-16 sm:py-20 bg-gradient-to-b ${background.light} relative w-full overflow-hidden`}>
      <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className={`text-2xl sm:text-4xl font-bold mb-3 sm:mb-4 bg-clip-text text-transparent bg-gradient-to-r ${gradients.text.primary} font-heading`}>
            {t.title}
          </h2>
          <p className={`text-base sm:text-lg ${text.secondary} max-w-2xl mx-auto font-sans`}>
            {t.subtitle}
          </p>
        </div>

        <div className="relative mx-[-1rem] sm:mx-[-2rem] md:mx-[-3rem] lg:mx-[-4rem] xl:mx-[-5rem]">
          <Swiper
            modules={[Autoplay]}
            spaceBetween={16}
            centeredSlides={true}
            loop={true}
            loopAdditionalSlides={9}
            slidesPerView="auto"
            speed={800}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true
            }}
            breakpoints={{
              320: {
                slidesPerView: "auto",
                spaceBetween: 12,
              },
              640: {
                slidesPerView: "auto",
                spaceBetween: 16,
              },
              1024: {
                slidesPerView: "auto",
                spaceBetween: 24,
              },
              1280: {
                slidesPerView: "auto",
                spaceBetween: 32,
              }
            }}
            className="!pb-8 !px-4 sm:!px-6 lg:!px-8 services-swiper-override"
          >
            {[...services, ...services, ...services].map((service, index) => (
              <SwiperSlide 
                key={`${service.title}-${index}`} 
                className="!w-[45vw] sm:!w-[32vw] md:!w-[28vw] lg:!w-[22vw] xl:!w-[18vw] max-w-[320px] flex items-center justify-center"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="w-full"
                >
                  <div className="relative aspect-[2/3] rounded-2xl overflow-hidden group shadow-lg">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1C4532]/95 via-[#1C4532]/50 to-transparent" />
                    
                    {/* Content */}
                    <div className="absolute inset-0 p-3 sm:p-4 md:p-5 lg:p-6 flex flex-col justify-end">
                      <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold text-white mb-1 sm:mb-2 font-heading line-clamp-1">
                        {service.title}
                      </h3>
                    </div>
                  </div>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="text-center mt-8 sm:mt-10">
          <Link
            to="/services"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#2B5C4B] text-white rounded-xl hover:bg-[#234539] transition-all duration-300 shadow-sm hover:shadow font-sans"
          >
            <span className="font-medium">{t.viewAll}</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}