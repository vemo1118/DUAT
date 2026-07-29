import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SunDisc } from '../components/SunDisc';
import { useLanguage } from '../context/LanguageContext';

export const AboutView = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 space-y-16">
      
      {/* Header */}
      <div className="space-y-4 text-center reveal-on-scroll">
        <div className="flex items-center justify-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-ash">
          <SunDisc size={14} variant="gold" />
          <span>{t('aboutEyebrow')}</span>
        </div>
        <h1 className="font-clash text-4xl sm:text-6xl lg:text-7xl uppercase text-bone tracking-tight">
          {t('aboutTitle')}
        </h1>
      </div>

      {/* Story Narrative Box */}
      <div className="bg-stone border border-grave p-8 sm:p-14 space-y-8 font-space text-lg text-bone/90 font-light leading-relaxed card-depth-highlight reveal-on-scroll">
        <p className="text-xl sm:text-2xl font-medium text-bone leading-relaxed">
          {t('aboutP1')}
        </p>
        <p className="text-bone/85 font-light leading-relaxed">
          {t('aboutP2')}
        </p>
        
        <div className="p-6 bg-coal border-l-4 border-gold text-gold font-mono text-xs sm:text-sm tracking-widest uppercase">
          {t('aboutP3')}
        </div>
      </div>

      {/* CTA */}
      <div className="flex justify-center pt-4 reveal-on-scroll">
        <button
          onClick={() => navigate('/customize')}
          className="btn-primary py-4 px-10 text-sm font-mono tracking-widest min-h-[44px]"
        >
          {t('aboutCta')}
        </button>
      </div>

    </div>
  );
};
