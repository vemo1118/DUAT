import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Palette, Layers3, Plus, CalendarDays } from 'lucide-react';

export const TrustNumbersBar = () => {
  const { lang } = useLanguage();
  const isAr = lang === 'ar';

  const signals = [
    {
      icon: Palette,
      labelEn: 'EGP 45 EACH',
      labelAr: '٤٥ ج للقطعة'
    },
    {
      icon: Layers3,
      labelEn: 'MINIMUM 4',
      labelAr: 'أقل عدد ٤'
    },
    {
      icon: Plus,
      labelEn: 'MIX YOUR DESIGNS',
      labelAr: 'كل قطعة بتصميم'
    },
    {
      icon: CalendarDays,
      labelEn: '7-DAY BOOKING',
      labelAr: 'الحجز لمدة ٧ أيام'
    }
  ];

  return (
    <section className="w-full bg-stone/90 border-y border-grave py-10 sm:py-14 px-4 sm:px-6 lg:px-8 card-depth-highlight">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {signals.map((item, index) => {
          const Icon = item.icon;
          return (
            <div key={index} className="flex flex-col items-center justify-center space-y-3 group">
              <div className="p-3 border border-gold/30 bg-gold/10 text-gold rounded-full group-hover:scale-110 transition-transform duration-300">
                <Icon size={22} />
              </div>
              <div className="font-mono text-xs sm:text-sm text-bone font-bold tracking-widest uppercase">
                {isAr ? item.labelAr : item.labelEn}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default TrustNumbersBar;
