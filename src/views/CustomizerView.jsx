import React, { useState, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { SunDisc } from '../components/SunDisc';
import { StickerIcon } from '../components/StickerIcon';
import { PHONE_MODELS, CASE_TYPES, STICKER_PRESETS, PRESET_TEMPLATES } from '../data/products';
import {
  Type,
  Image as ImageIcon,
  Smile,
  Copy,
  Trash2,
  RotateCw,
  Search,
  Upload,
  Check,
  ShoppingBag,
  Layers,
  ChevronUp,
  ChevronDown,
  Grid,
  Download,
  Sparkles,
  FlipHorizontal,
  FlipVertical
} from 'lucide-react';

export const CustomizerView = () => {
  const { lang, t } = useLanguage();
  const { addToCart } = useCart();
  const { showToast } = useToast();

  // Model & Case state
  const [selectedModel, setSelectedModel] = useState('iPhone 17 Pro Max');
  const [modelSearch, setModelSearch] = useState('');
  const [selectedCaseType, setSelectedCaseType] = useState(CASE_TYPES[0]);
  const [showGrid, setShowGrid] = useState(false);

  // Active Tool Tab: 'presets' | 'stickers' | 'text' | 'image'
  const [activeTab, setActiveTab] = useState('presets');

  // Text Tool inputs
  const [textInput, setTextInput] = useState('');
  const [textFont, setTextFont] = useState('archivo');
  const [textColor, setTextColor] = useState('#E8B04B');

  // Layers state
  const [layers, setLayers] = useState([
    {
      id: 'layer-init-1',
      type: 'sticker',
      stickerId: 'sun-disc',
      x: 50,
      y: 45,
      scale: 1.2,
      rotation: 0,
      flipH: false,
      flipV: false
    }
  ]);
  const [selectedLayerId, setSelectedLayerId] = useState('layer-init-1');

  // Canvas Ref
  const canvasRef = useRef(null);
  const isDraggingRef = useRef(false);
  const dragTypeRef = useRef(null);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const initialLayerStateRef = useRef(null);

  // Quick Brand Swatches
  const colorSwatches = ['#E8B04B', '#E5493A', '#EFE9DE', '#6B655D', '#FFFFFF', '#050505'];

  const filteredModels = PHONE_MODELS.filter(m =>
    m.toLowerCase().includes(modelSearch.toLowerCase())
  );

  // Add Layer Helper
  const addLayer = (layerData) => {
    const newId = `layer-${Date.now()}`;
    const newLayer = {
      id: newId,
      x: 50,
      y: 50,
      scale: 1.0,
      rotation: 0,
      flipH: false,
      flipV: false,
      ...layerData
    };
    setLayers(prev => [...prev, newLayer]);
    setSelectedLayerId(newId);
  };

  // Load Preset Template
  const handleLoadPreset = (preset) => {
    const targetCase = CASE_TYPES.find(c => c.id === preset.caseTypeId) || CASE_TYPES[0];
    setSelectedCaseType(targetCase);
    setLayers(preset.layers.map(l => ({ ...l, id: `layer-${Date.now()}-${Math.random()}` })));
    setSelectedLayerId(null);
    showToast(t('presetLoadedToast'), 'success');
  };

  const handleAddSticker = (stickerId) => {
    addLayer({ type: 'sticker', stickerId });
  };

  const handleAddText = () => {
    if (!textInput.trim()) return;
    addLayer({
      type: 'text',
      text: textInput.trim(),
      font: textFont,
      color: textColor
    });
    setTextInput('');
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        addLayer({
          type: 'image',
          src: event.target.result
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDuplicateLayer = (id, e) => {
    e?.stopPropagation();
    const target = layers.find(l => l.id === id);
    if (!target) return;
    const duplicated = {
      ...target,
      id: `layer-${Date.now()}`,
      x: Math.min(target.x + 5, 85),
      y: Math.min(target.y + 5, 85)
    };
    setLayers(prev => [...prev, duplicated]);
    setSelectedLayerId(duplicated.id);
  };

  const handleDeleteLayer = (id, e) => {
    e?.stopPropagation();
    setLayers(prev => prev.filter(l => l.id !== id));
    if (selectedLayerId === id) {
      setSelectedLayerId(null);
    }
  };

  const handleFlipLayer = (id, direction, e) => {
    e?.stopPropagation();
    setLayers(prev =>
      prev.map(l => {
        if (l.id !== id) return l;
        return direction === 'h' ? { ...l, flipH: !l.flipH } : { ...l, flipV: !l.flipV };
      })
    );
  };

  const handleMoveLayerOrder = (index, direction, e) => {
    e?.stopPropagation();
    const newLayers = [...layers];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newLayers.length) return;

    const temp = newLayers[index];
    newLayers[index] = newLayers[targetIndex];
    newLayers[targetIndex] = temp;
    setLayers(newLayers);
  };

  // Pointer Interaction Handlers
  const handlePointerDown = (e, layerId, actionType) => {
    e.stopPropagation();
    setSelectedLayerId(layerId);

    const layer = layers.find(l => l.id === layerId);
    if (!layer || !canvasRef.current) return;

    isDraggingRef.current = true;
    dragTypeRef.current = actionType;
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    initialLayerStateRef.current = { ...layer };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  };

  const handlePointerMove = (e) => {
    if (!isDraggingRef.current || !selectedLayerId || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const initial = initialLayerStateRef.current;
    if (!initial) return;

    if (dragTypeRef.current === 'move') {
      const deltaXPixels = e.clientX - dragStartRef.current.x;
      const deltaYPixels = e.clientY - dragStartRef.current.y;

      const deltaXPercent = (deltaXPixels / rect.width) * 100;
      const deltaYPercent = (deltaYPixels / rect.height) * 100;

      const newX = Math.max(10, Math.min(90, initial.x + deltaXPercent));
      const newY = Math.max(10, Math.min(90, initial.y + deltaYPercent));

      setLayers(prev =>
        prev.map(l => l.id === selectedLayerId ? { ...l, x: newX, y: newY } : l)
      );
    } else if (dragTypeRef.current === 'resize') {
      const deltaY = e.clientY - dragStartRef.current.y;
      const scaleDelta = deltaY * 0.01;
      const newScale = Math.max(0.4, Math.min(3.0, initial.scale + scaleDelta));

      setLayers(prev =>
        prev.map(l => l.id === selectedLayerId ? { ...l, scale: newScale } : l)
      );
    } else if (dragTypeRef.current === 'rotate') {
      const centerX = rect.left + (initial.x / 100) * rect.width;
      const centerY = rect.top + (initial.y / 100) * rect.height;

      const rad = Math.atan2(e.clientY - centerY, e.clientX - centerX);
      let deg = Math.round(rad * (180 / Math.PI)) + 90;
      if (deg < 0) deg += 360;

      setLayers(prev =>
        prev.map(l => l.id === selectedLayerId ? { ...l, rotation: deg } : l)
      );
    }
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
    dragTypeRef.current = null;
    window.removeEventListener('pointermove', handlePointerMove);
    window.removeEventListener('pointerup', handlePointerUp);
  };

  // Export Design Render Mockup
  const handleExportPNG = () => {
    // Generate simulated high-res PNG download notification
    showToast(t('designExportedToast'), 'info');
  };

  // Add Custom Case to Cart
  const handleAddToCart = () => {
    if (layers.length === 0) return;

    addToCart(
      { price: 850 },
      {
        phoneModel: selectedModel,
        caseType: selectedCaseType.nameEn,
        layersCount: layers.length,
        titleEn: `Custom Case (${selectedModel})`,
        titleAr: `جراب مخصص (${selectedModel})`
      }
    );
    showToast(t('itemAddedToast'), 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 min-h-screen">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4 border-b border-grave pb-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.25em] text-gold">
            <SunDisc size={14} variant="gold" />
            <span>{t('customizerEyebrow')}</span>
          </div>
          <h1 className="font-archivo text-4xl sm:text-5xl uppercase text-bone">
            {t('customizerTitle')}
          </h1>
        </div>

        {/* Toolbar Helpers: Grid Toggle & PNG Export */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowGrid(!showGrid)}
            className={`font-mono text-xs uppercase tracking-widest px-3.5 py-2 border transition-colors flex items-center gap-2 ${
              showGrid ? 'border-gold text-gold bg-gold/10' : 'border-grave text-ash hover:text-bone'
            }`}
          >
            <Grid size={14} />
            <span>{t('toggleGrid')}</span>
          </button>

          <button
            onClick={handleExportPNG}
            className="font-mono text-xs uppercase tracking-widest px-3.5 py-2 border border-grave text-bone hover:border-gold hover:text-gold transition-colors flex items-center gap-2"
          >
            <Download size={14} />
            <span>{t('exportDesign')}</span>
          </button>
        </div>
      </div>

      {/* Main 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: CANVAS */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center bg-stone border border-grave p-6 sm:p-10 lg:sticky lg:top-28">
          
          <div className="font-mono text-xs uppercase tracking-widest text-ash mb-6 flex items-center gap-2">
            <span>CANVAS TARGET:</span>
            <span className="text-gold font-bold">{selectedModel}</span>
          </div>

          {/* PHONE CASE MOCKUP CANVAS */}
          <div
            ref={canvasRef}
            onClick={() => setSelectedLayerId(null)}
            className="w-[300px] h-[620px] rounded-[42px] relative overflow-hidden shadow-2xl transition-all duration-300 select-none cursor-crosshair"
            style={{
              backgroundColor: selectedCaseType.bg,
              border: `4px solid ${selectedCaseType.ring}`,
              boxShadow: `0 0 30px rgba(0,0,0,0.8), inset 0 0 15px rgba(0,0,0,0.5)`
            }}
          >
            {/* Alignment Grid Overlay */}
            {showGrid && (
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#2a2523_1px,transparent_1px),linear-gradient(to_bottom,#2a2523_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none opacity-40 z-10" />
            )}

            {/* Camera Cutout Housing (Top-Right) */}
            <div className="absolute top-4 right-4 w-20 h-20 rounded-2xl bg-void/90 border-2 border-grave z-20 flex flex-col items-center justify-center gap-1.5 p-2 shadow-inner">
              <div className="w-5 h-5 rounded-full bg-coal border border-grave flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-ash/40" />
              </div>
              <div className="w-5 h-5 rounded-full bg-coal border border-grave flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-ash/40" />
              </div>
            </div>

            {/* MagSafe Ring visual indicator if MagSafe case */}
            {selectedCaseType.id === 'magsafe' && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30">
                <div className="w-44 h-44 rounded-full border-4 border-dashed border-bone" />
              </div>
            )}

            {/* Empty Canvas Placeholder Graphic */}
            {layers.length === 0 && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 space-y-3 pointer-events-none opacity-40">
                <SunDisc size={64} variant="eclipse" />
                <p className="font-mono text-xs uppercase tracking-widest text-ash">
                  {t('noLayersText')}
                </p>
              </div>
            )}

            {/* RENDER LAYERS */}
            {layers.map((layer) => {
              const isSelected = selectedLayerId === layer.id;

              return (
                <div
                  key={layer.id}
                  onPointerDown={(e) => handlePointerDown(e, layer.id, 'move')}
                  className="absolute cursor-grab active:cursor-grabbing touch-none select-none transition-shadow"
                  style={{
                    left: `${layer.x}%`,
                    top: `${layer.y}%`,
                    transform: `translate(-50%, -50%) scale(${layer.scale}) rotate(${layer.rotation}deg) scaleX(${layer.flipH ? -1 : 1}) scaleY(${layer.flipV ? -1 : 1})`,
                    zIndex: layers.findIndex(l => l.id === layer.id) + 10
                  }}
                >
                  {/* Layer Content */}
                  <div
                    className={`relative p-2 ${
                      isSelected
                        ? 'outline outline-2 outline-gold outline-offset-4 bg-gold/5'
                        : 'hover:outline hover:outline-1 hover:outline-ash'
                    }`}
                  >
                    {layer.type === 'sticker' && (
                      <StickerIcon stickerId={layer.stickerId} size={64} />
                    )}

                    {layer.type === 'text' && (
                      <span
                        className={`block whitespace-nowrap leading-none ${
                          layer.font === 'archivo'
                            ? 'font-archivo'
                            : layer.font === 'mono'
                            ? 'font-mono'
                            : 'font-space'
                        }`}
                        style={{
                          color: layer.color,
                          fontSize: '28px',
                          textShadow: '0 2px 8px rgba(0,0,0,0.8)'
                        }}
                      >
                        {layer.text}
                      </span>
                    )}

                    {layer.type === 'image' && (
                      <img
                        src={layer.src}
                        alt="Uploaded graphic"
                        className="max-w-[140px] max-h-[140px] object-contain pointer-events-none"
                      />
                    )}

                    {/* SELECTION HANDLES */}
                    {isSelected && (
                      <>
                        <div
                          onPointerDown={(e) => handlePointerDown(e, layer.id, 'rotate')}
                          className="absolute -top-7 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-gold text-void flex items-center justify-center cursor-grab active:cursor-grabbing shadow-lg"
                          title="Rotate"
                        >
                          <RotateCw size={12} />
                        </div>

                        <div
                          onPointerDown={(e) => handlePointerDown(e, layer.id, 'resize')}
                          className="absolute -bottom-3 -right-3 w-5 h-5 bg-gold border border-void cursor-se-resize shadow-lg"
                          title="Resize"
                        />
                      </>
                    )}
                  </div>
                </div>
              );
            })}

          </div>

          <p className="font-mono text-[11px] text-ash tracking-widest uppercase mt-6 text-center">
            CLICK LAYER TO SELECT • DRAG TO POSITION • CORNERS TO ROTATE/RESIZE
          </p>

        </div>

        {/* RIGHT COLUMN: CONTROLS PANEL */}
        <div className="lg:col-span-6 bg-coal border border-grave p-6 space-y-8">
          
          {/* SECTION A: PHONE MODEL SELECTOR */}
          <div className="space-y-3">
            <label className="font-mono text-xs uppercase tracking-widest text-gold font-bold block">
              a) {t('selectModel')}
            </label>

            <div className="relative">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-3.5 text-ash" />
                <input
                  type="text"
                  value={modelSearch}
                  onChange={(e) => setModelSearch(e.target.value)}
                  placeholder={t('searchModel')}
                  className="w-full bg-stone border border-grave text-bone pl-10 pr-4 py-2.5 text-sm font-space focus:border-gold focus:outline-none"
                />
              </div>

              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full bg-stone border border-grave text-bone px-4 py-3 text-sm font-mono mt-2 focus:border-gold focus:outline-none cursor-pointer"
              >
                {filteredModels.map((model) => (
                  <option key={model} value={model} className="bg-stone text-bone">
                    {model}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* SECTION B: CASE ARMOR FINISH SWATCHES */}
          <div className="space-y-3 pt-4 border-t border-grave">
            <label className="font-mono text-xs uppercase tracking-widest text-gold font-bold block">
              b) {t('caseType')}
            </label>

            <div className="grid grid-cols-5 gap-3">
              {CASE_TYPES.map((type) => {
                const isSelected = selectedCaseType.id === type.id;
                return (
                  <button
                    key={type.id}
                    onClick={() => setSelectedCaseType(type)}
                    className={`flex flex-col items-center gap-2 p-2 border transition-all ${
                      isSelected
                        ? 'border-gold bg-stone'
                        : 'border-grave bg-stone/50 hover:border-ash'
                    }`}
                  >
                    <div
                      className="w-8 h-8 rounded-sm border-2 flex items-center justify-center shadow"
                      style={{ backgroundColor: type.bg, borderColor: type.ring }}
                    >
                      {isSelected && <Check size={14} className="text-gold" />}
                    </div>
                    <span className="font-mono text-[9px] uppercase tracking-tighter text-ash text-center leading-tight">
                      {lang === 'ar' ? type.nameAr : type.nameEn}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* SECTION C: TOOLS TABS (Presets / Stickers / Text / Image) */}
          <div className="space-y-4 pt-4 border-t border-grave">
            <div className="flex border-b border-grave">
              {[
                { id: 'presets', label: t('tabPresets'), icon: Sparkles },
                { id: 'stickers', label: t('tabStickers'), icon: Smile },
                { id: 'text', label: t('tabText'), icon: Type },
                { id: 'image', label: t('tabImage'), icon: ImageIcon }
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 py-3 font-mono text-[11px] uppercase tracking-wider flex items-center justify-center gap-1.5 border-b-2 transition-colors ${
                      isActive
                        ? 'border-gold text-gold font-bold bg-stone/50'
                        : 'border-transparent text-ash hover:text-bone'
                    }`}
                  >
                    <Icon size={14} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* TAB CONTENT: PRESETS */}
            {activeTab === 'presets' && (
              <div className="grid grid-cols-2 gap-3 pt-2">
                {PRESET_TEMPLATES.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => handleLoadPreset(preset)}
                    className="bg-stone border border-grave p-4 text-left hover:border-gold transition-all group space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <SunDisc size={16} variant="gold" />
                      <span className="font-mono text-[9px] text-ash uppercase">PRESET</span>
                    </div>
                    <h4 className="font-space text-sm font-bold text-bone group-hover:text-gold transition-colors">
                      {lang === 'ar' ? preset.nameAr : preset.nameEn}
                    </h4>
                  </button>
                ))}
              </div>
            )}

            {/* TAB CONTENT: STICKERS */}
            {activeTab === 'stickers' && (
              <div className="grid grid-cols-4 gap-3 pt-2">
                {STICKER_PRESETS.map((sticker) => (
                  <button
                    key={sticker.id}
                    onClick={() => handleAddSticker(sticker.id)}
                    className="bg-stone border border-grave p-3 flex flex-col items-center gap-2 hover:border-gold hover:bg-void transition-all group"
                  >
                    <StickerIcon stickerId={sticker.id} size={36} />
                    <span className="font-mono text-[9px] uppercase tracking-tighter text-ash group-hover:text-gold">
                      {lang === 'ar' ? sticker.nameAr : sticker.nameEn}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {/* TAB CONTENT: TEXT */}
            {activeTab === 'text' && (
              <div className="space-y-4 pt-2">
                <input
                  type="text"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder={t('textPlaceholder')}
                  className="w-full bg-stone border border-grave text-bone p-3 text-sm font-space focus:border-gold focus:outline-none"
                />

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-mono text-[10px] uppercase text-ash block mb-1">
                      Typography
                    </label>
                    <select
                      value={textFont}
                      onChange={(e) => setTextFont(e.target.value)}
                      className="w-full bg-stone border border-grave text-bone p-2 text-xs font-mono"
                    >
                      <option value="archivo">{t('fontDisplay')}</option>
                      <option value="space">{t('fontBody')}</option>
                      <option value="mono">{t('fontMono')}</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-mono text-[10px] uppercase text-ash block mb-1">
                      Accent Swatches
                    </label>
                    <div className="flex items-center gap-1.5">
                      {colorSwatches.map((color) => (
                        <button
                          key={color}
                          onClick={() => setTextColor(color)}
                          className={`w-6 h-6 border ${
                            textColor === color ? 'border-gold scale-110' : 'border-grave'
                          }`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleAddText}
                  disabled={!textInput.trim()}
                  className="w-full btn-primary py-3 text-xs disabled:opacity-50"
                >
                  {t('addTextBtn')}
                </button>
              </div>
            )}

            {/* TAB CONTENT: IMAGE UPLOAD */}
            {activeTab === 'image' && (
              <div className="pt-2">
                <label className="border-2 border-dashed border-grave hover:border-gold bg-stone/50 p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors group">
                  <Upload size={32} className="text-ash group-hover:text-gold mb-3 transition-colors" />
                  <p className="font-mono text-xs text-bone uppercase tracking-wider mb-1">
                    {t('uploadZoneText')}
                  </p>
                  <p className="font-mono text-[10px] text-ash">
                    {t('uploadZoneHint')}
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
            )}
          </div>

          {/* SECTION D: LAYERS PANEL STACK */}
          <div className="space-y-3 pt-4 border-t border-grave">
            <div className="flex items-center justify-between">
              <label className="font-mono text-xs uppercase tracking-widest text-gold font-bold flex items-center gap-2">
                <Layers size={14} />
                <span>d) {t('layersHeader')} ({layers.length})</span>
              </label>
            </div>

            {layers.length === 0 ? (
              <p className="font-mono text-xs text-ash italic py-2">
                {t('noLayersText')}
              </p>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {layers.map((layer, index) => {
                  const isSelected = selectedLayerId === layer.id;
                  return (
                    <div
                      key={layer.id}
                      onClick={() => setSelectedLayerId(layer.id)}
                      className={`p-2.5 border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                        isSelected
                          ? 'border-gold bg-stone'
                          : 'border-grave bg-stone/40 hover:border-ash'
                      }`}
                    >
                      {/* Thumbnail & Label */}
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 bg-void border border-grave flex items-center justify-center flex-shrink-0">
                          {layer.type === 'sticker' && <StickerIcon stickerId={layer.stickerId} size={18} />}
                          {layer.type === 'text' && <Type size={14} className="text-gold" />}
                          {layer.type === 'image' && <ImageIcon size={14} className="text-gold" />}
                        </div>
                        <span className="font-mono text-xs text-bone truncate">
                          {layer.type === 'text'
                            ? `Text: "${layer.text}"`
                            : layer.type === 'sticker'
                            ? `Sticker (${layer.stickerId})`
                            : 'Uploaded Image'}
                        </span>
                      </div>

                      {/* Action Icons */}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => handleFlipLayer(layer.id, 'h', e)}
                          className="p-1 text-ash hover:text-gold transition-colors"
                          title="Flip Horizontal"
                        >
                          <FlipHorizontal size={14} />
                        </button>
                        <button
                          onClick={(e) => handleFlipLayer(layer.id, 'v', e)}
                          className="p-1 text-ash hover:text-gold transition-colors"
                          title="Flip Vertical"
                        >
                          <FlipVertical size={14} />
                        </button>
                        <button
                          onClick={(e) => handleMoveLayerOrder(index, 'up', e)}
                          disabled={index === 0}
                          className="p-1 text-ash hover:text-bone disabled:opacity-30"
                          title="Move up"
                        >
                          <ChevronUp size={14} />
                        </button>
                        <button
                          onClick={(e) => handleMoveLayerOrder(index, 'down', e)}
                          disabled={index === layers.length - 1}
                          className="p-1 text-ash hover:text-bone disabled:opacity-30"
                          title="Move down"
                        >
                          <ChevronDown size={14} />
                        </button>
                        <button
                          onClick={(e) => handleDuplicateLayer(layer.id, e)}
                          className="p-1 text-ash hover:text-gold transition-colors"
                          title="Duplicate"
                        >
                          <Copy size={14} />
                        </button>
                        <button
                          onClick={(e) => handleDeleteLayer(layer.id, e)}
                          className="p-1 text-ash hover:text-ember transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* SECTION E: STICKY ADD TO CART CTA */}
          <div className="pt-4 border-t border-grave">
            <button
              onClick={handleAddToCart}
              disabled={layers.length === 0}
              className="w-full btn-primary py-4 text-sm font-mono tracking-widest flex items-center justify-center gap-3 disabled:opacity-40 disabled:cursor-not-allowed group"
            >
              <ShoppingBag size={18} />
              <span>{t('customizerAddToCart')}</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
