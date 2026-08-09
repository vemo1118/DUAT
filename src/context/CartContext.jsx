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
      const cfg = customConfig || product.customConfig || product.customDetails;
      const isCustomProduct = product.isCustom || product.category === 'customizer' || !!cfg || !!product.designSnapshot;

      if (isCustomProduct) {
        const snapshot = product.designSnapshot || cfg?.designSnapshot || product.image;
        const phoneModel = cfg?.phoneModel || product.selectedModel || product.phoneModel || 'iPhone';
        const newItem = {
          cartItemId: `custom-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          id: product.id || `custom-case-${Date.now()}`,
          name: product.name || product.nameAr || `جراب مخصص — ${phoneModel}`,
          nameEn: product.nameEn || `Custom Case — ${phoneModel}`,
          nameAr: product.nameAr || `جراب مخصص — ${phoneModel}`,
          price: product.price || 850,
          tagEn: product.tagEn || phoneModel || 'Custom',
          tagAr: product.tagAr || phoneModel || 'مخصص',
          image: snapshot,
          designSnapshot: snapshot,
          quantity: product.quantity || 1,
          isCustom: true,
          category: product.category || 'customizer',
          customConfig: {
            ...(cfg || {}),
            phoneModel: phoneModel,
            customModelInput: cfg?.customModelInput || product.customModelInput,
            caseType: cfg?.caseType || product.caseType,
            caseFinish: cfg?.caseFinish || product.caseFinish,
            designSnapshot: snapshot,
            layers: cfg?.layers || product.layers || []
          }
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

  const applyPromoCode = (code) => {
    if (!code) return false;
    const clean = code.trim().toUpperCase();
    
    // Dynamic promo code evaluation rules
    if (clean === 'DUAT10' || clean.endsWith('10')) {
      const discount = Math.round(subtotal * 0.10);
      setPromoCode(clean);
      setDiscountAmount(discount);
      return true;
    } else if (clean === 'SUMMER20' || clean.endsWith('20')) {
      const discount = Math.round(subtotal * 0.20);
      setPromoCode(clean);
      setDiscountAmount(discount);
      return true;
    } else if (clean === 'DAWN100' || clean.endsWith('100')) {
      const discount = Math.min(100, subtotal);
      setPromoCode(clean);
      setDiscountAmount(discount);
      return true;
    } else if (clean === 'FREESHIP' || clean === 'DUAT50') {
      const discount = Math.min(50, subtotal);
      setPromoCode(clean);
      setDiscountAmount(discount);
      return true;
    }
    
    // Fallback: If user created custom coupon code in localStorage
    try {
      const savedCoupons = JSON.parse(localStorage.getItem('duat_coupons_list_v1') || '[]');
      const match = savedCoupons.find(c => c.code.toUpperCase() === clean && c.isActive !== false);
      if (match) {
        let disc = 0;
        if (match.type === 'percentage') {
          disc = Math.round((subtotal * match.value) / 100);
        } else {
          disc = Math.min(match.value, subtotal);
        }
        setPromoCode(clean);
        setDiscountAmount(disc);
        return true;
      }
    } catch (e) {
      console.warn('Error reading dynamic coupons in cart:', e);
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
