import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { useTheme } from '../context/ThemeContext';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';

export function QuickViewDrawer({ product, isOpen, onClose }) {
  const { lang, t, formatPrice } = useLanguage();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const isAr = lang === 'ar';
  const isRtl = isAr;
  const isDawn = theme === 'dawn';

  const [selectedOption, setSelectedOption] = useState('');
  const [quantity, setQuantity] = useState(1);

  const options = Array.isArray(product?.options) && product.options.length > 0
    ? product.options
    : ['Size 6', 'Size 7', 'Size 8', 'Size 9'];

  useEffect(() => {
    if (product) {
      setSelectedOption(options[0] || '');
      setQuantity(1);
    }
  }, [product]);

  if (!isOpen || !product) return null;

  const name = isAr ? product.nameAr : product.nameEn;
  const mainImage = product.imageUrl || product.image;
  const originalPrice = product.originalPrice || Math.round(product.price * 1.3);

  const handleAddToCart = () => {
    addToCart({
      ...product,
      selectedOption,
      quantity
    });
    showToast(t('itemAddedToast'), 'success');
    onClose();
  };

  const handleBuyNow = () => {
    addToCart({
      ...product,
      selectedOption,
      quantity
    });
    onClose();
    navigate('/checkout');
  };

  const handleViewDetails = () => {
    onClose();
    navigate(`/product/${product.id}`);
  };

  const drawerContent = (
    <div className="fixed inset-0 z-[9999] overflow-hidden font-sans" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-[#000000]/80 backdrop-blur-sm animate-drawer-fade z-[9999]"
      />

      {/* Slide-over Drawer Panel */}
      <div className={`fixed inset-y-0 ${isRtl ? 'left-0' : 'right-0'} w-full max-w-md z-[10000] flex flex-col`}>
        <div className={`w-full h-full ${isDawn ? 'bg-[#EFEAE0] text-[#1A1714] border-[#DCD4C7]' : 'bg-[#14110F] text-[#F0EBE0] border-[#2E2823]'} border-x shadow-[0_0_60px_rgba(0,0,0,0.95)] flex flex-col relative z-[10001] overflow-hidden animate-drawer-slide`}>
          
          {/* Top Header */}
          <div className={`p-6 ${isDawn ? 'bg-[#E5DFC5] border-[#DCD4C7]' : 'bg-[#1F1B17] border-[#2E2823]'} border-b flex items-center justify-between flex-shrink-0`}>
            <h2 className="font-clash text-lg font-bold uppercase tracking-wider">
              {isAr ? 'اختر الخيارات (CHOOSE OPTIONS)' : 'CHOOSE OPTIONS'}
            </h2>
            <button
              onClick={onClose}
              className={`p-2.5 transition-colors border ${isDawn ? 'bg-[#EFEAE0] border-[#DCD4C7] text-[#524C44] hover:text-[#C97B22]' : 'bg-[#14110F] border-[#2E2823] text-[#8E877D] hover:text-[#E0A93B]'}`}
            >
              <X size={20} />
            </button>
          </div>

          {/* Drawer Body Content */}
          <div className="p-6 space-y-6 flex-1 overflow-y-auto">
            {/* Product Summary Lockup */}
            <div className={`flex gap-4 items-start border-b ${isDawn ? 'border-[#DCD4C7]' : 'border-[#2E2823]'} pb-6`}>
              <div className={`w-24 h-28 ${isDawn ? 'bg-[#FAF6F0] border-[#DCD4C7]' : 'bg-[#0A0C16] border-[#28305F]'} border shrink-0 overflow-hidden flex items-center justify-center p-2`}>
                {mainImage ? (
                  <img src={mainImage} alt={name} className="w-full h-full object-cover" />
                ) : (
                  <span className="font-mono text-[10px] text-ash uppercase tracking-wider">3D Epoxy Sticker</span>
                )}
              </div>

              <div className="space-y-1 font-space">
                <span className={`font-mono text-[10px] uppercase tracking-widest font-bold block ${isDawn ? 'text-[#C97B22]' : 'text-[#E0A93B]'}`}>
                  DUAT CRAFT
                </span>
                <h3 className="font-bold text-base leading-snug">{name}</h3>
                
                {/* Price Display */}
                <div className="flex items-center gap-3 pt-1 font-mono">
                  <span className="text-red-500 font-bold text-lg">
                    {formatPrice(product.price)}
                  </span>
                  {originalPrice > product.price && (
                    <span className={`line-through text-sm ${isDawn ? 'text-[#8E877D]' : 'text-[#8E98BF]/60'}`}>
                      {formatPrice(originalPrice)}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Option Selector Pills */}
            <div className="space-y-3">
              <label className={`font-mono text-xs uppercase tracking-widest block ${isDawn ? 'text-[#524C44]' : 'text-[#8E98BF]'}`}>
                {isAr ? 'المقاس / الخيار:' : 'OPTION / SIZE:'}
                <span className="font-bold ml-2 mr-2">{selectedOption}</span>
              </label>

              <div className="flex flex-wrap gap-2.5">
                {options.map((opt) => {
                  const isSelected = selectedOption === opt;
                  return (
                    <button
                      key={opt}
                      onClick={() => setSelectedOption(opt)}
                      className={`px-4 py-2.5 font-mono text-xs border transition-all ${
                        isSelected
                          ? isDawn
                            ? 'border-[#C97B22] bg-[#C97B22]/15 text-[#C97B22] font-bold shadow-sm'
                            : 'border-[#E0A93B] bg-[#E0A93B]/15 text-[#E0A93B] font-bold shadow-sm'
                          : isDawn
                            ? 'border-[#DCD4C7] bg-[#FAF6F0] text-[#1A1714] hover:border-[#C97B22]'
                            : 'border-[#2E2823] bg-[#1F1B17] text-[#F0EBE0] hover:border-[#E0A93B]'
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="space-y-2 pt-2">
              <label className={`font-mono text-xs uppercase tracking-widest block ${isDawn ? 'text-[#524C44]' : 'text-[#8E98BF]'}`}>
                {isAr ? 'الكمية:' : 'QUANTITY:'}
              </label>
              <div className={`flex items-center w-36 border ${isDawn ? 'border-[#DCD4C7] bg-[#FAF6F0]' : 'border-[#2E2823] bg-[#1F1B17]'}`}>
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-3 transition-colors"
                >
                  <Minus size={14} />
                </button>
                <span className="flex-1 text-center font-mono font-bold text-sm">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="p-3 transition-colors"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className={`space-y-3 pt-4 border-t ${isDawn ? 'border-[#DCD4C7]' : 'border-[#2E2823]'} font-mono text-xs font-bold uppercase tracking-wider`}>
              {/* ADD TO CART */}
              <button
                onClick={handleAddToCart}
                className={`w-full py-4 border ${isDawn ? 'border-[#DCD4C7] bg-[#E5DFC5] text-[#1A1714] hover:border-[#C97B22] hover:text-[#C97B22]' : 'border-[#2E2823] bg-[#1F1B17] text-[#F0EBE0] hover:border-[#E0A93B] hover:text-[#E0A93B]'} transition-colors flex items-center justify-center gap-2`}
              >
                <ShoppingBag size={16} />
                <span>{isAr ? 'أضف إلى السلة' : 'ADD TO CART'}</span>
              </button>

              {/* BUY IT NOW */}
              <button
                onClick={handleBuyNow}
                className={`w-full py-4 ${isDawn ? 'bg-[#C97B22] text-[#0A0C16] hover:bg-[#B56A15]' : 'bg-[#E0A93B] text-[#0A0C16] hover:bg-[#D4982A]'} transition-colors shadow-lg flex items-center justify-center gap-2 font-bold`}
              >
                <span>{isAr ? 'الشراء الآن (DIRECT CHECKOUT)' : 'BUY IT NOW'}</span>
              </button>
            </div>

            {/* View Details Link */}
            <div className="text-center pt-2">
              <button
                onClick={handleViewDetails}
                className={`font-mono text-xs underline underline-offset-4 transition-colors uppercase tracking-widest ${isDawn ? 'text-[#524C44] hover:text-[#C97B22]' : 'text-[#8E98BF] hover:text-[#E0A93B]'}`}
              >
                {isAr ? 'مشاهدة التفاصيل كاملة' : 'VIEW DETAILS'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(drawerContent, document.body);
}
