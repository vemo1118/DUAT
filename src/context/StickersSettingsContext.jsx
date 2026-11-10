import { subscribeCloudRefresh, setCloudValue } from '../services/cloudRefresh';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const StickersSettingsContext = createContext();

export const DEFAULT_STICKERS_SETTINGS = {
  hero: {
    isActive: true,
    eyebrowAr: 'استيكرات بارزة مجسمة ✦',
    eyebrowEn: 'RAISED 3D STICKERS ✦',
    titleAr: 'قسم الاستيكرات ✦',
    titleEn: 'Stickers Collection ✦',
    descAr: 'تشكيلة ملصقات البارز ثلاثية الأبعاد البارزة، عبارات العبور، الحروف العربية والإنجليزية وشارات الميلاد.',
    descEn: 'Browse our raised 3D stickers, slogans, letters, and badges.',
    bgImage: '',
    mobileBgImage: ''
  },
  promo: {
    isActive: true,
    titleAr: 'عايز استيكر بمواصفاتك الخاصة؟ 🎨',
    titleEn: 'Want a custom sticker? 🎨',
    descAr: 'خش على بيلدر الاستيكرات واكتب النص اللي تحبه أو ارفع صورتك الخاصة ونعملها لك استيكر مجسم بارز 3D!',
    descEn: 'Use our Sticker Builder to write custom text or upload an image to turn into a raised 3D sticker!',
    buttonTextAr: 'بيلدر الاستيكرز',
    buttonTextEn: 'STICKER BUILDER',
    buttonLink: '/sticker-builder',
    mobileBgImage: ''
  },
  grid: {
    emptyMessageAr: 'لم يتم العثور على استيكرات مطابقة للفلتر المحدد.',
    emptyMessageEn: 'No stickers found matching selected filter.'
  }
};

export const StickersSettingsProvider = ({ children }) => {
  const [stickersSettings, setStickersSettings] = useState(DEFAULT_STICKERS_SETTINGS);
  const [loading, setLoading] = useState(false);

  // Load settings from Supabase — also used by Realtime broadcast subscription
  useEffect(() => {
    let isMounted = true;

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

        if (isMounted && !error) {
          setCloudValue(setStickersSettings, {
            hero: { ...DEFAULT_STICKERS_SETTINGS.hero, ...(data?.value?.hero || {}) },
            promo: { ...DEFAULT_STICKERS_SETTINGS.promo, ...(data?.value?.promo || {}) },
            grid: { ...DEFAULT_STICKERS_SETTINGS.grid, ...(data?.value?.grid || {}) }
          });
        }
      } catch (err) {
        console.warn('Error loading stickers_page_settings from Supabase:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    // Initial load
    loadFromSupabase();
    const stopRefresh = subscribeCloudRefresh(loadFromSupabase);

    const channel = supabase
      .channel('duat-stickers-settings')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'store_settings',
          filter: 'key=eq.stickers_page_settings'
        },
        () => {
          if (isMounted) loadFromSupabase();
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      stopRefresh();
      supabase.removeChannel(channel);
    };
  }, []);

  // Keep a local fallback without emitting another data-refresh event.
  useEffect(() => {
    try {
      localStorage.setItem('duat_stickers_settings_v1', JSON.stringify(stickersSettings));
    } catch (e) {
      console.warn('Failed saving duat_stickers_settings to localStorage:', e);
    }
  }, [stickersSettings]);


  const saveSettingsToSupabase = async (newSettings) => {
    const { data, error } = await supabase.from('store_settings').upsert({
        key: 'stickers_page_settings',
        value: newSettings,
        updated_at: new Date().toISOString()
      }).select('key').single();
    if (error || !data) throw error || new Error('STICKERS_SETTINGS_SAVE_FAILED');
  };

  const updateStickersHero = async (heroFields) => {
    const updated = { ...stickersSettings, hero: { ...stickersSettings.hero, ...heroFields } };
    await saveSettingsToSupabase(updated);
    setCloudValue(setStickersSettings, updated);
    return updated;
  };

  const updateStickersPromo = async (promoFields) => {
    const updated = { ...stickersSettings, promo: { ...stickersSettings.promo, ...promoFields } };
    await saveSettingsToSupabase(updated);
    setCloudValue(setStickersSettings, updated);
    return updated;
  };

  const updateStickersGridSettings = async (gridFields) => {
    const updated = { ...stickersSettings, grid: { ...stickersSettings.grid, ...gridFields } };
    await saveSettingsToSupabase(updated);
    setCloudValue(setStickersSettings, updated);
    return updated;
  };

  const resetStickersSettings = async () => {
    await saveSettingsToSupabase(DEFAULT_STICKERS_SETTINGS);
    setCloudValue(setStickersSettings, DEFAULT_STICKERS_SETTINGS);
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
