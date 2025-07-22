import { motion } from 'framer-motion';
import { Users, Stethoscope, Shield, Leaf } from 'lucide-react';

interface BenefitsProps {
  t?: {
    badge?: string;
    title?: string;
    subtitle?: string;
    benefits?: {
      title: string;
      description: string;
    }[];
  };
}

export function Benefits({ t }: BenefitsProps) {
  const defaultBenefits = [
    {
      title: "Expert Dermatologist",
      description: "Our team consists board-certified dermatologists with experience",
      icon: Users,
      align: 'right'
    },
    {
      title: "Advanced Technology",
      description: "We use cutting-edge equipment and innovative techniques",
      icon: Stethoscope,
      align: 'right'
    },
    {
      title: "Personalized Care",
      description: "Every treatment plan is tailored to your unique skin type, concerns",
      icon: Leaf,
      align: 'right'
    }
  ];

  const defaultRightBenefits = [
    {
      title: "Comprehensive Services",
      description: "From medical dermatology cosmetic enhancements, we offer a treatment",
      icon: Shield,
      align: 'left'
    },
    {
      title: "High Safety Standards",
      description: "Your safety is our priority. We adhere to strict hygiene protocols",
      icon: Shield,
      align: 'left'
    },
    {
      title: "Comfortable Environment",
      description: "Our clinic provides a welcoming and stress-free atmosphere",
      icon: Users,
      align: 'left'
    }
  ];

  // Map translations to benefits if available
  const allDefaultBenefits = [...defaultBenefits, ...defaultRightBenefits];
  
  const mappedBenefits = t?.benefits ? 
    allDefaultBenefits.map((benefit, index) => ({
      ...benefit,
      title: t.benefits && index < t.benefits.length ? t.benefits[index].title : benefit.title,
      description: t.benefits && index < t.benefits.length ? t.benefits[index].description : benefit.description
    })) 
    : allDefaultBenefits;
    
  const benefits = mappedBenefits.slice(0, 3);
  const rightBenefits = mappedBenefits.slice(3);

  return (
    <section className="min-h-screen bg-[#2B5C4B] relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-24 sm:w-48 h-24 sm:h-48 opacity-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="w-full h-full border-[20px] md:border-[40px] border-white/20 rounded-full"
        />
      </div>
      <div className="absolute bottom-0 right-0 w-32 sm:w-64 h-32 sm:h-64 opacity-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="w-full h-full border-[30px] md:border-[60px] border-white/20 rounded-full"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-20">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-white text-xs font-medium mb-3 backdrop-blur-sm"
          >
            <Shield className="w-3.5 h-3.5" />
            {t?.badge || "Our Benefits"}
          </motion.span>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-2xl md:text-4xl font-heading text-white mb-3 md:mb-4"
          >
            {t?.subtitle || "Experience personalized care, advanced treatments, and visible results with our expert dermatology services."}
          </motion.h2>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Benefits */}
          <div className="lg:col-span-4 space-y-6 sm:space-y-8 order-2 lg:order-1">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex flex-row-reverse lg:flex-row gap-4 items-start text-left lg:text-right"
              >
                <div className="flex-grow">
                  <h3 className="text-lg sm:text-xl font-heading text-white mb-1 sm:mb-2">{benefit.title}</h3>
                  <p className="text-white/70 text-xs sm:text-sm font-sans">{benefit.description}</p>
                </div>
                <div className="bg-white/10 p-2 sm:p-3 rounded-lg backdrop-blur-sm shrink-0">
                  <benefit.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Center Image */}
          <div className="lg:col-span-4 relative order-1 lg:order-2 px-8 sm:px-12 md:px-0">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative aspect-[3/4] rounded-[100px] sm:rounded-[150px] overflow-hidden border-4 sm:border-8 border-white/10"
            >
              <img
                src="/our-benefits-img.png"
                alt="Dermatology Benefits"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2B5C4B]/15 to-transparent"></div>
            </motion.div>
          </div>

          {/* Right Benefits */}
          <div className="lg:col-span-4 space-y-6 sm:space-y-8 order-3">
            {rightBenefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex gap-4 items-start"
              >
                <div className="bg-white/10 p-2 sm:p-3 rounded-lg backdrop-blur-sm shrink-0">
                  <benefit.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-heading text-white mb-1 sm:mb-2">{benefit.title}</h3>
                  <p className="text-white/70 text-xs sm:text-sm font-sans">{benefit.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
