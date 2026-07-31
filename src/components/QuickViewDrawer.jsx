import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { X, Minus, Plus, ShoppingBag, ArrowRight, ArrowLeft } from 'lucide-react';
import { CaseGraphic } from './CaseGraphic';

export function QuickViewDrawer({ product, isOpen, onClose }) {
  const { lang, t, formatPrice } = useLanguage();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const isAr = lang === 'ar';
  const isRtl = isAr;

  const [selectedOption, setSelectedOption] = useState('');
  const [quantity, setQuantity] = useState(1);

  // Available options or default phone models/sizes
  const options = Array.isArray(product?.options) && product.options.length > 0
    ? product.options
    : product?.category === 'cases'
    ? ['iPhone 15 Pro Max', 'iPhone 15 Pro', 'iPhone 14 Pro Max', 'iPhone 13']
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

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-void/80 backdrop-blur-sm transition-opacity animate-fade-in"
      />

      {/* Slide-over Drawer Panel */}
      <div className={`fixed inset-y-0 ${isRtl ? 'left-0' : 'right-0'} max-w-full flex ${isRtl ? 'pl-10' : 'pr-10'}`}>
        <div className="w-screen max-w-md bg-stone border-x border-grave shadow-2xl flex flex-col justify-between overflow-y-auto animate-slide-in-right">
          
          {/* Top Header */}
          <div className="p-6 border-b border-grave flex items-center justify-between bg-stone/90 backdrop-blur">
            <h2 className="font-clash text-lg font-bold uppercase tracking-wider text-bone">
              {isAr ? 'اختر الخيارات (Choose options)' : 'Choose options'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-ash hover:text-gold border border-transparent hover:border-grave transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Drawer Content */}
          <div className="p-6 space-y-6 flex-1 overflow-y-auto">
            {/* Product Summary Lockup */}
            <div className="flex gap-4 items-start border-b border-grave/60 pb-6">
              <div className="w-24 h-28 bg-void border border-grave shrink-0 overflow-hidden flex items-center justify-center p-2">
                {mainImage ? (
                  <img src={mainImage} alt={name} className="w-full h-full object-cover" />
                ) : (
                  <CaseGraphic finish={product.caseTypeId || 'clear'} size="sm" showLabel={false} />
                )}
              </div>

              <div className="space-y-1 font-space">
                <span className="font-mono text-[10px] uppercase text-gold tracking-widest font-bold block">
                  DUAT CRAFT
                </span>
                <h3 className="font-bold text-bone text-base leading-snug">{name}</h3>
                
                {/* Price Display with Strikethrough Discount */}
                <div className="flex items-center gap-3 pt-1 font-mono">
                  <span className="text-red-500 font-bold text-lg">
                    {formatPrice(product.price)}
                  </span>
                  {originalPrice > product.price && (
                    <span className="text-ash/60 line-through text-sm">
                      {formatPrice(originalPrice)}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Option Selector Pills */}
            <div className="space-y-3">
              <label className="font-mono text-xs text-ash uppercase tracking-widest block">
                {product.category === 'cases' ? (isAr ? 'موديل الهاتف:' : 'Phone Model:') : (isAr ? 'المقاس / الخيار:' : 'Option / Size:')}
                <span className="text-bone font-bold mr-2 ml-2">{selectedOption}</span>
              </label>

              <div className="flex flex-wrap gap-2.5">
                {options.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setSelectedOption(opt)}
                    className={`px-4 py-2 font-mono text-xs border transition-all ${
                      selectedOption === opt
                        ? 'border-gold bg-gold/15 text-gold font-bold shadow-md shadow-gold/10 scale-[1.02]'
                        : 'border-grave bg-coal/60 text-bone hover:border-gold/50'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="space-y-2 pt-2">
              <label className="font-mono text-xs text-ash uppercase tracking-widest block">
                {isAr ? 'الكمية:' : 'Quantity:'}
              </label>
              <div className="flex items-center w-36 border border-grave bg-coal">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-3 text-ash hover:text-bone transition-colors"
                >
                  <Minus size={14} />
                </button>
                <span className="flex-1 text-center font-mono font-bold text-bone text-sm">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="p-3 text-ash hover:text-bone transition-colors"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-4 border-t border-grave/60 font-mono text-xs font-bold uppercase tracking-wider">
              {/* ADD TO CART */}
              <button
                onClick={handleAddToCart}
                className="w-full py-4 border border-grave bg-coal hover:border-gold hover:text-gold text-bone transition-colors flex items-center justify-center gap-2"
              >
                <ShoppingBag size={16} />
                <span>{isAr ? 'أضف إلى السلة' : 'ADD TO CART'}</span>
              </button>

              {/* BUY IT NOW */}
              <button
                onClick={handleBuyNow}
                className="w-full py-4 bg-gold text-[#050505] hover:bg-gold-light transition-colors shadow-lg shadow-gold/20 flex items-center justify-center gap-2"
              >
                <span>{isAr ? 'الشراء الآن (Direct Checkout)' : 'BUY IT NOW'}</span>
              </button>
            </div>

            {/* View Details Link */}
            <div className="text-center pt-2">
              <button
                onClick={handleViewDetails}
                className="font-mono text-xs text-ash hover:text-gold underline underline-offset-4 transition-colors uppercase tracking-widest"
              >
                {isAr ? 'مشاهدة التفاصيل كاملة (View details)' : 'View details'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
