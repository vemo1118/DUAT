import React, { useState, useRef, useEffect, Component } from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { StickerIcon } from '../components/StickerIcon';
import { SunDisc } from '../components/SunDisc';
import { PHONE_MODELS, CASE_TYPES, STICKER_PRESETS, PRESET_TEMPLATES } from '../data/products';
import { Sparkles, Trash2, Upload, RefreshCw, Move, RotateCw, Maximize2 } from 'lucide-react';

// Error Boundary Fallback for Customizer View
class CustomizerErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Customizer error caught:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-6">
          <div className="bg-stone border border-grave p-10 space-y-4 card-depth-highlight">
            <h2 className="font-clash text-2xl uppercase text-gold">Customizer Glitch</h2>
            <p className="font-space text-sm text-bone/80">
              The custom case builder encountered a minor rendering issue.
            </p>
            <button
              onClick={this.handleReset}
              className="btn-primary py-3 px-6 text-xs font-mono font-bold tracking-widest inline-flex items-center gap-2"
            >
              <RefreshCw size={14} />
              <span>RELOAD BUILDER</span>
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export const CustomizerContent = () => {
  const { lang, t } = useLanguage();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const location = useLocation();

  const defaultModelName = typeof PHONE_MODELS[0] === 'object' ? PHONE_MODELS[0].name : PHONE_MODELS[0];
  const defaultCaseType = CASE_TYPES.find((c) => c.id === 'matte-black') || CASE_TYPES[0];
  const [selectedModel, setSelectedModel] = useState(defaultModelName);
  const [selectedCaseType, setSelectedCaseType] = useState(defaultCaseType);

  // Pre-select case finish if navigated from Product Card or Modal
  useEffect(() => {
    if (location.state?.preselectedCaseTypeId) {
      const match = CASE_TYPES.find((c) => c.id === location.state.preselectedCaseTypeId);
      if (match) setSelectedCaseType(match);
    }
  }, [location.state]);

  const [activeTab, setActiveTab] = useState('stickers'); // 'presets', 'stickers', 'text', 'image'
  const [layers, setLayers] = useState([]);
  const [selectedLayerId, setSelectedLayerId] = useState(null);

  const [customText, setCustomText] = useState('');
  const [textColor, setTextColor] = useState('#E8A33D');
  const [textFont, setTextFont] = useState('kufi'); // 'clash', 'kufi', 'mono'

  // Global Pointer Drag State
  const [activeDragState, setActiveDragState] = useState(null);
  const canvasRef = useRef(null);

  // Helper to extract string model name safely
  const getModelName = (modelVal) => {
    if (typeof modelVal === 'object' && modelVal !== null) {
      return modelVal.name || modelVal.id || 'iPhone';
    }
    return String(modelVal || 'iPhone');
  };

  const currentModelName = getModelName(selectedModel);

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

  // Instant Global Pointer Event Listeners (Window Level for Smooth 60fps Dragging)
  useEffect(() => {
    if (!activeDragState) return;

    const handleWindowPointerMove = (e) => {
      if (!canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      const { type, layerId, startX, startY, initialX, initialY, initialScale, initialRotation } = activeDragState;

      if (type === 'move') {
        const deltaXPercent = ((e.clientX - startX) / rect.width) * 100;
        const deltaYPercent = ((e.clientY - startY) / rect.height) * 100;
        const newX = Math.max(8, Math.min(92, Math.round(initialX + deltaXPercent)));
        const newY = Math.max(8, Math.min(92, Math.round(initialY + deltaYPercent)));
        setLayers((prev) => prev.map((l) => (l.id === layerId ? { ...l, x: newX, y: newY } : l)));
      } else if (type === 'scale') {
        const delta = (e.clientX - startX) + (e.clientY - startY);
        const newScale = Math.max(0.5, Math.min(2.8, parseFloat((initialScale + delta * 0.012).toFixed(2))));
        setLayers((prev) => prev.map((l) => (l.id === layerId ? { ...l, scale: newScale } : l)));
      } else if (type === 'rotate') {
        const deltaX = e.clientX - startX;
        const newRot = (initialRotation + Math.round(deltaX * 0.9)) % 360;
        setLayers((prev) => prev.map((l) => (l.id === layerId ? { ...l, rotation: newRot } : l)));
      }
    };

    const handleWindowPointerUp = () => {
      setActiveDragState(null);
    };

    window.addEventListener('pointermove', handleWindowPointerMove);
    window.addEventListener('pointerup', handleWindowPointerUp);
    return () => {
      window.removeEventListener('pointermove', handleWindowPointerMove);
      window.removeEventListener('pointerup', handleWindowPointerUp);
    };
  }, [activeDragState]);

  // Pointer Down Handlers
  const handlePointerDownLayer = (id, e) => {
    e.stopPropagation();
    setSelectedLayerId(id);

    const layer = layers.find((l) => l.id === id);
    if (!layer) return;

    setActiveDragState({
      type: 'move',
      layerId: id,
      startX: e.clientX,
      startY: e.clientY,
      initialX: layer.x,
      initialY: layer.y
    });
  };

  const handlePointerDownRotate = (id, e) => {
    e.stopPropagation();

    const layer = layers.find((l) => l.id === id);
    if (!layer) return;

    setActiveDragState({
      type: 'rotate',
      layerId: id,
      startX: e.clientX,
      startY: e.clientY,
      initialRotation: layer.rotation
    });
  };

  const handlePointerDownScale = (id, e) => {
    e.stopPropagation();

    const layer = layers.find((l) => l.id === id);
    if (!layer) return;

    setActiveDragState({
      type: 'scale',
      layerId: id,
      startX: e.clientX,
      startY: e.clientY,
      initialScale: layer.scale
    });
  };

  // HTML5 Drag and Drop Handlers (Sticker Panel -> Canvas)
  const handleStickerDragStart = (stickerId, e) => {
    e.dataTransfer.setData('text/plain', stickerId);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleCanvasDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleCanvasDrop = (e) => {
    e.preventDefault();
    const stickerId = e.dataTransfer.getData('text/plain');
    if (!stickerId || !canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = Math.max(15, Math.min(85, Math.round(((e.clientX - rect.left) / rect.width) * 100)));
    const y = Math.max(15, Math.min(85, Math.round(((e.clientY - rect.top) / rect.height) * 100)));

    const newLayer = {
      id: `sticker-${Date.now()}`,
      type: 'sticker',
      stickerId,
      x,
      y,
      scale: 1.0,
      rotation: 0
    };
    setLayers((prev) => [...prev, newLayer]);
    setSelectedLayerId(newLayer.id);
  };

  const handleAddToCart = () => {
    const customCaseProduct = {
      id: `custom-case-${Date.now()}`,
      nameEn: `Custom ${currentModelName} Case`,
      nameAr: `جراب مخصص ${currentModelName}`,
      price: 850,
      category: 'cases',
      tagEn: selectedCaseType?.nameEn || 'Custom Case',
      tagAr: selectedCaseType?.nameAr || 'جراب مخصص',
      customDetails: {
        model: currentModelName,
        caseType: selectedCaseType?.nameEn || 'Clear Solar',
        layersCount: layers.length
      }
    };
    addToCart(customCaseProduct);
    showToast(t('itemAddedToast'), 'success');
  };

  const selectedLayer = layers.find((l) => l.id === selectedLayerId);
  const caseBgColor = selectedCaseType?.color || selectedCaseType?.bg || '#14110F';
  const caseRingColor = selectedCaseType?.color || selectedCaseType?.ring || '#E8A33D';

  const isLightCase = selectedCaseType?.id === 'clear' || selectedCaseType?.id === 'frost' || selectedCaseType?.id === 'bone';
  const logoHorizonColor = isLightCase ? '#0A0C16' : '#EDE4D3';
  const logoTextColor = isLightCase ? 'text-[#0A0C16] drop-shadow-[0_1px_2px_rgba(255,255,255,0.9)]' : 'text-[#E8A33D] drop-shadow-[0_1px_6px_rgba(0,0,0,0.95)]';

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
        
        {/* LEFT COLUMN: INTERACTIVE CANVAS */}
        <div className="lg:col-span-6 xl:col-span-5 flex flex-col items-center space-y-4">
          
          <div className="w-full max-w-sm aspect-[3/5] bg-stone border border-grave p-4 shadow-2xl relative flex flex-col items-center justify-center select-none overflow-hidden card-depth-highlight">
            
            {/* Phone Base Outline Container (Interactive Drop Target & Drag Area) */}
            <div
              ref={canvasRef}
              onDragOver={handleCanvasDragOver}
              onDrop={handleCanvasDrop}
              className="w-full h-full rounded-[38px] border-2 border-grave relative flex flex-col justify-between p-4 overflow-hidden shadow-xl transition-colors duration-500 cursor-crosshair"
              style={{ backgroundColor: caseBgColor }}
            >
              
              {/* Camera Island */}
              <div
                className="self-end w-20 h-20 rounded-2xl border-2 flex flex-col items-center justify-center p-1.5 z-20"
                style={{ borderColor: caseRingColor, backgroundColor: '#050505' }}
              >
                <div className="w-5 h-5 rounded-full bg-void border border-ash/40 flex items-center justify-center mb-1">
                  <div className="w-2 h-2 rounded-full bg-ash/30" />
                </div>
                <div className="w-5 h-5 rounded-full bg-void border border-ash/40 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-ash/30" />
                </div>
              </div>

              {/* MagSafe Ring Detail */}
              {(selectedCaseType?.id === 'magsafe' || selectedCaseType?.id === 'gold-ring') && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-36 h-36 rounded-full border-2 border-gold/50 pointer-events-none" />
              )}

              {/* CANVAS LAYERS STACK */}
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
                      className={`absolute cursor-grab active:cursor-grabbing p-2 transition-transform select-none touch-none ${
                        isSelected ? 'ring-2 ring-[#E8A33D] ring-offset-2 ring-offset-transparent z-30' : 'z-10'
                      }`}
                    >
                      {/* Interactive On-Canvas Handles (Visible when selected) */}
                      {isSelected && (
                        <>
                          {/* Drag-to-Rotate Handle (Top Center) */}
                          <div
                            onPointerDown={(e) => handlePointerDownRotate(layer.id, e)}
                            className="absolute -top-8 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-[#E8A33D] text-[#0A0C16] flex items-center justify-center cursor-ew-resize shadow-lg hover:scale-110 transition-transform font-mono text-[10px] font-bold z-40 min-w-[28px] min-h-[28px]"
                            title="Drag left/right to rotate"
                          >
                            <RotateCw size={13} />
                          </div>

                          {/* Delete Handle (Top Right) */}
                          <div
                            onPointerDown={(e) => handleRemoveLayer(layer.id, e)}
                            className="absolute -top-3.5 -right-3.5 w-7 h-7 rounded-full bg-[#D9432E] text-[#EDE4D3] flex items-center justify-center cursor-pointer shadow-lg hover:scale-110 transition-transform font-mono text-[10px] font-bold z-40 min-w-[28px] min-h-[28px]"
                            title="Remove layer"
                          >
                            ✕
                          </div>

                          {/* Drag-to-Scale Handle (Bottom Right) */}
                          <div
                            onPointerDown={(e) => handlePointerDownScale(layer.id, e)}
                            className="absolute -bottom-3.5 -right-3.5 w-7 h-7 rounded-full bg-[#E8A33D] text-[#0A0C16] flex items-center justify-center cursor-nwse-resize shadow-lg hover:scale-110 transition-transform font-mono text-[10px] font-bold z-40 min-w-[28px] min-h-[28px]"
                            title="Drag to resize scale"
                          >
                            <Maximize2 size={13} />
                          </div>
                        </>
                      )}

                      {/* Render Sticker SVG Artwork */}
                      {layer.type === 'sticker' && (
                        <StickerIcon stickerId={layer.stickerId} size={46} />
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

              {/* Empty Canvas Drop Prompt */}
              {layers.length === 0 && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-ash/60 pointer-events-none">
                  <Move size={32} className="text-gold mb-2 animate-bounce" />
                  <span className="font-mono text-xs uppercase tracking-widest font-bold">DRAG & DROP STICKERS HERE</span>
                  <span className="font-space text-xs mt-1">Pull a 3D dome from right or click to add</span>
                </div>
              )}

              {/* FIXED BRANDING MARK AT BOTTOM CENTER OF PHONE CASE */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 pointer-events-none z-20 select-none bg-[#12162B] px-3.5 py-1.5 rounded-full border border-[#E8A33D]/60 shadow-[0_4px_20px_rgba(0,0,0,0.85)]">
                <SunDisc size={16} strokeColor="#EDE4D3" />
                <span
                  style={{ color: '#E8A33D' }}
                  className="font-space text-xs font-bold tracking-[0.25em] uppercase leading-none drop-shadow-md"
                >
                  DUAT
                </span>
              </div>

              {/* Phone Speaker Bottom Bar */}
              <div className="w-24 h-1.5 bg-grave/80 rounded-full self-center z-20" />

            </div>

          </div>

          <div className="font-mono text-xs text-ash text-center uppercase tracking-widest font-medium">
            {currentModelName} · {selectedCaseType?.nameEn}
          </div>

          <button
            onClick={handleAddToCart}
            className="btn-primary w-full max-w-sm py-4 text-sm font-mono tracking-widest min-h-[48px]"
          >
            {t('customizerAddToCart')}
          </button>

        </div>

        {/* RIGHT COLUMN: CONTROLS & TABS */}
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
                value={currentModelName}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full bg-coal border border-grave text-bone p-3 font-space text-sm focus:border-gold outline-none min-h-[44px]"
              >
                {PHONE_MODELS.map((m) => {
                  const name = typeof m === 'object' ? m.name : m;
                  const id = typeof m === 'object' ? m.id || name : m;
                  return (
                    <option key={id} value={name}>
                      {name}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Case Type Finishes Grid */}
            <div className="space-y-2 pt-2">
              <label className="font-mono text-xs text-ash block">{t('caseType')}</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {CASE_TYPES.map((ct) => {
                  const active = selectedCaseType?.id === ct.id;
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
                        style={{ backgroundColor: ct.color || '#FFFFFF' }}
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

            {/* TAB CONTENTS — DRAGGABLE STICKER PREVIEWS */}
            {activeTab === 'stickers' && (
              <div className="space-y-4">
                <p className="font-mono text-[11px] text-ash uppercase tracking-wider">
                  💡 Tip: Click or drag & drop any 3D dome onto the phone canvas
                </p>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {STICKER_PRESETS.map((st) => (
                    <button
                      key={st.id}
                      draggable={true}
                      onDragStart={(e) => handleStickerDragStart(st.id, e)}
                      onClick={() => handleAddSticker(st.id)}
                      className="p-3 bg-coal border border-grave hover:border-gold flex flex-col items-center justify-center space-y-2 transition-all min-h-[84px] cursor-grab active:cursor-grabbing hover:scale-105"
                      title="Click or Drag onto phone"
                    >
                      <StickerIcon stickerId={st.id} size={36} />
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
                    <span className="font-mono text-[10px] text-gold uppercase tracking-widest block font-bold">
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

                <div className="grid grid-cols-3 gap-2 font-mono text-xs">
                  <button
                    onClick={() => setTextFont('space')}
                    className={`p-2 border ${
                      textFont === 'space' ? 'border-gold text-gold font-bold' : 'border-grave text-ash'
                    }`}
                  >
                    Space Grotesk
                  </button>
                  <button
                    onClick={() => setTextFont('kufi')}
                    className={`p-2 border ${
                      textFont === 'kufi' ? 'border-gold text-gold font-bold' : 'border-grave text-ash'
                    }`}
                  >
                    IBM Plex Arabic
                  </button>
                  <button
                    onClick={() => setTextFont('mono')}
                    className={`p-2 border ${
                      textFont === 'mono' ? 'border-gold text-gold font-bold' : 'border-grave text-ash'
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
                  className="text-ember hover:text-red-400 p-1 flex items-center gap-1 font-mono text-xs font-bold"
                >
                  <Trash2 size={14} />
                  <span>REMOVE</span>
                </button>
              </div>

              {/* Transform Controls Sliders */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-mono text-[10px] text-ash uppercase flex justify-between font-bold">
                    <span>Scale</span>
                    <span>{selectedLayer.scale.toFixed(1)}x</span>
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="2.8"
                    step="0.1"
                    value={selectedLayer.scale}
                    onChange={(e) => handleLayerTransform(selectedLayer.id, 'scale', parseFloat(e.target.value))}
                    className="w-full accent-gold cursor-pointer"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-mono text-[10px] text-ash uppercase flex justify-between font-bold">
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

export const CustomizerView = () => {
  return (
    <CustomizerErrorBoundary>
      <CustomizerContent />
    </CustomizerErrorBoundary>
  );
};

export default CustomizerView;
