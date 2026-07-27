import React, { useState } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomeView } from './views/HomeView';
import { ShopView } from './views/ShopView';
import { CustomizerView } from './views/CustomizerView';
import { AboutView } from './views/AboutView';
import { CheckoutView } from './views/CheckoutView';
import { CartDrawer } from './components/CartDrawer';
import { ProductModal } from './components/ProductModal';
import { OrderTrackerModal } from './components/OrderTrackerModal';
import { ToastContainer } from './components/ToastContainer';
import { LanguageProvider } from './context/LanguageContext';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';

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

  return (
    <LanguageProvider>
      <CartProvider>
        <ToastProvider>
          {/* Main Container with Filmic Grain Texture Overlay */}
          <div className="min-h-screen bg-transparent text-bone flex flex-col font-space selection:bg-gold selection:text-void relative bg-noise">
            
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
                <Route path="/customizer" element={<CustomizerView />} />
                <Route path="/customize" element={<Navigate to="/customizer" replace />} />
                <Route path="/about" element={<AboutView />} />
                <Route path="/checkout" element={<CheckoutView />} />
                {/* Fallback unknown routes to Home */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>

            {/* Global Footer */}
            <Footer />

            {/* Cart Slide-out Drawer Overlay */}
            <CartDrawer />

            {/* Product Quick View Specs Modal */}
            <ProductModal
              product={selectedProduct}
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
    </LanguageProvider>
  );
}

export default App;
