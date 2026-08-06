import React, { useState, useRef, useEffect, Component } from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { useCustomizerConfig } from '../context/CustomizerContext';
import { StickerIcon } from '../components/StickerIcon';
import { SunDisc } from '../components/SunDisc';
import { toPng } from 'html-to-image';
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

export function getCaseFinishColor(finishNameOrId) {
  if (!finishNameOrId) return '#14110F';
  const val = String(finishNameOrId).toLowerCase();
  if (val.includes('frost') || val.includes('white') || val.includes('أبيض') || val.includes('ثلجي')) return '#F0F4F8';
  if (val.includes('bone') || val.includes('cream') || val.includes('عاجي') || val.includes('ألباستر')) return '#EFEAE0';
  if (val.includes('clear') || val.includes('شفاف')) return '#222533';
  if (val.includes('ember') || val.includes('crimson') || val.includes('جمر') || val.includes('نبيذي')) return '#D9432E';
  if (val.includes('gold') || val.includes('ذهب')) return '#E0A93B';
  if (val.includes('tide') || val.includes('blue') || val.includes('أزرق')) return '#0F2035';
  if (val.includes('sage') || val.includes('green') || val.includes('أخضر')) return '#1C2A22';
  return '#14110F';
}

export function generateCaseMockupSnapshot(canvasEl, layers = [], caseBgColor, caseRingColor = '#E8A33D', selectedCaseType = null) {
  try {
    const bgColor = caseBgColor || getCaseFinishColor(selectedCaseType?.caseFinish || selectedCaseType?.nameEn || selectedCaseType?.nameAr || selectedCaseType?.id);
    const canvas = document.createElement('canvas');
    const width = 360;
    const height = 640;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    // 1. Phone Case Base Fill
    ctx.fillStyle = bgColor;
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(15, 15, width - 30, height - 30, 42);
    } else {
      ctx.rect(15, 15, width - 30, height - 30);
    }
    ctx.fill();
    ctx.strokeStyle = '#444';
    ctx.lineWidth = 3.5;
    ctx.stroke();

    // Side buttons accents
    ctx.fillStyle = '#2A2A2E';
    ctx.fillRect(8, 120, 6, 45); // Vol up
    ctx.fillRect(8, 185, 6, 45); // Vol down
    ctx.fillRect(width - 14, 150, 6, 60); // Power button

    // 2. Camera Island Top Right (Pro Triple Camera Module)
    ctx.fillStyle = '#090A0E';
    ctx.strokeStyle = caseRingColor || '#E8A33D';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(width - 115, 28, 86, 86, 22);
    } else {
      ctx.rect(width - 115, 28, 86, 86);
    }
    ctx.fill();
    ctx.stroke();

    // 3 Lenses Inside Camera Island
    const drawLens = (cx, cy) => {
      ctx.fillStyle = '#161822';
      ctx.strokeStyle = '#555';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(cx, cy, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#0D1B2A';
      ctx.beginPath();
      ctx.arc(cx, cy, 6, 0, Math.PI * 2);
      ctx.fill();
    };

    drawLens(width - 98, 48); // Top Left
    drawLens(width - 48, 48); // Top Right
    drawLens(width - 98, 92); // Bottom Left

    // Flash Dot & LiDAR sensor
    ctx.fillStyle = '#FDE68A';
    ctx.beginPath();
    ctx.arc(width - 50, 84, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(width - 50, 98, 3.5, 0, Math.PI * 2);
    ctx.fill();

    // 3. MagSafe Ring
    if (selectedCaseType?.id === 'magsafe' || selectedCaseType?.id === 'gold-ring') {
      ctx.strokeStyle = 'rgba(232, 163, 61, 0.6)';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, 75, 0, Math.PI * 2);
      ctx.stroke();
    }

    // 4. DUAT Branding Pill at Bottom Center
    ctx.fillStyle = '#12162B';
    ctx.strokeStyle = 'rgba(232, 163, 61, 0.7)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(width / 2 - 55, height - 55, 110, 26, 13);
    } else {
      ctx.rect(width / 2 - 55, height - 55, 110, 26);
    }
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#E8A33D';
    ctx.font = 'bold 10px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('DUAT HORIZON', width / 2, height - 42);

    // 5. Draw Layers
    for (const layer of (layers || [])) {
      const lx = (layer.x / 100) * width;
      const ly = (layer.y / 100) * height;
      const scale = layer.scale || 1.0;
      const rotRad = ((layer.rotation || 0) * Math.PI) / 180;
      const fgColor = layer.color || '#E8A33D';
      const bgColor = layer.bgColor === 'transparent' ? 'transparent' : (layer.bgColor || '#14110F');

      ctx.save();
      ctx.translate(lx, ly);
      ctx.rotate(rotRad);
      ctx.scale(scale, scale);

      if (layer.type === 'text') {
        const txt = layer.text || '';
        ctx.font = 'bold 15px sans-serif';
        const txtWidth = ctx.measureText(txt).width;
        const padX = 14;
        const padY = 8;

        if (bgColor !== 'transparent') {
          ctx.fillStyle = bgColor;
          ctx.strokeStyle = fgColor;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          const pw = txtWidth + padX * 2;
          const ph = 24 + padY * 2;
          if (ctx.roundRect) {
            ctx.roundRect(-pw / 2, -ph / 2, pw, ph, ph / 2);
          } else {
            ctx.rect(-pw / 2, -ph / 2, pw, ph);
          }
          ctx.fill();
          ctx.stroke();
        }

        ctx.fillStyle = fgColor;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(txt, 0, 0);
      } else if (layer.type === 'image' && layer.src) {
        ctx.fillStyle = '#14110F';
        ctx.strokeStyle = fgColor;
        ctx.lineWidth = 2;
        ctx.beginPath();
        if (ctx.roundRect) {
          ctx.roundRect(-40, -40, 80, 80, 12);
        } else {
          ctx.rect(-40, -40, 80, 80);
        }
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = fgColor;
        ctx.font = 'bold 10px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('🖼️ صورة مرفوعة', 0, 0);
      } else {
        let displayText = layer.stickerId || 'STICKER';
        if (displayText.startsWith('ar-letter-')) displayText = displayText.replace('ar-letter-', '');
        else if (displayText.startsWith('en-letter-')) displayText = displayText.replace('en-letter-', '');
        else if (displayText.startsWith('num-')) displayText = displayText.replace('num-', '');
        else if (displayText.startsWith('quote-')) displayText = displayText.replace('quote-', '');
        else if (displayText === 'slogan-1') displayText = 'طالع نور';
        else if (displayText === 'slogan-2') displayText = 'عدّي الليل';
        else if (displayText === 'slogan-3') displayText = 'بكرة أحلى';
        else if (displayText === 'slogan-4') displayText = 'BORN AT DAWN';
        else if (displayText.startsWith('dome-')) displayText = displayText.replace('dome-', '✨ ').toUpperCase();

        ctx.font = 'bold 13px sans-serif';
        const txtWidth = ctx.measureText(displayText).width;
        const pw = Math.max(70, txtWidth + 24);
        const ph = 34;

        if (bgColor !== 'transparent') {
          ctx.fillStyle = bgColor;
          ctx.strokeStyle = fgColor;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          if (ctx.roundRect) {
            ctx.roundRect(-pw / 2, -ph / 2, pw, ph, ph / 2);
          } else {
            ctx.rect(-pw / 2, -ph / 2, pw, ph);
          }
          ctx.fill();
          ctx.stroke();
        }

        ctx.fillStyle = fgColor;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(displayText, 0, 0);
      }

      ctx.restore();
    }

    return canvas.toDataURL('image/png');
  } catch (err) {
    console.error('Failed generating case mockup snapshot:', err);
    return null;
  }
}

export const CustomizerContent = () => {
  const { lang, t } = useLanguage();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const { activeCaseTypes, activePhoneModels, builderPrice } = useCustomizerConfig();
  const location = useLocation();

  const CASE_TYPES = activeCaseTypes.length > 0 ? activeCaseTypes : [];
  const PHONE_MODELS = activePhoneModels.length > 0 ? activePhoneModels : [];

  const defaultModelName = typeof PHONE_MODELS[0] === 'object' ? PHONE_MODELS[0]?.name : PHONE_MODELS[0] || 'iPhone 16 Pro Max';
  const defaultCaseType = CASE_TYPES.find((c) => c.id === 'matte-black') || CASE_TYPES[0];
  const [selectedModel, setSelectedModel] = useState(defaultModelName);
  const [selectedCaseType, setSelectedCaseType] = useState(defaultCaseType);
  const [customModelInput, setCustomModelInput] = useState('');
  const [designNotes, setDesignNotes] = useState('');

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
  const [textBgColor, setTextBgColor] = useState('#14110F');
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
  const isCustomModelOption =
    Boolean(selectedModel) &&
    (selectedModel.includes('جهاز آخر') ||
     selectedModel.includes('other-custom') ||
     selectedModel.toLowerCase().includes('other') ||
     selectedModel.includes('Type model'));
  const effectiveModelName = isCustomModelOption
    ? (customModelInput.trim() || (lang === 'ar' ? 'جهاز مخصص حسب الطلب' : 'Custom Device'))
    : currentModelName;

  // Layer Operations
  const handleAddSticker = (stickerId) => {
    const newLayer = {
      id: `sticker-${Date.now()}`,
      type: 'sticker',
      stickerId,
      color: textColor || '#E8A33D',
      bgColor: textBgColor || '#14110F',
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
      bgColor: textBgColor,
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
    e.preventDefault();
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
    e.preventDefault();
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
    e.preventDefault();
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

  const handleAddToCart = async () => {
    let mockupSnapshotUrl = null;
    if (canvasRef.current) {
      try {
        setSelectedLayerId(null);
        await new Promise((resolve) => setTimeout(resolve, 50));
        mockupSnapshotUrl = await toPng(canvasRef.current, {
          quality: 0.95,
          cacheBust: true
        });
      } catch (snapErr) {
        console.error('html-to-image snapshot error:', snapErr);
      }
    }

    if (!mockupSnapshotUrl) {
      mockupSnapshotUrl = generateCaseMockupSnapshot(
        canvasRef.current,
        layers,
        caseBgColor,
        caseRingColor,
        selectedCaseType
      );
    }

    const customCaseProduct = {
      id: `custom-case-${Date.now()}`,
      nameEn: `Custom ${effectiveModelName} Case`,
      nameAr: `جراب مخصص ${effectiveModelName}`,
      price: builderPrice || 850,
      category: 'cases',
      tagEn: selectedCaseType?.nameEn || 'Custom Case',
      tagAr: selectedCaseType?.nameAr || 'جراب مخصص',
      image: mockupSnapshotUrl,
      designSnapshot: mockupSnapshotUrl,
      customConfig: {
        phoneModel: effectiveModelName,
        customModelInput: isCustomModelOption ? customModelInput : null,
        designNotes: designNotes.trim() || null,
        caseFinish: selectedCaseType?.nameAr || selectedCaseType?.nameEn,
        caseTypeId: selectedCaseType?.id,
        designSnapshot: mockupSnapshotUrl,
        layers: layers.map((l) => ({
          id: l.id,
          type: l.type,
          stickerId: l.stickerId,
          text: l.text,
          color: l.color,
          bgColor: l.bgColor,
          fontFamily: l.font,
          x: l.x,
          y: l.y,
          scale: l.scale,
          rotation: l.rotation,
          src: l.src || null
        }))
      },
      customDetails: {
        model: effectiveModelName,
        customModelInput: isCustomModelOption ? customModelInput : null,
        designNotes: designNotes.trim() || null,
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
            <div className="relative w-full h-full p-2">
              {/* Outer Phone Hardware Buttons */}
              <div className="absolute -left-1.5 top-20 w-1.5 h-10 bg-stone-700/80 rounded-l-md" />
              <div className="absolute -left-1.5 top-34 w-1.5 h-10 bg-stone-700/80 rounded-l-md" />
              <div className="absolute -right-1.5 top-28 w-1.5 h-12 bg-stone-700/80 rounded-r-md" />

              <div
                ref={canvasRef}
                onDragOver={handleCanvasDragOver}
                onDrop={handleCanvasDrop}
                className="w-full h-full rounded-[42px] border-[3px] border-grave/90 relative flex flex-col justify-between p-4 overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.85),inset_0_1px_3px_rgba(255,255,255,0.2)] transition-colors duration-500 cursor-crosshair"
                style={{ backgroundColor: caseBgColor }}
              >
                {/* Acrylic Glass Sheen & Depth Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.06] to-transparent pointer-events-none z-10" />

                {/* Camera Island (Pro Triple Camera Module) */}
                <div
                  className="self-end w-24 h-24 rounded-[22px] border-2 shadow-2xl flex flex-col justify-between p-2.5 z-20 relative overflow-hidden backdrop-blur-md"
                  style={{ borderColor: caseRingColor, backgroundColor: '#090A0E' }}
                >
                  <div className="flex justify-between items-center z-10">
                    <div className="w-6 h-6 rounded-full bg-[#161822] border-2 border-stone-600/80 flex items-center justify-center shadow-inner">
                      <div className="w-2.5 h-2.5 rounded-full bg-blue-950 border border-ash/40" />
                    </div>
                    <div className="w-6 h-6 rounded-full bg-[#161822] border-2 border-stone-600/80 flex items-center justify-center shadow-inner">
                      <div className="w-2.5 h-2.5 rounded-full bg-blue-950 border border-ash/40" />
                    </div>
                  </div>
                  <div className="flex justify-between items-center z-10">
                    <div className="w-6 h-6 rounded-full bg-[#161822] border-2 border-stone-600/80 flex items-center justify-center shadow-inner">
                      <div className="w-2.5 h-2.5 rounded-full bg-blue-950 border border-ash/40" />
                    </div>
                    <div className="flex flex-col items-center gap-1 mr-0.5">
                      <div className="w-3 h-3 rounded-full bg-amber-100/90 border border-amber-300 shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
                      <div className="w-2 h-2 rounded-full bg-black border border-stone-700" />
                    </div>
                  </div>
                </div>

                {/* MagSafe Ring Detail */}
                {(selectedCaseType?.id === 'magsafe' || selectedCaseType?.id === 'gold-ring') && (
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full border-[3px] border-gold/60 shadow-[0_0_20px_rgba(232,163,61,0.25)] pointer-events-none" />
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
                        <StickerIcon
                          stickerId={layer.stickerId}
                          size={46}
                          color={layer.color}
                          bgColor={layer.bgColor}
                        />
                      )}

                      {/* Render Custom Text Sticker Pill */}
                      {layer.type === 'text' && (
                        <div
                          style={{
                            color: layer.color || '#E8A33D',
                            backgroundColor: layer.bgColor === 'transparent' ? 'transparent' : (layer.bgColor || '#14110F')
                          }}
                          className={`whitespace-nowrap font-bold text-sm select-none px-4 py-2 rounded-full border border-gold/50 shadow-xl backdrop-blur-sm ${
                            layer.font === 'kufi' ? 'font-kufi' : layer.font === 'mono' ? 'font-mono' : 'font-space'
                          }`}
                        >
                          {layer.text}
                        </div>
                      )}

                      {/* Render Uploaded Image */}
                      {layer.type === 'image' && (
                        <img
                          src={layer.src}
                          alt="Custom Layer"
                          draggable={false}
                          className="max-w-[120px] max-h-[120px] object-contain pointer-events-none select-none touch-none shadow-md rounded"
                        />
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
            </div>
          </div>
        </div>

          <div className="font-mono text-xs text-ash text-center uppercase tracking-widest font-medium">
            {currentModelName} · {selectedCaseType?.nameEn}
          </div>

          <button
            onClick={handleAddToCart}
            className="btn-primary w-full max-w-sm py-4 text-sm font-mono tracking-widest min-h-[48px]"
          >
            {lang === 'ar'
              ? `أضف إلى السلة — ${builderPrice || 850} ج.م`
              : `ADD TO CART — ${builderPrice || 850} EGP`}
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
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full bg-coal border border-grave text-bone p-3 font-space text-sm focus:border-gold outline-none min-h-[44px]"
              >
                {PHONE_MODELS.map((m) => {
                  const name = typeof m === 'object' ? (lang === 'ar' ? (m.nameAr || m.name) : (m.nameEn || m.name)) : m;
                  const valueName = typeof m === 'object' ? m.name : m;
                  const id = typeof m === 'object' ? m.id || valueName : m;
                  return (
                    <option key={id} value={valueName}>
                      {name}
                    </option>
                  );
                })}
              </select>

              {/* Custom Model Text Input if "جهاز آخر" selected */}
              {isCustomModelOption && (
                <div className="pt-2 animate-fadeIn space-y-1">
                  <label className="font-mono text-xs text-gold font-bold block">{t('customModelLabel')}</label>
                  <input
                    type="text"
                    value={customModelInput}
                    onChange={(e) => setCustomModelInput(e.target.value)}
                    placeholder={t('customModelPlaceholder')}
                    className="w-full bg-coal border border-gold/60 text-bone p-3 font-space text-sm focus:border-gold outline-none rounded"
                  />
                </div>
              )}
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

            {/* Design Notes Textarea */}
            <div className="space-y-2 pt-3 border-t border-grave/40">
              <label className="font-mono text-xs text-gold font-bold block flex items-center gap-1.5">
                <span>{t('designNotesLabel')}</span>
              </label>
              <textarea
                value={designNotes}
                onChange={(e) => setDesignNotes(e.target.value)}
                rows={2}
                placeholder={t('designNotesPlaceholder')}
                className="w-full bg-coal border border-grave text-bone p-3 font-space text-xs focus:border-gold outline-none rounded custom-scrollbar resize-none"
              />
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
                {t('tabStickers')}
              </button>

              <button
                onClick={() => setActiveTab('presets')}
                className={`py-2 text-xs font-mono uppercase tracking-widest border-b-2 transition-all min-h-[44px] ${
                  activeTab === 'presets'
                    ? 'border-gold text-gold font-bold'
                    : 'border-transparent text-ash hover:text-bone'
                }`}
              >
                {t('tabPresets')}
              </button>

              <button
                onClick={() => setActiveTab('text')}
                className={`py-2 text-xs font-mono uppercase tracking-widest border-b-2 transition-all min-h-[44px] ${
                  activeTab === 'text'
                    ? 'border-gold text-gold font-bold'
                    : 'border-transparent text-ash hover:text-bone'
                }`}
              >
                {t('tabText')}
              </button>

              <button
                onClick={() => setActiveTab('image')}
                className={`py-2 text-xs font-mono uppercase tracking-widest border-b-2 transition-all min-h-[44px] ${
                  activeTab === 'image'
                    ? 'border-gold text-gold font-bold'
                    : 'border-transparent text-ash hover:text-bone'
                }`}
              >
                {t('tabImage')}
              </button>
            </div>

            {/* TAB CONTENTS — DRAGGABLE STICKER PREVIEWS */}
            {activeTab === 'stickers' && (
              <div className="space-y-4">
                {/* Color Selector Bar for Preset Stickers */}
                <div className="bg-coal p-3 border border-grave space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-mono text-xs text-gold font-bold">{t('textColorLabel')}</span>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        { name: lang === 'ar' ? 'ذهب مصري' : 'Egyptian Gold', value: '#E8A33D' },
                        { name: lang === 'ar' ? 'عاجي ملكي' : 'Royal Ivory', value: '#EDE4D3' },
                        { name: lang === 'ar' ? 'أسود فحمي' : 'Obsidian Black', value: '#0A0C16' },
                        { name: lang === 'ar' ? 'أبيض ناصع' : 'Pure White', value: '#FFFFFF' },
                        { name: lang === 'ar' ? 'نبيذي قاني' : 'Crimson Ruby', value: '#8B1E24' },
                        { name: lang === 'ar' ? 'زمردي ملكي' : 'Royal Emerald', value: '#144D37' },
                        { name: lang === 'ar' ? 'كحلي ملكي' : 'Royal Navy', value: '#0C1B3A' },
                        { name: lang === 'ar' ? 'روز جولد' : 'Rose Gold', value: '#B76E79' },
                        { name: lang === 'ar' ? 'عنبر دافئ' : 'Warm Amber', value: '#D97706' },
                        { name: lang === 'ar' ? 'لافندر ملكي' : 'Royal Lavender', value: '#7C3AED' },
                        { name: lang === 'ar' ? 'تيتانيوم' : 'Titanium', value: '#9E9A93' },
                        { name: lang === 'ar' ? 'بنفسجي داكن' : 'Dark Purple', value: '#382049' }
                      ].map((c) => (
                        <button
                          key={c.value}
                          type="button"
                          onClick={() => setTextColor(c.value)}
                          className={`w-5 h-5 rounded-full border-2 transition-transform ${
                            textColor === c.value ? 'border-gold scale-125 shadow-md' : 'border-grave/60'
                          }`}
                          style={{ backgroundColor: c.value }}
                          title={c.name}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 border-t border-grave/40 pt-2">
                    <span className="font-mono text-xs text-gold font-bold">{t('bgColorLabel')}</span>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        { name: lang === 'ar' ? 'داكن فحمي' : 'Obsidian Black', value: '#14110F' },
                        { name: lang === 'ar' ? 'ذهب مصري' : 'Egyptian Gold', value: '#E8A33D' },
                        { name: lang === 'ar' ? 'عاجي ملكي' : 'Royal Ivory', value: '#EDE4D3' },
                        { name: lang === 'ar' ? 'كحلي ملكي' : 'Royal Navy', value: '#0B132B' },
                        { name: lang === 'ar' ? 'زمردي' : 'Emerald', value: '#1B4332' },
                        { name: lang === 'ar' ? 'نبيذي جمر' : 'Crimson Ruby', value: '#8B1E24' },
                        { name: lang === 'ar' ? 'وردي' : 'Rose Quartz', value: '#E8C5C8' },
                        { name: lang === 'ar' ? 'تيتانيوم' : 'Titanium', value: '#9E9A93' },
                        { name: lang === 'ar' ? 'شفاف 🚫' : 'Clear 🚫', value: 'transparent' }
                      ].map((c) => (
                        <button
                          key={c.value}
                          type="button"
                          onClick={() => setTextBgColor(c.value)}
                          className={`w-5 h-5 rounded-full border-2 transition-transform flex items-center justify-center font-mono text-[8px] font-bold ${
                            textBgColor === c.value ? 'border-gold scale-125 shadow-md' : 'border-grave/60'
                          }`}
                          style={{ backgroundColor: c.value === 'transparent' ? '#000000' : c.value }}
                          title={c.name}
                        >
                          {c.value === 'transparent' && <span className="text-ash text-[7px]">🚫</span>}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

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
                      <StickerIcon stickerId={st.id} size={36} color={textColor} bgColor={textBgColor} />
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

              {/* Transform Controls & Color Pickers */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Scale Controls */}
                  <div className="space-y-1">
                    <label className="font-mono text-[10px] text-ash uppercase flex justify-between font-bold">
                      <span>الحجم (Scale)</span>
                      <span>{selectedLayer.scale.toFixed(1)}x</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleLayerTransform(selectedLayer.id, 'scale', Math.max(0.4, parseFloat((selectedLayer.scale - 0.1).toFixed(1))))}
                        className="w-8 h-8 border border-grave bg-coal hover:border-gold text-bone font-mono font-bold text-sm flex items-center justify-center"
                        title="تصغير"
                      >
                        -
                      </button>
                      <input
                        type="range"
                        min="0.4"
                        max="3.0"
                        step="0.1"
                        value={selectedLayer.scale}
                        onChange={(e) => handleLayerTransform(selectedLayer.id, 'scale', parseFloat(e.target.value))}
                        className="flex-1 accent-gold cursor-pointer"
                      />
                      <button
                        type="button"
                        onClick={() => handleLayerTransform(selectedLayer.id, 'scale', Math.min(3.0, parseFloat((selectedLayer.scale + 0.1).toFixed(1))))}
                        className="w-8 h-8 border border-grave bg-coal hover:border-gold text-bone font-mono font-bold text-sm flex items-center justify-center"
                        title="تكبير"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Rotation Controls */}
                  <div className="space-y-1">
                    <label className="font-mono text-[10px] text-ash uppercase flex justify-between font-bold">
                      <span>التدوير (Rotation)</span>
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

                {/* Color Pickers for Text / Sticker Background */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-grave/40 pt-3">
                  {/* Text Color Picker */}
                  <div className="space-y-1.5">
                    <label className="font-mono text-[10px] text-gold uppercase block font-bold">لون الخط (Text Color)</label>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { name: 'ذهب مصري', value: '#E8A33D' },
                        { name: 'عاجي', value: '#EDE4D3' },
                        { name: 'أسود فحمي', value: '#0A0C16' },
                        { name: 'أبيض ناصع', value: '#FFFFFF' },
                        { name: 'أحمر قاني', value: '#8B0000' },
                        { name: 'زمردي', value: '#1B4332' }
                      ].map((c) => (
                        <button
                          key={c.value}
                          type="button"
                          onClick={() => handleLayerTransform(selectedLayer.id, 'color', c.value)}
                          className={`w-6 h-6 rounded-full border-2 transition-transform ${
                            (selectedLayer.color || '#E8A33D') === c.value ? 'border-gold scale-125 shadow-lg' : 'border-grave/60'
                          }`}
                          style={{ backgroundColor: c.value }}
                          title={c.name}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Background Pill Color Picker */}
                  <div className="space-y-1.5">
                    <label className="font-mono text-[10px] text-gold uppercase block font-bold">خلفية الاستيكر (Background Pill)</label>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { name: 'داكن مائل للأسود', value: '#14110F' },
                        { name: 'ذهب مصري', value: '#E8A33D' },
                        { name: 'عاجي', value: '#EDE4D3' },
                        { name: 'كحلي ملكي', value: '#0B132B' },
                        { name: 'زمردي', value: '#1B4332' },
                        { name: 'بدون خلفية (شفاف)', value: 'transparent' }
                      ].map((c) => (
                        <button
                          key={c.value}
                          type="button"
                          onClick={() => handleLayerTransform(selectedLayer.id, 'bgColor', c.value)}
                          className={`w-6 h-6 rounded-full border-2 transition-transform flex items-center justify-center font-mono text-[9px] font-bold ${
                            (selectedLayer.bgColor || '#14110F') === c.value ? 'border-gold scale-125 shadow-lg' : 'border-grave/60'
                          }`}
                          style={{ backgroundColor: c.value === 'transparent' ? '#000000' : c.value }}
                          title={c.name}
                        >
                          {c.value === 'transparent' && <span className="text-ash text-[8px]">🚫</span>}
                        </button>
                      ))}
                    </div>
                  </div>
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
