import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { ShoppingBag, Check, Sparkles, Star } from 'lucide-react';
import { CaseGraphic } from './CaseGraphic';

export const ProductCard = ({ product, onSelectProduct }) => {
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

  const handleCardClick = () => {
    if (onSelectProduct) {
      onSelectProduct(product);
    } else {
      navigate(`/product/${product.id}`);
    }
  };

  if (!product) return null;

  const name = (lang === 'ar' ? product.nameAr : product.nameEn) || product.nameEn || product.nameAr || 'Product';
  const tag = (lang === 'ar' ? product.tagAr : product.tagEn) || product.tagEn || product.tagAr || '';
  const craftTag = (lang === 'ar' ? product.craftTagAr : product.craftTagEn) || product.craftTagEn || product.craftTagAr || '';

  // Render graphic using CaseGraphic or images
  const renderProductGraphic = () => {
    const customImage = product.imageUrl || product.image;
    if (customImage) {
      return (
        <img
          src={customImage}
          alt={name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          onError={(e) => {
            console.warn('Failed to load image:', customImage);
          }}
        />
      );
    }

    if (product.category === 'cases') {
      return (
        <CaseGraphic
          finish={product.caseTypeId || 'matte-black'}
          size="md"
          showLabel={false}
        />
      );
    }

    if (product.category === 'stickers') {
      return (
        <img
          src="/images/stickers.png"
          alt={name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
        />
      );
    }

    return (
      <img
        src="/images/charms.png"
        alt={name}
        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
      />
    );
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-stone border border-grave flex flex-col justify-between group relative overflow-hidden transition-all duration-300 cursor-pointer card-depth-highlight"
    >
      
      {/* 3:4 Aspect Ratio Visual Canvas Area */}
      <div className="aspect-[3/4] w-full bg-void overflow-hidden relative border-b border-grave flex items-center justify-center p-6">
        {renderProductGraphic()}
        
        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone/90 via-transparent to-transparent pointer-events-none" />

        {/* Small Tag Badge */}
        <div className="absolute top-3 left-3 bg-void/85 backdrop-blur-sm border border-grave px-2.5 py-1 font-mono text-[10px] uppercase text-ash tracking-widest">
          {tag}
        </div>

        {/* Subtle Scarcity / Craft Badge (Top Right) */}
        {craftTag && (
          <div className="absolute top-3 right-3 bg-gold/10 border border-gold/30 px-2 py-0.5 font-mono text-[9px] uppercase text-gold tracking-wider">
            CRAFT
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-space font-bold text-base text-bone group-hover:text-gold transition-colors">
              {name}
            </h3>
            {/* Star Rating Badge */}
            {product.rating && (
              <div className="flex items-center gap-1 font-mono text-[11px] text-gold font-bold flex-shrink-0">
                <Star size={12} className="fill-gold text-gold" />
                <span>{product.rating}</span>
                {product.reviewCount && (
                  <span className="text-ash font-normal text-[10px]">({product.reviewCount})</span>
                )}
              </div>
            )}
          </div>

          <p className="font-mono text-sm text-gold font-bold mt-1.5">
            {formatPrice(product.price)}
          </p>

          {/* Craftsmanship Micro-Label */}
          {craftTag && (
            <p className="font-mono text-[10px] text-ash tracking-wider mt-1 border-t border-grave/40 pt-1.5">
              {craftTag}
            </p>
          )}
        </div>

        {/* Dual Action Buttons: Add to Cart & Customize */}
        <div className="pt-1 grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2">
          <button
            onClick={handleAdd}
            className={`min-h-[40px] sm:min-h-[44px] py-2 sm:py-3 px-1 text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-wider border transition-all duration-300 flex items-center justify-center gap-1 ${
              added
                ? 'bg-gold text-void border-gold'
                : 'bg-coal text-bone border-grave hover:bg-gold hover:text-void hover:border-gold'
            }`}
          >
            {added ? (
              <>
                <Check size={13} />
                <span>{t('addedToCart')}</span>
              </>
            ) : (
              <>
                <ShoppingBag size={13} />
                <span>{t('addToCart')}</span>
              </>
            )}
          </button>

          {/* Customize Navigation Button */}
          <button
            onClick={handleCustomize}
            className="min-h-[40px] sm:min-h-[44px] py-2 sm:py-3 px-1 text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-wider border border-gold/40 text-gold hover:bg-gold hover:text-void transition-all duration-300 flex items-center justify-center gap-1"
          >
            <Sparkles size={13} />
            <span>CUSTOMIZE</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default ProductCard;
