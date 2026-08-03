import React, { createContext, useContext, useState, useEffect } from 'react';
import { PRODUCTS as INITIAL_PRODUCTS } from '../data/products';
import { supabase } from '../lib/supabase';

const ProductsContext = createContext();

function mapFromDb(row) {
  if (!row) return null;
  const data = row.data && typeof row.data === 'object' ? row.data : {};
  const isActiveVal = row.is_active !== undefined ? Boolean(row.is_active) : (data.is_active !== undefined ? Boolean(data.is_active) : (data.isActive !== undefined ? Boolean(data.isActive) : true));
  return {
    ...data,
    id: row.id || data.id,
    category: row.category || data.category || 'cases',
    price: row.price !== undefined && row.price !== null ? Number(row.price) : Number(data.price || 0),
    is_active: isActiveVal,
    isActive: isActiveVal,
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
  return {
    id: p.id,
    category: p.category || 'cases',
    name_en: p.nameEn || p.name_en || '',
    name_ar: p.nameAr || p.name_ar || '',
    price: Number(p.price) || 0,
    is_active: isActiveVal,
    data: {
      ...p,
      is_active: isActiveVal,
      isActive: isActiveVal
    }
  };
}

const PRODUCTS_STORAGE_KEY = 'duat_products_v2';

function loadLocalProducts() {
  try {
    const saved = localStorage.getItem(PRODUCTS_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    // ignore
  }
  return null;
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
    const { error: fullErr } = await supabase.from('products').upsert(mapToDb(p), { onConflict: 'id' });
    if (fullErr) {
      console.warn('Full product upsert failed, trying minimal payload:', fullErr);
      const minimalPayload = {
        id: String(p.id),
        category: p.category || 'cases',
        price: Number(p.price) || 0,
        is_active: p.is_active !== undefined ? Boolean(p.is_active) : true,
        data: p
      };
      const { error: minErr } = await supabase.from('products').upsert(minimalPayload, { onConflict: 'id' });
      if (minErr) console.error('Minimal product upsert failed:', minErr);
    }
  } catch (err) {
    console.error('Error saving product to Supabase:', err);
  }
}

export function ProductsProvider({ children }) {
  const [products, setProducts] = useState(() => loadLocalProducts() || INITIAL_PRODUCTS);
  const [loading, setLoading] = useState(true);

  // Fetch products from Supabase
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('products').select('*');
      if (!error && Array.isArray(data) && data.length > 0) {
        const fetched = data.map(mapFromDb);
        setProducts(fetched);
        saveLocalProducts(fetched);
      } else {
        const local = loadLocalProducts();
        if (local && local.length > 0) {
          setProducts(local);
        } else {
          setProducts(INITIAL_PRODUCTS);
          saveLocalProducts(INITIAL_PRODUCTS);
        }
      }
    } catch (err) {
      console.error('Unexpected error loading products:', err);
      const local = loadLocalProducts();
      if (local && local.length > 0) setProducts(local);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const addProduct = async (prodData) => {
    const newProduct = {
      ...prodData,
      id: prodData.id || `prod-${Date.now()}`
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
          const updated = { ...prod, ...updatedFields };
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
    fetchProducts();
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
        resetProducts
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
