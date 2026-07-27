import React from 'react';
import { SunDisc } from './SunDisc';
import { useLanguage } from '../context/LanguageContext';

export const Footer = ({ setView }) => {
  const { t } = useLanguage();

  return (
    <footer className="bg-void border-t border-grave pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-grave">
          
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <SunDisc size={32} />
              <span className="font-archivo text-3xl uppercase tracking-tighter text-bone">
                {t('footerBrand')}
              </span>
            </div>
            <p className="font-mono text-xs uppercase tracking-widest text-ash max-w-sm">
              {t('footerTagline')}
            </p>
            <p className="font-mono text-xs text-ash/80">
              {t('footerLocation')}
            </p>
          </div>

          {/* Quick Views Navigation */}
          <div className="space-y-3">
            <h4 className="font-mono text-xs font-bold uppercase tracking-widest text-gold">
              Navigation
            </h4>
            <ul className="space-y-2 font-mono text-xs text-bone/80 uppercase">
              <li>
                <button onClick={() => setView('shop')} className="hover:text-gold transition-colors">
                  {t('navShop')}
                </button>
              </li>
              <li>
                <button onClick={() => setView('customizer')} className="hover:text-gold transition-colors">
                  {t('navCustomize')}
                </button>
              </li>
              <li>
                <button onClick={() => setView('about')} className="hover:text-gold transition-colors">
                  {t('navDuat')}
                </button>
              </li>
            </ul>
          </div>

          {/* Socials & Contact */}
          <div className="space-y-3">
            <h4 className="font-mono text-xs font-bold uppercase tracking-widest text-gold">
              Social
            </h4>
            <p className="font-mono text-xs text-bone/80">
              {t('footerSocial')}
            </p>
          </div>

        </div>

        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 font-mono text-[11px] uppercase tracking-wider text-ash">
          <span>{t('footerRights')}</span>
          <span>MADE IN ALEXANDRIA, EGYPT</span>
        </div>
      </div>
    </footer>
  );
};
