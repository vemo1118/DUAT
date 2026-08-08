import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useTheme } from '../context/ThemeContext';
import { SunDisc } from './SunDisc';
import { ShoppingBag, Menu, X, Globe, Truck, Sun, Moon, Heart } from 'lucide-react';

export const Navbar = ({ onOpenTracker }) => {
  const { lang, toggleLanguage, t } = useLanguage();
  const { totalItems, toggleCart } = useCart();
  const { wishlistCount, toggleWishlist } = useWishlist();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navLinks = [
    { path: '/', label: lang === 'ar' ? 'الرئيسية' : 'Home', end: true },
    { path: '/shop', label: t('navShop') },
    { path: '/customize', label: t('navCustomize') },
    { path: '/the-duat', label: t('navDuat') }
  ];

  const handleTrackerClick = () => {
    navigate('/track-order');
    if (onOpenTracker) onOpenTracker();
  };

  return (
    <header className="sticky top-0 z-40 bg-void/90 backdrop-blur-md border-b border-grave transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* LOGO LOCKUP: SunDisc + DUAT Typography (Left in LTR, Right in RTL) */}
          <Link to="/" className="flex items-center gap-3 group focus:outline-none min-h-[44px]">
            <SunDisc size={28} variant="gold" />
            <span className="font-clash text-2xl font-bold tracking-tight text-bone group-hover:text-gold transition-colors leading-none">
              DUAT
            </span>
          </Link>

          {/* DESKTOP NAVIGATION LINKS CENTER (MD+) */}
          <nav className="hidden md:flex items-center gap-8 lg:gap-12">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.end}
                className={({ isActive }) =>
                  `font-mono text-xs uppercase tracking-[0.2em] transition-all duration-200 py-2 min-h-[44px] flex items-center relative group ${
                    isActive ? 'text-gold font-bold' : 'text-bone/80 hover:text-gold'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span>{link.label}</span>
                    <span className={`absolute bottom-3 left-0 w-full h-[1.5px] bg-gold transition-transform duration-300 origin-left ${
                      isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                    }`} />
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* RIGHT / LEFT ACTIONS (RTL-BALANCED): TRACKER, THEME, BILINGUAL TOGGLE & CART */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Shipment Order Tracker Button */}
            <button
              onClick={handleTrackerClick}
              className="hidden sm:flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-ash hover:text-gold transition-colors border border-grave bg-stone/50 px-3 py-2 min-h-[44px]"
              title={t('trackOrderNav')}
            >
              <Truck size={14} className="text-gold" />
              <span>{t('trackOrderNav')}</span>
            </button>

            {/* Theme Toggle (Night / Dawn) */}
            <button
              onClick={toggleTheme}
              className="flex items-center gap-1.5 font-mono text-xs text-ash hover:text-gold border border-grave bg-stone px-2.5 sm:px-3 py-2 transition-colors uppercase min-h-[44px] min-w-[44px] justify-center"
              aria-label="Toggle Theme"
              title={theme === 'night' ? 'Dawn Mode (Sunrise)' : 'Night Mode (Dusk)'}
            >
              {theme === 'night' ? (
                <Sun size={15} className="text-gold" />
              ) : (
                <Moon size={15} className="text-gold" />
              )}
              <span className="hidden lg:inline text-[11px]">
                {theme === 'night' ? 'Dawn' : 'Night'}
              </span>
            </button>

            {/* Bilingual Toggle EN / AR */}
            <button
              onClick={toggleLanguage}
              className="hidden md:flex items-center gap-1.5 font-mono text-xs tracking-widest text-ash hover:text-gold border border-grave bg-stone px-3 py-2 transition-colors uppercase min-h-[44px]"
              aria-label="Toggle Language"
            >
              <Globe size={14} className="text-gold" />
              <span className={lang === 'en' ? 'font-arabic font-bold text-xs tracking-normal' : 'font-mono text-xs'}>
                {lang === 'en' ? 'عربي' : 'EN'}
              </span>
            </button>

            {/* Wishlist Icon Trigger */}
            <button
              onClick={toggleWishlist}
              className="relative p-2.5 text-bone hover:text-gold transition-colors border border-grave bg-stone hover:border-gold flex items-center justify-center min-h-[44px] min-w-[44px]"
              aria-label="Open Wishlist"
              title={lang === 'ar' ? 'المفضلة' : 'Wishlist'}
            >
              <Heart size={18} className={wishlistCount > 0 ? 'text-gold fill-gold/20' : ''} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-gold text-[#050505] font-mono font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center border border-stone shadow-sm">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Icon Trigger */}
            <button
              onClick={toggleCart}
              className="relative p-2.5 text-bone hover:text-gold transition-colors border border-grave bg-stone hover:border-gold flex items-center justify-center min-h-[44px] min-w-[44px]"
              aria-label="Open Shopping Cart"
            >
              <ShoppingBag size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-gold text-[#050505] font-mono font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center border border-stone shadow-sm">
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
                handleTrackerClick();
                setMobileMenuOpen(false);
              }}
              className="font-mono text-sm uppercase tracking-widest py-3 text-ash hover:text-gold flex items-center gap-2 border-b border-grave/40 min-h-[44px]"
            >
              <Truck size={16} className="text-gold" />
              <span>{t('trackOrderNav')}</span>
            </button>

            {/* Mobile Toggles: Language & Theme */}
            <div className="pt-3 flex items-center justify-between gap-3">
              <button
                onClick={() => {
                  toggleTheme();
                }}
                className="flex-1 font-mono text-xs uppercase text-bone border border-grave bg-coal py-2.5 flex items-center justify-center gap-2 min-h-[44px]"
              >
                {theme === 'night' ? <Sun size={14} className="text-gold" /> : <Moon size={14} className="text-gold" />}
                <span>{theme === 'night' ? 'Dawn Mode' : 'Night Mode'}</span>
              </button>

              <button
                onClick={() => {
                  toggleLanguage();
                  setMobileMenuOpen(false);
                }}
                className="flex-1 font-mono text-xs font-bold uppercase text-gold border border-gold bg-gold/10 py-2.5 flex items-center justify-center gap-2 min-h-[44px]"
              >
                <Globe size={14} />
                <span className={lang === 'en' ? 'font-arabic font-bold text-sm tracking-normal' : 'font-mono text-xs'}>
                  {lang === 'en' ? 'عربي' : 'English'}
                </span>
              </button>
            </div>

          </nav>
        </div>
      )}
    </header>
  );
};
