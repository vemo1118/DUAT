import React, { useState, useEffect } from 'react';
import { X, Upload, Save, Image as ImageIcon, Loader2 } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { removeStoreImage, uploadStoreImage } from '../services/storeAssetService';

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

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [saving, setSaving] = useState(false);

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
      setSelectedFile(null);
    }
  }, [banner]);

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl('');
      return undefined;
    }
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  if (!isOpen || !banner) return null;

  const isEditing = Boolean(banner && banner.id);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = new Set(['image/png', 'image/jpeg', 'image/webp']);
    if (!allowedTypes.has(file.type) || file.size < 1 || file.size > 8 * 1024 * 1024) {
      showToast('الصورة لازم تكون PNG أو JPG أو WebP وأقل من 8MB', 'error');
      e.target.value = '';
      return;
    }
    setSelectedFile(file);
    showToast('تم اختيار الصورة. سيتم رفعها عند الحفظ.', 'info');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile && !formData.imageUrl) {
      showToast('يرجى اختيار صورة للقسم', 'error');
      return;
    }
    if (!formData.nameAr && !formData.nameEn) {
      showToast('يرجى كتابة اسم للقسم', 'error');
      return;
    }

    setSaving(true);
    let uploadedPath = null;
    try {
      let payload = formData;
      if (selectedFile) {
        const upload = await uploadStoreImage(selectedFile, {
          folder: 'category-banners',
          assetId: banner.id || formData.id || 'new-category'
        });
        uploadedPath = upload.created ? upload.path : null;
        payload = { ...formData, imageUrl: upload.publicUrl };
      }

      await onSave(banner.id, payload);
      showToast(isEditing ? 'تم تحديث كارت القسم وحفظه على الموقع ✨' : 'تم إضافة كارت القسم وحفظه على الموقع ✨', 'success');
      onClose();
    } catch (error) {
      if (uploadedPath) await removeStoreImage(uploadedPath);
      console.error('Category banner save error:', error?.message || error);
      showToast('تعذر حفظ الصورة على الموقع. لم يتم اعتماد التغيير.', 'error');
    } finally {
      setSaving(false);
    }
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
            disabled={saving}
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
              {previewUrl || formData.imageUrl ? (
                <>
                  <img
                    src={previewUrl || formData.imageUrl}
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
              {saving && (
                <div className="absolute inset-0 bg-void/80 flex items-center justify-center gap-2 text-gold font-mono text-xs">
                  <Loader2 size={24} className="animate-spin" />
                  <span>جاري الرفع والحفظ...</span>
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
              onChange={(e) => {
                setSelectedFile(null);
                setFormData((prev) => ({ ...prev, imageUrl: e.target.value }));
              }}
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
                placeholder="STICKER BUNDLES"
                className="w-full bg-coal border border-grave text-bone p-3 font-space text-xs focus:border-gold outline-none rounded"
              />
            </div>
            <div className="space-y-1">
              <label className="font-mono text-xs text-gold font-bold block">اسم القسم بالعربي (Title AR):</label>
              <input
                type="text"
                value={formData.nameAr}
                onChange={(e) => setFormData((prev) => ({ ...prev, nameAr: e.target.value }))}
                placeholder="بندلات الاستيكرات"
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
                placeholder="Six 3D DUAT stickers, made to order"
                className="w-full bg-coal border border-grave text-bone p-3 font-space text-xs focus:border-gold outline-none rounded"
              />
            </div>
            <div className="space-y-1">
              <label className="font-mono text-xs text-ash block">الوصف الفرعي بالعربي (Subtitle AR):</label>
              <input
                type="text"
                value={formData.subtitleAr}
                onChange={(e) => setFormData((prev) => ({ ...prev, subtitleAr: e.target.value }))}
                placeholder="٦ استيكرات دوات مجسمة، حسب الطلب"
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
              disabled={saving}
              className="px-5 py-2.5 bg-coal text-ash hover:text-bone border border-grave font-mono text-xs uppercase"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={saving}
              className="btn-primary px-6 py-2.5 font-mono text-xs uppercase font-bold flex items-center gap-2"
            >
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              <span>{saving ? 'جاري الحفظ...' : 'حفظ التغييرات 💾'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
