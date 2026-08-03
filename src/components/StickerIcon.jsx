import React from 'react';

export const StickerIcon = ({ stickerId, size = 40, color, bgColor }) => {
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
          {/* Epoxy Dome Specular Highlight */}
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
          {/* Epoxy Dome Specular Highlight */}
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

  // Pre-existing Shapes and Slogan Pills
  switch (stickerId) {
    case 'disc':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="50" r="40" fill={fillColor} />
          <circle cx="42" cy="40" r="12" fill="white" opacity="0.25" />
        </svg>
      );

    case 'ring':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="50" r="40" stroke={strokeColor} strokeWidth="8" />
        </svg>
      );

    case 'crescent':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
          <path d="M50 10 A40 40 0 1 0 90 50 A30 30 0 1 1 50 10 Z" fill={fillColor} />
        </svg>
      );

    case 'star-4':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
          <path d="M50 5 L62 38 L95 50 L62 62 L50 95 L38 62 L5 50 L38 38 Z" fill={fillColor} />
        </svg>
      );

    case 'triangle':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
          <polygon points="50,10 90,85 10,85" stroke={strokeColor} strokeWidth="8" fill="none" />
        </svg>
      );

    case 'horizon':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
          <rect x="15" y="35" width="70" height="10" rx="5" fill={fillColor} />
          <rect x="15" y="55" width="70" height="10" rx="5" fill={fillColor} />
        </svg>
      );

    case 'lightning':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
          <polygon points="55,5 15,55 45,55 35,95 85,45 55,45" fill={fillColor} />
        </svg>
      );

    case 'arrow-up':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
          <path d="M50 10 L85 45 H62 V90 H38 V45 H15 Z" fill={fillColor} />
        </svg>
      );

    case 'spark':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
          <path d="M50 10 V90 M10 50 H90 M22 22 L78 78 M78 22 L22 78" stroke={strokeColor} strokeWidth="8" strokeLinecap="round" />
        </svg>
      );

    case 'plus':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
          <path d="M50 15 V85 M15 50 H85" stroke={strokeColor} strokeWidth="12" strokeLinecap="square" />
        </svg>
      );

    case 'concentric':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="50" r="42" stroke={strokeColor} strokeWidth="6" />
          <circle cx="50" cy="50" r="26" stroke={strokeColor} strokeWidth="6" />
          <circle cx="50" cy="50" r="10" fill={fillColor} />
        </svg>
      );

    case 'flame':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
          <path d="M50 10 C65 30 85 55 85 70 A35 35 0 0 1 15 70 C15 55 35 30 50 10 Z" fill={fillColor} />
        </svg>
      );

    case 'pill-tale3-noor':
      return (
        <div
          style={{
            color: color || '#050505',
            backgroundColor: bgColor === 'transparent' ? 'transparent' : (bgColor || '#E8A33D'),
            borderColor: color || '#E8A33D'
          }}
          className="font-kufi font-bold px-3.5 py-1.5 rounded-full border shadow-md text-xs whitespace-nowrap select-none"
        >
          طالع نور
        </div>
      );

    case 'pill-3addi-lel':
      return (
        <div
          style={{
            color: color || '#EDE4D3',
            backgroundColor: bgColor === 'transparent' ? 'transparent' : (bgColor || '#14110F'),
            borderColor: color || '#E8A33D'
          }}
          className="font-kufi font-bold px-3.5 py-1.5 rounded-full border shadow-md text-xs whitespace-nowrap select-none"
        >
          عدّي الليل
        </div>
      );

    case 'pill-bokra-ahla':
      return (
        <div
          style={{
            color: color || '#EDE4D3',
            backgroundColor: bgColor === 'transparent' ? 'transparent' : (bgColor || '#2E2823'),
            borderColor: color || '#E8A33D'
          }}
          className="font-kufi font-bold px-3.5 py-1.5 rounded-full border shadow-md text-xs whitespace-nowrap select-none"
        >
          بكرة أحلى
        </div>
      );

    case 'pill-born-dawn':
      return (
        <div
          style={{
            color: color || '#E8A33D',
            backgroundColor: bgColor === 'transparent' ? 'transparent' : (bgColor || '#050505'),
            borderColor: color || '#E8A33D'
          }}
          className="font-mono font-bold px-3 py-1 rounded-full border shadow-md text-[10px] tracking-widest uppercase whitespace-nowrap select-none"
        >
          BORN AT DAWN
        </div>
      );

    default:
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="50" r="40" fill={fillColor} />
        </svg>
      );
  }
};
