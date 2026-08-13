import {
  PRODUCTS,
  ARABIC_LETTER_PRODUCTS,
  ENGLISH_LETTER_PRODUCTS,
  MONTH_STICKER_PRODUCTS,
  YEAR_STICKER_PRODUCTS,
  GOVERNORATES
} from '../../src/data/products.js';

const STATIC_PRODUCTS = [
  ...PRODUCTS,
  ...ARABIC_LETTER_PRODUCTS,
  ...ENGLISH_LETTER_PRODUCTS,
  ...MONTH_STICKER_PRODUCTS,
  ...YEAR_STICKER_PRODUCTS
];

const STATIC_CATALOG = new Map(STATIC_PRODUCTS.map((product) => [String(product.id), product]));
const GOVERNORATE_MAP = new Map(GOVERNORATES.map((governorate) => [governorate.id, governorate]));
const MAX_CART_ITEMS = 24;
const MAX_QUANTITY = 20;
const CUSTOM_STICKER_PRICE = 100;

function cleanText(value, maxLength = 160) {
  return String(value || '').trim().slice(0, maxLength);
}

function cleanNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function cleanQuantity(value) {
  const quantity = Math.floor(cleanNumber(value, 1));
  if (quantity < 1 || quantity > MAX_QUANTITY) throw new Error('INVALID_ITEMS');
  return quantity;
}

export function containsDataUrl(value, depth = 0) {
  if (depth > 7 || value == null) return false;
  if (typeof value === 'string') return value.trimStart().startsWith('data:');
  if (Array.isArray(value)) return value.some((entry) => containsDataUrl(entry, depth + 1));
  if (typeof value === 'object') {
    return Object.values(value).some((entry) => containsDataUrl(entry, depth + 1));
  }
  return false;
}

function sanitizeSelectedItems(items) {
  if (!Array.isArray(items)) return [];
  return items.slice(0, 12).map((item) => ({
    id: cleanText(item?.id, 80),
    nameAr: cleanText(item?.nameAr, 120),
    nameEn: cleanText(item?.nameEn, 120)
  }));
}

function normalizeCatalogProduct(product) {
  if (!product) return null;
  const data = product.data && typeof product.data === 'object' && !Array.isArray(product.data)
    ? product.data
    : {};
  const isActive = product.is_active !== undefined && product.is_active !== null
    ? product.is_active !== false
    : data.is_active !== false && data.isActive !== false;
  return {
    id: String(product.id || data.id),
    category: product.category || data.category || 'stickers',
    nameEn: product.name_en || product.nameEn || data.nameEn || product.name || data.name || 'DUAT Product',
    nameAr: product.name_ar || product.nameAr || data.nameAr || product.name || data.name || 'منتج دوات',
    price: cleanNumber(product.price ?? data.price),
    isActive
  };
}

function buildCatalog(dbProducts = []) {
  const catalog = new Map();
  for (const product of STATIC_CATALOG.values()) {
    const normalized = normalizeCatalogProduct(product);
    if (normalized.category !== 'cases') catalog.set(normalized.id, normalized);
  }
  for (const product of dbProducts) {
    const normalized = normalizeCatalogProduct(product);
    if (normalized.category !== 'cases') catalog.set(normalized.id, normalized);
  }
  return catalog;
}

function normalizeCustomSticker(item, quantity) {
  const details = item.customDetails || {};
  const path = cleanText(item.design_image_path || details.design_image_path, 500);
  const uploadToken = cleanText(item.design_upload_token || details.design_upload_token, 80);
  if (!path || !uploadToken) throw new Error('INVALID_UPLOAD');

  return {
    id: cleanText(item.id, 100),
    category: 'stickers',
    nameAr: cleanText(item.nameAr, 160) || 'استيكر مخصص',
    nameEn: cleanText(item.nameEn, 160) || 'Custom Sticker',
    quantity,
    price: CUSTOM_STICKER_PRICE,
    design_image_path: path,
    design_upload_token: uploadToken,
    customDetails: {
      mode: details.mode === 'image' ? 'image' : 'text',
      customText: cleanText(details.customText, 120),
      selectedFont: cleanText(details.selectedFont, 40),
      textColor: cleanText(details.textColor, 20),
      bgFinish: cleanText(details.bgFinish, 40),
      cutShape: cleanText(details.cutShape, 40),
      designNotes: cleanText(details.designNotes, 500)
    }
  };
}

function normalizeCatalogItem(item, quantity, catalog) {
  const id = cleanText(item.id, 100);
  const product = catalog.get(id);
  if (!product || !product.isActive || product.price < 0) throw new Error('INVALID_PRODUCT');

  const normalized = {
    id: product.id,
    category: product.category,
    nameAr: product.nameAr,
    nameEn: product.nameEn,
    quantity,
    price: product.price
  };

  const selectedItems = sanitizeSelectedItems(item.customDetails?.selectedItems);
  if (selectedItems.length > 0) {
    normalized.customDetails = {
      selectedItems,
      customText: cleanText(item.customDetails?.customText, 80)
    };
  }
  return normalized;
}

export function calculateTrustedQuote(payload, sources = {}) {
  const items = payload?.items;
  if (!Array.isArray(items) || items.length < 1 || items.length > MAX_CART_ITEMS) {
    throw new Error('INVALID_ITEMS');
  }
  if (containsDataUrl(items)) throw new Error('INVALID_ITEMS');

  const catalog = buildCatalog(sources.dbProducts);
  const safeItems = items.map((item) => {
    const id = cleanText(item?.id, 100);
    const quantity = cleanQuantity(item?.quantity);
    if (id.startsWith('custom-sticker-')) return normalizeCustomSticker(item, quantity);
    if (id.startsWith('custom-case-') || item?.category === 'cases' || item?.customConfig) throw new Error('INVALID_PRODUCT');
    return normalizeCatalogItem(item, quantity, catalog);
  });

  const subtotal = safeItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  let discount = 0;
  let couponCode = null;
  const coupon = sources.coupon;
  if (coupon && coupon.is_active !== false) {
    const expiresAt = coupon.expires_at ? new Date(coupon.expires_at) : null;
    if (!expiresAt || expiresAt > new Date()) {
      couponCode = cleanText(coupon.code, 80).toUpperCase();
      const couponValue = Math.max(0, cleanNumber(coupon.value));
      if (coupon.type === 'percentage') {
        discount = Math.min(subtotal, Math.round(subtotal * Math.min(100, couponValue) / 100));
      } else if (coupon.type === 'fixed') {
        discount = Math.min(subtotal, couponValue);
      }
    }
  }

  const governorateId = cleanText(payload.governorateId, 80);
  const governorate = governorateId ? GOVERNORATE_MAP.get(governorateId) : null;
  if (payload.requireGovernorate && !governorate) throw new Error('INVALID_CUSTOMER');
  const shippingFee = governorate ? (subtotal >= 800 ? 0 : governorate.fee) : 0;
  const total = Math.max(0, subtotal - discount + shippingFee);

  return {
    items: safeItems,
    subtotal,
    discount,
    shippingFee,
    total,
    couponCode,
    governorate: governorate ? { ...governorate } : null
  };
}

export async function loadQuote(admin, payload) {
  const standardIds = Array.from(new Set((payload.items || [])
    .map((item) => cleanText(item?.id, 100))
    .filter((id) => id && !id.startsWith('custom-sticker-'))));

  const productPromise = standardIds.length > 0
    ? admin.from('products').select('id, category, price, is_active, data').in('id', standardIds)
    : Promise.resolve({ data: [], error: null });
  const couponCode = cleanText(payload.couponCode, 80).toUpperCase();
  const couponPromise = couponCode
    ? admin.from('coupons').select('code, type, value, is_active, expires_at').eq('code', couponCode).maybeSingle()
    : Promise.resolve({ data: null, error: null });

  const [productsResult, couponResult] = await Promise.all([
    productPromise,
    couponPromise
  ]);

  if (productsResult.error) throw new Error('INVALID_PRODUCT');
  if (couponCode && (couponResult.error || !couponResult.data)) throw new Error('INVALID_COUPON');

  return calculateTrustedQuote(payload, {
    dbProducts: productsResult.data || [],
    coupon: couponResult.data || null
  });
}

export function validateCustomer(customer) {
  const fullName = cleanText(customer?.fullName || customer?.name, 120);
  const phone = cleanText(customer?.phone, 20).replace(/\s+/g, '');
  const address = cleanText(customer?.address, 300);
  if (!fullName || !address) throw new Error('INVALID_CUSTOMER');
  if (!/^01[0125][0-9]{8}$/.test(phone)) throw new Error('INVALID_PHONE');
  return { fullName, name: fullName, phone, address };
}

export function safeTrackingItems(items) {
  if (!Array.isArray(items)) return [];
  return items.slice(0, MAX_CART_ITEMS).map((item) => ({
    nameAr: cleanText(item?.nameAr || item?.name, 160),
    nameEn: cleanText(item?.nameEn || item?.name, 160),
    quantity: cleanQuantity(item?.quantity || 1)
  }));
}
