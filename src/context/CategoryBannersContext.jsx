import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import {
  isInlineStoreImage,
  removeStoreImage,
  uploadStoreImageDataUrl
} from '../services/storeAssetService';

const CategoryBannersContext = createContext();
const CATEGORY_COLUMNS = 'id, name_en, name_ar, subtitle_en, subtitle_ar, image_url, badge, category_link, is_active, updated_at';
const CATEGORY_STORAGE_KEY = 'duat_category_banners_v5';
const FORGE_STORAGE_KEY = 'duat_forge_banner_v1';

export const INITIAL_CATEGORY_BANNERS = [
  {
    id: 'bundles',
    nameEn: 'READY STICKER BUNDLES',
    nameAr: 'البندلات المجمعة والعروض',
    subtitleEn: 'Exclusive 3D epoxy sticker sets with bundle discount savings',
    subtitleAr: 'باكدجات مجمعة جاهزة من الاستيكرات بخصم وتوفير خاص',
    imageUrl: 'https://res.cloudinary.com/ikim5u08/image/upload/f_auto,q_auto/v1785825222/SH1_ST_j1z2h3.png',
    badge: '01',
    categoryLink: '/bundles',
    is_active: true
  },
  {
    id: 'stickers',
    nameEn: '3D EPOXY STICKERS',
    nameAr: 'الاستيكرات المجسمة (3D)',
    subtitleEn: 'Individual 3D epoxy dome slogans, badges & letters',
    subtitleAr: 'استيكرات إيبوكسي 3D، تشكيلة العبارات والحروف والشارات',
    imageUrl: 'https://res.cloudinary.com/ikim5u08/image/upload/f_auto,q_auto/v1786036786/born_at_dawn_k5gb1v.png',
    badge: '02',
    categoryLink: '/stickers',
    is_active: true
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

function readLocalCategories() {
  try {
    const saved = localStorage.getItem(CATEGORY_STORAGE_KEY);
    const parsed = saved ? JSON.parse(saved) : null;
    if (Array.isArray(parsed) && parsed.length > 0) {
      const valid = parsed.filter((banner) => banner?.id);
      if (valid.length > 0) return valid;
    }
  } catch (error) {
    console.warn('Failed parsing category banners from localStorage:', error);
  }
  return INITIAL_CATEGORY_BANNERS;
}

function readLocalForgeBanner() {
  try {
    const saved = localStorage.getItem(FORGE_STORAGE_KEY);
    return saved ? { ...DEFAULT_FORGE_BANNER, ...JSON.parse(saved) } : DEFAULT_FORGE_BANNER;
  } catch {
    return DEFAULT_FORGE_BANNER;
  }
}

function mapCategoryRow(row) {
  return {
    id: row.id,
    nameEn: row.name_en || '',
    nameAr: row.name_ar || '',
    subtitleEn: row.subtitle_en || '',
    subtitleAr: row.subtitle_ar || '',
    imageUrl: row.image_url || '',
    badge: row.badge || '01',
    categoryLink: row.category_link || '/shop',
    is_active: row.is_active !== false
  };
}

function toCategoryRow(banner) {
  return {
    id: String(banner.id),
    name_en: banner.nameEn || '',
    name_ar: banner.nameAr || '',
    subtitle_en: banner.subtitleEn || '',
    subtitle_ar: banner.subtitleAr || '',
    image_url: banner.imageUrl || '',
    badge: banner.badge || '01',
    category_link: banner.categoryLink || '/shop',
    is_active: banner.is_active !== false && banner.isActive !== false,
    updated_at: new Date().toISOString()
  };
}

async function prepareBannerImage(banner) {
  if (!isInlineStoreImage(banner.imageUrl)) return { banner, uploadedPath: null };
  const upload = await uploadStoreImageDataUrl(banner.imageUrl, {
    folder: 'category-banners',
    assetId: banner.id
  });
  return {
    banner: { ...banner, imageUrl: upload.publicUrl },
    uploadedPath: upload.created ? upload.path : null
  };
}

async function saveCategoryBannerRecord(banner) {
  const prepared = await prepareBannerImage(banner);
  try {
    const { data, error } = await supabase
      .from('category_banners')
      .upsert(toCategoryRow(prepared.banner))
      .select(CATEGORY_COLUMNS)
      .single();
    if (error || !data) throw error || new Error('CATEGORY_SAVE_FAILED');
    return mapCategoryRow(data);
  } catch (error) {
    if (prepared.uploadedPath) await removeStoreImage(prepared.uploadedPath);
    throw error;
  }
}

async function migrateLegacyCategoriesIfAdmin(banners) {
  const { data: sessionData } = await supabase.auth.getSession();
  if (!sessionData.session) return null;
  const { data: isAdmin, error: adminError } = await supabase.rpc('is_admin');
  if (adminError || isAdmin !== true) return null;

  const prepared = [];
  try {
    for (const banner of banners) {
      prepared.push(await prepareBannerImage(banner));
    }
    const { data, error } = await supabase
      .from('category_banners')
      .upsert(prepared.map(({ banner }) => toCategoryRow(banner)))
      .select(CATEGORY_COLUMNS);
    if (error) throw error;
    return Array.isArray(data) ? data.map(mapCategoryRow) : null;
  } catch (error) {
    await Promise.all(prepared.map(({ uploadedPath }) => removeStoreImage(uploadedPath)));
    throw error;
  }
}

export const CategoryBannersProvider = ({ children }) => {
  const [categoryBanners, setCategoryBanners] = useState(readLocalCategories);
  const [forgeBanner, setForgeBanner] = useState(readLocalForgeBanner);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const legacyBanners = categoryBanners;

    async function loadFromSupabase() {
      setLoading(true);
      try {
        const [forgeResult, categoryResult] = await Promise.all([
          supabase.from('store_settings').select('value').eq('key', 'forge_banner').maybeSingle(),
          supabase.from('category_banners').select(CATEGORY_COLUMNS).order('id')
        ]);
        if (forgeResult.error) throw forgeResult.error;
        if (categoryResult.error) throw categoryResult.error;
        if (!isMounted) return;

        if (forgeResult.data?.value && typeof forgeResult.data.value === 'object') {
          setForgeBanner({ ...DEFAULT_FORGE_BANNER, ...forgeResult.data.value });
        }

        if (Array.isArray(categoryResult.data) && categoryResult.data.length > 0) {
          setCategoryBanners(categoryResult.data.map(mapCategoryRow));
        } else {
          const migrated = await migrateLegacyCategoriesIfAdmin(legacyBanners);
          if (isMounted && Array.isArray(migrated) && migrated.length > 0) {
            setCategoryBanners(migrated);
          }
        }
      } catch (error) {
        console.warn('Error loading category banners from Supabase:', error?.message || error);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadFromSupabase();

    const channel = supabase
      .channel('duat-category-settings')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'category_banners' }, loadFromSupabase)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'store_settings',
          filter: 'key=eq.forge_banner'
        },
        loadFromSupabase
      )
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(CATEGORY_STORAGE_KEY, JSON.stringify(categoryBanners));
    } catch (error) {
      console.warn('Failed saving category banners to localStorage:', error);
    }
  }, [categoryBanners]);

  useEffect(() => {
    try {
      localStorage.setItem(FORGE_STORAGE_KEY, JSON.stringify(forgeBanner));
    } catch (error) {
      console.warn('Failed saving forge banner to localStorage:', error);
    }
  }, [forgeBanner]);

  const addCategoryBanner = async (newBanner) => {
    const banner = {
      ...newBanner,
      id: newBanner.id || `cat-${Date.now()}`,
      is_active: newBanner.is_active !== false,
      badge: newBanner.badge || `0${categoryBanners.length + 1}`
    };
    const saved = await saveCategoryBannerRecord(banner);
    setCategoryBanners((current) => [...current.filter((item) => item.id !== saved.id), saved]);
    return saved;
  };

  const updateCategoryBanner = async (bannerId, updatedFields) => {
    const current = categoryBanners.find((banner) => banner.id === bannerId);
    if (!current) throw new Error('CATEGORY_NOT_FOUND');
    const saved = await saveCategoryBannerRecord({ ...current, ...updatedFields, id: bannerId });
    setCategoryBanners((banners) => banners.map((banner) => (banner.id === bannerId ? saved : banner)));
    return saved;
  };

  const toggleCategoryBannerVisibility = async (bannerId) => {
    const current = categoryBanners.find((banner) => banner.id === bannerId);
    if (!current) throw new Error('CATEGORY_NOT_FOUND');
    return updateCategoryBanner(bannerId, {
      is_active: !(current.is_active !== false && current.isActive !== false)
    });
  };

  const deleteCategoryBanner = async (bannerId) => {
    const { error } = await supabase.from('category_banners').delete().eq('id', bannerId);
    if (error) throw error;
    setCategoryBanners((banners) => banners.filter((banner) => banner.id !== bannerId));
  };

  const updateForgeBanner = async (updatedFields) => {
    const updated = { ...forgeBanner, ...updatedFields };
    const { error } = await supabase.from('store_settings').upsert({
      key: 'forge_banner',
      value: updated,
      updated_at: new Date().toISOString()
    });
    if (error) throw error;
    setForgeBanner(updated);
    return updated;
  };

  const resetCategoryBanners = async () => {
    const { data, error } = await supabase
      .from('category_banners')
      .upsert(INITIAL_CATEGORY_BANNERS.map(toCategoryRow))
      .select(CATEGORY_COLUMNS);
    if (error) throw error;

    const { error: forgeError } = await supabase.from('store_settings').upsert({
      key: 'forge_banner',
      value: DEFAULT_FORGE_BANNER,
      updated_at: new Date().toISOString()
    });
    if (forgeError) throw forgeError;

    setCategoryBanners(data.map(mapCategoryRow));
    setForgeBanner(DEFAULT_FORGE_BANNER);
    localStorage.removeItem(CATEGORY_STORAGE_KEY);
    localStorage.removeItem(FORGE_STORAGE_KEY);
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
  if (!context) throw new Error('useCategoryBanners must be used within CategoryBannersProvider');
  return context;
};
