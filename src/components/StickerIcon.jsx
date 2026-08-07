import React from 'react';

// Natural proportions per sticker type
const STICKER_SIZES = {
  'st-born-dawn':    { width: 140, height: 50 },
  'st-through-night':{ width: 150, height: 50 },
  'st-crescent':     { width: 70,  height: 70 },
  'st-starry':       { width: 70,  height: 70 },
  'st-sun':          { width: 70,  height: 70 },
  'st-duat':         { width: 100, height: 42 },
};

export const StickerIcon = ({ stickerId, image, imageUrl, size = 48, color, bgColor, forCanvas = false }) => {
  const customImg = image || imageUrl;

  if (customImg) {
    const dims = STICKER_SIZES[stickerId];

    // On the phone canvas: use mix-blend-mode multiply to remove white background
    if (forCanvas || dims) {
      const w = dims ? dims.width : size * 2;
      const h = dims ? dims.height : size * 2;
      return (
        <div
          style={{ width: w, height: h, flexShrink: 0 }}
          className="flex items-center justify-center pointer-events-none select-none"
        >
          <img
            src={customImg}
            alt="Sticker"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              mixBlendMode: 'multiply',
              filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.35))',
            }}
            className="pointer-events-none select-none"
          />
        </div>
      );
    }

    // In the selection panel: full size, multiply to remove white box
    return (
      <div className="w-full h-full flex items-center justify-center relative select-none p-1 pointer-events-none shrink-0">
        <img
          src={customImg}
          alt="Sticker"
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain',
            mixBlendMode: 'multiply',
            filter: 'drop-shadow(0 3px 8px rgba(0,0,0,0.4))',
          }}
          className="pointer-events-none select-none"
        />
      </div>
    );
  }

  // Fallback synthetic 3D Domes (no image available)
  switch (stickerId) {
    case 'st-born-dawn':
      return (
        <div
          style={{
            color: '#FFF8ED',
            background: 'linear-gradient(135deg, #B26214 0%, #6E3808 100%)',
            borderColor: 'rgba(245, 178, 85, 0.7)',
            boxShadow: '0 8px 18px rgba(178,98,20,0.45), inset 0 2px 5px rgba(255,255,255,0.45)',
          }}
          className="font-serif italic font-medium px-4 py-1.5 rounded-full border text-xs whitespace-nowrap select-none relative overflow-hidden flex items-center justify-center pointer-events-none min-w-[115px] min-h-[36px]"
        >
          <div className="absolute top-0.5 left-2 w-2/5 h-1/2 bg-gradient-to-b from-white/40 to-transparent rounded-full blur-[0.5px] pointer-events-none" />
          born at dawn
        </div>
      );
    case 'st-through-night':
      return (
        <div
          style={{
            color: '#F0ECE1',
            background: 'linear-gradient(135deg, #0D1B2A 0%, #040810 100%)',
            borderColor: 'rgba(50, 80, 120, 0.7)',
            boxShadow: '0 8px 18px rgba(13,27,42,0.65), inset 0 2px 5px rgba(255,255,255,0.35)',
          }}
          className="font-serif italic font-medium px-4 py-1.5 rounded-full border text-xs whitespace-nowrap select-none relative overflow-hidden flex items-center justify-center pointer-events-none min-w-[115px] min-h-[36px]"
        >
          <div className="absolute top-0.5 left-2 w-2/5 h-1/2 bg-gradient-to-b from-white/35 to-transparent rounded-full blur-[0.5px] pointer-events-none" />
          through the night
        </div>
      );
    case 'st-crescent':
      return (
        <div
          style={{ width: size, height: size, background: 'radial-gradient(circle at 35% 35%, #181D28 0%, #05060A 100%)', boxShadow: '0 8px 18px rgba(0,0,0,0.65), inset 0 2px 5px rgba(255,255,255,0.4)' }}
          className="rounded-2xl border border-gray-600/50 flex items-center justify-center relative overflow-hidden select-none shrink-0 pointer-events-none"
        >
          <svg width={size * 0.58} height={size * 0.58} viewBox="0 0 24 24" fill="none">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="#E2DAC9" />
          </svg>
        </div>
      );
    case 'st-starry':
      return (
        <div
          style={{ width: size, height: size, background: 'radial-gradient(circle at 35% 35%, #121929 0%, #04060C 100%)', boxShadow: '0 8px 18px rgba(0,0,0,0.65)' }}
          className="rounded-2xl border border-gray-600/50 flex items-center justify-center relative overflow-hidden select-none shrink-0 pointer-events-none"
        >
          <div className="absolute inset-0 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:5px_5px] opacity-45" />
        </div>
      );
    case 'st-sun':
      return (
        <div
          style={{ width: size, height: size, background: 'radial-gradient(circle at 35% 35%, #FBF8F1 0%, #E2DAC9 100%)', boxShadow: '0 8px 18px rgba(0,0,0,0.35)' }}
          className="rounded-2xl border border-stone-300/70 flex flex-col items-center justify-center relative overflow-hidden select-none shrink-0 p-1 pointer-events-none"
        >
          <div className="w-4 h-4 rounded-full bg-[#C86B12] mb-0.5 shadow-sm" />
          <div className="w-5 h-0.5 bg-[#0F1424]" />
        </div>
      );
    case 'st-duat':
      return (
        <div
          style={{ color: '#D89E46', background: 'linear-gradient(135deg, #2B1F18 0%, #0E0906 100%)', borderColor: 'rgba(232, 163, 61, 0.6)', boxShadow: '0 8px 18px rgba(0,0,0,0.65)' }}
          className="font-serif font-bold px-3.5 py-1 rounded-full border text-xs tracking-widest uppercase whitespace-nowrap select-none relative overflow-hidden flex items-center justify-center pointer-events-none min-w-[84px] min-h-[32px]"
        >
          DUAT
        </div>
      );
    default:
      return (
        <div style={{ width: size, height: size, backgroundColor: bgColor || '#E8A33D' }} className="rounded-full shadow flex items-center justify-center">
          <span className="font-mono text-xs font-bold text-void">DU</span>
        </div>
      );
  }
};
