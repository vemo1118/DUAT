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

  // Blank-Back High-Depth Techwear Case Renderers (Part 4 Fix)
  const renderBlankBackCase = () => {
    switch (product.id) {
      case 'case-solar':
        return (
          <div className="w-28 h-48 rounded-[22px] border border-gold/40 bg-stone/70 shadow-[0_12px_24px_rgba(0,0,0,0.8)] relative flex flex-col justify-between p-3 group-hover:scale-105 transition-transform duration-300 backdrop-blur-sm">
            {/* Camera Module with Gold Accent Ring */}
            <div className="self-end w-8 h-8 rounded-xl bg-coal border-2 border-gold flex flex-col items-center justify-center p-1 shadow-md">
              <div className="w-2.5 h-2.5 rounded-full bg-void border border-ash/40 mb-0.5" />
              <div className="w-2.5 h-2.5 rounded-full bg-void border border-ash/40" />
            </div>

            <div className="self-start font-mono text-[8px] tracking-widest text-gold/30 font-bold uppercase select-none">
              DUAT
            </div>
          </div>
        );

      case 'case-ember':
        return (
          <div className="w-28 h-48 rounded-[22px] border border-[#4A2418] bg-gradient-to-b from-[#2A1610] to-[#1A0C0A] shadow-[0_12px_24px_rgba(0,0,0,0.8)] relative flex flex-col justify-between p-3 group-hover:scale-105 transition-transform duration-300">
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
          <div className="w-28 h-48 rounded-[22px] border border-grave bg-stone shadow-[0_12px_24px_rgba(0,0,0,0.8)] relative flex flex-col justify-between p-3 group-hover:scale-105 transition-transform duration-300">
            <div className="self-end w-8 h-8 rounded-xl bg-coal border border-grave flex flex-col items-center justify-center p-1 shadow-md">
              <div className="w-2.5 h-2.5 rounded-full bg-void border border-grave mb-0.5" />
              <div className="w-2.5 h-2.5 rounded-full bg-void border border-grave" />
            </div>

            {/* MagSafe Ring Detail */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full border-2 border-grave/60 pointer-events-none" />

            <div className="self-start font-mono text-[8px] tracking-widest text-ash/40 font-bold uppercase select-none z-10">
              DUAT
            </div>
          </div>
        );

      case 'case-void':
      default:
        return (
          <div className="w-28 h-48 rounded-[22px] border border-coal bg-[#0A0A0A] shadow-[0_12px_24px_rgba(0,0,0,0.9)] relative flex flex-col justify-between p-3 group-hover:scale-105 transition-transform duration-300">
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

  const renderCategoryGraphic = () => {
    if (product.category === 'cases') return renderBlankBackCase();

    switch (product.category) {
      case 'stickers':
        return (
          <div className="w-24 h-24 rounded-2xl bg-stone border border-grave flex items-center justify-center relative shadow-xl group-hover:scale-105 transition-transform duration-300">
            <div className="bg-gold text-void font-kufi font-bold px-3 py-1 rounded-full text-xs shadow-md">
              {product.id.includes('born') ? 'BORN AT DAWN' : 'طالع نور'}
            </div>
          </div>
        );
      case 'charms':
        return (
          <div className="flex flex-col items-center group-hover:scale-105 transition-transform duration-300">
            <div className="w-0.5 h-10 bg-gold/60" />
            <div className="w-9 h-9 bg-coal border-2 border-gold rounded-full flex items-center justify-center shadow-lg">
              <div className="w-4 h-4 rounded-full border border-gold" />
            </div>
          </div>
        );
      case 'accessories':
      default:
        return (
          <div className="w-32 h-20 border border-grave bg-stone flex items-center justify-center relative group-hover:scale-105 transition-transform duration-300">
            <div className="w-24 h-6 border-b-2 border-gold flex items-center justify-between px-2">
              <span className="font-mono text-[9px] text-ash tracking-widest">TACTICAL STRAP</span>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="bg-stone border border-grave flex flex-col justify-between group relative overflow-hidden transition-all duration-300 hover:border-gold cursor-pointer">
      
      {/* Visual Canvas Area */}
      <div className="h-64 bg-void flex items-center justify-center p-6 relative overflow-hidden border-b border-grave">
        <div className="absolute inset-0 bg-gradient-to-t from-stone/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        {renderCategoryGraphic()}
      </div>

      {/* Product Information */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-widest text-ash block">
            {tag}
          </span>
          <h3 className="font-space font-bold text-base text-bone mt-1 group-hover:text-gold transition-colors">
            {name}
          </h3>
          <p className="font-mono text-sm text-gold font-bold mt-2">
            {formatPrice(product.price)}
          </p>
        </div>

        {/* Hover Slide-up "Add to Cart" Button (44px min tap target) */}
        <div className="pt-2">
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
