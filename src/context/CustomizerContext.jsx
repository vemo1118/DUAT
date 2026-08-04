import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { CASE_TYPES as DEFAULT_CASE_TYPES, PHONE_MODELS as DEFAULT_PHONE_MODELS } from '../data/products';

const CustomizerContext = createContext();

export const INITIAL_BUILDER_CONFIG = {
  price: 850,
  caseTypes: DEFAULT_CASE_TYPES.map((c) => ({ ...c, is_active: true })),
  phoneModels: DEFAULT_PHONE_MODELS.map((m) => ({ ...m, is_active: true }))
};

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
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Error reading duat_phone_models:', e);
    }
    return INITIAL_BUILDER_CONFIG.phoneModels;
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('duat_builder_price', String(builderPrice));
      localStorage.setItem('duat_case_types', JSON.stringify(caseTypes));
      localStorage.setItem('duat_phone_models', JSON.stringify(phoneModels));
    } catch (e) {
      console.warn('Error persisting customizer config:', e);
    }
  }, [builderPrice, caseTypes, phoneModels]);

  // Sync with Supabase builder_settings if available
  useEffect(() => {
    let isMounted = true;
    const fetchSupabaseSettings = async () => {
      try {
        const { data, error } = await supabase.from('builder_settings').select('*').single();
        if (!error && data && isMounted) {
          if (data.price) setBuilderPrice(data.price);
          if (data.case_types) setCaseTypes(data.case_types);
          if (data.phone_models) setPhoneModels(data.phone_models);
        }
      } catch (err) {
        console.warn('Supabase builder_settings fallback:', err);
      }
    };
    fetchSupabaseSettings();
    return () => { isMounted = false; };
  }, []);

  const saveToSupabase = async (newPrice, newCaseTypes, newPhoneModels) => {
    try {
      await supabase.from('builder_settings').upsert({
        id: 'global-builder-config',
        price: newPrice,
        case_types: newCaseTypes,
        phone_models: newPhoneModels,
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
      saveToSupabase(builderPrice, updated, phoneModels);
      return updated;
    });
  };

  const updateCaseType = (id, updatedFields) => {
    setCaseTypes((prev) => {
      const updated = prev.map((c) => (c.id === id ? { ...c, ...updatedFields } : c));
      saveToSupabase(builderPrice, updated, phoneModels);
      return updated;
    });
  };

  const toggleCaseTypeVisibility = (id) => {
    setCaseTypes((prev) => {
      const updated = prev.map((c) => (c.id === id ? { ...c, is_active: c.is_active === false ? true : false } : c));
      saveToSupabase(builderPrice, updated, phoneModels);
      return updated;
    });
  };

  const deleteCaseType = (id) => {
    setCaseTypes((prev) => {
      const updated = prev.filter((c) => c.id !== id);
      saveToSupabase(builderPrice, updated, phoneModels);
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
      const updated = [item, ...prev];
      saveToSupabase(builderPrice, updated, caseTypes);
      return updated;
    });
  };

  const updatePhoneModel = (id, updatedFields) => {
    setPhoneModels((prev) => {
      const updated = prev.map((m) => (m.id === id ? { ...m, ...updatedFields } : m));
      saveToSupabase(builderPrice, updated, caseTypes);
      return updated;
    });
  };

  const deletePhoneModel = (id) => {
    setPhoneModels((prev) => {
      const updated = prev.filter((m) => m.id !== id);
      saveToSupabase(builderPrice, updated, caseTypes);
      return updated;
    });
  };

  const updatePrice = (priceVal) => {
    const val = Number(priceVal) || 850;
    setBuilderPrice(val);
    saveToSupabase(val, caseTypes, phoneModels);
  };

  const resetCustomizerConfig = () => {
    setBuilderPrice(850);
    setCaseTypes(INITIAL_BUILDER_CONFIG.caseTypes);
    setPhoneModels(INITIAL_BUILDER_CONFIG.phoneModels);
    localStorage.removeItem('duat_builder_price');
    localStorage.removeItem('duat_case_types');
    localStorage.removeItem('duat_phone_models');
  };

  const activeCaseTypes = caseTypes.filter((c) => c.is_active !== false);
  const activePhoneModels = phoneModels.filter((m) => m.is_active !== false);

  return (
    <CustomizerContext.Provider
      value={{
        builderPrice,
        caseTypes,
        phoneModels,
        activeCaseTypes,
        activePhoneModels,
        addCaseType,
        updateCaseType,
        toggleCaseTypeVisibility,
        deleteCaseType,
        addPhoneModel,
        updatePhoneModel,
        deletePhoneModel,
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
