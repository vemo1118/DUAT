// Mobile Safari may suspend realtime sockets. Resume and visible polling recheck
// the authoritative cloud rows without depending on device-local overrides.
export function subscribeCloudRefresh(load, intervalMs = 60_000) {
  let active = true, running = false, lastStarted = 0;
  const refresh = async () => {
    if (!active || document.visibilityState === 'hidden' || navigator.onLine === false || running || Date.now() - lastStarted < 250) return;
    running = true; lastStarted = Date.now();
    try { await load(); } catch (error) { console.warn('Cloud refresh failed:', error?.message); }
    finally { running = false; }
  };
  const visible = () => { if (document.visibilityState === 'visible') refresh(); };
  window.addEventListener('focus', refresh);
  window.addEventListener('pageshow', refresh);
  window.addEventListener('online', refresh);
  document.addEventListener('visibilitychange', visible);
  window.addEventListener('duat:cloud-saved', refresh);
  const timer = window.setInterval(refresh, intervalMs);
  return () => {
    active = false; clearInterval(timer);
    window.removeEventListener('focus', refresh); window.removeEventListener('pageshow', refresh); window.removeEventListener('online', refresh);
    document.removeEventListener('visibilitychange', visible); window.removeEventListener('duat:cloud-saved', refresh);
  };
}

// Identical polling results must not reset dashboard forms or redraw builders.
export function setCloudValue(setState, incoming) {
  setState(previous => {
    const next = typeof incoming === 'function' ? incoming(previous) : incoming;
    return JSON.stringify(previous) === JSON.stringify(next) ? previous : next;
  });
}
