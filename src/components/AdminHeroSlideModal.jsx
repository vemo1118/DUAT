import React, { useState, useEffect } from 'react';
import { X, Save, Upload, Sparkles, Languages } from 'lucide-react';

export function AdminHeroSlideModal({ isOpen, onClose, onSave, slideToEdit = null }) {
  const [activeLangTab, setActiveLangTab] = useState('ar'); // 'ar' | 'en'

  const [formData, setFormData] = useState({
    id: '',
    eyebrowEn: 'DUAT / THE FORGE',
    eyebrowAr: 'دوات / كور الفن والتشطيب',
    headline1En: 'CRAFT YOUR OWN',
    headline1Ar: 'صمم درعك الخاص',
    headline2En: 'CUSTOM ARMOR.',
    headline2Ar: 'بلمسة فرعونية فاخرة.',
    subEn: 'Interactive 3D dome builder. Select phone model, armor finish, raised slogan pills, Arabic motifs, and custom engravings.',
    subAr: 'أداة التصميم التفاعلية ثلاثية الأبعاد. اختر موديل هاتفك، التقفيل الفاخر، والملصقات المجسمة.',
    badgeEn: 'OFFER 30% OFF',
    badgeAr: 'عرض خاص 30%',
    imageUrl: '',
    ctaPrimaryTextEn: 'START BUILDING',
    ctaPrimaryTextAr: 'ابدأ التصميم الآن',
    ctaPrimaryLink: '/customize',
    ctaSecondaryTextEn: 'VIEW GALLERY',
    ctaSecondaryTextAr: 'معرض الكتالوج',
    ctaSecondaryLink: '/shop',
    is_active: true
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
        ctaSecondaryLink: slideToEdit.ctaSecondaryLink || '/shop',
        is_active: slideToEdit.is_active !== undefined ? Boolean(slideToEdit.is_active) : true
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
        badgeAr: 'عرض محدود 30%',
        imageUrl: '',
        ctaPrimaryTextEn: 'SHOP NOW',
        ctaPrimaryTextAr: 'تسوق العرض الآن',
        ctaPrimaryLink: '/shop',
        ctaSecondaryTextEn: 'CUSTOMIZE',
        ctaSecondaryTextAr: 'تخصيص بنفسك',
        ctaSecondaryLink: '/customize',
        is_active: true
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-void/85 backdrop-blur-md overflow-hidden animate-fade-in" dir="rtl">
      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-3xl h-full max-h-[88vh] bg-stone border border-gold/40 shadow-2xl flex flex-col overflow-hidden my-auto"
      >
        {/* Fixed Header */}
        <div className="p-4 sm:p-5 border-b border-grave bg-stone shrink-0 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <span className="p-2 border border-gold/40 bg-gold/10 text-gold rounded">
              <Sparkles size={20} />
            </span>
            <div>
              <h2 className="font-clash text-lg sm:text-xl font-bold text-bone">
                {slideToEdit ? 'تعديل بنر العروض / السلايدر' : 'إضافة بنر / عرض جديد للشاشة الرئيسية'}
              </h2>
              <p className="font-mono text-xs text-ash mt-0.5">
                يمكنك رفع صورة البنر وتعديل النصوص باللغتين العربية والإنجليزية.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-ash hover:text-gold border border-grave transition-colors rounded"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6 text-right">
          
          {/* Image Upload & URL Section */}
          <div className="bg-stone/40 border border-grave p-4 space-y-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <label className="block font-mono text-xs text-gold uppercase tracking-wider font-bold">
                صورة خلفية البنر (رفع من الجهاز أو رابط)
              </label>
              <label className="cursor-pointer px-3.5 py-1.5 bg-gold text-[#0A0C16] hover:bg-gold-light transition-colors font-mono text-xs font-bold flex items-center gap-1.5 shadow">
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
              className="w-full bg-coal border border-grave px-3 py-2 text-bone focus:border-gold focus:outline-none font-mono text-xs"
              dir="ltr"
            />

            {/* Live Image Preview */}
            {formData.imageUrl && (
              <div className="pt-2">
                <span className="font-mono text-[11px] text-ash block mb-1">معاينة الصورة المرفوعة:</span>
                <div className="w-full h-36 bg-void border border-gold/40 relative overflow-hidden">
                  <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone/90 via-transparent to-transparent flex items-end p-3">
                    <span className="font-mono text-xs text-gold font-bold">معاينة خلفية البنر ✓</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Language Switcher Tabs for Editing Both Arabic and English */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-grave pb-2">
              <div className="flex items-center gap-2 font-mono text-xs text-gold font-bold">
                <Languages size={16} />
                <span>تعديل لغة النصوص:</span>
              </div>

              <div className="flex items-center gap-2 font-mono text-xs">
                <button
                  type="button"
                  onClick={() => setActiveLangTab('ar')}
                  className={`px-4 py-1.5 font-bold transition-all ${
                    activeLangTab === 'ar'
                      ? 'bg-gold text-[#0A0C16] shadow'
                      : 'bg-coal text-ash hover:text-bone border border-grave'
                  }`}
                >
                  🇪🇬 النصوص العربية (Arabic)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveLangTab('en')}
                  className={`px-4 py-1.5 font-bold transition-all ${
                    activeLangTab === 'en'
                      ? 'bg-gold text-[#0A0C16] shadow'
                      : 'bg-coal text-ash hover:text-bone border border-grave'
                  }`}
                >
                  🇬🇧 النصوص الإنجليزية (English)
                </button>
              </div>
            </div>

            {/* ARABIC FIELDS SECTION */}
            {activeLangTab === 'ar' && (
              <div className="space-y-4 bg-stone/20 p-4 border border-grave animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono text-xs text-gold uppercase tracking-wider mb-1 font-bold">
                      النص العلوي بالعربي (Eyebrow Arabic)
                    </label>
                    <input
                      type="text"
                      name="eyebrowAr"
                      value={formData.eyebrowAr}
                      onChange={handleChange}
                      placeholder="مثال: دوات / عرض خاص لفترة محدودة"
                      required
                      className="w-full bg-coal border border-grave px-3 py-2 text-bone focus:border-gold focus:outline-none text-sm"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-xs text-gold uppercase tracking-wider mb-1 font-bold">
                      شارة العرض بالعربي (Offer Badge Arabic)
                    </label>
                    <input
                      type="text"
                      name="badgeAr"
                      value={formData.badgeAr}
                      onChange={handleChange}
                      placeholder="مثال: خصم 30% OFF"
                      className="w-full bg-coal border border-grave px-3 py-2 text-bone focus:border-gold focus:outline-none text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono text-xs text-gold uppercase tracking-wider mb-1 font-bold">
                      العنوان الرئيسي (Headline 1 بالعربي)
                    </label>
                    <input
                      type="text"
                      name="headline1Ar"
                      value={formData.headline1Ar}
                      onChange={handleChange}
                      placeholder="مثال: صمم درعك الخاص"
                      required
                      className="w-full bg-coal border border-grave px-3 py-2 text-bone focus:border-gold focus:outline-none text-sm font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-xs text-gold uppercase tracking-wider mb-1 font-bold">
                      العنوان الفرعي (Headline 2 بالعربي)
                    </label>
                    <input
                      type="text"
                      name="headline2Ar"
                      value={formData.headline2Ar}
                      onChange={handleChange}
                      placeholder="مثال: بلمسة فرعونية فاخرة."
                      required
                      className="w-full bg-coal border border-grave px-3 py-2 text-bone focus:border-gold focus:outline-none text-sm font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-xs text-gold uppercase tracking-wider mb-1 font-bold">
                    الوصف والتفاصيل بالعربي (Description Arabic)
                  </label>
                  <textarea
                    name="subAr"
                    rows="2"
                    value={formData.subAr}
                    onChange={handleChange}
                    placeholder="اكتب وصف العرض أو الترويج هنا..."
                    className="w-full bg-coal border border-grave p-3 text-bone focus:border-gold focus:outline-none text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-grave/60 pt-3">
                  <div>
                    <label className="block font-mono text-xs text-gold uppercase tracking-wider mb-1 font-bold">
                      نص الزر الأول بالعربي (Primary Button AR)
                    </label>
                    <input
                      type="text"
                      name="ctaPrimaryTextAr"
                      value={formData.ctaPrimaryTextAr}
                      onChange={handleChange}
                      placeholder="مثال: ابدأ التصميم الآن"
                      className="w-full bg-coal border border-grave px-3 py-2 text-bone focus:border-gold text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-xs text-gold uppercase tracking-wider mb-1 font-bold">
                      نص الزر الثاني بالعربي (Secondary Button AR)
                    </label>
                    <input
                      type="text"
                      name="ctaSecondaryTextAr"
                      value={formData.ctaSecondaryTextAr}
                      onChange={handleChange}
                      placeholder="مثال: معرض الكتالوج"
                      className="w-full bg-coal border border-grave px-3 py-2 text-bone focus:border-gold text-xs"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ENGLISH FIELDS SECTION */}
            {activeLangTab === 'en' && (
              <div className="space-y-4 bg-stone/20 p-4 border border-grave animate-fade-in" dir="ltr">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono text-xs text-gold uppercase tracking-wider mb-1 font-bold">
                      Eyebrow Text (English)
                    </label>
                    <input
                      type="text"
                      name="eyebrowEn"
                      value={formData.eyebrowEn}
                      onChange={handleChange}
                      placeholder="e.g. DUAT / THE FORGE"
                      required
                      className="w-full bg-coal border border-grave px-3 py-2 text-bone focus:border-gold focus:outline-none text-sm"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-xs text-gold uppercase tracking-wider mb-1 font-bold">
                      Offer Badge (English)
                    </label>
                    <input
                      type="text"
                      name="badgeEn"
                      value={formData.badgeEn}
                      onChange={handleChange}
                      placeholder="e.g. OFFER 30% OFF"
                      className="w-full bg-coal border border-grave px-3 py-2 text-bone focus:border-gold focus:outline-none text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono text-xs text-gold uppercase tracking-wider mb-1 font-bold">
                      Headline 1 (English)
                    </label>
                    <input
                      type="text"
                      name="headline1En"
                      value={formData.headline1En}
                      onChange={handleChange}
                      placeholder="e.g. CRAFT YOUR OWN"
                      required
                      className="w-full bg-coal border border-grave px-3 py-2 text-bone focus:border-gold focus:outline-none text-sm font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-xs text-gold uppercase tracking-wider mb-1 font-bold">
                      Headline 2 (English)
                    </label>
                    <input
                      type="text"
                      name="headline2En"
                      value={formData.headline2En}
                      onChange={handleChange}
                      placeholder="e.g. CUSTOM ARMOR."
                      required
                      className="w-full bg-coal border border-grave px-3 py-2 text-bone focus:border-gold focus:outline-none text-sm font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-xs text-gold uppercase tracking-wider mb-1 font-bold">
                    Description Subtitle (English)
                  </label>
                  <textarea
                    name="subEn"
                    rows="2"
                    value={formData.subEn}
                    onChange={handleChange}
                    placeholder="Enter English description or offer details..."
                    className="w-full bg-coal border border-grave p-3 text-bone focus:border-gold focus:outline-none text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-grave/60 pt-3">
                  <div>
                    <label className="block font-mono text-xs text-gold uppercase tracking-wider mb-1 font-bold">
                      Primary Button Text (English)
                    </label>
                    <input
                      type="text"
                      name="ctaPrimaryTextEn"
                      value={formData.ctaPrimaryTextEn}
                      onChange={handleChange}
                      placeholder="e.g. START BUILDING"
                      className="w-full bg-coal border border-grave px-3 py-2 text-bone focus:border-gold text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-xs text-gold uppercase tracking-wider mb-1 font-bold">
                      Secondary Button Text (English)
                    </label>
                    <input
                      type="text"
                      name="ctaSecondaryTextEn"
                      value={formData.ctaSecondaryTextEn}
                      onChange={handleChange}
                      placeholder="e.g. VIEW GALLERY"
                      className="w-full bg-coal border border-grave px-3 py-2 text-bone focus:border-gold text-xs"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Links Target (Shared) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-stone/40 border border-grave p-4">
            <div>
              <label className="block font-mono text-xs text-gold uppercase tracking-wider mb-1 font-bold">
                رابط التوجه للزر الأول (Primary Link)
              </label>
              <select
                name="ctaPrimaryLink"
                value={formData.ctaPrimaryLink}
                onChange={handleChange}
                className="w-full bg-coal border border-grave px-3 py-2 text-bone font-mono text-xs"
                dir="ltr"
              >
                <option value="/customize">/customize (صفحة التخصيص والـ 3D)</option>
                <option value="/shop">/shop (المتجر والكتالوج)</option>
                <option value="/track-order">/track-order (تتبع الطلب)</option>
                <option value="/the-duat">/the-duat (عن دوات)</option>
              </select>
            </div>

            <div>
              <label className="block font-mono text-xs text-gold uppercase tracking-wider mb-1 font-bold">
                رابط التوجه للزر الثاني (Secondary Link)
              </label>
              <select
                name="ctaSecondaryLink"
                value={formData.ctaSecondaryLink}
                onChange={handleChange}
                className="w-full bg-coal border border-grave px-3 py-2 text-bone font-mono text-xs"
                dir="ltr"
              >
                <option value="/shop">/shop (المتجر والكتالوج)</option>
                <option value="/customize">/customize (صفحة التخصيص)</option>
                <option value="/track-order">/track-order (تتبع الطلب)</option>
                <option value="/the-duat">/the-duat (عن دوات)</option>
              </select>
            </div>
          </div>

          {/* Visibility Toggle Option */}
          <div className="bg-stone/40 border border-grave p-4">
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={Boolean(formData.is_active)}
                onChange={(e) => setFormData((prev) => ({ ...prev, is_active: e.target.checked }))}
                className="w-4 h-4 accent-gold cursor-pointer"
              />
              <div>
                <span className="font-bold text-bone text-sm block">إظهار البنر في الشاشة الرئيسية (Active)</span>
                <span className="text-xs text-ash block">عند إلغاء التحديد، سيتم إخفاء هذا البنر من الهوم بيدج للزوار دون حذفه.</span>
              </div>
            </label>
          </div>
        </div>

        {/* Fixed Form Actions Footer */}
        <div className="p-4 border-t border-grave bg-stone shrink-0 flex items-center justify-end gap-3 z-10">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 border border-grave text-ash hover:text-bone font-mono text-xs uppercase"
          >
            إلغاء
          </button>

          <button
            type="submit"
            className="px-6 py-2.5 bg-gold text-[#0A0C16] font-bold font-mono text-xs uppercase tracking-wider hover:bg-gold-light transition-all shadow-lg shadow-gold/20 flex items-center gap-2 ring-1 ring-gold"
          >
            <Save size={16} />
            <span>حفظ البنر ونشره فوراً</span>
          </button>
        </div>
      </form>
    </div>
  );
}
