import React from 'react';
import { SunDisc } from './SunDisc';
import { useLanguage } from '../context/LanguageContext';

export const Footer = ({ setView }) => {
  const { lang, t } = useLanguage();

  return (
    <footer className="bg-stone border-t border-grave pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 3-Col Desktop -> Stacked Mobile Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pb-12 border-b border-grave">
          
          {/* Col 1: Brand & Logo Lockup (Allowed Sun Disc Location #1) */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <SunDisc size={28} variant="gold" />
              <span className="font-clash font-bold text-2xl text-bone uppercase tracking-tight">
                DUAT
              </span>
            </div>
            <p className="font-space text-sm text-ash max-w-sm font-light">
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
              <button
                onClick={() => setView('shop')}
                className="text-left text-bone/80 hover:text-gold transition-colors"
              >
                {t('navShop')}
              </button>
              <button
                onClick={() => setView('customizer')}
                className="text-left text-bone/80 hover:text-gold transition-colors"
              >
                {t('navCustomize')}
              </button>
              <button
                onClick={() => setView('about')}
                className="text-left text-bone/80 hover:text-gold transition-colors"
              >
                {t('navDuat')}
              </button>
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

        {/* Bottom Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 font-mono text-xs text-ash">
          <span>{t('footerRights')}</span>
          <span className="uppercase">Alexandria, Egypt • C.2026</span>
        </div>

      </div>
    </footer>
  );
};
