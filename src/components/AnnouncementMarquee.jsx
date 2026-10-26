import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { PREORDER, preorderState } from '../domain/commerce';

export const AnnouncementMarquee = () => {
  const { lang } = useLanguage();
  const isAr = lang === 'ar';

  const state = preorderState();
  const closes = PREORDER.closesAt
    ? new Date(PREORDER.closesAt).toLocaleString(isAr ? 'ar-EG' : 'en-GB', {
        timeZone: 'Africa/Cairo', day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit'
      })
    : '';
  const textEn = state === 'open'
    ? `CUSTOM PRE-ORDER: EGP 45 EACH • MINIMUM 4 • DIFFERENT DESIGNS WELCOME • BOOKING CLOSES ${closes} CAIRO • `
    : state === 'closed'
      ? 'THIS CUSTOM DROP IS CLOSED • READY-MADE STICKERS ARE STILL AVAILABLE • '
      : 'CUSTOM DROP IS BEING PREPARED • READY-MADE STICKERS ARE AVAILABLE • ';
  const textAr = state === 'open'
    ? `الحجز المسبق: ٤٥ ج للقطعة • أقل عدد ٤ • كل قطعة ممكن تكون بتصميم مختلف • الحجز يقفل ${closes} بتوقيت القاهرة • `
    : state === 'closed'
      ? 'حجز دفعة الكستمايز انتهى • الاستيكرات الجاهزة لسه متاحة • '
      : 'بنجهز فتح دفعة الكستمايز • الاستيكرات الجاهزة متاحة • ';

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
