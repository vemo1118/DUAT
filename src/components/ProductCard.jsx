import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { SunDisc } from './SunDisc';
import { ShoppingBag, Check } from 'lucide-react';

export const ProductCard = ({ product }) => {
  const { lang, t, formatPrice } = useLanguage();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const [added, setAdded] = useState(false);

  const handleAdd = (e) => {
    e?.stopPropagation();
    addToCart(product);
    setAdded(true);
    showToast(t('itemAddedToast'), 'success');
    setTimeout(() => setAdded(false), 1500);
  };

  const name = lang === 'ar' ? product.nameAr : product.nameEn;
  const tag = lang === 'ar' ? product.tagAr : product.tagEn;

  return (
    <div className="bg-coal border border-grave flex flex-col justify-between group relative overflow-hidden transition-all duration-300 hover:border-gold/60 hover:shadow-[0_0_30px_rgba(232,176,75,0.15)] cursor-pointer">
      
      {/* Visual Canvas Area */}
      <div className="h-64 bg-void/80 flex items-center justify-center p-4 relative overflow-hidden border-b border-grave">
        
        {/* Ambient Subtle Sun Radial Glow */}
        <div className="absolute inset-0 bg-radial from-gold/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        {product.image ? (
          <img
            src={product.image}
            alt={name}
            className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-500"
          />
        ) : (
          <div className="w-24 h-44 rounded-[18px] border-2 border-grave bg-stone shadow-2xl relative flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform duration-300">
            <SunDisc size={36} variant="gold" />
          </div>
        )}

        {/* Tag Badge */}
        <div className="absolute top-3 left-3 bg-void/90 backdrop-blur-md border border-grave px-2.5 py-1">
          <span className="font-mono text-[10px] uppercase tracking-widest text-gold font-bold">
            {tag}
          </span>
        </div>
      </div>

      {/* Product Information */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-widest text-ash">
              DUAT OFFICIAL
            </span>
            <SunDisc size={10} className="text-gold opacity-50" />
          </div>
          <h3 className="font-space text-lg font-bold text-bone mt-1 group-hover:text-gold transition-colors">
            {name}
          </h3>
          <p className="font-mono text-sm text-gold font-bold mt-2">
            {formatPrice(product.price)}
          </p>
        </div>

        {/* Hover Slide-up "Add to Cart" Button */}
        <div className="pt-2">
          <button
            onClick={handleAdd}
            className={`w-full py-3 text-xs font-mono font-bold uppercase tracking-widest border transition-all duration-300 flex items-center justify-center gap-2 ${
              added
                ? 'bg-gold text-void border-gold'
                : 'bg-stone text-bone border-grave hover:bg-gold hover:text-void hover:border-gold'
            }`}
          >
            {added ? (
              <>
                <Check size={14} />
                <span>{t('addedToCart')}</span>
              </>
            ) : (
              <>
                <ShoppingBag size={14} />
                <span>{t('addToCart')}</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
