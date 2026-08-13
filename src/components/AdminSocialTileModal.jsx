import React, { useState, useEffect } from 'react';
import { X, Upload, Save, Image as ImageIcon, Loader2 } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export const AdminSocialTileModal = ({ isOpen, onClose, tile, onSave }) => {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    image: '',
    linkUrl: 'https://instagram.com/duat.wear',
    is_active: true
  });

  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (tile) {
      setFormData({
        id: tile.id || '',
        title: tile.title || '',
        image: tile.image || tile.imageUrl || '',
        linkUrl: tile.linkUrl || 'https://instagram.com/duat.wear',
        is_active: tile.is_active !== undefined ? tile.is_active : true
      });
    }
  }, [tile]);

  if (!isOpen || !tile) return null;

  const isEditing = Boolean(tile && tile.id);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, image: reader.result }));
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
    if (!formData.image) {
      showToast('يرجى اختيار صورة للمنشور', 'error');
      return;
    }
    if (!formData.title) {
      showToast('يرجى كتابة عنوان للصورة', 'error');
      return;
    }
    onSave(tile.id, formData);
    showToast(isEditing ? 'تم تحديث الصورة بنجاح ✨' : 'تم إضافة الصورة الجديدة بنجاح ✨', 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-void/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-stone border border-grave w-full max-w-xl rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-grave flex items-center justify-between bg-coal">
          <div className="flex items-center gap-2 text-gold">
            <ImageIcon size={20} />
            <h3 className="font-clash text-lg uppercase font-bold text-bone">
              {isEditing ? `تعديل صورة معرض إنستجرام (${formData.title || formData.id})` : 'إضافة صورة جديدة للمعرض 📸'}
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
              صورة المعرض (Social Tile Image)
            </label>
            <div className="relative h-48 bg-coal border-2 border-dashed border-grave hover:border-gold rounded-lg flex flex-col items-center justify-center overflow-hidden group transition-colors">
              {formData.image ? (
                <>
                  <img
                    src={formData.image}
                    alt="Social Tile Preview"
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
                  <span className="font-mono text-xs text-bone font-bold">اضغط لرفع صورة جديدة</span>
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
              value={formData.image}
              onChange={(e) => setFormData((prev) => ({ ...prev, image: e.target.value }))}
              placeholder="https://..."
              className="w-full bg-coal border border-grave text-bone p-3 font-space text-xs focus:border-gold outline-none rounded"
            />
          </div>

          {/* Title Input */}
          <div className="space-y-1">
            <label className="font-mono text-xs text-gold font-bold block">عنوان/وصف الصورة (Title):</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="STICKER SHEET"
              className="w-full bg-coal border border-grave text-bone p-3 font-space text-xs focus:border-gold outline-none rounded"
            />
          </div>

          {/* Instagram Link Input */}
          <div className="space-y-1">
            <label className="font-mono text-xs text-ash block">رابط المنشور على إنستجرام (Instagram Link):</label>
            <input
              type="text"
              value={formData.linkUrl}
              onChange={(e) => setFormData((prev) => ({ ...prev, linkUrl: e.target.value }))}
              placeholder="https://instagram.com/duat.wear"
              className="w-full bg-coal border border-grave text-bone p-3 font-space text-xs focus:border-gold outline-none rounded"
            />
          </div>

          {/* Active Toggle */}
          <div className="flex items-center gap-3 p-3 bg-coal border border-grave rounded">
            <input
              type="checkbox"
              id="tile_is_active"
              checked={formData.is_active}
              onChange={(e) => setFormData((prev) => ({ ...prev, is_active: e.target.checked }))}
              className="w-4 h-4 accent-gold cursor-pointer"
            />
            <label htmlFor="tile_is_active" className="font-mono text-xs text-bone font-bold cursor-pointer">
              إظهار الصورة في المعرض (Active)
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
