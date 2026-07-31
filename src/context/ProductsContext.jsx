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
          return parsed;
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
