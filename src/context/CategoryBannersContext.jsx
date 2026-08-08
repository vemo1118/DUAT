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
    imageUrl: 'https://res.cloudinary.com/ikim5u08/image/upload/f_auto,q_auto/v1785764123/B1_DarkNight_dzbmmn.jpg',
    badge: '01',
    categoryLink: '/shop'
  },
  {
    id: 'stickers',
    nameEn: 'STICKERS',
    nameAr: 'الاستيكرات',
    subtitleEn: '3D epoxy dome stickers, sold on their own',
    subtitleAr: 'استيكرات إيبوكسي، تتباع لوحدها',
    imageUrl: 'https://res.cloudinary.com/ikim5u08/image/upload/f_auto,q_auto/v1785825222/SH1_ST_j1z2h3.png',
    badge: '02',
    categoryLink: '/shop'
  }
];

export const DEFAULT_FORGE_BANNER = {
  eyebrowEn: 'THE FORGE',
  eyebrowAr: 'دوات / كور الفن',
  titleEn: 'BUILD A CASE FOR YOURSELF.',
  titleAr: 'صمم درعك الخاص بنفسك.',
  descEn: 'Select your phone model, choose your armor finish, and stack 3D epoxy domes or custom text on canvas. Made to order. Shipped in 5 days.',
  descAr: 'اختر موديل هاتفك، التقفيل الفاخر، والملصقات المجسمة ثلاثية الأبعاد. يُصنع حسب الطلب ويُشحن في ٥ أيام.',
  buttonTextEn: 'OPEN THE BUILDER →',
  buttonTextAr: 'افتح أداة التصميم ←',
  buttonLink: '/customizer',
  imageUrl: 'https://res.cloudinary.com/ikim5u08/image/upload/f_auto,q_auto/v1785768478/B1_TB_w1zemr.jpg',
  isActive: true
};

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

  // Forge Feature Banner State
  const [forgeBanner, setForgeBanner] = useState(() => {
    try {
      const saved = localStorage.getItem('duat_forge_banner_v1');
      return saved ? JSON.parse(saved) : DEFAULT_FORGE_BANNER;
    } catch (e) {
      return DEFAULT_FORGE_BANNER;
    }
  });

  const [loading, setLoading] = useState(false);

  // Sync forgeBanner to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('duat_forge_banner_v1', JSON.stringify(forgeBanner));
    } catch (e) {
      console.warn('Failed saving duat_forge_banner to localStorage:', e);
    }
  }, [forgeBanner]);

  const updateForgeBanner = async (updatedFields) => {
    const updated = { ...forgeBanner, ...updatedFields };
    setForgeBanner(updated);

    try {
      await supabase.from('store_settings').upsert({
        key: 'forge_banner',
        value: updated,
        updated_at: new Date().toISOString()
      });
    } catch (err) {
      console.warn('Supabase update forge banner error:', err);
    }
  };

  const resetCategoryBanners = () => {
    setCategoryBanners(INITIAL_CATEGORY_BANNERS);
    setForgeBanner(DEFAULT_FORGE_BANNER);
    localStorage.removeItem('duat_category_banners');
    localStorage.removeItem('duat_forge_banner_v1');
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
        forgeBanner,
        updateForgeBanner,
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
