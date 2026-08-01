import React, { useState } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomeView } from './views/HomeView';
import { ShopView } from './views/ShopView';
import { CustomizerView } from './views/CustomizerView';
import { AboutView } from './views/AboutView';
import { CheckoutView } from './views/CheckoutView';
import { OrderTrackerView } from './views/OrderTrackerView';
import { ProductDetailView } from './views/ProductDetailView';
import { AdminView } from './views/AdminView';
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
import { AnnouncementMarquee } from './components/AnnouncementMarquee';
import { ScrollToTop } from './components/ScrollToTop';

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

    // Re-observe after dynamic page navigation or route shifts
    const timer = setTimeout(observeElements, 200);
    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  return (
    <ThemeProvider>
      <LanguageProvider>
        <ProductsProvider>
          <OrdersProvider>
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
                    <Route path="/customize" element={<CustomizerView />} />
                    <Route path="/customizer" element={<Navigate to="/customize" replace />} />
                    
                    <Route path="/the-duat" element={<AboutView />} />
                    <Route path="/about" element={<Navigate to="/the-duat" replace />} />
                    
                    <Route path="/track-order" element={<OrderTrackerView />} />
                    <Route path="/checkout" element={<CheckoutView />} />
                    <Route path="/admin" element={<AdminView />} />
                    
                    {/* Fallback unknown routes to Home */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </main>

                {/* Global Footer */}
                <Footer />

                {/* Cart Slide-out Drawer Overlay */}
                <CartDrawer />

                {/* Quick View Options Slide-over Drawer (Screenshot 1) */}
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
        </OrdersProvider>
      </ProductsProvider>
    </LanguageProvider>
  </ThemeProvider>
  );
}

export default App;
