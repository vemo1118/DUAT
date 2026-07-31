import React, { useState, useEffect } from 'react';
import { X, Save, Plus, Sparkles } from 'lucide-react';
import { CATEGORIES, CASE_TYPES } from '../data/products';

export function AdminProductModal({ isOpen, onClose, onSave, productToEdit = null }) {
  const [formData, setFormData] = useState({
    id: '',
    category: 'cases',
    nameEn: '',
    nameAr: '',
    price: 500,
    imageUrl: '',
    tagEn: '',
    tagAr: '',
    craftTagEn: 'Ships in 3–5 Days • Egypt Craft',
    craftTagAr: 'يُشحن خلال ٣-٥ أيام • تشطيب مصري',
    descriptionEn: '',
    descriptionAr: '',
    caseTypeId: 'clear',
    specsEnText: '',
    specsArText: ''
  });

  useEffect(() => {
    if (productToEdit) {
      setFormData({
        id: productToEdit.id || '',
        category: productToEdit.category || 'cases',
        nameEn: productToEdit.nameEn || '',
        nameAr: productToEdit.nameAr || '',
        price: productToEdit.price || 0,
        imageUrl: productToEdit.imageUrl || productToEdit.image || '',
        tagEn: productToEdit.tagEn || '',
        tagAr: productToEdit.tagAr || '',
        craftTagEn: productToEdit.craftTagEn || '',
        craftTagAr: productToEdit.craftTagAr || '',
        descriptionEn: productToEdit.descriptionEn || '',
        descriptionAr: productToEdit.descriptionAr || '',
        caseTypeId: productToEdit.caseTypeId || 'clear',
        specsEnText: Array.isArray(productToEdit.specsEn) ? productToEdit.specsEn.join('\n') : '',
        specsArText: Array.isArray(productToEdit.specsAr) ? productToEdit.specsAr.join('\n') : ''
      });
    } else {
      setFormData({
        id: '',
        category: 'cases',
        nameEn: '',
        nameAr: '',
        price: 500,
        imageUrl: '',
        tagEn: '',
        tagAr: '',
        craftTagEn: 'Ships in 3–5 Days • Egypt Craft',
        craftTagAr: 'يُشحن خلال ٣-٥ أيام • تشطيب مصري',
        descriptionEn: '',
        descriptionAr: '',
        caseTypeId: 'clear',
        specsEnText: 'Material: Premium Polycarbonate\nFinish: Soft-Touch\nWarranty: 1 Year',
        specsArText: 'المادة: بوليكاربونات فاخر\nالنهاية: لمسة ناعمة\nالضمان: سنة استبدال'
      });
    }
  }, [productToEdit, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Convert specs text to arrays
    const specsEn = formData.specsEnText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const specsAr = formData.specsArText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const payload = {
      ...formData,
      price: Number(formData.price),
      specsEn,
      specsAr
    };

    delete payload.specsEnText;
    delete payload.specsArText;

    onSave(payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-void/85 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-3xl bg-stone border border-gold/40 shadow-2xl my-8 overflow-hidden">
        {/* Top Decorative Border */}
        <div className="h-1 w-full bg-gradient-to-r from-gold/20 via-gold to-gold/20" />

        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-grave bg-stone/40">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded border border-gold/50 flex items-center justify-center bg-gold/10 text-gold">
              <Sparkles size={16} />
            </div>
            <div>
              <h2 className="font-clash text-xl font-bold tracking-wide text-bone">
                {productToEdit ? 'تعديل بيانات المنتج' : 'إضافة منتج جديد'}
              </h2>
              <p className="font-mono text-xs text-ash">
                {productToEdit ? `ID: ${productToEdit.id}` : 'أدخل مواصفات وفئة المنتج أدناه'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-ash hover:text-gold border border-transparent hover:border-grave bg-stone/50 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto font-sans">
          {/* Categorization & Price */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block font-mono text-xs text-gold uppercase tracking-wider mb-2">
                التصنيف (Category)
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full bg-stone border border-grave px-3 py-2 text-bone focus:border-gold focus:outline-none font-mono text-sm"
              >
                {CATEGORIES.filter((c) => c.id !== 'all').map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.id.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-mono text-xs text-gold uppercase tracking-wider mb-2">
                السعر بالجنيه (Price EGP)
              </label>
              <input
                type="number"
                name="price"
                min="0"
                step="10"
                value={formData.price}
                onChange={handleChange}
                required
                className="w-full bg-stone border border-grave px-3 py-2 text-bone focus:border-gold focus:outline-none font-mono text-sm"
              />
            </div>

            {formData.category === 'cases' && (
              <div>
                <label className="block font-mono text-xs text-gold uppercase tracking-wider mb-2">
                  نوع التقفيل (Case Finish)
                </label>
                <select
                  name="caseTypeId"
                  value={formData.caseTypeId}
                  onChange={handleChange}
                  className="w-full bg-stone border border-grave px-3 py-2 text-bone focus:border-gold focus:outline-none font-mono text-sm"
                >
                  {CASE_TYPES.map((ct) => (
                    <option key={ct.id} value={ct.id}>
                      {ct.nameAr} ({ct.nameEn})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Product Image URL & Local Upload with Live Thumbnail Preview */}
          <div className="bg-stone/30 border border-grave p-4 space-y-3">
            <div className="flex items-center justify-between">
              <label className="block font-mono text-xs text-gold uppercase tracking-wider">
                صورة المنتج (رابط أونلاين أو رفع من الجهاز)
              </label>
              <label className="cursor-pointer px-3 py-1 bg-gold/10 border border-gold/40 text-gold hover:bg-gold hover:text-void transition-colors font-mono text-xs">
                <span>📁 رفع صورة من الجهاز</span>
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
                placeholder="https://example.com/image.png أو قم برفع صورة..."
                className="w-full bg-stone border border-grave px-3 py-2 text-bone focus:border-gold focus:outline-none font-mono text-xs"
                dir="ltr"
              />
              {formData.imageUrl ? (
                <div className="w-12 h-12 border border-gold shrink-0 overflow-hidden bg-stone">
                  <img
                    src={formData.imageUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-12 h-12 border border-dashed border-grave shrink-0 flex items-center justify-center font-mono text-[10px] text-ash bg-stone/40">
                  لا صورة
                </div>
              )}
            </div>
            <p className="font-mono text-[11px] text-ash">
              يمكنك رفع أي صورة من هاتفك/جهازك أو لصق رابط أونلاين مباشر.
            </p>
          </div>

          {/* Product Names (AR & EN) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-xs text-ash uppercase tracking-wider mb-2">
                الاسم باللغة العربية (Name Ar)
              </label>
              <input
                type="text"
                name="nameAr"
                value={formData.nameAr}
                onChange={handleChange}
                required
                placeholder="مثال: جراب الشمسي الذهبي"
                className="w-full bg-stone border border-grave px-3 py-2 text-bone focus:border-gold focus:outline-none text-sm text-right"
                dir="rtl"
              />
            </div>

            <div>
              <label className="block font-mono text-xs text-ash uppercase tracking-wider mb-2">
                الاسم باللغة الإنجليزية (Name En)
              </label>
              <input
                type="text"
                name="nameEn"
                value={formData.nameEn}
                onChange={handleChange}
                required
                placeholder="Example: Gold Solar Armor Case"
                className="w-full bg-stone border border-grave px-3 py-2 text-bone focus:border-gold focus:outline-none text-sm"
                dir="ltr"
              />
            </div>
          </div>

          {/* Tags (AR & EN) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-xs text-ash uppercase tracking-wider mb-2">
                الوسم السريع بالعربية (Badge Tag Ar)
              </label>
              <input
                type="text"
                name="tagAr"
                value={formData.tagAr}
                onChange={handleChange}
                placeholder="مثال: إطار ذهب ١٨ + ماج سيف"
                className="w-full bg-stone border border-grave px-3 py-2 text-bone focus:border-gold focus:outline-none text-sm text-right"
                dir="rtl"
              />
            </div>

            <div>
              <label className="block font-mono text-xs text-ash uppercase tracking-wider mb-2">
                الوسم السريع بالإنجليزية (Badge Tag En)
              </label>
              <input
                type="text"
                name="tagEn"
                value={formData.tagEn}
                onChange={handleChange}
                placeholder="Example: 18k Gold Bezel + MagSafe"
                className="w-full bg-stone border border-grave px-3 py-2 text-bone focus:border-gold focus:outline-none text-sm"
                dir="ltr"
              />
            </div>
          </div>

          {/* Craft Badges (AR & EN) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-xs text-ash uppercase tracking-wider mb-2">
                وسم الشحن والصناعة بالعربية (Craft Tag Ar)
              </label>
              <input
                type="text"
                name="craftTagAr"
                value={formData.craftTagAr}
                onChange={handleChange}
                placeholder="يُشحن خلال ٣-٥ أيام • تشطيب مصري"
                className="w-full bg-stone border border-grave px-3 py-2 text-bone focus:border-gold focus:outline-none text-sm text-right"
                dir="rtl"
              />
            </div>

            <div>
              <label className="block font-mono text-xs text-ash uppercase tracking-wider mb-2">
                وسم الشحن والصناعة بالإنجليزية (Craft Tag En)
              </label>
              <input
                type="text"
                name="craftTagEn"
                value={formData.craftTagEn}
                onChange={handleChange}
                placeholder="Ships in 3–5 Days • Egypt Craft"
                className="w-full bg-stone border border-grave px-3 py-2 text-bone focus:border-gold focus:outline-none text-sm"
                dir="ltr"
              />
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
                placeholder="وصف تفصيلي للمنتج وخاماته..."
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
                placeholder="Detailed product description..."
                className="w-full bg-stone border border-grave p-3 text-bone focus:border-gold focus:outline-none text-sm resize-none"
                dir="ltr"
              />
            </div>
          </div>

          {/* Specifications list (newline separated) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-xs text-ash uppercase tracking-wider mb-2">
                المواصفات بالعربية (سطر لكل نقطة)
              </label>
              <textarea
                name="specsArText"
                rows="4"
                value={formData.specsArText}
                onChange={handleChange}
                placeholder="المادة: بوليكاربونات&#10;الوزن: ٤٠ جرام&#10;الضمان: سنة استبدال"
                className="w-full bg-stone border border-grave p-3 text-bone focus:border-gold focus:outline-none font-mono text-xs text-right resize-none"
                dir="rtl"
              />
            </div>

            <div>
              <label className="block font-mono text-xs text-ash uppercase tracking-wider mb-2">
                المواصفات بالإنجليزية (سطر لكل نقطة)
              </label>
              <textarea
                name="specsEnText"
                rows="4"
                value={formData.specsEnText}
                onChange={handleChange}
                placeholder="Material: High-Density Polycarbonate&#10;Weight: 40g&#10;Warranty: 1 Year Replacement"
                className="w-full bg-stone border border-grave p-3 text-bone focus:border-gold focus:outline-none font-mono text-xs resize-none"
                dir="ltr"
              />
            </div>
          </div>

          {/* Submit Actions */}
          <div className="flex items-center justify-end gap-4 pt-4 border-t border-grave">
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
              <span>{productToEdit ? 'حفظ التعديلات' : 'إضافة المنتج'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
