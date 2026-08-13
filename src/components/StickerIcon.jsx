import React from 'react';

// Natural canvas dimensions for each sticker type (pixels on the phone canvas)
// Pills are wide, domes are square
const CANVAS_DIMS = {
  'st-born-dawn':     { w: 130, h: 46 },
  'st-through-night': { w: 140, h: 46 },
  'st-crescent':      { w: 72,  h: 72 },
  'st-starry':        { w: 72,  h: 72 },
  'st-sun':           { w: 72,  h: 72 },
  'st-duat':          { w: 110, h: 46 },
};

const MadeInBadge = ({ label, size, forCanvas, variant }) => {
  const badgeSize = forCanvas ? 76 : Math.max(38, size);
  const isYear = variant === 'year';
  const labelLength = String(label).length;
  const labelScale = labelLength >= 8 ? 0.118 : labelLength >= 7 ? 0.135 : labelLength >= 6 ? 0.15 : 0.17;
  const background = isYear
    ? 'linear-gradient(145deg, #1A2747 0%, #0A1020 72%, #050810 100%)'
    : 'linear-gradient(145deg, #FFFDF7 0%, #F2EBDD 58%, #DDD1BC 100%)';
  const mainColor = isYear ? '#FFF8ED' : '#182744';
  const frameColor = isYear ? 'rgba(224,169,59,0.7)' : 'rgba(24,39,68,0.38)';

  return (
    <div
      style={{
        width: badgeSize,
        height: badgeSize,
        minWidth: badgeSize,
        minHeight: badgeSize,
        padding: Math.round(badgeSize * 0.12),
        borderRadius: Math.round(badgeSize * 0.22),
        background,
        borderColor: isYear ? 'rgba(224,169,59,0.78)' : 'rgba(255,255,255,0.95)',
        boxShadow: isYear
          ? '0 12px 28px rgba(0,0,0,0.42), inset 0 2px 5px rgba(255,255,255,0.2), inset 0 -3px 7px rgba(0,0,0,0.32)'
          : '0 12px 28px rgba(0,0,0,0.3), inset 0 3px 6px rgba(255,255,255,0.95), inset 0 -3px 7px rgba(67,48,25,0.16)'
      }}
      className="relative border-2 flex flex-col items-center justify-center overflow-hidden select-none shrink-0 pointer-events-none"
    >
      <div
        className="absolute pointer-events-none"
        style={{
          inset: Math.round(badgeSize * 0.07),
          border: `1px solid ${frameColor}`,
          borderRadius: Math.round(badgeSize * 0.15)
        }}
      />

      <div
        className="absolute left-[12%] right-[12%] top-[5%] h-[38%] rounded-[45%] pointer-events-none"
        style={{
          background: isYear
            ? 'linear-gradient(180deg, rgba(255,255,255,0.22), transparent)'
            : 'linear-gradient(180deg, rgba(255,255,255,0.96), rgba(255,255,255,0.05))',
          filter: 'blur(0.4px)'
        }}
      />

      <span
        style={{
          color: '#E0A93B',
          fontSize: Math.max(4, Math.round(badgeSize * 0.085)),
          letterSpacing: `${Math.max(1, badgeSize * 0.018)}px`
        }}
        className="relative z-10 font-mono font-black uppercase leading-none"
      >
        MADE IN
      </span>

      <span
        style={{
          color: mainColor,
          fontSize: Math.max(6, Math.round(badgeSize * labelScale)),
          whiteSpace: 'nowrap',
          textShadow: isYear ? '0 2px 3px rgba(0,0,0,0.42)' : '0 1px 1px rgba(255,255,255,0.75)'
        }}
        className="relative z-10 mt-[8%] max-w-full text-center font-clash font-black uppercase leading-[0.9] tracking-tight"
      >
        {label}
      </span>

      <div
        style={{ width: Math.round(badgeSize * 0.3), marginTop: Math.round(badgeSize * 0.08) }}
        className="relative z-10 h-[2px] bg-[#E0A93B] rounded-full"
      />

      <span
        style={{
          color: isYear ? 'rgba(255,248,237,0.62)' : 'rgba(24,39,68,0.58)',
          fontSize: Math.max(3, Math.round(badgeSize * 0.052)),
          letterSpacing: `${Math.max(0.7, badgeSize * 0.009)}px`,
          marginTop: Math.round(badgeSize * 0.055)
        }}
        className="relative z-10 font-mono font-bold uppercase leading-none"
      >
        DUAT · EGYPT
      </span>
    </div>
  );
};

export const StickerIcon = ({ stickerId, image, imageUrl, size = 48, color, bgColor, forCanvas = false }) => {
  const isArabicLetter = stickerId && (stickerId.startsWith('ar-letter-') || stickerId.startsWith('st-letter-'));
  const customImg = image || imageUrl;

  // ── Arabic Letter Square Dome ──────────────────────────────────────────────
  if (isArabicLetter) {
    const char = stickerId.replace(/^(ar-letter-|st-letter-)/, '');
    // Same size for both panel and canvas for visual consistency
    const boxSize = forCanvas ? 58 : size;
    const isTransparentBg = bgColor === 'transparent';

    // Default text color: white (#FFFFFF)
    const finalTextColor = color || '#FFFFFF';
    const finalBg = isTransparentBg
      ? 'transparent'
      : (bgColor && bgColor !== '#14110F' && bgColor !== '#0A0C16' && bgColor !== '#181E3B'
          ? bgColor
          : '#14110F');

    return (
      <div
        style={{
          width: boxSize,
          height: boxSize,
          background: finalBg,
          color: finalTextColor,
          boxShadow: isTransparentBg
            ? 'none'
            : '0 8px 18px rgba(0,0,0,0.22), inset 0 2px 4px rgba(255,255,255,1), inset 0 -2px 4px rgba(0,0,0,0.08)',
          borderColor: isTransparentBg ? 'transparent' : 'rgba(210, 200, 182, 0.85)'
        }}
        className="rounded-2xl border flex items-center justify-center relative overflow-hidden select-none shrink-0 pointer-events-none transition-transform"
      >
        {!isTransparentBg && (
          <div className="absolute top-1 left-2.5 right-2.5 h-1/2 bg-gradient-to-b from-white/90 to-transparent rounded-t-xl blur-[0.3px] pointer-events-none" />
        )}
        <span
          className="select-none leading-none transform translate-y-[-1px] font-camel"
          style={{
            fontSize: `${Math.round(boxSize * 0.60)}px`,
            fontFamily: "'The Year of The Camel', 'ArbFONTS-TheYearofTheCamel-ExtraBold', 'Arsenica Arabic', 'IBM Plex Sans Arabic', serif",
            fontWeight: 800,
            color: finalTextColor,
            textShadow: isTransparentBg ? 'none' : '0 0.5px 1px rgba(0,0,0,0.12)'
          }}
        >
          {char}
        </span>
      </div>
    );
  }

  // ── English Letter Square Dome ──────────────────────────────────────────────
  const isEnglishLetter = stickerId && (stickerId.startsWith('en-letter-') || stickerId.startsWith('st-en-letter-'));
  if (isEnglishLetter) {
    const char = stickerId.replace(/^(en-letter-|st-en-letter-)/, '').toUpperCase();
    const boxSize = forCanvas ? 58 : size;
    const isTransparentBg = bgColor === 'transparent';

    // Default: white background, navy text (as requested)
    const finalTextColor = color || '#182744';
    const finalBg = isTransparentBg
      ? 'transparent'
      : (bgColor && bgColor !== '#14110F' && bgColor !== '#0A0C16' && bgColor !== '#181E3B'
          ? bgColor
          : '#FFFFFF');

    return (
      <div
        style={{
          width: boxSize,
          height: boxSize,
          background: finalBg,
          color: finalTextColor,
          boxShadow: isTransparentBg
            ? 'none'
            : '0 8px 18px rgba(0,0,0,0.22), inset 0 2px 4px rgba(255,255,255,1), inset 0 -2px 4px rgba(0,0,0,0.08)',
          borderColor: isTransparentBg ? 'transparent' : 'rgba(210, 200, 182, 0.85)'
        }}
        className="rounded-2xl border flex items-center justify-center relative overflow-hidden select-none shrink-0 pointer-events-none transition-transform"
      >
        {!isTransparentBg && (
          <div className="absolute top-1 left-2.5 right-2.5 h-1/2 bg-gradient-to-b from-white/90 to-transparent rounded-t-xl blur-[0.3px] pointer-events-none" />
        )}
        <span
          className="font-arsenica font-bold select-none leading-none tracking-tight transform translate-y-[-0.5px]"
          style={{
            fontSize: `${Math.round(boxSize * 0.54)}px`,
            fontFamily: "'Arsenica Arabic', 'Arsenica-Arabic-Demibold-TRIAL', 'Cinzel', serif",
            fontWeight: 700,
            color: finalTextColor,
            textShadow: isTransparentBg ? 'none' : '0 0.5px 1px rgba(0,0,0,0.12)'
          }}
        >
          {char}
        </span>
      </div>
    );
  }

  // ── Year Badges — unified look for both panel and canvas ───────────────────
  const isYearBadge = stickerId && stickerId.startsWith('year-');
  if (isYearBadge) {
    const yearKey = stickerId.replace('year-', '');
    return (
      <MadeInBadge
        label={yearKey === '199x' ? '199X' : yearKey}
        size={size}
        forCanvas={forCanvas}
        variant="year"
      />
    );
  }

  // ── Month Badges — unified look for both panel and canvas ──────────────────
  const isMonthBadge = stickerId && stickerId.startsWith('month-');
  if (isMonthBadge) {
    if (customImg) {
      if (forCanvas) {
        const dims = CANVAS_DIMS[stickerId] || { w: 125, h: 42 };
        return (
          <img
            src={customImg}
            alt="Sticker"
            style={{ width: dims.w, height: dims.h, objectFit: 'contain', display: 'block' }}
            className="pointer-events-none select-none"
            draggable={false}
          />
        );
      }
      return (
        <img
          src={customImg}
          alt="Sticker"
          className="max-w-full max-h-full object-contain pointer-events-none select-none"
          style={{ display: 'block' }}
        />
      );
    }

    const monthMap = {
      jan: 'January', feb: 'February', mar: 'March', apr: 'April',
      may: 'May', jun: 'June', jul: 'July', aug: 'August',
      sep: 'September', oct: 'October', nov: 'November', dec: 'December'
    };
    const monthCode = stickerId.replace('month-', '');
    const monthFullName = monthMap[monthCode] || monthCode;

    return (
      <MadeInBadge
        label={monthFullName}
        size={size}
        forCanvas={forCanvas}
        variant="month"
      />
    );
  }

  if (customImg) {
    if (forCanvas) {
      // Fixed natural size on the phone canvas
      const dims = CANVAS_DIMS[stickerId] || { w: 90, h: 90 };
      return (
        <img
          src={customImg}
          alt="Sticker"
          style={{ width: dims.w, height: dims.h, objectFit: 'contain', display: 'block' }}
          className="pointer-events-none select-none"
          draggable={false}
        />
      );
    }

    // Selection panel: fill the container smoothly
    return (
      <img
        src={customImg}
        alt="Sticker"
        className="max-w-full max-h-full object-contain pointer-events-none select-none"
        style={{ display: 'block' }}
      />
    );
  }


  // ── Fallback synthetic domes (no image uploaded) ──────────────────────────
  switch (stickerId) {
    case 'st-born-dawn':
      return (
        <div
          style={{
            color: '#FFF8ED',
            background: 'linear-gradient(135deg, #B26214 0%, #6E3808 100%)',
            borderColor: 'rgba(245,178,85,0.7)',
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
            borderColor: 'rgba(50,80,120,0.7)',
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
          style={{ width: size, height: size, background: 'radial-gradient(circle at 35% 35%, #181D28 0%, #05060A 100%)', boxShadow: '0 8px 18px rgba(0,0,0,0.65)' }}
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
          style={{ color: '#D89E46', background: 'linear-gradient(135deg, #2B1F18 0%, #0E0906 100%)', borderColor: 'rgba(232,163,61,0.6)', boxShadow: '0 8px 18px rgba(0,0,0,0.65)' }}
          className="font-serif font-bold px-3.5 py-1 rounded-full border text-xs tracking-widest uppercase whitespace-nowrap select-none relative overflow-hidden flex items-center justify-center pointer-events-none min-w-[84px] min-h-[32px]"
        >
          DUAT
        </div>
      );
    default:
      return (
        <div style={{ width: size, height: size, backgroundColor: bgColor || '#E8A33D' }} className="rounded-full shadow flex items-center justify-center">
          <span className="font-mono text-xs font-bold">DU</span>
        </div>
      );
  }
};
