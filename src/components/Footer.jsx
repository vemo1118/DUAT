import React from 'react';
import { Link } from 'react-router-dom';
import { SunDisc } from './SunDisc';
import { useLanguage } from '../context/LanguageContext';

export const Footer = () => {
  const { lang, t } = useLanguage();

  return (
    <footer className="bg-stone border-t border-grave pt-24 pb-16 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 3-Col Desktop -> Stacked Mobile Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pb-16 border-b border-grave/60">
          
          {/* Col 1: Brand & Logo Lockup */}
          <div className="space-y-4">
            <Link
              to="/"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center gap-3.5 min-h-[44px]"
            >
              <SunDisc size={30} variant="gold" />
              <span className="font-clash text-2xl text-bone uppercase tracking-tight">
                DUAT
              </span>
            </Link>
            <p className="font-space text-sm text-ash max-w-sm font-light leading-relaxed">
              {t('footerTagline')}
            </p>
            <span className="font-mono text-xs text-ash block uppercase">
              {t('footerLocation')}
            </span>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-3 font-space text-sm">
            <h4 className="font-mono text-xs uppercase tracking-widest text-gold font-bold">
              NAVIGATION
            </h4>
            <div className="flex flex-col space-y-2">
              <Link
                to="/shop"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="text-left text-bone/80 hover:text-gold transition-colors py-1"
              >
                {t('navShop')}
              </Link>
              <Link
                to="/customize"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="text-left text-bone/80 hover:text-gold transition-colors py-1"
              >
                {t('navCustomize')}
              </Link>
              <Link
                to="/the-duat"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="text-left text-bone/80 hover:text-gold transition-colors py-1"
              >
                {t('navDuat')}
              </Link>
              <Link
                to="/track-order"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="text-left text-bone/80 hover:text-gold transition-colors py-1"
              >
                {t('trackOrderNav')}
              </Link>
            </div>
          </div>

          {/* Col 3: Social & Support */}
          <div className="space-y-3 font-mono text-xs">
            <h4 className="uppercase tracking-widest text-gold font-bold">
              CONNECT
            </h4>
            <p className="text-ash">{t('footerSocial')}</p>
            <p className="text-ash">Support: WhatsApp +20 100 000 0000</p>
          </div>

        </div>

        {/* Bottom Copyright & Admin Entrance */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 font-mono text-xs text-ash">
          <span>{t('footerRights')}</span>
          <div className="flex items-center gap-4">
            <span className="uppercase">{lang === 'ar' ? 'مصر • ٢٠٢٦' : 'Egypt • C.2026'}</span>
            <Link to="/admin" className="hover:text-gold transition-colors flex items-center gap-1 opacity-75 hover:opacity-100">
              <span>🔒 {lang === 'ar' ? 'إدارة المتجر' : 'Admin'}</span>
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
};
