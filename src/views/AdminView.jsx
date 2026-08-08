import React, { useState, useEffect } from 'react';
import { useProducts } from '../context/ProductsContext';
import { useOrders } from '../context/OrdersContext';
import { useHeroBanners } from '../context/HeroBannersContext';
import { useCategoryBanners } from '../context/CategoryBannersContext';
import { useCustomizerConfig } from '../context/CustomizerContext';
import { useSocialGrid } from '../context/SocialGridContext';
import { useToast } from '../context/ToastContext';
import { supabase } from '../lib/supabase';
import { AdminProductModal } from '../components/AdminProductModal';
import { AdminHeroSlideModal } from '../components/AdminHeroSlideModal';
import { AdminCategoryBannerModal } from '../components/AdminCategoryBannerModal';
import { AdminSocialTileModal } from '../components/AdminSocialTileModal';
import { AdminBuilderStickerModal } from '../components/AdminBuilderStickerModal';
import { CATEGORIES } from '../data/products';
import { generateCaseMockupSnapshot, getCaseFinishColor } from './CustomizerView';
import { StickerIcon } from '../components/StickerIcon';
import {
  ArrowUp,
  ArrowDown,
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
  Download,
  TrendingUp,
  BarChart2,
  CheckCircle2,
  Clock
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
  const {
    products,
    addProduct,
    updateProduct,
    adjustPrice,
    toggleProductVisibility,
    deleteProduct,
    resetProducts,
    moveProductUp,
    moveProductDown,
    setCasesFirstOrder
  } = useProducts();
  const { orders, fetchOrders, updateOrderStatus, deleteOrder, resetOrders } = useOrders();
  const { slides, addSlide, updateSlide, toggleSlideVisibility, deleteSlide, resetSlides } = useHeroBanners();
  const {
    categoryBanners,
    addCategoryBanner,
    updateCategoryBanner,
    toggleCategoryBannerVisibility,
    deleteCategoryBanner,
    resetCategoryBanners,
    forgeBanner,
    updateForgeBanner
  } = useCategoryBanners();
  const {
    settings: socialSettings,
    tiles: socialTiles,
    updateSettings: updateSocialSettings,
    addTile: addSocialTile,
    updateTile: updateSocialTile,
    toggleTileVisibility: toggleSocialTileVisibility,
    deleteTile: deleteSocialTile,
    resetSocialGrid
  } = useSocialGrid();

  const [isSocialModalOpen, setIsSocialModalOpen] = useState(false);
  const [editingSocialTile, setEditingSocialTile] = useState(null);
  const {
    builderPrice,
    caseTypes,
    phoneModels,
    builderStickers,
    addCaseType,
    updateCaseType,
    toggleCaseTypeVisibility,
    deleteCaseType,
    addPhoneModel,
    updatePhoneModel,
    deletePhoneModel,
    addBuilderSticker,
    updateBuilderSticker,
    toggleBuilderStickerVisibility,
    deleteBuilderSticker,
    resetBuilderStickers,
    setCategoryStickersVisibility,
    updatePrice,
    resetCustomizerConfig
  } = useCustomizerConfig();

  const [adminStickerFilter, setAdminStickerFilter] = useState('all');

  const [isBuilderStickerModalOpen, setIsBuilderStickerModalOpen] = useState(false);
  const [editingBuilderSticker, setEditingBuilderSticker] = useState(null);
  const { showToast } = useToast();

  // Builder Engine Tab Form States
  const [newPriceInput, setNewPriceInput] = useState(builderPrice || 850);
  const [newFinishEn, setNewFinishEn] = useState('');
  const [newFinishAr, setNewFinishAr] = useState('');
  const [newFinishColor, setNewFinishColor] = useState('#FAF9F6');
  const [newFinishRing, setNewFinishRing] = useState('#E8A33D');

  const [newModelName, setNewModelName] = useState('');
  const [newModelCategory, setNewModelCategory] = useState('Apple');

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

    const syncNotifSettingsFromDb = async () => {
      try {
        const { data } = await supabase.from('builder_settings').select('telegram_token, telegram_chat_id, admin_whatsapp').eq('id', 'global-builder-config').maybeSingle();
        if (data) {
          if (data.telegram_token) setTelegramToken(data.telegram_token);
          if (data.telegram_chat_id) setTelegramChatId(data.telegram_chat_id);
          if (data.admin_whatsapp) setAdminWhatsApp(data.admin_whatsapp);
        }
      } catch (e) {
        console.warn('Error loading telegram settings in AdminView:', e);
      }
    };
    syncNotifSettingsFromDb();

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

  // Category Banners Tab State
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategoryBanner, setEditingCategoryBanner] = useState(null);

  // Forge Feature Banner Edit State
  const [forgeEdit, setForgeEdit] = useState({
    eyebrowEn: forgeBanner?.eyebrowEn || 'THE FORGE',
    eyebrowAr: forgeBanner?.eyebrowAr || 'دوات / كور الفن',
    titleEn: forgeBanner?.titleEn || 'BUILD A CASE FOR YOURSELF.',
    titleAr: forgeBanner?.titleAr || 'صمم درعك الخاص بنفسك.',
    descEn: forgeBanner?.descEn || 'Select your phone model, choose your armor finish, and stack 3D epoxy domes or custom text on canvas. Made to order. Shipped in 5 days.',
    descAr: forgeBanner?.descAr || 'اختر موديل هاتفك، التقفيل الفاخر، والملصقات المجسمة ثلاثية الأبعاد. يُصنع حسب الطلب ويُشحن في ٥ أيام.',
    buttonTextEn: forgeBanner?.buttonTextEn || 'OPEN THE BUILDER →',
    buttonTextAr: forgeBanner?.buttonTextAr || 'افتح أداة التصميم ←',
    buttonLink: forgeBanner?.buttonLink || '/customizer',
    imageUrl: forgeBanner?.imageUrl || 'https://res.cloudinary.com/ikim5u08/image/upload/f_auto,q_auto/v1785768478/B1_TB_w1zemr.jpg',
    isActive: forgeBanner?.isActive !== false
  });

  useEffect(() => {
    if (forgeBanner) {
      setForgeEdit({
        eyebrowEn: forgeBanner.eyebrowEn || '',
        eyebrowAr: forgeBanner.eyebrowAr || '',
        titleEn: forgeBanner.titleEn || '',
        titleAr: forgeBanner.titleAr || '',
        descEn: forgeBanner.descEn || '',
        descAr: forgeBanner.descAr || '',
        buttonTextEn: forgeBanner.buttonTextEn || '',
        buttonTextAr: forgeBanner.buttonTextAr || '',
        buttonLink: forgeBanner.buttonLink || '/customizer',
        imageUrl: forgeBanner.imageUrl || '',
        isActive: forgeBanner.isActive !== false
      });
    }
  }, [forgeBanner]);

  const handleSaveForgeBanner = (e) => {
    e.preventDefault();
    updateForgeBanner(forgeEdit);
    showToast('تم حفظ بنر "صمم درعك بنفسك" (The Forge Banner) بنجاح ✨', 'success');
  };

  // Orders Tab State
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);
  const [signedProofUrl, setSignedProofUrl] = useState(null);

  // Coupons Tab State
  const [adminCoupons, setAdminCoupons] = useState(() => {
    try {
      const saved = localStorage.getItem('duat_coupons_list_v1');
      return saved ? JSON.parse(saved) : [
        { code: 'DUAT10', type: 'percentage', value: 10, isActive: true, description: 'خصم ١٠٪ على جميع المنتجات' },
        { code: 'DAWN100', type: 'fixed', value: 100, isActive: true, description: 'خصم ١٠٠ ج.م ثابت' },
        { code: 'SUMMER20', type: 'percentage', value: 20, isActive: true, description: 'خصم الصيف ٢٠٪' }
      ];
    } catch (e) {
      return [];
    }
  });
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponType, setNewCouponType] = useState('percentage');
  const [newCouponValue, setNewCouponValue] = useState(10);
  const [newCouponDesc, setNewCouponDesc] = useState('');

  const saveAdminCoupons = (updated) => {
    setAdminCoupons(updated);
    try {
      localStorage.setItem('duat_coupons_list_v1', JSON.stringify(updated));
    } catch (e) {
      console.warn('Error saving admin coupons:', e);
    }
  };

  const handleAddCoupon = (e) => {
    e.preventDefault();
    if (!newCouponCode.trim()) return;
    const codeClean = newCouponCode.trim().toUpperCase();
    if (adminCoupons.some(c => c.code === codeClean)) {
      showToast('كود الخصم موجود بالفعل!', 'error');
      return;
    }
    const updated = [
      ...adminCoupons,
      { code: codeClean, type: newCouponType, value: Number(newCouponValue), isActive: true, description: newCouponDesc.trim() || `خصم ${newCouponValue}${newCouponType === 'percentage' ? '%' : ' ج.م'}` }
    ];
    saveAdminCoupons(updated);
    setNewCouponCode('');
    setNewCouponDesc('');
    showToast('تمت إضافة كود الخصم بنجاح 🎉', 'success');
  };

  const handleToggleCoupon = (code) => {
    const updated = adminCoupons.map(c => c.code === code ? { ...c, isActive: !c.isActive } : c);
    saveAdminCoupons(updated);
  };

  const handleDeleteCoupon = (code) => {
    const updated = adminCoupons.filter(c => c.code !== code);
    saveAdminCoupons(updated);
    showToast('تم حذف كود الخصم', 'info');
  };

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

  // Calculated Sales Analytics Metrics
  const safeOrdersList = Array.isArray(orders) ? orders : [];
  const analyticsRevenue = safeOrdersList.reduce((sum, ord) => sum + Number(ord.total || ord.totalPrice || 0), 0);
  const placedOrdersCount = safeOrdersList.filter((o) => (o.status || 'placed') === 'placed').length;
  const forgeOrdersCount = safeOrdersList.filter((o) => o.status === 'forge').length;
  const analyticsShippedCount = safeOrdersList.filter((o) => o.status === 'shipped').length;
  const deliveredOrdersCount = safeOrdersList.filter((o) => o.status === 'delivered').length;
  const activeOrdersCount = placedOrdersCount + forgeOrdersCount;
  const avgOrderValue = safeOrdersList.length > 0 ? analyticsRevenue / safeOrdersList.length : 0;

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 animate-fade-in" dir="rtl">
      {/* HEADER TITLE & MAIN TABS */}
      <div className="space-y-6 border-b border-grave pb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="p-2 border border-gold/40 bg-gold/10 text-gold rounded-sm">
                <Sparkles size={22} />
              </span>
              <h1 className="font-clash text-2xl sm:text-3xl font-bold tracking-wide text-bone">
                لوحة التحكم الرئيسية (Admin Dashboard)
              </h1>
            </div>
            <p className="font-mono text-xs text-ash">
              تحكم كامل بالمنتجات والصور، بنرات الشاشة الرئيسية، والعروض وتتبع الطلبات.
            </p>
          </div>

          <button
            onClick={handleAdminLogout}
            className="self-start sm:self-auto flex items-center gap-2 px-4 py-2 border border-red-500/40 bg-red-950/30 hover:bg-red-900 text-red-400 hover:text-white transition-colors font-mono text-xs font-bold rounded-sm min-h-[40px]"
            title="تسجيل الخروج من لوحة الأدمن"
          >
            <span>تسجيل الخروج</span>
            <LogOut size={16} />
          </button>
        </div>

        {/* TABS SWITCHER SCROLLABLE STRIP */}
        <div className="w-full overflow-x-auto custom-scrollbar bg-stone/90 p-2 border border-grave rounded-sm">
          <div className="flex items-center gap-2 min-w-max">
            <button
              onClick={() => setActiveTab('products')}
              className={`flex items-center gap-2 px-4 py-2.5 font-mono text-xs uppercase tracking-wider font-bold transition-all border rounded-sm ${
                activeTab === 'products'
                  ? 'bg-gold text-[#0A0C16] border-gold shadow-md shadow-gold/20 scale-[1.02]'
                  : 'bg-coal text-bone border-grave hover:border-gold hover:text-gold'
              }`}
            >
              <Package size={16} />
              <span>المنتجات ({products.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`flex items-center gap-2 px-4 py-2.5 font-mono text-xs uppercase tracking-wider font-bold transition-all border rounded-sm ${
                activeTab === 'orders'
                  ? 'bg-gold text-[#0A0C16] border-gold shadow-md shadow-gold/20 scale-[1.02]'
                  : 'bg-coal text-bone border-grave hover:border-gold hover:text-gold'
              }`}
            >
              <ShoppingBag size={16} />
              <span>الطلبات ({orders.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('hero')}
              className={`flex items-center gap-2 px-4 py-2.5 font-mono text-xs uppercase tracking-wider font-bold transition-all border rounded-sm ${
                activeTab === 'hero'
                  ? 'bg-gold text-[#0A0C16] border-gold shadow-md shadow-gold/20 scale-[1.02]'
                  : 'bg-coal text-bone border-grave hover:border-gold hover:text-gold'
              }`}
            >
              <ImageIcon size={16} />
              <span>السلايدر والعروض ({slides.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('forge_banner')}
              className={`flex items-center gap-2 px-4 py-2.5 font-mono text-xs uppercase tracking-wider font-bold transition-all border rounded-sm ${
                activeTab === 'forge_banner'
                  ? 'bg-gold text-[#0A0C16] border-gold shadow-md shadow-gold/20 scale-[1.02]'
                  : 'bg-coal text-bone border-grave hover:border-gold hover:text-gold'
              }`}
            >
              <Sparkles size={16} />
              <span>بنر صمم درعك (The Forge) ⚡</span>
            </button>

            <button
              onClick={() => setActiveTab('notifications')}
              className={`flex items-center gap-2 px-4 py-2.5 font-mono text-xs uppercase tracking-wider font-bold transition-all border rounded-sm ${
                activeTab === 'notifications'
                  ? 'bg-gold text-[#0A0C16] border-gold shadow-md shadow-gold/20 scale-[1.02]'
                  : 'bg-coal text-bone border-grave hover:border-gold hover:text-gold'
              }`}
            >
              <Bell size={16} />
              <span>إشعارات الموبايل 📲</span>
            </button>

            <button
              onClick={() => setActiveTab('coupons')}
              className={`flex items-center gap-2 px-4 py-2.5 font-mono text-xs uppercase tracking-wider font-bold transition-all border rounded-sm ${
                activeTab === 'coupons'
                  ? 'bg-gold text-[#0A0C16] border-gold shadow-md shadow-gold/20 scale-[1.02]'
                  : 'bg-coal text-bone border-grave hover:border-gold hover:text-gold'
              }`}
            >
              <DollarSign size={16} />
              <span>أكواد الخصم والكوبونات 🏷️</span>
            </button>

            <button
              onClick={() => setActiveTab('builder')}
              className={`flex items-center gap-2 px-4 py-2.5 font-mono text-xs uppercase tracking-wider font-bold transition-all border rounded-sm ${
                activeTab === 'builder'
                  ? 'bg-gold text-[#0A0C16] border-gold shadow-md shadow-gold/20 scale-[1.02]'
                  : 'bg-coal text-bone border-grave hover:border-gold hover:text-gold'
              }`}
            >
              <Sliders size={16} />
              <span>محرر الجرابات (Builder Engine) 🎨</span>
            </button>
          </div>
        </div>
      </div>

      {/* EXECUTIVE ANALYTICS STATS OVERVIEW WIDGET */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue Card */}
        <div className="bg-stone border border-grave p-5 rounded-lg space-y-2 card-depth-highlight relative overflow-hidden">
          <div className="flex items-center justify-between text-ash">
            <span className="font-mono text-xs uppercase tracking-wider">إجمالي المبيعات</span>
            <div className="p-2 rounded bg-gold/10 text-gold">
              <DollarSign size={18} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-clash text-2xl sm:text-3xl font-bold text-bone">{analyticsRevenue.toLocaleString()}</span>
            <span className="font-mono text-xs text-gold">ج.م</span>
          </div>
          <p className="font-mono text-[10px] text-ash/80">من إجمالي {orders.length} طلبات مسجلة</p>
          <div className="absolute right-0 bottom-0 w-24 h-24 bg-gold/5 rounded-full blur-2xl pointer-events-none" />
        </div>

        {/* Total Orders & Active Fulfillment */}
        <div className="bg-stone border border-grave p-5 rounded-lg space-y-2 card-depth-highlight relative overflow-hidden">
          <div className="flex items-center justify-between text-ash">
            <span className="font-mono text-xs uppercase tracking-wider">الطلبات النشطة (Forge/Placed)</span>
            <div className="p-2 rounded bg-amber-500/10 text-amber-400">
              <Clock size={18} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-clash text-2xl sm:text-3xl font-bold text-amber-400">{activeOrdersCount}</span>
            <span className="font-mono text-xs text-ash">طلب قيد المعالجة والتصنيع</span>
          </div>
          <div className="w-full bg-coal h-1.5 rounded-full overflow-hidden mt-1 flex">
            <div style={{ width: `${(placedOrdersCount / Math.max(1, orders.length)) * 100}%` }} className="bg-amber-500 h-full" title="جديدة (Placed)" />
            <div style={{ width: `${(forgeOrdersCount / Math.max(1, orders.length)) * 100}%` }} className="bg-blue-500 h-full" title="قيد التقفيل (Forge)" />
            <div style={{ width: `${(analyticsShippedCount / Math.max(1, orders.length)) * 100}%` }} className="bg-purple-500 h-full" title="تم الشحن (Shipped)" />
            <div style={{ width: `${(deliveredOrdersCount / Math.max(1, orders.length)) * 100}%` }} className="bg-emerald-500 h-full" title="تم التوصيل (Delivered)" />
          </div>
        </div>

        {/* Average Order Value (AOV) */}
        <div className="bg-stone border border-grave p-5 rounded-lg space-y-2 card-depth-highlight relative overflow-hidden">
          <div className="flex items-center justify-between text-ash">
            <span className="font-mono text-xs uppercase tracking-wider">متوسط قيمة السلة (AOV)</span>
            <div className="p-2 rounded bg-blue-500/10 text-blue-400">
              <TrendingUp size={18} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-clash text-2xl sm:text-3xl font-bold text-bone">{Math.round(avgOrderValue).toLocaleString()}</span>
            <span className="font-mono text-xs text-blue-400">ج.م / طلب</span>
          </div>
          <p className="font-mono text-[10px] text-ash/80">معدل إنفاق العميل للطلب الواحد</p>
        </div>

        {/* Completed Deliveries */}
        <div className="bg-stone border border-grave p-5 rounded-lg space-y-2 card-depth-highlight relative overflow-hidden">
          <div className="flex items-center justify-between text-ash">
            <span className="font-mono text-xs uppercase tracking-wider">الطلبات المسلمة بنجاح</span>
            <div className="p-2 rounded bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 size={18} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-clash text-2xl sm:text-3xl font-bold text-emerald-400">{deliveredOrdersCount}</span>
            <span className="font-mono text-xs text-ash">طلب مكتمل</span>
          </div>
          <p className="font-mono text-[10px] text-ash/80">نسبة الإنجاز: {Math.round((deliveredOrdersCount / Math.max(1, orders.length)) * 100)}%</p>
        </div>
      </div>

      {/* ============================================================ */}
      {/* TAB 1: PRODUCTS MANAGEMENT */}
      {/* ============================================================ */}
      {activeTab === 'products' && (
        <div className="space-y-8 animate-fade-in">
          {/* QUICK ACTIONS */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-clash text-xl font-bold text-bone">كتالوج المنتجات وترتيب العرض</h2>
              <p className="font-mono text-xs text-ash mt-0.5">يمكنك تقديم أو تأخير أي منتج باستخدام أزرار الترتيب (▲/▼)</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => {
                  setCasesFirstOrder();
                  showToast('تم ترتيب القائمة: الجرابات أولاً!', 'success');
                }}
                className="flex items-center gap-2 px-4 py-2 border border-gold/40 bg-gold/10 hover:bg-gold hover:text-[#050505] text-gold font-bold transition-all font-mono text-xs uppercase"
                title="جعل كافة الجرابات والباندلات تظهر في البداية قبل الاستيكرات"
              >
                <Layers size={15} />
                <span>ترتيب: الجرابات أولاً 📱</span>
              </button>

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
                      <th className="py-3.5 px-4 text-center">الترتيب</th>
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
                      const globalIndex = products.findIndex((p) => p.id === product.id);
                      return (
                        <tr key={product.id} className="hover:bg-stone/30 transition-colors">
                          {/* ORDER CONTROL BUTTONS (UP / DOWN) */}
                          <td className="py-4 px-3 text-center">
                            <div className="flex items-center justify-center gap-1 font-mono text-xs">
                              <button
                                onClick={() => {
                                  moveProductUp(product.id);
                                  showToast('تم تمييز المنتج ورفعه للأعلى!', 'info');
                                }}
                                disabled={globalIndex <= 0}
                                className="p-1.5 border border-grave bg-stone/60 hover:border-gold hover:text-gold text-ash disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                title="تحريك للأعلى (ترتيب أسبق)"
                              >
                                <ArrowUp size={15} />
                              </button>
                              <span className="font-bold text-gold px-2 py-1 border border-grave bg-coal/80 text-[11px] min-w-[32px] text-center shadow-inner">
                                #{globalIndex + 1}
                              </span>
                              <button
                                onClick={() => {
                                  moveProductDown(product.id);
                                  showToast('تم تحريك المنتج للأسفل!', 'info');
                                }}
                                disabled={globalIndex === -1 || globalIndex >= products.length - 1}
                                className="p-1.5 border border-grave bg-stone/60 hover:border-gold hover:text-gold text-ash disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                title="تحريك للأسفل (ترتيب متأخر)"
                              >
                                <ArrowDown size={15} />
                              </button>
                            </div>
                          </td>

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
            {slides.map((slide, index) => {
              const isSlideActive = slide.is_active !== false && slide.isActive !== false && String(slide.is_active) !== 'false';
              return (
                <div
                  key={slide.id}
                  className={`bg-stone border overflow-hidden shadow-lg card-depth-highlight flex flex-col justify-between transition-all ${
                    isSlideActive ? 'border-grave' : 'border-red-900/60 opacity-65 bg-stone/70'
                  }`}
                >
                  {/* Hero Background Preview Box */}
                  <div className="h-48 bg-void relative border-b border-grave overflow-hidden flex items-center justify-center p-4">
                    {slide.imageUrl || slide.image ? (
                      <img
                        src={slide.imageUrl || slide.image}
                        alt={slide.headline1Ar || slide.headline1En}
                        className="w-full h-full object-cover"
                      />
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
                          showToast(isSlideActive ? 'تم إخفاء البنر من الصفحة الرئيسية' : 'تم إظهار البنر في الصفحة الرئيسية', 'info');
                        }}
                        className={`px-3 py-1 border font-mono text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer ${
                          isSlideActive
                            ? 'border-emerald-500 bg-emerald-600/90 text-white hover:bg-emerald-700'
                            : 'border-amber-500 bg-amber-600/90 text-white hover:bg-amber-700'
                        }`}
                        title={isSlideActive ? 'إخفاء البنر من الصفحة الرئيسية' : 'إظهار البنر في الصفحة الرئيسية'}
                      >
                        {isSlideActive ? <Eye size={13} /> : <EyeOff size={13} />}
                        <span>{isSlideActive ? 'ظاهر (إخفاء)' : 'مخفي (إظهار)'}</span>
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
                        showToast(isSlideActive ? 'تم إخفاء البنر من الصفحة الرئيسية' : 'تم إظهار البنر في الصفحة الرئيسية', 'info');
                      }}
                      className={`flex items-center gap-1.5 px-3 py-2 border font-mono text-xs font-bold transition-colors ${
                        isSlideActive
                          ? 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20'
                          : 'border-amber-500/40 text-amber-400 bg-amber-500/10 hover:bg-amber-500/20'
                      }`}
                      title={isSlideActive ? 'إخفاء البنر من الصفحة الرئيسية' : 'إظهار البنر في الصفحة الرئيسية'}
                    >
                      {isSlideActive ? <Eye size={14} /> : <EyeOff size={14} />}
                      <span>{isSlideActive ? 'ظاهر' : 'مخفي'}</span>
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
              );
            })}
          </div>

          {/* ============================================================ */}
          {/* CATEGORY SHOWCASE CARDS MANAGEMENT */}
          {/* ============================================================ */}
          <div className="pt-10 border-t border-gold/40 space-y-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-grave pb-4">
              <div>
                <span className="font-mono text-xs text-gold font-bold uppercase tracking-widest block">
                  DUAT / CATEGORY SHOWCASE BANNERS
                </span>
                <h3 className="font-clash text-2xl uppercase text-bone font-bold mt-1">
                  إدارة كروت وصور الأقسام الرئيسية (CATEGORIES)
                </h3>
                <p className="font-mono text-xs text-ash mt-1">
                  التحكم الكامل في إضافة، تعديل، إخفاء/إظهار، وحذف كروت الأقسام في الصفحة الرئيسية.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => {
                    setEditingCategoryBanner({
                      id: '',
                      nameEn: '',
                      nameAr: '',
                      subtitleEn: '',
                      subtitleAr: '',
                      imageUrl: 'https://res.cloudinary.com/ikim5u08/image/upload/f_auto,q_auto/v1785764123/B1_DarkNight_dzbmmn.jpg',
                      badge: `0${categoryBanners.length + 1}`,
                      categoryLink: '/shop',
                      is_active: true
                    });
                    setIsCategoryModalOpen(true);
                  }}
                  className="btn-primary py-2.5 px-4 text-xs font-mono font-bold flex items-center gap-2"
                >
                  <Plus size={16} />
                  <span>إضافة كارت قسم جديد +</span>
                </button>

                <button
                  onClick={() => {
                    if (window.confirm('هل أنت تأكد من إعادة ضبط كروت الأقسام للوضع الافتراضي؟')) {
                      resetCategoryBanners();
                      showToast('تمت إعادة ضبط كروت الأقسام الافتراضية 🔄', 'success');
                    }
                  }}
                  className="flex items-center gap-1.5 px-3 py-2 border border-grave bg-stone/60 hover:border-gold text-ash hover:text-gold font-mono text-xs font-bold transition-all rounded"
                >
                  <RotateCcw size={14} />
                  <span>إعادة ضبط كروت الأقسام 🔄</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {categoryBanners.map((cat, catIdx) => {
                const isActive = cat.is_active !== false && cat.isActive !== false;
                return (
                  <div
                    key={cat.id}
                    className={`bg-stone border overflow-hidden shadow-lg card-depth-highlight flex flex-col justify-between transition-all ${
                      isActive ? 'border-grave' : 'border-red-900/40 opacity-60'
                    }`}
                  >
                    {/* Category Image Preview Box */}
                    <div className="h-44 bg-void relative border-b border-grave overflow-hidden flex items-center justify-center p-2">
                      <img
                        src={cat.imageUrl || cat.image || 'https://res.cloudinary.com/ikim5u08/image/upload/f_auto,q_auto/v1785764123/B1_DarkNight_dzbmmn.jpg'}
                        alt={cat.nameEn}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 right-3 bg-void/90 border border-gold/40 px-2.5 py-1 font-mono text-xs text-gold font-bold">
                        قسم #{cat.badge || `0${catIdx + 1}`}
                      </div>
                      <div className="absolute top-3 left-3">
                        <span
                          className={`font-mono text-[10px] uppercase font-bold px-2 py-0.5 border ${
                            isActive
                              ? 'bg-emerald-950/80 text-emerald-400 border-emerald-500/40'
                              : 'bg-red-950/80 text-red-400 border-red-500/40'
                          }`}
                        >
                          {isActive ? 'نشط (ظاهر)' : 'مخفي'}
                        </span>
                      </div>
                    </div>

                    {/* Category Card Details */}
                    <div className="p-5 space-y-2 flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-clash text-xl font-bold text-bone">
                          {cat.nameAr} <span className="text-gold font-mono text-sm">({cat.nameEn})</span>
                        </h4>
                      </div>
                      <p className="font-space text-xs text-ash">
                        {cat.subtitleAr} / {cat.subtitleEn}
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="p-4 bg-stone/40 border-t border-grave flex items-center justify-between gap-2">
                      <button
                        onClick={() => toggleCategoryBannerVisibility(cat.id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 border font-mono text-xs font-bold transition-all rounded ${
                          isActive
                            ? 'border-ash/40 bg-coal text-ash hover:text-gold'
                            : 'border-emerald-700/60 bg-emerald-950/30 text-emerald-400 hover:bg-emerald-900/40'
                        }`}
                      >
                        {isActive ? <EyeOff size={14} /> : <Eye size={14} />}
                        <span>{isActive ? 'إخفاء' : 'إظهار'}</span>
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setEditingCategoryBanner(cat);
                            setIsCategoryModalOpen(true);
                          }}
                          className="flex items-center gap-1.5 px-3.5 py-1.5 border border-gold/60 bg-gold/15 hover:bg-gold hover:text-void text-gold font-mono text-xs font-bold transition-all shadow-md rounded"
                        >
                          <Edit2 size={14} />
                          <span>تعديل 🖼️</span>
                        </button>

                        <button
                          onClick={() => {
                            if (window.confirm(`هل أنت تأكد من حذف كارت القسم "${cat.nameAr || cat.nameEn}"؟`)) {
                              deleteCategoryBanner(cat.id);
                              showToast('تم حذف كارت القسم بنجاح 🗑️', 'success');
                            }
                          }}
                          className="flex items-center gap-1 p-1.5 border border-red-900/60 bg-red-950/30 hover:bg-red-900 text-red-400 hover:text-white font-mono text-xs transition-all rounded"
                          title="حذف كارت القسم"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ============================================================ */}
          {/* SOCIAL GRID (FOLLOW THE PASSAGE) MANAGEMENT */}
          {/* ============================================================ */}
          <div className="pt-10 border-t border-gold/40 space-y-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-grave pb-4">
              <div>
                <span className="font-mono text-xs text-gold font-bold uppercase tracking-widest block">
                  DUAT / SOCIAL GRID & INSTAGRAM
                </span>
                <h3 className="font-clash text-2xl uppercase text-bone font-bold mt-1">
                  إدارة معرض الصور والشبكة الاجتماعية (FOLLOW THE PASSAGE)
                </h3>
                <p className="font-mono text-xs text-ash mt-1">
                  التحكم الكامل في عناوين ورابط وحساب إنستجرام، بالإضافة لإضافة، تعديل، وإخفاء صور المعرض السفلي.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => {
                    setEditingSocialTile({
                      id: '',
                      title: '',
                      image: 'https://res.cloudinary.com/ikim5u08/image/upload/f_auto,q_auto/v1785764123/B1_DarkNight_dzbmmn.jpg',
                      linkUrl: socialSettings?.handleUrl || 'https://instagram.com/duat.wear',
                      is_active: true
                    });
                    setIsSocialModalOpen(true);
                  }}
                  className="btn-primary py-2.5 px-4 text-xs font-mono font-bold flex items-center gap-2"
                >
                  <Plus size={16} />
                  <span>إضافة صورة جديدة للمعرض +</span>
                </button>

                <button
                  onClick={() => {
                    if (window.confirm('هل أنت تأكد من إعادة ضبط معرض الصور للوضع الافتراضي؟')) {
                      resetSocialGrid();
                      showToast('تمت إعادة ضبط معرض إنستجرام الافتراضي 🔄', 'success');
                    }
                  }}
                  className="flex items-center gap-1.5 px-3 py-2 border border-grave bg-stone/60 hover:border-gold text-ash hover:text-gold font-mono text-xs font-bold transition-all rounded"
                >
                  <RotateCcw size={14} />
                  <span>إعادة ضبط المعرض 🔄</span>
                </button>
              </div>
            </div>

            {/* Social Grid Header Settings Form */}
            <div className="bg-stone border border-grave p-6 rounded-lg space-y-4 shadow-lg">
              <h4 className="font-clash text-lg font-bold text-gold uppercase border-b border-grave pb-2">
                تعديل عناوين وحساب إنستجرام (Header Settings)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 font-mono text-xs">
                <div>
                  <label className="block text-ash mb-1">النص العلوي (Eyebrow):</label>
                  <input
                    type="text"
                    value={socialSettings?.eyebrow || ''}
                    onChange={(e) => updateSocialSettings({ eyebrow: e.target.value })}
                    className="w-full bg-coal border border-grave p-2.5 text-bone focus:border-gold outline-none rounded"
                  />
                </div>
                <div>
                  <label className="block text-gold font-bold mb-1">العنوان بالعربي (Title AR):</label>
                  <input
                    type="text"
                    value={socialSettings?.titleAr || ''}
                    onChange={(e) => updateSocialSettings({ titleAr: e.target.value })}
                    className="w-full bg-coal border border-grave p-2.5 text-bone focus:border-gold outline-none rounded"
                  />
                </div>
                <div>
                  <label className="block text-gold font-bold mb-1">العنوان بالإنجليزي (Title EN):</label>
                  <input
                    type="text"
                    value={socialSettings?.titleEn || ''}
                    onChange={(e) => updateSocialSettings({ titleEn: e.target.value })}
                    className="w-full bg-coal border border-grave p-2.5 text-bone focus:border-gold outline-none rounded"
                  />
                </div>
                <div>
                  <label className="block text-ash mb-1">اسم حساب إنستجرام (Handle Label):</label>
                  <input
                    type="text"
                    value={socialSettings?.handleLabel || ''}
                    onChange={(e) => updateSocialSettings({ handleLabel: e.target.value })}
                    className="w-full bg-coal border border-grave p-2.5 text-bone focus:border-gold outline-none rounded"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-ash mb-1">رابط صفحة إنستجرام (Instagram URL):</label>
                  <input
                    type="text"
                    value={socialSettings?.handleUrl || ''}
                    onChange={(e) => updateSocialSettings({ handleUrl: e.target.value })}
                    className="w-full bg-coal border border-grave p-2.5 text-bone focus:border-gold outline-none rounded"
                  />
                </div>
              </div>
            </div>

            {/* Social Photo Tiles Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {socialTiles.map((tile) => {
                const isActive = tile.is_active !== false && tile.isActive !== false;
                return (
                  <div
                    key={tile.id}
                    className={`bg-stone border overflow-hidden shadow-lg flex flex-col justify-between rounded-lg transition-all ${
                      isActive ? 'border-grave' : 'border-red-900/40 opacity-60'
                    }`}
                  >
                    {/* Preview Box */}
                    <div className="aspect-square bg-void relative border-b border-grave overflow-hidden flex items-center justify-center">
                      <img
                        src={tile.image || tile.imageUrl}
                        alt={tile.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 left-2">
                        <span
                          className={`font-mono text-[9px] uppercase font-bold px-1.5 py-0.5 border ${
                            isActive
                              ? 'bg-emerald-950/80 text-emerald-400 border-emerald-500/40'
                              : 'bg-red-950/80 text-red-400 border-red-500/40'
                          }`}
                        >
                          {isActive ? 'ظاهر' : 'مخفي'}
                        </span>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="p-3 space-y-1 flex-1">
                      <h5 className="font-mono text-xs font-bold text-bone truncate">{tile.title}</h5>
                    </div>

                    {/* Actions */}
                    <div className="p-2 bg-stone/40 border-t border-grave flex items-center justify-between gap-1">
                      <button
                        onClick={() => toggleSocialTileVisibility(tile.id)}
                        className={`p-1.5 border font-mono text-xs transition-all rounded ${
                          isActive
                            ? 'border-ash/40 bg-coal text-ash hover:text-gold'
                            : 'border-emerald-700/60 bg-emerald-950/30 text-emerald-400'
                        }`}
                        title={isActive ? 'إخفاء الصورة' : 'إظهار الصورة'}
                      >
                        {isActive ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setEditingSocialTile(tile);
                            setIsSocialModalOpen(true);
                          }}
                          className="p-1.5 border border-gold/60 bg-gold/15 hover:bg-gold hover:text-void text-gold font-mono text-xs font-bold transition-all rounded"
                          title="تعديل الصورة"
                        >
                          <Edit2 size={14} />
                        </button>

                        <button
                          onClick={() => {
                            if (window.confirm(`حذف هذه الصورة "${tile.title}" من المعرض؟`)) {
                              deleteSocialTile(tile.id);
                              showToast('تم حذف الصورة من المعرض 🗑️', 'success');
                            }
                          }}
                          className="p-1.5 border border-red-900/60 bg-red-950/30 hover:bg-red-900 text-red-400 hover:text-white transition-all rounded"
                          title="حذف الصورة"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 3.5: THE FORGE FEATURE PROMO BANNER EDITOR */}
      {/* ============================================================ */}
      {activeTab === 'forge_banner' && (
        <div className="space-y-8 animate-fade-in max-w-5xl mx-auto">
          {/* Header Description */}
          <div className="bg-stone border border-gold/40 p-6 sm:p-8 space-y-6 rounded-lg card-depth-highlight shadow-2xl">
            <div className="flex items-center gap-3 border-b border-grave pb-4">
              <Sparkles className="text-gold" size={26} />
              <div>
                <h2 className="font-clash text-xl font-bold text-bone">إدارة بنر "صمم درعك بنفسك" (The Forge Banner Control Panel)</h2>
                <p className="font-mono text-xs text-ash">تعديل كافة نصوص، شارة، صورة، ورابط التوجيه للبنر الترويجي الفاخر بمنتصف الصفحة الرئيسية.</p>
              </div>
            </div>

            {/* Live Banner Preview Box */}
            <div className="p-6 bg-coal border border-grave rounded-lg space-y-3">
              <span className="font-mono text-xs text-gold uppercase tracking-widest block font-bold">معاينة حية للبنر في الصفحة الرئيسية (Live Banner Preview)</span>
              <div className="p-6 bg-stone border border-gold/30 rounded flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-2 flex-1">
                  <span className="font-mono text-[10px] text-gold uppercase tracking-widest font-bold block">{forgeEdit.eyebrowEn || 'THE FORGE'}</span>
                  <h3 className="font-clash text-2xl font-bold text-bone uppercase tracking-tight">{forgeEdit.titleEn || 'BUILD A CASE FOR YOURSELF.'}</h3>
                  <p className="font-space text-xs text-ash leading-relaxed max-w-lg">{forgeEdit.descEn}</p>
                  <span className="inline-block mt-2 px-5 py-2.5 bg-gold text-[#0A0C16] font-mono text-xs font-bold uppercase rounded shadow-lg">{forgeEdit.buttonTextEn || 'OPEN THE BUILDER →'}</span>
                </div>
                {forgeEdit.imageUrl && (
                  <div className="w-36 h-36 flex-shrink-0 flex items-center justify-center p-2 bg-void border border-grave rounded shadow-md">
                    <img src={forgeEdit.imageUrl} alt="Preview" className="max-w-full max-h-full object-contain drop-shadow-lg" />
                  </div>
                )}
              </div>
            </div>

            {/* Form Inputs */}
            <form onSubmit={handleSaveForgeBanner} className="space-y-6 font-mono text-xs">
              
              {/* Active Toggle & Image URL */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center bg-coal/70 p-4 border border-grave rounded">
                <div className="sm:col-span-4 flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="forgeIsActive"
                    checked={forgeEdit.isActive}
                    onChange={(e) => setForgeEdit({ ...forgeEdit, isActive: e.target.checked })}
                    className="w-4 h-4 accent-gold cursor-pointer"
                  />
                  <label htmlFor="forgeIsActive" className="text-bone font-bold cursor-pointer">
                    تفعيل إظهار البنر في الصفحة الرئيسية
                  </label>
                </div>

                <div className="sm:col-span-8">
                  <label className="block text-ash mb-1 uppercase font-bold">رابط صورة المعاينة (Cloudinary / Image URL)</label>
                  <input
                    type="text"
                    value={forgeEdit.imageUrl}
                    onChange={(e) => setForgeEdit({ ...forgeEdit, imageUrl: e.target.value })}
                    placeholder="https://res.cloudinary.com/..."
                    className="w-full bg-stone border border-grave px-3 py-2.5 text-bone font-mono focus:border-gold outline-none"
                  />
                </div>
              </div>

              {/* Bilingual Eyebrow & Title */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gold mb-1 font-bold">العنوان الفرعي بالإنجليزية (Eyebrow EN)</label>
                  <input
                    type="text"
                    value={forgeEdit.eyebrowEn}
                    onChange={(e) => setForgeEdit({ ...forgeEdit, eyebrowEn: e.target.value })}
                    className="w-full bg-coal border border-grave px-3 py-2.5 text-bone font-mono focus:border-gold outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gold mb-1 font-bold">العنوان الفرعي بالعربية (Eyebrow AR)</label>
                  <input
                    type="text"
                    value={forgeEdit.eyebrowAr}
                    onChange={(e) => setForgeEdit({ ...forgeEdit, eyebrowAr: e.target.value })}
                    className="w-full bg-coal border border-grave px-3 py-2.5 text-bone font-mono focus:border-gold outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gold mb-1 font-bold">العنوان الرئيسي بالإنجليزية (Title EN)</label>
                  <input
                    type="text"
                    value={forgeEdit.titleEn}
                    onChange={(e) => setForgeEdit({ ...forgeEdit, titleEn: e.target.value })}
                    className="w-full bg-coal border border-grave px-3 py-2.5 text-bone font-mono focus:border-gold outline-none uppercase font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gold mb-1 font-bold">العنوان الرئيسي بالعربية (Title AR)</label>
                  <input
                    type="text"
                    value={forgeEdit.titleAr}
                    onChange={(e) => setForgeEdit({ ...forgeEdit, titleAr: e.target.value })}
                    className="w-full bg-coal border border-grave px-3 py-2.5 text-bone font-mono focus:border-gold outline-none font-bold"
                    required
                  />
                </div>
              </div>

              {/* Bilingual Description */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-ash mb-1">الوصف بالإنجليزية (Description EN)</label>
                  <textarea
                    rows={3}
                    value={forgeEdit.descEn}
                    onChange={(e) => setForgeEdit({ ...forgeEdit, descEn: e.target.value })}
                    className="w-full bg-coal border border-grave p-3 text-bone font-mono focus:border-gold outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-ash mb-1">الوصف بالعربية (Description AR)</label>
                  <textarea
                    rows={3}
                    value={forgeEdit.descAr}
                    onChange={(e) => setForgeEdit({ ...forgeEdit, descAr: e.target.value })}
                    className="w-full bg-coal border border-grave p-3 text-bone font-mono focus:border-gold outline-none"
                    required
                  />
                </div>
              </div>

              {/* Button Text & Link */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                <div className="sm:col-span-4">
                  <label className="block text-ash mb-1">نص الزر بالإنجليزية (CTA Button EN)</label>
                  <input
                    type="text"
                    value={forgeEdit.buttonTextEn}
                    onChange={(e) => setForgeEdit({ ...forgeEdit, buttonTextEn: e.target.value })}
                    className="w-full bg-coal border border-grave px-3 py-2.5 text-bone font-mono focus:border-gold outline-none uppercase"
                    required
                  />
                </div>

                <div className="sm:col-span-4">
                  <label className="block text-ash mb-1">نص الزر بالعربية (CTA Button AR)</label>
                  <input
                    type="text"
                    value={forgeEdit.buttonTextAr}
                    onChange={(e) => setForgeEdit({ ...forgeEdit, buttonTextAr: e.target.value })}
                    className="w-full bg-coal border border-grave px-3 py-2.5 text-bone font-mono focus:border-gold outline-none"
                    required
                  />
                </div>

                <div className="sm:col-span-4">
                  <label className="block text-ash mb-1">رابط الزر (Target Link)</label>
                  <input
                    type="text"
                    value={forgeEdit.buttonLink}
                    onChange={(e) => setForgeEdit({ ...forgeEdit, buttonLink: e.target.value })}
                    placeholder="/customizer"
                    className="w-full bg-coal border border-grave px-3 py-2.5 text-bone font-mono focus:border-gold outline-none"
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4 border-t border-grave flex items-center justify-end">
                <button
                  type="submit"
                  className="btn-primary py-3.5 px-8 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-gold/20"
                >
                  <Sparkles size={16} />
                  <span>حفظ التعديلات في البنر</span>
                </button>
              </div>
            </form>
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

      {/* ============================================================ */}
      {/* TAB 5: COUPONS & PROMOS MANAGEMENT */}
      {/* ============================================================ */}
      {activeTab === 'coupons' && (
        <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
          {/* Add New Coupon Form */}
          <div className="bg-stone border border-grave p-6 rounded-lg space-y-4">
            <h3 className="font-clash text-lg font-bold text-bone flex items-center gap-2">
              <DollarSign className="text-gold" size={20} />
              <span>إضافة كود خصم جديد (New Promo Coupon)</span>
            </h3>

            <form onSubmit={handleAddCoupon} className="grid grid-cols-1 sm:grid-cols-12 gap-4 font-mono text-xs">
              <div className="sm:col-span-4">
                <label className="block text-ash mb-1 uppercase">كود الخصم (Coupon Code)</label>
                <input
                  type="text"
                  placeholder="مثال: DUAT20"
                  value={newCouponCode}
                  onChange={(e) => setNewCouponCode(e.target.value)}
                  className="w-full bg-coal border border-grave px-3 py-2.5 text-bone font-mono focus:border-gold outline-none uppercase"
                  required
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-ash mb-1 uppercase">نوع الخصم</label>
                <select
                  value={newCouponType}
                  onChange={(e) => setNewCouponType(e.target.value)}
                  className="w-full bg-coal border border-grave px-3 py-2.5 text-bone font-mono focus:border-gold outline-none"
                >
                  <option value="percentage">نسبة مئوية (%)</option>
                  <option value="fixed">مبلغ ثابت (ج.م)</option>
                </select>
              </div>

              <div className="sm:col-span-3">
                <label className="block text-ash mb-1 uppercase">القيمة (Value)</label>
                <input
                  type="number"
                  min="1"
                  value={newCouponValue}
                  onChange={(e) => setNewCouponValue(e.target.value)}
                  className="w-full bg-coal border border-grave px-3 py-2.5 text-bone font-mono focus:border-gold outline-none"
                  required
                />
              </div>

              <div className="sm:col-span-2 flex items-end">
                <button
                  type="submit"
                  className="btn-primary w-full py-2.5 font-mono text-xs uppercase tracking-wider min-h-[42px]"
                >
                  إضافة الكوبون
                </button>
              </div>
            </form>
          </div>

          {/* Active Coupons List */}
          <div className="bg-stone border border-grave p-6 rounded-lg space-y-4">
            <h3 className="font-clash text-lg font-bold text-bone">قائمة الكوبونات النشطة ({adminCoupons.length})</h3>

            <div className="space-y-3">
              {adminCoupons.map((coupon) => (
                <div
                  key={coupon.code}
                  className="p-4 bg-coal border border-grave flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 rounded"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-base font-bold text-gold tracking-wider">{coupon.code}</span>
                      <span className={`px-2 py-0.5 text-[10px] font-mono rounded ${coupon.isActive ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40' : 'bg-red-950 text-red-400 border border-red-500/40'}`}>
                        {coupon.isActive ? 'مفعل' : 'معطل'}
                      </span>
                    </div>
                    <p className="font-mono text-xs text-ash">{coupon.description || `خصم ${coupon.value}${coupon.type === 'percentage' ? '%' : ' ج.م'}`}</p>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                      type="button"
                      onClick={() => handleToggleCoupon(coupon.code)}
                      className={`px-3 py-1.5 font-mono text-xs border rounded transition-colors ${
                        coupon.isActive ? 'border-amber-500/40 text-amber-400 hover:bg-amber-950/30' : 'border-emerald-500/40 text-emerald-400 hover:bg-emerald-950/30'
                      }`}
                    >
                      {coupon.isActive ? 'إيقاف' : 'تفعيل'}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteCoupon(coupon.code)}
                      className="p-1.5 border border-red-900/40 text-red-400 hover:bg-red-950/30 rounded transition-colors"
                      title="حذف الكوبون"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 5: CASE BUILDER ENGINE & ASSETS CONTROL PANEL */}
      {/* ============================================================ */}
      {activeTab === 'builder' && (
        <div className="space-y-8 animate-fade-in">
          
          {/* Header Card */}
          <div className="bg-stone border border-gold/40 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
            <div>
              <span className="font-mono text-xs text-gold font-bold uppercase tracking-widest block">
                DUAT / BUILDER ENGINE & ASSETS CONTROL
              </span>
              <h2 className="font-clash text-2xl uppercase text-bone font-bold mt-1">
                محرر الجرابات التفاعلي (Case Builder Engine)
              </h2>
              <p className="font-mono text-xs text-ash mt-1">
                التحكم الكامل في ألوان وتصميمات الجرابات، موديلات الهواتف المتاحة، سعر التصميم، والإظهار/الإخفاء الفوري.
              </p>
            </div>

            <button
              onClick={() => {
                if (window.confirm('هل أنت تأكد من إعادة ضبط ألوان الجرابات والموديلات إلى الإعدادات الافتراضية؟')) {
                  resetCustomizerConfig();
                  showToast('تمت إعادة ضبط إعدادات البلدر بنجاح!', 'info');
                }
              }}
              className="flex items-center gap-2 px-4 py-2 border border-grave bg-coal hover:border-gold text-ash hover:text-bone font-mono text-xs uppercase transition-colors"
            >
              <RotateCcw size={15} />
              <span>إعادة ضبط البلدر الافتراضي</span>
            </button>
          </div>

          {/* 1. BUILDER PRICE CONTROL CARD */}
          <div className="bg-stone border border-grave p-6 space-y-4">
            <h3 className="font-mono text-xs uppercase tracking-widest text-gold font-bold flex items-center gap-2">
              <DollarSign size={16} />
              <span>سعر التصميم المخصص الافتراضي (Default Custom Case Price)</span>
            </h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                updatePrice(newPriceInput);
                showToast(`تم تغيير سعر التصميم إلى ${newPriceInput} ج.م بنجاح! 💰`, 'success');
              }}
              className="flex flex-col sm:flex-row items-center gap-3 max-w-xl"
            >
              <div className="relative flex-1 w-full">
                <input
                  type="number"
                  value={newPriceInput}
                  onChange={(e) => setNewPriceInput(e.target.value)}
                  className="w-full bg-coal border border-grave px-4 py-2.5 text-bone font-mono font-bold text-sm focus:border-gold outline-none"
                  placeholder="850"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-xs text-gold">EGP</span>
              </div>
              <button
                type="submit"
                className="btn-primary w-full sm:w-auto px-6 py-2.5 font-mono text-xs uppercase font-bold flex items-center justify-center gap-2"
              >
                <Save size={16} />
                <span>حفظ السعر الجديد</span>
              </button>
            </form>
          </div>

          {/* 2. CASE FINISHES & COLORS CONTROL TABLE */}
          <div className="bg-stone border border-grave p-6 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-grave pb-4">
              <div>
                <h3 className="font-mono text-xs uppercase tracking-widest text-gold font-bold flex items-center gap-2">
                  <Sliders size={16} />
                  <span>ألوان وتقفيلات الجرابات (Case Armor Finishes — {caseTypes.length})</span>
                </h3>
                <p className="font-mono text-xs text-ash mt-1">
                  قم بإضافة ألوان جديدة، تغيير أسمائها بالعربي/الإنجليزي، كود اللون Hex، وإظهارها أو إخفائها بضغطة زر.
                </p>
              </div>
            </div>

            {/* Form to Add New Finish */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newFinishEn.trim() || !newFinishAr.trim()) {
                  showToast('يرجى إدخال اسم التقفيل باللغتين الإنجليزية والعربية', 'error');
                  return;
                }
                addCaseType({
                  nameEn: newFinishEn,
                  nameAr: newFinishAr,
                  color: newFinishColor,
                  ring: newFinishRing
                });
                showToast(`تمت إضافة التقفيل الجديد "${newFinishAr}" بنجاح! 🎨`, 'success');
                setNewFinishEn('');
                setNewFinishAr('');
              }}
              className="bg-coal p-4 border border-gold/30 rounded space-y-4"
            >
              <span className="font-mono text-xs text-gold font-bold block">🎨 إضافة تقفيل / لون جراب جديد:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <label className="font-mono text-[11px] text-ash block mb-1">الاسم بالإنجليزي (EN):</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Frost Blue"
                    value={newFinishEn}
                    onChange={(e) => setNewFinishEn(e.target.value)}
                    className="w-full bg-stone border border-grave p-2 text-xs font-mono text-bone focus:border-gold outline-none"
                  />
                </div>

                <div>
                  <label className="font-mono text-[11px] text-ash block mb-1">الاسم بالعربي (AR):</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: أزرق ثلجي ضبابي"
                    value={newFinishAr}
                    onChange={(e) => setNewFinishAr(e.target.value)}
                    className="w-full bg-stone border border-grave p-2 text-xs font-mono text-bone focus:border-gold outline-none"
                  />
                </div>

                <div>
                  <label className="font-mono text-[11px] text-ash block mb-1">لون الجراب (Hex Code):</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={newFinishColor}
                      onChange={(e) => setNewFinishColor(e.target.value)}
                      className="w-8 h-8 rounded border border-grave bg-transparent cursor-pointer"
                    />
                    <input
                      type="text"
                      value={newFinishColor}
                      onChange={(e) => setNewFinishColor(e.target.value)}
                      className="w-full bg-stone border border-grave p-2 text-xs font-mono text-bone uppercase focus:border-gold outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-end">
                  <button
                    type="submit"
                    className="btn-primary w-full py-2 text-xs font-mono font-bold uppercase flex items-center justify-center gap-2 min-h-[38px]"
                  >
                    <Plus size={16} />
                    <span>إضافة اللون</span>
                  </button>
                </div>
              </div>
            </form>

            {/* List of Case Finishes */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {caseTypes.map((ct) => (
                <div
                  key={ct.id}
                  className={`p-4 bg-coal border rounded flex flex-col justify-between space-y-3 transition-colors ${
                    ct.is_active !== false ? 'border-grave hover:border-gold/60' : 'border-red-900/50 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-full border-2 border-grave shadow-md flex-shrink-0"
                      style={{ backgroundColor: ct.color || '#FFFFFF' }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-space text-xs font-bold text-bone truncate">{ct.nameAr}</p>
                      <p className="font-mono text-[11px] text-ash truncate">{ct.nameEn}</p>
                      <span className="font-mono text-[10px] text-gold uppercase">{ct.color}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-grave/40 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        toggleCaseTypeVisibility(ct.id);
                        showToast(ct.is_active !== false ? `تم إخفاء التقفيل "${ct.nameAr}"` : `تم إظهار التقفيل "${ct.nameAr}"`, 'info');
                      }}
                      className={`flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-mono font-bold border transition-colors ${
                        ct.is_active !== false
                          ? 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20'
                          : 'border-amber-500/40 text-amber-400 bg-amber-500/10 hover:bg-amber-500/20'
                      }`}
                    >
                      {ct.is_active !== false ? <Eye size={13} /> : <EyeOff size={13} />}
                      <span>{ct.is_active !== false ? 'ظاهر (إخفاء)' : 'مخفي (إظهار)'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm(`هل أنت تأكد من حذف التقفيل "${ct.nameAr}"؟`)) {
                          deleteCaseType(ct.id);
                          showToast('تم حذف التقفيل بنجاح', 'warning');
                        }
                      }}
                      className="p-1.5 text-red-400 hover:text-red-300 border border-red-500/30 bg-red-500/10 rounded transition-colors"
                      title="حذف التقفيل"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. PHONE MODELS CONTROL TABLE */}
          <div className="bg-stone border border-grave p-6 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-grave pb-4">
              <div>
                <h3 className="font-mono text-xs uppercase tracking-widest text-gold font-bold flex items-center gap-2">
                  <Package size={16} />
                  <span>موديلات الهواتف الذكية (Phone Models — {phoneModels.length})</span>
                </h3>
                <p className="font-mono text-xs text-ash mt-1">
                  إضافة موديلات آيفون وسامسونج وشاومي جديدة لتظهر تلقائياً في قائمة اختيار الموديل لدى العميل.
                </p>
              </div>
            </div>

            {/* Form to Add New Model */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newModelName.trim()) {
                  showToast('يرجى إدخال اسم الموديل', 'error');
                  return;
                }
                addPhoneModel({
                  name: newModelName,
                  category: newModelCategory
                });
                showToast(`تمت إضافة الموديل الجديد "${newModelName}" بنجاح! 📱`, 'success');
                setNewModelName('');
              }}
              className="bg-coal p-4 border border-gold/30 rounded space-y-4"
            >
              <span className="font-mono text-xs text-gold font-bold block">📱 إضافة موديل موبايل جديد:</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-mono text-[11px] text-ash block mb-1">اسم وموديل الجهاز:</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: iPhone 17 Pro Max"
                    value={newModelName}
                    onChange={(e) => setNewModelName(e.target.value)}
                    className="w-full bg-stone border border-grave p-2 text-xs font-mono text-bone focus:border-gold outline-none"
                  />
                </div>

                <div>
                  <label className="font-mono text-[11px] text-ash block mb-1">الشركة / الماركة:</label>
                  <select
                    value={newModelCategory}
                    onChange={(e) => setNewModelCategory(e.target.value)}
                    className="w-full bg-stone border border-grave p-2 text-xs font-mono text-bone focus:border-gold outline-none"
                  >
                    <option value="Apple">Apple iPhone</option>
                    <option value="Samsung">Samsung Galaxy</option>
                    <option value="Xiaomi">Xiaomi & Poco</option>
                    <option value="Honor">Honor</option>
                    <option value="Google">Google Pixel</option>
                    <option value="Realme">Realme</option>
                    <option value="OnePlus">OnePlus</option>
                    <option value="Other">شركة أخرى</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    type="submit"
                    className="btn-primary w-full py-2 text-xs font-mono font-bold uppercase flex items-center justify-center gap-2 min-h-[38px]"
                  >
                    <Plus size={16} />
                    <span>إضافة الموديل</span>
                  </button>
                </div>
              </div>
            </form>

            {/* Grid of Phone Models */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-96 overflow-y-auto custom-scrollbar p-1">
              {phoneModels.map((m) => (
                <div
                  key={m.id}
                  className="p-3 bg-coal border border-grave rounded flex items-center justify-between gap-2 hover:border-gold/50 transition-colors"
                >
                  <div className="min-w-0">
                    <p className="font-mono text-xs font-bold text-bone truncate">{m.name}</p>
                    <span className="font-mono text-[10px] text-gold uppercase">{m.category}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm(`حذف موديل "${m.name}"؟`)) {
                        deletePhoneModel(m.id);
                        showToast('تم حذف الموديل', 'warning');
                      }
                    }}
                    className="text-ash hover:text-red-400 p-1 flex-shrink-0"
                    title="حذف الموديل"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* 4. BUILDER STICKERS CONTROL SECTION */}
          <div className="bg-stone border border-grave p-6 space-y-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-grave pb-4">
              <div>
                <h3 className="font-mono text-xs uppercase tracking-widest text-gold font-bold flex items-center gap-2">
                  <Sparkles size={16} />
                  <span>إدارة ملصقات واستيكرات البلدر (Builder Stickers — {builderStickers.length})</span>
                </h3>
                <p className="font-mono text-xs text-ash mt-1">
                  التحكم الكامل في الاستيكرات التفاعلية داخل مصمم الجرابات: تعديل الأسماء، الصور، الرموز، وإخفاء أو إظهار أي استيكر.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setEditingBuilderSticker({
                      id: '',
                      nameEn: '',
                      nameAr: '',
                      tagEn: '3D EPOXY DOME SLOGAN',
                      tagAr: 'شعار إيبوكسي بارز',
                      image: '',
                      is_active: true
                    });
                    setIsBuilderStickerModalOpen(true);
                  }}
                  className="btn-primary py-2 px-4 text-xs font-mono font-bold flex items-center gap-2"
                >
                  <Plus size={16} />
                  <span>إضافة استيكر جديد للبلدر +</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('إعادة ضبط جميع استيكرات البلدر للوضع الافتراضي؟')) {
                      resetBuilderStickers();
                      showToast('تمت إعادة ضبط استيكرات البلدر للوضع الافتراضي 🔄', 'success');
                    }
                  }}
                  className="flex items-center gap-1.5 px-3 py-2 border border-grave bg-stone/60 hover:border-gold text-ash hover:text-gold font-mono text-xs font-bold transition-all rounded"
                >
                  <RotateCcw size={14} />
                  <span>إعادة ضبط الاستيكرات 🔄</span>
                </button>
              </div>
            </div>

            {/* Category Filter & Batch Visibility Controls Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-coal p-4 border border-grave rounded">
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setAdminStickerFilter('all')}
                  className={`px-3 py-1.5 rounded text-xs font-mono font-bold transition-all ${
                    adminStickerFilter === 'all' ? 'bg-gold text-void shadow' : 'bg-stone text-ash hover:text-bone border border-grave'
                  }`}
                >
                  الكل ({builderStickers.length})
                </button>
                <button
                  type="button"
                  onClick={() => setAdminStickerFilter('letters-ar')}
                  className={`px-3 py-1.5 rounded text-xs font-mono font-bold transition-all ${
                    adminStickerFilter === 'letters-ar' ? 'bg-gold text-void shadow' : 'bg-stone text-ash hover:text-bone border border-grave'
                  }`}
                >
                  حروف رقعة 🔤 ({builderStickers.filter(s => s.id?.startsWith('ar-letter-') || s.id?.startsWith('st-letter-') || s.category === 'letters').length})
                </button>
                <button
                  type="button"
                  onClick={() => setAdminStickerFilter('letters-en')}
                  className={`px-3 py-1.5 rounded text-xs font-mono font-bold transition-all ${
                    adminStickerFilter === 'letters-en' ? 'bg-gold text-void shadow' : 'bg-stone text-ash hover:text-bone border border-grave'
                  }`}
                >
                  حروف إنجليزي 🅰️ ({builderStickers.filter(s => s.id?.startsWith('en-letter-') || s.id?.startsWith('st-en-letter-') || s.category === 'letters-en').length})
                </button>
                <button
                  type="button"
                  onClick={() => setAdminStickerFilter('motifs')}
                  className={`px-3 py-1.5 rounded text-xs font-mono font-bold transition-all ${
                    adminStickerFilter === 'motifs' ? 'bg-gold text-void shadow' : 'bg-stone text-ash hover:text-bone border border-grave'
                  }`}
                >
                  شعارات ومجسمات ✨ ({builderStickers.filter(s => !s.id?.startsWith('ar-letter-') && !s.id?.startsWith('en-letter-') && s.category !== 'letters' && s.category !== 'letters-en').length})
                </button>
              </div>

              {/* Batch Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setCategoryStickersVisibility(adminStickerFilter, true);
                    showToast('تم تفعيل كافة استيكرات المجموعة بنجاح 👁️', 'success');
                  }}
                  className="px-3 py-1.5 bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 font-mono text-xs font-bold transition-all rounded flex items-center gap-1.5"
                  title="إظهار جميع استيكرات هذه المجموعة في البلدر"
                >
                  <Eye size={14} />
                  <span>تفعيل المجموعة 👁️</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setCategoryStickersVisibility(adminStickerFilter, false);
                    showToast('تم إخفاء كافة استيكرات المجموعة بنجاح 🚫', 'info');
                  }}
                  className="px-3 py-1.5 bg-red-950/60 hover:bg-red-900 border border-red-500/40 text-red-300 font-mono text-xs font-bold transition-all rounded flex items-center gap-1.5"
                  title="إخفاء جميع استيكرات هذه المجموعة من البلدر"
                >
                  <EyeOff size={14} />
                  <span>تعطيل المجموعة 🚫</span>
                </button>
              </div>
            </div>

            {/* Grid of Builder Stickers */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
              {builderStickers.filter((st) => {
                const isAr = st.id?.startsWith('ar-letter-') || st.id?.startsWith('st-letter-') || st.category === 'letters';
                const isEn = st.id?.startsWith('en-letter-') || st.id?.startsWith('st-en-letter-') || st.category === 'letters-en';
                const isMotif = !isAr && !isEn;

                if (adminStickerFilter === 'letters-ar') return isAr;
                if (adminStickerFilter === 'letters-en') return isEn;
                if (adminStickerFilter === 'motifs') return isMotif;
                return true;
              }).map((st) => {
                const isActive = st.is_active !== false && st.isActive !== false;
                return (
                  <div
                    key={st.id}
                    className={`bg-stone border overflow-hidden shadow-lg flex flex-col justify-between rounded transition-all ${
                      isActive ? 'border-grave' : 'border-red-900/40 opacity-60'
                    }`}
                  >
                    {/* Preview Box */}
                    <div className="aspect-square bg-coal relative border-b border-grave overflow-hidden flex flex-col items-center justify-center p-2">
                      <StickerIcon stickerId={st.id} image={st.image || st.imageUrl} size={48} color="#E8A33D" bgColor="#14110F" />
                      <div className="absolute top-2 left-2">
                        <span
                          className={`font-mono text-[9px] uppercase font-bold px-1.5 py-0.5 border ${
                            isActive
                              ? 'bg-emerald-950/80 text-emerald-400 border-emerald-500/40'
                              : 'bg-red-950/80 text-red-400 border-red-500/40'
                          }`}
                        >
                          {isActive ? 'ظاهر' : 'مخفي'}
                        </span>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="p-3 space-y-1 flex-1">
                      <h5 className="font-mono text-xs font-bold text-bone truncate">
                        {st.nameAr || st.nameEn || st.id}
                      </h5>
                      <p className="font-mono text-[9px] text-gold truncate">
                        {st.tagAr || st.tagEn || '3D EPOXY'}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="p-2 bg-stone/40 border-t border-grave flex items-center justify-between gap-1">
                      <button
                        type="button"
                        onClick={() => toggleBuilderStickerVisibility(st.id)}
                        className={`p-1.5 border font-mono text-xs transition-all rounded ${
                          isActive
                            ? 'border-ash/40 bg-coal text-ash hover:text-gold'
                            : 'border-emerald-700/60 bg-emerald-950/30 text-emerald-400'
                        }`}
                        title={isActive ? 'إخفاء الاستيكر' : 'إظهار الاستيكر'}
                      >
                        {isActive ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingBuilderSticker(st);
                            setIsBuilderStickerModalOpen(true);
                          }}
                          className="p-1.5 border border-gold/60 bg-gold/15 hover:bg-gold hover:text-void text-gold font-mono text-xs font-bold transition-all rounded"
                          title="تعديل الاستيكر"
                        >
                          <Edit2 size={14} />
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`حذف هذا الاستيكر "${st.nameAr || st.nameEn}" من البلدر؟`)) {
                              deleteBuilderSticker(st.id);
                              showToast('تم حذف الاستيكر من البلدر 🗑️', 'success');
                            }
                          }}
                          className="p-1.5 border border-red-900/60 bg-red-950/30 hover:bg-red-900 text-red-400 hover:text-white transition-all rounded"
                          title="حذف الاستيكر"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
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

      {/* ADMIN CATEGORY BANNER MODAL */}
      <AdminCategoryBannerModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        banner={editingCategoryBanner}
        onSave={(bannerId, updatedFields) => {
          if (bannerId) {
            updateCategoryBanner(bannerId, updatedFields);
          } else {
            addCategoryBanner(updatedFields);
          }
        }}
      />

      {/* ADMIN SOCIAL TILE MODAL */}
      <AdminSocialTileModal
        isOpen={isSocialModalOpen}
        onClose={() => setIsSocialModalOpen(false)}
        tile={editingSocialTile}
        onSave={(tileId, updatedFields) => {
          if (tileId) {
            updateSocialTile(tileId, updatedFields);
          } else {
            addSocialTile(updatedFields);
          }
        }}
      />

      {/* ADMIN BUILDER STICKER MODAL */}
      <AdminBuilderStickerModal
        isOpen={isBuilderStickerModalOpen}
        onClose={() => setIsBuilderStickerModalOpen(false)}
        stickerToEdit={editingBuilderSticker}
        onSave={(stickerId, updatedFields) => {
          if (stickerId) {
            updateBuilderSticker(stickerId, updatedFields);
          } else {
            addBuilderSticker(updatedFields);
          }
        }}
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
                  const cfg = item.customConfig || item.customDetails;
                  const layers = item.customConfig?.layers || item.customDetails?.layers || [];
                  const caseBgColor = getCaseFinishColor(cfg?.caseFinish || cfg?.caseType || cfg?.caseTypeId);
                  const dynamicSnapshot = generateCaseMockupSnapshot(null, layers, caseBgColor, '#E8A33D', cfg);
                  const mockupImg = item.designSnapshot || item.customConfig?.designSnapshot || (item.image && item.image.startsWith('data:image') ? item.image : null) || dynamicSnapshot;
                  const thumbImage = mockupImg || item.image || item.images?.[0];
                  const uploadedImages = layers.filter((l) => l.type === 'image' && l.src);
                  const isCustomCase = item.category === 'cases' || !!cfg || !!item.designSnapshot || layers.length > 0;

                  const STICKER_NAME_MAP = {
                    'st-born-dawn': 'طالع نور (Born at Dawn)',
                    'st-through-night': 'عدّي الليل (Through the Night)',
                    'st-crescent': 'الهلال (Crescent Moon)',
                    'st-starry': 'سماء الليل (Starry Night)',
                    'st-sun': 'شمس دوات (DUAT Sun)',
                    'st-duat': 'دوات (DUAT)'
                  };

                  const getStickerDisplayName = (stickerId) => {
                    if (!stickerId) return 'قرص مجسم';
                    if (STICKER_NAME_MAP[stickerId]) return STICKER_NAME_MAP[stickerId];
                    if (stickerId.startsWith('ar-letter-')) return `حرف عربي: ${stickerId.replace('ar-letter-', '')}`;
                    if (stickerId.startsWith('en-letter-')) return `حرف إنجليزي: ${stickerId.replace('en-letter-', '').toUpperCase()}`;
                    if (stickerId.startsWith('num-')) return `رقم: ${stickerId.replace('num-', '')}`;
                    return stickerId;
                  };

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
                            {cfg.customModelInput && (
                              <span className="text-bone">({cfg.customModelInput})</span>
                            )}
                            <span>🎨 التقفيل: {cfg.caseFinish || cfg.caseType || 'جراب شفاف'}</span>
                          </div>

                          {cfg.designNotes && (
                            <div className="text-stone-950 bg-amber-400 p-2.5 rounded font-bold border border-amber-500 shadow-sm text-xs">
                              <strong>📝 ملاحظات التصميم والورشة:</strong> "{cfg.designNotes}"
                            </div>
                          )}

                          {layers.length > 0 && (
                            <div className="space-y-1 text-ash border-t border-grave/40 pt-2">
                              <span className="text-bone font-bold block">الموتيفات والطبقات المصممة ({layers.length}):</span>
                              {layers.map((l, lIdx) => (
                                <div key={lIdx} className="flex items-center justify-between gap-2">
                                  <span className="text-bone font-bold">
                                    • {l.type === 'text' ? `نص محفور: "${l.text}"` : l.type === 'image' ? 'صورة استيكر مرفوعة من العميل' : `موتيف: ${getStickerDisplayName(l.stickerId)}`}
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
                          <div className="flex flex-col md:flex-row items-center gap-6 bg-void p-4 border border-gold/40 rounded-lg shadow-xl overflow-x-auto">
                            {/* Single High-Res Mockup Image Frame */}
                            {mockupImg ? (
                              <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
                                <span className="font-mono text-[10px] text-gold uppercase font-bold">صورة تصميم الجراب المخصص</span>
                                <img
                                  src={mockupImg}
                                  alt="Case Design Mockup"
                                  className="w-40 h-64 object-contain border border-grave bg-coal rounded-lg shadow-2xl"
                                />
                              </div>
                            ) : (
                              /* Fallback 2D Phone Case Canvas Frame if Base64 Image is missing */
                              <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
                                <span className="font-mono text-[10px] text-gold uppercase font-bold">معاينة الاستيكرات المباشرة 2D</span>
                                <div
                                  style={{ backgroundColor: caseBgColor }}
                                  className="w-[170px] h-[280px] rounded-[28px] border-2 border-grave relative overflow-hidden shadow-2xl p-2 select-none flex-shrink-0"
                                >
                                  {/* Camera Island (Top Left) */}
                                  <div className="absolute top-2 left-2 w-10 h-10 rounded-lg border border-[#E8A33D] bg-black flex items-center justify-center gap-1 z-20">
                                    <div className="w-2.5 h-2.5 rounded-full bg-ash/40" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-ash/40" />
                                  </div>

                                  {/* MagSafe Ring */}
                                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full border border-gold/40 pointer-events-none" />

                                  {/* Render All Customer Dragged Layers */}
                                  <div className="absolute inset-0 pointer-events-none">
                                    {layers.map((l) => (
                                      <div
                                        key={l.id || l.stickerId}
                                        style={{
                                          left: `${l.x}%`,
                                          top: `${l.y}%`,
                                          transform: `translate(-50%, -50%) scale(${l.scale || 1.0}) rotate(${l.rotation || 0}deg)`
                                        }}
                                        className="absolute z-10"
                                      >
                                        {l.type === 'text' && (
                                          <div
                                            style={{
                                              color: l.color || '#E8A33D',
                                              backgroundColor: l.bgColor === 'transparent' ? 'transparent' : (l.bgColor || '#14110F')
                                            }}
                                            className="whitespace-nowrap font-bold text-[10px] px-2 py-0.5 rounded-full border border-gold/50 shadow-md"
                                          >
                                            {l.text}
                                          </div>
                                        )}

                                        {l.type === 'sticker' && (
                                          <StickerIcon
                                            stickerId={l.stickerId}
                                            size={28}
                                            color={l.color}
                                            bgColor={l.bgColor}
                                          />
                                        )}

                                        {l.type === 'image' && l.src && (
                                          <img
                                            src={l.src}
                                            alt="Custom Sticker"
                                            className="w-10 h-10 object-contain shadow-md rounded"
                                          />
                                        )}
                                      </div>
                                    ))}
                                  </div>

                                  {/* DUAT Bottom Branding Pill */}
                                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-[#12162B] px-2 py-0.5 rounded-full border border-gold/60 text-[#E8A33D] font-mono text-[7px] font-bold tracking-widest z-20">
                                    DUAT
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* 3. Specifications & Download Action */}
                            <div className="space-y-2.5 font-mono text-xs text-ash flex-1 min-w-[200px]">
                              <p className="text-bone font-bold text-sm">التصميم النهائي كما صممه العميل على المتجر.</p>
                              <div className="text-[11px] space-y-1 text-gold bg-stone/40 p-2.5 rounded border border-grave/40">
                                <p>📱 الموديل: {cfg?.phoneModel || cfg?.model || 'غير محدد'}</p>
                                {cfg?.customModelInput && (
                                  <p className="text-bone font-bold">📱 اسم الجهاز المكتوب: {cfg.customModelInput}</p>
                                )}
                                <p>🎨 التقفيل: {cfg?.caseFinish || cfg?.caseType || 'جراب شفاف'}</p>
                                <p>🏷️ عدد الاستيكرات: {layers.length}</p>
                                {cfg?.designNotes && (
                                  <p className="text-amber-300 font-bold border-t border-grave/40 pt-1 mt-1">
                                    📝 ملاحظات الورشة: "{cfg.designNotes}"
                                  </p>
                                )}
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
