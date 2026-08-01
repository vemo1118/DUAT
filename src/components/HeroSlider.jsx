import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useHeroBanners } from '../context/HeroBannersContext';
import { SunDisc } from './SunDisc';
import { ArrowRight, ArrowLeft, ChevronLeft, ChevronRight, ShoppingBag, Sparkles, ShieldCheck, Truck, Clock } from 'lucide-react';

export const HeroSlider = ({ setSelectedCategory }) => {
  const { lang, t } = useLanguage();
  const { slides } = useHeroBanners();
  const navigate = useNavigate();
  
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const activeSlides = Array.isArray(slides) && slides.length > 0 ? slides : [];

  const isAr = lang === 'ar';
  const isRtl = isAr;

  // Auto-advance slide every 6 seconds
  useEffect(() => {
    if (isPaused || activeSlides.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % activeSlides.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [isPaused, activeSlides.length]);

  const handleNext = () => {
    if (activeSlides.length === 0) return;
    setCurrentSlide((prev) => (prev + 1) % activeSlides.length);
  };

  const handlePrev = () => {
    if (activeSlides.length === 0) return;
    setCurrentSlide((prev) => (prev - 1 + activeSlides.length) % activeSlides.length);
  };

  if (activeSlides.length === 0) return null;

  const current = activeSlides[currentSlide] || activeSlides[0];

  const eyebrow = isAr ? current.eyebrowAr || current.eyebrowEn : current.eyebrowEn || current.eyebrowAr;
  const headline1 = isAr ? current.headline1Ar || current.headline1En : current.headline1En || current.headline1Ar;
  const headline2 = isAr ? current.headline2Ar || current.headline2En : current.headline2En || current.headline2Ar;
  const sub = isAr ? current.subAr || current.subEn : current.subEn || current.subAr;
  const badge = isAr ? current.badgeAr || current.badgeEn : current.badgeEn || current.badgeAr;

  const primaryBtnText = (isAr ? current.ctaPrimaryTextAr : current.ctaPrimaryTextEn) || (isAr ? 'تسوق الآن' : 'START BUILDING');
  const primaryBtnLink = current.ctaPrimaryLink || '/customize';

  const secondaryBtnText = (isAr ? current.ctaSecondaryTextAr : current.ctaSecondaryTextEn) || (isAr ? 'معرض الكتالوج' : 'VIEW GALLERY');
  const secondaryBtnLink = current.ctaSecondaryLink || '/shop';

  const bgImage = current.imageUrl || current.image;

  return (
    <section
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative w-full bg-void border-b border-grave overflow-hidden min-h-[620px] sm:min-h-[720px] lg:min-h-[800px] flex items-center justify-center font-sans"
    >
      {/* Background Graphic or Uploaded Image Layer */}
      {bgImage ? (
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src={bgImage}
            alt="Hero Background"
            className="w-full h-full object-cover object-center scale-100 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone via-void/75 to-void/40 backdrop-blur-[1px]" />
        </div>
      ) : (
        /* Fallback Egyptian Ancient Texture Pattern */
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none bg-[radial-gradient(#E0A93B_1px,transparent_1px)] [background-size:24px_24px]" />
      )}

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 relative z-10 w-full">
        <div className="max-w-3xl space-y-6 animate-fade-in" key={current.id}>
          
          {/* Eyebrow & Offer Badge */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-gold font-bold bg-gold/10 px-3 py-1 border border-gold/30">
              <SunDisc size={14} variant="gold" />
              <span>{eyebrow}</span>
            </div>

            {badge && (
              <span className="font-mono text-xs uppercase tracking-widest text-red-400 bg-red-600/20 border border-red-500/40 px-3 py-1 font-bold animate-pulse">
                {badge}
              </span>
            )}
          </div>

          {/* Headlines */}
          <div className="space-y-1">
            <h1 className="font-clash text-4xl sm:text-6xl lg:text-7xl uppercase text-bone tracking-tight font-bold leading-none">
              {headline1}
            </h1>
            {headline2 && (
              <h2 className="font-clash text-4xl sm:text-6xl lg:text-7xl uppercase text-gold tracking-tight font-bold leading-none">
                {headline2}
              </h2>
            )}
          </div>

          {/* Subtitle / Description */}
          <p className="font-space text-sm sm:text-base text-ash font-light max-w-2xl leading-relaxed">
            {sub}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4 font-mono text-xs font-bold uppercase tracking-wider">
            {/* Primary Action Button */}
            <button
              onClick={() => navigate(primaryBtnLink)}
              style={{ backgroundColor: '#E8A33D', color: '#0A0C16' }}
              className="py-4 px-8 font-bold hover:brightness-110 transition-all duration-300 shadow-lg shadow-gold/20 flex items-center justify-center gap-2 text-sm border border-gold"
            >
              <ShoppingBag size={18} />
              <span>{primaryBtnText}</span>
              {isRtl ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
            </button>

            {/* Secondary Action Button */}
            <button
              onClick={() => navigate(secondaryBtnLink)}
              style={{ backgroundColor: 'rgba(24, 30, 59, 0.8)', color: '#EDE4D3', borderColor: '#28305F' }}
              className="py-4 px-8 border hover:border-gold hover:text-gold transition-all duration-300 flex items-center justify-center gap-2 text-sm"
            >
              <Sparkles size={16} />
              <span>{secondaryBtnText}</span>
            </button>
          </div>

        </div>
      </div>

      {/* Manual Slide Controls & Dots Bar (Bottom) */}
      <div className="absolute bottom-6 right-6 z-20 flex items-center gap-4 bg-stone/90 border border-grave px-4 py-2 backdrop-blur">
        {/* Slide Counter / Indicators */}
        <div className="flex items-center gap-1.5 font-mono text-xs text-ash">
          {activeSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              style={currentSlide === idx ? { backgroundColor: '#E8A33D' } : { backgroundColor: '#28305F' }}
              className={`h-2 transition-all rounded-full shrink-0 ${
                currentSlide === idx ? 'w-6' : 'w-2 hover:bg-ash'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* Corrected Prev / Next Arrow Directions */}
        {activeSlides.length > 1 && (
          <div className="flex items-center gap-1 border-l border-grave pl-3 pr-1">
            <button
              onClick={handlePrev}
              className="p-1.5 text-ash hover:text-gold transition-colors"
              title={isAr ? 'السابق' : 'Previous'}
            >
              {isRtl ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>
            <button
              onClick={handleNext}
              className="p-1.5 text-ash hover:text-gold transition-colors"
              title={isAr ? 'التالي' : 'Next'}
            >
              {isRtl ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
            </button>
          </div>
        )}
      </div>

      {/* Micro Trust Bar Overlay with Strict Language Switching */}
      <div className="absolute bottom-0 left-0 hidden md:flex items-center gap-6 px-6 py-3 bg-stone/60 border-t border-r border-grave font-mono text-[11px] text-ash">
        <span className="flex items-center gap-1.5">
          <ShieldCheck size={14} className="text-gold" />
          <span>{isAr ? 'ضمان سنة استبدال' : '1-YEAR WARRANTY'}</span>
        </span>
        <span className="flex items-center gap-1.5">
          <Truck size={14} className="text-gold" />
          <span>{isAr ? 'شحن لكافة المحافظات' : 'FAST EGYPT SHIPPING'}</span>
        </span>
        <span className="flex items-center gap-1.5">
          <Clock size={14} className="text-gold" />
          <span>{isAr ? 'تقفيل مصري فاخر' : 'HAND-FINISHED IN EGYPT'}</span>
        </span>
      </div>
    </section>
  );
};
