import React from 'react';
import { useToast } from '../context/ToastContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer = () => {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 sm:top-6 sm:right-6 sm:left-auto sm:translate-x-0 z-50 flex flex-col space-y-3 pointer-events-none max-w-sm w-full px-4 sm:px-0">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto bg-stone border p-4 shadow-[0_15px_35px_rgba(0,0,0,0.8)] flex items-start gap-3 transition-all duration-300 animate-in slide-in-from-top-5 ${
            toast.type === 'error'
              ? 'border-ember text-bone'
              : toast.type === 'success'
              ? 'border-gold text-bone'
              : 'border-grave text-bone'
          }`}
        >
          {toast.type === 'success' && <CheckCircle2 size={18} className="text-gold flex-shrink-0 mt-0.5" />}
          {toast.type === 'error' && <AlertCircle size={18} className="text-ember flex-shrink-0 mt-0.5" />}
          {toast.type === 'info' && <Info size={18} className="text-ash flex-shrink-0 mt-0.5" />}

          <div className="flex-1 font-space text-xs font-medium leading-snug">
            {toast.message}
          </div>

          <button
            onClick={() => removeToast(toast.id)}
            className="text-ash hover:text-bone transition-colors p-0.5"
            aria-label="Close notification"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
};
