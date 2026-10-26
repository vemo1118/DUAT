import { PREORDER_WINDOW } from './preorderWindow.js';
// Shared by the storefront and trusted order API. Browser fields never establish eligibility.
export const PRICING = Object.freeze({ stockSingle: 60, stockBundle: 50, stockMinimum: 4, custom: 45, customMinimum: 4 });
export const ORDER_LIMITS = Object.freeze({ lines: 24, quantityPerLine: 20 });
export const PREORDER = Object.freeze({
  ...PREORDER_WINDOW,
  paymentMethod: 'instapay'
});

export const isCustomSticker = (item) => String(item?.id || '').startsWith('custom-sticker-');
export const isStockSticker = (item) => !isCustomSticker(item) && ['stickers', 'letters', 'badges'].includes(item?.category);

export function priceCart(items) {
  const stockQuantity = items.filter(isStockSticker).reduce((sum, item) => sum + item.quantity, 0);
  const customQuantity = items.filter(isCustomSticker).reduce((sum, item) => sum + item.quantity, 0);
  const stockPrice = stockQuantity >= PRICING.stockMinimum ? PRICING.stockBundle : PRICING.stockSingle;
  const pricedItems = items.map((item) => ({
    ...item,
    price: isCustomSticker(item) ? PRICING.custom : isStockSticker(item) ? stockPrice : item.price
  }));
  return {
    items: pricedItems,
    stockQuantity,
    customQuantity,
    customRemaining: customQuantity > 0 ? Math.max(0, PRICING.customMinimum - customQuantity) : 0,
    subtotal: pricedItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  };
}

export function preorderState(policy = PREORDER, now = Date.now()) {
  const opens = Date.parse(policy.opensAt);
  const closes = Date.parse(policy.closesAt);
  const starts = Date.parse(policy.productionStartsAt);
  const ships = Date.parse(policy.shipsBy);
  if (![opens, closes, starts, ships].every(Number.isFinite) || opens >= closes || closes > starts || starts > ships) return 'draft';
  if (now < opens) return 'upcoming';
  return now >= closes ? 'closed' : 'open';
}

export function checkoutIssue(pricing, policy = PREORDER, now = Date.now()) {
  if (!pricing.customQuantity) return null;
  if (pricing.customRemaining) return 'CUSTOM_MINIMUM';
  const state = preorderState(policy, now);
  return state === 'open' ? null : state === 'closed' ? 'PREORDER_CLOSED' : 'PREORDER_NOT_OPEN';
}

export function validateCheckout(pricing, paymentMethod, policy = PREORDER, now = Date.now()) {
  const issue = checkoutIssue(pricing, policy, now);
  if (issue) throw new Error(issue);
  if (pricing.customQuantity && paymentMethod !== policy.paymentMethod) throw new Error('PREORDER_PREPAYMENT_REQUIRED');
}

export function checkoutMessage(code, isArabic) {
  const messages = {
    CUSTOM_MINIMUM: ['الحجز يبدأ من 4 استيكرات كستمايز. تقدر تعمل كل قطعة بتصميم مختلف.', 'Pre-orders start at 4 custom stickers. Each piece can have a different design.'],
    PREORDER_NOT_OPEN: ['بنجهز فتح الحجز. موعد الشحن هيتعلن قبل استقبال المدفوعات.', 'Pre-orders are being prepared. Shipping dates will be announced before payments open.'],
    PREORDER_CLOSED: ['حجز الدفعة دي انتهى. تابعنا لموعد الدفعة الجاية.', 'This pre-order window has closed. Follow us for the next batch.'],
    PREORDER_PREPAYMENT_REQUIRED: ['الكستمايز بالحجز المسبق يتطلب دفع كامل عبر إنستاباي.', 'Custom pre-orders require full payment via InstaPay.']
  };
  return messages[code]?.[isArabic ? 0 : 1] || '';
}

export function storefrontProduct(product) {
  if (product?.category === 'bundles' || String(product?.id || '').startsWith('bundle-')) {
    return { ...product, is_active: false, isActive: false };
  }
  return isStockSticker(product) ? {
    ...product,
    price: PRICING.stockSingle,
    originalPrice: undefined,
    savings: 0,
    rating: undefined,
    reviewCount: 0,
    craftTagEn: 'READY-MADE • DUAT CATALOGUE',
    craftTagAr: 'جاهز • من كتالوج دوات'
  } : product;
}
