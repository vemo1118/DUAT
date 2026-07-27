import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import { GOVERNORATES } from '../data/products';
import { SunDisc } from '../components/SunDisc';
import { CreditCard, Banknote, Smartphone, ArrowRight, ArrowLeft, Copy, Check } from 'lucide-react';

export const CheckoutView = ({ setView }) => {
  const { cartItems, subtotal, discountAmount, clearCart } = useCart();
  const { lang, t, formatPrice } = useLanguage();
  const { showToast } = useToast();

  const isRtl = lang === 'ar';
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    cityId: 'alex'
  });

  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderRef, setOrderRef] = useState('');
  const [copiedInsta, setCopiedInsta] = useState(false);

  // Dynamic shipping calculation based on governorate selection
  const selectedGov = GOVERNORATES.find(g => g.id === formData.cityId) || GOVERNORATES[0];
  const netSubtotal = Math.max(0, subtotal - discountAmount);
  const shippingCost = netSubtotal >= 800 ? 0 : selectedGov.fee;
  const total = netSubtotal + shippingCost;

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCopyInstaPay = () => {
    navigator.clipboard.writeText('wearduat@instapay');
    setCopiedInsta(true);
    showToast(t('instaCopiedToast'), 'success');
    setTimeout(() => setCopiedInsta(false), 2000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.address) return;

    setIsSubmitting(true);
    const newRef = `DUAT-${Math.floor(1000 + Math.random() * 9000)}`;

    setTimeout(() => {
      setIsSubmitting(false);
      setOrderRef(newRef);
      clearCart();
    }, 1200);
  };

  // SUCCESS CONFIRMATION STATE
  if (orderRef) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center space-y-8 min-h-screen flex flex-col items-center justify-center">
        <SunDisc size={80} variant="gold" className="animate-bounce" />

        <div className="space-y-3">
          <h1 className="font-archivo text-4xl sm:text-5xl uppercase text-bone">
            {t('orderSuccessTitle')}
          </h1>
          <p className="font-space text-lg text-bone/80 max-w-md mx-auto leading-relaxed">
            {t('orderSuccessDesc')}
          </p>
        </div>

        <div className="p-6 bg-stone border border-grave w-full max-w-md text-left font-mono text-xs space-y-3 shadow-xl">
          <div className="flex justify-between text-ash border-b border-grave pb-2">
            <span>{t('orderNumberLabel')}</span>
            <span className="text-gold font-bold text-sm">{orderRef}</span>
          </div>
          <div className="flex justify-between text-ash">
            <span>STATUS:</span>
            <span className="text-gold font-bold">CONFIRMED</span>
          </div>
          <div className="flex justify-between text-ash">
            <span>LOCATION:</span>
            <span className="text-bone">{lang === 'ar' ? selectedGov.nameAr : selectedGov.nameEn}</span>
          </div>
          <div className="flex justify-between text-ash">
            <span>CONTACT:</span>
            <span className="text-bone">{formData.phone || '+20 100 000 0000'}</span>
          </div>
        </div>

        <button
          onClick={() => {
            setOrderRef('');
            setView('shop');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="btn-primary py-4 px-8 text-sm flex items-center gap-3"
        >
          <span>{t('backToShop')}</span>
          <ArrowIcon size={16} />
        </button>
      </div>
    );
  }

  // EMPTY CART GUARD
  if (cartItems.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center space-y-6">
        <SunDisc size={64} variant="eclipse" />
        <h2 className="font-archivo text-3xl uppercase text-bone">{t('cartEmpty')}</h2>
        <button
          onClick={() => setView('shop')}
          className="btn-primary py-3 px-6 text-xs"
        >
          {t('backToShop')}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 min-h-screen">
      
      {/* Header */}
      <div className="space-y-3 border-b border-grave pb-6">
        <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.25em] text-ash">
          <SunDisc size={14} />
          <span>{t('checkoutEyebrow')}</span>
        </div>
        <h1 className="font-archivo text-4xl sm:text-5xl uppercase text-bone">
          {t('checkoutTitle')}
        </h1>
      </div>

      {/* Two-Column Form Layout */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* LEFT COLUMN: Shipping Form & Payment Selection */}
        <div className="lg:col-span-7 space-y-10">
          
          {/* Shipping Form */}
          <div className="space-y-6 bg-stone border border-grave p-6 sm:p-8">
            <h2 className="font-archivo text-xl uppercase text-bone border-b border-grave pb-4">
              {t('shippingInfo')}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="font-mono text-xs uppercase tracking-wider text-ash block mb-2">
                  {t('fullName')} *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={t('fullNamePlaceholder')}
                  className="w-full bg-coal border border-grave text-bone p-3.5 text-sm font-space focus:border-gold focus:outline-none"
                />
              </div>

              <div>
                <label className="font-mono text-xs uppercase tracking-wider text-ash block mb-2">
                  {t('phone')} *
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder={t('phonePlaceholder')}
                  className="w-full bg-coal border border-grave text-bone p-3.5 text-sm font-mono focus:border-gold focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-mono text-xs uppercase tracking-wider text-ash block mb-2">
                    {t('address')} *
                  </label>
                  <input
                    type="text"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleChange}
                    placeholder={t('addressPlaceholder')}
                    className="w-full bg-coal border border-grave text-bone p-3.5 text-sm font-space focus:border-gold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-mono text-xs uppercase tracking-wider text-ash block mb-2">
                    {t('city')} *
                  </label>
                  <select
                    name="cityId"
                    value={formData.cityId}
                    onChange={handleChange}
                    className="w-full bg-coal border border-grave text-bone p-3.5 text-sm font-mono focus:border-gold focus:outline-none cursor-pointer"
                  >
                    {GOVERNORATES.map((gov) => (
                      <option key={gov.id} value={gov.id} className="bg-coal text-bone">
                        {lang === 'ar' ? gov.nameAr : gov.nameEn} ({formatPrice(gov.fee)})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method Cards */}
          <div className="space-y-6 bg-stone border border-grave p-6 sm:p-8">
            <h2 className="font-archivo text-xl uppercase text-bone border-b border-grave pb-4">
              {t('paymentMethod')}
            </h2>

            <div className="space-y-4">
              {[
                { id: 'cod', title: t('payCod'), desc: t('payCodDesc'), icon: Banknote },
                { id: 'card', title: t('payCard'), desc: t('payCardDesc'), icon: CreditCard },
                { id: 'instapay', title: t('payInstaPay'), desc: t('payInstaPayDesc'), icon: Smartphone }
              ].map((method) => {
                const Icon = method.icon;
                const isSelected = paymentMethod === method.id;
                return (
                  <div key={method.id} className="space-y-3">
                    <label
                      onClick={() => setPaymentMethod(method.id)}
                      className={`flex items-start gap-4 p-4 border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-gold bg-coal'
                          : 'border-grave bg-coal/40 hover:border-ash'
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        checked={isSelected}
                        onChange={() => setPaymentMethod(method.id)}
                        className="mt-1 accent-gold"
                      />
                      <Icon size={22} className={isSelected ? 'text-gold' : 'text-ash'} />
                      <div className="flex-1">
                        <span className="font-space font-bold text-bone text-sm block">
                          {method.title}
                        </span>
                        <span className="font-mono text-xs text-ash block mt-0.5">
                          {method.desc}
                        </span>
                      </div>
                    </label>

                    {/* InstaPay Copy Button Sub-panel */}
                    {method.id === 'instapay' && isSelected && (
                      <div className="p-4 bg-void border border-gold/40 flex flex-col sm:flex-row justify-between items-center gap-3">
                        <span className="font-mono text-xs text-gold font-bold">
                          HANDLE: wearduat@instapay
                        </span>
                        <button
                          type="button"
                          onClick={handleCopyInstaPay}
                          className="btn-ghost py-2 px-4 text-xs font-mono flex items-center gap-2"
                        >
                          {copiedInsta ? <Check size={14} /> : <Copy size={14} />}
                          <span>{t('copyInstaPay')}</span>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Sticky Order Summary */}
        <div className="lg:col-span-5 bg-stone border border-grave p-6 sm:p-8 space-y-6 lg:sticky lg:top-28">
          <h2 className="font-archivo text-xl uppercase text-bone border-b border-grave pb-4">
            {t('orderSummary')}
          </h2>

          {/* Line items */}
          <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
            {cartItems.map((item) => (
              <div key={item.cartItemId} className="flex justify-between items-center text-sm font-space">
                <div>
                  <span className="text-bone font-medium">
                    {lang === 'ar' ? item.nameAr : item.nameEn}
                  </span>
                  <span className="text-ash font-mono text-xs block">
                    {item.quantity} × {formatPrice(item.price)}
                  </span>
                </div>
                <span className="font-mono text-gold font-bold">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="space-y-3 font-mono text-xs uppercase tracking-wider text-ash border-t border-grave pt-4">
            <div className="flex justify-between">
              <span>{t('subtotal')}</span>
              <span className="text-bone font-bold text-sm">{formatPrice(subtotal)}</span>
            </div>

            {discountAmount > 0 && (
              <div className="flex justify-between text-gold">
                <span>{t('discount')}</span>
                <span className="font-bold">-{formatPrice(discountAmount)}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span>{t('shipping')} ({lang === 'ar' ? selectedGov.nameAr : selectedGov.nameEn})</span>
              <span className="text-gold font-bold">
                {shippingCost === 0 ? t('freeShipping') : formatPrice(shippingCost)}
              </span>
            </div>
          </div>

          {/* Total Display */}
          <div className="border-t border-grave pt-4 flex justify-between items-baseline">
            <span className="font-archivo text-lg uppercase text-bone">TOTAL</span>
            <span className="font-mono text-2xl font-bold text-gold">
              {formatPrice(total)}
            </span>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full btn-primary py-4 text-sm font-mono tracking-widest flex items-center justify-center gap-2 group"
          >
            <span>{isSubmitting ? t('placingOrder') : t('placeOrder')}</span>
            <ArrowIcon size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

      </form>
    </div>
  );
};
