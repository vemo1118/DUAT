import React, { createContext, useContext, useState } from 'react';
import { quoteOrder } from '../services/orderApi';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const toggleCart = () => setIsCartOpen(prev => !prev);

  const addToCart = (product, customConfig = null) => {
    setCartItems(prevItems => {
      const cfg = customConfig || product.customConfig || product.customDetails;
      const isStickerOrBundle = product.id?.startsWith('custom-sticker-') ||
                                product.category === 'stickers' ||
                                product.category === 'bundles' ||
                                cfg?.mode === 'text' ||
                                cfg?.mode === 'image';

      if (isStickerOrBundle) {
        const newItem = {
          cartItemId: `sticker-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          id: product.id || `custom-sticker-${Date.now()}`,
          name: product.nameAr || product.name || product.nameEn,
          nameEn: product.nameEn || product.name || product.nameAr,
          nameAr: product.nameAr || product.name || product.nameEn,
          price: product.price || 100,
          tagEn: product.tagEn || 'Custom 3D Epoxy Sticker',
          tagAr: product.tagAr || 'استيكر إيبوكسي مجسم مخصص',
          image: product.image || product.designSnapshot,
          designSnapshot: product.designSnapshot || product.image,
          quantity: product.quantity || 1,
          category: product.category || 'stickers',
          customDetails: product.customDetails || cfg,
          isCustom: false
        };
        return [...prevItems, newItem];
      }

      const existingIndex = prevItems.findIndex(item => item.id === product.id && !item.isCustom);
      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex].quantity += (product.quantity || 1);
        return updated;
      }

      const newItem = {
        cartItemId: `${product.id}-${Date.now()}`,
        id: product.id,
        nameEn: product.nameEn || product.name,
        nameAr: product.nameAr || product.name,
        name: product.name || product.nameAr,
        price: product.price,
        image: product.image || product.images?.[0],
        images: product.images || (product.image ? [product.image] : []),
        tagEn: product.tagEn,
        tagAr: product.tagAr,
        quantity: product.quantity || 1,
        isCustom: false,
        category: product.category || 'stickers',
        product
      };
      return [...prevItems, newItem];
    });

    openCart();
  };

  const removeFromCart = (targetId) => {
    setCartItems(prev => prev.filter(item => item.cartItemId !== targetId && item.id !== targetId));
  };

  const updateQuantity = (targetId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(targetId);
      return;
    }
    setCartItems(prev =>
      prev.map(item => (item.cartItemId === targetId || item.id === targetId) ? { ...item, quantity: newQty } : item)
    );
  };

  const clearCart = () => {
    setCartItems([]);
    setPromoCode('');
    setDiscountAmount(0);
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const total = Math.max(0, subtotal - discountAmount);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const applyPromoCode = async (code) => {
    if (!code) return false;
    const clean = code.trim().toUpperCase();

    try {
      const quote = await quoteOrder({ items: cartItems, couponCode: clean });
      if (quote.couponCode === clean && Number(quote.discount) > 0) {
        setPromoCode(clean);
        setDiscountAmount(Number(quote.discount));
        return true;
      }
    } catch (error) {
      console.warn('Coupon verification failed:', error.message);
    }

    return false;
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      items: cartItems, // Alias for backward compatibility
      isCartOpen,
      isOpen: isCartOpen, // Alias for backward compatibility
      openCart,
      closeCart,
      toggleCart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      subtotal,
      total,
      totalItems: cartCount,
      cartCount,
      promoCode,
      discountAmount,
      discount: discountAmount, // Alias
      applyPromoCode
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};
