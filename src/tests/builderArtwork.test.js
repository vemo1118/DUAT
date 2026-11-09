import { describe, it, expect } from 'vitest';
import { BUILDER_COLORS, contrastRatio, textLines } from '../domain/builderArtwork';
import { compactCartItems } from '../services/orderApi';
import { calculateTrustedQuote } from '../../api/_lib/order-service';
describe('simplified builder artwork and order metadata', () => {
  it('provides distinct solid colors and detects unreadable pairs', () => {
    expect(new Set(BUILDER_COLORS.map(c => c.color)).size).toBe(16);
    expect(contrastRatio('#FFFFFF', '#FFFFFF')).toBe(1);
    expect(contrastRatio('#FFFFFF', '#171B2E')).toBeGreaterThan(10);
  });
  it('wraps long unbroken text and keeps each line within its print bounds', () => {
    const ctx = { measureText: text => ({ width: Array.from(text).length * 40 }) };
    const lines = textLines(ctx, 'كلمةطويلةجدًاوبدونمسافات ومعاها كلام', 240);
    expect(lines.length).toBeGreaterThan(1);
    expect(lines.every(line => ctx.measureText(line).width <= 240)).toBe(true);
  });
  it('keeps the selected colors, square/circle shape and size through server normalization', () => {
    for (const cutShape of ['square', 'circle']) {
      const items = compactCartItems([{ id: 'custom-sticker-test', quantity: 4, customDetails: {
        mode: 'text', customText: 'طالع نور', selectedFont: 'cairo', textColor: '#FFFFFF', bgFinish: '#772F43', cutShape,
        printWidthMm: 25, printHeightMm: 25, design_image_path: 'pending/test.png', design_upload_token: 'test-claim'
      } }]);
      const quote = calculateTrustedQuote({ items });
      expect(quote.subtotal).toBe(180);
      expect(quote.items[0].customDetails).toMatchObject({ customText: 'طالع نور', textColor: '#FFFFFF', bgFinish: '#772F43', cutShape, printWidthMm: 25, printHeightMm: 25 });
    }
  });
});
