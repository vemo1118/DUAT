vi.mock('../domain/preorderWindow.js', () => ({ PREORDER_WINDOW: { opensAt: null, closesAt: null, productionStartsAt: null, shipsBy: null } }));
import { describe, it, expect, vi } from 'vitest';
import { priceCart, checkoutIssue, validateCheckout, preorderState, storefrontProduct } from '../domain/commerce';
import { calculateTrustedQuote } from '../../api/_lib/order-service';

const stock = (quantity = 1) => ({ id: 'stock-a', category: 'stickers', quantity, price: 999 });
const custom = (id, quantity = 1) => ({ id: `custom-sticker-${id}`, quantity, price: 1, design_image_path: `pending/${id}.png`, design_upload_token: `token-${id}`, customDetails: { mode: 'text', customText: String(id) } });
const dbProducts = [{ id: 'stock-a', category: 'stickers', price: 999, is_active: true }];
const openPolicy = { opensAt: '2026-10-26T00:00:00+03:00', closesAt: '2026-11-02T00:00:00+02:00', productionStartsAt: '2026-11-05', shipsBy: '2026-11-15', paymentMethod: 'instapay' };
const now = Date.parse('2026-10-28T12:00:00Z');

describe('stock and custom pricing stay independent', () => {
  it.each([[1, 60], [3, 180], [4, 200], [5, 250], [8, 400]])('prices %i stock units at %i', (quantity, subtotal) => {
    expect(calculateTrustedQuote({ items: [stock(quantity)] }, { dbProducts }).subtotal).toBe(subtotal);
  });
  it('counts different stock designs together, including letters', () => {
    const quote = priceCart([stock(2), { id: 'letter-a', category: 'letters', quantity: 2, price: 20 }]);
    expect(quote.subtotal).toBe(200);
  });
  it('restores single pricing when stock quantity falls below four', () => {
    const bulk = priceCart([stock(4)]).items[0];
    expect(priceCart([{ ...bulk, quantity: 3 }]).subtotal).toBe(180);
  });
  it.each([4, 5, 6, 7, 8])('supports %i independently customized pieces', (count) => {
    const quote = calculateTrustedQuote({ items: Array.from({ length: count }, (_, i) => custom(i)) });
    expect(quote.subtotal).toBe(count * 45);
    expect(quote.customRemaining).toBe(0);
    expect(new Set(quote.items.map((item) => item.design_image_path)).size).toBe(count);
  });
  it('does not count stock toward the custom minimum or custom toward stock tiers', () => {
    const quote = calculateTrustedQuote({ items: [stock(1), custom('a', 3)] }, { dbProducts });
    expect(quote.subtotal).toBe(195);
    expect(quote.customRemaining).toBe(1);
    expect(quote.checkoutIssue).toBe('CUSTOM_MINIMUM');
  });
  it('prices a mixed cart at 200 stock + 180 custom', () => {
    expect(calculateTrustedQuote({ items: [stock(4), custom('a', 4)] }, { dbProducts }).subtotal).toBe(380);
  });
  it('does not let browser category or price select a cheaper stock price', () => {
    const quote = calculateTrustedQuote({ items: [{ ...stock(1), category: 'bundles', price: 1 }] }, { dbProducts });
    expect(quote.subtotal).toBe(60);
  });
  it('rejects inactive products even with the flat stock pricing', () => {
    expect(() => calculateTrustedQuote({ items: [stock()] }, { dbProducts: [{ ...dbProducts[0], is_active: false }] })).toThrow('INVALID_PRODUCT');
  });
  it.each([0, -1, 1.5, 21, 'bad'])('rejects invalid quantity %s', (quantity) => {
    expect(() => calculateTrustedQuote({ items: [stock(quantity)] }, { dbProducts })).toThrow('INVALID_ITEMS');
  });
  it('does not stack coupons on custom pre-orders', () => {
    const quote = calculateTrustedQuote({ items: [stock(4), custom('a', 4)] }, { dbProducts, coupon: { code: 'ALL', type: 'fixed', value: 999 } });
    expect(quote.discount).toBe(200);
    expect(quote.total).toBe(180);
  });
  it('removes legacy struck-through prices from stock displays', () => {
    expect(storefrontProduct({ ...stock(), originalPrice: 200, savings: 100 })).toMatchObject({ price: 60, originalPrice: undefined, savings: 0 });
  });
  it('hides legacy bundle offers from the launch storefront without changing their stored data', () => {
    expect(storefrontProduct({ id: 'bundle-old', category: 'bundles', price: 450 })).toMatchObject({
      price: 450,
      is_active: false,
      isActive: false
    });
  });
});

describe('pre-order checkout gates', () => {
  const full = priceCart([custom('a', 4)]);
  it('allows designing and quoting before dates are final but rejects order placement', () => {
    expect(calculateTrustedQuote({ items: [custom('a', 4)] }).subtotal).toBe(180);
    expect(() => calculateTrustedQuote({ items: [custom('a', 4)], requireCheckout: true, paymentMethod: 'instapay' })).toThrow('PREORDER_NOT_OPEN');
  });
  it('allows full prepayment only during the agreed window', () => {
    expect(() => validateCheckout(full, 'instapay', openPolicy, now)).not.toThrow();
    expect(() => validateCheckout(full, 'cod', openPolicy, now)).toThrow('PREORDER_PREPAYMENT_REQUIRED');
  });
  it('checks the custom minimum on the server', () => {
    expect(() => calculateTrustedQuote({ items: [custom('a', 3)], requireCheckout: true, paymentMethod: 'instapay' })).toThrow('CUSTOM_MINIMUM');
  });
  it('closes exactly at the cutoff and does not reset for a new visitor', () => {
    expect(checkoutIssue(full, openPolicy, Date.parse(openPolicy.closesAt))).toBe('PREORDER_CLOSED');
    expect(preorderState(openPolicy, Date.parse(openPolicy.opensAt) - 1)).toBe('upcoming');
    expect(preorderState(openPolicy, Date.parse(openPolicy.opensAt))).toBe('open');
  });
  it('fails closed on missing or inconsistent fulfillment dates', () => {
    expect(preorderState({ ...openPolicy, shipsBy: null }, now)).toBe('draft');
    expect(preorderState({ ...openPolicy, shipsBy: '2026-11-01' }, now)).toBe('draft');
  });
  it('keeps stock-only checkout available outside the pre-order window', () => {
    expect(() => validateCheckout(priceCart([stock(4)]), 'cod')).not.toThrow();
  });
});
