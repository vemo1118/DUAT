import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SunDisc } from '../components/SunDisc';
import { ProductCard } from '../components/ProductCard';
import { PRODUCTS, CATEGORIES, REVIEWS, FAQS } from '../data/products';
import { useLanguage } from '../context/LanguageContext';
import { ArrowRight, ArrowLeft, Star, ChevronDown, ChevronUp, Sparkles, ShieldCheck, Truck, Clock, Smartphone, Layers, Disc, Bookmark } from 'lucide-react';

export const HomeView = ({ setSelectedCategory, onSelectProduct }) => {
  const { lang, t } = useLanguage();
  const isRtl = lang === 'ar';
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;
  const navigate = useNavigate();

  const [openFaqId, setOpenFaqId] = useState('faq-1');

  const handleCategoryClick = (catId) => {
    setSelectedCategory(catId);
    navigate('/shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const featuredProducts = PRODUCTS.slice(0, 4);

  const renderCategoryIcon = (catId) => {
    switch (catId) {
      case 'cases':
        return <Smartphone size={24} className="text-ash group-hover:text-gold transition-colors" />;
      case 'stickers':
        return <Layers size={24} className="text-ash group-hover:text-gold transition-colors" />;
      case 'charms':
        return <Disc size={24} className="text-ash group-hover:text-gold transition-colors" />;
      case 'accessories':
      default:
        return <Bookmark size={24} className="text-ash group-hover:text-gold transition-colors" />;
    }
  };

  return (
    <div className="space-y-20 sm:space-y-28 pb-20">
      
      {/* HERO SECTION — FRAMELESS EDGE-BLENDED HERO IMAGE */}
      <section className="relative min-h-[calc(100vh-80px)] flex items-center bg-transparent overflow-hidden pt-8 pb-16 sm:py-20 border-b border-grave">
        
        {/* Soft ~8% Gold Glow Behind Hero Text Area */}
        <div className="absolute top-1/4 left-10 w-[480px] h-[480px] bg-gold/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            {/* Left Column: Display Headings & CTAs */}
            <div className="lg:col-span-7 space-y-6 sm:space-y-8">
              
              <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-ash">
                <SunDisc size={12} variant="gold" />
                <span>{t('heroEyebrow')}</span>
              </div>

              <h1 className="font-clash text-4xl sm:text-6xl lg:text-[90px] uppercase text-bone leading-display">
                THROUGH THE NIGHT <br />
                <span className="text-gold">BORN AT DAWN.</span>
              </h1>

              <p className="font-space text-base sm:text-xl text-bone/80 max-w-xl font-light leading-relaxed">
                {t('heroSub')}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-2 sm:pt-4">
                <button
                  onClick={() => navigate('/customizer')}
                  className="btn-primary group text-sm py-4 px-8 flex items-center justify-center gap-3 shadow-lg"
                >
                  <Sparkles size={18} />
                  <span>{t('heroCtaPrimary')}</span>
                  <ArrowIcon size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
                
                <button
                  onClick={() => navigate('/shop')}
                  className="btn-ghost text-sm py-4 px-8 flex items-center justify-center gap-3"
                >
                  <span>{t('heroCtaSecondary')}</span>
                </button>
              </div>

              <div className="pt-6 border-t border-grave grid grid-cols-3 gap-2 sm:gap-4 font-mono text-[10px] sm:text-xs text-ash uppercase">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <ShieldCheck size={16} className="text-gold flex-shrink-0" />
                  <span>1-Year Warranty</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <Truck size={16} className="text-gold flex-shrink-0" />
                  <span>Fast Delivery</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <Clock size={16} className="text-gold flex-shrink-0" />
                  <span>Made To Order</span>
                </div>
              </div>

            </div>

            {/* Right Column: Frameless & Edge-Faded Hero Image (Round 7 Fix) */}
            <div className="lg:col-span-5 flex flex-col items-center pt-6 lg:pt-0">
              <div className="relative w-full max-w-xs sm:max-w-md flex flex-col items-center">
                
                {/* Subtle Gold Warmth Glow Behind Image Center */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] h-[320px] bg-gold/10 rounded-full blur-[80px] pointer-events-none" />

                {/* Frameless Hero Image with CSS/WebKit Mask Edge Blend */}
                <div className="hero-image-blend w-full aspect-[3/4] relative flex items-center justify-center">
                  <img
                    src="/images/hero_case.png"
                    alt="DUAT Passage Case"
                    className="w-full h-full object-cover object-center pointer-events-none"
                  />
                </div>

                {/* Floating Mono Caption in the Void */}
                <div className="mt-4 font-mono text-[11px] uppercase tracking-widest text-ash/80 text-center">
                  DUAT PASSAGE CASE · C.2026 · ALEXANDRIA
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CATEGORIES GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          
          <div className="space-y-2 border-l-2 border-gold pl-4">
            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-ash">
              <SunDisc size={12} variant="gold" />
              <span>{t('catEyebrow')}</span>
            </div>
            <h2 className="font-clash text-3xl sm:text-4xl uppercase text-bone">
              {t('catTitle')}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {CATEGORIES.filter(c => c.id !== 'all').map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className="bg-stone border border-grave p-6 sm:p-8 text-left group hover:bg-coal hover:border-gold transition-all duration-300 flex flex-col justify-between h-56 sm:h-64 relative overflow-hidden min-h-[44px]"
              >
                <div className="flex justify-between items-start">
                  <span className="font-mono text-xl sm:text-2xl font-bold text-ash group-hover:text-gold transition-colors">
                    {cat.num}
                  </span>
                  {renderCategoryIcon(cat.id)}
                </div>

                <div className="space-y-1">
                  <h3 className="font-space font-bold text-xl sm:text-2xl uppercase text-bone group-hover:text-gold transition-colors">
                    {cat.id === 'cases' && t('catCases')}
                    {cat.id === 'stickers' && t('catStickers')}
                    {cat.id === 'charms' && t('catCharms')}
                    {cat.id === 'accessories' && t('catAccessories')}
                  </h3>
                  <p className="font-mono text-xs text-ash tracking-widest uppercase flex items-center gap-2 group-hover:text-bone">
                    <span>EXPLORE</span>
                    <ArrowIcon size={12} className="group-hover:translate-x-1 transition-transform" />
                  </p>
                </div>
              </button>
            ))}
          </div>

        </div>
      </section>

      {/* BUILD YOUR OWN — THE FORGE */}
      <section className="bg-stone border-y border-grave py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center">
            
            <div className="space-y-6">
              <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-ash">
                <SunDisc size={12} variant="gold" />
                <span>{t('forgeEyebrow')}</span>
              </div>

              <h2 className="font-clash text-3xl sm:text-5xl uppercase text-bone leading-tight">
                {t('forgeTitle')}
              </h2>

              <p className="font-space text-base sm:text-lg text-bone/80 leading-relaxed max-w-lg font-light">
                {t('forgeDesc')}
              </p>

              <button
                onClick={() => navigate('/customizer')}
                className="btn-primary py-4 px-8 text-sm flex items-center justify-center gap-3 group w-full sm:w-auto"
              >
                <span>{t('forgeCta')}</span>
                <ArrowIcon size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Frameless Edge-Faded Customizer Preview */}
            <div className="flex justify-center pt-6 lg:pt-0">
              <div className="w-64 aspect-[3/4] relative flex flex-col justify-between items-center overflow-hidden">
                <div className="hero-image-blend w-full h-full">
                  <img
                    src="/images/hero_case.png"
                    alt="Customizer Preview"
                    className="w-full h-full object-cover object-center"
                  />
                </div>
                
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center pointer-events-none">
                  <div className="bg-gold text-void font-kufi font-bold text-xs px-3 py-1 rounded-full shadow-md">
                    طالع نور
                  </div>
                  <span className="font-mono text-[10px] text-bone tracking-widest uppercase mt-2">
                    INTERACTIVE BUILDER
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS — NEW PASSAGE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4 border-b border-grave pb-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-ash">
              <SunDisc size={12} variant="gold" />
              <span>{t('featuredEyebrow')}</span>
            </div>
            <h2 className="font-clash text-3xl sm:text-4xl uppercase text-bone">
              {t('featuredTitle')}
            </h2>
          </div>

          <button
            onClick={() => navigate('/shop')}
            className="font-mono text-xs uppercase tracking-widest text-gold hover:text-ember flex items-center gap-2 transition-colors min-h-[44px]"
          >
            <span>VIEW ALL DROPS</span>
            <ArrowIcon size={14} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <div key={product.id} onClick={() => onSelectProduct?.(product)}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </section>

      {/* REVIEWS */}
      <section className="bg-stone border-y border-grave py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="space-y-2 border-l-2 border-gold pl-4">
            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-ash">
              <SunDisc size={12} variant="gold" />
              <span>{t('reviewsEyebrow')}</span>
            </div>
            <h2 className="font-clash text-3xl sm:text-4xl uppercase text-bone">
              {t('reviewsTitle')}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {REVIEWS.map((rev) => (
              <div key={rev.id} className="bg-coal border border-grave p-6 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center gap-1 text-gold">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} size={14} fill="currentColor" />
                    ))}
                  </div>
                  <p className="font-space text-sm text-bone/90 italic leading-relaxed">
                    "{lang === 'ar' ? rev.textAr : rev.textEn}"
                  </p>
                </div>

                <div className="border-t border-grave pt-3 flex justify-between items-center font-mono text-xs">
                  <span className="font-bold text-bone">{rev.author}</span>
                  <span className="text-ash uppercase">{lang === 'ar' ? rev.cityAr : rev.city}</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="space-y-2 text-center">
          <div className="flex items-center justify-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-ash">
            <SunDisc size={12} variant="gold" />
            <span>{t('faqEyebrow')}</span>
          </div>
          <h2 className="font-clash text-3xl sm:text-4xl uppercase text-bone">
            {t('faqTitle')}
          </h2>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq) => {
            const isOpen = openFaqId === faq.id;
            return (
              <div key={faq.id} className="bg-stone border border-grave transition-colors">
                <button
                  onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 focus:outline-none min-h-[44px]"
                >
                  <span className="font-space font-bold text-base text-bone">
                    {lang === 'ar' ? faq.qAr : faq.qEn}
                  </span>
                  {isOpen ? <ChevronUp size={18} className="text-gold flex-shrink-0" /> : <ChevronDown size={18} className="text-ash flex-shrink-0" />}
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 font-space text-sm text-bone/80 border-t border-grave pt-4 leading-relaxed font-light">
                    {lang === 'ar' ? faq.aAr : faq.aEn}
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
