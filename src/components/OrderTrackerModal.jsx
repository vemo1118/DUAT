import React, { useState } from 'react';
import { X, Search, CheckCircle, Clock, Truck, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { SunDisc } from './SunDisc';

export const OrderTrackerModal = ({ isOpen, onClose }) => {
  const { lang, t } = useLanguage();
  const [orderId, setOrderId] = useState('');
  const [trackedResult, setTrackedResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleTrack = (e) => {
    e.preventDefault();
    if (!orderId.trim()) return;

    // Simulated lookup logic for high-end feel
    const query = orderId.trim().toUpperCase();
    if (query.length >= 4) {
      setErrorMsg('');
      setTrackedResult({
        code: query.startsWith('DUAT-') ? query : `DUAT-${query}`,
        currentStep: 2, // In Alexandria Forge
        updatedAt: new Date().toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US')
      });
    } else {
      setTrackedResult(null);
      setErrorMsg(t('trackerNotFound'));
    }
  };

  const steps = [
    { title: t('stepPlaced'), icon: CheckCircle, desc: 'WhatsApp Confirmation Verified' },
    { title: t('stepForge'), icon: Clock, desc: 'Epoxy Domes & Assembly' },
    { title: t('stepShipped'), icon: Truck, desc: 'Express Shipping Dispatch' },
    { title: t('stepDelivered'), icon: ShieldCheck, desc: 'Night Crossing Arrival' }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-void/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-stone border border-grave max-w-lg w-full p-6 sm:p-8 shadow-2xl relative space-y-6 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-grave pb-4">
          <div className="flex items-center gap-3">
            <SunDisc size={22} variant="gold" />
            <h2 className="font-archivo text-xl uppercase text-bone">
              {t('trackerTitle')}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-ash hover:text-gold border border-grave bg-coal transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <p className="font-space text-xs text-ash leading-relaxed">
          {t('trackerSubtitle')}
        </p>

        {/* Input Form */}
        <form onSubmit={handleTrack} className="flex gap-2">
          <input
            type="text"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            placeholder={t('trackerInputPlaceholder')}
            className="flex-1 bg-coal border border-grave text-bone p-3 text-xs font-mono uppercase focus:border-gold focus:outline-none"
          />
          <button
            type="submit"
            className="btn-primary px-6 text-xs flex items-center gap-2"
          >
            <Search size={14} />
            <span>{t('trackerBtn')}</span>
          </button>
        </form>

        {errorMsg && (
          <p className="font-mono text-xs text-ember">{errorMsg}</p>
        )}

        {/* Milestone Steps Result */}
        {trackedResult && (
          <div className="bg-coal border border-grave p-6 space-y-6 animate-in fade-in duration-300">
            <div className="flex justify-between items-center border-b border-grave pb-3">
              <span className="font-mono text-xs text-ash">REF:</span>
              <span className="font-mono text-sm font-bold text-gold">{trackedResult.code}</span>
            </div>

            <div className="space-y-4">
              {steps.map((step, idx) => {
                const Icon = step.icon;
                const isCompleted = idx <= trackedResult.currentStep;
                const isCurrent = idx === trackedResult.currentStep;

                return (
                  <div key={idx} className="flex items-start gap-4">
                    <div className={`p-2 border ${
                      isCurrent
                        ? 'border-gold bg-gold/20 text-gold'
                        : isCompleted
                        ? 'border-grave bg-stone text-gold'
                        : 'border-grave bg-void text-ash'
                    }`}>
                      <Icon size={16} />
                    </div>
                    <div>
                      <h4 className={`font-mono text-xs uppercase ${
                        isCurrent ? 'text-gold font-bold' : isCompleted ? 'text-bone' : 'text-ash'
                      }`}>
                        {step.title}
                      </h4>
                      <p className="font-space text-[11px] text-ash mt-0.5">
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
