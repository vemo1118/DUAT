import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
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

  // Map product categories to high-res photography assets
  const getProductImage = () => {
    if (product.category === 'stickers') {
      return '/images/stickers.png';
    } else if (product.category === 'charms' || product.category === 'accessories') {
      return '/images/charms.png';
    } else {
      // Cases default to studio photography case image
      return '/images/hero_case.png';
    }
  };

  return (
    <div className="bg-stone border border-grave flex flex-col justify-between group relative overflow-hidden transition-all duration-400 hover:border-gold cursor-pointer">
      
      {/* 3:4 Aspect Ratio Real Photography Container (Part 1 Fix) */}
      <div className="aspect-[3/4] w-full bg-stone overflow-hidden relative border-b border-grave">
        <img
          src={getProductImage()}
          alt={name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        
        {/* Subtle Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone/80 via-transparent to-transparent pointer-events-none" />

        {/* Small Tone-on-Tone Tag Badge */}
        <div className="absolute top-3 left-3 bg-void/80 backdrop-blur-sm border border-grave px-2.5 py-1 font-mono text-[10px] uppercase text-ash tracking-widest">
          {tag}
        </div>
      </div>

      {/* Product Details */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <h3 className="font-space font-bold text-base text-bone group-hover:text-gold transition-colors">
            {name}
          </h3>
          <p className="font-mono text-sm text-gold font-bold mt-1.5">
            {formatPrice(product.price)}
          </p>
        </div>

        {/* Hover Slide-up "Add to Cart" Button (44px min tap target) */}
        <div className="pt-1">
          <button
            onClick={handleAdd}
            className={`w-full min-h-[44px] py-3 text-xs font-mono font-bold uppercase tracking-widest border transition-all duration-300 flex items-center justify-center gap-2 ${
              added
                ? 'bg-gold text-void border-gold'
                : 'bg-coal text-bone border-grave hover:bg-gold hover:text-void hover:border-gold'
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
