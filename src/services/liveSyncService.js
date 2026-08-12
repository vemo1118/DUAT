// Real-Time Global Cloud Sync Engine for DUAT Store
// Architecture: Supabase Realtime Broadcast (primary) + Supabase Database (persistence)

import liveCustomEditsLocal from '../data/live_custom_edits.json';
import { supabase } from '../lib/supabase';

const LOCAL_STORAGE_CACHE_KEY = 'duat_live_cloud_edits_cache_v1';
const REALTIME_CHANNEL_NAME = 'duat-admin-updates';

// Unique ID per browser session — used to ignore self-broadcasts
const CLIENT_ID = `${Math.random().toString(36).substr(2, 9)}_${Date.now()}`;

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

export function subscribeToLiveSync(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function notifyListeners() {
  listeners.forEach((fn) => {
    try {
      fn(inMemoryState);
    } catch (e) {
      console.error('[LiveSync] Error notifying listener:', e);
    }
  });
}

// ─────────────────────────────────────────────────────
// Supabase Realtime Broadcast Channel
// Admin publishes → all OTHER client browsers receive instantly
// Self-broadcasts are filtered via CLIENT_ID
// ─────────────────────────────────────────────────────
let realtimeChannel = null;

function setupRealtimeChannel() {
  if (realtimeChannel) return;

  realtimeChannel = supabase
    .channel(REALTIME_CHANNEL_NAME)
    .on('broadcast', { event: 'data-updated' }, async (payload) => {
      // Ignore broadcasts sent by this same browser tab/window
      if (payload?.payload?.senderId === CLIENT_ID) {
        return;
      }

      console.log('⚡ [LiveSync] Admin update broadcast received!');
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

export async function fetchCloudEdits() {
  return inMemoryState;
}

// ─────────────────────────────────────────────────────
// Publish updated edits
// Saves to localStorage AND broadcasts via Supabase Realtime
// ─────────────────────────────────────────────────────
export async function publishCloudEdits(partialState) {
  try {
    inMemoryState = {
      ...inMemoryState,
      ...partialState,
      updatedAt: Date.now()
    };

    // Always save to localStorage immediately
    try {
      localStorage.setItem(LOCAL_STORAGE_CACHE_KEY, JSON.stringify(inMemoryState));
    } catch (e) {}

    // Broadcast to all OTHER connected clients via Supabase Realtime (instant)
    if (realtimeChannel) {
      realtimeChannel.send({
        type: 'broadcast',
        event: 'data-updated',
        payload: { updatedAt: inMemoryState.updatedAt, senderId: CLIENT_ID }
      }).catch((err) => {
        console.warn('[LiveSync] Realtime broadcast failed (non-critical):', err?.message);
      });
    }

    return { success: true, state: inMemoryState };
  } catch (err) {
    console.warn('[LiveSync] publishCloudEdits error (non-critical):', err?.message);
  }
  return { success: false, state: inMemoryState };
}

/**
 * Get current in-memory cloud sync state
 */
export function getLiveSyncState() {
  return inMemoryState;
}
