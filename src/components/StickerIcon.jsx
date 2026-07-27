import React from 'react';

export const StickerIcon = ({ stickerId, size = 36 }) => {
  const strokeColor = '#E0A93B';
  const fillColor = '#E0A93B';

  switch (stickerId) {
    case 'disc':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="50" r="40" fill={fillColor} />
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
        <div className="bg-gold text-void font-kufi font-bold px-3.5 py-1.5 rounded-full border border-bone shadow-md text-xs whitespace-nowrap select-none">
          طالع نور
        </div>
      );

    case 'pill-3addi-lel':
      return (
        <div className="bg-coal text-bone font-kufi font-bold px-3.5 py-1.5 rounded-full border border-gold shadow-md text-xs whitespace-nowrap select-none">
          عدّي الليل
        </div>
      );

    case 'pill-bokra-ahla':
      return (
        <div className="bg-stone text-bone font-kufi font-bold px-3.5 py-1.5 rounded-full border border-grave shadow-md text-xs whitespace-nowrap select-none">
          بكرة أحلى
        </div>
      );

    case 'pill-born-dawn':
      return (
        <div className="bg-void text-gold font-mono font-bold px-3 py-1 rounded-full border border-gold shadow-md text-[10px] tracking-widest uppercase whitespace-nowrap select-none">
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
