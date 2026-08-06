import React, { useState, useEffect } from 'react';
import { X, Upload, Save, Sparkles, Image as ImageIcon, Loader2 } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export const AdminBuilderStickerModal = ({ isOpen, onClose, stickerToEdit, onSave }) => {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    id: '',
    nameEn: '',
    nameAr: '',
    tagEn: '3D EPOXY DOME SLOGAN',
    tagAr: 'شعار إيبوكسي بارز',
    image: '',
    is_active: true
  });

  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (stickerToEdit) {
      setFormData({
        id: stickerToEdit.id || '',
        nameEn: stickerToEdit.nameEn || '',
        nameAr: stickerToEdit.nameAr || '',
        tagEn: stickerToEdit.tagEn || '3D EPOXY DOME SLOGAN',
        tagAr: stickerToEdit.tagAr || 'شعار إيبوكسي بارز',
        image: stickerToEdit.image || stickerToEdit.imageUrl || '',
        is_active: stickerToEdit.is_active !== undefined ? stickerToEdit.is_active : true
      });
    }
  }, [stickerToEdit]);

  if (!isOpen || !stickerToEdit) return null;

  const isEditing = Boolean(stickerToEdit && stickerToEdit.id);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, image: reader.result }));
        setUploading(false);
        showToast('تم تحميل صورة الاستيكر بنجاح 🖼️', 'success');
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('File upload error:', err);
      showToast('حدث خطأ أثناء رفع صورة الاستيكر', 'error');
      setUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.nameAr && !formData.nameEn) {
      showToast('يرجى كتابة اسم الاستيكر بالعربي أو الإنجليزي', 'error');
      return;
    }

    onSave(stickerToEdit.id, formData);
    showToast(isEditing ? 'تم تحديث بيانات الاستيكر بنجاح ✨' : 'تم إضافة استيكر جديد للبلدر بنجاح ✨', 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-void/80 backdrop-blur-md animate-fadeIn" dir="rtl">
      <div className="bg-stone border border-grave w-full max-w-lg rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-grave flex items-center justify-between bg-coal">
          <div className="flex items-center gap-2 text-gold">
            <Sparkles size={20} />
            <h3 className="font-clash text-lg uppercase font-bold text-bone">
              {isEditing ? `تعديل استيكر البلدر (${formData.nameAr || formData.nameEn})` : 'إضافة استيكر جديد لمصمم الجرابات 🏷️'}
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
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto custom-scrollbar flex-1">
          {/* Image Box & Upload */}
          <div className="space-y-2">
            <label className="font-mono text-xs text-gold uppercase tracking-wider block font-bold">
              صورة الاستيكر (Sticker Image / Icon)
            </label>
            <div className="relative h-40 bg-coal border-2 border-dashed border-grave hover:border-gold rounded-lg flex flex-col items-center justify-center overflow-hidden group transition-colors">
              {formData.image ? (
                <>
                  <img
                    src={formData.image}
                    alt="Sticker Preview"
                    className="w-28 h-28 object-contain"
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
                  <ImageIcon size={32} className="text-ash" />
                  <span className="font-mono text-xs text-bone font-bold">اضغط لرفع صورة الاستيكر</span>
                  <span className="font-mono text-[10px] text-ash">تنسيقات مدعومة: PNG, WebP</span>
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
              value={formData.image}
              onChange={(e) => setFormData((prev) => ({ ...prev, image: e.target.value }))}
              placeholder="https://..."
              className="w-full bg-coal border border-grave text-bone p-3 font-space text-xs focus:border-gold outline-none rounded"
            />
          </div>

          {/* Names */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-mono text-xs text-gold font-bold block">اسم الاستيكر بالعربي:</label>
              <input
                type="text"
                value={formData.nameAr}
                onChange={(e) => setFormData((prev) => ({ ...prev, nameAr: e.target.value }))}
                placeholder="طالع نور"
                className="w-full bg-coal border border-grave text-bone p-3 font-space text-xs focus:border-gold outline-none rounded"
              />
            </div>
            <div className="space-y-1">
              <label className="font-mono text-xs text-gold font-bold block">اسم الاستيكر بالإنجليزي:</label>
              <input
                type="text"
                value={formData.nameEn}
                onChange={(e) => setFormData((prev) => ({ ...prev, nameEn: e.target.value }))}
                placeholder="Born at Dawn"
                className="w-full bg-coal border border-grave text-bone p-3 font-space text-xs focus:border-gold outline-none rounded"
              />
            </div>
          </div>

          {/* Tags */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-mono text-xs text-ash block">تصنيف الاستيكر (Tag AR):</label>
              <input
                type="text"
                value={formData.tagAr}
                onChange={(e) => setFormData((prev) => ({ ...prev, tagAr: e.target.value }))}
                placeholder="شعار إيبوكسي بارز"
                className="w-full bg-coal border border-grave text-bone p-3 font-space text-xs focus:border-gold outline-none rounded"
              />
            </div>
            <div className="space-y-1">
              <label className="font-mono text-xs text-ash block">Tag Category EN:</label>
              <input
                type="text"
                value={formData.tagEn}
                onChange={(e) => setFormData((prev) => ({ ...prev, tagEn: e.target.value }))}
                placeholder="3D EPOXY DOME SLOGAN"
                className="w-full bg-coal border border-grave text-bone p-3 font-space text-xs focus:border-gold outline-none rounded"
              />
            </div>
          </div>

          {/* Active Toggle */}
          <div className="flex items-center gap-3 p-3 bg-coal border border-grave rounded">
            <input
              type="checkbox"
              id="builder_sticker_active"
              checked={formData.is_active}
              onChange={(e) => setFormData((prev) => ({ ...prev, is_active: e.target.checked }))}
              className="w-4 h-4 accent-gold cursor-pointer"
            />
            <label htmlFor="builder_sticker_active" className="font-mono text-xs text-bone font-bold cursor-pointer">
              إظهار الاستيكر في مصمم الجرابات (Active in Builder)
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
              <span>حفظ الاستيكر 💾</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
