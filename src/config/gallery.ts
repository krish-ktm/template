export interface GalleryImage {
    url: string;
    title: {
      en: string;
      gu: string;
    };
    description: {
      en: string;
      gu: string;
    };
    category: 'office' | 'interior' | 'exterior';
  }
  
  export const galleryImages: GalleryImage[] = [
    {
      url: '/gallery/doctor-office.JPG',
      title: {
        en: "Doctor's Office",
        gu: "ડૉક્ટરનું કાર્યાલય"
      },
      description: {
        en: "Dr. Jemish A. Patel's consultation room equipped with modern amenities",
        gu: "ડૉ. જેમિશ એ. પટેલનો આધુનિક સુવિધાઓથી સજ્જ કન્સલ્ટેશન રૂમ"
      },
      category: 'office'
    },
    {
      url: '/gallery/waiting-area.JPG',
      title: {
        en: "Patient Waiting Area",
        gu: "દર્દીઓનો વેઇટિંગ એરિયા"
      },
      description: {
        en: "Comfortable waiting area with modern design and informative displays",
        gu: "આરામદાયક વેઇટિંગ એરિયા આધુનિક ડિઝાઇન અને માહિતીપ્રદ ડિસ્પ્લે સાથે"
      },
      category: 'interior'
    },
    {
      url: '/gallery/reception.JPG',
      title: {
        en: "Reception Area",
        gu: "રિસેપ્શન એરિયા"
      },
      description: {
        en: "Modern reception desk with a welcoming atmosphere",
        gu: "આધુનિક રિસેપ્શન ડેસ્ક સ્વાગતપૂર્ણ વાતાવરણ સાથે"
      },
      category: 'interior'
    },
    {
      url: '/gallery/building.jpeg',
      title: {
        en: "Clinic Building",
        gu: "ક્લિનિક બિલ્ડિંગ"
      },
      description: {
        en: "Shubham Skin & Laser Clinic building exterior",
        gu: "શુભમ સ્કિન એન્ડ લેસર ક્લિનિક બિલ્ડિંગનો બાહ્ય દેખાવ"
      },
      category: 'exterior'
    },
    {
      url: '/gallery/interior-1.JPG',
      title: {
        en: "Interior View",
        gu: "આંતરિક દૃશ્ય"
      },
      description: {
        en: "Modern clinic interior with aesthetic design",
        gu: "આધુનિક ક્લિનિક ઇન્ટીરિયર સુંદર ડિઝાઇન સાથે"
      },
      category: 'interior'
    },
    {
      url: '/gallery/interior-2.JPG',
      title: {
        en: "Treatment Area",
        gu: "ટ્રીટમેન્ટ એરિયા"
      },
      description: {
        en: "Well-equipped treatment area with modern facilities",
        gu: "આધુનિક સુવિધાઓ સાથે સુસજ્જ ટ્રીટમેન્ટ એરિયા"
      },
      category: 'interior'
    }
  ];
  
  export const categories = {
    en: [
      { id: 'all', label: 'All Photos', count: galleryImages.length },
      { id: 'office', label: "Doctor's Office", count: galleryImages.filter(img => img.category === 'office').length },
      { id: 'interior', label: 'Interior Views', count: galleryImages.filter(img => img.category === 'interior').length },
      { id: 'exterior', label: 'Exterior View', count: galleryImages.filter(img => img.category === 'exterior').length }
    ],
    gu: [
      { id: 'all', label: 'બધા ફોટા', count: galleryImages.length },
      { id: 'office', label: "ડૉક્ટરનું કાર્યાલય", count: galleryImages.filter(img => img.category === 'office').length },
      { id: 'interior', label: 'આંતરિક દૃશ્યો', count: galleryImages.filter(img => img.category === 'interior').length },
      { id: 'exterior', label: 'બાહ્ય દૃશ્ય', count: galleryImages.filter(img => img.category === 'exterior').length }
    ]
  };
  