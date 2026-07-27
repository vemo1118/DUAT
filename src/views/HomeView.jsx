import React, { useState } from 'react';
import { SunDisc } from '../components/SunDisc';
import { ProductCard } from '../components/ProductCard';
import { PRODUCTS, CATEGORIES, REVIEWS, FAQS } from '../data/products';
import { useLanguage } from '../context/LanguageContext';
import { ArrowRight, ArrowLeft, Star, ChevronDown, ChevronUp, Sparkles, ShieldCheck, Truck, Clock } from 'lucide-react';

export const HomeView = ({ setView, setSelectedCategory, onSelectProduct }) => {
  const { lang, t } = useLanguage();
  const isRtl = lang === 'ar';
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const [openFaqId, setOpenFaqId] = useState('faq-1');

  const handleCategoryClick = (catId) => {
    setSelectedCategory(catId);
    setView('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const featuredProducts = PRODUCTS.slice(0, 4);

  return (
    <div className="space-y-24 pb-20">
      
      {/* HERO SECTION — CLEAN EDITORIAL TECHWEAR */}
      <section className="relative min-h-[calc(100vh-80px)] flex items-center bg-void overflow-hidden pt-12 pb-20 border-b border-grave">
        
        {/* Ambient Sun Disc Glow Backdrop */}
        <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-radial from-gold/15 via-ember/5 to-transparent rounded-full blur-3xl pointer-events-none -mr-40 -mt-40" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Bold Headline & CTAs */}
            <div className="lg:col-span-7 space-y-8">
              
              <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.25em] text-ash">
                <SunDisc size={14} />
                <span>{t('heroEyebrow')}</span>
              </div>

              <h1 className="font-space font-bold text-5xl sm:text-7xl lg:text-[100px] uppercase text-bone leading-display tracking-tight">
                {t('heroHeadline1')} <br />
                <span className="text-gold">{t('heroHeadline2')}</span>
              </h1>

              <p className="font-space text-lg sm:text-xl text-bone/85 max-w-xl font-light leading-relaxed">
                {t('heroSub')}
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  onClick={() => setView('customizer')}
                  className="btn-primary group text-sm py-4 px-8 flex items-center justify-center gap-3 shadow-[0_0_25px_rgba(232,176,75,0.2)]"
                >
                  <Sparkles size={18} />
                  <span>{t('heroCtaPrimary')}</span>
                  <ArrowIcon size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
                
                <button
                  onClick={() => setView('shop')}
                  className="btn-ghost text-sm py-4 px-8 flex items-center justify-center gap-3"
                >
                  <span>{t('heroCtaSecondary')}</span>
                </button>
              </div>

              {/* Trust Specs */}
              <div className="pt-6 border-t border-grave grid grid-cols-3 gap-4 font-mono text-[11px] text-ash uppercase">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={16} className="text-gold" />
                  <span>1-Year Warranty</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck size={16} className="text-gold" />
                  <span>Fast Delivery</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-gold" />
                  <span>Made To Order</span>
                </div>
              </div>

            </div>

            {/* Right Column: Clean Premium Techwear Case Showcase (No Scarabs / Filler Text) */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-80 h-[500px] rounded-[38px] border-4 border-grave bg-stone p-5 shadow-2xl relative flex flex-col justify-between items-center group hover:border-gold/60 transition-colors duration-500">
                {/* Camera Cutout */}
                <div className="self-end w-20 h-20 rounded-2xl bg-coal border border-grave flex items-center justify-center p-2">
                  <div className="w-5 h-5 rounded-full bg-void border border-grave flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-ash/40" />
                  </div>
                </div>

                {/* Minimal Sun Disc Mark Centerpiece */}
                <div className="my-auto flex flex-col items-center gap-6 text-center">
                  <SunDisc size={84} variant="gold" className="animate-pulse" />
                  <div className="space-y-1">
                    <span className="font-space font-bold text-sm text-bone tracking-wide uppercase block">
                      VOID CASE
                    </span>
                    <span className="font-mono text-[10px] text-ash tracking-widest uppercase block">
                      3D EPOXY CANVAS
                    </span>
                  </div>
                </div>

                <div className="w-24 h-1 bg-grave rounded-full" />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CATEGORIES GRID — THE FOUR HOURS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          
          <div className="space-y-2 border-l-2 border-gold pl-4">
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-ash block">
              {t('catEyebrow')}
            </span>
            <h2 className="font-space font-bold text-3xl sm:text-4xl uppercase text-bone tracking-tight">
              {t('catTitle')}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {CATEGORIES.filter(c => c.id !== 'all').map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className="bg-stone border border-grave p-8 text-left group hover:bg-coal hover:border-gold transition-all duration-300 flex flex-col justify-between h-64 relative overflow-hidden"
              >
                <div className="flex justify-between items-start">
                  <span className="font-mono text-2xl font-bold text-ash group-hover:text-gold transition-colors">
                    {cat.num}
                  </span>
                  <SunDisc size={20} className="opacity-40 group-hover:opacity-100 transition-opacity" />
                </div>

                <div className="space-y-1">
                  <h3 className="font-space font-bold text-2xl uppercase text-bone group-hover:text-gold transition-colors">
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
      <section className="bg-stone border-y border-grave py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <div className="space-y-6">
              <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.25em] text-gold">
                <SunDisc size={14} variant="gold" />
                <span>{t('forgeEyebrow')}</span>
              </div>

              <h2 className="font-space font-bold text-4xl sm:text-5xl uppercase text-bone leading-tight tracking-tight">
                {t('forgeTitle')}
              </h2>

              <p className="font-space text-lg text-bone/80 leading-relaxed max-w-lg">
                {t('forgeDesc')}
              </p>

              <button
                onClick={() => setView('customizer')}
                className="btn-primary py-4 px-8 text-sm flex items-center gap-3 group"
              >
                <span>{t('forgeCta')}</span>
                <ArrowIcon size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Clean Mini Phone Case Mockup */}
            <div className="flex justify-center">
              <div className="w-72 h-[480px] rounded-[36px] border-4 border-grave bg-void p-4 shadow-2xl relative flex flex-col justify-between items-center group hover:border-gold transition-colors duration-500">
                <div className="self-end w-20 h-20 rounded-2xl bg-coal border border-grave flex items-center justify-center p-2">
                  <div className="w-5 h-5 rounded-full bg-void border border-grave flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-ash/40" />
                  </div>
                </div>
                
                <div className="my-auto flex flex-col items-center gap-4 text-center">
                  <SunDisc size={72} variant="gold" className="animate-pulse" />
                  <span className="font-mono text-xs text-ash tracking-widest uppercase">
                    DUAT FORGE CANVAS
                  </span>
                </div>

                <div className="w-24 h-1 bg-grave rounded-full" />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS — NEW PASSAGE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4 border-b border-grave pb-6">
          <div className="space-y-2">
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-ash block">
              {t('featuredEyebrow')}
            </span>
            <h2 className="font-space font-bold text-3xl sm:text-4xl uppercase text-bone tracking-tight">
              {t('featuredTitle')}
            </h2>
          </div>

          <button
            onClick={() => setView('shop')}
            className="font-mono text-xs uppercase tracking-widest text-gold hover:text-ember flex items-center gap-2 transition-colors"
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

      {/* CUSTOMER REVIEWS — WHAT THEY CARRY / اللي بيحملوه (PRIORITY 3 FIX) */}
      <section className="bg-stone border-y border-grave py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="space-y-2 border-l-2 border-gold pl-4">
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-ash block">
              {t('reviewsEyebrow')}
            </span>
            <h2 className="font-space font-bold text-3xl sm:text-4xl uppercase text-bone tracking-tight">
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

      {/* INTERACTIVE FAQ ACCORDION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="space-y-2 text-center">
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-gold block">
            {t('faqEyebrow')}
          </span>
          <h2 className="font-space font-bold text-3xl sm:text-4xl uppercase text-bone tracking-tight">
            {t('faqTitle')}
          </h2>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq) => {
            const isOpen = openFaqId === faq.id;
            return (
              <div key={faq.id} className="bg-coal border border-grave transition-colors">
                <button
                  onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 focus:outline-none"
                >
                  <span className="font-space font-bold text-base text-bone">
                    {lang === 'ar' ? faq.qAr : faq.qEn}
                  </span>
                  {isOpen ? <ChevronUp size={18} className="text-gold" /> : <ChevronDown size={18} className="text-ash" />}
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 font-space text-sm text-bone/80 border-t border-grave pt-4 leading-relaxed animate-in fade-in duration-200">
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
