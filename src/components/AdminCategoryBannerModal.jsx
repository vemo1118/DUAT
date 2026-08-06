import React, { useState, useEffect } from 'react';
import { X, Upload, Save, Image as ImageIcon, Loader2 } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export const AdminCategoryBannerModal = ({ isOpen, onClose, banner, onSave }) => {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    id: '',
    nameEn: '',
    nameAr: '',
    subtitleEn: '',
    subtitleAr: '',
    imageUrl: '',
    badge: '01',
    categoryLink: '/shop',
    is_active: true
  });

  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (banner) {
      setFormData({
        id: banner.id || '',
        nameEn: banner.nameEn || '',
        nameAr: banner.nameAr || '',
        subtitleEn: banner.subtitleEn || '',
        subtitleAr: banner.subtitleAr || '',
        imageUrl: banner.imageUrl || banner.image || '',
        badge: banner.badge || '01',
        categoryLink: banner.categoryLink || '/shop',
        is_active: banner.is_active !== undefined ? banner.is_active : true
      });
    }
  }, [banner]);

  if (!isOpen || !banner) return null;

  const isEditing = Boolean(banner && banner.id);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, imageUrl: reader.result }));
        setUploading(false);
        showToast('تم تحميل الصورة بنجاح 🖼️', 'success');
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('File upload error:', err);
      showToast('حدث خطأ أثناء رفع الصورة', 'error');
      setUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.imageUrl) {
      showToast('يرجى اختيار صورة للقسم', 'error');
      return;
    }
    if (!formData.nameAr && !formData.nameEn) {
      showToast('يرجى كتابة اسم للقسم', 'error');
      return;
    }
    onSave(banner.id, formData);
    showToast(isEditing ? 'تم تحديث كارت القسم بنجاح ✨' : 'تم إضافة كارت القسم الجديد بنجاح ✨', 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-void/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-stone border border-grave w-full max-w-2xl rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-grave flex items-center justify-between bg-coal">
          <div className="flex items-center gap-2 text-gold">
            <ImageIcon size={20} />
            <h3 className="font-clash text-lg uppercase font-bold text-bone">
              {isEditing ? `تعديل صورة وكارت القسم (${formData.nameEn || formData.id})` : 'إضافة كارت قسم جديد 🎨'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-ash hover:text-bone p-1 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto custom-scrollbar flex-1">
          {/* Image Preview & Upload Box */}
          <div className="space-y-2">
            <label className="font-mono text-xs text-gold uppercase tracking-wider block font-bold">
              صورة القسم (Category Banner Image)
            </label>
            <div className="relative h-48 bg-coal border-2 border-dashed border-grave hover:border-gold rounded-lg flex flex-col items-center justify-center overflow-hidden group transition-colors">
              {formData.imageUrl ? (
                <>
                  <img
                    src={formData.imageUrl}
                    alt="Category Banner Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-void/70 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity gap-2">
                    <label className="btn-primary px-4 py-2 text-xs font-mono font-bold cursor-pointer flex items-center gap-2">
                      <Upload size={16} />
                      <span>تغيير الصورة 🖼️</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </>
              ) : (
                <label className="flex flex-col items-center justify-center cursor-pointer p-4 text-center space-y-2">
                  <ImageIcon size={36} className="text-ash" />
                  <span className="font-mono text-xs text-bone font-bold">اضغط لرفع صورة جديدة للقسم</span>
                  <span className="font-mono text-[10px] text-ash">تنسيقات مدعومة: PNG, JPG, WebP</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              )}
              {uploading && (
                <div className="absolute inset-0 bg-void/80 flex items-center justify-center gap-2 text-gold font-mono text-xs">
                  <Loader2 size={24} className="animate-spin" />
                  <span>جاري المعالجة...</span>
                </div>
              )}
            </div>
          </div>

          {/* Image URL Direct Input */}
          <div className="space-y-1">
            <label className="font-mono text-xs text-ash block">أو رابط الصورة المباشر (Image URL):</label>
            <input
              type="text"
              value={formData.imageUrl}
              onChange={(e) => setFormData((prev) => ({ ...prev, imageUrl: e.target.value }))}
              placeholder="https://..."
              className="w-full bg-coal border border-grave text-bone p-3 font-space text-xs focus:border-gold outline-none rounded"
            />
          </div>

          {/* Titles Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-mono text-xs text-gold font-bold block">اسم القسم بالإنجليزي (Title EN):</label>
              <input
                type="text"
                value={formData.nameEn}
                onChange={(e) => setFormData((prev) => ({ ...prev, nameEn: e.target.value }))}
                placeholder="LUXURY CASES"
                className="w-full bg-coal border border-grave text-bone p-3 font-space text-xs focus:border-gold outline-none rounded"
              />
            </div>
            <div className="space-y-1">
              <label className="font-mono text-xs text-gold font-bold block">اسم القسم بالعربي (Title AR):</label>
              <input
                type="text"
                value={formData.nameAr}
                onChange={(e) => setFormData((prev) => ({ ...prev, nameAr: e.target.value }))}
                placeholder="الجرابات الفاخرة"
                className="w-full bg-coal border border-grave text-bone p-3 font-space text-xs focus:border-gold outline-none rounded"
              />
            </div>
          </div>

          {/* Subtitles Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-mono text-xs text-ash block">الوصف الفرعي بالإنجليزي (Subtitle EN):</label>
              <input
                type="text"
                value={formData.subtitleEn}
                onChange={(e) => setFormData((prev) => ({ ...prev, subtitleEn: e.target.value }))}
                placeholder="Case + 6 DUAT stickers, made to order"
                className="w-full bg-coal border border-grave text-bone p-3 font-space text-xs focus:border-gold outline-none rounded"
              />
            </div>
            <div className="space-y-1">
              <label className="font-mono text-xs text-ash block">الوصف الفرعي بالعربي (Subtitle AR):</label>
              <input
                type="text"
                value={formData.subtitleAr}
                onChange={(e) => setFormData((prev) => ({ ...prev, subtitleAr: e.target.value }))}
                placeholder="جراب + ٦ استيكرات دوات، حسب الطلب"
                className="w-full bg-coal border border-grave text-bone p-3 font-space text-xs focus:border-gold outline-none rounded"
              />
            </div>
          </div>

          {/* Badge & Link Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-mono text-xs text-ash block">رقم الشارة (Badge e.g. 01, 02):</label>
              <input
                type="text"
                value={formData.badge}
                onChange={(e) => setFormData((prev) => ({ ...prev, badge: e.target.value }))}
                placeholder="01"
                className="w-full bg-coal border border-grave text-bone p-3 font-space text-xs focus:border-gold outline-none rounded"
              />
            </div>
            <div className="space-y-1">
              <label className="font-mono text-xs text-ash block">رابط القسم (Category Link e.g. /shop):</label>
              <input
                type="text"
                value={formData.categoryLink}
                onChange={(e) => setFormData((prev) => ({ ...prev, categoryLink: e.target.value }))}
                placeholder="/shop"
                className="w-full bg-coal border border-grave text-bone p-3 font-space text-xs focus:border-gold outline-none rounded"
              />
            </div>
          </div>

          {/* Active Toggle */}
          <div className="flex items-center gap-3 p-3 bg-coal border border-grave rounded">
            <input
              type="checkbox"
              id="category_is_active"
              checked={formData.is_active}
              onChange={(e) => setFormData((prev) => ({ ...prev, is_active: e.target.checked }))}
              className="w-4 h-4 accent-gold cursor-pointer"
            />
            <label htmlFor="category_is_active" className="font-mono text-xs text-bone font-bold cursor-pointer">
              إظهار كارت القسم في الصفحة الرئيسية (Active)
            </label>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-grave flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-coal text-ash hover:text-bone border border-grave font-mono text-xs uppercase"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="btn-primary px-6 py-2.5 font-mono text-xs uppercase font-bold flex items-center gap-2"
            >
              <Save size={16} />
              <span>حفظ التغييرات 💾</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
