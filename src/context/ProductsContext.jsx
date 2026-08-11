import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  PRODUCTS as INITIAL_PRODUCTS_BASE,
  ARABIC_LETTER_PRODUCTS,
  ENGLISH_LETTER_PRODUCTS,
  MONTH_STICKER_PRODUCTS,
  YEAR_STICKER_PRODUCTS
} from '../data/products';
import { supabase } from '../lib/supabase';
import liveCustomEdits from '../data/live_custom_edits.json';
import {
  fetchCloudEdits,
  publishCloudEdits,
  subscribeToLiveSync,
  getLiveSyncState
} from '../services/liveSyncService';

// Merge all sticker product groups into one flat list
const INITIAL_PRODUCTS = [
  ...INITIAL_PRODUCTS_BASE,
  ...ARABIC_LETTER_PRODUCTS,
  ...ENGLISH_LETTER_PRODUCTS,
  ...MONTH_STICKER_PRODUCTS,
  ...YEAR_STICKER_PRODUCTS,
];

const ProductsContext = createContext();

const INITIAL_PRODUCTS_MAP = new Map(INITIAL_PRODUCTS.map((p) => [String(p.id), p]));

const LEGACY_FAKE_PRODUCT_IDS = new Set([
  'case-ember', 'case-void', 'case-frost', 'case-solar', 'case-bone', 'case-sage',
  'case-carbon', 'case-gold-ring', 'case-tide', 'charm-gold-ring', 'charm-ember-bead',
  'sticker-disc', 'sticker-tale3-noor', 'sticker-3addi-lel', 'sticker-born-dawn'
]);

function mapFromDb(row) {
  if (!row) return null;
  const idStr = String(row.id || (row.data && row.data.id) || '');
  if (LEGACY_FAKE_PRODUCT_IDS.has(idStr)) return null;

  const initP = INITIAL_PRODUCTS_MAP.get(idStr);
  const data = row.data && typeof row.data === 'object' ? row.data : {};
  const isActiveVal = row.is_active !== undefined ? Boolean(row.is_active) : (data.is_active !== undefined ? Boolean(data.is_active) : (data.isActive !== undefined ? Boolean(data.isActive) : true));

  let img = data.imageUrl || data.image || row.image_url || '';
  if ((!img || img.includes('SH1_ST_j1z2h3.png')) && initP && (initP.image || initP.imageUrl)) {
    img = initP.imageUrl || initP.image;
  }

  const baseObj = initP ? { ...initP } : {};

  const curPrice = row.price !== undefined && row.price !== null ? Number(row.price) : Number(data.price || baseObj.price || 0);
  const origPrice = data.originalPrice !== undefined ? Number(data.originalPrice) : (baseObj.originalPrice !== undefined ? Number(baseObj.originalPrice) : undefined);
  const savingsVal = data.savings !== undefined ? Number(data.savings) : (baseObj.savings !== undefined ? Number(baseObj.savings) : (origPrice && origPrice > curPrice ? origPrice - curPrice : 0));

  return {
    ...baseObj,
    ...data,
    id: idStr,
    category: row.category || data.category || baseObj.category || (idStr.startsWith('ar-letter-') || idStr.startsWith('en-letter-') || idStr.startsWith('month-') || idStr.startsWith('year-') ? 'letters' : (idStr.startsWith('st-') || idStr.startsWith('pack-') || idStr.startsWith('sticker') ? 'stickers' : 'cases')),
    price: curPrice,
    originalPrice: origPrice,
    savings: savingsVal,
    is_active: isActiveVal,
    isActive: isActiveVal,
    imageUrl: img,
    image: img,
    images: img ? [img] : (Array.isArray(baseObj.images) && baseObj.images.length > 0 ? baseObj.images : (Array.isArray(data.images) ? data.images : [])),
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
    caseTypeId: data.caseTypeId || row.case_type_id || baseObj.caseTypeId || 'clear',
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

  return {
    id: p.id,
    category: p.category || 'cases',
    name_en: p.nameEn || p.name_en || '',
    name_ar: p.nameAr || p.name_ar || '',
    price: curPrice,
    is_active: isActiveVal,
    image_url: img,
    data: {
      ...p,
      originalPrice: origPrice,
      savings: savingsVal,
      imageUrl: img,
      image: img,
      images: img ? [img] : (Array.isArray(p.images) ? p.images : []),
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
  let list = prods.filter((p) => p && p.id && !deletedIds.has(String(p.id)));

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
        images: img ? [img] : (Array.isArray(p.images) ? p.images : [])
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
    const idxA = PREFERRED_BUNDLE_ORDER.indexOf(a?.id);
    const idxB = PREFERRED_BUNDLE_ORDER.indexOf(b?.id);
    const posA = idxA !== -1 ? idxA : (a?.category === 'cases' ? 10 : 99);
    const posB = idxB !== -1 ? idxB : (b?.category === 'cases' ? 10 : 99);
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

async function saveProductToSupabase(p) {
  if (!p || !p.id) return;
  try {
    const payload = mapToDb(p);
    const { error } = await supabase.from('products').upsert(payload, { onConflict: 'id' });
    if (error) {
      console.warn('Supabase product upsert notice (persisted in local storage):', error.message);
    }
  } catch (err) {
    // ignore
  }
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
      const { data, error } = await supabase.from('products').select('*');
      if (!error && Array.isArray(data) && data.length > 0) {
        const fetchedProds = data.map(mapFromDb).filter(Boolean);

        // Merge DB prods with INITIAL_PRODUCTS to ensure any missing default product exists
        const dbMap = new Map(fetchedProds.map((p) => [String(p.id), p]));
        const merged = [
          ...fetchedProds,
          ...INITIAL_PRODUCTS.filter((initP) => !dbMap.has(String(initP.id)))
        ];

        const withOverrides = applyOverridesAndMergedProducts(merged);
        const finalProducts = isCustomOrder ? withOverrides : sortProductsByDefaultOrder(withOverrides);
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

    // 2. Initial fetch from JSONBlob fallback (for product overrides / edits)
    fetchCloudEdits().then(() => {
      setProducts(loadLocalProducts());
    });

    // 3. Subscribe to Supabase Realtime broadcasts from admin
    //    When admin saves any change, this fires and re-fetches fresh data from Supabase
    const unsubscribe = subscribeToLiveSync(() => {
      // Re-fetch from Supabase to get the absolute latest data
      fetchProducts();
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const moveProductUp = (id) => {
    localStorage.setItem('duat_custom_product_order', 'true');
    setProducts((prev) => {
      const idx = prev.findIndex((p) => p.id === id);
      if (idx <= 0) return prev;
      const updated = [...prev];
      const temp = updated[idx];
      updated[idx] = updated[idx - 1];
      updated[idx - 1] = temp;
      saveLocalProducts(updated);
      return updated;
    });
  };

  const moveProductDown = (id) => {
    localStorage.setItem('duat_custom_product_order', 'true');
    setProducts((prev) => {
      const idx = prev.findIndex((p) => p.id === id);
      if (idx === -1 || idx >= prev.length - 1) return prev;
      const updated = [...prev];
      const temp = updated[idx];
      updated[idx] = updated[idx + 1];
      updated[idx + 1] = temp;
      saveLocalProducts(updated);
      return updated;
    });
  };

  const setCasesFirstOrder = () => {
    localStorage.removeItem('duat_custom_product_order');
    setProducts((prev) => {
      const updated = sortProductsByDefaultOrder(prev);
      saveLocalProducts(updated);
      return updated;
    });
  };

  const reorderProducts = (newList) => {
    localStorage.setItem('duat_custom_product_order', 'true');
    setProducts(newList);
    saveLocalProducts(newList);
  };

  const addProduct = async (prodData) => {
    const img = prodData.imageUrl || prodData.image || '';
    const newProduct = {
      ...prodData,
      id: prodData.id || `prod-${Date.now()}`,
      imageUrl: img,
      image: img,
      images: img ? [img] : (Array.isArray(prodData.images) ? prodData.images : [])
    };
    saveAddedProduct(newProduct);
    saveCustomEdit(newProduct.id, newProduct);

    setProducts((prev) => {
      const updated = [newProduct, ...prev];
      saveLocalProducts(updated);
      return updated;
    });
    await saveProductToSupabase(newProduct);
    return newProduct;
  };

  const updateProduct = async (id, updatedFields) => {
    saveCustomEdit(id, updatedFields);

    let targetProduct = null;
    setProducts((prev) => {
      const updatedList = prev.map((prod) => {
        if (prod.id === id) {
          const img = updatedFields.imageUrl !== undefined ? updatedFields.imageUrl : (updatedFields.image !== undefined ? updatedFields.image : (prod.imageUrl || prod.image || ''));
          const updated = {
            ...prod,
            ...updatedFields,
            imageUrl: img,
            image: img,
            images: img ? [img] : (Array.isArray(prod.images) ? prod.images : [])
          };
          targetProduct = updated;
          return updated;
        }
        return prod;
      });
      saveLocalProducts(updatedList);
      return updatedList;
    });

    if (targetProduct) {
      await saveProductToSupabase(targetProduct);
    }
  };

  // Quick price adjustment
  const adjustPrice = async (id, delta) => {
    let targetProduct = null;
    setProducts((prev) =>
      prev.map((prod) => {
        if (prod.id === id) {
          const newPrice = Math.max(0, prod.price + delta);
          saveCustomEdit(id, { price: newPrice });
          const updated = { ...prod, price: newPrice };
          targetProduct = updated;
          return updated;
        }
        return prod;
      })
    );

    if (targetProduct) {
      try {
        const { error } = await supabase.from('products').upsert(mapToDb(targetProduct), { onConflict: 'id' });
        if (error) console.error('Supabase adjust price error:', error);
      } catch (err) {
        console.error('Supabase adjust price error:', err);
      }
    }
  };

  const toggleProductVisibility = async (id) => {
    let targetProduct = null;
    setProducts((prev) => {
      const updatedList = prev.map((prod) => {
        if (prod.id === id) {
          const currentStatus = prod.is_active !== undefined ? Boolean(prod.is_active) : (prod.isActive !== undefined ? Boolean(prod.isActive) : true);
          const newStatus = !currentStatus;
          saveCustomEdit(id, { is_active: newStatus, isActive: newStatus });
          const updated = { ...prod, is_active: newStatus, isActive: newStatus };
          targetProduct = updated;
          return updated;
        }
        return prod;
      });
      saveLocalProducts(updatedList);
      return updatedList;
    });

    if (targetProduct) {
      await saveProductToSupabase(targetProduct);
    }
  };

  const deleteProduct = async (id) => {
    saveDeletedProductId(id);
    setProducts((prev) => {
      const updatedList = prev.filter((prod) => prod.id !== id);
      saveLocalProducts(updatedList);
      return updatedList;
    });
    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) console.error('Supabase delete product error:', error);
    } catch (err) {
      console.error('Supabase delete product error:', err);
    }
  };

  // Get single product by ID
  const getProductById = (id) => {
    if (!id) return null;
    return products.find((prod) => prod.id === id);
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
        products,
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
        setCasesFirstOrder,
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
