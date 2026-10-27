import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useProducts } from '../context/ProductsContext';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { ProductCard } from '../components/ProductCard';
import { StickerIcon } from '../components/StickerIcon';
import {
  Star,
  ShoppingBag,
  Check,
  ChevronDown,
  ChevronUp,
  Minus,
  Plus
} from 'lucide-react';

export function ProductDetailView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, getProductById } = useProducts();
  const { lang, t, formatPrice } = useLanguage();
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const isAr = lang === 'ar';

  const product = getProductById(id);

  // Images Gallery
  const primaryImg = product?.imageUrl || product?.image;
  const images = Array.from(new Set([
    primaryImg,
    ...(Array.isArray(product?.images) ? product.images : [])
  ].filter(Boolean)));

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  // Reviews State
  const [reviewsList, setReviewsList] = useState(product?.reviews || []);

  useEffect(() => {
    if (product?.reviews) {
      setReviewsList(product.reviews);
    }
  }, [product]);

  // Accordion open states
  const [openAccordions, setOpenAccordions] = useState({
    desc: true,
    craft: false,
    warranty: false
  });

  // Options list
  const options = Array.isArray(product?.options) && product.options.length > 0
    ? product.options
    : ['Size 6', 'Size 7', 'Size 8', 'Size 9'];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setActiveImageIndex(0);
    if (options.length > 0) setSelectedOption(options[0]);
    setQuantity(1);
  }, [id]);

  if (!product || product.is_active === false || product.isActive === false) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-ash font-mono text-sm space-y-4">
        <p>المنتج غير موجود أو تم حذفه.</p>
        <Link to="/shop" className="btn-primary inline-block px-6 py-3 text-xs">
          العودة للمتجر
        </Link>
      </div>
    );
  }

  const name = isAr ? product.nameAr : product.nameEn;
  const description = isAr ? product.descriptionAr : product.descriptionEn;
  const craftTag = isAr ? product.craftTagAr : product.craftTagEn;
  const originalPrice = Number(product.originalPrice) || 0;
  const discountPercent = originalPrice > product.price ? Math.round(((originalPrice - product.price) / originalPrice) * 100) : 0;

  const toggleAccordion = (key) => {
    setOpenAccordions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleAddToCart = () => {
    addToCart({
      ...product,
      selectedOption,
      quantity
    });
    setAdded(true);
    showToast(t('itemAddedToast'), 'success');
    setTimeout(() => setAdded(false), 1500);
  };

  const handleBuyNow = () => {
    addToCart({
      ...product,
      selectedOption,
      quantity
    });
    navigate('/checkout');
  };

  // Related Products
  const relatedProducts = products
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16 min-h-screen font-sans">
      
      {/* 1. BREADCRUMB NAVIGATION */}
      <div className="flex items-center gap-2 font-mono text-xs text-ash uppercase tracking-wider">
        <Link to="/" className="hover:text-gold transition-colors">{isAr ? 'الرئيسية' : 'Home'}</Link>
        <span>/</span>
        <Link to="/shop" className="hover:text-gold transition-colors">{isAr ? 'المتجر' : 'Shop'}</Link>
        <span>/</span>
        <span className="text-gold font-bold truncate max-w-[200px]">{name}</span>
      </div>

      {/* 2. MAIN PRODUCT SECTION (2 COLUMNS) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
        
        {/* LEFT COLUMN: IMAGE GALLERY WITH THUMBNAILS */}
        <div className="lg:col-span-7 flex flex-col md:flex-row gap-4 items-start">
          {/* Thumbnails Strip (Left on Desktop) */}
          {images.length > 1 && (
            <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto max-h-[500px] scrollbar-none order-2 md:order-1">
              {images.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-16 h-20 border shrink-0 bg-void overflow-hidden transition-all ${
                    activeImageIndex === idx ? 'border-gold shadow-md shadow-gold/20 scale-105' : 'border-grave opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={imgUrl} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Main Visual Display Box */}
          <div className="flex-1 w-full bg-void border border-grave aspect-[3/4] relative overflow-hidden flex items-center justify-center p-6 card-depth-highlight order-1 md:order-2">
            {images.length > 0 && images[0] ? (
              <img
                src={images[activeImageIndex] || images[0]}
                alt={name}
                className="w-full h-full object-contain object-center transition-all duration-300 p-4"
              />
            ) : (product?.stickerRenderId || product?.id?.startsWith('ar-letter-') || product?.id?.startsWith('en-letter-') || product?.id?.startsWith('month-') || product?.id?.startsWith('year-')) ? (
              <div className="w-full h-full flex items-center justify-center p-6">
                <StickerIcon stickerId={product.stickerRenderId || product.id} size={140} color="#182744" bgColor="#FFFFFF" />
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-void/40">
                <span className="font-mono text-xs text-ash uppercase tracking-widest">Raised 3D Sticker</span>
              </div>
            )}

            {/* Discount Badge */}
            {discountPercent > 0 && (
              <div className="absolute top-4 left-4 bg-red-600 text-white font-mono text-xs font-bold px-2.5 py-1 uppercase tracking-widest shadow">
                -{discountPercent}% OFF
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: PRODUCT SPECS & ACTION DETAILS */}
        <div className="lg:col-span-5 space-y-8 font-space">
          {/* Header Title & Brand */}
          <div className="space-y-2 border-b border-grave pb-6">
            <span className="font-mono text-xs text-gold uppercase tracking-[0.25em] font-bold block">
              DUAT CRAFT / EGYPT
            </span>
            <h1 className="font-clash text-3xl sm:text-4xl uppercase text-bone tracking-tight font-bold leading-tight">
              {name}
            </h1>

            {/* Rating Stars */}
            {Array.isArray(product.reviews) && product.reviews.length > 0 && (
              <div className="flex items-center gap-2 font-mono text-xs text-gold pt-1">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className="fill-gold text-gold" />
                  ))}
                </div>
                <span className="font-bold text-bone">{product.rating || 5.0}</span>
                <span className="text-ash font-normal">({product.reviews.length} {isAr ? 'تقييم' : 'reviews'})</span>
              </div>
            )}
          </div>

          {/* Price Block */}
          <div className="space-y-1">
            <div className="flex items-center gap-4 font-mono">
              <span className="font-clash text-3xl font-bold text-red-500">
                {formatPrice(product.price)}
              </span>
              {originalPrice > product.price && (
                <span className="font-mono text-lg text-ash/60 line-through">
                  {formatPrice(originalPrice)}
                </span>
              )}
            </div>
            <p className="font-mono text-xs text-ash">
              {isAr ? 'السعر قبل الشحن. التكلفة والموعد بيتأكدوا قبل الدفع.' : 'Price before shipping. Cost and timing are confirmed before payment.'}
            </p>
          </div>

          {/* Option Selector Pills */}
          <div className="space-y-3 pt-2">
            <label className="font-mono text-xs text-ash uppercase tracking-widest block">
              {isAr ? 'المقاس / الخيار:' : 'Size / Option:'}
              <span className="text-gold font-bold mr-2 ml-2">{selectedOption}</span>
            </label>

            <div className="flex flex-wrap gap-2.5">
              {options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => setSelectedOption(opt)}
                  className={`px-4 py-2.5 font-mono text-xs border transition-all ${
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

          {/* Quantity Counter */}
          <div className="space-y-2">
            <label className="font-mono text-xs text-ash uppercase tracking-widest block">
              {isAr ? 'الكمية:' : 'Quantity:'}
            </label>
            <div className="flex items-center w-36 border border-grave bg-coal">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="p-3 text-ash hover:text-bone transition-colors min-h-[44px] min-w-[44px]"
              >
                <Minus size={14} />
              </button>
              <span className="flex-1 text-center font-mono font-bold text-bone text-base">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="p-3 text-ash hover:text-bone transition-colors min-h-[44px] min-w-[44px]"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>

          {/* Action Buttons: Add to Cart & Buy Now */}
          <div className="space-y-3 pt-2 font-mono text-xs font-bold uppercase tracking-wider">
            <button
              onClick={handleAddToCart}
              className={`w-full py-4 border transition-all duration-300 flex items-center justify-center gap-2 min-h-[48px] ${
                added
                  ? 'bg-gold text-void border-gold'
                  : 'bg-coal text-bone border-grave hover:bg-gold hover:text-void hover:border-gold'
              }`}
            >
              {added ? <Check size={18} /> : <ShoppingBag size={18} />}
              <span>{added ? (isAr ? 'تمت الإضافة للسلة!' : 'ADDED TO CART') : (isAr ? 'أضف إلى السلة' : 'ADD TO CART')}</span>
            </button>

            <button
              onClick={handleBuyNow}
              className="w-full py-4 bg-gold text-[#050505] hover:bg-gold-light transition-colors shadow-lg shadow-gold/20 min-h-[48px] font-bold"
            >
              <span>{isAr ? 'الشراء المباشر الآن (BUY IT NOW)' : 'BUY IT NOW'}</span>
            </button>
          </div>

          {/* ACCORDIONS SECTIONS */}
          <div className="border-t border-grave pt-4 divide-y divide-grave font-sans">
            {/* 1. Description & Details */}
            <div className="py-4">
              <button
                onClick={() => toggleAccordion('desc')}
                className="w-full flex items-center justify-between font-mono text-xs uppercase tracking-widest text-bone font-bold text-right"
              >
                <span>{isAr ? 'الوصف والمواصفات (Description & Details)' : 'Description & Details'}</span>
                {openAccordions.desc ? <ChevronUp size={16} className="text-gold" /> : <ChevronDown size={16} className="text-ash" />}
              </button>
              {openAccordions.desc && (
                <div className="pt-3 text-sm text-ash space-y-3 font-space font-light leading-relaxed">
                  <p>{description}</p>
                  {Array.isArray(product.specsAr) && product.specsAr.length > 0 && (
                    <ul className="list-disc list-inside space-y-1 font-mono text-xs text-bone/80 pt-2">
                      {(isAr ? product.specsAr : product.specsEn || []).map((spec, i) => (
                        <li key={i}>{spec}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>

            {/* 2. Materials & Craft */}
            <div className="py-4">
              <button
                onClick={() => toggleAccordion('craft')}
                className="w-full flex items-center justify-between font-mono text-xs uppercase tracking-widest text-bone font-bold text-right"
              >
                <span>{isAr ? 'الخامات والصناعة المصرية (Materials & Craft)' : 'Materials & Craft'}</span>
                {openAccordions.craft ? <ChevronUp size={16} className="text-gold" /> : <ChevronDown size={16} className="text-ash" />}
              </button>
              {openAccordions.craft && (
                <div className="pt-3 text-sm text-ash space-y-2 font-space font-light leading-relaxed">
                  <p>{craftTag || (isAr ? 'صناعة وتشطيب يدوي فاخر في مصر بمواصفات عالمية' : 'Hand-finished in Egypt with luxury grade materials.')}</p>
                </div>
              )}
            </div>

            {/* 3. Warranty & Return Policy */}
            <div className="py-4">
              <button
                onClick={() => toggleAccordion('warranty')}
                className="w-full flex items-center justify-between font-mono text-xs uppercase tracking-widest text-bone font-bold text-right"
              >
                <span>{isAr ? 'شروط الطلب والاستبدال' : 'Order & exchange terms'}</span>
                {openAccordions.warranty ? <ChevronUp size={16} className="text-gold" /> : <ChevronDown size={16} className="text-ash" />}
              </button>
              {openAccordions.warranty && (
                <div className="pt-3 text-sm text-ash space-y-2 font-space font-light leading-relaxed font-mono text-xs">
                  <p>{isAr ? 'بنوضح شروط الاستبدال المناسبة لنوع المنتج قبل تأكيد الدفع.' : 'Exchange terms for this product type are shown before payment is confirmed.'}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 3. CUSTOMER REVIEWS — only render supplied reviews; no unverified submissions */}
      {reviewsList.length > 0 && <div className="border-t border-grave pt-16 space-y-10">
        <div className="text-center space-y-3">
          <span className="font-mono text-xs text-gold uppercase tracking-widest font-bold">CUSTOMER REVIEWS</span>
          <h2 className="font-clash text-3xl uppercase text-bone font-bold">
            {isAr ? 'آراء العملاء' : 'Customer Reviews'}
          </h2>
        </div>

        {/* Rating Summary Bar */}
        <div className="bg-stone border border-grave p-8 max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 card-depth-highlight">
          <div className="text-center sm:text-right space-y-1">
            <div className="font-clash text-5xl font-bold text-bone">{(product.rating || reviewsList.reduce((sum, review) => sum + Number(review.rating || 0), 0) / reviewsList.length).toFixed(1)}</div>
            <div className="flex items-center justify-center sm:justify-start text-gold">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={18} className="fill-gold text-gold" />
              ))}
            </div>
            <p className="font-mono text-xs text-ash">
              {isAr ? `بناءً على ${reviewsList.length} تقييم` : `Based on ${reviewsList.length} review${reviewsList.length === 1 ? '' : 's'}`}
            </p>
          </div>
        </div>

        {/* Customer Reviews List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {reviewsList.map((rev, idx) => (
              <div key={idx} className="bg-stone border border-grave p-6 space-y-3 font-sans rounded card-depth-highlight">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-bone text-sm">{rev.name}</span>
                  </div>
                  <span className="font-mono text-xs text-ash">{rev.date}</span>
                </div>
                <div className="flex items-center text-gold">
                  {[...Array(rev.rating || 5)].map((_, i) => (
                    <Star key={i} size={14} className="fill-gold text-gold" />
                  ))}
                </div>
                <p className="text-sm text-ash leading-relaxed">{rev.commentAr || rev.commentEn || rev.comment}</p>
              </div>
            ))}
        </div>
      </div>}

      {/* 4. YOU MAY ALSO LIKE GRID */}
      {relatedProducts.length > 0 && (
        <div className="border-t border-grave pt-16 space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="font-clash text-2xl uppercase text-bone font-bold">
              {isAr ? 'منتجات قد تعجبك' : 'You may also like'}
            </h2>
            <Link to="/shop" className="font-mono text-xs text-ash hover:text-gold uppercase tracking-widest">
              {isAr ? 'مشاهدة الكل ➔' : 'VIEW ALL ➔'}
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relProd) => (
              <ProductCard key={relProd.id} product={relProd} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
