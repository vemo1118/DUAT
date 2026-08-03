import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useOrders } from '../context/OrdersContext';
import { supabase } from '../lib/supabase';
import { SunDisc } from '../components/SunDisc';
import { Search, CheckCircle, Clock, Truck, ShieldCheck, Loader2 } from 'lucide-react';

export const OrderTrackerView = () => {
  const { lang, t } = useLanguage();
  const { getOrderByCode } = useOrders();
  const [orderId, setOrderId] = useState('');
  const [trackedResult, setTrackedResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const statusToStep = (status) => {
    switch (status) {
      case 'placed': return 0;
      case 'forge': return 1;
      case 'shipped': return 2;
      case 'delivered': return 3;
      default: return 0;
    }
  };

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!orderId.trim()) return;

    setIsLoading(true);
    setErrorMsg('');
    const rawQuery = orderId.trim().toUpperCase();
    const cleanCode = rawQuery.startsWith('DUAT-') ? rawQuery : `DUAT-${rawQuery}`;

    // 1. Check local copy in localStorage
    let localOrder = null;
    try {
      const savedLocal = JSON.parse(localStorage.getItem('duat_customer_orders') || '[]');
      localOrder = savedLocal.find(
        (item) =>
          (item.ref && item.ref.toUpperCase() === cleanCode) ||
          (item.id && item.id.toUpperCase() === cleanCode)
      );
    } catch (e) {
      console.error('Failed reading local tracking orders:', e);
    }

    if (!localOrder) {
      localOrder = getOrderByCode(cleanCode);
    }

    // 2. Query Supabase directly by id or ref
    try {
      const { data: dbData, error: dbError } = await supabase
        .from('orders')
        .select('*')
        .or(`id.eq.${cleanCode},ref.eq.${cleanCode}`)
        .maybeSingle();

      const matchedOrder = dbData || localOrder;

      if (matchedOrder && matchedOrder.status) {
        const custName = matchedOrder.customer?.fullName || matchedOrder.customer?.name || localOrder?.customer?.fullName || localOrder?.customer?.name;
        const itemsList = Array.isArray(matchedOrder.items) && matchedOrder.items.length > 0 ? matchedOrder.items : (localOrder?.items || []);
        const totalAmount = matchedOrder.total || localOrder?.total || 0;
        const orderDate = matchedOrder.created_at || matchedOrder.createdAt;

        setTrackedResult({
          code: matchedOrder.id || matchedOrder.ref || cleanCode,
          currentStep: statusToStep(matchedOrder.status),
          status: matchedOrder.status,
          customerName: custName,
          items: itemsList,
          total: totalAmount,
          updatedAt: orderDate
            ? new Date(orderDate).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US')
            : 'الآن'
        });
      } else {
        setTrackedResult(null);
        setErrorMsg(t('trackerNotFound'));
      }
    } catch (err) {
      console.error('Order tracking exception:', err);
      if (localOrder) {
        setTrackedResult({
          code: localOrder.ref || localOrder.id,
          currentStep: statusToStep(localOrder.status),
          status: localOrder.status,
          customerName: localOrder.customer?.fullName || localOrder.customer?.name,
          items: localOrder.items || [],
          total: localOrder.total,
          updatedAt: localOrder.createdAt ? new Date(localOrder.createdAt).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US') : 'الآن'
        });
      } else {
        setTrackedResult(null);
        setErrorMsg(t('trackerNotFound'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const steps = [
    { title: t('stepPlaced'), icon: CheckCircle, desc: t('stepPlacedDesc') },
    { title: t('stepForge'), icon: Clock, desc: t('stepForgeDesc') },
    { title: t('stepShipped'), icon: Truck, desc: t('stepShippedDesc') },
    { title: t('stepDelivered'), icon: ShieldCheck, desc: t('stepDeliveredDesc') }
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 space-y-12 min-h-[75vh]">
      
      {/* Header */}
      <div className="space-y-4 text-center reveal-on-scroll">
        <div className="flex items-center justify-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-ash">
          <SunDisc size={14} variant="gold" />
          <span>DUAT / 04 — TRACKER</span>
        </div>
        <h1 className="font-clash text-4xl sm:text-6xl uppercase text-bone">
          {t('trackerTitle')}
        </h1>
        <p className="font-space text-sm sm:text-base text-ash max-w-xl mx-auto font-light leading-relaxed">
          {t('trackerSubtitle')}
        </p>
      </div>

      {/* Track Form Card */}
      <div className="bg-stone border border-grave p-6 sm:p-10 space-y-6 shadow-2xl card-depth-highlight">
        <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            placeholder={t('trackerInputPlaceholder')}
            className="flex-1 bg-coal border border-grave text-bone p-4 text-sm font-mono uppercase focus:border-gold focus:outline-none min-h-[44px]"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary px-8 text-xs font-mono tracking-widest flex items-center justify-center gap-2 min-h-[44px]"
          >
            {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
            <span>{t('trackerBtn')}</span>
          </button>
        </form>

        {errorMsg && (
          <p className="font-mono text-xs text-ember text-center">{errorMsg}</p>
        )}

        {/* Milestone Steps Result */}
        {trackedResult && (
          <div className="bg-coal border border-grave p-6 sm:p-8 space-y-8 animate-in fade-in duration-300 mt-6">
            <div className="flex justify-between items-center border-b border-grave pb-4">
              <span className="font-mono text-xs text-ash">ORDER REFERENCE:</span>
              <span className="font-mono text-base font-bold text-gold tracking-widest">{trackedResult.code}</span>
            </div>

            {trackedResult.customerName && (
              <div className="font-mono text-xs text-bone/80">
                <span className="text-ash">CUSTOMER: </span>
                <span>{trackedResult.customerName}</span>
              </div>
            )}

            {Array.isArray(trackedResult.items) && trackedResult.items.length > 0 && (
              <div className="font-mono text-xs text-bone/80 border-b border-grave/40 pb-3 space-y-1">
                <span className="text-ash block font-bold">المنتجات في هذا الطلب:</span>
                {trackedResult.items.map((it, i) => (
                  <div key={i} className="text-gold font-medium">
                    • {it.nameAr || it.nameEn} (x{it.quantity || 1})
                  </div>
                ))}
              </div>
            )}

            <div className="space-y-6">
              {steps.map((step, idx) => {
                const Icon = step.icon;
                const isCompleted = idx <= trackedResult.currentStep;
                const isCurrent = idx === trackedResult.currentStep;

                return (
                  <div key={idx} className="flex items-start gap-4 sm:gap-6">
                    <div className={`p-3 border flex-shrink-0 transition-all rounded-sm ${
                      isCurrent
                        ? 'border-gold bg-gold/25 text-gold shadow-lg shadow-gold/20 scale-105'
                        : isCompleted
                        ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400'
                        : 'border-grave bg-void text-ash/40'
                    }`}>
                      {isCompleted && !isCurrent ? <CheckCircle size={20} className="text-emerald-400" /> : <Icon size={20} />}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className={`font-mono text-sm uppercase ${
                          isCurrent ? 'text-gold font-bold text-base' : isCompleted ? 'text-bone font-medium' : 'text-ash/60'
                        }`}>
                          {step.title}
                        </h4>
                        {isCurrent && (
                          <span className="px-2 py-0.5 bg-gold/20 text-gold border border-gold/40 text-[10px] font-mono font-bold animate-pulse">
                            الحالة الحالية ⚡
                          </span>
                        )}
                      </div>
                      <p className="font-space text-xs text-ash/90 leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
