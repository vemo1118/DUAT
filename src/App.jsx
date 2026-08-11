import React, { useState, lazy, Suspense } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { ProductModal } from './components/ProductModal';
import { QuickViewDrawer } from './components/QuickViewDrawer';
import { OrderTrackerModal } from './components/OrderTrackerModal';
import { ToastContainer } from './components/ToastContainer';
import { LanguageProvider } from './context/LanguageContext';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';
import { ProductsProvider } from './context/ProductsContext';
import { OrdersProvider } from './context/OrdersContext';
import { HeroBannersProvider } from './context/HeroBannersContext';
import { CategoryBannersProvider } from './context/CategoryBannersContext';
import { BundlesSettingsProvider } from './context/BundlesSettingsContext';
import { StickersSettingsProvider } from './context/StickersSettingsContext';
import { CustomizerProvider } from './context/CustomizerContext';
import { SocialGridProvider } from './context/SocialGridContext';
import { WishlistProvider } from './context/WishlistContext';
import { WishlistDrawer } from './components/WishlistDrawer';
import { AnnouncementMarquee } from './components/AnnouncementMarquee';
import { ScrollToTop } from './components/ScrollToTop';

// Lazy-loaded Views for Bundle Optimization & Fast First Contentful Paint
const HomeView = lazy(() => import('./views/HomeView').then(m => ({ default: m.HomeView })));
const BundlesView = lazy(() => import('./views/BundlesView').then(m => ({ default: m.BundlesView })));
const StickersView = lazy(() => import('./views/StickersView').then(m => ({ default: m.StickersView })));
const StickerBuilderView = lazy(() => import('./views/StickerBuilderView').then(m => ({ default: m.StickerBuilderView })));
const ShopView = lazy(() => import('./views/ShopView').then(m => ({ default: m.ShopView })));
const AboutView = lazy(() => import('./views/AboutView').then(m => ({ default: m.AboutView })));
const CheckoutView = lazy(() => import('./views/CheckoutView').then(m => ({ default: m.CheckoutView })));
const OrderTrackerView = lazy(() => import('./views/OrderTrackerView').then(m => ({ default: m.OrderTrackerView })));
const ProductDetailView = lazy(() => import('./views/ProductDetailView').then(m => ({ default: m.ProductDetailView })));
const AdminView = lazy(() => import('./views/AdminView').then(m => ({ default: m.AdminView })));

function PageFallback() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4 py-20 text-center">
      <div className="relative flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-2 border-gold/20 border-t-gold animate-spin" />
        <div className="absolute w-2.5 h-2.5 bg-gold rounded-full animate-ping" />
      </div>
      <p className="font-mono text-xs uppercase tracking-[0.25em] text-ash animate-pulse">
        DUAT / Loading View...
      </p>
    </div>
  );
}

export function App() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [trackerOpen, setTrackerOpen] = useState(false);

  const navigate = useNavigate();

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
  };

  const handleSelectCategory = (catId) => {
    setSelectedCategory(catId);
    navigate('/shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    const observeElements = () => {
      document.querySelectorAll('.reveal-on-scroll').forEach((el) => observer.observe(el));
    };

    observeElements();
    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <ThemeProvider>
      <LanguageProvider>
        <ProductsProvider>
          <OrdersProvider>
            <HeroBannersProvider>
              <CategoryBannersProvider>
                <BundlesSettingsProvider>
                  <StickersSettingsProvider>
                    <CustomizerProvider>
                    <SocialGridProvider>
                      <WishlistProvider>
                        <CartProvider>
                          <ToastProvider>
                            {/* Main Container with Filmic Grain Texture Overlay */}
                            <div className="min-h-screen bg-transparent text-bone flex flex-col font-space selection:bg-gold selection:text-[#050505] relative bg-noise transition-colors duration-300">
                              <ScrollToTop />

                              {/* Top Announcement Marquee Strip */}
                              <AnnouncementMarquee />

                              {/* Top Navigation Header */}
                              <Navbar onOpenTracker={() => setTrackerOpen(true)} />

                              {/* Main Content Router View */}
                              <main className="flex-grow relative z-10">
                                <Suspense fallback={<PageFallback />}>
                                  <Routes>
                                    <Route
                                      path="/"
                                      element={
                                        <HomeView
                                          setSelectedCategory={handleSelectCategory}
                                          onSelectProduct={handleSelectProduct}
                                        />
                                      }
                                    />
                                    <Route path="/bundles" element={<BundlesView />} />
                                    <Route path="/stickers" element={<StickersView />} />
                                    <Route path="/sticker-builder" element={<StickerBuilderView />} />
                                    
                                    <Route
                                      path="/shop"
                                      element={
                                        <ShopView
                                          selectedCategory={selectedCategory}
                                          setSelectedCategory={setSelectedCategory}
                                          onSelectProduct={handleSelectProduct}
                                        />
                                      }
                                    />
                                    <Route path="/product/:id" element={<ProductDetailView />} />
                                    <Route path="/customize" element={<Navigate to="/sticker-builder" replace />} />
                                    <Route path="/customizer" element={<Navigate to="/sticker-builder" replace />} />
                                    
                                    <Route path="/the-duat" element={<AboutView />} />
                                    <Route path="/about" element={<Navigate to="/the-duat" replace />} />
                                    
                                    <Route path="/track-order" element={<OrderTrackerView />} />
                                    <Route path="/checkout" element={<CheckoutView />} />
                                    <Route path="/admin" element={<AdminView />} />
                                    
                                    {/* Fallback unknown routes to Home */}
                                    <Route path="*" element={<Navigate to="/" replace />} />
                                  </Routes>
                                </Suspense>
                              </main>

                              {/* Global Footer */}
                              <Footer />

                              {/* Cart Slide-out Drawer Overlay */}
                              <CartDrawer />

                              {/* Wishlist Favorites Slide-out Drawer Overlay */}
                              <WishlistDrawer />

                              {/* Quick View Options Slide-over Drawer */}
                              <QuickViewDrawer
                                product={selectedProduct}
                                isOpen={!!selectedProduct}
                                onClose={() => setSelectedProduct(null)}
                              />

                              {/* Order Shipment Tracker Modal */}
                              <OrderTrackerModal
                                isOpen={trackerOpen}
                                onClose={() => setTrackerOpen(false)}
                              />

                              {/* Toast Notification Floating Container */}
                              <ToastContainer />
                            </div>
                          </ToastProvider>
                        </CartProvider>
                      </WishlistProvider>
                    </SocialGridProvider>
                  </CustomizerProvider>
                </StickersSettingsProvider>
              </BundlesSettingsProvider>
              </CategoryBannersProvider>
            </HeroBannersProvider>
          </OrdersProvider>
        </ProductsProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
