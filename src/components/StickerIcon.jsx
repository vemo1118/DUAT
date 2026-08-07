import React from 'react';

export const StickerIcon = ({ stickerId, image, imageUrl, size = 44, color, bgColor }) => {
  // If custom uploaded image (not standard presets), render clean image
  const customImg = image || imageUrl;
  if (customImg && !stickerId?.startsWith('st-')) {
    return (
      <div className="w-full h-full flex items-center justify-center relative select-none p-0.5 pointer-events-none">
        <img
          src={customImg}
          alt="Sticker"
          className="max-w-full max-h-full object-contain filter drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)] rounded-lg pointer-events-none select-none"
        />
      </div>
    );
  }

  const strokeColor = color || '#E0A93B';
  const fillColor = color || '#E0A93B';

  // Dynamic prefix matching for Arabic Letters, English Letters, Numbers/Years, and Quotes
  if (typeof stickerId === 'string') {
    if (stickerId.startsWith('ar-letter-')) {
      const char = stickerId.replace('ar-letter-', '');
      return (
        <div
          style={{
            width: `${size}px`,
            height: `${size}px`,
            color: color || '#E8A33D',
            backgroundColor: bgColor === 'transparent' ? 'transparent' : (bgColor || '#14110F'),
            borderColor: color || '#E8A33D'
          }}
          className="rounded-full border-2 flex items-center justify-center shadow-lg relative overflow-hidden select-none"
        >
          <div className="absolute top-1 left-1.5 w-1/3 h-1/3 bg-white/20 rounded-full blur-[1px] pointer-events-none" />
          <span style={{ color: color || '#E8A33D' }} className="font-kufi font-bold text-lg leading-none transform translate-y-[-1px]">
            {char}
          </span>
        </div>
      );
    }

    if (stickerId.startsWith('en-letter-')) {
      const char = stickerId.replace('en-letter-', '');
      return (
        <div
          style={{
            width: `${size}px`,
            height: `${size}px`,
            color: color || '#E8A33D',
            backgroundColor: bgColor === 'transparent' ? 'transparent' : (bgColor || '#14110F'),
            borderColor: color || '#E8A33D'
          }}
          className="rounded-full border-2 flex items-center justify-center shadow-lg relative overflow-hidden select-none"
        >
          <div className="absolute top-1 left-1.5 w-1/3 h-1/3 bg-white/20 rounded-full blur-[1px] pointer-events-none" />
          <span style={{ color: color || '#E8A33D' }} className="font-mono font-bold text-base leading-none">
            {char}
          </span>
        </div>
      );
    }

    if (stickerId.startsWith('num-')) {
      const val = stickerId.replace('num-', '');
      const isYear = val.length > 2;
      return (
        <div
          style={{
            minWidth: isYear ? `${size * 1.6}px` : `${size}px`,
            height: `${size}px`,
            paddingLeft: isYear ? '8px' : '0',
            paddingRight: isYear ? '8px' : '0',
            color: color || '#E8A33D',
            backgroundColor: bgColor === 'transparent' ? 'transparent' : (bgColor || '#14110F'),
            borderColor: color || '#E8A33D'
          }}
          className={`${
            isYear ? 'rounded-full px-3' : 'rounded-full'
          } border-2 flex items-center justify-center shadow-lg relative overflow-hidden select-none`}
        >
          <div className="absolute top-1 left-1.5 w-1/3 h-1/3 bg-white/20 rounded-full blur-[1px] pointer-events-none" />
          <span style={{ color: color || '#E8A33D' }} className="font-mono font-bold text-xs tracking-wider">
            {val}
          </span>
        </div>
      );
    }

    if (stickerId.startsWith('quote-')) {
      const qKey = stickerId.replace('quote-', '');
      const quotesMap = {
        'sahr': 'سَهَر',
        '0x-sun': '0X SUN',
        '12am': '12 AM',
        'nocturnal': 'NOCTURNAL',
        'passage': 'THE PASSAGE',
        'noor': 'نور'
      };
      const text = quotesMap[qKey] || qKey;
      const isAr = /[\u0600-\u06FF]/.test(text);

      return (
        <div
          style={{
            color: color || '#E8A33D',
            backgroundColor: bgColor === 'transparent' ? 'transparent' : (bgColor || '#14110F'),
            borderColor: color || '#E8A33D'
          }}
          className={`border-2 px-3.5 py-1.5 rounded-full shadow-md text-xs whitespace-nowrap select-none relative overflow-hidden ${isAr ? 'font-kufi' : 'font-mono uppercase tracking-widest'}`}
        >
          <div className="absolute top-0.5 left-2 w-1/4 h-1/2 bg-white/15 rounded-full blur-[1px] pointer-events-none" />
          {text}
        </div>
      );
    }
  }

  // Pure 3D Isolated Epoxy Domes (Zero Background Rectangle Box)
  switch (stickerId) {
    case 'st-born-dawn':
      return (
        <div
          style={{
            color: '#FFF8ED',
            background: 'linear-gradient(135deg, #B26214 0%, #6E3808 100%)',
            borderColor: 'rgba(245, 178, 85, 0.7)',
            boxShadow: '0 8px 18px rgba(178,98,20,0.45), inset 0 2px 5px rgba(255,255,255,0.45), inset 0 -2px 5px rgba(0,0,0,0.4)'
          }}
          className="font-serif italic font-medium px-4 py-1.5 rounded-full border text-xs sm:text-sm whitespace-nowrap select-none relative overflow-hidden flex items-center justify-center shadow-lg pointer-events-none"
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
            boxShadow: '0 8px 18px rgba(13,27,42,0.65), inset 0 2px 5px rgba(255,255,255,0.35), inset 0 -2px 5px rgba(0,0,0,0.5)'
          }}
          className="font-serif italic font-medium px-4 py-1.5 rounded-full border text-xs sm:text-sm whitespace-nowrap select-none relative overflow-hidden flex items-center justify-center shadow-lg pointer-events-none"
        >
          <div className="absolute top-0.5 left-2 w-2/5 h-1/2 bg-gradient-to-b from-white/35 to-transparent rounded-full blur-[0.5px] pointer-events-none" />
          through the night
        </div>
      );

    case 'st-crescent':
      return (
        <div
          style={{
            width: `${size || 44}px`,
            height: `${size || 44}px`,
            background: 'radial-gradient(circle at 35% 35%, #181D28 0%, #05060A 100%)',
            boxShadow: '0 8px 18px rgba(0,0,0,0.65), inset 0 2px 5px rgba(255,255,255,0.4)',
            borderColor: 'rgba(100, 110, 130, 0.5)'
          }}
          className="rounded-2xl border flex items-center justify-center relative overflow-hidden select-none shrink-0 shadow-lg pointer-events-none"
        >
          <div className="absolute top-1 left-1.5 w-1/3 h-1/3 bg-gradient-to-b from-white/40 to-transparent rounded-full blur-[0.5px] pointer-events-none" />
          <svg width={(size || 44) * 0.58} height={(size || 44) * 0.58} viewBox="0 0 24 24" fill="none">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="#E2DAC9" />
          </svg>
        </div>
      );

    case 'st-starry':
      return (
        <div
          style={{
            width: `${size || 44}px`,
            height: `${size || 44}px`,
            background: 'radial-gradient(circle at 35% 35%, #121929 0%, #04060C 100%)',
            boxShadow: '0 8px 18px rgba(0,0,0,0.65), inset 0 2px 5px rgba(255,255,255,0.4)',
            borderColor: 'rgba(100, 110, 130, 0.5)'
          }}
          className="rounded-2xl border flex items-center justify-center relative overflow-hidden select-none shrink-0 shadow-lg pointer-events-none"
        >
          <div className="absolute top-1 left-1.5 w-1/3 h-1/3 bg-gradient-to-b from-white/40 to-transparent rounded-full blur-[0.5px] pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:5px_5px] opacity-45" />
        </div>
      );

    case 'st-sun':
      return (
        <div
          style={{
            width: `${size || 44}px`,
            height: `${size || 44}px`,
            background: 'radial-gradient(circle at 35% 35%, #FBF8F1 0%, #E2DAC9 100%)',
            boxShadow: '0 8px 18px rgba(0,0,0,0.35), inset 0 2px 5px rgba(255,255,255,0.85)',
            borderColor: 'rgba(200, 190, 175, 0.7)'
          }}
          className="rounded-2xl border flex flex-col items-center justify-center relative overflow-hidden select-none shrink-0 p-1 shadow-lg pointer-events-none"
        >
          <div className="absolute top-1 left-1.5 w-1/3 h-1/3 bg-gradient-to-b from-white/70 to-transparent rounded-full blur-[0.5px] pointer-events-none" />
          <div className="w-4 h-4 rounded-full bg-[#C86B12] mb-0.5 shadow-sm" />
          <div className="w-5 h-0.5 bg-[#0F1424]" />
        </div>
      );

    case 'st-duat':
      return (
        <div
          style={{
            color: '#D89E46',
            background: 'linear-gradient(135deg, #2B1F18 0%, #0E0906 100%)',
            borderColor: 'rgba(232, 163, 61, 0.6)',
            boxShadow: '0 8px 18px rgba(0,0,0,0.65), inset 0 2px 5px rgba(255,255,255,0.3)'
          }}
          className="font-serif font-bold px-3.5 py-1 rounded-full border text-xs sm:text-sm tracking-widest uppercase whitespace-nowrap select-none relative overflow-hidden flex items-center justify-center shadow-lg pointer-events-none"
        >
          <div className="absolute top-0.5 left-2 w-1/3 h-1/2 bg-gradient-to-b from-white/25 to-transparent rounded-full blur-[0.5px] pointer-events-none" />
          DUAT
        </div>
      );

    default:
      return (
        <div
          style={{
            width: `${size}px`,
            height: `${size}px`,
            backgroundColor: bgColor || '#E8A33D'
          }}
          className="rounded-full shadow flex items-center justify-center"
        >
          <span className="font-mono text-xs font-bold text-void">DU</span>
        </div>
      );
  }
};
