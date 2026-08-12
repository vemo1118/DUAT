import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useHeroBanners, INITIAL_HERO_SLIDES } from '../context/HeroBannersContext';
import { SunDisc } from './SunDisc';
import { ArrowRight, ArrowLeft, ChevronLeft, ChevronRight, ShoppingBag, Sparkles, ShieldCheck, Truck, Clock } from 'lucide-react';

function safeNum(val, fallback) {
  const n = Number(val);
  return isNaN(n) ? fallback : n;
}

export const HeroSlider = ({ setSelectedCategory }) => {
  const { lang, t } = useLanguage();
  const { slides } = useHeroBanners();
  const navigate = useNavigate();
  
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const activeSlides = Array.isArray(slides)
    ? slides.filter((s) => s && s.is_active !== false && s.isActive !== false && String(s.is_active) !== 'false')
    : [];

  const isAr = lang === 'ar';
  const isRtl = isAr;

  // Preload all active slide images on mount to eliminate image load flashes completely
  useEffect(() => {
    if (!Array.isArray(activeSlides)) return;
    activeSlides.forEach((slide) => {
      const url = slide?.imageUrl || slide?.image_url || slide?.image;
      if (url) {
        const img = new Image();
        img.src = url;
      }
    });
  }, [activeSlides]);

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

  const current = (activeSlides[currentSlide] && typeof activeSlides[currentSlide] === 'object')
    ? activeSlides[currentSlide]
    : (activeSlides[0] && typeof activeSlides[0] === 'object')
    ? activeSlides[0]
    : INITIAL_HERO_SLIDES[0];

  const eyebrow = isAr ? current?.eyebrowAr || current?.eyebrowEn || '' : current?.eyebrowEn || current?.eyebrowAr || '';
  const headline1 = isAr ? current?.headline1Ar || current?.headline1En || '' : current?.headline1En || current?.headline1Ar || '';
  const headline2 = isAr ? current?.headline2Ar || current?.headline2En || '' : current?.headline2En || current?.headline2Ar || '';
  const sub = isAr ? current?.subAr || current?.subEn || '' : current?.subEn || current?.subAr || '';
  const badge = isAr ? current?.badgeAr || current?.badgeEn || '' : current?.badgeEn || current?.badgeAr || '';

  const primaryBtnText = (isAr ? current?.ctaPrimaryTextAr : current?.ctaPrimaryTextEn) || (isAr ? 'تسوق الآن' : 'START BUILDING');
  const primaryBtnLink = current?.ctaPrimaryLink || '/customize';

  const secondaryBtnText = (isAr ? current?.ctaSecondaryTextAr : current?.ctaSecondaryTextEn) || (isAr ? 'معرض الكتالوج' : 'VIEW GALLERY');
  const secondaryBtnLink = current?.ctaSecondaryLink || '/shop';

  const isRightAlign = current?.textAlign === 'right';
  const isCenterAlign = current?.textAlign === 'center';

  const alignClass = isCenterAlign
    ? 'text-center items-center mx-auto'
    : isRightAlign
    ? `${isAr ? 'text-right' : 'text-right'} items-end ml-auto`
    : `${isAr ? 'text-right' : 'text-left'} items-start mr-auto`;

  const flexJustifyClass = isCenterAlign
    ? 'justify-center'
    : isRightAlign
    ? 'justify-end'
    : 'justify-start';

  return (
    <section
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="hero-section relative w-full bg-void border-b border-grave overflow-hidden min-h-[620px] sm:min-h-[720px] lg:min-h-[800px] flex items-center font-sans text-bone transition-colors"
    >
      {/* Stacked Cross-Fading Slide Background Layers (Zero Flicker) */}
      {activeSlides.map((slide, idx) => {
        const slideBg = slide?.imageUrl || slide?.image_url || slide?.image || 'https://res.cloudinary.com/ikim5u08/image/upload/f_auto,q_auto/v1785712166/B1_u3veqk.jpg';
        const slideMobileBg = slide?.mobileImageUrl || slide?.mobile_image_url || slide?.mobileImage || '';
        const slidePosX = safeNum(slide?.posX, 0);
        const slidePosY = safeNum(slide?.posY, 30);
        const slideRightAlign = slide?.textAlign === 'right';
        const isActive = currentSlide === idx;

        return (
          <div
            key={slide.id || idx}
            className={`absolute inset-0 z-0 overflow-hidden transition-opacity duration-1000 ease-in-out ${
              isActive ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            }`}
          >
            <picture className="w-full h-full">
              {slideMobileBg && (
                <source media="(max-width: 767px)" srcSet={slideMobileBg} />
              )}
              <img
                src={slideBg}
                alt="Hero Background"
                className="w-full h-full object-cover brightness-110 contrast-110 saturate-105"
                style={{ objectPosition: `${50 + slidePosX}% ${slidePosY}%` }}
              />
            </picture>
            {/* Dynamic Theme Background Overlay Vignette (RTL & LTR Aware) */}
            <div
              className={`absolute inset-0 pointer-events-none ${
                slideRightAlign
                  ? 'bg-gradient-to-l from-[#0A0C16]/90 via-[#0A0C16]/60 via-50% to-transparent'
                  : 'bg-gradient-to-r from-[#0A0C16]/90 via-[#0A0C16]/60 via-50% to-transparent'
              }`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0C16]/70 via-transparent to-transparent pointer-events-none" />
          </div>
        );
      })}

      {/* Full Bleed Content Container */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-16 sm:py-24 relative z-10">
        <div
          className={`flex flex-col space-y-6 animate-fade-in transition-all duration-300 max-w-xl lg:max-w-xl ${alignClass}`}
          key={current.id}
        >
          
          {/* Eyebrow & Offer Badge */}
          <div className={`flex flex-wrap items-center gap-3 ${flexJustifyClass}`}>
            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-gold font-bold bg-gold/15 px-3.5 py-1.5 border border-gold/40 backdrop-blur-md rounded-sm shadow-md">
              <SunDisc size={14} variant="gold" />
              <span>{eyebrow}</span>
            </div>

            {badge && (
              <span className="font-mono text-xs uppercase tracking-widest text-red-500 bg-red-500/10 border border-red-500/30 px-3.5 py-1.5 font-bold animate-pulse backdrop-blur-md rounded-sm shadow-md">
                {badge}
              </span>
            )}
          </div>

          {/* Headlines */}
          <div className="space-y-1 w-full">
            <h1
              className="font-clash text-4xl sm:text-6xl lg:text-7xl uppercase tracking-tight font-bold leading-none text-bone drop-shadow-sm"
              style={{ color: current?.headline1Color || undefined }}
            >
              {headline1}
            </h1>
            {headline2 && (
              <h2
                className="font-clash text-4xl sm:text-6xl lg:text-7xl uppercase tracking-tight font-bold leading-none text-gold drop-shadow-sm"
                style={{ color: current?.headline2Color || undefined }}
              >
                {headline2}
              </h2>
            )}
          </div>

          {/* Subtitle / Description */}
          <p
            className="font-space text-sm sm:text-base font-normal max-w-xl leading-relaxed text-bone/90 drop-shadow-sm"
            style={{ color: current?.subColor || undefined }}
          >
            {sub}
          </p>

          {/* Action Buttons: Solid Gold & Glass Styles */}
          <div className={`flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4 font-mono text-xs font-bold uppercase tracking-wider w-full ${flexJustifyClass}`}>
            {/* Primary Action Button - Dynamic Gold */}
            <button
              onClick={() => navigate(primaryBtnLink)}
              className="py-4 px-8 bg-gold hover:bg-ember text-void font-bold border border-gold transition-all duration-300 shadow-xl shadow-gold/20 flex items-center justify-center gap-2.5 text-sm tracking-wider min-h-[48px] rounded-sm"
            >
              <ShoppingBag size={18} />
              <span>{primaryBtnText}</span>
              {isRtl ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
            </button>

            {/* Secondary Action Button - Dynamic Frosted Glass */}
            <button
              onClick={() => navigate(secondaryBtnLink)}
              className="py-4 px-8 bg-stone hover:bg-coal border border-grave text-bone hover:border-gold hover:text-gold transition-all duration-300 backdrop-blur-md shadow-xl flex items-center justify-center gap-2.5 text-sm tracking-wider min-h-[48px] rounded-sm"
            >
              <Sparkles size={16} className="text-gold" />
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
              className={`h-2 transition-all rounded-full shrink-0 ${
                currentSlide === idx ? 'w-6 bg-gold' : 'w-2 bg-ash hover:bg-gold'
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
      <div className="absolute bottom-0 left-0 hidden md:flex items-center gap-6 px-6 py-3 bg-stone/80 border-t border-r border-grave font-mono text-[11px] text-ash">
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
