import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const StickersSettingsContext = createContext();

export const DEFAULT_STICKERS_SETTINGS = {
  hero: {
    isActive: true,
    eyebrowAr: 'استيكرات إيبوكسي مجسمة ✦',
    eyebrowEn: '3D EPOXY STICKERS ✦',
    titleAr: 'قسم الاستيكرات ✦',
    titleEn: 'Stickers Collection ✦',
    descAr: 'تشكيلة ملصقات الإيبوكسي ثلاثية الأبعاد البارزة، عبارات العبور، الحروف العربية والإنجليزية وشارات الميلاد.',
    descEn: 'Browse our 3D epoxy dome stickers, slogans, letters, and badges.',
    bgImage: ''
  },
  promo: {
    isActive: true,
    titleAr: 'عايز استيكر بمواصفاتك الخاصة؟ 🎨',
    titleEn: 'Want a custom sticker? 🎨',
    descAr: 'خش على بيلدر الاستيكرات واكتب النص اللي تحبه أو ارفع صورتك الخاصة ونعملها لك استيكر إيبوكسي مجسم 3D!',
    descEn: 'Use our Sticker Builder to write custom text or upload an image to turn into a 3D epoxy sticker!',
    buttonTextAr: 'بيلدر الاستيكرز',
    buttonTextEn: 'STICKER BUILDER',
    buttonLink: '/sticker-builder'
  },
  grid: {
    emptyMessageAr: 'لم يتم العثور على استيكرات مطابقة للفلتر المحدد.',
    emptyMessageEn: 'No stickers found matching selected filter.'
  }
};

export const StickersSettingsProvider = ({ children }) => {
  const [stickersSettings, setStickersSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('duat_stickers_settings_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          hero: { ...DEFAULT_STICKERS_SETTINGS.hero, ...parsed.hero },
          promo: { ...DEFAULT_STICKERS_SETTINGS.promo, ...parsed.promo },
          grid: { ...DEFAULT_STICKERS_SETTINGS.grid, ...parsed.grid }
        };
      }
    } catch (e) {
      console.warn('Error reading duat_stickers_settings from localStorage:', e);
    }
    return DEFAULT_STICKERS_SETTINGS;
  });

  const [loading, setLoading] = useState(false);

  // Load settings from Supabase on mount
  useEffect(() => {
    async function loadFromSupabase() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('store_settings')
          .select('value')
          .eq('key', 'stickers_page_settings')
          .maybeSingle();

        if (error) {
          console.warn('Supabase fetch error for stickers_page_settings:', error.message);
        }

        if (data?.value && typeof data.value === 'object') {
          setStickersSettings((prev) => ({
            hero: { ...DEFAULT_STICKERS_SETTINGS.hero, ...(data.value.hero || {}) },
            promo: { ...DEFAULT_STICKERS_SETTINGS.promo, ...(data.value.promo || {}) },
            grid: { ...DEFAULT_STICKERS_SETTINGS.grid, ...(data.value.grid || {}) }
          }));
        }
      } catch (err) {
        console.warn('Error loading stickers_page_settings from Supabase:', err);
      } finally {
        setLoading(false);
      }
    }

    loadFromSupabase();
  }, []);

  // Save settings to localStorage whenever changed
  useEffect(() => {
    try {
      localStorage.setItem('duat_stickers_settings_v1', JSON.stringify(stickersSettings));
    } catch (e) {
      console.warn('Failed saving duat_stickers_settings to localStorage:', e);
    }
  }, [stickersSettings]);

  const saveSettingsToSupabase = async (newSettings) => {
    try {
      await supabase.from('store_settings').upsert({
        key: 'stickers_page_settings',
        value: newSettings,
        updated_at: new Date().toISOString()
      });
    } catch (err) {
      console.warn('Error upserting stickers_page_settings to Supabase:', err);
    }
  };

  const updateStickersHero = async (heroFields) => {
    setStickersSettings((prev) => {
      const updated = {
        ...prev,
        hero: { ...prev.hero, ...heroFields }
      };
      saveSettingsToSupabase(updated);
      return updated;
    });
  };

  const updateStickersPromo = async (promoFields) => {
    setStickersSettings((prev) => {
      const updated = {
        ...prev,
        promo: { ...prev.promo, ...promoFields }
      };
      saveSettingsToSupabase(updated);
      return updated;
    });
  };

  const updateStickersGridSettings = async (gridFields) => {
    setStickersSettings((prev) => {
      const updated = {
        ...prev,
        grid: { ...prev.grid, ...gridFields }
      };
      saveSettingsToSupabase(updated);
      return updated;
    });
  };

  const resetStickersSettings = async () => {
    setStickersSettings(DEFAULT_STICKERS_SETTINGS);
    localStorage.removeItem('duat_stickers_settings_v1');
    await saveSettingsToSupabase(DEFAULT_STICKERS_SETTINGS);
  };

  return (
    <StickersSettingsContext.Provider
      value={{
        stickersSettings,
        heroSettings: stickersSettings.hero,
        promoSettings: stickersSettings.promo,
        gridSettings: stickersSettings.grid,
        updateStickersHero,
        updateStickersPromo,
        updateStickersGridSettings,
        resetStickersSettings,
        loading
      }}
    >
      {children}
    </StickersSettingsContext.Provider>
  );
};

export const useStickersSettings = () => {
  const context = useContext(StickersSettingsContext);
  if (!context) {
    throw new Error('useStickersSettings must be used within StickersSettingsProvider');
  }
  return context;
};

export default StickersSettingsProvider;
