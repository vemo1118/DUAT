import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { subscribeToLiveSync } from '../services/liveSyncService';

const SocialGridContext = createContext();

export const INITIAL_SOCIAL_GRID_SETTINGS = {
  eyebrow: 'DUAT / SOCIALS',
  titleEn: 'FOLLOW THE PASSAGE',
  titleAr: 'تابع الرحلة على إنستجرام',
  handleLabel: '@DUAT.WEAR',
  handleUrl: 'https://instagram.com/duat.wear'
};

export const INITIAL_SOCIAL_TILES = [
  {
    id: 'tile-1',
    image: 'https://res.cloudinary.com/ikim5u08/image/upload/f_auto,q_auto/v1785764123/B1_Whit_rkck3n.jpg',
    title: 'BONE BUNDLE',
    linkUrl: 'https://instagram.com/duat.wear',
    is_active: true
  },
  {
    id: 'tile-2',
    image: 'https://res.cloudinary.com/ikim5u08/image/upload/f_auto,q_auto/v1785764123/B1_DarkNight_dzbmmn.jpg',
    title: 'MIDNIGHT BUNDLE',
    linkUrl: 'https://instagram.com/duat.wear',
    is_active: true
  },
  {
    id: 'tile-3',
    image: 'https://res.cloudinary.com/ikim5u08/image/upload/f_auto,q_auto/v1785768478/B1_TB_w1zemr.jpg',
    title: 'CLEAR BUNDLE',
    linkUrl: 'https://instagram.com/duat.wear',
    is_active: true
  },
  {
    id: 'tile-4',
    image: 'https://res.cloudinary.com/ikim5u08/image/upload/f_auto,q_auto/v1785712166/B1_u3veqk.jpg',
    title: 'DUAT HERO',
    linkUrl: 'https://instagram.com/duat.wear',
    is_active: true
  },
  {
    id: 'tile-5',
    image: 'https://res.cloudinary.com/ikim5u08/image/upload/f_auto,q_auto/v1785825222/SH1_ST_j1z2h3.png',
    title: 'STICKER SHEET',
    linkUrl: 'https://instagram.com/duat.wear',
    is_active: true
  },
  {
    id: 'tile-6',
    image: 'https://res.cloudinary.com/ikim5u08/image/upload/f_auto,q_auto/v1785764123/B1_DarkNight_dzbmmn.jpg',
    title: 'PASSAGE CASE',
    linkUrl: 'https://instagram.com/duat.wear',
    is_active: true
  }
];

const SETTINGS_KEY = 'duat_social_settings_v1';
const TILES_KEY = 'duat_social_tiles_v1';

export const SocialGridProvider = ({ children }) => {
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Error reading social grid settings:', e);
    }
    return INITIAL_SOCIAL_GRID_SETTINGS;
  });

  const [tiles, setTiles] = useState(() => {
    try {
      const saved = localStorage.getItem(TILES_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Error reading social tiles:', e);
    }
    return INITIAL_SOCIAL_TILES;
  });

  // Fetch from Supabase on mount — also used by Realtime broadcast subscription
  useEffect(() => {
    let isMounted = true;

    async function loadSocialFromSupabase() {
      try {
        const { data: setRes } = await supabase
          .from('store_settings')
          .select('value')
          .eq('key', 'social_grid_settings')
          .maybeSingle();

        if (isMounted && setRes?.value && typeof setRes.value === 'object') {
          setSettings((prev) => ({ ...prev, ...setRes.value }));
        }

        const { data: tileRes } = await supabase
          .from('store_settings')
          .select('value')
          .eq('key', 'social_grid_tiles')
          .maybeSingle();

        if (isMounted && Array.isArray(tileRes?.value) && tileRes.value.length > 0) {
          setTiles(tileRes.value);
        }
      } catch (err) {
        console.warn('Error loading social grid from Supabase:', err);
      }
    }

    // Initial load
    loadSocialFromSupabase();

    // Subscribe to Supabase Realtime broadcasts from admin
    const unsubscribe = subscribeToLiveSync(() => {
      if (isMounted) loadSocialFromSupabase();
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch {
      // Local storage is optional in privacy-restricted browsers.
    }
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem(TILES_KEY, JSON.stringify(tiles));
    } catch {
      // Local storage is optional in privacy-restricted browsers.
    }
  }, [tiles]);

  const updateSettings = async (newFields) => {
    const updated = { ...settings, ...newFields };
    setSettings(updated);
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));

    try {
      await supabase.from('store_settings').upsert({
        key: 'social_grid_settings',
        value: updated,
        updated_at: new Date().toISOString()
      });
    } catch (err) {
      console.warn('Error saving social grid settings to Supabase:', err);
    }
  };

  const saveTilesToSupabase = async (updatedTiles) => {
    try {
      await supabase.from('store_settings').upsert({
        key: 'social_grid_tiles',
        value: updatedTiles,
        updated_at: new Date().toISOString()
      });
    } catch (err) {
      console.warn('Error saving social tiles to Supabase:', err);
    }
  };

  const addTile = async (tileData) => {
    const newTile = {
      ...tileData,
      id: tileData.id || `tile-${Date.now()}`,
      is_active: tileData.is_active !== undefined ? tileData.is_active : true
    };
    const updated = [...tiles, newTile];
    setTiles(updated);
    localStorage.setItem(TILES_KEY, JSON.stringify(updated));
    await saveTilesToSupabase(updated);
    return newTile;
  };

  const updateTile = async (id, updatedFields) => {
    const updated = tiles.map((t) => (t.id === id ? { ...t, ...updatedFields } : t));
    setTiles(updated);
    localStorage.setItem(TILES_KEY, JSON.stringify(updated));
    await saveTilesToSupabase(updated);
  };

  const toggleTileVisibility = async (id) => {
    const updated = tiles.map((t) => {
      if (t.id === id) {
        const current = t.is_active !== false && t.isActive !== false;
        return { ...t, is_active: !current, isActive: !current };
      }
      return t;
    });
    setTiles(updated);
    localStorage.setItem(TILES_KEY, JSON.stringify(updated));
    await saveTilesToSupabase(updated);
  };

  const deleteTile = async (id) => {
    const updated = tiles.filter((t) => t.id !== id);
    setTiles(updated);
    localStorage.setItem(TILES_KEY, JSON.stringify(updated));
    await saveTilesToSupabase(updated);
  };

  const resetSocialGrid = () => {
    setSettings(INITIAL_SOCIAL_GRID_SETTINGS);
    setTiles(INITIAL_SOCIAL_TILES);
    localStorage.removeItem(SETTINGS_KEY);
    localStorage.removeItem(TILES_KEY);
  };

  return (
    <SocialGridContext.Provider
      value={{
        settings,
        tiles,
        updateSettings,
        addTile,
        updateTile,
        toggleTileVisibility,
        deleteTile,
        resetSocialGrid
      }}
    >
      {children}
    </SocialGridContext.Provider>
  );
};

export const useSocialGrid = () => {
  const context = useContext(SocialGridContext);
  if (!context) {
    throw new Error('useSocialGrid must be used within SocialGridProvider');
  }
  return context;
};
