import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { SunDisc } from './SunDisc';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { ShoppingBag, Globe, Menu, X, Package } from 'lucide-react';

export const Navbar = ({ onOpenTracker }) => {
  const { lang, toggleLanguage, t } = useLanguage();
  const { totalItems, openCart } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navLinks = [
    { path: '/', labelEn: 'Home', labelAr: 'الرئيسية' },
    { path: '/shop', labelEn: t('navShop'), labelAr: t('navShop') },
    { path: '/customizer', labelEn: t('navCustomize'), labelAr: t('navCustomize') },
    { path: '/about', labelEn: t('navDuat'), labelAr: t('navDuat') }
  ];

  const handleNavClick = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 bg-void/95 backdrop-blur-md border-b border-grave">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Lockup */}
          <NavLink
            to="/"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-3 text-bone hover:text-gold transition-colors focus:outline-none"
          >
            <SunDisc size={26} variant="gold" />
            <span className="font-clash font-bold text-2xl tracking-tight text-bone">
              DUAT
            </span>
          </NavLink>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 font-space text-sm font-medium">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.path === '/'}
                className={({ isActive }) =>
                  `transition-colors py-2 border-b-2 font-space ${
                    isActive
                      ? 'border-gold text-gold font-bold'
                      : 'border-transparent text-bone/80 hover:text-gold'
                  }`
                }
              >
                {lang === 'ar' ? link.labelAr : link.labelEn}
              </NavLink>
            ))}
          </nav>

          {/* Right Actions Bar */}
          <div className="flex items-center gap-3 sm:gap-4">
            
            {/* Track Order Trigger */}
            <button
              onClick={onOpenTracker}
              className="hidden sm:flex items-center gap-1.5 font-mono text-xs text-ash hover:text-gold transition-colors py-2 px-2.5 min-h-[44px]"
              title={t('trackOrderNav')}
            >
              <Package size={16} />
              <span>{t('trackOrderNav')}</span>
            </button>

            {/* Language Toggle (Desktop) */}
            <button
              onClick={toggleLanguage}
              className="hidden md:flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-ash hover:text-gold border border-grave px-3 py-2 min-h-[44px] transition-colors"
            >
              <Globe size={14} />
              <span>{lang === 'en' ? 'AR' : 'EN'}</span>
            </button>

            {/* Cart Drawer Trigger */}
            <button
              onClick={openCart}
              className="relative p-2.5 text-bone hover:text-gold transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center border border-grave bg-stone/50 hover:border-gold"
              aria-label="Open Cart"
            >
              <ShoppingBag size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-gold text-void font-mono font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center shadow-md">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 text-bone hover:text-gold transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center border border-grave bg-stone/50"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

          </div>

        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-stone border-b border-grave px-4 pt-4 pb-6 space-y-4 animate-in slide-in-from-top duration-200">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.path === '/'}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `text-left py-3 px-4 text-base font-space font-medium border-l-2 transition-all min-h-[44px] flex items-center ${
                    isActive
                      ? 'border-gold bg-coal text-gold font-bold'
                      : 'border-transparent text-bone hover:bg-coal hover:text-gold'
                  }`
                }
              >
                {lang === 'ar' ? link.labelAr : link.labelEn}
              </NavLink>
            ))}
          </div>

          <div className="pt-3 border-t border-grave flex items-center justify-between px-4">
            <button
              onClick={onOpenTracker}
              className="font-mono text-xs text-ash hover:text-gold flex items-center gap-2 min-h-[44px]"
            >
              <Package size={16} />
              <span>{t('trackOrderNav')}</span>
            </button>

            <button
              onClick={() => {
                toggleLanguage();
                setMobileMenuOpen(false);
              }}
              className="font-mono text-xs uppercase tracking-widest text-gold border border-gold px-4 py-2 flex items-center gap-2 min-h-[44px]"
            >
              <Globe size={14} />
              <span>{lang === 'en' ? 'اللغة العربية (AR)' : 'ENGLISH (EN)'}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
