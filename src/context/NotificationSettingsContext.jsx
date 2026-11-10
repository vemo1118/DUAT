import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { supabase } from '../lib/supabase';
import { DEFAULT_NOTIFICATION_SETTINGS, NOTIFICATION_SETTINGS_KEY } from '../domain/notificationSettings';
import { saveNotificationSettingsToSupabase } from '../utils/orderNotifier';
import { subscribeCloudRefresh, setCloudValue } from '../services/cloudRefresh';
const Context = createContext(null);
export function NotificationSettingsProvider({ children }) {
  const [settings, setSettings] = useState(DEFAULT_NOTIFICATION_SETTINGS), [loading, setLoading] = useState(true), [error, setError] = useState(false);
  const version = useRef(0);
  const reload = useCallback(async () => {
    const current = ++version.current;
    const { data, error } = await supabase.from('store_settings').select('value').eq('key', NOTIFICATION_SETTINGS_KEY).maybeSingle();
    if (current !== version.current) return;
    setError(!!error);
    if (!error) setCloudValue(setSettings, { whatsapp: data?.value?.whatsapp || '' });
    setLoading(false);
  }, []);
  useEffect(() => {
    reload();
    const stop = subscribeCloudRefresh(reload);
    const channel = supabase.channel('duat-notification-settings').on('postgres_changes', { event: '*', schema: 'public', table: 'store_settings', filter: `key=eq.${NOTIFICATION_SETTINGS_KEY}` }, reload).subscribe();
    return () => { version.current++; stop(); supabase.removeChannel(channel); };
  }, [reload]);
  const saveSettings = async whatsapp => {
    version.current++;
    const saved = await saveNotificationSettingsToSupabase(null, null, whatsapp);
    version.current++; setCloudValue(setSettings, saved); setError(false); setLoading(false); return saved;
  };
  return <Context.Provider value={{ settings, loading, error, reload, saveSettings }}>{children}</Context.Provider>;
}
export const useNotificationSettings = () => useContext(Context);
