import React, { createContext, useContext, useState, useEffect } from 'react';
import { PRODUCTS as INITIAL_PRODUCTS } from '../data/products';
import { supabase } from '../lib/supabase';

const ProductsContext = createContext();

function mapFromDb(row) {
  if (!row) return null;
  const data = row.data && typeof row.data === 'object' ? row.data : {};
  const isActiveVal = row.is_active !== undefined ? Boolean(row.is_active) : (data.is_active !== undefined ? Boolean(data.is_active) : (data.isActive !== undefined ? Boolean(data.isActive) : true));
  const img = data.imageUrl || data.image || row.image_url || '';
  return {
    ...data,
    id: row.id || data.id,
    category: row.category || data.category || 'cases',
    price: row.price !== undefined && row.price !== null ? Number(row.price) : Number(data.price || 0),
    is_active: isActiveVal,
    isActive: isActiveVal,
    imageUrl: img,
    image: img,
    images: img ? [img] : (Array.isArray(data.images) ? data.images : []),
    nameEn: data.nameEn || row.name_en || '',
    nameAr: data.nameAr || row.name_ar || '',
    tagEn: data.tagEn || row.tag_en || '',
    tagAr: data.tagAr || row.tag_ar || '',
    craftTagEn: data.craftTagEn || row.craft_tag_en || '',
    craftTagAr: data.craftTagAr || row.craft_tag_ar || '',
    descriptionEn: data.descriptionEn || row.description_en || '',
    descriptionAr: data.descriptionAr || row.description_ar || '',
    specsEn: Array.isArray(data.specsEn) ? data.specsEn : (Array.isArray(row.specs_en) ? row.specs_en : []),
    specsAr: Array.isArray(data.specsAr) ? data.specsAr : (Array.isArray(row.specs_ar) ? row.specs_ar : []),
    caseTypeId: data.caseTypeId || row.case_type_id || 'clear',
    rating: Number(data.rating || row.rating || 5.0),
    reviewCount: Number(data.reviewCount || row.review_count || 0),
    reviews: Array.isArray(data.reviews) ? data.reviews : (Array.isArray(row.reviews) ? row.reviews : [])
  };
}

function mapToDb(p) {
  const isActiveVal = p.is_active !== undefined ? Boolean(p.is_active) : (p.isActive !== undefined ? Boolean(p.isActive) : true);
  const img = p.imageUrl || p.image || '';
  return {
    id: p.id,
    category: p.category || 'cases',
    name_en: p.nameEn || p.name_en || '',
    name_ar: p.nameAr || p.name_ar || '',
    price: Number(p.price) || 0,
    is_active: isActiveVal,
    image_url: img,
    data: {
      ...p,
      imageUrl: img,
      image: img,
      images: img ? [img] : (Array.isArray(p.images) ? p.images : []),
      is_active: isActiveVal,
      isActive: isActiveVal
    }
  };
}

const PRODUCTS_STORAGE_KEY = 'duat_products_v7';

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

export function sortProductsByDefaultOrder(prods) {
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
        if (!isCustomOrder) {
          return sortProductsByDefaultOrder(parsed);
        }
        return parsed;
      }
    }
  } catch (e) {
    // ignore
  }
  return sortProductsByDefaultOrder(INITIAL_PRODUCTS);
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

  // Fetch products safely without overwriting local admin edits
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const isCustomOrder = localStorage.getItem('duat_custom_product_order') === 'true';
      const local = loadLocalProducts();
      if (local && local.length > 0) {
        setProducts(isCustomOrder ? local : sortProductsByDefaultOrder(local));
        setLoading(false);
        return;
      }
      const initialSorted = sortProductsByDefaultOrder(INITIAL_PRODUCTS);
      setProducts(initialSorted);
      saveLocalProducts(initialSorted);
    } catch (err) {
      console.warn('Products fetch fallback to local/initial:', err);
      setProducts(sortProductsByDefaultOrder(INITIAL_PRODUCTS));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
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
    setProducts((prev) => {
      const updated = [newProduct, ...prev];
      saveLocalProducts(updated);
      return updated;
    });
    await saveProductToSupabase(newProduct);
    return newProduct;
  };

  const updateProduct = async (id, updatedFields) => {
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
