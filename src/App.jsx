import React, { useState } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';

import { Navbar } from './components/Navbar';
import { CartDrawer } from './components/CartDrawer';
import { Footer } from './components/Footer';
import { ToastContainer } from './components/ToastContainer';
import { ProductModal } from './components/ProductModal';
import { OrderTrackerModal } from './components/OrderTrackerModal';

import { HomeView } from './views/HomeView';
import { ShopView } from './views/ShopView';
import { CustomizerView } from './views/CustomizerView';
import { CheckoutView } from './views/CheckoutView';
import { AboutView } from './views/AboutView';

export function AppContent() {
  const [currentView, setView] = useState('home');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);

  return (
    <div className="min-h-screen bg-void text-bone flex flex-col justify-between selection:bg-gold selection:text-void font-space relative overflow-x-hidden">
      
      {/* Sticky Navigation Bar */}
      <Navbar
        currentView={currentView}
        setView={setView}
        onOpenTracker={() => setIsTrackerOpen(true)}
      />

      {/* Slide-out Cart Drawer */}
      <CartDrawer setView={setView} />

      {/* Product Detail Modal */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        setView={setView}
      />

      {/* Order Tracker Modal */}
      <OrderTrackerModal
        isOpen={isTrackerOpen}
        onClose={() => setIsTrackerOpen(false)}
      />

      {/* Floating Notifications */}
      <ToastContainer />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentView === 'home' && (
          <HomeView
            setView={setView}
            setSelectedCategory={setSelectedCategory}
            onSelectProduct={(product) => setSelectedProduct(product)}
          />
        )}

        {currentView === 'shop' && (
          <ShopView
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            onSelectProduct={(product) => setSelectedProduct(product)}
          />
        )}

        {currentView === 'customizer' && (
          <CustomizerView />
        )}

        {currentView === 'checkout' && (
          <CheckoutView setView={setView} />
        )}

        {currentView === 'about' && (
          <AboutView setView={setView} />
        )}
      </main>

      {/* Footer */}
      <Footer setView={setView} />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <CartProvider>
        <ToastProvider>
          <AppContent />
        </ToastProvider>
      </CartProvider>
    </LanguageProvider>
  );
}
