import React, { useState } from 'react';
import { X, Plus, Minus, Trash2, ArrowRight, ArrowLeft, Tag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import { SunDisc } from './SunDisc';

export const CartDrawer = ({ setView }) => {
  const {
    cartItems,
    isCartOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
    subtotal,
    promoCode,
    discountAmount,
    applyPromoCode
  } = useCart();
  const { lang, t, formatPrice } = useLanguage();
  const { showToast } = useToast();

  const [inputPromo, setInputPromo] = useState('');

  if (!isCartOpen) return null;

  const handleCheckoutClick = () => {
    closeCart();
    setView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (!inputPromo.trim()) return;

    const success = applyPromoCode(inputPromo);
    if (success) {
      showToast(t('promoSuccessToast'), 'success');
      setInputPromo('');
    } else {
      showToast(t('promoInvalidToast'), 'error');
    }
  };

  const finalSubtotal = Math.max(0, subtotal - discountAmount);
  const isRtl = lang === 'ar';
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-void/80 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
      />

      <div className={`fixed inset-y-0 ${isRtl ? 'left-0' : 'right-0'} max-w-full flex`}>
        <div className="w-screen max-w-md bg-stone border-l border-grave flex flex-col justify-between shadow-2xl">
          
          {/* Header */}
          <div className="p-6 border-b border-grave flex items-center justify-between bg-void/50">
            <div className="flex items-center gap-3">
              <SunDisc size={20} />
              <h2 className="font-archivo text-xl uppercase text-bone tracking-tight">
                {t('cartTitle')}
              </h2>
            </div>
            <button
              onClick={closeCart}
              className="p-2 text-ash hover:text-gold border border-grave transition-colors"
              aria-label="Close Cart"
            >
              <X size={20} />
            </button>
          </div>

          {/* Cart Content / Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 space-y-4">
                <SunDisc size={64} variant="eclipse" className="opacity-40 animate-pulse" />
                <p className="font-mono text-ash text-sm uppercase tracking-widest max-w-xs leading-relaxed">
                  {t('cartEmpty')}
                </p>
              </div>
            ) : (
              cartItems.map((item) => (
                <div
                  key={item.cartItemId}
                  className="bg-coal p-4 border border-grave flex gap-4 items-center group relative"
                >
                  {/* Item Preview */}
                  <div className="w-16 h-16 bg-void border border-grave flex items-center justify-center flex-shrink-0 relative overflow-hidden">
                    {item.isCustom ? (
                      <div className="w-8 h-14 rounded-[3px] border border-gold/40 flex items-center justify-center bg-stone">
                        <SunDisc size={12} />
                      </div>
                    ) : (
                      <SunDisc size={20} variant="gold" className="opacity-80" />
                    )}
                  </div>

                  {/* Item Specs */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-space font-semibold text-bone text-sm truncate">
                      {lang === 'ar' ? item.nameAr : item.nameEn}
                    </h3>
                    <p className="font-mono text-xs text-ash tracking-wide uppercase mt-0.5">
                      {lang === 'ar' ? item.tagAr : item.tagEn}
                    </p>
                    <p className="font-mono text-sm text-gold mt-1 font-bold">
                      {formatPrice(item.price)}
                    </p>
                  </div>

                  {/* Quantity Stepper & Delete */}
                  <div className="flex flex-col items-end gap-2">
                    <button
                      onClick={() => removeFromCart(item.cartItemId)}
                      className="text-ash hover:text-ember transition-colors p-1"
                      aria-label="Remove item"
                    >
                      <Trash2 size={16} />
                    </button>

                    <div className="flex items-center border border-grave bg-stone">
                      <button
                        onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                        className="px-2 py-1 text-ash hover:text-bone transition-colors"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="px-2.5 font-mono text-xs text-bone font-bold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                        className="px-2 py-1 text-ash hover:text-bone transition-colors"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout CTA */}
          {cartItems.length > 0 && (
            <div className="p-6 border-t border-grave bg-void/80 space-y-4">
              
              {/* Promo Code Coupon Form */}
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag size={14} className="absolute left-3 top-3 text-ash" />
                  <input
                    type="text"
                    value={inputPromo}
                    onChange={(e) => setInputPromo(e.target.value)}
                    placeholder={t('promoPlaceholder')}
                    className="w-full bg-coal border border-grave text-bone pl-9 pr-3 py-2 text-xs font-mono uppercase focus:border-gold focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="btn-ghost px-4 py-2 text-xs font-mono"
                >
                  {t('applyPromo')}
                </button>
              </form>

              <div className="space-y-2 font-mono text-xs uppercase tracking-wider text-ash border-t border-grave pt-3">
                <div className="flex justify-between">
                  <span>{t('subtotal')}</span>
                  <span className="text-bone font-bold text-sm">{formatPrice(subtotal)}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-gold">
                    <span>{t('discount')} ({promoCode})</span>
                    <span className="font-bold">-{formatPrice(discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>{t('shipping')}</span>
                  <span className="text-gold font-bold">
                    {finalSubtotal >= 800 ? t('freeShipping') : formatPrice(50)}
                  </span>
                </div>
              </div>

              <button
                onClick={handleCheckoutClick}
                className="w-full btn-primary py-4 text-sm flex items-center justify-center gap-2 group"
              >
                <span>{t('checkoutBtn')}</span>
                <ArrowIcon size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
