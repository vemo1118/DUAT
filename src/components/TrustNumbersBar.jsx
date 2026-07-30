import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export const TrustNumbersBar = () => {
  const { lang } = useLanguage();
  const isAr = lang === 'ar';

  const stats = [
    {
      numberEn: '10K+',
      numberAr: '+١٠ ألف',
      labelEn: 'Orders Delivered',
      labelAr: 'طلب مُسلَّم'
    },
    {
      numberEn: '4.9★',
      numberAr: '٤٫٩★',
      labelEn: 'Average Rating',
      labelAr: 'متوسط التقييم'
    },
    {
      numberEn: '3–5 Days',
      numberAr: '٣-٥ أيام',
      labelEn: 'Made To Order',
      labelAr: 'تصنيع حسب الطلب'
    },
    {
      numberEn: '14 Days',
      numberAr: '١٤ يوماً',
      labelEn: 'Easy Returns',
      labelAr: 'سياسة إرجاع سهلة'
    }
  ];

  return (
    <section className="w-full bg-stone/90 border-y border-grave py-12 sm:py-16 px-4 sm:px-6 lg:px-8 card-depth-highlight">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {stats.map((item, index) => (
          <div key={index} className="space-y-2 group">
            <div className="font-clash text-4xl sm:text-5xl lg:text-6xl text-gold group-hover:scale-105 transition-transform duration-300">
              {isAr ? item.numberAr : item.numberEn}
            </div>
            <div className="font-mono text-xs text-bone/80 tracking-widest uppercase">
              {isAr ? item.labelAr : item.labelEn}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TrustNumbersBar;
