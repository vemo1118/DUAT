import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Sparkles, Truck, ShieldCheck, Clock } from 'lucide-react';

export const AnnouncementMarquee = () => {
  const { lang } = useLanguage();
  const isAr = lang === 'ar';

  const textEn = "Free shipping on orders over 800 EGP • Made to order in Egypt • Ships in 3–5 days • 100% Handcrafted • 14-Day Returns • ";
  const textAr = "شحن مجاني للطلبات أكثر من ٨٠٠ ج.م • صُنع حسب الطلب في مصر • يُشحن خلال ٣-٥ أيام • تشطيب يدوي ٪١٠٠ • إرجاع خلال ١٤ يوماً • ";

  const content = isAr ? textAr : textEn;

  return (
    <div className="w-full bg-coal border-b border-grave text-gold overflow-hidden py-2 font-mono text-[11px] uppercase tracking-widest relative z-50 select-none">
      <div className="flex w-max animate-marquee">
        <span className="px-4">{content}</span>
        <span className="px-4">{content}</span>
        <span className="px-4">{content}</span>
        <span className="px-4">{content}</span>
      </div>
    </div>
  );
};

export default AnnouncementMarquee;
