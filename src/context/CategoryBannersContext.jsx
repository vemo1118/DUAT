import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const CategoryBannersContext = createContext();

export const INITIAL_CATEGORY_BANNERS = [
  {
    id: 'cases',
    nameEn: 'LUXURY CASES',
    nameAr: 'الجرابات الفاخرة',
    subtitleEn: 'Case + 6 DUAT stickers, made to order',
    subtitleAr: 'جراب + ٦ استيكرات دوات، حسب الطلب',
    imageUrl: 'https://res.cloudinary.com/ikim5u08/image/upload/v1785764123/B1_DarkNight_dzbmmn.jpg',
    badge: '01',
    categoryLink: '/shop'
  },
  {
    id: 'stickers',
    nameEn: 'STICKERS',
    nameAr: 'الاستيكرات',
    subtitleEn: '3D epoxy dome stickers, sold on their own',
    subtitleAr: 'استيكرات إيبوكسي، تتباع لوحدها',
    imageUrl: 'https://res.cloudinary.com/ikim5u08/image/upload/v1785825222/SH1_ST_j1z2h3.png',
    badge: '02',
    categoryLink: '/shop'
  }
];

export const CategoryBannersProvider = ({ children }) => {
  const [categoryBanners, setCategoryBanners] = useState(() => {
    try {
      const saved = localStorage.getItem('duat_category_banners');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length === 2 && parsed.every((c) => c.id === 'cases' || c.id === 'stickers')) {
          return INITIAL_CATEGORY_BANNERS.map((def) => {
            const match = parsed.find((p) => p.id === def.id);
            return match ? { ...def, ...match, nameEn: def.nameEn, nameAr: def.nameAr, subtitleEn: def.subtitleEn, subtitleAr: def.subtitleAr, imageUrl: match.imageUrl || def.imageUrl } : def;
          });
        }
      }
    } catch (e) {
      console.warn('Failed parsing duat_category_banners from localStorage:', e);
    }
    return INITIAL_CATEGORY_BANNERS;
  });

  const [loading, setLoading] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('duat_category_banners', JSON.stringify(categoryBanners));
    } catch (e) {
      console.warn('Failed saving duat_category_banners to localStorage:', e);
    }
  }, [categoryBanners]);

  // Fetch from Supabase category_banners table if available
  useEffect(() => {
    let isMounted = true;
    const fetchBanners = async () => {
      try {
        const { data, error } = await supabase.from('category_banners').select('*');
        if (!error && data && data.length > 0 && isMounted) {
          const formatted = INITIAL_CATEGORY_BANNERS.map((def) => {
            const match = data.find((d) => d.id === def.id);
            if (match) {
              return {
                ...def,
                nameEn: match.name_en || match.nameEn || def.nameEn,
                nameAr: match.name_ar || match.nameAr || def.nameAr,
                subtitleEn: match.subtitle_en || match.subtitleEn || def.subtitleEn,
                subtitleAr: match.subtitle_ar || match.subtitleAr || def.subtitleAr,
                imageUrl: match.image_url || match.imageUrl || def.imageUrl
              };
            }
            return def;
          });
          setCategoryBanners(formatted);
        }
      } catch (err) {
        console.warn('Category banners table fallback:', err);
      }
    };
    fetchBanners();
    return () => { isMounted = false; };
  }, []);

  const addCategoryBanner = async (newBanner) => {
    const id = newBanner.id || `cat-${Date.now()}`;
    const formatted = {
      ...newBanner,
      id,
      is_active: newBanner.is_active !== undefined ? newBanner.is_active : true,
      badge: newBanner.badge || `0${categoryBanners.length + 1}`
    };
    setCategoryBanners((prev) => [...prev, formatted]);

    try {
      await supabase.from('category_banners').upsert({
        id,
        name_en: formatted.nameEn,
        name_ar: formatted.nameAr,
        subtitle_en: formatted.subtitleEn,
        subtitle_ar: formatted.subtitleAr,
        image_url: formatted.imageUrl,
        is_active: formatted.is_active,
        updated_at: new Date().toISOString()
      });
    } catch (err) {
      console.warn('Supabase add category banner error:', err);
    }
  };

  const updateCategoryBanner = async (bannerId, updatedFields) => {
    setCategoryBanners((prev) =>
      prev.map((b) => (b.id === bannerId ? { ...b, ...updatedFields } : b))
    );

    try {
      await supabase.from('category_banners').upsert({
        id: bannerId,
        name_en: updatedFields.nameEn,
        name_ar: updatedFields.nameAr,
        subtitle_en: updatedFields.subtitleEn,
        subtitle_ar: updatedFields.subtitleAr,
        image_url: updatedFields.imageUrl,
        is_active: updatedFields.is_active !== undefined ? updatedFields.is_active : true,
        updated_at: new Date().toISOString()
      });
    } catch (err) {
      console.warn('Supabase category banner upsert error:', err);
    }
  };

  const toggleCategoryBannerVisibility = async (bannerId) => {
    let newStatus = true;
    setCategoryBanners((prev) =>
      prev.map((b) => {
        if (b.id === bannerId) {
          const current = b.is_active !== false && b.isActive !== false;
          newStatus = !current;
          return { ...b, is_active: newStatus, isActive: newStatus };
        }
        return b;
      })
    );

    try {
      await supabase
        .from('category_banners')
        .update({ is_active: newStatus, updated_at: new Date().toISOString() })
        .eq('id', bannerId);
    } catch (err) {
      console.warn('Supabase toggle category banner visibility error:', err);
    }
  };

  const deleteCategoryBanner = async (bannerId) => {
    setCategoryBanners((prev) => prev.filter((b) => b.id !== bannerId));

    try {
      await supabase.from('category_banners').delete().eq('id', bannerId);
    } catch (err) {
      console.warn('Supabase delete category banner error:', err);
    }
  };

  const resetCategoryBanners = () => {
    setCategoryBanners(INITIAL_CATEGORY_BANNERS);
    localStorage.removeItem('duat_category_banners');
  };

  return (
    <CategoryBannersContext.Provider
      value={{
        categoryBanners,
        addCategoryBanner,
        updateCategoryBanner,
        toggleCategoryBannerVisibility,
        deleteCategoryBanner,
        resetCategoryBanners,
        loading
      }}
    >
      {children}
    </CategoryBannersContext.Provider>
  );
};

export const useCategoryBanners = () => {
  const context = useContext(CategoryBannersContext);
  if (!context) {
    throw new Error('useCategoryBanners must be used within CategoryBannersProvider');
  }
  return context;
};
