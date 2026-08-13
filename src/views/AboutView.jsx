import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SunDisc } from '../components/SunDisc';
import { StickerIcon } from '../components/StickerIcon';
import { useLanguage } from '../context/LanguageContext';
import { Check, ArrowRight, ArrowLeft, Sparkles, ShoppingBag } from 'lucide-react';

export const AboutView = () => {
  const { lang, t } = useLanguage();
  const isAr = lang === 'ar';
  const isRtl = isAr;
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;
  const navigate = useNavigate();

  const craftItems = [
    { nameKey: 'aboutCraft1Name', bodyKey: 'aboutCraft1Body', badge: '01' },
    { nameKey: 'aboutCraft2Name', bodyKey: 'aboutCraft2Body', badge: '02' },
    { nameKey: 'aboutCraft3Name', bodyKey: 'aboutCraft3Body', badge: '03' }
  ];

  const passageStages = [
    { titleKey: 'aboutStage1Title', bodyKey: 'aboutStage1Body', motif: 'crescent' },
    { titleKey: 'aboutStage2Title', bodyKey: 'aboutStage2Body', motif: 'ring' },
    { titleKey: 'aboutStage3Title', bodyKey: 'aboutStage3Body', motif: 'arrow-up' },
    { titleKey: 'aboutStage4Title', bodyKey: 'aboutStage4Body', motif: 'sun-disc' }
  ];

  const promiseKeys = [
    'aboutPromise1',
    'aboutPromise2',
    'aboutPromise3',
    'aboutPromise4'
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 space-y-20 sm:space-y-28">
      
      {/* 1. THE MYTH */}
      <section className="space-y-8 reveal-on-scroll">
        <div className="space-y-4 text-center sm:text-left rtl:sm:text-right">
          <div className="flex items-center justify-center sm:justify-start rtl:sm:justify-start gap-2 font-mono text-xs uppercase tracking-[0.25em] text-ash">
            <SunDisc size={14} variant="gold" />
            <span>{t('aboutEyebrow')}</span>
          </div>
          <h1 className="font-clash text-4xl sm:text-6xl lg:text-7xl uppercase text-bone tracking-tight font-bold">
            {t('aboutTitle')}
          </h1>
        </div>

        <p className="font-space text-xl sm:text-2xl text-bone font-medium leading-relaxed max-w-3xl">
          {t('aboutMythLead')}
        </p>

        <div className="bg-stone border border-grave p-6 sm:p-8 space-y-4 card-depth-highlight">
          <p className="font-space text-base sm:text-lg text-bone/90 font-medium leading-relaxed">
            {t('aboutP1')}
          </p>
          <p className="font-space text-base sm:text-lg text-bone/90 font-medium leading-relaxed">
            {t('aboutP2')}
          </p>
        </div>
      </section>

      {/* 2. BORN IN EGYPT */}
      <section className="space-y-6 reveal-on-scroll">
        <div className="border-l-2 border-gold pl-4 rtl:pl-0 rtl:pr-4 rtl:border-l-0 rtl:border-r-2">
          <h2 className="font-clash text-3xl sm:text-4xl uppercase text-bone font-bold">
            {t('aboutOriginTitle')}
          </h2>
        </div>
        <p className="font-space text-base sm:text-lg text-bone/90 font-medium leading-relaxed max-w-3xl">
          {t('aboutOriginBody')}
        </p>
      </section>

      {/* 3. THE CRAFT */}
      <section className="space-y-8 reveal-on-scroll">
        <div className="border-b border-grave pb-4">
          <h2 className="font-clash text-3xl sm:text-4xl uppercase text-bone font-bold">
            {t('aboutCraftTitle')}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {craftItems.map((item, idx) => (
            <div
              key={idx}
              className="bg-stone border border-grave p-6 space-y-3 card-depth-highlight flex flex-col justify-between"
            >
              <div className="space-y-3">
                <span className="font-mono text-xs text-gold font-bold bg-coal border border-grave px-2.5 py-1 inline-block">
                  {item.badge}
                </span>
                <h3 className="font-clash text-xl text-bone font-bold uppercase">
                  {t(item.nameKey)}
                </h3>
                <p className="font-space text-sm text-bone/80 font-medium leading-relaxed">
                  {t(item.bodyKey)}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="p-6 bg-coal border-l-4 border-gold text-gold font-mono text-xs sm:text-sm tracking-widest uppercase">
          {t('aboutCraftFootnote')}
        </div>
      </section>

      {/* 4. THE PASSAGE */}
      <section className="space-y-8 reveal-on-scroll">
        <div className="space-y-2 border-b border-grave pb-4">
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-ash">
            <SunDisc size={14} variant="gold" />
            <span>{t('aboutSymbolsEyebrow')}</span>
          </div>
          <h2 className="font-clash text-3xl sm:text-4xl uppercase text-bone font-bold">
            {t('aboutSymbolsTitle')}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {passageStages.map((stage, idx) => (
            <div
              key={idx}
              className="bg-stone border border-grave p-6 space-y-4 card-depth-highlight flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-full bg-coal border border-grave flex items-center justify-center text-gold">
                  {stage.motif === 'sun-disc' ? (
                    <SunDisc size={24} variant="gold" />
                  ) : (
                    <StickerIcon stickerId={stage.motif} size={24} />
                  )}
                </div>
                <h3 className="font-clash text-xl text-bone font-bold uppercase pt-1">
                  {t(stage.titleKey)}
                </h3>
                <p className="font-space text-sm text-bone/80 font-medium leading-relaxed">
                  {t(stage.bodyKey)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. THE PROMISE */}
      <section className="space-y-8 reveal-on-scroll">
        <div className="border-b border-grave pb-4">
          <h2 className="font-clash text-3xl sm:text-4xl uppercase text-bone font-bold">
            {t('aboutPromiseTitle')}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {promiseKeys.map((pKey, idx) => (
            <div
              key={idx}
              className="bg-stone border border-grave p-5 flex items-center gap-4 card-depth-highlight"
            >
              <div className="w-8 h-8 rounded-full bg-gold/10 border border-gold/40 flex items-center justify-center flex-shrink-0 text-gold">
                <Check size={16} />
              </div>
              <span className="font-space text-base text-bone font-medium">
                {t(pKey)}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 6. CLOSING CTA */}
      <section className="space-y-8 text-center pt-8 border-t border-grave reveal-on-scroll">
        <p className="font-space text-lg sm:text-xl text-bone font-medium leading-relaxed max-w-2xl mx-auto">
          {t('aboutClosingLine')}
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <button
            onClick={() => navigate('/sticker-builder')}
            className="btn-primary w-full sm:w-auto py-4 px-8 text-xs font-mono font-bold tracking-widest flex items-center justify-center gap-3 min-h-[48px]"
          >
            <Sparkles size={16} />
            <span>{t('aboutCta')}</span>
            <ArrowIcon size={16} />
          </button>
          
          <button
            onClick={() => navigate('/shop')}
            className="btn-ghost w-full sm:w-auto py-4 px-8 text-xs font-mono font-bold tracking-widest flex items-center justify-center gap-3 min-h-[48px]"
          >
            <ShoppingBag size={16} />
            <span>{t('aboutCtaSecondary')}</span>
          </button>
        </div>
      </section>

    </div>
  );
};

export default AboutView;
