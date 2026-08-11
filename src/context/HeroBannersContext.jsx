import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const HeroBannersContext = createContext();

export const INITIAL_HERO_SLIDES = [
  {
    id: 'hero-slide-luxe',
    eyebrowEn: 'DUAT / LUXE COLLECTION',
    eyebrowAr: 'دوات / الفئة الفاخرة',
    headline1En: 'THROUGH THE NIGHT,',
    headline1Ar: 'نعدّي الليل،',
    headline2En: 'BORN AT DAWN.',
    headline2Ar: 'ونطلع نور.',
    subEn: 'Luxury Phone Cases + 3D Epoxy Dome Motifs. Made to order in Egypt.',
    subAr: 'جرابات الفئة الفاخرة + ملصقات إيبوكسي مجسّمة. الجراب هو الكانفس — وإنت اللي بتحكي.',
    badgeEn: 'LUXE CATEGORY',
    badgeAr: 'فئة LUXE الفاخرة',
    imageUrl: 'https://res.cloudinary.com/ikim5u08/image/upload/f_auto,q_auto/v1785712166/B1_u3veqk.jpg',
    ctaPrimaryTextEn: 'SHOP LUXE',
    ctaPrimaryTextAr: 'تسوق الفئة الفاخرة',
    ctaPrimaryLink: '/shop',
    ctaSecondaryTextEn: 'BUILD A CASE',
    ctaSecondaryTextAr: 'صمم درعك بنفسك',
    ctaSecondaryLink: '/customizer',
    textAlign: 'left',
    headline1Color: '#EDE4D3',
    headline2Color: '#E8A33D',
    subColor: '#8E98BF',
    overlayStrength: 'medium',
    posX: 0,
    posY: 30,
    maxWidth: 46,
    fontSizeScale: 92,
    is_active: true,
    sort_order: 1
  },
  {
    id: 'hero-slide-nineties',
    eyebrowEn: 'DUAT / NINETIES VIBES',
    eyebrowAr: 'دوات / فئة التسعيناتي',
    headline1En: '90s NOSTALGIA & POP,',
    headline1Ar: 'نوستالجيا التسعينات،',
    headline2En: 'IN 3D EPOXY DOMES.',
    headline2Ar: 'بلمسة مجسمة.',
    subEn: 'Retro vintage Egyptian pop culture icons in raised 3D epoxy domes.',
    subAr: 'أصالة التسعينات والرموز المصرية الكلاسيكية مع استيكرات الإيبوكسي البارزة.',
    badgeEn: 'NINETIES 90S',
    badgeAr: 'فئة التسعيناتي 90s',
    imageUrl: 'https://res.cloudinary.com/ikim5u08/image/upload/f_auto,q_auto/v1785712166/B1_u3veqk.jpg',
    ctaPrimaryTextEn: 'SHOP NINETIES',
    ctaPrimaryTextAr: 'تسوق فئة التسعيناتي',
    ctaPrimaryLink: '/shop',
    ctaSecondaryTextEn: 'STICKER BUILDER',
    ctaSecondaryTextAr: 'صمم استيكرك',
    ctaSecondaryLink: '/sticker-builder',
    textAlign: 'left',
    headline1Color: '#EDE4D3',
    headline2Color: '#E8A33D',
    subColor: '#8E98BF',
    overlayStrength: 'medium',
    posX: 0,
    posY: 30,
    maxWidth: 46,
    fontSizeScale: 92,
    is_active: true,
    sort_order: 2
  },
  {
    id: 'hero-slide-youth',
    eyebrowEn: 'DUAT / YOUTH STREETWEAR',
    eyebrowAr: 'دوات / الفئة الشبابية',
    headline1En: 'BOLD & UNAPOLOGETIC,',
    headline1Ar: 'عصري، جريء،',
    headline2En: 'EXPRESS YOURSELF.',
    headline2Ar: 'وبيعدّي الحدود.',
    subEn: 'Vibrant neon street aesthetics & high-impact 3D epoxy dome badges.',
    subAr: 'تشكيلة الجرابات والاستيكرات الشبابية الأكثر جرأة وحيوية لتعبير فريد عن شخصيتك.',
    badgeEn: 'YOUTH COLLECTION',
    badgeAr: 'الفئة الشبابية YOUTH',
    imageUrl: 'https://res.cloudinary.com/ikim5u08/image/upload/f_auto,q_auto/v1785712166/B1_u3veqk.jpg',
    ctaPrimaryTextEn: 'SHOP YOUTH',
    ctaPrimaryTextAr: 'تسوق الفئة الشبابية',
    ctaPrimaryLink: '/shop',
    ctaSecondaryTextEn: 'CUSTOMIZER',
    ctaSecondaryTextAr: 'افتح أداة التصميم',
    ctaSecondaryLink: '/customizer',
    textAlign: 'left',
    headline1Color: '#EDE4D3',
    headline2Color: '#E8A33D',
    subColor: '#8E98BF',
    overlayStrength: 'medium',
    posX: 0,
    posY: 30,
    maxWidth: 46,
    fontSizeScale: 92,
    is_active: true,
    sort_order: 3
  }
];

function mapFromDb(row) {
  if (!row) return null;
  const data = row.data && typeof row.data === 'object' ? row.data : {};
  const isActiveVal = row.is_active !== undefined ? Boolean(row.is_active) : (data.is_active !== undefined ? Boolean(data.is_active) : (data.isActive !== undefined ? Boolean(data.isActive) : true));
  return {
    ...data,
    id: row.id || data.id,
    is_active: isActiveVal,
    isActive: isActiveVal,
    eyebrowEn: data.eyebrowEn || row.eyebrow_en || '',
    eyebrowAr: data.eyebrowAr || row.eyebrow_ar || '',
    headline1En: data.headline1En || row.headline1_en || '',
    headline1Ar: data.headline1Ar || row.headline1_ar || '',
    headline2En: data.headline2En || row.headline2_en || '',
    headline2Ar: data.headline2Ar || row.headline2_ar || '',
    subEn: data.subEn || row.sub_en || '',
    subAr: data.subAr || row.sub_ar || '',
    badgeEn: data.badgeEn || row.badge_en || row.badge_ar || '',
    badgeAr: data.badgeAr || row.badge_ar || '',
    imageUrl: data.imageUrl || row.image_url || 'https://res.cloudinary.com/ikim5u08/image/upload/f_auto,q_auto/v1785712166/B1_u3veqk.jpg',
    mobileImageUrl: data.mobileImageUrl || row.mobile_image_url || data.mobile_image_url || '',
    ctaPrimaryTextEn: data.ctaPrimaryTextEn || row.cta_primary_text_en || '',
    ctaPrimaryTextAr: data.ctaPrimaryTextAr || row.cta_primary_text_ar || '',
    ctaPrimaryLink: data.ctaPrimaryLink || row.cta_primary_link || '',
    ctaSecondaryTextEn: data.ctaSecondaryTextEn || row.cta_secondary_text_en || '',
    ctaSecondaryTextAr: data.ctaSecondaryTextAr || row.cta_secondary_text_ar || '',
    ctaSecondaryLink: data.ctaSecondaryLink || row.cta_secondary_link || '',
    textAlign: data.textAlign || row.text_align || 'left',
    headline1Color: data.headline1Color || row.headline1_color || '#EDE4D3',
    headline2Color: data.headline2Color || row.headline2_color || '#E8A33D',
    subColor: data.subColor || row.sub_color || '#8E98BF',
    overlayStrength: data.overlayStrength || row.overlay_strength || 'medium',
    posX: data.posX !== undefined ? Number(data.posX) : (row.pos_x !== undefined ? Number(row.pos_x) : 0),
    posY: data.posY !== undefined ? Number(data.posY) : (row.pos_y !== undefined ? Number(row.pos_y) : 30),
    maxWidth: data.maxWidth !== undefined ? Number(data.maxWidth) : (row.max_width !== undefined ? Number(row.max_width) : 46),
    fontSizeScale: data.fontSizeScale !== undefined ? Number(data.fontSizeScale) : (row.font_size_scale !== undefined ? Number(row.font_size_scale) : 92),
    sort_order: row.sort_order ?? data.sort_order ?? 0
  };
}

function mapToDb(slide, index = 0) {
  const isActiveVal = slide.is_active !== undefined ? Boolean(slide.is_active) : (slide.isActive !== undefined ? Boolean(slide.isActive) : true);
  return {
    id: slide.id,
    eyebrow_en: slide.eyebrowEn || slide.eyebrow_en || '',
    eyebrow_ar: slide.eyebrowAr || slide.eyebrow_ar || '',
    headline1_en: slide.headline1En || slide.headline1_en || '',
    headline1_ar: slide.headline1Ar || slide.headline1_ar || '',
    headline2_en: slide.headline2En || slide.headline2_en || '',
    headline2_ar: slide.headline2Ar || slide.headline2_ar || '',
    sub_en: slide.subEn || slide.sub_en || '',
    sub_ar: slide.subAr || slide.sub_ar || '',
    badge_en: slide.badgeEn || slide.badge_en || '',
    badge_ar: slide.badgeAr || slide.badge_ar || '',
    image_url: slide.imageUrl || slide.image_url || 'https://res.cloudinary.com/ikim5u08/image/upload/f_auto,q_auto/v1785712166/B1_u3veqk.jpg',
    mobile_image_url: slide.mobileImageUrl || slide.mobile_image_url || '',
    cta_primary_text_en: slide.ctaPrimaryTextEn || slide.cta_primary_text_en || '',
    cta_primary_text_ar: slide.ctaPrimaryTextAr || slide.cta_primary_text_ar || '',
    cta_primary_link: slide.ctaPrimaryLink || slide.cta_primary_link || '',
    cta_secondary_text_en: slide.ctaSecondaryTextEn || slide.cta_secondary_text_en || '',
    cta_secondary_text_ar: slide.ctaSecondaryTextAr || slide.cta_secondary_text_ar || '',
    cta_secondary_link: slide.ctaSecondaryLink || slide.cta_secondary_link || '',
    is_active: isActiveVal,
    sort_order: slide.sort_order ?? index + 1,
    data: {
      ...slide,
      textAlign: slide.textAlign || 'left',
      headline1Color: slide.headline1Color || '#EDE4D3',
      headline2Color: slide.headline2Color || '#E8A33D',
      subColor: slide.subColor || '#8E98BF',
      overlayStrength: slide.overlayStrength || 'medium',
      posX: slide.posX !== undefined ? Number(slide.posX) : 0,
      posY: slide.posY !== undefined ? Number(slide.posY) : 30,
      maxWidth: slide.maxWidth !== undefined ? Number(slide.maxWidth) : 46,
      fontSizeScale: slide.fontSizeScale !== undefined ? Number(slide.fontSizeScale) : 92,
      is_active: isActiveVal,
      isActive: isActiveVal
    }
  };
}

const HERO_SLIDES_STORAGE_KEY = 'duat_hero_slides_v60';

function cleanLegacyStorage() {
  try {
    for (let i = 1; i < 60; i++) {
      localStorage.removeItem(`duat_hero_slides_v${i}`);
    }
    localStorage.removeItem('duat_hero_slides');
  } catch (e) {}
}

function sanitizeSlideUrls(slides) {
  if (!Array.isArray(slides)) return slides;
  return slides.map((s) => {
    if (!s || typeof s !== 'object') return s;
    let url = s.imageUrl || s.image_url || s.image || '';
    if (!url || url === '/banners/nineties.png' || url.includes('nineties.png') || url.includes('B1_DarkNight')) {
      url = 'https://res.cloudinary.com/ikim5u08/image/upload/f_auto,q_auto/v1785712166/B1_u3veqk.jpg';
    } else if (url === '/banners/youth.png' || url.includes('youth.png')) {
      url = 'https://res.cloudinary.com/ikim5u08/image/upload/f_auto,q_auto/v1785712166/B1_u3veqk.jpg';
    }
    const h1Color = s.headline1Color === '#00F0FF' ? '#EDE4D3' : s.headline1Color;
    const h2Color = s.headline2Color === '#FF007A' ? '#E8A33D' : s.headline2Color;
    return {
      ...s,
      imageUrl: url,
      image_url: url,
      headline1Color: h1Color,
      headline2Color: h2Color
    };
  });
}

function loadLocalSlides() {
  try {
    cleanLegacyStorage();
    const saved = localStorage.getItem(HERO_SLIDES_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const valid = parsed.filter((item) => item && typeof item === 'object' && item.id);
        if (valid.length > 0) {
          const sanitized = sanitizeSlideUrls(valid);
          saveLocalSlides(sanitized);
          return sanitized;
        }
      }
    }
  } catch (e) {
    // ignore
  }
  return null;
}

function saveLocalSlides(slides) {
  try {
    localStorage.setItem(HERO_SLIDES_STORAGE_KEY, JSON.stringify(slides));
  } catch (e) {
    // ignore
  }
}

async function saveSlideToSupabase(slide, index = 0) {
  if (!slide || !slide.id) return;
  const fullPayload = mapToDb(slide, index);
  try {
    const { error: fullErr } = await supabase.from('hero_slides').upsert(fullPayload, { onConflict: 'id' });
    if (fullErr) {
      const minimalPayload = {
        id: String(slide.id),
        is_active: slide.is_active !== undefined ? Boolean(slide.is_active) : true,
        sort_order: slide.sort_order ?? index + 1,
        data: slide
      };
      await supabase.from('hero_slides').upsert(minimalPayload, { onConflict: 'id' });
    }
  } catch (err) {
    // Ignore Supabase connection errors gracefully
  }
}

export function HeroBannersProvider({ children }) {
  const [slides, setSlides] = useState(() => loadLocalSlides() || INITIAL_HERO_SLIDES);
  const [loading, setLoading] = useState(true);

  const fetchSlides = async () => {
    setLoading(true);
    try {
      // 1. Check local storage first for immediate user edits persistence
      const local = loadLocalSlides();
      if (local && Array.isArray(local) && local.length > 0) {
        setSlides(local);
      }

      // 2. Load from Supabase if available
      let query = supabase.from('hero_slides').select('*');
      try {
        query = query.order('sort_order', { ascending: true });
      } catch (e) {
        // ignore order error
      }
      const { data, error } = await query;
      if (!error && Array.isArray(data) && data.length > 0) {
        const fetched = data.map(mapFromDb).filter(Boolean);
        const filtered = fetched.filter((s) => s.id !== 'hero-slide-2');
        if (filtered.length > 0) {
          setSlides(filtered);
          saveLocalSlides(filtered);
          setLoading(false);
          return;
        }
      }

      // 3. Fallback to local or initial slides
      if (!local || local.length === 0) {
        setSlides(INITIAL_HERO_SLIDES);
        saveLocalSlides(INITIAL_HERO_SLIDES);
      }
    } catch (err) {
      console.warn('Hero slides load fallback:', err);
      const local = loadLocalSlides();
      setSlides(local && local.length > 0 ? local : INITIAL_HERO_SLIDES);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  const addSlide = async (slideData) => {
    const newSlide = {
      ...slideData,
      id: slideData.id || `hero-slide-${Date.now()}`
    };
    setSlides((prev) => {
      const updated = [newSlide, ...prev];
      saveLocalSlides(updated);
      return updated;
    });

    await saveSlideToSupabase(newSlide, 0);
    return newSlide;
  };

  const updateSlide = async (id, updatedFields) => {
    let targetSlide = null;
    let targetIdx = 0;
    setSlides((prev) => {
      const updatedList = prev.map((slide, idx) => {
        if (slide.id === id) {
          const updated = { ...slide, ...updatedFields };
          targetSlide = updated;
          targetIdx = idx;
          return updated;
        }
        return slide;
      });
      saveLocalSlides(updatedList);
      return updatedList;
    });

    if (targetSlide) {
      await saveSlideToSupabase(targetSlide, targetIdx);
    }
  };

  const toggleSlideVisibility = async (id) => {
    let targetSlide = null;
    let targetIdx = 0;
    setSlides((prev) => {
      const updatedList = prev.map((slide, idx) => {
        if (slide.id === id) {
          const currentStatus = slide.is_active !== undefined ? Boolean(slide.is_active) : (slide.isActive !== undefined ? Boolean(slide.isActive) : true);
          const newStatus = !currentStatus;
          const updated = { ...slide, is_active: newStatus, isActive: newStatus };
          targetSlide = updated;
          targetIdx = idx;
          return updated;
        }
        return slide;
      });
      saveLocalSlides(updatedList);
      return updatedList;
    });

    if (targetSlide) {
      await saveSlideToSupabase(targetSlide, targetIdx);
    }
  };

  const deleteSlide = async (id) => {
    setSlides((prev) => {
      const updatedList = prev.filter((slide) => slide.id !== id);
      saveLocalSlides(updatedList);
      return updatedList;
    });
    try {
      const { error } = await supabase.from('hero_slides').delete().eq('id', id);
      if (error) console.error('Supabase delete hero slide error:', error);
    } catch (err) {
      console.error('Supabase delete hero slide error:', err);
    }
  };

  const resetSlides = async () => {
    localStorage.removeItem(HERO_SLIDES_STORAGE_KEY);
    setSlides(INITIAL_HERO_SLIDES);
    saveLocalSlides(INITIAL_HERO_SLIDES);
    for (let i = 0; i < INITIAL_HERO_SLIDES.length; i++) {
      await saveSlideToSupabase(INITIAL_HERO_SLIDES[i], i);
    }
  };

  return (
    <HeroBannersContext.Provider
      value={{
        slides,
        loading,
        addSlide,
        updateSlide,
        toggleSlideVisibility,
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
