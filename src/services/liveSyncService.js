const listenersByResource = new Map();
let inMemoryState = {};

/**
 * Subscribe to scoped Realtime events ('products-updated', 'hero-updated', 'settings-updated', 'coupons-updated')
 */
export function subscribeToLiveSync(resourceType, callback) {
  let resType = resourceType;
  let cb = callback;

  if (typeof resourceType === 'function') {
    cb = resourceType;
    resType = '*';
  }

  if (!listenersByResource.has(resType)) {
    listenersByResource.set(resType, new Set());
  }

  const set = listenersByResource.get(resType);
  set.add(cb);

  return () => {
    set.delete(cb);
    if (set.size === 0) {
      listenersByResource.delete(resType);
    }
  };
}

function notifyListeners(resourceType, payload) {
  const genericSet = listenersByResource.get('*');
  if (genericSet) {
    genericSet.forEach((fn) => {
      try { fn(resourceType, payload); } catch (e) { console.error('[LiveSync] Generic listener error:', e); }
    });
  }

  const specificSet = listenersByResource.get(resourceType);
  if (specificSet) {
    specificSet.forEach((fn) => {
      try { fn(payload); } catch (e) { console.error(`[LiveSync] Listener error for ${resourceType}:`, e); }
    });
  }
}

/**
 * Notify this browser session after a successful database write.
 * Cross-client anonymous broadcasts are intentionally disabled; each page loads
 * authoritative data from Supabase on navigation/refresh.
 */
export async function broadcastResourceEvent(resource, action = 'update', data = null) {
  // Never update another provider while the current provider is rendering.
  await Promise.resolve();
  notifyListeners(resource, { action, data });
}

// Backward-compatibility exports for context subscribers
export async function fetchCloudEdits() {
  return inMemoryState;
}

export async function publishCloudEdits(partialState) {
  inMemoryState = { ...inMemoryState, ...partialState, updatedAt: Date.now() };
  return { success: true, state: inMemoryState };
}

export function getLiveSyncState() {
  return inMemoryState;
}
