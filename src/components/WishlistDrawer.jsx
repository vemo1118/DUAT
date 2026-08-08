import React from 'react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import { useTheme } from '../context/ThemeContext';
import { X, Heart, ShoppingBag, Trash2, ArrowRight, ArrowLeft } from 'lucide-react';

export const WishlistDrawer = () => {
  const { wishlistItems, isWishlistOpen, closeWishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { lang, t, formatPrice } = useLanguage();
  const { theme } = useTheme();
  const { showToast } = useToast();

  if (!isWishlistOpen) return null;

  const isAr = lang === 'ar';
  const isDawn = theme === 'dawn';

  const handleMoveToCart = (product) => {
    addToCart(product);
    showToast(isAr ? 'تمت إضافة المنتج إلى السلة!' : 'Item added to cart!', 'success');
  };

  return (
    <div className="fixed inset-0 z-[9999] overflow-hidden" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Backdrop Overlay */}
      <div
        onClick={closeWishlist}
        className="fixed inset-0 bg-[#000000]/80 backdrop-blur-sm animate-drawer-fade z-[9999]"
      />

      {/* Slide-out Drawer Panel */}
      <div className={`fixed inset-y-0 ${isAr ? 'left-0' : 'right-0'} w-full max-w-md z-[10000] flex flex-col`}>
        <div className={`w-full h-full ${isDawn ? 'bg-[#EFEAE0] text-[#1A1714] border-[#DCD4C7]' : 'bg-[#14110F] text-[#F0EBE0] border-[#2E2823]'} border-x shadow-[0_0_60px_rgba(0,0,0,0.95)] flex flex-col relative z-[10001] overflow-hidden animate-drawer-slide`}>
          
          {/* Header */}
          <div className={`p-6 ${isDawn ? 'bg-[#E5DFC5] border-[#DCD4C7]' : 'bg-[#1F1B17] border-[#2E2823]'} border-b flex items-center justify-between flex-shrink-0`}>
            <div className="flex items-center gap-3">
              <Heart size={22} className="text-[#E0A93B] fill-[#E0A93B]" />
              <h2 className="font-clash text-xl uppercase tracking-wider font-bold">
                {isAr ? 'المفضلة' : 'Wishlist'} ({wishlistItems.length})
              </h2>
            </div>
            <button
              onClick={closeWishlist}
              className={`p-2.5 transition-colors border ${isDawn ? 'bg-[#EFEAE0] border-[#DCD4C7] text-[#524C44] hover:text-[#E0A93B]' : 'bg-[#14110F] border-[#2E2823] text-[#8E877D] hover:text-[#E0A93B]'} flex items-center justify-center`}
              aria-label="Close wishlist"
            >
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="flex-grow overflow-y-auto p-6 space-y-4">
            {wishlistItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-16">
                <div className="p-4 rounded-full bg-gold/10 border border-gold/30 text-gold">
                  <Heart size={36} />
                </div>
                <h3 className="font-clash text-lg text-bone uppercase">
                  {isAr ? 'قائمة المفضلة فارغة' : 'Your Wishlist is Empty'}
                </h3>
                <p className="font-mono text-xs text-ash max-w-xs">
                  {isAr ? 'اضغط على رمز القلب في أي منتج لإضافته إلى قائمتك المفضلة والمتابعة لاحقاً.' : 'Click the heart icon on any product to save it here for later.'}
                </p>
              </div>
            ) : (
              wishlistItems.map((product) => {
                const name = isAr ? (product.nameAr || product.nameEn) : product.nameEn;
                const price = product.price || 0;
                const image = product.image || product.images?.[0] || 'https://res.cloudinary.com/ikim5u08/image/upload/f_auto,q_auto/v1785768478/B1_TB_w1zemr.jpg';

                return (
                  <div
                    key={product.id}
                    className={`p-4 border ${isDawn ? 'bg-white border-[#DCD4C7]' : 'bg-[#1C1814] border-[#2E2823]'} rounded-lg flex items-center gap-4 group hover:border-gold/50 transition-all`}
                  >
                    <img
                      src={image}
                      alt={name}
                      className="w-16 h-16 object-contain rounded bg-black/20 p-1 border border-grave shrink-0"
                    />

                    <div className="flex-grow min-w-0">
                      <h4 className="font-clash text-sm font-bold truncate text-bone group-hover:text-gold transition-colors">
                        {name}
                      </h4>
                      <p className="font-mono text-xs text-gold mt-1 font-bold">
                        {formatPrice(price)}
                      </p>
                    </div>

                    <div className="flex flex-col gap-2 shrink-0">
                      <button
                        onClick={() => handleMoveToCart(product)}
                        className="p-2 bg-gold/20 hover:bg-gold text-gold hover:text-void rounded transition-colors text-xs font-mono flex items-center gap-1"
                        title={isAr ? 'أضف للسلة' : 'Add to cart'}
                      >
                        <ShoppingBag size={14} />
                      </button>
                      <button
                        onClick={() => removeFromWishlist(product.id)}
                        className="p-2 text-ash hover:text-red-400 hover:bg-red-950/20 rounded transition-colors text-xs"
                        title={isAr ? 'إزالة' : 'Remove'}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          {wishlistItems.length > 0 && (
            <div className={`p-6 ${isDawn ? 'bg-[#E5DFC5] border-[#DCD4C7]' : 'bg-[#1F1B17] border-[#2E2823]'} border-t space-y-3 flex-shrink-0`}>
              <button
                onClick={clearWishlist}
                className="w-full py-2.5 text-xs font-mono text-ash hover:text-red-400 border border-grave hover:border-red-900/40 rounded transition-colors"
              >
                {isAr ? 'مسح كافة العناصر' : 'Clear All Items'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
