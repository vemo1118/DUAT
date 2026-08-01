import React, { createContext, useContext, useState, useEffect } from 'react';

const HeroBannersContext = createContext();

const STORAGE_KEY = 'duat_hero_slides';

export const INITIAL_HERO_SLIDES = [
  {
    id: 'hero-slide-1',
    eyebrowEn: 'DUAT / THE FORGE',
    eyebrowAr: 'دوات / كور الفن والتشطيب',
    headline1En: 'CRAFT YOUR OWN',
    headline1Ar: 'صمم درعك الخاص',
    headline2En: 'CUSTOM ARMOR.',
    headline2Ar: 'بلمسة فرعونية فاخرة.',
    subEn: 'Interactive 3D dome builder. Select phone model, armor finish, raised slogan pills, Arabic motifs, and custom engravings.',
    subAr: 'أداة التصميم التفاعلية ثلاثية الأبعاد. اختر موديل هاتفك، التقفيل الفاخر، والملصقات المجسمة.',
    badgeEn: '3D BUILDER',
    badgeAr: 'أداة 3D الحصرية',
    imageUrl: '/images/transparent_hero_case.png',
    ctaPrimaryTextEn: 'START BUILDING',
    ctaPrimaryTextAr: 'ابدأ التصميم الآن',
    ctaPrimaryLink: '/customize',
    ctaSecondaryTextEn: 'VIEW GALLERY',
    ctaSecondaryTextAr: 'معرض الكتالوج',
    ctaSecondaryLink: '/shop'
  },
  {
    id: 'hero-slide-2',
    eyebrowEn: 'SPECIAL SUMMER DROP',
    eyebrowAr: 'عرض خاص لفترة محدودة',
    headline1En: 'EXCLUSIVE 30% OFF',
    headline1Ar: 'خصم ٣٠٪ حصري',
    headline2En: 'ON ALL CASES.',
    headline2Ar: 'على جميع الجرابات.',
    subEn: 'Hand-crafted luxury phone cases with raised epoxy motifs. Premium 18k anodized finish meets Egyptian heritage.',
    subAr: 'جرابات مصنوعة يدوياً في مصر بخامات فاخرة تشطيب إطار ذهبي وضمان استبدال كامل سنة.',
    badgeEn: 'OFFER 30% OFF',
    badgeAr: 'عرض خاص 30%',
    imageUrl: '/images/stickers.png',
    ctaPrimaryTextEn: 'SHOP COLLECTION',
    ctaPrimaryTextAr: 'تسوق العروض الآن',
    ctaPrimaryLink: '/shop',
    ctaSecondaryTextEn: 'TRACK YOUR ORDER',
    ctaSecondaryTextAr: 'تتبع طلبك الحقيقي',
    ctaSecondaryLink: '/track-order'
  }
];

export function HeroBannersProvider({ children }) {
  const [slides, setSlides] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const sanitized = parsed.map((s, idx) => {
            const fallback = INITIAL_HERO_SLIDES[idx % INITIAL_HERO_SLIDES.length];
            return {
              ...fallback,
              ...s,
              imageUrl: s.imageUrl || fallback.imageUrl
            };
          });
          return sanitized;
        }
      }
    } catch (e) {
      console.error('Failed to load hero slides from localStorage:', e);
    }
    return INITIAL_HERO_SLIDES;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(slides));
    } catch (e) {
      console.error('Failed to save hero slides to localStorage:', e);
    }
  }, [slides]);

  const addSlide = (slideData) => {
    const newSlide = {
      ...slideData,
      id: slideData.id || `hero-slide-${Date.now()}`
    };
    setSlides((prev) => [newSlide, ...prev]);
    return newSlide;
  };

  const updateSlide = (id, updatedFields) => {
    setSlides((prev) =>
      prev.map((slide) => (slide.id === id ? { ...slide, ...updatedFields } : slide))
    );
  };

  const deleteSlide = (id) => {
    setSlides((prev) => prev.filter((slide) => slide.id !== id));
  };

  const resetSlides = () => {
    setSlides(INITIAL_HERO_SLIDES);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <HeroBannersContext.Provider
      value={{
        slides,
        addSlide,
        updateSlide,
        deleteSlide,
        resetSlides
      }}
    >
      {children}
    </HeroBannersContext.Provider>
  );
}

export function useHeroBanners() {
  const context = useContext(HeroBannersContext);
  if (!context) {
    throw new Error('useHeroBanners must be used within a HeroBannersProvider');
  }
  return context;
}
