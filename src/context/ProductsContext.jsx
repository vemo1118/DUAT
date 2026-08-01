import React, { createContext, useContext, useState, useEffect } from 'react';
import { PRODUCTS as INITIAL_PRODUCTS } from '../data/products';
import { supabase } from '../lib/supabase';

const ProductsContext = createContext();

function mapFromDb(row) {
  if (!row) return null;
  const data = row.data && typeof row.data === 'object' ? row.data : {};
  return {
    ...data,
    id: row.id || data.id,
    category: row.category || data.category || 'cases',
    price: row.price !== undefined && row.price !== null ? Number(row.price) : Number(data.price || 0),
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
  return {
    id: p.id,
    category: p.category || 'cases',
    price: Number(p.price) || 0,
    is_active: true,
    data: p
  };
}

export function ProductsProvider({ children }) {
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [loading, setLoading] = useState(true);

  // Fetch products from Supabase
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('products').select('*');
      if (error) {
        console.error('Failed to fetch products from Supabase:', error);
        setProducts(INITIAL_PRODUCTS);
      } else if (Array.isArray(data) && data.length > 0) {
        setProducts(data.map(mapFromDb));
      } else {
        // Database table is empty -> seed once from PRODUCTS array
        try {
          const seedPayload = INITIAL_PRODUCTS.map(mapToDb);
          const { data: seededData, error: seedErr } = await supabase
            .from('products')
            .upsert(seedPayload, { onConflict: 'id' })
            .select();

          if (!seedErr && Array.isArray(seededData) && seededData.length > 0) {
            setProducts(seededData.map(mapFromDb));
          } else {
            console.error('Seeding products error:', seedErr);
            setProducts(INITIAL_PRODUCTS);
          }
        } catch (sErr) {
          console.error('Error during initial product seeding:', sErr);
          setProducts(INITIAL_PRODUCTS);
        }
      }
    } catch (err) {
      console.error('Unexpected error loading products:', err);
      setProducts(INITIAL_PRODUCTS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Add a new product
  const addProduct = async (newProductData) => {
    const newProduct = {
      ...newProductData,
      id: newProductData.id || `product-${Date.now()}`,
      price: Number(newProductData.price) || 0,
      category: newProductData.category || 'cases',
      rating: newProductData.rating || 5.0,
      reviewCount: newProductData.reviewCount || 0,
      reviews: newProductData.reviews || [],
      specsEn: Array.isArray(newProductData.specsEn) ? newProductData.specsEn : [],
      specsAr: Array.isArray(newProductData.specsAr) ? newProductData.specsAr : []
    };

    setProducts((prev) => [newProduct, ...prev]);

    try {
      const { error } = await supabase.from('products').upsert(mapToDb(newProduct), { onConflict: 'id' });
      if (error) console.error('Supabase add product error:', error);
    } catch (err) {
      console.error('Supabase add product error:', err);
    }

    return newProduct;
  };

  // Update existing product by ID
  const updateProduct = async (id, updatedFields) => {
    let targetProduct = null;
    setProducts((prev) =>
      prev.map((prod) => {
        if (prod.id === id) {
          const updated = {
            ...prod,
            ...updatedFields,
            price: updatedFields.price !== undefined ? Number(updatedFields.price) : prod.price
          };
          targetProduct = updated;
          return updated;
        }
        return prod;
      })
    );

    if (targetProduct) {
      try {
        const { error } = await supabase.from('products').upsert(mapToDb(targetProduct), { onConflict: 'id' });
        if (error) console.error('Supabase update product error:', error);
      } catch (err) {
        console.error('Supabase update product error:', err);
      }
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

  // Delete product by ID
  const deleteProduct = async (id) => {
    setProducts((prev) => prev.filter((prod) => prod.id !== id));
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
