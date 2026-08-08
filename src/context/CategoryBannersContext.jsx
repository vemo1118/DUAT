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
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
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

  // Load saved banners from Supabase on mount
  useEffect(() => {
    async function loadFromSupabase() {
      try {
        const { data: forgeData } = await supabase
          .from('store_settings')
          .select('value')
          .eq('key', 'forge_banner')
          .maybeSingle();

        if (forgeData?.value && typeof forgeData.value === 'object') {
          setForgeBanner((prev) => ({ ...prev, ...forgeData.value }));
        }

        const { data: catData } = await supabase
          .from('category_banners')
          .select('*');

        if (Array.isArray(catData) && catData.length > 0) {
          setCategoryBanners((prev) =>
            prev.map((b) => {
              const match = catData.find((dbRow) => dbRow.id === b.id);
              if (match) {
                return {
                  ...b,
                  imageUrl: match.image_url || b.imageUrl,
                  nameEn: match.name_en || b.nameEn,
                  nameAr: match.name_ar || b.nameAr,
                  subtitleEn: match.subtitle_en || b.subtitleEn,
                  subtitleAr: match.subtitle_ar || b.subtitleAr,
                  is_active: match.is_active !== undefined ? match.is_active : b.is_active
                };
              }
              return b;
            })
          );
        }
      } catch (err) {
        console.warn('Error loading banners from Supabase:', err);
      }
    }
    loadFromSupabase();
  }, []);

  // Sync categoryBanners to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('duat_category_banners', JSON.stringify(categoryBanners));
    } catch (e) {
      console.warn('Failed saving duat_category_banners to localStorage:', e);
    }
  }, [categoryBanners]);

  // Sync forgeBanner to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('duat_forge_banner_v1', JSON.stringify(forgeBanner));
    } catch (e) {
      console.warn('Failed saving duat_forge_banner to localStorage:', e);
    }
  }, [forgeBanner]);

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
