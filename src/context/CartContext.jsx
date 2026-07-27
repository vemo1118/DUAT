import React, { createContext, useContext, useState } from 'react';

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
      if (customConfig) {
        const newItem = {
          cartItemId: `custom-${Date.now()}`,
          id: product.id || 'custom-case',
          nameEn: customConfig.titleEn || product.nameEn || 'Customized Case',
          nameAr: customConfig.titleAr || product.nameAr || 'جراب مخصص',
          price: product.price || 850,
          tagEn: customConfig.phoneModel,
          tagAr: customConfig.phoneModel,
          quantity: 1,
          isCustom: true,
          customConfig
        };
        return [...prevItems, newItem];
      }

      const existingIndex = prevItems.findIndex(item => item.id === product.id && !item.isCustom);
      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex].quantity += 1;
        return updated;
      }

      const newItem = {
        cartItemId: `${product.id}-${Date.now()}`,
        id: product.id,
        nameEn: product.nameEn,
        nameAr: product.nameAr,
        price: product.price,
        tagEn: product.tagEn,
        tagAr: product.tagAr,
        quantity: 1,
        isCustom: false,
        product
      };
      return [...prevItems, newItem];
    });

    openCart();
  };

  const removeFromCart = (cartItemId) => {
    setCartItems(prev => prev.filter(item => item.cartItemId !== cartItemId));
  };

  const updateQuantity = (cartItemId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCartItems(prev =>
      prev.map(item => item.cartItemId === cartItemId ? { ...item, quantity: newQty } : item)
    );
  };

  const clearCart = () => {
    setCartItems([]);
    setPromoCode('');
    setDiscountAmount(0);
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const applyPromoCode = (code) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'DUAT10') {
      const discount = Math.round(subtotal * 0.10);
      setPromoCode(clean);
      setDiscountAmount(discount);
      return true;
    } else if (clean === 'DAWN100') {
      const discount = Math.min(100, subtotal);
      setPromoCode(clean);
      setDiscountAmount(discount);
      return true;
    }
    return false;
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      isCartOpen,
      openCart,
      closeCart,
      toggleCart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      subtotal,
      cartCount,
      promoCode,
      discountAmount,
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
