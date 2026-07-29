import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import { X, Trash2, Plus, Minus, ArrowRight, ArrowLeft, Tag, ShoppingBag } from 'lucide-react';

export const CartDrawer = () => {
  const {
    items,
    isOpen,
    toggleCart,
    removeFromCart,
    updateQuantity,
    subtotal,
    discount,
    total,
    promoCode,
    applyPromoCode
  } = useCart();

  const { lang, t, formatPrice } = useLanguage();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [inputPromo, setInputPromo] = useState('');
  const isRtl = lang === 'ar';
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  if (!isOpen) return null;

  const handleApplyPromo = () => {
    if (!inputPromo.trim()) return;
    const success = applyPromoCode(inputPromo.trim());
    if (success) {
      showToast(t('promoSuccessToast'), 'success');
    } else {
      showToast(t('promoInvalidToast'), 'error');
    }
    setInputPromo('');
  };

  const handleProceedCheckout = () => {
    toggleCart();
    navigate('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Dark Backdrop */}
      <div
        onClick={toggleCart}
        className="absolute inset-0 bg-void/80 transition-opacity animate-in fade-in duration-200"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10 rtl:pl-0 rtl:pr-10">
        {/* 100% SOLID OPAQUE DRAWER SURFACE (No Bleed-Through) */}
        <div className="w-screen max-w-md bg-stone border-l border-grave shadow-2xl flex flex-col justify-between text-bone animate-in slide-in-from-right duration-300">
          
          {/* Header */}
          <div className="p-6 border-b border-grave flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag size={20} className="text-gold" />
              <h2 className="font-clash text-xl uppercase tracking-wide">
                {t('cartTitle')} ({items.reduce((sum, item) => sum + item.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={toggleCart}
              className="p-2 text-ash hover:text-bone transition-colors border border-grave min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Close cart"
            >
              <X size={18} />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-16">
                <ShoppingBag size={48} className="text-ash/40 stroke-[1]" />
                <p className="font-space text-sm text-ash max-w-xs leading-relaxed">
                  {t('cartEmpty')}
                </p>
                <button
                  onClick={() => {
                    toggleCart();
                    navigate('/shop');
                  }}
                  className="btn-primary py-3 px-6 text-xs"
                >
                  {t('heroCtaSecondary')}
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="bg-coal border border-grave p-4 flex gap-4 justify-between items-start"
                >
                  <div className="flex-1 space-y-1">
                    <h3 className="font-space font-bold text-sm text-bone">
                      {lang === 'ar' ? item.nameAr : item.nameEn}
                    </h3>
                    <p className="font-mono text-[10px] text-ash uppercase tracking-wider">
                      ARMOR: {lang === 'ar' ? item.tagAr : item.tagEn}
                    </p>
                    {item.customDetails?.model && (
                      <p className="font-mono text-[10px] text-gold uppercase">
                        {item.customDetails.model}
                      </p>
                    )}
                    <p className="font-mono text-sm text-gold font-bold pt-1">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>

                  <div className="flex flex-col items-end justify-between h-full space-y-3">
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-ash hover:text-ember transition-colors p-1"
                      title="Remove item"
                    >
                      <Trash2 size={14} />
                    </button>

                    <div className="flex items-center border border-grave bg-stone">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-2 py-1 text-ash hover:text-bone min-h-[36px]"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="font-mono text-xs px-2 font-bold text-bone">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-2 py-1 text-ash hover:text-bone min-h-[36px]"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Area */}
          {items.length > 0 && (
            <div className="p-6 border-t border-grave space-y-4 bg-coal">
              
              {/* Promo Code Input */}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ash" />
                  <input
                    type="text"
                    value={inputPromo}
                    onChange={(e) => setInputPromo(e.target.value)}
                    placeholder={t('promoPlaceholder')}
                    className="w-full bg-stone border border-grave text-bone pl-9 pr-3 py-2 font-mono text-xs uppercase focus:border-gold outline-none min-h-[44px]"
                  />
                </div>
                <button
                  onClick={handleApplyPromo}
                  className="btn-ghost px-4 text-xs min-h-[44px]"
                >
                  {t('applyPromo')}
                </button>
              </div>

              {promoCode && (
                <div className="font-mono text-xs text-gold flex justify-between items-center bg-stone p-2 border border-gold/30">
                  <span>COUPON APPLIED: {promoCode}</span>
                  <span>-10%</span>
                </div>
              )}

              {/* Subtotal & Totals */}
              <div className="space-y-1.5 font-mono text-xs pt-2">
                <div className="flex justify-between text-ash">
                  <span>{t('subtotal')}</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-gold">
                    <span>{t('discount')}</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-bone text-sm font-bold pt-2 border-t border-grave">
                  <span>TOTAL</span>
                  <span className="text-gold">{formatPrice(total)}</span>
                </div>
                <p className="text-[10px] text-ash">{t('freeShippingNotice')}</p>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={handleProceedCheckout}
                className="btn-primary w-full py-4 text-xs font-mono font-bold tracking-widest flex items-center justify-center gap-2"
              >
                <span>{t('checkoutBtn')}</span>
                <ArrowIcon size={16} />
              </button>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
