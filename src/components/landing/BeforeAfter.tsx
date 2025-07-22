import React from 'react';
import ReactCompareImage from 'react-compare-image';
import { Shield } from 'lucide-react';

interface BeforeAfterProps {
  t?: {
    badge?: string;
    title?: string;
    subtitle?: string;
  };
}

const beforeAfterData = [
  {
    id: 1,
    before: "https://demo.awaikenthemes.com/dermal/wp-content/uploads/2025/03/transformation-img-1.jpg",
    after: "https://demo.awaikenthemes.com/dermal/wp-content/uploads/2025/03/transformation-img-2.jpg"
  },
  {
    id: 2,
    before: "https://demo.awaikenthemes.com/dermal/wp-content/uploads/2025/03/transformation-img-3.jpg",
    after: "https://demo.awaikenthemes.com/dermal/wp-content/uploads/2025/03/transformation-img-4.jpg"
  }
];

function BeforeAfterCard({ before, after }: { before: string; after: string }) {
  return (
    <div className="relative transform transition-transform duration-500 hover:scale-[1.02]">
      <div className="relative rounded-[20px] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
        <ReactCompareImage
          leftImage={before}
          rightImage={after}
          handle={
            <div className="w-[2px] h-full bg-white flex items-center justify-center cursor-grab active:cursor-grabbing">
              <div className="w-10 h-10 rounded-full bg-white shadow-[0_8px_32px_rgba(0,0,0,0.2)] flex items-center justify-center border-4 border-white">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 5L15 12L8 19" stroke="#1e3a5c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16 5L9 12L16 19" stroke="#1e3a5c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" transform="rotate(180 12.5 12)"/>
                </svg>
              </div>
            </div>
          }
          handleSize={0}
          sliderPositionPercentage={0.5}
        />
      </div>
    </div>
  );
}

export function BeforeAfter({ t }: BeforeAfterProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-[1200px] mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#2B5C4B]/5 text-[#2B5C4B] text-xs font-medium mb-3 sm:mb-4 backdrop-blur-sm">
            <Shield className="w-3.5 h-3.5" />
            {t?.badge || "Why Choose Us"}
          </span>
          <h1 className="font-heading text-[32px] leading-tight text-[#1e3a5c] sm:text-4xl lg:text-5xl max-w-3xl mx-auto mb-4">
            {t?.title || "Before & after: witness the power of dermatology"}
          </h1>
          <p className="text-gray-600 max-w-xl mx-auto text-base font-sans">
            {t?.subtitle || "See the remarkable transformations for yourself—our 'Before & After' gallery highlights the powerful impact of dermatological treatments."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {beforeAfterData.map((item) => (
            <BeforeAfterCard key={item.id} {...item} />
          ))}
        </div>
      </div>
    </div>
  );
}