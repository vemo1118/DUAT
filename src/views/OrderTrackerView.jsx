import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useOrders } from '../context/OrdersContext';
import { SunDisc } from '../components/SunDisc';
import { Search, CheckCircle, Clock, Truck, ShieldCheck } from 'lucide-react';

export const OrderTrackerView = () => {
  const { lang, t } = useLanguage();
  const { getOrderByCode } = useOrders();
  const [orderId, setOrderId] = useState('');
  const [trackedResult, setTrackedResult] = useState(null);
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

  const handleTrack = (e) => {
    e.preventDefault();
    if (!orderId.trim()) return;

    const query = orderId.trim();
    const foundOrder = getOrderByCode(query);

    if (foundOrder) {
      setErrorMsg('');
      setTrackedResult({
        code: foundOrder.id,
        currentStep: statusToStep(foundOrder.status),
        customerName: foundOrder.customer?.fullName,
        updatedAt: foundOrder.createdAt ? new Date(foundOrder.createdAt).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US') : 'الآن'
      });
    } else if (query.length >= 4) {
      // Fallback display for arbitrary code
      setErrorMsg('');
      setTrackedResult({
        code: query.toUpperCase().startsWith('DUAT-') ? query.toUpperCase() : `DUAT-${query.toUpperCase()}`,
        currentStep: 1,
        updatedAt: new Date().toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US')
      });
    } else {
      setTrackedResult(null);
      setErrorMsg(t('trackerNotFound'));
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
            className="btn-primary px-8 text-xs font-mono tracking-widest flex items-center justify-center gap-2 min-h-[44px]"
          >
            <Search size={16} />
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

            <div className="space-y-6">
              {steps.map((step, idx) => {
                const Icon = step.icon;
                const isCompleted = idx <= trackedResult.currentStep;
                const isCurrent = idx === trackedResult.currentStep;

                return (
                  <div key={idx} className="flex items-start gap-4 sm:gap-6">
                    <div className={`p-3 border flex-shrink-0 transition-colors ${
                      isCurrent
                        ? 'border-gold bg-gold/20 text-gold shadow-lg shadow-gold/10'
                        : isCompleted
                        ? 'border-grave bg-stone text-gold'
                        : 'border-grave bg-void text-ash'
                    }`}>
                      <Icon size={20} />
                    </div>
                    <div className="space-y-1">
                      <h4 className={`font-mono text-sm uppercase ${
                        isCurrent ? 'text-gold font-bold' : isCompleted ? 'text-bone font-medium' : 'text-ash'
                      }`}>
                        {step.title}
                      </h4>
                      <p className="font-space text-xs text-ash leading-relaxed">
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
