import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { SunDisc } from './SunDisc';
import { ShoppingBag, Menu, X, Globe, Truck } from 'lucide-react';

export const Navbar = ({ onOpenTracker }) => {
  const { lang, toggleLanguage, t } = useLanguage();
  const { totalItems, toggleCart } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navLinks = [
    { path: '/shop', label: t('navShop') },
    { path: '/customizer', label: t('navCustomize') },
    { path: '/about', label: t('navDuat') }
  ];

  return (
    <header className="sticky top-0 z-40 bg-void/90 backdrop-blur-md border-b border-grave">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* LOGO LOCKUP LEFT: Abstract SunDisc + DUAT Typography */}
          <Link to="/" className="flex items-center gap-3 group focus:outline-none min-h-[44px]">
            <SunDisc size={22} variant="gold" />
            <div className="flex flex-col">
              <span className="font-clash text-2xl tracking-tight text-bone group-hover:text-gold transition-colors leading-none">
                DUAT
              </span>
              <span className="font-mono text-[9px] tracking-[0.2em] text-ash uppercase leading-none mt-1">
                ALEXANDRIA
              </span>
            </div>
          </Link>

          {/* DESKTOP NAVIGATION LINKS CENTER (MD+) */}
          <nav className="hidden md:flex items-center space-x-8 lg:space-x-12 rtl:space-x-reverse">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `font-mono text-xs uppercase tracking-[0.2em] transition-colors py-2 min-h-[44px] flex items-center ${
                    isActive ? 'text-gold font-bold' : 'text-bone/80 hover:text-gold'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* RIGHT ACTIONS: TRACKER, BILINGUAL TOGGLE & CART */}
          <div className="flex items-center gap-3 sm:gap-4">
            
            {/* Shipment Order Tracker Button */}
            <button
              onClick={onOpenTracker}
              className="hidden sm:flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-ash hover:text-gold transition-colors border border-grave px-3 py-2 min-h-[44px]"
              title={t('trackOrderNav')}
            >
              <Truck size={14} className="text-gold" />
              <span>{t('trackOrderNav')}</span>
            </button>

            {/* Bilingual Toggle EN / AR (Desktop) */}
            <button
              onClick={toggleLanguage}
              className="hidden md:flex items-center gap-1.5 font-mono text-xs tracking-widest text-ash hover:text-gold border border-grave px-3 py-2 transition-colors uppercase min-h-[44px]"
              aria-label="Toggle Language"
            >
              <Globe size={14} className="text-gold" />
              <span>{lang === 'en' ? 'عربي' : 'EN'}</span>
            </button>

            {/* Cart Icon Trigger */}
            <button
              onClick={toggleCart}
              className="relative p-2.5 text-bone hover:text-gold transition-colors border border-grave bg-stone hover:border-gold flex items-center justify-center min-h-[44px] min-w-[44px]"
              aria-label="Open Shopping Cart"
            >
              <ShoppingBag size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-gold text-void font-mono font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center border border-void">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Mobile Hamburger Trigger (<768px) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 text-bone hover:text-gold border border-grave bg-stone flex items-center justify-center min-h-[44px] min-w-[44px]"
              aria-label="Toggle Mobile Menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

          </div>

        </div>
      </div>

      {/* MOBILE DRAWER NAVIGATION MENU (<768px) */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-stone border-b border-grave px-4 pt-4 pb-6 space-y-4 animate-in slide-in-from-top duration-200">
          <nav className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `font-mono text-sm uppercase tracking-widest py-3 border-b border-grave/40 min-h-[44px] flex items-center ${
                    isActive ? 'text-gold font-bold' : 'text-bone hover:text-gold'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}

            <button
              onClick={() => {
                onOpenTracker();
                setMobileMenuOpen(false);
              }}
              className="font-mono text-sm uppercase tracking-widest py-3 text-ash hover:text-gold flex items-center gap-2 border-b border-grave/40 min-h-[44px]"
            >
              <Truck size={16} className="text-gold" />
              <span>{t('trackOrderNav')}</span>
            </button>

            {/* Mobile Bilingual Toggle */}
            <div className="pt-2 flex justify-between items-center">
              <span className="font-mono text-xs text-ash uppercase">Language:</span>
              <button
                onClick={() => {
                  toggleLanguage();
                  setMobileMenuOpen(false);
                }}
                className="font-mono text-xs font-bold uppercase text-gold border border-gold px-4 py-2 flex items-center gap-2 min-h-[44px]"
              >
                <Globe size={14} />
                <span>{lang === 'en' ? 'التحويل للعربية' : 'Switch to English'}</span>
              </button>
            </div>

          </nav>
        </div>
      )}
    </header>
  );
};
