import React, { useState, useEffect } from 'react';
import { X, Save, Plus, Upload, Sparkles } from 'lucide-react';

export function AdminHeroSlideModal({ isOpen, onClose, onSave, slideToEdit = null }) {
  const [formData, setFormData] = useState({
    id: '',
    eyebrowEn: 'DUAT / THE FORGE',
    eyebrowAr: 'دوات / كور الفن والتشطيب',
    headline1En: '',
    headline1Ar: '',
    headline2En: '',
    headline2Ar: '',
    subEn: '',
    subAr: '',
    badgeEn: 'OFFER 30% OFF',
    badgeAr: 'عرض خاص 30%',
    imageUrl: '',
    ctaPrimaryTextEn: 'START BUILDING',
    ctaPrimaryTextAr: 'ابدأ التصميم الآن',
    ctaPrimaryLink: '/customize',
    ctaSecondaryTextEn: 'VIEW GALLERY',
    ctaSecondaryTextAr: 'معرض الكتالوج',
    ctaSecondaryLink: '/shop'
  });

  useEffect(() => {
    if (slideToEdit) {
      setFormData({
        id: slideToEdit.id || '',
        eyebrowEn: slideToEdit.eyebrowEn || '',
        eyebrowAr: slideToEdit.eyebrowAr || '',
        headline1En: slideToEdit.headline1En || '',
        headline1Ar: slideToEdit.headline1Ar || '',
        headline2En: slideToEdit.headline2En || '',
        headline2Ar: slideToEdit.headline2Ar || '',
        subEn: slideToEdit.subEn || '',
        subAr: slideToEdit.subAr || '',
        badgeEn: slideToEdit.badgeEn || '',
        badgeAr: slideToEdit.badgeAr || '',
        imageUrl: slideToEdit.imageUrl || '',
        ctaPrimaryTextEn: slideToEdit.ctaPrimaryTextEn || '',
        ctaPrimaryTextAr: slideToEdit.ctaPrimaryTextAr || '',
        ctaPrimaryLink: slideToEdit.ctaPrimaryLink || '/customize',
        ctaSecondaryTextEn: slideToEdit.ctaSecondaryTextEn || '',
        ctaSecondaryTextAr: slideToEdit.ctaSecondaryTextAr || '',
        ctaSecondaryLink: slideToEdit.ctaSecondaryLink || '/shop'
      });
    } else {
      setFormData({
        id: '',
        eyebrowEn: 'DUAT / SPECIAL OFFER',
        eyebrowAr: 'دوات / عرض خاص جدًا',
        headline1En: 'EXCLUSIVE DISCOUNT',
        headline1Ar: 'خصم استثنائي جديد',
        headline2En: 'LIMITED TIME ONLY',
        headline2Ar: 'لفترة محدودة فقط',
        subEn: 'Check out our new luxury arrivals with premium hand craftsmanship in Egypt.',
        subAr: 'اكتشف جديد تشكيلة الجرابات والملصقات الفاخرة المصنوعة يدوياً في مصر.',
        badgeEn: 'SPECIAL DROP',
        badgeAr: 'عرض محدود',
        imageUrl: '',
        ctaPrimaryTextEn: 'SHOP NOW',
        ctaPrimaryTextAr: 'تسوق العرض الآن',
        ctaPrimaryLink: '/shop',
        ctaSecondaryTextEn: 'CUSTOMIZE',
        ctaSecondaryTextAr: 'تخصيص بنفسك',
        ctaSecondaryLink: '/customize'
      });
    }
  }, [slideToEdit, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('حجم الصورة كبير جداً! يرجى اختيار صورة أقل من 5 ميجابايت.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, imageUrl: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-void/85 backdrop-blur-md overflow-y-auto animate-fade-in" dir="rtl">
      <div className="relative w-full max-w-3xl bg-stone border border-gold/40 p-6 space-y-6 shadow-2xl card-depth-highlight my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-grave pb-4">
          <div className="flex items-center gap-3">
            <span className="p-2 border border-gold/40 bg-gold/10 text-gold">
              <Sparkles size={20} />
            </span>
            <div>
              <h2 className="font-clash text-xl font-bold text-bone">
                {slideToEdit ? 'تعديل بنر العروض / السلايدر' : 'إضافة بنر / عرض جديد للشاشة الرئيسية'}
              </h2>
              <p className="font-mono text-xs text-ash">
                يمكنك تغيير صور البنر، العناوين، شارات الخصم، والأزرار والتنقل.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-ash hover:text-gold border border-grave transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-5 text-right">
          
          {/* Image Upload & URL Section */}
          <div className="bg-stone/40 border border-grave p-4 space-y-3">
            <div className="flex items-center justify-between">
              <label className="block font-mono text-xs text-gold uppercase tracking-wider font-bold">
                صورة خلفية البنر (رفع من الجهاز أو رابط)
              </label>
              <label className="cursor-pointer px-3 py-1.5 bg-gold/10 border border-gold/40 text-gold hover:bg-gold hover:text-void transition-colors font-mono text-xs font-bold flex items-center gap-1.5">
                <Upload size={14} />
                <span>📁 رفع صورة من جهازك</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            <input
              type="text"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              placeholder="ضع رابط الصورة هنا (مثال: https://... أو استخدم زر الرفع من الجهاز)"
              className="w-full bg-stone border border-grave px-3 py-2 text-bone focus:border-gold focus:outline-none font-mono text-xs"
              dir="ltr"
            />

            {/* Live Image Preview */}
            {formData.imageUrl && (
              <div className="pt-2">
                <span className="font-mono text-[11px] text-ash block mb-1">معاينة الصورة المرفوعة:</span>
                <div className="w-full h-36 bg-void border border-gold/40 relative overflow-hidden">
                  <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone/90 via-transparent to-transparent flex items-end p-3">
                    <span className="font-mono text-xs text-gold font-bold">معاينة البنر الحية ✓</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Eyebrow & Offer Badge */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-xs text-gold uppercase tracking-wider mb-1">
                النص العلوي (Eyebrow Arabic)
              </label>
              <input
                type="text"
                name="eyebrowAr"
                value={formData.eyebrowAr}
                onChange={handleChange}
                placeholder="مثال: عرض خاص لفترة محدودة"
                required
                className="w-full bg-stone border border-grave px-3 py-2 text-bone focus:border-gold focus:outline-none text-sm"
              />
            </div>

            <div>
              <label className="block font-mono text-xs text-gold uppercase tracking-wider mb-1">
                شارة العرض (Offer Badge)
              </label>
              <input
                type="text"
                name="badgeAr"
                value={formData.badgeAr}
                onChange={handleChange}
                placeholder="مثال: خصم 30% OFF"
                className="w-full bg-stone border border-grave px-3 py-2 text-bone focus:border-gold focus:outline-none text-sm"
              />
            </div>
          </div>

          {/* Headlines (Arabic) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-xs text-gold uppercase tracking-wider mb-1">
                العنوان الرئيسي (Headline 1 بالعربي)
              </label>
              <input
                type="text"
                name="headline1Ar"
                value={formData.headline1Ar}
                onChange={handleChange}
                placeholder="مثال: خصم ٣٠٪ حصري"
                required
                className="w-full bg-stone border border-grave px-3 py-2 text-bone focus:border-gold focus:outline-none text-sm font-bold"
              />
            </div>

            <div>
              <label className="block font-mono text-xs text-gold uppercase tracking-wider mb-1">
                العنوان الفرعي (Headline 2 بالعربي)
              </label>
              <input
                type="text"
                name="headline2Ar"
                value={formData.headline2Ar}
                onChange={handleChange}
                placeholder="مثال: على جميع الجرابات والملصقات."
                required
                className="w-full bg-stone border border-grave px-3 py-2 text-bone focus:border-gold focus:outline-none text-sm font-bold"
              />
            </div>
          </div>

          {/* Description Subtitle (Arabic) */}
          <div>
            <label className="block font-mono text-xs text-gold uppercase tracking-wider mb-1">
              الوصف / تفاصيل العرض (Description Arabic)
            </label>
            <textarea
              name="subAr"
              rows="2"
              value={formData.subAr}
              onChange={handleChange}
              placeholder="اكتب وصف العرض أو الترويج هنا..."
              className="w-full bg-stone border border-grave p-3 text-bone focus:border-gold focus:outline-none text-sm"
            />
          </div>

          {/* Buttons & Navigation Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-stone/30 border border-grave p-4">
            <div>
              <label className="block font-mono text-xs text-gold uppercase tracking-wider mb-1">
                نص الزر الأول (Primary Button)
              </label>
              <input
                type="text"
                name="ctaPrimaryTextAr"
                value={formData.ctaPrimaryTextAr}
                onChange={handleChange}
                placeholder="مثال: ابدأ التصميم"
                className="w-full bg-stone border border-grave px-3 py-2 text-bone focus:border-gold text-xs"
              />
              <label className="block font-mono text-[10px] text-ash mt-1">رابط الزر الأول:</label>
              <select
                name="ctaPrimaryLink"
                value={formData.ctaPrimaryLink}
                onChange={handleChange}
                className="w-full bg-stone border border-grave px-2 py-1 text-bone font-mono text-xs"
                dir="ltr"
              >
                <option value="/customize">/customize (صفحة التخصيص والـ 3D)</option>
                <option value="/shop">/shop (المتجر والكتالوج)</option>
                <option value="/track-order">/track-order (تتبع الطلب)</option>
                <option value="/the-duat">/the-duat (عن دوات)</option>
              </select>
            </div>

            <div>
              <label className="block font-mono text-xs text-gold uppercase tracking-wider mb-1">
                نص الزر الثاني (Secondary Button)
              </label>
              <input
                type="text"
                name="ctaSecondaryTextAr"
                value={formData.ctaSecondaryTextAr}
                onChange={handleChange}
                placeholder="مثال: تسوق الكتالوج"
                className="w-full bg-stone border border-grave px-3 py-2 text-bone focus:border-gold text-xs"
              />
              <label className="block font-mono text-[10px] text-ash mt-1">رابط الزر الثاني:</label>
              <select
                name="ctaSecondaryLink"
                value={formData.ctaSecondaryLink}
                onChange={handleChange}
                className="w-full bg-stone border border-grave px-2 py-1 text-bone font-mono text-xs"
                dir="ltr"
              >
                <option value="/shop">/shop (المتجر والكتالوج)</option>
                <option value="/customize">/customize (صفحة التخصيص)</option>
                <option value="/track-order">/track-order (تتبع الطلب)</option>
                <option value="/the-duat">/the-duat (عن دوات)</option>
              </select>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-grave">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 border border-grave text-ash hover:text-bone font-mono text-xs uppercase"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-gold text-[#050505] font-bold font-mono text-xs uppercase tracking-wider hover:bg-gold-light transition-colors shadow-lg shadow-gold/20 flex items-center gap-2"
            >
              <Save size={16} />
              <span>حفظ البنر ونشره فوراً</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
