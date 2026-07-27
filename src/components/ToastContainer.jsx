import React from 'react';
import { useToast } from '../context/ToastContext';
import { SunDisc } from './SunDisc';

export const ToastContainer = () => {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          onClick={() => removeToast(toast.id)}
          className="pointer-events-auto bg-stone/95 backdrop-blur-md border border-gold p-4 shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom duration-300 cursor-pointer"
        >
          <SunDisc size={18} variant={toast.type === 'error' ? 'ember' : 'gold'} />
          <span className="font-mono text-xs uppercase tracking-wider text-bone flex-1">
            {toast.message}
          </span>
        </div>
      ))}
    </div>
  );
};
