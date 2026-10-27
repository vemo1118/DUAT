import React, { useEffect, useState } from 'react';
import { Eye, EyeOff, Image as ImageIcon, RotateCcw, Save } from 'lucide-react';
import { usePreorderHeroSettings } from '../context/PreorderHeroSettingsContext';

const bilingual = [
  ['badgeOpen', 'شارة الحجز المفتوح'], ['badgeClosed', 'شارة انتهاء الحجز'], ['badgeUpcoming', 'شارة الحجز القادم'],
  ['title', 'العنوان الرئيسي'], ['accentTitle', 'العنوان الذهبي'], ['closedTitle', 'عنوان انتهاء الدفعة'],
  ['closedAccentTitle', 'العنوان الذهبي بعد الإغلاق'], ['description', 'الوصف'], ['priceLabel', 'عنوان السعر'],
  ['beforeShipping', 'النص أسفل الإجمالي'], ['closedMessage', 'رسالة انتهاء الحجز'], ['upcomingMessage', 'رسالة الحجز القادم'],
  ['primaryOpenText', 'زر الحجز المفتوح'], ['primaryClosedText', 'الزر بعد الإغلاق'], ['secondaryText', 'الزر الثانوي'],
  ['footerOpen', 'ملاحظة الحجز المفتوح'], ['footerClosed', 'ملاحظة بعد الإغلاق'], ['footerUpcoming', 'ملاحظة الحجز القادم'],
  ['imageAlt', 'وصف الصورة'], ['cardCaption', 'النص أسفل أرقام القطع']
];

export function AdminPreorderHeroEditor({ showToast }) {
  const { settings, saveSettings, resetSettings } = usePreorderHeroSettings();
  const [form, setForm] = useState(settings);
  const [saving, setSaving] = useState(false);
  useEffect(() => setForm(settings), [settings]);

  const set = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const save = async (event) => {
    event.preventDefault(); setSaving(true);
    try { const saved = await saveSettings(form); setForm(saved); showToast('تم حفظ سيكشن الحجز على الموقع ✨', 'success'); }
    catch (error) { console.error(error); showToast('تعذر حفظ السيكشن. حاول مرة أخرى.', 'error'); }
    finally { setSaving(false); }
  };
  const uploadPreview = (file) => {
    if (!file) return;
    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type) || file.size > 8 * 1024 * 1024) {
      showToast('اختار PNG أو JPG أو WEBP بحجم أقل من 8MB.', 'error'); return;
    }
    const reader = new FileReader(); reader.onload = () => set('imageUrl', reader.result); reader.readAsDataURL(file);
  };

  return <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
    <div className="bg-stone border border-gold/40 p-6 sm:p-8 rounded-lg shadow-2xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-grave pb-4">
        <div><h2 className="font-clash text-xl font-bold text-bone">سيكشن الحجز والكستمايز في الرئيسية</h2><p className="font-mono text-xs text-ash">تحكم كامل في النصوص، السعر، الأزرار، الصورة والمميزات بالعربي والإنجليزي.</p></div>
        <button type="button" onClick={async()=>{if(window.confirm('استعادة الإعدادات الافتراضية؟')){const saved=await resetSettings();setForm(saved);showToast('تمت استعادة الإعدادات الافتراضية','success')}}} className="flex items-center gap-2 border border-grave px-3 py-2 text-xs text-ash hover:text-gold"><RotateCcw size={14}/>استعادة الافتراضي</button>
      </div>

      <form onSubmit={save} className="space-y-7 font-mono text-xs">
        <button type="button" onClick={()=>set('isActive',form.isActive===false)} className={`flex items-center gap-2 px-4 py-3 border font-bold ${form.isActive!==false?'border-emerald-500/50 text-emerald-400':'border-red-500/50 text-red-400'}`}>
          {form.isActive!==false?<Eye size={16}/>:<EyeOff size={16}/>} {form.isActive!==false?'السيكشن ظاهر على الموقع':'السيكشن مخفي'}
        </button>

        <div className="grid sm:grid-cols-3 gap-4 bg-coal p-4 border border-grave">
          <label className="text-ash">سعر القطعة<input type="number" min="0" value={form.price} onChange={e=>set('price',Number(e.target.value))} className="mt-1 w-full bg-stone border border-grave p-3 text-bone"/></label>
          <label className="text-ash">أقل عدد<input type="number" min="1" value={form.minimumQuantity} onChange={e=>set('minimumQuantity',Number(e.target.value))} className="mt-1 w-full bg-stone border border-grave p-3 text-bone"/></label>
          <div className="text-ash">الإجمالي المحسوب<div className="mt-1 border border-gold/30 bg-gold/10 p-3 text-lg font-bold text-gold">{Number(form.price||0)*Number(form.minimumQuantity||0)} EGP</div></div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {bilingual.map(([key,label]) => <React.Fragment key={key}>
            <label className="text-ash">{label} — عربي<textarea rows={key.includes('description')||key.includes('Message')||key.includes('footer')?3:1} value={form[`${key}Ar`]||''} onChange={e=>set(`${key}Ar`,e.target.value)} className="mt-1 w-full bg-coal border border-grave p-3 text-bone"/></label>
            <label className="text-ash">{label} — English<textarea dir="ltr" rows={key.includes('description')||key.includes('Message')||key.includes('footer')?3:1} value={form[`${key}En`]||''} onChange={e=>set(`${key}En`,e.target.value)} className="mt-1 w-full bg-coal border border-grave p-3 text-bone"/></label>
          </React.Fragment>)}
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <label className="text-ash">المميزات بالعربي — كل ميزة في سطر<textarea rows={4} value={(form.featuresAr||[]).join('\n')} onChange={e=>set('featuresAr',e.target.value.split('\n').filter(Boolean))} className="mt-1 w-full bg-coal border border-grave p-3 text-bone"/></label>
          <label className="text-ash">Features English — one per line<textarea dir="ltr" rows={4} value={(form.featuresEn||[]).join('\n')} onChange={e=>set('featuresEn',e.target.value.split('\n').filter(Boolean))} className="mt-1 w-full bg-coal border border-grave p-3 text-bone"/></label>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          {[['primaryOpenLink','رابط زر التصميم'],['primaryClosedLink','رابط الزر بعد الإغلاق'],['secondaryLink','رابط الزر الثانوي']].map(([key,label])=><label key={key} className="text-ash">{label}<input dir="ltr" value={form[key]||''} onChange={e=>set(key,e.target.value)} className="mt-1 w-full bg-coal border border-grave p-3 text-bone"/></label>)}
        </div>
        <label className="flex items-center gap-3 text-bone"><input type="checkbox" checked={form.showSecondaryButton!==false} onChange={e=>set('showSecondaryButton',e.target.checked)} className="accent-gold"/>إظهار الزر الثانوي</label>

        <div className="grid sm:grid-cols-2 gap-5 bg-coal p-4 border border-grave">
          <div className="space-y-3"><label className="text-ash block">رابط الصورة<input dir="ltr" value={form.imageUrl||''} onChange={e=>set('imageUrl',e.target.value)} className="mt-1 w-full bg-stone border border-grave p-3 text-bone"/></label><label className="inline-flex cursor-pointer items-center gap-2 border border-gold/40 px-4 py-3 text-gold"><ImageIcon size={16}/>رفع صورة من الجهاز<input hidden type="file" accept="image/png,image/jpeg,image/webp" onChange={e=>uploadPreview(e.target.files?.[0])}/></label></div>
          <div className="aspect-video bg-void border border-grave p-3 flex items-center justify-center">{form.imageUrl&&<img src={form.imageUrl} alt="preview" className="max-w-full max-h-full object-contain"/>}</div>
        </div>

        <div className="grid sm:grid-cols-4 gap-4">
          <label className="text-ash">عنوان الكارت<input value={form.cardEyebrow||''} onChange={e=>set('cardEyebrow',e.target.value)} className="mt-1 w-full bg-coal border border-grave p-3 text-bone"/></label>
          <label className="text-ash">بداية النطاق<input value={form.rangeStart||''} onChange={e=>set('rangeStart',e.target.value)} className="mt-1 w-full bg-coal border border-grave p-3 text-bone"/></label>
          <label className="text-ash">نهاية النطاق<input value={form.rangeEnd||''} onChange={e=>set('rangeEnd',e.target.value)} className="mt-1 w-full bg-coal border border-grave p-3 text-bone"/></label>
          <label className="text-ash">أرقام القطع مفصولة بفاصلة<input value={(form.pieceLabels||[]).join(', ')} onChange={e=>set('pieceLabels',e.target.value.split(',').map(v=>v.trim()).filter(Boolean))} className="mt-1 w-full bg-coal border border-grave p-3 text-bone"/></label>
        </div>

        <button disabled={saving} className="btn-primary flex items-center gap-2 px-8 py-4 font-bold disabled:opacity-60"><Save size={16}/>{saving?'جاري الحفظ والرفع...':'حفظ ونشر التعديلات'}</button>
      </form>
    </div>
  </div>;
}
