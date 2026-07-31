import React, { useState } from 'react';
import { useProducts } from '../context/ProductsContext';
import { useOrders } from '../context/OrdersContext';
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
  PlusCircle,
  MinusCircle,
  ShoppingBag,
  Truck,
  CheckCircle,
  Clock,
  ShieldCheck,
  Eye,
  X,
  Phone,
  MapPin,
  Calendar,
  User
} from 'lucide-react';

export function AdminView() {
  const { products, addProduct, updateProduct, adjustPrice, deleteProduct, resetProducts } = useProducts();
  const { orders, updateOrderStatus, deleteOrder, resetOrders } = useOrders();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('products'); // 'products' | 'orders'

  // Products Tab State
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [productSearchQuery, setProductSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Orders Tab State
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);

  // Filtered Products
  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const query = productSearchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      (product.id && product.id.toLowerCase().includes(query)) ||
      (product.nameEn && product.nameEn.toLowerCase().includes(query)) ||
      (product.nameAr && product.nameAr.toLowerCase().includes(query)) ||
      (product.tagEn && product.tagEn.toLowerCase().includes(query));

    return matchesCategory && matchesSearch;
  });

  // Filtered Orders
  const filteredOrders = orders.filter((ord) => {
    const matchesStatus = orderStatusFilter === 'all' || ord.status === orderStatusFilter;
    const query = orderSearchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      (ord.id && ord.id.toLowerCase().includes(query)) ||
      (ord.customer?.fullName && ord.customer.fullName.toLowerCase().includes(query)) ||
      (ord.customer?.phone && ord.customer.phone.includes(query));

    return matchesStatus && matchesSearch;
  });

  // Products KPIs
  const totalProducts = products.length;
  const avgPrice = totalProducts > 0 ? Math.round(products.reduce((acc, p) => acc + (p.price || 0), 0) / totalProducts) : 0;
  const categoriesCount = new Set(products.map((p) => p.category)).size;

  // Orders KPIs
  const totalOrdersCount = orders.length;
  const shippedOrdersCount = orders.filter((o) => o.status === 'shipped' || o.status === 'delivered').length;
  const totalRevenue = orders.reduce((acc, o) => acc + (o.total || 0), 0);

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

  const handleStatusChange = (orderId, newStatus) => {
    updateOrderStatus(orderId, newStatus);
    showToast(`تم تحديث حالة الطلب #${orderId} بنجاح!`, 'success');
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'placed':
        return <span className="px-2.5 py-1 text-[11px] font-mono uppercase border border-amber-500/50 bg-amber-500/10 text-amber-400">استلام الطلب</span>;
      case 'forge':
        return <span className="px-2.5 py-1 text-[11px] font-mono uppercase border border-blue-500/50 bg-blue-500/10 text-blue-400">جاري التجهيز</span>;
      case 'shipped':
        return <span className="px-2.5 py-1 text-[11px] font-mono uppercase border border-gold bg-gold/10 text-gold">تم الشحن</span>;
      case 'delivered':
        return <span className="px-2.5 py-1 text-[11px] font-mono uppercase border border-emerald-500/50 bg-emerald-500/10 text-emerald-400">تم التسليم</span>;
      default:
        return <span className="px-2.5 py-1 text-[11px] font-mono uppercase border border-grave text-ash">{status}</span>;
    }
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 animate-fade-in" dir="rtl">
      {/* HEADER TITLE & MAIN TABS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-grave pb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="p-2 border border-gold/40 bg-gold/10 text-gold rounded">
              <Sparkles size={20} />
            </span>
            <h1 className="font-clash text-2xl sm:text-3xl font-bold tracking-wide text-bone">
              لوحة التحكم الرئيسية (Admin Dashboard)
            </h1>
          </div>
          <p className="font-mono text-xs text-ash">
            تحكم كامل بالمنتجات والصور، واستلام وتتبع طلبات العملاء وتعديل حالتها فوراً.
          </p>
        </div>

        {/* TABS SWITCHER (PRODUCTS / ORDERS) */}
        <div className="flex items-center gap-2 bg-stone p-1.5 border border-grave rounded-none shrink-0">
          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-2 px-5 py-2 font-mono text-xs uppercase tracking-wider transition-colors ${
              activeTab === 'products'
                ? 'bg-gold text-[#050505] font-bold shadow-md shadow-gold/20'
                : 'text-ash hover:text-bone'
            }`}
          >
            <Package size={16} />
            <span>إدارة المنتجات ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 px-5 py-2 font-mono text-xs uppercase tracking-wider transition-colors ${
              activeTab === 'orders'
                ? 'bg-gold text-[#050505] font-bold shadow-md shadow-gold/20'
                : 'text-ash hover:text-bone'
            }`}
          >
            <ShoppingBag size={16} />
            <span>إدارة الطلبات ({orders.length})</span>
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* TAB 1: PRODUCTS MANAGEMENT */}
      {/* ============================================================ */}
      {activeTab === 'products' && (
        <div className="space-y-8 animate-fade-in">
          {/* QUICK ACTIONS */}
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-clash text-xl font-bold text-bone">كتالوج المنتجات</h2>
            <div className="flex items-center gap-3">
              <button
                onClick={handleResetCatalog}
                className="flex items-center gap-2 px-4 py-2 border border-grave bg-stone/50 hover:border-gold/50 text-ash hover:text-bone transition-colors font-mono text-xs uppercase"
              >
                <RotateCcw size={15} />
                <span>إعادة ضبط المنتجات</span>
              </button>

              <button
                onClick={handleOpenAddModal}
                className="flex items-center gap-2 px-5 py-2 bg-gold text-[#050505] font-bold font-mono text-xs uppercase tracking-wider hover:bg-gold-light transition-colors shadow-lg shadow-gold/20"
              >
                <Plus size={18} />
                <span>إضافة منتج جديد</span>
              </button>
            </div>
          </div>

          {/* PRODUCTS KPI METRICS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-[#0b0b0d] border border-grave p-5 relative overflow-hidden">
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

            <div className="bg-[#0b0b0d] border border-grave p-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-1 h-full bg-amber-500" />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-mono text-xs text-ash uppercase tracking-wider">متوسط السعر</p>
                  <h3 className="font-clash text-3xl font-bold text-bone mt-1">
                    {avgPrice} <span className="text-sm font-mono text-gold">ج.م</span>
                  </h3>
                </div>
                <div className="p-3 bg-stone border border-grave text-amber-500">
                  <DollarSign size={24} />
                </div>
              </div>
            </div>

            <div className="bg-[#0b0b0d] border border-grave p-5 relative overflow-hidden">
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

          {/* SEARCH & CATEGORY FILTERS */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-[#0b0b0d] border border-grave p-4">
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

            <div className="relative w-full sm:w-72">
              <input
                type="text"
                value={productSearchQuery}
                onChange={(e) => setProductSearchQuery(e.target.value)}
                placeholder="بحث باسم المنتج أو الرمز..."
                className="w-full bg-stone border border-grave pl-4 pr-10 py-2 text-sm text-bone focus:border-gold focus:outline-none"
              />
              <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-ash" />
            </div>
          </div>

          {/* PRODUCTS TABLE */}
          <div className="bg-[#0b0b0d] border border-grave overflow-hidden">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16 px-4 text-ash font-mono text-sm space-y-3">
                <Package size={40} className="mx-auto text-ash/40" />
                <p>لا توجد منتجات تطابق شروط البحث.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-right border-collapse">
                  <thead>
                    <tr className="border-b border-grave bg-stone/40 font-mono text-xs uppercase text-ash tracking-wider">
                      <th className="py-3.5 px-4">المنتج والصورة</th>
                      <th className="py-3.5 px-4">التصنيف</th>
                      <th className="py-3.5 px-4 text-center">السعر والتعديل السريع</th>
                      <th className="py-3.5 px-4">الوسم</th>
                      <th className="py-3.5 px-4 text-left">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-grave font-sans text-sm">
                    {filteredProducts.map((product) => {
                      const img = product.imageUrl || product.image;
                      return (
                        <tr key={product.id} className="hover:bg-stone/30 transition-colors">
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              {img ? (
                                <div className="w-11 h-11 border border-gold/40 bg-stone overflow-hidden shrink-0">
                                  <img src={img} alt={product.nameAr} className="w-full h-full object-cover" />
                                </div>
                              ) : (
                                <div className="w-11 h-11 border border-gold/30 bg-stone flex items-center justify-center font-mono text-xs text-gold font-bold uppercase shrink-0">
                                  {product.category?.slice(0, 2) || 'DU'}
                                </div>
                              )}
                              <div>
                                <div className="font-bold text-bone flex items-center gap-2">
                                  <span>{product.nameAr}</span>
                                  <span className="font-mono text-xs text-ash font-normal">({product.nameEn})</span>
                                </div>
                                <p className="font-mono text-[11px] text-ash mt-0.5">ID: {product.id}</p>
                              </div>
                            </div>
                          </td>

                          <td className="py-4 px-4">
                            <span className="inline-block font-mono text-[11px] uppercase tracking-wider px-2.5 py-1 border border-grave bg-stone/60 text-gold">
                              {product.category}
                            </span>
                          </td>

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

                          <td className="py-4 px-4">
                            <span className="font-mono text-xs text-ash truncate max-w-[180px] block">
                              {product.tagAr || product.tagEn || 'بدون وسم'}
                            </span>
                          </td>

                          <td className="py-4 px-4 text-left">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleOpenEditModal(product)}
                                className="flex items-center gap-1 px-3 py-1.5 border border-grave bg-stone/50 hover:border-gold hover:text-gold text-ash transition-colors font-mono text-xs"
                              >
                                <Edit2 size={14} />
                                <span>تعديل</span>
                              </button>

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
                                >
                                  <Trash2 size={14} />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 2: ORDERS MANAGEMENT */}
      {/* ============================================================ */}
      {activeTab === 'orders' && (
        <div className="space-y-8 animate-fade-in">
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-clash text-xl font-bold text-bone">طلبات العملاء والتتبع الحقيقي</h2>
            <button
              onClick={() => {
                if (window.confirm('هل أنت تأكد من استعادة الطلبات التجريبية الأصلية؟')) {
                  resetOrders();
                  showToast('تم استعادة قائمة الطلبات التجريبية!', 'info');
                }
              }}
              className="flex items-center gap-2 px-4 py-2 border border-grave bg-stone/50 hover:border-gold/50 text-ash hover:text-bone transition-colors font-mono text-xs uppercase"
            >
              <RotateCcw size={15} />
              <span>إعادة ضبط الطلبات</span>
            </button>
          </div>

          {/* ORDERS KPIS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-[#0b0b0d] border border-grave p-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-1 h-full bg-blue-500" />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-mono text-xs text-ash uppercase tracking-wider">إجمالي الطلبات</p>
                  <h3 className="font-clash text-3xl font-bold text-bone mt-1">{totalOrdersCount}</h3>
                </div>
                <div className="p-3 bg-stone border border-grave text-blue-500">
                  <ShoppingBag size={24} />
                </div>
              </div>
            </div>

            <div className="bg-[#0b0b0d] border border-grave p-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-1 h-full bg-gold" />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-mono text-xs text-ash uppercase tracking-wider">الطلبات المشحونة/المسلمة</p>
                  <h3 className="font-clash text-3xl font-bold text-bone mt-1">{shippedOrdersCount}</h3>
                </div>
                <div className="p-3 bg-stone border border-grave text-gold">
                  <Truck size={24} />
                </div>
              </div>
            </div>

            <div className="bg-[#0b0b0d] border border-grave p-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-1 h-full bg-emerald-500" />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-mono text-xs text-ash uppercase tracking-wider">إجمالي المبيعات</p>
                  <h3 className="font-clash text-3xl font-bold text-bone mt-1">
                    {totalRevenue} <span className="text-sm font-mono text-gold">ج.م</span>
                  </h3>
                </div>
                <div className="p-3 bg-stone border border-grave text-emerald-500">
                  <DollarSign size={24} />
                </div>
              </div>
            </div>
          </div>

          {/* STATUS FILTERS & SEARCH */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-[#0b0b0d] border border-grave p-4">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none font-mono text-xs">
              <button
                onClick={() => setOrderStatusFilter('all')}
                className={`px-3 py-1.5 uppercase transition-colors whitespace-nowrap ${
                  orderStatusFilter === 'all' ? 'bg-gold text-[#050505] font-bold' : 'bg-stone/50 text-ash'
                }`}
              >
                الكل ({orders.length})
              </button>
              <button
                onClick={() => setOrderStatusFilter('placed')}
                className={`px-3 py-1.5 uppercase transition-colors whitespace-nowrap ${
                  orderStatusFilter === 'placed' ? 'bg-gold text-[#050505] font-bold' : 'bg-stone/50 text-ash'
                }`}
              >
                استلام الطلب ({orders.filter((o) => o.status === 'placed').length})
              </button>
              <button
                onClick={() => setOrderStatusFilter('forge')}
                className={`px-3 py-1.5 uppercase transition-colors whitespace-nowrap ${
                  orderStatusFilter === 'forge' ? 'bg-gold text-[#050505] font-bold' : 'bg-stone/50 text-ash'
                }`}
              >
                جاري التجهيز ({orders.filter((o) => o.status === 'forge').length})
              </button>
              <button
                onClick={() => setOrderStatusFilter('shipped')}
                className={`px-3 py-1.5 uppercase transition-colors whitespace-nowrap ${
                  orderStatusFilter === 'shipped' ? 'bg-gold text-[#050505] font-bold' : 'bg-stone/50 text-ash'
                }`}
              >
                تم الشحن ({orders.filter((o) => o.status === 'shipped').length})
              </button>
              <button
                onClick={() => setOrderStatusFilter('delivered')}
                className={`px-3 py-1.5 uppercase transition-colors whitespace-nowrap ${
                  orderStatusFilter === 'delivered' ? 'bg-gold text-[#050505] font-bold' : 'bg-stone/50 text-ash'
                }`}
              >
                تم التسليم ({orders.filter((o) => o.status === 'delivered').length})
              </button>
            </div>

            <div className="relative w-full sm:w-72">
              <input
                type="text"
                value={orderSearchQuery}
                onChange={(e) => setOrderSearchQuery(e.target.value)}
                placeholder="بحث برقم الطلب أو باسم العميل..."
                className="w-full bg-stone border border-grave pl-4 pr-10 py-2 text-sm text-bone focus:border-gold focus:outline-none"
              />
              <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-ash" />
            </div>
          </div>

          {/* ORDERS TABLE */}
          <div className="bg-[#0b0b0d] border border-grave overflow-hidden">
            {filteredOrders.length === 0 ? (
              <div className="text-center py-16 px-4 text-ash font-mono text-sm space-y-3">
                <ShoppingBag size={40} className="mx-auto text-ash/40" />
                <p>لا توجد طلبات مسجلة تطابق التصفية.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-right border-collapse">
                  <thead>
                    <tr className="border-b border-grave bg-stone/40 font-mono text-xs uppercase text-ash tracking-wider">
                      <th className="py-3.5 px-4">رقم الطلب والتاريخ</th>
                      <th className="py-3.5 px-4">بيانات العميل</th>
                      <th className="py-3.5 px-4">الإجمالي وطريقة الدفع</th>
                      <th className="py-3.5 px-4">حالة الطلب الحالية (تعديل مباشر)</th>
                      <th className="py-3.5 px-4 text-left">التفاصيل والتغيير</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-grave font-sans text-sm">
                    {filteredOrders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-stone/30 transition-colors">
                        {/* ORDER CODE & DATE */}
                        <td className="py-4 px-4">
                          <div className="font-mono text-base font-bold text-gold tracking-widest">{ord.id}</div>
                          <p className="font-mono text-xs text-ash mt-0.5">
                            {ord.createdAt ? new Date(ord.createdAt).toLocaleDateString('ar-EG') : 'الآن'}
                          </p>
                        </td>

                        {/* CUSTOMER INFO */}
                        <td className="py-4 px-4">
                          <div className="font-bold text-bone">{ord.customer?.fullName || 'عميل DUAT'}</div>
                          <div className="font-mono text-xs text-ash flex items-center gap-1.5 mt-0.5">
                            <Phone size={12} />
                            <span>{ord.customer?.phone || 'غير مسجل'}</span>
                          </div>
                        </td>

                        {/* TOTAL & PAYMENT */}
                        <td className="py-4 px-4">
                          <div className="font-mono font-bold text-bone">
                            {ord.total} <span className="text-xs text-gold">ج.م</span>
                          </div>
                          <span className="font-mono text-[11px] text-ash uppercase">
                            {ord.paymentMethod === 'instapay' ? 'InstaPay' : 'دفع عند الاستلام'}
                          </span>
                        </td>

                        {/* LIVE STATUS DROPDOWN SELECTOR */}
                        <td className="py-4 px-4">
                          <select
                            value={ord.status}
                            onChange={(e) => handleStatusChange(ord.id, e.target.value)}
                            className="bg-stone border border-gold/50 px-3 py-1.5 text-bone font-mono text-xs focus:outline-none focus:border-gold cursor-pointer"
                          >
                            <option value="placed">1. استلام الطلب (Placed)</option>
                            <option value="forge">2. جاري التجهيز والتشطيب (Forge)</option>
                            <option value="shipped">3. تم الشحن مع المناديب (Shipped)</option>
                            <option value="delivered">4. تم التسليم للعميل (Delivered)</option>
                          </select>
                        </td>

                        {/* ACTIONS */}
                        <td className="py-4 px-4 text-left">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setSelectedOrderDetails(ord)}
                              className="flex items-center gap-1 px-3 py-1.5 border border-grave bg-stone/50 hover:border-gold hover:text-gold text-ash transition-colors font-mono text-xs"
                            >
                              <Eye size={14} />
                              <span>التفاصيل</span>
                            </button>

                            <button
                              onClick={() => {
                                if (window.confirm(`هل أنت تأكد من حذف الطلب #${ord.id}؟`)) {
                                  deleteOrder(ord.id);
                                  showToast('تم حذف الطلب!', 'warning');
                                }
                              }}
                              className="p-1.5 border border-grave text-ash hover:text-red-400 hover:border-red-500/40 bg-stone/50 transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ADMIN PRODUCT MODAL */}
      <AdminProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProduct}
        productToEdit={editingProduct}
      />

      {/* ORDER DETAILS MODAL */}
      {selectedOrderDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-void/85 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-[#0b0b0d] border border-gold/40 p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-grave pb-4">
              <div>
                <span className="font-mono text-xs text-ash uppercase">تفاصيل الطلب الكاملة</span>
                <h3 className="font-mono text-2xl font-bold text-gold tracking-widest">{selectedOrderDetails.id}</h3>
              </div>
              <button
                onClick={() => setSelectedOrderDetails(null)}
                className="p-2 text-ash hover:text-gold border border-grave"
              >
                <X size={18} />
              </button>
            </div>

            {/* CUSTOMER INFO SUMMARY */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-stone/40 border border-grave p-4 font-mono text-xs space-y-1">
              <div>
                <span className="text-ash block">اسم العميل:</span>
                <span className="font-bold text-bone text-sm">{selectedOrderDetails.customer?.fullName}</span>
              </div>
              <div>
                <span className="text-ash block">رقم الهاتف:</span>
                <span className="font-bold text-bone text-sm">{selectedOrderDetails.customer?.phone}</span>
              </div>
              <div className="sm:col-span-2">
                <span className="text-ash block">العنوان والمحافظة:</span>
                <span className="font-bold text-bone">
                  {selectedOrderDetails.customer?.address} - {selectedOrderDetails.customer?.governorate?.nameAr}
                </span>
              </div>
            </div>

            {/* ORDERED ITEMS LIST */}
            <div className="space-y-3">
              <h4 className="font-mono text-xs text-gold uppercase tracking-wider">المنتجات المطلوبة</h4>
              <div className="border border-grave divide-y divide-grave bg-stone/20 max-h-48 overflow-y-auto">
                {selectedOrderDetails.items?.map((item, idx) => (
                  <div key={idx} className="p-3 flex items-center justify-between font-sans text-xs">
                    <div>
                      <span className="font-bold text-bone">{item.nameAr || item.nameEn}</span>
                      <span className="font-mono text-ash block text-[11px]">الكمية: {item.quantity || 1}</span>
                    </div>
                    <div className="font-mono font-bold text-gold">
                      {(item.price || 0) * (item.quantity || 1)} ج.م
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* TOTAL & STATUS UPDATE */}
            <div className="flex items-center justify-between border-t border-grave pt-4">
              <div>
                <span className="font-mono text-xs text-ash">إجمالي المطلوب:</span>
                <div className="font-mono text-2xl font-bold text-bone">
                  {selectedOrderDetails.total} <span className="text-sm text-gold">ج.م</span>
                </div>
              </div>
              <div>
                <label className="block font-mono text-xs text-ash mb-1">تغيير الحالة الآن:</label>
                <select
                  value={selectedOrderDetails.status}
                  onChange={(e) => {
                    handleStatusChange(selectedOrderDetails.id, e.target.value);
                    setSelectedOrderDetails((prev) => ({ ...prev, status: e.target.value }));
                  }}
                  className="bg-stone border border-gold px-3 py-1.5 text-bone font-mono text-xs focus:outline-none"
                >
                  <option value="placed">1. استلام الطلب (Placed)</option>
                  <option value="forge">2. جاري التجهيز والتشطيب (Forge)</option>
                  <option value="shipped">3. تم الشحن مع المناديب (Shipped)</option>
                  <option value="delivered">4. تم التسليم للعميل (Delivered)</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
