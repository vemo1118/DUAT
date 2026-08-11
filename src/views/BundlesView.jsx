import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useProducts } from '../context/ProductsContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { useBundlesSettings } from '../context/BundlesSettingsContext';
import { ShoppingBag, Sparkles, Check, ChevronLeft, ChevronRight, Gift, Tag, Zap, ArrowLeft, ArrowRight, Package } from 'lucide-react';
import { InteractiveBundleModal } from '../components/InteractiveBundleModal';

// Helper icon component for perk items
const PerkIcon = ({ iconName, size = 16, className = "text-gold flex-shrink-0" }) => {
  switch (iconName) {
    case 'Gift': return <Gift size={size} className={className} />;
    case 'Zap': return <Zap size={size} className={className} />;
    case 'Sparkles': return <Sparkles size={size} className={className} />;
    case 'Check': return <Check size={size} className={className} />;
    case 'ShoppingBag': return <ShoppingBag size={size} className={className} />;
    case 'Tag':
    default:
      return <Tag size={size} className={className} />;
  }
};

export function BundlesView() {
  const { products = [] } = useProducts();
  const { lang, t, formatPrice } = useLanguage();
  const { addToCart } = useCart();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const { heroSettings, ctaSettings, gridSettings } = useBundlesSettings();

  const [activeBundleModal, setActiveBundleModal] = useState(null);

  const isAr = lang === 'ar';
  const isRtl = isAr;
  const ArrowIcon = isRtl ? ChevronLeft : ChevronRight;
  const CtaArrow = isRtl ? ArrowLeft : ArrowRight;

  // Filter bundles from products list & only active products
  const bundleProducts = products.filter(
    (p) => p && (p.category === 'bundles' || (p.id && p.id.startsWith('bundle-'))) && p.is_active !== false && p.isActive !== false
  );

  const handleAddBundle = (bundle, e) => {
    e.stopPropagation();
    setActiveBundleModal(bundle);
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
      {heroSettings?.isActive !== false && (
        <div className="relative overflow-hidden bg-coal/90 border border-grave p-8 sm:p-12 card-depth-highlight space-y-6">
          {heroSettings?.bgImage && (
            <picture className="absolute inset-0 w-full h-full pointer-events-none">
              {heroSettings?.mobileBgImage && (
                <source media="(max-width: 767px)" srcSet={heroSettings.mobileBgImage} />
              )}
              <img
                src={heroSettings.bgImage}
                alt="Bundles Hero Background"
                className="w-full h-full object-cover opacity-35"
              />
            </picture>
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-coal/80 via-coal/90 to-coal pointer-events-none" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 max-w-3xl space-y-4">
            {(heroSettings?.eyebrowAr || heroSettings?.eyebrowEn) && (
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold/10 border border-gold/30 text-gold font-mono text-xs uppercase tracking-widest">
                <Gift size={14} />
                <span>{isAr ? heroSettings.eyebrowAr : heroSettings.eyebrowEn}</span>
              </div>
            )}

            <h1 className="font-clash text-4xl sm:text-6xl uppercase text-bone tracking-tight leading-tight">
              {isAr ? heroSettings?.titleAr : heroSettings?.titleEn}
            </h1>

            <p className="font-space text-sm sm:text-base text-bone/80 leading-relaxed">
              {isAr ? heroSettings?.descAr : heroSettings?.descEn}
            </p>
          </div>

          {/* Highlight Perks Strip */}
          {heroSettings?.showPerks !== false && heroSettings?.perks && heroSettings.perks.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-grave/60 font-mono text-xs text-ash">
              {heroSettings.perks
                .filter((perk) => perk.active !== false)
                .map((perk) => (
                  <div key={perk.id || perk.textEn} className="flex items-center gap-2.5">
                    <PerkIcon iconName={perk.icon} size={16} />
                    <span>{isAr ? perk.textAr : perk.textEn}</span>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}

      {/* Grid Section Header (if defined) */}
      {gridSettings?.titleAr && (
        <div className="flex items-center justify-between border-b border-grave pb-4">
          <div className="flex items-center gap-3">
            <Package size={20} className="text-gold" />
            <h2 className="font-clash text-xl uppercase tracking-wider text-bone">
              {isAr ? gridSettings.titleAr : gridSettings.titleEn}
            </h2>
          </div>
          <span className="font-mono text-xs text-ash">
            ({bundleProducts.length} {isAr ? 'بندل متاح' : 'Bundles Available'})
          </span>
        </div>
      )}

      {/* Bundles Grid */}
      {bundleProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {bundleProducts.map((bundle) => {
            const name = isAr ? bundle.nameAr || bundle.name : bundle.nameEn || bundle.name;
            const description = isAr ? bundle.descriptionAr || bundle.description : bundle.descriptionEn || bundle.description;
            const tag = isAr ? bundle.tagAr || bundle.badge : bundle.tagEn || bundle.badge;
            const specs = isAr ? bundle.specsAr : bundle.specsEn;

            const savingsValue = bundle.savings || (bundle.originalPrice && bundle.price ? bundle.originalPrice - bundle.price : 0);

            return (
              <div
                key={bundle.id}
                onClick={() => navigate(`/product/${bundle.id}`)}
                className="group bg-stone border border-grave hover:border-gold transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer relative card-depth-highlight"
              >
                {/* Savings Badge Top */}
                {savingsValue > 0 && (
                  <div className="absolute top-3 right-3 z-20 bg-gold text-void font-mono font-bold text-xs uppercase px-3 py-1.5 shadow-lg flex items-center gap-1.5 border border-stone">
                    <Tag size={13} />
                    <span>{isAr ? `توفير ${savingsValue} ج.م` : `SAVE ${savingsValue} EGP`}</span>
                  </div>
                )}

                {/* Bundle Image Container */}
                <div className="relative aspect-square overflow-hidden bg-void/50 border-b border-grave">
                  <img
                    src={bundle.image || bundle.imageUrl}
                    alt={name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone via-transparent to-transparent opacity-60" />
                </div>

                {/* Content Body */}
                <div className="p-6 space-y-5 flex-grow flex flex-col justify-between">
                  <div className="space-y-3">
                    {tag && (
                      <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-gold">
                        <Sparkles size={12} />
                        <span>{tag}</span>
                      </div>
                    )}

                    <h2 className="font-clash text-2xl uppercase text-bone group-hover:text-gold transition-colors leading-snug">
                      {name}
                    </h2>

                    {description && (
                      <p className="font-space text-xs text-bone/70 line-clamp-2 leading-relaxed">
                        {description}
                      </p>
                    )}

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
                        {bundle.originalPrice && bundle.originalPrice > bundle.price && (
                          <span className="font-mono text-xs text-ash line-through">
                            {formatPrice(bundle.originalPrice)}
                          </span>
                        )}
                      </div>
                      <span className="font-mono text-[10px] text-emerald-400 uppercase tracking-wider font-bold">
                        {isAr ? (gridSettings?.badgeBoxIncludedAr || 'شامل الهدية') : (gridSettings?.badgeBoxIncludedEn || 'Box Included')}
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
      ) : (
        <div className="p-16 text-center bg-stone border border-grave card-depth-highlight space-y-4">
          <Gift size={48} className="mx-auto text-ash/40" />
          <h3 className="font-clash text-xl uppercase text-bone">
            {isAr ? gridSettings?.emptyMessageAr : gridSettings?.emptyMessageEn}
          </h3>
          <p className="font-space text-xs text-ash">
            {isAr ? 'يمكنك تصفح باقي المنتجات في المتجر' : 'Browse our standard product range in the store'}
          </p>
          <Link to="/shop" className="btn-primary py-2.5 px-6 font-mono text-xs font-bold uppercase tracking-wider inline-block">
            {isAr ? 'الانتقال للمتجر' : 'GO TO SHOP'}
          </Link>
        </div>
      )}

      {/* CTA Box to Sticker Builder */}
      {ctaSettings?.isActive !== false && (
        <div className="bg-gradient-to-r from-coal via-stone to-coal border border-gold/40 p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left relative overflow-hidden card-depth-highlight">
          {ctaSettings?.bgImage && (
            <picture className="absolute inset-0 w-full h-full pointer-events-none">
              {ctaSettings?.mobileBgImage && (
                <source media="(max-width: 767px)" srcSet={ctaSettings.mobileBgImage} />
              )}
              <img
                src={ctaSettings.bgImage}
                alt="CTA Background"
                className="w-full h-full object-cover opacity-25"
              />
            </picture>
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-coal/90 via-stone/90 to-coal/90 pointer-events-none" />
          <div className="space-y-3 max-w-2xl relative z-10">
            {(ctaSettings?.eyebrowAr || ctaSettings?.eyebrowEn) && (
              <span className="font-mono text-xs text-gold uppercase tracking-[0.25em] font-bold block">
                {isAr ? ctaSettings.eyebrowAr : ctaSettings.eyebrowEn}
              </span>
            )}
            <h3 className="font-clash text-2xl sm:text-4xl text-bone uppercase">
              {isAr ? ctaSettings?.titleAr : ctaSettings?.titleEn}
            </h3>
            <p className="font-space text-xs sm:text-sm text-bone/80">
              {isAr ? ctaSettings?.descAr : ctaSettings?.descEn}
            </p>
          </div>

          <Link
            to={ctaSettings?.buttonLink || '/sticker-builder'}
            className="btn-primary py-4 px-8 font-mono text-xs font-bold uppercase tracking-widest inline-flex items-center gap-3 whitespace-nowrap shadow-xl"
          >
            <span>{isAr ? ctaSettings?.buttonTextAr : ctaSettings?.buttonTextEn}</span>
            <CtaArrow size={16} />
          </Link>
        </div>
      )}

      {/* Interactive Bundle Configurator Modal */}
      <InteractiveBundleModal
        bundle={activeBundleModal}
        isOpen={!!activeBundleModal}
        onClose={() => setActiveBundleModal(null)}
      />

    </div>
  );
}

export default BundlesView;
