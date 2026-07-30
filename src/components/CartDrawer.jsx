import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import { useTheme } from '../context/ThemeContext';
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
  const { theme } = useTheme();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [inputPromo, setInputPromo] = useState('');
  const isRtl = lang === 'ar';
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const cartList = items || [];
  const calculatedTotal = total ?? Math.max(0, (subtotal || 0) - (discount || 0));

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

  const isDawn = theme === 'dawn';

  const drawerContent = (
    <div className="fixed inset-0 z-[9999] overflow-hidden" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Dimmed Dark Backdrop Overlay */}
      <div
        onClick={toggleCart}
        className="fixed inset-0 bg-[#000000]/80 backdrop-blur-sm animate-drawer-fade z-[9999]"
      />

      {/* Slide-out Panel Positioning */}
      <div className={`fixed inset-y-0 ${isRtl ? 'left-0' : 'right-0'} w-full max-w-md z-[10000] flex flex-col`}>
        
        {/* 100% Solid Opaque Drawer Surface — No Overlap or Bleed-Through */}
        <div className={`w-full h-full ${isDawn ? 'bg-[#EFEAE0] text-[#1A1714] border-[#DCD4C7]' : 'bg-[#14110F] text-[#F0EBE0] border-[#2E2823]'} border-x shadow-[0_0_60px_rgba(0,0,0,0.95)] flex flex-col relative z-[10001] overflow-hidden animate-drawer-slide`}>
          
          {/* Header Row — Fixed & Completely Above Page/Nav */}
          <div className={`p-6 ${isDawn ? 'bg-[#E5DFC5] border-[#DCD4C7]' : 'bg-[#1F1B17] border-[#2E2823]'} border-b flex items-center justify-between flex-shrink-0`}>
            <div className="flex items-center gap-3">
              <ShoppingBag size={22} className="text-[#E0A93B]" />
              <h2 className="font-clash text-xl uppercase tracking-wider font-bold">
                {t('cartTitle')} ({cartList.reduce((sum, item) => sum + item.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={toggleCart}
              className={`p-2.5 transition-colors border ${isDawn ? 'bg-[#EFEAE0] border-[#DCD4C7] text-[#524C44] hover:text-[#E0A93B]' : 'bg-[#14110F] border-[#2E2823] text-[#8E877D] hover:text-[#E0A93B]'} min-h-[44px] min-w-[44px] flex items-center justify-center`}
              aria-label="Close cart"
            >
              <X size={20} />
            </button>
          </div>

          {/* Body — Scrollable Items List or Empty State */}
          <div className={`flex-1 overflow-y-auto p-6 space-y-4 ${isDawn ? 'bg-[#EFEAE0]' : 'bg-[#14110F]'}`}>
            {cartList.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-16">
                <div className={`w-16 h-16 rounded-full ${isDawn ? 'bg-[#E5DFC5] border-[#DCD4C7]' : 'bg-[#1F1B17] border-[#2E2823]'} border flex items-center justify-center text-[#E0A93B]`}>
                  <ShoppingBag size={32} />
                </div>
                <p className="font-space text-sm font-medium text-ash max-w-xs leading-relaxed">
                  {t('cartEmpty')}
                </p>
                <button
                  onClick={() => {
                    toggleCart();
                    navigate('/shop');
                  }}
                  className="btn-primary py-3 px-6 text-xs font-mono font-bold uppercase tracking-wider"
                >
                  {t('heroCtaSecondary')}
                </button>
              </div>
            ) : (
              cartList.map((item) => (
                <div
                  key={item.cartItemId || item.id}
                  className={`p-4 border ${isDawn ? 'bg-[#E5DFC5] border-[#DCD4C7]' : 'bg-[#1F1B17] border-[#2E2823]'} flex gap-4 justify-between items-start card-depth-highlight`}
                >
                  <div className="flex-1 space-y-1">
                    <h3 className="font-space font-bold text-sm">
                      {isRtl ? item.nameAr : item.nameEn}
                    </h3>
                    <p className="font-mono text-[10px] uppercase tracking-wider opacity-75">
                      ARMOR: {isRtl ? item.tagAr : item.tagEn}
                    </p>
                    {item.customConfig?.phoneModel && (
                      <p className="font-mono text-[10px] text-[#E0A93B] uppercase font-bold">
                        {item.customConfig.phoneModel}
                      </p>
                    )}
                    <p className="font-mono text-sm text-[#E0A93B] font-bold pt-1">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>

                  <div className="flex flex-col items-end justify-between h-full space-y-3">
                    <button
                      onClick={() => removeFromCart(item.cartItemId || item.id)}
                      className="text-ash hover:text-[#D9432E] transition-colors p-1"
                      title="Remove item"
                    >
                      <Trash2 size={15} />
                    </button>

                    <div className={`flex items-center border ${isDawn ? 'border-[#DCD4C7] bg-[#EFEAE0]' : 'border-[#2E2823] bg-[#14110F]'}`}>
                      <button
                        onClick={() => updateQuantity(item.cartItemId || item.id, item.quantity - 1)}
                        className="px-2.5 py-1 hover:text-[#E0A93B] min-h-[36px] font-bold"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="font-mono text-xs px-2.5 font-bold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.cartItemId || item.id, item.quantity + 1)}
                        className="px-2.5 py-1 hover:text-[#E0A93B] min-h-[36px] font-bold"
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
          {cartList.length > 0 && (
            <div className={`p-6 border-t ${isDawn ? 'bg-[#E5DFC5] border-[#DCD4C7]' : 'bg-[#1F1B17] border-[#2E2823]'} space-y-4 flex-shrink-0`}>
              
              {/* Promo Code Input */}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ash" />
                  <input
                    type="text"
                    value={inputPromo}
                    onChange={(e) => setInputPromo(e.target.value)}
                    placeholder={t('promoPlaceholder')}
                    className={`w-full border ${isDawn ? 'bg-[#EFEAE0] border-[#DCD4C7] text-[#1A1714]' : 'bg-[#14110F] border-[#2E2823] text-[#F0EBE0]'} pl-9 pr-3 py-2 font-mono text-xs uppercase focus:border-[#E0A93B] outline-none min-h-[44px]`}
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
                <div className="font-mono text-xs text-[#E0A93B] flex justify-between items-center p-2.5 border border-[#E0A93B]/30 bg-stone">
                  <span>COUPON APPLIED: {promoCode}</span>
                  <span>-10%</span>
                </div>
              )}

              {/* Free Shipping Progress Bar Nudge */}
              {(() => {
                const target = 1500;
                const needed = Math.max(0, target - subtotal);
                const percent = Math.min(100, (subtotal / target) * 100);
                return (
                  <div className={`p-3 border ${isDawn ? 'bg-[#EFEAE0] border-[#DCD4C7]' : 'bg-[#14110F] border-[#2E2823]'} space-y-2`}>
                    <div className="flex justify-between items-center font-mono text-xs">
                      <span className="font-medium">
                        {needed > 0
                          ? (isRtl ? `أضف ${needed} ج.م للحصول على شحن مجاني` : `Add ${needed} EGP more for FREE shipping`)
                          : (isRtl ? '🎉 حصلت على شحن مجاني لكافة المحافظات!' : '🎉 You unlocked FREE shipping across Egypt!')}
                      </span>
                      <span className="text-[#E0A93B] font-bold">{Math.round(percent)}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#1F1B17] rounded-full overflow-hidden border border-[#2E2823]">
                      <div
                        className="h-full bg-gradient-to-r from-[#E0A93B] via-amber-400 to-[#E0A93B] transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })()}

              {/* Subtotal & Totals */}
              <div className="space-y-1.5 font-mono text-xs pt-2">
                <div className="flex justify-between opacity-80">
                  <span>{t('subtotal')}</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-[#E0A93B] font-bold">
                    <span>{t('discount')}</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}

                <div className={`flex justify-between text-base font-bold pt-2 border-t ${isDawn ? 'border-[#DCD4C7]' : 'border-[#2E2823]'}`}>
                  <span>TOTAL</span>
                  <span className="text-[#E0A93B]">{formatPrice(calculatedTotal)}</span>
                </div>
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

  return ReactDOM.createPortal(drawerContent, document.body);
};

export default CartDrawer;
