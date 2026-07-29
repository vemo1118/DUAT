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

  // Render high-depth dusk-lit product graphics for all 4 finishes
  const renderProductGraphic = () => {
    if (product.id === 'case-solar') {
      return (
        <img
          src="/images/transparent_hero_case.png"
          alt={name}
          className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-500 ease-out"
        />
      );
    }

    if (product.category === 'stickers') {
      return (
        <img
          src="/images/stickers.png"
          alt={name}
          className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-500 ease-out"
        />
      );
    }

    if (product.category === 'charms' || product.category === 'accessories') {
      return (
        <img
          src="/images/charms.png"
          alt={name}
          className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-500 ease-out"
        />
      );
    }

    switch (product.id) {
      case 'case-ember':
        return (
          <div className="w-28 h-48 rounded-[22px] border border-[#4A2418] bg-gradient-to-b from-[#2A1610] to-[#1A0C0A] shadow-[0_12px_30px_rgba(0,0,0,0.9)] relative flex flex-col justify-between p-3 group-hover:scale-103 transition-transform duration-300">
            <div className="self-end w-8 h-8 rounded-xl bg-[#1A0C0A] border border-[#4A2418] flex flex-col items-center justify-center p-1 shadow-md">
              <div className="w-2.5 h-2.5 rounded-full bg-void border border-[#4A2418] mb-0.5" />
              <div className="w-2.5 h-2.5 rounded-full bg-void border border-[#4A2418]" />
            </div>

            <div className="self-start font-mono text-[8px] tracking-widest text-[#4A2418] font-bold uppercase select-none">
              DUAT
            </div>
          </div>
        );

      case 'case-eclipse':
        return (
          <div className="w-28 h-48 rounded-[22px] border border-grave bg-stone shadow-[0_12px_30px_rgba(0,0,0,0.9)] relative flex flex-col justify-between p-3 group-hover:scale-103 transition-transform duration-300">
            <div className="self-end w-8 h-8 rounded-xl bg-coal border border-grave flex flex-col items-center justify-center p-1 shadow-md">
              <div className="w-2.5 h-2.5 rounded-full bg-void border border-grave mb-0.5" />
              <div className="w-2.5 h-2.5 rounded-full bg-void border border-grave" />
            </div>

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full border-2 border-grave/70 pointer-events-none" />

            <div className="self-start font-mono text-[8px] tracking-widest text-ash/40 font-bold uppercase select-none z-10">
              DUAT
            </div>
          </div>
        );

      case 'case-void':
      default:
        return (
          <div className="w-28 h-48 rounded-[22px] border border-coal bg-[#0A0A0A] shadow-[0_12px_30px_rgba(0,0,0,0.9)] relative flex flex-col justify-between p-3 group-hover:scale-103 transition-transform duration-300">
            <div className="self-end w-8 h-8 rounded-xl bg-void border border-coal flex flex-col items-center justify-center p-1 shadow-md">
              <div className="w-2.5 h-2.5 rounded-full bg-[#1A1A1A] border border-coal mb-0.5" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#1A1A1A] border border-coal" />
            </div>

            <div className="self-start font-mono text-[8px] tracking-widest text-coal font-bold uppercase select-none">
              DUAT
            </div>
          </div>
        );
    }
  };

  return (
    <div className="bg-stone border border-grave flex flex-col justify-between group relative overflow-hidden transition-all duration-300 cursor-pointer card-depth-highlight">
      
      {/* 3:4 Aspect Ratio Photography / Canvas Area */}
      <div className="aspect-[3/4] w-full bg-void overflow-hidden relative border-b border-grave flex items-center justify-center">
        {renderProductGraphic()}
        
        {/* Subtle Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone/80 via-transparent to-transparent pointer-events-none" />

        {/* Small Tag Badge */}
        <div className="absolute top-3 left-3 bg-void/85 backdrop-blur-sm border border-grave px-2.5 py-1 font-mono text-[10px] uppercase text-ash tracking-widest">
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
