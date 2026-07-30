import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { X, ShoppingBag, Sparkles, Star, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import { CaseGraphic } from './CaseGraphic';

export const ProductModal = ({ product, onClose }) => {
  const { lang, t, formatPrice } = useLanguage();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();

  if (!product) return null;

  const isAr = lang === 'ar';
  const name = isAr ? product.nameAr : product.nameEn;
  const description = isAr ? product.descriptionAr : product.descriptionEn;
  const tag = isAr ? product.tagAr : product.tagEn;
  const craftTag = isAr ? product.craftTagAr : product.craftTagEn;
  const specs = isAr ? product.specsAr : product.specsEn;

  const handleAddToCart = () => {
    addToCart(product);
    showToast(t('itemAddedToast'), 'success');
  };

  const handleCustomize = () => {
    onClose();
    navigate('/customizer', { state: { preselectedCaseTypeId: product.caseTypeId || 'clear' } });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-void/85 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-stone border border-grave w-full max-w-3xl overflow-hidden shadow-2xl relative flex flex-col md:flex-row my-8 card-depth-highlight">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 text-ash hover:text-bone bg-coal border border-grave transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        {/* Visual Showcase (Left) */}
        <div className="md:w-1/2 bg-void p-8 flex items-center justify-center border-b md:border-b-0 md:border-r border-grave relative min-h-[320px]">
          {product.category === 'cases' ? (
            <CaseGraphic
              finish={product.caseTypeId || 'matte-black'}
              size="lg"
              showLabel={true}
            />
          ) : product.category === 'stickers' ? (
            <img
              src="/images/stickers.png"
              alt={name}
              className="w-full aspect-[3/4] object-cover object-center"
            />
          ) : (
            <img
              src="/images/charms.png"
              alt={name}
              className="w-full aspect-[3/4] object-cover object-center"
            />
          )}

          <div className="absolute top-4 left-4 bg-void/80 border border-grave px-2.5 py-1 font-mono text-[10px] uppercase text-ash tracking-widest">
            {tag}
          </div>
        </div>

        {/* Details & Actions (Right) */}
        <div className="md:w-1/2 p-6 sm:p-8 flex flex-col justify-between space-y-6 max-h-[80vh] overflow-y-auto">
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-xs text-ash tracking-widest uppercase block">
                  DUAT / {product.category.toUpperCase()}
                </span>
                {product.rating && (
                  <div className="flex items-center gap-1 font-mono text-xs text-gold font-bold">
                    <Star size={13} className="fill-gold text-gold" />
                    <span>{product.rating}</span>
                    <span className="text-ash font-normal">({product.reviewCount || 12})</span>
                  </div>
                )}
              </div>

              <h2 className="font-clash text-2xl sm:text-3xl uppercase text-bone mt-1">
                {name}
              </h2>
              
              <p className="font-mono text-xl text-gold font-bold mt-2">
                {formatPrice(product.price)}
              </p>

              {craftTag && (
                <div className="mt-2 inline-block bg-gold/10 border border-gold/30 px-2.5 py-1 font-mono text-[10px] text-gold uppercase tracking-wider">
                  {craftTag}
                </div>
              )}
            </div>

            <p className="font-space text-sm text-bone/95 font-medium leading-relaxed">
              {description}
            </p>

            {/* Specifications List */}
            {specs && specs.length > 0 && (
              <div className="space-y-2 pt-3 border-t border-grave">
                <span className="font-mono text-[10px] uppercase tracking-widest text-ash font-bold">
                  {t('productSpecs')}
                </span>
                <ul className="space-y-1 font-space text-xs text-bone/70">
                  {specs.map((spec, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <span className="w-1 h-1 bg-gold rounded-full" />
                      <span>{spec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Seed Customer Reviews Preview */}
            {product.reviews && product.reviews.length > 0 && (
              <div className="pt-3 border-t border-grave space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-ash font-bold">
                    {t('customerReviews')}
                  </span>
                  <div className="flex text-gold">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={10} className="fill-gold" />
                    ))}
                  </div>
                </div>

                {product.reviews.slice(0, 2).map((rev, idx) => (
                  <div key={idx} className="bg-coal p-2.5 border border-grave/60 text-xs">
                    <div className="flex justify-between items-center text-[10px] font-mono text-ash mb-1">
                      <span className="text-bone font-bold">{rev.name}</span>
                      <span>{rev.date}</span>
                    </div>
                    <p className="font-space text-bone/80 italic text-[11px]">
                      "{isAr ? rev.commentAr : rev.commentEn}"
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Minimal Trust Badges */}
            <div className="pt-2 grid grid-cols-2 gap-2 font-mono text-[10px] text-ash">
              <div className="flex items-center gap-1.5">
                <Truck size={12} className="text-gold" />
                <span>{isAr ? 'شحن لكافة المحافظات' : 'Egypt Shipping'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <RotateCcw size={12} className="text-gold" />
                <span>{isAr ? '١٤ يوم إرجاع' : '14-Day Returns'}</span>
              </div>
            </div>

          </div>

          {/* Actions */}
          <div className="space-y-3 pt-4 border-t border-grave">
            <button
              onClick={handleAddToCart}
              className="btn-primary w-full py-4 text-xs font-mono font-bold tracking-widest flex items-center justify-center gap-2 min-h-[44px]"
            >
              <ShoppingBag size={16} />
              <span>{t('addToCart')}</span>
            </button>

            {product.category === 'cases' && (
              <button
                onClick={handleCustomize}
                className="btn-ghost w-full py-3 text-xs font-mono tracking-widest flex items-center justify-center gap-2 border-gold/50 text-gold hover:bg-gold hover:text-void min-h-[44px]"
              >
                <Sparkles size={16} />
                <span>{t('customizeThisCase')}</span>
              </button>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};

export default ProductModal;
