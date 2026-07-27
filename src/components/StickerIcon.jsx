import React from 'react';
import { SunDisc } from './SunDisc';

export const StickerIcon = ({ stickerId, size = 36 }) => {
  switch (stickerId) {
    case 'sun-disc':
    case 'dome-sun':
      return <SunDisc size={size} variant="gold" />;

    case 'eclipse':
      return <SunDisc size={size} variant="eclipse" />;

    case 'scarab':
    case 'dome-scarab':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="50" r="44" fill="#1C1917" stroke="#E8B04B" strokeWidth="4" />
          <path d="M35 50 C35 40 65 40 65 50 L60 75 C60 80 40 80 40 75 Z" fill="#E8B04B" />
          <circle cx="50" cy="36" r="10" fill="#E8B04B" />
        </svg>
      );

    case 'ankh':
    case 'dome-ankh':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="50" r="44" fill="#1C1917" stroke="#E8B04B" strokeWidth="4" />
          <ellipse cx="50" cy="38" rx="12" ry="16" stroke="#E8B04B" strokeWidth="6" fill="none" />
          <path d="M30 56 H70 M50 56 V84" stroke="#E8B04B" strokeWidth="6" strokeLinecap="square" />
        </svg>
      );

    case 'ember':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="50" r="44" fill="#2A1610" stroke="#E5493A" strokeWidth="4" />
          <circle cx="50" cy="50" r="18" fill="#E5493A" />
        </svg>
      );

    case 'ray':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="50" r="44" fill="#1C1917" stroke="#E8B04B" strokeWidth="4" />
          <polygon points="50,20 75,75 25,75" fill="#E8B04B" />
        </svg>
      );

    case 'eye-horus':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="50" r="44" fill="#1C1917" stroke="#E8B04B" strokeWidth="4" />
          <path d="M22 50 Q50 30 78 50 Q50 70 22 50 Z" stroke="#E8B04B" strokeWidth="4" fill="none" />
          <circle cx="50" cy="50" r="8" fill="#E8B04B" />
        </svg>
      );

    case 'feather':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="50" r="44" fill="#1C1917" stroke="#E8B04B" strokeWidth="4" />
          <path d="M50 20 Q70 40 50 82 Q30 40 50 20 Z" fill="#E8B04B" />
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

    case 'dome-palm':
      return (
        <div className="w-10 h-10 rounded-xl bg-bone border border-grave flex items-center justify-center shadow-md">
          <span className="font-kufi font-bold text-void text-xs">🌴</span>
        </div>
      );

    default:
      return <SunDisc size={size} variant="gold" />;
  }
};
