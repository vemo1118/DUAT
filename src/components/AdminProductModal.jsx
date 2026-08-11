import React, { useState, useEffect } from 'react';
import { X, Save, Plus, Sparkles, Tag, Gift, Check, Eye } from 'lucide-react';
import { CATEGORIES, CASE_TYPES } from '../data/products';

export function AdminProductModal({ isOpen, onClose, onSave, productToEdit = null }) {
  const [formData, setFormData] = useState({
    id: '',
    category: 'bundles',
    nameEn: '',
    nameAr: '',
    price: 450,
    originalPrice: 600,
    savings: 150,
    imageUrl: '',
    optionsText: '',
    tagEn: 'Bundle Discount • Save 150 EGP',
    tagAr: 'خصم البندل • توفير ١٥٠ ج.م',
    craftTagEn: 'Collector Box • Egypt Craft',
    craftTagAr: 'علبة هدايا خاصة • صنع في مصر',
    descriptionEn: '',
    descriptionAr: '',
    caseTypeId: 'clear',
    specsEnText: '',
    specsArText: ''
  });

  useEffect(() => {
    if (productToEdit) {
      const p = productToEdit;
      const curPrice = p.price !== undefined ? p.price : 0;
      const origPrice = p.originalPrice !== undefined ? p.originalPrice : (curPrice ? Math.round(curPrice * 1.3) : 0);
      const savingsVal = p.savings !== undefined
        ? p.savings
        : (origPrice && origPrice > curPrice ? origPrice - curPrice : 0);

      setFormData({
        id: p.id || '',
        category: p.category || 'bundles',
        nameEn: p.nameEn || '',
        nameAr: p.nameAr || '',
        price: curPrice,
        originalPrice: origPrice,
        savings: savingsVal,
        imageUrl: p.imageUrl || p.image || '',
        optionsText: Array.isArray(p.options) ? p.options.join(', ') : '',
        tagEn: p.tagEn || '',
        tagAr: p.tagAr || '',
        craftTagEn: p.craftTagEn || (p.category === 'bundles' ? 'Collector Box • Egypt Craft' : 'Ships in 3–5 Days • Egypt Craft'),
        craftTagAr: p.craftTagAr || (p.category === 'bundles' ? 'علبة هدايا خاصة • صنع في مصر' : 'يُشحن خلال ٣-٥ أيام • تشطيب مصري'),
        descriptionEn: p.descriptionEn || '',
        descriptionAr: p.descriptionAr || '',
        caseTypeId: p.caseTypeId || 'clear',
        specsEnText: Array.isArray(p.specsEn) ? p.specsEn.join('\n') : '',
        specsArText: Array.isArray(p.specsAr) ? p.specsAr.join('\n') : ''
      });
    } else {
      setFormData({
        id: '',
        category: 'bundles',
        nameEn: '',
        nameAr: '',
        price: 450,
        originalPrice: 600,
        savings: 150,
        imageUrl: '',
        optionsText: '',
        tagEn: 'Bundle Discount • Save 150 EGP',
        tagAr: 'خصم البندل • توفير ١٥٠ ج.م',
        craftTagEn: 'Collector Box • Egypt Craft',
        craftTagAr: 'علبة هدايا خاصة • صنع في مصر',
        descriptionEn: '',
        descriptionAr: '',
        caseTypeId: 'clear',
        specsEnText: 'Includes: 3D Epoxy Stickers Set\nSave 150 EGP vs Individual Purchase\nCollector Gift Packaging Included',
        specsArText: 'تتضمن: طقم استيكرات إيبوكسي مجسمة\nتوفير ١٥٠ ج.م عن الشراء المنفرد\nتأتي داخل علبة هدايا فاخرة'
      });
    }
  }, [productToEdit, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const next = { ...prev, [name]: value };
      if (name === 'price' || name === 'originalPrice') {
        const p = Number(name === 'price' ? value : prev.price);
        const op = Number(name === 'originalPrice' ? value : prev.originalPrice);
        if (op > p) {
          next.savings = op - p;
        }
      }
      return next;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Convert specs & options text to arrays
    const specsEn = formData.specsEnText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const specsAr = formData.specsArText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const options = formData.optionsText
      .split(',')
      .map((o) => o.trim())
      .filter(Boolean);

    const img = formData.imageUrl || '';
    const curPrice = Number(formData.price) || 0;
    const origPrice = Number(formData.originalPrice) || curPrice;
    const savingsVal = formData.savings !== '' && formData.savings !== undefined
      ? Number(formData.savings)
      : Math.max(0, origPrice - curPrice);

    const payload = {
      ...formData,
      id: formData.id || (formData.category === 'bundles' ? `bundle-${Date.now()}` : `prod-${Date.now()}`),
      imageUrl: img,
      image: img,
      images: img ? [img] : [],
      price: curPrice,
      originalPrice: origPrice,
      savings: savingsVal,
      options,
      specsEn,
      specsAr
    };

    delete payload.specsEnText;
    delete payload.specsArText;
    delete payload.optionsText;

    onSave(payload);
    onClose();
  };

  const specsListAr = formData.specsArText.split('\n').map(s => s.trim()).filter(Boolean);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-void/85 backdrop-blur-md overflow-hidden animate-fade-in" dir="rtl">
      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-4xl h-full max-h-[92vh] bg-stone border border-gold/40 shadow-2xl flex flex-col overflow-hidden my-auto"
      >
        {/* Top Decorative Border */}
        <div className="h-1 w-full bg-gradient-to-r from-gold/20 via-gold to-gold/20 shrink-0" />

        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-grave bg-stone shrink-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded border border-gold/50 flex items-center justify-center bg-gold/10 text-gold">
              {formData.category === 'bundles' ? <Gift size={18} /> : <Sparkles size={16} />}
            </div>
            <div>
              <h2 className="font-clash text-lg sm:text-xl font-bold tracking-wide text-bone">
                {productToEdit ? (formData.category === 'bundles' ? 'تعديل بيانات البندل والعرض' : 'تعديل بيانات المنتج') : (formData.category === 'bundles' ? 'إضافة بندل / عرض جديد 🎁' : 'إضافة منتج جديد')}
              </h2>
              <p className="font-mono text-xs text-ash">
                {productToEdit ? `ID: ${productToEdit.id}` : 'أدخل بيانات، سعر، ووسومات البندل أدناه'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-ash hover:text-gold border border-transparent hover:border-grave bg-stone/50 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 text-right">
          
          {/* Categorization, Price, Savings */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 bg-stone/40 border border-grave p-4">
            <div>
              <label className="block font-mono text-xs text-gold uppercase tracking-wider mb-2 font-bold">
                التصنيف (Category)
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full bg-stone border border-grave px-3 py-2 text-bone focus:border-gold focus:outline-none font-mono text-sm font-bold"
              >
                {CATEGORIES.filter((c) => c.id !== 'all').map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.id === 'bundles' ? '🎁 BUNDLES (البندلات والعروض)' : cat.id.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-mono text-xs text-gold uppercase tracking-wider mb-2 font-bold">
                سعر البيع / البندل (Price EGP)
              </label>
              <input
                type="number"
                name="price"
                min="0"
                step="10"
                value={formData.price}
                onChange={handleChange}
                required
                className="w-full bg-stone border border-grave px-3 py-2 text-bone focus:border-gold focus:outline-none font-mono text-sm font-bold"
              />
            </div>

            <div>
              <label className="block font-mono text-xs text-ash uppercase tracking-wider mb-2">
                السعر الأصلي قبل الخصم (Original Price)
              </label>
              <input
                type="number"
                name="originalPrice"
                min="0"
                step="10"
                value={formData.originalPrice}
                onChange={handleChange}
                placeholder="مثال: 600"
                className="w-full bg-stone border border-grave px-3 py-2 text-bone focus:border-gold focus:outline-none font-mono text-sm"
              />
            </div>

            <div>
              <label className="block font-mono text-xs text-emerald-400 uppercase tracking-wider mb-2 font-bold">
                مبلغ التوفير (Savings EGP)
              </label>
              <input
                type="number"
                name="savings"
                min="0"
                step="5"
                value={formData.savings}
                onChange={handleChange}
                placeholder="مثال: 150"
                className="w-full bg-stone border border-emerald-500/50 px-3 py-2 text-emerald-400 font-bold focus:border-emerald-400 focus:outline-none font-mono text-sm"
              />
              <p className="font-mono text-[10px] text-ash mt-1">يظهر بشارة: "توفير {formData.savings || 0} ج.م"</p>
            </div>
          </div>

          {/* Special Bundle Banner Options */}
          {formData.category === 'bundles' && (
            <div className="bg-gradient-to-r from-gold/10 via-stone to-gold/10 border border-gold/40 p-4 space-y-4 rounded">
              <div className="flex items-center gap-2 text-gold font-mono text-xs font-bold uppercase tracking-wider">
                <Gift size={16} />
                <span>إعدادات البندل والتغليف وشارات الخصم (Bundle Badges & Packaging)</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-xs text-gold uppercase tracking-wider mb-1">
                    وسم البندل بالعربية (Bundle Eyebrow Tag AR)
                  </label>
                  <input
                    type="text"
                    name="tagAr"
                    value={formData.tagAr}
                    onChange={handleChange}
                    placeholder="مثال: خصم البندل • توفير ١٥٠ ج.م"
                    className="w-full bg-stone border border-grave px-3 py-2 text-bone focus:border-gold focus:outline-none text-xs text-right"
                    dir="rtl"
                  />
                </div>
                <div>
                  <label className="block font-mono text-xs text-gold uppercase tracking-wider mb-1">
                    وسم البندل بالإنجليزية (Bundle Eyebrow Tag EN)
                  </label>
                  <input
                    type="text"
                    name="tagEn"
                    value={formData.tagEn}
                    onChange={handleChange}
                    placeholder="Example: BUNDLE DISCOUNT • SAVE 150 EGP"
                    className="w-full bg-stone border border-grave px-3 py-2 text-bone focus:border-gold focus:outline-none text-xs"
                    dir="ltr"
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs text-ash uppercase tracking-wider mb-1">
                    شارة التغليف بالعربية (Craft Tag AR)
                  </label>
                  <input
                    type="text"
                    name="craftTagAr"
                    value={formData.craftTagAr}
                    onChange={handleChange}
                    placeholder="علبة هدايا خاصة • صنع في مصر"
                    className="w-full bg-stone border border-grave px-3 py-2 text-bone focus:border-gold focus:outline-none text-xs text-right"
                    dir="rtl"
                  />
                </div>
                <div>
                  <label className="block font-mono text-xs text-ash uppercase tracking-wider mb-1">
                    شارة التغليف بالإنجليزية (Craft Tag EN)
                  </label>
                  <input
                    type="text"
                    name="craftTagEn"
                    value={formData.craftTagEn}
                    onChange={handleChange}
                    placeholder="Collector Box • Egypt Craft"
                    className="w-full bg-stone border border-grave px-3 py-2 text-bone focus:border-gold focus:outline-none text-xs"
                    dir="ltr"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Product Names (AR & EN) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-xs text-gold uppercase tracking-wider mb-2 font-bold">
                اسم البندل / المنتج بالعربية (Name Ar)
              </label>
              <input
                type="text"
                name="nameAr"
                value={formData.nameAr}
                onChange={handleChange}
                required
                placeholder="مثال: باكدج العبور الكاملة (٦ استيكرات)"
                className="w-full bg-stone border border-grave px-3 py-2 text-bone focus:border-gold focus:outline-none text-sm text-right font-bold"
                dir="rtl"
              />
            </div>

            <div>
              <label className="block font-mono text-xs text-gold uppercase tracking-wider mb-2 font-bold">
                اسم البندل / المنتج بالإنجليزية (Name En)
              </label>
              <input
                type="text"
                name="nameEn"
                value={formData.nameEn}
                onChange={handleChange}
                required
                placeholder="Example: THE PASSAGE PACK (6 STICKERS)"
                className="w-full bg-stone border border-grave px-3 py-2 text-bone focus:border-gold focus:outline-none text-sm font-bold"
                dir="ltr"
              />
            </div>
          </div>

          {/* Product Image URL & Local Upload with Live Thumbnail Preview */}
          <div className="bg-stone/30 border border-grave p-4 space-y-3">
            <div className="flex items-center justify-between">
              <label className="block font-mono text-xs text-gold uppercase tracking-wider font-bold">
                صورة البندل / المنتج (رابط مباشر أو رفع من جهازك)
              </label>
              <label className="cursor-pointer px-3 py-1 bg-gold/10 border border-gold/40 text-gold hover:bg-gold hover:text-void transition-colors font-mono text-xs font-bold">
                <span>📁 رفع صورة من الموبايل / الكمبيوتر</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setFormData((prev) => ({ ...prev, imageUrl: reader.result }));
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </label>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 items-center">
              <input
                type="text"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                placeholder="https://res.cloudinary.com/... أو اختر صورة من جهازك"
                className="w-full bg-stone border border-grave px-3 py-2 text-bone focus:border-gold focus:outline-none font-mono text-xs"
                dir="ltr"
              />
              {formData.imageUrl ? (
                <div className="w-14 h-14 border border-gold shrink-0 overflow-hidden bg-stone">
                  <img
                    src={formData.imageUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-14 h-14 border border-dashed border-grave shrink-0 flex items-center justify-center font-mono text-[10px] text-ash bg-stone/40">
                  لا صورة
                </div>
              )}
            </div>
          </div>

          {/* Descriptions (AR & EN) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-xs text-ash uppercase tracking-wider mb-2">
                الوصف بالعربية (Description Ar)
              </label>
              <textarea
                name="descriptionAr"
                rows="3"
                value={formData.descriptionAr}
                onChange={handleChange}
                placeholder="المجموعة الكاملة المكونة من ٦ ملصقات إيبوكسي مجسمة من دوات في علبة فاخرة..."
                className="w-full bg-stone border border-grave p-3 text-bone focus:border-gold focus:outline-none text-sm text-right resize-none"
                dir="rtl"
              />
            </div>

            <div>
              <label className="block font-mono text-xs text-ash uppercase tracking-wider mb-2">
                الوصف بالإنجليزية (Description En)
              </label>
              <textarea
                name="descriptionEn"
                rows="3"
                value={formData.descriptionEn}
                onChange={handleChange}
                placeholder="The complete DUAT 6-sticker collector set featuring all raised 3D epoxy slogan pills..."
                className="w-full bg-stone border border-grave p-3 text-bone focus:border-gold focus:outline-none text-sm resize-none"
                dir="ltr"
              />
            </div>
          </div>

          {/* Specifications list (newline separated) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-xs text-gold uppercase tracking-wider mb-2 font-bold">
                محتويات ونقاط البندل بالعربية (سطر لكل نقطة)
              </label>
              <textarea
                name="specsArText"
                rows="4"
                value={formData.specsArText}
                onChange={handleChange}
                placeholder="تتضمن: جميع ملصقات دوات الـ ٦ المجسمة&#10;توفير ١٥٠ ج.م عن الشراء المنفرد&#10;تأتي داخل علبة هدايا فاخرة"
                className="w-full bg-stone border border-grave p-3 text-bone focus:border-gold focus:outline-none font-mono text-xs text-right resize-none"
                dir="rtl"
              />
            </div>

            <div>
              <label className="block font-mono text-xs text-gold uppercase tracking-wider mb-2 font-bold">
                محتويات ونقاط البندل بالإنجليزية (سطر لكل نقطة)
              </label>
              <textarea
                name="specsEnText"
                rows="4"
                value={formData.specsEnText}
                onChange={handleChange}
                placeholder="Includes: All 6 DUAT 3D Epoxy Stickers&#10;Save 150 EGP vs Individual Purchase&#10;Collector Gift Packaging Included"
                className="w-full bg-stone border border-grave p-3 text-bone focus:border-gold focus:outline-none font-mono text-xs resize-none"
                dir="ltr"
              />
            </div>
          </div>

          {/* LIVE CARD PREVIEW PREVIEW BOX */}
          <div className="pt-4 border-t border-grave">
            <div className="flex items-center gap-2 mb-3 text-gold font-mono text-xs font-bold uppercase tracking-wider">
              <Eye size={16} />
              <span>معاينة حية لكارت البندل كما يظهر للعميل ف المتجر (Live Bundle Card Preview)</span>
            </div>
            
            <div className="max-w-md mx-auto bg-stone border border-gold/60 overflow-hidden relative shadow-2xl p-4 space-y-4">
              {/* Savings Badge */}
              {Number(formData.savings) > 0 && (
                <div className="absolute top-6 right-6 z-20 bg-gold text-[#0A0C16] font-mono font-bold text-xs uppercase px-3 py-1.5 shadow-lg flex items-center gap-1.5">
                  <Tag size={13} />
                  <span>توفير {formData.savings} ج.م</span>
                </div>
              )}

              {/* Image */}
              <div className="relative aspect-square overflow-hidden bg-void/50 border border-grave">
                {formData.imageUrl ? (
                  <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-mono text-xs text-ash">
                    معاينة الصورة
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="space-y-3">
                <div className="font-mono text-[11px] uppercase tracking-wider text-gold flex items-center gap-1.5">
                  <Sparkles size={12} />
                  <span>{formData.tagAr || formData.tagEn || 'وسم الخصم'}</span>
                </div>

                <h3 className="font-clash text-xl uppercase text-bone font-bold">
                  {formData.nameAr || formData.nameEn || 'اسم البندل هنا'}
                </h3>

                <p className="font-space text-xs text-bone/70 leading-relaxed">
                  {formData.descriptionAr || formData.descriptionEn || 'وصف البندل يظهر هنا بشكل واضح...'}
                </p>

                {specsListAr.length > 0 && (
                  <ul className="space-y-1 pt-2 border-t border-grave/40">
                    {specsListAr.map((s, i) => (
                      <li key={i} className="flex items-center gap-2 font-space text-[11px] text-ash">
                        <Check size={13} className="text-gold shrink-0" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                )}

                <div className="pt-3 border-t border-grave flex items-baseline justify-between">
                  <div className="flex items-baseline gap-2 font-mono">
                    <span className="text-xl font-bold text-gold">{formData.price || 0} ج.م</span>
                    {formData.originalPrice > formData.price && (
                      <span className="text-xs text-ash line-through">{formData.originalPrice} ج.م</span>
                    )}
                  </div>
                  <span className="font-mono text-[10px] text-emerald-400 uppercase tracking-wider font-bold">
                    {formData.craftTagAr || 'شامل الهدية'}
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Fixed Footer Actions */}
        <div className="p-4 border-t border-grave bg-stone shrink-0 flex items-center justify-end gap-3 z-10">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 border border-grave text-ash hover:text-bone hover:border-gold/50 transition-colors font-mono text-xs uppercase"
          >
            إلغاء
          </button>
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 bg-gold text-[#050505] font-bold font-mono text-xs uppercase tracking-wider hover:bg-gold-light transition-colors shadow-lg shadow-gold/20"
          >
            <Save size={16} />
            <span>{productToEdit ? 'حفظ التعديلات' : 'إضافة البندل / المنتج'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
