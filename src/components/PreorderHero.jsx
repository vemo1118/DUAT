import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { ArrowLeft, ArrowRight, Check, Layers3, Palette, Sparkles } from 'lucide-react';
import { preorderState } from '../domain/commerce';

export function PreorderHero({ imageUrl }) {
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const isAr = lang === 'ar';
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;
  const campaignState = preorderState();
  const isOpen = campaignState === 'open';
  const isClosed = campaignState === 'closed';

  const features = isAr
    ? ['كل قطعة بتصميم مختلف', 'ابدأ من 4 قطع بس', 'زوّد أي عدد يناسبك']
    : ['A different design on every piece', 'Start with only 4 pieces', 'Add as many as you need'];

  return (
    <section className="relative overflow-hidden border-b border-grave bg-void">
      <div className="absolute inset-0 opacity-35" aria-hidden="true">
        <div className="absolute -top-24 -right-20 h-80 w-80 rounded-full bg-gold/25 blur-3xl" />
        <div className="absolute -bottom-24 left-0 h-96 w-96 rounded-full bg-indigo-800/25 blur-3xl" />
      </div>

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 py-8 sm:px-6 sm:py-12 lg:grid-cols-12 lg:px-8">
        <div className={`space-y-7 lg:col-span-7 ${isAr ? 'text-right' : 'text-left'}`}>
          <div className="inline-flex items-center gap-2 border border-gold/40 bg-gold/10 px-4 py-2 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-gold">
            <Sparkles size={14} />
            <span>{isOpen
              ? (isAr ? 'الحجز مفتوح لمدة 7 أيام' : '7-DAY PRE-ORDER IS OPEN')
              : isClosed
                ? (isAr ? 'حجز الدفعة انتهى' : 'THIS CUSTOM DROP IS CLOSED')
                : (isAr ? 'دفعة الكستمايز الجاية' : 'NEXT CUSTOM DROP')}</span>
          </div>

          <div className="space-y-3">
            <h1 className="font-clash text-4xl text-bone sm:text-6xl lg:text-7xl">
              {isClosed ? (isAr ? 'دفعة الكستمايز خلصت.' : 'THIS CUSTOM DROP IS DONE.') : (isAr ? 'إنت تتخيلها.' : 'YOU IMAGINE IT.')}
            </h1>
            <h2 className="font-clash text-4xl text-gold sm:text-6xl lg:text-7xl">
              {isClosed ? (isAr ? 'الجاهز لسه متاح.' : 'READY-MADE IS STILL HERE.') : (isAr ? 'إحنا نعملهالك.' : 'WE MAKE IT.')}
            </h2>
          </div>

          <p className="max-w-2xl font-space text-base leading-relaxed text-bone/85 sm:text-lg">
            {isAr
              ? 'حوّل كلمة، صورة أو فكرة لاستيكر على مزاجك. صمّم كل قطعة لوحدها أو كرّر التصميم اللي بتحبه.'
              : 'Turn a word, image or idea into a sticker made your way. Create a different design for every piece or repeat your favourite.'}
          </p>

          {isOpen ? <>
            <div className="flex flex-wrap items-end gap-3 border-y border-grave py-5">
              <div>
                <span className="block font-mono text-[10px] uppercase tracking-widest text-ash">
                  {isAr ? 'سعر الحجز للقطعة' : 'PRE-ORDER PRICE / PIECE'}
                </span>
                <span className="font-clash text-6xl font-bold leading-none text-gold">45</span>
                <span className="mx-2 font-mono text-sm text-bone">{isAr ? 'جنيه' : 'EGP'}</span>
              </div>
              <div className="mb-1 border-s border-grave px-4 font-mono text-xs leading-relaxed text-bone/75">
                <span className="block font-bold text-bone">{isAr ? '4 قطع = 180 جنيه' : '4 pieces = EGP 180'}</span>
                <span>{isAr ? 'قبل مصاريف الشحن' : 'before shipping'}</span>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {features.map((feature) => (
                <div key={feature} className="flex items-center gap-2 font-space text-sm text-bone/90">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold">
                    <Check size={14} />
                  </span>
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </> : (
            <div className="border-y border-grave py-5 font-space text-sm leading-relaxed text-bone/80">
              {isClosed
                ? (isAr ? 'سعر الحجز السابق اتقفل مع الدفعة. تقدر تطلب من الاستيكرات الجاهزة دلوقتي.' : 'The previous pre-order price closed with that drop. Ready-made stickers are available now.')
                : (isAr ? 'تفاصيل وسعر الدفعة الجاية هيظهروا هنا وقت فتح الحجز.' : 'The next drop price and details will appear here when booking opens.')}
            </div>
          )}

          <div className="flex flex-col gap-3 pt-2 sm:flex-row">
            <button
              onClick={() => navigate(isOpen ? '/sticker-builder' : '/stickers')}
              className="btn-primary flex min-h-[54px] items-center justify-center gap-3 px-8 py-4 font-mono text-sm font-bold tracking-wider"
            >
              {isOpen ? <Palette size={18} /> : <Layers3 size={18} />}
              <span>{isOpen ? (isAr ? 'ابدأ صمّم قطعك' : 'DESIGN YOUR PIECES') : (isAr ? 'شوف الاستيكرات الجاهزة' : 'SHOP READY-MADE')}</span>
              <ArrowIcon size={17} />
            </button>
            {isOpen && <button
                onClick={() => navigate('/stickers')}
                className="flex min-h-[54px] items-center justify-center gap-2 border border-grave bg-stone px-7 py-4 font-mono text-xs font-bold tracking-wider text-bone transition-colors hover:border-gold hover:text-gold"
              >
                <Layers3 size={17} />
                <span>{isAr ? 'شوف الاستيكرات الجاهزة' : 'SHOP READY-MADE'}</span>
              </button>}
          </div>

          <p className="font-mono text-[11px] leading-relaxed text-ash">
            {isOpen
              ? (isAr ? 'الحجز 7 أيام، وبعد قفله من 3 إلى 5 أيام للتصنيع والشحن.' : 'Book during the 7-day window. Production and shipping take 3–5 days after booking closes.')
              : isClosed
                ? (isAr ? 'تابعنا لموعد دفعة الكستمايز الجاية.' : 'Follow us for the next custom drop.')
                : (isAr ? 'هنعلن وقت فتح الحجز قبل استقبال أي مدفوعات.' : 'We will announce the booking window before accepting payments.')}
          </p>
        </div>

        <div className="relative lg:col-span-5">
          <div className="absolute inset-8 rotate-6 border border-gold/30 bg-gold/5" aria-hidden="true" />
          <div className="relative overflow-hidden border border-grave bg-stone p-6 shadow-2xl sm:p-8">
            <div className="mb-5 flex items-center justify-between border-b border-grave pb-4 font-mono text-[10px] uppercase tracking-widest">
              <span className="text-gold">DUAT / CUSTOM</span>
              <span className="text-ash">01 — 04</span>
            </div>
            <img
              src={imageUrl || 'https://res.cloudinary.com/ikim5u08/image/upload/f_auto,q_auto/v1786036786/born_at_dawn_k5gb1v.png'}
              alt={isAr ? 'معاينة استيكر دوات كستمايز' : 'DUAT custom sticker preview'}
              className="mx-auto aspect-square w-full max-w-sm object-contain drop-shadow-2xl"
            />
            <div className="mt-5 grid grid-cols-4 gap-2" aria-label={isAr ? 'أربع قطع قابلة للتخصيص' : 'Four customizable pieces'}>
              {['01', '02', '03', '04'].map((number) => (
                <div key={number} className="border border-grave bg-coal py-3 text-center font-mono text-xs text-gold">
                  {number}
                </div>
              ))}
            </div>
            <p className="mt-4 text-center font-space text-xs text-bone/70">
              {isAr ? 'كل رقم ممكن يكون تصميم مختلف' : 'Every number can be a different design'}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PreorderHero;
