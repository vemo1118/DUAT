import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { SunDisc } from '../components/SunDisc';
import { trackOrder } from '../services/orderApi';
import { Search, CheckCircle, Clock, Truck, ShieldCheck, Loader2 } from 'lucide-react';

export const OrderTrackerView = () => {
  const { lang, t } = useLanguage();
  const [orderId, setOrderId] = useState('');
  const [phoneLast4, setPhoneLast4] = useState('');
  const [trackedResult, setTrackedResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const statusToStep = (status) => {
    switch (status) {
      case 'placed': return 0;
      case 'forge':
      case 'in_production': return 1;
      case 'shipped': return 2;
      case 'delivered': return 3;
      default: return 0;
    }
  };

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!orderId.trim() || !/^\d{4}$/.test(phoneLast4)) {
      setErrorMsg(lang === 'ar' ? 'اكتب رقم الطلب وآخر ٤ أرقام من رقم الموبايل' : 'Enter the order number and the last 4 phone digits');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');
    try {
      const finalTrack = await trackOrder(orderId, phoneLast4);
      if (finalTrack?.status) {
        setTrackedResult({
          code: finalTrack.code,
          currentStep: statusToStep(finalTrack.status),
          status: finalTrack.status,
          items: finalTrack.items || [],
          updatedAt: (finalTrack.updatedAt || finalTrack.createdAt)
            ? new Date(finalTrack.updatedAt || finalTrack.createdAt).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US')
            : 'الآن'
        });
      }
    } catch {
      setTrackedResult(null);
      setErrorMsg(t('trackerNotFound'));
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
        <form onSubmit={handleTrack} className="grid grid-cols-1 sm:grid-cols-[1fr_180px_auto] gap-3">
          <input
            type="text"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            placeholder={t('trackerInputPlaceholder')}
            className="flex-1 bg-coal border border-grave text-bone p-4 text-sm font-mono uppercase focus:border-gold focus:outline-none min-h-[44px]"
          />
          <input
            type="text"
            inputMode="numeric"
            maxLength={4}
            value={phoneLast4}
            onChange={(e) => setPhoneLast4(e.target.value.replace(/\D/g, '').slice(0, 4))}
            placeholder={lang === 'ar' ? 'آخر ٤ أرقام من الموبايل' : 'Last 4 phone digits'}
            className="bg-coal border border-grave text-bone p-4 text-sm font-mono focus:border-gold focus:outline-none min-h-[44px]"
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

            {/* Action Buttons */}
            <div className="pt-6 border-t border-grave flex flex-col sm:flex-row gap-3">
              <a
                href={`https://wa.me/201012345678?text=${encodeURIComponent(`أهلاً خدمة عملاء دوات، أود الاستفسار عن طلبي رقم: ${trackedResult.code}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-6 border border-emerald-500/50 bg-emerald-950/30 text-emerald-400 hover:bg-emerald-900/40 text-xs font-mono flex items-center justify-center gap-2 transition-colors flex-1"
              >
                <span>💬 {lang === 'ar' ? 'محادثة الدعم على واتساب' : 'Chat Support on WhatsApp'}</span>
              </a>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default OrderTrackerView;
