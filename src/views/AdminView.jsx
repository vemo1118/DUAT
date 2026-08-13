import React, { useState, useEffect, useMemo } from 'react';
import { useProducts } from '../context/ProductsContext';
import { useLanguage } from '../context/LanguageContext';
import { useOrders } from '../context/OrdersContext';
import { useHeroBanners } from '../context/HeroBannersContext';
import { useCategoryBanners } from '../context/CategoryBannersContext';
import { useSocialGrid } from '../context/SocialGridContext';
import { useToast } from '../context/ToastContext';
import { useBundlesSettings } from '../context/BundlesSettingsContext';
import { useStickersSettings } from '../context/StickersSettingsContext';
import { supabase } from '../lib/supabase';
import { testOrderNotification } from '../services/orderApi';
import { AdminProductModal } from '../components/AdminProductModal';
import { AdminHeroSlideModal } from '../components/AdminHeroSlideModal';
import { AdminCategoryBannerModal } from '../components/AdminCategoryBannerModal';
import { AdminSocialTileModal } from '../components/AdminSocialTileModal';
import { CATEGORIES } from '../data/products';
import { CustomStickerThumbnail } from '../components/CustomStickerThumbnail';
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
  TrendingUp,
  CheckCircle2,
  Clock,
  Gift,
  Zap
} from 'lucide-react';
import {
  exportOrdersToCSV,
  saveNotificationSettingsToSupabase,
  ADMIN_WHATSAPP_NUMBER_KEY
} from '../utils/orderNotifier';

export function AdminView() {
  const { formatPrice } = useLanguage();
  const {
    products,
    addProduct,
    updateProduct,
    adjustPrice,
    toggleProductVisibility,
    deleteProduct,
    resetProducts,
    moveProductUp,
    moveProductDown
  } = useProducts();
  const productLookup = useMemo(
    () => new Map(products.map((product) => [String(product.id), product])),
    [products]
  );
  const { orders, fetchOrders, updateOrderStatus, deleteOrder } = useOrders();
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
    bundlesSettings,
    updateBundlesHero,
    updateBundlesCta,
    updateBundlesGridSettings,
    resetBundlesSettings
  } = useBundlesSettings();

  const [bundlesFormHero, setBundlesFormHero] = useState(() => bundlesSettings?.hero || {});
  const [bundlesFormCta, setBundlesFormCta] = useState(() => bundlesSettings?.cta || {});
  const [bundlesFormGrid, setBundlesFormGrid] = useState(() => bundlesSettings?.grid || {});

  useEffect(() => {
    if (bundlesSettings) {
      setBundlesFormHero(bundlesSettings.hero || {});
      setBundlesFormCta(bundlesSettings.cta || {});
      setBundlesFormGrid(bundlesSettings.grid || {});
    }
  }, [bundlesSettings]);

  const {
    stickersSettings,
    updateStickersHero,
    updateStickersPromo,
    updateStickersGridSettings,
    resetStickersSettings
  } = useStickersSettings();

  const [stickersFormHero, setStickersFormHero] = useState(() => stickersSettings?.hero || {});
  const [stickersFormPromo, setStickersFormPromo] = useState(() => stickersSettings?.promo || {});
  const [stickersFormGrid, setStickersFormGrid] = useState(() => stickersSettings?.grid || {});

  useEffect(() => {
    if (stickersSettings) {
      setStickersFormHero(stickersSettings.hero || {});
      setStickersFormPromo(stickersSettings.promo || {});
      setStickersFormGrid(stickersSettings.grid || {});
    }
  }, [stickersSettings]);

  const { showToast } = useToast();

  // Supabase Auth State
  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [isSubmittingAuth, setIsSubmittingAuth] = useState(false);

  const [activeTab, setActiveTab] = useState('products'); // 'products' | 'orders' | 'hero' | 'notifications'

  const [adminWhatsApp, setAdminWhatsApp] = useState(() => localStorage.getItem(ADMIN_WHATSAPP_NUMBER_KEY) || '201000000000');

  const handleSaveNotificationSettings = async (e) => {
    e.preventDefault();
    await saveNotificationSettingsToSupabase(null, null, adminWhatsApp);
    showToast('تم حفظ رقم واتساب بنجاح.', 'success');
  };

  const handleTestNotification = async () => {
    showToast('جاري إرسال إشعار تجريبي لموبايلك عبر تليجرام...', 'info');
    try {
      await testOrderNotification();
      showToast('وصل الإشعار التجريبي بنجاح! تفقّد هاتفك المحمول 📱✨', 'success');
    } catch {
      showToast('تعذر الإرسال. تأكد من إضافة متغيرات Telegram في Vercel وأن الحساب Admin.', 'error');
    }
  };

  // Check initial session & listen for auth changes
  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session: currentSession } }) => {
      const { data: isAdmin } = currentSession ? await supabase.rpc('is_admin') : { data: false };
      setSession(isAdmin === true ? currentSession : null);
      if (currentSession && isAdmin !== true) setAuthError('هذا الحساب غير مصرح له بإدارة المتجر.');
      setAuthLoading(false);
      if (currentSession && isAdmin === true && fetchOrders) fetchOrders();
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      if (!currentSession) setSession(null);
    });

    const syncNotifSettingsFromDb = async () => {
      try {
        const { data } = await supabase.from('builder_settings').select('admin_whatsapp').eq('id', 'global-builder-config').maybeSingle();
        if (data) {
          if (data.admin_whatsapp) setAdminWhatsApp(data.admin_whatsapp);
        }
      } catch (e) {
        console.warn('Error loading notification settings in AdminView:', e);
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
    eyebrowEn: forgeBanner?.eyebrowEn || 'DUAT / STICKER BUILDER',
    eyebrowAr: forgeBanner?.eyebrowAr || 'دوات / مصمم الاستيكرات',
    titleEn: forgeBanner?.titleEn || 'BUILD YOUR OWN STICKER.',
    titleAr: forgeBanner?.titleAr || 'صمّم استيكرك الخاص بنفسك.',
    descEn: forgeBanner?.descEn || 'Write custom text or upload your artwork to create a raised 3D epoxy sticker. Made to order in Egypt.',
    descAr: forgeBanner?.descAr || 'اكتب نصك أو ارفع تصميمك لنحوّله إلى استيكر إيبوكسي مجسم، مصنوع حسب الطلب في مصر.',
    buttonTextEn: forgeBanner?.buttonTextEn || 'OPEN STICKER BUILDER →',
    buttonTextAr: forgeBanner?.buttonTextAr || 'افتح بيلدر الاستيكرز ←',
    buttonLink: forgeBanner?.buttonLink || '/sticker-builder',
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
        buttonLink: ['/customize', '/customizer'].includes(forgeBanner.buttonLink) ? '/sticker-builder' : (forgeBanner.buttonLink || '/sticker-builder'),
        imageUrl: forgeBanner.imageUrl || '',
        isActive: forgeBanner.isActive !== false
      });
    }
  }, [forgeBanner]);

  const handleSaveForgeBanner = (e) => {
    e.preventDefault();
    updateForgeBanner(forgeEdit);
    showToast('تم حفظ بنر مصمم الاستيكرات بنجاح ✨', 'success');
  };

  // Orders Tab State
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);
  const [signedProofUrl, setSignedProofUrl] = useState(null);
  const [signedDesignUrls, setSignedDesignUrls] = useState({});

  // Coupons Tab State
  const [adminCoupons, setAdminCoupons] = useState([]);
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponType, setNewCouponType] = useState('percentage');
  const [newCouponValue, setNewCouponValue] = useState(10);
  const [newCouponDesc, setNewCouponDesc] = useState('');

  useEffect(() => {
    if (!session) return;
    supabase
      .from('coupons')
      .select('code, type, value, is_active, expires_at')
      .order('code')
      .then(({ data, error }) => {
        if (error) {
          console.warn('Failed loading coupons:', error.message);
          return;
        }
        setAdminCoupons((data || []).map((coupon) => ({
          ...coupon,
          isActive: coupon.is_active !== false
        })));
      });
  }, [session]);

  const handleAddCoupon = async (e) => {
    e.preventDefault();
    if (!newCouponCode.trim()) return;
    const codeClean = newCouponCode.trim().toUpperCase();
    if (adminCoupons.some(c => c.code === codeClean)) {
      showToast('كود الخصم موجود بالفعل!', 'error');
      return;
    }
    const newCoupon = {
      code: codeClean,
      type: newCouponType,
      value: Number(newCouponValue),
      is_active: true
    };
    const { data, error } = await supabase.from('coupons').insert(newCoupon).select('code, type, value, is_active, expires_at').single();
    if (error) {
      showToast('تعذر حفظ الكوبون في قاعدة البيانات.', 'error');
      return;
    }
    setAdminCoupons((current) => [...current, { ...data, isActive: data.is_active !== false, description: newCouponDesc.trim() }]);
    setNewCouponCode('');
    setNewCouponDesc('');
    showToast('تمت إضافة كود الخصم بنجاح 🎉', 'success');
  };

  const handleToggleCoupon = async (code) => {
    const coupon = adminCoupons.find((item) => item.code === code);
    if (!coupon) return;
    const nextActive = !coupon.isActive;
    const { error } = await supabase.from('coupons').update({ is_active: nextActive }).eq('code', code);
    if (error) {
      showToast('تعذر تحديث الكوبون.', 'error');
      return;
    }
    setAdminCoupons((current) => current.map((item) => item.code === code ? { ...item, isActive: nextActive, is_active: nextActive } : item));
  };

  const handleDeleteCoupon = async (code) => {
    const { error } = await supabase.from('coupons').delete().eq('code', code);
    if (error) {
      showToast('تعذر حذف الكوبون.', 'error');
      return;
    }
    setAdminCoupons((current) => current.filter((item) => item.code !== code));
    showToast('تم حذف كود الخصم', 'info');
  };

  useEffect(() => {
    let active = true;
    const fetchSignedProofUrl = async () => {
      setSignedProofUrl(null);
      const proofPath = selectedOrderDetails?.payment_proof_path || selectedOrderDetails?.paymentProofPath;
      if (proofPath) {
        try {
          const { data, error } = await supabase.storage.from('payment-proofs').createSignedUrl(proofPath, 3600);
          if (active && !error && data?.signedUrl) {
            setSignedProofUrl(data.signedUrl);
          }
        } catch (err) {
          console.error('Error generating signed URL for payment proof:', err);
        }
      }
    };
    if (selectedOrderDetails) {
      fetchSignedProofUrl();
    }
    return () => { active = false; };
  }, [selectedOrderDetails]);

  useEffect(() => {
    let active = true;
    const loadDesignUrls = async () => {
      const items = selectedOrderDetails?.items || [];
      const paths = [...new Set(items.map((item) => {
        const details = item.customConfig || item.customDetails || {};
        return item.design_image_path || details.design_image_path;
      }).filter(Boolean))];

      if (paths.length === 0) {
        setSignedDesignUrls({});
        return;
      }

      const entries = await Promise.all(paths.map(async (path) => {
        const { data, error } = await supabase.storage.from('order-designs').createSignedUrl(path, 3600);
        return [path, error ? null : data?.signedUrl || null];
      }));
      if (active) setSignedDesignUrls(Object.fromEntries(entries.filter(([, url]) => url)));
    };

    loadDesignUrls();
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
        const { data: isAdmin } = await supabase.rpc('is_admin');
        if (isAdmin !== true) {
          await supabase.auth.signOut();
          setSession(null);
          setAuthError('الحساب صحيح لكنه غير موجود ضمن مسؤولي المتجر.');
          showToast('الحساب غير مصرح له بدخول لوحة التحكم', 'error');
        } else {
          setSession(data.session);
          showToast('تم تسجيل الدخول بنجاح!', 'success');
          if (fetchOrders) fetchOrders();
        }
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
      (ord.ref && ord.ref.toLowerCase().includes(query)) ||
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
    setEditingProduct(selectedCategory === 'bundles' ? { category: 'bundles' } : null);
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
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto space-y-8 animate-fade-in" dir="rtl">
      
      {/* TOP COMMAND CENTER HEADER */}
      <div className="bg-stone/90 border border-grave p-6 card-depth-highlight flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-gold/10 border border-gold/40 flex items-center justify-center text-gold shadow-lg shadow-gold/10">
            <Sparkles size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] text-gold uppercase tracking-widest font-bold bg-gold/10 px-2 py-0.5 border border-gold/30">
                DUAT / COMMAND CENTER
              </span>
            </div>
            <h1 className="font-clash text-2xl md:text-3xl uppercase text-bone font-bold mt-1">
              لوحة التحكم الرئيسية وإدارة الصفحات (DUAT Control Portal)
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 bg-coal border border-gold/40 hover:border-gold text-gold font-mono text-xs uppercase font-bold transition-all shadow-md"
          >
            <ExternalLink size={15} />
            <span>معاينة المتجر الحية</span>
          </a>

          <button
            onClick={handleAdminLogout}
            className="flex items-center gap-2 px-4 py-2.5 border border-red-500/40 bg-red-950/30 hover:bg-red-900 text-red-400 hover:text-white transition-all font-mono text-xs font-bold"
          >
            <span>تسجيل الخروج</span>
            <LogOut size={15} />
          </button>
        </div>
      </div>

      {/* 2-COLUMN MAIN PORTAL GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* SIDEBAR NAVIGATION MENU (Right column in RTL: 3 cols out of 12) */}
        <div className="lg:col-span-3 space-y-6 lg:sticky lg:top-24">
          <div className="bg-stone border border-grave p-4 space-y-6 shadow-xl card-depth-highlight">
            
            <div className="border-b border-grave/60 pb-3 font-mono text-xs uppercase tracking-wider text-ash font-bold flex items-center justify-between">
              <span>أقسام التحكم والصفحات</span>
              <Sliders size={14} className="text-gold" />
            </div>

            {/* GROUP 1: SALES & CATALOG */}
            <div className="space-y-2">
              <span className="font-mono text-[11px] text-gold/80 uppercase font-bold block px-2">
                📊 المبيعات والمنتجات
              </span>
              <div className="space-y-1">
                <button
                  onClick={() => setActiveTab('products')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 font-mono text-xs font-bold transition-all border rounded-xs ${
                    activeTab === 'products'
                      ? 'bg-gold text-[#0A0C16] border-gold shadow-md scale-[1.01]'
                      : 'bg-coal text-bone border-grave hover:border-gold/50 hover:text-gold'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Package size={16} />
                    <span>المنتجات والكاتالوج</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-void/40 border border-current">
                    {products.length}
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 font-mono text-xs font-bold transition-all border rounded-xs ${
                    activeTab === 'orders'
                      ? 'bg-gold text-[#0A0C16] border-gold shadow-md scale-[1.01]'
                      : 'bg-coal text-bone border-grave hover:border-gold/50 hover:text-gold'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <ShoppingBag size={16} />
                    <span>إدارة الطلبات والشحن</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-void/40 border border-current">
                    {orders.length}
                  </span>
                </button>
              </div>
            </div>

            {/* GROUP 2: PAGE-BY-PAGE WEBSITE CONTROL */}
            <div className="space-y-2 pt-2 border-t border-grave/40">
              <span className="font-mono text-[11px] text-gold/80 uppercase font-bold block px-2">
                🌐 تحكم صفحات الموقع
              </span>
              <div className="space-y-1">
                <button
                  onClick={() => setActiveTab('hero')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 font-mono text-xs font-bold transition-all border rounded-xs ${
                    activeTab === 'hero'
                      ? 'bg-gold text-[#0A0C16] border-gold shadow-md scale-[1.01]'
                      : 'bg-coal text-bone border-grave hover:border-gold/50 hover:text-gold'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <ImageIcon size={16} />
                    <span>1. الرئيسية (/)</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-void/40 border border-current">
                    {slides.length}
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('bundles_page')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 font-mono text-xs font-bold transition-all border rounded-xs ${
                    activeTab === 'bundles_page'
                      ? 'bg-gold text-[#0A0C16] border-gold shadow-md scale-[1.01]'
                      : 'bg-coal text-bone border-grave hover:border-gold/50 hover:text-gold'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Gift size={16} />
                    <span>2. صفحة البندلات (/bundles)</span>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 text-emerald-400 font-mono">مباشر</span>
                </button>

                <button
                  onClick={() => setActiveTab('stickers_page')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 font-mono text-xs font-bold transition-all border rounded-xs ${
                    activeTab === 'stickers_page'
                      ? 'bg-gold text-[#0A0C16] border-gold shadow-md scale-[1.01]'
                      : 'bg-coal text-bone border-grave hover:border-gold/50 hover:text-gold'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Sparkles size={16} />
                    <span>3. صفحة الاستيكرات (/stickers)</span>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 text-emerald-400 font-mono">مباشر</span>
                </button>

                <button
                  onClick={() => setActiveTab('forge_banner')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 font-mono text-xs font-bold transition-all border rounded-xs ${
                    activeTab === 'forge_banner'
                      ? 'bg-gold text-[#0A0C16] border-gold shadow-md scale-[1.01]'
                      : 'bg-coal text-bone border-grave hover:border-gold/50 hover:text-gold'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Zap size={16} />
                    <span>4. بنر مصمم الاستيكرات</span>
                  </div>
                </button>
              </div>
            </div>

            {/* GROUP 3: MARKETING & SYSTEM */}
            <div className="space-y-2 pt-2 border-t border-grave/40">
              <span className="font-mono text-[11px] text-gold/80 uppercase font-bold block px-2">
                ⚙️ التسويق والإشعارات
              </span>
              <div className="space-y-1">
                <button
                  onClick={() => setActiveTab('coupons')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 font-mono text-xs font-bold transition-all border rounded-xs ${
                    activeTab === 'coupons'
                      ? 'bg-gold text-[#0A0C16] border-gold shadow-md scale-[1.01]'
                      : 'bg-coal text-bone border-grave hover:border-gold/50 hover:text-gold'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <DollarSign size={16} />
                    <span>أكواد الخصم والكوبونات</span>
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab('notifications')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 font-mono text-xs font-bold transition-all border rounded-xs ${
                    activeTab === 'notifications'
                      ? 'bg-gold text-[#0A0C16] border-gold shadow-md scale-[1.01]'
                      : 'bg-coal text-bone border-grave hover:border-gold/50 hover:text-gold'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Bell size={16} />
                    <span>إشعارات الموبايل وتليجرام</span>
                  </div>
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* MAIN CONTENT AREA (Left column in RTL: 9 cols out of 12) */}
        <div className="lg:col-span-9 space-y-8">

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
                onClick={handleResetCatalog}
                className="flex items-center gap-2 px-4 py-2 border border-grave bg-stone/50 hover:border-gold/50 text-ash hover:text-bone transition-colors font-mono text-xs uppercase"
              >
                <RotateCcw size={15} />
                <span>إعادة ضبط المنتجات</span>
              </button>

              <button
                onClick={() => {
                  setEditingProduct({ category: 'bundles' });
                  setIsProductModalOpen(true);
                }}
                className="flex items-center gap-2 px-4 py-2 border border-gold/60 bg-gold/15 text-gold hover:bg-gold hover:text-[#050505] font-bold transition-all font-mono text-xs uppercase shadow-md"
              >
                <Gift size={16} />
                <span>إضافة بندل / عرض جديد 🎁</span>
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
              {CATEGORIES.map((cat) => {
                const getLabel = (id) => {
                  switch (id) {
                    case 'all': return 'جميع المنتجات 📦';
                    case 'bundles': return 'البندلات والعروض 🎁';
                    case 'stickers': return 'الاستيكرات 🎨';
                    case 'letters': return 'الحروف 🔤';
                    case 'badges': return 'الشارات 🏷️';
                    default: return id.toUpperCase();
                  }
                };
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-4 py-2 font-mono text-xs uppercase font-bold transition-all whitespace-nowrap border ${
                      selectedCategory === cat.id
                        ? 'bg-gold text-[#0A0C16] border-gold shadow-md shadow-gold/20'
                        : 'bg-stone text-bone border-grave hover:border-gold hover:text-gold'
                    }`}
                  >
                    {getLabel(cat.id)}
                  </button>
                );
              })}
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
                      <th className="py-3.5 px-4">المنتج / البندل والصورة</th>
                      <th className="py-3.5 px-4">التصنيف والتوفير</th>
                      <th className="py-3.5 px-4 text-center">السعر والتعديل السريع</th>
                      <th className="py-3.5 px-4">الوسم والشارة</th>
                      <th className="py-3.5 px-4 text-left">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-grave font-sans text-sm">
                    {filteredProducts.map((product) => {
                      const img = product.imageUrl || product.image;
                      const globalIndex = products.findIndex((p) => p.id === product.id);
                      const savingsAmount = product.savings !== undefined ? product.savings : (product.originalPrice && product.originalPrice > product.price ? product.originalPrice - product.price : 0);

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
                            <div className="space-y-1">
                              <span className="inline-block font-mono text-[11px] uppercase tracking-wider px-2.5 py-1 border border-grave bg-stone/60 text-gold font-bold">
                                {product.category}
                              </span>
                              {savingsAmount > 0 && (
                                <div className="font-mono text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                                  <span>توفير {savingsAmount} ج.م</span>
                                </div>
                              )}
                            </div>
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
                            <span>{ord.ref || ord.id}</span>
                            {ord.items?.some(i => i.designSnapshot || i.customConfig?.designSnapshot) && (
                              <span className="text-[10px] font-bold px-1.5 py-0.5 bg-gold/20 text-gold border border-gold/40 rounded">
                                🎨 تصميم مخصص
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
                                if (window.confirm(`هل أنت تأكد من حذف الطلب #${ord.ref || ord.id}؟`)) {
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
                  onClick={async () => {
                    if (window.confirm('هل أنت تأكد من إعادة ضبط كروت الأقسام للوضع الافتراضي؟')) {
                      try {
                        await resetCategoryBanners();
                        showToast('تمت إعادة ضبط كروت الأقسام الافتراضية 🔄', 'success');
                      } catch (error) {
                        console.error('Category banners reset failed:', error?.message || error);
                        showToast('تعذر حفظ إعادة الضبط على الموقع.', 'error');
                      }
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
                        onClick={async () => {
                          try {
                            await toggleCategoryBannerVisibility(cat.id);
                          } catch (error) {
                            console.error('Category visibility update failed:', error?.message || error);
                            showToast('تعذر تحديث ظهور القسم على الموقع.', 'error');
                          }
                        }}
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
                          onClick={async () => {
                            if (window.confirm(`هل أنت تأكد من حذف كارت القسم "${cat.nameAr || cat.nameEn}"؟`)) {
                              try {
                                await deleteCategoryBanner(cat.id);
                                showToast('تم حذف كارت القسم بنجاح 🗑️', 'success');
                              } catch (error) {
                                console.error('Category banner delete failed:', error?.message || error);
                                showToast('تعذر حذف كارت القسم من الموقع.', 'error');
                              }
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
      {/* TAB 3.5: STICKER BUILDER FEATURE PROMO BANNER EDITOR */}
      {/* ============================================================ */}
      {activeTab === 'forge_banner' && (
        <div className="space-y-8 animate-fade-in max-w-5xl mx-auto">
          {/* Header Description */}
          <div className="bg-stone border border-gold/40 p-6 sm:p-8 space-y-6 rounded-lg card-depth-highlight shadow-2xl">
            <div className="flex items-center gap-3 border-b border-grave pb-4">
              <Sparkles className="text-gold" size={26} />
              <div>
                <h2 className="font-clash text-xl font-bold text-bone">إدارة بنر مصمم الاستيكرات</h2>
                <p className="font-mono text-xs text-ash">تعديل كافة نصوص، شارة، صورة، ورابط التوجيه للبنر الترويجي الفاخر بمنتصف الصفحة الرئيسية.</p>
              </div>
            </div>

            {/* Live Banner Preview Box */}
            <div className="p-6 bg-coal border border-grave rounded-lg space-y-3">
              <span className="font-mono text-xs text-gold uppercase tracking-widest block font-bold">معاينة حية للبنر في الصفحة الرئيسية (Live Banner Preview)</span>
              <div className="p-6 bg-stone border border-gold/30 rounded flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-2 flex-1">
                  <span className="font-mono text-[10px] text-gold uppercase tracking-widest font-bold block">{forgeEdit.eyebrowEn || 'STICKER BUILDER'}</span>
                  <h3 className="font-clash text-2xl font-bold text-bone uppercase tracking-tight">{forgeEdit.titleEn || 'BUILD YOUR OWN STICKER.'}</h3>
                  <p className="font-space text-xs text-ash leading-relaxed max-w-lg">{forgeEdit.descEn}</p>
                  <span className="inline-block mt-2 px-5 py-2.5 bg-gold text-[#0A0C16] font-mono text-xs font-bold uppercase rounded shadow-lg">{forgeEdit.buttonTextEn || 'OPEN STICKER BUILDER →'}</span>
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
                    placeholder="/sticker-builder"
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
                <span>🔐 إعداد Telegram مؤمّن من السيرفر</span>
              </p>
              <p className="font-sans">الـBot Token والـChat ID محفوظان كـ Environment Variables داخل Vercel فقط، ولا يتم إرسالهما للمتصفح أو تخزينهما في قاعدة البيانات.</p>
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
      {/* TAB 6: BUNDLES PAGE FULL CONTROL ENGINE */}
      {/* ============================================================ */}
      {activeTab === 'bundles_page' && (
        <div className="space-y-8 animate-fade-in">
          {/* Header Control Card */}
          <div className="bg-stone border border-gold/40 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
            <div>
              <span className="font-mono text-xs text-gold font-bold uppercase tracking-widest block">
                DUAT / BUNDLES PAGE ENGINE
              </span>
              <h2 className="font-clash text-2xl uppercase text-bone font-bold mt-1">
                إدارة وديناميكية صفحة البندلات والعروض (/bundles) 🎁
              </h2>
              <p className="font-mono text-xs text-ash mt-1">
                تحكم كامل ومباشر في البنرات، النص التشويقي، العناوين، المميزات، منتجات البندلات، والبنر السفلي.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href="/bundles"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 bg-coal border border-gold/40 hover:border-gold text-gold font-mono text-xs uppercase font-bold transition-all shadow-md"
              >
                <ExternalLink size={15} />
                <span>معاينة الصفحة الحية</span>
              </a>

              <button
                type="button"
                onClick={() => {
                  if (window.confirm('هل أنت تأكد من إعادة ضبط صفحة البندلات للافتراضي؟')) {
                    resetBundlesSettings();
                    showToast('تم إعادة ضبط صفحة البندلات للافتراضي 🔄', 'info');
                  }
                }}
                className="flex items-center gap-2 px-4 py-2.5 bg-stone border border-grave hover:border-gold text-ash hover:text-bone font-mono text-xs uppercase font-bold transition-all"
              >
                <RotateCcw size={15} />
                <span>إعادة ضبط الافتراضي</span>
              </button>
            </div>
          </div>

          {/* ============================================================ */}
          {/* SECTION 1: HERO HEADER & BANNER SETTINGS */}
          {/* ============================================================ */}
          <div className="bg-stone border border-grave p-6 space-y-6 shadow-lg card-depth-highlight">
            <div className="flex items-center justify-between border-b border-grave pb-4">
              <div className="flex items-center gap-3">
                <ImageIcon size={20} className="text-gold" />
                <div>
                  <h3 className="font-clash text-lg uppercase text-bone font-bold">1. الهيدر والبنر العلوي (Hero Header Banner)</h3>
                  <p className="font-mono text-xs text-ash">تغيير النصوص، العناوين، خلفية البنر والشارة التشويقية</p>
                </div>
              </div>

              {/* Enable / Disable Hero Banner Toggle */}
              <button
                type="button"
                onClick={() => {
                  const nextActive = !bundlesFormHero.isActive;
                  const updated = { ...bundlesFormHero, isActive: nextActive };
                  setBundlesFormHero(updated);
                  updateBundlesHero(updated);
                  showToast(nextActive ? 'تم تفعيل البنر العلوي 👁️' : 'تم إخفاء البنر العلوي 🙈', 'info');
                }}
                className={`px-4 py-2 font-mono text-xs font-bold uppercase flex items-center gap-2 border transition-all ${
                  bundlesFormHero.isActive !== false
                    ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-400'
                    : 'bg-red-950/60 border-red-500/50 text-red-400'
                }`}
              >
                {bundlesFormHero.isActive !== false ? <Eye size={15} /> : <EyeOff size={15} />}
                <span>{bundlesFormHero.isActive !== false ? 'البنر مفعل (ظاهر)' : 'البنر مخفي'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Eyebrow Tag AR / EN */}
              <div className="space-y-2">
                <label className="font-mono text-xs text-bone block uppercase font-bold">الشارة التشويقية (Eyebrow Ar):</label>
                <input
                  type="text"
                  value={bundlesFormHero.eyebrowAr || ''}
                  onChange={(e) => setBundlesFormHero({ ...bundlesFormHero, eyebrowAr: e.target.value })}
                  placeholder="بندلات وتجميعات حصرية 🎁"
                  className="w-full bg-coal border border-grave px-4 py-2.5 text-xs font-mono text-bone focus:border-gold focus:outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="font-mono text-xs text-bone block uppercase font-bold">Eyebrow Tag (English):</label>
                <input
                  type="text"
                  value={bundlesFormHero.eyebrowEn || ''}
                  onChange={(e) => setBundlesFormHero({ ...bundlesFormHero, eyebrowEn: e.target.value })}
                  placeholder="EXCLUSIVE BUNDLES 🎁"
                  className="w-full bg-coal border border-grave px-4 py-2.5 text-xs font-mono text-bone focus:border-gold focus:outline-none"
                />
              </div>

              {/* Title AR / EN */}
              <div className="space-y-2">
                <label className="font-mono text-xs text-bone block uppercase font-bold">العنوان الرئيسي (Headline Ar):</label>
                <input
                  type="text"
                  value={bundlesFormHero.titleAr || ''}
                  onChange={(e) => setBundlesFormHero({ ...bundlesFormHero, titleAr: e.target.value })}
                  placeholder="قسم البندلز الجاهزة 🎁"
                  className="w-full bg-coal border border-grave px-4 py-2.5 text-xs font-mono text-bone focus:border-gold focus:outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="font-mono text-xs text-bone block uppercase font-bold">Main Headline (English):</label>
                <input
                  type="text"
                  value={bundlesFormHero.titleEn || ''}
                  onChange={(e) => setBundlesFormHero({ ...bundlesFormHero, titleEn: e.target.value })}
                  placeholder="Ready Sticker Bundles 🎁"
                  className="w-full bg-coal border border-grave px-4 py-2.5 text-xs font-mono text-bone focus:border-gold focus:outline-none"
                />
              </div>

              {/* Description AR / EN */}
              <div className="space-y-2 md:col-span-2">
                <label className="font-mono text-xs text-bone block uppercase font-bold">الوصف الفرعي بالعربية (Description Ar):</label>
                <textarea
                  rows={2}
                  value={bundlesFormHero.descAr || ''}
                  onChange={(e) => setBundlesFormHero({ ...bundlesFormHero, descAr: e.target.value })}
                  className="w-full bg-coal border border-grave p-3 text-xs font-mono text-bone focus:border-gold focus:outline-none"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="font-mono text-xs text-bone block uppercase font-bold">Description Subtitle (English):</label>
                <textarea
                  rows={2}
                  value={bundlesFormHero.descEn || ''}
                  onChange={(e) => setBundlesFormHero({ ...bundlesFormHero, descEn: e.target.value })}
                  className="w-full bg-coal border border-grave p-3 text-xs font-mono text-bone focus:border-gold focus:outline-none"
                />
              </div>

              {/* Background Image URLs (Desktop & Mobile) */}
              <div className="space-y-2">
                <label className="font-mono text-xs text-gold block uppercase font-bold">💻 صورة خلفية الهيدر للكمبيوتر (Desktop Image URL):</label>
                <input
                  type="url"
                  value={bundlesFormHero.bgImage || ''}
                  onChange={(e) => setBundlesFormHero({ ...bundlesFormHero, bgImage: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-coal border border-grave px-4 py-2.5 text-xs font-mono text-bone focus:border-gold focus:outline-none"
                  dir="ltr"
                />
              </div>

              <div className="space-y-2">
                <label className="font-mono text-xs text-amber-400 block uppercase font-bold">📱 صورة خلفية الهيدر للموبايل (Mobile Image URL - اختياري):</label>
                <input
                  type="url"
                  value={bundlesFormHero.mobileBgImage || ''}
                  onChange={(e) => setBundlesFormHero({ ...bundlesFormHero, mobileBgImage: e.target.value })}
                  placeholder="رابط صورة الهيدر بمقاس التلفون الطولي"
                  className="w-full bg-coal border border-grave px-4 py-2.5 text-xs font-mono text-bone focus:border-amber-400 focus:outline-none"
                  dir="ltr"
                />
              </div>
            </div>

            {/* Perks Strip Editor */}
            <div className="pt-4 border-t border-grave/60 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-mono text-xs font-bold text-gold uppercase tracking-wider">
                  شريط المميزات الـ 3 (Perks Strip Manager):
                </h4>

                <button
                  type="button"
                  onClick={() => {
                    const updated = { ...bundlesFormHero, showPerks: !bundlesFormHero.showPerks };
                    setBundlesFormHero(updated);
                  }}
                  className="font-mono text-[11px] text-ash hover:text-gold underline"
                >
                  {bundlesFormHero.showPerks !== false ? 'إخفاء شريط المميزات' : 'إظهار شريط المميزات'}
                </button>
              </div>

              {bundlesFormHero.showPerks !== false && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {(bundlesFormHero.perks || []).map((perk, pIdx) => (
                    <div key={perk.id || pIdx} className="bg-coal border border-grave p-4 space-y-3">
                      <div className="flex items-center justify-between border-b border-grave/50 pb-2">
                        <span className="font-mono text-xs font-bold text-gold">ميزة #{pIdx + 1}</span>
                        <select
                          value={perk.icon || 'Tag'}
                          onChange={(e) => {
                            const newPerks = [...(bundlesFormHero.perks || [])];
                            newPerks[pIdx] = { ...perk, icon: e.target.value };
                            setBundlesFormHero({ ...bundlesFormHero, perks: newPerks });
                          }}
                          className="bg-stone border border-grave text-bone text-xs font-mono px-2 py-1 focus:outline-none"
                        >
                          <option value="Tag">أيقونة Tag 🏷️</option>
                          <option value="Gift">أيقونة Gift 🎁</option>
                          <option value="Zap">أيقونة Zap ⚡</option>
                          <option value="Sparkles">أيقونة Sparkles ✨</option>
                          <option value="ShoppingBag">أيقونة ShoppingBag 🛍️</option>
                        </select>
                      </div>

                      <input
                        type="text"
                        value={perk.textAr || ''}
                        onChange={(e) => {
                          const newPerks = [...(bundlesFormHero.perks || [])];
                          newPerks[pIdx] = { ...perk, textAr: e.target.value };
                          setBundlesFormHero({ ...bundlesFormHero, perks: newPerks });
                        }}
                        placeholder="النص بالعربية"
                        className="w-full bg-stone border border-grave px-3 py-1.5 text-xs font-mono text-bone focus:border-gold focus:outline-none"
                      />

                      <input
                        type="text"
                        value={perk.textEn || ''}
                        onChange={(e) => {
                          const newPerks = [...(bundlesFormHero.perks || [])];
                          newPerks[pIdx] = { ...perk, textEn: e.target.value };
                          setBundlesFormHero({ ...bundlesFormHero, perks: newPerks });
                        }}
                        placeholder="Text in English"
                        className="w-full bg-stone border border-grave px-3 py-1.5 text-xs font-mono text-bone focus:border-gold focus:outline-none"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => {
                  updateBundlesHero(bundlesFormHero);
                  showToast('تم حفظ إعدادات هيدر صفحة البندلات بنجاح! 🎉', 'success');
                }}
                className="px-6 py-2.5 bg-gold text-[#0A0C16] font-bold font-mono text-xs uppercase tracking-wider hover:bg-gold-light transition-all shadow-md"
              >
                حفظ إعدادات الهيدر والبنر العلوي 💾
              </button>
            </div>
          </div>

          {/* ============================================================ */}
          {/* SECTION 2: BUNDLE PRODUCTS GRID & QUICK MANAGEMENT */}
          {/* ============================================================ */}
          <div className="bg-stone border border-grave p-6 space-y-6 shadow-lg card-depth-highlight">
            <div className="flex items-center justify-between border-b border-grave pb-4">
              <div className="flex items-center gap-3">
                <Package size={20} className="text-gold" />
                <div>
                  <h3 className="font-clash text-lg uppercase text-bone font-bold">2. بندلات وعروض المنتجات (Bundle Products Manager)</h3>
                  <p className="font-mono text-xs text-ash">
                    إضافة، تعديل الأسعار، الخصومات، الصور، التشارات، وحالة الظهور للبندلات
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setEditingProduct({ category: 'bundles' });
                  setIsProductModalOpen(true);
                }}
                className="flex items-center gap-2 px-5 py-2.5 bg-gold text-[#0A0C16] font-bold font-mono text-xs uppercase tracking-wider hover:bg-gold-light transition-all shadow-md"
              >
                <Plus size={16} />
                <span>إضافة بندل جديد 🎁</span>
              </button>
            </div>

            {/* Grid of Bundle Products */}
            {products.filter((p) => p && (p.category === 'bundles' || (p.id && p.id.startsWith('bundle-')))).length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products
                  .filter((p) => p && (p.category === 'bundles' || (p.id && p.id.startsWith('bundle-'))))
                  .map((bundle) => {
                    const isBundleActive = bundle.is_active !== false && bundle.isActive !== false;
                    const savings = bundle.savings || (bundle.originalPrice && bundle.price ? bundle.originalPrice - bundle.price : 0);

                    return (
                      <div
                        key={bundle.id}
                        className={`bg-coal border transition-all overflow-hidden flex flex-col justify-between ${
                          isBundleActive ? 'border-grave hover:border-gold/60' : 'border-red-900/60 opacity-60'
                        }`}
                      >
                        <div className="relative h-48 bg-stone border-b border-grave overflow-hidden flex items-center justify-center">
                          <img
                            src={bundle.image || bundle.imageUrl}
                            alt={bundle.nameAr || bundle.nameEn}
                            className="w-full h-full object-cover"
                          />
                          {savings > 0 && (
                            <span className="absolute top-2 right-2 bg-gold text-[#0A0C16] font-mono font-bold text-[10px] uppercase px-2 py-1">
                              توفير {savings} ج.م
                            </span>
                          )}
                        </div>

                        <div className="p-4 space-y-3 flex-grow flex flex-col justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center justify-between font-mono text-[10px] text-ash">
                              <span className="text-gold font-bold">{bundle.tagAr || bundle.badge || 'BUNDLE'}</span>
                              <span>ID: {bundle.id}</span>
                            </div>
                            <h4 className="font-clash text-base uppercase text-bone font-bold line-clamp-1">
                              {bundle.nameAr || bundle.nameEn}
                            </h4>
                            <p className="font-space text-xs text-ash line-clamp-2">
                              {bundle.descriptionAr || bundle.descriptionEn}
                            </p>
                          </div>

                          <div className="pt-3 border-t border-grave/60 space-y-3">
                            <div className="flex items-center justify-between font-mono text-sm">
                              <span className="text-gold font-bold">{formatPrice(bundle.price)}</span>
                              {bundle.originalPrice && (
                                <span className="text-ash line-through text-xs">{formatPrice(bundle.originalPrice)}</span>
                              )}
                            </div>

                            <div className="flex items-center gap-2 pt-2 border-t border-grave/40">
                              {/* Toggle active */}
                              <button
                                type="button"
                                onClick={() => toggleProductVisibility(bundle.id)}
                                className={`flex-1 py-1.5 font-mono text-[11px] uppercase font-bold flex items-center justify-center gap-1 border transition-all ${
                                  isBundleActive
                                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-400'
                                    : 'bg-red-950/40 border-red-500/40 text-red-400'
                                }`}
                              >
                                {isBundleActive ? <Eye size={13} /> : <EyeOff size={13} />}
                                <span>{isBundleActive ? 'ظاهر' : 'مخفي'}</span>
                              </button>

                              {/* Edit */}
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingProduct(bundle);
                                  setIsProductModalOpen(true);
                                }}
                                className="px-3 py-1.5 bg-stone border border-grave hover:border-gold text-ash hover:text-gold font-mono text-[11px] uppercase flex items-center gap-1 transition-all"
                              >
                                <Edit2 size={13} />
                                <span>تعديل</span>
                              </button>

                              {/* Delete */}
                              <button
                                type="button"
                                onClick={() => {
                                  if (window.confirm(`هل أنت تأكد من حذف البندل "${bundle.nameAr || bundle.nameEn}"؟`)) {
                                    deleteProduct(bundle.id);
                                    showToast('تم حذف البندل 🗑️', 'info');
                                  }
                                }}
                                className="px-3 py-1.5 bg-stone border border-red-900/50 hover:bg-red-950 text-red-400 font-mono text-[11px] uppercase flex items-center gap-1 transition-all"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            ) : (
              <div className="p-8 text-center bg-coal border border-grave font-mono text-xs text-ash">
                لا توجد بندلات مضافة حالياً. انقر على "إضافة بندل جديد 🎁" لإنشاء أول بندل.
              </div>
            )}
          </div>

          {/* ============================================================ */}
          {/* SECTION 3: BOTTOM CTA BANNER SETTINGS */}
          {/* ============================================================ */}
          <div className="bg-stone border border-grave p-6 space-y-6 shadow-lg card-depth-highlight">
            <div className="flex items-center justify-between border-b border-grave pb-4">
              <div className="flex items-center gap-3">
                <Sparkles size={20} className="text-gold" />
                <div>
                  <h3 className="font-clash text-lg uppercase text-bone font-bold">3. البنر السفلي لترويج المصمم (Bottom CTA Banner)</h3>
                  <p className="font-mono text-xs text-ash">التحكم في بنر دعوة العميل لإنشاء استيكر مخصص ف أسفل صفحة /bundles</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  const nextActive = !bundlesFormCta.isActive;
                  const updated = { ...bundlesFormCta, isActive: nextActive };
                  setBundlesFormCta(updated);
                  updateBundlesCta(updated);
                  showToast(nextActive ? 'تم تفعيل البنر السفلي 👁️' : 'تم إخفاء البنر السفلي 🙈', 'info');
                }}
                className={`px-4 py-2 font-mono text-xs font-bold uppercase flex items-center gap-2 border transition-all ${
                  bundlesFormCta.isActive !== false
                    ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-400'
                    : 'bg-red-950/60 border-red-500/50 text-red-400'
                }`}
              >
                {bundlesFormCta.isActive !== false ? <Eye size={15} /> : <EyeOff size={15} />}
                <span>{bundlesFormCta.isActive !== false ? 'البنر مفعل (ظاهر)' : 'البنر مخفي'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* CTA Eyebrow AR / EN */}
              <div className="space-y-2">
                <label className="font-mono text-xs text-bone block uppercase font-bold">الشارة التشويقية (Eyebrow Ar):</label>
                <input
                  type="text"
                  value={bundlesFormCta.eyebrowAr || ''}
                  onChange={(e) => setBundlesFormCta({ ...bundlesFormCta, eyebrowAr: e.target.value })}
                  className="w-full bg-coal border border-grave px-4 py-2.5 text-xs font-mono text-bone focus:border-gold focus:outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="font-mono text-xs text-bone block uppercase font-bold">Eyebrow Tag (English):</label>
                <input
                  type="text"
                  value={bundlesFormCta.eyebrowEn || ''}
                  onChange={(e) => setBundlesFormCta({ ...bundlesFormCta, eyebrowEn: e.target.value })}
                  className="w-full bg-coal border border-grave px-4 py-2.5 text-xs font-mono text-bone focus:border-gold focus:outline-none"
                />
              </div>

              {/* Title AR / EN */}
              <div className="space-y-2">
                <label className="font-mono text-xs text-bone block uppercase font-bold">العنوان الرئيسي (Title Ar):</label>
                <input
                  type="text"
                  value={bundlesFormCta.titleAr || ''}
                  onChange={(e) => setBundlesFormCta({ ...bundlesFormCta, titleAr: e.target.value })}
                  className="w-full bg-coal border border-grave px-4 py-2.5 text-xs font-mono text-bone focus:border-gold focus:outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="font-mono text-xs text-bone block uppercase font-bold">Main Title (English):</label>
                <input
                  type="text"
                  value={bundlesFormCta.titleEn || ''}
                  onChange={(e) => setBundlesFormCta({ ...bundlesFormCta, titleEn: e.target.value })}
                  className="w-full bg-coal border border-grave px-4 py-2.5 text-xs font-mono text-bone focus:border-gold focus:outline-none"
                />
              </div>

              {/* Description AR / EN */}
              <div className="space-y-2 md:col-span-2">
                <label className="font-mono text-xs text-bone block uppercase font-bold">الوصف الفرعي (Description Ar):</label>
                <textarea
                  rows={2}
                  value={bundlesFormCta.descAr || ''}
                  onChange={(e) => setBundlesFormCta({ ...bundlesFormCta, descAr: e.target.value })}
                  className="w-full bg-coal border border-grave p-3 text-xs font-mono text-bone focus:border-gold focus:outline-none"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="font-mono text-xs text-bone block uppercase font-bold">Description (English):</label>
                <textarea
                  rows={2}
                  value={bundlesFormCta.descEn || ''}
                  onChange={(e) => setBundlesFormCta({ ...bundlesFormCta, descEn: e.target.value })}
                  className="w-full bg-coal border border-grave p-3 text-xs font-mono text-bone focus:border-gold focus:outline-none"
                />
              </div>

              {/* Button Text AR / EN */}
              <div className="space-y-2">
                <label className="font-mono text-xs text-bone block uppercase font-bold">نص الزر بالعربية (Button Text Ar):</label>
                <input
                  type="text"
                  value={bundlesFormCta.buttonTextAr || ''}
                  onChange={(e) => setBundlesFormCta({ ...bundlesFormCta, buttonTextAr: e.target.value })}
                  className="w-full bg-coal border border-grave px-4 py-2.5 text-xs font-mono text-bone focus:border-gold focus:outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="font-mono text-xs text-bone block uppercase font-bold">Button Text (English):</label>
                <input
                  type="text"
                  value={bundlesFormCta.buttonTextEn || ''}
                  onChange={(e) => setBundlesFormCta({ ...bundlesFormCta, buttonTextEn: e.target.value })}
                  className="w-full bg-coal border border-grave px-4 py-2.5 text-xs font-mono text-bone focus:border-gold focus:outline-none"
                />
              </div>

              {/* Button Link */}
              <div className="space-y-2 md:col-span-2">
                <label className="font-mono text-xs text-bone block uppercase font-bold">رابط الزر (Button Target Link):</label>
                <input
                  type="text"
                  value={bundlesFormCta.buttonLink || '/sticker-builder'}
                  onChange={(e) => setBundlesFormCta({ ...bundlesFormCta, buttonLink: e.target.value })}
                  className="w-full bg-coal border border-grave px-4 py-2.5 text-xs font-mono text-bone focus:border-gold focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => {
                  updateBundlesCta(bundlesFormCta);
                  showToast('تم حفظ إعدادات البنر السفلي لصفحة البندلات! 🎉', 'success');
                }}
                className="px-6 py-2.5 bg-gold text-[#0A0C16] font-bold font-mono text-xs uppercase tracking-wider hover:bg-gold-light transition-all shadow-md"
              >
                حفظ إعدادات البنر السفلي 💾
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 7: STICKERS PAGE FULL CONTROL ENGINE */}
      {/* ============================================================ */}
      {activeTab === 'stickers_page' && (
        <div className="space-y-8 animate-fade-in">
          {/* Header Control Card */}
          <div className="bg-stone border border-gold/40 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
            <div>
              <span className="font-mono text-xs text-gold font-bold uppercase tracking-widest block">
                DUAT / STICKERS PAGE ENGINE
              </span>
              <h2 className="font-clash text-2xl uppercase text-bone font-bold mt-1">
                إدارة وديناميكية صفحة الاستيكرات المجسمة (/stickers) ✨
              </h2>
              <p className="font-mono text-xs text-ash mt-1">
                تحكم كامل ومباشر في بنر صفحة الاستيكرات العلوي، العناوين، الأوصاف، وبنر ترويج البيلدر.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href="/stickers"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 bg-coal border border-gold/40 hover:border-gold text-gold font-mono text-xs uppercase font-bold transition-all shadow-md"
              >
                <ExternalLink size={15} />
                <span>معاينة الصفحة الحية</span>
              </a>

              <button
                type="button"
                onClick={() => {
                  if (window.confirm('هل أنت تأكد من إعادة ضبط صفحة الاستيكرات للافتراضي؟')) {
                    resetStickersSettings();
                    showToast('تم إعادة ضبط صفحة الاستيكرات للافتراضي 🔄', 'info');
                  }
                }}
                className="flex items-center gap-2 px-4 py-2.5 bg-stone border border-grave hover:border-gold text-ash hover:text-bone font-mono text-xs uppercase font-bold transition-all"
              >
                <RotateCcw size={15} />
                <span>إعادة ضبط الافتراضي</span>
              </button>
            </div>
          </div>

          {/* ============================================================ */}
          {/* SECTION 1: HERO HEADER BANNER SETTINGS */}
          {/* ============================================================ */}
          <div className="bg-stone border border-grave p-6 space-y-6 shadow-lg card-depth-highlight">
            <div className="flex items-center justify-between border-b border-grave pb-4">
              <div className="flex items-center gap-3">
                <ImageIcon size={20} className="text-gold" />
                <div>
                  <h3 className="font-clash text-lg uppercase text-bone font-bold">1. الهيدر والبنر العلوي (Hero Header Banner)</h3>
                  <p className="font-mono text-xs text-ash">تغيير النصوص، العناوين، وخلفية البنر لصفحة الاستيكرات</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  const nextActive = !stickersFormHero.isActive;
                  const updated = { ...stickersFormHero, isActive: nextActive };
                  setStickersFormHero(updated);
                  updateStickersHero(updated);
                  showToast(nextActive ? 'تم تفعيل البنر العلوي 👁️' : 'تم إخفاء البنر العلوي 🙈', 'info');
                }}
                className={`px-4 py-2 font-mono text-xs font-bold uppercase flex items-center gap-2 border transition-all ${
                  stickersFormHero.isActive !== false
                    ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-400'
                    : 'bg-red-950/60 border-red-500/50 text-red-400'
                }`}
              >
                {stickersFormHero.isActive !== false ? <Eye size={15} /> : <EyeOff size={15} />}
                <span>{stickersFormHero.isActive !== false ? 'البنر مفعل (ظاهر)' : 'البنر مخفي'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Eyebrow Tag AR / EN */}
              <div className="space-y-2">
                <label className="font-mono text-xs text-bone block uppercase font-bold">الشارة التشويقية (Eyebrow Ar):</label>
                <input
                  type="text"
                  value={stickersFormHero.eyebrowAr || ''}
                  onChange={(e) => setStickersFormHero({ ...stickersFormHero, eyebrowAr: e.target.value })}
                  placeholder="استيكرات إيبوكسي مجسمة ✦"
                  className="w-full bg-coal border border-grave px-4 py-2.5 text-xs font-mono text-bone focus:border-gold focus:outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="font-mono text-xs text-bone block uppercase font-bold">Eyebrow Tag (English):</label>
                <input
                  type="text"
                  value={stickersFormHero.eyebrowEn || ''}
                  onChange={(e) => setStickersFormHero({ ...stickersFormHero, eyebrowEn: e.target.value })}
                  placeholder="3D EPOXY STICKERS ✦"
                  className="w-full bg-coal border border-grave px-4 py-2.5 text-xs font-mono text-bone focus:border-gold focus:outline-none"
                />
              </div>

              {/* Title AR / EN */}
              <div className="space-y-2">
                <label className="font-mono text-xs text-bone block uppercase font-bold">العنوان الرئيسي (Title Ar):</label>
                <input
                  type="text"
                  value={stickersFormHero.titleAr || ''}
                  onChange={(e) => setStickersFormHero({ ...stickersFormHero, titleAr: e.target.value })}
                  placeholder="قسم الاستيكرات ✦"
                  className="w-full bg-coal border border-grave px-4 py-2.5 text-xs font-mono text-bone focus:border-gold focus:outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="font-mono text-xs text-bone block uppercase font-bold">Title (English):</label>
                <input
                  type="text"
                  value={stickersFormHero.titleEn || ''}
                  onChange={(e) => setStickersFormHero({ ...stickersFormHero, titleEn: e.target.value })}
                  placeholder="Stickers Collection ✦"
                  className="w-full bg-coal border border-grave px-4 py-2.5 text-xs font-mono text-bone focus:border-gold focus:outline-none"
                />
              </div>

              {/* Description AR / EN */}
              <div className="space-y-2 md:col-span-2">
                <label className="font-mono text-xs text-bone block uppercase font-bold">الوصف الفرعي بالعربية (Description Ar):</label>
                <textarea
                  rows={2}
                  value={stickersFormHero.descAr || ''}
                  onChange={(e) => setStickersFormHero({ ...stickersFormHero, descAr: e.target.value })}
                  className="w-full bg-coal border border-grave p-3 text-xs font-mono text-bone focus:border-gold focus:outline-none"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="font-mono text-xs text-bone block uppercase font-bold">Description (English):</label>
                <textarea
                  rows={2}
                  value={stickersFormHero.descEn || ''}
                  onChange={(e) => setStickersFormHero({ ...stickersFormHero, descEn: e.target.value })}
                  className="w-full bg-coal border border-grave p-3 text-xs font-mono text-bone focus:border-gold focus:outline-none"
                />
              </div>

              {/* Background Image URLs (Desktop & Mobile) */}
              <div className="space-y-2">
                <label className="font-mono text-xs text-gold block uppercase font-bold">💻 صورة خلفية الهيدر للكمبيوتر (Desktop Image URL):</label>
                <input
                  type="url"
                  value={stickersFormHero.bgImage || ''}
                  onChange={(e) => setStickersFormHero({ ...stickersFormHero, bgImage: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-coal border border-grave px-4 py-2.5 text-xs font-mono text-bone focus:border-gold focus:outline-none"
                  dir="ltr"
                />
              </div>

              <div className="space-y-2">
                <label className="font-mono text-xs text-amber-400 block uppercase font-bold">📱 صورة خلفية الهيدر للموبايل (Mobile Image URL - اختياري):</label>
                <input
                  type="url"
                  value={stickersFormHero.mobileBgImage || ''}
                  onChange={(e) => setStickersFormHero({ ...stickersFormHero, mobileBgImage: e.target.value })}
                  placeholder="رابط صورة الهيدر بمقاس التلفون الطولي"
                  className="w-full bg-coal border border-grave px-4 py-2.5 text-xs font-mono text-bone focus:border-amber-400 focus:outline-none"
                  dir="ltr"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => {
                  updateStickersHero(stickersFormHero);
                  showToast('تم حفظ إعدادات هيدر صفحة الاستيكرات! 🎉', 'success');
                }}
                className="px-6 py-2.5 bg-gold text-[#0A0C16] font-bold font-mono text-xs uppercase tracking-wider hover:bg-gold-light transition-all shadow-md"
              >
                حفظ إعدادات الهيدر والبنر العلوي 💾
              </button>
            </div>
          </div>

          {/* ============================================================ */}
          {/* SECTION 2: STICKER BUILDER PROMO BANNER SETTINGS */}
          {/* ============================================================ */}
          <div className="bg-stone border border-grave p-6 space-y-6 shadow-lg card-depth-highlight">
            <div className="flex items-center justify-between border-b border-grave pb-4">
              <div className="flex items-center gap-3">
                <Sparkles size={20} className="text-gold" />
                <div>
                  <h3 className="font-clash text-lg uppercase text-bone font-bold">2. بنر ترويج بيلدر الاستيكرات (Builder Promo Banner)</h3>
                  <p className="font-mono text-xs text-ash">دعوة الزائر لتجربة بيلدر الاستيكرات المباشر ف صفحة /stickers</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  const nextActive = !stickersFormPromo.isActive;
                  const updated = { ...stickersFormPromo, isActive: nextActive };
                  setStickersFormPromo(updated);
                  updateStickersPromo(updated);
                  showToast(nextActive ? 'تم تفعيل بنر الترويج 👁️' : 'تم إخفاء بنر الترويج 🙈', 'info');
                }}
                className={`px-4 py-2 font-mono text-xs font-bold uppercase flex items-center gap-2 border transition-all ${
                  stickersFormPromo.isActive !== false
                    ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-400'
                    : 'bg-red-950/60 border-red-500/50 text-red-400'
                }`}
              >
                {stickersFormPromo.isActive !== false ? <Eye size={15} /> : <EyeOff size={15} />}
                <span>{stickersFormPromo.isActive !== false ? 'البنر مفعل (ظاهر)' : 'البنر مخفي'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title AR / EN */}
              <div className="space-y-2">
                <label className="font-mono text-xs text-bone block uppercase font-bold">العنوان الرئيسي (Title Ar):</label>
                <input
                  type="text"
                  value={stickersFormPromo.titleAr || ''}
                  onChange={(e) => setStickersFormPromo({ ...stickersFormPromo, titleAr: e.target.value })}
                  className="w-full bg-coal border border-grave px-4 py-2.5 text-xs font-mono text-bone focus:border-gold focus:outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="font-mono text-xs text-bone block uppercase font-bold">Title (English):</label>
                <input
                  type="text"
                  value={stickersFormPromo.titleEn || ''}
                  onChange={(e) => setStickersFormPromo({ ...stickersFormPromo, titleEn: e.target.value })}
                  className="w-full bg-coal border border-grave px-4 py-2.5 text-xs font-mono text-bone focus:border-gold focus:outline-none"
                />
              </div>

              {/* Description AR / EN */}
              <div className="space-y-2 md:col-span-2">
                <label className="font-mono text-xs text-bone block uppercase font-bold">الوصف الفرعي (Description Ar):</label>
                <textarea
                  rows={2}
                  value={stickersFormPromo.descAr || ''}
                  onChange={(e) => setStickersFormPromo({ ...stickersFormPromo, descAr: e.target.value })}
                  className="w-full bg-coal border border-grave p-3 text-xs font-mono text-bone focus:border-gold focus:outline-none"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="font-mono text-xs text-bone block uppercase font-bold">Description (English):</label>
                <textarea
                  rows={2}
                  value={stickersFormPromo.descEn || ''}
                  onChange={(e) => setStickersFormPromo({ ...stickersFormPromo, descEn: e.target.value })}
                  className="w-full bg-coal border border-grave p-3 text-xs font-mono text-bone focus:border-gold focus:outline-none"
                />
              </div>

              {/* Button Text AR / EN */}
              <div className="space-y-2">
                <label className="font-mono text-xs text-bone block uppercase font-bold">نص الزر (Button Text Ar):</label>
                <input
                  type="text"
                  value={stickersFormPromo.buttonTextAr || ''}
                  onChange={(e) => setStickersFormPromo({ ...stickersFormPromo, buttonTextAr: e.target.value })}
                  className="w-full bg-coal border border-grave px-4 py-2.5 text-xs font-mono text-bone focus:border-gold focus:outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="font-mono text-xs text-bone block uppercase font-bold">Button Text (English):</label>
                <input
                  type="text"
                  value={stickersFormPromo.buttonTextEn || ''}
                  onChange={(e) => setStickersFormPromo({ ...stickersFormPromo, buttonTextEn: e.target.value })}
                  className="w-full bg-coal border border-grave px-4 py-2.5 text-xs font-mono text-bone focus:border-gold focus:outline-none"
                />
              </div>

              {/* Button Link */}
              <div className="space-y-2 md:col-span-2">
                <label className="font-mono text-xs text-bone block uppercase font-bold">رابط الزر (Button Target Link):</label>
                <input
                  type="text"
                  value={stickersFormPromo.buttonLink || '/sticker-builder'}
                  onChange={(e) => setStickersFormPromo({ ...stickersFormPromo, buttonLink: e.target.value })}
                  className="w-full bg-coal border border-grave px-4 py-2.5 text-xs font-mono text-bone focus:border-gold focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => {
                  updateStickersPromo(stickersFormPromo);
                  showToast('تم حفظ إعدادات بنر الترويج بنجاح! 🎉', 'success');
                }}
                className="px-6 py-2.5 bg-gold text-[#0A0C16] font-bold font-mono text-xs uppercase tracking-wider hover:bg-gold-light transition-all shadow-md"
              >
                حفظ إعدادات بنر الترويج 💾
              </button>
            </div>
          </div>

          {/* ============================================================ */}
          {/* SECTION 3: STICKERS CATALOG & FILTER MANAGEMENT */}
          {/* ============================================================ */}
          <div className="bg-stone border border-grave p-6 space-y-6 shadow-lg card-depth-highlight">
            <div className="flex items-center justify-between border-b border-grave pb-4">
              <div className="flex items-center gap-3">
                <Package size={20} className="text-gold" />
                <div>
                  <h3 className="font-clash text-lg uppercase text-bone font-bold">3. استيكرات الكاتالوج والفلترة (Stickers Catalog Manager)</h3>
                  <p className="font-mono text-xs text-ash">
                    إدارة واستعراض جميع الاستيكرات الفردية والعبارات وحروف الشارات
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setEditingProduct({ category: 'stickers' });
                  setIsProductModalOpen(true);
                }}
                className="flex items-center gap-2 px-5 py-2.5 bg-gold text-[#0A0C16] font-bold font-mono text-xs uppercase tracking-wider hover:bg-gold-light transition-all shadow-md"
              >
                <Plus size={16} />
                <span>إضافة استيكر جديد ✨</span>
              </button>
            </div>

            {/* Grid of Sticker Products */}
            {products.filter((p) => p && p.category !== 'bundles' && !(p.id && p.id.startsWith('bundle-'))).length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {products
                  .filter((p) => p && p.category !== 'bundles' && !(p.id && p.id.startsWith('bundle-')))
                  .slice(0, 12)
                  .map((st) => {
                    const isActive = st.is_active !== false && st.isActive !== false;
                    return (
                      <div
                        key={st.id}
                        className={`bg-coal border transition-all overflow-hidden flex flex-col justify-between ${
                          isActive ? 'border-grave hover:border-gold/60' : 'border-red-900/60 opacity-60'
                        }`}
                      >
                        <div className="relative aspect-square bg-stone border-b border-grave overflow-hidden flex items-center justify-center p-3">
                          <img
                            src={st.image || st.imageUrl}
                            alt={st.nameAr || st.nameEn}
                            className="w-full h-full object-contain"
                          />
                        </div>

                        <div className="p-3 space-y-2 flex-grow flex flex-col justify-between">
                          <div>
                            <span className="font-mono text-[10px] text-gold font-bold uppercase block">{st.tagAr || st.category || 'STICKER'}</span>
                            <h4 className="font-clash text-sm uppercase text-bone font-bold truncate">
                              {st.nameAr || st.nameEn}
                            </h4>
                          </div>

                          <div className="pt-2 border-t border-grave/60 flex items-center justify-between">
                            <span className="font-mono text-xs font-bold text-gold">{formatPrice(st.price)}</span>
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingProduct(st);
                                  setIsProductModalOpen(true);
                                }}
                                className="p-1 text-ash hover:text-gold border border-grave bg-stone"
                                title="تعديل"
                              >
                                <Edit2 size={12} />
                              </button>
                              <button
                                type="button"
                                onClick={() => toggleProductVisibility(st.id)}
                                className="p-1 text-ash hover:text-gold border border-grave bg-stone"
                                title="تغيير الرؤية"
                              >
                                {isActive ? <Eye size={12} /> : <EyeOff size={12} />}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            ) : (
              <div className="p-8 text-center bg-coal border border-grave font-mono text-xs text-ash">
                لا توجد استيكرات متاحة حالياً.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  </div>

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
        onSave={async (bannerId, updatedFields) => {
          if (bannerId) {
            return updateCategoryBanner(bannerId, updatedFields);
          } else {
            return addCategoryBanner(updatedFields);
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

      {/* ORDER DETAILS MODAL */}
      {selectedOrderDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-void/85 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-stone border border-gold/40 p-6 space-y-6 shadow-2xl max-h-[88vh] overflow-y-auto custom-scrollbar rounded-lg">
            <div className="flex items-center justify-between border-b border-grave pb-4">
              <div>
                <span className="font-mono text-xs text-ash uppercase">تفاصيل الطلب الكاملة</span>
                <h3 className="font-mono text-2xl font-bold text-gold tracking-widest">{selectedOrderDetails.ref || selectedOrderDetails.id}</h3>
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
                  const cfg = item.customConfig || item.customDetails || item.product?.customConfig || item.product?.customDetails;
                  const designPath = item.design_image_path || cfg?.design_image_path;
                  const secureDesignUrl = designPath ? signedDesignUrls[designPath] : null;
                  const catalogProduct = productLookup.get(String(item.id || item.productId || item.product_id));
                  const thumbnailItem = {
                    ...item,
                    product: item.product || catalogProduct,
                    stickerRenderId: item.stickerRenderId || catalogProduct?.stickerRenderId,
                    image: secureDesignUrl || item.image || item.imageUrl || catalogProduct?.image || catalogProduct?.imageUrl || catalogProduct?.images?.[0],
                    designSnapshot: secureDesignUrl || item.designSnapshot || cfg?.designSnapshot
                  };
                  const customPreviewImage = secureDesignUrl || item.designSnapshot || cfg?.designSnapshot || item.image || cfg?.uploadedImage;
                  const cDetails = item.customDetails || item.customizerConfig || {};
                  const itemNameLower = String(name || '').toLowerCase();

                  const isCustomSticker = (item.id && item.id.startsWith('custom-sticker-')) ||
                                          item.isCustom === true ||
                                          Boolean(designPath) ||
                                          cDetails.mode === 'text' ||
                                          cDetails.mode === 'image' ||
                                          itemNameLower.includes('custom sticker') ||
                                          itemNameLower.includes('استيكر مخصص');

                  const isCustomBundle = item.category === 'bundles' ||
                                        (item.id && item.id.startsWith('bundle-')) ||
                                        !!cDetails.selectedItems ||
                                        itemNameLower.includes('bundle') ||
                                        itemNameLower.includes('بندل');

                  return (
                    <div key={idx} className="p-4 space-y-3 font-sans text-xs bg-coal/40 rounded border border-grave/60">
                      {/* Top Product Header Row with Thumbnail Image */}
                      <div className="flex items-center gap-3">
                        {/* Thumbnail Image Box */}
                        <div className="w-16 h-16 bg-stone border border-gold/40 rounded flex-shrink-0 flex items-center justify-center overflow-hidden p-1 shadow-md">
                          <CustomStickerThumbnail item={thumbnailItem} />
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
                            {isCustomSticker && (
                              <span className="px-2 py-0.5 bg-gold/20 text-gold border border-gold/40 rounded font-bold text-[10px]">
                                🎨 استيكر مخصص
                              </span>
                            )}
                            {isCustomBundle && (
                              <span className="px-2 py-0.5 bg-gold/20 text-gold border border-gold/40 rounded font-bold text-[10px]">
                                🎁 بندل مخصص
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Custom Sticker Details Section */}
                      {isCustomSticker && (
                        <div className="bg-coal p-3 border border-gold/30 space-y-2 font-mono text-[11px] rounded">
                          <span className="text-gold font-bold block text-xs">
                            🎨 تفاصيل الاستيكر المخصص:
                          </span>
                          
                          {cDetails.customText && (
                            <p className="text-bone font-bold text-xs bg-stone/50 p-2 rounded border border-grave/40">
                              ✍️ النص المكتوب: "{cDetails.customText}"
                            </p>
                          )}

                          <div className="grid grid-cols-2 gap-2 text-ash text-[10px]">
                            {cDetails.selectedFont && <span>🔤 الخط: {cDetails.selectedFont}</span>}
                            {cDetails.textColor && <span>🎨 اللون: {cDetails.textColor}</span>}
                            {cDetails.bgFinish && <span>✨ الخامة: {cDetails.bgFinish}</span>}
                            {cDetails.cutShape && <span>📐 القص: {cDetails.cutShape}</span>}
                          </div>

                          {cDetails.designNotes && (
                            <div className="text-stone-950 bg-amber-400 p-2 rounded font-bold text-[10px]">
                              📝 ملاحظات الورشة: "{cDetails.designNotes}"
                            </div>
                          )}

                          {/* Image download for custom sticker */}
                          {customPreviewImage && (
                            <div className="pt-2 border-t border-grave/40 flex items-center justify-between gap-2">
                              <img src={customPreviewImage} alt="Sticker Preview" className="w-12 h-12 object-contain bg-stone border border-gold/40 rounded p-1" />
                              <a
                                href={customPreviewImage}
                                download={`custom-sticker-${selectedOrderDetails.ref || selectedOrderDetails.id || 'order'}.png`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1.5 bg-gold text-void font-bold text-[10px] rounded hover:bg-amber-400 transition-colors flex items-center gap-1"
                              >
                                <span>تحميل صورة الاستيكر عالية الجودة 📥</span>
                              </a>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Custom Bundle Details Section */}
                      {isCustomBundle && cDetails.selectedItems && cDetails.selectedItems.length > 0 && (
                        <div className="bg-coal p-3 border border-gold/30 space-y-2 font-mono text-[11px] rounded">
                          <span className="text-gold font-bold block text-xs">
                            🎁 محتويات البندل المحددة من العميل ({cDetails.selectedItems.length}):
                          </span>
                          {cDetails.customText && (
                            <p className="text-bone font-bold text-xs">✍️ الاسم المكتوب: "{cDetails.customText}"</p>
                          )}
                          <div className="flex flex-wrap gap-1.5">
                            {cDetails.selectedItems.map((sItem, sIdx) => (
                              <span key={sIdx} className="bg-stone border border-gold/40 text-gold font-bold px-2 py-0.5 rounded text-[10px]">
                                • {sItem.nameAr || sItem.nameEn}
                              </span>
                            ))}
                          </div>
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
              const displayProofUrl = proofPath ? signedProofUrl : null;
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

      {/* ============================================================ */}
    </div>
  );
}
