import { GOVERNORATES } from '../data/products.js';

export const CHECKOUT_SETTINGS_KEY = 'checkout_settings';
export const DEFAULT_CHECKOUT_SETTINGS = {
  enabled: true,
  titleAr: 'إتمام الطلب', titleEn: 'Checkout',
  noticeAr: 'راجع بياناتك وطريقة الدفع قبل تأكيد الطلب.', noticeEn: 'Review your details and payment method before placing your order.',
  closedAr: 'استقبال الطلبات متوقف مؤقتًا. جرّب مرة تانية قريب.', closedEn: 'Ordering is temporarily paused. Please check back soon.',
  submitAr: 'تأكيد الطلب', submitEn: 'Place order',
  showEmail: false, showNotes: true,
  shippingMode: 'upfront', freeShippingThreshold: 800,
  shippingLaterAr: 'الإجمالي لا يشمل الشحن. هنبلغك بالتكلفة لتأكيدها ودفعها قبل إرسال الطلب.',
  shippingLaterEn: 'Shipping is not included. We will confirm the cost with you for payment before dispatch.',
  shippingFees: Object.fromEntries(GOVERNORATES.map(g => [g.id, g.fee])),
  methods: [
    { id: 'cod', type: 'cod', enabled: true, customAllowed: false, titleAr: 'الدفع عند الاستلام', titleEn: 'Cash on delivery', descriptionAr: 'ادفع نقدًا عند استلام الشحنة.', descriptionEn: 'Pay cash when your order arrives.', account: '', url: '', instructionsAr: '', instructionsEn: '' },
    { id: 'instapay', type: 'transfer', enabled: true, customAllowed: true, titleAr: 'إنستاباي', titleEn: 'InstaPay', descriptionAr: 'حوّل قيمة الطلب وارفع صورة التحويل. بنراجع وصوله قبل تأكيد الدفع.', descriptionEn: 'Transfer the total and upload a screenshot. We verify receipt before confirming payment.', account: 'moataz_m25@instapay', url: 'https://ipn.eg/S/moataz_m25/instapay/4lLo7o', instructionsAr: 'حوّل الإجمالي الموضح، وبعدها ارفع صورة التحويل. صورة التحويل وحدها مش تأكيد استلام الدفع.', instructionsEn: 'Transfer the displayed total, then upload your screenshot. A screenshot alone does not confirm payment.' }
  ]
};
const text = (v, max = 1500) => String(v ?? '').trim().slice(0, max);
export function normalizeCheckoutSettings(raw = {}) {
  const s = { ...DEFAULT_CHECKOUT_SETTINGS, ...raw };
  const methods = Array.isArray(raw.methods) ? raw.methods : DEFAULT_CHECKOUT_SETTINGS.methods;
  const ids = new Set();
  s.methods = methods.slice(0, 12).filter(m => {
    if (!m || !/^[a-z0-9_-]{1,60}$/.test(m.id) || ids.has(m.id)) return false;
    ids.add(m.id); return true;
  }).map(m => ({
    id: m.id, type: m.type === 'cod' ? 'cod' : 'transfer', enabled: m.enabled !== false,
    customAllowed: m.type !== 'cod' && m.customAllowed !== false,
    ...Object.fromEntries(['titleAr', 'titleEn', 'descriptionAr', 'descriptionEn', 'account', 'instructionsAr', 'instructionsEn'].map(k => [k, text(m[k])])),
    url: /^https:\/\//i.test(m.url || '') ? text(m.url, 2000) : ''
  }));
  s.enabled = s.enabled !== false;
  s.showEmail = s.showEmail === true; s.showNotes = s.showNotes !== false;
  s.shippingMode = s.shippingMode === 'later' ? 'later' : 'upfront';
  s.freeShippingThreshold = Number.isFinite(Number(s.freeShippingThreshold)) ? Math.max(0, Number(s.freeShippingThreshold)) : 800;
  s.shippingFees = Object.fromEntries(GOVERNORATES.map(g => [g.id, Number.isFinite(Number(s.shippingFees?.[g.id])) ? Math.max(0, Number(s.shippingFees[g.id])) : g.fee]));
  for (const k of ['titleAr', 'titleEn', 'noticeAr', 'noticeEn', 'closedAr', 'closedEn', 'submitAr', 'submitEn', 'shippingLaterAr', 'shippingLaterEn']) s[k] = text(s[k]);
  return s;
}
export function availablePaymentMethods(settings, customQuantity = 0) {
  return settings.methods.filter(m => m.enabled && (!customQuantity || m.customAllowed));
}
export function validatePaymentMethod(settings, id, customQuantity) {
  if (!settings.enabled) throw new Error('CHECKOUT_PAUSED');
  const method = availablePaymentMethods(settings, customQuantity).find(m => m.id === id);
  if (!method || (method.type === 'transfer' && !method.account)) throw new Error('PAYMENT_UNAVAILABLE');
  return method;
}
export function checkoutShipping(settings, subtotal, governorate) {
  if (!governorate || settings.shippingMode === 'later') return 0;
  if (settings.freeShippingThreshold > 0 && subtotal >= settings.freeShippingThreshold) return 0;
  return settings.shippingFees[governorate.id];
}
