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

  // Custom high-end dark SVG visuals per product type
  const renderProductGraphic = () => {
    switch (product.category) {
      case 'cases':
        return (
          <div className="w-24 h-44 rounded-[20px] border-2 border-grave bg-stone shadow-2xl relative flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform duration-300">
            {/* Phone Camera Lens */}
            <div className="absolute top-2.5 right-2.5 w-6 h-6 rounded-md bg-void border border-grave flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-ash/40" />
            </div>
            {/* Minimal Sun Disc Brand Mark */}
            <SunDisc size={36} variant={product.id.includes('ember') ? 'ember' : 'gold'} />
          </div>
        );
      case 'stickers':
        return (
          <div className="w-24 h-24 rounded-full bg-stone border border-grave flex items-center justify-center relative shadow-xl group-hover:scale-110 transition-transform duration-300">
            <div className="w-20 h-20 rounded-full bg-coal border border-gold/30 flex items-center justify-center">
              <SunDisc size={32} variant={product.id.includes('scarab') ? 'eclipse' : 'gold'} />
            </div>
          </div>
        );
      case 'charms':
        return (
          <div className="flex flex-col items-center group-hover:scale-105 transition-transform duration-300">
            <div className="w-1 h-12 bg-gradient-to-b from-gold/60 to-gold" />
            <div className="w-10 h-10 bg-coal border-2 border-gold flex items-center justify-center shadow-lg">
              <SunDisc size={20} variant="gold" />
            </div>
          </div>
        );
      case 'accessories':
      default:
        return (
          <div className="w-32 h-24 border border-grave bg-stone/80 flex items-center justify-center relative group-hover:scale-105 transition-transform duration-300">
            <div className="w-20 h-12 border-b-2 border-gold flex items-center justify-between px-2">
              <span className="font-mono text-[9px] text-ash tracking-widest">DUAT</span>
              <SunDisc size={16} />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="bg-coal border border-grave flex flex-col justify-between group relative overflow-hidden transition-all duration-300 hover:border-gold/50 cursor-pointer">
      
      {/* Visual Canvas Area */}
      <div className="h-64 bg-void/60 flex items-center justify-center p-6 relative overflow-hidden border-b border-grave">
        <div className="absolute inset-0 bg-gradient-to-t from-stone/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        {renderProductGraphic()}
      </div>

      {/* Product Information */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-widest text-ash">
              {tag}
            </span>
            <SunDisc size={10} className="text-gold opacity-50" />
          </div>
          <h3 className="font-space font-bold text-lg text-bone mt-1 group-hover:text-gold transition-colors">
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
