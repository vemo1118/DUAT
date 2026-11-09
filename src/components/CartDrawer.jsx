import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { X, Trash2, Plus, Minus, ArrowLeft, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { useCheckoutSettings } from '../context/CheckoutSettingsContext';
import { useToast } from '../context/ToastContext';
import { CustomStickerThumbnail } from './CustomStickerThumbnail';
import { checkoutMessage, PRICING, ORDER_LIMITS } from '../domain/commerce';

export function CartDrawer() {
  const { items, isOpen, toggleCart, removeFromCart, updateQuantity, subtotal, discount, total, promoCode, applyPromoCode, pricing, checkoutIssue } = useCart();
  const { lang, t, formatPrice } = useLanguage();
  const { settings } = useCheckoutSettings();
  const { showToast } = useToast();
  const navigate = useNavigate(), panel = useRef(null);
  const [inputPromo, setInputPromo] = useState(''), [applying, setApplying] = useState(false);
  const isAr = lang === 'ar', Arrow = isAr ? ArrowLeft : ArrowRight;
  useEffect(() => {
    if (!isOpen) return;
    const previous = document.activeElement, overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    panel.current?.querySelector('button')?.focus();
    const keydown = event => {
      if (event.key === 'Escape') toggleCart();
      if (event.key === 'Tab') {
        const nodes = [...panel.current.querySelectorAll('button:not([disabled]),a[href],input,summary')].filter(n => n.getClientRects().length);
        const first = nodes[0], last = nodes.at(-1);
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
    };
    document.addEventListener('keydown', keydown);
    return () => { document.body.style.overflow = overflow; document.removeEventListener('keydown', keydown); previous?.focus?.(); };
  }, [isOpen]);
  if (!isOpen) return null;
  const issue = !settings.enabled ? 'CHECKOUT_PAUSED' : checkoutIssue;
  const proceed = () => {
    if (issue) { showToast(checkoutMessage(issue, isAr), 'info'); return; }
    toggleCart(); navigate('/checkout');
  };
  return ReactDOM.createPortal(<div className="fixed inset-0 z-[9999] text-bone" dir={isAr ? 'rtl' : 'ltr'}>
    <div className="absolute inset-0 bg-black/65" onClick={toggleCart}/>
    <div ref={panel} role="dialog" aria-modal="true" aria-labelledby="cart-heading" className="absolute inset-y-0 end-0 w-full max-w-md bg-stone border-s border-grave flex flex-col h-[100dvh] shadow-xl">
      <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-grave shrink-0">
        <h2 id="cart-heading" className="font-bold text-lg flex items-center gap-2"><ShoppingBag size={20} className="text-gold"/>{isAr ? 'سلة طلبك' : 'Your cart'} <span className="text-ash text-sm">({items.reduce((n, i) => n + i.quantity, 0)})</span></h2>
        <button type="button" aria-label={isAr ? 'إغلاق السلة' : 'Close cart'} onClick={toggleCart} className="w-11 h-11 flex items-center justify-center rounded-lg border border-grave"><X size={20}/></button>
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-4 space-y-4" data-cart-scroll>
        {!items.length ? <div className="py-14 text-center space-y-5"><ShoppingBag size={36} className="mx-auto text-ash"/><p>{t('cartEmpty')}</p><button type="button" className="btn-primary p-3 w-full rounded-lg" onClick={() => { toggleCart(); navigate('/stickers'); }}>{isAr ? 'شوف الاستيكرات' : 'Browse stickers'}</button></div> : <>
          {pricing.customQuantity > 0 && <div className="text-sm bg-gold/10 border border-gold/30 rounded-lg p-3 leading-6"><p>{isAr ? `كستمايز: ${pricing.customQuantity} قطعة × 45 جنيه` : `Custom: ${pricing.customQuantity} × EGP 45`}</p>{checkoutIssue && <p>{checkoutMessage(checkoutIssue, isAr)}</p>}<button type="button" className="underline text-gold min-h-11" onClick={() => { toggleCart(); navigate('/sticker-builder'); }}>{isAr ? 'صمّم قطعة تانية' : 'Design another piece'}</button></div>}
          {pricing.stockQuantity > 0 && <p className="text-xs text-ash leading-6">{pricing.stockQuantity >= PRICING.stockMinimum ? (isAr ? 'الجاهز اتحسب بـ50 جنيه للقطعة.' : 'Ready-made pieces are EGP 50 each.') : (isAr ? `زوّد ${PRICING.stockMinimum - pricing.stockQuantity} من الجاهز عشان القطعة تتحسب بـ50 جنيه.` : `Add ${PRICING.stockMinimum - pricing.stockQuantity} ready-made pieces for EGP 50 each.`)}</p>}
          <div className="space-y-3">{items.map(item => <div key={item.cartItemId || item.id} className="bg-coal border border-grave rounded-xl p-3 flex gap-3 items-start" data-cart-item>
            <div className="w-16 h-16 shrink-0 rounded-lg bg-stone border border-grave p-1 flex items-center justify-center overflow-hidden"><CustomStickerThumbnail item={item}/></div>
            <div className="flex-1 min-w-0 space-y-2">
              <div className="flex items-start gap-2 justify-between"><h3 className="text-sm font-bold break-words min-w-0">{isAr ? item.nameAr : item.nameEn}</h3><button type="button" aria-label={`${isAr ? 'احذف' : 'Remove'} ${isAr ? item.nameAr : item.nameEn}`} onClick={() => removeFromCart(item.cartItemId || item.id)} className="shrink-0 w-11 h-11 -mt-2 -me-2 flex items-center justify-center text-ash"><Trash2 size={16}/></button></div>
              <p className="text-xs text-ash">{formatPrice(item.price)} {isAr ? 'للقطعة' : 'each'}</p>
              <div className="flex flex-wrap items-center justify-between gap-2"><div className="flex items-center border border-grave rounded-lg bg-stone"><button type="button" aria-label={isAr ? 'تقليل العدد' : 'Decrease quantity'} onClick={() => updateQuantity(item.cartItemId || item.id, item.quantity - 1)} className="w-11 h-11 flex items-center justify-center"><Minus size={14}/></button><span className="min-w-6 text-center text-sm">{item.quantity}</span><button type="button" aria-label={isAr ? 'زيادة العدد' : 'Increase quantity'} disabled={item.quantity >= ORDER_LIMITS.quantityPerLine} onClick={() => updateQuantity(item.cartItemId || item.id, item.quantity + 1)} className="w-11 h-11 flex items-center justify-center disabled:opacity-40"><Plus size={14}/></button></div><strong className="text-sm text-gold whitespace-nowrap">{formatPrice(item.price * item.quantity)}</strong></div>
            </div>
          </div>)}</div>
          <details className="border-t border-grave pt-2"><summary className="min-h-11 flex items-center cursor-pointer text-sm text-ash">{isAr ? 'عندك كود خصم؟' : 'Have a discount code?'}</summary><div className="flex gap-2 pt-2"><input value={inputPromo} onChange={e => setInputPromo(e.target.value)} aria-label={isAr ? 'كود الخصم' : 'Discount code'} className="min-w-0 flex-1 bg-coal border border-grave rounded-lg px-3 text-base min-h-11"/><button type="button" disabled={applying} className="btn-ghost px-3 min-h-11 rounded-lg" onClick={async () => { if (!inputPromo.trim()) return; setApplying(true); const ok = await applyPromoCode(inputPromo.trim()); showToast(ok ? t('promoSuccessToast') : t('promoInvalidToast'), ok ? 'success' : 'error'); setApplying(false); }}>{applying ? '…' : t('applyPromo')}</button></div></details>
          {promoCode && <p className="text-sm text-gold">{promoCode}: −{formatPrice(discount)}</p>}
          <div className="text-xs text-ash leading-6">{settings.shippingMode === 'later' ? settings[isAr ? 'shippingLaterAr' : 'shippingLaterEn'] : settings.freeShippingThreshold > 0 ? (subtotal >= settings.freeShippingThreshold ? (isAr ? 'الشحن مجاني للطلب ده.' : 'Shipping is free for this order.') : (isAr ? `الشحن بيتحسب حسب المحافظة. شحن مجاني من ${settings.freeShippingThreshold} جنيه.` : `Shipping is calculated by governorate. Free shipping from EGP ${settings.freeShippingThreshold}.`)) : (isAr ? 'الشحن بيتحسب حسب المحافظة في صفحة الطلب.' : 'Shipping is calculated by governorate at checkout.')}</div>
        </>}
      </div>
      {!!items.length && <div className="shrink-0 border-t border-grave p-4 bg-stone space-y-3" style={{ paddingBottom: 'max(16px, env(safe-area-inset-bottom))' }} data-cart-footer>
        {discount > 0 && <p className="flex justify-between text-xs text-ash"><span>{isAr ? 'قبل الخصم' : 'Before discount'}</span><span>{formatPrice(subtotal)}</span></p>}
        <div className="flex items-center justify-between gap-3"><div><strong className="text-sm">{isAr ? 'إجمالي المنتجات' : 'Items total'}</strong><p className="text-xs text-ash mt-1">{isAr ? 'قبل الشحن' : 'Before shipping'}</p></div><strong className="text-xl text-gold">{formatPrice(total)}</strong></div>
        <button type="button" onClick={proceed} disabled={!!issue} className="btn-primary w-full rounded-lg min-h-12 p-3 text-sm font-bold flex items-center justify-center gap-3 disabled:opacity-50">{t('checkoutBtn')}<Arrow size={17}/></button>
        {issue && <p className="text-xs text-gold leading-5">{checkoutMessage(issue, isAr)}</p>}
      </div>}
    </div>
  </div>, document.body);
}
export default CartDrawer;
