import React, { useState } from 'react';
import { X, Search, CheckCircle, Clock, Truck, ShieldCheck, Loader2, Check } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { trackOrder } from '../services/orderApi';
import { SunDisc } from './SunDisc';

export const OrderTrackerModal = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  const [orderId, setOrderId] = useState('');
  const [trackedResult, setTrackedResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

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
    if (!orderId.trim()) {
      setErrorMsg(t('trackerRequired'));
      return;
    }

    setIsLoading(true);
    setErrorMsg('');
    try {
      const finalTrack = await trackOrder(orderId);
      if (finalTrack?.status) {
        setTrackedResult({
          code: finalTrack.code,
          currentStep: statusToStep(finalTrack.status),
          status: finalTrack.status
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-void/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-stone border border-grave max-w-lg w-full p-6 sm:p-8 shadow-2xl relative space-y-6 animate-in zoom-in-95 duration-200 card-depth-highlight">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-grave pb-4">
          <div className="flex items-center gap-3">
            <SunDisc size={22} variant="gold" />
            <h2 className="font-clash text-xl uppercase text-bone">
              {t('trackerTitle')}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-ash hover:text-gold border border-grave bg-coal transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <p className="font-space text-xs text-ash leading-relaxed">
          {t('trackerSubtitle')}
        </p>

        {/* Input Form */}
        <form onSubmit={handleTrack} className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-2">
          <input
            type="text"
            inputMode="text"
            autoComplete="off"
            maxLength={15}
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            placeholder={t('trackerInputPlaceholder')}
            className="flex-1 bg-coal border border-grave text-bone p-3 text-xs font-mono uppercase focus:border-gold focus:outline-none min-h-[44px]"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary px-6 text-xs flex items-center gap-2 min-h-[44px]"
          >
            {isLoading ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
            <span>{t('trackerBtn')}</span>
          </button>
        </form>

        {errorMsg && (
          <p className="font-mono text-xs text-ember text-center">{errorMsg}</p>
        )}

        {/* Milestone Steps Result */}
        {trackedResult && (
          <div className="bg-coal border border-grave p-5 space-y-5 animate-in fade-in duration-300">
            <div className="flex justify-between items-center border-b border-grave pb-3 font-mono text-xs">
              <span className="text-ash uppercase">رقم الطلب (REF):</span>
              <span className="font-bold text-gold tracking-widest">{trackedResult.code}</span>
            </div>

            <div className="space-y-4 relative">
              {steps.map((step, idx) => {
                const Icon = step.icon;
                const isCompleted = idx <= trackedResult.currentStep;
                const isCurrent = idx === trackedResult.currentStep;

                return (
                  <div key={idx} className="flex items-start gap-3.5 relative z-10">
                    <div className={`p-2 border flex-shrink-0 transition-all rounded-sm ${
                      isCurrent
                        ? 'border-gold bg-gold/25 text-gold shadow-md shadow-gold/20 scale-105'
                        : isCompleted
                        ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400'
                        : 'border-grave bg-void text-ash/40'
                    }`}>
                      {isCompleted && !isCurrent ? <Check size={16} /> : <Icon size={16} />}
                    </div>
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <h4 className={`font-mono text-xs uppercase ${
                          isCurrent ? 'text-gold font-bold text-sm' : isCompleted ? 'text-bone font-medium' : 'text-ash/60'
                        }`}>
                          {step.title}
                        </h4>
                        {isCurrent && (
                          <span className="px-2 py-0.5 bg-gold/20 text-gold border border-gold/40 text-[9px] font-mono font-bold animate-pulse">
                            الحالة الحالية ⚡
                          </span>
                        )}
                      </div>
                      <p className="font-space text-[11px] text-ash/90 leading-relaxed">
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
