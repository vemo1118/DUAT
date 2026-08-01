import React, { createContext, useContext, useState, useEffect } from 'react';
import { PRODUCTS as INITIAL_PRODUCTS } from '../data/products';

const ProductsContext = createContext();

const STORAGE_KEY = 'duat_products';

export function ProductsProvider({ children }) {
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const sanitized = parsed.map((p, idx) => {
            const fallback = INITIAL_PRODUCTS.find((initP) => initP.id === p?.id) || INITIAL_PRODUCTS[0];
            return {
              ...fallback,
              ...p,
              id: p?.id || `product-${idx}`,
              nameEn: p?.nameEn || p?.nameAr || fallback.nameEn,
              nameAr: p?.nameAr || p?.nameEn || fallback.nameAr,
              price: Number(p?.price) || fallback.price || 500,
              originalPrice: Number(p?.originalPrice) || Number(p?.price) || Math.round((fallback.price || 500) * 1.3),
              category: p?.category || fallback.category || 'cases',
              tagEn: p?.tagEn || fallback.tagEn || '',
              tagAr: p?.tagAr || fallback.tagAr || '',
              craftTagEn: p?.craftTagEn || fallback.craftTagEn || '',
              craftTagAr: p?.craftTagAr || fallback.craftTagAr || ''
            };
          });
          return sanitized;
        }
      }
    } catch (e) {
      console.error('Failed to load products from localStorage:', e);
    }
    return INITIAL_PRODUCTS;
  });

  // Persist products to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    } catch (e) {
      console.error('Failed to save products to localStorage:', e);
    }
  }, [products]);

  // Add a new product
  const addProduct = (newProductData) => {
    const newProduct = {
      ...newProductData,
      id: newProductData.id || `product-${Date.now()}`,
      price: Number(newProductData.price) || 0,
      rating: newProductData.rating || 5.0,
      reviewCount: newProductData.reviewCount || 0,
      reviews: newProductData.reviews || [],
      specsEn: Array.isArray(newProductData.specsEn) ? newProductData.specsEn : [],
      specsAr: Array.isArray(newProductData.specsAr) ? newProductData.specsAr : []
    };
    setProducts((prev) => [newProduct, ...prev]);
    return newProduct;
  };

  // Update existing product by ID
  const updateProduct = (id, updatedFields) => {
    setProducts((prev) =>
      prev.map((prod) => {
        if (prod.id === id) {
          return {
            ...prod,
            ...updatedFields,
            price: updatedFields.price !== undefined ? Number(updatedFields.price) : prod.price
          };
        }
        return prod;
      })
    );
  };

  // Quick price adjustment (+ or - delta)
  const adjustPrice = (id, delta) => {
    setProducts((prev) =>
      prev.map((prod) => {
        if (prod.id === id) {
          const newPrice = Math.max(0, prod.price + delta);
          return { ...prod, price: newPrice };
        }
        return prod;
      })
    );
  };

  // Delete product by ID
  const deleteProduct = (id) => {
    setProducts((prev) => prev.filter((prod) => prod.id !== id));
  };

  // Get single product by ID
  const getProductById = (id) => {
    if (!id) return null;
    return products.find((prod) => prod.id === id);
  };

  // Reset back to initial hardcoded list
  const resetProducts = () => {
    setProducts(INITIAL_PRODUCTS);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <ProductsContext.Provider
      value={{
        products,
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
