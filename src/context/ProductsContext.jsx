import React, { createContext, useContext, useState, useEffect } from 'react';
import { storefrontProduct } from '../domain/commerce';
import {
  PRODUCTS as INITIAL_PRODUCTS_BASE,
  ARABIC_LETTER_PRODUCTS,
  ENGLISH_LETTER_PRODUCTS,
  MONTH_STICKER_PRODUCTS,
  YEAR_STICKER_PRODUCTS
} from '../data/products';
import { supabase } from '../lib/supabase';
import liveCustomEdits from '../data/live_custom_edits.json';
import { publishCloudEdits, getLiveSyncState } from '../services/liveSyncService';
import { isInlineStoreImage, uploadStoreImageDataUrl } from '../services/storeAssetService';

// Merge all sticker product groups into one flat list
const INITIAL_PRODUCTS = [
  ...INITIAL_PRODUCTS_BASE,
  ...ARABIC_LETTER_PRODUCTS,
  ...ENGLISH_LETTER_PRODUCTS,
  ...MONTH_STICKER_PRODUCTS,
  ...YEAR_STICKER_PRODUCTS,
].filter((product) => product?.category !== 'cases');

const ProductsContext = createContext();

const INITIAL_PRODUCTS_MAP = new Map(INITIAL_PRODUCTS.map((p) => [String(p.id), p]));

const LEGACY_FAKE_PRODUCT_IDS = new Set([
  'charm-gold-ring', 'charm-ember-bead',
  'sticker-disc', 'sticker-tale3-noor', 'sticker-3addi-lel', 'sticker-born-dawn'
]);

function normalizeProductImages(primaryImage, ...imageLists) {
  const images = [primaryImage, ...imageLists.flat()]
    .filter((image) => typeof image === 'string' && image.trim())
    .map((image) => image.trim());

  return Array.from(new Set(images));
}

function mapFromDb(row) {
  if (!row) return null;
  if (row.category === 'cases') return null;
  const idStr = String(row.id || (row.data && row.data.id) || '');
  if (LEGACY_FAKE_PRODUCT_IDS.has(idStr)) return null;

  const initP = INITIAL_PRODUCTS_MAP.get(idStr);
  const data = row.data && typeof row.data === 'object' ? row.data : {};
  const isActiveVal = row.is_active !== undefined ? Boolean(row.is_active) : (data.is_active !== undefined ? Boolean(data.is_active) : (data.isActive !== undefined ? Boolean(data.isActive) : true));

  const img = data.imageUrl || data.image || row.image_url || '';

  const baseObj = initP ? { ...initP } : {};
  const images = normalizeProductImages(img, data.images || [], baseObj.images || []);

  const curPrice = row.price !== undefined && row.price !== null ? Number(row.price) : Number(data.price || baseObj.price || 0);
  const origPrice = data.originalPrice !== undefined ? Number(data.originalPrice) : (baseObj.originalPrice !== undefined ? Number(baseObj.originalPrice) : undefined);
  const savingsVal = data.savings !== undefined ? Number(data.savings) : (baseObj.savings !== undefined ? Number(baseObj.savings) : (origPrice && origPrice > curPrice ? origPrice - curPrice : 0));

  return {
    ...baseObj,
    ...data,
    id: idStr,
    category: row.category || data.category || baseObj.category || (idStr.startsWith('ar-letter-') || idStr.startsWith('en-letter-') || idStr.startsWith('month-') || idStr.startsWith('year-') ? 'letters' : 'stickers'),
    price: curPrice,
    originalPrice: origPrice,
    savings: savingsVal,
    is_active: isActiveVal,
    isActive: isActiveVal,
    imageUrl: img,
    image: img,
    images,
    nameEn: data.nameEn || row.name_en || baseObj.nameEn || '',
    nameAr: data.nameAr || row.name_ar || baseObj.nameAr || '',
    tagEn: data.tagEn || row.tag_en || baseObj.tagEn || '',
    tagAr: data.tagAr || row.tag_ar || baseObj.tagAr || '',
    craftTagEn: data.craftTagEn || row.craft_tag_en || baseObj.craftTagEn || '',
    craftTagAr: data.craftTagAr || row.craft_tag_ar || baseObj.craftTagAr || '',
    descriptionEn: data.descriptionEn || row.description_en || baseObj.descriptionEn || '',
    descriptionAr: data.descriptionAr || row.description_ar || baseObj.descriptionAr || '',
    specsEn: Array.isArray(data.specsEn) && data.specsEn.length > 0 ? data.specsEn : (Array.isArray(baseObj.specsEn) ? baseObj.specsEn : []),
    specsAr: Array.isArray(data.specsAr) && data.specsAr.length > 0 ? data.specsAr : (Array.isArray(baseObj.specsAr) ? baseObj.specsAr : []),
    rating: Number(data.rating || row.rating || baseObj.rating || 5.0),
    reviewCount: Number(data.reviewCount || row.review_count || baseObj.reviewCount || 0),
    reviews: Array.isArray(data.reviews) ? data.reviews : (Array.isArray(baseObj.reviews) ? baseObj.reviews : [])
  };
}

function mapToDb(p) {
  const isActiveVal = p.is_active !== undefined ? Boolean(p.is_active) : (p.isActive !== undefined ? Boolean(p.isActive) : true);
  const img = p.imageUrl || p.image || '';
  const curPrice = Number(p.price) || 0;
  const origPrice = p.originalPrice !== undefined ? Number(p.originalPrice) : undefined;
  const savingsVal = p.savings !== undefined ? Number(p.savings) : (origPrice && origPrice > curPrice ? origPrice - curPrice : 0);
  const images = normalizeProductImages(img, Array.isArray(p.images) ? p.images : []);

  return {
    id: p.id,
    category: p.category || 'stickers',
    price: curPrice,
    is_active: isActiveVal,
    data: {
      ...p,
      nameEn: p.nameEn || p.name_en || '',
      nameAr: p.nameAr || p.name_ar || '',
      originalPrice: origPrice,
      savings: savingsVal,
      imageUrl: img,
      image: img,
      images,
      is_active: isActiveVal,
      isActive: isActiveVal
    }
  };
}

const PRODUCTS_STORAGE_KEY = 'duat_products_v12';
const CUSTOM_EDITS_KEY = 'duat_product_custom_edits_v3';
const ADDED_PRODUCTS_KEY = 'duat_custom_added_products_v3';
const DELETED_PRODUCTS_KEY = 'duat_deleted_product_ids_v3';

function getCustomEdits() {
  const syncState = getLiveSyncState();
  let edits = { ...(liveCustomEdits.productEdits || {}), ...(syncState.productEdits || {}) };
  try {
    const saved = localStorage.getItem(CUSTOM_EDITS_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      edits = { ...edits, ...parsed };
    }
  } catch (e) {
    // ignore
  }
  return edits;
}

function saveCustomEdit(id, updatedFields) {
  try {
    const current = getCustomEdits();
    current[id] = {
      ...(current[id] || {}),
      ...updatedFields
    };
    localStorage.setItem(CUSTOM_EDITS_KEY, JSON.stringify(current));
    publishCloudEdits({ productEdits: current });
  } catch (e) {
    // ignore
  }
}

function getAddedProducts() {
  const syncState = getLiveSyncState();
  let added = Array.isArray(syncState.addedProducts) && syncState.addedProducts.length > 0
    ? [...syncState.addedProducts]
    : (Array.isArray(liveCustomEdits.addedProducts) ? [...liveCustomEdits.addedProducts] : []);
  try {
    const saved = localStorage.getItem(ADDED_PRODUCTS_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        const localMap = new Map(parsed.map((p) => [String(p.id), p]));
        added = [...parsed, ...added.filter((p) => !localMap.has(String(p.id)))];
      }
    }
  } catch (e) {
    // ignore
  }
  return added;
}

function saveAddedProduct(newProd) {
  try {
    const current = getAddedProducts();
    const filtered = current.filter((p) => String(p.id) !== String(newProd.id));
    const updated = [newProd, ...filtered];
    localStorage.setItem(ADDED_PRODUCTS_KEY, JSON.stringify(updated));
    publishCloudEdits({ addedProducts: updated });
  } catch (e) {
    // ignore
  }
}

function getDeletedProductIds() {
  const syncState = getLiveSyncState();
  let deleted = Array.isArray(syncState.deletedProductIds) && syncState.deletedProductIds.length > 0
    ? [...syncState.deletedProductIds]
    : (Array.isArray(liveCustomEdits.deletedProductIds) ? [...liveCustomEdits.deletedProductIds] : []);
  try {
    const saved = localStorage.getItem(DELETED_PRODUCTS_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        deleted = Array.from(new Set([...deleted, ...parsed]));
      }
    }
  } catch (e) {
    // ignore
  }
  return deleted;
}

function saveDeletedProductId(id) {
  try {
    const current = getDeletedProductIds();
    if (!current.includes(String(id))) {
      const updated = [...current, String(id)];
      localStorage.setItem(DELETED_PRODUCTS_KEY, JSON.stringify(updated));
      publishCloudEdits({ deletedProductIds: updated });
    }
  } catch (e) {
    // ignore
  }
}

function applyOverridesAndMergedProducts(prods) {
  if (!Array.isArray(prods)) return [];
  const edits = getCustomEdits();
  const addedProds = getAddedProducts();
  const deletedIds = new Set(getDeletedProductIds());

  // Filter out deleted
  let list = prods.filter((p) => p && p.id && p.category !== 'cases' && !deletedIds.has(String(p.id)));

  // Merge added prods if missing
  const prodMap = new Map(list.map((p) => [String(p.id), p]));
  const missingAdded = addedProds.filter((ap) => !deletedIds.has(String(ap.id)) && !prodMap.has(String(ap.id)));
  list = [...missingAdded, ...list];

  // Apply custom edits (image, price, name, is_active, etc.)
  return list.map((p) => {
    if (p && p.id && edits[p.id]) {
      const custom = edits[p.id];
      const img = custom.imageUrl !== undefined
        ? custom.imageUrl
        : (custom.image !== undefined ? custom.image : (p.imageUrl || p.image || ''));
      return {
        ...p,
        ...custom,
        imageUrl: img,
        image: img,
        images: normalizeProductImages(
          img,
          Array.isArray(custom.images) ? custom.images : [],
          Array.isArray(p.images) ? p.images : []
        )
      };
    }
    return p;
  });
}

const PREFERRED_BUNDLE_ORDER = [
  'bundle-clear',
  'bundle-bone',
  'bundle-midnight',
  'pack-passage',
  'st-born-dawn',
  'st-through-night',
  'st-crescent',
  'st-starry',
  'st-sun',
  'st-duat'
];

function sortProductsByDefaultOrder(prods) {
  if (!Array.isArray(prods)) return [];
  return [...prods].sort((a, b) => {
    if (Number.isFinite(a?.sortOrder) || Number.isFinite(b?.sortOrder)) return (a.sortOrder ?? 99999) - (b.sortOrder ?? 99999);
    const idxA = PREFERRED_BUNDLE_ORDER.indexOf(a?.id);
    const idxB = PREFERRED_BUNDLE_ORDER.indexOf(b?.id);
    const posA = idxA !== -1 ? idxA : 99;
    const posB = idxB !== -1 ? idxB : 99;
    return posA - posB;
  });
}

function loadLocalProducts() {
  try {
    const isCustomOrder = localStorage.getItem('duat_custom_product_order') === 'true';
    const saved = localStorage.getItem(PRODUCTS_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const withOverrides = applyOverridesAndMergedProducts(parsed);
        if (!isCustomOrder) {
          return sortProductsByDefaultOrder(withOverrides);
        }
        return withOverrides;
      }
    }
  } catch (e) {
    // ignore
  }
  return sortProductsByDefaultOrder(applyOverridesAndMergedProducts(INITIAL_PRODUCTS));
}

function saveLocalProducts(products) {
  try {
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
  } catch (e) {
    // ignore
  }
}

async function saveProductToSupabase(product) {
  let savedProduct = product;
  const image = product.imageUrl || product.image || '';
  if (isInlineStoreImage(image)) {
    const upload = await uploadStoreImageDataUrl(image, { folder: 'products', assetId: product.id });
    savedProduct = {
      ...product,
      image: upload.publicUrl,
      imageUrl: upload.publicUrl,
      images: normalizeProductImages(upload.publicUrl, (product.images || []).filter((item) => !isInlineStoreImage(item)))
    };
  }
  const { data, error } = await supabase.from('products').upsert(mapToDb(savedProduct), { onConflict: 'id' }).select('*').single();
  if (error || !data?.id) throw error || new Error('Cloud save was not confirmed');
  return mapFromDb(data);
}

export function ProductsProvider({ children }) {
  const [products, setProducts] = useState(() => loadLocalProducts());
  const [loading, setLoading] = useState(true);

  // Fetch products safely with Supabase as primary source of truth
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const isCustomOrder = localStorage.getItem('duat_custom_product_order') === 'true';

      // 1. Primary: Attempt to load from Supabase
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .neq('category', 'cases');
      if (!error && Array.isArray(data)) {
        const fetchedProds = data.map(mapFromDb).filter(Boolean);

        // Cloud rows are authoritative. Device-only overrides must not mask edits from another device.
        const finalProducts = sortProductsByDefaultOrder(fetchedProds);
        setProducts(finalProducts);
        saveLocalProducts(finalProducts);
        setLoading(false);
        return;
      }

      // 2. Fallback to localStorage if Supabase call returned empty or error
      const local = loadLocalProducts();
      if (local && local.length > 0) {
        setProducts(isCustomOrder ? local : sortProductsByDefaultOrder(local));
        setLoading(false);
        return;
      }

      // 3. Fallback to INITIAL_PRODUCTS
      const initialSorted = sortProductsByDefaultOrder(applyOverridesAndMergedProducts(INITIAL_PRODUCTS));
      setProducts(initialSorted);
      saveLocalProducts(initialSorted);
    } catch (err) {
      console.warn('Products fetch fallback to local/initial:', err);
      const local = loadLocalProducts();
      setProducts(local && local.length > 0 ? local : sortProductsByDefaultOrder(applyOverridesAndMergedProducts(INITIAL_PRODUCTS)));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // 1. Initial load from Supabase (source of truth)
    fetchProducts();

    const channel = supabase
      .channel('duat-products')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'products' },
        fetchProducts
      )
      .subscribe();
    window.addEventListener('focus', fetchProducts);

    return () => {
      window.removeEventListener('focus', fetchProducts);
      supabase.removeChannel(channel);
    };
  }, []);

  const reorderProducts = async (list) => {
    const ordered = list.map((item, index) => ({ ...item, sortOrder: index }));
    const { data, error } = await supabase.from('products').upsert(ordered.map(mapToDb), { onConflict: 'id' }).select('id');
    if (error || data?.length !== ordered.length) throw error || new Error('Order save was not confirmed');
    setProducts(ordered);
    saveLocalProducts(ordered);
  };
  const moveProduct = async (id, step) => {
    const index = products.findIndex(item => item.id === id);
    if (index < 0 || index + step < 0 || index + step >= products.length) return;
    const list = [...products];
    [list[index], list[index + step]] = [list[index + step], list[index]];
    await reorderProducts(list);
  };
  const moveProductUp = id => moveProduct(id, -1);
  const moveProductDown = id => moveProduct(id, 1);

  const addProduct = async (prodData) => {
    const img = prodData.imageUrl || prodData.image || '';
    const newProduct = {
      ...prodData,
      id: prodData.id || `prod-${Date.now()}`,
      imageUrl: img,
      image: img,
      images: normalizeProductImages(img, Array.isArray(prodData.images) ? prodData.images : [])
    };
    const saved = await saveProductToSupabase(newProduct);
    setProducts(prev => { const next = [saved, ...prev]; saveLocalProducts(next); return next; });
    return saved;
  };

  const updateProduct = async (id, fields) => {
    const product = products.find(item => item.id === id);
    if (!product) throw new Error('Product not found');
    const img = fields.imageUrl ?? fields.image ?? product.imageUrl ?? product.image ?? '';
    const updated = { ...product, ...fields, imageUrl: img, image: img,
      images: normalizeProductImages(img, fields.images || [], product.images || []) };
    const saved = await saveProductToSupabase(updated);
    setProducts(prev => { const next = prev.map(item => item.id === id ? saved : item); saveLocalProducts(next); return next; });
    return saved;
  };

  const adjustPrice = async (id, delta) => {
    const product = products.find(item => item.id === id);
    if (!product) throw new Error('Product not found');
    await updateProduct(id, { price: Math.max(0, product.price + delta) });
  };

  const toggleProductVisibility = async (id) => {
    const product = products.find(item => item.id === id);
    if (!product) throw new Error('Product not found');
    const active = !(product.is_active ?? product.isActive ?? true);
    await updateProduct(id, { is_active: active, isActive: active });
  };

  const deleteProduct = async (id) => {
    const { data, error } = await supabase.from('products').delete().eq('id', id).select('id');
    if (error || !data?.length) throw error || new Error('Delete was not confirmed');
    setProducts(prev => { const next = prev.filter(item => item.id !== id); saveLocalProducts(next); return next; });
  };

  // Get single product by ID
  const getProductById = (id) => {
    if (!id) return null;
    const product = products.find((prod) => prod.id === id);
    return product ? storefrontProduct(product) : product;
  };

  // Reset products
  const resetProducts = async () => {
    try {
      localStorage.removeItem(CUSTOM_EDITS_KEY);
      localStorage.removeItem(ADDED_PRODUCTS_KEY);
      localStorage.removeItem(DELETED_PRODUCTS_KEY);
    } catch (e) {
      // ignore
    }
    setProducts(INITIAL_PRODUCTS);
    saveLocalProducts(INITIAL_PRODUCTS);
  };

  return (
    <ProductsContext.Provider
      value={{
        products: products.map(storefrontProduct),
        catalogProducts: products,
        loading,
        addProduct,
        updateProduct,
        adjustPrice,
        toggleProductVisibility,
        deleteProduct,
        getProductById,
        resetProducts,
        moveProductUp,
        moveProductDown,
        reorderProducts
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductsProvider');
  }
  return context;
}
