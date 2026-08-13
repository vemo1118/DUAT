import { describe, expect, it } from 'vitest';
import { calculateTrustedQuote, containsDataUrl } from '../../api/_lib/order-service';
import { compactCartItems } from '../services/orderApi';
import { normalizeOrderReference } from '../../api/track-order';
import {
  broadcastResourceEvent,
  publishCloudEdits,
  subscribeToLiveSync
} from '../services/liveSyncService';

describe('server-authoritative order pricing', () => {
  it('ignores browser-provided names and prices', () => {
    const quote = calculateTrustedQuote({
      items: [{
        id: 'bundle-passage-6pack',
        quantity: 2,
        price: 1,
        nameAr: 'مزور'
      }]
    });

    expect(quote.items[0].price).toBe(450);
    expect(quote.items[0].nameAr).not.toBe('مزور');
    expect(quote.subtotal).toBe(900);
  });

  it('calculates coupon discounts from trusted coupon data', () => {
    const quote = calculateTrustedQuote({
      items: [{ id: 'bundle-passage-6pack', quantity: 1 }]
    }, {
      coupon: { code: 'DUAT10', type: 'percentage', value: 10, is_active: true }
    });

    expect(quote.discount).toBe(45);
    expect(quote.total).toBe(405);
  });

  it('reads trusted product names from the live products.data schema', () => {
    const quote = calculateTrustedQuote({
      items: [{ id: 'db-only-product', quantity: 1, price: 1, nameAr: 'مزور' }]
    }, {
      dbProducts: [{
        id: 'db-only-product',
        category: 'stickers',
        price: 725,
        is_active: true,
        data: { nameAr: 'منتج قاعدة البيانات', nameEn: 'Database Product' }
      }]
    });

    expect(quote.items[0]).toMatchObject({
      nameAr: 'منتج قاعدة البيانات',
      nameEn: 'Database Product',
      price: 725
    });
    expect(quote.subtotal).toBe(725);
  });

  it('stores trusted product artwork metadata for admin order previews', () => {
    const quote = calculateTrustedQuote({
      items: [{ id: 'db-product-with-art', quantity: 1 }]
    }, {
      dbProducts: [{
        id: 'db-product-with-art',
        category: 'stickers',
        price: 100,
        is_active: true,
        data: {
          nameAr: 'منتج بصورة',
          nameEn: 'Product With Art',
          imageUrl: 'https://res.cloudinary.com/demo/image/upload/sticker.png'
        }
      }]
    });

    expect(quote.items[0].image).toBe('https://res.cloudinary.com/demo/image/upload/sticker.png');
  });

  it('rejects the retired custom case flow', () => {
    expect(() => calculateTrustedQuote({
      items: [{ id: 'custom-case-1', quantity: 1, customConfig: { phoneModel: 'iPhone 15' } }]
    })).toThrow('INVALID_PRODUCT');
  });
});

describe('browser payload compaction', () => {
  it('removes Base64 previews and untrusted pricing before submission', () => {
    const compact = compactCartItems([{
      id: 'custom-sticker-1',
      quantity: 1,
      price: 1,
      image: 'data:image/png;base64,AAAA',
      designSnapshot: 'data:image/png;base64,BBBB',
      customDetails: {
        mode: 'image',
        design_image_path: 'pending/design.png',
        design_upload_token: 'claim-token',
        selectedItems: []
      }
    }]);

    expect(compact[0].price).toBeUndefined();
    expect(compact[0].image).toBeUndefined();
    expect(compact[0].designSnapshot).toBeUndefined();
    expect(compact[0].customConfig).toBeUndefined();
    expect(containsDataUrl(compact)).toBe(false);
  });
});

describe('single-field order tracking', () => {
  it('accepts the full reference or its numeric part', () => {
    expect(normalizeOrderReference('DUAT-0001')).toBe('DUAT-0001');
    expect(normalizeOrderReference('duat0001')).toBe('DUAT-0001');
    expect(normalizeOrderReference('0001')).toBe('DUAT-0001');
  });

  it('rejects incomplete or non-numeric references', () => {
    expect(() => normalizeOrderReference('DUAT')).toThrow('TRACKING_NOT_FOUND');
    expect(() => normalizeOrderReference('DUAT-ABCD')).toThrow('TRACKING_NOT_FOUND');
  });
});

describe('local provider synchronization', () => {
  it('defers listener updates until after the current render stack', async () => {
    let calls = 0;
    const unsubscribe = subscribeToLiveSync('settings-updated', () => { calls += 1; });
    const pending = broadcastResourceEvent('settings-updated', 'update', {});

    expect(calls).toBe(0);
    await pending;
    expect(calls).toBe(1);
    unsubscribe();
  });

  it('does not turn local cache persistence into a global refresh event', async () => {
    let calls = 0;
    const unsubscribe = subscribeToLiveSync('settings-updated', () => { calls += 1; });

    await publishCloudEdits({ bundlesSettings: { hero: {} } });

    expect(calls).toBe(0);
    unsubscribe();
  });
});
