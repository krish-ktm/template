import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface HeroSectionProps {
  t: {
    title?: string;
    subtitle?: string;
    viewServices?: string;
    bookAppointment?: string;
    [key: string]: unknown;
  };
}

export function HeroSection({ t }: HeroSectionProps) {
  return (
    <div className="container mx-auto md:px-4 pt-14 md:pt-28 lg:pt-32">
      <div className="md:rounded-[2rem] bg-[#2B5C4B] overflow-hidden relative">
        {/* Decorative Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-0 bottom-0 opacity-10">
            <svg width="200" height="200" viewBox="0 0 100 100">
              <path d="M0,0 Q50,50 100,0 T200,0" stroke="white" strokeWidth="0.5" fill="none" />
            </svg>
          </div>
          <div className="absolute right-0 top-0 opacity-10">
            <svg width="200" height="200" viewBox="0 0 100 100">
              <path d="M0,100 Q50,50 100,100 T200,100" stroke="white" strokeWidth="0.5" fill="none" />
            </svg>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 min-h-[calc(100vh-80px)] md:min-h-[calc(100vh-160px)]">
            {/* Left Content */}
            <div className="pt-12 md:pt-13 lg:pt-0 pb-12 md:pb-16 lg:pb-0 self-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6 md:space-y-8"
              >
                <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-white leading-[1.2] font-heading">
                  {t.title || "Comprehensive care for your skin's health and beauty"}
                </h1>

                <p className="text-base md:text-lg text-white/80 leading-relaxed max-w-xl font-sans">
                  {t.subtitle || "At our clinic, we believe in creating personalized solutions that drive real-world impact. From advanced treatments to cutting-edge care."}
                </p>

                <div className="flex flex-wrap gap-4">
                  <Link
                    to="/services"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 md:px-8 py-3 md:py-4 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all duration-300 text-base font-medium group border border-white/30 backdrop-blur-sm font-sans"
                  >
                    {t.viewServices}
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                  <Link
                    to="/appointment"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 md:px-8 py-3 md:py-4 bg-white text-[#2B5C4B] rounded-xl hover:bg-white/90 transition-all duration-300 text-base font-medium shadow-lg shadow-black/10 font-sans"
                  >
                    {t.bookAppointment}
                  </Link>
                </div>
              </motion.div>
            </div>

            {/* Right Content - Image */}
            <div className="relative flex flex-col justify-end h-full">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="w-full"
              >
                <img
                  src="/hero-img-1.png"
                  alt="Beautiful woman"
                  className="w-full lg:max-w-[120%] relative z-10"
                />
                <div className="absolute top-1/2 right-0 -translate-y-1/2 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}