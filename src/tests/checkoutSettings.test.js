import { normalizeEgyptianPhone } from '../domain/customerDetails';
import { describe, expect, it } from 'vitest';
import { normalizeCheckoutSettings, availablePaymentMethods, validatePaymentMethod, checkoutShipping } from '../domain/checkoutSettings';
import { calculateTrustedQuote } from '../../api/_lib/order-service';
const stock = [{ id: 'st-crescent', quantity: 4 }];
const cairo = { id: 'cairo', fee: 110 };
describe('dashboard checkout settings enforced by the server', () => {
  it('accepts Arabic mobile digits without changing the number', () => { expect(normalizeEgyptianPhone('٠١٠ ١٢٣٤ ٥٦٧٨')).toBe('01012345678'); });
  it('keeps existing payment and shipping defaults', () => {
    const settings = normalizeCheckoutSettings();
    expect(availablePaymentMethods(settings, 4).map(m => m.id)).toEqual(['instapay']);
    expect(checkoutShipping(settings, 200, cairo)).toBe(110);
    expect(checkoutShipping(settings, 800, cairo)).toBe(0);
  });
  it('rejects disabled, removed and forged payment ids', () => {
    const settings = normalizeCheckoutSettings({ methods: [] });
    expect(() => validatePaymentMethod(settings, 'instapay', 0)).toThrow('PAYMENT_UNAVAILABLE');
    expect(() => validatePaymentMethod(normalizeCheckoutSettings(), 'fake', 0)).toThrow('PAYMENT_UNAVAILABLE');
    expect(() => validatePaymentMethod(normalizeCheckoutSettings(), 'cod', 4)).toThrow('PAYMENT_UNAVAILABLE');
  });
  it('pauses server order submission', () => {
    expect(() => calculateTrustedQuote({ items: stock, requireCheckout: true, paymentMethod: 'cod' }, { checkoutSettings: { enabled: false } })).toThrow('CHECKOUT_PAUSED');
  });
  it('uses configured fees and explicitly separates deferred shipping', () => {
    const quote = config => calculateTrustedQuote({ items: stock, governorateId: 'cairo' }, { checkoutSettings: config });
    expect(quote({ shippingFees: { cairo: 77 }, freeShippingThreshold: 0 }).shippingFee).toBe(77);
    const deferred = quote({ shippingMode: 'later' });
    expect(deferred.shippingMode).toBe('later'); expect(deferred.shippingFee).toBe(0); expect(deferred.total).toBe(deferred.subtotal);
  });
  it('supports an additional manual transfer without opening custom COD', () => {
    const settings = normalizeCheckoutSettings({ methods: [{ id: 'wallet', type: 'transfer', titleAr: 'محفظة', titleEn: 'Wallet', account: '01000000000' }] });
    expect(validatePaymentMethod(settings, 'wallet', 4).type).toBe('transfer');
    expect(normalizeCheckoutSettings({ methods: [{ id: 'cod', type: 'cod', customAllowed: true }] }).methods[0].customAllowed).toBe(false);
  });
  it('sanitizes unsafe links and duplicate ids', () => {
    const settings = normalizeCheckoutSettings({ methods: [{ id: 'x', url: 'javascript:alert(1)' }, { id: 'x' }] });
    expect(settings.methods).toHaveLength(1); expect(settings.methods[0].url).toBe('');
  });
});
