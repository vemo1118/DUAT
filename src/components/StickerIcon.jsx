import React from 'react';

export const StickerIcon = ({ stickerId, image, imageUrl, size = 44, color, bgColor }) => {
  const customImg = image || imageUrl;
  if (customImg && !customImg.includes('born_at_dawn_lrnbz6') && !customImg.includes('through_the_night_tuaiqp') && !customImg.includes('MOON_nogd7g') && !customImg.includes('STARS_dky4yc') && !customImg.includes('DUAT_SUN_mj2hid') && !customImg.includes('DUAT_TEXT_net8dw')) {
    return (
      <div
        className="w-full h-full flex items-center justify-center relative overflow-hidden select-none p-0.5"
      >
        <img
          src={customImg}
          alt="Sticker"
          className="max-w-full max-h-full object-contain drop-shadow-md transition-transform hover:scale-105 rounded-lg"
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
  }

  switch (stickerId) {
    case 'st-born-dawn':
      return (
        <div
          style={{
            color: '#FFF8ED',
            background: 'linear-gradient(135deg, #B26214 0%, #7A3F05 100%)',
            borderColor: '#E5A44B',
            boxShadow: '0 6px 14px rgba(178,98,20,0.5), inset 0 2px 4px rgba(255,255,255,0.4), inset 0 -2px 4px rgba(0,0,0,0.4)'
          }}
          className="font-serif italic font-medium px-4 py-1.5 rounded-full border border-amber-300/40 text-xs sm:text-sm whitespace-nowrap select-none relative overflow-hidden flex items-center justify-center shadow-lg cursor-pointer"
        >
          <div className="absolute top-0.5 left-2 w-2/5 h-1/2 bg-gradient-to-b from-white/35 to-transparent rounded-full blur-[0.5px] pointer-events-none" />
          born at dawn
        </div>
      );

    case 'st-through-night':
      return (
        <div
          style={{
            color: '#F0ECE1',
            background: 'linear-gradient(135deg, #0B192C 0%, #040A14 100%)',
            borderColor: '#243B55',
            boxShadow: '0 6px 14px rgba(11,25,44,0.7), inset 0 2px 4px rgba(255,255,255,0.3), inset 0 -2px 4px rgba(0,0,0,0.5)'
          }}
          className="font-serif italic font-medium px-4 py-1.5 rounded-full border border-blue-400/30 text-xs sm:text-sm whitespace-nowrap select-none relative overflow-hidden flex items-center justify-center shadow-lg cursor-pointer"
        >
          <div className="absolute top-0.5 left-2 w-2/5 h-1/2 bg-gradient-to-b from-white/30 to-transparent rounded-full blur-[0.5px] pointer-events-none" />
          through the night
        </div>
      );

    case 'st-crescent':
      return (
        <div
          style={{
            width: `${size || 44}px`,
            height: `${size || 44}px`,
            background: 'radial-gradient(circle at 30% 30%, #1A1F2B 0%, #07080D 100%)',
            boxShadow: '0 6px 14px rgba(0,0,0,0.6), inset 0 2px 4px rgba(255,255,255,0.35)'
          }}
          className="rounded-2xl border border-stone-600 flex items-center justify-center relative overflow-hidden select-none shrink-0 shadow-lg cursor-pointer"
        >
          <div className="absolute top-1 left-1.5 w-1/3 h-1/3 bg-gradient-to-b from-white/35 to-transparent rounded-full blur-[0.5px] pointer-events-none" />
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
            background: 'radial-gradient(circle at 30% 30%, #151D2F 0%, #050810 100%)',
            boxShadow: '0 6px 14px rgba(0,0,0,0.6), inset 0 2px 4px rgba(255,255,255,0.35)'
          }}
          className="rounded-2xl border border-stone-600 flex items-center justify-center relative overflow-hidden select-none shrink-0 shadow-lg cursor-pointer"
        >
          <div className="absolute top-1 left-1.5 w-1/3 h-1/3 bg-gradient-to-b from-white/35 to-transparent rounded-full blur-[0.5px] pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:5px_5px] opacity-40" />
        </div>
      );

    case 'st-sun':
      return (
        <div
          style={{
            width: `${size || 44}px`,
            height: `${size || 44}px`,
            background: 'radial-gradient(circle at 30% 30%, #FAF6EE 0%, #E4DDD0 100%)',
            boxShadow: '0 6px 14px rgba(0,0,0,0.35), inset 0 2px 4px rgba(255,255,255,0.8)'
          }}
          className="rounded-2xl border border-stone-300 flex flex-col items-center justify-center relative overflow-hidden select-none shrink-0 p-1 shadow-lg cursor-pointer"
        >
          <div className="absolute top-1 left-1.5 w-1/3 h-1/3 bg-gradient-to-b from-white/60 to-transparent rounded-full blur-[0.5px] pointer-events-none" />
          <div className="w-4 h-4 rounded-full bg-[#D97706] mb-0.5 shadow-sm" />
          <div className="w-5 h-0.5 bg-[#0A0C16]" />
        </div>
      );

    case 'st-duat':
      return (
        <div
          style={{
            color: '#E8A33D',
            background: 'linear-gradient(135deg, #2A1F18 0%, #100C09 100%)',
            borderColor: '#E8A33D',
            boxShadow: '0 6px 14px rgba(0,0,0,0.6), inset 0 2px 4px rgba(255,255,255,0.25)'
          }}
          className="font-serif font-bold px-3.5 py-1 rounded-full border border-gold/70 text-xs sm:text-sm tracking-widest uppercase whitespace-nowrap select-none relative overflow-hidden flex items-center justify-center shadow-lg cursor-pointer"
        >
          <div className="absolute top-0.5 left-2 w-1/3 h-1/2 bg-gradient-to-b from-white/20 to-transparent rounded-full blur-[0.5px] pointer-events-none" />
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
