import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Image as ImageIcon, Type, Upload, ShoppingBag, Loader2, Check, Plus, Minus, ArrowLeft, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { uploadOrderFile } from '../services/orderApi';
import { PRICING, ORDER_LIMITS } from '../domain/commerce';
import { imageLayout, drawImageSticker } from '../domain/stickerArtwork';
import { BUILDER_COLORS, BUILDER_FONTS, contrastRatio, textStickerLayout, drawTextSticker, canvasBlob, blobDataUrl } from '../domain/builderArtwork';

// Retained for older print-layout callers. The current UI offers square and circle.
export function getStickerExportLayout(shape, text) {
  const layouts = { pill: [1200, 480], circle: [1000, 1000], square: [1000, 1000] };
  const [width, height] = layouts[shape] || layouts.square;
  return { width, height, fontSize: Math.max(38, Math.min(180, Math.floor((width - 240) / (Math.max(1, Array.from(text).length) * .66)))) };
}

function ColorPicker({ label, value, onChange, isAr, transparent = false }) {
  return <fieldset className="space-y-3 min-w-0">
    <legend className="text-sm font-bold text-bone">{label}</legend>
    <div className="grid grid-cols-8 gap-2">
      {BUILDER_COLORS.map(c => <button key={c.id} type="button" onClick={() => onChange(c.color)} aria-label={`${label}: ${isAr ? c.nameAr : c.nameEn}`} aria-pressed={value === c.color} title={isAr ? c.nameAr : c.nameEn} className="builder-swatch rounded-full border border-grave flex items-center justify-center" style={{ backgroundColor: c.color }}>
        {value === c.color && <Check size={18} strokeWidth={3} color={contrastRatio(c.color, '#FFFFFF') > 3 ? '#FFFFFF' : '#171B2E'} />}
      </button>)}
    </div>
    {transparent && <button type="button" aria-pressed={value === 'clear'} onClick={() => onChange('clear')} className={`text-xs min-h-11 px-3 border rounded-lg ${value === 'clear' ? 'border-gold text-gold' : 'border-grave text-ash'}`}>{isAr ? 'خلفية شفافة (للـPNG)' : 'Transparent background (PNG)'}</button>}
  </fieldset>;
}

export function StickerBuilderView() {
  const { lang, formatPrice } = useLanguage(), isAr = lang === 'ar';
  const { addToCart, cartItems } = useCart();
  const { showToast } = useToast();
  const [mode, setMode] = useState('image');
  const [text, setText] = useState('');
  const [fontId, setFontId] = useState('cairo');
  const [textColor, setTextColor] = useState('#171B2E');
  const [background, setBackground] = useState('#EFEAE0');
  const [textShape, setTextShape] = useState('square');
  const [imageShape, setImageShape] = useState('auto');
  const [source, setSource] = useState(null);
  const [imageScale, setImageScale] = useState(100);
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const [busy, setBusy] = useState(false);
  const [fontReady, setFontReady] = useState(false);
  const [loadingImage, setLoadingImage] = useState(false);
  const measure = useRef(null);
  const canvas = useRef(null), fileInput = useRef(null), uploadVersion = useRef(0);
  const font = BUILDER_FONTS.find(f => f.id === fontId);
  const shape = mode === 'text' ? textShape : imageShape;
  const layout = mode === 'text' ? { widthMm: 25, heightMm: 25 } : imageLayout(source?.width || 1, source?.height || 1, imageShape);
  const customCount = cartItems.filter(i => i.id?.startsWith('custom-sticker-')).reduce((n, i) => n + i.quantity, 0);
  const textPreview = useMemo(() => {
    if (!measure.current) measure.current = document.createElement('canvas').getContext('2d');
    return textStickerLayout(measure.current, { text: text.trim(), shape: textShape, fontFamily: font.family });
  }, [text, textShape, font.family, fontReady]);
  const canAdd = !busy && !loadingImage && (mode === 'image' ? !!source : fontReady && !!text.trim());
  const Arrow = isAr ? ArrowLeft : ArrowRight;

  useEffect(() => {
    let active = true;
    if (mode !== 'text') return;
    setFontReady(false);
    document.fonts.load(`700 32px "${font.family}"`, text || 'دوات DUAT').then(() => { if (active) setFontReady(true); }).catch(() => {
      if (active) showToast(isAr ? 'تعذر تحميل الخط. جرّب خط تاني.' : 'Could not load this font. Try another.', 'error');
    });
    return () => { active = false; };
  }, [font.family, mode]);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      if (!canvas.current) return;
      if (mode === 'image' && source) {
        drawImageSticker(canvas.current, source.image, { shape: imageShape, background, scale: imageScale, pixelsPerMm: 14.4 });
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [mode, background, source, imageShape, imageScale]);

  const uploadImage = async event => {
    const file = event.target.files?.[0]; event.target.value = '';
    if (!file) return;
    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type) || file.size > 5 * 1024 * 1024) {
      showToast(isAr ? 'اختار PNG أو JPG أو WebP بحد أقصى 5 ميجابايت.' : 'Choose PNG, JPG or WebP up to 5MB.', 'error'); return;
    }
    const version = ++uploadVersion.current;
    setLoadingImage(true);
    const url = URL.createObjectURL(file);
    try {
      const image = new window.Image(); image.src = url; await image.decode();
      if (!image.naturalWidth || image.naturalWidth * image.naturalHeight > 40_000_000) throw new Error('IMAGE_TOO_LARGE');
      // Decode and reduce the source once, rather than re-decoding it for each slider movement.
      const scale = Math.min(1, 1600 / Math.max(image.naturalWidth, image.naturalHeight));
      const reduced = document.createElement('canvas'); reduced.width = Math.max(1, Math.round(image.naturalWidth * scale)); reduced.height = Math.max(1, Math.round(image.naturalHeight * scale));
      reduced.getContext('2d').drawImage(image, 0, 0, reduced.width, reduced.height);
      if (version === uploadVersion.current) { setSource({ image: reduced, width: image.naturalWidth, height: image.naturalHeight }); setImageScale(100); }
    } catch { showToast(isAr ? 'تعذر فتح الصورة. اختار صورة أصغر أو ملف تاني.' : 'Could not open this image. Try a smaller image.', 'error'); }
    finally { URL.revokeObjectURL(url); if (version === uploadVersion.current) setLoadingImage(false); }
  };

  const add = async () => {
    if (!canAdd) return;
    if (cartItems.length >= ORDER_LIMITS.lines) { showToast(isAr ? 'السلة وصلت للحد الأقصى من التصميمات. كمّل الطلب الحالي الأول.' : 'The cart has reached its design limit. Complete this order first.', 'info'); return; }
    setBusy(true);
    try {
      const printCanvas = document.createElement('canvas');
      if (mode === 'text') drawTextSticker(printCanvas, { text: text.trim(), shape: textShape, textColor, background: background === 'clear' ? '#EFEAE0' : background, fontFamily: font.family });
      else drawImageSticker(printCanvas, source.image, { shape: imageShape, background, scale: imageScale });
      const blob = await canvasBlob(printCanvas);
      const [snapshot, upload] = await Promise.all([blobDataUrl(blob), uploadOrderFile(blob, 'order-design')]);
      addToCart({ id: `custom-sticker-${crypto.randomUUID()}`, category: 'stickers', price: PRICING.custom, quantity,
        nameAr: mode === 'text' ? `استيكر: ${text.trim()}` : 'استيكر بتصميمك', nameEn: mode === 'text' ? `Sticker: ${text.trim()}` : 'Your image sticker',
        image: snapshot, designSnapshot: snapshot,
        customDetails: { mode, customText: mode === 'text' ? text.trim() : '', selectedFont: fontId, textColor, bgFinish: background,
          cutShape: shape, borderStyle: 'none', imageScale, printWidthMm: layout.widthMm, printHeightMm: layout.heightMm, designNotes: notes,
          design_image_path: upload.path, design_upload_token: upload.claimToken, design_expires_at: upload.expiresAt } });
      setQuantity(1);
      showToast(isAr ? 'اتضاف تصميمك للسلة. تقدر تعمل تصميم مختلف للقطعة الجاية.' : 'Added to your cart. You can make a different design next.', 'success');
    } catch { showToast(isAr ? 'تعذر رفع التصميم. جرّب مرة تانية.' : 'Could not upload the design. Please retry.', 'error'); }
    finally { setBusy(false); }
  };

  return <div className="sticker-builder max-w-6xl mx-auto px-3 sm:px-6 py-5 sm:py-10 text-bone" dir={isAr ? 'rtl' : 'ltr'}>
    <div className="flex flex-wrap items-end justify-between gap-3 mb-5">
      <div><Link className="text-xs text-ash" to="/stickers">{isAr ? 'الاستيكرات / صمّم بنفسك' : 'Stickers / Make it yours'}</Link><h1 className="text-2xl sm:text-4xl font-bold mt-2">{isAr ? 'استيكر على مزاجك' : 'Your sticker. Your way.'}</h1></div>
      <p className="text-sm text-gold font-bold">{formatPrice(PRICING.custom)} <span className="text-ash font-normal">{isAr ? 'للقطعة · أقل عدد 4' : 'each · minimum 4'}</span></p>
    </div>
    <div className="builder-layout grid lg:grid-cols-2 gap-4 lg:gap-8 items-start">
      <section className="builder-preview-panel bg-void lg:sticky lg:top-28 rounded-2xl overflow-hidden border border-grave" aria-label={isAr ? 'معاينة الاستيكر' : 'Sticker preview'}>
        <div className="grid grid-cols-2 p-2 gap-2 border-b border-grave bg-stone">
          {[['image', ImageIcon, isAr ? 'صورة أو لوجو' : 'Image or logo'], ['text', Type, isAr ? 'اكتب نص' : 'Write text']].map(([id, Icon, label]) => <button type="button" key={id} onClick={() => { setMode(id); if (id === 'text' && background === 'clear') setBackground('#EFEAE0'); }} aria-pressed={mode === id} className={`min-h-11 rounded-lg flex items-center justify-center gap-2 text-sm font-bold ${mode === id ? 'bg-gold text-void' : 'text-ash'}`}><Icon size={17}/>{label}</button>)}
        </div>
        <div className="builder-stage relative flex items-center justify-center p-8 min-h-[220px] sm:min-h-[300px] bg-coal" data-builder-stage>
          <canvas ref={canvas} aria-label={isAr ? 'تصميم الاستيكر للطباعة' : 'Sticker print artwork'} className={`builder-artwork ${(mode === 'image' && source) ? '' : 'hidden'}`} style={{ aspectRatio: layout.widthMm / layout.heightMm }} />
          {mode === 'image' && !source && <button type="button" onClick={() => fileInput.current?.click()} className="w-full max-w-xs py-5 px-3 rounded-xl border border-dashed border-gold/70 text-center space-y-2"><Upload size={27} className="mx-auto text-gold"/><strong className="block text-base">{isAr ? 'ارفع صورة عشان نبدأ' : 'Upload an image to begin'}</strong><span className="text-xs text-ash block">PNG · JPG · WebP / 5 MB</span></button>}
          {mode === 'text' && text.trim() && <div data-text-preview className="builder-text-preview flex items-center justify-center text-center overflow-hidden" style={{ backgroundColor: background === 'clear' ? '#EFEAE0' : background, borderRadius: textShape === 'circle' ? '50%' : '10.56px' }}><span className="builder-print-text" dir="auto" style={{ '--art-font': `"${font.family}", "Cairo", sans-serif`, fontFamily: `"${font.family}", "Cairo", sans-serif`, color: textColor, fontSize: `${textPreview.size * .22}px`, lineHeight: 1.65, fontWeight: 700, whiteSpace: 'pre' }}>{textPreview.lines.join('\n')}</span></div>}
          {mode === 'text' && !text.trim() && <p className="text-ash text-sm">{isAr ? 'اكتب كلمتك وهتشوفها هنا' : 'Type your words to see them here'}</p>}
          {(loadingImage || (mode === 'text' && !fontReady)) && <Loader2 size={22} className="absolute top-3 end-3 text-gold animate-spin"/>}
        </div>
        <div className="flex justify-between gap-3 px-4 py-3 bg-stone text-xs text-ash"><span>{isAr ? 'معاينة التصميم' : 'Design preview'}</span><span dir="ltr">{mode === 'image' && !source ? '—' : `${layout.widthMm} × ${layout.heightMm} mm`}</span></div>
      </section>
      <div className="builder-controls bg-stone border border-grave rounded-2xl p-4 sm:p-6 space-y-5">
        {mode === 'image' ? <div className="space-y-3">
          <button type="button" onClick={() => fileInput.current?.click()} className="btn-ghost min-h-11 w-full rounded-lg text-sm flex justify-center items-center gap-2"><Upload size={16}/>{isAr ? (source ? 'غيّر الصورة' : 'اختار صورة') : source ? 'Change image' : 'Choose image'}</button>
          <input ref={fileInput} type="file" accept="image/png,image/jpeg,image/webp" onChange={uploadImage} className="hidden" aria-label={isAr ? 'ارفع صورة الاستيكر' : 'Upload sticker image'}/>
          <p className="text-xs text-ash">{isAr ? 'أبعاد الصورة بتتظبط من غير قص أو تمطيط. PNG بيحافظ على شفافية التصميم.' : 'We fit the image without stretching or cropping. PNG preserves your artwork transparency.'}</p>
        </div> : <>
          <label className="block text-sm font-bold space-y-2">{isAr ? 'اكتب كلمتك' : 'Your words'}<input type="text" maxLength={40} value={text} onChange={e => setText(e.target.value)} placeholder={isAr ? 'اسمك أو كلمة بتحبها' : 'A name or words you love'} className="w-full bg-coal border border-grave rounded-lg min-h-12 px-3 text-base font-normal" dir="auto" /></label>
          <label className="block text-sm font-bold space-y-2">{isAr ? 'الخط' : 'Font'}<select value={fontId} onChange={e => setFontId(e.target.value)} className="block w-full bg-coal border border-grave rounded-lg min-h-12 px-3 font-normal text-base">{BUILDER_FONTS.map(f => <option key={f.id} value={f.id}>{isAr ? f.ar : f.en}</option>)}</select></label>
        </>}
        <fieldset className="space-y-2"><legend className="text-sm font-bold mb-2">{isAr ? 'شكل الاستيكر' : 'Sticker shape'}</legend><div className={`grid ${mode === 'image' ? 'grid-cols-3' : 'grid-cols-2'} gap-2`}>
          {(mode === 'image' ? ['auto', 'square', 'circle'] : ['square', 'circle']).map(id => <button key={id} type="button" aria-pressed={shape === id} onClick={() => mode === 'text' ? setTextShape(id) : setImageShape(id)} className={`min-h-11 rounded-lg border text-sm flex gap-2 justify-center items-center ${shape === id ? 'border-gold text-gold bg-gold/10' : 'border-grave text-bone'}`}><span className={`inline-block w-4 h-4 border border-current ${id === 'circle' ? 'rounded-full' : 'rounded-sm'}`} />{id === 'auto' ? (isAr ? 'الأصلية' : 'Original') : id === 'circle' ? (isAr ? 'دايرة' : 'Circle') : (isAr ? 'مربع' : 'Square')}</button>)}
        </div></fieldset>
        {mode === 'text' && <ColorPicker label={isAr ? 'لون النص' : 'Text color'} value={textColor} onChange={setTextColor} isAr={isAr}/>}
        <ColorPicker label={isAr ? 'لون الخلفية' : 'Background color'} value={background} onChange={setBackground} isAr={isAr} transparent={mode === 'image'}/>
        {mode === 'text' && contrastRatio(textColor, background === 'clear' ? '#EFEAE0' : background) < 2.5 && <p className="text-xs text-gold" role="status">{isAr ? 'اللونين قريبين من بعض؛ اختار لون أفتح أو أغمق عشان الكتابة تبقى واضحة.' : 'These colors are close together. Choose a lighter or darker color to make the text clear.'}</p>}
        {mode === 'image' && source && <label className="block text-sm space-y-2">{isAr ? 'حجم الصورة داخل الشكل' : 'Image size in frame'} <span className="text-ash">{imageScale}%</span><input type="range" min="50" max="100" value={imageScale} onChange={e => setImageScale(Number(e.target.value))} className="w-full accent-gold min-h-8"/></label>}
        <details className="text-sm border-t border-grave pt-3"><summary className="cursor-pointer min-h-11 flex items-center text-ash">{isAr ? 'ملاحظات للتنفيذ (اختياري)' : 'Production notes (optional)'}</summary><textarea maxLength={500} value={notes} onChange={e => setNotes(e.target.value)} aria-label={isAr ? 'ملاحظات للتنفيذ' : 'Production notes'} className="w-full min-h-20 p-3 bg-coal rounded-lg border border-grave"/></details>
        <div className="border-t border-grave pt-4 space-y-4">
          <div className="flex items-center justify-between gap-3 text-sm"><span>{isAr ? 'نسخ من التصميم ده' : 'Copies of this design'}</span><div className="flex items-center border border-grave rounded-lg"><button type="button" aria-label={isAr ? 'تقليل العدد' : 'Decrease quantity'} onClick={() => setQuantity(n => Math.max(1, n - 1))} className="w-11 h-11 flex items-center justify-center"><Minus size={16}/></button><span className="min-w-8 text-center" data-builder-quantity>{quantity}</span><button type="button" aria-label={isAr ? 'زيادة العدد' : 'Increase quantity'} onClick={() => setQuantity(n => Math.min(ORDER_LIMITS.quantityPerLine, n + 1))} className="w-11 h-11 flex items-center justify-center"><Plus size={16}/></button></div></div>
          <button type="button" onClick={add} disabled={!canAdd} className="btn-primary rounded-lg w-full min-h-12 px-3 py-3 flex items-center justify-between gap-2 disabled:opacity-50 text-sm font-bold">{busy ? <Loader2 size={18} className="animate-spin"/> : <ShoppingBag size={18}/>}<span>{isAr ? 'أضف للسلة' : 'Add to cart'} · {formatPrice(quantity * PRICING.custom)}</span><Arrow size={17}/></button>
          <p className="text-xs text-ash leading-6">{isAr ? `مجموعتك فيها ${customCount} قطعة. الحجز يبدأ من 4 قطع بـ180 جنيه قبل الشحن، وكل قطعة ممكن بتصميم مختلف.` : `Your set has ${customCount} pieces. Start with 4 for EGP 180 before shipping. Every piece can be a different design.`}</p>
        </div>
      </div>
    </div>
    <p className="text-xs text-ash leading-6 mt-4 max-w-2xl">{isAr ? 'ألوان هادية وواضحة للاختيار. نتيجة الطباعة ممكن تختلف عن الشاشة؛ خلّي الكتابة واضحة وبعيدة عن الحواف.' : 'Choose clear, balanced colors. Printed colors may differ from your screen; keep text legible and away from the edges.'}</p>
  </div>;
}
export default StickerBuilderView;
