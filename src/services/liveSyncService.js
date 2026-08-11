// Real-Time Global Cloud Sync Engine for DUAT Store
// Cloud Blob ID: 019ff173-6ef5-71cd-8244-89049cc98ace

import liveCustomEditsLocal from '../data/live_custom_edits.json';

const BLOB_URL = 'https://jsonblob.com/api/jsonBlob/019ff173-6ef5-71cd-8244-89049cc98ace';
const LOCAL_STORAGE_CACHE_KEY = 'duat_live_cloud_edits_cache_v1';

let inMemoryState = {
  ...liveCustomEditsLocal
};

// Try loading cached state from localStorage first
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
      console.error('Error notifying live sync listener:', e);
    }
  });
}

/**
 * Fetch latest live custom edits from global cloud store
 */
export async function fetchCloudEdits() {
  try {
    const res = await fetch(BLOB_URL, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      cache: 'no-cache'
    });
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
        notifyListeners();
        return inMemoryState;
      }
    }
  } catch (err) {
    console.warn('Failed to fetch global cloud sync edits:', err);
  }
  return inMemoryState;
}

/**
 * Publish updated custom edits payload to global cloud store instantly
 */
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

    const res = await fetch(BLOB_URL, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(inMemoryState)
    });

    if (res.ok) {
      console.log('⚡ Successfully published live edits to global cloud store!');
      return { success: true, state: inMemoryState };
    }
  } catch (err) {
    console.error('Error publishing live edits to cloud store:', err);
  }
  return { success: false, state: inMemoryState };
}

/**
 * Get current in-memory cloud sync state
 */
export function getLiveSyncState() {
  return inMemoryState;
}
