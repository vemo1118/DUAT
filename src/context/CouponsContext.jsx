import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const CouponsContext = createContext();

const INITIAL_COUPONS = [
  { code: 'DUAT10', type: 'percentage', value: 10, isActive: true, description: 'خصم ١٠٪ على جميع المنتجات' },
  { code: 'DAWN100', type: 'fixed', value: 100, isActive: true, description: 'خصم ١٠٠ ج.م ثابت' },
  { code: 'SUMMER20', type: 'percentage', value: 20, isActive: true, description: 'خصم الصيف ٢٠٪' }
];

const COUPONS_STORAGE_KEY = 'duat_coupons_list_v1';

export const CouponsProvider = ({ children }) => {
  const [coupons, setCoupons] = useState(() => {
    try {
      const saved = localStorage.getItem(COUPONS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_COUPONS;
    } catch (e) {
      return INITIAL_COUPONS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(COUPONS_STORAGE_KEY, JSON.stringify(coupons));
    } catch (e) {
      console.warn('Error saving coupons:', e);
    }
  }, [coupons]);

  const validateCoupon = (codeStr, cartSubtotal) => {
    if (!codeStr) return { valid: false, message: 'يرجى إدخال كود الخصم' };
    const clean = codeStr.trim().toUpperCase();
    const match = coupons.find(c => c.code.toUpperCase() === clean && c.isActive !== false);

    if (!match) {
      return { valid: false, message: 'كود الخصم غير صحيح أو غير فعال' };
    }

    let discountAmount = 0;
    if (match.type === 'percentage') {
      discountAmount = Math.round((cartSubtotal * match.value) / 100);
    } else if (match.type === 'fixed') {
      discountAmount = Math.min(match.value, cartSubtotal);
    }

    return {
      valid: true,
      code: match.code,
      discountAmount,
      type: match.type,
      value: match.value,
      message: `تم تطبيق الخصم بنجاح (${discountAmount} ج.م)!`
    };
  };

  const addCoupon = (newCoupon) => {
    setCoupons(prev => [...prev, { ...newCoupon, code: newCoupon.code.toUpperCase(), isActive: true }]);
  };

  const toggleCouponStatus = (code) => {
    setCoupons(prev => prev.map(c => c.code === code ? { ...c, isActive: !c.isActive } : c));
  };

  const deleteCoupon = (code) => {
    setCoupons(prev => prev.filter(c => c.code !== code));
  };

  return (
    <CouponsContext.Provider value={{
      coupons,
      validateCoupon,
      addCoupon,
      toggleCouponStatus,
      deleteCoupon
    }}>
      {children}
    </CouponsContext.Provider>
  );
};

export const useCoupons = () => {
  const context = useContext(CouponsContext);
  if (!context) {
    throw new Error('useCoupons must be used within CouponsProvider');
  }
  return context;
};
