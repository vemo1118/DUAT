import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { SunDisc } from '../components/SunDisc';
import { ArrowRight, ArrowLeft } from 'lucide-react';

export const AboutView = ({ setView }) => {
  const { lang, t } = useLanguage();
  const isRtl = lang === 'ar';
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 min-h-screen">
      
      {/* Single Column Max-Width 640px */}
      <div className="max-w-[640px] mx-auto space-y-12">
        
        {/* Header */}
        <div className="space-y-4 text-center">
          <div className="flex items-center justify-center gap-3 font-mono text-xs uppercase tracking-[0.25em] text-gold">
            <SunDisc size={16} variant="gold" />
            <span>{t('aboutEyebrow')}</span>
          </div>
          
          <h1 className="font-archivo text-5xl sm:text-7xl uppercase text-bone tracking-tight">
            {t('aboutTitle')}
          </h1>
        </div>

        {/* Decorative Sun Disc Graphic */}
        <div className="flex justify-center py-6">
          <SunDisc size={96} variant="eclipse" className="animate-pulse opacity-90" />
        </div>

        {/* Narrative Paragraphs */}
        <div className="space-y-8 text-bone/90 leading-relaxed font-space text-lg sm:text-xl font-light">
          <p className="border-l-2 border-gold pl-6 py-1">
            {t('aboutP1')}
          </p>

          <p className="py-1">
            {t('aboutP2')}
          </p>

          <p className="font-mono text-sm uppercase tracking-widest text-gold font-bold pt-4">
            {t('aboutP3')}
          </p>
        </div>

        {/* End CTA */}
        <div className="pt-8 text-center">
          <button
            onClick={() => setView('customizer')}
            className="btn-primary py-4 px-10 text-sm flex items-center justify-center gap-3 mx-auto group"
          >
            <span>{t('aboutCta')}</span>
            <ArrowIcon size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

      </div>

    </div>
  );
};
