import React, { createContext, useContext, useState, useEffect } from 'react';

const WishlistContext = createContext();

const WISHLIST_STORAGE_KEY = 'duat_wishlist_items_v1';

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState(() => {
    try {
      const saved = localStorage.getItem(WISHLIST_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.warn('Error reading wishlist from localStorage:', e);
      return [];
    }
  });

  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlistItems));
    } catch (e) {
      console.warn('Error saving wishlist to localStorage:', e);
    }
  }, [wishlistItems]);

  const openWishlist = () => setIsWishlistOpen(true);
  const closeWishlist = () => setIsWishlistOpen(false);
  const toggleWishlist = () => setIsWishlistOpen(prev => !prev);

  const isInWishlist = (productId) => {
    if (!productId) return false;
    return wishlistItems.some(item => (item.id || item) === productId);
  };

  const toggleWishlistItem = (product) => {
    if (!product) return;
    const targetId = product.id || product;
    setWishlistItems(prev => {
      const exists = prev.some(item => item.id === targetId);
      if (exists) {
        return prev.filter(item => item.id !== targetId);
      } else {
        const itemToAdd = typeof product === 'object' ? product : { id: targetId };
        return [...prev, itemToAdd];
      }
    });
  };

  const removeFromWishlist = (productId) => {
    setWishlistItems(prev => prev.filter(item => item.id !== productId));
  };

  const clearWishlist = () => setWishlistItems([]);

  return (
    <WishlistContext.Provider value={{
      wishlistItems,
      wishlistCount: wishlistItems.length,
      isWishlistOpen,
      openWishlist,
      closeWishlist,
      toggleWishlist,
      isInWishlist,
      toggleWishlistItem,
      removeFromWishlist,
      clearWishlist
    }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within WishlistProvider');
  }
  return context;
};
