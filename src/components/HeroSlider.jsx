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

  const bgImage = current?.imageUrl || current?.image || 'https://res.cloudinary.com/ikim5u08/image/upload/f_auto,q_auto/v1785712166/B1_u3veqk.jpg';

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
      className="hero-section relative w-full bg-[#050505] border-b border-[#2E2823] overflow-hidden min-h-[620px] sm:min-h-[720px] lg:min-h-[800px] flex items-center font-sans text-[#F0EBE0]"
    >
      {/* Full-Bleed Background Image Layer */}
      {bgImage ? (
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src={bgImage}
            alt="Hero Background"
            className="w-full h-full object-cover object-center transition-transform duration-700 brightness-105 contrast-105"
          />
          {/* Filmic High-Contrast Gradient Vignette Overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/85 to-transparent sm:w-4/5" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/95 via-transparent to-[#050505]/40" />
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
            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-[#D4AF37] font-bold bg-[#D4AF37]/15 px-3.5 py-1.5 border border-[#D4AF37]/40 backdrop-blur-md rounded-sm shadow-md">
              <SunDisc size={14} variant="gold" />
              <span>{eyebrow}</span>
            </div>

            {badge && (
              <span className="font-mono text-xs uppercase tracking-widest text-red-300 bg-red-950/70 border border-red-500/50 px-3.5 py-1.5 font-bold animate-pulse backdrop-blur-md rounded-sm shadow-md">
                {badge}
              </span>
            )}
          </div>

          {/* Headlines */}
          <div className="space-y-1 w-full">
            <h1
              className="font-clash text-4xl sm:text-6xl lg:text-7xl uppercase tracking-tight font-bold leading-none text-[#F0EBE0] drop-shadow-xl"
              style={{ color: current?.headline1Color || '#F0EBE0' }}
            >
              {headline1}
            </h1>
            {headline2 && (
              <h2
                className="font-clash text-4xl sm:text-6xl lg:text-7xl uppercase tracking-tight font-bold leading-none text-[#D4AF37] drop-shadow-xl"
                style={{ color: current?.headline2Color || '#D4AF37' }}
              >
                {headline2}
              </h2>
            )}
          </div>

          {/* Subtitle / Description */}
          <p
            className="font-space text-sm sm:text-base font-normal max-w-xl leading-relaxed text-[#F0EBE0]/95 drop-shadow-lg"
            style={{ color: current?.subColor || '#F0EBE0' }}
          >
            {sub}
          </p>

          {/* Action Buttons: High Contrast Gold & Glass Styles */}
          <div className={`flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4 font-mono text-xs font-bold uppercase tracking-wider w-full ${flexJustifyClass}`}>
            {/* Primary Action Button - Solid Gold */}
            <button
              onClick={() => navigate(primaryBtnLink)}
              className="py-4 px-8 bg-[#D4AF37] hover:bg-[#E0B84C] text-[#0A0C16] font-bold border border-[#D4AF37] transition-all duration-300 shadow-xl shadow-gold/20 flex items-center justify-center gap-2.5 text-sm tracking-wider min-h-[48px] rounded-sm"
            >
              <ShoppingBag size={18} />
              <span>{primaryBtnText}</span>
              {isRtl ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
            </button>

            {/* Secondary Action Button - High Contrast Glass */}
            <button
              onClick={() => navigate(secondaryBtnLink)}
              className="py-4 px-8 bg-black/60 hover:bg-[#14110F] border border-[#D4AF37]/50 hover:border-[#D4AF37] text-[#F0EBE0] hover:text-[#D4AF37] transition-all duration-300 backdrop-blur-md shadow-xl flex items-center justify-center gap-2.5 text-sm tracking-wider min-h-[48px] rounded-sm"
            >
              <Sparkles size={16} className="text-[#D4AF37]" />
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
