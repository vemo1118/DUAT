import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { preorderState, PREORDER } from '../domain/commerce';

export function PreorderWelcome() {
  const { lang } = useLanguage();
  const isAr = lang === 'ar';
  const dialog = useRef(null);
  const key = `duat-preorder-welcome-${PREORDER.opensAt}`;
  useEffect(() => {
    if (preorderState() !== 'open') return;
    try { if (sessionStorage.getItem(key)) return; } catch { /* Storage is optional. */ }
    const timer = setTimeout(() => dialog.current?.showModal(), 1200);
    return () => clearTimeout(timer);
  }, [key]);
  const dismiss = () => {
    dialog.current?.close();
    try { sessionStorage.setItem(key, 'seen'); } catch { /* Storage is optional. */ }
  };
  return <dialog ref={dialog} onCancel={dismiss} onClick={event => { if (event.target === dialog.current) dismiss(); }}
    aria-labelledby="preorder-welcome-title" className="w-[calc(100%-2rem)] max-w-lg rounded-2xl bg-[#FAF6F0] p-0 text-[#232A55] backdrop:bg-black/60">
    <div className="relative p-7 sm:p-10" dir={isAr ? 'rtl' : 'ltr'}>
      <button autoFocus onClick={dismiss} aria-label={isAr ? 'إغلاق العرض' : 'Close offer'} className="absolute end-3 top-3 p-3"><X size={20} /></button>
      <p className="mt-4 text-sm font-bold text-[#986016]">{isAr ? 'حجز أول دفعة · لمدة 7 أيام' : 'FIRST DROP · 7-DAY PRE-ORDER'}</p>
      <h2 id="preorder-welcome-title" className="mt-4 text-3xl font-bold leading-snug">{isAr ? '4 استيكرات. على مزاجك أنت.' : 'Four stickers. All your own.'}</h2>
      <p className="my-5 text-5xl font-bold">180 <span className="text-lg">{isAr ? 'جنيه' : 'EGP'}</span></p>
      <p className="text-sm leading-7">{isAr ? 'صمّم كل واحدة بصورة مختلفة أو كرر تصميمك. القطعة بـ45 جنيه، وتقدر تزود براحتك. الشحن بيتحسب عند الدفع.' : 'Use a different image for each piece or repeat your design. EGP 45 each, with more pieces whenever you want. Shipping calculated at checkout.'}</p>
      <Link onClick={dismiss} to="/sticker-builder" className="mt-6 block rounded-lg bg-[#232A55] p-4 text-center font-bold text-white">{isAr ? 'ابدأ بأول استيكر' : 'Create my first sticker'}</Link>
      <button onClick={dismiss} className="mt-3 w-full p-2 text-sm underline">{isAr ? 'أتفرج على الموقع الأول' : 'Let me explore first'}</button>
    </div>
  </dialog>;
}
