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
      
      {/* HERO SECTION */}
      <section className="relative min-h-[calc(100vh-80px)] flex items-center bg-void overflow-hidden pt-8 pb-16 sm:py-20 border-b border-grave">
        
        <div className="absolute top-0 right-0 w-[550px] h-[550px] bg-radial from-gold/10 via-transparent to-transparent rounded-full blur-3xl pointer-events-none -mr-32 -mt-32" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-6 sm:space-y-8">
              
              <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-ash">
                <SunDisc size={12} variant="gold" />
                <span>{t('heroEyebrow')}</span>
              </div>

              <h1 className="font-clash text-4xl sm:text-6xl lg:text-[90px] uppercase text-bone leading-display tracking-tight">
                {t('heroHeadline1')} <br />
                <span className="text-gold">{t('heroHeadline2')}</span>
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

            <div className="lg:col-span-5 flex justify-center pt-6 lg:pt-0">
              <div className="w-64 sm:w-72 h-[440px] sm:h-[480px] rounded-[38px] border-2 border-gold/40 bg-stone p-5 shadow-[0_20px_50px_rgba(0,0,0,0.9)] relative flex flex-col justify-between items-center group hover:border-gold transition-colors duration-500">
                
                <div className="self-end w-20 h-20 rounded-2xl bg-coal border-2 border-gold flex flex-col items-center justify-center p-2 shadow-lg">
                  <div className="w-5 h-5 rounded-full bg-void border border-ash/40 flex items-center justify-center mb-1">
                    <div className="w-2 h-2 rounded-full bg-ash/30" />
                  </div>
                  <div className="w-5 h-5 rounded-full bg-void border border-ash/40 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-ash/30" />
                  </div>
                </div>

                <div className="my-auto flex flex-col items-center gap-3 text-center">
                  <div className="w-16 h-16 rounded-full border border-gold/30 flex items-center justify-center bg-coal">
                    <div className="w-8 h-8 rounded-full border border-gold" />
                  </div>
                  <div className="space-y-1">
                    <span className="font-space font-bold text-sm text-bone uppercase tracking-widest block">
                      DUAT SOLAR CASE
                    </span>
                    <span className="font-mono text-[10px] text-ash tracking-widest uppercase block">
                      C.2026 • ALEXANDRIA
                    </span>
                  </div>
                </div>

                <div className="self-start text-[9px] font-mono tracking-widest text-ash/40 font-bold uppercase select-none">
                  DUAT
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
            <h2 className="font-clash text-3xl sm:text-4xl uppercase text-bone tracking-tight">
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

      {/* BUILD YOUR OWN */}
      <section className="bg-stone border-y border-grave py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center">
            
            <div className="space-y-6">
              <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-ash">
                <SunDisc size={12} variant="gold" />
                <span>{t('forgeEyebrow')}</span>
              </div>

              <h2 className="font-clash text-3xl sm:text-5xl uppercase text-bone leading-tight tracking-tight">
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

            <div className="flex justify-center pt-6 lg:pt-0">
              <div className="w-64 h-[400px] rounded-[32px] border-2 border-grave bg-void p-4 shadow-2xl relative flex flex-col justify-between items-center group hover:border-gold transition-colors duration-500">
                <div className="self-end w-16 h-16 rounded-xl bg-coal border border-grave flex items-center justify-center p-2">
                  <div className="w-4 h-4 rounded-full bg-void border border-ash/40" />
                </div>
                
                <div className="my-auto flex flex-col items-center gap-3 text-center">
                  <div className="bg-gold text-void font-kufi font-bold text-xs px-3 py-1 rounded-full shadow-md">
                    طالع نور
                  </div>
                  <span className="font-mono text-[10px] text-ash tracking-widest uppercase">
                    INTERACTIVE BUILDER
                  </span>
                </div>

                <div className="w-20 h-1 bg-grave rounded-full" />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4 border-b border-grave pb-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-ash">
              <SunDisc size={12} variant="gold" />
              <span>{t('featuredEyebrow')}</span>
            </div>
            <h2 className="font-clash text-3xl sm:text-4xl uppercase text-bone tracking-tight">
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
            <h2 className="font-clash text-3xl sm:text-4xl uppercase text-bone tracking-tight">
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
          <h2 className="font-clash text-3xl sm:text-4xl uppercase text-bone tracking-tight">
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
