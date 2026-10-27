import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { isInlineStoreImage, uploadStoreImageDataUrl } from '../services/storeAssetService';

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
    title: 'STICKER SHEET',
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
          setSettings({ ...INITIAL_SOCIAL_GRID_SETTINGS, ...setRes.value });
        }

        const { data: tileRes } = await supabase
          .from('store_settings')
          .select('value')
          .eq('key', 'social_grid_tiles')
          .maybeSingle();

        if (isMounted && Array.isArray(tileRes?.value)) {
          setTiles(tileRes.value);
        }
      } catch (err) {
        console.warn('Error loading social grid from Supabase:', err);
      }
    }

    // Initial load
    loadSocialFromSupabase();

    const reloadSocial = () => {
      if (isMounted) loadSocialFromSupabase();
    };
    const channel = supabase
      .channel('duat-social-settings')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'store_settings',
          filter: 'key=eq.social_grid_settings'
        },
        reloadSocial
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'store_settings',
          filter: 'key=eq.social_grid_tiles'
        },
        reloadSocial
      )
      .subscribe();
    window.addEventListener('focus', reloadSocial);

    return () => {
      isMounted = false;
      window.removeEventListener('focus', reloadSocial);
      supabase.removeChannel(channel);
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
    const { data, error } = await supabase.from('store_settings').upsert({
        key: 'social_grid_settings',
        value: updated,
        updated_at: new Date().toISOString()
      }).select('key').single();
    if (error || !data) throw error || new Error('SOCIAL_SETTINGS_SAVE_FAILED');
    setSettings(updated);
    return updated;
  };

  const saveTilesToSupabase = async (updatedTiles) => {
    const cloudTiles = [];
    for (const tile of updatedTiles) {
      const image = tile.image || tile.imageUrl || '';
      if (isInlineStoreImage(image)) {
        const upload = await uploadStoreImageDataUrl(image, { folder: 'social-grid', assetId: tile.id });
        cloudTiles.push({ ...tile, image: upload.publicUrl, imageUrl: upload.publicUrl });
      } else {
        cloudTiles.push(tile);
      }
    }
    const { data, error } = await supabase.from('store_settings').upsert({
        key: 'social_grid_tiles',
        value: cloudTiles,
        updated_at: new Date().toISOString()
      }).select('key').single();
    if (error || !data) throw error || new Error('SOCIAL_TILES_SAVE_FAILED');
    return cloudTiles;
  };

  const addTile = async (tileData) => {
    const newTile = {
      ...tileData,
      id: tileData.id || `tile-${Date.now()}`,
      is_active: tileData.is_active !== undefined ? tileData.is_active : true
    };
    const updated = [...tiles, newTile];
    const saved = await saveTilesToSupabase(updated);
    setTiles(saved);
    return saved.find((tile) => tile.id === newTile.id);
  };

  const updateTile = async (id, updatedFields) => {
    const updated = tiles.map((t) => (t.id === id ? { ...t, ...updatedFields } : t));
    const saved = await saveTilesToSupabase(updated);
    setTiles(saved);
  };

  const toggleTileVisibility = async (id) => {
    const updated = tiles.map((t) => {
      if (t.id === id) {
        const current = t.is_active !== false && t.isActive !== false;
        return { ...t, is_active: !current, isActive: !current };
      }
      return t;
    });
    await saveTilesToSupabase(updated);
    setTiles(updated);
  };

  const deleteTile = async (id) => {
    const updated = tiles.filter((t) => t.id !== id);
    await saveTilesToSupabase(updated);
    setTiles(updated);
  };

  const resetSocialGrid = async () => {
    await updateSettings(INITIAL_SOCIAL_GRID_SETTINGS);
    await saveTilesToSupabase(INITIAL_SOCIAL_TILES);
    setSettings(INITIAL_SOCIAL_GRID_SETTINGS);
    setTiles(INITIAL_SOCIAL_TILES);
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
