import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';

interface StatsSectionProps {
  t?: {
    badge?: string;
    title?: string;
    subtitle?: string;
    yearsExperience?: string;
    happyPatients?: string;
    treatments?: string;
    successRate?: string;
    experienceDesc?: string;
    patientsDesc?: string;
    treatmentsDesc?: string;
    successDesc?: string;
  };
}

export function StatsSection({ t }: StatsSectionProps) {
  return (
    <section className="py-24 bg-gradient-to-b from-white to-gray-50/50 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#2B5C4B]/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#2B5C4B]/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#2B5C4B]/5 text-[#2B5C4B] text-xs font-medium mb-3 sm:mb-4 backdrop-blur-sm"
          >
            <Shield className="w-3.5 h-3.5" />
            {t?.badge || "Our Impact"}
          </motion.span>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-2xl md:text-4xl font-heading text-[#1e3a5c] mb-3 md:mb-4"
          >
            {t?.title || "Making a difference in dermatological care"}
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-600 text-sm md:text-base max-w-2xl mx-auto font-sans"
          >
            {t?.subtitle || "Our commitment to excellence reflects in our numbers and the trust our patients place in us"}
          </motion.p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {[
            { 
              value: '14+', 
              label: t?.yearsExperience || "Years Experience",
              gradient: 'from-blue-600 to-blue-400',
              description: t?.experienceDesc || "Trusted expertise in dermatology",
              delay: 0
            },
            { 
              value: '15k+', 
              label: t?.happyPatients || "Happy Patients",
              gradient: 'from-emerald-600 to-emerald-400',
              description: t?.patientsDesc || "Satisfied with our care",
              delay: 0.1
            },
            { 
              value: '50+', 
              label: t?.treatments || "Treatments",
              gradient: 'from-violet-600 to-violet-400',
              description: t?.treatmentsDesc || "Advanced procedures available",
              delay: 0.2
            },
            { 
              value: '99%', 
              label: t?.successRate || "Success Rate",
              gradient: 'from-amber-600 to-amber-400',
              description: t?.successDesc || "Proven treatment outcomes",
              delay: 0.3
            }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: stat.delay }}
              className="group"
            >
              <div className="relative p-6 md:p-8 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
                
                {/* Content */}
                <div className="relative">
                  <div className={`text-3xl sm:text-4xl lg:text-5xl font-bold mb-2 bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent font-heading`}>
                    {stat.value}
                  </div>
                  <div className="text-gray-900 font-medium text-sm sm:text-base mb-2 font-heading">
                    {stat.label}
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed font-sans">
                    {stat.description}
                  </p>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 -mt-2 -mr-2 w-24 h-24 bg-gradient-to-br from-gray-50 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-50 transition-opacity duration-500" />
                <div className="absolute bottom-0 left-0 -mb-2 -ml-2 w-24 h-24 bg-gradient-to-tr from-gray-50 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-50 transition-opacity duration-500" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}