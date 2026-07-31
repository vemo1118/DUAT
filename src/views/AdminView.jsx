import React, { useState } from 'react';
import { useProducts } from '../context/ProductsContext';
import { useToast } from '../context/ToastContext';
import { AdminProductModal } from '../components/AdminProductModal';
import { CATEGORIES } from '../data/products';
import {
  Plus,
  Edit2,
  Trash2,
  RotateCcw,
  Search,
  Package,
  DollarSign,
  Layers,
  Sparkles,
  ArrowUpRight,
  PlusCircle,
  MinusCircle
} from 'lucide-react';

export function AdminView() {
  const { products, addProduct, updateProduct, adjustPrice, deleteProduct, resetProducts } = useProducts();
  const { showToast } = useToast();

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Filter products based on category & search query
  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      (product.id && product.id.toLowerCase().includes(query)) ||
      (product.nameEn && product.nameEn.toLowerCase().includes(query)) ||
      (product.nameAr && product.nameAr.toLowerCase().includes(query)) ||
      (product.tagEn && product.tagEn.toLowerCase().includes(query));

    return matchesCategory && matchesSearch;
  });

  // KPI Statistics
  const totalProducts = products.length;
  const avgPrice = totalProducts > 0 ? Math.round(products.reduce((acc, p) => acc + (p.price || 0), 0) / totalProducts) : 0;
  const categoriesCount = new Set(products.map((p) => p.category)).size;

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleSaveProduct = (productData) => {
    if (editingProduct) {
      updateProduct(editingProduct.id, productData);
      showToast('تم تحديث بيانات المنتج بنجاح!', 'success');
    } else {
      addProduct(productData);
      showToast('تمت إضافة المنتج الجديد بنجاح!', 'success');
    }
  };

  const handleDeleteConfirm = (id) => {
    deleteProduct(id);
    setDeleteConfirmId(null);
    showToast('تم حذف المنتج من القائمة!', 'warning');
  };

  const handleResetCatalog = () => {
    if (window.confirm('هل أنت تأكد من إعادة ضبط قائمة المنتجات إلى المنتجات الافتراضية؟ سيتم إلغاء أي تعديلات محليّة.')) {
      resetProducts();
      showToast('تم استعادة المنتجات الافتراضية بنجاح!', 'info');
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 animate-fade-in" dir="rtl">
      {/* HEADER TITLE BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-grave pb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="p-2 border border-gold/40 bg-gold/10 text-gold rounded">
              <Sparkles size={20} />
            </span>
            <h1 className="font-clash text-2xl sm:text-3xl font-bold tracking-wide text-bone">
              لوحة تحكم المنتجات (Product Dashboard)
            </h1>
          </div>
          <p className="font-mono text-xs text-ash">
            تحكم كامل بإضافة، تعديل وحذف المنتجات وتحديث الأسعار بشكل لحظي وتلقائي.
          </p>
        </div>

        {/* QUICK ACTIONS */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleResetCatalog}
            className="flex items-center gap-2 px-4 py-2.5 border border-grave bg-stone/50 hover:border-gold/50 text-ash hover:text-bone transition-colors font-mono text-xs uppercase"
            title="إعادة الكتالوج للافتراضي"
          >
            <RotateCcw size={15} />
            <span>إعادة ضبط الكتالوج</span>
          </button>

          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-2 px-5 py-2.5 bg-gold text-[#050505] font-bold font-mono text-xs uppercase tracking-wider hover:bg-gold-light transition-colors shadow-lg shadow-gold/20"
          >
            <Plus size={18} />
            <span>إضافة منتج جديد</span>
          </button>
        </div>
      </div>

      {/* KPI METRICS BAR */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#0b0b0d] border border-grave p-5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-1 h-full bg-gold" />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-mono text-xs text-ash uppercase tracking-wider">إجمالي المنتجات</p>
              <h3 className="font-clash text-3xl font-bold text-bone mt-1">{totalProducts}</h3>
            </div>
            <div className="p-3 bg-stone border border-grave text-gold">
              <Package size={24} />
            </div>
          </div>
        </div>

        <div className="bg-[#0b0b0d] border border-grave p-5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-1 h-full bg-amber-500" />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-mono text-xs text-ash uppercase tracking-wider">متوسط السعر الحالي</p>
              <h3 className="font-clash text-3xl font-bold text-bone mt-1">{avgPrice} <span className="text-sm font-mono text-gold">ج.م</span></h3>
            </div>
            <div className="p-3 bg-stone border border-grave text-amber-500">
              <DollarSign size={24} />
            </div>
          </div>
        </div>

        <div className="bg-[#0b0b0d] border border-grave p-5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-1 h-full bg-emerald-500" />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-mono text-xs text-ash uppercase tracking-wider">التصنيفات النشطة</p>
              <h3 className="font-clash text-3xl font-bold text-bone mt-1">{categoriesCount}</h3>
            </div>
            <div className="p-3 bg-stone border border-grave text-emerald-500">
              <Layers size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-[#0b0b0d] border border-grave p-4">
        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 font-mono text-xs uppercase transition-colors whitespace-nowrap ${
                selectedCategory === cat.id
                  ? 'bg-gold text-[#050505] font-bold shadow-md shadow-gold/10'
                  : 'bg-stone/50 text-ash hover:text-bone hover:bg-stone'
              }`}
            >
              {cat.id === 'all' ? 'جميع المنتجات' : cat.id.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="بحث باسم المنتج أو الرمز..."
            className="w-full bg-stone border border-grave pl-4 pr-10 py-2 text-sm text-bone focus:border-gold focus:outline-none font-sans"
          />
          <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-ash" />
        </div>
      </div>

      {/* PRODUCTS TABLE / LIST */}
      <div className="bg-[#0b0b0d] border border-grave overflow-hidden">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 px-4 text-ash font-mono text-sm space-y-3">
            <Package size={40} className="mx-auto text-ash/40" />
            <p>لا توجد منتجات تطابق شروط البحث أو التصنيف المحدد.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="border-b border-grave bg-stone/40 font-mono text-xs uppercase text-ash tracking-wider">
                  <th className="py-3.5 px-4">المنتج</th>
                  <th className="py-3.5 px-4">التصنيف</th>
                  <th className="py-3.5 px-4 text-center">السعر والتعديل السريع</th>
                  <th className="py-3.5 px-4">الوسم التشغيلي</th>
                  <th className="py-3.5 px-4 text-left">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-grave font-sans text-sm">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-stone/30 transition-colors group">
                    {/* PRODUCT NAME & DETAILS */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 border border-gold/30 bg-stone flex items-center justify-center font-mono text-xs text-gold font-bold uppercase shrink-0">
                          {product.category?.slice(0, 2) || 'DU'}
                        </div>
                        <div>
                          <div className="font-bold text-bone flex items-center gap-2">
                            <span>{product.nameAr}</span>
                            <span className="font-mono text-xs text-ash font-normal">({product.nameEn})</span>
                          </div>
                          <p className="font-mono text-[11px] text-ash mt-0.5">ID: {product.id}</p>
                        </div>
                      </div>
                    </td>

                    {/* CATEGORY BADGE */}
                    <td className="py-4 px-4">
                      <span className="inline-block font-mono text-[11px] uppercase tracking-wider px-2.5 py-1 border border-grave bg-stone/60 text-gold">
                        {product.category}
                      </span>
                    </td>

                    {/* PRICE CONTROLS (+ / - QUICK ADJUSTMENT) */}
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => adjustPrice(product.id, -50)}
                          className="p-1 text-ash hover:text-red-400 border border-grave hover:border-red-500/50 bg-stone/40 transition-colors"
                          title="-50 ج.م"
                        >
                          <MinusCircle size={16} />
                        </button>

                        <div className="font-mono text-sm font-bold text-bone min-w-[90px] text-center bg-stone px-3 py-1 border border-grave">
                          {product.price} <span className="text-xs text-gold font-normal">ج.م</span>
                        </div>

                        <button
                          onClick={() => adjustPrice(product.id, 50)}
                          className="p-1 text-ash hover:text-emerald-400 border border-grave hover:border-emerald-500/50 bg-stone/40 transition-colors"
                          title="+50 ج.م"
                        >
                          <PlusCircle size={16} />
                        </button>
                      </div>
                    </td>

                    {/* TAG BADGE */}
                    <td className="py-4 px-4">
                      <span className="font-mono text-xs text-ash truncate max-w-[200px] block">
                        {product.tagAr || product.tagEn || 'بدون وسم'}
                      </span>
                    </td>

                    {/* ACTIONS (EDIT & DELETE) */}
                    <td className="py-4 px-4 text-left">
                      <div className="flex items-center justify-end gap-2">
                        {/* EDIT BUTTON */}
                        <button
                          onClick={() => handleOpenEditModal(product)}
                          className="flex items-center gap-1 px-3 py-1.5 border border-grave bg-stone/50 hover:border-gold hover:text-gold text-ash transition-colors font-mono text-xs"
                        >
                          <Edit2 size={14} />
                          <span>تعديل</span>
                        </button>

                        {/* DELETE BUTTON */}
                        {deleteConfirmId === product.id ? (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleDeleteConfirm(product.id)}
                              className="px-2.5 py-1.5 bg-red-600 text-white font-mono text-xs font-bold hover:bg-red-700 transition-colors"
                            >
                              تأكيد!
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(null)}
                              className="px-2 py-1.5 border border-grave text-ash font-mono text-xs"
                            >
                              إلغاء
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirmId(product.id)}
                            className="p-1.5 border border-grave text-ash hover:text-red-400 hover:border-red-500/40 bg-stone/50 transition-colors"
                            title="حذف المنتج"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ADMIN EDIT / ADD PRODUCT MODAL */}
      <AdminProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProduct}
        productToEdit={editingProduct}
      />
    </div>
  );
}
