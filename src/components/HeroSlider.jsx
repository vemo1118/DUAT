import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useHeroBanners, INITIAL_HERO_SLIDES } from '../context/HeroBannersContext';
import { SunDisc } from './SunDisc';
import { EMPTY_HERO_IMAGE, HeroMobileImage } from './HeroMobileImage';
import { ArrowRight, ArrowLeft, ChevronLeft, ChevronRight, ShoppingBag, Sparkles, MapPin, Palette, Clock } from 'lucide-react';

function safeNum(val, fallback) {
  const n = Number(val);
  return isNaN(n) ? fallback : n;
}

export const HeroSlider = () => {
  const { lang } = useLanguage();
  const { slides, loading } = useHeroBanners();
  const navigate = useNavigate();
  
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const activeSlides = Array.isArray(slides)
    ? slides.filter((s) => s && s.is_active !== false && s.isActive !== false && String(s.is_active) !== 'false')
    : [];

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

  if (activeSlides.length === 0) return loading ? <div className="h-[460px] md:h-[720px] bg-stone animate-pulse" aria-label="Loading banners" /> : null;

  const current = (activeSlides[currentSlide] && typeof activeSlides[currentSlide] === 'object')
    ? activeSlides[currentSlide]
    : (activeSlides[0] && typeof activeSlides[0] === 'object')
    ? activeSlides[0]
    : INITIAL_HERO_SLIDES[0];

  const mobileImage = current.mobileImageUrl || current.imageUrl || current.image_url || current.image || INITIAL_HERO_SLIDES[0].imageUrl;

  const eyebrow = isAr ? current?.eyebrowAr || current?.eyebrowEn || '' : current?.eyebrowEn || current?.eyebrowAr || '';
  const headline1 = isAr ? current?.headline1Ar || current?.headline1En || '' : current?.headline1En || current?.headline1Ar || '';
  const headline2 = isAr ? current?.headline2Ar || current?.headline2En || '' : current?.headline2En || current?.headline2Ar || '';
  const sub = isAr ? current?.subAr || current?.subEn || '' : current?.subEn || current?.subAr || '';
  const badge = isAr ? current?.badgeAr || current?.badgeEn || '' : current?.badgeEn || current?.badgeAr || '';

  const primaryBtnText = (isAr ? current?.ctaPrimaryTextAr : current?.ctaPrimaryTextEn) || (isAr ? 'تسوق الآن' : 'START BUILDING');
  const primaryBtnLink = current?.ctaPrimaryLink || '/sticker-builder';

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
      className="hero-section relative w-full bg-stone md:bg-void border-b border-grave overflow-hidden md:min-h-[720px] lg:min-h-[800px] md:flex md:items-center font-sans text-bone transition-colors"
    >
      {/* Stacked Cross-Fading Slide Background Layers (Zero Flicker) */}
      {activeSlides.map((slide, idx) => {
        const slideBg = slide?.imageUrl || slide?.image_url || slide?.image || 'https://res.cloudinary.com/ikim5u08/image/upload/f_auto,q_auto/v1785712166/B1_u3veqk.jpg';
        const slidePosX = safeNum(slide?.posX, 0);
        const slidePosY = safeNum(slide?.posY, 30);
        const slideRightAlign = slide?.textAlign === 'right';
        const isActive = currentSlide === idx;

        return (
          <div
            key={slide.id || idx}
            className={`absolute inset-0 z-0 hidden overflow-hidden transition-opacity md:block duration-1000 ease-in-out ${
              isActive ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            }`}
          >
            <picture className="w-full h-full">
              <source media="(min-width: 768px)" srcSet={slideBg} />
              <img
                src={EMPTY_HERO_IMAGE}
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

      <div className="px-3 pt-3 md:hidden">
        <HeroMobileImage src={mobileImage} storefront />
        <div className="grid gap-y-2 px-1 pb-1 pt-3">
          {activeSlides.map((slide, index) => {
            const localized = (field) => slide[field + (isAr ? 'Ar' : 'En')] ||
              slide[field + (isAr ? 'En' : 'Ar')] || '';
            const active = slide.id === current.id && index === (activeSlides[currentSlide] ? currentSlide : 0);

            return (
              <div key={slide.id || index} aria-hidden={!active}
                className={`col-start-1 row-start-1 row-span-4 grid grid-rows-subgrid text-start ${active ? '' : 'invisible'}`}>
                <p className="self-start text-xs font-bold text-gold">{localized('eyebrow')}</p>
                <h1 className="self-start break-words font-clash text-2xl font-bold uppercase leading-tight text-bone">
                  <span style={{ color: slide.headline1Color }}>{localized('headline1')}</span>
                  <span className="block text-gold" style={{ color: slide.headline2Color }}>{localized('headline2')}</span>
                </h1>
                <p className="self-start break-words text-sm leading-snug text-bone/80">{localized('sub')}</p>
                <div className="grid min-w-0 grid-cols-2 gap-2" data-mobile-hero-actions>
                  <button type="button" onClick={() => navigate(slide.ctaPrimaryLink || '/sticker-builder')}
                    className="min-h-11 min-w-0 break-words rounded-sm bg-gold px-2 py-2 text-xs font-bold text-void">
                    {localized('ctaPrimaryText') || (isAr ? 'تسوق الآن' : 'Shop now')}
                  </button>
                  <button type="button" onClick={() => navigate(slide.ctaSecondaryLink || '/shop')}
                    className="min-h-11 min-w-0 break-words rounded-sm border border-grave bg-stone px-2 py-2 text-xs font-bold text-bone">
                    {localized('ctaSecondaryText') || (isAr ? 'معرض الكتالوج' : 'View gallery')}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Full Bleed Content Container */}
      <div className="relative z-10 mx-auto hidden w-full max-w-7xl px-8 py-24 md:block lg:px-12">
        <div
          className={`flex flex-col space-y-2 md:space-y-6 animate-fade-in transition-all duration-300 max-w-xl lg:max-w-xl ${alignClass}`}
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
              className="font-clash text-2xl md:text-6xl lg:text-7xl uppercase tracking-tight font-bold leading-none text-bone drop-shadow-sm"
              style={{ color: current?.headline1Color || undefined }}
            >
              {headline1}
            </h1>
            {headline2 && (
              <h2
                className="font-clash text-2xl md:text-6xl lg:text-7xl uppercase tracking-tight font-bold leading-none text-gold drop-shadow-sm"
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
          <div className={`flex flex-wrap items-stretch md:items-center gap-2 pt-1 md:gap-4 md:pt-4 font-mono text-xs font-bold uppercase tracking-wider w-full ${flexJustifyClass}`}>
            {/* Primary Action Button - Dynamic Gold */}
            <button
              onClick={() => navigate(primaryBtnLink)}
              className="py-2.5 px-3 md:py-4 md:px-8 bg-gold hover:bg-ember text-void font-bold border border-gold transition-all duration-300 shadow-xl shadow-gold/20 flex items-center justify-center gap-2.5 text-sm tracking-wider min-h-[44px] md:min-h-[48px] rounded-sm"
            >
              <ShoppingBag size={18} />
              <span>{primaryBtnText}</span>
              {isRtl ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
            </button>

            {/* Secondary Action Button - Dynamic Frosted Glass */}
            <button
              onClick={() => navigate(secondaryBtnLink)}
              className="py-2.5 px-3 md:py-4 md:px-8 bg-stone hover:bg-coal border border-grave text-bone hover:border-gold hover:text-gold transition-all duration-300 backdrop-blur-md shadow-xl flex items-center justify-center gap-2.5 text-sm tracking-wider min-h-[44px] md:min-h-[48px] rounded-sm"
            >
              <Sparkles size={16} className="text-gold" />
              <span>{secondaryBtnText}</span>
            </button>
          </div>

        </div>
      </div>

      {/* Manual Slide Controls & Dots Bar (Bottom) */}
      <div className="relative z-20 mx-auto flex w-fit items-center gap-3 px-4 pb-2 md:absolute md:bottom-6 md:right-6 md:border md:border-grave md:bg-stone/90 md:py-2 md:backdrop-blur">
        {/* Slide Counter / Indicators */}
        <div className="flex items-center gap-1.5 font-mono text-xs text-ash">
          {activeSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className="grid min-h-11 w-8 shrink-0 place-items-center"
              aria-pressed={currentSlide === idx}
              aria-label={isAr ? `اعرض البنر ${idx + 1}` : `Go to slide ${idx + 1}`}
            >
              <span aria-hidden="true" className={`h-1.5 rounded-full transition-all ${currentSlide === idx ? 'w-5 bg-gold' : 'w-1.5 bg-ash'}`} />
            </button>
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
          <Palette size={14} className="text-gold" />
          <span>{isAr ? 'كل قطعة بتصميمك' : 'YOUR DESIGN, EACH PIECE'}</span>
        </span>
        <span className="flex items-center gap-1.5">
          <MapPin size={14} className="text-gold" />
          <span>{isAr ? 'مصنوع حسب الطلب في مصر' : 'MADE TO ORDER IN EGYPT'}</span>
        </span>
        <span className="flex items-center gap-1.5">
          <Clock size={14} className="text-gold" />
          <span>{isAr ? 'المقاس ظاهر قبل الطلب' : 'SIZE SHOWN BEFORE ORDER'}</span>
        </span>
      </div>
    </section>
  );
};
