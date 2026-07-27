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
      
      {/* LUXURY E-COMMERCE HERO SECTION */}
      <section className="relative min-h-[calc(100vh-80px)] flex items-center bg-night overflow-hidden pt-12 pb-20 border-b border-bone/10 hero-dawn-bg">
        
        {/* Ambient Subtle Glow Backdrop */}
        <div className="absolute top-0 right-0 w-[750px] h-[750px] bg-radial from-amber/20 via-rose/5 to-transparent rounded-full blur-3xl pointer-events-none -mr-48 -mt-48" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Value Proposition & CTAs */}
            <div className="lg:col-span-7 space-y-8">
              
              <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.25em] text-amber">
                <SunDisc size={16} variant="gold" />
                <span>{t('heroEyebrow')}</span>
              </div>

              <h1 className="font-anton text-5xl sm:text-7xl lg:text-[96px] uppercase text-bone leading-[0.92] tracking-tight">
                {t('heroHeadline1')} <br />
                <span className="text-amber">{t('heroHeadline2')}</span>
              </h1>

              <p className="font-space text-lg sm:text-xl text-bone/85 max-w-xl font-light leading-relaxed">
                {t('heroSub')}
              </p>

              {/* Slogan Pill Badges Cloud */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="bg-amber/15 text-amber font-cairo font-bold text-xs px-3 py-1 border border-amber/40 rounded-full">
                  طالع نور
                </span>
                <span className="bg-twilight text-bone font-cairo text-xs px-3 py-1 border border-bone/20 rounded-full">
                  عدّي الليل
                </span>
                <span className="bg-twilight text-amber font-mono text-[10px] uppercase font-bold px-3 py-1 border border-amber/40 rounded-full">
                  BORN AT DAWN
                </span>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  onClick={() => setView('customizer')}
                  className="btn-primary group text-sm py-4 px-8 flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(232,163,61,0.3)]"
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

              {/* Trust Badges */}
              <div className="pt-6 border-t border-bone/10 grid grid-cols-3 gap-4 font-mono text-[11px] text-bone-dim uppercase">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={16} className="text-amber" />
                  <span>1-Year Warranty</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck size={16} className="text-amber" />
                  <span>Fast Delivery</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-amber" />
                  <span>Made To Order</span>
                </div>
              </div>

            </div>

            {/* Right Column: 8K Studio Product Showcase */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative group max-w-sm w-full">
                
                {/* Border Glow Effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-amber via-rose to-amber-deep rounded-xl blur opacity-30 group-hover:opacity-75 transition duration-500" />
                
                <div className="relative bg-twilight border border-bone/15 p-4 shadow-2xl overflow-hidden">
                  <img
                    src="/images/hero_case.png"
                    alt="DUAT Solar Armor Case"
                    className="w-full h-[420px] object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  />
                  
                  <div className="p-4 bg-night/95 border-t border-bone/10 flex justify-between items-center font-mono text-xs">
                    <div>
                      <span className="text-amber font-bold block">SOLAR PASSAGE CASE</span>
                      <span className="text-bone-dim text-[10px]">3D EPOXY DOME CANVAS</span>
                    </div>
                    <span className="text-bone font-bold text-sm">650 EGP</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CATEGORIES GRID — THE FOUR HOURS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          
          <div className="space-y-2 border-l-2 border-amber pl-4">
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-bone-dim block">
              {t('catEyebrow')}
            </span>
            <h2 className="font-anton text-3xl sm:text-4xl uppercase text-bone">
              {t('catTitle')}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {CATEGORIES.filter(c => c.id !== 'all').map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className="bg-twilight border border-bone/10 p-8 text-left group hover:bg-indigo hover:border-amber hover:shadow-[0_0_25px_rgba(232,163,61,0.15)] transition-all duration-300 flex flex-col justify-between h-64 relative overflow-hidden"
              >
                <div className="flex justify-between items-start">
                  <span className="font-mono text-2xl font-bold text-bone-dim group-hover:text-amber transition-colors">
                    {cat.num}
                  </span>
                  <SunDisc size={20} className="opacity-40 group-hover:opacity-100 transition-opacity" />
                </div>

                <div className="space-y-1">
                  <h3 className="font-anton text-2xl uppercase text-bone group-hover:text-amber transition-colors">
                    {cat.id === 'cases' && t('catCases')}
                    {cat.id === 'stickers' && t('catStickers')}
                    {cat.id === 'charms' && t('catCharms')}
                    {cat.id === 'accessories' && t('catAccessories')}
                  </h3>
                  <p className="font-mono text-xs text-bone-dim tracking-widest uppercase flex items-center gap-2 group-hover:text-bone">
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
      <section className="bg-twilight/60 border-y border-bone/10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <div className="space-y-6">
              <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.25em] text-amber">
                <SunDisc size={14} variant="gold" />
                <span>{t('forgeEyebrow')}</span>
              </div>

              <h2 className="font-anton text-4xl sm:text-5xl uppercase text-bone leading-tight">
                {t('forgeTitle')}
              </h2>

              <p className="font-space text-lg text-bone/85 leading-relaxed max-w-lg">
                {t('forgeDesc')}
              </p>

              <button
                onClick={() => setView('customizer')}
                className="btn-primary py-4 px-8 text-sm flex items-center gap-3 group shadow-[0_0_20px_rgba(232,163,61,0.25)]"
              >
                <span>{t('forgeCta')}</span>
                <ArrowIcon size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Interactive Builder Showcase */}
            <div className="flex justify-center">
              <div className="w-72 h-[480px] rounded-[36px] border-4 border-bone/20 bg-night p-4 shadow-2xl relative flex flex-col justify-between items-center group hover:border-amber transition-colors duration-500">
                <div className="self-end w-20 h-20 rounded-2xl bg-twilight border border-bone/10 flex items-center justify-center p-2">
                  <div className="w-6 h-6 rounded-full bg-night border border-bone/20" />
                </div>
                
                <div className="my-auto flex flex-col items-center gap-4 text-center">
                  <SunDisc size={72} variant="gold" className="animate-pulse" />
                  <div className="bg-amber/20 border border-amber px-3 py-1 rounded-full font-cairo font-bold text-amber text-xs">
                    طالع نور
                  </div>
                  <span className="font-mono text-xs text-bone-dim tracking-widest uppercase">
                    INTERACTIVE CANVAS
                  </span>
                </div>

                <div className="w-24 h-1 bg-bone/20 rounded-full" />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS — NEW PASSAGE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4 border-b border-bone/10 pb-6">
          <div className="space-y-2">
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-bone-dim block">
              {t('featuredEyebrow')}
            </span>
            <h2 className="font-anton text-3xl sm:text-4xl uppercase text-bone">
              {t('featuredTitle')}
            </h2>
          </div>

          <button
            onClick={() => setView('shop')}
            className="font-mono text-xs uppercase tracking-widest text-amber hover:text-rose flex items-center gap-2 transition-colors"
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

      {/* BRAND NARRATIVE SECTION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 text-center">
        <span className="font-mono text-xs uppercase tracking-[0.32em] text-amber block font-bold">
          The Story · الحدوتة
        </span>
        <h2 className="font-anton text-4xl sm:text-5xl uppercase text-bone">
          Born at dawn
        </h2>
        
        <p className="font-space text-xl text-bone/90 font-light leading-relaxed">
          الدُوات هو العالم اللي بتعدّي فيه الشمس كل ليلة في الضلمة، بتحارب، وبتتولد من جديد عند الفجر. الاسم نفسه هو الوعد: إنك تعدّي ليلك وتطلع نور.
        </p>

        <div className="p-6 bg-twilight border-l-4 border-amber text-bone font-cairo text-xl font-bold max-w-xl mx-auto shadow-xl">
          مش بنبيع جراب. بنبيع فكرة إنك جاي من الضلمة وماشي للنور.
        </div>
      </section>

      {/* CUSTOMER REVIEWS & FAQ */}
      <section className="bg-twilight/50 border-y border-bone/10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="space-y-2 border-l-2 border-amber pl-4">
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-bone-dim block">
              {t('reviewsEyebrow')}
            </span>
            <h2 className="font-anton text-3xl sm:text-4xl uppercase text-bone">
              {t('reviewsTitle')}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {REVIEWS.map((rev) => (
              <div key={rev.id} className="bg-night border border-bone/10 p-6 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center gap-1 text-amber">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} size={14} fill="currentColor" />
                    ))}
                  </div>
                  <p className="font-space text-sm text-bone/90 italic leading-relaxed">
                    "{lang === 'ar' ? rev.textAr : rev.textEn}"
                  </p>
                </div>

                <div className="border-t border-bone/10 pt-3 flex justify-between items-center font-mono text-xs">
                  <span className="font-bold text-bone">{rev.author}</span>
                  <span className="text-bone-dim uppercase">{lang === 'ar' ? rev.cityAr : rev.city}</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

    </div>
  );
};
