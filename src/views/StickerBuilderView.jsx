import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toPng } from 'html-to-image';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { uploadDesignDataUrl } from '../services/orderApi';
import { SunDisc } from '../components/SunDisc';
import { Type, Image as ImageIcon, Sparkles, ShoppingBag, RotateCcw, Upload, Check, Info, ChevronLeft, ChevronRight, Layers, Palette, Eye, Shield, Tag, Loader2 } from 'lucide-react';

const EXPORT_LAYOUTS = {
  pill: { width: 1200, height: 480, borderRadius: 240, paddingX: 120, paddingY: 70 },
  badge: { width: 1200, height: 560, borderRadius: 48, paddingX: 110, paddingY: 80 },
  circle: { width: 800, height: 800, borderRadius: 400, paddingX: 100, paddingY: 100 },
  shield: { width: 1000, height: 700, borderRadius: 60, paddingX: 110, paddingY: 100 }
};

const EXPORT_BACKGROUNDS = {
  obsidian: { background: '#121214', borderColor: 'rgba(224, 169, 59, 0.45)' },
  clear: { background: 'rgba(10, 12, 22, 0.35)', borderColor: 'rgba(239, 234, 224, 0.45)' },
  'gold-foil': { background: 'linear-gradient(90deg, #8f5d12 0%, #e0a93b 50%, #8f5d12 100%)', borderColor: '#e0a93b' },
  ivory: { background: '#efeae0', borderColor: '#d8cfbc' },
  amber: { background: 'rgba(217, 119, 6, 0.38)', borderColor: 'rgba(217, 119, 6, 0.75)' }
};

export function getStickerExportLayout(cutShape, text) {
  const layout = EXPORT_LAYOUTS[cutShape] || EXPORT_LAYOUTS.pill;
  const characterCount = Math.max(1, Array.from(String(text || '').trim()).length);
  const availableWidth = layout.width - (layout.paddingX * 2);
  const estimatedCharacterWidth = cutShape === 'circle' ? 0.72 : 0.66;
  const maxByWidth = availableWidth / (characterCount * estimatedCharacterWidth);
  const shapeMaximum = cutShape === 'circle' ? 112 : 128;

  return {
    ...layout,
    fontSize: Math.max(38, Math.min(shapeMaximum, Math.floor(maxByWidth)))
  };
}

export function StickerBuilderView() {
  const { lang, t, formatPrice } = useLanguage();
  const { addToCart } = useCart();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const isAr = lang === 'ar';
  const isRtl = isAr;
  const ArrowIcon = isRtl ? ChevronLeft : ChevronRight;

  const [isUploading, setIsUploading] = useState(false);

  // Builder Mode: 'text' or 'image'
  const [mode, setMode] = useState('text');

  // Text Sticker State
  const [customText, setCustomText] = useState('طالع نور');
  const [selectedFont, setSelectedFont] = useState('camel');
  const [textColor, setTextColor] = useState('#E0A93B');
  const [bgFinish, setBgFinish] = useState('obsidian');
  const [cutShape, setCutShape] = useState('pill');

  // Image Sticker State
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imageScale, setImageScale] = useState(100);
  const [borderStyle, setBorderStyle] = useState('gold');
  const [imgCutShape, setImgCutShape] = useState('diecut');

  // Common Options
  const [quantity, setQuantity] = useState(1);
  const [designNotes, setDesignNotes] = useState('');

  const stickerExportRef = useRef(null);

  const FONTS = [
    { id: 'camel', nameAr: 'خط دوات الملكي', nameEn: 'DUAT Royal Camel', fontClass: 'font-arabic-camel', sample: 'دوات' },
    { id: 'ruqaa', nameAr: 'خط رقعة ديواني', nameEn: 'Traditional Ruqaa', fontClass: 'font-arabic-ruqaa', sample: 'رقعة' },
    { id: 'kufi', nameAr: 'خط كوفي هندسي', nameEn: 'Geometric Kufi', fontClass: 'font-arabic-kufi', sample: 'كوفي' },
    { id: 'amiri', nameAr: 'خط أميري نسخي', nameEn: 'Amiri Naskh', fontClass: 'font-arabic-amiri', sample: 'نسخ' },
    { id: 'rakkas', nameAr: 'خط رقّاص عريض', nameEn: 'Rakkas Heavy', fontClass: 'font-arabic-rakkas', sample: 'رقاص' },
    { id: 'cairo', nameAr: 'خط كايبرو عصري', nameEn: 'Cairo Modern Bold', fontClass: 'font-arabic-cairo', sample: 'مودرن' },
    { id: 'changa', nameAr: 'خط تشانجا مجسّم', nameEn: 'Changa 3D Tech', fontClass: 'font-arabic-changa', sample: 'مجسم' },
    { id: 'katibeh', nameAr: 'خط كتيبة ديواني', nameEn: 'Katibeh Script', fontClass: 'font-arabic-katibeh', sample: 'كتيبة' }
  ];

  const TEXT_COLORS = [
    { id: 'gold', color: '#E0A93B', nameAr: 'ذهب ١٨ قيراط', nameEn: '18k Gold' },
    { id: 'white', color: '#FFFFFF', nameAr: 'أبيض ناصع', nameEn: 'Pure White' },
    { id: 'obsidian', color: '#121214', nameAr: 'أسود فحمي', nameEn: 'Obsidian Black' },
    { id: 'ember', color: '#E53E3E', nameAr: 'أحمر جمري', nameEn: 'Crimson Ember' },
    { id: 'navy', color: '#3182CE', nameAr: 'أزرق ملكي', nameEn: 'Royal Navy' },
    { id: 'emerald', color: '#38A169', nameAr: 'أخضر مرامي', nameEn: 'Emerald Sage' }
  ];

  const BG_FINISHES = [
    { id: 'obsidian', nameAr: 'أسود فحم لامع', nameEn: 'Obsidian Gloss', bg: 'bg-[#121214]', border: 'border-gold/40' },
    { id: 'clear', nameAr: 'شفاف أكريليك', nameEn: 'Clear Acrylic', bg: 'bg-void/40 backdrop-blur-md', border: 'border-bone/30' },
    { id: 'gold-foil', nameAr: 'خلفية رقائق الذهب', nameEn: 'Gold Foil', bg: 'bg-gradient-to-r from-gold/30 via-gold/50 to-gold/30', border: 'border-gold' },
    { id: 'ivory', nameAr: 'عاجي ألباستر', nameEn: 'Alabaster Ivory', bg: 'bg-[#EFEAE0]', border: 'border-[#D8CFBC]' },
    { id: 'amber', nameAr: 'صمغ عنبري شفاف', nameEn: 'Translucent Amber', bg: 'bg-[#D97706]/20', border: 'border-[#D97706]/60' }
  ];

  const CUT_SHAPES = [
    { id: 'pill', nameAr: 'قرص بيضاوي (Pill)', nameEn: 'Oval Pill', class: 'rounded-full px-8 py-4' },
    { id: 'badge', nameAr: 'شارة مستطيلة (Badge)', nameEn: 'Rectangular Badge', class: 'rounded-md px-6 py-4' },
    { id: 'circle', nameAr: 'قبة دائرية (Circle)', nameEn: 'Circle Dome', class: 'rounded-full w-32 h-32 flex items-center justify-center p-4' },
    { id: 'shield', nameAr: 'درع العبور (Shield)', nameEn: 'Shield Cut', class: 'rounded-b-2xl rounded-t-sm px-6 py-4' }
  ];

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        addToast(isAr ? 'حجم الصورة يجب ألا يتجاوز ٥ ميجابايت' : 'Image size must be less than 5MB', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target?.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const basePrice = 100;

  const handleAddToCart = async () => {
    if (mode === 'text' && !customText.trim()) {
      addToast(isAr ? 'برجاء كتابة النص الخاص بالاستيكر أولاً' : 'Please enter custom sticker text first', 'error');
      return;
    }
    if (mode === 'image' && !uploadedImage) {
      addToast(isAr ? 'برجاء رفع صورة الاستيكر أولاً' : 'Please upload an image first', 'error');
      return;
    }

    setIsUploading(true);
    let stickerSnapshot = uploadedImage;
    if (mode === 'text' && stickerExportRef.current) {
      try {
        if (document.fonts?.ready) await document.fonts.ready;
        const exportLayout = getStickerExportLayout(cutShape, customText);
        stickerSnapshot = await toPng(stickerExportRef.current, {
          cacheBust: true,
          backgroundColor: 'transparent',
          pixelRatio: 2,
          width: exportLayout.width,
          height: exportLayout.height
        });
      } catch (err) {
        console.warn('Canvas snapshot capture fallback:', err);
      }
    }

    if (!stickerSnapshot) {
      setIsUploading(false);
      addToast(isAr ? 'تعذر تجهيز التصميم، حاول مرة أخرى' : 'Could not prepare the design. Please retry.', 'error');
      return;
    }

    let uploadResult;
    try {
      uploadResult = await uploadDesignDataUrl(stickerSnapshot);
    } catch (error) {
      console.error('Design upload failed:', error.message);
      setIsUploading(false);
      addToast(isAr ? 'تعذر رفع التصميم بأمان، حاول مرة أخرى' : 'Secure design upload failed. Please retry.', 'error');
      return;
    }

    const customItem = {
      id: `custom-sticker-${Date.now()}`,
      category: 'stickers',
      nameAr: mode === 'text' ? `استيكر مخصص: "${customText}"` : `استيكر صورة مخصصة`,
      nameEn: mode === 'text' ? `Custom Sticker: "${customText}"` : `Custom Image Sticker`,
      price: basePrice,
      tagAr: 'استيكر إيبوكسي مجسم مخصص',
      tagEn: 'Custom 3D Epoxy Dome Sticker',
      craftTagAr: 'تصنيع خاص حسب الطلب • مصر',
      craftTagEn: 'Custom Made to Order • Egypt',
      designSnapshot: stickerSnapshot,
      design_image_path: uploadResult.path,
      design_upload_token: uploadResult.claimToken,
      specsAr: [
        mode === 'text' ? `النص: ${customText}` : `استيكر صورة مرفقة`,
        `القص والتشكيل: ${cutShape}`,
        `التشطيب: إيبوكسي ثلاثي الأبعاد 3D Polyurethane`
      ],
      specsEn: [
        mode === 'text' ? `Text: ${customText}` : `Uploaded Custom Image`,
        `Cut Shape: ${cutShape}`,
        `Finish: 3D Polyurethane Epoxy Dome`
      ],
      customDetails: {
        mode,
        customText,
        selectedFont,
        textColor,
        bgFinish,
        cutShape,
        designNotes,
        design_image_path: uploadResult.path,
        design_upload_token: uploadResult.claimToken
      },
      quantity,
      is_active: true
    };

    addToCart(customItem);
    setIsUploading(false);
    addToast(isAr ? 'تمت إضافة الاستيكر المخصص إلى سلة الشراء! 🎨' : 'Custom sticker added to cart! 🎨', 'success');
    navigate('/stickers');
  };

  const activeFontObj = FONTS.find(f => f.id === selectedFont) || FONTS[0];
  const activeBgObj = BG_FINISHES.find(b => b.id === bgFinish) || BG_FINISHES[0];
  const activeShapeObj = CUT_SHAPES.find(s => s.id === cutShape) || CUT_SHAPES[0];
  const exportLayout = getStickerExportLayout(cutShape, customText);
  const exportBackground = EXPORT_BACKGROUNDS[bgFinish] || EXPORT_BACKGROUNDS.obsidian;
  const totalPrice = basePrice * quantity;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10 min-h-screen">
      {/* Fixed-size print artwork. It stays off-screen so responsive preview styles never crop order files. */}
      {mode === 'text' && (
        <div aria-hidden="true" className="fixed -left-[10000px] top-0 pointer-events-none">
          <div
            ref={stickerExportRef}
            dir="auto"
            className="relative flex items-center justify-center text-center overflow-hidden border-[8px]"
            style={{
              width: `${exportLayout.width}px`,
              height: `${exportLayout.height}px`,
              padding: `${exportLayout.paddingY}px ${exportLayout.paddingX}px`,
              borderRadius: cutShape === 'shield'
                ? `48px 48px ${exportLayout.borderRadius}px ${exportLayout.borderRadius}px`
                : `${exportLayout.borderRadius}px`,
              borderColor: exportBackground.borderColor,
              background: exportBackground.background,
              boxShadow: 'inset 0 12px 24px rgba(255,255,255,0.3), inset 0 -18px 36px rgba(0,0,0,0.42)',
              boxSizing: 'border-box'
            }}
          >
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: 'linear-gradient(35deg, transparent 18%, rgba(255,255,255,0.2) 52%, transparent 78%)' }}
            />
            <span
              className={`relative z-10 block w-full font-bold drop-shadow-md ${activeFontObj.fontClass}`}
              style={{
                color: textColor,
                fontSize: `${exportLayout.fontSize}px`,
                lineHeight: 1.7,
                padding: '0.28em 0.12em 0.38em',
                whiteSpace: 'nowrap',
                boxSizing: 'border-box'
              }}
            >
              {customText.trim() || (isAr ? 'اكتب كلمتك' : 'Your Text')}
            </span>
          </div>
        </div>
      )}
      
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 font-mono text-xs text-ash uppercase tracking-wider">
        <Link to="/" className="hover:text-gold transition-colors">{isAr ? 'الرئيسية' : 'Home'}</Link>
        <ArrowIcon size={12} className="text-grave" />
        <Link to="/stickers" className="hover:text-gold transition-colors">{isAr ? 'الاستيكرات' : 'Stickers'}</Link>
        <ArrowIcon size={12} className="text-grave" />
        <span className="text-gold font-bold">{isAr ? 'بيلدر الاستيكرز' : 'Sticker Builder'}</span>
      </div>

      {/* Header Title */}
      <div className="border-b border-grave pb-6 space-y-2">
        <div className="flex items-center gap-2.5 font-mono text-xs uppercase tracking-[0.25em] text-gold font-bold">
          <SunDisc size={14} variant="gold" />
          <span>{t('stickerBuilderEyebrow')}</span>
        </div>
        <h1 className="font-clash text-3xl sm:text-5xl uppercase text-bone tracking-tight">
          {isAr ? 'مصمم الاستيكرات المخصص 🎨' : 'Custom Sticker Builder 🎨'}
        </h1>
        <p className="font-space text-xs sm:text-sm text-bone/70 max-w-2xl">
          {isAr
            ? 'صمّم استيكر إيبوكسي مجسم 3D بالكلمة اللي تختارها أو صورتك الخاصة، بتشطيب عنبري مقاوم للماء والخدش!'
            : 'Design your custom 3D epoxy sticker with custom text or image with waterproof resin finish.'}
        </p>
      </div>

      {/* MAIN BUILDER LAYOUT: LEFT STICKER PREVIEW CANVAS + RIGHT CONTROLS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT CANVAS PREVIEW (LG: 7 COLS) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Mode Switcher Tabs */}
          <div className="bg-coal p-1.5 border border-grave flex items-center gap-2 rounded-sm">
            <button
              onClick={() => setMode('text')}
              className={`flex-1 py-3 px-4 font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                mode === 'text'
                  ? 'bg-gold text-void font-bold shadow-md'
                  : 'text-bone hover:text-gold'
              }`}
            >
              <Type size={16} />
              <span>{isAr ? 'استيكر نص / كلمات' : 'Custom Text Sticker'}</span>
            </button>

            <button
              onClick={() => setMode('image')}
              className={`flex-1 py-3 px-4 font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                mode === 'image'
                  ? 'bg-gold text-void font-bold shadow-md'
                  : 'text-bone hover:text-gold'
              }`}
            >
              <ImageIcon size={16} />
              <span>{isAr ? 'استيكر صورة / لوجو' : 'Custom Image Sticker'}</span>
            </button>
          </div>

          {/* REALTIME 3D STICKER CANVAS PREVIEW */}
          <div className="bg-stone/90 border border-grave p-8 sm:p-14 relative flex flex-col items-center justify-center min-h-[380px] sm:min-h-[460px] overflow-hidden card-depth-highlight">
            
            {/* Grid alignment overlay background */}
            <div className="absolute inset-0 bg-noise opacity-30 pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

            {/* Sticker Dimension Tag Top Left */}
            <div className="absolute top-4 left-4 z-10 font-mono text-[10px] text-ash uppercase bg-coal/80 px-2.5 py-1 border border-grave flex items-center gap-1.5">
              <Eye size={12} className="text-gold" />
              <span>{isAr ? 'معاينة الاستيكر المجسم (3D)' : '3D Epoxy Dome Preview'}</span>
            </div>

            {/* Scale / Dimension guide badge */}
            <div className="absolute bottom-4 right-4 z-10 font-mono text-[10px] text-ash uppercase bg-coal/80 px-2.5 py-1 border border-grave">
              <span>
                {isAr
                  ? `المقاس: ${Math.max(3.5, (customText.length * 0.75 + 2.0)).toFixed(1)} × ${cutShape === 'circle' ? Math.max(3.5, (customText.length * 0.75 + 2.0)).toFixed(1) : 2.5} سم تقريباً`
                  : `Approx: ${Math.max(3.5, (customText.length * 0.75 + 2.0)).toFixed(1)} x ${cutShape === 'circle' ? Math.max(3.5, (customText.length * 0.75 + 2.0)).toFixed(1) : 2.5} cm`}
              </span>
            </div>

            {/* RENDERED 3D EPOXY STICKER ITEM */}
            <div className="relative group transition-all duration-300 transform hover:scale-105 my-auto">
              
              {/* Soft Drop Shadow under 3D dome */}
              <div className={`absolute inset-0 bg-black/70 blur-lg transform translate-y-3 scale-95 ${activeShapeObj.class}`} />

              {/* Mode A: TEXT STICKER DOME */}
              {mode === 'text' && (
                <div
                  className={`relative z-10 transition-all duration-300 border shadow-2xl flex items-center justify-center text-center overflow-hidden ${activeBgObj.bg} ${activeBgObj.border} ${activeShapeObj.class}`}
                  style={{
                    boxShadow: '0 16px 40px rgba(0,0,0,0.7), inset 0 2px 4px rgba(255,255,255,0.4), inset 0 -4px 10px rgba(0,0,0,0.6)'
                  }}
                >
                  {/* Glossy Polyurethane Epoxy Sheen Glare */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/15 to-transparent pointer-events-none" />

                  {/* Sticker Text */}
                  <span
                    dir="auto"
                    className={`text-xl sm:text-3xl font-bold tracking-wide relative z-10 drop-shadow-md leading-[1.7] py-2 ${activeFontObj.fontClass}`}
                    style={{ color: textColor }}
                  >
                    {customText.trim() || (isAr ? 'اكتب كلمتك' : 'Your Text')}
                  </span>
                </div>
              )}

              {/* Mode B: IMAGE STICKER DOME */}
              {mode === 'image' && (
                <div
                  className={`relative z-10 transition-all duration-300 border shadow-2xl overflow-hidden flex items-center justify-center p-4 ${
                    imgCutShape === 'circle' ? 'rounded-full w-44 h-44' :
                    imgCutShape === 'oval' ? 'rounded-[40%] w-52 h-36' : 'rounded-xl w-48 h-48'
                  } ${
                    borderStyle === 'gold' ? 'border-4 border-gold' :
                    borderStyle === 'white' ? 'border-4 border-white' :
                    borderStyle === 'black' ? 'border-4 border-black' : 'border-none'
                  } ${activeBgObj.bg} ${activeBgObj.border}`}
                  style={{
                    boxShadow: '0 16px 40px rgba(0,0,0,0.7), inset 0 2px 4px rgba(255,255,255,0.4), inset 0 -4px 10px rgba(0,0,0,0.6)'
                  }}
                >
                  {/* Polyurethane Gloss Sheen Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent pointer-events-none z-20" />

                  {uploadedImage ? (
                    <img
                      src={uploadedImage}
                      alt="Uploaded sticker design"
                      className="max-w-full max-h-full object-contain transition-transform duration-200"
                      style={{ transform: `scale(${imageScale / 100})` }}
                    />
                  ) : (
                    <div className="text-center p-6 space-y-2 text-ash font-mono text-xs">
                      <Upload size={32} className="mx-auto text-gold animate-bounce" />
                      <p>{isAr ? 'ارفع صورة أو لوجو هنا' : 'Upload image or logo here'}</p>
                    </div>
                  )}
                </div>
              )}

            </div>

          </div>

          {/* Material Quality Assurance Notice */}
          <div className="bg-coal border border-grave p-4 font-mono text-xs text-ash flex items-center gap-3">
            <Shield size={18} className="text-gold flex-shrink-0" />
            <span>
              {isAr
                ? 'جميع استيكرات دوات مصنوعة من طبقة صمغ بولي يوريثان إيبوكسي مسبوقة بلاصق 3M عالي الالتصاق مقاوم للماء والخدش.'
                : 'All DUAT stickers feature 3D polyurethane resin domes with high-tack 3M waterproof adhesive.'}
            </span>
          </div>

        </div>

        {/* RIGHT CONTROLS PANEL (LG: 5 COLS) */}
        <div className="lg:col-span-5 bg-stone border border-grave p-6 sm:p-8 space-y-8 card-depth-highlight">
          
          {/* MODE A CONTROLS: TEXT */}
          {mode === 'text' && (
            <div className="space-y-6">
              
              {/* 1. Custom Text Input */}
              <div className="space-y-2">
                <label className="font-mono text-xs uppercase tracking-wider text-bone block font-bold">
                  {isAr ? '✍️ اكتب النص / الكلمة المخصصة:' : '✍️ Enter Custom Text:'}
                </label>
                <input
                  type="text"
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  placeholder={isAr ? 'مثال: طالع نور، DUAT، عمر...' : 'e.g. Born at Dawn, DUAT, Omar...'}
                  className="w-full bg-coal border border-grave px-4 py-3 text-sm font-space text-bone placeholder:text-ash focus:border-gold focus:outline-none"
                  maxLength={30}
                />
                
                {/* One-Click Quick Presets */}
                <div className="pt-1.5 space-y-1">
                  <span className="font-mono text-[10px] text-ash block">
                    {isAr ? '💡 أو اختر من العبارات الشائعة بنقرة واحدة:' : '💡 Or pick from quick presets:'}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {['طالع نور', 'عدّي الليل', 'دوات', 'سنة 2004', 'DUAT', 'Born at Dawn', '1999'].map((preset) => (
                      <button
                        key={preset}
                        onClick={() => setCustomText(preset)}
                        className="bg-coal hover:bg-stone border border-grave hover:border-gold px-2.5 py-1 text-[11px] font-mono text-bone transition-colors rounded-xs"
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </div>

                <span className="font-mono text-[10px] text-ash block text-right pt-1">
                  {customText.length} / 30 {isAr ? 'حرف' : 'chars'}
                </span>
              </div>

              {/* 2. Select Font */}
              <div className="space-y-2">
                <label className="font-mono text-xs uppercase tracking-wider text-bone block font-bold">
                  {isAr ? '🔤 اختر نوع الخط العربي (٨ خطوط متنوعة):' : '🔤 Select Arabic Font Style (8 Styles):'}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {FONTS.map((font) => (
                    <button
                      key={font.id}
                      onClick={() => setSelectedFont(font.id)}
                      className={`p-3 border transition-all text-center flex flex-col items-center justify-center gap-1 rounded ${
                        selectedFont === font.id
                          ? 'border-gold bg-gold/15 text-gold font-bold shadow-md ring-1 ring-gold'
                          : 'border-grave bg-coal text-bone hover:border-gold/50'
                      }`}
                    >
                      <span className={`text-lg font-bold ${font.fontClass}`}>
                        {font.sample}
                      </span>
                      <span className="font-mono text-[10px] opacity-80 truncate max-w-full">
                        {isAr ? font.nameAr : font.nameEn}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Select Text Color */}
              <div className="space-y-2">
                <label className="font-mono text-xs uppercase tracking-wider text-bone block font-bold">
                  {isAr ? '🎨 اختر لون الكتابة:' : '🎨 Select Text Color:'}
                </label>
                <div className="flex flex-wrap gap-2.5">
                  {TEXT_COLORS.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setTextColor(c.color)}
                      className={`w-9 h-9 rounded-full border-2 transition-transform ${
                        textColor === c.color ? 'border-gold scale-110 shadow-lg' : 'border-grave hover:scale-105'
                      }`}
                      style={{ backgroundColor: c.color }}
                      title={isAr ? c.nameAr : c.nameEn}
                    />
                  ))}
                </div>
              </div>

              {/* 4. Select Background Finish */}
              <div className="space-y-2">
                <label className="font-mono text-xs uppercase tracking-wider text-bone block font-bold">
                  {isAr ? '✨ اختر خامة خلفية الاستيكر:' : '✨ Select Base Finish:'}
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {BG_FINISHES.map((bg) => (
                    <button
                      key={bg.id}
                      onClick={() => setBgFinish(bg.id)}
                      className={`p-3 font-mono text-xs border flex items-center justify-between transition-all ${
                        bgFinish === bg.id
                          ? 'border-gold bg-gold/10 text-gold font-bold'
                          : 'border-grave bg-coal text-bone hover:border-gold/40'
                      }`}
                    >
                      <span>{isAr ? bg.nameAr : bg.nameEn}</span>
                      {bgFinish === bg.id && <Check size={14} className="text-gold" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* 5. Select Cut Shape */}
              <div className="space-y-2">
                <label className="font-mono text-xs uppercase tracking-wider text-bone block font-bold">
                  {isAr ? '📐 اختر شكل القص والدرع:' : '📐 Select Cut Shape:'}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {CUT_SHAPES.map((shape) => (
                    <button
                      key={shape.id}
                      onClick={() => setCutShape(shape.id)}
                      className={`p-2.5 font-mono text-xs border text-center transition-all ${
                        cutShape === shape.id
                          ? 'border-gold bg-gold/10 text-gold font-bold'
                          : 'border-grave bg-coal text-bone hover:border-gold/40'
                      }`}
                    >
                      {isAr ? shape.nameAr : shape.nameEn}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* MODE B CONTROLS: IMAGE */}
          {mode === 'image' && (
            <div className="space-y-6">
              
              {/* 1. File Upload Drop Zone */}
              <div className="space-y-2">
                <label className="font-mono text-xs uppercase tracking-wider text-bone block font-bold">
                  {isAr ? '📁 ارفع صورتك أو اللوجو الخاص بك:' : '📁 Upload Image or Logo:'}
                </label>
                <label className="border-2 border-dashed border-grave hover:border-gold bg-coal p-6 flex flex-col items-center justify-center cursor-pointer transition-colors text-center">
                  <Upload size={28} className="text-gold mb-2" />
                  <span className="font-mono text-xs text-bone font-bold">
                    {isAr ? 'اضغط هنا لاختيار صورة' : 'Click to select image file'}
                  </span>
                  <span className="font-mono text-[10px] text-ash mt-1">
                    PNG, JPG, WebP (up to 10MB)
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* 2. Cut Shape */}
              <div className="space-y-2">
                <label className="font-mono text-xs uppercase tracking-wider text-bone block font-bold">
                  {isAr ? '📐 شكل الإطار:' : '📐 Outline Frame:'}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'circle', label: isAr ? 'دائري' : 'Circle' },
                    { id: 'oval', label: isAr ? 'بيضاوي' : 'Oval' },
                    { id: 'rectangle', label: isAr ? 'مربع' : 'Square' }
                  ].map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setImgCutShape(s.id)}
                      className={`p-2.5 font-mono text-xs border text-center ${
                        imgCutShape === s.id ? 'border-gold bg-gold/10 text-gold font-bold' : 'border-grave bg-coal text-bone'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Border Color */}
              <div className="space-y-2">
                <label className="font-mono text-xs uppercase tracking-wider text-bone block font-bold">
                  {isAr ? '✨ لون برقع الإطار:' : '✨ Border Color:'}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'gold', label: isAr ? 'إطار ذهبي' : 'Gold Border' },
                    { id: 'white', label: isAr ? 'إطار أبيض' : 'White Border' },
                    { id: 'black', label: isAr ? 'إطار أسود' : 'Black Border' },
                    { id: 'none', label: isAr ? 'بدون إطار' : 'No Border' }
                  ].map((b) => (
                    <button
                      key={b.id}
                      onClick={() => setBorderStyle(b.id)}
                      className={`p-2.5 font-mono text-xs border text-center ${
                        borderStyle === b.id ? 'border-gold bg-gold/10 text-gold font-bold' : 'border-grave bg-coal text-bone'
                      }`}
                    >
                      {b.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. Select Background Finish */}
              <div className="space-y-2">
                <label className="font-mono text-xs uppercase tracking-wider text-bone block font-bold">
                  {isAr ? '🎨 اختر خامة خلفية الاستيكر:' : '🎨 Select Base Finish:'}
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {BG_FINISHES.map((bg) => (
                    <button
                      key={bg.id}
                      onClick={() => setBgFinish(bg.id)}
                      className={`p-3 font-mono text-xs border flex items-center justify-between transition-all ${
                        bgFinish === bg.id
                          ? 'border-gold bg-gold/10 text-gold font-bold'
                          : 'border-grave bg-coal text-bone hover:border-gold/40'
                      }`}
                    >
                      <span>{isAr ? bg.nameAr : bg.nameEn}</span>
                      {bgFinish === bg.id && <Check size={14} className="text-gold" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. Image Scale Slider */}
              {uploadedImage && (
                <div className="space-y-2">
                  <div className="flex justify-between font-mono text-xs text-bone">
                    <span>{isAr ? 'حجم الصورة:' : 'Image Zoom:'}</span>
                    <span>{imageScale}%</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="150"
                    value={imageScale}
                    onChange={(e) => setImageScale(Number(e.target.value))}
                    className="w-full accent-gold bg-coal cursor-pointer"
                  />
                </div>
              )}

            </div>
          )}

          {/* Workshop Notes Field */}
          <div className="space-y-2 pt-4 border-t border-grave">
            <label className="font-mono text-xs text-ash block">
              {isAr ? '📝 ملاحظات خاصة للورشة (اختياري):' : '📝 Special Workshop Notes (Optional):'}
            </label>
            <textarea
              value={designNotes}
              onChange={(e) => setDesignNotes(e.target.value)}
              placeholder={isAr ? 'مثال: يرجى جعل الحروف بارزة أكثر أو محاذاة النص لليمين...' : 'e.g. Please align text to right...'}
              className="w-full bg-coal border border-grave p-3 text-xs font-mono text-bone placeholder:text-ash focus:border-gold focus:outline-none min-h-[70px]"
            />
          </div>

          {/* PRICING & ADD TO CART CTA */}
          <div className="pt-6 border-t border-grave space-y-4">
            
            {/* Quantity Selector */}
            <div className="flex items-center justify-between font-mono text-xs text-bone">
              <span>{isAr ? 'الكمية المطلوبة:' : 'Quantity:'}</span>
              <div className="flex items-center border border-grave bg-coal">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1.5 text-gold hover:bg-stone transition-colors font-bold"
                >
                  -
                </button>

                <span className="px-4 py-1.5 font-bold">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-1.5 text-gold hover:bg-stone transition-colors font-bold"
                >
                  +
                </button>
              </div>
            </div>

            {/* Total Price Display */}
            <div className="flex items-baseline justify-between pt-2">
              <span className="font-mono text-xs uppercase text-ash">{isAr ? 'إجمالي الاستيكر المخصص:' : 'Total Custom Sticker:'}</span>
              <span className="font-mono text-2xl font-bold text-gold">
                {formatPrice(totalPrice)}
              </span>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={isUploading}
              className="w-full btn-primary py-4 px-6 font-mono text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl"
            >
              {isUploading ? <Loader2 size={18} className="animate-spin" /> : <ShoppingBag size={18} />}
              <span>
                {isAr
                  ? `أضف الاستيكر المخصص للسلة — ${formatPrice(totalPrice)}`
                  : `ADD CUSTOM STICKER — ${formatPrice(totalPrice)}`}
              </span>
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default StickerBuilderView;
