import React, { useEffect, useState } from 'react';
import { useCheckoutSettings } from '../context/CheckoutSettingsContext';
import { GOVERNORATES } from '../data/products';

export function AdminCheckoutEditor({ showToast }) {
  const { settings, saveSettings, loading, error, reload } = useCheckoutSettings();
  const [form, setForm] = useState(settings);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  useEffect(() => { if (!dirty) setForm(settings); }, [settings, dirty]);
  const set = (key, value) => { setDirty(true); setForm(f => ({ ...f, [key]: value })); };
  const methodSet = (id, key, value) => set('methods', form.methods.map(m => m.id === id ? { ...m, [key]: value } : m));
  const input = (label, value, onChange, type = 'text') => <label className="block space-y-2 text-sm"><span>{label}</span><input type={type} min={type === 'number' ? 0 : undefined} value={value ?? ''} onChange={e => onChange(type === 'number' ? Number(e.target.value) : e.target.value)} className="w-full min-w-0 bg-coal border border-grave p-3 text-bone" /></label>;
  const toggle = (label, value, onChange) => <label className="flex items-center gap-3 py-2 text-sm"><input type="checkbox" checked={!!value} onChange={e => onChange(e.target.checked)} />{label}</label>;
  const bilingual = (prefix, label, object, update) => <div className="grid sm:grid-cols-2 gap-4">{input(`${label} — عربي`, object[`${prefix}Ar`], v => update(`${prefix}Ar`, v))}{input(`${label} — English`, object[`${prefix}En`], v => update(`${prefix}En`, v))}</div>;
  return <form dir="rtl" className="space-y-6 max-w-5xl text-bone" onSubmit={async e => {
    e.preventDefault(); setSaving(true);
    try { const saved = await saveSettings(form); setForm(saved); setDirty(false); showToast('اتحفظت إعدادات إتمام الطلب على السيرفر.', 'success'); }
    catch (e) { showToast(e.message, 'error'); } finally { setSaving(false); }
  }}>
    <div className="bg-stone border border-grave p-5 space-y-4">
      <h2 className="text-2xl font-bold">إعدادات إتمام الطلب وطرق الدفع</h2>
      <p className="text-ash text-sm">تغييراتك بتظهر لكل الأجهزة بعد الحفظ. طرق التحويل هنا يدوية وتحتاج صورة إثبات ومراجعة منك؛ إضافة اسم فيزا مش ربط ببوابة دفع.</p>
      {loading && <p>تحميل الإعدادات…</p>}
      {error && <button type="button" onClick={reload}>تعذر تحميل الإعدادات — إعادة المحاولة</button>}
      {toggle('استقبال الطلبات', form.enabled, v => set('enabled', v))}
      {bilingual('title', 'عنوان الصفحة', form, set)}
      {bilingual('notice', 'ملاحظة قبل الطلب', form, set)}
      {bilingual('submit', 'زر تأكيد الطلب', form, set)}
      {bilingual('closed', 'رسالة إيقاف الطلبات', form, set)}
      {toggle('إظهار خانة الإيميل (اختياري للعميل)', form.showEmail, v => set('showEmail', v))}
      {toggle('إظهار ملاحظات العميل (اختياري)', form.showNotes, v => set('showNotes', v))}
    </div>
    <section className="bg-stone border border-grave p-5 space-y-4">
      <h3 className="text-xl font-bold">طرق الدفع</h3>
      <p className="text-ash text-sm">الكستمايز يتطلب دفع مقدم؛ الدفع عند الاستلام متاح للجاهز فقط. حذف الطريقة لا يغيّر بيانات الطلبات القديمة.</p>
      {form.methods.map((m, index) => <div key={m.id} className="bg-coal border border-grave p-4 space-y-4">
        <div className="flex flex-wrap justify-between gap-3"><strong>{m.titleAr || 'طريقة جديدة'}</strong><div className="flex gap-3">
          <button type="button" disabled={!index} onClick={() => { const next = [...form.methods]; [next[index - 1], next[index]] = [next[index], next[index - 1]]; set('methods', next); }}>نقل لأعلى</button>
          <button type="button" className="text-red-400" onClick={() => set('methods', form.methods.filter(x => x.id !== m.id))}>حذف الطريقة</button></div></div>
        {toggle('مفعّلة', m.enabled, v => methodSet(m.id, 'enabled', v))}
        <label className="block">نوع الطريقة<select className="block w-full bg-stone border border-grave p-3" value={m.type} onChange={e => methodSet(m.id, 'type', e.target.value)}><option value="transfer">تحويل يدوي مقدم مع إثبات</option><option value="cod">دفع عند الاستلام</option></select></label>
        {m.type === 'transfer' && toggle('متاحة للكستمايز', m.customAllowed, v => methodSet(m.id, 'customAllowed', v))}
        {bilingual('title', 'اسم الطريقة', m, (k, v) => methodSet(m.id, k, v))}
        {bilingual('description', 'وصف الطريقة', m, (k, v) => methodSet(m.id, k, v))}
        {m.type === 'transfer' && <>
          {input('رقم الحساب / المحفظة / عنوان التحويل (ظاهر للعميل)', m.account, v => methodSet(m.id, 'account', v))}
          {input('رابط دفع HTTPS اختياري', m.url, v => methodSet(m.id, 'url', v), 'url')}
          {bilingual('instructions', 'تعليمات التحويل', m, (k, v) => methodSet(m.id, k, v))}
        </>}
      </div>)}
      <button type="button" className="btn-ghost p-3" disabled={form.methods.length >= 12} onClick={() => set('methods', [...form.methods, { id: `payment-${crypto.randomUUID()}`, type: 'transfer', enabled: false, customAllowed: true, titleAr: '', titleEn: '', descriptionAr: '', descriptionEn: '', account: '', url: '', instructionsAr: '', instructionsEn: '' }])}>إضافة طريقة دفع</button>
    </section>
    <section className="bg-stone border border-grave p-5 space-y-4">
      <h3 className="text-xl font-bold">الشحن</h3>
      <label className="block">تحصيل الشحن<select className="block w-full bg-coal border border-grave p-3" value={form.shippingMode} onChange={e => set('shippingMode', e.target.value)}><option value="upfront">مع الطلب حسب المحافظة</option><option value="later">منفصل قبل الإرسال بعد تأكيد التكلفة</option></select></label>
      {form.shippingMode === 'later' ? bilingual('shippingLater', 'توضيح الشحن المنفصل', form, set) : <>
        {input('شحن مجاني من مبلغ (0 لإلغائه)', form.freeShippingThreshold, v => set('freeShippingThreshold', v), 'number')}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">{GOVERNORATES.map(g => <React.Fragment key={g.id}>{input(g.nameAr, form.shippingFees[g.id], v => set('shippingFees', { ...form.shippingFees, [g.id]: v }), 'number')}</React.Fragment>)}</div>
      </>}
    </section>
    <button disabled={saving || loading || error} className="btn-primary p-4 w-full">{saving ? 'جاري الحفظ…' : 'حفظ إعدادات إتمام الطلب'}</button>
  </form>;
}
