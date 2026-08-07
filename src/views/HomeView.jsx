import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HeroSlider } from '../components/HeroSlider';
import { TrustNumbersBar } from '../components/TrustNumbersBar';
import { CategoryGrid } from '../components/CategoryGrid';
import { ProductRow } from '../components/ProductRow';
import { SocialStrip } from '../components/SocialStrip';
import { REVIEWS, FAQS } from '../data/products';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useProducts } from '../context/ProductsContext';
import { Star, ChevronDown, ChevronUp, Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';

export const HomeView = ({ setSelectedCategory, onSelectProduct }) => {
  const { products } = useProducts();
  const { lang, t } = useLanguage();
  const { theme } = useTheme();
  const isDawn = theme === 'dawn';

  const isAr = lang === 'ar';
  const isRtl = isAr;
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;
  const navigate = useNavigate();
  const [openFaqId, setOpenFaqId] = useState(null);

  const filteredProducts = Array.isArray(products)
    ? products.filter((p) => p && p.is_active !== false && p.isActive !== false)
    : [];
  const activeProducts = filteredProducts.length > 0 ? filteredProducts : (Array.isArray(products) ? products : []);
  const stickersOnly = activeProducts.filter((p) => p?.category === 'stickers');
  const casesOnly = activeProducts.filter((p) => p?.category === 'cases');

  const latestDrops = stickersOnly.length > 0 ? stickersOnly.slice(0, 6) : activeProducts.slice(0, 6);
  const bestSellers = casesOnly.concat(stickersOnly).slice(0, 8);

  return (
    <div className="space-y-20 sm:space-y-32 pb-24 overflow-hidden">
      
      {/* 1. FULL-BLEED HERO SLIDER */}
      <HeroSlider />

      {/* 2. TRUST NUMBERS BAR — SOFTENED THEME-AWARE GRADIENT BAND 1 */}
      <div className={`w-full ${isDawn ? 'bg-gradient-to-b from-[#FAF6F0] via-[#E8DFCE] to-[#FAF6F0]' : 'bg-gradient-to-b from-[#0A0C16] via-[#161C38] to-[#0A0C16]'} border-y border-grave py-16 sm:py-24 shadow-inner`}>
        <TrustNumbersBar />
      </div>

      {/* 3. CATEGORY TILES BLOCK */}
      <CategoryGrid onSelectCategory={setSelectedCategory} />

      {/* 4. PRODUCT ROW 1 — LATEST DROPS */}
      <div className="py-4">
        <ProductRow
          eyebrow="DUAT / 01"
          title={isAr ? 'أحدث الإصدارات' : 'LATEST DROPS'}
          products={latestDrops}
          viewAllPath="/shop"
        />
      </div>

      {/* 5. THE FORGE FEATURE BAND — SOFTENED THEME-AWARE GRADIENT BAND 2 */}
      <div className={`w-full ${isDawn ? 'bg-gradient-to-b from-[#FAF6F0] via-[#E5DFC5] to-[#FAF6F0]' : 'bg-gradient-to-b from-[#0A0C16] via-[#1A2042] to-[#0A0C16]'} border-y border-gold/40 py-20 sm:py-28 shadow-2xl relative overflow-hidden`}>
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative reveal-fade-up">
          <div className="bg-stone border border-grave p-8 sm:p-14 relative overflow-hidden card-depth-highlight grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7 space-y-6 relative z-10">
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-gold font-bold block">
                {t('forgeEyebrow')}
              </span>
              <h2 className="font-clash text-3xl sm:text-5xl uppercase text-bone font-bold">
                {t('forgeTitle')}
              </h2>
              <p className="font-space text-base text-bone/90 font-medium leading-relaxed max-w-xl">
                {t('forgeDesc')}
              </p>
              <button
                onClick={() => navigate('/customizer')}
                className="btn-primary py-4 px-8 text-xs font-mono font-bold tracking-widest flex items-center gap-3 min-h-[48px]"
              >
                <Sparkles size={16} />
                <span>{t('forgeCta')}</span>
                <ArrowIcon size={16} />
              </button>
            </div>

            <div className="lg:col-span-5 relative z-10 flex items-center justify-center">
              <img
                src="https://res.cloudinary.com/ikim5u08/image/upload/v1785768478/B1_TB_w1zemr.jpg"
                alt="DUAT Clear Case Bundle"
                className="w-full max-w-xs object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500 rounded-xl"
              />
            </div>

          </div>
        </section>
      </div>

      {/* 6. PRODUCT ROW 2 — BEST SELLERS */}
      <div className="py-4">
        <ProductRow
          eyebrow="DUAT / 02"
          title={isAr ? 'قطع مختارة' : 'FEATURED PIECES'}
          products={bestSellers}
          viewAllPath="/shop"
        />
      </div>

      {/* 7. REVIEWS SECTION — HIDE IF EMPTY */}
      {REVIEWS && REVIEWS.length > 0 && (
        <div className={`w-full ${isDawn ? 'bg-gradient-to-b from-[#FAF6F0] via-[#E8DFCE] to-[#FAF6F0]' : 'bg-gradient-to-b from-[#0A0C16] via-[#161C38] to-[#0A0C16]'} border-y border-grave py-20 sm:py-28 shadow-inner`}>
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 reveal-fade-up">
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between border-b border-grave pb-6 gap-4">
              <div>
                <span className="font-mono text-xs text-gold font-bold uppercase tracking-[0.25em] block">
                  {t('reviewsEyebrow')}
                </span>
                <h2 className="font-clash text-3xl sm:text-4xl text-bone font-bold uppercase mt-1">
                  {t('reviewsTitle')}
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {REVIEWS.map((rev) => (
                <div
                  key={rev.id}
                  className="bg-stone border border-grave p-8 space-y-4 card-depth-highlight relative flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex text-gold">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} size={14} className="fill-gold" />
                        ))}
                      </div>
                      <span className="font-mono text-[10px] text-ash uppercase tracking-widest font-bold">
                        VERIFIED BUYER
                      </span>
                    </div>
                    <p className="font-space text-base text-bone/90 font-medium italic leading-relaxed">
                      "{isAr ? rev.textAr : rev.textEn}"
                    </p>
                  </div>

                  <div className="border-t border-grave/60 pt-4 flex justify-between items-center font-mono text-xs">
                    <span className="text-bone font-bold">{rev.author}</span>
                    <span className="text-ash font-medium">{rev.location}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* 8. SOCIAL STRIP */}
      <SocialStrip />

      {/* 9. FAQ ACCORDION SECTION */}
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
          {FAQS.map((faq) => {
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
