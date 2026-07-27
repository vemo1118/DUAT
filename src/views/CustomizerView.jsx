import React, { useState, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { StickerIcon } from '../components/StickerIcon';
import { PHONE_MODELS, CASE_TYPES, STICKER_PRESETS, PRESET_TEMPLATES } from '../data/products';
import { Sparkles, Move, RotateCw, Trash2, Layers, Search, Download, Check, Plus, Upload, Type, Image as ImageIcon, ChevronRight } from 'lucide-react';

export const CustomizerView = () => {
  const { lang, t } = useLanguage();
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const [selectedModel, setSelectedModel] = useState(PHONE_MODELS[0]);
  const [selectedCaseType, setSelectedCaseType] = useState(CASE_TYPES[0]);
  const [modelSearch, setModelSearch] = useState('');

  const [activeTab, setActiveTab] = useState('stickers'); // 'presets', 'stickers', 'text', 'image'
  const [layers, setLayers] = useState([
    { id: 'l1', type: 'sticker', stickerId: 'disc', x: 50, y: 36, scale: 1.2, rotation: 0 },
    { id: 'l2', type: 'sticker', stickerId: 'pill-tale3-noor', x: 50, y: 64, scale: 1.1, rotation: 0 }
  ]);
  const [selectedLayerId, setSelectedLayerId] = useState('l2');

  const [customText, setCustomText] = useState('');
  const [textColor, setTextColor] = useState('#E0A93B');
  const [textFont, setTextFont] = useState('kufi'); // 'clash', 'kufi', 'mono'

  const [dragActive, setDragActive] = useState(false);
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

  // Touch Pointer Drag Handlers
  const handlePointerDownLayer = (id, e) => {
    e.stopPropagation();
    setSelectedLayerId(id);
    setDragActive(true);
  };

  const handleCanvasPointerMove = (e) => {
    if (!dragActive || !selectedLayerId || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = Math.max(10, Math.min(90, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(10, Math.min(90, ((e.clientY - rect.top) / rect.height) * 100));
    handleLayerTransform(selectedLayerId, 'x', Math.round(x));
    handleLayerTransform(selectedLayerId, 'y', Math.round(y));
  };

  const handleCanvasPointerUp = () => {
    setDragActive(false);
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
        model: selectedModel,
        caseType: selectedCaseType.nameEn,
        layersCount: layers.length
      }
    };
    addToCart(customCaseProduct);
    showToast(t('itemAddedToast'), 'success');
  };

  const filteredModels = PHONE_MODELS.filter((m) =>
    m.toLowerCase().includes(modelSearch.toLowerCase())
  );

  const selectedLayer = layers.find((l) => l.id === selectedLayerId);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
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
        
        {/* LEFT COLUMN: INTERACTIVE CANVAS (7 cols on lg) */}
        <div className="lg:col-span-6 xl:col-span-5 flex flex-col items-center space-y-4">
          
          <div className="w-full max-w-sm aspect-[3/5] bg-stone border border-grave p-4 shadow-2xl relative flex flex-col items-center justify-center select-none overflow-hidden card-depth-highlight">
            
            {/* Phone Base Outline Container */}
            <div
              ref={canvasRef}
              onPointerMove={handleCanvasPointerMove}
              onPointerUp={handleCanvasPointerUp}
              onPointerLeave={handleCanvasPointerUp}
              className="w-full h-full rounded-[38px] border-2 border-grave relative flex flex-col justify-between p-4 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.9)] transition-colors duration-500"
              style={{ backgroundColor: selectedCaseType.bg }}
            >
              
              {/* Camera Island */}
              <div
                className="self-end w-20 h-20 rounded-2xl border-2 flex flex-col items-center justify-center p-1.5 z-20"
                style={{ borderColor: selectedCaseType.ring, backgroundColor: '#050505' }}
              >
                <div className="w-5 h-5 rounded-full bg-void border border-ash/40 flex items-center justify-center mb-1">
                  <div className="w-2 h-2 rounded-full bg-ash/30" />
                </div>
                <div className="w-5 h-5 rounded-full bg-void border border-ash/40 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-ash/30" />
                </div>
              </div>

              {/* MagSafe Ring Detail if MagSafe Case */}
              {selectedCaseType.id === 'magsafe' && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-36 h-36 rounded-full border-2 border-grave/60 pointer-events-none" />
              )}

              {/* CANVAS LAYERS STACK — RENDER ACTUAL ARTWORK (Part 2 Fix) */}
              <div className="absolute inset-0 pointer-events-auto">
                {layers.map((layer) => {
                  const isSelected = layer.id === selectedLayerId;
                  return (
                    <div
                      key={layer.id}
                      onPointerDown={(e) => handlePointerDownLayer(layer.id, e)}
                      style={{
                        left: `${layer.x}%`,
                        top: `${layer.y}%`,
                        transform: `translate(-50%, -50%) scale(${layer.scale}) rotate(${layer.rotation}deg)`
                      }}
                      className={`absolute cursor-grab active:cursor-grabbing p-1 transition-shadow ${
                        isSelected ? 'outline outline-1 outline-gold outline-offset-4 z-30' : 'z-10'
                      }`}
                    >
                      {/* Render Sticker SVG Artwork */}
                      {layer.type === 'sticker' && (
                        <StickerIcon stickerId={layer.stickerId} size={42} />
                      )}

                      {/* Render Custom Text */}
                      {layer.type === 'text' && (
                        <div
                          style={{ color: layer.color }}
                          className={`whitespace-nowrap font-bold text-sm select-none ${
                            layer.font === 'kufi' ? 'font-kufi' : layer.font === 'mono' ? 'font-mono' : 'font-space'
                          }`}
                        >
                          {layer.text}
                        </div>
                      )}

                      {/* Render Uploaded Image */}
                      {layer.type === 'image' && (
                        <img src={layer.src} alt="Custom Layer" className="max-w-[100px] max-h-[100px] object-contain" />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Empty Canvas State (Part 2: Ghosted phone outline + text only) */}
              {layers.length === 0 && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-ash/60 pointer-events-none">
                  <span className="font-mono text-xs uppercase tracking-widest">CANVAS EMPTY</span>
                  <span className="font-space text-xs mt-1">Add a 3D dome sticker or text layer</span>
                </div>
              )}

              {/* Phone Speaker Bottom Bar */}
              <div className="w-24 h-1.5 bg-grave/80 rounded-full self-center z-20" />

            </div>

          </div>

          <div className="font-mono text-xs text-ash text-center uppercase tracking-widest">
            {selectedModel} · {selectedCaseType.nameEn}
          </div>

          <button
            onClick={handleAddToCart}
            className="btn-primary w-full max-w-sm py-4 text-sm font-mono tracking-widest"
          >
            {t('customizerAddToCart')}
          </button>

        </div>

        {/* RIGHT COLUMN: CONTROLS & TABS (5 cols on lg) */}
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

          {/* Builder Controls Tabs */}
          <div className="bg-stone border border-grave p-6 space-y-6">
            
            {/* Tab Buttons */}
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

            {/* TAB CONTENTS */}
            {activeTab === 'stickers' && (
              <div className="space-y-4">
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {STICKER_PRESETS.map((st) => (
                    <button
                      key={st.id}
                      onClick={() => handleAddSticker(st.id)}
                      className="p-3 bg-coal border border-grave hover:border-gold flex flex-col items-center justify-center space-y-2 transition-colors min-h-[70px]"
                    >
                      <StickerIcon stickerId={st.id} size={28} />
                      <span className="font-mono text-[10px] text-ash tracking-widest uppercase truncate max-w-full">
                        {lang === 'ar' ? st.nameAr : st.nameEn}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'presets' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {PRESET_TEMPLATES.map((tmpl) => (
                  <button
                    key={tmpl.id}
                    onClick={() => handleLoadPreset(tmpl)}
                    className="p-4 bg-coal border border-grave hover:border-gold text-left space-y-2 transition-colors"
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
                    className={`p-2 border font-space text-xs ${
                      textFont === 'space' ? 'border-gold text-gold' : 'border-grave text-ash'
                    }`}
                  >
                    Space Grotesk
                  </button>
                  <button
                    onClick={() => setTextFont('kufi')}
                    className={`p-2 border font-kufi text-xs ${
                      textFont === 'kufi' ? 'border-gold text-gold' : 'border-grave text-ash'
                    }`}
                  >
                    ريم كوفي
                  </button>
                  <button
                    onClick={() => setTextFont('mono')}
                    className={`p-2 border font-mono text-xs ${
                      textFont === 'mono' ? 'border-gold text-gold' : 'border-grave text-ash'
                    }`}
                  >
                    JetBrains Mono
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'image' && (
              <div className="border-2 border-dashed border-grave p-8 text-center space-y-3 bg-coal">
                <Upload size={24} className="mx-auto text-ash" />
                <p className="font-space text-xs text-ash">{t('uploadZoneText')}</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="block w-full text-xs text-ash file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-gold file:text-void file:font-bold cursor-pointer"
                />
              </div>
            )}

          </div>

          {/* Layers Controls Stack */}
          {selectedLayer && (
            <div className="bg-stone border border-grave p-6 space-y-4">
              <div className="flex justify-between items-center border-b border-grave pb-3">
                <span className="font-mono text-xs uppercase tracking-widest text-gold font-bold">
                  SELECTED LAYER CONTROLS
                </span>
                <button
                  onClick={(e) => handleRemoveLayer(selectedLayer.id, e)}
                  className="text-ember hover:text-red-400 p-1 flex items-center gap-1 font-mono text-xs"
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
                    min="0.5"
                    max="2.5"
                    step="0.1"
                    value={selectedLayer.scale}
                    onChange={(e) => handleLayerTransform(selectedLayer.id, 'scale', parseFloat(e.target.value))}
                    className="w-full accent-gold"
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
                    className="w-full accent-gold"
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
