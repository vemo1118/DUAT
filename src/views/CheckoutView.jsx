import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { useOrders } from '../context/OrdersContext';
import { supabase } from '../lib/supabase';
import { SunDisc } from '../components/SunDisc';
import { GOVERNORATES } from '../data/products';
import { ShieldCheck, Truck, CreditCard, Copy, Check, ArrowRight, ArrowLeft, ExternalLink, Upload, AlertCircle } from 'lucide-react';

import { sendTelegramOrderNotification, generateSequentialOrderRef } from '../utils/orderNotifier';

const EGYPTIAN_PHONE_REGEX = /^01[0125][0-9]{8}$/;

export const CheckoutView = ({ setView }) => {
  const { lang, t, formatPrice } = useLanguage();
  const { cartItems, subtotal, discount, clearCart } = useCart();
  const { showToast } = useToast();
  const { addOrder, orders } = useOrders();
  const isRtl = lang === 'ar';
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [address, setAddress] = useState('');
  const [governorate, setGovernorate] = useState(GOVERNORATES[0]);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [paymentProofFile, setPaymentProofFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderReference, setOrderReference] = useState(null);

  // Free shipping threshold >= 800 EGP
  const isFreeShipping = subtotal >= 800;
  const shippingFee = isFreeShipping ? 0 : (governorate ? governorate.fee : 110);
  const finalTotal = Math.max(0, subtotal - discount + shippingFee);

  const handleCopyInstaPay = () => {
    navigator.clipboard.writeText('moataz_m25@instapay');
    showToast(isRtl ? 'تم نسخ عنوان إنستاباي بنجاح!' : 'InstaPay handle copied!', 'info');
  };

  const handlePhoneChange = (e) => {
    const val = e.target.value;
    setPhone(val);
    if (val.trim() && !EGYPTIAN_PHONE_REGEX.test(val.trim())) {
      setPhoneError(isRtl ? 'اكتب رقم موبايل مصري صحيح (١١ رقم يبدأ بـ 010 أو 011 أو 012 أو 015)' : 'Enter a valid Egyptian mobile number (11 digits starting with 010, 011, 012, or 015)');
    } else {
      setPhoneError('');
    }
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (!fullName || !phone || !address) {
      showToast(isRtl ? 'يرجى إكمال جميع الحقول المطلوبة' : 'Please complete all required fields', 'error');
      return;
    }

    if (!EGYPTIAN_PHONE_REGEX.test(phone.trim())) {
      setPhoneError(isRtl ? 'اكتب رقم موبايل مصري صحيح' : 'Enter a valid Egyptian mobile number');
      showToast(isRtl ? 'اكتب رقم موبايل مصري صحيح' : 'Enter a valid Egyptian mobile number', 'error');
      return;
    }

    let uploadedPath = null;
    if (paymentMethod === 'instapay') {
      if (!paymentProofFile) {
        showToast(isRtl ? 'يرجى رفع اسكرين شوت التحويل عبر إنستاباي لتأكيد الطلب' : 'Please upload payment screenshot to confirm InstaPay order', 'error');
        return;
      }

      setIsSubmitting(true);
      try {
        const fileExt = paymentProofFile.name.split('.').pop() || 'png';
        const tempRef = `DUAT-${Math.floor(1000 + Math.random() * 9000)}`;
        const filePath = `orders/${tempRef}-${crypto.randomUUID()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage.from('payment-proofs').upload(filePath, paymentProofFile);
        if (uploadError) {
          console.error('Failed to upload payment proof to Supabase Storage:', uploadError);
          showToast(isRtl ? 'فشل رفع صورة التحويل. يرجى إيقاف مانع الإعلانات أو إعادة المحاولة.' : 'Failed to upload screenshot. Please retry.', 'error');
          setIsSubmitting(false);
          return;
        }
        uploadedPath = filePath;
      } catch (uploadErr) {
        console.error('Storage upload exception:', uploadErr);
        showToast(isRtl ? 'حدث خطأ أثناء رفع الصورة' : 'Error uploading payment screenshot', 'error');
        setIsSubmitting(false);
        return;
      }
    } else {
      setIsSubmitting(true);
    }

    const ref = await generateSequentialOrderRef(orders);
    const orderData = {
      id: ref,
      ref: ref,
      customer: { name: fullName, fullName, phone: phone.trim(), address, governorate },
      items: cartItems,
      total: finalTotal,
      paymentMethod: paymentMethod,
      payment_method: paymentMethod,
      payment_proof_path: uploadedPath,
      paymentProofPath: uploadedPath,
      status: 'placed',
      createdAt: new Date().toISOString()
    };

    // Guarantee Telegram Notification fires instantly to store owner's mobile phone
    try {
      sendTelegramOrderNotification(orderData);
    } catch (notifErr) {
      console.error('Notification dispatch exception:', notifErr);
    }

    try {
      await addOrder(orderData);
    } catch (err) {
      console.error('Error adding order to database:', err);
    }

    try {
      const LOCAL_TRACKING_KEY = 'duat_customer_orders';
      const existing = JSON.parse(localStorage.getItem(LOCAL_TRACKING_KEY) || '[]');
      const updatedList = [orderData, ...existing.filter((item) => item.ref !== ref && item.id !== ref)];
      localStorage.setItem(LOCAL_TRACKING_KEY, JSON.stringify(updatedList));
      localStorage.setItem('duat_latest_order_ref', ref);
    } catch (err) {
      console.error('Failed to save order to localStorage:', err);
    }

    setOrderReference(ref);
    setIsSubmitting(false);
    clearCart();
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

      {/* Free Shipping Notification Banner */}
      <div className={`p-4 border font-mono text-xs flex items-center justify-between gap-4 ${isFreeShipping ? 'bg-gold/15 border-gold text-gold font-bold' : 'bg-stone border-grave text-bone'}`}>
        <span>
          {isFreeShipping
            ? (isRtl ? '🎉 مبروك! حصلت على شحن مجاني لكافة المحافظات' : '🎉 Congratulations! You unlocked Free Shipping across Egypt')
            : (isRtl ? `شحن مجاني فوق ٨٠٠ ج (أضف ${800 - subtotal} ج للحصول عليه)` : `Free shipping over 800 EGP (Add ${800 - subtotal} EGP to qualify)`)}
        </span>
        <span className="uppercase text-[10px] tracking-widest opacity-80">{isFreeShipping ? (isRtl ? 'شحن مجاني' : 'FREE SHIPPING') : '800 EGP GOAL'}</span>
      </div>

      {/* Form Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Customer Details Form */}
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
                    onChange={handlePhoneChange}
                    placeholder="01000000000"
                    className={`w-full bg-coal border text-bone p-3 focus:outline-none min-h-[44px] ${phoneError ? 'border-red-500' : 'border-grave focus:border-gold'}`}
                  />
                  {phoneError && (
                    <span className="text-red-400 font-mono text-[11px] mt-1 block flex items-center gap-1">
                      <AlertCircle size={12} />
                      {phoneError}
                    </span>
                  )}
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
                        {isRtl ? gov.nameAr : gov.nameEn} ({isFreeShipping ? (isRtl ? 'شحن مجاني' : 'Free Shipping') : `+${gov.fee} EGP`})
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

          {/* Payment Method Selector (COD & InstaPay ONLY) */}
          <div className="bg-stone border border-grave p-6 space-y-6">
            <h3 className="font-mono text-xs uppercase tracking-widest text-gold font-bold flex items-center gap-2 border-b border-grave pb-3">
              <CreditCard size={16} />
              <span>{t('paymentMethod')}</span>
            </h3>

            <div className="space-y-3 font-space text-sm">
              {[
                { id: 'cod', title: isRtl ? 'الدفع عند الاستلام (COD)' : 'Cash on Delivery (COD)', desc: isRtl ? 'ادفع نقداً عند استلام الشحنة من المندوب.' : 'Pay cash to the delivery courier.' },
                { id: 'instapay', title: isRtl ? 'الدفع السريع عبر إنستاباي (InstaPay)' : 'InstaPay Direct Payment', desc: isRtl ? 'تحويل سريع عبر تطبيق إنستاباي وإرفاق اسكرين شوت.' : 'Instant transfer via InstaPay app + attach screenshot.' }
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

            {/* InstaPay Flow with Direct Payment Link + Required Screenshot Upload */}
            {paymentMethod === 'instapay' && (
              <div className="p-5 bg-coal border border-gold/50 space-y-4 font-mono text-xs">
                <div className="flex items-center justify-between gap-4 border-b border-grave/60 pb-3">
                  <div>
                    <span className="text-ash block text-[10px] uppercase">INSTAPAY HANDLE:</span>
                    <span className="text-gold font-bold text-sm">moataz_m25@instapay</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyInstaPay}
                    className="btn-ghost py-2 px-3 text-[11px] flex items-center gap-1.5 min-h-[44px]"
                  >
                    <Copy size={13} />
                    <span>{isRtl ? 'نسخ العنوان' : 'Copy Handle'}</span>
                  </button>
                </div>

                {/* Direct Pay Link Button */}
                <a
                  href="https://ipn.eg/S/moataz_m25/instapay/4lLo7o"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-4 bg-gradient-to-r from-amber-500 to-gold text-void font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 text-center rounded shadow-lg hover:brightness-110 transition-all min-h-[48px]"
                >
                  <span>{isRtl ? 'ادفع عبر إنستاباي' : 'Pay via InstaPay'}</span>
                  <ExternalLink size={15} />
                </a>

                {/* Instructions */}
                <div className="p-3 bg-stone border border-grave text-bone/90 leading-relaxed text-[11px] space-y-1">
                  <p className="font-bold text-gold">
                    {isRtl
                      ? '١) اضغط ادفع عبر إنستاباي وحوّل قيمة الأوردر.'
                      : '1) Pay the order total via InstaPay.'}
                  </p>
                  <p className="font-bold text-gold">
                    {isRtl
                      ? '٢) ارفع اسكرين شوت التحويل هنا لتأكيد الطلب.'
                      : '2) Upload the payment screenshot here to confirm.'}
                  </p>
                </div>

                {/* Screenshot Upload Input (Required) */}
                <div className="space-y-1.5 pt-1">
                  <label className="block text-xs font-mono uppercase text-gold font-bold flex items-center gap-1.5">
                    <Upload size={14} />
                    <span>{isRtl ? 'ارفع اسكرين شوت التحويل (مطلوب) *' : 'Upload Payment Screenshot (Required) *'}</span>
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    required={paymentMethod === 'instapay'}
                    onChange={(e) => setPaymentProofFile(e.target.files[0] || null)}
                    className="w-full bg-stone border border-gold/50 text-bone p-2.5 font-mono text-xs focus:border-gold outline-none file:mr-4 file:py-2 file:px-4 file:border-0 file:text-xs file:font-mono file:bg-gold file:text-void hover:file:bg-gold/80 cursor-pointer"
                  />
                  {paymentProofFile && (
                    <span className="text-xs font-mono text-gold block font-bold mt-1">
                      ✓ {paymentProofFile.name} ({(paymentProofFile.size / 1024).toFixed(1)} KB)
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting || cartItems.length === 0 || !!phoneError}
            className="w-full btn-primary py-4 text-sm font-mono tracking-widest flex items-center justify-center gap-3 disabled:opacity-50 min-h-[48px]"
          >
            <span>{isSubmitting ? (isRtl ? 'جاري تنفيذ الطلب...' : 'Placing Order...') : t('placeOrder')}</span>
            <ArrowIcon size={16} />
          </button>

        </form>

        {/* Right Column: Summary Stack */}
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
              <span>{t('shipping')} ({isRtl ? governorate.nameAr : governorate.nameEn})</span>
              <span className={isFreeShipping ? "text-gold font-bold" : "text-bone"}>
                {isFreeShipping ? (isRtl ? 'مجاني' : 'FREE') : formatPrice(shippingFee)}
              </span>
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

export default CheckoutView;
