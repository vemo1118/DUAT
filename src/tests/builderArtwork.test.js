import { describe, it, expect } from 'vitest';
import { BUILDER_COLORS, contrastRatio, textLines, textStickerLayout, textStickerGeometry } from '../domain/builderArtwork';
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
  it('keeps strip phrases on one line and fits long unbroken text', () => {
    const ctx = { font: '', measureText(text) { return { width: text.length * parseFloat(this.font.split(' ')[1]) * .6 }; } };
    for (const text of ['She looks just like a dream', 'طالع نور', 'h'.repeat(40)]) {
      const layout = textStickerLayout(ctx, { text, shape: 'pill', fontFamily: 'Cairo' });
      expect(layout.lines).toEqual([text]); expect(ctx.measureText(text).width).toBeLessThanOrEqual(1200);
    }
    expect(textStickerGeometry('pill')).toMatchObject({ width: 1600, height: 400, widthMm: 40, heightMm: 10 });
  });
  it('keeps the selected colors, square/circle shape and size through server normalization', () => {
    for (const cutShape of ['square', 'circle', 'pill']) {
      const { widthMm: printWidthMm, heightMm: printHeightMm } = textStickerGeometry(cutShape);
      const items = compactCartItems([{ id: 'custom-sticker-test', quantity: 4, customDetails: {
        mode: 'text', customText: 'طالع نور', selectedFont: 'cairo', textColor: '#FFFFFF', bgFinish: '#772F43', cutShape,
        printWidthMm, printHeightMm, design_image_path: 'pending/test.png', design_upload_token: 'test-claim'
      } }]);
      const quote = calculateTrustedQuote({ items });
      expect(quote.subtotal).toBe(180);
      expect(quote.items[0].customDetails).toMatchObject({ customText: 'طالع نور', textColor: '#FFFFFF', bgFinish: '#772F43', cutShape, printWidthMm, printHeightMm });
    }
  });
});
