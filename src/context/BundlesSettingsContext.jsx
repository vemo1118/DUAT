import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import liveCustomEdits from '../data/live_custom_edits.json';
import {
  fetchCloudEdits,
  publishCloudEdits,
  subscribeToLiveSync,
  getLiveSyncState,
  isRemoteUpdate
} from '../services/liveSyncService';

const BundlesSettingsContext = createContext();

export const DEFAULT_BUNDLES_SETTINGS = {
  hero: {
    isActive: true,
    eyebrowAr: 'بندلات وتجميعات حصرية 🎁',
    eyebrowEn: 'EXCLUSIVE BUNDLES 🎁',
    titleAr: 'قسم البندلز الجاهزة 🎁',
    titleEn: 'Ready Sticker Bundles 🎁',
    descAr: 'تجميعات مجهزة من استيكرات الإيبوكسي المجسمة بسعر موفّر وأرخص من الشراء المنفرد لو اشتريت نفس العدد حبة حبة!',
    descEn: 'Pre-packaged sets of raised 3D epoxy stickers at discounted bundle prices compared to buying individually!',
    bgImage: '',
    mobileBgImage: '',
    showPerks: true,
    perks: [
      { id: 1, textAr: 'توفير يصل إلى ١٥٠ ج.م بالبندل', textEn: 'Save up to 150 EGP per bundle', icon: 'Tag', active: true },
      { id: 2, textAr: 'تأتي في علبة هدايا العبور الفاخرة', textEn: 'Includes DUAT luxury gift box', icon: 'Gift', active: true },
      { id: 3, textAr: 'شحن فوري لكل المحافظات', textEn: 'Fast shipping across Egypt', icon: 'Zap', active: true }
    ]
  },
  cta: {
    isActive: true,
    eyebrowAr: 'استيكر خاص على كيفك 🎨',
    eyebrowEn: 'Custom Sticker Builder 🎨',
    titleAr: 'عايز تعمل استيكر إيبوكسي مخصوص ليك؟',
    titleEn: 'Want to create a custom sticker?',
    descAr: 'ادخل بيلدر الاستيكرات المباشر، اكتب أي اسم أو عبارة أو ارفع صورتك وتصميمك ونعملها لك استيكر إيبوكسي مجسم 3D!',
    descEn: 'Enter the custom sticker builder, enter your text, or upload your image and design for a 3D epoxy dome!',
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
  const getCombinedSettings = () => {
    const syncState = getLiveSyncState();
    const source = syncState?.bundlesSettings || liveCustomEdits?.bundlesSettings || {};
    try {
      const saved = localStorage.getItem('duat_bundles_settings_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          hero: { ...DEFAULT_BUNDLES_SETTINGS.hero, ...source.hero, ...parsed.hero },
          cta: { ...DEFAULT_BUNDLES_SETTINGS.cta, ...source.cta, ...parsed.cta },
          grid: { ...DEFAULT_BUNDLES_SETTINGS.grid, ...source.grid, ...parsed.grid }
        };
      }
    } catch (e) {
      console.warn('Error reading duat_bundles_settings from localStorage:', e);
    }
    return {
      hero: { ...DEFAULT_BUNDLES_SETTINGS.hero, ...source.hero },
      cta: { ...DEFAULT_BUNDLES_SETTINGS.cta, ...source.cta },
      grid: { ...DEFAULT_BUNDLES_SETTINGS.grid, ...source.grid }
    };
  };

  const [bundlesSettings, setBundlesSettings] = useState(() => getCombinedSettings());
  const [loading, setLoading] = useState(false);

  // Fetch latest from Supabase (called on mount and on remote update)
  const loadFromSupabase = async () => {
    try {
      const { data, error } = await supabase
        .from('store_settings')
        .select('value')
        .eq('key', 'bundles_page_settings')
        .maybeSingle();
      if (!error && data?.value && typeof data.value === 'object') {
        setBundlesSettings({
          hero: { ...DEFAULT_BUNDLES_SETTINGS.hero, ...(data.value.hero || {}) },
          cta: { ...DEFAULT_BUNDLES_SETTINGS.cta, ...(data.value.cta || {}) },
          grid: { ...DEFAULT_BUNDLES_SETTINGS.grid, ...(data.value.grid || {}) }
        });
      }
    } catch (err) {
      console.warn('[BundlesSettings] Supabase fetch error:', err);
    }
  };

  useEffect(() => {
    // Initial load from Supabase
    loadFromSupabase();

    // Subscribe to Supabase Realtime broadcasts from admin
    const unsubscribe = subscribeToLiveSync(() => {
      loadFromSupabase();
    });
    return () => unsubscribe();
  }, []);

  // Save to localStorage and publish to global cloud store whenever bundlesSettings changes
  // Skip publish when the update came from a remote broadcast (prevents feedback loop)
  useEffect(() => {
    if (isRemoteUpdate()) return;
    try {
      localStorage.setItem('duat_bundles_settings_v1', JSON.stringify(bundlesSettings));
      publishCloudEdits({ bundlesSettings });
    } catch (e) {
      console.warn('Failed saving duat_bundles_settings to localStorage:', e);
    }
  }, [bundlesSettings]);

  const saveSettingsToSupabase = async (newSettings) => {
    try {
      await supabase.from('store_settings').upsert({
        key: 'bundles_page_settings',
        value: newSettings,
        updated_at: new Date().toISOString()
      });
    } catch (err) {
      console.warn('Error upserting bundles_page_settings to Supabase:', err);
    }
  };

  const updateBundlesHero = async (heroFields) => {
    setBundlesSettings((prev) => {
      const updated = {
        ...prev,
        hero: { ...prev.hero, ...heroFields }
      };
      saveSettingsToSupabase(updated);
      return updated;
    });
  };

  const updateBundlesCta = async (ctaFields) => {
    setBundlesSettings((prev) => {
      const updated = {
        ...prev,
        cta: { ...prev.cta, ...ctaFields }
      };
      saveSettingsToSupabase(updated);
      return updated;
    });
  };

  const updateBundlesGridSettings = async (gridFields) => {
    setBundlesSettings((prev) => {
      const updated = {
        ...prev,
        grid: { ...prev.grid, ...gridFields }
      };
      saveSettingsToSupabase(updated);
      return updated;
    });
  };

  const resetBundlesSettings = async () => {
    setBundlesSettings(DEFAULT_BUNDLES_SETTINGS);
    localStorage.removeItem('duat_bundles_settings_v1');
    await saveSettingsToSupabase(DEFAULT_BUNDLES_SETTINGS);
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
