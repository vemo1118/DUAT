import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { CASE_TYPES as DEFAULT_CASE_TYPES, PHONE_MODELS as DEFAULT_PHONE_MODELS, STICKER_PRESETS as DEFAULT_STICKER_PRESETS } from '../data/products';

const CustomizerContext = createContext();

export const INITIAL_BUILDER_CONFIG = {
  price: 850,
  caseTypes: DEFAULT_CASE_TYPES.map((c) => ({ ...c, is_active: true })),
  phoneModels: DEFAULT_PHONE_MODELS.map((m) => ({ ...m, is_active: true })),
  stickers: DEFAULT_STICKER_PRESETS.map((s) => ({ ...s, is_active: true }))
};

function ensureOtherCustomFirst(models) {
  if (!Array.isArray(models) || models.length === 0) return models;
  const otherItem = { id: 'other-custom', name: 'Other Device (Type model below 📱)', nameEn: 'Other Device (Type model below 📱)', nameAr: 'جهاز آخر (اكتب اسم موديلك بالأسفل 📱)', category: 'Other', is_active: true };
  const filtered = models.filter((m) => m && m.id !== 'other-custom');
  return [otherItem, ...filtered];
}

export const CustomizerProvider = ({ children }) => {
  const [builderPrice, setBuilderPrice] = useState(() => {
    try {
      const saved = localStorage.getItem('duat_builder_price');
      if (saved) return Number(saved) || 850;
    } catch (e) {
      console.warn('Error reading duat_builder_price:', e);
    }
    return 850;
  });

  const [caseTypes, setCaseTypes] = useState(() => {
    try {
      const saved = localStorage.getItem('duat_case_types');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Error reading duat_case_types:', e);
    }
    return INITIAL_BUILDER_CONFIG.caseTypes;
  });

  const [phoneModels, setPhoneModels] = useState(() => {
    try {
      const saved = localStorage.getItem('duat_phone_models');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return ensureOtherCustomFirst(parsed);
      }
    } catch (e) {
      console.warn('Error reading duat_phone_models:', e);
    }
    return ensureOtherCustomFirst(INITIAL_BUILDER_CONFIG.phoneModels);
  });

  const [builderStickers, setBuilderStickers] = useState(() => {
    // Always start from INITIAL_BUILDER_CONFIG to ensure fresh PNG image URLs
    // User sticker order/visibility is managed via Supabase, not localStorage
    return INITIAL_BUILDER_CONFIG.stickers;
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('duat_builder_price', String(builderPrice));
      localStorage.setItem('duat_case_types', JSON.stringify(caseTypes));
      localStorage.setItem('duat_phone_models', JSON.stringify(ensureOtherCustomFirst(phoneModels)));
      localStorage.setItem('duat_builder_stickers_v1', JSON.stringify(builderStickers));
    } catch (e) {
      console.warn('Error persisting customizer config:', e);
    }
  }, [builderPrice, caseTypes, phoneModels, builderStickers]);

  // Sync with Supabase builder_settings if available
  useEffect(() => {
    let isMounted = true;
    const fetchSupabaseSettings = async () => {
      try {
        const { data, error } = await supabase.from('builder_settings').select('*').single();
        if (!error && data && isMounted) {
          if (data.price) setBuilderPrice(data.price);
          if (data.case_types) setCaseTypes(data.case_types);
          if (data.phone_models) setPhoneModels(ensureOtherCustomFirst(data.phone_models));
          if (data.builder_stickers) {
            const dbStickers = Array.isArray(data.builder_stickers) ? data.builder_stickers : [];
            const dbIds = new Set(dbStickers.map((s) => s?.id));
            const missingDefaults = INITIAL_BUILDER_CONFIG.stickers.filter((s) => !dbIds.has(s?.id));
            setBuilderStickers([...dbStickers, ...missingDefaults]);
          }
        }
      } catch (err) {
        console.warn('Supabase builder_settings fallback:', err);
      }
    };
    fetchSupabaseSettings();
    return () => { isMounted = false; };
  }, []);

  const saveToSupabase = async (newPrice, newCaseTypes, newPhoneModels, newStickers) => {
    try {
      await supabase.from('builder_settings').upsert({
        id: 'global-builder-config',
        price: newPrice,
        case_types: newCaseTypes,
        phone_models: ensureOtherCustomFirst(newPhoneModels),
        builder_stickers: newStickers,
        updated_at: new Date().toISOString()
      });
    } catch (err) {
      console.warn('Supabase builder_settings sync error:', err);
    }
  };

  // Case Type Operations
  const addCaseType = (newType) => {
    const item = {
      id: newType.id || `custom-finish-${Date.now()}`,
      nameEn: newType.nameEn || 'Custom Finish',
      nameAr: newType.nameAr || 'تقفيل جديد',
      color: newType.color || '#FFFFFF',
      bg: newType.color || '#FFFFFF',
      ring: newType.ring || '#E8A33D',
      is_active: true
    };
    setCaseTypes((prev) => {
      const updated = [item, ...prev];
      saveToSupabase(builderPrice, updated, phoneModels, builderStickers);
      return updated;
    });
  };

  const updateCaseType = (id, updatedFields) => {
    setCaseTypes((prev) => {
      const updated = prev.map((c) => (c.id === id ? { ...c, ...updatedFields } : c));
      saveToSupabase(builderPrice, updated, phoneModels, builderStickers);
      return updated;
    });
  };

  const toggleCaseTypeVisibility = (id) => {
    setCaseTypes((prev) => {
      const updated = prev.map((c) => (c.id === id ? { ...c, is_active: c.is_active === false ? true : false } : c));
      saveToSupabase(builderPrice, updated, phoneModels, builderStickers);
      return updated;
    });
  };

  const deleteCaseType = (id) => {
    setCaseTypes((prev) => {
      const updated = prev.filter((c) => c.id !== id);
      saveToSupabase(builderPrice, updated, phoneModels, builderStickers);
      return updated;
    });
  };

  // Phone Model Operations
  const addPhoneModel = (newModel) => {
    const item = {
      id: newModel.id || `model-${Date.now()}`,
      name: newModel.name || 'New Phone Model',
      nameEn: newModel.nameEn || newModel.name || 'New Phone Model',
      nameAr: newModel.nameAr || newModel.name || 'موديل جديد',
      category: newModel.category || 'Apple',
      is_active: true
    };
    setPhoneModels((prev) => {
      const updated = ensureOtherCustomFirst([item, ...prev]);
      saveToSupabase(builderPrice, caseTypes, updated, builderStickers);
      return updated;
    });
  };

  const updatePhoneModel = (id, updatedFields) => {
    setPhoneModels((prev) => {
      const updated = ensureOtherCustomFirst(prev.map((m) => (m.id === id ? { ...m, ...updatedFields } : m)));
      saveToSupabase(builderPrice, caseTypes, updated, builderStickers);
      return updated;
    });
  };

  const deletePhoneModel = (id) => {
    setPhoneModels((prev) => {
      const updated = ensureOtherCustomFirst(prev.filter((m) => m.id !== id));
      saveToSupabase(builderPrice, caseTypes, updated, builderStickers);
      return updated;
    });
  };

  // Builder Sticker Operations (FULL CRUD)
  const addBuilderSticker = (stickerData) => {
    const newSticker = {
      ...stickerData,
      id: stickerData.id || `st-${Date.now()}`,
      is_active: stickerData.is_active !== undefined ? stickerData.is_active : true
    };
    setBuilderStickers((prev) => {
      const updated = [...prev, newSticker];
      saveToSupabase(builderPrice, caseTypes, phoneModels, updated);
      return updated;
    });
    return newSticker;
  };

  const updateBuilderSticker = (id, updatedFields) => {
    setBuilderStickers((prev) => {
      const updated = prev.map((s) => (s.id === id ? { ...s, ...updatedFields } : s));
      saveToSupabase(builderPrice, caseTypes, phoneModels, updated);
      return updated;
    });
  };

  const toggleBuilderStickerVisibility = (id) => {
    setBuilderStickers((prev) => {
      const updated = prev.map((s) => {
        if (s.id === id) {
          const current = s.is_active !== false && s.isActive !== false;
          return { ...s, is_active: !current, isActive: !current };
        }
        return s;
      });
      saveToSupabase(builderPrice, caseTypes, phoneModels, updated);
      return updated;
    });
  };

  const deleteBuilderSticker = (id) => {
    setBuilderStickers((prev) => {
      const updated = prev.filter((s) => s.id !== id);
      saveToSupabase(builderPrice, caseTypes, phoneModels, updated);
      return updated;
    });
  };

  const resetBuilderStickers = () => {
    setBuilderStickers(INITIAL_BUILDER_CONFIG.stickers);
    localStorage.removeItem('duat_builder_stickers_v1');
  };

  const setCategoryStickersVisibility = (filterType, isVisible) => {
    setBuilderStickers((prev) => {
      const updated = prev.map((s) => {
        const isAr = s.id?.startsWith('ar-letter-') || s.id?.startsWith('st-letter-') || s.category === 'letters';
        const isEn = s.id?.startsWith('en-letter-') || s.id?.startsWith('st-en-letter-') || s.category === 'letters-en';
        const isMotif = !isAr && !isEn;

        let shouldTarget = false;
        if (filterType === 'letters-ar' && isAr) shouldTarget = true;
        else if (filterType === 'letters-en' && isEn) shouldTarget = true;
        else if (filterType === 'motifs' && isMotif) shouldTarget = true;
        else if (filterType === 'all') shouldTarget = true;

        if (shouldTarget) {
          return { ...s, is_active: isVisible, isActive: isVisible };
        }
        return s;
      });
      saveToSupabase(builderPrice, caseTypes, phoneModels, updated);
      return updated;
    });
  };

  const updatePrice = (priceVal) => {
    const val = Number(priceVal) || 850;
    setBuilderPrice(val);
    saveToSupabase(val, caseTypes, phoneModels, builderStickers);
  };

  const resetCustomizerConfig = () => {
    setBuilderPrice(850);
    setCaseTypes(INITIAL_BUILDER_CONFIG.caseTypes);
    setPhoneModels(ensureOtherCustomFirst(INITIAL_BUILDER_CONFIG.phoneModels));
    setBuilderStickers(INITIAL_BUILDER_CONFIG.stickers);
    localStorage.removeItem('duat_builder_price');
    localStorage.removeItem('duat_case_types');
    localStorage.removeItem('duat_phone_models');
    localStorage.removeItem('duat_builder_stickers_v1');
  };

  const activeCaseTypes = caseTypes.filter((c) => c.is_active !== false);
  const activePhoneModels = ensureOtherCustomFirst(phoneModels.filter((m) => m.is_active !== false));
  const activeBuilderStickers = builderStickers.filter((s) => s.is_active !== false && s.isActive !== false);

  return (
    <CustomizerContext.Provider
      value={{
        builderPrice,
        caseTypes,
        phoneModels,
        builderStickers,
        activeCaseTypes,
        activePhoneModels,
        activeBuilderStickers,
        addCaseType,
        updateCaseType,
        toggleCaseTypeVisibility,
        deleteCaseType,
        addPhoneModel,
        updatePhoneModel,
        deletePhoneModel,
        addBuilderSticker,
        updateBuilderSticker,
        toggleBuilderStickerVisibility,
        deleteBuilderSticker,
        resetBuilderStickers,
        setCategoryStickersVisibility,
        updatePrice,
        resetCustomizerConfig
      }}
    >
      {children}
    </CustomizerContext.Provider>
  );
};

export const useCustomizerConfig = () => {
  const context = useContext(CustomizerContext);
  if (!context) {
    throw new Error('useCustomizerConfig must be used within CustomizerProvider');
  }
  return context;
};
