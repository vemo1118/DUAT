import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { subscribeToLiveSync } from '../services/liveSyncService';

const CategoryBannersContext = createContext();

export const INITIAL_CATEGORY_BANNERS = [
  {
    id: 'bundles',
    nameEn: 'READY STICKER BUNDLES',
    nameAr: 'البندلات المجمعة والعروض',
    subtitleEn: 'Exclusive 3D epoxy sticker sets with bundle discount savings',
    subtitleAr: 'باكدجات مجمعة جاهزة من الاستيكرات بخصم وتوفير خاص',
    imageUrl: 'https://res.cloudinary.com/ikim5u08/image/upload/f_auto,q_auto/v1785825222/SH1_ST_j1z2h3.png',
    badge: '01',
    categoryLink: '/bundles'
  },
  {
    id: 'stickers',
    nameEn: '3D EPOXY STICKERS',
    nameAr: 'الاستيكرات المجسمة (3D)',
    subtitleEn: 'Individual 3D epoxy dome slogans, badges & letters',
    subtitleAr: 'استيكرات إيبوكسي 3D، تشكيلة العبارات والحروف والشارات',
    imageUrl: 'https://res.cloudinary.com/ikim5u08/image/upload/f_auto,q_auto/v1786036786/born_at_dawn_k5gb1v.png',
    badge: '02',
    categoryLink: '/stickers'
  }
];

export const DEFAULT_FORGE_BANNER = {
  eyebrowEn: 'DUAT / STICKER BUILDER',
  eyebrowAr: 'دوات / مصمم الاستيكرات',
  titleEn: 'BUILD A STICKER FOR YOURSELF.',
  titleAr: 'صمّم استيكرك الخاص بنفسك.',
  descEn: 'Write custom text or upload your design to turn it into a 3D epoxy dome sticker. Made to order.',
  descAr: 'اختر نصك المخصص، خطك العربي، أو ارفع صورتك لتتحول إلى استيكر إيبوكسي مجسم ثلاثي الأبعاد 3D.',
  buttonTextEn: 'OPEN STICKER BUILDER →',
  buttonTextAr: 'افتح بيلدر الاستيكرز ←',
  buttonLink: '/sticker-builder',
  imageUrl: 'https://res.cloudinary.com/ikim5u08/image/upload/f_auto,q_auto/v1786036786/born_at_dawn_k5gb1v.png',
  isActive: true
};

export const CategoryBannersProvider = ({ children }) => {
  const [categoryBanners, setCategoryBanners] = useState(() => {
    try {
      const saved = localStorage.getItem('duat_category_banners_v5');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Filter out legacy luxe/cases banners
          const valid = parsed.filter(b => b.id === 'bundles' || b.id === 'stickers' || b.id === 'builder');
          if (valid.length > 0) return valid;
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
          setCategoryBanners((prev) => {
            const mappedFromDb = catData.map((dbRow) => ({
              id: dbRow.id,
              nameEn: dbRow.name_en || '',
              nameAr: dbRow.name_ar || '',
              subtitleEn: dbRow.subtitle_en || '',
              subtitleAr: dbRow.subtitle_ar || '',
              imageUrl: dbRow.image_url || '',
              badge: dbRow.badge || `01`,
              categoryLink: dbRow.category_link || '/shop',
              is_active: dbRow.is_active !== undefined ? dbRow.is_active : true
            }));

            const dbMap = new Map(mappedFromDb.map((b) => [String(b.id), b]));
            return prev.map((b) => {
              const match = dbMap.get(String(b.id));
              if (match) {
                return {
                  ...b,
                  ...match,
                  imageUrl: match.imageUrl || b.imageUrl
                };
              }
              return b;
            });
          });
        }
      } catch (err) {
        console.warn('Error loading banners from Supabase:', err);
      }
    }

    loadFromSupabase();
  }, []);

  // Subscribe to Supabase Realtime broadcasts from admin
  useEffect(() => {
    const unsubscribe = subscribeToLiveSync(() => {
      loadFromSupabase();
    });
    return () => unsubscribe();
  }, []);

  // Sync categoryBanners to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('duat_category_banners_v5', JSON.stringify(categoryBanners));
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
        name_en: formatted.nameEn || '',
        name_ar: formatted.nameAr || '',
        subtitle_en: formatted.subtitleEn || '',
        subtitle_ar: formatted.subtitleAr || '',
        image_url: formatted.imageUrl || '',
        is_active: formatted.is_active,
        updated_at: new Date().toISOString()
      });
    } catch (err) {
      console.warn('Supabase add category banner error:', err);
    }
  };

  const updateCategoryBanner = async (bannerId, updatedFields) => {
    let fullTarget = null;
    setCategoryBanners((prev) =>
      prev.map((b) => {
        if (b.id === bannerId) {
          fullTarget = { ...b, ...updatedFields };
          return fullTarget;
        }
        return b;
      })
    );

    if (fullTarget) {
      try {
        await supabase.from('category_banners').upsert({
          id: bannerId,
          name_en: fullTarget.nameEn || '',
          name_ar: fullTarget.nameAr || '',
          subtitle_en: fullTarget.subtitleEn || '',
          subtitle_ar: fullTarget.subtitleAr || '',
          image_url: fullTarget.imageUrl || '',
          is_active: fullTarget.is_active !== undefined ? fullTarget.is_active : true,
          updated_at: new Date().toISOString()
        });
      } catch (err) {
        console.warn('Supabase category banner upsert error:', err);
      }
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
