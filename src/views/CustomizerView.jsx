import React, { useState, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { StickerIcon } from '../components/StickerIcon';
import { PHONE_MODELS, CASE_TYPES, PRESET_TEMPLATES } from '../data/products';
import { Sparkles, Move, RotateCw, Trash2, Layers, Search, Download, Check, Plus, Upload, Type, Image as ImageIcon, Maximize2 } from 'lucide-react';

// Sticker Library Data Categories (Part 7)
const STICKER_CATEGORIES = {
  shapes: [
    { id: 'disc', nameEn: 'Disc', nameAr: 'قرص' },
    { id: 'ring', nameEn: 'Ring', nameAr: 'خاتم' },
    { id: 'crescent', nameEn: 'Crescent', nameAr: 'هلال' },
    { id: 'star-4', nameEn: 'Star', nameAr: 'نجمة' },
    { id: 'lightning', nameEn: 'Lightning', nameAr: 'برق' },
    { id: 'flame', nameEn: 'Flame', nameAr: 'شعلة' },
    { id: 'spark', nameEn: 'Spark', nameAr: 'شرارة' },
    { id: 'plus', nameEn: 'Plus', nameAr: 'زائد' },
    { id: 'concentric', nameEn: 'Concentric', nameAr: 'دوائر' },
    { id: 'horizon', nameEn: 'Horizon', nameAr: 'أفق' },
    { id: 'triangle', nameEn: 'Triangle', nameAr: 'مثلث' },
    { id: 'arrow-up', nameEn: 'Arrow', nameAr: 'سهم' }
  ],
  arLetters: ['أ','ب','ت','ث','ج','ح','خ','د','ذ','ر','ز','س','ش','ص','ض','ط','ظ','ع','غ','ف','ق','ك','ل','م','ن','هـ','و','ي'].map(c => ({
    id: `ar-letter-${c}`,
    label: c
  })),
  enLetters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(c => ({
    id: `en-letter-${c}`,
    label: c
  })),
  numbers: ['0','1','2','3','4','5','6','7','8','9','2000','2024','2025','2026'].map(n => ({
    id: `num-${n}`,
    label: n
  })),
  quotes: [
    { id: 'pill-tale3-noor', label: 'طالع نور' },
    { id: 'pill-3addi-lel', label: 'عدّي الليل' },
    { id: 'pill-bokra-ahla', label: 'بكرة أحلى' },
    { id: 'pill-born-dawn', label: 'BORN AT DAWN' },
    { id: 'quote-sahr', label: 'سَهَر' },
    { id: 'quote-0x-sun', label: '0X SUN' },
    { id: 'quote-12am', label: '12 AM' },
    { id: 'quote-nocturnal', label: 'NOCTURNAL' },
    { id: 'quote-passage', label: 'THE PASSAGE' },
    { id: 'quote-noor', label: 'نور' }
  ]
};

export const CustomizerView = () => {
  const { lang, t } = useLanguage();
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const [selectedModel, setSelectedModel] = useState(PHONE_MODELS[0]);
  const [selectedCaseType, setSelectedCaseType] = useState(CASE_TYPES[0]);

  const [activeTab, setActiveTab] = useState('stickers'); // 'stickers', 'presets', 'text', 'image'
  const [stickerCategory, setStickerCategory] = useState('shapes'); // 'shapes', 'arLetters', 'enLetters', 'numbers', 'quotes'

  const [layers, setLayers] = useState([
    { id: 'l1', type: 'sticker', stickerId: 'disc', x: 50, y: 36, scale: 1.2, rotation: 0 },
    { id: 'l2', type: 'sticker', stickerId: 'pill-tale3-noor', x: 50, y: 64, scale: 1.1, rotation: 0 }
  ]);
  const [selectedLayerId, setSelectedLayerId] = useState('l2');

  const [customText, setCustomText] = useState('');
  const [textColor, setTextColor] = useState('#E0A93B');
  const [textFont, setTextFont] = useState('kufi');

  // Drag interaction states: 'move' | 'scale' | 'rotate' | null
  const [dragMode, setDragMode] = useState(null);
  const dragStartRef = useRef({ pointerX: 0, pointerY: 0, layerX: 0, layerY: 0, scale: 1, rotation: 0, centerX: 0, centerY: 0 });
  const canvasRef = useRef(null);

  // Layer Operations
  const handleAddSticker = (stickerId) => {
    const newLayer = {
      id: `sticker-${Date.now()}`,
      type: 'sticker',
      stickerId,
      x: 50,
      y: 50,
      scale: 1.0,
      rotation: 0
    };
    setLayers((prev) => [...prev, newLayer]);
    setSelectedLayerId(newLayer.id);
  };

  const handleAddText = () => {
    if (!customText.trim()) return;
    const newLayer = {
      id: `text-${Date.now()}`,
      type: 'text',
      text: customText,
      color: textColor,
      font: textFont,
      x: 50,
      y: 50,
      scale: 1.0,
      rotation: 0
    };
    setLayers((prev) => [...prev, newLayer]);
    setSelectedLayerId(newLayer.id);
    setCustomText('');
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const newLayer = {
        id: `img-${Date.now()}`,
        type: 'image',
        src: event.target?.result,
        x: 50,
        y: 50,
        scale: 1.0,
        rotation: 0
      };
      setLayers((prev) => [...prev, newLayer]);
      setSelectedLayerId(newLayer.id);
    };
    reader.readAsDataURL(file);
  };

  const handleLoadPreset = (preset) => {
    const caseType = CASE_TYPES.find((c) => c.id === preset.caseTypeId) || CASE_TYPES[0];
    setSelectedCaseType(caseType);
    setLayers(preset.layers.map((l) => ({ ...l, id: `preset-${l.id}-${Date.now()}` })));
    setSelectedLayerId(null);
    showToast(t('presetLoadedToast'), 'success');
  };

  const handleRemoveLayer = (id, e) => {
    e?.stopPropagation();
    setLayers((prev) => prev.filter((l) => l.id !== id));
    if (selectedLayerId === id) setSelectedLayerId(null);
  };

  const handleLayerTransform = (id, field, value) => {
    setLayers((prev) =>
      prev.map((l) => (l.id === id ? { ...l, [field]: value } : l))
    );
  };

  // Direct Canvas Manipulation Event Handlers (Part 6)
  const handlePointerDownBody = (id, e) => {
    e.stopPropagation();
    setSelectedLayerId(id);
    setDragMode('move');
    const layer = layers.find((l) => l.id === id);
    dragStartRef.current = {
      pointerX: e.clientX,
      pointerY: e.clientY,
      layerX: layer ? layer.x : 50,
      layerY: layer ? layer.y : 50
    };
  };

  const handlePointerDownRotate = (id, e) => {
    e.stopPropagation();
    setDragMode('rotate');
    const layer = layers.find((l) => l.id === id);
    if (!layer || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const centerX = rect.left + (rect.width * layer.x) / 100;
    const centerY = rect.top + (rect.height * layer.y) / 100;

    dragStartRef.current = {
      centerX,
      centerY,
      rotation: layer.rotation
    };
  };

  const handlePointerDownScale = (id, e) => {
    e.stopPropagation();
    setDragMode('scale');
    const layer = layers.find((l) => l.id === id);
    dragStartRef.current = {
      pointerX: e.clientX,
      pointerY: e.clientY,
      scale: layer ? layer.scale : 1.0
    };
  };

  const handleCanvasPointerMove = (e) => {
    if (!dragMode || !selectedLayerId || !canvasRef.current) return;

    const layer = layers.find((l) => l.id === selectedLayerId);
    if (!layer) return;

    if (dragMode === 'move') {
      const rect = canvasRef.current.getBoundingClientRect();
      const deltaX = ((e.clientX - dragStartRef.current.pointerX) / rect.width) * 100;
      const deltaY = ((e.clientY - dragStartRef.current.pointerY) / rect.height) * 100;

      const newX = Math.max(10, Math.min(90, dragStartRef.current.layerX + deltaX));
      const newY = Math.max(10, Math.min(90, dragStartRef.current.layerY + deltaY));

      handleLayerTransform(selectedLayerId, 'x', Math.round(newX));
      handleLayerTransform(selectedLayerId, 'y', Math.round(newY));
    } else if (dragMode === 'scale') {
      const delta = (e.clientX - dragStartRef.current.pointerX) + (e.clientY - dragStartRef.current.pointerY);
      const newScale = Math.max(0.4, Math.min(3.0, dragStartRef.current.scale + delta * 0.01));
      handleLayerTransform(selectedLayerId, 'scale', parseFloat(newScale.toFixed(2)));
    } else if (dragMode === 'rotate') {
      const { centerX, centerY } = dragStartRef.current;
      const rad = Math.atan2(e.clientY - centerY, e.clientX - centerX);
      let deg = Math.round(rad * (180 / Math.PI)) + 90;
      if (deg > 180) deg -= 360;
      if (deg < -180) deg += 360;
      handleLayerTransform(selectedLayerId, 'rotation', deg);
    }
  };

  const handleCanvasPointerUp = () => {
    setDragMode(null);
  };

  const handleCanvasClick = (e) => {
    if (e.target === canvasRef.current || e.target.classList.contains('canvas-bg-area')) {
      setSelectedLayerId(null);
    }
  };

  const handleAddToCart = () => {
    const customCaseProduct = {
      id: `custom-case-${Date.now()}`,
      nameEn: `Custom ${selectedModel} Case`,
      nameAr: `جراب مخصص ${selectedModel}`,
      price: 850,
      category: 'cases',
      tagEn: selectedCaseType.nameEn,
      tagAr: selectedCaseType.nameAr,
      customDetails: {
        phoneModel: selectedModel,
        caseType: selectedCaseType.nameEn,
        layersCount: layers.length
      }
    };
    addToCart(customCaseProduct);
    showToast(t('itemAddedToast'), 'success');
  };

  const selectedLayer = layers.find((l) => l.id === selectedLayerId);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 min-h-[80vh]">
      
      {/* Header */}
      <div className="space-y-2 border-l-2 border-gold pl-4">
        <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-ash">
          <span>{t('customizerEyebrow')}</span>
        </div>
        <h1 className="font-clash text-4xl sm:text-5xl uppercase text-bone">
          {t('customizerTitle')}
        </h1>
      </div>

      {/* Main Grid Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: INTERACTIVE CANVAS (5 cols on xl) */}
        <div className="lg:col-span-6 xl:col-span-5 flex flex-col items-center space-y-4">
          
          <div
            onClick={handleCanvasClick}
            className="w-full max-w-sm aspect-[3/5] bg-stone border border-grave p-4 shadow-2xl relative flex flex-col items-center justify-center select-none overflow-hidden card-depth-highlight canvas-bg-area cursor-pointer"
          >
            
            {/* Phone Base Outline Container */}
            <div
              ref={canvasRef}
              onPointerMove={handleCanvasPointerMove}
              onPointerUp={handleCanvasPointerUp}
              onPointerLeave={handleCanvasPointerUp}
              className="w-full h-full rounded-[38px] border-2 border-grave relative flex flex-col justify-between p-4 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.9)] transition-colors duration-500 canvas-bg-area"
              style={{ backgroundColor: selectedCaseType.bg }}
            >
              
              {/* Camera Island */}
              <div
                className="self-end w-20 h-20 rounded-2xl border-2 flex flex-col items-center justify-center p-1.5 z-20 pointer-events-none"
                style={{ borderColor: selectedCaseType.ring, backgroundColor: '#050505' }}
              >
                <div className="w-5 h-5 rounded-full bg-void border border-ash/40 flex items-center justify-center mb-1">
                  <div className="w-2 h-2 rounded-full bg-ash/30" />
                </div>
                <div className="w-5 h-5 rounded-full bg-void border border-ash/40 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-ash/30" />
                </div>
              </div>

              {/* MagSafe Ring Detail */}
              {selectedCaseType.id === 'magsafe' && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-36 h-36 rounded-full border-2 border-grave/60 pointer-events-none" />
              )}

              {/* CANVAS LAYERS STACK & DIRECT MANIPULATION HANDLES (Part 6 Fix) */}
              <div className="absolute inset-0 pointer-events-auto">
                {layers.map((layer) => {
                  const isSelected = layer.id === selectedLayerId;
                  return (
                    <div
                      key={layer.id}
                      onPointerDown={(e) => handlePointerDownBody(layer.id, e)}
                      style={{
                        left: `${layer.x}%`,
                        top: `${layer.y}%`,
                        transform: `translate(-50%, -50%) scale(${layer.scale}) rotate(${layer.rotation}deg)`
                      }}
                      className={`absolute cursor-grab active:cursor-grabbing p-2 group transition-shadow ${
                        isSelected ? 'z-30' : 'z-10'
                      }`}
                    >
                      {/* Selection Bounding Box Container */}
                      <div className={`relative p-1.5 ${
                        isSelected ? 'border-2 border-dashed border-gold bg-gold/10' : ''
                      }`}>
                        
                        {/* Dedicated Rotation Handle Above Selected Layer */}
                        {isSelected && (
                          <div
                            onPointerDown={(e) => handlePointerDownRotate(layer.id, e)}
                            className="absolute -top-7 left-1/2 -translate-x-1/2 w-5 h-5 bg-gold text-[#050505] rounded-full border border-stone shadow-lg flex items-center justify-center cursor-grab active:cursor-grabbing hover:scale-110 transition-transform min-w-[20px] min-h-[20px]"
                            title="Drag to Rotate"
                          >
                            <RotateCw size={11} />
                          </div>
                        )}

                        {/* Dedicated Scale Corner Handle Below Selected Layer */}
                        {isSelected && (
                          <div
                            onPointerDown={(e) => handlePointerDownScale(layer.id, e)}
                            className="absolute -bottom-2.5 -right-2.5 w-5 h-5 bg-gold text-[#050505] rounded-full border border-stone shadow-lg flex items-center justify-center cursor-nwse-resize hover:scale-110 transition-transform min-w-[20px] min-h-[20px]"
                            title="Drag to Scale"
                          >
                            <Maximize2 size={10} />
                          </div>
                        )}

                        {/* Render Sticker SVG / Dome Artwork */}
                        {layer.type === 'sticker' && (
                          <div className="pointer-events-none">
                            <StickerIcon stickerId={layer.stickerId} size={44} />
                          </div>
                        )}

                        {/* Render Custom Text */}
                        {layer.type === 'text' && (
                          <div
                            style={{ color: layer.color }}
                            className={`whitespace-nowrap font-bold text-sm select-none pointer-events-none ${
                              layer.font === 'kufi' ? 'font-kufi' : layer.font === 'mono' ? 'font-mono' : 'font-space'
                            }`}
                          >
                            {layer.text}
                          </div>
                        )}

                        {/* Render Uploaded Image */}
                        {layer.type === 'image' && (
                          <img src={layer.src} alt="Custom Layer" className="max-w-[100px] max-h-[100px] object-contain pointer-events-none" />
                        )}

                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Empty Canvas State */}
              {layers.length === 0 && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-ash/60 pointer-events-none">
                  <span className="font-mono text-xs uppercase tracking-widest">CANVAS EMPTY</span>
                  <span className="font-space text-xs mt-1">Select a sticker, quote or text below</span>
                </div>
              )}

              {/* Phone Speaker Bottom Bar */}
              <div className="w-24 h-1.5 bg-grave/80 rounded-full self-center z-20 pointer-events-none" />

            </div>

          </div>

          <div className="font-mono text-xs text-ash text-center uppercase tracking-widest">
            {selectedModel} · {selectedCaseType.nameEn}
          </div>

          <button
            onClick={handleAddToCart}
            className="btn-primary w-full max-w-sm py-4 text-sm font-mono tracking-widest min-h-[44px]"
          >
            {t('customizerAddToCart')}
          </button>

        </div>

        {/* RIGHT COLUMN: CONTROLS & CATEGORIZED LIBRARIES (7 cols on xl) */}
        <div className="lg:col-span-6 xl:col-span-7 space-y-6">
          
          {/* Model & Finish Selection */}
          <div className="bg-stone border border-grave p-6 space-y-4">
            <h3 className="font-mono text-xs uppercase tracking-widest text-gold font-bold">
              {t('selectModel')} & {t('caseType')}
            </h3>

            {/* Model Select Dropdown */}
            <div className="space-y-2">
              <label className="font-mono text-xs text-ash block">{t('selectModel')}</label>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full bg-coal border border-grave text-bone p-3 font-space text-sm focus:border-gold outline-none min-h-[44px]"
              >
                {PHONE_MODELS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            {/* Case Type Finishes Grid */}
            <div className="space-y-2 pt-2">
              <label className="font-mono text-xs text-ash block">{t('caseType')}</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {CASE_TYPES.map((ct) => {
                  const active = selectedCaseType.id === ct.id;
                  return (
                    <button
                      key={ct.id}
                      onClick={() => setSelectedCaseType(ct)}
                      className={`p-3 border text-left flex items-center gap-2.5 transition-all min-h-[44px] ${
                        active
                          ? 'border-gold bg-coal text-gold font-bold'
                          : 'border-grave bg-stone text-bone hover:border-ash'
                      }`}
                    >
                      <div
                        className="w-4 h-4 rounded-full border border-grave flex-shrink-0"
                        style={{ backgroundColor: ct.ring }}
                      />
                      <span className="font-space text-xs truncate">
                        {lang === 'ar' ? ct.nameAr : ct.nameEn}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Builder Controls Main Tabs */}
          <div className="bg-stone border border-grave p-6 space-y-6">
            
            {/* Main Tabs */}
            <div className="grid grid-cols-4 gap-2 border-b border-grave pb-4">
              <button
                onClick={() => setActiveTab('stickers')}
                className={`py-2 text-xs font-mono uppercase tracking-widest border-b-2 transition-all min-h-[44px] ${
                  activeTab === 'stickers'
                    ? 'border-gold text-gold font-bold'
                    : 'border-transparent text-ash hover:text-bone'
                }`}
              >
                Stickers
              </button>

              <button
                onClick={() => setActiveTab('presets')}
                className={`py-2 text-xs font-mono uppercase tracking-widest border-b-2 transition-all min-h-[44px] ${
                  activeTab === 'presets'
                    ? 'border-gold text-gold font-bold'
                    : 'border-transparent text-ash hover:text-bone'
                }`}
              >
                Presets
              </button>

              <button
                onClick={() => setActiveTab('text')}
                className={`py-2 text-xs font-mono uppercase tracking-widest border-b-2 transition-all min-h-[44px] ${
                  activeTab === 'text'
                    ? 'border-gold text-gold font-bold'
                    : 'border-transparent text-ash hover:text-bone'
                }`}
              >
                Text
              </button>

              <button
                onClick={() => setActiveTab('image')}
                className={`py-2 text-xs font-mono uppercase tracking-widest border-b-2 transition-all min-h-[44px] ${
                  activeTab === 'image'
                    ? 'border-gold text-gold font-bold'
                    : 'border-transparent text-ash hover:text-bone'
                }`}
              >
                Image
              </button>
            </div>

            {/* STICKERS TAB WITH CATEGORIZED SUB-TABS (Part 7 Fix) */}
            {activeTab === 'stickers' && (
              <div className="space-y-4">
                
                {/* Sticker Sub-Category Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-grave/40">
                  <button
                    onClick={() => setStickerCategory('shapes')}
                    className={`px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider whitespace-nowrap transition-colors min-h-[36px] ${
                      stickerCategory === 'shapes' ? 'bg-gold text-[#050505] font-bold' : 'bg-coal text-ash hover:text-bone'
                    }`}
                  >
                    {t('stickerCatShapes')}
                  </button>

                  <button
                    onClick={() => setStickerCategory('arLetters')}
                    className={`px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider whitespace-nowrap transition-colors min-h-[36px] ${
                      stickerCategory === 'arLetters' ? 'bg-gold text-[#050505] font-bold' : 'bg-coal text-ash hover:text-bone'
                    }`}
                  >
                    {t('stickerCatArabic')}
                  </button>

                  <button
                    onClick={() => setStickerCategory('enLetters')}
                    className={`px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider whitespace-nowrap transition-colors min-h-[36px] ${
                      stickerCategory === 'enLetters' ? 'bg-gold text-[#050505] font-bold' : 'bg-coal text-ash hover:text-bone'
                    }`}
                  >
                    {t('stickerCatEnglish')}
                  </button>

                  <button
                    onClick={() => setStickerCategory('numbers')}
                    className={`px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider whitespace-nowrap transition-colors min-h-[36px] ${
                      stickerCategory === 'numbers' ? 'bg-gold text-[#050505] font-bold' : 'bg-coal text-ash hover:text-bone'
                    }`}
                  >
                    {t('stickerCatNumbers')}
                  </button>

                  <button
                    onClick={() => setStickerCategory('quotes')}
                    className={`px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider whitespace-nowrap transition-colors min-h-[36px] ${
                      stickerCategory === 'quotes' ? 'bg-gold text-[#050505] font-bold' : 'bg-coal text-ash hover:text-bone'
                    }`}
                  >
                    {t('stickerCatQuotes')}
                  </button>
                </div>

                {/* Sub-Category Grid Display */}
                <div className="max-h-72 overflow-y-auto p-1">
                  {stickerCategory === 'shapes' && (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                      {STICKER_CATEGORIES.shapes.map((st) => (
                        <button
                          key={st.id}
                          onClick={() => handleAddSticker(st.id)}
                          className="p-3 bg-coal border border-grave hover:border-gold flex flex-col items-center justify-center space-y-2 transition-colors min-h-[72px]"
                        >
                          <StickerIcon stickerId={st.id} size={28} />
                          <span className="font-mono text-[10px] text-ash tracking-widest uppercase truncate max-w-full">
                            {lang === 'ar' ? st.nameAr : st.nameEn}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}

                  {stickerCategory === 'arLetters' && (
                    <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                      {STICKER_CATEGORIES.arLetters.map((st) => (
                        <button
                          key={st.id}
                          onClick={() => handleAddSticker(st.id)}
                          className="p-2 bg-coal border border-grave hover:border-gold flex items-center justify-center transition-colors min-h-[50px]"
                        >
                          <StickerIcon stickerId={st.id} size={36} />
                        </button>
                      ))}
                    </div>
                  )}

                  {stickerCategory === 'enLetters' && (
                    <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                      {STICKER_CATEGORIES.enLetters.map((st) => (
                        <button
                          key={st.id}
                          onClick={() => handleAddSticker(st.id)}
                          className="p-2 bg-coal border border-grave hover:border-gold flex items-center justify-center transition-colors min-h-[50px]"
                        >
                          <StickerIcon stickerId={st.id} size={36} />
                        </button>
                      ))}
                    </div>
                  )}

                  {stickerCategory === 'numbers' && (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {STICKER_CATEGORIES.numbers.map((st) => (
                        <button
                          key={st.id}
                          onClick={() => handleAddSticker(st.id)}
                          className="p-2 bg-coal border border-grave hover:border-gold flex items-center justify-center transition-colors min-h-[50px]"
                        >
                          <StickerIcon stickerId={st.id} size={36} />
                        </button>
                      ))}
                    </div>
                  )}

                  {stickerCategory === 'quotes' && (
                    <div className="grid grid-cols-2 gap-3">
                      {STICKER_CATEGORIES.quotes.map((st) => (
                        <button
                          key={st.id}
                          onClick={() => handleAddSticker(st.id)}
                          className="p-3 bg-coal border border-grave hover:border-gold flex items-center justify-center transition-colors min-h-[56px]"
                        >
                          <StickerIcon stickerId={st.id} size={36} />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* PRESETS TAB */}
            {activeTab === 'presets' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {PRESET_TEMPLATES.map((tmpl) => (
                  <button
                    key={tmpl.id}
                    onClick={() => handleLoadPreset(tmpl)}
                    className="p-4 bg-coal border border-grave hover:border-gold text-left space-y-2 transition-colors min-h-[44px]"
                  >
                    <span className="font-space font-bold text-sm text-bone block">
                      {lang === 'ar' ? tmpl.nameAr : tmpl.nameEn}
                    </span>
                    <span className="font-mono text-[10px] text-gold uppercase tracking-widest block">
                      LOAD PRESET
                    </span>
                  </button>
                ))}
              </div>
            )}

            {/* TEXT TAB */}
            {activeTab === 'text' && (
              <div className="space-y-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customText}
                    onChange={(e) => setCustomText(e.target.value)}
                    placeholder={t('textPlaceholder')}
                    className="flex-1 bg-coal border border-grave text-bone p-3 font-space text-sm focus:border-gold outline-none min-h-[44px]"
                  />
                  <button onClick={handleAddText} className="btn-primary px-6 text-xs min-h-[44px]">
                    {t('addTextBtn')}
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setTextFont('space')}
                    className={`p-2 border font-space text-xs min-h-[44px] ${
                      textFont === 'space' ? 'border-gold text-gold' : 'border-grave text-ash'
                    }`}
                  >
                    Space Grotesk
                  </button>
                  <button
                    onClick={() => setTextFont('kufi')}
                    className={`p-2 border font-kufi text-xs min-h-[44px] ${
                      textFont === 'kufi' ? 'border-gold text-gold' : 'border-grave text-ash'
                    }`}
                  >
                    ريم كوفي
                  </button>
                  <button
                    onClick={() => setTextFont('mono')}
                    className={`p-2 border font-mono text-xs min-h-[44px] ${
                      textFont === 'mono' ? 'border-gold text-gold' : 'border-grave text-ash'
                    }`}
                  >
                    JetBrains Mono
                  </button>
                </div>
              </div>
            )}

            {/* IMAGE UPLOAD TAB */}
            {activeTab === 'image' && (
              <div className="border-2 border-dashed border-grave p-8 text-center space-y-3 bg-coal">
                <Upload size={24} className="mx-auto text-ash" />
                <p className="font-space text-xs text-ash">{t('uploadZoneText')}</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="block w-full text-xs text-ash file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-gold file:text-[#050505] file:font-bold cursor-pointer"
                />
              </div>
            )}

          </div>

          {/* Secondary Controls: Selected Layer Fine-Tune Sliders */}
          {selectedLayer && (
            <div className="bg-stone border border-grave p-6 space-y-4">
              <div className="flex justify-between items-center border-b border-grave pb-3">
                <span className="font-mono text-xs uppercase tracking-widest text-gold font-bold">
                  SELECTED LAYER CONTROLS
                </span>
                <button
                  onClick={(e) => handleRemoveLayer(selectedLayer.id, e)}
                  className="text-ember hover:text-red-400 p-1 flex items-center gap-1 font-mono text-xs min-h-[36px]"
                >
                  <Trash2 size={14} />
                  <span>REMOVE</span>
                </button>
              </div>

              {/* Transform Controls Sliders */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-mono text-[10px] text-ash uppercase flex justify-between">
                    <span>Scale</span>
                    <span>{selectedLayer.scale.toFixed(1)}x</span>
                  </label>
                  <input
                    type="range"
                    min="0.4"
                    max="3.0"
                    step="0.1"
                    value={selectedLayer.scale}
                    onChange={(e) => handleLayerTransform(selectedLayer.id, 'scale', parseFloat(e.target.value))}
                    className="w-full accent-gold cursor-pointer"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-mono text-[10px] text-ash uppercase flex justify-between">
                    <span>Rotation</span>
                    <span>{selectedLayer.rotation}°</span>
                  </label>
                  <input
                    type="range"
                    min="-180"
                    max="180"
                    step="5"
                    value={selectedLayer.rotation}
                    onChange={(e) => handleLayerTransform(selectedLayer.id, 'rotation', parseInt(e.target.value))}
                    className="w-full accent-gold cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
