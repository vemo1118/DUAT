import { subscribeCloudRefresh, setCloudValue } from '../services/cloudRefresh';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const BundlesSettingsContext = createContext();

export const DEFAULT_BUNDLES_SETTINGS = {
  hero: {
    isActive: true,
    eyebrowAr: 'بندلات وتجميعات حصرية 🎁',
    eyebrowEn: 'EXCLUSIVE BUNDLES 🎁',
    titleAr: 'قسم البندلز الجاهزة 🎁',
    titleEn: 'Ready Sticker Bundles 🎁',
    descAr: 'تجميعات مجهزة من استيكرات البارز المجسمة بسعر موفّر وأرخص من الشراء المنفرد لو اشتريت نفس العدد حبة حبة!',
    descEn: 'Pre-packaged sets of raised 3D stickers at discounted bundle prices compared to buying individually!',
    bgImage: '',
    mobileBgImage: '',
    showPerks: true,
    perks: [
      { id: 1, textAr: 'توفير يصل إلى ١٥٠ ج.م بالبندل', textEn: 'Save up to 150 EGP per bundle', icon: 'Tag', active: true },
      { id: 2, textAr: 'تأتي في علبة هدايا العبور الفاخرة', textEn: 'Includes DUAT luxury gift box', icon: 'Gift', active: true },
      { id: 3, textAr: 'موعد الطلب بيظهر قبل الدفع', textEn: 'Order timing shown before payment', icon: 'Zap', active: true }
    ]
  },
  cta: {
    isActive: true,
    eyebrowAr: 'استيكر خاص على كيفك 🎨',
    eyebrowEn: 'Custom Sticker Builder 🎨',
    titleAr: 'عايز تعمل استيكر بارز مخصوص ليك؟',
    titleEn: 'Want to create a custom sticker?',
    descAr: 'ادخل بيلدر الاستيكرات المباشر، اكتب أي اسم أو عبارة أو ارفع صورتك وتصميمك ونعملها لك استيكر مجسم بارز 3D!',
    descEn: 'Enter the custom sticker builder, enter your text, or upload your image and design for a raised 3D finish!',
    buttonTextAr: 'افتح بيلدر الاستيكرز',
    buttonTextEn: 'OPEN STICKER BUILDER',
    buttonLink: '/sticker-builder',
    bgImage: '',
    mobileBgImage: ''
  },
  grid: {
    titleAr: 'جميع البندلات والعروض المتاحة',
    titleEn: 'ALL AVAILABLE BUNDLES',
    badgeBoxIncludedAr: 'شامل الهدية',
    badgeBoxIncludedEn: 'Box Included',
    emptyMessageAr: 'لا توجد بندلات مجمعة متوفرة حالياً.',
    emptyMessageEn: 'No sticker bundles available at the moment.'
  }
};

export const BundlesSettingsProvider = ({ children }) => {
  const [bundlesSettings, setBundlesSettings] = useState(DEFAULT_BUNDLES_SETTINGS);
  const [loading, setLoading] = useState(false);

  // Fetch latest from Supabase (called on mount and on remote update)
  const loadFromSupabase = async () => {
    try {
      const { data, error } = await supabase
        .from('store_settings')
        .select('value')
        .eq('key', 'bundles_page_settings')
        .maybeSingle();
      if (!error) {
        setCloudValue(setBundlesSettings, {
          hero: { ...DEFAULT_BUNDLES_SETTINGS.hero, ...(data?.value?.hero || {}) },
          cta: { ...DEFAULT_BUNDLES_SETTINGS.cta, ...(data?.value?.cta || {}) },
          grid: { ...DEFAULT_BUNDLES_SETTINGS.grid, ...(data?.value?.grid || {}) }
        });
      }
    } catch (err) {
      console.warn('[BundlesSettings] Supabase fetch error:', err);
    }
  };

  useEffect(() => {
    // Initial load from Supabase
    loadFromSupabase();
    const stopRefresh = subscribeCloudRefresh(loadFromSupabase);

    const channel = supabase
      .channel('duat-bundles-settings')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'store_settings',
          filter: 'key=eq.bundles_page_settings'
        },
        loadFromSupabase
      )
      .subscribe();

    return () => {
      stopRefresh();
      supabase.removeChannel(channel);
    };
  }, []);

  // Keep a local fallback without emitting another data-refresh event.
  useEffect(() => {
    try {
      localStorage.setItem('duat_bundles_settings_v1', JSON.stringify(bundlesSettings));
    } catch (e) {
      console.warn('Failed saving duat_bundles_settings to localStorage:', e);
    }
  }, [bundlesSettings]);


  const saveSettingsToSupabase = async (newSettings) => {
    const { data, error } = await supabase.from('store_settings').upsert({
        key: 'bundles_page_settings',
        value: newSettings,
        updated_at: new Date().toISOString()
      }).select('key').single();
    if (error || !data) throw error || new Error('BUNDLES_SETTINGS_SAVE_FAILED');
  };

  const updateBundlesHero = async (heroFields) => {
    const updated = { ...bundlesSettings, hero: { ...bundlesSettings.hero, ...heroFields } };
    await saveSettingsToSupabase(updated);
    setCloudValue(setBundlesSettings, updated);
    return updated;
  };

  const updateBundlesCta = async (ctaFields) => {
    const updated = { ...bundlesSettings, cta: { ...bundlesSettings.cta, ...ctaFields } };
    await saveSettingsToSupabase(updated);
    setCloudValue(setBundlesSettings, updated);
    return updated;
  };

  const updateBundlesGridSettings = async (gridFields) => {
    const updated = { ...bundlesSettings, grid: { ...bundlesSettings.grid, ...gridFields } };
    await saveSettingsToSupabase(updated);
    setCloudValue(setBundlesSettings, updated);
    return updated;
  };

  const resetBundlesSettings = async () => {
    await saveSettingsToSupabase(DEFAULT_BUNDLES_SETTINGS);
    setCloudValue(setBundlesSettings, DEFAULT_BUNDLES_SETTINGS);
  };

  return (
    <BundlesSettingsContext.Provider
      value={{
        bundlesSettings,
        heroSettings: bundlesSettings.hero,
        ctaSettings: bundlesSettings.cta,
        gridSettings: bundlesSettings.grid,
        updateBundlesHero,
        updateBundlesCta,
        updateBundlesGridSettings,
        resetBundlesSettings,
        loading
      }}
    >
      {children}
    </BundlesSettingsContext.Provider>
  );
};

export const useBundlesSettings = () => {
  const context = useContext(BundlesSettingsContext);
  if (!context) {
    throw new Error('useBundlesSettings must be used within BundlesSettingsProvider');
  }
  return context;
};

export default BundlesSettingsProvider;
