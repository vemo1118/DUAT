import { afterEach, describe, expect, it, vi } from 'vitest';
import { normalizeWhatsApp } from '../domain/notificationSettings';
import { subscribeCloudRefresh } from '../services/cloudRefresh';
const mocks = vi.hoisted(() => ({ upsert: vi.fn(), single: vi.fn() }));
vi.mock('../lib/supabase', () => ({ supabase: { from: () => ({ upsert: mocks.upsert }) } }));
import { saveNotificationSettingsToSupabase } from '../utils/orderNotifier';
afterEach(() => { vi.useRealTimers(); vi.unstubAllGlobals(); vi.clearAllMocks(); });
describe('cloud notification settings', () => {
  it.each(['01064652465', '+201064652465', '٠١٠٦٤٦٥٢٤٦٥'])('normalizes %s to one cross-device phone', phone => {
    expect(normalizeWhatsApp(phone)).toBe('201064652465');
  });
  it('rejects empty and invalid numbers', () => {
    expect(() => normalizeWhatsApp('')).toThrow(); expect(() => normalizeWhatsApp('1234')).toThrow();
  });
  it('returns the confirmed cloud row without requiring localStorage', async () => {
    mocks.upsert.mockReturnValue({ select: () => ({ single: mocks.single }) });
    mocks.single.mockResolvedValue({ data: { value: { whatsapp: '201064652465' } }, error: null });
    await expect(saveNotificationSettingsToSupabase(null, null, '01064652465')).resolves.toEqual({ whatsapp: '201064652465' });
    expect(mocks.upsert.mock.calls[0][0]).toMatchObject({ key: 'notification_settings', value: { whatsapp: '201064652465' } });
  });
  it('reports a failed save instead of claiming success', async () => {
    mocks.upsert.mockReturnValue({ select: () => ({ single: mocks.single }) });
    mocks.single.mockResolvedValue({ data: null, error: { message: 'network unavailable' } });
    await expect(saveNotificationSettingsToSupabase(null, null, '01064652465')).rejects.toThrow('السيرفر');
  });
});
describe('mobile cloud resume fallback', () => {
  it('refreshes on resume/online and by visible polling, and cleans up', async () => {
    vi.useFakeTimers();
    const win = new globalThis.EventTarget(), doc = new globalThis.EventTarget();
    win.setInterval = setInterval; doc.visibilityState = 'visible';
    vi.stubGlobal('window', win); vi.stubGlobal('document', doc); vi.stubGlobal('navigator', { onLine: true });
    const load = vi.fn().mockResolvedValue(undefined), stop = subscribeCloudRefresh(load, 1000);
    win.dispatchEvent(new globalThis.Event('pageshow')); await vi.advanceTimersByTimeAsync(300); expect(load).toHaveBeenCalledTimes(1);
    doc.visibilityState = 'hidden'; await vi.advanceTimersByTimeAsync(1000); expect(load).toHaveBeenCalledTimes(1);
    doc.visibilityState = 'visible'; doc.dispatchEvent(new globalThis.Event('visibilitychange')); await vi.advanceTimersByTimeAsync(300); expect(load).toHaveBeenCalledTimes(2);
    navigator.onLine = false; await vi.advanceTimersByTimeAsync(1000); expect(load).toHaveBeenCalledTimes(2);
    navigator.onLine = true; win.dispatchEvent(new globalThis.Event('online')); await vi.advanceTimersByTimeAsync(300); expect(load).toHaveBeenCalledTimes(3);
    await vi.advanceTimersByTimeAsync(1100); expect(load.mock.calls.length).toBeGreaterThan(3);
    stop(); const count = load.mock.calls.length; await vi.advanceTimersByTimeAsync(5000); win.dispatchEvent(new globalThis.Event('pageshow')); expect(load).toHaveBeenCalledTimes(count);
  });
});
