import { motion } from 'framer-motion';
import { Shield, Stethoscope, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface WhyChooseUsProps {
  t?: {
    badge?: string;
    title?: string;
    subtitle?: string;
    features?: {
      title: string;
      description: string;
    }[];
    cta?: string;
  };
}

const MotionLink = motion(Link);

export function WhyChooseUs({ t }: WhyChooseUsProps) {
  const defaultFeatures = [
    {
      icon: Shield,
      title: "Personalized care",
      description: "We believe that every patient is unique. That's why we take the time to understand your specific needs and tailor treatment plans.",
      color: "from-violet-500 to-purple-500",
      bgGlow: "bg-violet-500/20"
    },
    {
      icon: Stethoscope,
      title: "Comprehensive care for all skin needs",
      description: "Whether you're seeking medical dermatology, cosmetic treatments, or preventive care, we offer a comprehensive range of services.",
      color: "from-emerald-500 to-teal-500",
      bgGlow: "bg-emerald-500/20"
    },
    {
      icon: Clock,
      title: "Advanced treatments & technology",
      description: "Our clinic is equipped with the latest technology and our team stays up-to-date with advanced treatment methods.",
      color: "from-blue-500 to-cyan-500",
      bgGlow: "bg-blue-500/20"
    }
  ];

  // Map translations to features if available
  const features = defaultFeatures.map((feature, index) => ({
    ...feature,
    title: t?.features && index < t.features.length ? t.features[index].title : feature.title,
    description: t?.features && index < t.features.length ? t.features[index].description : feature.description
  }));

  return (
    <section className="relative py-12 sm:py-16 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-gray-50/50 to-white pointer-events-none" />
      
      {/* Decorative circles */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-br from-[#2B5C4B]/5 to-transparent rounded-full blur-3xl opacity-60 pointer-events-none" />
      
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-start">
          <div className="space-y-8 sm:space-y-10">
            {/* Header Content */}
            <div className="relative">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#2B5C4B]/5 text-[#2B5C4B] text-xs font-medium mb-3 sm:mb-4 backdrop-blur-sm"
              >
                <Shield className="w-3.5 h-3.5" />
                {t?.badge || "Why Choose Us"}
              </motion.span>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 leading-[1.2] tracking-tight font-heading"
              >
                {t?.title || "Your skin deserves the best - Choose with confidence"}
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-sm sm:text-base text-gray-600 leading-relaxed max-w-xl font-sans"
              >
                {t?.subtitle || "તમારી ત્વચા માટે શ્રેષ્ઠ પસંદગી"}
              </motion.p>
            </div>

            {/* Image - Shows between header and features on mobile */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="relative block lg:hidden"
            >
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-xl shadow-gray-200/50 border border-white/20">
                <img
                  src="/Shubham-Skin-Clinc.png"
                  alt="Shubham Skin Clinic"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent mix-blend-multiply" />
                <div className="absolute inset-0 bg-gradient-to-br from-[#2B5C4B]/20 to-transparent mix-blend-overlay" />
              </div>
              <div className="absolute -bottom-6 -right-6 w-56 h-56 bg-[#2B5C4B]/10 rounded-full blur-2xl -z-10" />
              <div className="absolute -top-6 -left-6 w-56 h-56 bg-[#2B5C4B]/10 rounded-full blur-2xl -z-10" />
            </motion.div>

            {/* Features */}
            <div className="relative space-y-0">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="group"
                >
                  <div className="flex gap-3 sm:gap-4 p-4 -mx-2 rounded-xl hover:bg-white/50 transition-colors duration-300">
                    <div className="relative flex-shrink-0">
                      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-md shadow-gray-200/50 transition-all duration-300 group-hover:shadow-lg group-hover:scale-105`}>
                        <feature.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                      </div>
                      <div className={`absolute -inset-1 ${feature.bgGlow} rounded-xl blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-300`} />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 font-heading">
                        {feature.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-sans">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                  {index < features.length - 1 && (
                    <div className="h-px bg-gradient-to-r from-transparent via-gray-200/75 to-transparent mx-4 my-1" />
                  )}
                </motion.div>
              ))}
            </div>
            
            <MotionLink
              to="/appointment"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="relative w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-br from-[#2B5C4B] to-[#234539] text-white text-sm font-medium rounded-lg shadow-md shadow-[#2B5C4B]/10 hover:shadow-lg hover:shadow-[#2B5C4B]/20 transition-all duration-300 overflow-hidden group font-sans"
            >
              <span className="relative z-10">{t?.cta || "Book an Appointment"}</span>
              <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
              <div className="absolute inset-0 bg-gradient-to-br from-[#234539] to-[#2B5C4B] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </MotionLink>
          </div>

          {/* Desktop Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="relative hidden lg:block lg:sticky lg:top-8"
          >
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-xl shadow-gray-200/50 border border-white/20">
              <img
                src="/Shubham-Skin-Clinc.png"
                alt="Shubham Skin Clinic"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent mix-blend-multiply" />
              <div className="absolute inset-0 bg-gradient-to-br from-[#2B5C4B]/20 to-transparent mix-blend-overlay" />
            </div>
            <div className="absolute -bottom-8 -right-8 w-72 h-72 bg-[#2B5C4B]/10 rounded-full blur-3xl -z-10" />
            <div className="absolute -top-8 -left-8 w-72 h-72 bg-[#2B5C4B]/10 rounded-full blur-3xl -z-10" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}