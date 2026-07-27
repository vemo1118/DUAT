import React, { useState } from 'react';
import { ShoppingBag, Menu, X, Package } from 'lucide-react';
import { SunDisc } from './SunDisc';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';

export const Navbar = ({ currentView, setView, onOpenTracker }) => {
  const { lang, toggleLanguage, t } = useLanguage();
  const { cartCount, openCart } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'shop', label: t('navShop'), isGold: false },
    { id: 'customizer', label: t('navCustomize'), isGold: true },
    { id: 'about', label: t('navDuat'), isGold: false },
  ];

  const handleNavClick = (viewId) => {
    setView(viewId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-void/95 backdrop-blur-md border-b border-grave">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Left: Brand mark + DUAT wordmark */}
        <button
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-3 group focus:outline-none"
          aria-label="DUAT Home"
        >
          <SunDisc size={26} className="group-hover:scale-105 transition-transform" />
          <span className="font-archivo text-2xl sm:text-3xl text-bone tracking-tighter uppercase group-hover:text-gold transition-colors">
            DUAT
          </span>
        </button>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8" aria-label="Main Navigation">
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`text-sm tracking-widest font-mono uppercase transition-colors px-3 py-1.5 border border-transparent ${
                  item.isGold
                    ? 'text-gold border-gold/40 hover:border-gold hover:text-ember bg-gold/5'
                    : isActive
                    ? 'text-gold border-b-gold'
                    : 'text-bone/80 hover:text-gold'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right: Language Toggle, Order Tracker & Cart Trigger */}
        <div className="flex items-center gap-3 sm:gap-5">
          
          {/* Order Tracker Modal Trigger */}
          <button
            onClick={onOpenTracker}
            className="hidden sm:flex items-center gap-1.5 text-xs font-mono tracking-widest uppercase text-ash hover:text-gold border border-grave px-2.5 py-1.5 transition-colors"
            title={t('trackOrderNav')}
          >
            <Package size={14} />
            <span>{t('trackOrderNav')}</span>
          </button>

          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="text-xs font-mono tracking-widest uppercase text-ash hover:text-bone border border-grave px-2.5 py-1.5 transition-colors"
            aria-label={`Switch language to ${lang === 'en' ? 'Arabic' : 'English'}`}
          >
            <span className={lang === 'en' ? 'text-gold font-bold' : ''}>EN</span>
            <span className="mx-1 text-grave">|</span>
            <span className={lang === 'ar' ? 'text-gold font-bold' : ''}>AR</span>
          </button>

          {/* Cart Icon Trigger */}
          <button
            onClick={openCart}
            className="relative p-2 text-bone hover:text-gold transition-colors border border-grave bg-coal/50"
            aria-label={t('cartTitle')}
          >
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-gold text-void font-mono font-bold text-[10px] w-5 h-5 flex items-center justify-center border border-void">
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-bone hover:text-gold border border-grave"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-stone border-b border-grave px-4 pt-4 pb-6 space-y-3 animate-in slide-in-from-top duration-200">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`block w-full text-left font-mono tracking-widest uppercase text-base py-3 px-4 border ${
                item.isGold
                  ? 'border-gold text-gold bg-gold/10'
                  : currentView === item.id
                  ? 'border-gold text-gold'
                  : 'border-grave text-bone/90 hover:border-gold'
              }`}
            >
              {item.label}
            </button>
          ))}

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenTracker();
            }}
            className="block w-full text-left font-mono tracking-widest uppercase text-base py-3 px-4 border border-grave text-gold"
          >
            {t('trackOrderNav')}
          </button>
        </div>
      )}
    </header>
  );
};
