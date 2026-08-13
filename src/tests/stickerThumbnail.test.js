import { describe, expect, it } from 'vitest';
import {
  resolveStickerImage,
  resolveStickerRenderId
} from '../components/CustomStickerThumbnail';
import { getStickerExportLayout } from '../views/StickerBuilderView';

describe('order sticker thumbnail resolution', () => {
  it('recognizes generated sticker artwork from stored order item IDs', () => {
    expect(resolveStickerRenderId({ id: 'ar-letter-ج' })).toBe('ar-letter-ج');
    expect(resolveStickerRenderId({ id: 'year-2005' })).toBe('year-2005');
  });

  it('uses the catalog product image when compact order data has no image', () => {
    expect(resolveStickerImage({
      id: 'st-n90-1-04-cassette',
      product: { image: 'https://res.cloudinary.com/demo/image/upload/cassette.png' }
    })).toBe('https://res.cloudinary.com/demo/image/upload/cassette.png');
  });

  it('creates a fixed high-resolution artwork layout that fits long text', () => {
    const shortText = getStickerExportLayout('pill', 'طالع نور');
    const longText = getStickerExportLayout('pill', 'عبارة عربية طويلة للاستكر المخصص');

    expect(shortText).toMatchObject({ width: 1200, height: 480 });
    expect(longText.fontSize).toBeLessThan(shortText.fontSize);
    expect(longText.fontSize).toBeGreaterThanOrEqual(38);
  });
});
