import React, { createContext, useContext, useState, useEffect } from 'react';
import { TRANSLATIONS } from '../data/translations';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLangState] = useState(() => {
    // 1. Check URL query params (?lang=ar or ?lang=en)
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlLang = params.get('lang');
      if (urlLang === 'ar' || urlLang === 'en') {
        return urlLang;
      }
    }
    // 2. Check localStorage or default to English ('en')
    return localStorage.getItem('duat_lang') || 'en';
  });

  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    localStorage.setItem('duat_lang', lang);
  }, [lang]);

  const setLang = (newLang) => {
    setLangState(newLang);
  };

  const toggleLanguage = () => {
    setLangState(prev => (prev === 'en' ? 'ar' : 'en'));
  };

  const t = (key) => {
    if (!key) return '';
    // Exact match in active language
    if (TRANSLATIONS[lang]?.[key] !== undefined) {
      return TRANSLATIONS[lang][key];
    }
    // Exact match in English fallback
    if (TRANSLATIONS['en']?.[key] !== undefined) {
      return TRANSLATIONS['en'][key];
    }

    // Try lowerCamelCase lookup (e.g. TRACKERTITLE -> trackerTitle)
    const camelKey = key.charAt(0).toLowerCase() + key.slice(1);
    if (TRANSLATIONS[lang]?.[camelKey] !== undefined) {
      return TRANSLATIONS[lang][camelKey];
    }
    if (TRANSLATIONS['en']?.[camelKey] !== undefined) {
      return TRANSLATIONS['en'][camelKey];
    }

    // Fallback to raw key
    return key;
  };

  const formatPrice = (amount) => {
    const num = typeof amount === 'number' ? amount : Number(amount) || 0;
    const formatted = num.toLocaleString(lang === 'ar' ? 'ar-EG' : 'en-US');
    const currency = t('egp');
    return lang === 'ar' ? `${formatted} ${currency}` : `${currency} ${formatted}`;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLanguage, t, formatPrice }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};
