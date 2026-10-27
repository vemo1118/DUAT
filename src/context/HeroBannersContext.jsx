import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import liveCustomEdits from '../data/live_custom_edits.json';
import { publishCloudEdits } from '../services/liveSyncService';
import { isInlineStoreImage, uploadStoreImageDataUrl } from '../services/storeAssetService';

const HeroBannersContext = createContext();

export const INITIAL_HERO_SLIDES = [
  {
    id: '00000000-0000-0000-0000-000000000001',
    eyebrowEn: 'DUAT / LUXE COLLECTION',
    eyebrowAr: 'دوات / الفئة الفاخرة',
    headline1En: 'THROUGH THE NIGHT,',
    headline1Ar: 'نعدّي الليل،',
    headline2En: 'BORN AT DAWN.',
    headline2Ar: 'ونطلع نور.',
    subEn: 'Custom raised 3D stickers and ready-made collections. Made to order in Egypt.',
    subAr: 'استيكرات بارزة مجسّمة مخصصة وتشكيلات جاهزة، مصنوعة حسب الطلب في مصر.',
    badgeEn: 'LUXE CATEGORY',
    badgeAr: 'فئة LUXE الفاخرة',
    imageUrl: 'https://res.cloudinary.com/ikim5u08/image/upload/f_auto,q_auto/v1785712166/B1_u3veqk.jpg',
    ctaPrimaryTextEn: 'SHOP LUXE',
    ctaPrimaryTextAr: 'تسوق الفئة الفاخرة',
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
    sort_order: 1
  },
  {
    id: '00000000-0000-0000-0000-000000000002',
    eyebrowEn: 'DUAT / NINETIES VIBES',
    eyebrowAr: 'دوات / فئة التسعيناتي',
    headline1En: '90s NOSTALGIA & POP,',
    headline1Ar: 'نوستالجيا التسعينات،',
    headline2En: 'IN A RAISED 3D FINISH.',
    headline2Ar: 'بلمسة مجسمة.',
    subEn: 'Retro vintage Egyptian pop culture icons in raised 3D stickers.',
    subAr: 'أصالة التسعينات والرموز المصرية الكلاسيكية مع استيكرات البارزة.',
    badgeEn: 'NINETIES 90S',
    badgeAr: 'فئة التسعيناتي 90s',
    imageUrl: 'https://res.cloudinary.com/ikim5u08/image/upload/f_auto,q_auto/v1786036786/born_at_dawn_k5gb1v.png',
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
    id: '00000000-0000-0000-0000-000000000003',
    eyebrowEn: 'DUAT / YOUTH STREETWEAR',
    eyebrowAr: 'دوات / الفئة الشبابية',
    headline1En: 'BOLD & UNAPOLOGETIC,',
    headline1Ar: 'عصري، جريء،',
    headline2En: 'EXPRESS YOURSELF.',
    headline2Ar: 'وبيعدّي الحدود.',
    subEn: 'Vibrant neon street aesthetics & high-impact raised 3D finish badges.',
    subAr: 'تشكيلة الاستيكرات الشبابية الأكثر جرأة وحيوية لتعبير فريد عن شخصيتك.',
    badgeEn: 'YOUTH COLLECTION',
    badgeAr: 'الفئة الشبابية YOUTH',
    imageUrl: 'https://res.cloudinary.com/ikim5u08/image/upload/f_auto,q_auto/v1785825222/SH1_ST_j1z2h3.png',
    ctaPrimaryTextEn: 'SHOP YOUTH',
    ctaPrimaryTextAr: 'تسوق الفئة الشبابية',
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

const HERO_SLIDES_STORAGE_KEY = 'duat_hero_slides_v62';

function cleanLegacyStorage() {
  try {
    for (let i = 1; i < 62; i++) {
      localStorage.removeItem(`duat_hero_slides_v${i}`);
    }
    localStorage.removeItem('duat_hero_slides');
  } catch {
    // Legacy storage cleanup must not block storefront rendering.
  }
}

function sanitizeSlideUrls(slides) {
  if (!Array.isArray(slides)) return slides;
  return slides.map((s) => {
    if (!s || typeof s !== 'object') return s;
    const url = s.imageUrl || s.image_url || s.image || '';
    const primaryLink = ['/customize', '/customizer'].includes(s.ctaPrimaryLink) ? '/sticker-builder' : s.ctaPrimaryLink;
    const hasLegacySecondaryLink = ['/customize', '/customizer'].includes(s.ctaSecondaryLink);
    const secondaryLink = hasLegacySecondaryLink ? '/sticker-builder' : s.ctaSecondaryLink;
    const h1Color = s.headline1Color === '#00F0FF' ? '#EDE4D3' : (s.headline1Color || '#EDE4D3');
    const h2Color = s.headline2Color === '#FF007A' ? '#E8A33D' : (s.headline2Color || '#E8A33D');
    return {
      ...s,
      imageUrl: url || 'https://res.cloudinary.com/ikim5u08/image/upload/f_auto,q_auto/v1785712166/B1_u3veqk.jpg',
      image_url: url || 'https://res.cloudinary.com/ikim5u08/image/upload/f_auto,q_auto/v1785712166/B1_u3veqk.jpg',
      headline1Color: h1Color,
      headline2Color: h2Color,
      ctaPrimaryLink: primaryLink,
      ctaSecondaryLink: secondaryLink,
      ctaSecondaryTextEn: hasLegacySecondaryLink ? 'STICKER BUILDER' : s.ctaSecondaryTextEn,
      ctaSecondaryTextAr: hasLegacySecondaryLink ? 'صمم استيكرك' : s.ctaSecondaryTextAr
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
          return sanitizeSlideUrls(valid);
        }
      }
    }
  } catch (e) {
    // ignore
  }
  if (Array.isArray(liveCustomEdits?.heroSlides) && liveCustomEdits.heroSlides.length > 0) {
    return sanitizeSlideUrls(liveCustomEdits.heroSlides);
  }
  return INITIAL_HERO_SLIDES;
}

function saveLocalSlides(slides) {
  try {
    localStorage.setItem(HERO_SLIDES_STORAGE_KEY, JSON.stringify(slides));
    publishCloudEdits({ heroSlides: slides });
  } catch (e) {
    // ignore
  }
}

async function saveSlideToSupabase(slide, index = 0) {
  if (!slide?.id) throw new Error('Missing slide ID');
  let savedSlide = slide;
  for (const field of ['imageUrl', 'mobileImageUrl']) {
    if (isInlineStoreImage(savedSlide[field])) {
      const upload = await uploadStoreImageDataUrl(savedSlide[field], {
        folder: 'hero-slides', assetId: `${slide.id}-${field}`
      });
      savedSlide = { ...savedSlide, [field]: upload.publicUrl };
    }
  }
  let result = await supabase.from('hero_slides').upsert(mapToDb(savedSlide, index), { onConflict: 'id' }).select('*').single();
  if (['PGRST204', '42703'].includes(result.error?.code)) {
    result = await supabase.from('hero_slides').upsert({
      id: String(savedSlide.id), is_active: savedSlide.is_active !== false,
      sort_order: savedSlide.sort_order ?? index + 1, data: savedSlide
    }, { onConflict: 'id' }).select('*').single();
  }
  if (result.error || !result.data?.id) throw result.error || new Error('Cloud save was not confirmed');
  return mapFromDb(result.data);
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
        if (fetched.length > 0) {
          setSlides((prev) => {
            if (JSON.stringify(prev) === JSON.stringify(fetched)) {
              return prev;
            }
            try { localStorage.setItem(HERO_SLIDES_STORAGE_KEY, JSON.stringify(fetched)); } catch { /* Optional cache. */ }
            return fetched;
          });
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
    // 1. Initial load from Supabase
    fetchSlides();

    const channel = supabase
      .channel('duat-hero-slides')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'hero_slides' },
        fetchSlides
      )
      .subscribe();
    window.addEventListener('focus', fetchSlides);

    return () => {
      window.removeEventListener('focus', fetchSlides);
      supabase.removeChannel(channel);
    };
  }, []);

  const addSlide = async (slideData) => {
    const newSlide = { ...slideData, id: slideData.id || crypto.randomUUID() };
    const saved = await saveSlideToSupabase(newSlide, 0);
    setSlides(prev => { const updated = [saved, ...prev]; saveLocalSlides(updated); return updated; });
    return saved;
  };

  const updateSlide = async (id, fields) => {
    const index = slides.findIndex(slide => slide.id === id);
    if (index < 0) throw new Error('Slide not found');
    const updated = { ...slides[index], ...fields };
    const saved = await saveSlideToSupabase(updated, index);
    setSlides(prev => { const next = prev.map(slide => slide.id === id ? saved : slide); saveLocalSlides(next); return next; });
    return saved;
  };

  const toggleSlideVisibility = async (id) => {
    const slide = slides.find(item => item.id === id);
    if (!slide) throw new Error('Slide not found');
    const active = !(slide.is_active ?? slide.isActive ?? true);
    await updateSlide(id, { is_active: active, isActive: active });
  };

  const deleteSlide = async (id) => {
    const { data, error } = await supabase.from('hero_slides').delete().eq('id', id).select('id');
    if (error || !data?.length) throw error || new Error('Delete was not confirmed');
    setSlides(prev => { const next = prev.filter(slide => slide.id !== id); saveLocalSlides(next); return next; });
  };

  const resetSlides = async () => {
    for (let i = 0; i < INITIAL_HERO_SLIDES.length; i++) {
      await saveSlideToSupabase(INITIAL_HERO_SLIDES[i], i);
    }
    await fetchSlides();
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
