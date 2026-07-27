import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SunDisc } from '../components/SunDisc';
import { useLanguage } from '../context/LanguageContext';

export const AboutView = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      
      {/* Header */}
      <div className="space-y-4 text-center">
        <div className="flex items-center justify-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-ash">
          <SunDisc size={12} variant="gold" />
          <span>{t('aboutEyebrow')}</span>
        </div>
        <h1 className="font-clash text-5xl sm:text-7xl uppercase text-bone tracking-tight">
          {t('aboutTitle')}
        </h1>
      </div>

      {/* Story Narrative Box */}
      <div className="bg-stone border border-grave p-8 sm:p-12 space-y-8 font-space text-lg text-bone/90 font-light leading-relaxed">
        <p>{t('aboutP1')}</p>
        <p>{t('aboutP2')}</p>
        
        <div className="p-6 bg-coal border-l-4 border-gold text-gold font-mono text-sm tracking-widest uppercase">
          {t('aboutP3')}
        </div>
      </div>

      {/* CTA */}
      <div className="flex justify-center pt-4">
        <button
          onClick={() => navigate('/customizer')}
          className="btn-primary py-4 px-10 text-sm font-mono tracking-widest min-h-[44px]"
        >
          {t('aboutCta')}
        </button>
      </div>

    </div>
  );
};
