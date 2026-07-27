import React, { useState } from 'react';
import { X, ShoppingBag, Check, Wrench, Plus, Minus } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { SunDisc } from './SunDisc';

export const ProductModal = ({ product, onClose, setView }) => {
  const { lang, t, formatPrice } = useLanguage();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const name = lang === 'ar' ? product.nameAr : product.nameEn;
  const tag = lang === 'ar' ? product.tagAr : product.tagEn;
  const description = lang === 'ar' ? product.descriptionAr : product.descriptionEn;
  const specs = lang === 'ar' ? (product.specsAr || []) : (product.specsEn || []);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    setAdded(true);
    showToast(t('itemAddedToast'), 'success');
    setTimeout(() => setAdded(false), 1500);
  };

  const handleOpenBuilder = () => {
    onClose();
    setView('customizer');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-void/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-stone border border-grave max-w-2xl w-full shadow-2xl relative overflow-hidden my-8 animate-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 text-ash hover:text-gold border border-grave bg-coal/80 transition-colors"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          
          {/* Visual Display */}
          <div className="bg-coal p-8 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-grave relative min-h-[280px]">
            <SunDisc size={72} variant="gold" className="opacity-90 animate-pulse" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-ash mt-4">
              DUAT AUTHENTIC CANVAS
            </span>
          </div>

          {/* Product Specs & Purchase Options */}
          <div className="p-6 sm:p-8 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <span className="font-mono text-xs uppercase tracking-widest text-gold block font-bold">
                  {tag}
                </span>
                <h2 className="font-archivo text-2xl uppercase text-bone mt-1">
                  {name}
                </h2>
                <p className="font-mono text-lg text-gold font-bold mt-2">
                  {formatPrice(product.price)}
                </p>
              </div>

              <p className="font-space text-sm text-bone/80 leading-relaxed border-t border-grave pt-3">
                {description}
              </p>

              {/* Specs */}
              {specs.length > 0 && (
                <div className="space-y-2 border-t border-grave pt-3">
                  <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-ash">
                    {t('productSpecs')}
                  </h4>
                  <ul className="space-y-1 font-mono text-xs text-bone/70">
                    {specs.map((spec, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-gold flex-shrink-0" />
                        <span>{spec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-4 border-t border-grave">
              
              {/* Quantity Stepper */}
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-ash uppercase">{t('quantity')}</span>
                <div className="flex items-center border border-grave bg-coal">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1.5 text-ash hover:text-bone transition-colors"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="px-3 font-mono text-sm text-bone font-bold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-1.5 text-ash hover:text-bone transition-colors"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                className="w-full btn-primary py-3.5 text-xs flex items-center justify-center gap-2"
              >
                {added ? <Check size={16} /> : <ShoppingBag size={16} />}
                <span>{added ? t('addedToCart') : t('addToCart')}</span>
              </button>

              {product.category === 'cases' && (
                <button
                  onClick={handleOpenBuilder}
                  className="w-full btn-ghost py-3.5 text-xs flex items-center justify-center gap-2"
                >
                  <Wrench size={16} />
                  <span>{t('customizeThisCase')}</span>
                </button>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
