import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useHeroBanners } from '../context/HeroBannersContext';
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

  const bgImage = current?.imageUrl || current?.image || 'https://res.cloudinary.com/ikim5u08/image/upload/v1785712166/B1_u3veqk.jpg';

  const alignClass = current?.textAlign === 'center'
    ? 'text-center items-center mx-auto'
    : current?.textAlign === 'right'
    ? 'text-right items-end ml-auto'
    : 'text-left items-start mr-auto';

  const flexJustifyClass = current?.textAlign === 'center'
    ? 'justify-center'
    : current?.textAlign === 'right'
    ? 'justify-end'
    : 'justify-start';

  const overlayStrength = current?.overlayStrength || 'medium';

  const posX = safeNum(current?.posX, 0);
  const posY = safeNum(current?.posY, 30);
  const maxWidth = safeNum(current?.maxWidth, 46);
  const fontSizeScale = safeNum(current?.fontSizeScale, 92) / 100;

  return (
    <section
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="hero-section relative w-full bg-void border-b border-grave overflow-hidden min-h-[620px] sm:min-h-[720px] lg:min-h-[800px] flex items-center font-sans"
    >
      {/* Full-Bleed Background Image Layer */}
      {bgImage ? (
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src={bgImage}
            alt="Hero Background"
            className="w-full h-full object-cover object-center transition-transform duration-700 brightness-105 contrast-105"
          />
          {/* Dynamic Background Overlay Vignette */}
          <div className="absolute inset-0 bg-gradient-to-r from-void via-void/90 to-void/20 sm:w-3/4" />
          <div className="absolute inset-0 bg-gradient-to-t from-void/90 via-transparent to-void/30" />
        </div>
      ) : (
        /* Fallback Egyptian Ancient Texture Pattern */
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none bg-[radial-gradient(#E0A93B_1px,transparent_1px)] [background-size:24px_24px]" />
      )}

      {/* Full Bleed Content Container */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-12 lg:px-16 py-16 sm:py-24 relative z-10">
        <div
          className={`flex flex-col space-y-6 animate-fade-in transition-all duration-300 max-w-2xl ${alignClass}`}
          key={current.id}
        >
          
          {/* Eyebrow & Offer Badge */}
          <div className={`flex flex-wrap items-center gap-3 ${flexJustifyClass}`}>
            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-gold font-bold bg-gold/10 px-3 py-1 border border-gold/30 backdrop-blur-sm">
              <SunDisc size={14} variant="gold" />
              <span>{eyebrow}</span>
            </div>

            {badge && (
              <span className="font-mono text-xs uppercase tracking-widest text-red-400 bg-red-600/20 border border-red-500/40 px-3 py-1 font-bold animate-pulse backdrop-blur-sm">
                {badge}
              </span>
            )}
          </div>

          {/* Headlines */}
          <div className="space-y-1 w-full">
            <h1
              className="font-clash text-4xl sm:text-6xl lg:text-7xl uppercase tracking-tight font-bold leading-none text-bone drop-shadow-md"
              style={{ color: current?.headline1Color || undefined }}
            >
              {headline1}
            </h1>
            {headline2 && (
              <h2
                className="font-clash text-4xl sm:text-6xl lg:text-7xl uppercase tracking-tight font-bold leading-none text-gold drop-shadow-md"
                style={{ color: current?.headline2Color || undefined }}
              >
                {headline2}
              </h2>
            )}
          </div>

          {/* Subtitle / Description */}
          <p
            className="font-space text-sm sm:text-base font-light max-w-xl leading-relaxed text-bone/90 drop-shadow"
            style={{ color: current?.subColor || undefined }}
          >
            {sub}
          </p>

          {/* Action Buttons: Glassmorphism Navbar Style */}
          <div className={`flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4 font-mono text-xs font-bold uppercase tracking-wider w-full ${flexJustifyClass}`}>
            {/* Primary Action Button - Gold Glass */}
            <button
              onClick={() => navigate(primaryBtnLink)}
              className="py-4 px-8 bg-void/50 hover:bg-gold text-gold hover:text-void border border-gold/70 hover:border-gold transition-all duration-300 backdrop-blur-md shadow-xl shadow-gold/10 hover:shadow-gold/30 flex items-center justify-center gap-2.5 text-sm font-bold tracking-wider"
            >
              <ShoppingBag size={18} />
              <span>{primaryBtnText}</span>
              {isRtl ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
            </button>

            {/* Secondary Action Button - Frosted Glass */}
            <button
              onClick={() => navigate(secondaryBtnLink)}
              className="py-4 px-8 bg-void/50 hover:bg-stone/80 border border-grave/80 text-bone hover:border-gold hover:text-gold transition-all duration-300 backdrop-blur-md shadow-xl flex items-center justify-center gap-2.5 text-sm font-bold tracking-wider"
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
