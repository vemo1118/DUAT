import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { SunDisc } from '../components/SunDisc';
import { GOVERNORATES } from '../data/products';
import { ShieldCheck, Truck, CreditCard, Copy, Check, ArrowRight, ArrowLeft } from 'lucide-react';

export const CheckoutView = ({ setView }) => {
  const { lang, t, formatPrice } = useLanguage();
  const { cartItems, subtotal, discount, clearCart } = useCart();
  const { showToast } = useToast();
  const isRtl = lang === 'ar';
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [governorate, setGovernorate] = useState(GOVERNORATES[0]);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderReference, setOrderReference] = useState(null);

  const shippingFee = governorate ? governorate.fee : 50;
  const finalTotal = Math.max(0, subtotal - discount + shippingFee);

  const handleCopyInstaPay = () => {
    navigator.clipboard.writeText('wearduat@instapay');
    showToast(t('instaCopiedToast'), 'info');
  };

  const handleSubmitOrder = (e) => {
    e.preventDefault();
    if (!fullName || !phone || !address) {
      showToast(lang === 'ar' ? 'يرجى إكمال جميع البيانات الحقول المطلوبة' : 'Please complete all required fields', 'error');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const ref = `DUAT-${Math.floor(1000 + Math.random() * 9000)}`;
      setOrderReference(ref);
      setIsSubmitting(false);
      clearCart();
    }, 1200);
  };

  if (orderReference) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-8">
        <div className="w-20 h-20 rounded-full bg-stone border-2 border-gold flex items-center justify-center mx-auto shadow-2xl">
          <Check size={40} className="text-gold" />
        </div>

        <div className="space-y-3">
          <span className="font-mono text-xs uppercase tracking-widest text-gold block">
            {t('orderSuccessTitle')}
          </span>
          <h1 className="font-clash text-4xl sm:text-5xl uppercase text-bone tracking-tight">
            PASSAGE CONFIRMED
          </h1>
          <p className="font-space text-base text-bone/80 font-light max-w-lg mx-auto">
            {t('orderSuccessDesc')}
          </p>
        </div>

        <div className="p-6 bg-stone border border-grave space-y-2 font-mono text-sm">
          <span className="text-ash block uppercase text-xs">{t('orderNumberLabel')}</span>
          <span className="font-bold text-2xl text-gold tracking-widest">{orderReference}</span>
        </div>

        <button
          onClick={() => setView('shop')}
          className="btn-primary py-4 px-8 text-xs font-mono tracking-widest"
        >
          {t('backToShop')}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 min-h-screen">
      
      {/* Header */}
      <div className="space-y-2 border-b border-grave pb-6">
        <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-ash">
          <SunDisc size={12} variant="gold" />
          <span>{t('checkoutEyebrow')}</span>
        </div>
        <h1 className="font-clash text-3xl sm:text-5xl uppercase text-bone tracking-tight">
          {t('checkoutTitle')}
        </h1>
      </div>

      {/* Responsive Form Grid (2-Col Desktop -> 1-Col Mobile) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Customer Form */}
        <form onSubmit={handleSubmitOrder} className="lg:col-span-7 space-y-8">
          
          {/* Shipping Details */}
          <div className="bg-stone border border-grave p-6 space-y-6">
            <h3 className="font-mono text-xs uppercase tracking-widest text-gold font-bold flex items-center gap-2 border-b border-grave pb-3">
              <Truck size={16} />
              <span>{t('shippingInfo')}</span>
            </h3>

            <div className="space-y-4 font-space text-sm">
              <div>
                <label className="block text-xs font-mono uppercase text-ash mb-1">
                  {t('fullName')} *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={t('fullNamePlaceholder')}
                  className="w-full bg-coal border border-grave text-bone p-3 focus:border-gold focus:outline-none min-h-[44px]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-ash mb-1">
                    {t('phone')} *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder={t('phonePlaceholder')}
                    className="w-full bg-coal border border-grave text-bone p-3 focus:border-gold focus:outline-none min-h-[44px]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-ash mb-1">
                    {t('city')} *
                  </label>
                  <select
                    value={governorate.id}
                    onChange={(e) => {
                      const found = GOVERNORATES.find(g => g.id === e.target.value);
                      if (found) setGovernorate(found);
                    }}
                    className="w-full bg-coal border border-grave text-bone p-3 focus:border-gold focus:outline-none cursor-pointer font-mono text-xs min-h-[44px]"
                  >
                    {GOVERNORATES.map((gov) => (
                      <option key={gov.id} value={gov.id} className="bg-coal text-bone">
                        {lang === 'ar' ? gov.nameAr : gov.nameEn} (+{gov.fee} EGP)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-ash mb-1">
                  {t('address')} *
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder={t('addressPlaceholder')}
                  className="w-full bg-coal border border-grave text-bone p-3 focus:border-gold focus:outline-none min-h-[44px]"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="bg-stone border border-grave p-6 space-y-6">
            <h3 className="font-mono text-xs uppercase tracking-widest text-gold font-bold flex items-center gap-2 border-b border-grave pb-3">
              <CreditCard size={16} />
              <span>{t('paymentMethod')}</span>
            </h3>

            <div className="space-y-3 font-space text-sm">
              {[
                { id: 'cod', title: t('payCod'), desc: t('payCodDesc') },
                { id: 'instapay', title: t('payInstaPay'), desc: t('payInstaPayDesc') },
                { id: 'card', title: t('payCard'), desc: t('payCardDesc') }
              ].map((method) => {
                const isSelected = paymentMethod === method.id;
                return (
                  <label
                    key={method.id}
                    className={`block p-4 border cursor-pointer transition-all ${
                      isSelected ? 'border-gold bg-coal' : 'border-grave bg-stone/40 hover:border-ash'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="payment"
                        checked={isSelected}
                        onChange={() => setPaymentMethod(method.id)}
                        className="mt-1 accent-gold"
                      />
                      <div className="space-y-1">
                        <span className="font-bold text-bone block">{method.title}</span>
                        <p className="text-xs text-ash font-light">{method.desc}</p>
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>

            {/* InstaPay Copy Handle Box */}
            {paymentMethod === 'instapay' && (
              <div className="p-4 bg-coal border border-gold/40 flex items-center justify-between gap-4 font-mono text-xs">
                <div>
                  <span className="text-ash block text-[10px] uppercase">INSTAPAY HANDLE:</span>
                  <span className="text-gold font-bold">wearduat@instapay</span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyInstaPay}
                  className="btn-ghost py-2 px-3 text-[11px] flex items-center gap-1.5 min-h-[44px]"
                >
                  <Copy size={12} />
                  <span>{t('copyInstaPay')}</span>
                </button>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting || cartItems.length === 0}
            className="w-full btn-primary py-4 text-sm font-mono tracking-widest flex items-center justify-center gap-3 disabled:opacity-50 min-h-[44px]"
          >
            <span>{isSubmitting ? t('placingOrder') : t('placeOrder')}</span>
            <ArrowIcon size={16} />
          </button>

        </form>

        {/* Right Column: Order Summary Stack */}
        <div className="lg:col-span-5 bg-stone border border-grave p-6 space-y-6">
          <h3 className="font-mono text-xs uppercase tracking-widest text-gold font-bold border-b border-grave pb-3">
            {t('orderSummary')} ({cartItems.length})
          </h3>

          <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
            {cartItems.map((item) => (
              <div key={item.cartId} className="flex justify-between items-center py-2 border-b border-grave/40 font-space text-xs">
                <div>
                  <span className="font-bold text-bone block">{item.name}</span>
                  <span className="font-mono text-ash text-[10px]">Qty: {item.quantity}</span>
                </div>
                <span className="font-mono text-gold font-bold">{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>

          <div className="space-y-2 border-t border-grave pt-4 font-mono text-xs">
            <div className="flex justify-between text-ash">
              <span>{t('subtotal')}</span>
              <span className="text-bone">{formatPrice(subtotal)}</span>
            </div>

            {discount > 0 && (
              <div className="flex justify-between text-ember">
                <span>{t('discount')}</span>
                <span>-{formatPrice(discount)}</span>
              </div>
            )}

            <div className="flex justify-between text-ash">
              <span>{t('shipping')} ({lang === 'ar' ? governorate.nameAr : governorate.nameEn})</span>
              <span className="text-bone">{formatPrice(shippingFee)}</span>
            </div>

            <div className="flex justify-between items-center text-sm font-bold border-t border-grave pt-3 text-gold">
              <span>TOTAL</span>
              <span className="text-base">{formatPrice(finalTotal)}</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
