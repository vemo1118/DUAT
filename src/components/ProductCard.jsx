import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import { ShoppingBag, Check, Star, Heart } from 'lucide-react';
import { StickerIcon } from './StickerIcon';

export const ProductCard = ({ product, onSelectProduct }) => {
  const { lang, t, formatPrice } = useLanguage();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlistItem } = useWishlist();
  const { showToast } = useToast();
  const [added, setAdded] = useState(false);
  const navigate = useNavigate();

  const isLiked = isInWishlist(product?.id);

  const handleToggleWishlist = (e) => {
    e?.stopPropagation();
    toggleWishlistItem(product);
    if (!isLiked) {
      showToast(lang === 'ar' ? 'تمت الإضافة للمفضلة ❤️' : 'Saved to Wishlist ❤️', 'success');
    }
  };

  const handleAdd = (e) => {
    e?.stopPropagation();
    addToCart(product);
    setAdded(true);
    showToast(t('itemAddedToast'), 'success');
    setTimeout(() => setAdded(false), 1500);
  };

  const handleCardClick = () => {
    if (onSelectProduct) {
      onSelectProduct(product);
    } else {
      navigate(`/product/${product.id}`);
    }
  };

  if (!product) return null;

  const id = String(product.id || '');
  const isSticker = product.category === 'stickers' || id.startsWith('st-') || id.startsWith('pack-') || id.startsWith('sticker') || id.startsWith('ar-letter-') || id.startsWith('en-letter-') || id.startsWith('month-') || id.startsWith('year-');
  const name = (lang === 'ar' ? product.nameAr : product.nameEn) || product.nameEn || product.nameAr || 'Product';
  const tag = (lang === 'ar' ? product.tagAr : product.tagEn) || product.tagEn || product.tagAr || '';
  const craftTag = (lang === 'ar' ? product.craftTagAr : product.craftTagEn) || product.craftTagEn || product.craftTagAr || '';

  // Render sticker artwork, uploaded product images, or a neutral epoxy placeholder.
  const renderProductGraphic = () => {
    const customImage = product.imageUrl || product.image;
    if (customImage) {
      const fitClass = isSticker && product.cardImageFit === 'contain'
        ? 'w-full h-full object-contain scale-100 group-hover:scale-105 transition-transform duration-500 ease-out drop-shadow-xl'
        : isSticker
        ? 'w-full h-full object-contain scale-[1.45] group-hover:scale-[1.55] transition-transform duration-500 ease-out drop-shadow-2xl'
        : 'w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out';
      return (
        <img
          src={customImage}
          alt={name}
          className={fitClass}
          onError={(e) => {
            console.warn('Failed to load image:', customImage);
          }}
        />
      );
    }

    // Letter / Month / Year stickers: render the live StickerIcon preview
    const renderId = product.stickerRenderId || product.id;
    if (renderId && (renderId.startsWith('ar-letter-') || renderId.startsWith('en-letter-') || renderId.startsWith('month-') || renderId.startsWith('year-'))) {
      return (
        <div className="w-full h-full flex items-center justify-center p-1">
          <StickerIcon
            stickerId={renderId}
            size={135}
            color="#182744"
            bgColor="#FFFFFF"
          />
        </div>
      );
    }

    if (product.category === 'stickers') {
      // Show placeholder silhouette if no image uploaded
      return (
        <div className="w-full h-full flex items-center justify-center bg-void/40">
          <span className="font-mono text-xs text-ash opacity-50 uppercase tracking-widest">3D Epoxy Dome</span>
        </div>
      );
    }

    return (
      <img
        src="https://res.cloudinary.com/ikim5u08/image/upload/f_auto,q_auto/v1785764123/B1_DarkNight_dzbmmn.jpg"
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
      <div className={`aspect-[3/4] w-full overflow-hidden relative border-b border-grave flex items-center justify-center ${isSticker ? 'p-3 sm:p-4 bg-gradient-to-b from-stone/60 via-void to-void' : 'p-6 bg-void'}`}>
        {renderProductGraphic()}
        
        {/* Soft Contrast Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone/60 via-transparent to-transparent pointer-events-none" />

        {/* Top Badges Bar */}
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2 z-10">
          {tag ? (
            <div className="bg-void/85 backdrop-blur-sm border border-grave px-2.5 py-1 font-mono text-[10px] uppercase text-ash tracking-widest truncate pointer-events-none">
              {tag}
            </div>
          ) : craftTag ? (
            <div className="bg-gold/10 border border-gold/30 px-2 py-0.5 font-mono text-[9px] uppercase text-gold tracking-wider shrink-0 pointer-events-none">
              CRAFT
            </div>
          ) : (
            <div />
          )}

          {/* Wishlist Heart Toggle Button */}
          <button
            type="button"
            onClick={handleToggleWishlist}
            className={`p-2 rounded-full border backdrop-blur-md transition-all duration-300 pointer-events-auto shrink-0 shadow-lg ${
              isLiked
                ? 'bg-gold border-gold text-[#0A0C16] scale-110'
                : 'bg-void/70 border-grave text-bone hover:border-gold hover:text-gold'
            }`}
            title={isLiked ? (lang === 'ar' ? 'إزالة من المفضلة' : 'Remove from wishlist') : (lang === 'ar' ? 'إضافة للمفضلة' : 'Save to wishlist')}
          >
            <Heart size={14} className={isLiked ? 'fill-current' : ''} />
          </button>
        </div>
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

        {/* Add to Cart */}
        <div className="pt-1 flex">
          <button
            onClick={handleAdd}
            className={`w-full min-h-[40px] sm:min-h-[44px] py-2 sm:py-3 px-1 text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-wider border transition-all duration-300 flex items-center justify-center gap-1 ${
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
        </div>

      </div>
    </div>
  );
};

export default ProductCard;
