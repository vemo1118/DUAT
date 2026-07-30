import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { SunDisc } from './SunDisc';
import { ArrowRight, ArrowLeft, ChevronLeft, ChevronRight, ShoppingBag, Sparkles, ShieldCheck, Truck, Clock } from 'lucide-react';

export const HERO_SLIDES = [
  {
    id: 'slide-1',
    eyebrowEn: 'DUAT / PASSAGE COLLECTION',
    eyebrowAr: 'دوات / تشكيلة العبور',
    titleEn: 'THROUGH THE NIGHT \nBORN AT DAWN.',
    titleAr: 'عَبْرَ اللَّيْلِ \nيُولَدُ مَعَ الفَجْرِ.',
    subEn: 'Objects for the night crossing. Precision optical acrylic cases, 3D epoxy slogan pills, and gold passage charms. Crafted in Egypt.',
    subAr: 'معدات فاخرة للعبور التكتيكي. جراب أكريليك بصري عالي الدقة، ملصقات إيبوكسي مجسمة، وتواشيح نحاسية مطلية بالذهب.',
    ctaTextEn: 'SHOP NOW',
    ctaTextAr: 'تسوق الآن',
    ctaLink: '/shop',
    secondaryCtaEn: 'BUILD YOUR CASE',
    secondaryCtaAr: 'صمّم جرابك',
    secondaryCtaLink: '/customize',
    image: '/images/transparent_hero_case.png',
    badgeEn: 'C.2026 • EGYPT',
    badgeAr: 'اصدار ٢٠٢٦ • مصر'
  },
  {
    id: 'slide-2',
    eyebrowEn: 'DUAT / THE FORGE',
    eyebrowAr: 'دوات / المشغل التكتيكي',
    titleEn: 'CRAFT YOUR OWN \nCUSTOM ARMOR.',
    titleAr: 'صَمِّمْ دِرْعَكَ \nالتَّكْتِيكِيَّ الخَاصَّ.',
    subEn: 'Interactive 3D dome builder. Select phone model, armor finish, raised slogan pills, Arabic motifs, and custom engravings.',
    subAr: 'أداة التصميم المجسمة ثلاثية الأبعاد. اختر موديل موبايلك، إنهاء الدرع، ملصقات الإيبوكسي والخطوط العربية.',
    ctaTextEn: 'START BUILDING',
    ctaTextAr: 'ابنِ جرابك الآن',
    ctaLink: '/customize',
    secondaryCtaEn: 'VIEW GALLERY',
    secondaryCtaAr: 'معرض الأقسام',
    secondaryCtaLink: '/shop',
    image: '/images/stickers.png',
    badgeEn: '3D DOME BUILDER',
    badgeAr: 'أداة الإيبوكسي المجسمة'
  },
  {
    id: 'slide-3',
    eyebrowEn: 'DUAT / GOLD RING ARMOR',
    eyebrowAr: 'دوات / درع حلقة الذهب',
    titleEn: '18K GOLD BEZEL \nMAGSAFE DAWN.',
    titleAr: 'إِطَارُ الدَّهَبِ عِيَار ١٨ \nمَاكُ سِيف الفَجْرِ.',
    subEn: 'High-density stealth black armor with 18k anodized dawn-gold camera ring and N52 neodymium alignment magnets.',
    subAr: 'درع أسود عالي الكثافة مع حلقة كاميرا مؤكسدة بذهب الفجر عيار ١٨ ومغناطيس N52 الفائق.',
    ctaTextEn: 'EXPLORE CASES',
    ctaTextAr: 'استكشف الجرابات',
    ctaLink: '/shop',
    secondaryCtaEn: 'CUSTOMIZE',
    secondaryCtaAr: 'صمّم الآن',
    secondaryCtaLink: '/customize',
    image: '/images/charms.png',
    badgeEn: 'STEALTH & GOLD',
    badgeAr: 'أسود مطفي وذهب'
  }
];

export const HeroSlider = () => {
  const { lang } = useLanguage();
  const { theme } = useTheme();
  const isDawn = theme === 'dawn';

  const isAr = lang === 'ar';
  const isRtl = isAr;
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;
  const navigate = useNavigate();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [isPaused]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? HERO_SLIDES.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const currentSlide = HERO_SLIDES[currentIndex];

  const scrimBg = isDawn
    ? isRtl
      ? 'linear-gradient(to top left, rgba(250, 246, 240, 0.75) 0%, rgba(250, 246, 240, 0.35) 45%, transparent 75%)'
      : 'linear-gradient(to top right, rgba(250, 246, 240, 0.75) 0%, rgba(250, 246, 240, 0.35) 45%, transparent 75%)'
    : isRtl
      ? 'linear-gradient(to top left, rgba(10, 12, 22, 0.7) 0%, rgba(10, 12, 22, 0.3) 45%, transparent 75%)'
      : 'linear-gradient(to top right, rgba(10, 12, 22, 0.7) 0%, rgba(10, 12, 22, 0.3) 45%, transparent 75%)';

  return (
    <section
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className={`relative w-full min-h-[82vh] lg:min-h-[88vh] ${isDawn ? 'bg-[#FAF6F0] text-[#0A0C16]' : 'bg-[#0A0C16] text-[#EDE4D3]'} overflow-hidden flex flex-col justify-between border-b border-grave`}
    >
      {/* BACKGROUND SLIDE IMAGES STACK (FULL BLEED COVER) */}
      <div className="absolute inset-0 z-0">
        {HERO_SLIDES.map((slide, idx) => {
          const isActive = idx === currentIndex;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            >
              {/* Background Image / Texture */}
              <div className={`absolute inset-0 ${isDawn ? 'bg-[#FAF6F0]' : 'bg-[#0A0C16]'}`}>
                <img
                  src={slide.image}
                  alt={isAr ? slide.titleAr : slide.titleEn}
                  className="w-full h-full object-cover object-center scale-105 transition-transform duration-10000 ease-linear"
                />
              </div>

              {/* HEAVY GRADIENT SCRIM OVERLAY (Theme-aware legibility scrim) */}
              <div
                className="absolute inset-0 z-10 pointer-events-none"
                style={{ background: scrimBg }}
              />
            </div>
          );
        })}
      </div>

      {/* AMBIENT GLOW OVERLAY */}
      <div className={`absolute top-1/4 left-1/4 w-[500px] h-[500px] ${isDawn ? 'bg-[#C97B22]/[0.08]' : 'bg-[#E8A33D]/[0.1]'} rounded-full blur-[140px] pointer-events-none z-10`} />

      {/* MAIN SLIDE CONTENT OVERLAY */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full flex-1 flex flex-col justify-center py-16 sm:py-24">
        <div className="max-w-2xl space-y-6 sm:space-y-8 animate-in fade-in duration-700">
          
          {/* Eyebrow */}
          <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.25em] text-gold font-bold">
            <SunDisc size={18} variant="gold" />
            <span>{isAr ? currentSlide.eyebrowAr : currentSlide.eyebrowEn}</span>
          </div>

          {/* Headline */}
          <h1 className={`font-clash text-4xl sm:text-6xl lg:text-[76px] uppercase ${isDawn ? 'text-[#0A0C16]' : 'text-[#EDE4D3]'} leading-[1.05] drop-shadow-xl tracking-tight font-bold whitespace-pre-line`}>
            {isAr ? currentSlide.titleAr : currentSlide.titleEn}
          </h1>

          {/* Subcopy */}
          <p className={`font-space text-base sm:text-xl ${isDawn ? 'text-[#0A0C16]/90' : 'text-[#EDE4D3]/90'} font-medium leading-relaxed max-w-xl drop-shadow-sm`}>
            {isAr ? currentSlide.subAr : currentSlide.subEn}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <button
              onClick={() => navigate(currentSlide.ctaLink)}
              className="btn-primary group text-xs sm:text-sm py-4 px-8 flex items-center justify-center gap-3 shadow-[0_4px_30px_rgba(232,163,61,0.3)] min-h-[48px]"
            >
              <ShoppingBag size={18} />
              <span>{isAr ? currentSlide.ctaTextAr : currentSlide.ctaTextEn}</span>
              <ArrowIcon size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
            
            {currentSlide.secondaryCtaLink && (
              <button
                onClick={() => navigate(currentSlide.secondaryCtaLink)}
                className="btn-ghost text-xs sm:text-sm py-4 px-8 flex items-center justify-center gap-3 border-gold/50 text-gold hover:bg-gold hover:text-void min-h-[48px]"
              >
                <Sparkles size={18} />
                <span>{isAr ? currentSlide.secondaryCtaAr : currentSlide.secondaryCtaEn}</span>
              </button>
            )}
          </div>

        </div>
      </div>

      {/* BOTTOM CONTROLS & TRUST BAR */}
      <div className={`relative z-20 w-full border-t border-grave/60 ${isDawn ? 'bg-[#E5DFC5]/90 text-[#0A0C16]' : 'bg-[#0A0C16]/80 text-[#EDE4D3]'} backdrop-blur-md`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Trust Signals Row */}
          <div className="grid grid-cols-3 gap-4 font-mono text-[10px] sm:text-xs text-ash uppercase font-medium">
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-gold flex-shrink-0" />
              <span>{isAr ? 'ضمان لمدة سنة' : '1-Year Warranty'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck size={16} className="text-gold flex-shrink-0" />
              <span>{isAr ? 'شحن لكافة المحافظات' : 'Fast Shipping'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-gold flex-shrink-0" />
              <span>{isAr ? 'صنع في مصر' : 'Made In Egypt'}</span>
            </div>
          </div>

          {/* Slide Navigation Controls: Manual Dots + Arrow Buttons */}
          <div className="flex items-center gap-4">
            {/* Dots */}
            <div className="flex items-center gap-2">
              {HERO_SLIDES.map((slide, idx) => (
                <button
                  key={slide.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    idx === currentIndex ? 'w-8 bg-gold' : 'w-2 bg-grave hover:bg-ash'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            {/* Arrows */}
            <div className="flex items-center gap-1.5 border-l border-grave pl-3">
              <button
                onClick={handlePrev}
                className="p-2 border border-grave text-bone hover:border-gold hover:text-gold transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center bg-stone"
                aria-label="Previous slide"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={handleNext}
                className="p-2 border border-grave text-bone hover:border-gold hover:text-gold transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center bg-stone"
                aria-label="Next slide"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

        </div>
      </div>

    </section>
  );
};

export default HeroSlider;
