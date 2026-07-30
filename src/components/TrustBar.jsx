import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Sparkles, RotateCcw, CheckCircle2, ShieldCheck } from 'lucide-react';

export const TrustBar = () => {
  const { lang } = useLanguage();
  const isAr = lang === 'ar';

  const signals = [
    {
      icon: Sparkles,
      titleEn: 'Made to order in Egypt',
      titleAr: 'صُنع حسب الطلب في مصر'
    },
    {
      icon: RotateCcw,
      titleEn: '14-Day Hassle-Free Returns',
      titleAr: 'إرجاع خلال ١٤ يوماً'
    },
    {
      icon: CheckCircle2,
      titleEn: '1,000+ Orders Delivered',
      titleAr: '+١,٠٠٠ طلب مُسلَّم'
    },
    {
      icon: ShieldCheck,
      titleEn: '100% Secure Checkout',
      titleAr: 'دفع آمن بالكامل'
    }
  ];

  return (
    <section className="w-full bg-stone/80 border-y border-grave py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 items-center">
        {signals.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className="flex items-center justify-center gap-3 text-center sm:text-left rtl:sm:text-right group"
            >
              <div className="w-8 h-8 rounded-full bg-void border border-grave flex items-center justify-center text-gold group-hover:border-gold transition-colors flex-shrink-0">
                <Icon size={15} />
              </div>
              <span className="font-mono text-xs text-bone/90 tracking-wider uppercase leading-snug">
                {isAr ? item.titleAr : item.titleEn}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default TrustBar;
