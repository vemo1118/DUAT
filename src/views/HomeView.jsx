import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HeroSlider } from '../components/HeroSlider';
import { PreorderWelcome } from '../components/PreorderWelcome';
import { PreorderHero } from '../components/PreorderHero';
import { TrustNumbersBar } from '../components/TrustNumbersBar';
import { ProductRow } from '../components/ProductRow';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useProducts } from '../context/ProductsContext';
import { useCategoryBanners } from '../context/CategoryBannersContext';
import { ChevronDown, ChevronUp, Sparkles, ArrowRight, ArrowLeft, Palette, ShoppingBag, BadgeCheck } from 'lucide-react';

export const HomeView = () => {
  const { products } = useProducts();
  const { forgeBanner } = useCategoryBanners();
  const { lang, t } = useLanguage();
  const { theme } = useTheme();
  const isDawn = theme === 'dawn';

  const isAr = lang === 'ar';
  const isRtl = isAr;
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;
  const navigate = useNavigate();
  const [openFaqId, setOpenFaqId] = useState(null);

  const forge = forgeBanner || {};
  const isForgeActive = forge.isActive !== false;

  const filteredProducts = Array.isArray(products)
    ? products.filter((p) => p && p.is_active !== false && p.isActive !== false)
    : [];
  const activeProducts = filteredProducts.length > 0 ? filteredProducts : (Array.isArray(products) ? products : []);
  const stickersOnly = activeProducts.filter((p) => p?.category === 'stickers');
  const latestDrops = stickersOnly.length > 0 ? stickersOnly.slice(0, 6) : activeProducts.slice(0, 6);
  const preorderFaqs = [
    {
      id: 'custom-minimum',
      questionAr: 'لازم الأربع قطع يكونوا نفس التصميم؟',
      questionEn: 'Do all four pieces need the same design?',
      answerAr: 'لأ. تقدر تعمل كل قطعة بتصميم مختلف، أو تكرر أي تصميم بالعدد اللي يناسبك.',
      answerEn: 'No. Every piece can have a different design, or you can repeat any design as many times as you want.'
    },
    {
      id: 'custom-price',
      questionAr: 'سعر الحجز بيتحسب إزاي؟',
      questionEn: 'How is the pre-order price calculated?',
      answerAr: 'القطعة الكستمايز بـ45 جنيه، وأقل طلب كستمايز 4 قطع؛ يعني البداية من 180 جنيه قبل الشحن.',
      answerEn: 'Each custom piece is EGP 45, with a four-piece minimum. That means custom orders start at EGP 180 before shipping.'
    },
    {
      id: 'stock-price',
      questionAr: 'طب والاستيكرات الجاهزة؟',
      questionEn: 'What about ready-made stickers?',
      answerAr: 'الاستيكر الجاهز بـ60 جنيه. لو اخترت 4 قطع جاهزة أو أكتر، سعر القطعة الجاهزة يبقى 50 جنيه.',
      answerEn: 'A ready-made sticker is EGP 60. Choose four or more ready-made pieces and each ready-made sticker becomes EGP 50.'
    },
    {
      id: 'production',
      questionAr: 'إمتى يبدأ تنفيذ الطلبات؟',
      questionEn: 'When does production begin?',
      answerAr: 'الحجز مفتوح 7 أيام. بعد قفل الحجز، من 3 إلى 5 أيام للتصنيع والشحن.',
      answerEn: 'Booking stays open for 7 days, followed by 3–5 days for production and shipping.'
    }
  ];

  return (
    <div className="space-y-20 sm:space-y-32 pb-24 overflow-hidden">
      
      {/* 1. PRE-ORDER OFFER — fixed here so cloud hero content cannot dilute the launch */}
      <PreorderWelcome />
      <HeroSlider />
      <PreorderHero />

      {/* 2. TRUST NUMBERS BAR — SOFTENED THEME-AWARE GRADIENT BAND 1 */}
      <div className={`w-full ${isDawn ? 'bg-gradient-to-b from-[#FAF6F0] via-[#E8DFCE] to-[#FAF6F0]' : 'bg-gradient-to-b from-[#0A0C16] via-[#161C38] to-[#0A0C16]'} border-y border-grave py-16 sm:py-24 shadow-inner`}>
        <TrustNumbersBar />
      </div>

      {/* 3. READY-MADE STICKERS — secondary to the custom offer */}
      <div className="py-4">
        <ProductRow
          eyebrow="DUAT / 01"
          title={isAr ? 'أحدث استيكرات البارز' : 'LATEST STICKERS'}
          products={latestDrops}
          viewAllPath="/stickers"
        />
      </div>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <button
            onClick={() => navigate('/sticker-builder')}
            className="group border border-gold/50 bg-gold/10 p-7 text-start transition-colors hover:bg-gold/15 sm:p-9"
          >
            <Palette className="mb-5 text-gold" size={28} />
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-gold">{isAr ? 'الاختيار الأساسي' : 'MAIN OFFER'}</span>
            <h2 className="mt-2 font-clash text-3xl font-bold text-bone sm:text-4xl">{isAr ? 'كستمايز — 45 ج للقطعة' : 'CUSTOM — EGP 45 EACH'}</h2>
            <p className="mt-3 max-w-lg font-space text-sm leading-relaxed text-bone/75">{isAr ? 'ابدأ من 4 قطع بـ180 جنيه. صمّم كل واحدة لوحدها أو كرر نفس التصميم.' : 'Start with four pieces for EGP 180. Design each one separately or repeat the same design.'}</p>
          </button>
          <button
            onClick={() => navigate('/stickers')}
            className="group border border-grave bg-stone p-7 text-start transition-colors hover:border-gold/60 sm:p-9"
          >
            <ShoppingBag className="mb-5 text-gold" size={28} />
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-ash">{isAr ? 'جاهز من الكتالوج' : 'READY-MADE CATALOGUE'}</span>
            <h2 className="mt-2 font-clash text-3xl font-bold text-bone sm:text-4xl">{isAr ? '60 ج — أو 50 من 4 قطع' : 'EGP 60 — OR 50 FROM 4'}</h2>
            <p className="mt-3 max-w-lg font-space text-sm leading-relaxed text-bone/75">{isAr ? 'اختار أي 4 استيكرات جاهزة أو أكتر، وسعر كل قطعة جاهزة يتحول تلقائيًا لـ50 جنيه.' : 'Choose any four or more ready-made stickers and each ready-made piece automatically becomes EGP 50.'}</p>
          </button>
        </div>
      </section>

      {/* 5. STICKER BUILDER FEATURE BAND */}
      {isForgeActive && (
        <div className={`w-full ${isDawn ? 'bg-gradient-to-b from-[#FAF6F0] via-[#E5DFC5] to-[#FAF6F0]' : 'bg-gradient-to-b from-[#0A0C16] via-[#1A2042] to-[#0A0C16]'} border-y border-gold/40 py-20 sm:py-28 shadow-2xl relative overflow-hidden`}>
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative reveal-fade-up">
            <div className="bg-stone border border-grave p-8 sm:p-14 relative overflow-hidden card-depth-highlight grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              <div className="lg:col-span-7 space-y-6 relative z-10">
                <span className="font-mono text-xs uppercase tracking-[0.25em] text-gold font-bold block">
                  {isAr ? '3 خطوات بسيطة' : '3 SIMPLE STEPS'}
                </span>
                <h2 className="font-clash text-3xl sm:text-5xl uppercase text-bone font-bold">
                  {isAr ? 'فكرتك. معاينتك. طلبك.' : 'YOUR IDEA. YOUR PREVIEW. YOUR ORDER.'}
                </h2>
                <p className="font-space text-base text-bone/90 font-medium leading-relaxed max-w-xl">
                  {isAr
                    ? 'اكتب كلامك أو ارفع صورتك، شوف المعاينة، وبعدها أضف التصميم للسلة. كررها لحد ما تكمل 4 قطع أو أكتر.'
                    : 'Add your text or upload an image, review the preview, then add it to your cart. Repeat until you have four custom pieces or more.'}
                </p>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {[Palette, BadgeCheck, ShoppingBag].map((Icon, index) => (
                    <div key={index} className="border border-grave bg-coal p-4 font-mono text-xs text-bone">
                      <Icon size={18} className="mb-2 text-gold" />
                      {isAr ? ['صمّم', 'راجع', 'كمّل 4+'][index] : ['DESIGN', 'PREVIEW', 'BUILD 4+'][index]}
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => navigate('/sticker-builder')}
                  className="btn-primary py-4 px-8 text-xs font-mono font-bold tracking-widest flex items-center gap-3 min-h-[48px]"
                >
                  <Sparkles size={16} />
                  <span>{isAr ? 'افتح بيلدر الاستيكرز' : 'OPEN STICKER BUILDER'}</span>
                  <ArrowIcon size={16} />
                </button>
              </div>

              <div className="lg:col-span-5 relative z-10 flex items-center justify-center">
                <img
                  src={forge.imageUrl || "https://res.cloudinary.com/ikim5u08/image/upload/f_auto,q_auto/v1786036786/born_at_dawn_k5gb1v.png"}
                  alt="Sticker Builder Preview"
                  className="w-full max-w-xs object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500 rounded-xl"
                />
              </div>

            </div>
          </section>
        </div>
      )}

      {/* 6. PRE-ORDER FAQ */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 reveal-fade-up">
        <div className="text-center space-y-2 border-b border-grave pb-6">
          <span className="font-mono text-xs text-gold font-bold uppercase tracking-[0.25em] block">
            {t('faqEyebrow')}
          </span>
          <h2 className="font-clash text-3xl sm:text-4xl text-bone font-bold uppercase">
            {t('faqTitle')}
          </h2>
        </div>

        <div className="space-y-4">
          {preorderFaqs.map((faq) => {
            const isOpen = openFaqId === faq.id;
            return (
              <div
                key={faq.id}
                className="bg-stone border border-grave transition-all duration-300 card-depth-highlight"
              >
                <button
                  onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                  className="w-full p-6 text-left rtl:text-right flex items-center justify-between gap-4 font-space font-bold text-base text-bone hover:text-gold transition-colors min-h-[44px]"
                >
                  <span>{isAr ? faq.questionAr : faq.questionEn}</span>
                  {isOpen ? <ChevronUp size={20} className="text-gold" /> : <ChevronDown size={20} className="text-ash" />}
                </button>
                {isOpen && (
                  <div className="px-6 pb-6 pt-2 font-space text-sm text-bone/90 font-medium border-t border-grave/40 leading-relaxed animate-in fade-in duration-200">
                    {isAr ? faq.answerAr : faq.answerEn}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
};

export default HomeView;
