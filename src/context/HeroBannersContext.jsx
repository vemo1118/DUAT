import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const HeroBannersContext = createContext();

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
    ctaSecondaryLink: '/shop',
    sort_order: 1
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
    ctaSecondaryLink: '/track-order',
    sort_order: 2
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
    imageUrl: data.imageUrl || row.image_url || '',
    ctaPrimaryTextEn: data.ctaPrimaryTextEn || row.cta_primary_text_en || '',
    ctaPrimaryTextAr: data.ctaPrimaryTextAr || row.cta_primary_text_ar || '',
    ctaPrimaryLink: data.ctaPrimaryLink || row.cta_primary_link || '',
    ctaSecondaryTextEn: data.ctaSecondaryTextEn || row.cta_secondary_text_en || '',
    ctaSecondaryTextAr: data.ctaSecondaryTextAr || row.cta_secondary_text_ar || '',
    ctaSecondaryLink: data.ctaSecondaryLink || row.cta_secondary_link || '',
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
    image_url: slide.imageUrl || slide.image_url || '',
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
      is_active: isActiveVal,
      isActive: isActiveVal
    }
  };
}

export function HeroBannersProvider({ children }) {
  const [slides, setSlides] = useState(INITIAL_HERO_SLIDES);
  const [loading, setLoading] = useState(true);

  const fetchSlides = async () => {
    setLoading(true);
    try {
      let query = supabase.from('hero_slides').select('*');
      try {
        query = query.order('sort_order', { ascending: true });
      } catch (e) {
        // ignore order error
      }
      const { data, error } = await query;
      if (error) {
        console.error('Failed to fetch hero slides from Supabase:', error);
        setSlides(INITIAL_HERO_SLIDES);
      } else if (Array.isArray(data) && data.length > 0) {
        setSlides(data.map(mapFromDb));
      } else {
        // Seed default slides if empty
        try {
          const seedPayload = INITIAL_HERO_SLIDES.map((s, idx) => mapToDb(s, idx));
          const { data: seededData, error: seedErr } = await supabase
            .from('hero_slides')
            .upsert(seedPayload, { onConflict: 'id' })
            .select();
          if (!seedErr && Array.isArray(seededData) && seededData.length > 0) {
            setSlides(seededData.map(mapFromDb));
          } else {
            console.error('Seeding hero slides error:', seedErr);
            setSlides(INITIAL_HERO_SLIDES);
          }
        } catch (sErr) {
          console.error('Error seeding hero slides:', sErr);
          setSlides(INITIAL_HERO_SLIDES);
        }
      }
    } catch (err) {
      console.error('Unexpected error loading hero slides:', err);
      setSlides(INITIAL_HERO_SLIDES);
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
    setSlides((prev) => [newSlide, ...prev]);

    try {
      const { error } = await supabase.from('hero_slides').upsert(mapToDb(newSlide), { onConflict: 'id' });
      if (error) console.error('Supabase add hero slide error:', error);
    } catch (err) {
      console.error('Supabase add hero slide error:', err);
    }

    return newSlide;
  };

  const updateSlide = async (id, updatedFields) => {
    let targetSlide = null;
    setSlides((prev) =>
      prev.map((slide) => {
        if (slide.id === id) {
          const updated = { ...slide, ...updatedFields };
          targetSlide = updated;
          return updated;
        }
        return slide;
      })
    );

    if (targetSlide) {
      try {
        const { error } = await supabase.from('hero_slides').upsert(mapToDb(targetSlide), { onConflict: 'id' });
        if (error) console.error('Supabase update hero slide error:', error);
      } catch (err) {
        console.error('Supabase update hero slide error:', err);
      }
    }
  };

  const toggleSlideVisibility = async (id) => {
    let targetSlide = null;
    setSlides((prev) =>
      prev.map((slide) => {
        if (slide.id === id) {
          const currentStatus = slide.is_active !== undefined ? Boolean(slide.is_active) : (slide.isActive !== undefined ? Boolean(slide.isActive) : true);
          const newStatus = !currentStatus;
          const updated = { ...slide, is_active: newStatus, isActive: newStatus };
          targetSlide = updated;
          return updated;
        }
        return slide;
      })
    );

    if (targetSlide) {
      try {
        const { error } = await supabase.from('hero_slides').upsert(mapToDb(targetSlide), { onConflict: 'id' });
        if (error) console.error('Supabase toggle hero slide visibility error:', error);
      } catch (err) {
        console.error('Supabase toggle hero slide visibility error:', err);
      }
    }
  };

  const deleteSlide = async (id) => {
    setSlides((prev) => prev.filter((slide) => slide.id !== id));
    try {
      const { error } = await supabase.from('hero_slides').delete().eq('id', id);
      if (error) console.error('Supabase delete hero slide error:', error);
    } catch (err) {
      console.error('Supabase delete hero slide error:', err);
    }
  };

  const resetSlides = () => {
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
