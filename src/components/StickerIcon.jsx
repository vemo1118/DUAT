import React from 'react';
import { SunDisc } from './SunDisc';

export const StickerIcon = ({ stickerId, size = 36 }) => {
  switch (stickerId) {
    case 'pill-tale3-noor':
      return (
        <div className="bg-gradient-to-r from-amber to-amber-deep text-night font-cairo font-extrabold px-3 py-1 rounded-full border border-bone/60 shadow-[0_4px_12px_rgba(232,163,61,0.4)] text-xs tracking-wide whitespace-nowrap select-none">
          طالع نور
        </div>
      );

    case 'pill-3addi-lel':
      return (
        <div className="bg-twilight text-bone font-cairo font-bold px-3 py-1 rounded-full border border-amber/50 shadow-lg text-xs tracking-wide whitespace-nowrap select-none">
          عدّي الليل
        </div>
      );

    case 'pill-bokra-ahla':
      return (
        <div className="bg-[#1E2A20] text-bone font-cairo font-bold px-3 py-1 rounded-full border border-bone/40 shadow-lg text-xs tracking-wide whitespace-nowrap select-none">
          بكرة أحلى
        </div>
      );

    case 'pill-lesa-badri':
      return (
        <div className="bg-rose text-night font-cairo font-extrabold px-3 py-1 rounded-full border border-bone/60 shadow-lg text-xs tracking-wide whitespace-nowrap select-none">
          لسه بدري عليك
        </div>
      );

    case 'pill-born-dawn':
      return (
        <div className="bg-night text-amber font-mono font-bold px-3 py-1 rounded-full border border-amber shadow-lg text-[10px] tracking-widest whitespace-nowrap select-none uppercase">
          BORN AT DAWN
        </div>
      );

    case 'pill-through-night':
      return (
        <div className="bg-indigo text-bone font-mono font-bold px-3 py-1 rounded-full border border-bone/30 shadow-lg text-[10px] tracking-widest whitespace-nowrap select-none uppercase">
          THROUGH THE NIGHT
        </div>
      );

    case 'dome-palm':
      return (
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-bone to-bone-dim border border-night/20 flex items-center justify-center shadow-lg relative overflow-hidden">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0A0C16" strokeWidth="2">
            <path d="M12 22V10M12 10C9 10 6 7 6 4M12 10C15 10 18 7 18 4M12 10C8 8 5 9 3 11M12 10C16 8 19 9 21 11" strokeLinecap="round" />
          </svg>
        </div>
      );

    case 'dome-horse':
      return (
        <div className="w-10 h-10 rounded-xl bg-night border-2 border-amber flex items-center justify-center shadow-lg">
          <span className="font-cairo font-extrabold text-amber text-sm">خيل</span>
        </div>
      );

    case 'scarab':
    case 'dome-scarab':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="50" r="44" fill="#161A32" stroke="#E8A33D" strokeWidth="4" />
          <circle cx="50" cy="36" r="10" fill="#E8A33D" />
          <path d="M35 50 C35 40 65 40 65 50 L60 75 C60 80 40 80 40 75 Z" fill="#E8A33D" />
          <path d="M35 48 C20 40 15 60 30 70 Z" fill="#E0917A" />
          <path d="M65 48 C80 40 85 60 70 70 Z" fill="#E0917A" />
        </svg>
      );

    case 'ankh':
    case 'dome-ankh':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="50" r="44" fill="#161A32" stroke="#E8A33D" strokeWidth="4" />
          <ellipse cx="50" cy="38" rx="12" ry="16" stroke="#E8A33D" strokeWidth="6" fill="none" />
          <path d="M30 56 H70 M50 56 V84" stroke="#E8A33D" strokeWidth="6" strokeLinecap="square" />
        </svg>
      );

    case 'sun-disc':
    case 'dome-sun':
    default:
      return <SunDisc size={size} variant="gold" />;
  }
};
