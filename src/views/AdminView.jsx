import React, { useState, useEffect } from 'react';
import { useProducts } from '../context/ProductsContext';
import { useOrders } from '../context/OrdersContext';
import { useHeroBanners } from '../context/HeroBannersContext';
import { useToast } from '../context/ToastContext';
import { supabase } from '../lib/supabase';
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
  EyeOff,
  X,
  Phone,
  Lock,
  LogOut,
  KeyRound,
  ShieldCheck,
  Image as ImageIcon,
  Sliders,
  ExternalLink,
  Loader2,
  Mail,
  CreditCard,
  FileSpreadsheet,
  Bell,
  Save,
  Download
} from 'lucide-react';
import { SunDisc } from '../components/SunDisc';
import {
  exportOrdersToCSV,
  sendTestTelegramNotification,
  saveNotificationSettingsToSupabase,
  wipeAllOrdersAndStorage,
  TELEGRAM_TOKEN_KEY,
  TELEGRAM_CHAT_ID_KEY,
  ADMIN_WHATSAPP_NUMBER_KEY
} from '../utils/orderNotifier';

export function AdminView() {
  const { products, addProduct, updateProduct, adjustPrice, toggleProductVisibility, deleteProduct, resetProducts } = useProducts();
  const { orders, fetchOrders, updateOrderStatus, deleteOrder, resetOrders } = useOrders();
  const { slides, addSlide, updateSlide, toggleSlideVisibility, deleteSlide, resetSlides } = useHeroBanners();
  const { showToast } = useToast();

  // Supabase Auth State
  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [isSubmittingAuth, setIsSubmittingAuth] = useState(false);

  const [activeTab, setActiveTab] = useState('products'); // 'products' | 'orders' | 'hero' | 'notifications'

  const [telegramToken, setTelegramToken] = useState(() => localStorage.getItem(TELEGRAM_TOKEN_KEY) || '');
  const [telegramChatId, setTelegramChatId] = useState(() => localStorage.getItem(TELEGRAM_CHAT_ID_KEY) || '');
  const [adminWhatsApp, setAdminWhatsApp] = useState(() => localStorage.getItem(ADMIN_WHATSAPP_NUMBER_KEY) || '201000000000');

  const handleSaveNotificationSettings = async (e) => {
    e.preventDefault();
    await saveNotificationSettingsToSupabase(telegramToken, telegramChatId, adminWhatsApp);
    showToast('تم حفظ إعدادات الإشعارات الفورية ومزامنتها عالمياً لجميع العملاء والموبايلات بنجاح!', 'success');
  };

  const handleTestNotification = async () => {
    if (!telegramToken.trim() || !telegramChatId.trim()) {
      showToast('يرجى إدخال الـ Bot Token والـ Chat ID أولاً لاختبار الإشعار!', 'error');
      return;
    }
    await saveNotificationSettingsToSupabase(telegramToken, telegramChatId, adminWhatsApp);
    showToast('جاري إرسال إشعار تجريبي لموبايلك عبر تليجرام...', 'info');
    const ok = await sendTestTelegramNotification();
    if (ok) {
      showToast('وصل الإشعار التجريبي بنجاح! تفقّد هاتفك المحمول 📱✨', 'success');
    } else {
      showToast('تعذر الإرسال! تأكد من الـ Token والـ Chat ID وأنك اضغطت /start للبوت في تليجرام.', 'error');
    }
  };

  // Check initial session & listen for auth changes
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setAuthLoading(false);
      if (session && fetchOrders) fetchOrders();
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession);
      if (currentSession && fetchOrders) fetchOrders();
    });

    return () => subscription.unsubscribe();
  }, []);

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
  const [signedProofUrl, setSignedProofUrl] = useState(null);

  useEffect(() => {
    let active = true;
    const fetchSignedProofUrl = async () => {
      setSignedProofUrl(null);
      const proofPath = selectedOrderDetails?.payment_proof_path || selectedOrderDetails?.paymentProofPath;
      if (proofPath) {
        try {
          const { data: publicData } = supabase.storage.from('payment-proofs').getPublicUrl(proofPath);
          if (active && publicData?.publicUrl) {
            setSignedProofUrl(publicData.publicUrl);
          }
          const { data } = await supabase.storage.from('payment-proofs').createSignedUrl(proofPath, 3600);
          if (active && data?.signedUrl) {
            setSignedProofUrl(data.signedUrl);
          }
        } catch (err) {
          console.error('Error generating URL for payment proof:', err);
        }
      }
    };
    if (selectedOrderDetails) {
      fetchSignedProofUrl();
    }
    return () => { active = false; };
  }, [selectedOrderDetails]);

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    if (!emailInput || !passwordInput) {
      setAuthError('يرجى إدخال البريد الإلكتروني وكلمة المرور');
      return;
    }

    setIsSubmittingAuth(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: emailInput.trim(),
        password: passwordInput
      });

      if (error) {
        const isFetchError = error.message && (
          error.message.toLowerCase().includes('failed to fetch') ||
          error.message.toLowerCase().includes('networkerror') ||
          error.message.toLowerCase().includes('fetch')
        );

        if (isFetchError) {
          const userFriendlyMsg = 'تعذر الاتصال بالسيرفر (Failed to fetch). يرجى التأكد من اتصال الإنترنيت وإيقاف مانع الإعلانات (AdBlocker / Brave Shields / VPN) ثم المحاولة مرة أخرى.';
          setAuthError(userFriendlyMsg);
          showToast('تعذر الاتصال بالسيرفر - يرجى تعطيل AdBlocker أو التأكد من الإنترنيت', 'error');
        } else if (error.message.includes('Invalid login credentials')) {
          setAuthError('البريد الإلكتروني أو كلمة المرور غير صحيحة. يرجى التأكد من إضافة المستخدم في Supabase Dashboard > Authentication > Users.');
          showToast('بيانات الدخول غير صحيحة', 'error');
        } else {
          setAuthError(error.message || 'بيانات الدخول غير صحيحة');
          showToast('فشل تسجيل الدخول: ' + error.message, 'error');
        }
      } else {
        setSession(data.session);
        showToast('تم تسجيل الدخول بنجاح!', 'success');
        if (fetchOrders) fetchOrders();
      }
    } catch (err) {
      setAuthError('تعذر الاتصال بالخادم. يرجى مراجعة الاتصال وإيقاف مانع الإعلانات.');
      showToast('حدث خطأ أثناء الاتصال بالخادم', 'error');
    } finally {
      setIsSubmittingAuth(false);
    }
  };

  const handleAdminLogout = async () => {
    try {
      await supabase.auth.signOut();
      setSession(null);
      showToast('تم تسجيل الخروج بنجاح', 'info');
    } catch (err) {
      console.error('Sign out error:', err);
    }
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
  // ADMIN SUPABASE AUTH GATE IF NOT AUTHENTICATED
  // ============================================================
  if (authLoading) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center p-4" dir="rtl">
        <div className="flex items-center gap-3 text-gold font-mono text-sm">
          <Loader2 size={24} className="animate-spin" />
          <span>جاري التحقق من جلسة المسؤول...</span>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center p-4" dir="rtl">
        <div className="w-full max-w-md bg-stone border border-gold/40 p-8 space-y-6 shadow-2xl card-depth-highlight text-center">
          <div className="w-16 h-16 rounded-full border border-gold/40 bg-gold/10 flex items-center justify-center mx-auto text-gold">
            <Lock size={32} />
          </div>

          <div className="space-y-2">
            <h1 className="font-clash text-2xl font-bold text-bone">دخول لوحة التحكم (Admin Gate)</h1>
            <p className="font-mono text-xs text-ash">
              هذه الصفحة مخصصة لـ إدارة متجر DUAT فقط. يرجى إدخال حساب المسؤول المصرح له.
            </p>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-4 text-right">
            <div className="space-y-1">
              <label className="block text-xs font-mono text-ash">البريد الإلكتروني</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="admin@duat.store"
                  className="w-full bg-coal border border-grave px-4 py-3 text-sm font-mono text-bone focus:border-gold focus:outline-none"
                />
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-ash" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-mono text-ash">كلمة المرور</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-coal border border-grave px-4 py-3 text-sm font-mono text-bone focus:border-gold focus:outline-none"
                />
                <KeyRound size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-ash" />
              </div>
            </div>

            {authError && (
              <p className="font-mono text-xs text-red-400 text-center">{authError}</p>
            )}

            <button
              type="submit"
              disabled={isSubmittingAuth}
              className="w-full py-3 bg-gold text-[#050505] font-bold font-mono text-xs uppercase tracking-wider hover:bg-gold-light transition-colors shadow-lg shadow-gold/20 flex items-center justify-center gap-2"
            >
              {isSubmittingAuth ? <Loader2 size={18} className="animate-spin" /> : <ShieldCheck size={18} />}
              <span>دخول لوحة التحكم</span>
            </button>
          </form>
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
              className={`flex items-center gap-2 px-4.5 py-2.5 font-mono text-xs uppercase tracking-wider font-bold transition-all border ${
                activeTab === 'products'
                  ? 'bg-gold text-[#0A0C16] border-gold shadow-md shadow-gold/20'
                  : 'bg-stone text-bone border-grave hover:border-gold hover:text-gold'
              }`}
            >
              <Package size={16} />
              <span>المنتجات ({products.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`flex items-center gap-2 px-4.5 py-2.5 font-mono text-xs uppercase tracking-wider font-bold transition-all border ${
                activeTab === 'orders'
                  ? 'bg-gold text-[#0A0C16] border-gold shadow-md shadow-gold/20'
                  : 'bg-stone text-bone border-grave hover:border-gold hover:text-gold'
              }`}
            >
              <ShoppingBag size={16} />
              <span>الطلبات ({orders.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('hero')}
              className={`flex items-center gap-2 px-4.5 py-2.5 font-mono text-xs uppercase tracking-wider font-bold transition-all border ${
                activeTab === 'hero'
                  ? 'bg-gold text-[#0A0C16] border-gold shadow-md shadow-gold/20'
                  : 'bg-stone text-bone border-grave hover:border-gold hover:text-gold'
              }`}
            >
              <ImageIcon size={16} />
              <span>السلايدر والعروض ({slides.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('notifications')}
              className={`flex items-center gap-2 px-4.5 py-2.5 font-mono text-xs uppercase tracking-wider font-bold transition-all border ${
                activeTab === 'notifications'
                  ? 'bg-gold text-[#0A0C16] border-gold shadow-md shadow-gold/20'
                  : 'bg-stone text-bone border-grave hover:border-gold hover:text-gold'
              }`}
            >
              <Bell size={16} />
              <span>إشعارات الموبايل 📲</span>
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
                  className={`px-4 py-2 font-mono text-xs uppercase font-bold transition-all whitespace-nowrap border ${
                    selectedCategory === cat.id
                      ? 'bg-gold text-[#0A0C16] border-gold shadow-md shadow-gold/20'
                      : 'bg-stone text-bone border-grave hover:border-gold hover:text-gold'
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
                                onClick={() => {
                                  toggleProductVisibility(product.id);
                                  showToast(product.is_active !== false ? 'تم إخفاء المنتج من المتجر' : 'تم إظهار المنتج في المتجر', 'info');
                                }}
                                className={`flex items-center gap-1 px-2.5 py-1.5 border transition-colors font-mono text-xs font-bold ${
                                  product.is_active !== false
                                    ? 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20'
                                    : 'border-amber-500/40 text-amber-400 bg-amber-500/10 hover:bg-amber-500/20'
                                }`}
                                title={product.is_active !== false ? 'إخفاء المنتج من المتجر' : 'إظهار المنتج في المتجر'}
                              >
                                {product.is_active !== false ? <Eye size={14} /> : <EyeOff size={14} />}
                                <span>{product.is_active !== false ? 'ظاهر' : 'مخفي'}</span>
                              </button>

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
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="font-clash text-xl font-bold text-bone">طلبات العملاء والتتبع الحقيقي</h2>
            <div className="flex items-center gap-3">
              <button
                onClick={() => exportOrdersToCSV(orders)}
                className="flex items-center gap-2 px-4 py-2 border border-gold bg-gold/10 hover:bg-gold hover:text-void text-gold transition-colors font-mono text-xs uppercase font-bold shadow-md"
              >
                <FileSpreadsheet size={15} />
                <span>تصدير لشيت الشحن (CSV) 📊</span>
              </button>

              <button
                onClick={async () => {
                  if (window.confirm('هل أنت متاكد من مسح جميع الأوردرات والصور المرفوعة وإعادة عداد الأوردرات للبدء من DUAT-0001؟')) {
                    const ok = await wipeAllOrdersAndStorage();
                    if (ok) {
                      resetOrders();
                      fetchOrders();
                      showToast('تم مسح جميع الأوردرات بنجاح! الأوردر القادم سيكون DUAT-0001 🧹', 'success');
                    } else {
                      showToast('حدث خطأ أثناء المسح، يرجى المحاولة مرة أخرى', 'error');
                    }
                  }
                }}
                className="flex items-center gap-2 px-4 py-2 border border-red-500/40 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-mono text-xs uppercase font-bold transition-colors"
              >
                <Trash2 size={15} />
                <span>مسح جميع الأوردرات (إعادة العداد لـ DUAT-0001) 🧹</span>
              </button>
            </div>
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
                          <div className="font-mono text-base font-bold text-gold tracking-widest flex items-center gap-2">
                            <span>{ord.id}</span>
                            {ord.items?.some(i => i.designSnapshot || i.customConfig?.designSnapshot) && (
                              <span className="text-[10px] font-bold px-1.5 py-0.5 bg-gold/20 text-gold border border-gold/40 rounded">
                                🖼️ جراب مخصص
                              </span>
                            )}
                          </div>
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
                          <span className="font-mono text-[11px] text-ash uppercase flex items-center gap-1.5 mt-0.5">
                            <span>{ord.paymentMethod === 'instapay' ? 'InstaPay' : 'دفع عند الاستلام'}</span>
                            {(ord.payment_proof_path || ord.paymentProofPath) && (
                              <span className="text-[10px] font-bold px-1.5 py-0.5 bg-amber-500/20 text-amber-400 border border-amber-500/40 rounded flex items-center gap-1">
                                <ImageIcon size={10} />
                                <span>صورة المرفق</span>
                              </span>
                            )}
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
                      <span className="font-mono text-xs block">خلفية دوات النقوش المصرية الافتراضية</span>
                    </div>
                  )}

                  <div className="absolute top-3 right-3 flex items-center gap-2 z-10">
                    <div className="bg-void/90 backdrop-blur border border-gold/40 px-2.5 py-1 font-mono text-xs text-gold font-bold">
                      بنر #{index + 1}
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSlideVisibility(slide.id);
                        showToast(slide.is_active !== false ? 'تم إخفاء البنر من الصفحة الرئيسية' : 'تم إظهار البنر في الصفحة الرئيسية', 'info');
                      }}
                      className={`px-3 py-1 border font-mono text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer ${
                        slide.is_active !== false
                          ? 'border-emerald-500 bg-emerald-600/90 text-white hover:bg-emerald-700'
                          : 'border-amber-500 bg-amber-600/90 text-white hover:bg-amber-700'
                      }`}
                      title={slide.is_active !== false ? 'إخفاء البنر من الصفحة الرئيسية' : 'إظهار البنر في الصفحة الرئيسية'}
                    >
                      {slide.is_active !== false ? <Eye size={13} /> : <EyeOff size={13} />}
                      <span>{slide.is_active !== false ? 'ظاهر (إخفاء)' : 'مخفي (إظهار)'}</span>
                    </button>
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
                <div className="p-4 bg-stone/40 border-t border-grave flex flex-wrap items-center justify-between gap-2">
                  <button
                    onClick={() => {
                      toggleSlideVisibility(slide.id);
                      showToast(slide.is_active !== false ? 'تم إخفاء البنر من الصفحة الرئيسية' : 'تم إظهار البنر في الصفحة الرئيسية', 'info');
                    }}
                    className={`flex items-center gap-1.5 px-3 py-2 border font-mono text-xs font-bold transition-colors ${
                      slide.is_active !== false
                        ? 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20'
                        : 'border-amber-500/40 text-amber-400 bg-amber-500/10 hover:bg-amber-500/20'
                    }`}
                    title={slide.is_active !== false ? 'إخفاء البنر من الصفحة الرئيسية' : 'إظهار البنر في الصفحة الرئيسية'}
                  >
                    {slide.is_active !== false ? <Eye size={14} /> : <EyeOff size={14} />}
                    <span>{slide.is_active !== false ? 'ظاهر' : 'مخفي'}</span>
                  </button>

                  <div className="flex items-center gap-2">
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
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 4: MOBILE NOTIFICATIONS SETTINGS */}
      {/* ============================================================ */}
      {activeTab === 'notifications' && (
        <div className="bg-stone border border-gold/40 p-6 sm:p-8 space-y-6 animate-fade-in max-w-3xl mx-auto shadow-2xl">
          <div className="flex items-center gap-3 border-b border-grave pb-4">
            <Bell className="text-gold" size={26} />
            <div>
              <h2 className="font-clash text-xl font-bold text-bone">إعدادات الإشعارات الفورية لكل أوردر على الموبايل</h2>
              <p className="font-mono text-xs text-ash">احصل على إشعار فوري بصوت واهتزاز على تليجرام فور قيام أي عميل بالشراء!</p>
            </div>
          </div>

          <form onSubmit={handleSaveNotificationSettings} className="space-y-5 font-mono text-xs">
            <div>
              <label className="block text-gold font-bold mb-1.5 uppercase tracking-wider">
                Telegram Bot Token (من @BotFather)
              </label>
              <input
                type="text"
                value={telegramToken}
                onChange={(e) => setTelegramToken(e.target.value)}
                placeholder="مثال: 7123456789:AAFx...XYZ"
                className="w-full bg-coal border border-grave px-4 py-3 text-bone font-mono focus:border-gold outline-none"
                dir="ltr"
              />
            </div>

            <div>
              <label className="block text-gold font-bold mb-1.5 uppercase tracking-wider">
                Telegram Chat ID (من @userinfobot)
              </label>
              <input
                type="text"
                value={telegramChatId}
                onChange={(e) => setTelegramChatId(e.target.value)}
                placeholder="مثال: 123456789"
                className="w-full bg-coal border border-grave px-4 py-3 text-bone font-mono focus:border-gold outline-none"
                dir="ltr"
              />
            </div>

            <div>
              <label className="block text-gold font-bold mb-1.5 uppercase tracking-wider">
                رقم الواتساب لاستلام طلبات الشات المباشرة
              </label>
              <input
                type="text"
                value={adminWhatsApp}
                onChange={(e) => setAdminWhatsApp(e.target.value)}
                placeholder="مثال: 201012345678"
                className="w-full bg-coal border border-grave px-4 py-3 text-bone font-mono focus:border-gold outline-none"
                dir="ltr"
              />
            </div>

            <div className="bg-coal p-5 border border-grave/60 space-y-2 text-ash text-[12px] leading-relaxed">
              <p className="font-bold text-gold flex items-center gap-2">
                <span>💡 طريقة التفعيل المجاني في 60 ثانية:</span>
              </p>
              <ol className="list-decimal list-inside space-y-1.5 font-sans">
                <li>افتح تطبيق تليجرام وابحث عن <b>@BotFather</b> وارسل <code>/newbot</code> واحصل على الـ <b>Bot Token</b>.</li>
                <li>ابحث عن <b>@userinfobot</b> وارسل أي كلمة لمعرفة الـ <b>Chat ID</b> الخاص بك.</li>
                <li>ضع البيانات أعلاه واضغط حفظ الإعدادات، وستصلك كافة الأوردرات فوراً بصوت واهتزاز على هاتفك المحمول!</li>
              </ol>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                type="submit"
                className="btn-primary w-full py-4 text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg"
              >
                <Save size={16} />
                <span>حفظ الإعدادات</span>
              </button>
              <button
                type="button"
                onClick={handleTestNotification}
                className="w-full py-4 bg-gold/15 hover:bg-gold hover:text-void text-gold border border-gold font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-lg"
              >
                <Bell size={16} />
                <span>اختبار وإرسال إشعار تجريبي 🔔</span>
              </button>
            </div>
          </form>
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
          <div className="relative w-full max-w-2xl bg-stone border border-gold/40 p-6 space-y-6 shadow-2xl max-h-[88vh] overflow-y-auto custom-scrollbar rounded-lg">
            <div className="flex items-center justify-between border-b border-grave pb-4">
              <div>
                <span className="font-mono text-xs text-ash uppercase">تفاصيل الطلب الكاملة</span>
                <h3 className="font-mono text-2xl font-bold text-gold tracking-widest">{selectedOrderDetails.id}</h3>
              </div>
              <button
                onClick={() => setSelectedOrderDetails(null)}
                className="p-2 text-ash hover:text-gold border border-grave rounded"
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
              <div className="border border-grave divide-y divide-grave bg-stone/20 max-h-96 overflow-y-auto custom-scrollbar rounded">
                {selectedOrderDetails.items?.map((item, idx) => {
                  const name = item.nameAr || item.nameEn || item.name || 'منتج DUAT';
                  const thumbImage = item.designSnapshot || item.customConfig?.designSnapshot || item.image || item.images?.[0];
                  const cfg = item.customConfig || item.customDetails;
                  const layers = item.customConfig?.layers || [];
                  const uploadedImages = layers.filter((l) => l.type === 'image' && l.src);
                  const isCustomCase = item.category === 'cases' || !!cfg || !!item.designSnapshot;

                  return (
                    <div key={idx} className="p-4 space-y-3 font-sans text-xs bg-coal/40 rounded border border-grave/60">
                      {/* Top Product Header Row with Thumbnail Image */}
                      <div className="flex items-center gap-3">
                        {/* Thumbnail Image Box */}
                        <div className="w-16 h-20 bg-stone border border-gold/40 rounded flex-shrink-0 flex items-center justify-center overflow-hidden p-1 shadow-md">
                          {thumbImage ? (
                            <img src={thumbImage} alt={name} className="w-full h-full object-contain" />
                          ) : (
                            <SunDisc size={20} variant="gold" />
                          )}
                        </div>

                        {/* Title, Quantity & Price */}
                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-bold text-bone text-sm truncate">{name}</span>
                            <span className="font-mono font-bold text-gold text-sm flex-shrink-0">
                              {(item.price || 0) * (item.quantity || 1)} ج.م
                            </span>
                          </div>
                          <div className="flex items-center justify-between font-mono text-ash text-[11px]">
                            <span>الكمية: {item.quantity || 1}</span>
                            {isCustomCase && (
                              <span className="px-2 py-0.5 bg-gold/20 text-gold border border-gold/40 rounded font-bold text-[10px]">
                                🖼️ جراب مخصص
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Custom Case Specifications & Layers Breakdown */}
                      {cfg && (
                        <div className="bg-coal p-3 border border-gold/30 space-y-2 font-mono text-[11px] rounded">
                          <div className="flex flex-wrap gap-3 text-gold font-bold">
                            <span>📱 الموديل: {cfg.phoneModel || cfg.model || 'غير محدد'}</span>
                            <span>🎨 التقفيل: {cfg.caseFinish || cfg.caseType || 'جراب شفاف'}</span>
                          </div>

                          {layers.length > 0 && (
                            <div className="space-y-1 text-ash border-t border-grave/40 pt-2">
                              <span className="text-bone font-bold block">الموتيفات والطبقات المصممة ({layers.length}):</span>
                              {layers.map((l, lIdx) => (
                                <div key={lIdx} className="flex items-center justify-between gap-2">
                                  <span>
                                    • {l.type === 'text' ? `نص محفور: "${l.text}"` : l.type === 'image' ? 'صورة استيكر مرفوعة من العميل' : `موتيف: ${l.stickerId || 'قرص مجسم'}`}
                                  </span>
                                  {l.src && (
                                    <a
                                      href={l.src}
                                      download={`custom-sticker-${lIdx + 1}.png`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-gold underline hover:text-gold-light font-bold flex items-center gap-1"
                                    >
                                      <span>تحميل الصورة الأصلية للطباعة 📥</span>
                                    </a>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Render Uploaded Image Thumbnail Preview */}
                          {uploadedImages.length > 0 && (
                            <div className="pt-2 border-t border-grave/40 space-y-1">
                              <span className="text-gold font-bold block">معاينة الصور المرفوعة من العميل:</span>
                              <div className="flex flex-wrap gap-2">
                                {uploadedImages.map((img, iIdx) => (
                                  <div key={iIdx} className="relative group border border-gold/50 bg-void p-1 rounded">
                                    <img src={img.src} alt="Uploaded Sticker" className="w-16 h-16 object-contain" />
                                    <a
                                      href={img.src}
                                      download={`sticker-uploaded-${iIdx + 1}.png`}
                                      className="absolute inset-0 bg-void/80 text-gold text-[10px] flex items-center justify-center font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                      تحميل 📥
                                    </a>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                      {/* Render Visual Case Mockup Card */}
                      {isCustomCase && (
                        <div className="pt-3 border-t border-grave/40 space-y-2">
                          <span className="text-gold font-bold block flex items-center gap-1.5 text-xs">
                            <ImageIcon size={14} />
                            <span>معاينة صورة تصميم الجراب المخصص (Mockup Preview):</span>
                          </span>
                          <div className="flex flex-col sm:flex-row items-center gap-4 bg-void p-3.5 border border-gold/40 rounded-lg shadow-xl">
                            {mockupImg ? (
                              <img
                                src={mockupImg}
                                alt="Case Design Mockup"
                                className="w-36 h-60 object-contain border border-grave bg-coal rounded-lg shadow-2xl"
                              />
                            ) : (
                              <div className="w-36 h-60 bg-stone border-2 border-dashed border-gold/50 rounded-lg flex flex-col items-center justify-center p-3 text-center space-y-2">
                                <SunDisc size={32} className="text-gold" />
                                <span className="font-mono text-[11px] text-bone font-bold">{cfg?.phoneModel || 'جراب مخصص'}</span>
                                <span className="font-mono text-[9px] text-gold uppercase bg-gold/15 px-2 py-0.5 rounded">{cfg?.caseFinish || 'تقفيل شفاف'}</span>
                              </div>
                            )}

                            <div className="space-y-2.5 font-mono text-xs text-ash">
                              <p className="text-bone font-bold">هذه هي المعاينة البصرية الدقيقة لتنسيق الجراب كما قام العميل بتصميمه على المتجر.</p>
                              <div className="text-[11px] space-y-1 text-gold bg-stone/40 p-2 rounded border border-grave/40">
                                <p>📱 الموديل: {cfg?.phoneModel || cfg?.model || 'iPhone 16 Pro Max'}</p>
                                <p>🎨 التقفيل: {cfg?.caseFinish || cfg?.caseType || 'Clear Solar Canvas'}</p>
                              </div>
                              {mockupImg && (
                                <a
                                  href={mockupImg}
                                  download={`case-design-${selectedOrderDetails.id}-${idx + 1}.png`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-4 py-2 bg-gold/15 hover:bg-gold hover:text-void text-gold border border-gold text-[11px] inline-flex items-center gap-1.5 font-bold uppercase tracking-wider transition-colors shadow-md rounded"
                                >
                                  <Download size={14} />
                                  <span>تحميل صورة تصميم الجراب الكامل 🖼️</span>
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Payment Method & Proof Section */}
            {(() => {
              const proofPath = selectedOrderDetails.payment_proof_path || selectedOrderDetails.paymentProofPath;
              const directPublicUrl = proofPath
                ? (proofPath.startsWith('http') ? proofPath : `https://pgqgmrfvsvrvbddafrcf.supabase.co/storage/v1/object/public/payment-proofs/${proofPath}`)
                : null;
              const displayProofUrl = signedProofUrl || directPublicUrl;
              const isInstaPay = selectedOrderDetails.paymentMethod === 'instapay' || selectedOrderDetails.payment_method === 'instapay';

              return (
                <div className="space-y-3 border border-gold/40 bg-coal p-4 font-mono text-xs">
                  <div className="flex items-center justify-between border-b border-grave/60 pb-2">
                    <span className="text-gold font-bold uppercase flex items-center gap-1.5">
                      <CreditCard size={14} />
                      <span>طريقة الدفع:</span>
                    </span>
                    <span className="font-bold text-bone">
                      {isInstaPay ? 'تحويل سريع عبر إنستاباي (InstaPay)' : 'الدفع نقداً عند الاستلام (COD)'}
                    </span>
                  </div>

                  {displayProofUrl ? (
                    <div className="space-y-2 pt-1">
                      <span className="text-ash block text-[11px] uppercase font-bold">صورة إثبات التحويل (Screenshot):</span>
                      <a
                        href={displayProofUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block group relative overflow-hidden border border-gold/50 max-h-64 flex items-center justify-center bg-void p-2"
                      >
                        <img src={displayProofUrl} alt="Payment Proof" className="max-h-60 object-contain mx-auto" />
                        <div className="absolute inset-0 bg-void/70 opacity-0 group-hover:opacity-100 flex items-center justify-center text-gold font-bold transition-opacity">
                          عرض صورة إثبات التحويل بالحجم الكامل ↗
                        </div>
                      </a>
                      <a
                        href={displayProofUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-ghost w-full text-center text-gold border-gold/40 hover:bg-gold/10 text-xs font-bold py-2 flex items-center justify-center gap-2"
                      >
                        <ImageIcon size={14} />
                        <span>فتح اسكرين شوت التحويل في نافذة جديدة ↗</span>
                      </a>
                    </div>
                  ) : isInstaPay ? (
                    <div className="text-ember font-bold text-[11px] pt-1">
                      ⚠️ تم اختيار إنستاباي، لكن لم تتم إضافة صورة إثبات أثناء الطلب.
                    </div>
                  ) : (
                    <div className="text-ash text-[11px] pt-1">
                      ✓ الطلب تحصيل نقدي (COD) عند استلام الشحنة.
                    </div>
                  )}
                </div>
              );
            })()}

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
