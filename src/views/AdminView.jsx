import React, { useState } from 'react';
import { useProducts } from '../context/ProductsContext';
import { useOrders } from '../context/OrdersContext';
import { useHeroBanners } from '../context/HeroBannersContext';
import { useToast } from '../context/ToastContext';
import { AdminProductModal } from '../components/AdminProductModal';
import { AdminHeroSlideModal } from '../components/AdminHeroSlideModal';
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
  Eye,
  X,
  Phone,
  Lock,
  LogOut,
  KeyRound,
  ShieldCheck,
  Image as ImageIcon,
  Sliders,
  ExternalLink
} from 'lucide-react';

export function AdminView() {
  const { products, addProduct, updateProduct, adjustPrice, deleteProduct, resetProducts } = useProducts();
  const { orders, updateOrderStatus, deleteOrder, resetOrders } = useOrders();
  const { slides, addSlide, updateSlide, deleteSlide, resetSlides } = useHeroBanners();
  const { showToast } = useToast();

  // Admin PIN Authentication State (Passcode Gate)
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('duat_admin_auth') === 'true';
  });
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  const [activeTab, setActiveTab] = useState('products'); // 'products' | 'orders' | 'hero'

  // Products Tab State
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [productSearchQuery, setProductSearchQuery] = useState('');
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Hero Slides Tab State
  const [isHeroModalOpen, setIsHeroModalOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState(null);

  // Orders Tab State
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (pinInput.trim() === '1234' || pinInput.trim().toLowerCase() === 'admin') {
      setIsAuthenticated(true);
      sessionStorage.setItem('duat_admin_auth', 'true');
      setPinError(false);
      showToast('تم فتح لوحة التحكم بنجاح!', 'success');
    } else {
      setPinError(true);
      showToast('رمز الدخول غير صحيح!', 'error');
    }
  };

  const handleAdminLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('duat_admin_auth');
    showToast('تم قفل لوحة التحكم وتسجيل الخروج بنجاح', 'info');
  };

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

  // Product Modal Handlers
  const handleOpenAddProductModal = () => {
    setEditingProduct(null);
    setIsProductModalOpen(true);
  };

  const handleOpenEditProductModal = (product) => {
    setEditingProduct(product);
    setIsProductModalOpen(true);
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

  const handleDeleteProductConfirm = (id) => {
    deleteProduct(id);
    setDeleteConfirmId(null);
    showToast('تم حذف المنتج بنجاح!', 'warning');
  };

  const handleResetCatalog = () => {
    if (window.confirm('هل أنت تأكد من إعادة ضبط قائمة المنتجات إلى المنتجات الافتراضية؟ سيتم إلغاء أي تعديلات محليّة.')) {
      resetProducts();
      showToast('تم استعادة المنتجات الافتراضية بنجاح!', 'info');
    }
  };

  // Hero Slide Handlers
  const handleOpenAddHeroModal = () => {
    setEditingSlide(null);
    setIsHeroModalOpen(true);
  };

  const handleOpenEditHeroModal = (slide) => {
    setEditingSlide(slide);
    setIsHeroModalOpen(true);
  };

  const handleSaveHeroSlide = (slideData) => {
    if (editingSlide) {
      updateSlide(editingSlide.id, slideData);
      showToast('تم تحديث بنر العرض بنجاح!', 'success');
    } else {
      addSlide(slideData);
      showToast('تمت إضافة البنر/العرض الجديد بنجاح!', 'success');
    }
  };

  const handleDeleteHeroSlide = (id) => {
    if (window.confirm('هل أنت تأكد من حذف هذا البنر من الشاشة الرئيسية؟')) {
      deleteSlide(id);
      showToast('تم حذف البنر بنجاح!', 'warning');
    }
  };

  const handleResetHeroSlides = () => {
    if (window.confirm('هل أنت تأكد من إعادة ضبط السلايدر الرئيسي إلى العروض الافتراضية؟')) {
      resetSlides();
      showToast('تم استعادة البنرات الافتراضية!', 'info');
    }
  };

  const handleStatusChange = (orderId, newStatus) => {
    updateOrderStatus(orderId, newStatus);
    showToast(`تم تحديث حالة الطلب #${orderId} بنجاح!`, 'success');
  };

  // ============================================================
  // ADMIN PASSCODE GATE IF NOT AUTHENTICATED
  // ============================================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center p-4" dir="rtl">
        <div className="w-full max-w-md bg-stone border border-gold/40 p-8 space-y-6 shadow-2xl card-depth-highlight text-center">
          <div className="w-16 h-16 rounded-full border border-gold/40 bg-gold/10 flex items-center justify-center mx-auto text-gold">
            <Lock size={32} />
          </div>

          <div className="space-y-2">
            <h1 className="font-clash text-2xl font-bold text-bone">دخول لوحة التحكم (Admin Gate)</h1>
            <p className="font-mono text-xs text-ash">
              هذه الصفحة مخصصة لـ إدارة متجر DUAT فقط. يرجى إدخال رمز الدخول.
            </p>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div className="relative">
              <input
                type="password"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="رمز الدخول (مثال: 1234)"
                autoFocus
                className={`w-full bg-coal border px-4 py-3 text-center text-lg font-mono tracking-widest text-bone focus:outline-none ${
                  pinError ? 'border-red-500' : 'border-grave focus:border-gold'
                }`}
              />
              <KeyRound size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-ash" />
            </div>

            {pinError && (
              <p className="font-mono text-xs text-red-400">رمز الدخول غير صحيح! الرمز الافتراضي هو 1234</p>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-gold text-[#050505] font-bold font-mono text-xs uppercase tracking-wider hover:bg-gold-light transition-colors shadow-lg shadow-gold/20 flex items-center justify-center gap-2"
            >
              <ShieldCheck size={18} />
              <span>دخول لوحة التحكم</span>
            </button>
          </form>

          <p className="font-mono text-[11px] text-ash border-t border-grave/60 pt-4">
            الرمز الافتراضي للدخول هو: <strong className="text-gold">1234</strong>
          </p>
        </div>
      </div>
    );
  }

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
            تحكم كامل بالمنتجات والصور، بنرات الشاشة الرئيسية، والعروض وتتبع الطلبات.
          </p>
        </div>

        {/* TABS SWITCHER & LOGOUT */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex flex-wrap items-center gap-2 bg-coal/90 p-1.5 border border-grave w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('products')}
              style={
                activeTab === 'products'
                  ? { backgroundColor: '#E8A33D', color: '#0A0C16', borderColor: '#E8A33D' }
                  : { backgroundColor: '#181E3B', color: '#EDE4D3', borderColor: '#28305F' }
              }
              className="flex items-center gap-2 px-4 py-2.5 font-mono text-xs uppercase tracking-wider font-bold transition-all border shadow-sm"
            >
              <Package size={16} />
              <span>المنتجات ({products.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              style={
                activeTab === 'orders'
                  ? { backgroundColor: '#E8A33D', color: '#0A0C16', borderColor: '#E8A33D' }
                  : { backgroundColor: '#181E3B', color: '#EDE4D3', borderColor: '#28305F' }
              }
              className="flex items-center gap-2 px-4 py-2.5 font-mono text-xs uppercase tracking-wider font-bold transition-all border shadow-sm"
            >
              <ShoppingBag size={16} />
              <span>الطلبات ({orders.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('hero')}
              style={
                activeTab === 'hero'
                  ? { backgroundColor: '#E8A33D', color: '#0A0C16', borderColor: '#E8A33D' }
                  : { backgroundColor: '#181E3B', color: '#EDE4D3', borderColor: '#28305F' }
              }
              className="flex items-center gap-2 px-4 py-2.5 font-mono text-xs uppercase tracking-wider font-bold transition-all border shadow-sm"
            >
              <ImageIcon size={16} />
              <span>السلايدر والعروض ({slides.length})</span>
            </button>
          </div>

          <button
            onClick={handleAdminLogout}
            className="p-2.5 border border-grave bg-stone/80 hover:border-red-500/50 text-ash hover:text-red-400 transition-colors shrink-0"
            title="تسجيل الخروج وقفل التحكم"
          >
            <LogOut size={16} />
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
                onClick={handleOpenAddProductModal}
                className="flex items-center gap-2 px-5 py-2 bg-gold text-[#050505] font-bold font-mono text-xs uppercase tracking-wider hover:bg-gold-light transition-colors shadow-lg shadow-gold/20"
              >
                <Plus size={18} />
                <span>إضافة منتج جديد</span>
              </button>
            </div>
          </div>

          {/* PRODUCTS KPI METRICS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-stone border border-grave p-5 relative overflow-hidden">
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

            <div className="bg-stone border border-grave p-5 relative overflow-hidden">
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

            <div className="bg-stone border border-grave p-5 relative overflow-hidden">
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
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-stone border border-grave p-4">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  style={
                    selectedCategory === cat.id
                      ? { backgroundColor: '#E8A33D', color: '#0A0C16', borderColor: '#E8A33D' }
                      : { backgroundColor: '#181E3B', color: '#EDE4D3', borderColor: '#28305F' }
                  }
                  className="px-4 py-2 font-mono text-xs uppercase font-bold transition-all whitespace-nowrap border shadow-sm"
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
          <div className="bg-stone border border-grave overflow-hidden">
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
                                onClick={() => handleOpenEditProductModal(product)}
                                className="flex items-center gap-1 px-3 py-1.5 border border-grave bg-stone/50 hover:border-gold hover:text-gold text-ash transition-colors font-mono text-xs"
                              >
                                <Edit2 size={14} />
                                <span>تعديل</span>
                              </button>

                              {deleteConfirmId === product.id ? (
                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={() => handleDeleteProductConfirm(product.id)}
                                    className="px-3 py-1.5 bg-red-600 text-white font-mono text-xs font-bold hover:bg-red-700 transition-colors shadow"
                                  >
                                    تأكيد الحذف!
                                  </button>
                                  <button
                                    onClick={() => setDeleteConfirmId(null)}
                                    className="px-2 py-1.5 border border-grave text-ash font-mono text-xs hover:text-bone"
                                  >
                                    إلغاء
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => setDeleteConfirmId(product.id)}
                                  className="flex items-center gap-1 px-2.5 py-1.5 border border-red-500/40 text-red-500 hover:bg-red-500/10 transition-colors font-mono text-xs font-bold"
                                  title="حذف المنتج"
                                >
                                  <Trash2 size={14} />
                                  <span>حذف</span>
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
            <div className="bg-stone border border-grave p-5 relative overflow-hidden">
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

            <div className="bg-stone border border-grave p-5 relative overflow-hidden">
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

            <div className="bg-stone border border-grave p-5 relative overflow-hidden">
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
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-stone border border-grave p-4">
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
          <div className="bg-stone border border-grave overflow-hidden">
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
                        <td className="py-4 px-4">
                          <div className="font-mono text-base font-bold text-gold tracking-widest">{ord.id}</div>
                          <p className="font-mono text-xs text-ash mt-0.5">
                            {ord.createdAt ? new Date(ord.createdAt).toLocaleDateString('ar-EG') : 'الآن'}
                          </p>
                        </td>

                        <td className="py-4 px-4">
                          <div className="font-bold text-bone">{ord.customer?.fullName || 'عميل DUAT'}</div>
                          <div className="font-mono text-xs text-ash flex items-center gap-1.5 mt-0.5">
                            <Phone size={12} />
                            <span>{ord.customer?.phone || 'غير مسجل'}</span>
                          </div>
                        </td>

                        <td className="py-4 px-4">
                          <div className="font-mono font-bold text-bone">
                            {ord.total} <span className="text-xs text-gold">ج.م</span>
                          </div>
                          <span className="font-mono text-[11px] text-ash uppercase">
                            {ord.paymentMethod === 'instapay' ? 'InstaPay' : 'دفع عند الاستلام'}
                          </span>
                        </td>

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

      {/* ============================================================ */}
      {/* TAB 3: HERO SLIDER & OFFERS MANAGEMENT */}
      {/* ============================================================ */}
      {activeTab === 'hero' && (
        <div className="space-y-8 animate-fade-in">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="font-clash text-xl font-bold text-bone">إدارة بنرات العروض وسلايدر الصفحة الرئيسية</h2>
              <p className="font-mono text-xs text-ash mt-1">
                يمكنك تغيير الصورة خلف البنر، العناوين، شارات العروض (مثل خصم ٣٠٪)، وأزرار وروابط التنقل.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleResetHeroSlides}
                className="flex items-center gap-2 px-4 py-2 border border-grave bg-stone/50 hover:border-gold/50 text-ash hover:text-bone transition-colors font-mono text-xs uppercase"
              >
                <RotateCcw size={15} />
                <span>إعادة ضبط البنرات</span>
              </button>

              <button
                onClick={handleOpenAddHeroModal}
                className="flex items-center gap-2 px-5 py-2 bg-gold text-[#050505] font-bold font-mono text-xs uppercase tracking-wider hover:bg-gold-light transition-colors shadow-lg shadow-gold/20"
              >
                <Plus size={18} />
                <span>إضافة بنر / عرض جديد</span>
              </button>
            </div>
          </div>

          {/* SLIDES GRID DISPLAY */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                className="bg-stone border border-grave overflow-hidden shadow-lg card-depth-highlight flex flex-col justify-between"
              >
                {/* Slide Image / Visual Preview Box */}
                <div className="h-48 bg-void relative border-b border-grave overflow-hidden flex items-center justify-center p-4">
                  {slide.imageUrl ? (
                    <img src={slide.imageUrl} alt="Banner" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center space-y-2 text-ash">
                      <ImageIcon size={36} className="mx-auto text-gold/40" />
                      <span className="font-mono text-xs block">خلفية زاد النقوش الفرعونية الافتراضية</span>
                    </div>
                  )}

                  <div className="absolute top-3 right-3 bg-void/80 backdrop-blur border border-gold/40 px-2.5 py-1 font-mono text-xs text-gold font-bold">
                    بنر #{index + 1}
                  </div>

                  {slide.badgeAr && (
                    <div className="absolute top-3 left-3 bg-red-600/90 text-white px-2.5 py-1 font-mono text-xs font-bold uppercase tracking-wider">
                      {slide.badgeAr}
                    </div>
                  )}
                </div>

                {/* Slide Details Content */}
                <div className="p-6 space-y-4 flex-1">
                  <span className="font-mono text-xs text-gold uppercase tracking-widest block font-bold">
                    {slide.eyebrowAr || slide.eyebrowEn}
                  </span>

                  <h3 className="font-clash text-2xl font-bold text-bone leading-snug">
                    {slide.headline1Ar} <span className="text-gold">{slide.headline2Ar}</span>
                  </h3>

                  <p className="font-space text-xs text-ash leading-relaxed line-clamp-2">
                    {slide.subAr || slide.subEn}
                  </p>

                  <div className="pt-2 border-t border-grave/60 flex items-center justify-between font-mono text-xs text-ash">
                    <span>الزر الأول: <strong className="text-bone">{slide.ctaPrimaryTextAr}</strong> ({slide.ctaPrimaryLink})</span>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="p-4 bg-stone/40 border-t border-grave flex items-center justify-end gap-2">
                  <button
                    onClick={() => handleOpenEditHeroModal(slide)}
                    className="flex items-center gap-1.5 px-4 py-2 border border-grave bg-stone/80 hover:border-gold hover:text-gold text-bone font-mono text-xs font-bold transition-colors"
                  >
                    <Edit2 size={14} />
                    <span>تعديل البنر</span>
                  </button>

                  <button
                    onClick={() => handleDeleteHeroSlide(slide.id)}
                    className="flex items-center gap-1.5 px-3 py-2 border border-red-500/40 text-red-500 hover:bg-red-500/10 font-mono text-xs font-bold transition-colors"
                    title="حذف البنر"
                  >
                    <Trash2 size={14} />
                    <span>حذف</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ADMIN PRODUCT MODAL */}
      <AdminProductModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        onSave={handleSaveProduct}
        productToEdit={editingProduct}
      />

      {/* ADMIN HERO SLIDE MODAL */}
      <AdminHeroSlideModal
        isOpen={isHeroModalOpen}
        onClose={() => setIsHeroModalOpen(false)}
        onSave={handleSaveHeroSlide}
        slideToEdit={editingSlide}
      />

      {/* ORDER DETAILS MODAL */}
      {selectedOrderDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-void/85 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-stone border border-gold/40 p-6 space-y-6 shadow-2xl">
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
