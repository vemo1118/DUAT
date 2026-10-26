import { describe, it, expect } from 'vitest';
import { imageLayout } from '../domain/stickerArtwork';
import { createPreorderWindow } from '../domain/preorderSchedule';
import { preorderState } from '../domain/commerce';

describe('phone sticker proportions', () => {
  it.each([[1000, 1000, 25, 25], [1600, 800, 25, 12.5], [800, 1600, 12.5, 25]])('fits %sx%s without stretching', (w, h, expectedW, expectedH) => {
    expect(imageLayout(w, h)).toMatchObject({ widthMm: expectedW, heightMm: expectedH });
  });
  it('uses a circular frame independently of source aspect ratio', () => {
    expect(imageLayout(1600, 800, 'circle')).toMatchObject({ widthMm: 25, heightMm: 25 });
  });
  it('never produces a zero-sized export for an extreme panorama', () => {
    expect(imageLayout(100000, 1).heightMm).toBeGreaterThan(0);
  });
});

describe('one fixed booking campaign', () => {
  it('opens for exactly seven days and dispatches three to five days after closing', () => {
    const policy = createPreorderWindow('2026-10-26T18:00:00+03:00');
    const day = 86400000;
    expect(Date.parse(policy.closesAt) - Date.parse(policy.opensAt)).toBe(7 * day);
    expect(Date.parse(policy.shipsFrom) - Date.parse(policy.closesAt)).toBe(3 * day);
    expect(Date.parse(policy.shipsBy) - Date.parse(policy.closesAt)).toBe(5 * day);
    expect(preorderState(policy, Date.parse(policy.opensAt))).toBe('open');
    expect(preorderState(policy, Date.parse(policy.closesAt))).toBe('closed');
  });
  it('rejects a missing timestamp instead of silently starting a campaign', () => {
    expect(() => createPreorderWindow('')).toThrow();
  });
});
