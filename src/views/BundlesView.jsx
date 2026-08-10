import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useProducts } from '../context/ProductsContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { SunDisc } from '../components/SunDisc';
import { ShoppingBag, Sparkles, Check, ChevronLeft, ChevronRight, Gift, Tag, Zap, ArrowLeft, ArrowRight } from 'lucide-react';

export function BundlesView() {
  const { products = [] } = useProducts();
  const { lang, t, formatPrice } = useLanguage();
  const { addToCart } = useCart();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const isAr = lang === 'ar';
  const isRtl = isAr;
  const ArrowIcon = isRtl ? ChevronLeft : ChevronRight;
  const CtaArrow = isRtl ? ArrowLeft : ArrowRight;

  // Filter bundles from products list
  const bundleProducts = products.filter(p => p && (p.category === 'bundles' || p.id.startsWith('bundle-')));

  const handleAddBundle = (bundle, e) => {
    e.stopPropagation();
    addToCart(bundle, 1, {});
    addToast(
      isAr 
        ? `تمت إضافة ${bundle.nameAr} إلى السلة! 🎉` 
        : `Added ${bundle.nameEn} to cart! 🎉`, 
      'success'
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-12 min-h-screen">
      
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 font-mono text-xs text-ash uppercase tracking-wider">
        <Link to="/" className="hover:text-gold transition-colors">{isAr ? 'الرئيسية' : 'Home'}</Link>
        <ArrowIcon size={12} className="text-grave" />
        <span className="text-gold font-bold">{isAr ? 'البندلز' : 'Bundles'}</span>
      </div>

      {/* Hero Banner Header for Bundles */}
      <div className="relative overflow-hidden bg-coal/90 border border-grave p-8 sm:p-12 card-depth-highlight space-y-6">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold/10 border border-gold/30 text-gold font-mono text-xs uppercase tracking-widest">
            <Gift size={14} />
            <span>{t('bundlesEyebrow')}</span>
          </div>
          <h1 className="font-clash text-4xl sm:text-6xl uppercase text-bone tracking-tight leading-tight">
            {isAr ? 'قسم البندلز الجاهزة 🎁' : 'Ready Sticker Bundles 🎁'}
          </h1>
          <p className="font-space text-sm sm:text-base text-bone/80 leading-relaxed">
            {isAr
              ? 'تجميعات مجهزة من استيكرات الإيبوكسي المجسمة بسعر موفّر وأرخص من الشراء المنفرد لو اشتريت نفس العدد حبة حبة!'
              : 'Pre-packaged sets of raised 3D epoxy stickers at discounted bundle prices compared to buying individually!'}
          </p>
        </div>

        {/* Highlight Perks Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-grave/60 font-mono text-xs text-ash">
          <div className="flex items-center gap-2.5">
            <Tag size={16} className="text-gold flex-shrink-0" />
            <span>{isAr ? 'توفير يصل إلى ١٥٠ ج.م بالبندل' : 'Save up to 150 EGP per bundle'}</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Gift size={16} className="text-gold flex-shrink-0" />
            <span>{isAr ? 'تأتي في علبة هدايا العبور الفاخرة' : 'Includes DUAT luxury gift box'}</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Zap size={16} className="text-gold flex-shrink-0" />
            <span>{isAr ? 'شحن فوري لكل المحافظات' : 'Fast shipping across Egypt'}</span>
          </div>
        </div>
      </div>

      {/* Bundles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {bundleProducts.map((bundle) => {
          const name = isAr ? bundle.nameAr : bundle.nameEn;
          const description = isAr ? bundle.descriptionAr : bundle.descriptionEn;
          const tag = isAr ? bundle.tagAr : bundle.tagEn;
          const specs = isAr ? bundle.specsAr : bundle.specsEn;

          return (
            <div
              key={bundle.id}
              onClick={() => navigate(`/product/${bundle.id}`)}
              className="group bg-stone border border-grave hover:border-gold transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer relative card-depth-highlight"
            >
              {/* Savings Badge Top */}
              {bundle.savings > 0 && (
                <div className="absolute top-3 right-3 z-20 bg-gold text-void font-mono font-bold text-xs uppercase px-3 py-1.5 shadow-lg flex items-center gap-1.5 border border-stone">
                  <Tag size={13} />
                  <span>{isAr ? `توفير ${bundle.savings} ج.م` : `SAVE ${bundle.savings} EGP`}</span>
                </div>
              )}

              {/* Bundle Image Container */}
              <div className="relative aspect-square overflow-hidden bg-void/50 border-b border-grave">
                <img
                  src={bundle.image}
                  alt={name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone via-transparent to-transparent opacity-60" />
              </div>

              {/* Content Body */}
              <div className="p-6 space-y-5 flex-grow flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-gold">
                    <Sparkles size={12} />
                    <span>{tag}</span>
                  </div>

                  <h2 className="font-clash text-2xl uppercase text-bone group-hover:text-gold transition-colors leading-snug">
                    {name}
                  </h2>

                  <p className="font-space text-xs text-bone/70 line-clamp-2 leading-relaxed">
                    {description}
                  </p>

                  {/* Specs Checklist */}
                  {specs && specs.length > 0 && (
                    <ul className="space-y-1.5 pt-2 border-t border-grave/40">
                      {specs.map((spec, i) => (
                        <li key={i} className="flex items-start gap-2 font-space text-[11px] text-ash">
                          <Check size={13} className="text-gold flex-shrink-0 mt-0.5" />
                          <span>{spec}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Pricing & Add Button */}
                <div className="pt-4 border-t border-grave space-y-4">
                  <div className="flex items-baseline justify-between">
                    <div className="flex items-baseline gap-2">
                      <span className="font-mono text-2xl font-bold text-gold">
                        {formatPrice(bundle.price)}
                      </span>
                      {bundle.originalPrice && (
                        <span className="font-mono text-xs text-ash line-through">
                          {formatPrice(bundle.originalPrice)}
                        </span>
                      )}
                    </div>
                    <span className="font-mono text-[10px] text-emerald-400 uppercase tracking-wider font-bold">
                      {isAr ? 'شامل الهدية' : 'Box Included'}
                    </span>
                  </div>

                  <button
                    onClick={(e) => handleAddBundle(bundle, e)}
                    className="w-full btn-primary py-3 px-4 font-mono text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2"
                  >
                    <ShoppingBag size={15} />
                    <span>{isAr ? 'أضف البندل للسلة' : 'ADD BUNDLE TO CART'}</span>
                  </button>
                </div>

              </div>
            </div>
          );
        })}
      </div>

      {/* CTA Box to Sticker Builder */}
      <div className="bg-gradient-to-r from-coal via-stone to-coal border border-gold/40 p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left relative overflow-hidden card-depth-highlight">
        <div className="space-y-3 max-w-2xl relative z-10">
          <span className="font-mono text-xs text-gold uppercase tracking-[0.25em] font-bold">
            {isAr ? 'استيكر خاص على كيفك 🎨' : 'Custom Sticker Builder 🎨'}
          </span>
          <h3 className="font-clash text-2xl sm:text-4xl text-bone uppercase">
            {isAr ? 'عايز تعمل استيكر إيبوكسي مخصوص ليك؟' : 'Want to create a custom sticker?'}
          </h3>
          <p className="font-space text-xs sm:text-sm text-bone/80">
            {isAr
              ? 'ادخل بيلدر الاستيكرات المباشر، اكتب أي اسم أو عبارة أو ارفع صورتك وتصميمك ونعملها لك استيكر إيبوكسي مجسم 3D!'
              : 'Enter the custom sticker builder, enter your text, or upload your image and design for a 3D epoxy dome!'}
          </p>
        </div>

        <Link
          to="/sticker-builder"
          className="btn-primary py-4 px-8 font-mono text-xs font-bold uppercase tracking-widest inline-flex items-center gap-3 whitespace-nowrap shadow-xl"
        >
          <span>{isAr ? 'افتح بيلدر الاستيكرز' : 'OPEN STICKER BUILDER'}</span>
          <CtaArrow size={16} />
        </Link>
      </div>

    </div>
  );
}

export default BundlesView;
