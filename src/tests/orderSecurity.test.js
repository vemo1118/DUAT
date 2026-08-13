import { describe, expect, it } from 'vitest';
import { calculateTrustedQuote, containsDataUrl } from '../../api/_lib/order-service';
import { compactCartItems } from '../services/orderApi';
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
        category: 'cases',
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

  it('requires a signed upload claim for custom designs', () => {
    expect(() => calculateTrustedQuote({
      items: [{ id: 'custom-case-1', quantity: 1, customConfig: { phoneModel: 'iPhone 15' } }]
    })).toThrow('INVALID_UPLOAD');
  });
});

describe('browser payload compaction', () => {
  it('removes Base64 previews and untrusted pricing before submission', () => {
    const compact = compactCartItems([{
      id: 'custom-case-1',
      quantity: 1,
      price: 1,
      image: 'data:image/png;base64,AAAA',
      designSnapshot: 'data:image/png;base64,BBBB',
      customConfig: {
        phoneModel: 'iPhone 15',
        design_image_path: 'pending/design.png',
        design_upload_token: 'claim-token',
        layers: [{ type: 'image', src: 'data:image/png;base64,CCCC', x: 2, y: 3 }]
      }
    }]);

    expect(compact[0].price).toBeUndefined();
    expect(compact[0].image).toBeUndefined();
    expect(compact[0].designSnapshot).toBeUndefined();
    expect(compact[0].customConfig.layers[0].src).toBeUndefined();
    expect(containsDataUrl(compact)).toBe(false);
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
