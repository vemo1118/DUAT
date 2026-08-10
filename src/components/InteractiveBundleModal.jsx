import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { X, Check, ShoppingBag, Sparkles, Gift, Tag } from 'lucide-react';
import { ARABIC_LETTER_PRODUCTS, ENGLISH_LETTER_PRODUCTS, MONTH_STICKER_PRODUCTS, YEAR_STICKER_PRODUCTS } from '../data/products';

export function InteractiveBundleModal({ bundle, isOpen, onClose }) {
  const { lang, t, formatPrice } = useLanguage();
  const { addToCart } = useCart();
  const { addToast } = useToast();

  const isAr = lang === 'ar';

  if (!isOpen || !bundle) return null;

  // Determine required item selections based on bundle type
  const isLettersBundle = bundle.id === 'bundle-name-4letters';
  const isTrioBundle = bundle.id === 'bundle-trio-3pack';
  const isDateBundle = bundle.id === 'bundle-year-month';
  const is5PackBundle = bundle.id === 'bundle-custom-5pack';

  const requiredCount = isLettersBundle ? 4 : isTrioBundle ? 3 : isDateBundle ? 2 : is5PackBundle ? 5 : 6;

  // Local Selection State
  const [selectedItems, setSelectedItems] = useState([]);
  const [customText, setCustomText] = useState('');

  // Slogan options for Trio Pack
  const SLOGAN_OPTIONS = [
    { id: 'st-born-dawn', nameAr: 'طالع نور', nameEn: 'Born at Dawn' },
    { id: 'st-through-night', nameAr: 'عدّي الليل', nameEn: 'Through the Night' },
    { id: 'st-crescent', nameAr: 'الهلال', nameEn: 'Crescent Moon' },
    { id: 'st-starry', nameAr: 'سماء الليل', nameEn: 'Starry Night' },
    { id: 'st-sun', nameAr: 'شمس دوات', nameEn: 'DUAT Sun' },
    { id: 'st-duat', nameAr: 'شعار دوات', nameEn: 'DUAT Logo' }
  ];

  // Letter options for 4-Letter bundle
  const ALL_LETTERS = [...ARABIC_LETTER_PRODUCTS.slice(0, 28), ...ENGLISH_LETTER_PRODUCTS.slice(0, 26)];
  const DATE_OPTIONS = [...MONTH_STICKER_PRODUCTS, ...YEAR_STICKER_PRODUCTS];
  const ALL_MIX_OPTIONS = [...SLOGAN_OPTIONS, ...ARABIC_LETTER_PRODUCTS.slice(0, 15), ...MONTH_STICKER_PRODUCTS.slice(0, 6), ...YEAR_STICKER_PRODUCTS.slice(0, 6)];

  const getAvailableOptions = () => {
    if (isLettersBundle) return ALL_LETTERS;
    if (isTrioBundle) return SLOGAN_OPTIONS;
    if (isDateBundle) return DATE_OPTIONS;
    return ALL_MIX_OPTIONS;
  };

  const toggleSelectItem = (item) => {
    const isSelected = selectedItems.some((s) => s.id === item.id);
    if (isSelected) {
      setSelectedItems(selectedItems.filter((s) => s.id !== item.id));
    } else {
      if (selectedItems.length < requiredCount) {
        setSelectedItems([...selectedItems, item]);
      } else {
        addToast(
          isAr
            ? `يمكنك اختيار ${requiredCount} استيكرات فقط لهذا البندل`
            : `You can select only ${requiredCount} items for this bundle`,
          'info'
        );
      }
    }
  };

  const handleConfirmBundle = () => {
    const finalBundleItem = {
      ...bundle,
      customDetails: {
        selectedItems,
        customText,
        selectedNames: selectedItems.map((i) => (isAr ? i.nameAr : i.nameEn)).join(' + ')
      }
    };

    addToCart(finalBundleItem, 1, {});
    addToast(
      isAr
        ? `تم تخصيص وإضافة ${bundle.nameAr} لسلة الشراء! 🎉`
        : `Added customized ${bundle.nameEn} to cart! 🎉`,
      'success'
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-void/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-stone border border-grave max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl relative card-depth-highlight">
        
        {/* Header */}
        <div className="p-6 border-b border-grave flex items-center justify-between bg-coal">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/40 flex items-center justify-center text-gold">
              <Gift size={20} />
            </div>
            <div>
              <span className="font-mono text-[10px] text-gold uppercase tracking-widest font-bold">
                {isAr ? 'تخصيص البندل المجمع' : 'BUNDLE CONFIGURATOR'}
              </span>
              <h2 className="font-clash text-xl uppercase text-bone">
                {isAr ? bundle.nameAr : bundle.nameEn}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-ash hover:text-gold border border-grave bg-stone"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-grow">
          
          {/* Instructions */}
          <div className="bg-coal border border-grave p-4 font-mono text-xs text-bone flex items-center justify-between">
            <span>
              {isAr
                ? `اختر (${requiredCount}) استيكرات لتكملة هذا البندل:`
                : `Select (${requiredCount}) items to complete this bundle:`}
            </span>
            <span className="text-gold font-bold">
              {selectedItems.length} / {requiredCount} {isAr ? 'تم الاختيار' : 'Selected'}
            </span>
          </div>

          {/* Letter / Name Text input for 4-Letters bundle */}
          {isLettersBundle && (
            <div className="space-y-2">
              <label className="font-mono text-xs text-bone uppercase block font-bold">
                {isAr ? '✍️ أو اكتب اسمك لتركيب حروفه تلقائياً:' : '✍️ Or type your name to auto-pick letters:'}
              </label>
              <input
                type="text"
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder={isAr ? 'مثال: عمر، مريم، DUAT' : 'e.g. Omar, Mary, DUAT'}
                className="w-full bg-coal border border-grave px-4 py-2.5 text-xs font-mono text-bone focus:border-gold focus:outline-none"
                maxLength={4}
              />
            </div>
          )}

          {/* Options Grid */}
          <div className="space-y-3">
            <h4 className="font-mono text-xs text-ash uppercase tracking-wider">
              {isAr ? 'استيكرات المتاحة للتحديد:' : 'Available Items for Selection:'}
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-60 overflow-y-auto pr-1">
              {getAvailableOptions().map((item) => {
                const isSelected = selectedItems.some((s) => s.id === item.id);
                const name = isAr ? item.nameAr : item.nameEn;

                return (
                  <button
                    key={item.id}
                    onClick={() => toggleSelectItem(item)}
                    className={`p-3 font-mono text-xs border text-left flex items-center justify-between transition-all ${
                      isSelected
                        ? 'border-gold bg-gold/10 text-gold font-bold shadow-md'
                        : 'border-grave bg-coal text-bone hover:border-gold/40'
                    }`}
                  >
                    <span className="truncate">{name}</span>
                    {isSelected && <Check size={14} className="text-gold flex-shrink-0 ml-1" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Summary Pills */}
          {selectedItems.length > 0 && (
            <div className="p-4 bg-coal border border-grave space-y-2">
              <span className="font-mono text-[10px] text-ash uppercase block">
                {isAr ? 'محتويات بندلك المحدد:' : 'Your Selected Items:'}
              </span>
              <div className="flex flex-wrap gap-2">
                {selectedItems.map((item, idx) => (
                  <span
                    key={idx}
                    className="bg-stone border border-gold/40 text-gold font-mono text-[11px] px-2.5 py-1 flex items-center gap-1.5"
                  >
                    <span>{isAr ? item.nameAr : item.nameEn}</span>
                    <button
                      onClick={() => toggleSelectItem(item)}
                      className="hover:text-red-400"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-6 border-t border-grave bg-coal flex items-center justify-between">
          <div>
            <span className="font-mono text-[10px] text-ash uppercase block">{isAr ? 'سعر البندل المخفض:' : 'Bundle Price:'}</span>
            <span className="font-mono text-2xl font-bold text-gold">{formatPrice(bundle.price)}</span>
          </div>

          <button
            onClick={handleConfirmBundle}
            className="btn-primary py-3 px-6 font-mono text-xs font-bold uppercase tracking-widest flex items-center gap-2"
          >
            <ShoppingBag size={16} />
            <span>{isAr ? 'تأكيد وإضافة للسلة' : 'CONFIRM & ADD TO CART'}</span>
          </button>
        </div>

      </div>
    </div>
  );
}

export default InteractiveBundleModal;
