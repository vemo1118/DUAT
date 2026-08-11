// Real-Time Global Cloud Sync Engine for DUAT Store
// Architecture: Supabase Realtime Broadcast (primary) + JSONBlob fallback (initial load)
// Cloud Blob ID: 019ff173-6ef5-71cd-8244-89049cc98ace

import liveCustomEditsLocal from '../data/live_custom_edits.json';
import { supabase } from '../lib/supabase';

const BLOB_URL = 'https://jsonblob.com/api/jsonBlob/019ff173-6ef5-71cd-8244-89049cc98ace';
const LOCAL_STORAGE_CACHE_KEY = 'duat_live_cloud_edits_cache_v1';
const REALTIME_CHANNEL_NAME = 'duat-admin-updates';

let inMemoryState = {
  ...liveCustomEditsLocal
};

// Try loading cached state from localStorage first (for instant initial render)
try {
  const cached = localStorage.getItem(LOCAL_STORAGE_CACHE_KEY);
  if (cached) {
    const parsed = JSON.parse(cached);
    inMemoryState = { ...inMemoryState, ...parsed };
  }
} catch (e) {
  // ignore
}

const listeners = new Set();
// Tracks whether a state change originated from a remote broadcast (not local admin save)
// Used to prevent BundlesSettings/StickersSettings from re-publishing on receive
let _isRemoteUpdate = false;

export function subscribeToLiveSync(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function isRemoteUpdate() {
  return _isRemoteUpdate;
}

function notifyListeners() {
  listeners.forEach((fn) => {
    try {
      fn(inMemoryState);
    } catch (e) {
      console.error('Error notifying live sync listener:', e);
    }
  });
}

// ─────────────────────────────────────────────────────
// Supabase Realtime Broadcast Channel
// Admin → publishes → all customer browsers receive instantly
// ─────────────────────────────────────────────────────
let realtimeChannel = null;

function setupRealtimeChannel() {
  if (realtimeChannel) return;

  realtimeChannel = supabase
    .channel(REALTIME_CHANNEL_NAME)
    .on('broadcast', { event: 'data-updated' }, async (payload) => {
      // Received a real-time update from admin — re-fetch from cloud
      console.log('⚡ [LiveSync] Admin update received via Supabase Realtime!', payload?.payload?.updatedAt);
      try {
        _isRemoteUpdate = true;
        await fetchCloudEdits();
      } finally {
        _isRemoteUpdate = false;
      }
      notifyListeners();
    })
    .subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        console.log('✅ [LiveSync] Connected to Supabase Realtime channel.');
      }
    });
}

// Initialise the channel immediately on module load
setupRealtimeChannel();

// ─────────────────────────────────────────────────────
// Fetch latest live custom edits from JSONBlob (fallback)
// Used on initial page load and as backup
// ─────────────────────────────────────────────────────
export async function fetchCloudEdits() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(BLOB_URL, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      cache: 'no-cache',
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const remoteData = await res.json();
      if (remoteData && typeof remoteData === 'object') {
        inMemoryState = {
          ...inMemoryState,
          ...remoteData,
          productEdits: { ...(inMemoryState.productEdits || {}), ...(remoteData.productEdits || {}) },
          addedProducts: Array.isArray(remoteData.addedProducts) ? remoteData.addedProducts : inMemoryState.addedProducts || [],
          deletedProductIds: Array.isArray(remoteData.deletedProductIds) ? remoteData.deletedProductIds : inMemoryState.deletedProductIds || [],
          heroSlides: Array.isArray(remoteData.heroSlides) && remoteData.heroSlides.length > 0 ? remoteData.heroSlides : inMemoryState.heroSlides,
          bundlesSettings: { ...(inMemoryState.bundlesSettings || {}), ...(remoteData.bundlesSettings || {}) },
          stickersSettings: { ...(inMemoryState.stickersSettings || {}), ...(remoteData.stickersSettings || {}) }
        };
        try {
          localStorage.setItem(LOCAL_STORAGE_CACHE_KEY, JSON.stringify(inMemoryState));
        } catch (e) {}
        return inMemoryState;
      }
    }
  } catch (err) {
    // Silent fail — Supabase Realtime is the primary channel
    if (!err?.name?.includes('Abort')) {
      console.warn('[LiveSync] JSONBlob fetch failed (non-critical):', err?.message);
    }
  }
  return inMemoryState;
}

// ─────────────────────────────────────────────────────
// Publish updated edits — saves to JSONBlob AND broadcasts
// via Supabase Realtime to all connected clients instantly
// ─────────────────────────────────────────────────────
export async function publishCloudEdits(partialState) {
  try {
    inMemoryState = {
      ...inMemoryState,
      ...partialState,
      updatedAt: Date.now()
    };

    try {
      localStorage.setItem(LOCAL_STORAGE_CACHE_KEY, JSON.stringify(inMemoryState));
    } catch (e) {}

    notifyListeners();

    // 1. Broadcast to all connected clients via Supabase Realtime (instant)
    if (realtimeChannel) {
      realtimeChannel.send({
        type: 'broadcast',
        event: 'data-updated',
        payload: { updatedAt: inMemoryState.updatedAt }
      }).catch((err) => {
        console.warn('[LiveSync] Realtime broadcast failed (non-critical):', err?.message);
      });
    }

    // 2. Persist to JSONBlob for initial load fallback (async, non-blocking)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(BLOB_URL, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(inMemoryState),
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      console.log('⚡ [LiveSync] Published to cloud store + broadcast to all clients!');
      return { success: true, state: inMemoryState };
    }
  } catch (err) {
    if (!err?.name?.includes('Abort')) {
      console.warn('[LiveSync] publishCloudEdits error (non-critical):', err?.message);
    }
  }
  return { success: false, state: inMemoryState };
}

/**
 * Get current in-memory cloud sync state
 */
export function getLiveSyncState() {
  return inMemoryState;
}
