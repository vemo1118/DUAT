import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { X, Trash2, Plus, Minus, ArrowRight, ArrowLeft, Tag } from 'lucide-react';

export const CartDrawer = () => {
  const { lang, t, formatPrice } = useLanguage();
  const {
    cartItems,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
    subtotal,
    discountAmount,
    promoCode,
    applyPromoCode
  } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [inputPromo, setInputPromo] = useState('');
  const isRtl = lang === 'ar';
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

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

  const handleProceedCheckout = () => {
    closeCart();
    navigate('/checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!isCartOpen) return null;

  const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const finalTotal = Math.max(0, subtotal - discountAmount);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      
      {/* Dark Overlay Backdrop */}
      <div
        onClick={closeCart}
        className="absolute inset-0 bg-void/80 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10 rtl:pl-0 rtl:pr-10">
        <div className="w-screen max-w-md bg-stone border-l border-grave flex flex-col shadow-2xl animate-in slide-in-from-right duration-300 card-depth-highlight">
          
          {/* Header */}
          <div className="p-6 border-b border-grave flex justify-between items-center bg-void">
            <h2 className="font-clash text-2xl uppercase tracking-tight text-bone">
              {t('cartTitle')} ({totalQuantity})
            </h2>
            <button
              onClick={closeCart}
              className="p-2 text-ash hover:text-gold transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center border border-grave bg-coal"
              aria-label="Close Cart"
            >
              <X size={20} />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
                <p className="font-space text-base text-ash font-light">
                  {t('cartEmpty')}
                </p>
                <button
                  onClick={closeCart}
                  className="btn-ghost py-3 px-6 text-xs font-mono tracking-widest min-h-[44px]"
                >
                  {t('backToShop')}
                </button>
              </div>
            ) : (
              cartItems.map((item) => {
                const itemId = item.cartItemId || item.cartId || item.id;
                const config = item.customConfig || item.customDetails;
                return (
                  <div
                    key={itemId}
                    className="p-4 bg-coal border border-grave flex justify-between items-start gap-4"
                  >
                    <div className="space-y-1 flex-1">
                      <h4 className="font-space font-bold text-sm text-bone">
                        {lang === 'ar' ? item.nameAr : item.nameEn}
                      </h4>

                      {config && (
                        <div className="font-mono text-[10px] text-gold uppercase space-y-0.5 pt-0.5">
                          {config.phoneModel && <p>Model: {config.phoneModel}</p>}
                          {config.caseType && <p>Armor: {config.caseType}</p>}
                        </div>
                      )}

                      <span className="font-mono text-xs text-gold font-bold block pt-1">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>

                    {/* Quantity & Delete Controls */}
                    <div className="flex flex-col items-end gap-3">
                      <button
                        onClick={() => removeFromCart(itemId)}
                        className="text-ash hover:text-ember transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"
                        title="Remove"
                      >
                        <Trash2 size={16} />
                      </button>

                      <div className="flex items-center border border-grave bg-stone font-mono text-xs">
                        <button
                          onClick={() => updateQuantity(itemId, item.quantity - 1)}
                          className="px-2.5 py-1 text-ash hover:text-bone min-h-[32px] flex items-center justify-center"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="px-2 text-bone font-bold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(itemId, item.quantity + 1)}
                          className="px-2.5 py-1 text-ash hover:text-bone min-h-[32px] flex items-center justify-center"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer & Checkout Action */}
          {cartItems.length > 0 && (
            <div className="p-6 border-t border-grave bg-void space-y-4">
              
              {/* Promo Code Form */}
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag size={14} className="absolute left-3 top-3.5 text-ash" />
                  <input
                    type="text"
                    value={inputPromo}
                    onChange={(e) => setInputPromo(e.target.value)}
                    placeholder={t('promoPlaceholder')}
                    className="w-full bg-coal border border-grave text-bone pl-9 pr-3 py-2 text-xs font-mono uppercase focus:border-gold focus:outline-none min-h-[44px]"
                  />
                </div>
                <button
                  type="submit"
                  className="btn-ghost py-2 px-4 text-xs font-mono min-h-[44px]"
                >
                  {t('applyPromo')}
                </button>
              </form>

              {/* Subtotal & Discount breakdown */}
              <div className="space-y-1.5 font-mono text-xs border-t border-grave/40 pt-3">
                <div className="flex justify-between text-ash">
                  <span>{t('subtotal')}</span>
                  <span className="text-bone font-bold">{formatPrice(subtotal)}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-ember font-bold">
                    <span>{t('discount')} ({promoCode})</span>
                    <span>-{formatPrice(discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-gold font-bold text-sm pt-1 border-t border-grave/30">
                  <span>TOTAL</span>
                  <span>{formatPrice(finalTotal)}</span>
                </div>

                <p className="text-[10px] text-ash tracking-tight pt-1">
                  {t('freeShippingNotice')}
                </p>
              </div>

              {/* Checkout CTA Button */}
              <button
                onClick={handleProceedCheckout}
                className="w-full btn-primary py-4 text-xs font-mono tracking-widest flex items-center justify-center gap-2 shadow-lg min-h-[44px]"
              >
                <span>{t('checkoutBtn')}</span>
                <ArrowIcon size={14} />
              </button>

            </div>
          )}

        </div>
      </div>

    </div>
  );
};
