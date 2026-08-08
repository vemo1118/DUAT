import React, { useState, useRef, useEffect, Component } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { useCustomizerConfig } from '../context/CustomizerContext';
import { StickerIcon } from '../components/StickerIcon';
import { useTheme } from '../context/ThemeContext';
import { PHONE_MODELS as DEFAULT_PHONE_MODELS, CASE_TYPES as DEFAULT_CASE_TYPES, STICKER_PRESETS, PRESET_TEMPLATES } from '../data/products';
import { Sparkles, Trash2, Upload, RefreshCw, Move, RotateCw, Maximize2, Undo2, Redo2, ChevronLeft, ChevronRight, ArrowRight, ArrowLeft, Info, Check, Plus, Minus, ChevronDown, ChevronUp } from 'lucide-react';

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
              The custom case builder encountered a minor rendering issue:
            </p>
            <div className="text-xs text-red-400 font-mono bg-void/90 p-4 border border-red-900/50 text-left overflow-auto max-h-48 rounded">
              {String(this.state.error?.stack || this.state.error?.message || this.state.error)}
            </div>
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

    // Side buttons accents (Volume keys on right, Power key on left when facing case back)
    ctx.fillStyle = '#2A2A2E';
    ctx.fillRect(width - 14, 120, 6, 45); // Vol up
    ctx.fillRect(width - 14, 185, 6, 45); // Vol down
    ctx.fillRect(8, 150, 6, 60); // Power button

    // 2. Camera Island Top Left (Pro Triple Camera Module)
    ctx.fillStyle = '#090A0E';
    ctx.strokeStyle = caseRingColor || '#E8A33D';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(28, 28, 86, 86, 22);
    } else {
      ctx.rect(28, 28, 86, 86);
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

    drawLens(48, 48); // Top Left
    drawLens(94, 48); // Top Right
    drawLens(48, 92); // Bottom Left

    // Flash Dot & LiDAR sensor
    ctx.fillStyle = '#FDE68A';
    ctx.beginPath();
    ctx.arc(94, 84, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(94, 98, 3.5, 0, Math.PI * 2);
    ctx.fill();

    // 3. MagSafe Ring
    if (selectedCaseType?.id === 'magsafe' || selectedCaseType?.id === 'gold-ring') {
      ctx.strokeStyle = 'rgba(232, 163, 61, 0.6)';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, 75, 0, Math.PI * 2);
      ctx.stroke();
    }


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
        const isArLetter = displayText.startsWith('ar-letter-') || displayText.startsWith('st-letter-');
        const isEnLetter = displayText.startsWith('en-letter-') || displayText.startsWith('st-en-letter-');
        if (isArLetter) {
          const char = displayText.replace(/^(ar-letter-|st-letter-)/, '');
          const pw = 48;
          const ph = 48;
          if (bgColor !== 'transparent') {
            ctx.fillStyle = bgColor || '#F5F3EC';
            ctx.strokeStyle = 'rgba(215,205,190,0.8)';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            if (ctx.roundRect) {
              ctx.roundRect(-pw / 2, -ph / 2, pw, ph, 10);
            } else {
              ctx.rect(-pw / 2, -ph / 2, pw, ph);
            }
            ctx.fill();
            ctx.stroke();
          }
          ctx.fillStyle = '#000000';
          ctx.font = 'bold 28px "Aref Ruqaa Ink", "Aref Ruqaa", "Katibeh", serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(char, 0, 2);
        } else if (isEnLetter) {
          const char = displayText.replace(/^(en-letter-|st-en-letter-)/, '').toUpperCase();
          const pw = 48;
          const ph = 48;
          if (bgColor !== 'transparent') {
            ctx.fillStyle = bgColor || '#0D1629';
            ctx.strokeStyle = 'rgba(55,80,125,0.7)';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            if (ctx.roundRect) {
              ctx.roundRect(-pw / 2, -ph / 2, pw, ph, 10);
            } else {
              ctx.rect(-pw / 2, -ph / 2, pw, ph);
            }
            ctx.fill();
            ctx.stroke();
          }
          ctx.fillStyle = fgColor && fgColor !== '#E8A33D' ? fgColor : '#FFFFFF';
          ctx.font = 'bold 26px "Cinzel", "Playfair Display", serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(char, 0, 1);
        } else {
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
  const { theme } = useTheme();
  const isNight = theme === 'night';
  const { activeCaseTypes, activePhoneModels, activeBuilderStickers, activeBuilderCategories, builderPrice } = useCustomizerConfig();
  const location = useLocation();

  const CASE_TYPES = Array.isArray(activeCaseTypes) && activeCaseTypes.length > 0 ? activeCaseTypes : DEFAULT_CASE_TYPES;
  const PHONE_MODELS = Array.isArray(activePhoneModels) && activePhoneModels.length > 0 ? activePhoneModels : DEFAULT_PHONE_MODELS;

  // STICKER_ITEMS: use activeBuilderStickers from context (already has PNG images from STICKER_PRESETS)
  // NEVER override st.image with product images — sticker PNG and product photo are separate
  const STICKER_ITEMS = Array.isArray(activeBuilderStickers) && activeBuilderStickers.length > 0
    ? activeBuilderStickers
    : STICKER_PRESETS;

  const defaultModelName = typeof PHONE_MODELS[0] === 'object' ? PHONE_MODELS[0]?.name : (PHONE_MODELS[0] || 'iPhone 16 Pro Max');
  const defaultCaseType = (Array.isArray(CASE_TYPES) && CASE_TYPES.find((c) => c?.id === 'clear')) || CASE_TYPES[0] || DEFAULT_CASE_TYPES[0];
  const [selectedModel, setSelectedModel] = useState(defaultModelName);
  const [selectedCaseType, setSelectedCaseType] = useState(defaultCaseType);
  const [customModelInput, setCustomModelInput] = useState('');
  const [designNotes, setDesignNotes] = useState('');
  const [isModelSelectorOpen, setIsModelSelectorOpen] = useState(false);

  const getSubLabelFontClass = (st) => {
    if (st?.id?.startsWith('ar-letter-')) return 'font-ruqaa text-sm sm:text-base font-bold';
    if (st?.id?.startsWith('en-letter-')) return 'font-cinzel text-xs font-bold';
    if (st?.category === 'quotes-ar' || st?.id?.startsWith('quote-ar-')) return 'font-ruqaa text-xs font-bold';
    return 'font-sans text-[11px] sm:text-xs font-medium';
  };

  const isBundle = Boolean(
    location.state?.loadBundlePreset ||
    location.state?.preselectedProductId?.includes('bundle') ||
    location.state?.preselectedProductId?.startsWith('bundle-')
  );

  const defaultLayers = location.state?.presetLayers
    ? location.state.presetLayers.map((l) => ({ ...l, id: `preset-${l.id}-${Date.now()}` }))
    : isBundle
    ? (PRESET_TEMPLATES[0]?.layers.map((l) => ({ ...l, id: `init-${l.id}-${Date.now()}` })) || [])
    : [];

  const [layers, setLayers] = useState(defaultLayers);
  const [selectedLayerId, setSelectedLayerId] = useState(null);

  // Undo / Redo History Stack
  const [history, setHistory] = useState([defaultLayers]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const updateLayersWithHistory = (newLayersOrFn) => {
    setLayers((prevLayers) => {
      const nextLayers = typeof newLayersOrFn === 'function' ? newLayersOrFn(prevLayers) : newLayersOrFn;
      setHistory((prevHistory) => {
        const sliced = prevHistory.slice(0, historyIndex + 1);
        const updated = [...sliced, nextLayers];
        if (updated.length > 25) updated.shift();
        setHistoryIndex(updated.length - 1);
        return updated;
      });
      return nextLayers;
    });
  };

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  const handleUndo = () => {
    if (canUndo) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setLayers(history[newIndex] || []);
    }
  };

  const handleRedo = () => {
    if (canRedo) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setLayers(history[newIndex] || []);
    }
  };

  // Keyboard shortcuts (Ctrl+Z / Cmd+Z for Undo, Ctrl+Y / Cmd+Shift+Z for Redo)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        if (e.shiftKey) {
          e.preventDefault();
          handleRedo();
        } else {
          e.preventDefault();
          handleUndo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        handleRedo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [historyIndex, history]);

  // Pre-select case finish and layers if navigated from Product Card or Modal
  useEffect(() => {
    const targetCaseId = location.state?.preselectedCaseTypeId || (
      location.state?.preselectedProductId?.includes('bone') ? 'bone' :
      location.state?.preselectedProductId?.includes('midnight') ? 'midnight' :
      null
    );

    if (targetCaseId) {
      const match = CASE_TYPES.find((c) => c.id === targetCaseId || c.id?.toLowerCase() === targetCaseId);
      if (match) setSelectedCaseType(match);
    }
    if (location.state?.presetLayers) {
      const newL = location.state.presetLayers.map((l) => ({ ...l, id: `preset-${l.id}-${Date.now()}` }));
      setLayers(newL);
      setHistory([newL]);
      setHistoryIndex(0);
    } else if (isBundle) {
      const newL = PRESET_TEMPLATES[0].layers.map((l) => ({ ...l, id: `preset-${l.id}-${Date.now()}` }));
      setLayers(newL);
      setHistory([newL]);
      setHistoryIndex(0);
    }
  }, [location.state]);

  const [activeTab, setActiveTab] = useState('stickers');
  const [stickerCategoryFilter, setStickerCategoryFilter] = useState('letters');
  const [customText, setCustomText] = useState('');
  const [textColor, setTextColor] = useState('#E8A33D');
  const [textBgColor, setTextBgColor] = useState('#14110F');
  const [textFont, setTextFont] = useState('kufi'); // 'ruqaa', 'kufi', 'space', 'mono'

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
  const modelStr = String(currentModelName || '').toLowerCase();
  const isCustomModelOption =
    modelStr.includes('جهاز آخر') ||
    modelStr.includes('other') ||
    modelStr.includes('مخصص') ||
    modelStr.includes('type model');
  const effectiveModelName = isCustomModelOption
    ? (customModelInput.trim() || (lang === 'ar' ? 'جهاز مخصص حسب الطلب' : 'Custom Device'))
    : currentModelName;

  const displayModelBadgeText = isCustomModelOption
    ? (customModelInput.trim() || (lang === 'ar' ? 'جهاز آخر (حدد بالأسفل)' : 'Other Device'))
    : currentModelName;

  // Layer Operations
  const handleAddSticker = (stickerId) => {
    const st = STICKER_ITEMS.find((s) => s.id === stickerId) || STICKER_PRESETS.find((s) => s.id === stickerId);
    const img = st?.image || st?.imageUrl || null;

    const newLayer = {
      id: `sticker-${Date.now()}`,
      type: 'sticker',
      stickerId,
      src: img,
      color: textColor || '#E8A33D',
      bgColor: textBgColor || '#14110F',
      x: 50,
      y: 50,
      scale: 1.0,
      rotation: 0
    };
    updateLayersWithHistory((prev) => [...prev, newLayer]);
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
    updateLayersWithHistory((prev) => [...prev, newLayer]);
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
      updateLayersWithHistory((prev) => [...prev, newLayer]);
      setSelectedLayerId(newLayer.id);
    };
    reader.readAsDataURL(file);
  };

  const handleLoadPreset = (preset) => {
    const caseType = CASE_TYPES.find((c) => c.id === preset.caseTypeId) || CASE_TYPES[0];
    setSelectedCaseType(caseType);
    const newL = preset.layers.map((l) => ({ ...l, id: `preset-${l.id}-${Date.now()}` }));
    updateLayersWithHistory(newL);
    setSelectedLayerId(null);
    showToast(t('presetLoadedToast'), 'success');
  };

  const handleRemoveLayer = (id, e) => {
    e?.stopPropagation();
    updateLayersWithHistory((prev) => prev.filter((l) => l.id !== id));
    if (selectedLayerId === id) setSelectedLayerId(null);
  };

  const handleLayerTransform = (id, field, value) => {
    updateLayersWithHistory((prev) =>
      prev.map((l) => (l.id === id ? { ...l, [field]: value } : l))
    );
  };

  const getLayerCenterScreenCoords = (layer) => {
    if (!canvasRef.current || !layer) return null;
    const rect = canvasRef.current.getBoundingClientRect();
    const centerX = rect.left + (layer.x / 100) * rect.width;
    const centerY = rect.top + (layer.y / 100) * rect.height;
    return { centerX, centerY };
  };

  // Instant Global Pointer Event Listeners (Window Level for Smooth 60fps Dragging on Touch & Mouse)
  useEffect(() => {
    if (!activeDragState) return;

    const handleWindowPointerMove = (e) => {
      if (!canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      const { type, layerId, startX, startY, initialX, initialY, initialScale, initialRotation } = activeDragState;

      const clientX = e.clientX !== undefined && e.clientX !== 0 ? e.clientX : (e.touches && e.touches[0] ? e.touches[0].clientX : startX);
      const clientY = e.clientY !== undefined && e.clientY !== 0 ? e.clientY : (e.touches && e.touches[0] ? e.touches[0].clientY : startY);

      if (type === 'move') {
        const deltaXPercent = ((clientX - startX) / rect.width) * 100;
        const deltaYPercent = ((clientY - startY) / rect.height) * 100;
        const newX = Math.max(5, Math.min(95, Math.round((initialX + deltaXPercent) * 10) / 10));
        const newY = Math.max(5, Math.min(95, Math.round((initialY + deltaYPercent) * 10) / 10));
        setLayers((prev) => prev.map((l) => (l.id === layerId ? { ...l, x: newX, y: newY } : l)));
      } else if (type === 'scale') {
        if (activeDragState.centerX !== undefined && activeDragState.centerY !== undefined && activeDragState.initialDistance) {
          const currentDistance = Math.hypot(clientX - activeDragState.centerX, clientY - activeDragState.centerY);
          const scaleFactor = currentDistance / activeDragState.initialDistance;
          const newScale = Math.max(0.4, Math.min(3.0, parseFloat((initialScale * scaleFactor).toFixed(2))));
          setLayers((prev) => prev.map((l) => (l.id === layerId ? { ...l, scale: newScale } : l)));
        } else {
          const delta = (clientX - startX) + (clientY - startY);
          const newScale = Math.max(0.4, Math.min(3.0, parseFloat((initialScale + delta * 0.012).toFixed(2))));
          setLayers((prev) => prev.map((l) => (l.id === layerId ? { ...l, scale: newScale } : l)));
        }
      } else if (type === 'rotate') {
        if (activeDragState.centerX !== undefined && activeDragState.centerY !== undefined && activeDragState.initialAngleRad !== undefined) {
          const currentAngleRad = Math.atan2(clientY - activeDragState.centerY, clientX - activeDragState.centerX);
          const angleDeltaDeg = Math.round(((currentAngleRad - activeDragState.initialAngleRad) * 180) / Math.PI);
          const newRot = (initialRotation + angleDeltaDeg + 3600) % 360;
          setLayers((prev) => prev.map((l) => (l.id === layerId ? { ...l, rotation: newRot } : l)));
        } else {
          const deltaX = clientX - startX;
          const newRot = (initialRotation + Math.round(deltaX * 1.2)) % 360;
          setLayers((prev) => prev.map((l) => (l.id === layerId ? { ...l, rotation: newRot } : l)));
        }
      }
    };

    const handleWindowPointerUp = () => {
      setActiveDragState(null);
    };

    window.addEventListener('pointermove', handleWindowPointerMove);
    window.addEventListener('pointerup', handleWindowPointerUp);
    window.addEventListener('touchmove', handleWindowPointerMove, { passive: false });
    window.addEventListener('touchend', handleWindowPointerUp);

    return () => {
      window.removeEventListener('pointermove', handleWindowPointerMove);
      window.removeEventListener('pointerup', handleWindowPointerUp);
      window.removeEventListener('touchmove', handleWindowPointerMove);
      window.removeEventListener('touchend', handleWindowPointerUp);
    };
  }, [activeDragState]);

  // Pointer Down Handlers
  const handlePointerDownLayer = (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedLayerId(id);

    const layer = layers.find((l) => l.id === id);
    if (!layer) return;

    const startX = e.clientX !== undefined && e.clientX !== 0 ? e.clientX : (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
    const startY = e.clientY !== undefined && e.clientY !== 0 ? e.clientY : (e.touches && e.touches[0] ? e.touches[0].clientY : 0);

    setActiveDragState({
      type: 'move',
      layerId: id,
      startX,
      startY,
      initialX: layer.x,
      initialY: layer.y
    });
  };

  const handlePointerDownRotate = (id, e) => {
    e.preventDefault();
    e.stopPropagation();

    const layer = layers.find((l) => l.id === id);
    if (!layer) return;

    const center = getLayerCenterScreenCoords(layer);
    const startX = e.clientX !== undefined && e.clientX !== 0 ? e.clientX : (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
    const startY = e.clientY !== undefined && e.clientY !== 0 ? e.clientY : (e.touches && e.touches[0] ? e.touches[0].clientY : 0);

    const initialAngleRad = center ? Math.atan2(startY - center.centerY, startX - center.centerX) : 0;

    setActiveDragState({
      type: 'rotate',
      layerId: id,
      startX,
      startY,
      centerX: center?.centerX,
      centerY: center?.centerY,
      initialAngleRad,
      initialRotation: layer.rotation || 0
    });
  };

  const handlePointerDownScale = (id, e) => {
    e.preventDefault();
    e.stopPropagation();

    const layer = layers.find((l) => l.id === id);
    if (!layer) return;

    const center = getLayerCenterScreenCoords(layer);
    const startX = e.clientX !== undefined && e.clientX !== 0 ? e.clientX : (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
    const startY = e.clientY !== undefined && e.clientY !== 0 ? e.clientY : (e.touches && e.touches[0] ? e.touches[0].clientY : 0);

    const initialDistance = center ? Math.hypot(startX - center.centerX, startY - center.centerY) : 1;

    setActiveDragState({
      type: 'scale',
      layerId: id,
      startX,
      startY,
      centerX: center?.centerX,
      centerY: center?.centerY,
      initialDistance: initialDistance || 1,
      initialScale: layer.scale || 1.0
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
    
    const st = STICKER_ITEMS.find((s) => s.id === stickerId);
    const img = st?.image || st?.imageUrl || null;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = Math.max(15, Math.min(85, Math.round(((e.clientX - rect.left) / rect.width) * 100)));
    const y = Math.max(15, Math.min(85, Math.round(((e.clientY - rect.top) / rect.height) * 100)));

    const newLayer = {
      id: img ? `image-${Date.now()}` : `sticker-${Date.now()}`,
      type: img ? 'image' : 'sticker',
      stickerId,
      src: img,
      x,
      y,
      scale: 1.0,
      rotation: 0
    };
    setLayers((prev) => [...prev, newLayer]);
    setSelectedLayerId(newLayer.id);
  };

  const selectedLayer = layers.find((l) => l.id === selectedLayerId);
  const caseBgColor = selectedCaseType?.color || selectedCaseType?.bg || '#14110F';
  const caseRingColor = selectedCaseType?.color || selectedCaseType?.ring || '#E8A33D';

  const isLightCase = selectedCaseType?.id === 'clear' || selectedCaseType?.id === 'frost' || selectedCaseType?.id === 'bone';
  const logoHorizonColor = isLightCase ? '#0A0C16' : '#EDE4D3';
  const logoTextColor = isLightCase ? 'text-[#0A0C16] drop-shadow-[0_1px_2px_rgba(255,255,255,0.9)]' : 'text-[#E8A33D] drop-shadow-[0_1px_6px_rgba(0,0,0,0.95)]';

  const navigate = useNavigate();

  const dynamicStickerCategories = (Array.isArray(activeBuilderCategories) && activeBuilderCategories.length > 0)
    ? activeBuilderCategories
    : [
        { id: 'motifs', labelAr: 'أشكال ومجسمات', labelEn: 'Shapes & Motifs', icon: '✨' },
        { id: 'quotes-ar', labelAr: 'عبارات عربية', labelEn: 'Arabic Quotes', icon: '📜' },
        { id: 'quotes-en', labelAr: 'عبارات إنجليزي', labelEn: 'English Quotes', icon: '💬' },
        { id: 'letters', labelAr: 'حروف رقعة', labelEn: 'Arabic Letters', icon: '🔤' },
        { id: 'years', labelAr: 'سنوات ميلادية', labelEn: 'Gregorian Years', icon: '📅' },
        { id: 'months', labelAr: 'أشهر السنة', labelEn: 'Months of the Year', icon: '🗓️' },
        { id: 'letters-en', labelAr: 'حروف إنجليزي', labelEn: 'English Letters', icon: '🅰️' },
      ];

  const CATEGORY_PILLS = [
    ...dynamicStickerCategories,
    { id: 'model', labelAr: 'نوع ورسم الجراب', labelEn: 'Case & Model', icon: '📱' },
    { id: 'text-photo', labelAr: 'كتابة وصور', labelEn: 'Text & Upload', icon: '🖼️' },
    { id: 'presets', labelAr: 'قوالب جاهزة', labelEn: 'Presets', icon: '🎨' },
  ];

  const [activeCategory, setActiveCategory] = useState(() => CATEGORY_PILLS[0]?.id || 'motifs');

  const getStickerSubLabel = (st) => {
    if (!st) return '';
    if (st.id?.startsWith('ar-letter-')) return st.id.replace('ar-letter-', '');
    if (st.id?.startsWith('en-letter-')) return st.id.replace('en-letter-', '').toUpperCase();
    if (st.id?.startsWith('year-')) {
      const yr = st.id.replace('year-', '');
      return yr === '199x' ? 'Made In 199x' : yr;
    }
    if (st.id?.startsWith('month-')) {
      const mo = st.id.replace('month-', '');
      const monthNames = { jan: 'Jan', feb: 'Feb', mar: 'Mar', apr: 'Apr', may: 'May', jun: 'Jun', jul: 'Jul', aug: 'Aug', sep: 'Sep', oct: 'Oct', nov: 'Nov', dec: 'Dec' };
      return `Made In ${monthNames[mo] || mo}`;
    }
    return lang === 'ar' ? (st.nameAr || st.nameEn) : (st.nameEn || st.nameAr);
  };

  const filteredStickers = STICKER_ITEMS.filter((st) => {
    if (!activeCategory || activeCategory === 'all') return true;
    if (activeCategory === 'motifs') return st.category === 'motifs' || st.id?.startsWith('motif-');
    if (activeCategory === 'quotes-ar') return st.category === 'quotes-ar' || st.id?.startsWith('quote-ar-') || st.id?.startsWith('slogan-');
    if (activeCategory === 'quotes-en') return st.category === 'quotes-en' || st.id?.startsWith('quote-en-');
    if (activeCategory === 'letters') return st.category === 'letters' || st.id?.startsWith('ar-letter-');
    if (activeCategory === 'letters-en') return st.category === 'letters-en' || st.id?.startsWith('en-letter-');
    if (activeCategory === 'years') return st.category === 'years' || st.id?.startsWith('num-') || st.id?.startsWith('year-');
    if (activeCategory === 'months') return st.category === 'months' || st.id?.startsWith('month-');
    return st.category === activeCategory;
  });

  const activePillObj = CATEGORY_PILLS.find((c) => c.id === activeCategory);
  const sheetTitle = activePillObj
    ? (lang === 'ar' ? activePillObj.labelAr : activePillObj.labelEn)
    : (lang === 'ar' ? 'اختر التعديل' : 'Select Tool');

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
      mockupSnapshotUrl = generateCaseMockupSnapshot(canvasRef.current, layers, caseBgColor, caseRingColor, selectedCaseType);
    }

    const priceNum = Number(builderPrice) || 850;

    const customizerItem = {
      id: `custom-case-${Date.now()}`,
      name: lang === 'ar' ? `جراب مخصص — ${currentModelName}` : `Custom Case — ${currentModelName}`,
      nameAr: `جراب مخصص — ${currentModelName}`,
      nameEn: `Custom Case — ${currentModelName}`,
      price: priceNum,
      image: mockupSnapshotUrl || 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&fit=crop&w=600&q=80',
      category: 'customizer',
      isCustom: true,
      selectedModel: currentModelName,
      caseType: selectedCaseType?.nameEn || selectedCaseType?.nameAr || 'Standard Matte',
      caseFinish: selectedCaseType?.caseFinish || selectedCaseType?.nameEn || 'Matte',
      layers,
      quantity: 1
    };

    addToCart(customizerItem);
    showToast(lang === 'ar' ? 'تمت إضافة تصميم الجراب للسلة بنجاح! 📱✨' : 'Custom case design added to cart! 📱✨');
    navigate('/checkout');
  };

  const handleNextPill = () => {
    const currIdx = CATEGORY_PILLS.findIndex((c) => c.id === activeCategory);
    if (currIdx < CATEGORY_PILLS.length - 1) {
      setActiveCategory(CATEGORY_PILLS[currIdx + 1].id);
    } else {
      handleAddToCart();
    }
  };



  const renderPhoneCanvas = (isDesktopCanvas = false) => (
    <div className="w-[300px] sm:w-[340px] aspect-[3/5] relative flex flex-col items-center justify-center select-none overflow-visible">
      <div className="absolute -left-1.5 top-20 w-1.5 h-10 bg-stone-400/80 rounded-l-md" />
      <div className="absolute -left-1.5 top-34 w-1.5 h-10 bg-stone-400/80 rounded-l-md" />
      <div className="absolute -right-1.5 top-28 w-1.5 h-12 bg-stone-400/80 rounded-r-md" />

      <div
        ref={isDesktopCanvas ? undefined : canvasRef}
        onDragOver={handleCanvasDragOver}
        onDrop={handleCanvasDrop}
        className={`w-full h-full rounded-[42px] border-[3px] relative flex flex-col justify-between p-4 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.18)] transition-colors duration-500 cursor-crosshair ${
          isNight ? 'border-stone-700/80' : 'border-stone-300/80'
        }`}
        style={{ backgroundColor: caseBgColor }}
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.08] to-transparent pointer-events-none z-10" />

        <div
          className="self-start w-22 h-22 sm:w-24 sm:h-24 rounded-[22px] border-2 shadow-xl flex flex-col justify-between p-2.5 z-20 relative overflow-hidden bg-[#090A0E]"
          style={{ borderColor: caseRingColor, backgroundColor: '#090A0E' }}
        >
          <div className="flex justify-between items-center z-10">
            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#161822] border-2 border-stone-600/80 flex items-center justify-center shadow-inner">
              <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-blue-950 border border-ash/40" />
            </div>
            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#161822] border-2 border-stone-600/80 flex items-center justify-center shadow-inner">
              <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-blue-950 border border-ash/40" />
            </div>
          </div>
          <div className="flex justify-between items-center z-10">
            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#161822] border-2 border-stone-600/80 flex items-center justify-center shadow-inner">
              <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-blue-950 border border-ash/40" />
            </div>
            <div className="flex flex-col items-center gap-1 mr-0.5">
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-amber-100/90 border border-amber-300 shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-black border border-stone-700" />
            </div>
          </div>
        </div>

        {(selectedCaseType?.id === 'magsafe' || selectedCaseType?.id === 'gold-ring') && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-36 h-36 sm:w-40 sm:h-40 rounded-full border-[3px] border-amber-400/60 shadow-sm pointer-events-none" />
        )}

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
                className={`absolute cursor-grab active:cursor-grabbing p-2 select-none touch-none ${
                  isSelected ? 'ring-2 ring-gold ring-offset-2 ring-offset-transparent z-30' : 'z-10'
                }`}
              >
                {isSelected && (
                  <>
                    <div
                      onPointerDown={(e) => handlePointerDownRotate(layer.id, e)}
                      className="absolute -top-8 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-stone-900 text-white flex items-center justify-center cursor-ew-resize shadow-lg hover:scale-110 transition-transform font-mono text-[10px] font-bold z-40 min-w-[28px] min-h-[28px]"
                      title="Drag to rotate"
                    >
                      <RotateCw size={13} />
                    </div>

                    <div
                      onPointerDown={(e) => handleRemoveLayer(layer.id, e)}
                      className="absolute -top-3.5 -right-3.5 w-7 h-7 rounded-full bg-red-600 text-white flex items-center justify-center cursor-pointer shadow-lg hover:scale-110 transition-transform font-mono text-[10px] font-bold z-40 min-w-[28px] min-h-[28px]"
                      title="Remove layer"
                    >
                      ✕
                    </div>

                    <div
                      onPointerDown={(e) => handlePointerDownScale(layer.id, e)}
                      className="absolute -bottom-3.5 -right-3.5 w-7 h-7 rounded-full bg-stone-900 text-white flex items-center justify-center cursor-nwse-resize shadow-lg hover:scale-110 transition-transform font-mono text-[10px] font-bold z-40 min-w-[28px] min-h-[28px]"
                      title="Drag to scale"
                    >
                      <Maximize2 size={13} />
                    </div>
                  </>
                )}

                {layer.type === 'sticker' && (
                  <StickerIcon
                    stickerId={layer.stickerId}
                    image={layer.src || STICKER_ITEMS.find(s => s.id === layer.stickerId)?.image || STICKER_PRESETS.find(s => s.id === layer.stickerId)?.image}
                    size={48}
                    color={layer.color}
                    bgColor={layer.bgColor}
                    forCanvas={true}
                  />
                )}

                {layer.type === 'text' && (
                  <div
                    style={{
                      color: layer.color || '#18181B',
                      backgroundColor: layer.bgColor === 'transparent' ? 'transparent' : (layer.bgColor || '#FFFFFF')
                    }}
                    className={`whitespace-nowrap font-bold text-sm select-none px-4 py-2 rounded-full border border-stone-300 shadow-md backdrop-blur-sm ${
                      layer.font === 'ruqaa' ? 'font-ruqaa text-base' : layer.font === 'cinzel' ? 'font-cinzel text-base' : layer.font === 'kufi' ? 'font-kufi' : layer.font === 'mono' ? 'font-mono' : 'font-space'
                    }`}
                  >
                    {layer.text}
                  </div>
                )}

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

        {layers.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-stone-400 pointer-events-none">
            <Move size={28} className="text-gold/80 mb-1 animate-bounce" />
            <span className="font-sans text-xs uppercase tracking-wider font-semibold text-stone-400">
              {lang === 'ar' ? 'اختر استيكر لإضافته هنا' : 'ADD STICKERS HERE'}
            </span>
          </div>
        )}
      </div>
    </div>
  );

  const renderQuickToolbar = (isDarkTheme = false) => (
    <div className={`flex items-center justify-between gap-3 mt-3 w-[300px] sm:w-[340px] ${isDarkTheme ? 'text-stone-300' : 'text-stone-600'}`}>
      <div className="font-sans text-[11px] sm:text-xs font-medium truncate">
        {currentModelName} · {lang === 'ar' ? selectedCaseType?.nameAr : selectedCaseType?.nameEn}
      </div>

      <div className={`flex items-center gap-1 border shadow-sm rounded-full p-1 ${isDarkTheme ? 'bg-[#1C1917] border-stone-700' : 'bg-white border-stone-200/90'}`}>
        <button
          type="button"
          onClick={handleUndo}
          disabled={!canUndo}
          className={`p-1.5 rounded-full transition-all ${canUndo ? (isDarkTheme ? 'text-bone hover:bg-stone-800' : 'text-stone-800 hover:bg-stone-100') : 'text-stone-500 opacity-40 cursor-not-allowed'}`}
          title={lang === 'ar' ? 'تراجع (Ctrl+Z)' : 'Undo'}
        >
          <Undo2 size={15} />
        </button>
        <button
          type="button"
          onClick={handleRedo}
          disabled={!canRedo}
          className={`p-1.5 rounded-full transition-all ${canRedo ? (isDarkTheme ? 'text-bone hover:bg-stone-800' : 'text-stone-800 hover:bg-stone-100') : 'text-stone-500 opacity-40 cursor-not-allowed'}`}
          title={lang === 'ar' ? 'إعادة (Ctrl+Y)' : 'Redo'}
        >
          <Redo2 size={15} />
        </button>
        {layers.length > 0 && (
          <button
            type="button"
            onClick={() => updateLayersWithHistory([])}
            className="p-1.5 rounded-full text-red-500 hover:bg-red-950/40 transition-all cursor-pointer"
            title={lang === 'ar' ? 'مسح الكل' : 'Clear All'}
          >
            <Trash2 size={15} />
          </button>
        )}
      </div>
    </div>
  );

  return (
    <>
      <div className={`lg:hidden min-h-screen font-sans flex flex-col justify-between select-none pb-6 ${isNight ? 'bg-[#0B0908] text-bone' : 'bg-[#F8F7F4] text-stone-900'}`}>
        <header className="w-full max-w-4xl mx-auto px-4 py-3 flex items-center justify-between relative select-none z-20">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className={`p-2 transition-colors rounded-full flex items-center justify-center min-w-[40px] min-h-[40px] ${isNight ? 'text-bone hover:text-gold hover:bg-stone-800/60' : 'text-stone-700 hover:text-black hover:bg-stone-200/60'}`}
            title={lang === 'ar' ? 'الرجوع' : 'Back'}
          >
            {lang === 'ar' ? <ChevronRight size={22} /> : <ChevronLeft size={22} />}
          </button>

          <div className="flex flex-col items-center">
            <h1 className={`font-sans font-semibold text-base sm:text-lg tracking-tight ${isNight ? 'text-bone' : 'text-stone-900'}`}>
              {lang === 'ar' ? 'محرر مباشر' : 'Live Editor'}
            </h1>
            <div className="flex items-center gap-1.5 mt-1">
              <button
                type="button"
                onClick={() => setActiveCategory('model')}
                className={`transition-all duration-300 ${activeCategory === 'model' ? (isNight ? 'w-5 h-1.5 bg-gold rounded-full' : 'w-5 h-1.5 bg-stone-900 rounded-full') : (isNight ? 'w-1.5 h-1.5 bg-stone-700 rounded-full' : 'w-1.5 h-1.5 bg-stone-300 rounded-full')}`}
              />
              <button
                type="button"
                onClick={() => setActiveCategory('motifs')}
                className={`transition-all duration-300 ${['motifs','quotes-ar','quotes-en','letters','years','months','letters-en'].includes(activeCategory) ? (isNight ? 'w-5 h-1.5 bg-gold rounded-full' : 'w-5 h-1.5 bg-stone-900 rounded-full') : (isNight ? 'w-1.5 h-1.5 bg-stone-700 rounded-full' : 'w-1.5 h-1.5 bg-stone-300 rounded-full')}`}
              />
              <button
                type="button"
                onClick={() => setActiveCategory('text-photo')}
                className={`transition-all duration-300 ${activeCategory === 'text-photo' ? (isNight ? 'w-5 h-1.5 bg-gold rounded-full' : 'w-5 h-1.5 bg-stone-900 rounded-full') : (isNight ? 'w-1.5 h-1.5 bg-stone-700 rounded-full' : 'w-1.5 h-1.5 bg-stone-300 rounded-full')}`}
              />
              <button
                type="button"
                onClick={() => setActiveCategory('presets')}
                className={`transition-all duration-300 ${activeCategory === 'presets' ? (isNight ? 'w-5 h-1.5 bg-gold rounded-full' : 'w-5 h-1.5 bg-stone-900 rounded-full') : (isNight ? 'w-1.5 h-1.5 bg-stone-700 rounded-full' : 'w-1.5 h-1.5 bg-stone-300 rounded-full')}`}
              />
            </div>
          </div>
          <div className="w-10" />
        </header>

        <main className="flex-1 w-full max-w-4xl mx-auto px-4 flex flex-col items-center justify-center my-2 sm:my-4">
          {renderPhoneCanvas(false)}
          {renderQuickToolbar(isNight)}
        </main>

        <footer className={`w-full max-w-3xl mx-auto rounded-t-[32px] sm:rounded-3xl border p-4 sm:p-6 space-y-4 font-sans select-none z-30 ${isNight ? 'bg-[#14110F] border-stone-800/90 text-bone shadow-2xl' : 'bg-white border-stone-200/80 text-stone-900 shadow-[0_-10px_40px_rgba(0,0,0,0.06)]'}`}>
          <div className={`w-12 h-1 rounded-full mx-auto mb-1 ${isNight ? 'bg-stone-700' : 'bg-stone-300'}`} />

          <div className="flex items-center justify-between">
            <h2 className={`font-sans font-bold text-base sm:text-lg tracking-tight ${isNight ? 'text-bone' : 'text-stone-900'}`}>
              {sheetTitle}
            </h2>

            <button
              type="button"
              onClick={activeCategory === 'presets' || layers.length > 0 ? handleAddToCart : handleNextPill}
              className={`px-5 py-2.5 rounded-full font-medium text-xs sm:text-sm flex items-center gap-2 shadow-md transition-all transform active:scale-95 cursor-pointer ${isNight ? 'bg-gold text-[#0A0C16] hover:bg-amber-400 font-bold' : 'bg-[#18181B] hover:bg-black text-white'}`}
            >
              <span>{lang === 'ar' ? (layers.length > 0 ? 'أضف إلى السلة' : 'التالي') : (layers.length > 0 ? 'ADD TO CART' : 'Next')}</span>
              {lang === 'ar' ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
            </button>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 custom-scrollbar">
            {CATEGORY_PILLS.map((pill) => {
              const isActive = activeCategory === pill.id;
              return (
                <button
                  key={pill.id}
                  type="button"
                  onClick={() => setActiveCategory(pill.id)}
                  className={`px-4 py-2 rounded-full font-medium text-xs sm:text-sm whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer border ${
                    isActive
                      ? (isNight ? 'bg-gold text-[#0A0C16] border-gold font-bold shadow-md' : 'bg-[#18181B] text-white border-[#18181B] font-semibold shadow-sm')
                      : (isNight ? 'bg-[#1F1B18] text-bone border-stone-800 hover:border-gold/60 hover:text-gold' : 'bg-[#F4F3F0] text-stone-700 border-stone-200/60 hover:bg-stone-200/80')
                  }`}
                >
                  {lang === 'ar' ? pill.labelAr : pill.labelEn}
                </button>
              );
            })}
          </div>

          {selectedLayer && (
            <div className={`border rounded-2xl p-3 space-y-3 ${isNight ? 'bg-[#1F1B18] border-stone-800 text-bone' : 'bg-[#F8F7F4] border-stone-200 text-stone-800'}`}>
              <div className="flex justify-between items-center text-xs font-semibold">
                <span>{lang === 'ar' ? 'تحكم في الاستيكر المحدّد' : 'Selected Sticker Controls'}</span>
                <button
                  onClick={(e) => handleRemoveLayer(selectedLayer.id, e)}
                  className={`flex items-center gap-1 text-xs font-bold ${isNight ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-800'}`}
                >
                  <Trash2 size={13} />
                  <span>{lang === 'ar' ? 'حذف' : 'Remove'}</span>
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="space-y-1">
                  <label className="block text-stone-400">{lang === 'ar' ? 'الحجم' : 'Scale'} ({selectedLayer.scale.toFixed(1)}x)</label>
                  <input
                    type="range"
                    min="0.4"
                    max="3.0"
                    step="0.1"
                    value={selectedLayer.scale}
                    onChange={(e) => handleLayerTransform(selectedLayer.id, 'scale', parseFloat(e.target.value))}
                    className={`w-full cursor-pointer ${isNight ? 'accent-gold' : 'accent-black'}`}
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-stone-400">{lang === 'ar' ? 'التدوير' : 'Rotation'} ({selectedLayer.rotation}°)</label>
                  <input
                    type="range"
                    min="-180"
                    max="180"
                    step="5"
                    value={selectedLayer.rotation}
                    onChange={(e) => handleLayerTransform(selectedLayer.id, 'rotation', parseInt(e.target.value))}
                    className={`w-full cursor-pointer ${isNight ? 'accent-gold' : 'accent-black'}`}
                  />
                </div>
              </div>
            </div>
          )}

          {['motifs', 'quotes-ar', 'quotes-en', 'letters', 'years', 'months', 'letters-en', 'all'].includes(activeCategory) && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2 pt-1 custom-scrollbar max-w-full">
              {filteredStickers.map((st) => {
                const subLabel = getStickerSubLabel(st);
                return (
                  <button
                    key={st.id}
                    draggable={true}
                    onDragStart={(e) => handleStickerDragStart(st.id, e)}
                    onClick={() => handleAddSticker(st.id)}
                    className={`w-24 sm:w-28 flex-shrink-0 border rounded-2xl p-2.5 flex flex-col items-center justify-between transition-all cursor-pointer shadow-sm group select-none ${isNight ? 'bg-[#1F1B18] border-stone-800 hover:border-gold' : 'bg-[#F9F8F6] border-stone-200/90 hover:border-stone-900'}`}
                  >
                    <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center overflow-hidden p-1">
                      <StickerIcon
                        stickerId={st.id}
                        image={st.image || st.imageUrl}
                        size={54}
                        color={(st.id?.startsWith('ar-letter-') || st.id?.startsWith('en-letter-')) ? undefined : textColor}
                        bgColor={(st.id?.startsWith('ar-letter-') || st.id?.startsWith('en-letter-')) ? undefined : textBgColor}
                      />
                    </div>
                    <span className={`truncate max-w-full text-center mt-1.5 transition-colors ${getSubLabelFontClass(st)} ${isNight ? 'text-bone group-hover:text-gold' : 'text-stone-600 group-hover:text-stone-900'}`}>
                      {subLabel}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {activeCategory === 'model' && (
            <div className="space-y-4 pt-1 font-sans text-xs animate-fade-in">
              <div className="space-y-1.5">
                <label className={`font-bold block text-xs ${isNight ? 'text-gold' : 'text-stone-900'}`}>{t('selectModel')}</label>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className={`w-full p-2.5 rounded-xl font-sans text-sm outline-none border min-h-[44px] ${isNight ? 'bg-[#1F1B18] border-stone-800 text-bone focus:border-gold' : 'bg-[#F8F7F4] border-stone-200 text-stone-900 focus:border-stone-900'}`}
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

                {isCustomModelOption && (
                  <div className="pt-1 space-y-1">
                    <input
                      type="text"
                      value={customModelInput}
                      onChange={(e) => setCustomModelInput(e.target.value)}
                      placeholder={t('customModelPlaceholder')}
                      className={`w-full p-2.5 rounded-xl text-xs outline-none border ${isNight ? 'bg-[#1F1B18] border-stone-800 text-bone focus:border-gold' : 'bg-[#F8F7F4] border-stone-300 text-stone-900 focus:border-stone-900'}`}
                    />
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <label className={`font-bold block text-xs ${isNight ? 'text-gold' : 'text-stone-900'}`}>{t('caseType')}</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {CASE_TYPES.map((ct) => {
                    const active = selectedCaseType?.id === ct.id;
                    return (
                      <button
                        key={ct.id}
                        type="button"
                        onClick={() => setSelectedCaseType(ct)}
                        className={`p-2.5 border rounded-xl text-left flex items-center gap-2 transition-all cursor-pointer ${
                          active
                            ? (isNight ? 'border-gold bg-gold/20 text-gold font-bold shadow-sm' : 'border-black bg-stone-900 text-white font-semibold shadow-sm')
                            : (isNight ? 'border-stone-800 bg-[#1F1B18] text-bone hover:border-stone-600' : 'border-stone-200 bg-[#F8F7F4] text-stone-800 hover:border-stone-400')
                        }`}
                      >
                        <div
                          className="w-3.5 h-3.5 rounded-full border border-stone-400 flex-shrink-0"
                          style={{ backgroundColor: ct.color || '#FFFFFF' }}
                        />
                        <span className="font-sans text-xs truncate font-semibold">
                          {lang === 'ar' ? ct.nameAr : ct.nameEn}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeCategory === 'text-photo' && (
            <div className="space-y-4 pt-1">
              <div className="space-y-2">
                <label className="text-xs font-semibold block">{t('tabText')}</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customText}
                    onChange={(e) => setCustomText(e.target.value)}
                    placeholder={t('textPlaceholder')}
                    className={`flex-1 p-2.5 rounded-xl font-sans text-sm outline-none border ${isNight ? 'bg-[#1F1B18] border-stone-800 text-bone focus:border-gold' : 'bg-[#F8F7F4] border-stone-200 text-stone-900 focus:border-stone-900'}`}
                  />
                  <button
                    type="button"
                    onClick={handleAddText}
                    className={`px-4 rounded-xl text-xs font-medium transition-colors ${isNight ? 'bg-gold text-[#0A0C16] hover:bg-amber-400 font-bold' : 'bg-[#18181B] text-white hover:bg-black'}`}
                  >
                    {t('addTextBtn')}
                  </button>
                </div>

                <div className="grid grid-cols-4 gap-1.5 pt-1">
                  <button
                    onClick={() => setTextFont('ruqaa')}
                    className={`p-2 border rounded-xl font-ruqaa text-xs ${textFont === 'ruqaa' ? (isNight ? 'border-gold bg-gold text-[#0A0C16] font-bold' : 'border-black bg-stone-900 text-white') : (isNight ? 'border-stone-800 bg-[#1F1B18]' : 'border-stone-200 bg-[#F8F7F4]')}`}
                  >
                    خط رقعة
                  </button>
                  <button
                    onClick={() => setTextFont('kufi')}
                    className={`p-2 border rounded-xl font-sans text-xs ${textFont === 'kufi' ? (isNight ? 'border-gold bg-gold text-[#0A0C16] font-bold' : 'border-black bg-stone-900 text-white') : (isNight ? 'border-stone-800 bg-[#1F1B18]' : 'border-stone-200 bg-[#F8F7F4]')}`}
                  >
                    IBM Kufi
                  </button>
                  <button
                    onClick={() => setTextFont('cinzel')}
                    className={`p-2 border rounded-xl font-cinzel text-xs ${textFont === 'cinzel' ? (isNight ? 'border-gold bg-gold text-[#0A0C16] font-bold' : 'border-black bg-stone-900 text-white') : (isNight ? 'border-stone-800 bg-[#1F1B18]' : 'border-stone-200 bg-[#F8F7F4]')}`}
                  >
                    Cinzel
                  </button>
                  <button
                    onClick={() => setTextFont('mono')}
                    className={`p-2 border rounded-xl font-mono text-xs ${textFont === 'mono' ? (isNight ? 'border-gold bg-gold text-[#0A0C16] font-bold' : 'border-black bg-stone-900 text-white') : (isNight ? 'border-stone-800 bg-[#1F1B18]' : 'border-stone-200 bg-[#F8F7F4]')}`}
                  >
                    Mono
                  </button>
                </div>
              </div>

              <div className={`border-t pt-3 space-y-2 ${isNight ? 'border-stone-800' : 'border-stone-200'}`}>
                <label className="text-xs font-semibold block">{t('tabImage')}</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className={`block w-full text-xs file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:font-medium cursor-pointer ${isNight ? 'text-stone-300 file:bg-gold file:text-[#0A0C16] file:font-bold' : 'text-stone-600 file:bg-stone-900 file:text-white'}`}
                />
              </div>
            </div>
          )}

          {activeCategory === 'presets' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {PRESET_TEMPLATES.map((tmpl) => (
                <button
                  key={tmpl.id}
                  type="button"
                  onClick={() => handleLoadPreset(tmpl)}
                  className={`p-3 border rounded-2xl text-left space-y-1 transition-all cursor-pointer group ${isNight ? 'bg-[#1F1B18] border-stone-800 hover:border-gold' : 'bg-[#F8F7F4] border-stone-200 hover:border-black'}`}
                >
                  <span className={`font-sans font-semibold text-xs sm:text-sm block ${isNight ? 'text-bone group-hover:text-gold' : 'text-stone-900 group-hover:text-black'}`}>
                    {lang === 'ar' ? tmpl.nameAr : tmpl.nameEn}
                  </span>
                  <span className={`text-[10px] uppercase tracking-wider block ${isNight ? 'text-gold' : 'text-stone-500'}`}>
                    {lang === 'ar' ? 'تحميل التصميم' : 'LOAD PRESET'}
                  </span>
                </button>
              ))}
            </div>
          )}

          <div className={`text-center font-sans text-xs flex items-center justify-center gap-1.5 pt-2 border-t ${isNight ? 'text-stone-400 border-stone-800/80' : 'text-stone-500 border-stone-100'}`}>
            <Info size={14} className={isNight ? 'text-gold' : 'text-stone-400'} />
            <span>
              {lang === 'ar'
                ? 'ⓘ اسحب للتحريك · إصبعين للتدوير · اضغط مطولاً للإزالة'
                : 'ⓘ Drag to move · Two fingers to rotate · Long press to remove'}
            </span>
          </div>
        </footer>
      </div>

      <div className={`hidden lg:block min-h-screen font-sans select-none pb-12 ${isNight ? 'bg-[#0B0908] text-bone' : 'bg-[#F7F6F2] text-stone-900'}`}>
        <header className={`w-full backdrop-blur-md border-b px-8 py-3.5 flex items-center justify-between sticky top-0 z-40 shadow-sm ${isNight ? 'bg-[#14110F]/95 border-stone-800/90 text-bone' : 'bg-white/95 border-stone-200/90 text-stone-900'}`}>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className={`p-2.5 rounded-xl border flex items-center justify-center cursor-pointer transition-colors ${isNight ? 'bg-[#1F1B18] text-bone border-stone-800 hover:text-gold hover:border-gold' : 'bg-[#F8F7F4] text-stone-700 border-stone-200 hover:bg-stone-200/60'}`}
              title={lang === 'ar' ? 'الرجوع' : 'Back'}
            >
              {lang === 'ar' ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            </button>

            <div>
              <span className={`font-mono text-[10px] font-bold uppercase tracking-widest block ${isNight ? 'text-gold' : 'text-amber-700'}`}>
                DUAT / LUXURY CUSTOMIZER STUDIO
              </span>
              <h1 className={`font-sans font-bold text-xl tracking-tight ${isNight ? 'text-bone' : 'text-stone-900'}`}>
                {lang === 'ar' ? 'مصنع دوات للجرابات المخصصة' : 'DUAT Custom Case Studio'}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3 font-sans text-xs">
            <button
              type="button"
              onClick={() => setActiveCategory('model')}
              title={lang === 'ar' ? 'انقر لتغيير موديل الهواتف' : 'Click to change phone model'}
              className={`px-3.5 py-1.5 rounded-full border font-semibold flex items-center gap-1.5 transition-all cursor-pointer hover:scale-105 ${isNight ? 'bg-[#1F1B18] border-stone-800 text-bone hover:border-gold' : 'bg-stone-100 border-stone-300 text-stone-900 shadow-sm hover:border-stone-900'}`}
            >
              <span>📱</span>
              <strong className={isNight ? 'text-gold' : 'text-stone-900'}>{displayModelBadgeText}</strong>
            </button>

            <button
              type="button"
              onClick={() => setActiveCategory('model')}
              title={lang === 'ar' ? 'انقر لتغيير نوع ونقاء الجراب' : 'Click to change case type'}
              className={`px-3.5 py-1.5 rounded-full border font-semibold flex items-center gap-1.5 transition-all cursor-pointer hover:scale-105 ${isNight ? 'bg-[#1F1B18] border-stone-800 text-bone hover:border-gold' : 'bg-stone-100 border-stone-300 text-stone-900 shadow-sm hover:border-stone-900'}`}
            >
              <span>🎨</span>
              <span className={isNight ? 'text-bone' : 'text-stone-800'}>{lang === 'ar' ? selectedCaseType?.nameAr : selectedCaseType?.nameEn}</span>
            </button>

            <div className={`font-bold px-4 py-1.5 rounded-full shadow-sm ${isNight ? 'bg-gold text-[#0A0C16] shadow-gold/20' : 'bg-[#18181B] text-white'}`}>
              {builderPrice || 850} EGP
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-6 pt-6 grid grid-cols-12 gap-8 items-start">
          <div className={`col-span-5 rounded-3xl p-8 border flex flex-col items-center justify-center sticky top-24 space-y-4 ${isNight ? 'bg-[#14110F] border-stone-800/90 shadow-2xl' : 'bg-white border-stone-200/90 shadow-lg'}`}>
            <div className={`font-sans text-xs font-semibold uppercase tracking-wider flex items-center gap-2 ${isNight ? 'text-gold' : 'text-amber-700'}`}>
              <Sparkles size={15} className={isNight ? 'text-gold' : 'text-amber-600'} />
              <span>{lang === 'ar' ? 'معاينة الجراب التفاعلية' : 'Interactive Case Canvas'}</span>
            </div>

            {renderPhoneCanvas(isNight)}
            {renderQuickToolbar(isNight)}

            <div className={`font-sans text-xs text-center pt-3 border-t w-full ${isNight ? 'text-stone-400 border-stone-800/60' : 'text-stone-500 border-stone-100'}`}>
              ⓘ {lang === 'ar' ? 'اسحب أي استيكر مباشرة على الجراب · انقر لتحديده وتعديله' : 'Drag any sticker directly onto phone canvas · Click layer to select'}
            </div>
          </div>

          <div className="col-span-7 space-y-6">
            <div className={`rounded-3xl p-6 border space-y-6 ${isNight ? 'bg-[#14110F] border-stone-800/90 text-bone shadow-2xl' : 'bg-white border-stone-200/90 text-stone-900 shadow-lg'}`}>
              <div>
                <span className={`font-sans text-xs font-bold uppercase tracking-wider block mb-2.5 ${isNight ? 'text-gold' : 'text-stone-900'}`}>
                  {lang === 'ar' ? 'أقسام البلدر والتصميم' : 'Builder Categories'}
                </span>
                <div className={`flex flex-wrap items-center gap-2 border-b pb-4 ${isNight ? 'border-stone-800/80' : 'border-stone-100'}`}>
                  {CATEGORY_PILLS.map((pill) => {
                    const isActive = activeCategory === pill.id;
                    return (
                      <button
                        key={pill.id}
                        type="button"
                        onClick={() => setActiveCategory(pill.id)}
                        className={`px-4 py-2 rounded-full font-medium text-xs sm:text-sm whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer border ${
                          isActive
                            ? (isNight ? 'bg-gold text-[#0A0C16] border-gold font-bold shadow-md shadow-gold/20' : 'bg-[#18181B] text-white border-[#18181B] font-semibold shadow-md')
                            : (isNight ? 'bg-[#1F1B18] text-bone border-stone-800 hover:border-gold/60 hover:text-gold font-medium' : 'bg-[#F4F3F0] text-stone-700 border-stone-200/70 hover:bg-stone-200/80 font-medium')
                        }`}
                      >
                        <span>{pill.icon}</span>
                        <span>{lang === 'ar' ? pill.labelAr : pill.labelEn}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {selectedLayer && (
                <div className={`rounded-2xl p-4 space-y-3 shadow-sm animate-fade-in border ${isNight ? 'bg-[#1F1B18] border-gold/40 text-bone' : 'bg-[#F8F7F4] border-stone-200 text-stone-900'}`}>
                  <div className={`flex justify-between items-center text-xs font-bold border-b pb-2 ${isNight ? 'text-gold border-stone-800' : 'text-stone-900 border-stone-200/80'}`}>
                    <span>✨ {lang === 'ar' ? 'التحكم في الاستيكر المحدّد' : 'Selected Sticker Controls'}</span>
                    <button
                      onClick={(e) => handleRemoveLayer(selectedLayer.id, e)}
                      className={`flex items-center gap-1 text-xs font-bold transition-colors cursor-pointer ${isNight ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-800'}`}
                    >
                      <Trash2 size={14} />
                      <span>{lang === 'ar' ? 'حذف الاستيكر' : 'Remove Sticker'}</span>
                    </button>
                  </div>
                  
                  <div className={`grid grid-cols-2 gap-4 text-xs font-medium ${isNight ? 'text-stone-300' : 'text-stone-700'}`}>
                    <div className="space-y-1">
                      <label className="block">{lang === 'ar' ? 'الحجم' : 'Scale'} ({selectedLayer.scale.toFixed(1)}x)</label>
                      <input
                        type="range"
                        min="0.4"
                        max="3.0"
                        step="0.1"
                        value={selectedLayer.scale}
                        onChange={(e) => handleLayerTransform(selectedLayer.id, 'scale', parseFloat(e.target.value))}
                        className={`w-full cursor-pointer ${isNight ? 'accent-gold' : 'accent-black'}`}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block">{lang === 'ar' ? 'التدوير' : 'Rotation'} ({selectedLayer.rotation}°)</label>
                      <input
                        type="range"
                        min="-180"
                        max="180"
                        step="5"
                        value={selectedLayer.rotation}
                        onChange={(e) => handleLayerTransform(selectedLayer.id, 'rotation', parseInt(e.target.value))}
                        className={`w-full cursor-pointer ${isNight ? 'accent-gold' : 'accent-black'}`}
                      />
                    </div>
                  </div>
                </div>
              )}

              {['motifs', 'quotes-ar', 'quotes-en', 'letters', 'years', 'months', 'letters-en', 'all'].includes(activeCategory) && (
                <div className="space-y-3">
                  <div className={`flex items-center justify-between font-sans text-xs font-medium ${isNight ? 'text-stone-300' : 'text-stone-600'}`}>
                    <span>{lang === 'ar' ? `استيكرات قسم (${sheetTitle}) — ${filteredStickers.length}` : `Stickers in (${sheetTitle}) — ${filteredStickers.length}`}</span>
                    <span className={`font-semibold ${isNight ? 'text-gold' : 'text-amber-700'}`}>انقر أو اسحب للجراب 🖱️</span>
                  </div>

                  <div className="grid grid-cols-4 sm:grid-cols-5 gap-3 max-h-[380px] overflow-y-auto custom-scrollbar p-1">
                    {filteredStickers.map((st) => {
                      const subLabel = getStickerSubLabel(st);
                      return (
                        <button
                          key={st.id}
                          draggable={true}
                          onDragStart={(e) => handleStickerDragStart(st.id, e)}
                          onClick={() => handleAddSticker(st.id)}
                          className={`rounded-2xl p-3 flex flex-col items-center justify-between transition-all cursor-pointer group select-none hover:shadow-md hover:scale-105 border ${isNight ? 'bg-[#1F1B18] border-stone-800 hover:border-gold shadow-md' : 'bg-[#F9F8F6] border-stone-200/90 hover:border-stone-900 shadow-sm'}`}
                          title={lang === 'ar' ? 'انقر لإضافة الاستيكر للجراب' : 'Click to add sticker to case'}
                        >
                          <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center overflow-hidden p-1">
                            <StickerIcon
                              stickerId={st.id}
                              image={st.image || st.imageUrl}
                              size={56}
                              color={(st.id?.startsWith('ar-letter-') || st.id?.startsWith('en-letter-')) ? undefined : textColor}
                              bgColor={(st.id?.startsWith('ar-letter-') || st.id?.startsWith('en-letter-')) ? undefined : textBgColor}
                            />
                          </div>
                          <span className={`truncate max-w-full text-center mt-2 transition-colors ${getSubLabelFontClass(st)} ${isNight ? 'text-bone group-hover:text-gold' : 'text-stone-600 group-hover:text-stone-900'}`}>
                            {subLabel}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {activeCategory === 'model' && (
                <div className="space-y-5 font-sans text-xs animate-fade-in">
                  <div className="space-y-2">
                    <label className={`font-bold block text-sm ${isNight ? 'text-gold' : 'text-stone-900'}`}>📱 {t('selectModel')}:</label>
                    <select
                      value={selectedModel}
                      onChange={(e) => setSelectedModel(e.target.value)}
                      className={`w-full p-3 rounded-xl font-sans text-sm font-medium outline-none border min-h-[44px] ${isNight ? 'bg-[#1F1B18] border-stone-800 text-bone focus:border-gold' : 'bg-[#F8F7F4] border-stone-300 text-stone-900 focus:border-stone-900'}`}
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

                    {isCustomModelOption && (
                      <div className="pt-2 space-y-1">
                        <input
                          type="text"
                          value={customModelInput}
                          onChange={(e) => setCustomModelInput(e.target.value)}
                          placeholder={t('customModelPlaceholder')}
                          className={`w-full p-3 rounded-xl text-xs font-medium outline-none border ${isNight ? 'bg-[#1F1B18] border-stone-800 text-bone focus:border-gold' : 'bg-[#F8F7F4] border-stone-300 text-stone-900 focus:border-stone-900'}`}
                        />
                      </div>
                    )}
                  </div>

                  <div className={`space-y-2 pt-3 border-t ${isNight ? 'border-stone-800' : 'border-stone-100'}`}>
                    <label className={`font-bold block text-sm ${isNight ? 'text-gold' : 'text-stone-900'}`}>🎨 {t('caseType')}:</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {CASE_TYPES.map((ct) => {
                        const active = selectedCaseType?.id === ct.id;
                        return (
                          <button
                            key={ct.id}
                            type="button"
                            onClick={() => setSelectedCaseType(ct)}
                            className={`p-3 border rounded-xl text-left flex items-center gap-3 transition-all cursor-pointer ${
                              active
                                ? (isNight ? 'border-gold bg-gold/20 text-gold font-bold shadow-md' : 'border-black bg-stone-900 text-white font-bold shadow-md')
                                : (isNight ? 'border-stone-800 bg-[#1F1B18] text-bone hover:border-stone-600' : 'border-stone-200 bg-[#F8F7F4] text-stone-800 hover:border-stone-400 font-medium')
                            }`}
                          >
                            <div
                              className="w-4 h-4 rounded-full border border-stone-400 flex-shrink-0"
                              style={{ backgroundColor: ct.color || '#FFFFFF' }}
                            />
                            <span className="font-sans text-xs truncate font-semibold">
                              {lang === 'ar' ? ct.nameAr : ct.nameEn}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {activeCategory === 'text-photo' && (
                <div className="space-y-5 font-sans text-xs">
                  <div className="space-y-2">
                    <label className={`font-bold block text-sm ${isNight ? 'text-gold' : 'text-stone-900'}`}>✍️ {t('tabText')}:</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={customText}
                        onChange={(e) => setCustomText(e.target.value)}
                        placeholder={t('textPlaceholder')}
                        className={`flex-1 p-3 rounded-xl font-sans text-sm outline-none border ${isNight ? 'bg-[#1F1B18] border-stone-800 text-bone focus:border-gold' : 'bg-[#F8F7F4] border-stone-200 text-stone-900 focus:border-stone-900'}`}
                      />
                      <button
                        type="button"
                        onClick={handleAddText}
                        className={`px-5 rounded-xl text-xs font-semibold transition-colors ${isNight ? 'bg-gold text-[#0A0C16] hover:bg-amber-400 font-bold' : 'bg-[#18181B] hover:bg-black text-white'}`}
                      >
                        {t('addTextBtn')}
                      </button>
                    </div>

                    <div className="grid grid-cols-4 gap-2 pt-2">
                      <button
                        onClick={() => setTextFont('ruqaa')}
                        className={`p-2.5 border rounded-xl font-ruqaa text-xs ${textFont === 'ruqaa' ? (isNight ? 'border-gold bg-gold text-[#0A0C16] font-bold' : 'border-black bg-stone-900 text-white font-semibold') : (isNight ? 'border-stone-800 bg-[#1F1B18] text-bone' : 'border-stone-200 bg-[#F8F7F4]')}`}
                      >
                        خط رقعة
                      </button>
                      <button
                        onClick={() => setTextFont('kufi')}
                        className={`p-2.5 border rounded-xl font-sans text-xs ${textFont === 'kufi' ? (isNight ? 'border-gold bg-gold text-[#0A0C16] font-bold' : 'border-black bg-stone-900 text-white font-semibold') : (isNight ? 'border-stone-800 bg-[#1F1B18] text-bone' : 'border-stone-200 bg-[#F8F7F4]')}`}
                      >
                        IBM Kufi
                      </button>
                      <button
                        onClick={() => setTextFont('cinzel')}
                        className={`p-2.5 border rounded-xl font-cinzel text-xs ${textFont === 'cinzel' ? (isNight ? 'border-gold bg-gold text-[#0A0C16] font-bold' : 'border-black bg-stone-900 text-white font-semibold') : (isNight ? 'border-stone-800 bg-[#1F1B18] text-bone' : 'border-stone-200 bg-[#F8F7F4]')}`}
                      >
                        Cinzel
                      </button>
                      <button
                        onClick={() => setTextFont('mono')}
                        className={`p-2.5 border rounded-xl font-mono text-xs ${textFont === 'mono' ? (isNight ? 'border-gold bg-gold text-[#0A0C16] font-bold' : 'border-black bg-stone-900 text-white font-semibold') : (isNight ? 'border-stone-800 bg-[#1F1B18] text-bone' : 'border-stone-200 bg-[#F8F7F4]')}`}
                      >
                        Mono
                      </button>
                    </div>
                  </div>

                  <div className={`border-t pt-4 space-y-2 ${isNight ? 'border-stone-800' : 'border-stone-100'}`}>
                    <label className={`font-bold block text-sm ${isNight ? 'text-gold' : 'text-stone-900'}`}>🖼️ {t('tabImage')}:</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className={`block w-full text-xs file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:font-semibold cursor-pointer ${isNight ? 'text-stone-300 file:bg-gold file:text-[#0A0C16] file:font-bold' : 'text-stone-600 file:bg-stone-900 file:text-white'}`}
                    />
                  </div>
                </div>
              )}

              {activeCategory === 'presets' && (
                <div className="grid grid-cols-2 gap-3 pt-1">
                  {PRESET_TEMPLATES.map((tmpl) => (
                    <button
                      key={tmpl.id}
                      type="button"
                      onClick={() => handleLoadPreset(tmpl)}
                      className={`p-4 border rounded-2xl text-left space-y-1 transition-all cursor-pointer group shadow-sm ${isNight ? 'bg-[#1F1B18] border-stone-800 hover:border-gold' : 'bg-[#F8F7F4] border-stone-200 hover:border-stone-900'}`}
                    >
                      <span className={`font-sans font-semibold text-xs block ${isNight ? 'text-bone group-hover:text-gold' : 'text-stone-900 group-hover:text-black'}`}>
                        {lang === 'ar' ? tmpl.nameAr : tmpl.nameEn}
                      </span>
                      <span className={`text-[10px] uppercase tracking-wider block font-sans ${isNight ? 'text-gold' : 'text-stone-500'}`}>
                        {lang === 'ar' ? 'تحميل التصميم' : 'LOAD PRESET'}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className={`p-5 rounded-3xl flex items-center justify-between border shadow-xl ${isNight ? 'bg-[#14110F] border-gold/40 shadow-2xl' : 'bg-white border-stone-200/90 shadow-xl'}`}>
              <div>
                <span className={`font-sans text-xs block uppercase tracking-wider font-medium ${isNight ? 'text-stone-400' : 'text-stone-500'}`}>
                  {lang === 'ar' ? 'إجمالي السعر' : 'Total Price'}
                </span>
                <div className={`font-sans text-2xl font-bold ${isNight ? 'text-bone' : 'text-stone-900'}`}>
                  {builderPrice || 850} <span className={`text-sm font-semibold ${isNight ? 'text-gold' : 'text-amber-700'}`}>ج.م</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                className="bg-[#18181B] hover:bg-black text-white py-4 px-8 rounded-full font-bold text-xs uppercase tracking-wider flex items-center gap-3 shadow-lg hover:shadow-xl transition-all transform active:scale-95 cursor-pointer"
              >
                <span>{lang === 'ar' ? 'أضف إلى السلة الآن' : 'ADD TO CART NOW'}</span>
                {lang === 'ar' ? <ArrowLeft size={18} /> : <ArrowRight size={18} />}
              </button>
            </div>

          </div>

        </main>
      </div>
    </>
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
