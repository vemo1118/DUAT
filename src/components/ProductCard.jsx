import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { ShoppingBag, Check, Sparkles } from 'lucide-react';

export const ProductCard = ({ product }) => {
  const { lang, t, formatPrice } = useLanguage();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const [added, setAdded] = useState(false);
  const navigate = useNavigate();

  const handleAdd = (e) => {
    e?.stopPropagation();
    addToCart(product);
    setAdded(true);
    showToast(t('itemAddedToast'), 'success');
    setTimeout(() => setAdded(false), 1500);
  };

  const handleCustomize = (e) => {
    e?.stopPropagation();
    navigate('/customizer', { state: { preselectedCaseTypeId: product.caseTypeId || 'clear' } });
  };

  const name = lang === 'ar' ? product.nameAr : product.nameEn;
  const tag = lang === 'ar' ? product.tagAr : product.tagEn;

  // Render high-depth dusk-lit product graphics for 5 distinct finishes
  const renderProductGraphic = () => {
    if (product.id === 'case-solar' || product.caseTypeId === 'clear') {
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
      case 'case-gold-ring':
        return (
          <div className="w-28 h-48 rounded-[22px] border-2 border-gold/70 bg-[#0A0A0A] shadow-[0_12px_30px_rgba(0,0,0,0.9)] relative flex flex-col justify-between p-3 group-hover:scale-103 transition-transform duration-300">
            <div className="self-end w-8 h-8 rounded-xl bg-void border-2 border-gold flex flex-col items-center justify-center p-1 shadow-md">
              <div className="w-2.5 h-2.5 rounded-full bg-void border border-gold mb-0.5" />
              <div className="w-2.5 h-2.5 rounded-full bg-void border border-gold" />
            </div>

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full border-2 border-gold/60 pointer-events-none" />

            <div className="self-start font-mono text-[8px] tracking-widest text-gold font-bold uppercase select-none z-10">
              DUAT GOLD
            </div>
          </div>
        );

      case 'case-carbon':
        return (
          <div className="w-28 h-48 rounded-[22px] border border-ash/40 bg-[radial-gradient(#262626_1px,transparent_1px)] [background-size:8px_8px] bg-coal shadow-[0_12px_30px_rgba(0,0,0,0.9)] relative flex flex-col justify-between p-3 group-hover:scale-103 transition-transform duration-300">
            <div className="self-end w-8 h-8 rounded-xl bg-stone border border-ash/60 flex flex-col items-center justify-center p-1 shadow-md">
              <div className="w-2.5 h-2.5 rounded-full bg-void border border-ash/40 mb-0.5" />
              <div className="w-2.5 h-2.5 rounded-full bg-void border border-ash/40" />
            </div>

            <div className="self-start font-mono text-[8px] tracking-widest text-ash font-bold uppercase select-none">
              CARBON
            </div>
          </div>
        );

      case 'case-ember':
        return (
          <div className="w-28 h-48 rounded-[22px] border border-[#8B261D] bg-gradient-to-b from-[#2A1610] to-[#1A0C0A] shadow-[0_12px_30px_rgba(0,0,0,0.9)] relative flex flex-col justify-between p-3 group-hover:scale-103 transition-transform duration-300">
            <div className="self-end w-8 h-8 rounded-xl bg-[#1A0C0A] border border-[#8B261D] flex flex-col items-center justify-center p-1 shadow-md">
              <div className="w-2.5 h-2.5 rounded-full bg-void border border-[#8B261D] mb-0.5" />
              <div className="w-2.5 h-2.5 rounded-full bg-void border border-[#8B261D]" />
            </div>

            <div className="self-start font-mono text-[8px] tracking-widest text-[#8B261D] font-bold uppercase select-none">
              EMBER
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
              VOID
            </div>
          </div>
        );
    }
  };

  return (
    <div className="bg-stone border border-grave flex flex-col justify-between group relative overflow-hidden transition-all duration-300 cursor-pointer card-depth-highlight">
      
      {/* 3:4 Aspect Ratio Visual Canvas Area */}
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

        {/* Dual Action Buttons: Add to Cart & Customize */}
        <div className="pt-1 grid grid-cols-2 gap-2">
          <button
            onClick={handleAdd}
            className={`min-h-[44px] py-3 text-[11px] font-mono font-bold uppercase tracking-wider border transition-all duration-300 flex items-center justify-center gap-1.5 ${
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

          {/* Customize Navigation Button */}
          <button
            onClick={handleCustomize}
            className="min-h-[44px] py-3 text-[11px] font-mono font-bold uppercase tracking-wider border border-gold/40 text-gold hover:bg-gold hover:text-void transition-all duration-300 flex items-center justify-center gap-1"
          >
            <Sparkles size={13} />
            <span>CUSTOMIZE</span>
          </button>
        </div>

      </div>
    </div>
  );
};
