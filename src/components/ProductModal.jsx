import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { X, ShoppingBag, Sparkles, ShieldCheck, Truck, RefreshCw } from 'lucide-react';

export const ProductModal = ({ product, onClose }) => {
  const { lang, t, formatPrice } = useLanguage();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();

  if (!product) return null;

  const name = lang === 'ar' ? product.nameAr : product.nameEn;
  const description = lang === 'ar' ? product.descriptionAr : product.descriptionEn;
  const tag = lang === 'ar' ? product.tagAr : product.tagEn;
  const specs = lang === 'ar' ? product.specsAr : product.specsEn;

  const handleAddToCart = () => {
    addToCart(product);
    showToast(t('itemAddedToast'), 'success');
  };

  const handleCustomize = () => {
    onClose();
    navigate('/customizer', { state: { preselectedCaseTypeId: product.caseTypeId || 'clear' } });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-void/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-stone border border-grave w-full max-w-3xl overflow-hidden shadow-2xl relative flex flex-col md:flex-row card-depth-highlight">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 text-ash hover:text-bone bg-coal border border-grave transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
        >
          <X size={18} />
        </button>

        {/* Visual Showcase (Left) */}
        <div className="md:w-1/2 bg-void p-8 flex items-center justify-center border-b md:border-b-0 md:border-r border-grave relative">
          <img
            src={product.category === 'cases' ? '/images/transparent_hero_case.png' : product.category === 'stickers' ? '/images/stickers.png' : '/images/charms.png'}
            alt={name}
            className="w-full aspect-[3/4] object-cover object-center"
          />
          <div className="absolute top-4 left-4 bg-void/80 border border-grave px-2.5 py-1 font-mono text-[10px] uppercase text-ash tracking-widest">
            {tag}
          </div>
        </div>

        {/* Details & Actions (Right) */}
        <div className="md:w-1/2 p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div>
              <span className="font-mono text-xs text-ash tracking-widest uppercase block">
                DUAT / {product.category.toUpperCase()}
              </span>
              <h2 className="font-clash text-2xl sm:text-3xl uppercase text-bone mt-1">
                {name}
              </h2>
              <p className="font-mono text-xl text-gold font-bold mt-2">
                {formatPrice(product.price)}
              </p>
            </div>

            <p className="font-space text-sm text-bone/80 font-light leading-relaxed">
              {description}
            </p>

            {specs && specs.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-grave">
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
