import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const HeroBannersContext = createContext();

export const INITIAL_HERO_SLIDES = [
  {
    id: 'hero-slide-1',
    eyebrowEn: 'DUAT / EGYPT',
    eyebrowAr: 'دوات / مصر',
    headline1En: 'THROUGH THE NIGHT,',
    headline1Ar: 'نعدّي الليل،',
    headline2En: 'BORN AT DAWN.',
    headline2Ar: 'ونطلع نور.',
    subEn: '3D epoxy dome stickers, made to order in Egypt. The case is just the canvas — you tell the story.',
    subAr: 'استيكرات إيبوكسي مجسّمة، تصنيع حسب الطلب في مصر. الجراب مجرد كانفس — وإنت اللي بتحكي.',
    badgeEn: 'MADE TO ORDER',
    badgeAr: 'تصنيع حسب الطلب',
    imageUrl: 'https://res.cloudinary.com/ikim5u08/image/upload/f_auto,q_auto/v1785712166/B1_u3veqk.jpg',
    ctaPrimaryTextEn: 'SHOP STICKERS',
    ctaPrimaryTextAr: 'تسوق الاستيكرات',
    ctaPrimaryLink: '/shop',
    ctaSecondaryTextEn: 'BUILD A CASE',
    ctaSecondaryTextAr: 'صمم جرابك',
    ctaSecondaryLink: '/customize',
    textAlign: 'left',
    headline1Color: '',
    headline2Color: '',
    subColor: '',
    overlayStrength: 'medium',
    posX: 0,
    posY: 30,
    maxWidth: 46,
    fontSizeScale: 92,
    is_active: true,
    sort_order: 1
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

const HERO_SLIDES_STORAGE_KEY = 'duat_hero_slides_v9';

function loadLocalSlides() {
  try {
    const saved = localStorage.getItem(HERO_SLIDES_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const valid = parsed.filter((item) => item && typeof item === 'object' && item.id);
        if (valid.length > 0) return valid;
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
      console.warn('Full hero slide upsert failed, attempting minimal payload upsert:', fullErr);
      const minimalPayload = {
        id: String(slide.id),
        is_active: slide.is_active !== undefined ? Boolean(slide.is_active) : true,
        sort_order: slide.sort_order ?? index + 1,
        data: slide
      };
      const { error: minErr } = await supabase.from('hero_slides').upsert(minimalPayload, { onConflict: 'id' });
      if (minErr) {
        console.error('Minimal hero slide upsert also failed:', minErr);
      }
    }
  } catch (err) {
    console.error('Unexpected error saving hero slide to Supabase:', err);
  }
}

function mergeWithLocalSlides(fetchedFromDb) {
  const local = loadLocalSlides();
  if (!Array.isArray(local) || local.length === 0) return fetchedFromDb;
  const localMap = new Map(local.map((s) => [String(s.id), s]));

  const dbIds = new Set(fetchedFromDb.map((s) => String(s.id)));
  const mergedDb = fetchedFromDb.map((dbSlide) => {
    const loc = localMap.get(String(dbSlide.id));
    if (!loc) return dbSlide;
    const activeVal = loc.is_active !== undefined ? Boolean(loc.is_active) : (loc.isActive !== undefined ? Boolean(loc.isActive) : Boolean(dbSlide.is_active));
    return {
      ...dbSlide,
      ...loc,
      is_active: activeVal,
      isActive: activeVal
    };
  });

  const localOnly = local.filter((s) => !dbIds.has(String(s.id)));
  return [...mergedDb, ...localOnly];
}

export function HeroBannersProvider({ children }) {
  const [slides, setSlides] = useState(() => loadLocalSlides() || INITIAL_HERO_SLIDES);
  const [loading, setLoading] = useState(true);

  const fetchSlides = async () => {
    setLoading(true);
    try {
      const local = loadLocalSlides();
      if (local && local.length > 0) {
        setSlides(local);
        setLoading(false);
        return;
      }
      let query = supabase.from('hero_slides').select('*');
      try {
        query = query.order('sort_order', { ascending: true });
      } catch (e) {
        // ignore order error
      }
      const { data, error } = await query;
      if (!error && Array.isArray(data) && data.length > 0) {
        const fetched = data.map(mapFromDb).filter(Boolean);
        // Exclude deleted slide 2 if it's the old promo slide
        const filtered = fetched.filter((s) => s.id !== 'hero-slide-2');
        if (filtered.length > 0) {
          // If hero-slide-1 in DB has old copy, update it with new defaults
          const merged = filtered.map((s) => {
            if (s.id === 'hero-slide-1' && (s.headline1En === 'CRAFT YOUR OWN' || s.eyebrowEn === 'DUAT / THE FORGE')) {
              return { ...s, ...INITIAL_HERO_SLIDES[0] };
            }
            return s;
          });
          setSlides(merged);
          saveLocalSlides(merged);
          setLoading(false);
          return;
        }
      }
      setSlides(INITIAL_HERO_SLIDES);
      saveLocalSlides(INITIAL_HERO_SLIDES);
    } catch (err) {
      console.error('Unexpected error loading hero slides:', err);
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

  const resetSlides = () => {
    localStorage.removeItem(HERO_SLIDES_STORAGE_KEY);
    setSlides(INITIAL_HERO_SLIDES);
    saveLocalSlides(INITIAL_HERO_SLIDES);
    fetchSlides();
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
