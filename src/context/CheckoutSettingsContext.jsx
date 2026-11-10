import { subscribeCloudRefresh, setCloudValue } from '../services/cloudRefresh';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { CHECKOUT_SETTINGS_KEY, DEFAULT_CHECKOUT_SETTINGS, normalizeCheckoutSettings } from '../domain/checkoutSettings';
const Context = createContext(null);
export function CheckoutSettingsProvider({ children }) {
  const [settings, setSettings] = useState(DEFAULT_CHECKOUT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const load = useCallback(async () => {
    const { data, error } = await supabase.from('store_settings').select('value').eq('key', CHECKOUT_SETTINGS_KEY).maybeSingle();
    setError(!!error);
    if (!error) setCloudValue(setSettings, normalizeCheckoutSettings(data?.value || {}));
    setLoading(false);
  }, []);
  useEffect(() => {
    load();
    const channel = supabase.channel('checkout-settings').on('postgres_changes', { event: '*', schema: 'public', table: 'store_settings', filter: `key=eq.${CHECKOUT_SETTINGS_KEY}` }, load).subscribe();
    const stopRefresh = subscribeCloudRefresh(load);
    return () => { supabase.removeChannel(channel); stopRefresh(); };
  }, [load]);
  const saveSettings = async raw => {
    const next = normalizeCheckoutSettings(raw);
    if (next.enabled && !next.methods.some(m => m.enabled && (m.type === 'cod' || m.account))) throw new Error('أضف طريقة دفع مفعّلة أو أوقف استقبال الطلبات.');
    if (next.methods.some(m => m.enabled && (!m.titleAr || !m.titleEn || (m.type === 'transfer' && !m.account)))) throw new Error('أكمل اسم طريقة الدفع باللغتين وبيانات التحويل.');
    const { data, error } = await supabase.from('store_settings').upsert({ key: CHECKOUT_SETTINGS_KEY, value: next, updated_at: new Date().toISOString() }).select('value').single();
    if (error || !data) throw new Error('تعذر حفظ إعدادات الطلب على السيرفر.');
    const saved = normalizeCheckoutSettings(data.value); setCloudValue(setSettings, saved); return saved;
  };
  return <Context.Provider value={{ settings, loading, error, reload: load, saveSettings }}>{children}</Context.Provider>;
}
export const useCheckoutSettings = () => useContext(Context);
